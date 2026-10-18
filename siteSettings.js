import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// Shared business information for the whole site. The Admin Settings page is
// the only writer; the footer, help page, FAQ, delivery, privacy and terms
// pages read from here, so editing one value in the admin panel updates every
// information text shown on the customer UI.
// ---------------------------------------------------------------------------
export const SETTINGS_KEY = "cafetcha-admin-settings";

export const DEFAULT_SETTINGS = {
  // The brand name is intentionally not editable from the admin panel — it is
  // kept only so older saved data still merges cleanly.
  businessName: "Cafétcha",
  email: "cafetcha.official@gmail.com",
  phone: "0910 182 1406",
  address: "Sto. Niño, Hagonoy, Bulacan",
  openingHours: "3:00 PM – 11:00 PM",
};

const listeners = new Set();
let snapshot = null;

const readSettings = () => {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(SETTINGS_KEY) || "{}",
    );
    return { ...DEFAULT_SETTINGS, ...stored };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

const getSnapshot = () => {
  if (!snapshot) snapshot = readSettings();
  return snapshot;
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emit = () => listeners.forEach((listener) => listener());

export const saveSiteSettings = (settings) => {
  const next = { ...DEFAULT_SETTINGS, ...settings };
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    return { ok: false, error: "Settings could not be saved in this browser." };
  }
  snapshot = next;
  emit();
  return { ok: true, settings: next };
};

export const restoreDefaultSiteSettings = () => {
  try {
    window.localStorage.removeItem(SETTINGS_KEY);
  } catch {
    // Storage unavailable — the in-memory restore still applies.
  }
  snapshot = { ...DEFAULT_SETTINGS };
  emit();
  return { ok: true };
};

export const useSiteSettings = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
