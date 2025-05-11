const Log = {
    log: (color, args) => {
        const clearColor = "\u001b[1;0m"
        // Check args is single string
        if (args.length === 1 && typeof args[0] === "string") {
            args = [args]
            console.log(`${color}${args[0]}${clearColor}`)
            return
        }
        console.log(color)
        console.log(...args)
        console.log(clearColor)
    },
    white: (...args) => {
        const purple = "\u001b[1;0m"
        Log.log(purple, args)
    },
    red: (...args) => {
        const purple = "\u001b[1;31m"
        Log.log(purple, args)
    },
    green: (...args) => {
        const purple = "\u001b[1;32m"
        Log.log(purple, args)
    },
    yellow: (...args) => {
        const purple = "\u001b[1;33m"
        Log.log(purple, args)
    },
    blue: (...args) => {
        const purple = "\u001b[1;34m"
        Log.log(purple, args)
    },
    magenta: (...args) => {
        const purple = "\u001b[1;35m"
        Log.log(purple, args)
    },
}
//Export
module.exports = { Log }