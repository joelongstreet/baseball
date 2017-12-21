import stats from './stats.js';
import { normalize } from './util.js';


function queryStats(query) {
  const selectKeys = query.stats.slice().concat('y');
  const filteredStats = stats
    .filter(stat => stat.franchId === query.franchId)
    .map(teamStats => _.pick(teamStats, selectKeys));

  return Promise.resolve(
    normalize(filteredStats, ['y']),
  );
}


export { queryStats };
