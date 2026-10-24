import { Suspense } from "react";
import DonorCard from "@/components/DonorCard";
import FilterBar from "@/components/FilterBar";
import Pager from "@/components/Pager";
import { listDonors, readParams, withoutPage } from "@/lib/queries";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta("রক্তদাতা খুঁজুন", "রক্তের গ্রুপ ও উপজেলা অনুযায়ী কুষ্টিয়ার সক্রিয় রক্তদাতা খুঁজুন এবং WhatsApp-এ সরাসরি যোগাযোগ করুন।", "/donors");

// Server component: reads ?q=&bloodGroup=&upazila=&page= and queries MongoDB on the server.
export default async function DonorsPage({ searchParams }) {
  const f = readParams(await searchParams);
  let data = { items: [], total: 0, page: 1, pages: 1 }, failed = false;
  try { data = await listDonors({ ...f, publicOnly: true, per: 12 }); } catch { failed = true; }
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">রক্তদাতা খুঁজুন</h1>
      <div className="mt-6">
        <Suspense><FilterBar placeholder="নাম বা ফোন দিয়ে খুঁজুন" fields={[{ name: "bloodGroup", label: "সব রক্তের গ্রুপ", options: BLOOD_GROUPS }, { name: "upazila", label: "সব উপজেলা", options: UPAZILAS }]} /></Suspense>
      </div>
      <div className="mt-6">
        {failed ? <p className="text-center text-red-600">তথ্য লোড করা যায়নি</p> : data.items.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-gray-500 ring-1 ring-gray-200">কোনো রক্তদাতা পাওয়া যায়নি।</p> : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((d) => <DonorCard key={d._id} d={d} />)}</div>
            <Pager {...data} path="/donors" params={withoutPage(f)} bare />
          </>
        )}
      </div>
    </div>
  );
}
