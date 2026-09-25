"use client";

import { ModerationDialogs } from "@/components/admin/moderation/ModerationDialogs";
import { ModerationFilters } from "@/components/admin/moderation/ModerationFilters";
import { ModerationHeader } from "@/components/admin/moderation/ModerationHeader";
import { ModerationList } from "@/components/admin/moderation/ModerationList";
import { useModerationPage } from "@/components/admin/moderation/useModerationPage";

export default function AdminModerationPage() {
  const queue = useModerationPage();

  return (
    <div className="mx-auto">
      <ModerationHeader queue={queue} />
      <ModerationFilters queue={queue} />
      <ModerationList queue={queue} />
      <ModerationDialogs queue={queue} />
    </div>
  );
}
