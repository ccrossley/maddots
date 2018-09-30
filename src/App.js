import React, {Component} from 'react'
import "./fulltilt.min.js"
import './App.css';
import tinycolor from 'tinycolor2'
import ColorScheme from 'color-scheme'
import KeyCodes from './KeyCodes.js'
import AppInput from './AppInput.js'

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
const TRANSITION_SECONDS = 1
const TRANSITION_VARIANCE = 0.5
const TOTAL_TRANSITION_MS = (TRANSITION_SECONDS + TRANSITION_VARIANCE) * 1000

class App extends Component {

    constructor() {
        super()

	    this.input = new AppInput()

	    this.currentColorMethod = DotColorMethods.Monochromatic

	    this.defaultDotColor = tinycolor("grey")
        this.defaultBackgroundColor = tinycolor("black")
        this.errorColor = tinycolor("pink")

        let count = 0

        for (let key in KeyCodes) {
	        const colors = this.getColorsFromMethod(this.currentColorMethod)
	        const tinyColors = this.schemeColorsToTinyColors(colors)

            KeyCodes[key] = {
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

	getDotColor = (i, method, defaultColor) => {
    	const colors = this.getColorsFromMethod(method, defaultColor)

		return colors[i % colors.length] || defaultColor
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
		return scheme.from_hex(hintColor.toHex()).scheme(schemeName).colors()
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
			tc: this.getDotColor(i, this.currentColorMethod, this.defaultDotColor.complement()),
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

        const accumulator = {
            r: 0,
            b: 0,
            g: 0,
            a: 1,
        }

        let count = 0

        for (let key in KeyCodes) {

            const nextColor = KeyCodes[key]

            if (nextColor && nextColor.inUse) {

                accumulator.r += nextColor.color._r
                accumulator.b += nextColor.color._b
                accumulator.g += nextColor.color._g

                count++
            }
        }

        accumulator.r /= count
        accumulator.b /= count
        accumulator.g /= count

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

        this.setState({
            theColor: this.calculateTheColor() || this.defaultBackgroundColor,
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

            const size = `${DOT_SIZE}px`
            const tTime = (TRANSITION_SECONDS + (TRANSITION_VARIANCE * Math.random()))

            const dotStyle = {
                height: size,
                width: size,
                position: "absolute",
                backgroundColor: `${dot.color.toHexString()}`,
                borderRadius: "50%",
                //display: "inline",
                transform: `translateX(${dot.x}px) translateY(${dot.y}px)`,
                transition: `transform ${tTime}s ease-in-out, background-color 250ms linear`,
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

	    console.log(labelColor)

	    const labelStyle = {
		    margin: 0,
		    color: labelColor.toHexString(),
	    }

		const divStyle = {
			height: DotBox.height, width: DotBox.width,
			backgroundColor: this.state.theColor.toHexString(),
		}

        return (
            <div tabIndex={0} className="App" onKeyDown={this.keyDown} onKeyUp={this.keyUp} onClick={this.click}
                 style={divStyle}>
	            <h1 style={labelStyle}>
		            {`${dotsKeys[this.currentColorMethod]} ${this.input.data.do.alpha} ${this.input.data.do.beta} ${this.input.data.do.gamma}`}
		        </h1>
                {this.getDots()}
            </div>

        );
    }
}

function clamp(v, min, max) {
	return Math.max(min, Math.min(v, max));
}

export default App;
