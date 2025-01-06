export const getRandomAQI = (min = 20, max = 180) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };