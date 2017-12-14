import settings from './settings.js';

function circle(r, x, y) {
  return `<circle r="${r}mm" cx="${x}mm" cy="${y}mm" fill="${settings.shape.fill}" stroke="${settings.shape.stroke}" stroke-width="${settings.shape.strokeWidth}mm"></circle>`;
}

export { circle };
