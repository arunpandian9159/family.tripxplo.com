export function isDateWithinRanges(
  startDates: string[],
  endDates: string[],
  startDate: string,
  endDate: string
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let i = 0; i < startDates.length; i++) {
    const rangeStart = new Date(startDates[i]);
    const rangeEnd = new Date(endDates[i]);

    if (start >= rangeStart && end <= rangeEnd) {
      return true;
    }
  }
  return false;
}
