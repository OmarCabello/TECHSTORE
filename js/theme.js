(function () {
    // Evita que el script se ejecute dos veces
    if (window.__techstoreThemeLoaded) return;
    window.__techstoreThemeLoaded = true;
  
    var KEY = "techstore-theme";
    var root = document.documentElement;
  
    var theme = "light";
    try { theme = localStorage.getItem(KEY) || "light"; } catch (e) {}
    if (theme !== "dark") theme = "light";
    root.setAttribute("data-theme", theme);
  
    function labelFor(t) {
      return t === "dark" ? "Tema: Oscuro" : "Tema: Claro";
    }
  
    function crearInterruptor() {
      var actions = document.querySelector(".header-actions");
      if (!actions) return;
  
      // Borra cualquier interruptor que ya exista (duplicados)
      var viejos = document.querySelectorAll(".theme-toggle");
      for (var i = 0; i < viejos.length; i++) viejos[i].remove();
  
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-toggle";
      btn.setAttribute("role", "switch");
      btn.innerHTML =
        '<span class="theme-track"><span class="theme-knob"></span></span>' +
        '<span class="theme-label"></span>';
  
      var label = btn.querySelector(".theme-label");
  
      function update() {
        var t = root.getAttribute("data-theme");
        label.textContent = labelFor(t);
        btn.setAttribute("aria-checked", t === "dark" ? "true" : "false");
        btn.setAttribute("aria-label", labelFor(t));
      }
  
      btn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        update();
      });
  
      actions.insertBefore(btn, actions.firstChild);
      update();
    }
  
    window.addEventListener("load", crearInterruptor);
  })();
  