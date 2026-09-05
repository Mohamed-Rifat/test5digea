import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getAdminVendorsList,
} from "@/services/vendors.service";

import type { Vendor } from "@/types/vendor";

interface UseAdminVendorsReturn {
    vendors: Vendor[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useAdminVendors =
    (): UseAdminVendorsReturn => {
        const [vendors, setVendors] = useState<Vendor[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(
            null
        );

        const fetchVendors = useCallback(async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getAdminVendorsList();
                setVendors(data);
            } catch (error) {
setError(
                    "Failed to load vendors."
                );
            } finally {
                setLoading(false);
            }
        }, []);

        useEffect(() => {
            fetchVendors();
        }, [fetchVendors]);

        return {
            vendors,
            loading,
            error,
            refetch: fetchVendors,
        };
    };