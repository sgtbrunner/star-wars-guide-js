// CONSTANTS
const BASE_API_URL = 'https://swapi.dev/api';
const BASE_IMAGE_URL = 'https://starwars-visualguide.com/assets/img/characters/';
const BLOCK = 'block';
const DIV = 'div';
const NONE = 'none';

// DOM SELECTORS
const tempPage = document.getElementsByTagName(DIV)[0];
const mainPage = document.getElementById('main-page');
const ul = document.getElementById('cardlist');
const dialog = document.getElementById('myModal');
const dialogContainer = document.getElementsByClassName('grid-container')[0].children;
const dialogLoader = document.getElementsByClassName('modal-load')[0];
const dialogContent = document.getElementsByClassName('modal-content')[0];
const span = document.getElementsByClassName('close')[0];

// GLOBAL VARIABLES
const characters = [];

// FUNCTIONS
const capitalizeFirstLetter = (string) => string[0].toUpperCase() + string.slice(1);

const getImage = (index) =>
  typeof index === 'number' || (typeof index === 'string' && Number(index))
    ? `${BASE_IMAGE_URL}${Number(index) < 16 ? Number(index) + 1 : Number(index) + 2}.jpg`
    : null;

const getCharactersWithAddedId = async ({ url, collection }) => {
  await fetch(url || `${BASE_API_URL}/people`)
    .then((response) => response.json())
    .then(async (data) => {
      collection.push(...data.results);
      if (data.next) await getCharactersWithAddedId({ url: data.next, collection });
    });

  collection.forEach((character, index) => (character.id = index));
};

const getStats = async (url) => {
  if (url.toString()) {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (err) {
      console.log('ooooooops', err);
    }
  } else {
    return { name: 'unknown' };
  }
};

const getFilms = async (urls) => {
  try {
    const movies = [];
    for (let i = 0; i < urls.length; i++) {
      const response = await fetch(urls[i]);
      const movie = await response.json();
      movies.push(movie.title);
    }
    return movies.join(', ');
  } catch (err) {
    console.log('ooooooops', err);
  }
};

const openDialog = async (event) => {
  dialog.style.display = BLOCK;
  const index = parseInt(event.target.id);
  const [name, portrait, birth, gender, species, homeworld, films] = [...dialogContainer];

  name.innerHTML = characters[index].name;
  portrait.src = getImage(index);
  birth.innerHTML = `<u>Birth Year</u>: ${characters[index].birth_year}`;
  gender.innerHTML = `<u>Gender</u>: ${capitalizeFirstLetter(characters[index].gender)}`;
  const race = await getStats(characters[index].species);
  species.innerHTML = `<u>Species</u>: ${race.name}`;
  const planet = await getStats(characters[index].homeworld);
  homeworld.innerHTML = `<u>Homeworld</u>: ${planet.name}`;
  const movies = await getFilms(characters[index].films);
  films.innerHTML = `<u>Films</u>: ${movies}`;
  switchDisplay(dialogLoader, dialogContent, NONE, BLOCK);

  span.onclick = () => {
    dialog.style.display = NONE;
    switchDisplay(dialogLoader, dialogContent, BLOCK, NONE);
  };

  window.onclick = (event) => {
    if (event.target == dialog) {
      dialog.style.display = NONE;
      switchDisplay(dialogLoader, dialogContent, BLOCK, NONE);
    }
  };
};

const switchDisplay = (page1, page2, style1, style2) => {
  page1.style.display = style1;
  page2.style.display = style2;
};

const loadApp = async function () {
  await getCharactersWithAddedId({ collection: characters });
  characters.forEach((character) => {
    const li = document.createElement(DIV);
    li.classList.add('card');
    li.id = character.id;
    const img = document.createElement('img');
    img.id = character.id;
    img.classList.add('picture');
    const cardname = document.createElement(DIV);
    cardname.classList.add('title');
    img.src = getImage(character.id);
    li.appendChild(img);
    cardname.innerHTML = character.name;
    li.appendChild(cardname);
    ul.appendChild(li);

    li.onclick = openDialog;
  });

  switchDisplay(tempPage, mainPage, NONE, BLOCK);
};

// LOAD APP
loadApp();
