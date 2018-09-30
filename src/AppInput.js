import GyroNorm from 'gyronorm'

export const InputModes = {
	MOTION: 0,
	MOUSE: 1,
	// KEYBOARD: 2,
}

export default class AppInput {

	constructor(requestedMode) {
		const args = {
			frequency:50,					// ( How often the object sends the values - milliseconds )
			gravityNormalized:true,			// ( If the gravity related values to be normalized )
			orientationBase:GyroNorm.WORLD,		// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
			decimalCount:2,					// ( How many digits after the decimal point will there be in the return values )
			logger:null,					// ( Function to be called to log messages from gyronorm.js )
			screenAdjusted:false			// ( If set to true it will return screen adjusted values. )
		}

		this._data = {
			do: {
				alpha: 0,
				beta: 0,
				gamma: 0,
				absolute: 0,
			},
			dm: {
				x: 0,
				y: 0,
				z: 0,
				gx: 0,
				gy: 0,
				gz: 0,
				alpha: 0,
				beta: 0,
				gamma: 0,
			}
		}

		this._inputMode = requestedMode || InputModes.MOTION

		this._gn = new GyroNorm(args)

		this._gn.init().then(() => {
			this._gn.stack(this._newData)
		}).catch(this._gyroError)
	}

	_newData(data) {
		console.log(`input MODE: ${this.mode()} DATA: `, data)
		this._data = data
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
		return this._data
	}

	_gyroError = (event) => {
		this._inputMode = InputModes.MOUSE
		console.log(`gyro error: ${event}. switching to ${this.mode()}`)
	}
}