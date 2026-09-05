"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Star, MapPin, X } from "lucide-react";
import { compareServices } from "@/services/services.service";
import { compareVendors } from "@/features/vendors/api/vendors.api";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";

export default function ComparePage() {
  const router=useRouter();
  const [query,setQuery]=useState({type:"",ids:[] as string[],categoryId:""});
  const {type,ids,categoryId}=query;
  const [services,setServices]=useState<Service[]>([]); const [vendors,setVendors]=useState<Vendor[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  useEffect(()=>{
    const url = new URL(window.location.href);
    setQuery({ type: url.searchParams.get("type") || "", ids: (url.searchParams.get("ids") || "").split(",").filter(Boolean), categoryId: url.searchParams.get("categoryId") || "" });
  },[]);
  useEffect(()=>{(async()=>{try{if(!ids.length)throw new Error("No items selected");if(type==="service")setServices(await compareServices({serviceIds:ids}));else if(type==="vendor"){if(!categoryId)throw new Error("Select a category before comparing vendors.");setVendors(await compareVendors({vendorIds:ids,categoryId}))}else throw new Error("Invalid comparison");}catch(e:any){setError(e?.message||"Unable to compare items")}finally{setLoading(false)}})()},[type,ids.join(","),categoryId]);
  return <main className="min-h-screen bg-[#faf8f6]"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><button onClick={()=>router.back()} className="inline-flex items-center gap-2 text-sm text-[#756960]"><ArrowLeft size={16}/> Back</button><div className="mt-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">Decision tools</p><h1 className="mt-2 text-4xl font-semibold text-[#30251f]">Compare {type==="vendor"?"vendors":"services"}</h1><p className="mt-2 text-sm text-[#81746d]">Put your shortlisted options side by side.</p></div>
  {loading?<div className="mt-8 h-80 animate-pulse rounded-2xl bg-white"/>:error?<div className="mt-8 rounded-2xl border border-red-100 bg-white p-10 text-center text-sm text-red-700">{error}<div><Link href={type==="vendor"?"/vendors":"/services"} className="mt-4 inline-block rounded-xl bg-[#30251f] px-5 py-3 text-white">Back to marketplace</Link></div></div>:
  <div className="mt-8 overflow-x-auto rounded-2xl border border-[#eee5df] bg-white shadow-sm"><div className="min-w-[760px]"><div className="grid" style={{gridTemplateColumns:`180px repeat(${(type==="vendor"?vendors:services).length}, minmax(190px,1fr))`}}><div className="border-b border-r border-[#eee5df] p-5 text-xs font-semibold uppercase tracking-widest text-[#a09289]">Comparison</div>{(type==="vendor"?vendors:services).map(item=><div key={item.id} className="border-b border-[#eee5df] p-5"><div className="font-semibold text-[#30251f]">{type==="vendor"?(item as Vendor).businessName:(item as Service).name}</div><button onClick={()=>router.push(type==="vendor"?`/vendors/${item.id}`:`/services/${item.id}`)} className="mt-2 text-xs font-semibold text-[#8e685e]">View details →</button></div>)}
  {[
    ["Rating",(i:any)=>type==="vendor"?`${Number(i.averageRating||0).toFixed(1)} / 5`:"—"],
    ["Category",(i:any)=>type==="vendor"?(i.categories||[]).join(", ")||"—":i.categoryName],
    ["Location",(i:any)=>type==="vendor"?i.location||"—":i.vendorBusinessName],
    ["Description",(i:any)=>type==="vendor"?i.bio||"—":i.description||"—"],
  ].map(([label,fn])=><div key={String(label)} className="contents"><div className="border-b border-r border-[#eee5df] bg-[#faf8f6] p-5 text-sm font-medium text-[#665951]">{label}</div>{(type==="vendor"?vendors:services).map(item=><div key={item.id} className="border-b border-[#eee5df] p-5 text-sm leading-6 text-[#756960]">{(fn as any)(item)}</div>)}</div>)}</div></div></div>}
  </div></main>
}
