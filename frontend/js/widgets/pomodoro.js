export const pomodoroWidget = {
  id: "w6",
  type: "pomodoro",
  w: 2,
  h: 1,
  render(el) {
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.justifyContent = "center";
    el.style.alignItems = "center";
    el.style.background = "#1f1f1f";
    el.style.borderRadius = "8px";
    el.style.padding = "10px";
    el.style.fontFamily = "monospace";

    let workTime = 25 * 60;
    let breakTime = 5 * 60;
    let remaining = workTime;
    let isWork = true;
    let running = false;
    let interval = null;

    const saved = JSON.parse(localStorage.getItem("pomodoro-state") || "null");
    if (saved) {
      remaining = saved.remaining;
      isWork = saved.isWork;
      running = saved.running;
    }

    const label = document.createElement("div");
    label.textContent = isWork ? "FOCUS" : "BREAK";
    label.style.fontSize = "12px";
    label.style.opacity = "0.7";

    const time = document.createElement("div");
    time.style.fontSize = "28px";
    time.style.margin = "4px 0";

    const bar = document.createElement("div");
    bar.style.width = "100%";
    bar.style.height = "6px";
    bar.style.background = "#333";
    bar.style.borderRadius = "3px";
    bar.style.overflow = "hidden";

    const fill = document.createElement("div");
    fill.style.height = "100%";
    fill.style.width = "100%";
    fill.style.background = isWork ? "#4caf50" : "#2196f3";
    fill.style.transition = "width 1s linear";

    bar.appendChild(fill);

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "6px";
    controls.style.marginTop = "6px";

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";

    [startBtn, resetBtn].forEach(b => {
      b.style.background = "#333";
      b.style.color = "white";
      b.style.border = "none";
      b.style.padding = "4px 8px";
      b.style.borderRadius = "4px";
      b.style.cursor = "pointer";
    });

    controls.appendChild(startBtn);
    controls.appendChild(resetBtn);

    el.append(label, time, bar, controls);

    function format(t) {
      const m = Math.floor(t / 60).toString().padStart(2, "0");
      const s = (t % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    }

    function save() {
      localStorage.setItem("pomodoro-state", JSON.stringify({
        remaining,
        isWork,
        running
      }));
    }

    function update() {
      time.textContent = format(remaining);
      const total = isWork ? workTime : breakTime;
      fill.style.width = (remaining / total * 100) + "%";
      label.textContent = isWork ? "FOCUS" : "BREAK";
      fill.style.background = isWork ? "#4caf50" : "#2196f3";
      save();
    }

    function tick() {
      if (remaining > 0) {
        remaining--;
      } else {
        isWork = !isWork;
        remaining = isWork ? workTime : breakTime;
      }
      update();
    }

    startBtn.onclick = () => {
      if (running) {
        clearInterval(interval);
        running = false;
        startBtn.textContent = "Start";
      } else {
        interval = setInterval(tick, 1000);
        running = true;
        startBtn.textContent = "Pause";
      }
      save();
    };

    resetBtn.onclick = () => {
      clearInterval(interval);
      running = false;
      isWork = true;
      remaining = workTime;
      startBtn.textContent = "Start";
      update();
    };

    update();
    if (running) {
      interval = setInterval(tick, 1000);
      startBtn.textContent = "Pause";
    }
  }
};
