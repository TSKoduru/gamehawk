/* eslint-env node */
/* global require, module, __dirname */

const fs = require('fs');
const path = require('path');

// Node for the trie we need to build
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
    .filter((w) => w.length > 1); // Filter out single-letter words

  for (const word of words) {
    insertWord(root, word);
  }

  return root;
}

function buildAndSaveTrie(dictionaryPath, outputPath) {
  const trie = buildTrieFromDictionary(dictionaryPath);
  fs.writeFileSync(outputPath, JSON.stringify(trie, null, 2));
  console.log(`Trie saved to ${outputPath}`);
}

// Build tree if someone calls this thing siwth node
if (require.main === module) {
  const dictPath = path.resolve(__dirname, 'resources', 'dictionary.txt');
  const outPath = path.resolve(__dirname, 'resources', 'trie.json');
  buildAndSaveTrie(dictPath, outPath);
}

module.exports = { buildAndSaveTrie };
