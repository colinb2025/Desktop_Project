export const spotifyWidget = {
  id: "w3",
  type: "spotify",
  w: 2,
  h: 1,
  render(el) {
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.justifyContent = "space-between";
    el.style.padding = "10px";
    el.style.background = "#1DB954"; // Spotify green
    el.style.borderRadius = "8px";
    el.style.color = "white";
    el.style.userSelect = "none";

    // Track info container
    const trackInfo = document.createElement("div");
    trackInfo.style.fontWeight = "bold";
    trackInfo.style.fontSize = "16px";
    trackInfo.style.marginBottom = "8px";
    trackInfo.textContent = "Track Title - Artist";

    // Controls container
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.justifyContent = "center";
    controls.style.alignItems = "center";
    controls.style.gap = "15px";

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "⏮";
    styleButton(prevBtn);

    // Play/Pause button
    const playPauseBtn = document.createElement("button");
    playPauseBtn.textContent = "▶️";
    styleButton(playPauseBtn);

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "⏭";
    styleButton(nextBtn);

    controls.append(prevBtn, playPauseBtn, nextBtn);
    el.append(trackInfo, controls);

    // Simple play state toggle
    let isPlaying = false;

    playPauseBtn.onclick = () => {
      isPlaying = !isPlaying;
      playPauseBtn.textContent = isPlaying ? "⏸" : "▶️";
      // Here you would integrate actual play/pause logic with Spotify API or SDK
    };

    prevBtn.onclick = () => {
      alert("Previous track");
      // Integrate with Spotify API to change track
    };

    nextBtn.onclick = () => {
      alert("Next track");
      // Integrate with Spotify API to change track
    };

    function styleButton(button) {
      button.style.background = "rgba(0,0,0,0.3)";
      button.style.border = "none";
      button.style.borderRadius = "50%";
      button.style.color = "white";
      button.style.width = "32px";
      button.style.height = "32px";
      button.style.fontSize = "18px";
      button.style.cursor = "pointer";
      button.style.display = "flex";
      button.style.justifyContent = "center";
      button.style.alignItems = "center";
      button.style.transition = "background 0.2s ease";
      button.onmouseenter = () => (button.style.background = "rgba(0,0,0,0.6)");
      button.onmouseleave = () => (button.style.background = "rgba(0,0,0,0.3)");
      button.onmousedown = e => e.preventDefault();
    }
  }
};
