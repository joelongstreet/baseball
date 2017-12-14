import * as util from './util.js';

// returns a collection with each property normalized between zero and one
// normalization is based on max and min values for each object property
function normalize(collection, excludeKeys = []) {
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
          newItem[key] = util.clamp(
            item[key], minSets[key], maxSets[key], 0, 1,
          );
        } else {
          newItem[key] = item[key];
        }
      });

    return newItem;
  });

  return normalizedSet;
}

export default function query(sqlStatement, dontNormalizeKeys = []) {
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
  ).then((response) => {
    return response.json()
      .then((ds) => {
        return normalize(ds, dontNormalizeKeys);
      });
  });
}
