import { describe, it, expect } from 'vitest';
import { GOTENBERG_ROUTES } from '../src/gotenberg';

describe('GOTENBERG_ROUTES', () => {
  it('includes office → PDF and PDF → Word routes', () => {
    expect(GOTENBERG_ROUTES).toEqual(
      expect.arrayContaining([
        ['docx', 'pdf'],
        ['pptx', 'pdf'],
        ['pdf', 'docx'],
      ]),
    );
  });
});
