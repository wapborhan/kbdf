import { SITE } from "@/lib/seo";
export default function sitemap() {
  const pages = [["", 1], ["/donors", 0.9], ["/requests", 0.9], ["/donors/register", 0.8], ["/requests/new", 0.8], ["/volunteers", 0.7], ["/about", 0.6], ["/guidelines", 0.6], ["/faq", 0.6], ["/contact", 0.5], ["/privacy", 0.3], ["/terms", 0.3]];
  return pages.map(([p, priority]) => ({ url: `${SITE.url}${p}`, lastModified: new Date(), changeFrequency: p === "" || p.startsWith("/requests") ? "daily" : "monthly", priority }));
}
