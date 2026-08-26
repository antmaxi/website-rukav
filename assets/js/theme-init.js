try {
  if (localStorage.getItem("theme") === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
} catch (_) {
  // The default theme remains usable when storage is unavailable.
}
