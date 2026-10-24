"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

async function loadProfile(u) {
  try {
    const res = await fetch("/api/me", { headers: { Authorization: `Bearer ${await u.getIdToken()}` } });
    return res.ok ? (await res.json()).user : null;
  } catch { return null; }
}

export default function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    if (u) {
      // create the server session cookie first, so server components see the user as soon as `profile` is set
      try { await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: await u.getIdToken() }) }); } catch {}
    }
    setProfile(u ? await loadProfile(u) : null);
    setLoading(false);
  }), []);

  const login = useCallback(() => signInWithPopup(auth, googleProvider), []);
  const logout = useCallback(async () => { try { await fetch("/api/session", { method: "DELETE" }); } catch {} await signOut(auth); window.location.assign("/"); }, []);
  const refresh = useCallback(async () => { if (auth.currentUser) setProfile(await loadProfile(auth.currentUser)); }, []);
  const authFetch = useCallback(async (url, opts = {}) => {
    const token = await auth.currentUser?.getIdToken();
    return fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...(opts.headers || {}), Authorization: `Bearer ${token}` } });
  }, []);
  // Saves the personal-info form; returns { ok, error }.
  const saveProfile = useCallback(async (data) => {
    const r = await authFetch("/api/me", { method: "PUT", body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { setProfile(j.user); return { ok: true }; }
    return { ok: false, error: j.error };
  }, [authFetch]);

  return <Ctx.Provider value={{ profile, loading, login, logout, refresh, authFetch, saveProfile }}>{children}</Ctx.Provider>;
}
