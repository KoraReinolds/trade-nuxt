import { Candles } from "@prisma/client";

const dbName = "candlestickDB";
const objectStoreName = "candlesticks";
const version = 1;

export class IndexedDB {
  static db: IDBDatabase;

  init() {
    const request = indexedDB.open(dbName, version);

    return new Promise((_resolve) => {
      request.onupgradeneeded = function () {
        const db = request.result;

        const objectStore = db.createObjectStore(objectStoreName, {});

        objectStore.createIndex("time", "time", { unique: true });

        IndexedDB.db = request.result;
        _resolve(IndexedDB.db);
      };

      request.onsuccess = function () {
        IndexedDB.db = request.result;
        _resolve(IndexedDB.db);
      };
    });
  }

  add(data: Candles[]) {
    const objectStore = IndexedDB.db
      .transaction(objectStoreName, "readwrite")
      .objectStore(objectStoreName);

    for (const item of data) {
      objectStore.add(item, item.id);
    }
  }

  searchByIndex(index: string, query?: IDBKeyRange): Promise<Candles> {
    return new Promise((_resolve, _reject) => {
      const request = IndexedDB.db
        .transaction(objectStoreName, "readonly")
        .objectStore(objectStoreName)
        .index(index)
        .getAll(query);

      request.onsuccess = function (event) {
        const target = event.target as IDBRequest;
        const candlesticks = target.result as Candles;
        _resolve(candlesticks);
      };

      request.onerror = function (event) {
        _reject(event);
      };
    });
  }
}
