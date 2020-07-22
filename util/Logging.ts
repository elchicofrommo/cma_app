const chalk = require('chalk');
const ctx = new chalk.Instance({level: 3});
const moment = require('moment')


 
//let fmt_class = ctx.rgb(244,184,19)
let fmt_class = ctx.blueBright
let fmt_info = ctx.cyan
let fmt_error = ctx.red
let fmt_warning = ctx.yellow
let fmt_verbose = ctx.magenta

let isVerbose = true
let fullObject = false


function _stringify(toStringify: object, expand ){

    let strings = []
    if(expand){
        for( const key in toStringify){
            strings.push(`${key}: ${JSON.stringify(toStringify[key], null, 2)}`)
        }
    }

    else{
        for( const key in toStringify){
            strings.push(`${key}: ${toStringify[key]}`)
        }
    }
    let string = strings.join(`\n`).trim()
    if(string.length > 0)
        string = '\n' + string 
    return fmt_class(string)
}
function _log( output, toStringify, color, expand=fullObject){
    if(isVerbose)
        output = `${output} ${getCallSource()}`

    var time = moment().format("ddd MM/YY: HH:mm:ss:SSS")
    output = `[${time}] ${output}`;

    console.log( color(output + _stringify(toStringify, expand)))
}

function info(output, toStringify:object = {}){
	_log(output, toStringify, fmt_info)

}

function error(output, toStringify:object = {}){
	_log(output, toStringify, fmt_error)
}

function warn(output, toStringify ={}){
	_log(output, toStringify, fmt_warning)
}
function verbose(output, toStringify = {}){
	_log(output, toStringify, fmt_verbose, true)
}

function logAsync(output){
	 var p = new Promise(function(resolve, reject) {
    	// Do async job
        console.log(output)
        resolve("logged")
	})

	
}

	
function getCallSource() {
  // this does not work on all javascript engines. Its very hacky and
  // should never be done on a productoin level ... something like this 
  // might work but would need more tightening like tightening the app locaiton
  var orig = new Error().stack;
  var stack = orig.split('\n');
  var debugString = stack[4].trim();
  var prodString = stack[3].trim();
  var fileLocation = !global.nativeCallSyncHook? debugString.substring(debugString.indexOf(' '), debugString.indexOf('(')) :
    prodString.substring(0, prodString.indexOf('@')) 
    
  
  return fmt_verbose( `[Location: ${fileLocation.trim() } ]`) 

}	

info("ready to export Logger");

export default {
    info, warn, error, verbose
}


