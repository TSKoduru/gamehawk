import { findWords } from './solver.js';

let trie = null;

async function loadTrie() {
  const res = await fetch('./trie.json');
  trie = await res.json();
}

function setupBoard() {
  const boardEl = document.getElementById('board');
  for (let i = 0; i < 16; i++) {
    const input = document.createElement('input');
    input.maxLength = 1;
    input.setAttribute('data-index', i);

    input.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase();
      e.target.value = val;

      if (val && i < 15) {
        const next = boardEl.querySelector(`input[data-index='${i + 1}']`);
        next?.focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && i > 0) {
        const prev = boardEl.querySelector(`input[data-index='${i - 1}']`);
        prev?.focus();
      }
    });

    boardEl.appendChild(input);
  }
}

function getBoardLetters() {
  const inputs = document.querySelectorAll('#board input');
  return Array.from(inputs).map((el) => el.value.toLowerCase() || ' ');
}

function showResults(words) {
  const list = document.getElementById('wordList');
  list.innerHTML = '';

  const inputs = document.querySelectorAll('#board input');

  for (const { word, path } of words) {
    const li = document.createElement('li');
    li.textContent = word;

    li.addEventListener('mouseenter', () => {
      path.forEach((idx, step) => {
        const input = inputs[idx];
        const stepClass = step <= 6 ? `highlight-step-${step}` : 'highlight-step-n';
        input.classList.add(stepClass);
      });
    });

    li.addEventListener('mouseleave', () => {
      path.forEach((idx, step) => {
        const input = inputs[idx];
        const stepClass = step <= 6 ? `highlight-step-${step}` : 'highlight-step-n';
        input.classList.remove(stepClass);
      });
    });

    list.appendChild(li);
  }
}

document.getElementById('clearBtn').addEventListener('click', () => {
  const inputs = document.querySelectorAll('#board input');
  inputs.forEach((input) => {
    input.value = '';
    input.classList.remove('highlight');
  });
  document.getElementById('wordList').innerHTML = '';
});

document.getElementById('solveBtn').addEventListener('click', () => {
  const board = getBoardLetters();
  const words = findWords(board, trie);
  showResults(words);
});

loadTrie();
setupBoard();
