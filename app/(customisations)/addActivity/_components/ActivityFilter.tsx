import AcitivtiyFilterCategory from "./ActivityFilterCategory";
const BookingFilter = () => {
  const BookingFilter = [
    {
      label: "Filter",
    },
    {
      label: "Trending",
    },
    {
      label: "Longest",
    },
    {
      label: "Lowest Price",
    },
  ];
  return (
    <>
      <div className="mt-[30px] ml-[24px] flex gap-[10px] overflow-x-auto whitespace-nowrap  p-2">
        {BookingFilter.map((category, index) => (
          <AcitivtiyFilterCategory key={index} label={category.label} />
        ))}
      </div>
    </>
  );
};

export default BookingFilter;
