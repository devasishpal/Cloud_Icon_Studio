'use client';

import { loadImageElement } from '@/lib/render';

/**
 * Browser-side U2Net (U2NetP) background removal.
 *
 * The model and the ONNX Runtime WASM binary are served from /public, so the
 * whole operation works offline after the first load. No image ever leaves the
 * browser.
 */
const MODEL_URL = '/models/u2netp.onnx';
const INPUT_SIZE = 320;

type OrtModule = typeof import('onnxruntime-web/wasm');
type OrtSession = import('onnxruntime-web/wasm').InferenceSession;

let ortPromise: Promise<OrtModule> | null = null;
let sessionPromise: Promise<OrtSession> | null = null;

export type AiStage = 'model' | 'inference';

export interface RemoveBackgroundAiOptions {
  onProgress?: (progress: number, stage: AiStage) => void;
}

function loadOrt(): Promise<OrtModule> {
  if (!ortPromise) {
    ortPromise = import('onnxruntime-web/wasm')
      .then((ort) => {
        // Serve the runtime from our own origin (public/ort) instead of a CDN.
        ort.env.wasm.wasmPaths = '/ort/';
        // Single-threaded WASM works without cross-origin isolation headers.
        ort.env.wasm.numThreads = 1;
        ort.env.wasm.simd = true;
        ort.env.logLevel = 'error';
        return ort;
      })
      .catch((error) => {
        ortPromise = null;
        throw error;
      });
  }
  return ortPromise;
}

async function downloadModel(onProgress?: (progress: number) => void): Promise<Uint8Array> {
  const response = await fetch(MODEL_URL, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`Could not download the AI model (HTTP ${response.status}).`);
  }
  const total = Number(response.headers.get('content-length')) || 0;

  if (!response.body) {
    const buffer = new Uint8Array(await response.arrayBuffer());
    onProgress?.(1);
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.byteLength;
      if (total > 0) onProgress?.(Math.min(0.99, received / total));
    }
  }

  const buffer = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  onProgress?.(1);
  return buffer;
}

async function getSession(onProgress?: (progress: number) => void): Promise<OrtSession> {
  if (sessionPromise) return sessionPromise;

  sessionPromise = (async () => {
    const ort = await loadOrt();
    const model = await downloadModel(onProgress);
    return ort.InferenceSession.create(model, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    });
  })().catch((error) => {
    sessionPromise = null;
    throw error;
  });

  return sessionPromise;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};

/**
 * Returns a PNG data URL with the detected subject kept and everything else
 * made transparent.
 */
export async function removeBackgroundAi(
  dataUrl: string,
  options: RemoveBackgroundAiOptions = {}
): Promise<string> {
  const { onProgress } = options;
  const ort = await loadOrt();
  const session = await getSession((progress) => onProgress?.(progress, 'model'));

  const img = await loadImageElement(dataUrl);
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width || !height) throw new Error('Could not read the image dimensions.');

  // ---- Preprocess: 320x320 RGB, ImageNet normalisation -----------------
  const inputCanvas = document.createElement('canvas');
  inputCanvas.width = INPUT_SIZE;
  inputCanvas.height = INPUT_SIZE;
  const inputCtx = inputCanvas.getContext('2d', { willReadFrequently: true });
  if (!inputCtx) throw new Error('Canvas is not available in this browser.');
  inputCtx.drawImage(img, 0, 0, INPUT_SIZE, INPUT_SIZE);
  const pixels = inputCtx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE).data;

  const area = INPUT_SIZE * INPUT_SIZE;
  const input = new Float32Array(area * 3);
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];

  for (let i = 0; i < area; i++) {
    const r = pixels[i * 4] / 255;
    const g = pixels[i * 4 + 1] / 255;
    const b = pixels[i * 4 + 2] / 255;
    input[i] = (r - mean[0]) / std[0];
    input[area + i] = (g - mean[1]) / std[1];
    input[area * 2 + i] = (b - mean[2]) / std[2];
  }

  onProgress?.(0, 'inference');
  const tensor = new ort.Tensor('float32', input, [1, 3, INPUT_SIZE, INPUT_SIZE]);
  const feeds: Record<string, import('onnxruntime-web/wasm').Tensor> = {
    [session.inputNames[0]]: tensor,
  };
  const outputs = await session.run(feeds);
  const output = outputs[session.outputNames[0]];
  if (!output) throw new Error('The AI model returned no mask.');

  const raw = output.data as Float32Array;
  if (raw.length < area) throw new Error('The AI model returned an invalid mask.');

  // U2Net exports differ: some include the sigmoid, some return logits.
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < area; i++) {
    const value = raw[i];
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const needsSigmoid = min < -0.05 || max > 1.05;

  let outMin = Infinity;
  let outMax = -Infinity;
  for (let i = 0; i < area; i++) {
    const value = needsSigmoid ? 1 / (1 + Math.exp(-raw[i])) : raw[i];
    if (value < outMin) outMin = value;
    if (value > outMax) outMax = value;
  }
  const range = outMax - outMin || 1;

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = INPUT_SIZE;
  maskCanvas.height = INPUT_SIZE;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) throw new Error('Canvas is not available in this browser.');
  const maskImage = maskCtx.createImageData(INPUT_SIZE, INPUT_SIZE);

  for (let i = 0; i < area; i++) {
    const value = needsSigmoid ? 1 / (1 + Math.exp(-raw[i])) : raw[i];
    const normalised = (value - outMin) / range;
    // Slight contrast curve removes low-confidence haze while keeping soft
    // hair/fur edges. Values below ~0.12 become fully transparent.
    const alpha = smoothstep((normalised - 0.12) / 0.76) * 255;
    const offset = i * 4;
    maskImage.data[offset] = 255;
    maskImage.data[offset + 1] = 255;
    maskImage.data[offset + 2] = 255;
    maskImage.data[offset + 3] = alpha;
  }
  maskCtx.putImageData(maskImage, 0, 0);

  // ---- Postprocess: scale the mask to the source and multiply alpha ----
  const maskScaled = document.createElement('canvas');
  maskScaled.width = width;
  maskScaled.height = height;
  const maskScaledCtx = maskScaled.getContext('2d', { willReadFrequently: true });
  if (!maskScaledCtx) throw new Error('Canvas is not available in this browser.');
  maskScaledCtx.imageSmoothingEnabled = true;
  maskScaledCtx.imageSmoothingQuality = 'high';
  try {
    maskScaledCtx.filter = 'blur(0.6px)';
  } catch {
    // Older browsers ignore canvas filters.
  }
  maskScaledCtx.drawImage(maskCanvas, 0, 0, width, height);

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const outputCtx = outputCanvas.getContext('2d', { willReadFrequently: true });
  if (!outputCtx) throw new Error('Canvas is not available in this browser.');
  outputCtx.drawImage(img, 0, 0);

  const imageData = outputCtx.getImageData(0, 0, width, height);
  const maskData = maskScaledCtx.getImageData(0, 0, width, height).data;
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 3] = Math.round(
      (imageData.data[i + 3] * maskData[i + 3]) / 255
    );
  }
  outputCtx.putImageData(imageData, 0, 0);

  onProgress?.(1, 'inference');
  return outputCanvas.toDataURL('image/png');
}

/** Warm the model cache without running inference (used by the UI). */
export function preloadBackgroundModel(onProgress?: (progress: number) => void): Promise<void> {
  return getSession(onProgress).then(() => undefined);
}
