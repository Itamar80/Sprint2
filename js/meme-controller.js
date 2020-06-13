'use strict'

var userImageSrc;
var memeToDataUrl;
var isModalOpen = false
var imgs = getImgs()
var gMeme = getMemes()
var gKeyword = getKeywords()
var gCanvas;
var gCtx;
var picId;


function init() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    // var elImgFromUser = document.querySelector('.img-from-user')
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
    if (!userImageSrc) {
        img.src = `./meme-imgs (square)/${picId}.jpg`;
    } else {
        img.src = userImageSrc.src
        gCanvas.style.width = '650'
        gCanvas.style.height = '650'
    }

    img.onload = () => {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
        gCtx.drawImage(img, 10, 10, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        for (var i = 0; i < gMeme.lines.length; i++) {
            drawTxt(gMeme.lines[i].txt, gMeme.lines[i].x, gMeme.lines[i].y, i)
            if (gCostumes.length > 0) {
                drawCostumes(gCostumes[i].url)
            }
        }
    }
}

function renderUserInputImg(img) {
    gCanvas.width = img.width;
    gCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0);
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
    memeToDataUrl = elSavedMeme.toDataURL("meme.png");
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
    canvasClicked(ev)
}

function onMouseDown(ev) {
    mouseDown(ev)
}

function onMouseUp(ev) {

    mouseUp(ev)
}

function onMouseMove(ev) {
    mouseMove(ev)
}

function onAddToArray(img) {
    addToArray(img)
    drawCostumes(img)
}

function downloadImg(elLink) {
    var elSavedMeme = document.querySelector('#my-canvas');
    memeToDataUrl = elSavedMeme.toDataURL("meme.png");
    var imgContent = memeToDataUrl
    elLink.href = imgContent
}

function uploadImg(elForm, ev) {
    ev.preventDefault();
    var elSavedMeme = document.querySelector('#my-canvas');
    memeToDataUrl = elSavedMeme.toDataURL("meme.png");

    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        // <a href="#" onclick="downloadImg(this)" download="meme.png" class="download ">Download</a>

        var shareContainer = document.querySelector('.share-container')
        shareContainer.innerHTML = `

        <a class="download share-link" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share 
        </a>`
        var shareBtn = document.querySelector('.share-btn');
        shareBtn.style.display = 'none'
    }
    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(function(res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function(err) {
            console.error(err)
        })
}

function toggleModal() {
    isModalOpen = !isModalOpen
    var elModal = document.querySelector('.share-modal');
    elModal.classList.toggle('remove');
}

function onChangeTextColor() {
    var textColor = document.querySelector('[name=color]').value;
    gMeme.lines[idx].color = textColor;
    drawImgFromlocal()
}

function onChangeDirectionRTL() {
    changeDirectionRTL()
}

function onChangeDirectionLTR() {
    changeDirectionLTR()
}

function onChangeDirectionCTR() {
    changeDirectionCTR()
}

function onRemoveLine() {
    gMeme.lines.splice(idx, 1)
    idx--
    var elInput = document.querySelector('.meme-input');
    elInput.value = '';
    elInput.focus();
    drawImgFromlocal()
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderUserInputImg)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function(event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
        userImageSrc = img


    }
    reader.readAsDataURL(ev.target.files[0]);
}

function onChangeBorder() {
    var borderTypeOfColor = document.querySelector('[name=border-color]').value;
    gMeme.lines[idx].borderColor = borderTypeOfColor;
    drawImgFromlocal()
}

function onChangeFontFamily() {
    var selectedFontFamily = document.querySelector('.select').value;
    gMeme.lines[idx].fontFamily = selectedFontFamily
    console.log(gMeme.lines[idx].fontFamily);

}