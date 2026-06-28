/** The hello-tool implementation (default export, lazily loaded by the registry). */
export default function helloTool(name = 'world'): string {
  return `Hello, ${name}!`;
}
