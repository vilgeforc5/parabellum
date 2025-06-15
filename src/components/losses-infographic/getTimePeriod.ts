export const getTimePeriod = (times = 10) => {
  const now = new Date();
  const ago = new Date(now.getTime() - 1000 * 60 * 60 * 24 * times);
  const timePeriod = `${ago.toLocaleDateString()} - ${now.toLocaleDateString()}`;

  return {
    now,
    timePeriod,
    ago,
  };
};
