import { model } from "./routes/board";

// Función para guardar un objeto diccionario en IndexedDB
const databaseName = "WoSTraslator";
const objectStoreName = "DB";

export function saveDictToIndexedDB(dict = model) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(objectStoreName, { keyPath: "key", autoIncrement: false });
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

export function clearIndexedDB(initialData = model) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, { keyPath: "key", autoIncrement: false });
        if (initialData) {
          const transaction = event.target.transaction;
          const objectStore = transaction.objectStore(objectStoreName);
          for (const [key, value] of Object.entries(initialData)) {
            objectStore.add({ key, value });
          }
        }
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, { keyPath: "key", autoIncrement: false });
        if (initialData) {
          const transaction = event.target.transaction;
          const objectStore = transaction.objectStore(objectStoreName);
          for (const [key, value] of Object.entries(initialData)) {
            objectStore.add({ key, value });
          }
        }
      }
      
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        if (initialData) {
          for (const [key, value] of Object.entries(initialData)) {
            objectStore.add({ key, value });
          }
        }
        resolve();
      };

      clearRequest.onerror = (error) => {
        reject(error);
      };
    };

    request.onerror = (error) => {
      reject(error);
    };
  });
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
