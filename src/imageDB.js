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

    // 트랜잭션 완료 후 저장 성공을 알리고, null이면 이미지를 삭제한다.
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        if (file) store.put(file, 'sockImage');
        else store.delete('sockImage');
        transaction.oncomplete = () => { db.close(); resolve(); };
        transaction.onerror = () => { db.close(); reject(transaction.error); };
        transaction.onabort = () => { db.close(); reject(transaction.error); };
    });
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
        transaction.oncomplete = () => db.close();
        transaction.onabort = () => { db.close(); reject(transaction.error); };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
}
