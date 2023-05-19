import { saveBookmarks, getBookmarks, localStorage, bookmarksArray, salt } from "./exports.js";


var loginValue = await getLocal();
if (loginValue != "bitLock")
    displayBooksmarks(loginValue);


var loginForm = document.getElementById("login");
var btnSubmit = document.getElementById("btn-submit");


loginForm.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        btnSubmit.click();
    }
});

btnSubmit.addEventListener("click", () => {
    let password = loginForm.value
    if (password != '')
        password += salt;
    displayBooksmarks(password);
});




async function displayBooksmarks(submitValue) {
    let loginContainer = document.getElementById('login-container');
    loginContainer.style.display = 'none';
    let bookmarkContainer = document.getElementById('bookmarks-container');
    bookmarkContainer.style.display = 'block';
    let divHome = document.getElementById('divHome');
    divHome.style.display = 'block';


    await getBookmarks(submitValue);
    updateView();
}



async function getLocal() {
    return new Promise((resolve) => {
        localStorage.get(["temp"])
            .then(item => {
                let t = Object.values(item);
                clearLocalStorage();
                resolve(t[0]);
            })
    })
}

function clearLocalStorage() {
    localStorage.set({ ["temp"]: 'bitLock' })
}
/*    to-do folder
function filterFolderByName(item) {
    const name = getFolderName();
    return item.folder == name ? true : false;
}
function getFolderName() {
    let folder = "HOME";
    return folder;
}
*/
function deleteBookmarkById(id) {
    bookmarksArray.splice(id, 1)
}
function onMouseOver(e) {
    const currentIndex = e.target.getAttribute("data-index");
    const editBtn = document.getElementById("editBtn#" + currentIndex);
    editBtn.style.display = "inline";

}
async function onClickEdit(e) {
    e.stopPropagation()

    const listEditButtons = document.querySelectorAll(".editBtn");
    const currentIndex = e.target.getAttribute("data-index");
    const draggableList = document.querySelectorAll('.draggable');

    const favIcon = document.getElementById("favIcon#" + currentIndex);
    const deleteBtn = document.getElementById("deleteBtn#" + currentIndex);
    const textBoxTitle = document.getElementById("textBoxTitle#" + currentIndex);
    const pTitle = document.getElementById("pTitle#" + currentIndex);
    const textBoxUrl = document.getElementById("textBoxUrl#" + currentIndex);
    const pUrl = document.getElementById("pUrl#" + currentIndex);

    if (e.target.className == "editBtn editmode") {


        listEditButtons.forEach((item, index) => {
            if (index != currentIndex) {
                item.removeEventListener('click', onClickEdit);
            }
        });

        draggableList.forEach(li => {
            li.setAttribute("draggable", "false")
            li.removeEventListener('mouseover', onMouseOver);
        })

        favIcon.style.display = "none";
        deleteBtn.style.display = "inline-block";
        textBoxTitle.style.display = "inline-block";
        pTitle.style.display = "none";
        textBoxUrl.style.display = "inline-block";
        pUrl.style.display = "none";

        e.target.setAttribute("class", "editBtn savemode")
        e.target.innerHTML = "Save";


    } else if (e.target.className == "editBtn savemode") {

        draggableList.forEach(li => {
            li.setAttribute("draggable", "true");
            li.addEventListener('mouseover', onMouseOver);
        })

        favIcon.style.display = "inline";
        deleteBtn.style.display = "none";
        textBoxTitle.style.display = "none";
        pTitle.style.display = "inline";
        textBoxUrl.style.display = "none";
        pUrl.style.display = "inline";


        e.target.setAttribute("class", "editBtn editmode")
        e.target.innerHTML = "Edit";

        let valueTitle = textBoxTitle.value;
        let valueUrl = textBoxUrl.value;
        bookmarksArray[currentIndex].title = valueTitle;
        bookmarksArray[currentIndex].url = valueUrl;

        await saveBookmarks("FAVSecreto");
        updateView();
    }
}

function updateView() {

    let bookmarkList = document.getElementById("bookmarkList");
    bookmarkList.innerHTML = '';

    let divHome = document.getElementById("divHome");

    let pHome = document.createElement('p')
    divHome.innerHTML = "Home"
    divHome.appendChild(pHome)

    //to-do folder
    //bookmarksArray = bookmarksArray.filter(filterFolderByName);

    for (let i = 0; i < bookmarksArray.length; i++) {
        let currentTab = bookmarksArray[i];

        let li = document.createElement("li");
        li.setAttribute("draggable", "true");
        li.setAttribute("class", "draggable");
        li.setAttribute("data-index", i);
        li.setAttribute("id", "li#" + i);

        li.addEventListener("click", function () {
            let childEdit = this.childNodes[3].childNodes[0]
            if (childEdit.className == "editBtn editmode") {
                chrome.tabs.create({ "url": currentTab.url, "active": true })
            }
        })
        li.addEventListener("mouseover", onMouseOver)
        li.addEventListener("mouseleave", function () {

            if (editBtn.className == "editBtn editmode") {
                editBtn.style.display = "none";
            }

        })

        //favIcon and delete

        let divIcon = document.createElement("div");
        divIcon.setAttribute("class", "div-Icon");
        divIcon.setAttribute("data-index", i);

        let favIcon = document.createElement("img");
        favIcon.setAttribute("src", currentTab.favIconUrl);
        favIcon.setAttribute("class", "favIcon");
        favIcon.setAttribute("id", "favIcon#" + i);
        favIcon.setAttribute("data-index", i);



        let deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("class", "deletebtn");
        deleteBtn.setAttribute("id", "deleteBtn#" + i);
        deleteBtn.setAttribute("data-index", i);
        deleteBtn.addEventListener('click', async function (e) {
            deleteBookmarkById(e.target.getAttribute("data-index"));
            await saveBookmarks(submitValue);
            updateView();


        })

        let deleteSpan = document.createElement("span");



        let deleteImg = document.createElement('img');
        deleteImg.setAttribute("class", "deleteImg");
        deleteImg.setAttribute("src", "./images/icon-delete.png")

        deleteSpan.appendChild(deleteImg)
        deleteBtn.appendChild(deleteSpan)

        divIcon.appendChild(deleteBtn);
        divIcon.appendChild(favIcon);


        //textarea

        let textBoxTitle = document.createElement("textarea");
        textBoxTitle.setAttribute("id", "textBoxTitle#" + i);
        textBoxTitle.setAttribute("class", "textboxs titlebox");
        textBoxTitle.wrap = "off";
        textBoxTitle.innerText = currentTab.title;


        let textBoxUrl = document.createElement("textarea");
        textBoxUrl.setAttribute("id", "textBoxUrl#" + i);
        textBoxUrl.setAttribute("class", "textboxs urlbox");
        textBoxUrl.wrap = "off";
        textBoxUrl.innerText = currentTab.url;



        //title


        let divTitle = document.createElement("div");
        divTitle.setAttribute("class", "div-Title");
        divTitle.setAttribute("data-index", i);

        let pTitle = document.createElement("p");
        pTitle.setAttribute("id", "pTitle#" + i);
        pTitle.setAttribute("data-index", i);
        pTitle.innerHTML = (currentTab.title.length > 35) ? currentTab.title.slice(0, 35) + "..." : currentTab.title;


        divTitle.appendChild(pTitle);
        divTitle.appendChild(textBoxTitle);



        //url

        let divUrl = document.createElement("div");
        divUrl.setAttribute("class", "div-Url");
        divUrl.setAttribute("data-index", i);

        let pUrl = document.createElement("p");
        pUrl.setAttribute("id", "pUrl#" + i);
        pUrl.setAttribute("data-index", i);
        pUrl.innerHTML = (currentTab.url.length > 65) ? currentTab.url.slice(0, 65) + "..." : currentTab.url;


        divUrl.appendChild(pUrl);
        divUrl.appendChild(textBoxUrl);


        //edit

        let divEdit = document.createElement("div");
        divEdit.setAttribute("class", "div-Edit");
        divEdit.setAttribute("data-index", i);

        let editBtn = document.createElement("button");
        editBtn.setAttribute("class", "editBtn editmode");
        editBtn.setAttribute("id", "editBtn#" + i);
        editBtn.setAttribute("data-index", i);
        editBtn.innerHTML = "Edit";

        editBtn.addEventListener('click', onClickEdit);

        divEdit.appendChild(editBtn);



        li.appendChild(divIcon);
        li.appendChild(divTitle);
        li.appendChild(divUrl);
        li.appendChild(divEdit);

        bookmarkList.appendChild(li);

    }

    addEventListeners();
}


function addEventListeners() {
    const draggables = document.querySelectorAll('.draggable');
    const dragListItems = document.querySelectorAll('.draggable-list li');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
    });

    dragListItems.forEach(item => {
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    });
}



function dragStart() {
    dragStartIndex = +this.closest('li').getAttribute('data-index');
}

function dragEnter() {
    this.classList.add('over');
}

function dragLeave() {
    this.classList.remove('over');
}

function dragOver(e) {
    e.preventDefault();
}

async function dragDrop() {
    const dragEndIndex = +this.getAttribute('data-index');
    swapItems(dragStartIndex, dragEndIndex);
    await saveBookmarks(submitValue);
    updateView();

    this.classList.remove('over');
}
function swapItems(x, y) {
    bookmarksArray[x] = [bookmarksArray[y], bookmarksArray[y] = bookmarksArray[x]][0];
}
let dragStartIndex;

