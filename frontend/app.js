const grid = document.getElementById("grid");
const addBtn = document.getElementById("add-widget-btn");
const sidebar = document.getElementById("sidebar");
const unusedWidgetsContainer = document.getElementById("unused-widgets");
const deleteDropzone = document.getElementById("delete-dropzone");
const overlay = document.getElementById("grid-overlay");

let dragging = null;
let offsetX = 0;
let offsetY = 0;

// Example widgets pool
const allWidgets = [
  { id: "w1", type: "clock", w: 1, h: 1 },
  { id: "w2", type: "weather", w: 1, h: 1 },
  { id: "w3", type: "spotify", w: 1, h: 1 },
  { id: "w4", type: "notes", w: 1, h: 1 },
];

// Placed widgets on grid with position info
let placedWidgets = [];

// Initialize overlay grid cells (run once)
function initOverlay() {
  overlay.innerHTML = "";
  for (let i = 0; i < 24; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    overlay.appendChild(cell);
  }
}
initOverlay();

// Render widgets either in grid or sidebar
function renderWidget(w, container) {
  const el = document.createElement("div");
  el.className = "widget";
  el.dataset.id = w.id;

  if (container === grid) {
    el.style.gridColumnStart = w.x + 1;
    el.style.gridRowStart = w.y + 1;
  }

  if (w.type === "clock") startClock(el);
  else el.textContent = w.type;

  el.onmousedown = e => {
    dragging = { el, w, fromSidebar: container === unusedWidgetsContainer };

    // Add class to body to show overlay
    document.body.classList.add("dragging");

    const rect = el.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.style.position = "absolute";
    el.style.zIndex = "2000";
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.style.width = rect.width + "px";
    el.style.height = rect.height + "px";
    el.style.opacity = 0.6;

    document.body.appendChild(el);

    deleteDropzone.classList.add("visible");

    e.preventDefault();
  };

  container.appendChild(el);
}

function renderAll() {
  grid.innerHTML = "";
  unusedWidgetsContainer.innerHTML = "";
  deleteDropzone.classList.remove("visible");

  // Render placed widgets on grid
  placedWidgets.forEach(w => renderWidget(w, grid));

  // Render unused widgets in sidebar
  const unused = allWidgets.filter(
    w => !placedWidgets.some(pw => pw.id === w.id)
  );
  unused.forEach(w => renderWidget(w, unusedWidgetsContainer));
}

// For demo, start with one widget placed
placedWidgets = [{ ...allWidgets[0], x: 0, y: 0 }];

renderAll();

document.onmousemove = e => {
  if (!dragging) return;

  dragging.el.style.left = e.clientX - offsetX + "px";
  dragging.el.style.top = e.clientY - offsetY + "px";
};

document.onmouseup = e => {
  if (!dragging) return;

  const gridRect = grid.getBoundingClientRect();
  const cellW = gridRect.width / 6;
  const cellH = gridRect.height / 4;

  const insideGrid =
    e.clientX >= gridRect.left &&
    e.clientX <= gridRect.right &&
    e.clientY >= gridRect.top &&
    e.clientY <= gridRect.bottom;

  const dropzoneRect = deleteDropzone.getBoundingClientRect();
  const insideDeleteZone =
    e.clientX >= dropzoneRect.left &&
    e.clientX <= dropzoneRect.right &&
    e.clientY >= dropzoneRect.top &&
    e.clientY <= dropzoneRect.bottom;

  if (insideDeleteZone) {
    // Remove widget if dragged from grid
    if (!dragging.fromSidebar) {
      placedWidgets = placedWidgets.filter(w => w.id !== dragging.w.id);
    }
  } else if (insideGrid) {
    dragging.w.x = Math.max(
      0,
      Math.min(5, Math.floor((e.clientX - gridRect.left) / cellW))
    );
    dragging.w.y = Math.max(
      0,
      Math.min(3, Math.floor((e.clientY - gridRect.top) / cellH))
    );

    if (dragging.fromSidebar) {
      placedWidgets.push({ ...dragging.w, x: dragging.w.x, y: dragging.w.y });
    } else {
      const idx = placedWidgets.findIndex(w => w.id === dragging.w.id);
      if (idx !== -1) {
        placedWidgets[idx].x = dragging.w.x;
        placedWidgets[idx].y = dragging.w.y;
      }
    }
  }

  dragging.el.remove();

  // Remove dragging class to hide overlay
  document.body.classList.remove("dragging");

  renderAll();
  dragging = null;
};

// Toggle sidebar on plus button click
addBtn.onclick = () => {
  sidebar.classList.toggle("hidden");
};

// Clock widget helper
function startClock(el) {
  function tick() {
    el.textContent = new Date().toLocaleTimeString();
  }
  tick();
  setInterval(tick, 1000);
}
