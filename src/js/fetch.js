import axios from 'axios';

const API_KEY = '29578283-f288e571e878ef9103bc84709';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;

async function onRequestSerchFetch(userSearch, page, perPage) {
  return await axios.get(
    `${BASE_URL}&q=${userSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
}

export { onRequestSerchFetch };
