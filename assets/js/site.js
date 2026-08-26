(function () {
  function initializeThemeToggle() {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (_) {
        // Theme switching does not depend on persistence.
      }
    });
  }

  function initializeFormslyEmbeds() {
    var frames = Array.from(document.querySelectorAll("[data-formsly-embed]"));
    if (!frames.length) return;

    window.addEventListener("message", function (event) {
      if (event.origin !== "https://formsly.ch") return;

      var frame = frames.find(function (candidate) {
        return candidate.contentWindow === event.source;
      });
      if (!frame) return;

      var data = event.data;
      if (!data || data.eventName !== "SET_HEIGHT" || !data.payload) return;

      var height = Number(data.payload.height);
      if (!Number.isFinite(height) || height < 200 || height > 4000) return;
      frame.height = String(Math.round(height));
    });
  }

  function loadDeferredFrames(root) {
    root.querySelectorAll("iframe[data-deferred-src]").forEach(function (frame) {
      var source = frame.getAttribute("data-deferred-src");
      if (!source) return;
      frame.src = source;
      frame.removeAttribute("data-deferred-src");
    });
  }

  function initializeFaq() {
    var content = document.querySelector(".faq-content");
    var links = document.querySelectorAll(".faq-subnav__link[data-faq-section]");
    if (!content) return;

    var nodes = Array.from(content.childNodes);
    var currentInner = null;

    nodes.forEach(function (node) {
      if (node.nodeType === 1 && node.tagName === "H2") {
        var id = node.id || "";
        var slide = document.createElement("section");
        slide.className = "faq-slide";
        if (id) {
          slide.id = id;
          slide.setAttribute("data-faq-section", id);
        }

        var heading = document.createElement("h2");
        heading.className = "faq-slide__heading";

        var trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "faq-slide__trigger";
        trigger.setAttribute("aria-expanded", "false");
        Array.from(node.childNodes).forEach(function (child) {
          trigger.appendChild(child.cloneNode(true));
        });

        var chevron = document.createElement("span");
        chevron.className = "faq-slide__chevron";
        chevron.setAttribute("aria-hidden", "true");
        trigger.appendChild(chevron);
        heading.appendChild(trigger);

        var panel = document.createElement("div");
        panel.className = "faq-slide__panel";
        var inner = document.createElement("div");
        inner.className = "faq-slide__inner";
        panel.appendChild(inner);
        slide.appendChild(heading);
        slide.appendChild(panel);
        content.insertBefore(slide, node);
        node.remove();
        currentInner = inner;
      } else if (currentInner) {
        currentInner.appendChild(node);
      }
    });

    function setActiveNav(id) {
      links.forEach(function (link) {
        link.classList.toggle(
          "faq-subnav__link--active",
          link.getAttribute("data-faq-section") === id
        );
      });
    }

    function openSection(id, scrollIntoView) {
      var slides = content.querySelectorAll(".faq-slide[data-faq-section]");
      var opened = null;

      slides.forEach(function (slide) {
        var matches = slide.getAttribute("data-faq-section") === id;
        var trigger = slide.querySelector(".faq-slide__trigger");
        slide.classList.toggle("is-open", matches);
        if (trigger) trigger.setAttribute("aria-expanded", matches ? "true" : "false");
        if (matches) {
          loadDeferredFrames(slide);
          opened = slide;
        }
      });

      setActiveNav(id);
      if (scrollIntoView && opened) {
        opened.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function syncFromHash(scrollIntoView) {
      var id = (location.hash || "").slice(1);
      if (id) openSection(id, scrollIntoView);
    }

    content.addEventListener("click", function (event) {
      var trigger = event.target.closest(".faq-slide__trigger");
      if (!trigger) return;

      var slide = trigger.closest(".faq-slide");
      var id = slide && slide.getAttribute("data-faq-section");
      if (!id) return;

      if (slide.classList.contains("is-open")) {
        slide.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        setActiveNav("");
        if (location.hash === "#" + id) {
          history.replaceState(null, "", location.pathname + location.search);
        }
        return;
      }

      if (location.hash !== "#" + id) {
        history.replaceState(null, "", "#" + id);
      }
      openSection(id, false);
    });

    window.addEventListener("hashchange", function () {
      syncFromHash(true);
    });
    syncFromHash(false);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initializeThemeToggle();
    initializeFormslyEmbeds();
    initializeFaq();
  });
})();
