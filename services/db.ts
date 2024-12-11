import ForerunnerDB from 'forerunnerdb';


const fdb = new ForerunnerDB();
const db = fdb.db('myDatabaseName');
db.persist.dataDir('./forerunnerData');

export const collectionsStore = db.collection('collectionName', { primaryKey: 'id' });
