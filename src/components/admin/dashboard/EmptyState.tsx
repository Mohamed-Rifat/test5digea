import type { LucideIcon } from "lucide-react";

export default function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#e6ddd7] bg-[#fcfaf8] px-4 py-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5eee9] text-[#9b8e86]">
        <Icon size={16} />
      </div>

      <p className="mt-3 text-xs font-medium text-[#8f8178]">{text}</p>
    </div>
  );
}
