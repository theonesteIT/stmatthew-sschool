/* Load Header.html / Footer.html into each page (works with file:// and http://) */
(function () {
  var script = document.currentScript;
  if (!script) return;

  var targetId = script.getAttribute("data-target");
  var file = script.getAttribute("data-file");
  var slot = targetId && document.getElementById(targetId);
  if (!slot || !file) return;

  function loadViaXhr(url) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.send(null);
      if (xhr.responseText && (xhr.status === 200 || xhr.status === 0)) {
        return xhr.responseText;
      }
    } catch (e) {
      /* blocked in some browsers on file:// */
    }
    return null;
  }

  function loadViaIframe(url) {
    var iframe = document.createElement("iframe");
    iframe.hidden = true;
    iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
    iframe.src = url;
    document.documentElement.appendChild(iframe);

    var html = null;
    for (var i = 0; i < 240; i++) {
      try {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc && doc.body && doc.body.innerHTML.trim()) {
          html = doc.body.innerHTML;
          break;
        }
      } catch (e) {
        /* wait for iframe */
      }
      var start = Date.now();
      while (Date.now() - start < 20) {
        /* short wait for load */
      }
    }

    iframe.remove();
    return html;
  }

  var url = new URL(file, window.location.href).href;
  var html = loadViaXhr(url) || loadViaIframe(url) || (window.__INCLUDE_FALLBACK && window.__INCLUDE_FALLBACK[file]);

  if (html) {
    slot.innerHTML = html;
  }
})();
