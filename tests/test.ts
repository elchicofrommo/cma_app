

const {Logger} = require( '@aws-amplify/core')
const {Auth} = require( '@aws-amplify/auth')
const config = require('../aws-exports.js')
Logger.LOG_LEVEL = 'DEBUG';
const result = Auth.configure(config)

const log = {
  verbose: (message, objects)=>{
    console.log(message);
    objects && console.log(JSON.stringify(objects, null, 2))
  } 
}


log.verbose(`configured with the following`, {config, result})
Auth.currentCredentials().then(creds=>{
  log.verbose(`before all the auth result is`, {creds})
})



