const dbName = "candlestickDB";
const objectStoreName = "candlesticks";
const version = 1;

interface IndexedDBData {
  date: string;
  open: number;
}

export class IndexedDB {
  static db: IDBDatabase;

  init() {
    const request = indexedDB.open(dbName, version);

    return new Promise((_resolve) => {
      request.onupgradeneeded = function () {
        const db = request.result;

        const objectStore = db.createObjectStore(objectStoreName, {
          keyPath: "id",
          autoIncrement: true,
        });

        objectStore.createIndex("date", "date", { unique: false });
        objectStore.createIndex("open", "open", { unique: false });

        IndexedDB.db = request.result;
        _resolve(IndexedDB.db);
      };

      request.onsuccess = function () {
        IndexedDB.db = request.result;
        _resolve(IndexedDB.db);
      };
    });
  }

  add(data: IndexedDBData[]) {
    const objectStore = IndexedDB.db
      .transaction(objectStoreName, "readwrite")
      .objectStore(objectStoreName);

    for (const item of data) {
      objectStore.add(item);
    }
  }

  searchByIndex(index: string, query?: IDBKeyRange): Promise<IndexedDBData> {
    return new Promise((_resolve, _reject) => {
      const request = IndexedDB.db
        .transaction(objectStoreName, "readonly")
        .objectStore(objectStoreName)
        .index(index)
        .getAll(query);

      request.onsuccess = function (event) {
        const target = event.target as IDBRequest;
        const candlesticks = target.result as IndexedDBData;
        _resolve(candlesticks);
      };

      request.onerror = function (event) {
        _reject(event);
      };
    });
  }
}
