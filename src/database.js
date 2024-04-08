import { model } from "./routes/board";

// Función para guardar un objeto diccionario en IndexedDB
const databaseName = "WoSTraslator";
const objectStoreName = "DB";

export function saveDictToIndexedDB(dict = model) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore(objectStoreName, { keyPath: "key", autoIncrement: false });
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(objectStoreName, "readwrite");
        const objectStore = transaction.objectStore(objectStoreName);
  
        for (let [key, value] of Object.entries(dict)) {
          objectStore.put({ key, value });
        }
  
        transaction.oncomplete = () => {
          resolve();
        };
  
        transaction.onerror = (error) => {
          reject(error);
        };
      };
  
      request.onerror = (error) => {
        reject(error);
      };
    });
  }
  
  // Función para obtener un diccionario de IndexedDB
export function getDictFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);

      request.onupgradeneeded = (event) => {
        saveDictToIndexedDB();
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(objectStoreName, "readonly");
        const objectStore = transaction.objectStore(objectStoreName);
        const dict = {};
  
        objectStore.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
  
          if (cursor) {
            dict[cursor.key] = cursor.value.value;
            cursor.continue();
          } else {
            resolve(dict);
          }
        };
  
        transaction.onerror = (error) => {
          reject(error);
        };
      };
  
      request.onerror = (error) => {
        reject(error);
      };
    });
  }


export function deleteKeyFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);

      const deleteRequest = objectStore.delete(key);

      deleteRequest.onsuccess = () => {
        resolve();
      };

      deleteRequest.onerror = (error) => {
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  })
}

export function clearIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);

    request.onupgradeneeded = (event) => {
      saveDictToIndexedDB();
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      objectStore.clear();

      transaction.oncomplete = () => {
        saveDictToIndexedDB();
        resolve();
      };

      transaction.onerror = (error) => {
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  })
}

export function addEntryToIndexedDB(key, value) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);

      objectStore.put({key, value});

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (error) => {
        reject(error);
      };
    };
    
    request.onerror = (error) => {
      reject(error);
    };
  })
}
