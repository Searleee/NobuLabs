/* Becoming Whole funnel · shared behaviour: reveals (.rv / .rv-stagger) */
(function () {
  var els = document.querySelectorAll(".rv, .rv-stagger");
  /* ?shot renders everything in its finished state (thumbnails / OG captures) */
  if (/[?&]shot\b/.test(location.search)) document.documentElement.classList.remove("js");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach(function (e) { io.observe(e); });
})();
