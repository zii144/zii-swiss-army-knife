import type { ToolMeta, ToolRegistry } from '@zii/registry';

export const helloToolMeta: ToolMeta = {
  id: 'hello',
  name: 'Hello Tool',
  category: 'dev',
  markets: ['global'],
  offline: true,
  keywords: ['demo', 'sample', 'hello'],
};

/** Register the sample tool, lazily loading its implementation on demand. */
export function registerHelloTool(registry: ToolRegistry): void {
  registry.register(helloToolMeta, () => import('./hello'));
}
