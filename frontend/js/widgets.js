// widgets.js

import { clockWidget } from "./widgets/clock.js";
import { timerWidget } from "./widgets/timer.js";
import { spotifyWidget } from "./widgets/spotify.js";
import { notesWidget } from "./widgets/notes.js";
import { pomodoroWidget } from "./widgets/pomodoro.js";
import { weatherWidget } from "./widgets/weather.js";
import { catWidget } from "./widgets/cat.js";

// import other widgets similarly when you add them
export const allWidgets = [
  clockWidget,
  timerWidget,
  spotifyWidget,
  notesWidget,
  pomodoroWidget,
  weatherWidget,
  catWidget,
  // add others here
];

// Renders a widget instance into the given container element
export function renderWidget(w, container) {
  const el = document.createElement("div");
  el.className = "widget";
  el.dataset.id = w.id;

  if (container.id === "grid" && w.x !== undefined && w.y !== undefined) {
    el.style.gridColumnStart = w.x + 1;
    el.style.gridRowStart = w.y + 1;
  }

  if (typeof w.render === "function") {
    w.render(el);
  } else {
    el.textContent = w.type;
  }

  container.appendChild(el);

  return el;
}
