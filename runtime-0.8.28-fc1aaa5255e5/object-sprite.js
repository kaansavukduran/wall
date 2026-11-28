export function objectSprite(canvas, url, columns) {
  const context = canvas.getContext('2d');
  const sprite = new Image();
  const {width, height} = canvas;
  let frame = 0;

  function draw() {
    if (!context || !sprite.naturalWidth) return;
    context.clearRect(0, 0, width, height);
    context.drawImage(sprite, frame % columns * width, Math.floor(frame / columns) * height,
      width, height, 0, 0, width, height);
    canvas.hidden = false;
  }

  sprite.addEventListener('load', draw, {once:true});
  sprite.src = url.href;
  return index => {
    frame = index;
    draw();
  };
}
