// clock.js

export const clockWidget = {
  id: "w1",
  type: "clock",
  w: 1,
  h: 1,
  render(el) {
    function tick() {
      el.textContent = new Date().toLocaleTimeString();
    }
    tick();
    setInterval(tick, 1000);
  }
};
