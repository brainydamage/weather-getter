import {generateRange} from './utilities';

describe('generateRange', () => {
  const start = 1719525600;
  const startPlus2days = 1719698400;
  const startPlus2daysAnd1hour = 1719702000;
  const startPlus4Days = 1719871200;
  const step12hours = 43200;
  const step22hours = 79200;
  const step24hours = 86400;
  const step48hours = 172800;


  describe('Basic cases', () => {
    it('should generate a range of timestamps with given step', () => {
      expect(generateRange(start, startPlus2days, step24hours)).toEqual([
        1719525600,
        1719612000,
      ]);
    });

    it('should generate an empty array if start is equal to stop', () => {
      expect(generateRange(start, start, step24hours)).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should handle steps that do not perfectly divide the range', () => {
      expect(generateRange(start, startPlus2daysAnd1hour, step22hours)).toEqual([
        1719525600,
        1719604800,
        1719684000,
      ]);
    });

    it('should handle ranges with a large step value', () => {
      expect(generateRange(start, startPlus4Days, step48hours)).toEqual([
        1719525600,
        1719698400,
      ]);
    });

    it('should handle steps less than one day', () => {
      expect(generateRange(start, startPlus2days, step12hours)).toEqual([
        1719525600,
        1719568800,
        1719612000,
        1719655200,
      ]);
    });
  });
});