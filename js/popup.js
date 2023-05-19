import { saveBookmarks, getBookmarks, localStorage, bookmarksArray, salt } from './exports.js'



var btnGetTabs = document.getElementById("btn-getTabs");
btnGetTabs.addEventListener("click", async () => {
    let submitValue = document.getElementById("login").value;
    submitValue += salt;
    await saveLocal(submitValue);
    chrome.runtime.openOptionsPage();
});


var btnSaveCurrentTab = document.getElementById("btn-saveTabs");
btnSaveCurrentTab.addEventListener("click", () => {
    let submitValue = document.getElementById("login").value;
    submitValue += salt;
    addBookmark(submitValue);
});



async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}


async function addBookmark(submitValue) {
    await getBookmarks(submitValue);

    getCurrentTab().then(tab => {
        //tab.folder = "HOME";
        bookmarksArray.push(tab);
        saveBookmarks(submitValue)
    })
}


async function saveLocal(value) {
    return new Promise((resolve) => {
        resolve(
            localStorage.set({ ["temp"]: value }),
        )
    })
}





