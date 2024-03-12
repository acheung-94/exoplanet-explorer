console.log(`hello!`)

import View from "./scripts/view";
//import * as PlanetChart from "./scripts/planetChart";
import * as StarChart from "./scripts/starChart"
import * as PlanetChart from "./scripts/planetChart"

import AudioMotionAnalyzer from 'audiomotion-analyzer';

// SECTION : RESOURCE QUERIES
function getStarSystemData(){
    let proxiedURL = `https://cors-proxy-xphi.onrender.com/?url=`+ generateURL()
    return fetch(proxiedURL)
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
    let plColumns = `pl_name,pl_rade,pl_bmasse,pl_dens,pl_eqt,pl_orbper,pl_orbsmax,disc_year,disc_facility,discoverymethod,`
    let stColumns = `hostname,st_spectype,st_teff,st_mass,st_rad,st_met,st_metratio,st_lum,rastr,decstr,sy_dist`
    let query = `select ${plColumns}${stColumns} from pscomppars where sy_snum = 1 and sy_pnum >= 2 and ${raRange} and dec ${dec}`
    //i think there might be another character encoding issue
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

function getDistance(mouse, object){
    let a = (mouse.x - object.x)**2
    let b = (mouse.y - object.y)**2
    return Math.sqrt(a+b)
}

function startAnimation(){
    refreshKey = setInterval(()=> currentView.animate(), 20)
}
// SECTION : VARIABLES 
let starSystemQueue = []
let refreshKey;
let currentView;
let animating = false

const renderContainer = document.querySelector('.canvas-container')
let canvas = document.querySelector('.background') // i think I want two canvases... one for background and one for animation... that sounds like a good idea.
let container = canvas.parentNode.getBoundingClientRect();
canvas.height = container.height
canvas.width = container.width
let ctx = canvas.getContext('2d')
ctx.fillStyle = "black"
ctx.fillRect(0,0, canvas.width, canvas.height)
const audioEl = document.querySelector(".audio")
const audioMotion = new AudioMotionAnalyzer(
    document.querySelector(".audio-container"),
    {
      source: audioEl,
      height: 100,
      width: 250,
      // you can set other options below - check the docs!
      mode: 3,
      gradient: 'rainbow',
      showScaleX: false,
      barSpace: .6,
      ledBars: true,
    }
  );

// SECTION : EVENT LISTENERS
const explore = document.querySelector(".explore")
explore.addEventListener("click", function(){

    clearInterval(refreshKey)
    PlanetChart.closePlanetChart()
    let starSystem = starSystemQueue.shift()
    StarChart.populateStarChart(starSystem)

    currentView = new View(starSystem, canvas)
    refreshKey = setInterval(() => currentView.animate(), 20)
    animating = true
    pause.innerText = "Pause Animation"
    if (starSystemQueue.length < 2){
        getStarSystemData() //hit the api and refresh the queue in the background. 
    }
    
})

const pause = document.querySelector(".pause")
pause.addEventListener("click", ()=>{
    if (animating) {
        clearInterval(refreshKey)
        animating = false
        pause.innerText = "Resume animation"
    }else{
        
        startAnimation()
        animating = true
        pause.innerText = "Pause animation"
    }
})

//add highlighting effect to planets
canvas.addEventListener("mousemove", (event)=>{

    let mousePos = getMousePos(canvas, event)
    currentView.hostStar.planets.forEach ( (planet) => {
        let distance = getDistance(mousePos, planet.pos)
        if (distance <= (planet.radius + 10)) {
            console.log(planet)
            planet.highlighted = true

        }else{
            planet.highlighted = false
        }
    })
})

//click on planet
canvas.addEventListener("click", (event)=>{
    let mousePos = getMousePos(canvas, event)
    currentView.hostStar.planets.forEach((planet) => {
        let distance = getDistance(mousePos, planet.pos)
        if (distance <= (planet.radius + 5)) { // added a 5 px radius buffer for the baby planets
            console.log(currentView.starSystem)
            PlanetChart.renderPlanetChart(planet, currentView.starSystem)
        }
    })
})

//click on star
canvas.addEventListener("click", (event) => {
    let mousePos = getMousePos(canvas, event)
    let distance = getDistance(mousePos, currentView.hostStar.pos)
    if (distance <= currentView.hostStar.radius){
        StarChart.renderStarChart()
    }
})

//close planet card
const closePCard = document.querySelector(".close-pcard")
closePCard.addEventListener("click", (event)=>{
    console.log(closePCard)
    PlanetChart.closePlanetChart()
})
//close star card
const closeSCard = document.querySelector(".close-scard")
closeSCard.addEventListener("click", (event) => {
    StarChart.closeStarChart()
})

const audioPlay = document.querySelector(".play-audio")
audioPlay.addEventListener("click", ()=> {
    audioEl.play()
})
const audioPause = document.querySelector(".pause-audio")
audioPause.addEventListener("click", ()=> {
    audioEl.pause()
})
const vUp = document.querySelector(".vol-up")
vUp.addEventListener("click", ()=>{
    if(audioEl.volume <= 1.0) {
        audioEl.volume += 0.1;
    }
})
const vDown = document.querySelector(".vol-down")
vDown.addEventListener("click", ()=>{
    audioEl.volume -= 0.1;
})

// SECTION : PAGE INITIALIZATION FUNCTIONS
getStarSystemData()



// SECTION : IGNORE
// canvas.addEventListener("mousemove", function pauseAnimation(event) {
//     //let boundary = currentView.hostStar.radius
//     //let planetRadii = getPlanetRadii(currentView.hostStar.planets)
//     //let starPos = currentView.hostStar.pos
//     //let planetPositions = getPlanetPositions(currentView.hostStar.planets)
//     let mousePos = getMousePos(canvas, event)
//     currentView.hostStar.planets.forEach( (planet) => {
//         console.log(planet)
//         let distance = getDistance(mousePos, planet.pos)
//         if (distance <= planet.radius && animating === true){
//             animating = false
//             clearInterval(refreshKey)
//         }
//         if (distance > planet.radius && animating === false){
//             startAnimation()
//             animating = true
//             console.log(`uh oh`)
//         }
//     })
//     // ok. so it keeps restarting the animation because there's always
//     // going to be one planet where the else clause is true, thus restarting
//     // the animation...
//     // sigh. maybe i have to just create a click to pause...
// })

