import settings from './settings.js';
import * as service from './service.js';
import { donut, triDonut, quadraDonut } from './shape.js';


function getShapeFunction(collection) {
  const sample = _.head(collection);

  if (sample.x3) return quadraDonut;
  if (sample.x2) return triDonut;

  return donut;
}

function draw(collection) {
  let svg = `<svg width="${settings.canvasWidth}mm" height="${settings.canvasHeight}mm" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink";>`;
  const shape = getShapeFunction(collection);

  const grid = [[]];
  collection.forEach((item) => {
    const element = shape(item, grid);
    if (element.startedNewRow) {
      grid.push([element]);
    } else {
      _.last(grid).push(element);
    }

    svg += element.domElement;
  });

  svg += '</svg>';

  document.getElementById('canvas').innerHTML = svg;
}


function q() {
  const query = {
    franchId: 'KCR',
    stats: ['hr', 'h', 'sb', 'era'],
  };

  service.queryStats(query)
    .then(draw);
}

setTimeout(q, 500);
