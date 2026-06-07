/* ==========================================================================
   results.js - pollutant tab switching for the Results page
   --------------------------------------------------------------------------
   Three tabs (NO2, PM2.5, PM10). Clicking a tab button shows the matching
   panel and updates ARIA state. The active pollutant is reflected in the URL
   hash so the home-page cards can deep-link straight to a pollutant tab
   (results.html#pm25) and a refresh keeps the selection.
   ========================================================================== */
(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));
  if (tabs.length === 0) {
    return;
  }

  function activate(target, updateHash) {
    var matched = false;

    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-target") === target;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      if (isActive) {
        matched = true;
      }
    });

    if (!matched) {
      return;
    }

    panels.forEach(function (panel) {
      panel.classList.toggle("active", panel.id === "panel-" + target);
    });

    if (updateHash) {
      history.replaceState(null, "", "#" + target);
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activate(tab.getAttribute("data-target"), true);
    });
  });

  // Honour a deep link such as results.html#pm25 on first load.
  var initial = window.location.hash.replace("#", "");
  var valid = tabs.some(function (tab) {
    return tab.getAttribute("data-target") === initial;
  });
  if (valid) {
    activate(initial, false);
  }
})();
