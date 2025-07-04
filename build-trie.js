/* eslint-env node */
/* global require, module, __dirname */

const fs = require('fs');
const path = require('path');

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

function insertWord(root, word) {
  let node = root;
  for (const char of word) {
    if (!node.children[char]) {
      node.children[char] = new TrieNode();
    }
    node = node.children[char];
  }
  node.isEndOfWord = true;
}

function buildTrieFromDictionary(dictionaryPath) {
  const root = new TrieNode();
  const words = fs
    .readFileSync(dictionaryPath, 'utf-8')
    .split('\n')
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 1);

  for (const word of words) {
    insertWord(root, word);
  }

  return root;
}

function buildAndSaveTrieAsJS(dictionaryPath, outputPath) {
  const trie = buildTrieFromDictionary(dictionaryPath);
  const js = `export const TRIE = ${JSON.stringify(trie)};\n`;
  fs.writeFileSync(outputPath, js);
  console.log(`Compressed trie saved to ${outputPath}`);
}

if (require.main === module) {
  const dictPath = path.resolve(__dirname, 'resources', 'dictionary.txt');
  const outPath = path.resolve(__dirname, 'resources', 'trie.js');
  buildAndSaveTrieAsJS(dictPath, outPath);
}
