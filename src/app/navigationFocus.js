/** A route can finish after several lazy imports. Focus only its ready content,
 * never a loading frame, and cancel pending work when another render starts. */
export function navigationFocus(container) {
  const live = document.createElement('div');
  live.id = 'route-announcement';
  live.className = 'ix-visually-hidden';
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  document.body.append(live);
  let observer = null, frame = null, version = 0;

  function begin(kind = 'page') {
    const token = ++version;
    observer?.disconnect();
    if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
    live.textContent = '';
    const ready = () => {
      const main = container.querySelector('main');
      if (main?.closest('[aria-busy="true"]')) return null;
      const heading = main?.querySelector('h1') || container.querySelector('h1');
      if (!heading && !main) return null;
      const target = kind === 'language' ? container.querySelector('.ix-language, [data-language-toggle]') : heading || main;
      return target && !target.closest('[aria-busy="true"], [hidden], [aria-hidden="true"]') ? target : null;
    };
    const check = () => {
      if (!ready() || frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        if (token !== version) return;
        const target = ready();
        if (!target?.isConnected) return;
        if (kind === 'page') target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        live.textContent = document.title;
        observer?.disconnect();
      });
    };
    observer = new MutationObserver(check);
    observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-busy'] });
    // A caller starts the render immediately after begin(); its mutations drive
    // check(), so the heading from the previous page can never win the race.
  }
  return { begin };
}
