(function () {
  "use strict";

  const THEME_KEY = "scpz24-theme";
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const label = document.getElementById("theme-label");
    if (label) {
      label.textContent = theme === "dark" ? "浅色" : "深色";
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
    } else {
      applyTheme("light");
    }

    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const next = current === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    }
  }

  function initTOC() {
    const prose = document.querySelector(".prose");
    const tocList = document.getElementById("toc-list");
    const docWrap = document.querySelector(".doc-wrap");
    if (!prose || !tocList || !docWrap) return;

    const headings = Array.from(prose.querySelectorAll("h2, h3"));
    if (headings.length === 0) {
      docWrap.classList.remove("has-toc");
      return;
    }

    docWrap.classList.add("has-toc");
    tocList.innerHTML = "";
    const items = [];

    headings.forEach(function (heading, index) {
      if (!heading.id) {
        heading.id = "sec-" + (index + 1);
      }

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + heading.id;
      a.textContent = heading.textContent.trim();
      a.className = "toc-link " + (heading.tagName === "H3" ? "level-3" : "level-2");
      li.appendChild(a);
      tocList.appendChild(li);
      items.push({ id: heading.id, el: heading, link: a });
    });

    function setActive(id) {
      items.forEach(function (item) {
        item.link.classList.toggle("active", item.id === id);
      });
    }

    setActive(items[0].id);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-40px 0px -72% 0px",
          threshold: 0,
        }
      );

      items.forEach(function (item) {
        observer.observe(item.el);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initTOC();
  });
})();
