/** QR payload builders for common scan types (Wi-Fi, vCard, calendar). */

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export interface WifiQrInput {
  ssid: string;
  password?: string;
  security?: WifiSecurity;
  hidden?: boolean;
}

/** Escape special characters in Wi-Fi QR fields. */
function escapeWifiField(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

/** Build a Wi-Fi network QR payload (WIFI:…). */
export function wifiQrPayload(input: WifiQrInput): string {
  const security = input.security ?? (input.password ? 'WPA' : 'nopass');
  const parts = [
    `T:${security}`,
    `S:${escapeWifiField(input.ssid)}`,
  ];
  if (security !== 'nopass' && input.password) {
    parts.push(`P:${escapeWifiField(input.password)}`);
  }
  if (input.hidden) parts.push('H:true');
  return `WIFI:${parts.join(';')};;`;
}

export interface VCardInput {
  fullName: string;
  phone?: string;
  email?: string;
  org?: string;
}

/** Build a vCard 3.0 payload. */
export function vcardQrPayload(input: VCardInput): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${input.fullName}`];
  if (input.org) lines.push(`ORG:${input.org}`);
  if (input.phone) lines.push(`TEL:${input.phone}`);
  if (input.email) lines.push(`EMAIL:${input.email}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

export interface EventQrInput {
  summary: string;
  start: string;
  end: string;
  location?: string;
}

function toIcalUtc(isoLocal: string): string {
  const d = new Date(isoLocal);
  if (Number.isNaN(d.getTime())) throw new Error('invalid date');
  const pad = (n: number): string => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Build a minimal iCalendar VEVENT payload. */
export function eventQrPayload(input: EventQrInput): string {
  const lines = [
    'BEGIN:VEVENT',
    `SUMMARY:${input.summary}`,
    `DTSTART:${toIcalUtc(input.start)}`,
    `DTEND:${toIcalUtc(input.end)}`,
  ];
  if (input.location) lines.push(`LOCATION:${input.location}`);
  lines.push('END:VEVENT');
  return lines.join('\n');
}
