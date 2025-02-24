export const Stores = {
  SchoolDesK: "SchoolDesK",
};

let request;
let db;
let version;
let dbName = "School-Desk";

export const initDB = () => {
  return new Promise((resolve) => {
    // open the connection
    let request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.SchoolDesK)) {
        console.log("Creating SchoolDesK store");
        db.createObjectStore(Stores.SchoolDesK, {
          autoIncrement: false,
        });
       
      }

      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log({db, version});
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addUserData = (storeName, data, key) => {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      console.log("request.onsuccess - addData", data);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.add(data, key);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};

export const getUserData = (storeName, key) => {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName);

    request.onsuccess = () => {
      console.log("request.onsuccess - getAllData");
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.get(key);
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
};
