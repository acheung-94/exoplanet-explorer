console.log(`hello! you found me! :)`)

import View from "./scripts/view";
import * as StarChart from "./scripts/starChart"
import * as PlanetChart from "./scripts/planetChart"
import * as Modal from "./scripts/modal"


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
                return groupByHostName(data)
            }else{ // if data.lenght is zero (falsy)
                return getStarSystemData()
                //recursively call itself until data.length > 0
            }
        }).then( (sortedData)=>{
            if (sortedData) {
                starSystemQueue = starSystemQueue.concat(sortedData)
                updateStatus()
            }
        }).catch((err)=> console.error(err))
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

function updateStatus () {
    let systemStatus = document.querySelector(".system")
    let engage = document.querySelector(".explore")
    if (starSystemQueue.length) {
        engage.disabled = false
        engage.style.backgroundColor = 'green'
        systemStatus.innerText = `ONLINE`
        systemStatus.style.color = `green`
    }else{
        engage.disabled = true
        engage.style.backgroundColor = `gray`
        systemStatus.innerText = `LONG RANGE SCAN IN PROGRESS...`
        systemStatus.style.color = `orange`
    }
}


function fadeIn () {
    musicKey = setInterval( () => {
        audioEl.volume += 0.05
        if (audioEl.volume >= 0.3) {
            audioEl.volume = 0.3
            clearInterval(musicKey)
        }
    }, 1000)
}
function fadeOut () {
    musicKey = setInterval( () => {
        audioEl.volume -= 0.1
        if (audioEl.volume <= 0.1) {
            audioEl.volume = 0
            audioEl.pause()
            clearInterval(musicKey)
        }
    }, 1000)
}


// SECTION : VARIABLES 
let starSystemQueue = []
let refreshKey;
let musicKey;
let currentView;
let animating = false
let i = 0;
const renderContainer = document.querySelector('.canvas-container')
let canvas = document.querySelector('.background') // i think I want two canvases... one for background and one for animation... that sounds like a good idea.
let container = canvas.parentNode.getBoundingClientRect();
canvas.height = container.height
canvas.width = container.width
let ctx = canvas.getContext('2d')
ctx.fillStyle = "black"
ctx.fillRect(0,0, canvas.width, canvas.height)

const modal = document.querySelector(`#modal`)
const modalIntro = document.querySelector(`#modal-intro`)
const modalContent = document.querySelector(`#modal-contents`)
const openButton = document.querySelector(`#modal-open`)
const closeButton = document.querySelector(`#modal-close`)

// SECTION : EVENT LISTENERS
const explore = document.querySelector(".explore")
explore.addEventListener("click", function(){
    clearInterval(refreshKey)
    if (document.querySelector(".planet-card").style.visibility === "visible") {
        PlanetChart.togglePlanetChart()
    }
    let starSystem = starSystemQueue.shift()
    StarChart.populateStarChart(starSystem)
    currentView = new View(starSystem, canvas)
    refreshKey = setInterval(() => currentView.animate(), 20)
    animating = true
    updateStatus()
    pause.innerText = "PAUSE"
    if (starSystemQueue.length < 1){
        getStarSystemData() //hit the api and refresh the queue in the background. 

    }
    
})

const pause = document.querySelector(".pause")
pause.addEventListener("click", ()=>{
    if (animating) {
        clearInterval(refreshKey)
        animating = false
        pause.innerText = "RESUME"
    }else{
        startAnimation()
        animating = true
        pause.innerText = "PAUSE"
    }
})

//add highlighting effect to planets
canvas.addEventListener("mousemove", (event)=>{
    if (currentView) {
        let mousePos = getMousePos(canvas, event)
        currentView.hostStar.planets.forEach ( (planet) => {
        let distance = getDistance(mousePos, planet.pos)
        if (distance <= (planet.radius + 10)) {
            planet.highlighted = true
          
        }else{
            planet.highlighted = false
        }
    })
    }

})

//click on planet
canvas.addEventListener("click", (event)=>{
    let mousePos = getMousePos(canvas, event)
    if (currentView) {
        currentView.hostStar.planets.forEach((planet) => {
        let distance = getDistance(mousePos, planet.pos)
            if (distance <= (planet.radius + 5)) { // added a 5 px radius buffer for the baby planets
                PlanetChart.renderPlanetChart(planet, currentView.starSystem)
                //PlanetChart.togglePlanetChart()
            }
    })
    }

})

//click on star
canvas.addEventListener("click", (event) => {
    if (currentView) {
        let mousePos = getMousePos(canvas, event)
        let distance = getDistance(mousePos, currentView.hostStar.pos)
        if (distance <= currentView.hostStar.radius){
            StarChart.toggleStarChart()
        }
    }
})

//planet card BUTTON
const pCardButton = document.querySelector(".close-pcard")

pCardButton.addEventListener("click", (event)=>{
    PlanetChart.togglePlanetChart()
})
//close star card
const sCardButton = document.querySelector(".close-scard")
sCardButton.addEventListener("click", (event) => {
    StarChart.toggleStarChart()
})
// modal stuff
modal.addEventListener("wheel", Modal.scrollHandler)
openButton.addEventListener("click", Modal.openModal)
closeButton.addEventListener("click", Modal.closeModal)
const audioEl = document.querySelector("audio")
const toggleMusic = document.querySelector(".sound")

toggleMusic.addEventListener("click", ()=> {
    if (audioEl.paused) {
        audioEl.volume = 0
        audioEl.play()
        fadeIn()
        document.querySelector(".fa-volume-up").className = "fa fa-volume-off"
    }else{
        fadeOut()
        document.querySelector(".fa-volume-off").className = "fa fa-volume-up"
    }
    // document.querySelector(".audio-label").style.visibility = "visible"
})


// SECTION : PAGE INITIALIZATION FUNCTIONS
getStarSystemData()
Modal.initializeModal()

// SECTION : IGNORE
