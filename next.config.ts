import type { NextConfig } from "next";

/**
 * إعدادات Next.js — منصة المجدل العقارية
 * ------------------------------------------------------------
 * - رؤوس الأمان: تُطبَّق على كل الاستجابات (انظر أيضاً CSP في middleware).
 * - الصور: تنسيقات حديثة (AVIF/WebP) + نطاقات موثوقة فقط (تخزين Supabase).
 * - بوابات الجودة: لا تجاهل أخطاء TypeScript أو ESLint عند البناء إطلاقاً.
 */

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

// HSTS في الإنتاج فقط (لا معنى له على localhost أثناء التطوير)
if (process.env.NODE_ENV === "production") {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  images: {
    // تنسيقات حديثة أولاً: AVIF ثم WebP — تقلل استهلاك الإنترنت المحدود
    formats: ["image/avif", "image/webp"],
    // أحجام مخصصة لتجربة جوال ممتازة (Mobile-First)
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      // تخزين Supabase (صور العقارات — عام)
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // صور مصغرات فيديوهات YouTube عند رفع فيديو خارجي
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      // Supabase محلي (اختياري — أثناء التطوير فقط)
      { protocol: "http", hostname: "localhost", port: "54321" },
    ],
  },

  experimental: {
    // تقليل حجم الحزم عند الـtree-shaking (أيقونات، تواريخ، رسوم بيانية)
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "@supabase/supabase-js",
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
