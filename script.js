const form = document.getElementById('form');
const search = document.getElementById('search');
const content = document.getElementById('content');

const divModal = document.getElementById('modal');
const divModalInfo = document.getElementById('modal_info');
const posterModal = document.getElementById('poster_modal');
const trailerMovie = document.getElementById('trailer_movie');
const notTrailer = document.querySelector('.not_trailer');
const textarea = document.getElementById('textarea');

const nameMovieModal = document.getElementById('name_movie_modal');
const releaseDateModal = document.getElementById('release_date_modal');
const voteAverageModal = document.getElementById('vote_average_modal');

const APIMOVIES = 'https://api.themoviedb.org/3/discover/movie?api_key=f6541db294ac187416fae0f1b9effcce&language=pt-BR';
const IMAGEPATH = 'https://image.tmdb.org/t/p/w500/';
const APISEARCH = 'https://api.themoviedb.org/3/search/movie?api_key=f6541db294ac187416fae0f1b9effcce&language=pt-BR&include_adult=false&query=';

async function getMovies(url) {
  const apiResponse = await fetch(url);
  const apiData = await apiResponse.json();

  setMovies(apiData.results);
}

async function getMoviesId(id) {
  const apiResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=f6541db294ac187416fae0f1b9effcce&language=pt-BR`);
  const apiData = await apiResponse.json();

  return apiData;
}

async function getTrailer(id) {
  const apiResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=f6541db294ac187416fae0f1b9effcce&language=pt-BR`);
  const apiData = await apiResponse.json();

  return apiData.results;
}

function cleanModal() {
  trailerMovie.innerHTML = '';
  posterModal.attributes[1].value = '';
  posterModal.attributes[2].value = '';
  nameMovieModal.innerText = '';
  voteAverageModal.innerText = '';
  releaseDateModal.innerText = '';
  textarea.value = '';
}

function modalOpenClose(status) {

  if(status) {
    divModal.classList.remove('none');
    divModal.classList.add('flex');
  } else {
    divModal.classList.add('none');
    divModal.classList.remove('flex');
    document.body.style.overflow = 'auto';

    cleanModal();
  }
}

async function setModalData(id) {
  modalOpenClose(true);

  const movie = await getMoviesId(id);
  const trailer = await getTrailer(id);

  const {title, release_date, vote_average, poster_path, overview} = movie;

  if(trailer[0]) {
    let iframe = `
      <iframe
        id="iframe" 
        src="https://www.youtube.com/embed/${trailer[0].key}" 
        frameborder="0" 
        allow="accelerometer; 
        autoplay; clipboard-write; 
        encrypted-media; 
        gyroscope; 
        picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;

    let div = document.createElement('div');
    div.innerHTML = iframe;
    trailerMovie.appendChild(div);
    
  } else {
    
    let div = document.createElement('div');
    div.classList.add('not_trailer');
    div.innerHTML = 'Infelizmente não temos este trailer :(';
    trailerMovie.appendChild(div);
  }

  posterModal.attributes[1].value = IMAGEPATH + poster_path;
  posterModal.attributes[2].value = title;
  nameMovieModal.innerText = title;
  voteAverageModal.innerText = vote_average;
  releaseDateModal.innerText = release_date;
  textarea.value = overview;
}

async function setMovies(movies) {
  content.innerText = '';

  movies.forEach(movie => {
    if(movie.poster_path) {
      const {id, title, vote_average, poster_path} = movie;

      let card = `
        <div class="card" onclick="setModalData(${id})">

          <img src="${IMAGEPATH + poster_path}" alt="imagem" />

          <div class="box_name_vote">

            <span class="box_name">${title}</span>

            <span class="box_vote">${vote_average}</span>

          </div>

        </div>
      `;

      let div = document.createElement('div');
      // div.classList.add('card');
      div.innerHTML = card;
      content.appendChild(div);
    }
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();

  let searchValue = search.value;

  if(searchValue) {
    getMovies(APISEARCH + searchValue);

    search.value = '';
  }
})

getMovies(APIMOVIES);