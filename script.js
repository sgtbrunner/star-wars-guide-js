// DOM SELECTORS
const temppage = document.getElementsByTagName('div')[0];
const mainpage = document.getElementById('main-page');
const ul = document.getElementById('cardlist');
const modal = document.getElementById('myModal');
const modalcontainer = document.getElementsByClassName("grid-container")[0].children;
const modalload = document.getElementsByClassName("modal-load")[0];
const modalcontent = document.getElementsByClassName("modal-content")[0];
const span = document.getElementsByClassName('close')[0];

// APIs
urls = [
	'https://swapi.co/api/people/',
	'https://swapi.co/api/people/?page=2',
	'https://swapi.co/api/people/?page=3',
	'https://swapi.co/api/people/?page=4',
	'https://swapi.co/api/people/?page=5',
	'https://swapi.co/api/people/?page=6',
	'https://swapi.co/api/people/?page=7',
	'https://swapi.co/api/people/?page=8',
	'https://swapi.co/api/people/?page=9',
]

// FUN FUN FUNCTIONS

// Gets all the characters from different pages and concat them in a single array
const getCharacters = async function() {
	try {
		await getData();			
		return characters = concatArray(pages);
	} catch (err) {
   		console.log('ooooooops', err);		
	}
}

// Fetches all the character data information from API server and store it in pages as it's defined on SWAPI
const getData = async function() {
  try {
	pages = await Promise.all(urls.map(async function(url) {
        const response = await fetch(url);
        return response.json();
    }));
  } catch (err) {
   		console.log('ooooooops', err);	
  }
}

// Function for concating information in an array
const concatArray = (array) => {
	let people = [];
	for( i=0 ; i<array.length ; i++ ) {
		people = people.concat(array[i].results);
	}
	return people;
}

// ** Needed to fix the order which characters are displayed, repositioning Padmé Amidala and Ratts Tyerell in
// order to match the image database at https://starwars-visualguide.com/assets/img/characters/
const fixOrder = (array) => {
	characters.splice(33,0,array.pop());
	const ratts = characters[72];
	characters.splice(72,1);
	characters.splice(45,0,ratts);
	return characters
}

// ** This auxiliar function adds obj2 props into obj1 and returns obj1
const augment = (obj1, obj2) => {
	let prop;
	for(prop in obj2) {
		if (obj2.hasOwnProperty(prop) && !obj1[prop]) {
			obj1[prop] = obj2[prop];
		}
	}
	return obj1;
}

// ** This function adds ID property to every object without ID inside a given array of objects
const addId = (array) => {
	array.map((item, index) => {
			const newprop = {id: index}
			return item = augment(item, newprop);
	})
}

// ** SWAPI has an issue handling https://swapi.co/api/people/17/ returnig error 404,
// 	which can be bypassed with the following function
const getImage = (index) => {
	if (index < 16) {
		return `https://starwars-visualguide.com/assets/img/characters/${(index+1)}.jpg`;
	} else {
		return `https://starwars-visualguide.com/assets/img/characters/${(index+2)}.jpg`;
	}
}

// Used for fetching "species" and "homeworld" information from characters
const getStats = async function(url) {
	// SWAPI hasn't defined "species" nor "homeworld" for some characters, therefore it has to be handled accordingly
	if (url.toString()!=='' && url.toString()!==[] && url.toString()!=={}) {
		try {		
	        const response = await fetch(url);
	        return await response.json();
		} catch (err) {
	   		console.log('ooooooops', err);		
		}	
	} else {
		return {"name": "unknown"};
	}
}

// Used for fetching "films" information from characters
const getFilms = async function(urls) {
	let movies = '';
	try {
		for (i=0; i<urls.length; i++) {
			let response = await fetch(urls[i]);
			let movie = await response.json();
			if (i < urls.length-1) {
				movies += movie.title + ', ';
			} else {
				movies += movie.title;
			}
		} 
	} catch (err) {
	   		console.log('ooooooops', err);	
		}
	  	return movies;
}

// Creates modal with character information onclick
const openModal = async function(event) {
	modal.style.display = "block";
	const index = parseInt(event.path[1].id);
	const [name, portrait, birth, gender, species, homeworld, films ] = 
		  [modalcontainer[0], modalcontainer[1], modalcontainer[2], modalcontainer[3], modalcontainer[4], modalcontainer[5], modalcontainer[6]];
	name.innerHTML = characters[index].name;
	portrait.src = getImage(index);
	birth.innerHTML = `<u>Birth Year</u>: ${characters[index].birth_year}`;
	gender.innerHTML = `<u>Gender</u>: ${characters[index].gender}`;
	const race = await getStats(characters[index].species);
	species.innerHTML = `<u>Species</u>: ${race.name}`;
	const planet = await getStats(characters[index].homeworld);
	homeworld.innerHTML = `<u>Homeworld</u>: ${planet.name}`;
	const movies = await getFilms(characters[index].films);
	films.innerHTML = `<u>Films</u>: ${movies}`;
	switchDisplay(modalload, modalcontent, 'none', 'block');
// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
		switchDisplay(modalload, modalcontent, 'block', 'none');
	}
// When the user clicks anywhere outside of the modal, close the modal
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";			
			switchDisplay(modalload, modalcontent, 'block', 'none');
		}
	}
}


 //** This function changes the display between "page1" and "page2" pages between "style1" and "style2"
const switchDisplay = (page1, page2, style1, style2) => {
	page1.style.display = style1;
	page2.style.display = style2;
}

// Creates a list with all the character cards on the main page
const createList = async function() {
	characters = await getCharacters();
	characters = fixOrder(characters);
	addId(characters);
	for(i=0; i<characters.length; i++) {
		const li = document.createElement('div');
		li.classList.add("card");
		li.id = characters[i].id;
		const img = document.createElement('img');
		img.classList.add("picture");
		const cardname = document.createElement('div');
		cardname.classList.add("title");
		img.src = getImage(characters[i].id);
		li.appendChild(img);
		cardname.innerHTML = characters[i].name;
		li.appendChild(cardname);
		ul.appendChild(li);
// When the user clicks on the button, open the modal
		li.onclick = openModal;
	}
	switchDisplay(temppage, mainpage, 'none', 'block');
}

// FUNCTION CALL
createList();