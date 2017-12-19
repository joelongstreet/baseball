import settings from './settings.js';
import service from './service.js';
import { donut, triDonut, quadraDonut } from './shape.js';


function getShapeFunction(collection) {
  const shapeMap = {
    1: donut,
    2: donut,
    3: triDonut,
    4: quadraDonut,
  };

  const vertexCount = Object.keys(
    _.head(collection),
  ).length - 1;

  return shapeMap[vertexCount] || shapeMap[1];
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

// const query = "SELECT yearID as y, (SUM(SB) / SUM(G)) AS x1 FROM lahman2016.Teams WHERE teamID = 'KCA' GROUP BY yearID;"; // donut
// const query = "SELECT yearID as y, (SUM(SB) / SUM(G)) AS x1 FROM lahman2016.Teams WHERE teamID = 'KCA' GROUP BY yearID;"; // triDonut
const query = `
  SELECT
    yearID as y,
    ((SUM(H) - SUM(2B) - SUM(3B)) / SUM(G)) AS x1,
    (SUM(2B) / SUM(G)) AS x2,
    (SUM(3B) / SUM(G)) AS x3, 
    (SUM(HR) / SUM(G)) AS x4
  FROM lahman2016.Teams
    WHERE teamID = 'KCA'
  GROUP BY yearID;`; // quadraDonut

service(query, ['y'])
  .then(draw);
