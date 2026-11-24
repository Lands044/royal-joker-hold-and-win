import { imageUrl } from '@js/config/assets.js'

// textContent rather than innerText: these are plain labels, and innerText is
// rendering-dependent (it reads back empty inside a hidden element).
const setText = (selector, value) => {
	document.querySelectorAll(selector).forEach(element => {
		if (typeof value === 'string') element.textContent = value
	})
}

const setImage = (selector, value, fallbackKey) => {
	const url = imageUrl(value, fallbackKey)
	document.querySelectorAll(selector).forEach(element => {
		if (url && element.getAttribute('src') !== url) element.src = url
	})
}

/**
 * Applies the static part of the config to the page: art, labels, jackpot
 * plates, popup and CTA. Safe to call repeatedly — the dev watcher re-runs it
 * on every config.json edit. Balance / bet / previous win are game state and
 * are drawn by SlotMachine.updateUI() instead.
 */
export function renderLanding(config) {
	const { game, assets, texts, cta } = config

	setImage('.preloader__logo, .game__header-coin img', assets.logo, 'logo')

	for (const key of Object.keys(game.jackpots)) {
		setText(`.jackpot--${key} .jackpot__label`, texts.jackpots?.[key])
		setText(`.jackpot--${key} .jackpot__value`, game.jackpots[key].toFixed(2))
	}

	setText('.menu__info-block:has(.menu__info) .menu__info-label', texts.balanceLabel)
	setText('.menu__info-block:has(.menu__last-win) .menu__info-label', texts.lastWinLabel)
	setText('.menu__bet-label-wrap', texts.betLabel)

	setText('.popup__title', texts.popupTitle)
	setText('.popup__text', texts.popupText)
	setText('.popup .cta-button', texts.ctaButton)

	document.querySelectorAll('.popup .cta-button').forEach(button => {
		button.href = cta.url
		button.target = cta.target
		if (cta.target === '_blank') button.rel = 'noopener'
		else button.removeAttribute('rel')
	})
}
