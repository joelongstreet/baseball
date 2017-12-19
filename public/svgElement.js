import settings from './settings.js';

const pxToMm = 3.779528;
let font;

opentype.load(settings.font.filePath, (err, fnt) => {
  font = fnt;
});


function circle(r, coords) {
  return `<circle r="${r}mm" cx="${coords.x}mm" cy="${coords.y}mm" fill="${settings.shape.fill}" stroke="${settings.shape.stroke}" stroke-width="${settings.shape.strokeWidth}mm"></circle>`;
}


function text(txt, coords) {
  const path = font.getPath(
    txt,
    coords.x * pxToMm,
    coords.y * pxToMm,
    settings.font.size,
  );

  path.fill = settings.font.fill;
  path.strokeWidth = 0;

  return `<path d="${path.toPathData()}"/>`;
}


function polygon(points, coords) {
  const pointString = points.map((point) => {
    return `${(point.x + coords.x) * pxToMm}, ${(point.y + coords.y) * pxToMm}`;
  }).join(' ');

  return `<polygon fill="${settings.shape.fill}" stroke="${settings.shape.stroke}" stroke-width="${settings.shape.strokeWidth}mm" points="${pointString}" />`;
}

export { circle, text, polygon };
