import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return full text when within limit', () => {
    const result = pipe.transform('Short text', 100);
    expect(result).toBe('Short text');
  });

  it('should not truncate text equal to the limit', () => {
    const result = pipe.transform('Hello', 5);
    expect(result).toBe('Hello');
  });

  it('should truncate text that exceeds the limit', () => {
    const result = pipe.transform('Hello World', 5);
    expect(result).toBe('Hello...');
  });

  it('should use the default limit of 100', () => {
    const longText = 'a'.repeat(150);
    const result = pipe.transform(longText);
    expect(result.length).toBe(103); // 100 chars + '...'
    expect(result.endsWith('...')).toBe(true);
  });

  it('should use a custom ellipsis string', () => {
    const result = pipe.transform('Hello World', 5, ' [more]');
    expect(result).toBe('Hello [more]');
  });

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return empty string for null input', () => {
    expect(pipe.transform(null as any)).toBe('');
  });

  it('should return empty string for undefined input', () => {
    expect(pipe.transform(undefined as any)).toBe('');
  });
});
