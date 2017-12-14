import settings from './settings.js';

const mmToPx = 3.779528;
let font;

opentype.load(settings.font.filePath, (err, fnt) => {
  font = fnt;
});

function circle(r, x, y) {
  return `<circle r="${r}mm" cx="${x}mm" cy="${y}mm" fill="${settings.shape.fill}" stroke="${settings.shape.stroke}" stroke-width="${settings.shape.strokeWidth}mm"></circle>`;
}

function text(txt, x, y) {
  const path = font.getPath(
    txt,
    x * mmToPx,
    y * mmToPx,
    settings.font.size,
  );

  path.fill = settings.font.fill;
  path.strokeWidth = 0;

  return `<path d="${path.toPathData()}"/>`;
}

export { circle, text };
