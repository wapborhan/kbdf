export const toWa = (p = "") => { const d = p.replace(/\D/g, ""); return d.startsWith("88") ? d : "88" + d; };
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }) : "");
export const canDonate = (last) => !last || Date.now() - new Date(last).getTime() >= 90 * 864e5;
