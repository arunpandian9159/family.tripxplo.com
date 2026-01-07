'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PackageDetail as PackageDetailType } from '@/lib/types';
import PackageDetail from '../_components/PackageDetail';
import Navbar from '@/app/components/Navbar';
import { useSearch } from '@/context/SearchContext';

interface PageProps {
  params: Promise<{ id: string }>;
}

function PackageDetailsContent({ params }: PageProps) {
  const router = useRouter();
  const { searchParams } = useSearch();
  const { id } = use(params);

  const [pkg, setPkg] = useState<PackageDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search params from context (tripxplo.com style - no URL params)
  const startDate = searchParams.startDate;
  const noAdult = searchParams.noAdult || 2;
  const noChild = searchParams.noChild || 0;
  const noRoomCount = searchParams.noRoomCount || 1;
  const noExtraAdult = searchParams.noExtraAdult || 0;

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build API URL with tripxplo.com compatible params
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.set('startDate', startDate);
        queryParams.set('noAdult', String(noAdult));
        queryParams.set('noChild', String(noChild));
        queryParams.set('noRoomCount', String(noRoomCount));
        queryParams.set('noExtraAdult', String(noExtraAdult));

        const response = await fetch(`/api/packages/${id}?${queryParams.toString()}`);
        const data = await response.json();

        if (data.success && data.data?.result?.[0]) {
          setPkg(data.data.result[0]);
        } else {
          setError(data.error || 'Package not found');
        }
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id, startDate, noAdult, noChild, noRoomCount, noExtraAdult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar staticMode />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#15ab8b]" />
            <p className="text-slate-500 font-medium">Loading package details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar staticMode />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Package Not Found</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            {error || 'The package you are looking for does not exist or may have been removed.'}
          </p>
          <button
            onClick={() => router.push('/destinations')}
            className="px-8 py-4 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white font-bold rounded-xl hover:from-[#0f8a6f] hover:to-[#15ab8b] transition-all shadow-lg shadow-emerald-500/25"
          >
            Browse All Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar staticMode />
      <PackageDetail pack={pkg} adults={noAdult} children={noChild} />
    </div>
  );
}

export default function PackageDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#15ab8b]" />
            <p className="text-slate-500 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <PackageDetailsContent params={params} />
    </Suspense>
  );
}
