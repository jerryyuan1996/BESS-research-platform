import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const commit = process.env.RELEASE_SHA || execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const root = resolve('.vercel/output/static');
const data = readdirSync('public/data/public').filter(f => f.endsWith('.json')).sort().map(file => ({
  file, sha256:createHash('sha256').update(readFileSync(resolve('public/data/public',file))).digest('hex'),
}));
writeFileSync(resolve(root,'release.json'),JSON.stringify({commit,builtAt:new Date().toISOString(),node:process.version,data},null,2));
