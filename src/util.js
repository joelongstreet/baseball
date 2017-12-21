function clamp(input, inMin, inMax, outMin, outMax) {
  return (
    (
      (input - inMin) * (outMax - outMin)
    ) / (inMax - inMin)
  ) + outMin;
}


// returns a collection with each property normalized between zero and one
// normalization is based on max and min values for each object property
function normalize(collection, excludeKeys = []) {
  const sample = collection[0];
  const maxSets = {};
  const minSets = {};

  // determine min and max values for each given property
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

  // constrain each key's value to lie between the min and max
  // attach x0, x1, ... values for easier drawing
  const normalizedSet = collection.map((item) => {
    const newItem = {};

    Object.keys(item)
      .forEach((key, i) => {
        if (!excludeKeys.includes(key)) {
          const val = clamp(
            item[key], minSets[key], maxSets[key], 0, 1,
          );
          newItem[key] = val;
          newItem[`x${i}`] = val;
        } else {
          newItem[key] = item[key];
        }
      });

    return newItem;
  });

  return normalizedSet;
}


export { clamp, normalize };
