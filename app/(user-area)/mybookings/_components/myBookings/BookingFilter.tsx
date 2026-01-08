import BookingDetails from "./BookingDetails";
import BookingFilterCategory from "./BookingFilterCategory";
const BookingFilter = () => {
  const BookingFilter = [
    {
      label: "Filter",
    },
    {
      label: "Confirmed",
    },
    {
      label: "Failed",
    },
    {
      label: "Waiting",
    },
  ];
  return (
    <>
      <div className="mt-[150px] ml-[24px] flex gap-[10px] overflow-x-auto whitespace-nowrap  p-2">
        {BookingFilter.map((category, index) => (
          <BookingFilterCategory key={index} label={category.label} />
        ))}
      </div>
    </>
  );
};

export default BookingFilter;
