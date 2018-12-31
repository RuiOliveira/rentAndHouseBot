/**
 * @typedef {import('mongodb').Db} MongoDb
 */

/**
 *
 * @param {MongoDb} db
 * @param {string} sortField - date column to order by desc
 */
const batchProperties = (db, sortField) => {
  const sort = {};
  sort[`is${capitalizeFirstLetter(sortField)}`] = 1;
  sort[sortField] = 1;

  const filter = {
    _id: false, url: true, provider: true
  };
  filter[`is${capitalizeFirstLetter(sortField)}`] = true;
  filter[sortField] = true;

  return db.collection('properties')
    .find({})
    .project(filter)
    .sort(sort)
    .limit(4)
    .toArray();
};

/**
 *
 * @param {MongoDb} db
 * @param {function} callback
 * @param {*} vars
 */
const updateDateBatch = (db, callback, vars) => {
  const { url, sortField, status } = vars;
  let { set } = vars;

  if (!set) {
    set = {};
  }

  set[sortField] = new Date();
  set[`is${capitalizeFirstLetter(sortField)}`] = true;

  if (status) set['status'] = status;

  db.collection('properties').updateOne(
    { url: url },
    { $set: set },
    callback
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { batchProperties, updateDateBatch };