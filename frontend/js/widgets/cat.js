export const catWidget = {
  id: "w8",
  type: "cat",
  w: 2,
  h: 1,
  render(el) {
    el.style.position = "relative";
    el.style.minWidth = "200px";  // larger so cat can walk around
    el.style.minHeight = "100px";
    el.style.overflow = "hidden";

    // Background image
    el.style.backgroundImage = "url('/js/widgets/sprites/cat_background.png')";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "bottom left";
    el.style.backgroundSize = "contain";

    const spriteWidth = 50;
    const spriteHeight = 50;
    const totalFrames = 5;
    const frameDuration = 200;  // ms per frame
    const moveSpeed = 1.5;      // pixels per frame update

    const sprite = document.createElement("div");
    sprite.style.width = spriteWidth + "px";
    sprite.style.height = spriteHeight + "px";
    sprite.style.imageRendering = "pixelated";
    sprite.style.backgroundImage = "url('/js/widgets/sprites/cat.png')";
    sprite.style.backgroundRepeat = "no-repeat";
    sprite.style.backgroundSize = `${spriteWidth * totalFrames}px ${spriteHeight}px`;
    sprite.style.position = "absolute";
    sprite.style.bottom = "5px";
    sprite.style.left = "0px"; // start at left edge

    el.appendChild(sprite);

    let frameIndex = 2;
    let position = 0;
    let direction = 1; // 1 = move right, -1 = move left

    function animate() {
      // Update frame for walking animation
      sprite.style.backgroundPosition = `-${frameIndex * spriteWidth}px 0`;
      frameIndex++;
      if (frameIndex > 4) frameIndex = 2;

      // Update horizontal position
      position += moveSpeed * direction;

      // Check boundaries and reverse direction if needed
      const maxPosition = el.clientWidth - spriteWidth;
      if (position >= maxPosition) {
        position = maxPosition;
        direction = -1;
        // Flip sprite horizontally to face left
        sprite.style.transform = "scaleX(-1)";
      } else if (position <= 0) {
        position = 0;
        direction = 1;
        // Flip sprite back to face right
        sprite.style.transform = "scaleX(1)";
      }

      sprite.style.left = position + "px";
    }

    setInterval(animate, frameDuration);
  }
};
