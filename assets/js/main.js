const Card = personaje => {
    const {id, name, status, image, species} = personaje;

    return `<div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                <a class= "handleOpenModal" data-id = ${id}><div class="card">
                    <div class="card-image">
                        <figure class="image is-4by3">
                            <img src="${image}" alt="Placeholder image">
                        </figure>
                    </div>

                <div class="card-content">
                    <div class="media">

                    <div class="media-content">
                        <p class="title is-4 is-family-sans-serif">${name}</p>
                        <p class="subtitle is-6">${species}</p>
                    </div>
                </div>
  
                        <div class="content has-text-weight-semibold is-italic">
                            <p>${status}</p>
                        </div>
                    </div>
                </div></a>
            </div>`

}

const Modal = personaje => {
    console.log(personaje)
    const { id, name, status, species, image, episodesData } = personaje
    //recorro todos los episodios y los voy acumulando en episodesLi
    let episodesLi = ''
    episodesData.forEach(({ name })=>{
        episodesLi += `<li>${name}</li>`
    })


    return `<div class="box">
                <article class="media">
                    <div class="media-left">
                        <figure class="image is-64x64">
                            <img src="${image}" alt="Image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <div class="content">
                            <p>
                            <strong>${name}</strong>
                            <br>
                            Status: ${status}.
                            <br>
                            Especie: ${species}.
                            </p>
                            <h3>Episodes</h3>
                            <ul>${episodesLi}</ul>
                        </div>
                        <nav class="level is-mobile">
                            <div class="level-left">
                                <a class="level-item" aria-label="retweet">
                                    <span class="icon is-small">
                                        <i class="fas fa-retweet" aria-hidden="true"></i>
                                    </span>
                                </a>
                                <a class="level-item" aria-label="like">
                                    <span class="icon is-small">
                                        <i class="fas fa-heart" aria-hidden="true"></i>
                                    </span>
                                </a>
                            </div>
                        </nav>
                    </div>
                </article>
            </div>`
}


//-------------------- CODE --------------------

$('.rick').click(function(img){
    $('.rick').attr('src', 'assets/images/rickfu.gif');
    setTimeout(function(){
        $('.rick').attr('src', 'assets/images/gifrick.gif');
    }, 1300);
});

$(window).scroll(function() {
    if ($(this).scrollTop()>700){
        $('.rick').fadeOut();
     }
    else{
      $('.rick').fadeIn();
     }
 });


const appendElements = (characters, borrarGrilla = false) => {
    const $grid = document.querySelector('.grid');
    if (borrarGrilla) {
        $grid.innerHTML = null;
    }
    characters.forEach(character => {
        const cardItem = Card(character);
        $grid.innerHTML += cardItem;
    });
    const $modalOpenArr = document.querySelectorAll('.handleOpenModal');
    const $modal = document.querySelector('.modal');
    const $modalContent = document.querySelector('.modal-content');
    const $modalClose = document.querySelector('.modal-close');
    $modalClose.addEventListener('click', () => {
        $modal.classList.remove('is-active');
    })
    $modalOpenArr.forEach(($card) => {
        $card.addEventListener('click', () => {
            const id = $card.dataset.id;
            const character = characters[id - 1]; //Nos da la posicion del personaje en el array de characters
            const { episode } = character
            const getEpisodesData = async () => {
                return Promise.all(episode.map(item => getEpisode(item))) //Resuelvo cada una de las promesas (fetchs de episodes)
            }
            getEpisodesData().then(episodesData => {
                const characterWithEpisodes = { ...character, episodesData } //Junto los datos que tenia del character + sus episodes
                $modalContent.innerHTML = Modal(characterWithEpisodes) //Le mando todo junto a modal
                $modal.classList.add('is-active'); //Activo el modal
            })
        })
    })
}


const getCharacters = async (baseURL, from, to) => {
    const charactersRange = Array.from({ length: to - from + 1 }, (_, index) => index + 1).join(',');
    const url = `${baseURL}character/${charactersRange}`;
    const response = await fetch(url);
    const characters = await response.json();
    return characters;
}
const getEpisode = async (baseURL) => {
    const url = `${baseURL}`;
    const response = await fetch(url);
    const episode = await response.json();
    return episode;
}
const getCharactersByQuery = async (baseURL, valorABuscar) => {
    const url = `${baseURL}character/?name=${valorABuscar}`;
    const response = await fetch(url);
    const characters = await response.json();
    return characters;
}

const main = async () => {
    const baseURL = 'https://rickandmortyapi.com/api/';
    const characters = await getCharacters(baseURL, 1, 20);
    appendElements(characters)
    const $submit = document.querySelector('.handle_search');
    $submit.addEventListener('click', async (event) => {
        event.preventDefault();
        const $input = document.querySelector('.input_search')
        const value = $input.value;
        const charactersByQuery = await getCharactersByQuery(baseURL, value)
        const characters = charactersByQuery.results;
        appendElements(characters, true);
    })
}
main();