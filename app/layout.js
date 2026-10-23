import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export const metadata = { title: "কুষ্টিয়া ব্লাড ডোনেট ফাউন্ডেশন", description: "রক্ত দিন, জীবন বাঁচান" };
export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
