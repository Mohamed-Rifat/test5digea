"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bell,
  CalendarHeart,
  ClipboardList,
  FilePenLine,
  GitCompare,
  Handshake,
  Heart,
  HeartHandshake,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

import { delay } from "./motion";

// ================================================================
// COPY (all text lives in locales/*/vendorOnboarding.ts)
// ================================================================

type IconType = typeof Heart;

interface Item {
  icon: IconType;
  title: TranslationKey;
  text: TranslationKey;
}

const STEPS: Item[] = [
  {
    icon: FilePenLine,
    title: "vendorOnboarding.about.step1Title",
    text: "vendorOnboarding.about.step1Text",
  },
  {
    icon: ShieldCheck,
    title: "vendorOnboarding.about.step2Title",
    text: "vendorOnboarding.about.step2Text",
  },
  {
    icon: LayoutDashboard,
    title: "vendorOnboarding.about.step3Title",
    text: "vendorOnboarding.about.step3Text",
  },
  {
    icon: Rocket,
    title: "vendorOnboarding.about.step4Title",
    text: "vendorOnboarding.about.step4Text",
  },
];

const BENEFITS: Item[] = [
  {
    icon: Users,
    title: "vendorOnboarding.about.benefitReachTitle",
    text: "vendorOnboarding.about.benefitReachText",
  },
  {
    icon: Award,
    title: "vendorOnboarding.about.benefitTrustTitle",
    text: "vendorOnboarding.about.benefitTrustText",
  },
  {
    icon: LayoutDashboard,
    title: "vendorOnboarding.about.benefitDashboardTitle",
    text: "vendorOnboarding.about.benefitDashboardText",
  },
  {
    icon: MessageSquareText,
    title: "vendorOnboarding.about.benefitReviewsTitle",
    text: "vendorOnboarding.about.benefitReviewsText",
  },
  {
    icon: Bell,
    title: "vendorOnboarding.about.benefitNotificationsTitle",
    text: "vendorOnboarding.about.benefitNotificationsText",
  },
  {
    icon: Handshake,
    title: "vendorOnboarding.about.benefitSupportTitle",
    text: "vendorOnboarding.about.benefitSupportText",
  },
];

const POLICIES: Item[] = [
  {
    icon: BadgeCheck,
    title: "vendorOnboarding.about.policyAccurateTitle",
    text: "vendorOnboarding.about.policyAccurateText",
  },
  {
    icon: ClipboardList,
    title: "vendorOnboarding.about.policyReviewTitle",
    text: "vendorOnboarding.about.policyReviewText",
  },
  {
    icon: HeartHandshake,
    title: "vendorOnboarding.about.policyRespectTitle",
    text: "vendorOnboarding.about.policyRespectText",
  },
  {
    icon: Star,
    title: "vendorOnboarding.about.policyReviewsTitle",
    text: "vendorOnboarding.about.policyReviewsText",
  },
];

const COUPLE_ACTIONS: { icon: IconType; text: TranslationKey }[] = [
  { icon: Search, text: "vendorOnboarding.about.couplesDiscover" },
  { icon: GitCompare, text: "vendorOnboarding.about.couplesCompare" },
  { icon: Heart, text: "vendorOnboarding.about.couplesFavorites" },
  { icon: CalendarHeart, text: "vendorOnboarding.about.couplesRoadmap" },
  { icon: Star, text: "vendorOnboarding.about.couplesReviews" },
];

const SUPPORT_EMAIL = "hello@5digea.com";

// ================================================================
// SMALL BUILDING BLOCKS
// ================================================================

const CARD =
  "rounded-4xl border border-[#e8dfd8] bg-white shadow-[0_10px_40px_rgba(48,37,31,0.04)]";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47e43] rtl:tracking-normal">
      {children}
    </p>
  );
}

function IconBadge({ icon: Icon }: { icon: IconType }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#faf5ee] text-[#a47e43] transition duration-300 group-hover:bg-[#30251f] group-hover:text-white">
      <Icon size={19} strokeWidth={1.8} />
    </span>
  );
}

/** Dark "who we are" card — first thing in both layouts. */
function WhoWeAre({ order = 0 }: { order?: number }) {
  const { t } = useLanguage();

  return (
    <section
      className="onb-rise relative overflow-hidden rounded-4xl bg-[#30251f] p-6 text-white shadow-[0_20px_60px_rgba(48,37,31,0.18)] sm:p-8"
      style={delay(order)}
    >
      <div className="pointer-events-none absolute -end-20 -top-24 h-64 w-64 rounded-full bg-[#b99a62]/15" />
      <div className="pointer-events-none absolute -bottom-28 -start-16 h-56 w-56 rounded-full border-30 border-white/5" />

      <div className="relative">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#d9bd85]">
          <Sparkles size={20} />
        </span>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c9ad78] rtl:tracking-normal">
          {t("vendorOnboarding.about.eyebrow")}
        </p>

        <h2 className="mt-2 font-serif text-2xl font-light sm:text-3xl">
          {t("vendorOnboarding.about.whoTitle")}
        </h2>

        <p className="mt-3 text-sm leading-7 text-white/75 sm:text-[15px] sm:leading-8">
          {t("vendorOnboarding.about.whoText")}
        </p>
      </div>
    </section>
  );
}

function TheIdea({ order = 0 }: { order?: number }) {
  const { t } = useLanguage();

  return (
    <section className={`onb-rise ${CARD} p-6 sm:p-8`} style={delay(order)}>
      <Eyebrow>{t("vendorOnboarding.about.eyebrow")}</Eyebrow>

      <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f]">
        {t("vendorOnboarding.about.ideaTitle")}
      </h2>

      <p className="mt-3 text-sm leading-7 text-[#756b65]">
        {t("vendorOnboarding.about.ideaText")}
      </p>

      <p className="mt-6 text-xs font-bold text-[#40352f]">
        {t("vendorOnboarding.about.couplesTitle")}
      </p>

      <ul className="mt-3 space-y-2.5">
        {COUPLE_ACTIONS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-[#5f544d]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#faf8f6] text-[#a47e43]">
              <Icon size={15} />
            </span>
            {t(text)}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The vendor's path with us. `horizontal` lays the four steps out as a row of
 * cards (full-width page); otherwise a vertical timeline that fits the form's
 * narrow side column.
 */
function StepsTimeline({
  order = 0,
  horizontal = false,
}: {
  order?: number;
  horizontal?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <section className={`onb-rise ${CARD} p-6 sm:p-8`} style={delay(order)}>
      <Eyebrow>{t("vendorOnboarding.about.stepsEyebrow")}</Eyebrow>

      <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f]">
        {t("vendorOnboarding.about.stepsTitle")}
      </h2>

      {horizontal ? (
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="onb-rise group relative overflow-hidden rounded-2xl border border-[#f0e9e4] bg-[#fcfaf8] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#dfd1c6] hover:bg-white hover:shadow-[0_12px_30px_rgba(48,37,31,0.07)]"
              style={delay(150 + index * 110)}
            >
              <span className="pointer-events-none absolute -end-2 -top-4 font-serif text-7xl font-light text-[#a47e43]/10">
                {index + 1}
              </span>

              <IconBadge icon={step.icon} />

              <p className="relative mt-4 text-sm font-semibold text-[#30251f]">
                {t(step.title)}
              </p>
              <p className="relative mt-1.5 text-xs leading-6 text-[#81746d]">
                {t(step.text)}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="mt-6">
          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;

            return (
              <li
                key={step.title}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {!isLast && (
                  <span className="absolute start-5.25 top-11 bottom-1 w-px bg-linear-to-b from-[#d9c9a8] to-transparent" />
                )}

                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#eadfce] bg-[#faf5ee] text-[#a47e43]">
                  <step.icon size={18} strokeWidth={1.8} />
                  <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#30251f] text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </span>

                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-[#30251f]">
                    {t(step.title)}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#81746d]">
                    {t(step.text)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function ItemGrid({
  items,
  columns,
}: {
  items: Item[];
  columns: string;
}) {
  const { t } = useLanguage();

  return (
    <div className={`mt-6 grid gap-3 ${columns}`}>
      {items.map((item, index) => (
        <div
          key={item.title}
          className="onb-rise group flex items-start gap-3.5 rounded-2xl border border-[#f0e9e4] bg-[#fcfaf8] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#dfd1c6] hover:bg-white hover:shadow-[0_12px_30px_rgba(48,37,31,0.07)]"
          style={delay(120 + index * 70)}
        >
          <IconBadge icon={item.icon} />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#30251f]">
              {t(item.title)}
            </p>
            <p className="mt-1 text-xs leading-6 text-[#81746d]">
              {t(item.text)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Benefits({
  order = 0,
  columns = "",
}: {
  order?: number;
  columns?: string;
}) {
  const { t } = useLanguage();

  return (
    <section className={`onb-rise ${CARD} p-6 sm:p-8`} style={delay(order)}>
      <Eyebrow>{t("vendorOnboarding.about.benefitsEyebrow")}</Eyebrow>

      <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f]">
        {t("vendorOnboarding.about.benefitsTitle")}
      </h2>

      <ItemGrid items={BENEFITS} columns={columns} />
    </section>
  );
}

function Policy({
  order = 0,
  columns = "",
}: {
  order?: number;
  columns?: string;
}) {
  const { t } = useLanguage();

  return (
    <section className={`onb-rise ${CARD} p-6 sm:p-8`} style={delay(order)}>
      <Eyebrow>{t("vendorOnboarding.about.policyEyebrow")}</Eyebrow>

      <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f]">
        {t("vendorOnboarding.about.policyTitle")}
      </h2>

      <ItemGrid items={POLICIES} columns={columns} />
    </section>
  );
}

function HelpCard({ order = 0 }: { order?: number }) {
  const { t } = useLanguage();

  return (
    <section
      className="onb-rise rounded-4xl border border-dashed border-[#d9ccc2] bg-[#faf5ee] p-6 sm:p-8"
      style={delay(order)}
    >
      <h2 className="font-serif text-xl font-light text-[#30251f]">
        {t("vendorOnboarding.about.helpTitle")}
      </h2>

      <p className="mt-2 text-sm leading-7 text-[#756b65]">
        {t("vendorOnboarding.about.helpText")}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/contact"
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#30251f] px-6 text-sm font-semibold text-white transition hover:bg-[#463831]"
        >
          {t("vendorOnboarding.about.helpCta")}
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
          />
        </Link>

        <p className="flex items-center gap-2 text-xs text-[#81746d]">
          <Mail size={14} className="shrink-0 text-[#a47e43]" />
          <span>{t("vendorOnboarding.about.helpEmailLabel")}</span>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            dir="ltr"
            className="font-semibold text-[#30251f] underline-offset-4 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}

// ================================================================
// LAYOUTS
// ================================================================

/** Narrow column shown beside the details form. */
export function AboutSidebar() {
  return (
    <aside className="space-y-6">
      <WhoWeAre order={150} />
      <TheIdea order={250} />
      <StepsTimeline order={350} />
      <Benefits order={450} columns="grid-cols-1" />
      <Policy order={550} columns="grid-cols-1" />
      <HelpCard order={650} />
    </aside>
  );
}

/** Full-width version shown under the "under review" status. */
export function AboutContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <WhoWeAre order={100} />
        <TheIdea order={200} />
      </div>

      <StepsTimeline order={100} horizontal />
      <Benefits order={100} columns="sm:grid-cols-2 lg:grid-cols-3" />
      <Policy order={100} columns="sm:grid-cols-2" />
      <HelpCard order={100} />
    </div>
  );
}
