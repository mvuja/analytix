(function () {
  var script = document.currentScript;
  var siteId = script && script.getAttribute("data-site-id");
  var endpoint = (script && new URL(script.src).origin) + "/api/track";

  if (!siteId || !navigator.sendBeacon) {
    return;
  }

  var storageKey = "analytix." + siteId + ".visitor";
  var sessionKey = "analytix." + siteId + ".session";

  // Keep generated ids short enough for URLs, logs, and database indexes
  function id(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  // Store ids per site so one browser can test multiple tracked websites
  function getOrSet(key, prefix) {
    var value = localStorage.getItem(key);
    if (!value) {
      value = id(prefix);
      localStorage.setItem(key, value);
    }
    return value;
  }

  function browserName() {
    var ua = navigator.userAgent;
    if (ua.indexOf("Firefox") >= 0) return "Firefox";
    if (ua.indexOf("Edg") >= 0) return "Edge";
    if (ua.indexOf("Chrome") >= 0) return "Chrome";
    if (ua.indexOf("Safari") >= 0) return "Safari";
    return "Unknown";
  }

  function deviceType() {
    if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
    if (window.matchMedia("(max-width: 1024px)").matches) return "tablet";
    return "desktop";
  }

  // Beacon keeps page navigation fast while still delivering analytics events
  function send(type) {
    var payload = {
      siteId: siteId,
      type: type || "pageview",
      sessionId: getOrSet(sessionKey, "session"),
      visitorId: getOrSet(storageKey, "visitor"),
      pathname: location.pathname,
      title: document.title,
      referrer: document.referrer,
      screen: window.screen.width + "x" + window.screen.height,
      browser: browserName(),
      device: deviceType(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    };

    var blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
  }

  // Patch history methods so React and other SPA navigations are visible
  function patchHistory(method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      window.dispatchEvent(new Event("analytix:navigation"));
      return result;
    };
  }

  var lastPath = null;
  function trackPageview() {
    // Avoid double counting when the router emits repeated navigation events
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    send("pageview");
  }

  patchHistory("pushState");
  patchHistory("replaceState");
  window.addEventListener("popstate", trackPageview);
  window.addEventListener("analytix:navigation", trackPageview);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", trackPageview);
  } else {
    trackPageview();
  }
})();
