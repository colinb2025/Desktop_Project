// app.js

import { allWidgets, renderWidget } from "./widgets.js";

const grid = document.getElementById("grid");
const addBtn = document.getElementById("add-widget-btn");
const sidebar = document.getElementById("sidebar");
const unusedWidgetsContainer = document.getElementById("unused-widgets");
const deleteDropzone = document.getElementById("delete-dropzone");
const overlay = document.getElementById("grid-overlay");

let dragging = null;
let offsetX = 0;
let offsetY = 0;

let dragHoldTimeout = null;
let dragStarted = false;
let initialMousePos = null;

// Start with one widget placed for demo
let placedWidgets = [{ ...allWidgets[0], x: 0, y: 0 }];

// Initialize the overlay grid cells
function initOverlay() {
  overlay.innerHTML = "";
  for (let i = 0; i < 24; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    overlay.appendChild(cell);
  }
}
initOverlay();

function renderAll() {
  grid.innerHTML = "";
  unusedWidgetsContainer.innerHTML = "";
  deleteDropzone.classList.remove("visible");

  // Render widgets placed on grid
  placedWidgets.forEach(w => renderWidget(w, grid));

  // Render unused widgets in sidebar
  const unused = allWidgets.filter(
    w => !placedWidgets.some(pw => pw.id === w.id)
  );
  unused.forEach(w => renderWidget(w, unusedWidgetsContainer));
}
renderAll();

// Handle dragging mousedown from widgets with long press
document.body.addEventListener("mousedown", e => {
  const target = e.target.closest(".widget");
  if (!target) return;

  initialMousePos = { x: e.clientX, y: e.clientY };
  dragStarted = false;

  const id = target.dataset.id;
  const w =
    placedWidgets.find(w => w.id === id) || allWidgets.find(w => w.id === id);
  if (!w) return;

  dragHoldTimeout = setTimeout(() => {
    dragStarted = true;

    dragging = { el: target, w, fromSidebar: target.parentElement === unusedWidgetsContainer };

    document.body.classList.add("dragging");

    const rect = target.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    target.style.position = "absolute";
    target.style.zIndex = "2000";
    target.style.left = rect.left + "px";
    target.style.top = rect.top + "px";
    target.style.width = rect.width + "px";
    target.style.height = rect.height + "px";
    target.style.opacity = 0.6;

    document.body.appendChild(target);

    deleteDropzone.classList.add("visible");

  }, 1000);
});

document.body.addEventListener("mouseup", e => {
  // Cancel drag hold if mouse released before drag starts
  if (dragHoldTimeout) {
    clearTimeout(dragHoldTimeout);
    dragHoldTimeout = null;
  }

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
  document.body.classList.remove("dragging");

  renderAll();
  dragging = null;
});

document.body.addEventListener("mousemove", e => {
  if (!dragHoldTimeout && !dragStarted) return;

  // Cancel drag hold if mouse moves too far before drag starts
  if (!dragStarted && initialMousePos) {
    const distX = Math.abs(e.clientX - initialMousePos.x);
    const distY = Math.abs(e.clientY - initialMousePos.y);
    if (distX > 5 || distY > 5) {
      clearTimeout(dragHoldTimeout);
      dragHoldTimeout = null;
      initialMousePos = null;
    }
  }

  if (!dragging) return;

  dragging.el.style.left = e.clientX - offsetX + "px";
  dragging.el.style.top = e.clientY - offsetY + "px";
});

// Toggle sidebar on plus button click
addBtn.onclick = () => {
  sidebar.classList.toggle("hidden");
};
