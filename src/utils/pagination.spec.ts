import { createPaginationResult, getSkip } from './pagination';

describe('Pagination Utils', () => {
  describe('createPaginationResult', () => {
    it('should create correct pagination result', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = createPaginationResult(data, 10, 1, 5);

      expect(result.data).toEqual(data);
      expect(result.total).toBe(10);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(2);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrev).toBe(false);
    });

    it('should report hasPrev on page > 1', () => {
      const result = createPaginationResult([], 10, 2, 5);
      expect(result.hasPrev).toBe(true);
      expect(result.hasNext).toBe(false);
    });

    it('should handle empty data', () => {
      const result = createPaginationResult([], 0, 1, 10);
      expect(result.totalPages).toBe(0);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(false);
    });
  });

  describe('getSkip', () => {
    it('should calculate skip for page 1', () => {
      expect(getSkip(1, 10)).toBe(0);
    });

    it('should calculate skip for page 3 with limit 5', () => {
      expect(getSkip(3, 5)).toBe(10);
    });
  });
});
