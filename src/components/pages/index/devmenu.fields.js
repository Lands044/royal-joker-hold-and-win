import { DEFAULT_CONFIG } from '@js/config/game.defaults.js'

// Game-specific devmenu field groups, concatenated with CORE_FIELDS (texts/CTA/
// sound) in index.js. See src/js/config/devmenu.js in the core kit for the field
// shape ({ path, label, type, min/max/step, hint }).
//
// Deliberately file-only (edit public/config.json by hand):
// - game.spins.*.result / winLine — reel grids tied to the 5×3 / 3×3 layout
// - texts.jackpots.* / balance / bet labels — rarely changed, kept out of the
//   panel to keep it short
// - cta.target, assets.*, dev.* — plumbing

const SPIN_TYPES_HINT = 'smallwin | bigwin | lose'

const spinFields = (breakpoint, label) => DEFAULT_CONFIG.game.spins[breakpoint].map((spin, i) => [
	{ path: `game.spins.${breakpoint}.${i}.type`, label: `${label} #${i + 1}: тип`, type: 'text', hint: SPIN_TYPES_HINT },
	{ path: `game.spins.${breakpoint}.${i}.winAmount`, label: `${label} #${i + 1}: виграш`, type: 'number', min: 0, step: 1 }
]).flat()

export const GAME_FIELDS = [
	['Гра', [
		{ path: 'game.balance', label: 'Баланс', type: 'number', min: 0, step: 1 },
		{ path: 'game.bets', label: 'Ставки', type: 'list', hint: 'через кому, по зростанню' },
		{ path: 'game.betIndex', label: 'Стартова ставка (індекс)', type: 'number', min: 0, step: 1 },
		{ path: 'game.winAnimation', label: 'Анімація виграшу', type: 'text', hint: 'line | border' }
	]],
	['Джекпоти', [
		{ path: 'game.jackpots.grand', label: 'GRAND', type: 'number', min: 0, step: 1 },
		{ path: 'game.jackpots.major', label: 'MAJOR', type: 'number', min: 0, step: 1 },
		{ path: 'game.jackpots.minor', label: 'MINOR', type: 'number', min: 0, step: 1 },
		{ path: 'game.jackpots.mini', label: 'MINI', type: 'number', min: 0, step: 1 }
	]],
	['Спіни', [
		...spinFields('desktop', 'Desktop'),
		...spinFields('mobile', 'Mobile')
	]],
	['Тривалості (мс)', [
		{ path: 'game.preloaderTime', label: 'Прелоадер', type: 'number', min: 0, step: 100 },
		{ path: 'game.spinDuration', label: 'Обертання', type: 'number', min: 300, step: 100 },
		{ path: 'game.reelDelay', label: 'Затримка між барабанами', type: 'number', min: 0, step: 10 },
		{ path: 'game.smallWinTime', label: 'Малий виграш', type: 'number', min: 0, step: 100 },
		{ path: 'game.bigWinTime', label: 'Великий виграш', type: 'number', min: 0, step: 100 },
		{ path: 'game.popupDelay', label: 'Затримка попапу', type: 'number', min: 0, step: 100 }
	]]
]
