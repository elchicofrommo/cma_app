const { NativeModules } = require( "react-native");

const chalk = require('chalk');
const ctx = new chalk.Instance({ level: 3 });
const moment = require('moment')

 class Logger {
    static fmt_class = ctx.blueBright;
    static fmt_info = ctx.cyan
    static fmt_error = ctx.red
    static fmt_warning = ctx.yellow
    static fmt_verbose = ctx.magenta
    static silent = false;
    static isVerbose = true
    static fullObject = false


    static _stringify(toStringify: object, expand) {

    let strings = []
    if (expand) {
        for (const key in toStringify) {
            strings.push(`${key}: ${JSON.stringify(toStringify[key], null, 2)}`)
        }
    }

    else {
        for (const key in toStringify) {
            strings.push(`${key}: ${toStringify[key]}`)
        }
    }
    let string = strings.join(`\n`).trim()
    if (string.length > 0)
        string = '\n' + string
    return Logger.fmt_class(string)
}
static _log(output, toStringify, color, expand = Logger.fullObject) {
    if(Logger.silent)
        return;

    if (Logger.isVerbose)
        output = `${output} ${Logger.getCallSource()}`

    var time = moment().format("ddd MM/YY: HH:mm:ss:SSS")
    output = `[${time}] ${output}`;

    console.log(color(output + Logger._stringify(toStringify, expand)))
}

static setSilent(silent){
    Logger.silent = silent;
}

static info(output, toStringify: object = {}) {
    Logger._log(output, toStringify, Logger.fmt_info)

}

static error(output, toStringify: object = {}) {
    Logger._log(output, toStringify, Logger.fmt_error, true)
}

static warn(output, toStringify = {}) {
    Logger._log(output, toStringify, Logger.fmt_warning)
}
static verbose(output, toStringify = {}) {
    Logger._log(output, toStringify, Logger.fmt_verbose, true)
}

static logAsync(output) {
    var p = new Promise(function (resolve, reject) {
        // Do async job
        console.log(output)
        resolve("logged")
    })


}


static getCallSource() {
    // this does not work on all javascript engines. Its very hacky and
    // should never be done on a productoin level ... something like this 
    // might work but would need more tightening like tightening the app locaiton
    var orig = new Error().stack;
    var stack = orig.split('\n');
    var debugString = stack[4].trim();
    var prodString = stack[3].trim();
    var fileLocation = !global.nativeCallSyncHook ? debugString.substring(debugString.indexOf(' '), debugString.indexOf('(')) :
        prodString.substring(0, prodString.indexOf('@'))


    return Logger.fmt_verbose(`[Location: ${fileLocation.trim()} ]`)

}	
}



export default   {
    info: Logger.info, 
    warn: Logger.warn, 
    error:Logger.error, 
    verbose: Logger.verbose, 
    setSilent: Logger.setSilent
}


