"use client";

import React from "react";
import {
  BarChart3,
  BadgeCheck,
  CalendarHeart,
  Camera,
  Check,
  Clock3,
  Crown,
  Heart,
  ImageIcon,
  MapPin,
  Rocket,
  Search,
  Sparkles,
  Star,
  Store,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Professional Profile",
    description:
      "Showcase your business, story, contact details, location and categories.",
  },
  {
    icon: Sparkles,
    title: "Service Management",
    description:
      "Create and manage your services with pricing, details, categories and status.",
  },
  {
    icon: ImageIcon,
    title: "Portfolio & Images",
    description:
      "Show couples your best work with professional service and portfolio images.",
  },
  {
    icon: Search,
    title: "Get Discovered",
    description:
      "Make your business and services discoverable to couples searching on Digea.",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description:
      "Build trust through customer ratings and reviews on your business and services.",
  },
  {
    icon: Heart,
    title: "Favorites",
    description:
      "Let couples save your business and services while planning their wedding.",
  },
  {
    icon: BarChart3,
    title: "Vendor Dashboard",
    description:
      "Manage your profile, services and business activity from one place.",
  },
  {
    icon: MapPin,
    title: "Business Location",
    description:
      "Help couples find you with your location and business contact information.",
  },
  {
    icon: Users,
    title: "Reach Couples",
    description:
      "Put your services in front of couples looking for wedding vendors.",
  },
];

const trialBenefits = [
  "Full Premium access",
  "Professional vendor profile",
  "Service & portfolio management",
  "Customer ratings & reviews",
  "Business discovery",
  "Favorites & shortlisting",
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#faf8f6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-full">

        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#e8dcd6] bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8b6255] text-white">
              <Crown className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-medium text-[#8b756c]">
                Current Access
              </p>

              <p className="text-sm font-bold text-[#352823]">
                Premium Trial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#fbf1ed] px-3 py-1.5 text-xs font-semibold text-[#805e52]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active · Free
          </div>
        </div>


        <section className="relative overflow-hidden rounded-[28px] border border-[#e7dcd7] bg-white px-5 py-8 shadow-[0_15px_45px_rgba(66,45,38,0.06)] sm:px-8 sm:py-10">

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#f1e3de] opacity-70 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_320px]">

            {/* Left */}

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e6d6cf] bg-[#fcf6f3] px-3 py-1.5 text-xs font-semibold text-[#89665a]">
                <Heart className="h-3.5 w-3.5 fill-current" />
                Digea Success Partner
              </div>

              <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#332722] sm:text-4xl">
                Experience Digea
                <span className="block text-[#986b5c]">
                  Premium — Free for a Limited Time
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#766760] sm:text-base">
                You&apos;re one of our success partners. During your limited
                free trial, you have full Premium access to showcase your
                business, manage your services, and reach couples on Digea.
              </p>


              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {trialBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 text-sm text-[#5f4d46]"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2e5df] text-[#916557]">
                      <Check className="h-3 w-3" />
                    </div>

                    {benefit}
                  </div>
                ))}
              </div>

            </div>


            <div className="rounded-2xl border border-[#e7d9d3] bg-[#fcfaf9] p-5">

              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9a6d5d]">
                <Clock3 className="h-4 w-4" />
                Limited Free Trial
              </div>

              <div className="mt-4">
                <p className="text-3xl font-bold text-[#352823]">
                  Premium
                </p>

                <p className="mt-1 text-sm text-[#85746d]">
                  Full access · No charge during trial
                </p>
              </div>

              <div className="my-5 h-px bg-[#e7dcd7]" />

              <div className="space-y-3 text-sm">

                <div className="flex items-center justify-between">
                  <span className="text-[#8a7972]">
                    Current plan
                  </span>

                  <span className="font-semibold text-[#4a3831]">
                    Premium Trial
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8a7972]">
                    Price today
                  </span>

                  <span className="font-semibold text-emerald-600">
                    Free
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8a7972]">
                    Access
                  </span>

                  <span className="font-semibold text-[#4a3831]">
                    Full Premium
                  </span>
                </div>

              </div>

              <div className="mt-5 rounded-xl bg-[#f1e5e0] px-3 py-2.5 text-center">
                <p className="text-xs text-[#7c6257]">
                  Your trial is temporary. A subscription will be required
                  after it ends.
                </p>
              </div>

            </div>
          </div>
        </section>


        <section className="py-9">

          <div className="flex flex-col gap-4 rounded-2xl border border-[#e8dcd6] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbf0ec] text-[#916557]">
                <BadgeCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-[#382b26]">
                  We&apos;re partners in your success.
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#796a63]">
                  Use your trial to build your presence, showcase your work,
                  and experience the tools Digea provides to help your
                  business get discovered.
                </p>
              </div>

            </div>

            <div className="shrink-0 text-left sm:text-right">
              <p className="text-xs text-[#9a8981]">
                During your trial
              </p>

              <p className="mt-1 text-sm font-bold text-[#8b6255]">
                Premium features are unlocked
              </p>
            </div>

          </div>
        </section>


        <section>

          <div className="mb-5 flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a6d5d]">
                What&apos;s Included
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#352823] sm:text-3xl">
                Everything you need to grow on Digea
              </h2>
            </div>

            <div className="hidden items-center gap-1.5 text-xs text-[#8b7971] sm:flex">
              <Sparkles className="h-3.5 w-3.5 text-[#9a6d5d]" />
              Premium Trial
            </div>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-[#e9ded9] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d7c0b6] hover:shadow-[0_10px_30px_rgba(67,46,39,0.06)]"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbf1ed] text-[#916557] transition-colors group-hover:bg-[#8b6255] group-hover:text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#3b2d28]">
                        {feature.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-6 text-[#7c6c65]">
                        {feature.description}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        </section>

        <section className="mt-10">

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a6d5d]">
              How It Works
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#352823]">
              Your Digea journey
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">


            <div className="relative rounded-2xl border border-[#e9ded9] bg-white p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b6255] text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#3b2d28]">
                    Enjoy Premium
                  </h3>

                  <p className="text-xs text-[#8a7972]">
                    Free during your trial
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-6 text-[#786963]">
                Explore Digea with full Premium access and use all available
                vendor features.
              </p>

            </div>


            <div className="relative rounded-2xl border border-[#e9ded9] bg-white p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b6255] text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#3b2d28]">
                    Build Your Presence
                  </h3>

                  <p className="text-xs text-[#8a7972]">
                    Showcase your business
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-6 text-[#786963]">
                Add your services, images, business information and build
                trust through reviews and ratings.
              </p>

            </div>

            <div className="relative rounded-2xl border border-[#e9ded9] bg-white p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b6255] text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#3b2d28]">
                    Choose Your Plan
                  </h3>

                  <p className="text-xs text-[#8a7972]">
                    After your trial
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-6 text-[#786963]">
                When your free trial ends, choose a subscription plan to
                continue using Premium features.
              </p>

            </div>

          </div>
        </section>

        <section className="mt-10">

          <div className="overflow-hidden rounded-2xl border border-[#e3d5ce] bg-[#382b26]">

            <div className="grid gap-0 lg:grid-cols-[1fr_auto]">

              <div className="p-6 sm:p-7">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <CalendarHeart className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                      After Your Trial
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      Your Premium access will become subscription-based.
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                      Your free trial is designed to let you experience Digea
                      before committing. When the trial period ends, you can
                      select the subscription plan that works best for your
                      business.
                    </p>

                  </div>

                </div>

              </div>

              <div className="flex items-center border-t border-white/10 bg-white/5 px-6 py-5 lg:border-l lg:border-t-0">

                <div>
                  <p className="text-xs text-white/45">
                    Current access
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-sm font-bold text-white">
                      Premium Trial
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-white/45">
                    No payment required during trial
                  </p>
                </div>

              </div>

            </div>
          </div>

        </section>

        <section className="py-10 text-center">

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#8b6255] text-white">
            <Rocket className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-[#352823] sm:text-2xl">
            Make the most of your Premium trial.
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#786963]">
            Build your profile, showcase your work, connect with couples,
            and discover what Digea can do for your business.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8b6255]">
            <Heart className="h-4 w-4 fill-current" />
            We&apos;re partners in your success.
          </div>

        </section>

      </div>
    </main>
  );
}