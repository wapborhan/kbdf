import { Suspense } from "react";
import DonorSearch from "./DonorSearch";
export const metadata = { title: "রক্তদাতা খুঁজুন | KBDF" };
export default function Page() { return <Suspense fallback={<p className="p-8 text-center">লোড হচ্ছে...</p>}><DonorSearch /></Suspense>; }
