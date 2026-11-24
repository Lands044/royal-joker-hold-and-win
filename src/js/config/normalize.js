import { setGameNormalizer, mergeConfig, toNumber, clampInt } from '@js/config/config.js'
import { DEFAULT_CONFIG, DEAD_CORE_KEYS } from './game.defaults.js'

// Slot geometry the scripted spins have to fit. Tied to the markup/SCSS
// (5 reels on desktop, 3 on touch devices, 3 rows) and to the icon files in
// src/assets/img/icon — not configurable.
const ROWS = 3
const ICON_COUNT = 8
const COLS = { desktop: 5, mobile: 3 }
// Enum-like strings (spin `type`, `winAnimation`) are kept as typed rather
// than snapped to a default: the devmenu mirrors the normalized value back into
// the input on every keystroke, so snapping would fight the user mid-word. The
// game already treats anything unknown as the safe branch (type -> 'lose',
// winAnimation -> 'line').
const asString = (value, fallback) => (typeof value === 'string' ? value : fallback)

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const toIcon = (value) => clampInt(value, 1, 1, ICON_COUNT)

// A reel column: pad to ROWS icons, never trim (non-destructive — see
// docs/config.md). Extra entries are harmless: the reel stops on the first ROWS.
function normalizeColumn(column, fallback) {
	const source = Array.isArray(column) ? column : (fallback || [])
	const out = source.map(toIcon)
	while (out.length < ROWS) out.push(fallback?.[out.length] ?? 1)
	return out
}

function normalizeSpin(spin, fallback, cols) {
	const source = isObject(spin) ? spin : {}
	const base = fallback || { type: 'lose', winAmount: 0, winLine: [], result: [] }

	const type = asString(source.type, base.type)
	const winAmount = Math.max(0, toNumber(source.winAmount, base.winAmount))

	const winLine = (Array.isArray(source.winLine) ? source.winLine : base.winLine)
		.map(row => (row === null || row === '' ? null : clampInt(row, 0, 0, ROWS - 1)))

	// Every reel needs a target column, or the spin animation has nothing to
	// stop on — pad missing reels from the default spin at the same index.
	const result = (Array.isArray(source.result) ? source.result : base.result)
		.map((column, i) => normalizeColumn(column, base.result[i]))
	while (result.length < cols) result.push(normalizeColumn(base.result[result.length], null))

	return { ...source, type, winAmount, winLine, result }
}

function normalizeSpins(list, defaults, cols) {
	const source = Array.isArray(list) ? list : defaults
	return source.map((spin, i) => normalizeSpin(spin, defaults[i] || defaults[defaults.length - 1], cols))
}

function normalizeGameConfig(input) {
	// The core normalizer only knows the core defaults — layer this game's
	// defaults underneath so a partial config.json still gets a full `game`.
	const config = mergeConfig(DEFAULT_CONFIG, input)
	for (const [section, keys] of Object.entries(DEAD_CORE_KEYS)) {
		keys.forEach(key => delete config[section][key])
	}

	const game = config.game
	const defaults = DEFAULT_CONFIG.game

	game.balance = Math.max(0, toNumber(game.balance, defaults.balance))

	const bets = (Array.isArray(game.bets) ? game.bets : [])
		.map(value => toNumber(value, NaN))
		.filter(value => Number.isFinite(value) && value > 0)
	game.bets = bets.length ? bets : [...defaults.bets]
	game.betIndex = clampInt(game.betIndex, defaults.betIndex, 0, game.bets.length - 1)

	for (const key of Object.keys(defaults.jackpots)) {
		game.jackpots[key] = Math.max(0, toNumber(game.jackpots[key], defaults.jackpots[key]))
	}

	game.winAnimation = asString(game.winAnimation, defaults.winAnimation)

	game.preloaderTime = clampInt(game.preloaderTime, defaults.preloaderTime, 0, 20000)
	game.spinDuration = clampInt(game.spinDuration, defaults.spinDuration, 300, 20000)
	game.reelDelay = clampInt(game.reelDelay, defaults.reelDelay, 0, 2000)
	game.smallWinTime = clampInt(game.smallWinTime, defaults.smallWinTime, 0, 20000)
	game.bigWinTime = clampInt(game.bigWinTime, defaults.bigWinTime, 0, 20000)
	game.popupDelay = clampInt(game.popupDelay, defaults.popupDelay, 0, 20000)

	if (!isObject(game.spins)) game.spins = structuredClone(defaults.spins)
	for (const breakpoint of Object.keys(COLS)) {
		game.spins[breakpoint] = normalizeSpins(game.spins[breakpoint], defaults.spins[breakpoint], COLS[breakpoint])
	}

	config.cta.target = config.cta.target === '_blank' ? '_blank' : '_self'

	return config
}

export function registerGameConfig() {
	setGameNormalizer(normalizeGameConfig)
}
