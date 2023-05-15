
import { onRequestSerchFetch } from './js/fetch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const addBtnEl = document.querySelector('.load-more');
const infoEnd = document.querySelector('.info-end');
const lightbox = new SimpleLightbox('.gallery a');
const perPage = 40;
let page = 1;
let request = '';

formEl.addEventListener('submit', onSearchClick);
addBtnEl.addEventListener('click', onAddImage);

function onAddImage() {
  page += 1;
  // console.log(page);

  onRequestSerchFetch(request, page, perPage)
    .then(({ data }) => {
      let hasImage = Math.ceil(data.totalHits / perPage);
      if (page > hasImage) {
        addBtnEl.classList.add('visually-hidden');
        infoEnd.classList.remove('visually-hidden');
        return Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
      }
      galleryEl.insertAdjacentHTML('beforeend', onRenderResponse(data.hits));
      // this
      lightbox.refresh();
    })
    .catch(e => console.log(e));
}

function onSearchClick(e) {
  galleryEl.innerHTML = '';
  page = 1;
  // console.log(page);
  e.preventDefault();

  request = e.currentTarget.searchQuery.value;

  addBtnEl.classList.add('visually-hidden');
  infoEnd.classList.add('visually-hidden');

  onRequestSerchFetch(request, page, perPage)
    .then(({ data }) => {
      if (data.totalHits > 0) {
        galleryEl.innerHTML = onRenderResponse(data.hits);
        // this
        lightbox.refresh();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        // scrool
        window.scrollBy({
          behavior: 'smooth',
        });

        if (data.totalHits > perPage) {
          addBtnEl.classList.remove('visually-hidden');
        } else {
          infoEnd.classList.remove('visually-hidden');
        }
      } else {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(e => console.log(e));
}

function onRenderResponse(values) {
  return values
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class="list-item" ><a class="gallery__item" href="${largeImageURL}">

  <img loading ='lazy' class="gallery__image" src="${webformatURL}" alt="${tags}" />
   <div class="info">
   <p class="info-item">
     <b>Likes</b>
     ${likes}
   </p>
   <p class="info-item">
     <b>Views</b>
     ${views}
   </p>
   <p class="info-item">
     <b>Comments</b>
     ${comments}
   </p>
   <p class="info-item">
     <b>Downloads</b>
     ${downloads}
   </p>
 </div>
</a>
</li>`
    )
    .join('');
}

