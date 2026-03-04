import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  let pipe: CapitalizePipe;

  beforeEach(() => {
    pipe = new CapitalizePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if value is falsy', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should lowercase rest of the letters and capitalize first letters', () => {
    expect(pipe.transform('hElLo wORld')).toBe('Hello World');
  });

  it('should replace underscores and hyphens with spaces and capitalize words', () => {
    expect(pipe.transform('hello_world')).toBe('Hello World');
    expect(pipe.transform('hello-world')).toBe('Hello World');
    expect(pipe.transform('HELLO-WORLD')).toBe('Hello World');
  });

  it('should handle camelCase or PascalCase and capitalize words', () => {
    expect(pipe.transform('camelCaseExample')).toBe('Camel Case Example');
    expect(pipe.transform('PascalCaseExample')).toBe('Pascal Case Example');
  });
});
