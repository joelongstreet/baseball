import settings from './settings.js';
import service from './service.js';
import * as shape from './shape.js';

function draw(collection) {
  const canvas = SVG('canvas').size(`${settings.canvasWidth}mm`, `${settings.canvasHeight}mm`);

  const grid = [[]];
  collection.forEach((item) => {
    const element = shape.donut(canvas, item, grid);
    if (element.startedNewRow) {
      grid.push([element]);
    } else {
      _.last(grid).push(element);
    }
  });
}

const query = "SELECT yearID as y, (SUM(SB) / SUM(G)) AS x1 FROM lahman2016.Teams WHERE teamID = 'KCA' GROUP BY yearID;";
service(query, ['y'])
  .then(draw);
