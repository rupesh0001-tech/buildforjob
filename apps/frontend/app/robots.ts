import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://buildforjob.rupeshhh.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/blogs",
          "/blogs/*",
          "/login",
          "/register",
          "/forgot-password",
        ],
        disallow: [
          "/dashboard/",
          "/dashboard/*",
          "/auth-callback",
          "/verify-email/",
          "/reset-password",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/blogs",
          "/blogs/*",
          "/login",
          "/register",
          "/forgot-password",
        ],
        disallow: [
          "/dashboard/",
          "/dashboard/*",
          "/auth-callback",
          "/verify-email/",
          "/reset-password",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
