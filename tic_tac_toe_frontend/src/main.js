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

// Inline SVG icons for Knight (X) and Queen (O)
function knightSVG() {
  // Blue knight using currentColor to inherit from CSS
  return `
    <svg class="icon icon-knight" viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill="currentColor" d="M7 19h10v2H7v-2Zm10-8.5c0 .9-.25 1.73-.75 2.5s-1.22 1.36-2.17 1.85c-.53.28-.88.55-1.05.83c-.17.27-.25.63-.25 1.07h-3c0-.76.16-1.39.48-1.89c.32-.5.86-.96 1.62-1.39c.64-.35 1.11-.73 1.4-1.12c.29-.4.43-.86.43-1.4c0-.8-.28-1.47-.85-2s-1.27-.8-2.1-.8c-.75 0-1.42.2-2 .6c-.58.4-1.02.96-1.33 1.68l-2.78-1.2c.46-1.1 1.19-2 2.18-2.7C7.37 6.23 8.6 5.9 10.06 5.9c1.58 0 2.93.46 4.06 1.38c1.13.92 1.88 2.19 2.25 3.82c.2.86.63 1.3 1.29 1.3c.26 0 .47-.07.63-.22c.16-.14.29-.36.38-.66l2.81.92c-.22.86-.61 1.54-1.18 2.04c-.57.49-1.27.74-2.1.74c-.7 0-1.3-.22-1.81-.67c-.5-.45-.85-1.06-1.04-1.84Z"/>
    </svg>
  `
}

function queenSVG() {
  // Amber queen using currentColor to inherit from CSS
  return `
    <svg class="icon icon-queen" viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path fill="currentColor" d="M7 21h10v2H7v-2Zm10-5.5l-1-5l2-2l-2-2l-2 2l-1-2l-1 2l-2-2l-2 2l2 2l-1 5h8Z"/>
      <path fill="currentColor" d="M6 17c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v1H6v-1Z"/>
    </svg>
  `
}

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
          <div class="symbol x" aria-hidden="true">${knightSVG()}</div>
          <div class="name">Player X</div>
          <div class="turn-indicator" aria-hidden="true"></div>
        </div>
        <div id="p2" class="player-card" aria-live="polite" aria-label="Player O">
          <div class="badge">P2</div>
          <div class="symbol o" aria-hidden="true">${queenSVG()}</div>
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
    cell.setAttribute('aria-label', `Cell ${idx + 1}${value ? `, ${value === 'X' ? 'Knight' : 'Queen'}` : ''}`)
    cell.disabled = Boolean(state.winner || state.isDraw || value)

    if (value === 'X') {
      cell.classList.add('x')
      cell.innerHTML = knightSVG()
    } else if (value === 'O') {
      cell.classList.add('o')
      cell.innerHTML = queenSVG()
    } else {
      cell.innerHTML = ''
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
    const piece = state.winner === 'X' ? 'Knight' : 'Queen'
    elStatus.innerHTML = `<span class="status-label ${colorClass}">Winner</span> Player ${piece}`
    return
  }
  if (state.isDraw) {
    elStatus.innerHTML = `<span class="status-label draw">Draw</span> No moves left`
    return
  }
  const next = getCurrentPlayerSymbol()
  const colorClass = next === 'X' ? 'x' : 'o'
  const piece = next === 'X' ? 'Knight' : 'Queen'
  elStatus.innerHTML = `<span class="status-label ${colorClass}">Turn</span> Player ${piece}`
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
