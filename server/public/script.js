const imagesContainer = document.getElementById('imagesContainer');
const mangaListElement = document.getElementById('mangaList');
const validMangaList = document.getElementById('validMangaList');
const currentChapter = document.getElementById('currentChapter');
const totalPages = document.getElementById('totalPages');
const oroboros = document.getElementById('oroboros');
const plusSc = document.getElementById('plusSc');
const minSc = document.getElementById('minSc');
const valueSc = document.getElementById('valueSc');
const startSc = document.getElementById('startSc');
const stopSc = document.getElementById('stopSc');
const pageInput = document.getElementById('pge');
const goto = document.getElementById('goto');
const baseUrl = "http://localhost:8080/api";
const imagesRemaning = 3;

let mangaData = [];
let loading = false;
let scrolling = false;
let scrollAmount = 3;
let scrollInterval = 10;

function scrollPage() {
    if(scrolling) {
        window.scrollBy(0, scrollAmount);
        setTimeout(scrollPage, scrollInterval);    
    }
}

async function updatePageNumber(page) {
    if (!isNaN(page) && pageInput) {
        pageInput.value = page;
    }
}

async function getDictionnary() {
    try {
        const response = await fetch(`${baseUrl}/dictionnary`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement du fichier JSON:', error);
    }
}

async function getImg(id, page, nextTo = true) {
    try {
        loaderToggle();
        const response = await fetch(`${baseUrl}/manga/${id}/page/${page}`);
        loaderToggle();
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        const imgElement = document.createElement('img');
        imgElement.src = "data:image/jpeg;base64," + data;
        imgElement.setAttribute('page', page);
        updatePageNumber(page);

        if (nextTo === false) {
            imagesContainer.insertBefore(imgElement, imagesContainer.firstChild);
        } else {
            imagesContainer.appendChild(imgElement);
        }
    } catch (error) {
        console.error('Erreur lors du chargement du fichier JSON:', error);
    }
}

async function getMangaInfos(id) {
    try {
        const response = await fetch(`${baseUrl}/manga/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement du fichier JSON:', error);
    }
}

async function loadFirstImage(id, page = 0) {
    if (loading) return;
    loading = true;

    mangaData = await getMangaInfos(id);
    if (typeof handleScroll === 'function') {
        window.removeEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', () => handleScroll(mangaListElement.value));

    getTotalPage();
    getCurrentChapter();

    try {
        if ( 0 <= page && page < mangaData.length ) {
            await getImg(id, page);
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error);
    } finally {
        loading = false;
    }
}

async function loadNextImage(id, nextPage) {
    if (loading) return;
    loading = true;
    
    try {
        if (nextPage < mangaData.length) {
            if (imagesContainer.children.length > imagesRemaning) {
                imagesContainer.removeChild(imagesContainer.children[0]);
            }
            
            await getImg(id, nextPage);
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error);
    } finally {
        loading = false;
    }
}

async function loadPreviousImage(id, previousPage) {
    if (loading) return;
    loading = true;
    
    try {
        if (previousPage >= 0) {
            if (imagesContainer.children.length > imagesRemaning) {
                imagesContainer.removeChild(imagesContainer.children[imagesContainer.children.length-1]);
            }
            
            await getImg(id, previousPage, false);
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'image:', error);
    } finally {
        loading = false;
    }
}

function isBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight-500;
}

function isTop() {
    return window.scrollY <= 500;
}

async function handleScroll(id) {
    let pages = anlayseExistingPage()
    if (pages.min > 0|| pages.max < mangaData.length) {   
        if (isBottom()) {
            await loadNextImage(id, pages.max + 1);
        } else if (isTop()) {
            await loadPreviousImage(id, pages.min - 1, false);
        }

        getTotalPage();
        getCurrentChapter();
    }
}

function getTotalPage(){
    totalPages.textContent = mangaData.length;
}

function getCurrentChapter(){
    let ccpr = mangaData.find((el) => el.page == pageInput.value);
     if(ccpr != undefined){
        currentChapter.textContent = ccpr.chapter + ", page : " + ccpr.chapterPage
     }
}

function loaderToggle(){
    oroboros.classList.toggle('hide');
}

function anlayseExistingPage(){
    const images = document.querySelectorAll('#imagesContainer img');
    let maxPage = -Infinity;
    let minPage = Infinity;
    
    images.forEach(image => {
        const page = parseInt(image.getAttribute('page'), 10);
        if (!isNaN(page)) {
            maxPage = Math.max(maxPage, page);
            minPage = Math.min(minPage, page);
        }
    });
    return {
        min : minPage,
        max : maxPage
    }
}

async function init(){
    const list = await getDictionnary();
    console.log(list)
    list.forEach(manga => {
        const option = document.createElement('option');
        option.value = manga.id;
        option.textContent = manga.name + "-" + manga.discoveredOn;
        mangaListElement.appendChild(option);
    });
}

init();

validMangaList.addEventListener('click', () => {
    imagesContainer.innerHTML = '';
    loadFirstImage(mangaListElement.value)
        
    
});

goto.addEventListener('click', () => {
    imagesContainer.innerHTML = '';
    if(!isNaN(pageInput.value)){
        loadFirstImage(mangaListElement.value, pageInput.value)
    }
});

startSc.addEventListener("click", function() {
    scrolling = true;
    scrollPage();
    minSc.disabled = false;
    plusSc.disabled = false;
    stopSc.disabled = false;
    startSc.disabled = true;
});

stopSc.addEventListener("click", function() {
    scrolling = false;
    scrollPage();
    minSc.disabled = true;
    plusSc.disabled = true;
    stopSc.disabled = true;
    startSc.disabled = false;
});

minSc.addEventListener("click", function() {
    if(scrollAmount >= -15) {
        scrollAmount--;
        valueSc.textContent = scrollAmount;
    }
});

plusSc.addEventListener("click", function() {
    if(scrollAmount <= 15) {
        scrollAmount++;
        valueSc.textContent = scrollAmount;
    }
});