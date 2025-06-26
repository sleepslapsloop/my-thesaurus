let word = document.getElementById("word");
let button = document.getElementById("submit");
let synonym = document.getElementById("synonym");
let antonym = document.getElementById("antonym");
const apiLink = "https://api.dictionaryapi.dev/api/v2/entries/en/";

button.onclick = () => {
  let wordSearch = word.value;

  if (wordSearch.trim() === "") {
    alert("Please enter a word to search");
    return;
  }

  fetch(`${apiLink}${wordSearch.toLowerCase()}`)
    .then((response) => response.json())
    .then((data) => {
      let synonymAndAntonym = extractSynonymsAntonyms(data);

      // Display synonyms
      if (synonymAndAntonym.synonyms.length > 0) {
        synonym.style.display = "block";
        synonym.innerHTML = synonymAndAntonym.synonyms.join("<br class='br'>");
      } else {
        synonym.style.display = "block";
        synonym.textContent = "No synonyms found";
      }

      // Display antonyms
      if (synonymAndAntonym.antonyms.length > 0) {
        antonym.style.display = "block";
        antonym.innerHTML = synonymAndAntonym.antonyms.join("<br>");
      } else {
        antonym.style.display = "block";
        antonym.textContent = "No antonyms found";
      }
    })
    .catch((err) => {
      console.error(err);
      synonym.textContent = "Error fetching data";
      antonym.textContent = "Error fetching data";
    });
};

function extractSynonymsAntonyms(data) {
  const synonyms = new Set();
  const antonyms = new Set();

  data.forEach((entry) => {
    entry.meanings.forEach((meaning) => {
      // From meaning level
      if (meaning.synonyms) {
        meaning.synonyms.forEach((syn) => synonyms.add(syn));
      }
      if (meaning.antonyms) {
        meaning.antonyms.forEach((ant) => antonyms.add(ant));
      }

      // From definitions inside each meaning
      meaning.definitions.forEach((def) => {
        if (def.synonyms) {
          def.synonyms.forEach((syn) => synonyms.add(syn));
        }
        if (def.antonyms) {
          def.antonyms.forEach((ant) => antonyms.add(ant));
        }
      });
    });
  });

  return {
    synonyms: Array.from(synonyms),
    antonyms: Array.from(antonyms),
  };
}
