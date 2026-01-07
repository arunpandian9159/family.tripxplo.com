import FilterCabList from "./FilterCabList";

const FilterCab = ({ hotelCount }: { hotelCount: number }) => {
  const FilterCategories = [
    {
      label: "Filter",
    },
    {
      label: "5",
    },
    {
      label: "4",
    },
    {
      label: "3",
    },
    {
      label: "Pool",
    },
    {
      label: "Lowest",
    },
  ];

  return (
    <>
      <h1 className="mb-[15px] lg:mt-7 text-[#5D6670] text-center font-Poppins text-[18px] lg:text-[30px] font-semibold not-italic leading-normal tracking-[0.18px]">
        Cabs Available
      </h1>
    </>
  );
};

export default FilterCab;
