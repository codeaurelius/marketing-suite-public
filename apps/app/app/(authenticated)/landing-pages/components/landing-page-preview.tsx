'use client';

import { useEffect, useRef } from 'react';

interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    heading: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  spacing: {
    section: string;
    element: string;
  };
}

const themeConfigs: Record<'modern' | 'classic', ThemeConfig> = {
  modern: {
    colors: {
      primary: '#2563eb', // blue-600
      secondary: '#3b82f6', // blue-500
      accent: '#60a5fa', // blue-400
      background: '#ffffff',
      text: '#4b5563', // gray-600
      heading: '#111827', // gray-900
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: '0.5rem',
    spacing: {
      section: '6rem',
      element: '1.5rem',
    },
  },
  classic: {
    colors: {
      primary: '#4f46e5', // indigo-600
      secondary: '#6366f1', // indigo-500
      accent: '#818cf8', // indigo-400
      background: '#f9fafb', // gray-50
      text: '#4b5563', // gray-600
      heading: '#111827', // gray-900
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, sans-serif',
    },
    borderRadius: '0.25rem',
    spacing: {
      section: '5rem',
      element: '1.25rem',
    },
  },
};

interface LandingPagePreviewProps {
  template: 'modern' | 'classic';
  content: {
    title: string;
    description: string;
    productName: string;
    targetAudience: string;
    keyFeatures: string;
    callToAction: string;
  };
}

const placeholderContent = {
  title: 'Your Landing Page Title',
  description:
    'Add a compelling description that highlights your value proposition and speaks to your target audience.',
  keyFeatures:
    '• Feature one: Describe your main feature\n• Feature two: Add another key feature\n• Feature three: List one more feature',
  callToAction: 'Get Started',
};

const getFeaturesList = (content: LandingPagePreviewProps['content']) => {
  const featuresContent = content.keyFeatures || placeholderContent.keyFeatures;
  const isPlaceholder = !content.keyFeatures;

  return featuresContent
    .split('\n')
    .filter((feature) => feature.trim() !== '')
    .map((feature) => {
      const cleanedFeature = feature.replace('•', '').trim();
      return `<li class="mb-2 ${isPlaceholder ? 'text-gray-400' : ''}">${cleanedFeature}</li>`;
    })
    .join('');
};

const getTailwindConfig = (template: LandingPagePreviewProps['template']) => {
  const theme = themeConfigs[template];
  return {
    theme: {
      extend: {
        colors: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
          accent: theme.colors.accent,
        },
        fontFamily: {
          heading: [theme.fonts.heading],
          body: [theme.fonts.body],
        },
        borderRadius: {
          theme: theme.borderRadius,
        },
        spacing: {
          'section-y': theme.spacing.section,
          'element-y': theme.spacing.element,
        },
      },
    },
  };
};

const getTemplateHtml = (
  template: LandingPagePreviewProps['template'],
  content: LandingPagePreviewProps['content'],
  featuresList: string,
  tailwindConfig: ReturnType<typeof getTailwindConfig>
) => {
  if (template === 'modern') {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${content.title || placeholderContent.title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = ${JSON.stringify(tailwindConfig)}
          </script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body class="bg-white font-body">
          <div class="min-h-screen">
            <main>
              <!-- Hero section -->
              <div class="relative isolate bg-gradient-to-b from-primary/5 to-transparent">
                <div class="mx-auto max-w-7xl px-6 py-section-y">
                  <div class="mx-auto max-w-2xl text-center">
                    <h1 class="font-heading text-4xl font-bold tracking-tight ${content.title ? 'text-gray-900' : 'text-gray-400'} sm:text-6xl">
                      ${content.title || placeholderContent.title}
                    </h1>
                    <p class="mt-element-y text-lg leading-8 ${content.description ? 'text-gray-600' : 'text-gray-400'}">
                      ${content.description || placeholderContent.description}
                    </p>
                    <div class="mt-10 flex items-center justify-center gap-x-6">
                      <a href="#" class="rounded-theme bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary transition-colors">
                        ${content.callToAction || placeholderContent.callToAction}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Features section -->
              <div class="mx-auto max-w-7xl px-6 py-section-y">
                <div class="mx-auto max-w-2xl">
                  <h2 class="font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-element-y">
                    Key Features
                  </h2>
                  <ul class="text-lg leading-8 text-gray-600 space-y-4">
                    ${featuresList}
                  </ul>
                </div>
              </div>
            </main>
          </div>
        </body>
      </html>
    `;
  }
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${content.title || placeholderContent.title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = ${JSON.stringify(tailwindConfig)}
          </script>
          <link href="https://fonts.googleapis.com/css2?family=Georgia&display=swap" rel="stylesheet">
        </head>
        <body class="bg-[#f9fafb] font-body">
          <div class="min-h-screen">
            <main>
              <!-- Hero section -->
              <div class="bg-white py-section-y">
                <div class="mx-auto max-w-7xl px-6">
                  <div class="mx-auto max-w-2xl lg:text-center">
                    <h1 class="font-heading mt-2 text-3xl font-bold tracking-tight ${content.title ? 'text-gray-900' : 'text-gray-400'} sm:text-4xl">
                      ${content.title || placeholderContent.title}
                    </h1>
                    <p class="mt-element-y text-lg leading-8 ${content.description ? 'text-gray-600' : 'text-gray-400'}">
                      ${content.description || placeholderContent.description}
                    </p>
                    <div class="mt-10 flex items-center justify-center gap-x-6">
                      <a href="#" class="rounded-theme bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary transition-colors">
                        ${content.callToAction || placeholderContent.callToAction}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Features section -->
              <div class="mx-auto max-w-7xl px-6 py-section-y">
                <div class="mx-auto max-w-2xl lg:text-center">
                  <h2 class="font-heading text-2xl font-semibold leading-7 text-primary">Features</h2>
                  <ul class="mt-element-y text-lg leading-8 text-gray-600 space-y-4">
                    ${featuresList}
                  </ul>
                </div>
              </div>
            </main>
          </div>
        </body>
      </html>
    `;
};

export function LandingPagePreview({
  template,
  content,
}: LandingPagePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }

    const featuresList = getFeaturesList(content);
    const tailwindConfig = getTailwindConfig(template);
    const templateHtml = getTemplateHtml(
      template,
      content,
      featuresList,
      tailwindConfig
    );

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(templateHtml);
      iframeDoc.close();
    }
  }, [template, content]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      title="Landing Page Preview"
    />
  );
}
