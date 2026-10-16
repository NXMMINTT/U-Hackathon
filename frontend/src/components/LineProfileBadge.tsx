"use client";

import { useEffect, useState } from "react";

import { getLineProfile, type LineProfile } from "@/lib/liff";

/** Shows the signed-in LINE user's name + avatar, so it's clear the session is a real LINE login. */
export function LineProfileBadge() {
  const [profile, setProfile] = useState<LineProfile | null>(null);

  useEffect(() => {
    getLineProfile().then(setProfile);
  }, []);

  if (!profile) return null;

  return (
    <div className="flex items-center gap-2">
      {profile.pictureUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.pictureUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
      )}
      <span className="max-w-[120px] truncate text-[15px] font-semibold text-navy">{profile.displayName}</span>
    </div>
  );
}
