// ---------------------------------------------------------------------------
// Shared mobile number rule for every phone / mobile / GCash number field in
// the app: a Philippine mobile number is exactly 11 digits and must start
// with "09". Anything else is invalid.
// ---------------------------------------------------------------------------
export const PHONE_ERROR =
  "Mobile number must start with 09 and be exactly 11 digits.";

export const isValidPhMobile = (value) =>
  /^09\d{9}$/.test(String(value || "").replace(/\D/g, ""));
