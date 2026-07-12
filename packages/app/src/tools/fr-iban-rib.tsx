import { useState } from 'react';
import { ribToIban, validateIban } from '@zii/id';
import { ToolPage } from '../components/ToolPage';
import { TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'French RIB → IBAN',
    desc: 'Build and validate a French IBAN from bank, branch, account and RIB key. On-device.',
    bank: 'Bank code (5)',
    branch: 'Branch (5)',
    account: 'Account (11)',
    key: 'RIB key (2)',
    iban: 'IBAN',
    valid: 'Valid IBAN ✓',
    invalid: 'Invalid',
    convert: 'Convert',
  },
};

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [bank, setBank] = useState('20041');
  const [branch, setBranch] = useState('01005');
  const [account, setAccount] = useState('0500013M026');
  const [key, setKey] = useState('06');
  const [iban, setIban] = useState('');

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.bank}</span>
          <TextField value={bank} onChange={(e) => setBank(e.target.value)} /></label>
        <label className="tool__field"><span>{t.branch}</span>
          <TextField value={branch} onChange={(e) => setBranch(e.target.value)} /></label>
      </div>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.account}</span>
          <TextField value={account} onChange={(e) => setAccount(e.target.value)} /></label>
        <label className="tool__field"><span>{t.key}</span>
          <TextField value={key} onChange={(e) => setKey(e.target.value)} /></label>
      </div>
      <Button onClick={() => setIban(ribToIban(bank, branch, account, key) ?? '')}>{t.convert}</Button>
      {iban ? (
        <div className="tool__result">
          <p><strong>{t.iban}:</strong> {iban}</p>
          <p>{validateIban(iban) ? t.valid : t.invalid}</p>
        </div>
      ) : null}
    </ToolPage>
  );
}
