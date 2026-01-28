export const notesWidget = {
  id: "w4",
  type: "notes",
  w: 2,
  h: 2,
  render(el) {
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.padding = "10px";
    el.style.background = "#333";
    el.style.borderRadius = "8px";
    el.style.color = "white";

    const textarea = document.createElement("textarea");
    textarea.style.flexGrow = "1";
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.background = "#222";
    textarea.style.color = "white";
    textarea.style.border = "none";
    textarea.style.borderRadius = "6px";
    textarea.style.resize = "none";
    textarea.style.padding = "8px";
    textarea.style.fontSize = "14px";
    textarea.style.fontFamily = "sans-serif";
    textarea.style.outline = "none";

    // Load saved notes from localStorage
    const saved = localStorage.getItem(`notes-${this.id}`) || "";
    textarea.value = saved;

    // Save notes on input
    textarea.addEventListener("input", () => {
      localStorage.setItem(`notes-${this.id}`, textarea.value);
    });

    el.appendChild(textarea);
  }
};
