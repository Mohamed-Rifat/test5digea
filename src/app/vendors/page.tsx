"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, GitCompare, Star } from "lucide-react";
import { searchVendors } from "@/features/vendors/api/vendors.api";
import { getCategories } from "@/services/categories.service";
import { addFavorite, getFavorites, removeFavorite } from "@/services/favorites.service";
import { FAVORITE_TARGET } from "@/types/favorite";
import type { Vendor, VendorSearchResponse } from "@/types/vendor";
import type { Category } from "@/types/category";
import VendorCard from "@/components/public/VendorCard";
import { useAuth } from "@/context/AuthContext";

function VendorsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategoryId = searchParams.get("categoryId") || "";
  const { isAuthenticated } = useAuth();
  const [data,setData]=useState<VendorSearchResponse>({items:[],totalCount:0,page:1,pageSize:12,totalPages:0});
  const [categories,setCategories]=useState<Category[]>([]);
  const [favorites,setFavorites]=useState<Set<string>>(new Set());
  const [q,setQ]=useState(""); const [categoryId,setCategoryId]=useState(initialCategoryId); const [location,setLocation]=useState(""); const [rating,setRating]=useState(""); const [page,setPage]=useState(1); const [loading,setLoading]=useState(true); const [selected,setSelected]=useState<string[]>([]);

  const load=async()=>{setLoading(true);try{setData(await searchVendors({searchTerm:q||undefined,categoryId:categoryId||undefined,location:location||undefined,minRating:rating?Number(rating):undefined,sortBy:0,page,pageSize:12}));}finally{setLoading(false)}};
  useEffect(()=>{getCategories().then(setCategories).catch(()=>{})},[]);
  useEffect(()=>{ const next = searchParams.get("categoryId") || ""; setCategoryId(next); setPage(1); },[searchParams]);
  useEffect(()=>{load().catch(()=>setLoading(false))},[q,categoryId,location,rating,page]);
  useEffect(()=>{if(isAuthenticated)getFavorites(FAVORITE_TARGET.VENDOR).then(x=>setFavorites(new Set(x.map(f=>f.targetId)))).catch(()=>{})},[isAuthenticated]);
  const toggleFavorite=async(id:string)=>{if(!isAuthenticated)return;const ex=favorites.has(id);setFavorites(p=>{const n=new Set(p);ex?n.delete(id):n.add(id);return n});try{ex?await removeFavorite({targetType:FAVORITE_TARGET.VENDOR,targetId:id}):await addFavorite({targetType:FAVORITE_TARGET.VENDOR,targetId:id})}catch{setFavorites(p=>{const n=new Set(p);ex?n.add(id):n.delete(id);return n})}};
  const toggle=(id:string)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):p.length<4?[...p,id]:p);
  const selectedCategory = categories.find(c => c.id === categoryId);
  const setCategory = (id:string) => { setPage(1); setCategoryId(id); const params = new URLSearchParams(searchParams.toString()); if (id) params.set("categoryId", id); else params.delete("categoryId"); router.replace(`/vendors${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false }); };

  return <main className="min-h-screen bg-[#faf8f6]"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">Marketplace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#30251f]">Meet your wedding vendors</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#81746d]">Explore businesses, ratings and specialties to find the team that fits your celebration.</p></div>
    <div className="rounded-2xl border border-[#eee5df] bg-white p-4 shadow-sm"><div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
      <label className="relative"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09289]"/><input value={q} onChange={e=>{setPage(1);setQ(e.target.value)}} placeholder="Search vendors..." className="h-11 w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] pl-10 pr-4 text-sm outline-none focus:border-[#8f7567]"/></label>
      <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] p-1.5"><button type="button" onClick={()=>setCategory("")} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${!categoryId?"bg-[#30251f] text-white":"text-[#665951] hover:bg-[#f0e8e2]"}`}>All</button>{categories.map(c=><button type="button" key={c.id} onClick={()=>setCategory(c.id)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${categoryId===c.id?"bg-[#a47e43] text-white shadow-sm":"text-[#665951] hover:bg-[#f0e8e2]"}`}>{c.name}</button>)}</div>
      <input value={location} onChange={e=>{setPage(1);setLocation(e.target.value)}} placeholder="Location" className="h-11 rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 text-sm outline-none"/>
      <select value={rating} onChange={e=>{setPage(1);setRating(e.target.value)}} className="h-11 rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 text-sm outline-none"><option value="">Any rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option></select>
      <button onClick={()=>{setQ("");setCategoryId("");setLocation("");setRating("");setPage(1)}} className="flex h-11 items-center justify-center rounded-xl border border-[#e3d9d1] px-4 text-[#665951]"><SlidersHorizontal size={16}/></button>
    </div></div>
    {selected.length>0&&<div className="my-5 flex items-center justify-between rounded-2xl bg-[#30251f] px-5 py-3 text-white"><span className="text-sm">{selected.length} vendors selected</span><Link href={`/compare?type=vendor&ids=${selected.join(",")}&categoryId=${categoryId}`} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#30251f]"><GitCompare size={15}/> Compare</Link></div>}
    <div className="mt-7 flex flex-col gap-2 text-sm text-[#81746d] sm:flex-row sm:items-center sm:justify-between"><span>{data.totalCount} vendors found</span>{selectedCategory ? <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f3eadf] px-3 py-1.5 text-xs font-semibold text-[#8c6a3c]">Category: {selectedCategory.name} <button type="button" onClick={()=>setCategory("")} className="text-[#a47e43]">×</button></span> : <span>Page {data.page||page} of {data.totalPages||1}</span>}</div>
    {loading?<div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(i=><div key={i} className="h-[390px] animate-pulse rounded-2xl bg-white border border-[#eee5df]"/>)}</div>:
    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.items.map(v=><div key={v.id} className="relative"><VendorCard vendor={v} favorite={favorites.has(v.id)} onFavorite={()=>toggleFavorite(v.id)}/><button onClick={()=>toggle(v.id)} className={`absolute bottom-5 left-5 rounded-lg border px-3 py-2 text-xs font-semibold ${selected.includes(v.id)?"border-[#30251f] bg-[#30251f] text-white":"border-[#e3d9d1] bg-white/95 text-[#514740]"}`}>{selected.includes(v.id)?"Selected":"Compare"}</button></div>)}</div>}
    {data.totalPages>1&&<div className="mt-8 flex justify-center gap-2">{Array.from({length:Math.min(data.totalPages,8)},(_,i)=>i+1).map(n=><button key={n} onClick={()=>setPage(n)} className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold ${page===n?"bg-[#30251f] text-white":"border border-[#e3d9d1] bg-white text-[#665951]"}`}>{n}</button>)}</div>}
  </div></main>
}

export default function VendorsPage() { return <Suspense fallback={null}><VendorsPageContent /></Suspense>; }
