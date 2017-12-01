const CANVAS_W = 384;
const CANVAS_H = 790;
const MARGIN = 19.05;
const PADDING = 5;
const HOLE_R = 3.25; // 3.175 * 2 = 6.35mm (quarter inch, little extra for wiggle room)
const MIN_R = 13;
const MAX_R = 45;

const SHAPE_SETTINGS = {
  stroke: '#0000ff',
  fill: 'none',
  'stroke-width': '.1mm',
};

const FONT_SETTINGS = {
  family: 'Roboto Condensed',
  size: 13,
  anchor: 'middle',
  fill: '#000000',
};


function query(sqlStatement) {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');

  return fetch(
    new Request('/'),
    {
      method: 'post',
      headers,
      body: JSON.stringify({
        query: sqlStatement,
      }),
    },
  ).then(response => response.json());
}


function normalize(collection) {
  const excludeKeys = ['y'];
  const sample = collection[0];
  const maxSets = {};
  const minSets = {};

  Object.keys(sample)
    .filter((key) => {
      return !excludeKeys.includes(key);
    })
    .forEach((key) => {
      maxSets[key] = Math.max(
        ...Array.from(collection, c => c[key])
      );
      minSets[key] = Math.min(
        ...Array.from(collection, c => c[key])
      );
    });

  const normalizedSet = collection.map((item) => {
    const newItem = {};

    Object.keys(item)
      .forEach((key) => {
        if (!excludeKeys.includes(key)) {
          newItem[key] = clamp(
            item[key], minSets[key], maxSets[key], 0, 1
          );
        } else {
          newItem[key] = item[key];
        }
      });

    return newItem;
  });

  return Promise.resolve(normalizedSet);
}


function drawDonut(canvas, item, shapes) {
  const r = _.round(
    clamp(item.x1, 0, 1, MIN_R, MAX_R)
  , 2);

  let xFormula = [MARGIN, r];
  let yFormula = [MARGIN, r];
  let startedNewRow = false;

  let last = _.last(_.last(shapes));
  if (last) {
    const trial = [last.x, last.r, r, PADDING];
    const threshold = CANVAS_W - MARGIN - r;
    if (_.sum(trial) < threshold) {
      xFormula = trial;
    } else {
      startedNewRow = true;
    }
  }

  const penult = startedNewRow ? _.last(shapes) : shapes[shapes.length - 2];
  if(penult) {
    const maxY = Math.max.apply(
      Math,
      penult.map(shape => shape.r + shape.y)
    );
    yFormula = [maxY, PADDING, r];
  }

  const x = _.sum(xFormula);
  const y = _.sum(yFormula);

  canvas.circle(`${r*2}mm`)
    .attr(SHAPE_SETTINGS)
    .cx(`${x}mm`)
    .cy(`${y}mm`);

  canvas.circle(`${HOLE_R*2}mm`)
    .attr(SHAPE_SETTINGS)
    .cx(`${x}mm`)
    .cy(`${y}mm`);

  canvas.text(String(item.y))
    .font(FONT_SETTINGS)
    .move(`${x}mm`, `${y + r - 8}mm`);

  return {x, y, r, startedNewRow};
}


function draw(collection) {
  const canvas = SVG('canvas').size(`${CANVAS_W}mm`, `${CANVAS_H}mm`);

  let grid = [[]];
  collection.forEach((item) => {
    let shape = drawDonut(canvas, item, grid);
    if (shape.startedNewRow) {
      grid.push([shape]);
    } else {
      _.last(grid).push(shape);
    }
  });
}

function clamp(input, inMin, inMax, outMin, outMax) {
  return (input - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const sampleQuery = `SELECT yearID as y, (SUM(SB) / SUM(G)) AS x1 FROM lahman2016.Teams WHERE teamID = 'KCA' GROUP BY yearID;`;
query(sampleQuery)
  .then(normalize)
  .then(draw);

// TODO:
// Incoporate more than one stat to make shapes
// move to a sql lite db on the client?
// Have a linegraph to preview
