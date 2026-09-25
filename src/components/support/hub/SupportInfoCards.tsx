"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Shield,
  User,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { SupportHubState } from "./useSupportHub";
import { Rich } from "@/components/support/hub/SupportBits";

/** Support hours + quick info. */
export function SupportInfoCards({ hub }: { hub: SupportHubState }) {
  const { t } = useLanguage();
  const { vendor, userInfo, user, isAuthenticated, isAdmin, isVendor, isUser } =
    hub;

  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
      {/* Support Hours */}

      <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#a47e43]" />

          <h3 className="font-semibold text-[#30251f]">
            {t("support.hours.title")}
          </h3>
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-[#756b65]">
          <p className="flex justify-between gap-4">
            <span>{t("support.hours.weekdays")}</span>

            <span className="font-medium text-[#30251f]">
              {t("support.hours.weekdayTime")}
            </span>
          </p>

          <p className="flex justify-between gap-4">
            <span>{t("support.hours.weekend")}</span>

            <span className="font-medium text-[#30251f]">
              {t("support.hours.closed")}
            </span>
          </p>

          <p className="flex justify-between gap-4 text-xs text-[#9a8d85]">
            <span>{t("support.hours.responseTime")}</span>

            <span className="font-medium text-emerald-600">
              {t("support.hours.responseValue")}
            </span>
          </p>
        </div>
      </div>

      {/* Quick Info */}

      <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-[#a47e43]" />

          <h3 className="font-semibold text-[#30251f]">
            {t("support.info.title")}
          </h3>
        </div>

        <div className="mt-3 space-y-2 text-sm">
          {isAdmin && (
            <>
              <p className="flex items-center gap-2 text-[#756b65]">
                <Shield className="h-4 w-4 text-purple-500" />

                <span>
                  <Rich
                    text={t("support.info.adminPrivileges")}
                    bold={t("support.info.adminBold")}
                  />
                </span>
              </p>
            </>
          )}

          {isVendor && (
            <>
              <p className="flex items-center gap-2 text-[#756b65]">
                <Building2 className="h-4 w-4 text-amber-500" />

                <span>
                  <Rich
                    text={t("support.info.vendor")}
                    bold={
                      vendor?.businessName ||
                      user?.fullName ||
                      t("support.info.vendorFallback")
                    }
                  />
                </span>
              </p>

              <p className="flex items-center gap-2 text-[#756b65]">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                <span>
                  <Rich
                    text={t("support.info.priority")}
                    bold={t("support.info.priorityBold")}
                  />
                </span>
              </p>
            </>
          )}

          {isUser && (
            <>
              <p className="flex items-center gap-2 text-[#756b65]">
                <User className="h-4 w-4 text-blue-500" />

                <span>
                  <Rich
                    text={t("support.info.welcomeBack")}
                    bold={userInfo.name}
                  />
                </span>
              </p>

              <p className="flex items-center gap-2 text-[#756b65]">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                <span>{t("support.info.standardSupport")}</span>
              </p>
            </>
          )}

          {!isAuthenticated && (
            <>
              <p className="flex items-center gap-2 text-[#756b65]">
                <User className="h-4 w-4 text-[#a47e43]" />

                <span>
                  <Rich
                    text={t("support.info.guestBrowsing")}
                    bold={t("support.info.guestBold")}
                  />
                </span>
              </p>

              <p className="flex items-center gap-2 text-[#756b65]">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                <span>{t("support.info.publicResources")}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
