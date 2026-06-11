import { useEffect } from "react";

const STAGGER_MS = 90; // delay step between staggered siblings

export function useScrollAnimations() {
  useEffect(() => {
    /* ── Track processed elements to avoid double-work ── */
    const processed = new WeakSet<Element>();

    /* ── IntersectionObserver: reveal on scroll ── */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    /* ── Assign stagger delays to .aos children of [data-stagger] ── */
    const staggerProcessed = new WeakSet<Element>();
    function applyStagger(container: Element) {
      if (staggerProcessed.has(container)) return;
      staggerProcessed.add(container);
      Array.from(container.children)
        .filter((c) => c.classList.contains("aos"))
        .forEach((child, i) => {
          (child as HTMLElement).style.setProperty(
            "--aos-delay",
            `${i * STAGGER_MS}ms`,
          );
        });
    }

    /* ── Register a single .aos element ── */
    function registerElement(el: Element) {
      if (processed.has(el)) return;
      processed.add(el);
      if (el.classList.contains("aos-in") || el.classList.contains("aos-skip")) return;
      const rect = el.getBoundingClientRect();
      /* If already visible on page load → show instantly, no animation */
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("aos-skip");
      } else {
        io.observe(el);
      }
    }

    /* ── Main init: enable CSS cascade + register all .aos elements ── */
    function init() {
      document.body.classList.add("aos-ready");
      document.querySelectorAll("[data-stagger]").forEach(applyStagger);
      document.querySelectorAll<Element>(".aos").forEach(registerElement);
    }

    init();

    /* ── MutationObserver: pick up dynamically rendered React content ── */
    let rafId = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(init);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(rafId);
      document.body.classList.remove("aos-ready");
    };
  }, []);
}
