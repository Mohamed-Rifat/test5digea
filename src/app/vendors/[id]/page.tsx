"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, MapPin, Star, Phone, Mail, Clock3, BriefcaseBusiness } from "lucide-react";
import { useParams } from "next/navigation";
import { getVendor } from "@/features/vendors/api/vendors.api";
import { getServices } from "@/services/services.service";
import { addFavorite, getFavorites, removeFavorite } from "@/services/favorites.service";
import { FAVORITE_TARGET } from "@/types/favorite";
import type { Vendor } from "@/types/vendor";
import type { Service } from "@/types/service";
import { useAuth } from "@/context/AuthContext";
import ServiceCard from "@/components/public/ServiceCard";

export default function VendorDetailsPage() {
  const {id}=useParams<{id:string}>(); const {isAuthenticated}=useAuth(); const [vendor,setVendor]=useState<Vendor|null>(null); const [services,setServices]=useState<Service[]>([]); const [favorite,setFavorite]=useState(false); const [loading,setLoading]=useState(true);
  useEffect(()=>{Promise.all([getVendor(id),getServices({vendorId:id})]).then(([v,s])=>{setVendor(v);setServices(s)}).finally(()=>setLoading(false));if(isAuthenticated)getFavorites(FAVORITE_TARGET.VENDOR).then(x=>setFavorite(x.some(f=>f.targetId===id))).catch(()=>{})},[id,isAuthenticated]);
  const toggle=async()=>{if(!isAuthenticated)return;const next=!favorite;setFavorite(next);try{next?await addFavorite({targetType:FAVORITE_TARGET.VENDOR,targetId:id}):await removeFavorite({targetType:FAVORITE_TARGET.VENDOR,targetId:id})}catch{setFavorite(!next)}};
  if(loading)return <main className="min-h-screen bg-[#faf8f6] p-10"><div className="mx-auto max-w-6xl h-96 animate-pulse rounded-3xl bg-white"/></main>;
  if(!vendor)return <main className="min-h-screen bg-[#faf8f6] py-20 text-center"><h1 className="text-2xl font-semibold">Vendor not found</h1></main>;
  return <main className="min-h-screen bg-[#faf8f6]"><div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><Link href="/vendors" className="inline-flex items-center gap-2 text-sm text-[#756960]"><ArrowLeft size={16}/> Back to vendors</Link>
    <section className="mt-6 overflow-hidden rounded-3xl border border-[#eee5df] bg-white shadow-sm"><div className="h-72 bg-[#eee4dd]">{vendor.profileImageUrl?<img src={vendor.profileImageUrl} alt={vendor.businessName} className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-6xl text-[#ad998c]">✦</div>}</div><div className="p-7 sm:p-10"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#9b8171]">Wedding vendor</p><h1 className="mt-2 text-3xl font-semibold text-[#30251f] sm:text-4xl">{vendor.businessName}</h1><p className="mt-2 text-[#81746d]">{vendor.slogan}</p></div><button onClick={toggle} className={`flex h-11 w-11 items-center justify-center rounded-xl border ${favorite?"border-[#30251f] bg-[#30251f] text-white":"border-[#e3d9d1] text-[#665951]"}`}><Heart size={19} fill={favorite?"currentColor":"none"}/></button></div>
    <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#665951]"><span className="flex items-center gap-1.5 rounded-full bg-[#faf5f1] px-3 py-2"><Star size={15} fill="currentColor"/> {Number(vendor.averageRating||0).toFixed(1)} ({vendor.reviewsCount||0})</span><span className="flex items-center gap-1.5 rounded-full bg-[#faf5f1] px-3 py-2"><MapPin size={15}/>{vendor.location||"Location not specified"}</span></div>
    <p className="mt-7 max-w-3xl leading-7 text-[#756960]">{vendor.bio || "A professional wedding business ready to help make your celebration unforgettable."}</p>
    <div className="mt-7 grid gap-3 sm:grid-cols-2">{vendor.contactPhone&&<a href={`tel:${vendor.contactPhone}`} className="rounded-xl border border-[#eee5df] p-4 text-sm"><Phone size={16} className="mb-2 text-[#9b8171]"/>{vendor.contactPhone}</a>}{vendor.contactEmail&&<a href={`mailto:${vendor.contactEmail}`} className="rounded-xl border border-[#eee5df] p-4 text-sm"><Mail size={16} className="mb-2 text-[#9b8171]"/>{vendor.contactEmail}</a>}</div>
    </div></section>
    <section className="py-12"><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#9b8171]">What they offer</p><h2 className="mt-2 text-2xl font-semibold">Services</h2></div></div>{services.length?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map(s=><ServiceCard key={s.id} service={s}/>)}</div>:<div className="rounded-2xl border border-dashed border-[#ded3cb] bg-white p-12 text-center text-sm text-[#81746d]">No public services yet.</div>}</section>
  </div></main>
}
