import React, {Component} from 'react'
import "./fulltilt.min.js"
import './App.css';
import tinycolor from 'tinycolor2'
import ColorScheme from 'color-scheme'
import KeyCodes from './KeyCodes.js'
import AppInput, {InputModes} from './AppInput.js'

const DotColorMethods = {
    Complementary: 0,
    Monochromatic: 1,
    Triad: 2,
	Tetrad: 3,
	Analogous: 4,
}

const DotBox = {
    get width() {
    	return window.innerWidth
    },
    get height() {
	    return window.innerHeight
    },
}

const NUM_DOTS = 33
const DOT_SIZE = 100
const TRANSITION_SECONDS = 0.5
const TRANSITION_VARIANCE = 2.5
const TOTAL_TRANSITION_MS = (TRANSITION_SECONDS + TRANSITION_VARIANCE) * 1000

class App extends Component {

    constructor() {
        super()

	    this.input = new AppInput(InputModes.Motion, this.onMobileChange)

	    this.currentColorMethod = DotColorMethods.Monochromatic

	    this.defaultBackgroundColor = tinycolor("black")
	    this.defaultDotColor = tinycolor("white")

        this.errorColor = tinycolor("pink")

        let count = 0

        for (let key in KeyCodes) {
	        const colors = this.getColorsFromMethod(this.currentColorMethod, tinycolor.random())
	        const tinyColors = this.schemeColorsToTinyColors(colors)

            KeyCodes[key] = {
	        	key: key,
                colors: tinyColors,
            	color: tinyColors[count % colors.length],
	            inUse: false,
            }
            count++
        }

        const dots = []

        for (let i = 0; i < NUM_DOTS; i++) {
            dots.push(
                this.makeDot(i,
                Math.floor(DotBox.width * Math.random()),
                Math.floor(DotBox.height * Math.random())
            ))
        }

        //console.log("initial dots:", dots)

        this.state = {
            dots: dots,
            theCodes: [],
            theColor: this.defaultBackgroundColor,
        }
    }

    onMobileChange = (newColor) => {
    	this.setState({
		    theColor: newColor,
	    })
    }

	getDotColor = (i, method, defaultColor) => {
    	const colors = this.getDotColorsFromMethod(method, defaultColor)

		return colors[i % colors.length] || this.defaultDotColor
	}

	getDotColorsFromMethod = (method, hintColor = null) => {
		return this.getColorsFromMethod(method, hintColor).splice(1)
	}

	getColorsFromMethod = (method, hintColor = null) => {

		const schemeName = this.methodToScheme(method)
		const schemeColors = this.getColorScheme(schemeName, hintColor)

		return this.schemeColorsToTinyColors(schemeColors)
	}

	getColorScheme = (schemeName, hintColor) => {

    	if (!hintColor) {
    		hintColor = tinycolor.random()
	    }

    	const scheme = new ColorScheme()

		const colors = scheme.from_hex(hintColor.toHex()).scheme(schemeName).colors()

		// for some reason ColorScheme likes to do a black, black, white, white when monochromatic is used
		// with black.  this means we need to filter out common blacks and whites from the returned list

		const resultColors = []

		const uniquer = {}

		for (let i = 0; i < colors.length; i++) {
			let color = colors[i]

			if (!uniquer.hasOwnProperty(color)) {
				resultColors.push(color)
				uniquer[color] = true
			}
		}

		return resultColors
	}

	methodToScheme = (method) => {
    	switch(method) {
		    case DotColorMethods.Monochromatic:
		    	return "mono"
		    case DotColorMethods.Triad:
		    	return "triade"
		    case DotColorMethods.Tetrad:
		    	return "tetrade"
		    case DotColorMethods.Analogous:
		    	return "analogic"
		    case DotColorMethods.Complementary:
		    default:
		    	return "contrast"
	    }
	}

	schemeColorsToTinyColors = (schemeColors) => {
    	const tinyColors = []
		for (let i = 0; i < schemeColors.length; i++) {
			tinyColors.push(tinycolor(schemeColors[i]))
		}
		return tinyColors
	}

	makeDot = (i, x, y) => {
		return {
			index: i,
			tc: this.getDotColor(i, this.currentColorMethod, this.defaultDotColor),
			x: x,
			y: y,
		}
	}

    componentDidMount = () => {
        this.interval = setInterval(() => {

        	const buffer = DOT_SIZE * 1.5

            const newDots = []
            for (let i = 0; i < this.state.dots.length; i++) {
                const dot = this.state.dots[i]

				dot.x = clamp(Math.random() * DotBox.width, 0, DotBox.width - buffer)
	            dot.y = clamp(Math.random() * DotBox.height, 0, DotBox.height - buffer)

	            newDots.push(dot)
            }

            //console.log(`${maxX} ${maxY}`)

            this.setState({
                dots: newDots,
            })
        }, TOTAL_TRANSITION_MS)
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    calculateTheColor = () => {

        let accumulator = {
            r: 0,
            b: 0,
            g: 0,
            a: 1,
        }

        let count = 0

        for (let key in KeyCodes) {

            const nextColor = KeyCodes[key]

	        const numKey = parseInt(key, 10)

	        // ignore shift because it's one of our debug keys
            if (numKey !== 16 && nextColor && nextColor.inUse) {
            	const rgb = nextColor.color.toRgb()

                accumulator.r += rgb.r
                accumulator.b += rgb.b
                accumulator.g += rgb.g

                count++
            }
        }

        if (count) {
	        accumulator.r /= count
	        accumulator.b /= count
	        accumulator.g /= count
        }else {
        	accumulator = this.defaultBackgroundColor.toRgb()
        }

        return tinycolor(accumulator)
    }

    keyDown = (event) => {
	    this.inputDefaults(event)
        this.key(event.keyCode, true)
    }

    keyUp = (event) => {
	    this.inputDefaults(event)
        this.key(event.keyCode, false)
    }

    inputDefaults = (event) => {
	    event.stopPropagation()
	    event.preventDefault()
    }

    key = (keyCode, inUse) => {

        const color = KeyCodes[keyCode]

        color.inUse = inUse

	    let newColor = this.calculateTheColor() || this.defaultBackgroundColor

        this.setState({
            theColor: this.input.color(newColor),
        })
    }

    click = (event) => {
	    this.inputDefaults(event)

        let nextColorMethod = DotColorMethods.Complementary
        let nextValue = this.currentColorMethod + 1

	    for (let methodKey in DotColorMethods) {
            const value = DotColorMethods[methodKey]
            if (nextValue === value) {
	            nextColorMethod = value
                break;
            }
	    }

	    console.log(`Next: ${nextValue} From: ${this.currentColorMethod} To: ${nextColorMethod}`)

	    this.currentColorMethod = nextColorMethod
    }

    dotClick = (dot, event) => {

	    this.inputDefaults(event)
	    console.log(dot)
    }

    getDots = () => {
        const dots = []

        for (let i = 0; i < this.state.dots.length; i++) {
            const dot = this.state.dots[i]

            dot.color = this.getDotColor(i, this.currentColorMethod, this.state.theColor)

	        const dotSize = (Math.max(DotBox.width,  DotBox.height)) / 20

            const size = `${dotSize}px`

            const tTime = (TRANSITION_SECONDS + (TRANSITION_VARIANCE * Math.random()))

            const dotStyle = {
                height: size,
                width: size,
                position: "absolute",
                backgroundColor: `${dot.color.toHexString()}`,
                borderRadius: "50%",
                display: "inline-block",
                transform: `translateX(${dot.x}px) translateY(${dot.y}px)`,
                transition: `transform ${tTime}s ease-in-out, background-color 250ms linear`,
            }

            if (KeyCodes[16].inUse) { //shift
            	dotStyle.border = "5px solid red"
            }

            dots.push(
                <div id={`dot-${i}`} key={i} style={dotStyle} onClick={(event) => {this.dotClick(dot, event)}}/>
            )
        }

        return dots
    }

    render() {

        //console.log(this.state.theColor)

	    const dotsKeys = Object.keys(DotColorMethods)
	    const labelColors = this.state.theColor.monochromatic(6)
	    const labelColor = labelColors[2]

	    const labelStyle = {
		    margin: 0,
		    color: labelColor.toHexString(),
	    }

		const divStyle = {
			width: DotBox.width,
			height: DotBox.height,
			backgroundColor: this.state.theColor.toHexString(),
		}

		const debugLabel =  null /*<h2 style={labelStyle}>
								{JSON.stringify(this.input.color(this.state.theColor.toRgb()))}
							</h2>*/

		const debugColors = this.getColorsFromMethod(this.currentColorMethod, this.defaultDotColor)

        return (
            <div tabIndex={0} className="App" onKeyDown={this.keyDown} onKeyUp={this.keyUp} onClick={this.click}
                 style={divStyle}>
	            <h2 style={labelStyle}>
		            {`${dotsKeys[this.currentColorMethod]} ${this.input.mode()}`}
		        </h2>

	            {debugLabel}

                {this.getDots()}
            </div>

        );
    }
}

function clamp(v, min, max) {
	return Math.max(min, Math.min(v, max));
}

export default App;
