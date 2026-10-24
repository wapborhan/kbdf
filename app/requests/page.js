import { Suspense } from "react";
import RequestCard from "@/components/RequestCard";
import FilterBar from "@/components/FilterBar";
import Pager from "@/components/Pager";
import { AddRequestButton, MyRequests } from "@/components/RequestsClient";
import { listRequests, readParams, withoutPage } from "@/lib/queries";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";

// Server component: approved requests are filtered/searched/paged in MongoDB via the URL.
export default async function RequestsPage({ searchParams }) {
  const f = readParams(await searchParams);
  let data = { items: [], total: 0, page: 1, pages: 1 };
  try { data = await listRequests({ ...f, publicOnly: true, per: 10 }); } catch {}
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">রক্তের আবেদন</h1>
      <div className="mt-6">
        <Suspense><FilterBar placeholder="রোগী বা হাসপাতালের নাম" fields={[{ name: "bloodGroup", label: "সব গ্রুপ", options: BLOOD_GROUPS }, { name: "upazila", label: "সব উপজেলা", options: UPAZILAS }]}><AddRequestButton /></FilterBar></Suspense>
      </div>
      <MyRequests />
      <h2 className="mt-8 font-bold">চলমান আবেদন</h2>
      <div className="mt-3 grid gap-4">
        {data.items.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-gray-500 ring-1 ring-gray-200">কোনো সক্রিয় আবেদন পাওয়া যায়নি।</p> : data.items.map((r) => <RequestCard key={r._id} r={r} />)}
      </div>
      {data.items.length > 0 && <Pager {...data} path="/requests" params={withoutPage(f)} bare />}
    </div>
  );
}
