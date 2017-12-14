import settings from './settings.js';
import service from './service.js';
import * as shape from './shape.js';

function draw(collection) {
  let svg = `<svg width="${settings.canvasWidth}mm" height="${settings.canvasHeight}mm" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink";>`;

  const grid = [[]];
  collection.forEach((item) => {
    const element = shape.donut(item, grid);
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

const query = "SELECT yearID as y, (SUM(SB) / SUM(G)) AS x1 FROM lahman2016.Teams WHERE teamID = 'KCA' GROUP BY yearID;";
service(query, ['y'])
  .then(draw);
