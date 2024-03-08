console.log(`hello!`)
import View from "./scripts/view"
import StellarObject from "./scripts/stellarObj"

function randomRARange() {
    let ra1 = Math.floor(Math.random() * 360)
    let ra2 = ra1 + 5
    //console.log(ra1)
    //console.log(ra2)
    if (ra2 >= 360) ra2 = 360;
    return `ra between ${ra1} and ${ra2}`
}

function generateURL(){
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=`
    let dec = `between 0 and 180`
    let raRange = `${randomRARange()}`
    let query = `select * from pscomppars where sy_snum = 1 and sy_pnum >= 2 and ${raRange} and dec ${dec}`
    query = query.split(" ").join("+")
    let result = encodeURIComponent(`${url}${query}&format=json`)
    return result
}

function groupByHostName(data){
    let hostNames = [] // unique host systems
    let allSystems = []
    if (data.length){ // in the future this shouldn't be necessary. this will only be called if data.length > 0
        data.forEach( (record) =>{
        if (record.hostname && !hostNames.includes(record.hostname)){
            hostNames.push(record.hostname)
        }
    })
    hostNames.forEach((name)=>{
        let system = []
        for(let i=0; i < data.length; i++){
            if (data[i].hostname === name){
                system.push(data[i])
            }
        }
        allSystems.push(system)
    })
    }

    return allSystems
}



//finally!
const queryResults = []
let canvas = document.querySelector('.canvas')
canvas.height = 600
canvas.width = 600
let ctx = canvas.getContext('2d')

let view = new View(canvas) // will be obsolete do not keep
view.draw(ctx)

// this purpose of this queue is to cache my queries.. they're expensive and take a long time to run!! I don't wnat to do that every time a user wants to generate a new result.
let starSystemQueue = []

const button = document.querySelector("button")
button.addEventListener("click", function(){
    console.log(starSystemQueue.length)
    if (starSystemQueue.length < 2){
        let starSystem = starSystemQueue.shift()
        console.log(`starSystemQueue should be empty: ${starSystemQueue}`)
        getStarSystemData() //hit the api and refresh the queue in the background. 
        // <yet uninitialized function for rendering stuff>
        let render = new StellarObject(view, starSystem)
        render.draw(ctx)// begin the render loop, but meanwhile
    }else {
        let starSystem = starSystemQueue.shift()
        //begin render loop using starSystem and ctx for data.
        // at this point, use the function imported from view (maybe call it renderObjects)
        let stellar = new StellarObject(view, starSystem)
        stellar.draw(ctx)
    }
})

//name this function to invoke inside the event handler.. do i need to designate it as an async function? :/ I do want it to repopulate the queue in the background... 
// well let's just start with it being a normal function that returns something I can save to a variable & concat to the Queue.

function getStarSystemData(){
    return fetch(`https://cors-proxy-xphi.onrender.com/?url=` + generateURL())
        .then((res) => {
            if (res.ok){
            return res.json();
            }
        }).then(data => {
            if (data.length) { // ie if length is not zero
                console.log(`data.length > 0 .. returning now`)
                console.log(groupByHostName(data))
                return groupByHostName(data)
            }else{ // if data.lenght is zero (falsy)
                console.log(`came up empty, trying again`)
                return getStarSystemData()
                //recursively call itself until data.length > 0
            }
        }).then( (sortedData)=>{
            if (sortedData) {
                starSystemQueue = starSystemQueue.concat(sortedData)
                console.log(starSystemQueue)
            }
        }).catch((err)=> console.error(err))
}

getStarSystemData()



