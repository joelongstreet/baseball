const SETTINGS = {
  CANVAS_W: 384,
  CANVAS_H: 790,
  MARGIN: 19.05,
  PADDING: 5,
  HOLE_R: 3.25, // 3.175 * 2 = 6.35mm (quarter inch, little extra for wiggle room)
  MIN_R: 13,
  MAX_R: 45,
  SHAPE: {
    stroke: '#0000ff',
    fill: 'none',
    'stroke-width': '.1mm',
  },
  FONT: {
    family: 'Roboto Condensed',
    size: 13,
    anchor: 'middle',
    fill: '#000000',
  },
};


function clamp(input, inMin, inMax, outMin, outMax) {
  return (
    (
      (input - inMin) * (outMax - outMin)
    ) / (inMax - inMin)
  ) + outMin;
}


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
    .filter(key => !excludeKeys.includes(key))
    .forEach((key) => {
      maxSets[key] = Math.max(
        ...Array.from(collection, c => c[key]),
      );
      minSets[key] = Math.min(
        ...Array.from(collection, c => c[key]),
      );
    });

  const normalizedSet = collection.map((item) => {
    const newItem = {};

    Object.keys(item)
      .forEach((key) => {
        if (!excludeKeys.includes(key)) {
          newItem[key] = clamp(
            item[key], minSets[key], maxSets[key], 0, 1,
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
    clamp(item.x1, 0, 1, SETTINGS.MIN_R, SETTINGS.MAX_R)
    , 2);

  let xFormula = [SETTINGS.MARGIN, r];
  let yFormula = [SETTINGS.MARGIN, r];
  let startedNewRow = false;

  const last = _.last(_.last(shapes));
  if (last) {
    const trial = [last.x, last.r, r, SETTINGS.PADDING];
    const threshold = SETTINGS.CANVAS_W - SETTINGS.MARGIN - r;
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
    yFormula = [maxY, SETTINGS.PADDING, r];
  }

  const x = _.sum(xFormula);
  const y = _.sum(yFormula);

  canvas.circle(`${r * 2}mm`)
    .attr(SETTINGS.SHAPE)
    .cx(`${x}mm`)
    .cy(`${y}mm`);

  canvas.circle(`${SETTINGS.HOLE_R * 2}mm`)
    .attr(SETTINGS.SHAPE)
    .cx(`${x}mm`)
    .cy(`${y}mm`);

  canvas.text(String(item.y))
    .font(SETTINGS.FONT)
    .move(`${x}mm`, `${(y + r) - 8}mm`);

  return {
    x, y, r, startedNewRow,
  };
}


function draw(collection) {
  const canvas = SVG('canvas').size(`${SETTINGS.CANVAS_W}mm`, `${SETTINGS.CANVAS_H}mm`);

  const grid = [[]];
  collection.forEach((item) => {
    const shape = drawDonut(canvas, item, grid);
    if (shape.startedNewRow) {
      grid.push([shape]);
    } else {
      _.last(grid).push(shape);
    }
  });
}

const sampleQuery = "SELECT yearID as y, (SUM(SB) / SUM(G)) AS x1 FROM lahman2016.Teams WHERE teamID = 'KCA' GROUP BY yearID;";
query(sampleQuery)
  .then(normalize)
  .then(draw);
