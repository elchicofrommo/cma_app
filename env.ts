 const settings = {
    mode: "local-testing"
}

for(let key in settings){
    process.env[key] = settings[key]
}

export default settings