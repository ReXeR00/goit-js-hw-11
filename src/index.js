
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

async function handleSearchRequest(request, page, perPage) {
  try {
    const { data } = await onRequestSerchFetch(request, page, perPage);
    let hasImage = Math.ceil(data.totalHits / perPage);
    if (page > hasImage) {
      addBtnEl.classList.add('visually-hidden');
      infoEnd.classList.remove('visually-hidden');
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    } else {
      galleryEl.insertAdjacentHTML('beforeend', onRenderResponse(data.hits));
      lightbox.refresh();
    }
  } catch (e) {
    console.log(e);
  }
}

handleSearchRequest(request, page, perPage);





function onSearchClick(e) {
  galleryEl.innerHTML = '';
  page = 1;
  // console.log(page);
  e.preventDefault();

  request = e.currentTarget.searchQuery.value;

  addBtnEl.classList.add('visually-hidden');
  infoEnd.classList.add('visually-hidden');

  async function handleSearchRequest(request, page, perPage) {
    try {
      const { data } = await onRequestSerchFetch(request, page, perPage);
      if (data.totalHits > 0) {
        galleryEl.innerHTML = onRenderResponse(data.hits);
        lightbox.refresh();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
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
    } catch (e) {
      console.log(e);
    }
  }
  
  // Wywołanie funkcji:
  handleSearchRequest(request, page, perPage);

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

