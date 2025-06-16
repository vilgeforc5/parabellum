export const getTimePeriod = (times = 10) => {
  const now = new Date();
  const ago = new Date(now.getTime() - 1000 * 60 * 60 * 24 * times);
  const timePeriod = `${ago.toLocaleDateString('ru-RU')} - ${now.toLocaleDateString('ru-RU')}`;

  return {
    now,
    timePeriod,
    ago,
  };
};
