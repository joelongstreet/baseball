import settings from './settings.js';
import * as util from './util.js';
import { circle, polygon, text } from './svgElement.js';


function polyClamp(val) {
  return util.clamp(val, 0, 1, settings.minRadius, settings.maxRadius);
}


function getPosition(r, item, shapes) {
  let xFormula = [settings.margin, r];
  let yFormula = [settings.margin, r];

  let startedNewRow = false;

  const last = _.last(_.last(shapes));
  if (last) {
    const trial = [last.coords.x, last.r, r, settings.padding];
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
      ...penult.map(shape => shape.r + shape.coords.y),
    );
    yFormula = [maxY, settings.padding, r];
  }

  const coords = {
    x: _.sum(xFormula),
    y: _.sum(yFormula),
  };

  return { coords, startedNewRow };
}


function donut(item, shapes) {
  const r = _.round(
    util.clamp(item.x1, 0, 1, settings.minRadius, settings.maxRadius)
    , 2);

  const { coords, startedNewRow } = getPosition(r, item, shapes);

  const domElement = [
    circle(r, coords),
    circle(settings.holeRadius, coords),
    text(
      String(item.y),
      {
        x: coords.x - 3.3,
        y: ((coords.y + r) - 8),
      },
    ),
  ].join('');

  return {
    coords, r, startedNewRow, domElement,
  };
}


function triDonut(item, shapes) {
  const max = _.max([item.x1, item.x2, item.x3]);
  const r = _.round(
    util.clamp(max, 0, 1, settings.minRadius, settings.maxRadius)
    , 2);

  const { coords, startedNewRow } = getPosition(r, item, shapes);
  const points = [
    { x: 0, y: -1 * polyClamp(item.x1) },
    { x: polyClamp(item.x2), y: polyClamp(item.x2) * 0.667 },
    { x: -1 * polyClamp(item.x3), y: polyClamp(item.x3) * 0.667 },
  ];

  const domElement = [
    polygon(points, coords),
    circle(settings.holeRadius, coords),
    text(
      String(item.y),
      {
        x: coords.x - 3.3,
        y: coords.y + 10,
      },
    ),
  ].join('');

  return {
    coords, r, startedNewRow, domElement,
  };
}


function quadraDonut(item, shapes) {
  const max = _.max([item.x1, item.x2, item.x3, item.x4]);
  const r = _.round(
    util.clamp(max, 0, 1, settings.minRadius, settings.maxRadius)
    , 2);

  const { coords, startedNewRow } = getPosition(r, item, shapes);
  const points = [
    { x: 0, y: polyClamp(item.x1) },
    { x: polyClamp(item.x2), y: 0 },
    { x: 0, y: -1 * polyClamp(item.x3) },
    { x: -1 * polyClamp(item.x4), y: 0 },
  ];

  const domElement = [
    polygon(points, coords),
    circle(settings.holeRadius, coords),
    text(
      String(item.y),
      {
        x: coords.x - 3.3,
        y: coords.y + 10,
      },
    ),
  ].join('');

  return {
    coords, r, startedNewRow, domElement,
  };
}

export { donut, triDonut, quadraDonut };
