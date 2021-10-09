const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  infoText = wrapper.querySelector(".info-text"),
  synonyms = wrapper.querySelector(".synonyms .list"),
  volumeIcon = wrapper.querySelector(".volume-icon"),
  closeIcon = wrapper.querySelector(".close-icon");

let audio;

function data(result, word) {
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>`;
  } else {
    console.log(result);
    wrapper.classList.add("active");

    let definitions = result[0].meanings[0].definitions[0];
    let synonymsList = definitions.synonyms.splice(0, 5);
    let phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

    //pass data to html element
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".details span").innerText = phonetics;
    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText = definitions.example;
    audio = new Audio("https:" + result[0].phonetics[0].audio);

    //If there is no synonym
    if (synonymsList.length === 0) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      synonymsList.forEach((e) => {
        let tag = `<span onclick=search('${e}')>${e}</span>`;
        synonyms.insertAdjacentHTML("beforeend", tag);
      });
    }

    synonymsList = [];
  }
}

//Search synonym word
function search(word) {
  searchInput.value = word;
  fetchApi(word);
}

// fetch api function
function fetchApi(word) {
  wrapper.classList.remove('active');
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((res) => res.json())
    .then((result) => data(result, word));
}

//Events
closeIcon.addEventListener("click", (e) => {
  searchInput.value="";
  searchInput.focus();
  wrapper.classList.remove('active');
  infoText.innerHTML = 'Type a word and press enter.';
});

volumeIcon.addEventListener("click", (e) => {
  audio.play();
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    fetchApi(e.target.value);
  }
});
