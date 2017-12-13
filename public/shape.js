import settings from './settings.js';
import * as util from './util.js';

function donut(canvas, item, shapes) {
  const r = _.round(
    util.clamp(item.x1, 0, 1, settings.minRadius, settings.maxRadius)
    , 2);

  let xFormula = [settings.margin, r];
  let yFormula = [settings.margin, r];
  let startedNewRow = false;

  const last = _.last(_.last(shapes));
  if (last) {
    const trial = [last.x, last.r, r, settings.padding];
    const threshold = settings.canvasWidth - settings.margin - r;
    if (_.sum(trial) < threshold) {
      xFormula = trial;
    } else {
      startedNewRow = true;
    }
  }

  const penult = startedNewRow ? _.last(shapes) : shapes[shapes.length - 2];
  if (penult) {
    const maxY = Math.max(
      ...penult.map(shape => shape.r + shape.y),
    );
    yFormula = [maxY, settings.padding, r];
  }

  const x = _.sum(xFormula);
  const y = _.sum(yFormula);

  canvas.circle(`${r * 2}mm`)
    .attr(settings.shape)
    .cx(`${x}mm`)
    .cy(`${y}mm`);

  canvas.circle(`${settings.holeRadius * 2}mm`)
    .attr(settings.shape)
    .cx(`${x}mm`)
    .cy(`${y}mm`);

  canvas.text(String(item.y))
    .font(settings.font)
    .move(`${x}mm`, `${(y + r) - 8}mm`);

  return {
    x, y, r, startedNewRow,
  };
}

export { donut };