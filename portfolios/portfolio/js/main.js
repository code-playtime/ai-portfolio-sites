/* ==========================================================================
   main.js — offcanvas nav, active links, scroll reveal, code copy,
   contact form, article extras. No dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;

  /* ------------------------------------------------------------------
     Offcanvas navigation (mobile)
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = doc.querySelector("[data-nav-toggle]");
    var panel = doc.querySelector("[data-offcanvas]");
    var backdrop = doc.querySelector("[data-backdrop]");
    var closeBtn = doc.querySelector("[data-nav-close]");
    if (!toggle || !panel) return;

    var lastFocused = null;

    function open() {
      lastFocused = doc.activeElement;
      doc.body.classList.add("nav-open");
      panel.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      var first = panel.querySelector("a, button");
      if (first) first.focus();
    }

    function close() {
      doc.body.classList.remove("nav-open");
      panel.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function isOpen() {
      return panel.classList.contains("is-open");
    }

    toggle.addEventListener("click", function () {
      isOpen() ? close() : open();
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);

    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && isOpen()) close();
    });
  }

  /* ------------------------------------------------------------------
     Highlight the current page in every nav
     ------------------------------------------------------------------ */
  function initActiveLinks() {
    var file = location.pathname.split("/").pop();
    if (!file || file === "" || file === "index.htm") file = "index.html";
    var hash = location.hash;

    var links = doc.querySelectorAll("[data-nav] a");
    var exact = false;

    Array.prototype.forEach.call(links, function (link) {
      var href = (link.getAttribute("href") || "").split("#");
      var target = href[0] || "index.html";
      if (target !== file) return;
      if (href.length > 1) {
        if (hash && "#" + href[1] === hash) exact = true;
      }
    });

    Array.prototype.forEach.call(links, function (link) {
      var href = (link.getAttribute("href") || "").split("#");
      var target = href[0] || "index.html";
      if (target !== file) return;
      var isAnchor = href.length > 1;
      var active = isAnchor ? exact && hash === "#" + href[1] : !exact;
      if (active) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll + animated skill bars
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = doc.querySelectorAll(".reveal, .skill-group");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    Array.prototype.forEach.call(items, function (el) {
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Copy buttons on code blocks
     ------------------------------------------------------------------ */
  function initCodeCopy() {
    var buttons = doc.querySelectorAll("[data-copy]");
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var block = btn.closest(".code-block");
        var code = block ? block.querySelector("pre code, pre") : null;
        if (!code) return;
        var text = code.innerText;

        var done = function () {
          var original = btn.getAttribute("data-label") || btn.innerHTML;
          btn.setAttribute("data-label", original);
          btn.classList.add("is-done");
          btn.innerHTML =
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Copied';
          setTimeout(function () {
            btn.classList.remove("is-done");
            btn.innerHTML = original;
          }, 1900);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {
            fallbackCopy(text, done);
          });
        } else {
          fallbackCopy(text, done);
        }
      });
    });
  }

  function fallbackCopy(text, cb) {
    var ta = doc.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    doc.body.appendChild(ta);
    ta.select();
    try {
      doc.execCommand("copy");
      cb();
    } catch (err) {
      /* ignore */
    }
    doc.body.removeChild(ta);
  }

  /* ------------------------------------------------------------------
     Contact form (demo validation, no backend)
     ------------------------------------------------------------------ */
  function initForm() {
    var form = doc.querySelector("[data-contact-form]");
    if (!form) return;

    var success = form.querySelector("[data-form-success]");

    function validateField(field) {
      var wrap = field.closest(".form-field");
      if (!wrap) return true;
      var ok = field.checkValidity() && field.value.trim() !== "";
      wrap.classList.toggle("has-error", !ok);
      return ok;
    }

    var fields = form.querySelectorAll("input[required], textarea[required]");
    Array.prototype.forEach.call(fields, function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        var wrap = field.closest(".form-field");
        if (wrap && wrap.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      Array.prototype.forEach.call(fields, function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        var firstBad = form.querySelector(".form-field.has-error input, .form-field.has-error textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      if (success) {
        success.classList.add("is-visible");
        if (typeof success.scrollIntoView === "function") {
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      form.reset();
      setTimeout(function () {
        if (success) success.classList.remove("is-visible");
      }, 6000);
    });
  }

  /* ------------------------------------------------------------------
     Toggle buttons (clap / bookmark / follow)
     ------------------------------------------------------------------ */
  function initToggles() {
    var toggles = doc.querySelectorAll("[data-toggle]");
    Array.prototype.forEach.call(toggles, function (btn) {
      btn.addEventListener("click", function () {
        var on = btn.classList.toggle("is-active");
        btn.setAttribute("aria-pressed", on ? "true" : "false");

        var countEl = btn.querySelector("[data-count]");
        if (countEl) {
          var n = parseInt(countEl.getAttribute("data-count"), 10) || 0;
          n = on ? n + 1 : n - 1;
          countEl.setAttribute("data-count", n);
          countEl.textContent = n.toLocaleString();
        }

        var label = btn.querySelector("[data-on-label]");
        if (label) {
          var offText = label.getAttribute("data-off-text") || "";
          var onText = label.getAttribute("data-on-text") || "";
          label.textContent = on ? onText : offText;
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Table of contents — scroll spy (article.html)
     ------------------------------------------------------------------ */
  function initToc() {
    var toc = doc.querySelector("[data-toc]");
    if (!toc) return;
    var links = toc.querySelectorAll("a[href^='#']");
    if (!links.length) return;

    var map = [];
    Array.prototype.forEach.call(links, function (a) {
      var target = doc.getElementById(a.getAttribute("href").slice(1));
      if (target) map.push({ link: a, el: target });
    });
    if (!map.length) return;

    function spy() {
      var offset = 140;
      var current = map[0];
      for (var i = 0; i < map.length; i++) {
        if (map[i].el.getBoundingClientRect().top - offset <= 0) current = map[i];
      }
      Array.prototype.forEach.call(links, function (a) {
        a.classList.remove("is-active");
      });
      if (current) current.link.classList.add("is-active");
    }

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          spy();
          ticking = false;
        });
        ticking = true;
      }
    });
    spy();
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  function initYear() {
    var els = doc.querySelectorAll("[data-year]");
    Array.prototype.forEach.call(els, function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------ */
  function init() {
    initNav();
    initActiveLinks();
    initReveal();
    initCodeCopy();
    initForm();
    initToggles();
    initToc();
    initYear();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
