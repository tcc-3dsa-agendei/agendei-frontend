import { registerHooks } from "node:module"
import { fileURLToPath } from "node:url"
import ts from "typescript"

// Node strips .ts types natively. Reuse the installed TypeScript compiler for JSX
// and mirror the application's @/* alias without changing production modules.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context)
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (!url.endsWith(".tsx")) return nextLoad(url, context)
    const loaded = nextLoad(url, { ...context, format: "module" })
    return {
      ...loaded,
      source: ts.transpileModule(String(loaded.source), {
        fileName: fileURLToPath(url),
        compilerOptions: {
          target: ts.ScriptTarget.ES2023,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
          inlineSourceMap: true,
          inlineSources: true
        }
      }).outputText
    }
  }
})
