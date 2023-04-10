import { Candles } from "@prisma/client";

const version = 1;

export class IndexedDB {
  static db: IDBDatabase;
  name = "";

  init(name: string) {
    this.name = name;
    const request = indexedDB.open(name, version);

    return new Promise((_resolve) => {
      request.onupgradeneeded = function () {
        const db = request.result;

        const objectStore = db.createObjectStore(name, {});

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

  static clearDB(names: string[]) {
    names.forEach((name) => {
      indexedDB.deleteDatabase(name);
    });
  }

  add(data: Candles[]) {
    const objectStore = IndexedDB.db
      .transaction(this.name, "readwrite")
      .objectStore(this.name);

    for (const item of data) {
      objectStore.add(item, item.id);
    }
  }

  searchByIndex(index: string, query?: IDBKeyRange): Promise<Candles[]> {
    return new Promise((_resolve, _reject) => {
      const request = IndexedDB.db
        .transaction(this.name, "readonly")
        .objectStore(this.name)
        .index(index)
        .openCursor(query);

      const result: Candles[] = [];

      request.onsuccess = function () {
        const cursor = request.result;

        if (cursor) {
          const candlestick = cursor.value as Candles;
          result.push(candlestick);
          cursor.continue();
        } else {
          _resolve(result);
        }
      };

      request.onerror = function (event) {
        _reject(event);
      };
    });
  }
}
