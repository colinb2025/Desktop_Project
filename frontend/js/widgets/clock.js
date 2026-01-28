export const clockWidget = {
  id: "w1",
  type: "clock",
  w: 1,
  h: 1,
  render(el) {
    el.style.fontSize = "28px";
    el.style.fontWeight = "700";
    el.style.letterSpacing = "2px";
    el.style.color = "#111"; // dark text for bright background
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.userSelect = "none";

    function tick() {
      el.textContent = new Date().toLocaleTimeString([], { hour12: true });
    }
    tick();
    setInterval(tick, 1000);
  }
};
