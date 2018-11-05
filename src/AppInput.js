import tinycolor from 'tinycolor2'

export const InputModes = {
	Motion: 0,
	Keyboard: 1,
	Mouse: 2,
}

let version = 0

export default class AppInput {

	constructor(requestedMode, changeFunc) {
		this._rawData = {
			version: -1,
			gamma: 0,
			delta: 0,
			alpha: 0,
		}

		this.onChange = changeFunc

		if (requestedMode === InputModes.Motion && window.DeviceOrientationEvent) {
			this._inputMode = InputModes.Motion
			window.addEventListener("deviceorientation", this._newData, true)
		}else if (requestedMode === InputModes.Motion) {
			this._inputMode = InputModes.Keyboard
		} else {
			this._inputMode = requestedMode
		}
	}

	_newData = (data) => {
		data.version = JSON.stringify(data)

		this._rawData = data

		if (this.onChange) {
			this.onChange(this.color())
		}
	}

	mode = () => {
		for (let key in InputModes) {
			if (this._inputMode === InputModes[key]) {
				return key
			}
		}

		return InputModes[this._inputMode]
	}

	get data() {

		const g = this._rawData.gamma || 0
		const d = this._rawData.delta || 0
		const a = this._rawData.alpha || 0

		return {
			version: this._rawData.version,
			red: (((g + 90) * 2) / 360) * 255,
			blue: ((d + 180) / 360) * 255,
			green: (a / 360) * 255,
		}
	}

	color = (defaultColor) => {
		let color = tinycolor("pink")

		let usefulMode = this._inputMode
		const mc = this.data

		if (usefulMode === InputModes.Motion && mc && mc.version === -1) {
			usefulMode = InputModes.Keyboard
		}

		switch(usefulMode) {
			case InputModes.Motion:
				color = tinycolor(`rgb(${mc.red.toFixed(2)}, ${mc.green.toFixed(2)}, ${mc.blue.toFixed(2)})`)
				break;
			case InputModes.Mouse:
			case InputModes.Keyboard:
			default:
				color = defaultColor
		}

		console.log(`${usefulMode} ${color}`)

		return color
	}

	get version() {
		return version
	}
}

function clamp(v, min, max) {
	return Math.max(min, Math.min(v, max));
}