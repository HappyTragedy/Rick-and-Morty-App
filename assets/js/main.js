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
    const {id, name, status, image, species, episode} = personaje;

    const episodeGrid = episode.map(async (episodeItem) => {
        const episodeData = await getEpisode(episodeItem);
        console.log(episodeData);
        const {name, air_date} = episodeData;
        console.log(name);
        return `<li>${name}</li>`;

    })
console.log('Grid', episodeGrid)

    //episode.forEach(async (episodeItem) => {
      //  const episodeData = await getEpisode(episodeItem);
        //console.log(episodeData);

        //Armar grilla de contenido de episodios.

    //})


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
                            <ul>${episodeGrid}</ul>
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


const appendElements = (characters, clearGrid = false) => {

    const $grid = document.querySelector('.grid');
    if (clearGrid){
        $grid.innerHTML = '';
    }

    characters.forEach(character => {
        const cardItem = Card(character);
        $grid.innerHTML += cardItem; 
    });

    const $modalOpenArr = document.querySelectorAll('.handleOpenModal');
    const $modal = document.querySelector('.modal');
    const $modalContent = document.querySelector('.modal-content');
    const $modalClose = document.querySelector('.modal-close');

    $modalClose.addEventListener('click', () =>{
        $modal.classList.remove('is-active');
    })

    $modalOpenArr.forEach(($card) => {
        $card.addEventListener('click', async () => {
            const id = $card.dataset.id;
            const character = characters[id - 1];
            $modalContent.innerHTML = Modal(character);
            $modal.classList.add('is-active');
        });
    })
}


const getCharacters = async (baseUrl, from, to) => {

    const charactersRange = Array.from({ length: to - from + 1 }, (_, index) => index + 1).join(',');//Va a hacer un for con el array de la API.
    const url = `${baseUrl}/character/${charactersRange}`;
    const response = await fetch(url);
    const characters = await response.json();

    return characters;

}

const getCharacter = async (baseUrl, id) => {

    const url = `${baseUrl}/character/${id}`;
    const response = await fetch(url);
    const character = await response.json();

    return character;

}

const getEpisode = async (baseUrl) => {

    const url = `${baseUrl}`;
    const response = await fetch(url);
    const episode = await response.json();

    return episode;

}

const getCharactersByQuery = async (baseUrl, searchValue) => {
    const url = `${baseUrl}/character/?name=${searchValue}`;
    const response = await fetch(url);
    const characters = await response.json();

    return characters;

}

const main = async () => {

    const baseUrl= 'https://rickandmortyapi.com/api';
    const characters = await getCharacters(baseUrl, 1, 20);
    appendElements(characters);

    const $submit = document.querySelector('.handle_search');
    $submit.addEventListener('click', async (event) => {
        console.log('FUNCA');
        event.preventDefault();//Hace que no me recargue la pagina cuando hago click.
        const $input = document.querySelector('.input_search');
        const value = $input.value;//Esta constante es lo que voy a pasar de segundo parametro abajo, es lo que va a tener los nombres.

        const charactersByQuery = await getCharactersByQuery(baseUrl, value);
        const characters = charactersByQuery.results;

        appendElements(characters, true);
        console.log(charactersByQuery.results);

    })

}

main();