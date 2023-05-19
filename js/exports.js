export var storage = chrome.storage.sync;

export var localStorage = chrome.storage.local;

export var bookmarksArray = new Array();

export var salt = "Z8w3Sy4UxHcwx7p3CtNe"


export async function saveBookmarks(submitValue) {
    let hashValue = hex_sha256(submitValue);

    bookmarksArray = bookmarksArray.filter(Boolean);
    const encryptedStorage = await encryptBookmarks(bookmarksArray, submitValue);


    return new Promise((resolve) => {
        resolve(
            storage.set({ [hashValue]: encryptedStorage }),
        )
    })
}
export async function getBookmarks(submitValue) {
    let hashValue = hex_sha256(submitValue);
    return new Promise((resolve) => {
        bookmarksArray = [];

        storage.get([hashValue])
            .then(sync => {
                let hash = Object.values(sync)[0]
                decryptBookmarks(hash, submitValue);

                bookmarksArray = bookmarksArray.filter(Boolean);
                resolve(bookmarksArray);
            })


    })
}


//
export async function encryptBookmarks(bookmarks, password) {
    let backup = {
        "bookmarks": bookmarks
    };

    return new Promise((resolve, reject) => {
        resolve(
            Tea.encrypt(JSON.stringify(backup), password)
        )
    })
}

export function decryptBookmarks(storage, password) {
    try {
        let decrypted = Tea.decrypt(storage, password);
        let restoredData = JSON.parse(decrypted);

        bookmarksArray = restoredData.bookmarks;
    } catch {
        console.log("storage cant be decrypted");
    }

}