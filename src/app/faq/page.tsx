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
        a: 'CloudIcon Studio does not collect any personal data whatsoever. We have intentionally chosen not to include analytics scripts, tracking pixels, session recording tools, heatmaps, or any third-party embeds that could collect information about you or your usage. The only data that persists locally in your browser is your theme preference (light or dark mode) and your editor state (like undo/redo history for your current session), stored via the browser\'s localStorage API. This data never leaves your device and is automatically cleared if you clear your browser data. We do not use cookies for tracking, advertising, or analytics purposes. Our approach to privacy is not about compliance checkboxes — it is a fundamental design decision that respects your right to use creative tools without surveillance.',
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
        a: 'For Android, CloudIcon Studio generates the complete range of launcher icons required by the platform: mdpi (48×48 pixels), hdpi (72×72), xhdpi (96×96), xxhdpi (144×144), and xxxhdpi (192×192). Beyond launcher icons, we also produce full adaptive icon sets with separate foreground and background layers at all densities — these are the icons used on Android 8.0+ devices that support dynamic masking and theming. We generate monochrome adaptive icons for Android 13+ theming support. Additionally, Play Store listing icons are generated at 512×512 pixels. All icons are properly named following Android conventions and organized in the correct mipmap directory structure (mipmap-mdpi/, mipmap-hdpi/, etc.) within the exported ZIP archive.',
      },
      {
        q: 'What iOS icon sizes do you generate?',
        a: 'CloudIcon Studio generates every Apple-required icon size for modern iOS app development. This includes Navigation/Notification icons (20×20, 40×40@2x, 60×60@3x), Settings icons (29×29, 58×58@2x, 87×87@3x), Spotlight icons (40×40, 80×80@2x, 120×120@3x), iPhone app icons (60×60, 120×60@2x, 180×60@3x), iPad app icons (76×76, 152×76@2x), iPad Pro icons (167×76@2x), and the mandatory App Store icon (1024×1024). Each icon is accompanied by a properly formatted Contents.json file following Apple\'s asset catalog conventions, so you can drop the entire Assets.xcassets folder directly into your Xcode project without additional configuration.',
      },
      {
        q: 'Do you support adaptive icons?',
        a: 'Yes, CloudIcon Studio provides comprehensive support for Android adaptive icons (introduced in Android 8.0/Oreo API level 26). We generate separate foreground and background layers at all screen densities, which Android\'s launcher then composites using the device\'s selected icon mask (which varies by manufacturer — squircle on Pixel, circle on some Samsung devices, teardrop on OnePlus, etc.). Our editor includes a safe area overlay that marks the guaranteed visible zone (the inner ~66% of the icon), ensuring your critical design elements — your logo, text, or key visual — remain visible regardless of which device mask is applied. We also support the monochrome adaptive icon layer introduced in Android 13, which allows the system to generate themed icons that match the user\'s wallpaper and color scheme.',
      },
      {
        q: 'Can I generate favicons for my website?',
        a: 'Yes, CloudIcon Studio generates a comprehensive web icon package suitable for any modern website. The export includes standard favicons at 16×16, 32×32, 48×48, and 64×64 pixels for browser tabs and bookmarks. For modern PWA (Progressive Web App) support, we generate icons at 192×192 and 512×512 pixels with proper sizing for manifest.json integration. Apple-specific icons are included as apple-touch-icon at 180×180 pixels for iOS Safari web clip/bookmark support. We also generate a Windows tile icon, browserconfig.xml for Internet Explorer/Edge pinning, and a mask-icon SVG for Safari pinned tabs. All web icons are optimized as PNG files (and ICO for the favicon where needed) and organized in a dedicated web/ folder within your export ZIP.',
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
        a: 'All individual icon files are exported as PNG images with 32-bit color depth (RGBA) to preserve transparency where applicable. The icons are then packaged into a single structured ZIP archive using client-side JSZip library — everything happens in your browser with no server involvement. The ZIP archive follows a logical folder hierarchy: each supported platform gets its own top-level folder (android/, ios/, web/, desktop/), and inside each folder, the icons are named according to that platform\'s conventions. For example, Android icons follow the ic_launcher naming pattern and are placed in density-specific subdirectories, iOS icons follow the Apple naming convention with @2x/@3x suffixes, and web icons use standard favicon filename conventions. The archive also includes a Contents.json file for iOS asset catalogs where required.',
      },
      {
        q: 'Do you generate ICO or ICNS files?',
        a: 'Yes, for Desktop platform exports, CloudIcon Studio generates both Windows ICO files and macOS ICNS files. The Windows ICO file contains multiple icon resolutions embedded in a single file (16×16, 32×32, 48×48, and 256×256) as required by Windows for taskbar icons, file explorer thumbnails, and application shortcuts. The macOS ICNS file follows Apple\'s Icon Image format specification and includes all required display sizes (16×16, 32×32, 64×64@2x, 128×128, 256×256, 512×512, and 1024×1024@2x) for crisp rendering on both standard and Retina displays. These are generated alongside standard PNG versions for Linux and other desktop environments.',
      },
      {
        q: 'How is the ZIP file organized?',
        a: 'The exported ZIP archive is designed with developer workflow in mind — it mirrors the folder structure your project expects. The android/ folder contains density-specific subdirectories (mipmap-mdpi/ through mipmap-xxxhdpi/) plus an adaptive-icon/ subfolder with foreground and background layers, making it easy to copy directly into your Android Studio project\'s res/ directory. The ios/ folder contains a fully configured Assets.xcassets/AppIcon.appiconset/ directory with properly named icon files and a Contents.json manifest, ready to import into Xcode. The web/ folder contains all favicon sizes, PWA icons, and apple-touch-icons at the root level for easy placement in your website\'s public/ directory. The desktop/ folder contains Windows ICO, macOS ICNS, and Linux PNG files organized by platform subfolders. This structure eliminates the need to manually sort, rename, or organize icons after export.',
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
        a: 'CloudIcon Studio works in all modern, standards-compliant browsers that support the HTML Canvas API and modern JavaScript (ES2020+). This includes Google Chrome (desktop and Android), Mozilla Firefox, Apple Safari (desktop and iOS), Microsoft Edge (Chromium-based), Brave, Opera, and Samsung Internet. The application requires JavaScript to be enabled and uses the Canvas 2D rendering context for all image processing operations. Internet Explorer 11 and older browsers that do not support the Canvas API or modern JavaScript features are not supported. For the best experience, we recommend using the latest version of Chrome or Edge, which offer the best Canvas API performance. Safari users should ensure they are on Safari 15+ for full feature compatibility.',
      },
      {
        q: 'Does it work offline?',
        a: 'Yes, CloudIcon Studio is a fully featured Progressive Web App (PWA) with complete offline support. After your first visit to the site, the application shell and all necessary assets are cached via a service worker, allowing you to use every feature without an internet connection. This includes uploading images, editing them with all tools (crop, rotate, padding, background, shape), previewing on device mockups, and exporting complete ZIP archives. There is no functionality that requires a network connection after the initial load. You can also install CloudIcon Studio on your device\'s home screen using the browser\'s install prompt (or manually via the browser menu). Once installed, it launches in a standalone window just like a native app, with its own icon, splash screen, and offline capability. This makes it particularly useful for designers and developers who work in environments with unreliable internet access.',
      },
      {
        q: 'Is there a file size limit?',
        a: 'CloudIcon Studio does not impose an arbitrary file size limit on uploads. Since all image processing happens entirely in your browser using local resources, the practical limit depends on your device\'s available RAM (random access memory). Most modern desktop and laptop computers can handle source images up to 4096×4096 pixels without any issues. Devices with more memory (8GB+ RAM) can comfortably process larger images up to 8192×8192 pixels. Mobile devices and lower-spec machines may encounter performance degradation or out-of-memory errors with extremely large images (above 6000×6000 pixels). For optimal results, we recommend using source images between 1024×1024 and 2048×2048 pixels, which provides excellent quality for all generated icon sizes while maintaining fast processing times.',
      },
      {
        q: 'What technology powers CloudIcon Studio?',
        a: 'CloudIcon Studio is built on a modern web technology stack optimized for performance and reliability. The framework is Next.js 16 (React 19) with the App Router for server-side rendering and static generation. Image processing leverages Fabric.js 7 for GPU-accelerated canvas rendering with WebGL support where available, providing smooth real-time previews and fast export. State management uses Zustand 5 for lightweight, TypeScript-safe stores. Animations are powered by Framer Motion 12 for smooth, performant motion design. The UI is styled with Tailwind CSS 4 using CSS variables for the theming system, and UI primitives come from @base-ui/react. Icon sets are generated using the Canvas API for rendering and JSZip for client-side ZIP creation. The entire application is a PWA with a service worker for offline functionality, installable on any platform that supports progressive web apps.',
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
