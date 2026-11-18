//브라우저 저장공간 만들기
// IndexedDB
// └─ sockDesignDB
//     └─ images

const DB_NAME = 'sockDesignDB';
const STORE_NAME = 'images';

export function openDB() {
    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export async function saveImage(file) {

    const db = await openDB();

    const transaction = db.transaction(
        STORE_NAME,
        'readwrite'
    );

    const store = transaction.objectStore(STORE_NAME);

    store.put(file, 'sockImage');
}

export async function getImage() {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            STORE_NAME,
            'readonly'
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.get('sockImage');

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}