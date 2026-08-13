import { describe, expect, it } from 'vitest';
import { LANGS } from '../src/lib/i18n';
import { LEGAL_VIEWS } from '../src/lib/legal';
import { legalDoc } from '../src/lib/legal-content';
import { networkKindFor } from '../src/lib/network';
import { getTool } from '../src/lib/catalog';
import { disclaimerFor } from '../src/lib/tool-disclaimers';

describe('legal content', () => {
  it('has a non-empty document for every view and language', () => {
    for (const view of LEGAL_VIEWS) {
      for (const lang of LANGS) {
        const doc = legalDoc(view, lang);
        expect(doc.title.length, `${view}/${lang} title`).toBeGreaterThan(0);
        expect(doc.sections.length, `${view}/${lang} sections`).toBeGreaterThan(0);
        for (const section of doc.sections) {
          expect(section.heading.length).toBeGreaterThan(0);
          expect(section.paragraphs.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('networkKindFor', () => {
  it('marks OCR as a one-time network tool', () => {
    expect(networkKindFor(getTool('ocr'))).toBe('network-once');
  });

  it('marks document conversion as an upload worker', () => {
    expect(networkKindFor(getTool('docx-to-pdf'))).toBe('upload');
  });

  it('keeps pdf-merge offline', () => {
    expect(networkKindFor(getTool('pdf-merge'))).toBe('offline');
  });

  it('keeps currency-convert offline (manual rate is the default path)', () => {
    expect(networkKindFor(getTool('currency-convert'))).toBe('offline');
  });
});

describe('tool disclaimers', () => {
  it('returns copy for every UI language', () => {
    for (const lang of LANGS) {
      expect(disclaimerFor('finance', lang).length).toBeGreaterThan(20);
      expect(disclaimerFor('id', lang).length).toBeGreaterThan(20);
    }
  });
});

