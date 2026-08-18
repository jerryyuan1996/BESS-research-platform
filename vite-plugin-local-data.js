/* ---------------------------------------------------------------------------
   LOCAL-DATA PLUGIN — confidential payloads reach the dev server and never the
   production bundle.

   Two public stub modules under src/local/ are REPLACED at resolve/load time:

     src/local/payload.js           the JSON datasets
     src/local/portfolioSection.js  a whole confidential section module

     vite (serve)   substituted with the real content from local-data/
     vite build     left as their public stubs, unconditionally

   The stubs are real files rather than `virtual:` specifiers because plain Node
   imports this tree in the test suite, and Vite virtual modules do not exist
   outside Vite.

   Why a plugin rather than `import.meta.env.DEV` around an `import.meta.glob`:
   that approach relies on Vite's define-replacement followed by Rollup
   tree-shaking to drop the branch. It usually works. "Usually works" is an
   acceptable basis for a performance optimisation and an unacceptable one for
   keeping a named project's financial model out of a public website — the failure
   is silent, and the thing that leaks is the thing you were trying to protect.

   Here the build path never has the data to begin with. There is no branch to
   eliminate and nothing to get wrong.

   local-data/ is git-ignored (see .gitignore). Absence is the normal case: a
   fresh clone has no local data and the site renders its public layer with the
   confidential blocks withheld.
   --------------------------------------------------------------------------- */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PAYLOAD_STUB = 'src/local/payload.js';

/* A second virtual module, for a whole SECTION that is confidential rather than
   a dataset that is.

   The WA Portfolio tab is the case this exists for. Externalising its values
   would not have been enough: its prose carries the project name, the site
   address, the capital structure and the model's own audit exception, all as
   string literals. Gating the render leaves every one of them in the bundle,
   because a bundler ships a function's strings whether or not it is called.

   So the module itself lives in local-data/ and this resolves to it in serve
   mode, or to a null export in a build. The public tree keeps only a shim that
   renders a "withheld" card. */
const SECTION_STUB = 'src/local/portfolioSection.js';
const SECTION_FILE = 'wa-portfolio-section.js';

/* A third substitution, and the one that generalises the pattern: N confidential
   project dossiers rather than one hardcoded section.

   Each file in local-data/dossiers/ default-exports a dossier. The stub becomes
   an index that imports them by absolute path — real modules Vite can resolve in
   serve mode, and nothing the bundler ever sees in a build. */
const DOSSIER_STUB = 'src/local/dossiers.js';
const DOSSIER_DIR = 'dossiers';

export default function localData({ dir = 'local-data' } = {}){
  let isBuild = false;
  let root = process.cwd();

  return {
    name: 'bess-local-data',

    /* 'pre' so resolveId and load run BEFORE Vite's own resolver. Without it
       Vite resolves src/local/*.js to the public stubs first and the redirect
       never fires — the dev server silently showed the withheld card while the
       confidential files sat right there. */
    enforce: 'pre',

    configResolved(config){
      isBuild = config.command === 'build';
      root = config.root || root;
    },

    resolveId(id, importer){

      /* Redirect the public stub to the confidential section — in serve mode
         only, and only when that file is actually present.

         Done in the RESOLVER rather than as a branch inside a module, so nothing
         the bundler can see ever references the confidential file. The stub it
         replaces is a real file (src/local/portfolioSection.js) exporting null,
         which is what lets plain Node import the market registry: an earlier
         version used a `virtual:` specifier and broke every test that reached
         the WA dashboard, because Vite virtual modules do not exist in Node. */
      if (!isBuild && id.endsWith('portfolioSection.js') && importer){
        const stub = path.resolve(root, SECTION_STUB);
        const target = path.resolve(path.dirname(importer), id);
        if (samePath(target, stub)){
          const real = path.resolve(root, dir, SECTION_FILE);
          if (existsSync(real)) return real;
        }
      }
      return null;
    },

    async load(id){
      /* Substitute the payload stub's contents. Matching on the resolved path
         means the module stays a real file that Node can import, while Vite sees
         generated code carrying the datasets. */
      /* Dossiers first — a separate stub with a different shape.

         The generated module IMPORTS each dossier by absolute path rather than
         inlining it. They are real ES modules with their own imports, not JSON,
         so inlining would mean re-implementing module resolution; and letting
         Vite resolve them keeps hot-reload working when one is edited. */
      if (samePath(id, path.resolve(root, DOSSIER_STUB))){
        const empty = 'export const DOSSIERS = [];\nexport const AVAILABLE = false;\nexport default DOSSIERS;\n';
        if (isBuild) return empty;

        const dossierDir = path.resolve(root, dir, DOSSIER_DIR);
        if (!existsSync(dossierDir)) return empty;

        const files = (await readdir(dossierDir)).filter(n => n.endsWith('.js')).sort();
        if (!files.length) return empty;

        this.info?.(`local-data: loaded ${files.length} dossier(s) for development only`);
        const imports = files
          .map((name, i) => `import d${i} from ${JSON.stringify(path.join(dossierDir, name))};`)
          .join('\n');
        const names = files.map((_, i) => `d${i}`).join(', ');
        return `${imports}\nexport const DOSSIERS = [${names}];\n`
          + 'export const AVAILABLE = true;\nexport default DOSSIERS;\n';
      }

      if (!samePath(id, path.resolve(root, PAYLOAD_STUB))) return null;

      // The whole point: in a build there is no code path that reads the files.
      if (isBuild){
        return 'export default {};\nexport const AVAILABLE = false;\n';
      }

      const abs = path.resolve(root, dir);
      if (!existsSync(abs)){
        return 'export default {};\nexport const AVAILABLE = false;\n';
      }

      const payload = {};
      for (const name of await readdir(abs)){
        if (!name.endsWith('.json')) continue;
        const key = name.replace(/\.json$/, '');
        try {
          payload[key] = JSON.parse(await readFile(path.join(abs, name), 'utf8'));
        } catch (err){
          this.warn(`local-data: ${name} is not valid JSON — skipped (${err.message})`);
        }
      }

      const keys = Object.keys(payload);
      if (keys.length > 0){
        this.info?.(`local-data: loaded ${keys.length} dataset(s) for development only — ${keys.join(', ')}`);
      }

      return `export default ${JSON.stringify(payload)};\n`
        + `export const AVAILABLE = ${keys.length > 0};\n`;
    },

    /* Restart the dev server's module graph when a local file changes, so editing
       a confidential dataset behaves like editing source. */
    configureServer(server){
      const abs = path.resolve(root, dir);
      server.watcher.add(abs);
      const invalidate = (file) => {
        if (!file.startsWith(abs)) return;
        for (const stub of [PAYLOAD_STUB, DOSSIER_STUB]){
          const mod = server.moduleGraph.getModuleById(path.resolve(root, stub));
          if (mod) server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', invalidate);
      server.watcher.on('change', invalidate);
      server.watcher.on('unlink', invalidate);
    },
  };
}

/** Case-insensitive path comparison on Windows, exact elsewhere. */
function samePath(a, b){
  return process.platform === 'win32'
    ? path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase()
    : path.resolve(a) === path.resolve(b);
}
