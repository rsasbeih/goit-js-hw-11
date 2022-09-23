import './sass/index.scss';
import Notiflix from 'notiflix';
const axios = require('axios');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



const input = document.querySelector('input');
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const searchBtn = document.querySelector('.load-more');

let pageforBtn = 1;
let valueInput = '';
let totalHitsValue = '';

const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onSubmit);

searchBtn.addEventListener('click', onClick);

function onSubmit(event) {
        event.preventDefault();
        gallery.innerHTML = '';
        valueInput = event.currentTarget.elements.searchQuery.value.trim();
        if (!searchBtn.classList.contains('hidden')) {
                searchBtn.classList.add('hidden');
        }
        if (valueInput === '') {
                Notiflix.Notify.failure('Enter a query');
        } else {
                pageforBtn = 1;

                search(valueInput).then(() => {
                        if (totalHitsValue > 0) {
                                Notiflix.Notify.success(`Hooray! We found ${totalHitsValue} images.`);
                        }
                        pageforBtn += 1;
                        lightbox.refresh();
                        input.value = '';
                });
        }
}

async function search(name) {
        try {
                const response = await axios.get(
                        `https://pixabay.com/api/?key=30033102-2311f4d2ef3dab127d4c7748f&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageforBtn}`
                );
                if (response.data.hits.length === 0) {
                        Notiflix.Notify.failure(
                                'Sorry, there are no images matching your search query. Please try again.'
                        );
                }
                let hits = response.data.hits;
                let lastPage = Math.ceil(response.data.totalHits / 40);
                totalHitsValue = response.data.totalHits;

                getHits(hits);

                if (response.data.total > 40) {
                        searchBtn.classList.remove('hidden');
                }
                if (pageforBtn === lastPage) {
                        if (!searchBtn.classList.contains('hidden')) {
                                searchBtn.classList.add('hidden');
                        }
                        if (response.data.total <= 40) {
                                return;
                        }
                        Notiflix.Notify.info(
                                "We're sorry, but you've reached the end of search results."
                        );
                }
        } catch (error) {
                console.error(error);
        }
}

function getHits(data) {
        const markup = createCards(data);
        gallery.insertAdjacentHTML('beforeend', markup);
}

function createCards(data) {
        return data
                .map(
                        ({
                                webformatURL,
                                largeImageURL,
                                likes,
                                views,
                                comments,
                                downloads,
                        }) =>
                                `
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
          </a>` )
                .join('');
}

function onClick(event) {
        event.preventDefault();
        search(valueInput).then(() => {
                pageforBtn += 1;
                lightbox.refresh();
                const { height: cardHeight } = document
                        .querySelector('.gallery')
                        .firstElementChild.getBoundingClientRect();
                window.scrollBy({
                        top: cardHeight * 2,
                        behavior: 'smooth',
                });
        });
}
