console.log(`hello!`)

import View from "./scripts/view";
//import * as PlanetChart from "./scripts/planetChart";
import * as StarChart from "./scripts/starChart"
import Star from "./scripts/stellarObj";
// SECTION : HELPERS
function randomRARange() {
    let ra1 = Math.floor(Math.random() * 360)
    let ra2 = ra1 + 5
    if (ra2 >= 360) ra2 = 360;
    return `ra between ${ra1} and ${ra2}`
}

function generateURL(){
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=`
    let dec = `between 0 and 180`
    let raRange = `${randomRARange()}`
    let plColumns = `pl_name,pl_rade,pl_masse,pl_dens,pl_eqt,pl_orbper,pl_orbsmax,disc_year,disc_facility,discoverymethod,`
    let stColumns = `hostname,st_spectype,st_teff,st_mass,st_rad,st_met,st_metratio,st_lum,rastr,decstr,sy_dist`
    let query = `select * from pscomppars where sy_snum = 1 and sy_pnum >= 2 and ${raRange} and dec ${dec}`
    //i think there might be a size limit to the request URL ... this is pretty hairy
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

function getMousePos(canvas, event){
    let pos = {};
    let rect = canvas.getBoundingClientRect();
    pos.x = event.clientX - rect.left;
    pos.y = event.clientY - rect.top;
    return pos
}

function getDistance(mouse, star){
    let a = (mouse.x - star.x)**2
    let b = (mouse.y - star.y)**2
    return Math.sqrt(a+b)
}

function getPlanetBoundaries(mouse, planets){
    let plBoundaries = []
    planets.forEach( (planet) => {
        plBoundaries.push(planet.radius)
    })
    return plBoundaries
}
function getPlanetDistances(mouse, planetPos){
    let positions = []
    planets.forEach( ( planet ) => {
        positions.push(planet.pos)
    })
}
function startAnimation(){
    refreshKey = setInterval(()=> currentView.animate(), 20)
    
}
// SECTION : VARIABLES 
let starSystemQueue = []
let refreshKey;
let currentView;
let checkerKey;

let animating = false

let canvas = document.querySelector('.background') // i think I want two canvases... one for background and one for animation... that sounds like a good idea.
canvas.height = 600
canvas.width = 600
let ctx = canvas.getContext('2d')
ctx.fillStyle = "black"
ctx.fillRect(0,0, canvas.width, canvas.height)


// SECTION : EVENT LISTENERS
const explore = document.querySelector(".explore")
explore.addEventListener("click", function(){

    clearInterval(refreshKey)
    let starSystem = starSystemQueue.shift()
    StarChart.populateStarChart(starSystem)
    currentView = new View(starSystem, canvas)
    refreshKey = setInterval(() => currentView.animate(), 20)
    animating = true
    
    if (starSystemQueue.length < 2){
        getStarSystemData() //hit the api and refresh the queue in the background. 
    }
    
})


canvas.addEventListener("mousemove", function pauseAnimation(event) {
    let boundary = currentView.hostStar.radius
    
    let starPos = currentView.hostStar.pos

    let mousePos = getMousePos(canvas, event)
    let distance = getDistance(mousePos, starPos)
    if (distance <= boundary && animating === true){
        animating = false
        clearInterval(refreshKey)
    }
    if (distance > boundary && animating === false){
        startAnimation()
        animating = true
    }
    //IMPLEMENT PLANET PAUSE? 
    // ON CLICK REMOVE THIS LISTENER? 

    // checkerKey = setInterval(() => {
    //     // solved the scope problem
    //     let mousePos = getMousePos(canvas, event)
    //     let distance = getDistance(mousePos, starPos)
    //     if (distance <= boundary){
    //         animating = false
    //     }else{
    //         animating = true
    //     }
    // }, 1000)
})


// SECTION : RESOURCE QUERIES
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

function getMusic () {
    // last item, connect to soundcloud API
}

// SECTION : PAGE INITIALIZATION FUNCTIONS
getStarSystemData()

// while (animating) {
//     refreshKey = setInterval(() => currentView.animate(), 20)
// }