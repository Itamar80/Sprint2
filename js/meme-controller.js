'use strict'

var userImageSrc;
var memeToDataUrl;
var isModalOpen = false
var imgs = getImgs()
var gMeme = getMemes()
var gKeyword = getKeywords()
var gCanvas;
var gCtx;
var gPicId;
var isDraggeble = false;
var gSelectedLineIdx = gMeme.selectedLineIdx;



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
        img.src = `./meme-imgs (square)/${gPicId}.jpg`;
    } else {
        img.src = userImageSrc.src
    }

    img.onload = () => {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        for (var i = 0; i < gMeme.lines.length; i++) {
            drawTxt(gMeme.lines[i].txt, gMeme.lines[i].x, gMeme.lines[i].y, i)
            if (gCostumes.length > 0) {
                drawCostumes(gCostumes[i].url)
            }
        }
    }
}

function renderUserInputImg(img) {

    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
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


function onShowDiff(elValue) {
    var elDiffText = document.querySelector('.show-diff')
    elDiffText.innerText = elValue
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
    onloadImageFromInput(ev, renderUserInputImg)
}

function onloadImageFromInput(ev, onImageReady) {
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
var gClickedLine;

function canvasClicked(ev) {
    const { offsetX, offsetY } = ev;
    gClickedLine = getLine(offsetX, offsetY);

    // console.log(gClickedLine);

    // var clickedLineIdx = gMeme.lines.findIndex(line => {
    //         let startX = line.x;
    //         let startY = line.y;
    //         let endX = startX + (gCtx.measureText(line.txt).width);
    //         let endY = startY - line.size;
    //         // console.log(startX, startY, endX, endY, xEvent, yEvent);
    //         return (xEvent >= startX && xEvent <= endX && yEvent <= startY && yEvent >= endY);
    //     })
    // console.log(clickedLine);
    // gSelectedLineIdx = clickedLineIdx
    switchInput()
}
var gSelectedLine;

function getLine(offsetX, offsetY) {

    var clickedLine = gMeme.lines.find(line => {
        var textLength = gCtx.measureText(line.txt).width;
        let startX = line.x - (textLength / 2);
        let startY = line.y - line.size;
        let endX = startX + textLength;
        let endY = line.y;
        // console.log('startx', startX, 'starty', startY, 'endx', endX, 'endy', endY, 'x', x, 'y', y);
        return (offsetX >= startX && offsetX <= endX && offsetY >= startY && offsetY <= endY);
    })

    return clickedLine
}


function onMouseDown(ev) {
    // var { offsetX, offsetY } = ev;
    // if (gClickedLine) {

    // }

}

function onMouseMove(ev) {
    // var { offsetX, offsetY } = ev;
    // gClickedLine.x = offsetX
    // gClickedLine.y = offsetY
    // drawImgFromlocal()
}

function onMouseUp(ev) {
    // isDraggeble = false
    // var { offsetX, offsetY } = ev;

    // gClickedLine.x = offsetX
    // gClickedLine.y = offsetY

    // drawImgFromlocal()


}