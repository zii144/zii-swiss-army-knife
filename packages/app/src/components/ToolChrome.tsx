import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Lang } from '../lib/i18n';
import type { NetworkKind } from '../lib/network';
import type { DisclaimerKind } from '../lib/tool-disclaimers';

export interface ToolChromeValue {
  offline: boolean;
  networkKind: NetworkKind;
  badgeLabel: string;
  disclaimerKind: DisclaimerKind | null;
  lang: Lang;
}

const ToolChromeContext = createContext<ToolChromeValue | null>(null);

export function ToolChromeProvider({
  value,
  children,
}: {
  value: ToolChromeValue;
  children: ReactNode;
}): React.JSX.Element {
  return <ToolChromeContext.Provider value={value}>{children}</ToolChromeContext.Provider>;
}

export function useToolChrome(): ToolChromeValue | null {
  return useContext(ToolChromeContext);
}
