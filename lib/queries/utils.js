/**
 * Query Utilities & Shared Helpers
 */

/**
 * Escape special regex characters in search strings to prevent regex injection
 */
export const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Deep-clone Mongoose document to clean JSON serializable object
 */
export const plain = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Extract first item if array, or return string value
 */
export const firstValue = (val) => (Array.isArray(val) ? val[0] : val) || "";

/**
 * Parse URL search parameters into a sanitized query filter object
 */
export function readParams(searchParams = {}) {
  const allowedKeys = ["q", "bloodGroup", "upazila", "status", "filter", "page"];
  return Object.fromEntries(
    allowedKeys.map((key) => [
      key,
      String(firstValue(searchParams[key])).trim().slice(0, 60),
    ])
  );
}

/**
 * Remove page parameter for reusable filter URLs
 */
export const withoutPage = (filterObj = {}) =>
  Object.fromEntries(
    Object.entries(filterObj).filter(([key, val]) => val && key !== "page")
  );

/**
 * Helper to validate values against an allowed array
 */
export const validateInList = (val, allowedList) =>
  allowedList.includes(val) ? val : undefined;

/**
 * Generic search query builder for specified fields
 */
export const buildSearchQuery = (keyword, fields = []) => {
  const trimmed = keyword?.trim();
  if (!trimmed) return {};
  const escaped = escapeRegex(trimmed);
  return {
    $or: fields.map((field) => ({
      [field]: new RegExp(escaped, "i"),
    })),
  };
};

/**
 * Generic paginated Mongoose query runner
 */
export async function runQuery(Model, filter, { page = 1, per = 10, sort, select = "" }) {
  const total = await Model.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / per));
  const currentPage = Math.min(Math.max(1, parseInt(page) || 1), pages);

  const items = await Model.find(filter)
    .select(select)
    .sort(sort)
    .skip((currentPage - 1) * per)
    .limit(per)
    .lean();

  return {
    items: plain(items),
    total,
    page: currentPage,
    pages,
  };
}
