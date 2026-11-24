import { DEFAULT_CONFIG as CORE_DEFAULTS } from '@js/config/defaults.js'

// Royal Joker: Hold and Win — slot machine with scripted spins.
//
// Named game.defaults.js (not defaults.js) deliberately: the core kit already
// installs its own src/js/config/defaults.js at that exact path, so this file
// needs a different name to sit next to it without colliding.

// Core fields this game has no element for: there is no single action button
// (spin/auto are icon-only), no rotate overlay and no background image (the
// page background is a CSS gradient). Dropped here instead of editing the
// shared core defaults — see "No dead or hidden fields" in docs/config.md.
const { actionButton, rotateNotice, ...CORE_TEXTS } = CORE_DEFAULTS.texts
const { background, ...CORE_ASSETS } = CORE_DEFAULTS.assets

export const DEAD_CORE_KEYS = {
	texts: ['actionButton', 'rotateNotice'],
	assets: ['background']
}

export const DEFAULT_CONFIG = {
	...CORE_DEFAULTS,

	cta: {
		url: "#",
		target: "_self"
	},

	texts: {
		...CORE_TEXTS,
		popupTitle: "CLAIM YOUR BONUS!",
		popupText: "1500 € + 250 FS",
		ctaButton: "GET BONUS",
		balanceLabel: "BALANCE",
		lastWinLabel: "PREVIOUS WIN",
		betLabel: "BET",
		jackpots: {
			grand: "GRAND",
			major: "MAJOR",
			minor: "MINOR",
			mini: "MINI"
		}
	},

	game: {
		// Starting balance and the bet ladder the −/+ buttons step through.
		balance: 1000,
		bets: [1, 2, 4, 8, 16, 32, 64],
		// Index into `bets` selected on load.
		betIndex: 0,

		// Values shown in the jackpot plates (display only).
		jackpots: {
			grand: 1000,
			major: 150,
			minor: 50,
			mini: 25
		},

		// Win highlight style: 'line' (payline across the winning icons) or
		// 'border' (animated frame around each winning icon).
		winAnimation: "line",

		// Timings, ms.
		preloaderTime: 2200,
		spinDuration: 3000,
		// Delay between successive reels starting/stopping.
		reelDelay: 100,
		smallWinTime: 1500,
		bigWinTime: 2000,
		// Pause between the last spin finishing and the bonus popup.
		popupDelay: 1500,

		// Scripted spins, played in order; after the last one the popup opens.
		// type: 'smallwin' | 'bigwin' | 'lose'
		// winLine: the winning row (0–2) per column, null = no win in that column
		// result: per column, the 3 icons shown top-to-bottom (icon-1 … icon-8)
		// Desktop has 5 reels, mobile (touch devices) 3 — each has its own list.
		spins: {
			desktop: [
				{
					type: "smallwin",
					winAmount: 50,
					winLine: [1, 0, 1],
					result: [
						[4, 2, 1],
						[2, 4, 6],
						[5, 2, 7],
						[5, 1, 4],
						[3, 4, 8]
					]
				},
				{
					type: "bigwin",
					winAmount: 150,
					winLine: [1, 1, 1, 1, 1],
					result: [
						[3, 8, 2],
						[1, 8, 4],
						[5, 8, 5],
						[4, 8, 2],
						[5, 8, 6]
					]
				}
			],
			mobile: [
				{
					type: "smallwin",
					winAmount: 50,
					winLine: [1, 0, 1],
					result: [
						[4, 2, 1],
						[2, 4, 6],
						[5, 2, 7]
					]
				},
				{
					type: "bigwin",
					winAmount: 150,
					winLine: [1, 1, 1],
					result: [
						[3, 8, 2],
						[1, 8, 6],
						[5, 8, 4]
					]
				}
			]
		}
	},

	assets: {
		...CORE_ASSETS,
		sounds: {
			spin: "spin",
			win: "win"
		}
	}
}
