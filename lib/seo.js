export const SITE = {
  name: "SR ব্লাড ডোনেট ফাউন্ডেশন",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  description:
    "কুষ্টিয়ার স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক। রক্তদাতা খুঁজুন, রক্তদাতা হিসেবে নিবন্ধন করুন এবং জরুরি রক্তের জন্য আবেদন করুন।",
};
export function pageMeta(title, description, path) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "bn_BD",
      siteName: SITE.name,
      title: `${title} | ${SITE.name}`,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
  };
}
export const noIndex = (title) => ({
  title,
  robots: { index: false, follow: false },
});
