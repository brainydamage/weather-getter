/**
 * Creates an array of numbers (timestamps).
 * Array starts with the 'start' parameter, stops before the 'end' parameter
 * with the 'step' step.
 *
 * @param start - The start date, Unix timestamp in seconds
 * @param stop - The end date, Unix timestamp in seconds (not included)
 * @param step - The interval in seconds between dates in array
 * @returns An array of numbers (timestamps)
 */
export const generateRange = (start: number, stop: number,
                              step: number): number[] => {
  const length = Math.ceil((stop - start) / step);
  return Array.from({length}, (_, i) => start + i * step);
};