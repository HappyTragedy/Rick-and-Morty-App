const Card = personaje => {
    const {name, status, image, species} = personaje;

    return `<div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                <div class="card">
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
                </div>
            </div>`

}

const appendElements = (characters) => {

    const $grid = document.querySelector('.grid');
    characters.forEach(character => {
        const cardItem = Card(character);
        $grid.innerHTML += cardItem; 
    });
}


const getCharacters = async (baseUrl, from, to) => {

    const charactersRange = Array.from({ length: to - from + 1 }, (_, index) => index + 1).join(',');//Va a hacer un for con el array de la API.
    const url = `${baseUrl}/character/${charactersRange}`;
    const response = await fetch(url);
    const characters = await response.json();

    return characters;

}


const main = async () => {

    const baseUrl= 'https://rickandmortyapi.com/api';
    const characters = await getCharacters(baseUrl, 1, 20);
    appendElements(characters);

}

main()