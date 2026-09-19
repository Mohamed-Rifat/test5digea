// ============================================================
// Vendor applications ("Join us" form)
// ============================================================
// The backend endpoint for this doesn't exist yet. Once it's ready:
//
//   1. Replace the request/response shape below with whatever the real
//      API expects/returns (this is a best guess based on the form).
//   2. Uncomment the real `api.post(...)` call inside
//      `submitVendorApplication` and delete the simulated block under
//      "TEMPORARY" beneath it.
//
// Nothing else in the page needs to change — it already calls
// `submitVendorApplication` and just awaits the result.

// Once the real endpoint exists, add this import back:
// import api from "@/lib/axios";

export interface VendorApplicationRequest {
  fullName: string;
  whatsappNumber: string;
  personalEmail: string;
  brandName: string;
  categoryIds: string[];
  governorate: string;
}

export const submitVendorApplication = async (
  data: VendorApplicationRequest
): Promise<void> => {
  // Referenced so lint doesn't flag it as unused until the real call
  // below is uncommented and actually sends it.
  void data;

  // TODO: swap in the real endpoint once it exists on the backend, e.g.:
  // await api.post("/api/VendorApplications", data);

  // --- TEMPORARY: no backend endpoint yet, simulate a network call so
  // the form's loading/success states work while it's being built ---
  await new Promise((resolve) => setTimeout(resolve, 700));
};