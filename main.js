import { findWords } from "./solver.js";

let trie = null;

async function loadTrie() {
  const res = await fetch("resources/trie.json");
  trie = await res.json();
}

function setupBoard() {
  const boardEl = document.getElementById("board");
  for (let i = 0; i < 16; i++) {
    const input = document.createElement("input");
    input.maxLength = 1;
    boardEl.appendChild(input);
  }
}

function getBoardLetters() {
  const inputs = document.querySelectorAll("#board input");
  return Array.from(inputs).map((el) => el.value.toLowerCase() || " ");
}

function showResults(words) {
  const list = document.getElementById("wordList");
  list.innerHTML = "";
  words.forEach(({ word, path }) => {
    const li = document.createElement("li");
    li.textContent = word;
    // Later: add hover -> highlight path logic
    list.appendChild(li);
  });
}

document.getElementById("solveBtn").addEventListener("click", () => {
  const board = getBoardLetters();
  const words = findWords(board, trie); // Your solver function
  showResults(words);
});

loadTrie();
setupBoard();
