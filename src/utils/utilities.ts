export const range = (start: number, stop: number, step: number) => {
  return Array.from({length: (stop - start) / step},
    (_, i) => start + i * step);
};