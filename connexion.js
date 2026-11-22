import * as SQLite from 'expo-sqlite';

let dbPromise = null;

export const getDb = () => {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('maison-petale.db');
  return dbPromise;
};
