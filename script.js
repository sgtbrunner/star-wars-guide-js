// ********************************************************************************************************
// METHOD 1:
// ******************************************************************************************************
// DOM SELECTORS
temppage = document.getElementsByTagName('div')[0];
mainpage = document.getElementById('main-page');
ul = document.getElementById('cardlist');

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

const concatArray = (array) => {
	let people = [];
	for( i=0 ; i<array.length ; i++ ) {
		people = people.concat(array[i].results);
	}
	return people;
}

const getCharacters = async function() {
	try {
		await getData();			
		return characters = concatArray(pages);
	} catch (err) {
   		console.log('ooooooops', err);		
	}
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

// ** SWAPI has a problem handling https://swapi.co/api/people/17/ returnig error 404,
// 	which can be bypassed with the following function
const getImage = (index) => {
	if (index < 16) {
		return 'https://starwars-visualguide.com/assets/img/characters/'+(i+1)+'.jpg';
	} else {
		return 'https://starwars-visualguide.com/assets/img/characters/'+(i+2)+'.jpg';
	}
}

 //** This function switches the initial display between "Loading" and "Main Content" pages
const changedisplay = () => {
	temppage.style.display = 'none';
	mainpage.style.display ='initial';
}

const createList = async function() {
	characters = await getCharacters();
	characters = fixOrder(characters);
	for(i=0; i<characters.length; i++) {
		const li = document.createElement('div');
		li.classList.add("card");	
		const img = document.createElement('img');
		img.classList.add("picture");
		const name = document.createElement('div');
		name.classList.add("title");
		img.src = getImage(i);
		li.appendChild(img);
		name.textContent = characters[i].name;
		li.appendChild(name);
		ul.appendChild(li);
	}
	changedisplay();
}

// FUNCTION CALL
createList();

// *********************************************************************************************************
// METHOD 2: Ps: Way too slow as it fetches characters one by one. It has case clauses to handle API errors
// *********************************************************************************************************
// // DOM SELECTORS
// ul = document.getElementById('cardlist');

// // APIs
// urls = ['https://swapi.co/api/people/'];

// // FUN FUN FUNCTIONS
// const checkServer = async function() {
//   try {
// 	index = await Promise.all(urls.map(async function(url) {
//         const response = await fetch(url);
//         return response.json();
//     }));
//   } catch (err) {
//    		console.log('ooooooops', err);	
//   }
// }

// const toObject = async function(url) {
// 	try {	
// 		const response = await fetch(url);
// 		return response.json();
// 	} catch (err) {
// 	   	console.log('ooooooops', err);	
// 	}
// }

// const concatArray = async function() {
// 	people = [];
// 	try {
// 		await checkServer();
// 		for (i=0; i<=index[0].count; i++) {
// 			if(i!=16) {	 // CONDITIONAL DUE TO API UNAVAILABLE AT https://swapi.co/api/people/17		
// 				const character = await toObject('https://swapi.co/api/people/'+(i+1));
// 				console.log('character', character);
// 				people = people.concat(character)
// 			}
// 		}
// 		return people;
// 	} catch (err) {
// 	   	console.log('ooooooops', err);	
// 	}
// }

// const getCharacters = async function() {
// 	try {		
// 		return characters = concatArray();
// 	} catch (err) {
//    		console.log('ooooooops', err);		
// 	}
// }

// // // ** SWAPI has a problem handling https://swapi.co/api/people/17/ returnig error 404,
// // // 	which can be bypassed with the following function
// const getImage = (index) => {
// 	if (index < 16) {
// 		return 'https://starwars-visualguide.com/assets/img/characters/'+(i+1)+'.jpg';
// 	} else {
// 		return 'https://starwars-visualguide.com/assets/img/characters/'+(i+2)+'.jpg';
// 	}
// }

// const createList = async function() {
// 	try {		
// 		characters = await getCharacters();
// 		for(i=0; i<characters.length; i++) {
// 			const li = document.createElement('div');
// 			li.classList.add("card");	
// 			const img = document.createElement('img');
// 			img.classList.add("picture");
// 			const name = document.createElement('div');
// 			name.classList.add("title");
// 			img.src = getImage(i);
// 			li.appendChild(img);
// 			name.textContent = characters[i].name;
// 			li.appendChild(name);
// 			ul.appendChild(li);
// 		}	
// 	} catch (err) {
//    		console.log('ooooooops', err);		
// 	}
// }

// // // FUNCTION CALL
// createList();