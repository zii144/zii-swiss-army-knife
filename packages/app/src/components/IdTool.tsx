import { useState } from 'react';
import { ToolPage } from './ToolPage';
import { Button, TextField } from './ui';
import type { Lang } from '../lib/i18n';

export interface IdToolProps {
  onBack: () => void;
  lang: Lang;
  backLabel: string;
  offlineLabel: string;
  title: string;
  description: string;
  /** Validator: raw string → is it valid. */
  validate: (value: string) => boolean;
  /** Optional generator producing a valid sample from a seed. */
  generate?: (seed: number) => string;
  placeholder?: string;
  /** Localized UI strings. */
  strings: { input: string; valid: string; invalid: string; generate: string };
}

/** Shared UI for an "enter a number → valid/invalid, or generate a sample" tool. */
export function IdTool({
  onBack,
  backLabel,
  offlineLabel,
  title,
  description,
  validate,
  generate,
  placeholder,
  strings,
}: IdToolProps): React.JSX.Element {
  const [value, setValue] = useState('');
  const trimmed = value.trim();
  const ok = trimmed ? validate(trimmed) : null;

  return (
    <ToolPage
      title={title}
      description={description}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{strings.input}</span>
        <TextField
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      {generate ? (
        <div className="tool__actions">
          <Button
            variant="ghost"
            onClick={() => setValue(generate(Math.floor(Math.random() * 1e9)))}
          >
            {strings.generate}
          </Button>
        </div>
      ) : null}
      {ok !== null ? (
        <div className="tool__result">
          <span
            className="app__badge"
            style={ok ? undefined : { background: '#f7c1c1', color: '#791f1f' }}
          >
            {ok ? strings.valid : strings.invalid}
          </span>
        </div>
      ) : null}
    </ToolPage>
  );
}
