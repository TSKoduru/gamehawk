export function findWords(board, trie) {
  const numRows = 4;
  const numCols = 4;
  const results = new Set();
  const paths = {};

  function getNeighbors(row, col) {
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < numRows &&
          newCol >= 0 &&
          newCol < numCols
        ) {
          neighbors.push([newRow, newCol]);
        }
      }
    }
    return neighbors;
  }

  function dfs(row, col, node, visited, currentWord, currentPath) {
    const index = row * numCols + col;
    const letter = board[index];
    const nextNode = node.children[letter];

    if (!nextNode) return;

    visited.add(index);
    currentWord += letter;
    currentPath.push(index);

    if (nextNode.isEndOfWord && currentWord.length >= 3) {
      results.add(currentWord);
      paths[currentWord] = [...currentPath]; // Save a copy
    }

    for (const [nRow, nCol] of getNeighbors(row, col)) {
      const nIdx = nRow * numCols + nCol;
      if (!visited.has(nIdx)) {
        dfs(nRow, nCol, nextNode, visited, currentWord, currentPath);
      }
    }

    visited.delete(index);
    currentPath.pop();
  }

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      dfs(row, col, trie, new Set(), "", []);
    }
  }

  return Array.from(results)
    .map((word) => ({
      word,
      path: paths[word],
    }))
    .sort((a, b) => b.word.length - a.word.length); // longest words first
}
