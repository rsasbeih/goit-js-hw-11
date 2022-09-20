
import Notiflix from 'notiflix';
const axios = require('axios');
const input = document.querySelector(".search");
const hits = document.querySelector(".gallery");
const form = document.querySelector(".search-form");
const loadMore = document.querySelector(".load-more");
// Described in documentation
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.gallery a', {});
let page = 1;
let totalHits = 0;
form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', loadMoreImages);

function onSubmit(event) {
        event.preventDefault();
        loadMore.style.display = "none";
        hits.innerHTML = '';
        page = 1;
        getHits(input.value.trim()).then(() => {
                loadMore.style.display = "block";
                Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        });
}

async function getHits(input) {
        const response = await axios.get(`https://pixabay.com/api/?key=30033102-2311f4d2ef3dab127d4c7748f&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
        if (response.data.hits.length == 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
        }
        lightbox.refresh();
        totalHits += response.data.hits;
        if (response.data.totalHits == totalHits) {
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                loadMore.style.display = "none";
                return;
        }
        console.log(Object.values(response));
        let results = response.data.hits;
        let markup = results.map(({
                webformatURL,
                largeImageURL,
                likes,
                views,
                comments,
                downloads,
        }) => `
          <a href="${largeImageURL}"> 
          <div class="image-card">
          <img src="${webformatURL}" width="200" height="200" loading="lazy"/>
        <div class="info">
        <p class="info__item">
                <b>Likes</b>
                <b>${likes}</b>
        </p>
        <p class="info__item">
                <b>Views</b>
                <b>${views}</b>
        </p>
        <p class="info__item">
                <b>Comments</b>
                <b>${comments}</b>
        </p>
        <p class="info__item">
                <b>Downloads</b>
                <b>${downloads}</b>
        </p>
        </div>
              </div>
          </a>`);
        hits.insertAdjacentHTML('beforeend', markup);
}
function loadMoreImages(event) {
        event.preventDefault();
        page += 1;
        getHits(input.value.trim()).then(() => {
                const { height: cardHeight } = document
                        .querySelector(".gallery")
                        .firstElementChild.getBoundingClientRect();

                window.scrollBy({
                        top: cardHeight * 2,
                        behavior: "smooth",
                });
        });
}