'use strict'

var isOpen = false

function toggleMenu() {
    isOpen = !isOpen
    document.body.classList.toggle('menu-open');
    var elHam = document.querySelector('.hamburger');
    if (isOpen) {
        elHam.innerText = 'x'
    } else {
        elHam.innerText = '☰'
    }
}

function onEditView() {
    const elGallery = document.querySelector('.gallery');
    elGallery.hidden = true;
    const elMemeEditor = document.querySelector('.editor-container');
    elMemeEditor.hidden = false;
}