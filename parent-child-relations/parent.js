(function() {
  const MAX_INJECTIONS = 100;
  const INJECTIONS_PER_RUN = 52;
  
  if (!window.scriptInjectionCount) {
    window.scriptInjectionCount = 0;
  }
  
  if (window.scriptInjectionCount >= MAX_INJECTIONS) {
    console.log(`Limit reached: ${window.scriptInjectionCount} total injections`);
    return;
  }
  
  const currentScript = document.currentScript;
  const scriptUrl = currentScript ? currentScript.src : window.location.href;
  const url = new URL(scriptUrl, window.location.origin);
  const baseUrl = url.origin + url.pathname;
  
  const remaining = MAX_INJECTIONS - window.scriptInjectionCount;
  const toInject = Math.min(INJECTIONS_PER_RUN, remaining);
  
  for (let i = 0; i < toInject; i++) {
    const script = document.createElement('script');
    const randomVersion = Math.random().toString(36).substring(2, 15);
    script.src = `${baseUrl}?item=${window.scriptInjectionCount + i}&version=${randomVersion}`;
    document.head.appendChild(script);
  }
  
  window.scriptInjectionCount += toInject;
  console.log(`Injected ${toInject} scripts (total: ${window.scriptInjectionCount}/${MAX_INJECTIONS})`);
})();
