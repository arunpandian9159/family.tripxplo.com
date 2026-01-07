import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api-client';

interface VehicleResponse {
  vehicleDetails: unknown[];
}

export const useAvailableCab = (
  packageId: string,
  destinationId: string,
  enabled: boolean = true
) => {
  const [cab, setCab] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const fetchData = useCallback(async () => {
    if (!packageId || !enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<VehicleResponse[]>(`packages/${packageId}/vehicles`);

      if (response.success && response.data) {
        const filteredCabs = response.data[0]?.vehicleDetails || [];
        setCab(filteredCabs as any);
      } else {
        setCab([]);
      }
    } catch (err: any) {
      setErr(err.message || 'An error occurred');
      setCab([]);
    } finally {
      setLoading(false);
    }
  }, [packageId, enabled]);

  useEffect(() => {
    if (packageId && enabled) {
      fetchData();
    }
  }, [fetchData, packageId, enabled]);

  return { cab, isLoading, err };
};
