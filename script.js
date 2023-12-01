const api_key = 'api_key=4f46962b363cfe26872ea0c32828207e';

const BASE_URL = 'https://api.themoviedb.org/3/';

const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + api_key;

const imagemPoster_URL = "https://image.tmdb.org/t/p/w500";

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const searchURL = BASE_URL + '/search/movie?' + api_key;


getMovies(API_URL);

function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);

        showMovies(data.results);
    })
}


function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('filme');
        movieEl.innerHTML = `
             <img class="foto_filme" src="${imagemPoster_URL + poster_path}" alt="${title}">

                <div class="info-filme">
                    <h3>${title}</h3>
                    <span class="${getColor(vote_average)}"> ${vote_average}</span>
                </div>
                
                <div class="descricao-filme">
                    <h3>Descricao</h3>
                    ${overview}
                 
                </div>    
               <button class="saiba-mais" id="${id}">Saiba Mais</button>
             `

        main.appendChild(movieEl); /* Coloca elemento filme no main  */

        document.getElementById(id).addEventListener('click', () => {
            console.log(id)
            openNav(movie)
        })
    })
}

function getColor(vote) {
    if (vote >= 8) {
        return "green"
    } else if (vote >= 5) {
        return "orange"
    } else {
        return "red"
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm)
    } else {
        getMovies(API_URL)
    }
})


/* ------------------- OVERLAY SAIBA MAIS W3S-------------------*/
const overlayContent = document.getElementById('overlay-content');

function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL + '/movie/' + id + '/videos?' + api_key).then(res => res.json())
        .then(videoData => {
            console.log(BASE_URL + '/movie/' + id + '/videos?' + api_key)
            console.log(videoData);

            if (videoData) {
                document.getElementById("myNav").style.width = "100%";
                if (videoData.results.length > 0) {
                    var embed = [];
                    videoData.results.forEach(video => {
                        let { name, key, site } = video;

                        if (site == 'YouTube') {

                            embed.push(`

                            <iframe 
                            width="560" height="315" src="https://www.youtube.com/embed/${key}" 
                            title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                            gyroscope; picture-in-picture; web-share" allowfullscreen>
                            </iframe>
                           
                        `)
                        }

                    })

                    overlayContent.innerHTML = embed.join('');
                } else {
                    overlayContent.innerHTML = `<h1>Nenhum resultado encontrado</h1>`
                }
            }
        })


}


function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}




/* API funciona?
   const options = {
       method: 'GET',
       headers: {  
           accept: 'application/json',
           Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjQ2OTYyYjM2M2NmZTI2ODcyZWEwYzMyODI4MjA3ZSIsInN1YiI6IjY1NjY2YmM1M2Q3NDU0MDEwYmUxMDc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZLkTBWSOmHrYZbXw1nNmbhGOECstkGTfqtZj8VXuLqk'
       }
   };

   fetch('https://api.themoviedb.org/3/authentication', options)
       .then(response => response.json())
       .then(response => console.log(response))
       .catch(err => console.error(err)); */

