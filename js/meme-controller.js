'use strict'

var imgs = getImgs()
var gMeme = getMemes()
var gKeyword = getKeywords()
var gCanvas;
var gCtx;
var picId;


function init() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    drawImgFromlocal()
    renderImg()
}



function renderImg() {
    var strHTMLs = mapImgs();
    var elCardsContainer = document.querySelector('.cards-container');
    elCardsContainer.innerHTML = strHTMLs.join('');
}


function drawImgFromlocal() {
    var img = new Image()
    img.src = `./meme-imgs (square)/${picId}.jpg`;
    img.onload = () => {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
        gCtx.drawImage(img, 10, 10, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        for (var i = 0; i < gMeme.lines.length; i++) {
            drawTxt(gMeme.lines[i].txt, gMeme.lines[i].x, gMeme.lines[i].y, i)
        }
    }
}

function mapImgs() {
    var strHTMLs = imgs.map(img => {
        return `<img class="card" id="${img.id}" onclick="onEditView(); onFindPic(this)" src="${img.url}"></img>`
    })
    return strHTMLs
}

function onChangeTxt() {
    changeTxt()
}

function onDrawTxt(text, x, y, idx) {
    drawTxt(text, x, y, idx)
}

function onFindPic(pic) {
    findPic(pic)
}

function onIncreaseDecrease(diff) {
    increaseDecrease(diff)
}

function onTextPosition(diff) {
    textPosition(diff)
}

function onAddLine() {
    addLine()
}


function onSwitchInput() {
    switchInput()
}

function onOpenSavedMemes() {
    var elSavedMemesP = document.querySelector('.saved-memes-p')
    var loadedImgs = loadFromStorage(SAVED_MEME)
    if (!loadedImgs || !loadedImgs.length) {

        elSavedMemesP.innerText = 'You don\'t have saved memes yet'
    } else {
        var imgsHTMLs = loadedImgs.map(loadedImg => {
            return `<img class="loaded-meme" src="${loadedImg}"></img>`
        });
        var elMemeImgs = document.querySelector('.saved-memes-imgs');
        elMemeImgs.innerHTML = imgsHTMLs.join('');
    }

    var elGallery = document.querySelector('.gallery');
    var elSavedMemesTab = document.querySelector('.saved-memes');
    var elEditor = document.querySelector('.editor-container')
    elEditor.hidden = true;
    elGallery.hidden = true;
    elSavedMemesTab.hidden = false;
}

function onLogoClick() {
    var elGallery = document.querySelector('.gallery');
    var elSavedMemesTab = document.querySelector('.saved-memes');
    var elMemeEditor = document.querySelector('.editor-container');
    elMemeEditor.hidden = true;
    elGallery.hidden = false;
    elSavedMemesTab.hidden = true;
}

function onSaveMeme() {
    var elSavedMeme = document.querySelector('#my-canvas');
    var memeToDataUrl = elSavedMeme.toDataURL("meme.png");
    var elGallery = document.querySelector('.gallery');
    var elMemeEditor = document.querySelector('.editor-container');
    elMemeEditor.hidden = true;
    elGallery.hidden = false;
    saveMeme(memeToDataUrl)
    var firstLine = gMeme.lines.filter(line => {
        return line.id === 0
    });
    gMeme.lines = firstLine
    gMeme.lines[0].txt = 'Write your text here'
    var elInput = document.querySelector('.meme-input')
    elInput.value = ''
    idx = 0;
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function onSearchKeyword() {
    var imgsArray = [];
    var elInput = document.querySelector('.input');
    var searchKeyword = elInput.value
    if (searchKeyword === '') {
        console.log('banana');
        renderImg()
    } else {
        for (let i = 0; i < imgs.length; i++) {
            for (let j = 0; j < imgs[i].keywords.length; j++) {
                if (searchKeyword === imgs[i].keywords[j]) {
                    imgsArray.push(imgs[i])
                }
            }
        }

        var strHTMLs = imgsArray.map(img => {
            return `<img class="card" id="${img.id}" onclick="onEditView(); onFindPic(this)" src="${img.url}"></img>`
        })
        var elCardsContainer = document.querySelector('.cards-container');
        elCardsContainer.innerHTML = strHTMLs.join('');
    }
}


function onCanvasClicked(ev) {
    console.log(ev);
    canvasClicked(ev)
}

// function onMouseDown(ev) {
//     console.log(ev);

//     // mouseDown(ev)
// }

// function onMouseUp(ev) {
//     console.log(ev);

//     // mouseUp(ev)
// }

// function onMouseMove(ev) {

//     mouseMove(ev)
// }

function onUseCostume() {
    var elCostume = document.querySelector('.costume-type');
    drawCostume(elCostume, idx)

}