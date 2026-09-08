"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight, CalendarDays, Check, CheckCircle2, Circle, Clock3, Loader2,
  MapPin, Pencil, Sparkles, Store, Target, Trophy, X, XCircle, Camera,
  Music2, Utensils, Gem, Flower2, CakeSlice, Shirt, Heart, Car, MoreHorizontal,
} from "lucide-react";

import AuthGuard from "@/components/guards/AuthGuard";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/format";
import { RoadmapItemStatus } from "@/types/roadmap";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import { MessageSquarePlus } from "lucide-react";

const CATEGORY_ICONS = [Camera, Gem, Flower2, Utensils, CakeSlice, Music2, Shirt, Heart, Car, MoreHorizontal];

function categoryIcon(name: string, index: number) {
  const key = name.toLowerCase();
  if (key.includes("photo") || key.includes("video")) return Camera;
  if (key.includes("venue") || key.includes("hall")) return Gem;
  if (key.includes("flower") || key.includes("decor")) return Flower2;
  if (key.includes("food") || key.includes("cater")) return Utensils;
  if (key.includes("cake")) return CakeSlice;
  if (key.includes("music") || key.includes("dj")) return Music2;
  if (key.includes("dress") || key.includes("fashion")) return Shirt;
  if (key.includes("car") || key.includes("transport")) return Car;
  return CATEGORY_ICONS[index % CATEGORY_ICONS.length];
}

function Countdown({ eventDate }: { eventDate: string }) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const target = new Date(eventDate).getTime();
  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const blocks = [[days, "Days"], [hours, "Hours"], [minutes, "Minutes"], [seconds, "Seconds"]] as const;

  return (
    <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
      {blocks.map(([value, label]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/10 px-2 py-3 text-center backdrop-blur-sm">
          <div className="font-serif text-xl font-medium tabular-nums text-white sm:text-3xl">{String(value).padStart(2, "0")}</div>
          <div className="mt-1 text-[8px] font-semibold uppercase tracking-[.16em] text-white/55 sm:text-[9px]">{label}</div>
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  return (
    <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#b99a62 ${progress * 3.6}deg, #eee7e1 0deg)` }}>
      <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-white">
        <div className="text-center"><div className="text-xl font-semibold text-[#30251f]">{progress}%</div><div className="text-[8px] uppercase tracking-[.14em] text-[#9b8f86]">complete</div></div>
      </div>
    </div>
  );
}

function RoadmapContent() {
  const { roadmap, loading, error, actionLoading, create, update, removeVendor, complete, uncomplete } = useRoadmap();
  const { toast } = useToast();
  const [reviewItem, setReviewItem] = useState<{ id: string; categoryName: string } | null>(null);

  const run = async (promise: Promise<boolean>, success: string, failure: string) => {
    const ok = await promise;
    toast(ok ? success : failure, ok ? "success" : "error");
  };

  if (loading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#b99a62]" /></div>;
  if (error) return <div className="mx-auto max-w-xl px-4 py-24 text-center"><div className="rounded-3xl border border-red-100 bg-red-50 p-8"><p className="font-medium text-red-600">{error}</p></div></div>;
  if (!roadmap) return <CreateRoadmapForm onCreate={async (data) => { const ok = await create(data); toast(ok ? "Your wedding roadmap is ready." : "We couldn't create your roadmap.", ok ? "success" : "error"); return ok; }} loading={actionLoading === "create"} />;

  const total = roadmap.items.length;
  const completed = roadmap.items.filter((item) => item.status === RoadmapItemStatus.Completed).length;
  const selected = roadmap.items.filter((item) => !!item.selectedVendorId).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const remaining = roadmap.items.filter((item) => item.status !== RoadmapItemStatus.Completed);
  const nextItem = remaining[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#30251f] p-6 text-white shadow-[0_30px_90px_rgba(48,37,31,.20)] sm:p-9 lg:p-10">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#a47e43]/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#8e685e]/20 blur-3xl" />
        <div className="relative grid gap-9 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#d5b77d]"><Sparkles size={15}/><span className="text-[10px] font-semibold uppercase tracking-[.35em]">Your Wedding Command Center</span></div>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl font-light leading-[1.05] sm:text-6xl">Everything for <span className="italic text-[#d8bd89]">your forever.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">A smarter wedding plan that tells you what to do next, keeps your vendors organized, and makes progress feel effortless.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5"><CalendarDays className="mr-1.5 inline" size={13}/>{formatDate(roadmap.eventDate)}</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">{roadmap.partnerName ? `Planning with ${roadmap.partnerName}` : "Your wedding plan"}</span>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[.06] p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-white/45">The big day</p><p className="mt-1 text-sm text-white/75">Time left until your celebration</p></div><Clock3 size={18} className="text-[#d5b77d]"/></div>
            <Countdown eventDate={roadmap.eventDate} />
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CheckCircle2} label="Completed" value={`${completed}/${total}`} sub="categories finished" />
        <Stat icon={Store} label="Vendors" value={`${selected}`} sub="vendors selected" />
        <Stat icon={Target} label="Progress" value={`${progress}%`} sub="overall completion" />
        <Stat icon={Clock3} label="Next up" value={nextItem?.categoryName || "All done"} sub={nextItem ? "your next priority" : "you nailed it"} />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_330px]">
        <div className="rounded-[2rem] border border-[#eee7e1] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#a47e43]">Your progress</p><h2 className="mt-1 font-serif text-2xl font-light text-[#30251f]">The plan, at a glance</h2><p className="mt-1 text-xs text-[#9b8f86]">You are {progress}% of the way there. Keep going — the little decisions add up.</p></div>
            <ProgressRing progress={progress} />
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#f1ebe6]"><div className="h-full rounded-full bg-gradient-to-r from-[#8e685e] via-[#a47e43] to-[#d5b77d] transition-all duration-700" style={{ width: `${progress}%` }} /></div>
          <div className="mt-3 flex justify-between text-[11px] text-[#9b8f86]"><span>{completed} completed</span><span>{Math.max(total-completed,0)} remaining</span></div>
        </div>

        <div className="rounded-[2rem] border border-[#e9ded4] bg-[#f8f2ec] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[#a47e43]"><Target size={16}/><span className="text-[10px] font-semibold uppercase tracking-[.22em]">Recommended next</span></div>
          {nextItem ? <><h3 className="mt-4 font-serif text-2xl font-light text-[#30251f]">{nextItem.categoryName}</h3><p className="mt-2 text-xs leading-5 text-[#766d67]">Start with this category to keep your planning momentum. You can change the vendor later.</p><Link href={`/vendors?categoryId=${encodeURIComponent(nextItem.categoryId)}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#30251f] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#42332a]">Explore vendors <ArrowRight size={14}/></Link></> : <><h3 className="mt-4 font-serif text-2xl font-light text-[#30251f]">You’re ready.</h3><p className="mt-2 text-xs leading-5 text-[#766d67]">Every roadmap category is complete. Time to enjoy the countdown.</p></>}
        </div>
      </section>

      <section className="mt-9">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#a47e43]">Planning timeline</p><h2 className="mt-1 font-serif text-3xl font-light text-[#30251f]">Build your celebration, one step at a time.</h2></div><span className="text-xs text-[#9b8f86]">{total} planning categories</span></div>
        <div className="relative">
          <div className="absolute bottom-6 left-[23px] top-6 hidden w-px bg-[#e8dfd8] sm:block" />
          <div className="space-y-4">
            {roadmap.items.map((item, index) => {
              const done = item.status === RoadmapItemStatus.Completed;
              const hasVendor = !!item.selectedVendorId;
              const busy = actionLoading === `complete-${item.categoryId}` || actionLoading === `uncomplete-${item.categoryId}`;
              const Icon = categoryIcon(item.categoryName, index);
              return (
                <article key={item.id} className={`relative overflow-hidden rounded-[1.75rem] border transition-all duration-300 ${done ? "border-emerald-100 bg-emerald-50/50" : "border-[#eee7e1] bg-white hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(48,37,31,.07)]"}`}>
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                    <div className="relative z-10 flex shrink-0 items-center gap-3 sm:w-[250px]">
                      <button type="button" onClick={() => run(done ? uncomplete(item.categoryId) : complete(item.categoryId), done ? "Category reopened." : "Category completed!", "We couldn't update this category.")} disabled={busy} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${done ? "border-emerald-200 bg-emerald-100 text-emerald-700" : "border-[#e8dfd8] bg-[#faf7f4] text-[#b6a79d] hover:border-[#b99a62] hover:text-[#a47e43]"}`}>{busy ? <Loader2 size={18} className="animate-spin"/> : done ? <Check size={20}/> : <Circle size={20}/>}</button>
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${done ? "bg-white text-emerald-700" : "bg-[#f6efe9] text-[#a47e43]"}`}><Icon size={18}/></div>
                      <div className="min-w-0"><span className="text-[9px] font-semibold uppercase tracking-[.2em] text-[#b0a198]">Step {String(index+1).padStart(2,"0")}</span><h3 className={`truncate text-sm font-semibold ${done ? "text-emerald-800" : "text-[#30251f]"}`}>{item.categoryName}</h3></div>
                    </div>
                    <div className="min-w-0 flex-1 sm:border-l sm:border-[#eee7e1] sm:pl-5">
                      <div className="flex flex-wrap items-center gap-2">
                        {done ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-emerald-700">Completed</span> : hasVendor ? <span className="rounded-full bg-[#f3eadf] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#8c6a3c]">Vendor selected</span> : <span className="rounded-full bg-[#f5f1ed] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#8c817a]">Needs attention</span>}
                      </div>
                      {item.selectedVendorName ? <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#8c6a3c]"><Store size={13}/>{item.selectedVendorName}</p> : done ? <p className="mt-2 text-xs text-emerald-700">Marked complete — you can reopen this anytime.</p> : <p className="mt-2 text-xs text-[#9b8f86]">Find a vendor, save your choice, then mark this category complete.</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:pl-2">{done && hasVendor && <button type="button" onClick={() => setReviewItem({ id: item.id, categoryName: item.categoryName })} className="inline-flex items-center gap-2 rounded-xl border border-[#e4dbd0] px-4 py-2.5 text-xs font-semibold text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#a47e43]"><MessageSquarePlus size={14}/>Review</button>}<Link href={`/vendors?categoryId=${encodeURIComponent(item.categoryId)}`} className="inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#42332a]">{hasVendor ? "Change vendor" : "Find vendor"}<ArrowRight size={14}/></Link>{hasVendor && <button type="button" onClick={() => run(removeVendor(item.categoryId), "Vendor removed from your roadmap.", "We couldn't remove the vendor.")} disabled={actionLoading === `remove-${item.categoryId}`} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eee1d8] text-[#9b8f86] transition hover:border-red-200 hover:text-red-500"><XCircle size={16}/></button>}</div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#eee7e1] bg-[#faf7f4] p-4 text-xs leading-5 text-[#766d67]"><MapPin className="mt-0.5 shrink-0 text-[#a47e43]" size={15}/><span>Your roadmap stays flexible: changing a vendor never changes the category, and reopening a completed category keeps your previous selection.</span></div>
      <RoadmapSummary roadmap={roadmap} onUpdate={update} updating={actionLoading === "update"} />

      {reviewItem && (
        <WriteReviewModal
          roadmapItemId={reviewItem.id}
          categoryName={reviewItem.categoryName}
          onClose={() => setReviewItem(null)}
        />
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Target; label: string; value: string; sub: string }) {
  return <div className="rounded-2xl border border-[#eee7e1] bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5efe9] text-[#a47e43]"><Icon size={17}/></div><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#a69a92]">{label}</p><p className="mt-0.5 truncate text-xl font-semibold text-[#30251f]">{value}</p></div></div><p className="mt-2 text-[11px] text-[#9b8f86]">{sub}</p></div>;
}

function RoadmapSummary({ roadmap, onUpdate, updating }: { roadmap: NonNullable<ReturnType<typeof useRoadmap>["roadmap"]>; onUpdate: (data: { partnerName: string; eventDate: string }) => Promise<boolean>; updating: boolean }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [partnerName, setPartnerName] = useState(roadmap.partnerName);
  const [eventDate, setEventDate] = useState(roadmap.eventDate.slice(0, 10));
  const submit = async (event: FormEvent) => { event.preventDefault(); const ok = await onUpdate({ partnerName, eventDate: new Date(eventDate).toISOString() }); if (ok) { setEditing(false); toast("Plan details updated.", "success"); } else toast("We couldn't update your plan.", "error"); };
  return <section className="mt-8 rounded-[2rem] border border-[#eee7e1] bg-white p-5 sm:p-6">{!editing ? <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#a47e43]">Plan details</p><h2 className="mt-1 font-serif text-xl font-light text-[#30251f]">{roadmap.partnerName ? `Planning with ${roadmap.partnerName}` : "Your Wedding Plan"}</h2><p className="mt-1 text-xs text-[#9b8f86]">{formatDate(roadmap.eventDate)}</p></div><button type="button" onClick={() => setEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e4dbd0] px-4 py-2.5 text-xs font-semibold text-[#5f544d] hover:border-[#b99a62]"><Pencil size={14}/> Edit details</button></div> : <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]"><div><label className="mb-1.5 block text-xs font-medium text-[#766d67]">Partner's name</label><input value={partnerName} onChange={e=>setPartnerName(e.target.value)} required className="w-full rounded-xl border border-[#e4dbd0] px-3 py-2.5 text-sm outline-none focus:border-[#b99a62]"/></div><div><label className="mb-1.5 block text-xs font-medium text-[#766d67]">Wedding date</label><input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)} required className="w-full rounded-xl border border-[#e4dbd0] px-3 py-2.5 text-sm outline-none focus:border-[#b99a62]"/></div><div className="flex items-end gap-2"><button disabled={updating} className="rounded-xl bg-[#30251f] px-5 py-2.5 text-sm text-white disabled:opacity-60">{updating ? "Saving..." : "Save"}</button><button type="button" onClick={()=>setEditing(false)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4dbd0]"><X size={16}/></button></div></form>}</section>;
}

function CreateRoadmapForm({ onCreate, loading }: { onCreate: (data: { partnerName: string; eventDate: string }) => Promise<boolean>; loading: boolean }) {
  const [partnerName, setPartnerName] = useState(""); const [eventDate, setEventDate] = useState(""); const [formError, setFormError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!partnerName.trim() || !eventDate) { setFormError("Please add your partner's name and wedding date."); return; } setFormError(""); await onCreate({ partnerName: partnerName.trim(), eventDate: new Date(eventDate).toISOString() }); };
  return <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6"><div className="overflow-hidden rounded-[2rem] border border-[#eee7e1] bg-white shadow-[0_24px_70px_rgba(48,37,31,.08)]"><div className="bg-[#30251f] p-8 text-white sm:p-10"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><Sparkles className="text-[#d5b77d]" size={22}/></div><h1 className="mt-5 font-serif text-3xl font-light">Let's build your wedding plan.</h1><p className="mt-2 max-w-lg text-sm leading-6 text-white/60">Start with two details. We'll turn your wedding categories into a beautiful roadmap you can actually follow.</p></div><form onSubmit={submit} className="space-y-5 p-7 sm:p-9"><div><label className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-[#766d67]">Partner's name</label><input value={partnerName} onChange={e=>setPartnerName(e.target.value)} placeholder="e.g. Sarah" className="w-full rounded-2xl border border-[#e4dbd0] bg-[#fcfaf8] px-4 py-3.5 text-sm outline-none focus:border-[#b99a62]"/></div><div><label className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-[#766d67]">Wedding date</label><input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)} className="w-full rounded-2xl border border-[#e4dbd0] bg-[#fcfaf8] px-4 py-3.5 text-sm outline-none focus:border-[#b99a62]"/></div>{formError && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</p>}<button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#30251f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#42332a] disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={17}/> : <Sparkles size={17}/>} {loading ? "Building your roadmap..." : "Create my roadmap"}</button></form></div></div>;
}

export default function RoadmapPage() { return <AuthGuard><main className="min-h-screen bg-[#faf8f6]"><RoadmapContent/></main></AuthGuard>; }
