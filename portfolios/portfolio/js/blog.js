/* ==========================================================================
   blog.js — static article list enhanced with search, tag filter and
   client-side pagination (10 articles per page). No dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;
  var PER_PAGE = 10;

  function init() {
    var list = doc.querySelector("[data-article-list]");
    if (!list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll(".article-row"));
    if (!items.length) return;

    var searchInput = doc.querySelector("[data-search]");
    var clearBtns = Array.prototype.slice.call(doc.querySelectorAll("[data-search-clear]"));
    var chips = Array.prototype.slice.call(doc.querySelectorAll("[data-tag-filter]"));
    var pager = doc.querySelector("[data-pagination]");
    var empty = doc.querySelector("[data-empty]");
    var countEl = doc.querySelector("[data-result-count]");
    var listHead = doc.querySelector("[data-list-label]");

    var state = { query: "", tag: "all", page: 1 };

    /* ---------------- helpers ---------------- */

    function haystack(item) {
      if (item._haystack) return item._haystack;
      item._haystack = (
        (item.getAttribute("data-title") || "") +
        " " +
        (item.getAttribute("data-tags") || "") +
        " " +
        (item.getAttribute("data-author") || "") +
        " " +
        item.textContent
      ).toLowerCase();
      return item._haystack;
    }

    function matches(item) {
      var okTag =
        state.tag === "all" ||
        (item.getAttribute("data-tags") || "").toLowerCase().indexOf(state.tag) > -1;
      if (!okTag) return false;
      if (!state.query) return true;
      return haystack(item).indexOf(state.query) > -1;
    }

    function filtered() {
      return items.filter(matches);
    }

    /* ---------------- rendering ---------------- */

    function render(scrollToTop) {
      var found = filtered();
      var totalPages = Math.max(1, Math.ceil(found.length / PER_PAGE));

      if (state.page > totalPages) state.page = totalPages;
      if (state.page < 1) state.page = 1;

      var start = (state.page - 1) * PER_PAGE;
      var end = start + PER_PAGE;
      var pageItems = found.slice(start, end);

      items.forEach(function (item) {
        item.classList.toggle("is-hidden", pageItems.indexOf(item) === -1);
      });

      if (empty) empty.classList.toggle("is-visible", found.length === 0);

      if (countEl) {
        countEl.textContent = found.length === 0
          ? "No stories"
          : found.length + (found.length === 1 ? " story" : " stories");
      }

      if (listHead) {
        if (state.query) {
          listHead.textContent = 'Results for "' + searchInput.value.trim() + '"';
        } else if (state.tag !== "all") {
          listHead.textContent = "Filed under “" + state.tag + "”";
        } else {
          listHead.textContent = "All stories";
        }
      }

      renderPager(totalPages);
      bindPager();

      if (scrollToTop) {
        var anchor = doc.querySelector("[data-list-anchor]") || list;
        var top = anchor.getBoundingClientRect().top + window.pageYOffset - 130;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    }

    function pageNumbers(total, current) {
      var out = [];
      var delta = 2;
      for (var i = 1; i <= total; i++) {
        if (
          i === 1 ||
          i === total ||
          (i >= current - delta && i <= current + delta)
        ) {
          out.push(i);
        } else if (out[out.length - 1] !== "…") {
          out.push("…");
        }
      }
      return out;
    }

    function renderPager(totalPages) {
      if (!pager) return;

      if (totalPages <= 1) {
        pager.innerHTML = "";
        pager.classList.add("hide");
        return;
      }
      pager.classList.remove("hide");

      var html = "";
      html +=
        '<button class="page-btn" type="button" data-page-action="prev"' +
        (state.page === 1 ? " disabled" : "") +
        ' aria-label="Previous page">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Prev</button>';

      pageNumbers(totalPages, state.page).forEach(function (n) {
        if (n === "…") {
          html += '<span class="page-ellipsis">…</span>';
        } else {
          html +=
            '<button class="page-btn' +
            (n === state.page ? " is-current" : "") +
            '" type="button" data-page="' +
            n +
            '"' +
            (n === state.page ? ' aria-current="page"' : "") +
            ">" +
            n +
            "</button>";
        }
      });

      html +=
        '<button class="page-btn" type="button" data-page-action="next"' +
        (state.page === totalPages ? " disabled" : "") +
        ' aria-label="Next page">Next' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>';

      pager.innerHTML = html;
    }

    function bindPager() {
      if (!pager) return;

      Array.prototype.forEach.call(pager.querySelectorAll("[data-page]"), function (btn) {
        btn.addEventListener("click", function () {
          var n = parseInt(btn.getAttribute("data-page"), 10);
          if (!n || n === state.page) return;
          state.page = n;
          render(true);
        });
      });

      var prev = pager.querySelector('[data-page-action="prev"]');
      var next = pager.querySelector('[data-page-action="next"]');
      if (prev) {
        prev.addEventListener("click", function () {
          if (state.page > 1) {
            state.page--;
            render(true);
          }
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          var total = Math.max(1, Math.ceil(filtered().length / PER_PAGE));
          if (state.page < total) {
            state.page++;
            render(true);
          }
        });
      }
    }

    /* ---------------- events ---------------- */

    function setClearVisible(visible) {
      clearBtns.forEach(function (b) {
        b.classList.toggle("is-visible", visible);
      });
    }

    if (searchInput) {
      var timer = null;
      searchInput.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          state.query = searchInput.value.trim().toLowerCase();
          state.page = 1;
          setClearVisible(state.query !== "");
          render(false);
        }, 140);
      });

      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          searchInput.value = "";
          state.query = "";
          state.page = 1;
          setClearVisible(false);
          render(false);
        }
      });
    }

    clearBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
        state.query = "";
        state.page = 1;
        setClearVisible(false);
        render(false);
      });
    });

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("is-active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");
        state.tag = (chip.getAttribute("data-tag-filter") || "all").toLowerCase();
        state.page = 1;
        render(false);
      });
    });

    /* deep link support: blog.html#tag=react or #q=design */
    (function fromHash() {
      var hash = decodeURIComponent(location.hash.replace(/^#/, ""));
      if (!hash) return;
      if (hash.indexOf("tag=") === 0) {
        var tag = hash.slice(4).toLowerCase();
        var match = chips.filter(function (c) {
          return (c.getAttribute("data-tag-filter") || "").toLowerCase() === tag;
        })[0];
        if (match) {
          chips.forEach(function (c) {
            c.classList.remove("is-active");
          });
          match.classList.add("is-active");
          state.tag = tag;
        }
      } else if (hash.indexOf("q=") === 0) {
        var q = hash.slice(2);
        if (searchInput) {
          searchInput.value = q;
          state.query = q.toLowerCase();
          setClearVisible(true);
        }
      }
    })();

    render(false);
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
