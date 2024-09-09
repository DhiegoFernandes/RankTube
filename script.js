const api_key = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjQ2OTYyYjM2M2NmZTI2ODcyZWEwYzMyODI4MjA3ZSIsIm5iZiI6MTcyNTkwNDY0OC43NzU2NzgsInN1YiI6IjY1NjY2YmM1M2Q3NDU0MDEwYmUxMDc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.a8k8vSO6wv0miimt5YjU_vmn-WFMPP39fxyO8DuJ1F8';

const BASE_URL = 'https://api.themoviedb.org/3/';

const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + api_key;

const imagemPoster_URL = "https://image.tmdb.org/t/p/w500";

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const searchURL = BASE_URL + '/search/movie?' + api_key;


getMovies(API_URL);


function getMovies(url) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data.results);
        showMovies(data.results);
    })
    .catch(error => console.error('Erro na requisição:', error));
}


function showMovies(data) {
    main.innerHTML = '';

    if (!data) {
        main.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }

    data.forEach(movie => {
        const { title, poster_path, vote_average, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('filme');
        movieEl.innerHTML = `
             <img class="foto_filme" src="${imagemPoster_URL + poster_path}" alt="${title}">

                <div class="info-filme">
                    <h3 class="titulo-filme">${title}</h3>
                    <span class="${getColor(vote_average)} nota-filme"> ${vote_average}</span>
                   
                    <button class="saiba-mais" id="${id}">Saiba Mais</button>
      
                </div>
           
              
             `

        main.appendChild(movieEl); /* Coloca elemento filme no main  */

        /*   funcao click botao saiba mais*/
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
    let overview = movie.overview;
    let title = movie.title;
    let vote_average = movie.vote_average;
    let release_date = movie.release_date;
    let backdrop_path = movie.backdrop_path;


    fetch(`${BASE_URL}movie/${id}/videos`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api_key}`
        }
    })
    .then(res => res.json())
    .then(videoData => {
            console.log(BASE_URL + '/movie/' + id + '/videos?' + api_key)
            console.log(videoData);

            if (videoData) {
                document.getElementById("myNav").style.width = "100%";
                if (videoData.results.length > 0) {
                    var embed = [];


                    /* videoData.results.forEach(video => { */
                    for (const video of videoData.results) {
                        let { name, key, site } = video;

                        if (site == 'YouTube') {
                            embed.push(`
                            <h2 class="over-titulo-filme ${getColor(vote_average)}">${title}</h2>  
                            <h2 class="over-dt-lancamento">Data de Lançamento: ${release_date}</h2>  
                            <img class="foto_filme" src="${imagemPoster_URL + backdrop_path}" alt="${title}">           
                            <h2 class="${getColor(vote_average)}"> ${vote_average}</h2>  
                            <h2 class="over-descricao " >${overview}</h2>    
                           
                            <iframe 
                                width="560" height="315" src="https://www.youtube.com/embed/${key}" 
                                title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                                gyroscope; picture-in-picture; web-share" allowfullscreen>
                            </iframe>
                        `);

                            // Quebra após a primeira iteração
                            break;
                        }
                    }


                    overlayContent.innerHTML = embed.join('');
                } else {
                    overlayContent.innerHTML = `<h1>Nenhum resultado encontrado</h1>`
                }
            }
        })


}


function closeNav() {
    document.getElementById("myNav").style.width = "0%";

    // limpa o overlay (Para o áudio do video)
    document.getElementById('overlay-content').innerHTML = '';
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
       .catch(err => console.error(err)); 
       
       
       
    <!--     CHAVE
    4f46962b363cfe26872ea0c32828207e

    TOKEN
    eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjQ2OTYyYjM2M2NmZTI2ODcyZWEwYzMyODI4MjA3ZSIsInN1YiI6IjY1NjY2YmM1M2Q3NDU0MDEwYmUxMDc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZLkTBWSOmHrYZbXw1nNmbhGOECstkGTfqtZj8VXuLqk
*/

