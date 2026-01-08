import FilterHotelList from "./FilterHotelList";

const FilterHotel = () => {
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
      <h1 className="mb-[30px] text-[#5D6670] text-center font-Poppins text-[18px] font-semibold not-italic leading-normal tracking-[0.18px]">
        15 Hotels
      </h1>
      <div className=" ml-[20px] flex gap-[10px] overflow-x-auto whitespace-nowrap  p-2">
        {FilterCategories.map((category, index) => (
          <FilterHotelList key={index} label={category.label} />
        ))}
      </div>
    </>
  );
};

export default FilterHotel;
