import "./globals.css";
import { Hind_Siliguri } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import ProgressBar from "@/components/ProgressBar";
import { SITE } from "@/lib/seo";

const font = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const title = `${SITE.name} — রক্ত দিন, জীবন বাঁচান`;

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: "KBDF",
  keywords: ["SR ব্লাড ডোনেট ফাউন্ডেশন", "রক্তদাতা", "রক্তদান", "জরুরি রক্ত", "কুষ্টিয়া", "blood donor Kushtia", "blood donation Bangladesh", "KBDF"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "bn_BD", siteName: SITE.name, title, description: SITE.description, url: "/" },
  twitter: { card: "summary_large_image", title, description: SITE.description },
  robots: { index: true, follow: true },
};
export const viewport = { themeColor: "#b91c1c" };

const orgLd = { "@context": "https://schema.org", "@type": "Organization", name: SITE.name, alternateName: "KBDF", url: SITE.url, logo: `${SITE.url}/icon.svg`, description: SITE.description, areaServed: { "@type": "AdministrativeArea", name: "Kushtia, Bangladesh" } };

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("kbdf_theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");if(t==="dark")document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${font.className} min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-900 dark:text-slate-100`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <AuthProvider>
          <ProgressBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
