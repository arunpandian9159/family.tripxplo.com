'use client';
import React from 'react';
import CabInfo from './CabInfo';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAvailableHotels } from '@/app/hooks/useAvailableHotels';
import { useSelector } from 'react-redux';
import PackagesLoadingFull from '@/app/(user-area)/components/loading/PackagesLoadingFull';
import FilterCab from './FileterCab';
import { useAvailableCab } from '@/app/hooks/useAvailableCab';

const CabDetail = () => {
  const router = useRouter();
  function clickBack() {
    router.back();
  }
  const packageId = useSelector((store: any) => store.package.data?.packageId);
  const destinationId = useSelector(
    (store: any) => store.changeHotel?.replaceHotel?.location?.destinationId
  );
  const loading = useSelector((store: any) => store.package.isLoading);
  const cabChange = useAvailableCab(packageId, destinationId);

  return (
    <div className="">
      <section className="">
        <div
          className="fixed top-0 text-center flex items-center   w-full h-auto py-5 lg:py-10 bg-white z-10"
          style={{ boxShadow: '0px 4px 36.1px 0px rgba(190, 190, 190, 0.22)' }}
        >
          <span className="pl-4 lg:pl-6 flex items-center">
            <button onClick={clickBack}>
              <ArrowLeft className="h-[30px] w-[30px] text-[#FF5F5F]" />
            </button>
          </span>
          <h1
            className="text-center flex flex-wrap px-2 h-auto font-Poppins text-[18px] not-italic font-semibold leading-normal tracking-[0.18px]"
            style={{
              textShadow: '2px 4px 14.3px rgba(255, 120, 101, 0.20)',
              backgroundImage: 'linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Change Cab
          </h1>
        </div>
      </section>
      {cabChange?.isLoading || loading ? (
        <PackagesLoadingFull />
      ) : (
        <div className="pt-28">
          <FilterCab hotelCount={cabChange?.cab?.length} />
          <CabInfo cabData={cabChange?.cab} />
        </div>
      )}
    </div>
  );
};

export default CabDetail;
