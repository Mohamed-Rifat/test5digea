"use client";

import { BriefcaseBusiness } from "lucide-react";
import { Badge } from "@mui/material";

import type { VendorServicesListState } from "./useVendorServicesList";

/** Count cards per status (click to filter). */
export function ServicesStats({ list }: { list: VendorServicesListState }) {
  const { services, loading } = list;

  return (
    <>
      {!loading && services.length > 0 && (
        <Badge
          badgeContent={services.length}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#a47e43",
              color: "white",
              fontWeight: 600,
              fontSize: "11px",
              height: 20,
              minWidth: 20,
              padding: "0 6px",
            },
          }}
        >
          <div className="h-8 w-8 rounded-full bg-[#f5eee9] flex items-center justify-center sm:h-10 sm:w-10">
            <BriefcaseBusiness
              size={14}
              className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
            />
          </div>
        </Badge>
      )}
    </>
  );
}
