import React, {Component} from 'react';
import './App.css';
import tinycolor from 'tinycolor2'

const keyCodes = {
    0: 'That key has no keycode',
    3: 'break',
    8: 'backspace / delete',
    9: 'tab',
    12: 'clear',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause/break',
    20: 'caps lock',
    21: 'hangul',
    25: 'hanja',
    27: 'escape',
    28: 'conversion',
    29: 'non-conversion',
    32: 'spacebar',
    33: 'page up',
    34: 'page down',
    35: 'end',
    36: 'home',
    37: 'left arrow',
    38: 'up arrow',
    39: 'right arrow',
    40: 'down arrow',
    41: 'select',
    42: 'print',
    43: 'execute',
    44: 'Print Screen',
    45: 'insert',
    46: 'delete',
    47: 'help',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    58: ':',
    59: 'semicolon (firefox), equals',
    60: '<',
    61: 'equals (firefox)',
    63: 'ß',
    64: '@ (firefox)',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'Windows Key / Left ⌘ / Chromebook Search key',
    92: 'right window key',
    93: 'Windows Menu / Right ⌘',
    95: 'sleep',
    96: 'numpad 0',
    97: 'numpad 1',
    98: 'numpad 2',
    99: 'numpad 3',
    100: 'numpad 4',
    101: 'numpad 5',
    102: 'numpad 6',
    103: 'numpad 7',
    104: 'numpad 8',
    105: 'numpad 9',
    106: 'multiply',
    107: 'add',
    108: 'numpad period (firefox)',
    109: 'subtract',
    110: 'decimal point',
    111: 'divide',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12',
    124: 'f13',
    125: 'f14',
    126: 'f15',
    127: 'f16',
    128: 'f17',
    129: 'f18',
    130: 'f19',
    131: 'f20',
    132: 'f21',
    133: 'f22',
    134: 'f23',
    135: 'f24',
    144: 'num lock',
    145: 'scroll lock',
    160: '^',
    161: '!',
    162: '؛ (arabic semicolon)',
    163: '#',
    164: '$',
    165: 'ù',
    166: 'page backward',
    167: 'page forward',
    168: 'refresh',
    169: 'closing paren (AZERTY)',
    170: '*',
    171: '~ + * key',
    172: 'home key',
    173: 'minus (firefox), mute/unmute',
    174: 'decrease volume level',
    175: 'increase volume level',
    176: 'next',
    177: 'previous',
    178: 'stop',
    179: 'play/pause',
    180: 'e-mail',
    181: 'mute/unmute (firefox)',
    182: 'decrease volume level (firefox)',
    183: 'increase volume level (firefox)',
    186: 'semi-colon / ñ',
    187: 'equal sign',
    188: 'comma',
    189: 'dash',
    190: 'period',
    191: 'forward slash / ç',
    192: 'grave accent / ñ / æ / ö',
    193: '?, / or °',
    194: 'numpad period (chrome)',
    219: 'open bracket',
    220: 'back slash',
    221: 'close bracket / å',
    222: 'single quote / ø / ä',
    223: '`',
    224: 'left or right ⌘ key (firefox)',
    225: 'altgr',
    226: '< /git >, left back slash',
    230: 'GNOME Compose Key',
    231: 'ç',
    233: 'XF86Forward',
    234: 'XF86Back',
    235: 'non-conversion',
    240: 'alphanumeric',
    242: 'hiragana/katakana',
    243: 'half-width/full-width',
    244: 'kanji',
    251: "unlock trackpad (Chrome/Edge)",
    255: 'toggle touchpad',
};

const DotColorMethods = {
    Complementary: 0,
    Monochromatic: 1,
    Triad: 2,
	Tetrad: 3,
	SplitComplement: 4,
	Analogous: 5,
}

const DotBox = {
    width: window.innerWidth,
    height: window.innerHeight,
}

const NUM_DOTS = 33
const DOT_SIZE = 100
const TRANSITION_SECONDS = 1
const TRANSITION_VARIANCE = 0.5
const TOTAL_TRANSITION_MS = (TRANSITION_SECONDS + TRANSITION_VARIANCE) * 1000

class App extends Component {

    constructor() {
        super()

	    this.currentColorMethod = DotColorMethods.Monochromatic

        this.defaultDotColor = tinycolor("white")
        this.defaultBackgroundColor = tinycolor("black")
        this.errorColor = tinycolor("pink")

        for (let key in keyCodes) {
            keyCodes[key] = this.makeColor(tinycolor.random())
        }

        const dots = []

        for (let i = 0; i < NUM_DOTS; i++) {
            dots.push(
                this.makeDot(this.getDotColor(i, this.currentColorMethod, this.defaultDotColor),
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

    componentDidMount = () => {
        this.interval = setInterval(() => {

            const newDots = []

            let maxX = 0
            let maxY = 0

            for (let i = 0; i < this.state.dots.length; i++) {
                const dot = this.state.dots[i]

                dot.tc = this.getDotColor(i, this.currentColorMethod, this.defaultDotColor)

                dot.x = Math.floor(DotBox.width * Math.random())
                dot.y = Math.floor(DotBox.height * Math.random())

                maxX = maxX < dot.x ? dot.x : maxX
                maxY = maxY < dot.y ? dot.y : maxY

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

    getDotColor = (dotNumber, method = DotColorMethods.Complementary, hintColor = null) => {

        const color = hintColor.clone()

        let result
        let colorArray

        switch (method) {
            case DotColorMethods.Monochromatic:
                colorArray = color.lighten(15).monochromatic(NUM_DOTS)
                break;
            case DotColorMethods.Triad:
                colorArray = color.lighten(15).triad()
                break;
            case DotColorMethods.Tetrad:
                colorArray = color.lighten(15).tetrad()
                break;
            case DotColorMethods.SplitComplement:
                colorArray = color.splitcomplement()
                break;
	        case DotColorMethods.Analogous:
	        	colorArray = color.analogous(NUM_DOTS)
	        	break;
            case DotColorMethods.Complementary:
            default:
                colorArray = [hintColor.complement()]
        }

        const index = (dotNumber ? dotNumber - 1 : 0) % colorArray.length

        result = colorArray[index] || this.errorColor

        return result
    }

    makeDot = (tc, x, y) => {
        return {
            color: tc.complement(),
            x: x, y: y,
        }
    }

    makeColor = (tc, inUse=false) => {
        return {
            color: tc,
            inUse: inUse,
        }
    }

    calculateTheColor = () => {

        const accumulator = {
            r: 0,
            b: 0,
            g: 0,
            a: 1,
        }

        let count = 0

        for (let key in keyCodes) {

            const nextColor = keyCodes[key]

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
        event.preventDefault()
        this.key(event.keyCode, true)
    }

    keyUp = (event) => {
	    event.preventDefault()
        this.key(event.keyCode, false)
    }

    key = (keyCode, inUse) => {
        const color = keyCodes[keyCode]

        color.inUse = inUse

        this.setState({
            theColor: this.calculateTheColor() || this.defaultBackgroundColor,
        })
    }

    click = (event) => {

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

	    event.persist()
	    event.stopPropagation()
	    event.preventDefault()

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

        return (
            <div tabIndex={0} className="App" onKeyDown={this.keyDown} onKeyUp={this.keyUp} onClick={this.click}
                 style={{
                     height: DotBox.height, width: DotBox.width,
                     backgroundColor: this.state.theColor.toHexString(),
                 }}>
	            <h1 style={{color: this.state.theColor.complement().toHexString()}}>{dotsKeys[this.currentColorMethod]}</h1>
                {this.getDots()}
            </div>

        );
    }
}

export default App;
