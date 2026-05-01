const getDifferenceInMinutes = (startDate: Date, endDate: Date) => {
  const differenceInMs = endDate.getTime() - startDate.getTime();

  const differenceInMinutes = differenceInMs / (1000 * 60);

  return differenceInMinutes;
};

export { getDifferenceInMinutes };
