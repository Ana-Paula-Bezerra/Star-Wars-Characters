let currentPageUrl = 'https://swapi.dev/api/people/';

window.onload = async () => {

    try{
        await loadCharacters(currentPageUrl);

    } catch(error){
        console.log(error);
        alert('Erro ao carregar cards');
    }

    //aqui vamos armazenar o botão de próxima página e anterior, pegando o id deles no html e colocando numa variável
    //em seguida vamos monitorar os eventos desses botões informando qual evento será monitorado e qual a ação que irá acontecer

    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');

    nextButton.addEventListener('click', loadNextPage);
    backButton.addEventListener('click', loadPreviousPage);
};

async function loadCharacters(url){

    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; //limpa o html para receber novos cards

    try{
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => { //o forEach vai iterar com cada elemento, no caso, com cada character
            
            // criamos uma div para cada elemento conforme fizemos no html e adicionar as classes
            // vamos usar template string para deixar os personagens dinâmicos junto da Expressão Regular (RegExp): /\D/g, "" que pega um padrão na url
            // as classNames "cards" "character-name-bg" e "character-name" vem das classes criadas no html as quais estamos interagindo 

            const card = document.createElement("div") 
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')` 
            card.className = "cards" 

            const characterNameBG = document.createElement("div")
            characterNameBG.className = "character-name-bg"

            const characterName = document.createElement("span")
            characterName.className = "character-name"
            characterName.innerText = `${character.name}` //o innerText irá alterar o texto dinamicamente
             
            // aqui vamos organizar as divs em seus lugares, colocando uma dentro da outra

            characterNameBG.appendChild(characterName);
            card.appendChild(characterNameBG);

            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible"

                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = ""

                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')` 
                characterImage.className = "character-image"

                const name = createElement("span")
                name.className = "character-details"
                name.innerText =  `Nome: ${character.name}`

                const characterHeight = createElement("span")
                characterHeight.className = "character-details"
                characterHeight.innerText =  `Altura: ${convertHeight(character.height)}`

                const mass = createElement("span")
                mass.className = "character-details"
                mass.innerText =  `Peso: ${convertMass(character.mass)}`

                const eyeColor = createElement("span")
                eyeColor.className = "character-details"
                eyeColor.innerText =  `Cor dos olhos: ${convertEyeColor(character.eye_color)}`

                const birthYear = createElement("span")
                birthYear.className = "character-details"
                birthYear.innerText =  `Nascimento: ${birthYear(character.birth_year)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }

            const mainContent = document.getElementById('main-content');
            mainContent.appendChild(card);
        });

        // aqui vamos escrever novamente as variáveis pois as que já foram declaradas acima estão dentro de outro escopo

        const nextButton = document.getElementById('next-button')
        const backButton = document.getElementById('back-button')

        // vamos  monitorar o disabled dizendo quando ele vai ser true ou qdo vai ser false
        // a variável nextButton estará desabilitada qdo a variável responseJson for diferente de responseJson.next

        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;

        // no css o backButton está escondido (hidden) pois no primeiro acesso não tem página anterior
        // vamos fazer um operador ternário na resposta que vem na api, se existir uma previous deverá ficar visible

        backButton.style.visibility = responseJson.previous ? "visible" : "hidden";

        currentPageUrl = url;

    } catch(error){
        throw new Error('Erro ao carregar personagens');
    }    
}

// criando o modal

function hideModal(){
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

// convertendo o texto para português 

function convertEyeColor(eyeColor) {
    const cores = {
    blue:"azul",
    brown:"castanho",
    green:"verde",
    yellow:"amarelo",
    black:"preto",
    pink:"rosa",
    red:"vermelho",
    orange:"laranja",
    hazel:"avela",
    unknown:"desconhecida"
    };
    
    return cores[eyeColor.toLowerCase()] || eyeColor;
}

// formatando os valores recebidos da altura

function convertHeight(height) {
    if (height === "unknown") {
        return "desconhecida";
    }
    
    return (height / 100).toFixed(2);
}

// formatando os valores recebidos do peso

function convertMass(mass) {
    if (mass === "unknown") {
        return "desconhecido";
    }
    
    return `${mass} kg`;
}

function convertBirthYear(birthYear) {
    if (birthYear === "unknown") {
        return "desconhecido";
    }
    
    return birthYear;
}

// aqui vamos usar o if apenas para evitar um erro
// em seguida vamos criar as funções loadNextPage e a loadPeviousPage

async function loadNextPage(){
    if (!currentPageUrl) return;

    // vamos armazenar a resposta da api numa variável e convertê-la em json 
    try{
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.next);

    }catch(error){
        console.log(error)
        alert('Erro ao carregar a próxima página');
    }
}       

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try{
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();
        await loadCharacters(responseJson.previous);

    }catch(error){
        console.log(error)
        alert('Erro ao carregar a página anterior');
    }
} 










