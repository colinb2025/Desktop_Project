export const timerWidget = {
  id: "w5",
  type: "timer",
  w: 1,
  h: 1,
  render(el) {
    let timerValue = 0; // seconds remaining
    let intervalId = null;

    // Style the widget container
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.padding = "10px";
    el.style.background = "#222";
    el.style.borderRadius = "8px";
    el.style.userSelect = "none";

    // Timer display
    const display = document.createElement("div");
    display.style.fontFamily = "'Courier New', monospace";
    display.style.fontSize = "28px";
    display.style.fontWeight = "bold";
    display.style.color = "#0ff"; // cyan-ish color
    display.style.marginBottom = "10px";
    display.textContent = formatTime(timerValue);

    // Buttons container
    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";

    // Buttons
    const startStopBtn = document.createElement("button");
    startStopBtn.textContent = "Start";
    styleButton(startStopBtn);

    const add5Btn = document.createElement("button");
    add5Btn.textContent = "+5 min";
    styleButton(add5Btn);

    const minus5Btn = document.createElement("button");
    minus5Btn.textContent = "-5 min";
    styleButton(minus5Btn);

    btnContainer.append(add5Btn, minus5Btn, startStopBtn);
    el.append(display, btnContainer);

    function styleButton(button) {
      button.style.background = "#333";
      button.style.color = "white";
      button.style.border = "none";
      button.style.padding = "6px 12px";
      button.style.borderRadius = "5px";
      button.style.cursor = "pointer";
      button.style.fontWeight = "600";
      button.style.transition = "background 0.2s ease";
      button.onmouseenter = () => (button.style.background = "#0ff");
      button.onmouseleave = () => (button.style.background = "#333");
      button.onmousedown = e => e.preventDefault(); // prevent text selection
    }

    function formatTime(s) {
      const hrs = Math.floor(s / 3600);
      const mins = Math.floor((s % 3600) / 60);
      const secs = s % 60;
      return (
        String(hrs).padStart(2, "0") +
        ":" +
        String(mins).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
      );
    }

    function updateDisplay() {
      display.textContent = formatTime(timerValue);
    }

    function startTimer() {
      if (intervalId) return;
      if (timerValue <= 0) return; // Don't start if time is zero
      intervalId = setInterval(() => {
        if (timerValue > 0) {
          timerValue--;
          updateDisplay();
        } else {
          stopTimer();
          // Optional: beep or alert on timer end
          alert("Timer finished!");
        }
      }, 1000);
      startStopBtn.textContent = "Stop";
    }

    function stopTimer() {
      clearInterval(intervalId);
      intervalId = null;
      startStopBtn.textContent = "Start";
    }

    startStopBtn.onclick = () => {
      if (intervalId) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    add5Btn.onclick = () => {
      timerValue += 300;
      updateDisplay();
    };

    minus5Btn.onclick = () => {
      timerValue = Math.max(0, timerValue - 300);
      updateDisplay();
    };

    updateDisplay();
  }
};
