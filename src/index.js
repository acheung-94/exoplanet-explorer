console.log(`hello!`)
import View from "./scripts/view"
import StellarObject from "./scripts/stellarObj"

function randomRARange() {
    let ra1 = Math.floor(Math.random() * 360)
    let ra2 = ra1 + 5
    console.log(ra1)
    console.log(ra2)
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
    let hostNames = []
    data.forEach( (record) =>{
        if (!hostNames.includes(record.hostname)){
            hostNames.push(record.hostname)
        }
    })
    let allSystems = []
    hostNames.forEach((name)=>{
        let system = []
        for(let i=0; i < data.length; i++){
            if (data[i].hostname === name){
                system.push(data[i])
            }
        }
        allSystems.push(system)
    })
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

//put this whole thing inside of a click handler for button. 

const button = document.querySelector("button")
button.addEventListener("click", function(){
    if (starSystemQueue.length < 2){
        let starSystem = starSystemQueue.shift()
        // <yet uninitialized function for rendering stuff>
        // begin the render loop, but meanwhile
        //hit the api and refresh the queue in the background. 
        // starSystemQueue = starSystemQueue.concat(getStarSystemData())
    }else {
        let starSystem = starSystemQueue.shift()
        //begin render loop using starSystem and ctx for data. 
    }
})

//name this function to invoke inside the event handler.. do i need to designate it as an async function? :/ I do want it to repopulate the queue in the background... 
// well let's just start with it being a normal function that returns something I can save to a variable & concat to the Queue.

function getStarSystemData(){
    fetch(`https://cors-proxy-xphi.onrender.com/?url=` + generateURL())
        .then((res) => {
            if (res.ok){
            return res.json();
            }
        }).then(data => {
            // return if data is present and valid
            if (data) {
                console.log(starSystemQueue.concat(groupByHostName(data)))
                starSystemQueue = starSystemQueue.concat(groupByHostName(data))
                //recursively call itself until data.length > 0
                console.log(starSystemQueue)
                // at this point, use the function imported from view (maybe call it renderObjects)
                let stellar = new StellarObject(view, starSystemQueue.shift())
                stellar.draw(ctx)
                console.log(starSystemQueue)
                return groupByHostName(data)
            }else{
                let moreData = getStarSystemData()
                return groupByHostName(moreData)
            }
    }).catch((err)=> console.error(err))
}

getStarSystemData()



