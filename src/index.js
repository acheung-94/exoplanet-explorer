
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
            if (data.length) { 
                return groupByHostName(data)
            }else{ 
                return getStarSystemData()
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
    query = query.split(" ").join("+")
    let result = encodeURIComponent(`${url}${query}&format=json`)

    return result
}

function groupByHostName(data){
    let hostNames = [] 
    let allSystems = []
    if (data.length){ 
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

function clearHighlightsExcept(planet){
    currentView.hostStar.planets.forEach ((otherPlanet) => {
        if (otherPlanet !== planet) {
            otherPlanet.selected = false
        }
        
    })

}

// SECTION : VARIABLES 
let starSystemQueue = []
let refreshKey;
let musicKey;
let currentView;
let animating = false
let i = 0;

let canvas = document.querySelector('.background') 
let container = canvas.parentNode.getBoundingClientRect();
canvas.height = container.height
canvas.width = container.width
let ctx = canvas.getContext('2d')
ctx.fillStyle = "black"
ctx.fillRect(0,0, canvas.width, canvas.height)

const modal = document.querySelector(`#modal`)
const openButton = document.querySelector(`#modal-open`)
const closeButton = document.querySelector(`#modal-close`)
const explore = document.querySelector(".explore")
const pause = document.querySelector(".pause")
const sCardButton = document.querySelector(".close-scard")
const pCardButton = document.querySelector(".close-pcard")
const audioEl = document.querySelector("audio")
const toggleMusic = document.querySelector(".sound")



// SECTION : EVENT LISTENERS
explore.addEventListener("click", function(){
    clearInterval(refreshKey)
    if (document.querySelector(".planet-card").style.visibility === "visible") {
        PlanetChart.togglePlanetChart()
    }
    let starSystem = starSystemQueue.shift()
    StarChart.populateStarChart(starSystem)
    currentView = new View(starSystem, canvas)
    animating = true
    refreshKey = setInterval(() => currentView.animate(animating), 20)
    updateStatus()
    pause.innerText = "PAUSE"
    if (starSystemQueue.length < 1){
        getStarSystemData() //refresh the queue in the background. 
    }
})


pause.addEventListener("click", ()=>{
    if (animating) {
        animating = false
        pause.innerText = "RESUME"
    }else{
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
            if (distance <= (planet.radius + 10)) { // added a 10 px radius buffer for the baby planets
                clearHighlightsExcept(planet)
                planet.selected = true
                PlanetChart.renderPlanetChart(planet, currentView.starSystem)
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

//planet card
pCardButton.addEventListener("click", ()=>{
    PlanetChart.togglePlanetChart()
})
//close star card

sCardButton.addEventListener("click", () => {
    StarChart.toggleStarChart()
})

// modal listeners
modal.addEventListener("wheel", Modal.scrollHandler)

openButton.addEventListener("click", Modal.openModal)

closeButton.addEventListener("click", Modal.closeModal)

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
})


// SECTION : PAGE INITIALIZATION FUNCTIONS
getStarSystemData()
Modal.initializeModal()

