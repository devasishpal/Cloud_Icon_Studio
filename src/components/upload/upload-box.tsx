'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  FileWarning,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { ACCEPTED_FORMATS, MAX_FILE_SIZE } from '@/lib/constants';
import { formatFileSize } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type { UploadStatus } from '@/types';

interface UploadBoxProps {
  onUpload: (file: File, dataUrl: string) => void;
}

export function UploadBox({ onUpload }: UploadBoxProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const simulateProgress = useCallback(() => {
    setProgress(0);
    setStatus('uploading');
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large. Max ${formatFileSize(MAX_FILE_SIZE)}.`);
        setStatus('idle');
        return;
      }

      const validTypes = Object.keys(ACCEPTED_FORMATS);
      if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpg|jpeg|webp|svg)$/i)) {
        setError('Unsupported file format.');
        setStatus('idle');
        return;
      }

      const progressInterval = simulateProgress();

      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 90));
        }
      };
      reader.onload = (e) => {
        clearInterval(progressInterval);
        setProgress(100);
        setStatus('processing');

        setTimeout(() => {
          const dataUrl = e.target?.result as string;
          setStatus('success');
          setTimeout(() => {
            onUpload(file, dataUrl);
          }, 400);
        }, 300);
      };
      reader.onerror = () => {
        clearInterval(progressInterval);
        setError('Failed to read file. Please try again.');
        setStatus('idle');
      };
      reader.readAsDataURL(file);
    },
    [onUpload, simulateProgress]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles: 1,
    multiple: false,
    onDragEnter: () => { if (status === 'idle') setStatus('dragging'); },
    onDragLeave: () => { if (status === 'dragging') setStatus('idle'); },
  });

  const statusConfig = {
    idle: { icon: Upload, color: 'text-primary bg-primary/10', title: 'Upload your icon' },
    dragging: { icon: Upload, color: 'text-accent-3 bg-accent-3/10', title: 'Drop your image here' },
    uploading: { icon: Loader2, color: 'text-blue-500 bg-blue-500/10', title: 'Uploading...' },
    processing: { icon: Loader2, color: 'text-yellow-500 bg-yellow-500/10', title: 'Processing...' },
    success: { icon: CheckCircle2, color: 'text-green-500 bg-green-500/10', title: 'Upload complete!' },
    error: { icon: AlertTriangle, color: 'text-red-500 bg-red-500/10', title: 'Upload failed' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const isProcessing = status === 'uploading' || status === 'processing';
  const wasSuccessful = status === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 md:p-12 text-center transition-all duration-300',
          isDragActive
            ? 'border-accent-3 bg-accent-3/5 scale-[1.02]'
            : wasSuccessful
              ? 'border-green-500/50 bg-green-500/5'
              : status === 'error'
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/30',
          isProcessing && 'pointer-events-none opacity-70'
        )}
      >
        <input {...getInputProps()} disabled={isProcessing || wasSuccessful} />

        <motion.div
          animate={
            isDragActive ? { scale: 1.15 }
            : isProcessing ? { rotate: 360 }
            : wasSuccessful ? { scale: [1, 1.2, 1] }
            : { scale: 1 }
          }
          transition={
            isProcessing
              ? { repeat: Infinity, duration: 2, ease: 'linear' }
              : wasSuccessful
                ? { duration: 0.5 }
                : {}
          }
          className={cn('mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl', config.color)}
        >
          <Icon className="size-7" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <h3 className="mb-2 text-lg font-semibold">
              {config.title}
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              {isDragActive
                ? 'Release to upload'
                : status === 'error'
                  ? 'Try again with a valid image'
                  : 'Drag & drop or click to browse'}
            </p>
          </motion.div>
        </AnimatePresence>

        {(status === 'uploading' || status === 'processing') && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            className="mb-6"
          >
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent-2"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </motion.div>
        )}

        {status === 'idle' && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 rounded-full border border-border/50 px-2.5 py-1">
              <ImageIcon className="size-3" />
              PNG
            </span>
            <span className="rounded-full border border-border/50 px-2.5 py-1">JPG</span>
            <span className="rounded-full border border-border/50 px-2.5 py-1">WEBP</span>
            <span className="rounded-full border border-border/50 px-2.5 py-1">SVG</span>
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground/60">
          Max file size: {formatFileSize(MAX_FILE_SIZE)}
        </p>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-4 flex items-center justify-center gap-1.5 text-sm text-destructive"
            >
              <FileWarning className="size-4" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
