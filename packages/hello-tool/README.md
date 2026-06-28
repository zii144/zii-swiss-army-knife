# @zii/hello-tool

A minimal sample tool used as the **M1 smoke test**: it registers into `@zii/registry` and is lazily
loaded on demand. It exists to prove the plugin pipeline end-to-end; later real tools follow the same
shape (metadata + lazy loader).

```ts
import { createRegistry } from '@zii/registry';
import { registerHelloTool } from '@zii/hello-tool';

const registry = createRegistry();
registerHelloTool(registry);
const hello = (await registry.load('hello')) as (name?: string) => string;
hello('Zii'); // "Hello, Zii!"
```
