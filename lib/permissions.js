export const ROLES = ["admin", "moderator", "volunteer", "user"];
export const ROLE_LABEL = { admin: "অ্যাডমিন", moderator: "মডারেটর", volunteer: "স্বেচ্ছাসেবক", user: "ব্যবহারকারী" };
// admin: everything | moderator: everything except changing roles
// volunteer: add/update OWN blood requests only (needs staff approval) | user: read-only
export const isStaff = (r) => r === "admin" || r === "moderator";
export const canWriteRequests = (r) => isStaff(r) || r === "volunteer";
export const canChangeRole = (r) => r === "admin";
// New accounts need approval before using the dashboard; staff roles are always approved.
export const isApproved = (u) => !!u && (u.approved === true || isStaff(u.role));
