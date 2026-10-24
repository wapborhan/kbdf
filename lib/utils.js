export const toWa = (p = "") => { const d = p.replace(/\D/g, ""); return d.startsWith("88") ? d : "88" + d; };
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }) : "");
export const canDonate = (last) => !last || Date.now() - new Date(last).getTime() >= 90 * 864e5;
export const MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
export const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== "" && v != null));
export const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const todayISO = () => isoDate(new Date());
export const bnNum = (n) => Number(n).toLocaleString("bn-BD");
