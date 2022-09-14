// Described in documentation;
import SimpleLightbox from "simplelightbox";
// Additional styles import
import "simplelightbox/dist/simple-lightbox.min.css";
import { galleryItems } from './gallery-items.js';
const listImg = document.querySelector(".gallery");
let instance;
createImgList(galleryItems, listImg);

function createImgList(items, list) {
  const markup = items
    .map(item => {
      return `
      <li class="gallery__item">
  <a class="gallery__link" href="${item.original}">
      <img class="gallery__image"
      src="${item.preview}"
      data-source="${item.original}"
      alt="${item.description}"/>
   </a>
      </li>`;
    })
    .join('');
  list.innerHTML = markup;
}
function maximizePhoto(event) {
  event.preventDefault();
  const selectedImg = event.target;
  instance = basicLightbox.create(`
    <img src="${selectedImg.dataset.source}" width="800" height="600">
`);

  instance.show();
}
listImg.addEventListener("click", maximizePhoto);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    instance.close();
  }
});