import { SITE } from "@/lib/seo";
export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/login"] }], sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url };
}
