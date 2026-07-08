import { useRef, useState } from 'react';

export interface FileFieldProps {
  accept?: string;
  multiple?: boolean;
  /** Called with the chosen files (empty array if cleared). */
  onFiles: (files: File[]) => void;
  /** Button label, e.g. "Choose an image". */
  buttonLabel: string;
  /** Hint shown when no file is selected. */
  placeholder?: string;
}

/**
 * A design-consistent file picker — a styled button plus the chosen file name
 * (or count), wrapping a visually-hidden native input so it matches the UI.
 */
export function FileField({
  accept,
  multiple,
  onFiles,
  buttonLabel,
  placeholder,
}: FileFieldProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<string | null>(null);

  return (
    <div className="ui-file">
      <button type="button" className="ui-file__btn" onClick={() => inputRef.current?.click()}>
        <span className="ui-file__plus" aria-hidden="true">
          +
        </span>
        {buttonLabel}
      </button>
      <span className="ui-file__name">{summary ?? placeholder ?? ''}</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="ui-file__input"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          setSummary(
            files.length === 0
              ? null
              : files.length === 1
                ? files[0]!.name
                : `${files.length} files`,
          );
          onFiles(files);
        }}
      />
    </div>
  );
}
