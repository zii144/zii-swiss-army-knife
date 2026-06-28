import { describe, it, expect } from 'vitest';
import {
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toTitleCase,
  toSentenceCase,
  toUpperCase,
  toLowerCase,
} from '../src/index';

describe('toSnakeCase', () => {
  it('converts camelCase (golden anchor)', () => {
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
  });

  it('handles spaces and mixed separators', () => {
    expect(toSnakeCase('Hello World-foo')).toBe('hello_world_foo');
  });
});

describe('toCamelCase', () => {
  it('converts snake_case (golden anchor)', () => {
    expect(toCamelCase('hello_world')).toBe('helloWorld');
  });

  it('handles acronyms', () => {
    expect(toCamelCase('HTMLParser')).toBe('htmlParser');
  });
});

describe('toKebabCase', () => {
  it('converts camelCase to kebab', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world');
  });
});

describe('toTitleCase', () => {
  it('capitalizes each word', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });
});

describe('toSentenceCase', () => {
  it('capitalizes only the first word', () => {
    expect(toSentenceCase('hello WORLD foo')).toBe('Hello world foo');
  });
});

describe('toUpperCase', () => {
  it('upper-cases the string', () => {
    expect(toUpperCase('abc')).toBe('ABC');
  });
});

describe('toLowerCase', () => {
  it('lower-cases the string', () => {
    expect(toLowerCase('ABC')).toBe('abc');
  });
});

describe('empty input', () => {
  it('returns empty strings for empty input', () => {
    expect(toCamelCase('')).toBe('');
    expect(toSnakeCase('')).toBe('');
    expect(toKebabCase('')).toBe('');
    expect(toTitleCase('')).toBe('');
    expect(toSentenceCase('')).toBe('');
  });
});
