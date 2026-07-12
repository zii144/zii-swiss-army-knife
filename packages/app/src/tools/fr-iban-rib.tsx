import { useState } from 'react';
import { ribToIban, validateIban } from '@zii/id';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'RIB → IBAN',
    desc: 'Convert a French RIB (bank, branch, account, key) to an IBAN and verify MOD-97. On-device.',
    bank: 'Bank (5)',
    branch: 'Branch (5)',
    account: 'Account (11)',
    key: 'Key (2)',
    iban: 'IBAN',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
  },
  fr: {
    title: 'RIB → IBAN',
    desc: 'Convertit un RIB français en IBAN et vérifie le MOD-97. Sur l’appareil.',
    bank: 'Banque (5)',
    branch: 'Guichet (5)',
    account: 'Compte (11)',
    key: 'Clé (2)',
    iban: 'IBAN',
    valid: 'Valide ✓',
    invalid: 'Invalide ✗',
  },
};

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [bank, setBank] = useState('30004');
  const [branch, setBranch] = useState('00001');
  const [account, setAccount] = useState('00012345678');
  const [key, setKey] = useState('06');
  let iban = '';
  let ok: boolean | null = null;
  try {
    iban = ribToIban(bank, branch, account, key);
    ok = validateIban(iban);
  } catch {
    ok = false;
  }
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.bank}</span><TextField value={bank} onChange={(e) => setBank(e.target.value)} /></label>
        <label className="tool__field"><span>{t.branch}</span><TextField value={branch} onChange={(e) => setBranch(e.target.value)} /></label>
        <label className="tool__field"><span>{t.account}</span><TextField value={account} onChange={(e) => setAccount(e.target.value)} /></label>
        <label className="tool__field"><span>{t.key}</span><TextField value={key} onChange={(e) => setKey(e.target.value)} /></label>
      </div>
      {iban ? (
        <div className="tool__result"><div className="tool__stats">
          <div className="tool__stat"><span className="tool__stat-value" style={{ fontSize: '1rem' }}>{iban}</span><span className="tool__stat-label">{t.iban}</span></div>
          <div className="tool__stat"><span className="tool__stat-value">{ok ? t.valid : t.invalid}</span><span className="tool__stat-label">MOD-97</span></div>
        </div></div>
      ) : null}
    </ToolPage>
  );
}
