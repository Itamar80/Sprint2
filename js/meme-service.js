'use strict'
const SAVED_MEME = 'Saved meme'
var savedMemes = [];
var idx = 0;

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
        id: idx,
        type: 'line',
        txt: 'Write your text here',
        size: 40,
        align: 'center',
        color: 'white',
        borderColor: 'blue',
        x: 330,
        y: 70,
        fontFamily: 'impact'
    }]
}
var gCostumes = []


var gKeywords = {
    'happy': 0,
    'funny puk': 0,
    'funny': 0,
    'comics': 0,
    'dogs': 0,
    'drinks': 0,
    'books': 0,
    'baby': 0,

}

function getKeywords() {
    return gKeywords
}


function getMemes() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function drawTxt(text, x, y, idx) {
    gCtx.fillStyle = gMeme.lines[idx].color;
    gCtx.font = gMeme.lines[idx].size + 'px ' + gMeme.lines[idx].fontFamily;
    gCtx.textAlign = gMeme.lines[idx].align;
    gCtx.color = gMeme.lines[idx].color;
    gCtx.strokeStyle = gMeme.lines[idx].borderColor
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}

function drawCostumes(img) {
    gCtx.drawImage(img, 10, 10);
    gCtx.font = gCostumes[idx - 1].size + 'px sans serif';
    gCtx.textAlign = gCostumes[idx - 1].align;
}

function addToArray(img) {
    idx++
    gCostumes.push({
        id: idx,
        type: 'costume',
        x: 20,
        y: 20,
        size: 1,
        align: 'left',
        url: img.src,
    })
}


function changeTxt() {
    var memeText = document.querySelector('.meme-input');
    gMeme.lines[idx].txt = memeText.value;
    drawImgFromlocal()
}

function findPic(pic) {
    gPicId = pic.id;
    drawImgFromlocal()
}

function increaseDecrease(diff) {
    gMeme.lines[idx].size = diff

    // }
    // if (gCostumes[idx - 1].type === 'costume') {
    //     gCostumes[idx - 1].size += diff

    // }
    drawImgFromlocal()
}

function textPosition(diff) {

    gMeme.lines[idx].y += diff
        // else gCostumes[idx].y += diff
    drawImgFromlocal()
}


function addLine() {
    idx++
    gMeme.lines.push({
        id: idx,
        txt: 'Write your text here',
        size: 40,
        align: 'left',
        color: 'white',
        x: 250,
        y: 500,
        type: 'line',
        borderColor: 'blue',
        fontFamily: 'monster'

    })
    drawImgFromlocal()
    var elInput = document.querySelector('.meme-input');
    elInput.value = '';
    elInput.focus();
}




function switchInput() {

    var cordinates = {
        offsetX: gMeme.lines[idx].x,
        offsetY: gMeme.lines[idx].y
    }
    if (idx === 0 && gMeme.lines.length !== 1) {
        idx++
        var elInput = document.querySelector('.meme-input');
        elInput.value = '';
        elInput.focus();

        return cordinates
    }
    if (idx === gMeme.lines.length - 1) {
        idx = 0
        var elInput = document.querySelector('.meme-input');
        elInput.value = '';
        elInput.focus();
        return cordinates
    }
    if (idx >= 0) {
        idx++
        var elInput = document.querySelector('.meme-input');
        elInput.value = '';
        elInput.focus();
        return cordinates
    }

}


function saveMeme(memeToDataUrl) {
    var storage = loadFromStorage(SAVED_MEME)
    if (storage) {
        savedMemes = storage
    }
    savedMemes.push(memeToDataUrl)
    saveToStorage(SAVED_MEME, savedMemes)
}






// function mouseMove(ev) {
//     const { offsetX: x, offsetY: y } = ev;

// }

// function mouseDown(x, y) {
//     // console.log(x, y);
//     canvasClicked(ev)
// }

// function mouseUp(x, y) {
//     moveLine(x, y)
// }

function changeDirectionRTL() {
    gMeme.lines[idx].align = 'left'
    drawImgFromlocal()
    var elInput = document.querySelector('.meme-input');
    elInput.focus();
}

function changeDirectionLTR() {
    gMeme.lines[idx].align = 'right'
    drawImgFromlocal()
    var elInput = document.querySelector('.meme-input');
    elInput.focus();
}

function changeDirectionCTR() {
    gMeme.lines[idx].align = 'center'
    drawImgFromlocal()
    var elInput = document.querySelector('.meme-input');
    elInput.focus();
}