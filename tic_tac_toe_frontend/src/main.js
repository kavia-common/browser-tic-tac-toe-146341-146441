//
// Ocean Professional Tic Tac Toe - Vite vanilla JS
// Minimal dependencies, clean structure, accessible DOM updates, and smooth transitions.
//

import './style.css'

// Game state
const initialState = () => ({
  board: Array(9).fill(null),
  xIsNext: true,
  winner: null,
  isDraw: false,
})

let state = initialState()

// PUBLIC_INTERFACE
export function getCurrentPlayerSymbol() {
  /** Returns 'X' or 'O' depending on the current turn. */
  return state.xIsNext ? 'X' : 'O'
}

// PUBLIC_INTERFACE
export function resetGame() {
  /** Resets the game to initial state and re-renders the UI. */
  state = initialState()
  updateStatus()
  renderBoard()
  updateTurnIndicators()
}

// Game logic helpers
function calculateWinner(board) {
  // Classic win lines for 3x3 board
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }
    }
  }
  return { winner: null, line: [] }
}

function isBoardFull(board) {
  return board.every(cell => cell !== null)
}

// DOM references
let elBoard
let elStatus
let elReset
let elP1
let elP2

function createAppShell() {
  const app = document.getElementById('app')
  app.innerHTML = `
    <div class="app-container">
      <div class="header">
        <h1 class="title">Tic Tac Toe</h1>
        <p class="subtitle">Ocean Professional</p>
      </div>

      <div class="players" role="group" aria-label="Players">
        <div id="p1" class="player-card" aria-live="polite" aria-label="Player X">
          <div class="badge">P1</div>
          <div class="symbol x">X</div>
          <div class="name">Player X</div>
          <div class="turn-indicator" aria-hidden="true"></div>
        </div>
        <div id="p2" class="player-card" aria-live="polite" aria-label="Player O">
          <div class="badge">P2</div>
          <div class="symbol o">O</div>
          <div class="name">Player O</div>
          <div class="turn-indicator" aria-hidden="true"></div>
        </div>
      </div>

      <div class="board-wrapper">
        <div id="board" class="board" role="grid" aria-label="Tic Tac Toe Board" aria-live="polite"></div>
      </div>

      <div id="status" class="status" role="status" aria-live="polite"></div>

      <div class="actions">
        <button id="reset" class="btn-reset" type="button" aria-label="Reset game">Reset</button>
      </div>
    </div>
  `

  elBoard = document.getElementById('board')
  elStatus = document.getElementById('status')
  elReset = document.getElementById('reset')
  elP1 = document.getElementById('p1')
  elP2 = document.getElementById('p2')

  elReset.addEventListener('click', resetGame)
}

function handleCellClick(index) {
  if (state.winner || state.isDraw || state.board[index]) return
  const board = [...state.board]
  board[index] = getCurrentPlayerSymbol()
  const { winner } = calculateWinner(board)
  const isDraw = !winner && isBoardFull(board)

  state = {
    board,
    xIsNext: !state.xIsNext,
    winner,
    isDraw,
  }

  renderBoard()
  updateStatus()
  updateTurnIndicators()
}

function renderBoard() {
  // Re-render entire board for simplicity and maintainability
  elBoard.innerHTML = ''
  state.board.forEach((value, idx) => {
    const cell = document.createElement('button')
    cell.className = 'cell'
    cell.setAttribute('role', 'gridcell')
    cell.setAttribute('aria-label', `Cell ${idx + 1}${value ? `, ${value}` : ''}`)
    cell.disabled = Boolean(state.winner || state.isDraw || value)

    if (value === 'X') {
      cell.classList.add('x')
      cell.textContent = 'X'
    } else if (value === 'O') {
      cell.classList.add('o')
      cell.textContent = 'O'
    } else {
      cell.textContent = ''
    }

    cell.addEventListener('click', () => handleCellClick(idx))
    elBoard.appendChild(cell)
  })

  // Highlight winning line if exists
  const { line } = calculateWinner(state.board)
  if (line.length) {
    // Add a highlight class to winning cells
    line.forEach(i => {
      const c = elBoard.children[i]
      c.classList.add('win')
    })
  }
}

function updateStatus() {
  if (state.winner) {
    const colorClass = state.winner === 'X' ? 'x' : 'o'
    elStatus.innerHTML = `<span class="status-label ${colorClass}">Winner</span> Player ${state.winner}`
    return
  }
  if (state.isDraw) {
    elStatus.innerHTML = `<span class="status-label draw">Draw</span> No moves left`
    return
  }
  const next = getCurrentPlayerSymbol()
  const colorClass = next === 'X' ? 'x' : 'o'
  elStatus.innerHTML = `<span class="status-label ${colorClass}">Turn</span> Player ${next}`
}

function updateTurnIndicators() {
  const xTurn = state.winner ? false : state.xIsNext
  const oTurn = state.winner ? false : !state.xIsNext

  elP1.classList.toggle('active', xTurn)
  elP2.classList.toggle('active', oTurn)

  elP1.setAttribute('aria-label', `Player X${xTurn ? ', your turn' : ''}${state.winner === 'X' ? ', winner' : ''}`)
  elP2.setAttribute('aria-label', `Player O${oTurn ? ', your turn' : ''}${state.winner === 'O' ? ', winner' : ''}`)
}

// Initialize
createAppShell()
renderBoard()
updateStatus()
updateTurnIndicators()
