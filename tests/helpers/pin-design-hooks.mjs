/* Off-thread module hooks for tests/helpers/pin-design.mjs on Node versions without
   module.registerHooks(): send src/briefing/designData.js to the pin. */
let pinnedUrl = null;
let target = null;

export function initialize(data){
  ({ pinnedUrl, target } = data);
}

export async function resolve(specifier, context, nextResolve){
  const resolved = await nextResolve(specifier, context);
  if (pinnedUrl && resolved.url.endsWith(target))
    return { ...resolved, url: pinnedUrl, shortCircuit: true };
  return resolved;
}
