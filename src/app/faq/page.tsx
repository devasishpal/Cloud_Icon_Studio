import type { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { ChevronDown, FileImage, Shield, Smartphone, Monitor, Globe, Palette, Download, Lock, Server, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ — Free App Icon Generator | CloudIcon Studio',
  description: 'Frequently asked questions about CloudIcon Studio. Learn about supported formats, privacy, platforms, export options, and more about our free app icon generator.',
  keywords: ['app icon generator FAQ', 'icon generator questions', 'app icon tool help', 'icon generator privacy', 'supported icon formats', 'icon export sizes', 'free icon generator', 'app icon maker FAQ'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.vercel.app/faq' },
  openGraph: {
    title: 'FAQ — Free App Icon Generator | CloudIcon Studio',
    description: 'Everything you need to know about CloudIcon Studio — supported formats, platforms, privacy, export options, and more.',
    url: 'https://cloudicon.vercel.app/faq',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio frequently asked questions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ — CloudIcon Studio',
    description: 'Frequently asked questions about the free app icon generator.',
    images: ['/og-image.png'],
  },
};

const categories = [
  {
    title: 'Getting Started',
    icon: FileImage,
    questions: [
      {
        q: 'What is CloudIcon Studio?',
        a: 'CloudIcon Studio is a completely free, browser-based app icon generator designed for developers, designers, and indie creators. You upload your artwork once — whether it is a logo, illustration, or any square design — and the tool instantly generates production-ready icon sets for Android, iOS, Web, and Desktop platforms. What sets CloudIcon Studio apart is its privacy-first architecture: every single operation, from image processing to ZIP generation, happens 100% client-side using your browser\'s Canvas API. Your images never leave your device, are never uploaded to any server, and are never stored anywhere. There are no accounts, no sign-ups, no data collection, and no hidden limits. You simply upload, customize with the built-in editing tools (crop, rotate, padding, backgrounds, shapes), preview your icon on realistic device mockups, and download a complete structured ZIP archive with every required icon size and format for all platforms.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'Not at all. CloudIcon Studio requires zero account creation, no email registration, no social login, and no personal information whatsoever. You can start generating icons the moment you land on the page. This is by design — we believe a tool that respects your privacy should not ask for anything in return. Just upload your image, customize it using the editing controls in the left panel, preview it on device mockups in the right panel, and download your complete icon pack. No barriers, no friction, and definitely no spam.',
      },
      {
        q: 'Is it really free?',
        a: 'Yes, CloudIcon Studio is 100% free with absolutely no catches. There are no paid tiers, no premium features locked behind a paywall, no credit card required, no usage limits, no watermark on your exported icons, and no upsells or upgrade prompts. Every single feature — including all export sizes for all platforms, adaptive icon generation, real-time device previews, keyboard shortcuts, undo/redo, and PWA offline support — is available at no cost. You can use it for personal projects, commercial apps, client work, or anything else without any restrictions or attribution requirements. We built this tool because we needed it ourselves and believe great design tools should be accessible to everyone.',
      },
      {
        q: 'What file formats can I upload?',
        a: 'CloudIcon Studio accepts PNG, JPG, WEBP, and SVG file formats. For optimal results, we recommend uploading a square image with at least 1024×1024 pixels resolution and a transparent background (PNG or SVG with transparency). Higher source resolution produces better downscaled icons across all the various sizes, as the browser\'s Canvas API handles the resampling with high-quality algorithms. SVG files are rasterized during processing, so vector sharpness is maintained. There is no file size limit imposed by the tool, though very large images (above 4096×4096 pixels) may be limited by your device\'s available memory since everything runs locally in your browser.',
      },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    questions: [
      {
        q: 'Are my images uploaded to a server?',
        a: 'No, absolutely not. This is the core architectural principle of CloudIcon Studio: everything runs entirely in your browser using the HTML Canvas API and Fabric.js library. When you select an image file, it is read into your browser\'s memory using the FileReader API and processed locally using the Canvas 2D rendering context. Your image data is never transmitted over the network, never stored on any server, never logged, never cached remotely, and never accessible to anyone but you. There are no backend servers processing your images, no cloud storage buckets receiving your files, and no third-party APIs processing your data. This architecture is not an add-on or a feature toggle — it is fundamental to how the application is built. Even the ZIP file containing your exported icons is generated entirely in your browser using the JSZip library running client-side.',
      },
      {
        q: 'Do you collect any data?',
        a: 'CloudIcon Studio does not collect any personal data. There are no analytics scripts, tracking pixels, session recorders, heatmaps, or third-party embeds. Your theme preference and cookie-consent choice are stored in localStorage, and your editor artwork plus undo history are stored in IndexedDB on your device. This data never leaves your browser and is cleared when you clear site data. No tracking cookies are used for advertising, analytics, or profiling.',
      },
      {
        q: 'Is CloudIcon Studio GDPR and CCPA compliant?',
        a: 'Yes, CloudIcon Studio is fully compliant with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other international privacy regulations. Because the application processes all data entirely client-side in your browser and does not collect, store, or transmit any personal information, there is simply no personal data for us to process, sell, or share. We do not have a database of users, we do not have server logs containing IP addresses, we do not use analytics cookies, and we do not embed any third-party services that might collect data on our behalf. For detailed information about our privacy practices, please refer to our dedicated Privacy Policy, GDPR Compliance, and CCPA Compliance pages, which provide comprehensive legal disclosures about our data handling practices — or rather, the absence thereof.',
      },
    ],
  },
  {
    title: 'Platform Support',
    icon: Smartphone,
    questions: [
      {
        q: 'What platforms are supported?',
        a: 'CloudIcon Studio generates complete production-ready icon sets for four major platforms. For Android, we produce mipmap icons at all standard densities (mdpi through xxxhdpi), full adaptive icon sets with separate foreground and background layers plus monochrome layer for Android 13+, and Play Store listing images. For iOS, we generate every Apple-required icon size from Notification (20×20) through App Store (1024×1024), including iPhone, iPad, Spotlight, Settings, and all @2x/@3x variants with a properly formatted Contents.json file. For Web, we create a complete favicon set across all standard sizes, apple-touch-icons for iOS Safari, PWA manifest icons, Windows tile images, and browser configuration files. For Desktop, we output Windows ICO files with multiple resolutions, macOS ICNS files with all Apple-standard display sizes, and Linux launcher icons. All of this comes from a single source upload — you do not need to manually resize or reformat anything.',
      },
      {
        q: 'What Android icon sizes do you generate?',
        a: 'For Android, CloudIcon Studio generates launcher and round icons at ldpi (36×36), mdpi (48×48), hdpi (72×72), xhdpi (96×96), xxhdpi (144×144), and xxxhdpi (192×192). Adaptive icons include separate foreground layers at 108–432px and a background layer at 432px, plus a monochrome layer for Android 13+ themed icons. Notification icons are generated from 18×18 to 96×96, and a 512×512 Play Store icon is included. The ZIP contains the correct mipmap/drawable directories plus adaptive-icon XML and the background colour resource.',
      },
      {
        q: 'What iOS icon sizes do you generate?',
        a: 'CloudIcon Studio generates 19 AppIcon PNGs covering the modern Apple asset catalog: 20×20@2x/@3x, 29×29@1x/@2x/@3x, 40×40@2x/@3x, 60×60@2x/@3x, iPad 20×20@1x/@2x, 29×29@1x/@2x, 40×40@1x/@2x, 76×76@1x/@2x, 83.5×83.5@2x, and the mandatory 1024×1024 App Store icon. A correctly formatted Contents.json is included, so the AppIcon.appiconset folder can be imported directly into Xcode.',
      },
      {
        q: 'Do you support adaptive icons?',
        a: 'Yes, CloudIcon Studio provides comprehensive support for Android adaptive icons (introduced in Android 8.0/Oreo API level 26). We generate separate foreground and background layers at all screen densities, which Android\'s launcher then composites using the device\'s selected icon mask (which varies by manufacturer — squircle on Pixel, circle on some Samsung devices, teardrop on OnePlus, etc.). Our editor includes a safe area overlay that marks the guaranteed visible zone (the inner ~66% of the icon), ensuring your critical design elements — your logo, text, or key visual — remain visible regardless of which device mask is applied. We also support the monochrome adaptive icon layer introduced in Android 13, which allows the system to generate themed icons that match the user\'s wallpaper and color scheme.',
      },
      {
        q: 'Can I generate favicons for my website?',
        a: 'Yes. The web package includes 16×16, 32×32, and 48×48 PNG favicons; a 180×180 apple-touch-icon; 192×192 and 512×512 PWA icons; a 512×512 maskable icon with safe-zone padding; a 150×150 Windows tile; a multi-resolution favicon.ico containing 16, 32, 48, and 64px images; a Safari pinned-tab SVG; site.webmanifest; and browserconfig.xml. Everything is organized in the web/ folder inside the export ZIP.',
      },
    ],
  },
  {
    title: 'Editing & Customization',
    icon: Palette,
    questions: [
      {
        q: 'Can I customize the background?',
        a: 'Yes, CloudIcon Studio offers three background options for your icons. You can choose a solid color picked from a color picker with full hex code support, a linear gradient with customizable angle and color stops, or keep the background transparent. The background setting is particularly important because different platforms have different requirements — iOS icons always have a background (Apple does not support transparency for app icons), Android launcher icons typically have a background, while adaptive icons use separate foreground and background layers. The background preview updates in real time so you can see exactly how your icon will look on each platform. The background tool also supports adjusting padding between your artwork and the icon edge, ensuring your design has proper breathing room.',
      },
      {
        q: 'What icon shapes are available?',
        a: 'CloudIcon Studio supports four distinct icon shapes that correspond to real-world platform masking requirements. The Circle shape applies a circular mask, commonly seen on some Android launchers and smartwatch icons. The Squircle (square-circle hybrid) shape is used by Google Pixel devices and many modern Android launchers as their default adaptive icon mask. The Rounded Square shape with adjustable corner radius is the standard for iOS app icons and many web platforms. The Teardrop shape mimics the OnePlus and OxygenOS adaptive icon mask. Each shape previews immediately on the device mockups so you can see how your icon will appear with the platform-specific masking applied. The shape selection affects all platform exports simultaneously, ensuring consistency across your entire icon set.',
      },
      {
        q: 'Can I crop and rotate my icon?',
        a: 'Absolutely. CloudIcon Studio includes a comprehensive set of image adjustment tools. The Crop tool lets you trim unwanted edges from your source image with an aspect-ratio lock option to maintain square proportions — essential for icon design where square source images produce the best results. The Rotate tool provides fine-grained rotation control in degree increments, allowing you to tilt logos or artwork for better visual balance within the icon frame. The Padding tool adjusts the inner spacing between your artwork and the icon edge, with live percentage-based control that shows you exactly how much breathing room your design has. All adjustments are non-destructive and update in real time on the preview mockups — there is no apply button to click and no waiting for renders. Combined with the undo/redo system, you can experiment freely without worrying about losing your original design.',
      },
      {
        q: 'Is there an undo/redo feature?',
        a: 'Yes, CloudIcon Studio features a full undo/redo system that tracks your editing history throughout the session. You can undo changes using Ctrl+Z (or Cmd+Z on Mac) and redo using Ctrl+Shift+Z or Ctrl+Y (Cmd+Shift+Z on Mac). The undo history covers all editing actions including rotation changes, background modifications, padding adjustments, crop operations, and shape selections. This means you can experiment freely with different settings — try a bold background color, rotate your icon 15 degrees, apply a squircle mask — and if you do not like the result, simply step back through your changes. The undo history is maintained for your current session and is reset when you upload a new image or reload the page.',
      },
      {
        q: 'Can I preview my icon on real devices?',
        a: 'Yes, one of CloudIcon Studio\'s most powerful features is its real-time preview system. The right panel displays your icon on realistic, detailed device mockups that accurately reflect how your icon will appear on actual hardware. You can switch between Android (showing the Pixel/stock Android launcher), iOS (showing the iPhone home screen), Web (showing a PWA icon on a browser home screen), and Desktop (showing the icon in a macOS dock or Windows taskbar). Each mockup accurately simulates the platform-specific icon mask, safe zone, shadow, and rendering quirks. The preview updates live and instantly as you make any adjustment — there is no lag, no refresh button, and no waiting. You can zoom in to inspect fine details at pixel level, toggle a grid overlay for alignment checking, and switch between dark and light mode to verify your icon looks great in both contexts.',
      },
    ],
  },
  {
    title: 'Export & Download',
    icon: Download,
    questions: [
      {
        q: 'What export format is used?',
        a: 'Individual icons are exported as 32-bit RGBA PNGs so transparency is preserved where the platform allows it. Platform-specific binary formats (ICO and ICNS), text manifests (site.webmanifest, browserconfig.xml), adaptive-icon XML, and iOS Contents.json are generated too. JSZip packages everything into one structured ZIP archive in your browser. Top-level folders are android/, iOS/, web/, pwa/, desktop/, splash/, and social/ when those presets are included.',
      },
      {
        q: 'Do you generate ICO or ICNS files?',
        a: 'Yes. The Windows app.ico contains 16, 24, 32, 48, 64, 128, and 256px images, and separate PNG tiles are included at those sizes plus 150px. The macOS app.icns contains 16, 32, 64, 128, 256, 512, and 1024px representations. Linux hicolor PNGs are generated at 16, 32, 48, 64, 128, 256, and 512px.',
      },
      {
        q: 'How is the ZIP file organized?',
        a: 'The ZIP mirrors the folder structure your project expects. android/ contains mipmap-ldpi through mipmap-xxxhdpi, drawable-* notification icons, mipmap-anydpi-v26 and mipmap-anydpi-v33 adaptive-icon XML, background/monochrome layers, and Play Store artwork. iOS/AppIcon.appiconset contains all 19 PNGs plus Contents.json, ready to import into Xcode. web/ contains favicons, apple-touch-icon, PWA and maskable icons, favicon.ico, Safari SVG, site.webmanifest, and browserconfig.xml. desktop/ separates Windows, macOS, and Linux assets. Optional splash/ and social/ folders contain launch screens and social cards.',
      },
      {
        q: 'Can I export multiple times?',
        a: 'Yes, you can export your icon pack as many times as you like, completely free and without any limitations. Each time you click the export button, a fresh ZIP archive is generated with your current editor settings — including any changes you have made to rotation, background, padding, cropping, or shape since your last export. This is particularly useful when iterating on a design: you can adjust settings, export, review the icons, make further adjustments, and export again until every detail is perfect. Since the ZIP archive is generated entirely in your browser, there is no server round-trip and no waiting time. The export is instantaneous regardless of how many times you do it. Your original image and editing settings persist in the editor until you upload a new image or close the page.',
      },
    ],
  },
  {
    title: 'Technical Questions',
    icon: Monitor,
    questions: [
      {
        q: 'What browsers are supported?',
        a: 'CloudIcon Studio works in current Chrome, Edge, Firefox, and Safari 15+ on desktop and mobile, including Brave, Opera, and Samsung Internet. It requires JavaScript, the Canvas 2D API, WebAssembly (for U2Net background removal), and IndexedDB (for session persistence). Internet Explorer is not supported. Chrome and Edge generally offer the fastest large-image and AI performance.',
      },
      {
        q: 'Does it work offline?',
        a: 'Yes, in production the app is a Progressive Web App. After the app shell and the U2Net model have been cached by the service worker, you can upload, edit, preview, remove backgrounds, and export ZIP files without a network connection. The model is cached the first time you use AI removal. There is no install popup; you can optionally use your browser menu’s “Install” or “Add to Home Screen” action to open CloudIcon in a standalone window.',
      },
      {
        q: 'Is there a file size limit?',
        a: 'The upload limit is 25 MB per image. Large bitmaps are downscaled to a 2048px long edge before editing, which keeps rendering and export fast on phones and laptops while still producing crisp 1024px App Store and ICNS assets. For best results, use a square source of 1024×1024 or larger. SVG uploads are rasterized automatically.',
      },
      {
        q: 'What technology powers CloudIcon Studio?',
        a: 'CloudIcon Studio uses Next.js 16 and React 19 with the App Router. A single shared Canvas 2D renderer powers the editor, previews, and exports. State is managed with Zustand 5 plus zundo for undo/redo, and editor sessions persist in IndexedDB. U2Net background removal runs locally through onnxruntime-web and WebAssembly. JSZip creates archives in the browser, while custom encoders produce ICO and ICNS files. Framer Motion handles animation, Tailwind CSS 4 provides styling, and a production service worker caches the app shell and model for offline use. No image-processing request is sent to a server.',
      },
    ],
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://cloudicon.vercel.app/faq#faq',
  mainEntity: categories.flatMap(cat =>
    cat.questions.map(q => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a },
    }))
  ),
};

export default function FAQPage() {
  return (
    <PageLayout>
    <script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <FileImage className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-sm text-muted-foreground">Everything you need to know about CloudIcon Studio</p>
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      <div className="space-y-10">
        {categories.map((category) => (
          <div key={category.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/5">
                <category.icon className="size-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">{category.title}</h2>
            </div>
            <div className="space-y-2">
              {category.questions.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-border/50 bg-card/20 [&[open]]:bg-card/30 transition-all"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-sm font-medium hover:text-foreground transition-colors list-none">
                    <span>{item.q}</span>
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
        <h2 className="font-semibold mb-2">Still have questions?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          We are happy to help. Reach out to our team and we will get back to you within 24 hours.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Contact Us
        </Link>
      </div>
    </main>
    </PageLayout>
  );
}
