export const formatMonthYearForLike = (month: number, year: number) => {
  const stringMonth = month.toString();

  const fullMonth = stringMonth.padStart(2, "0");

  const date = `${year}-${fullMonth}-__`;

  return date;
};
