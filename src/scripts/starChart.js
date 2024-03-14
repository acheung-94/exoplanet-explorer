import Star from "./star"

export function populateStarChart(starSystem) {
    let star = starSystem[0]
    
    let name = document.querySelector(".host-star")
    name.innerText = `star system ${star.hostname}`
    let stars = document.querySelector(".num-stars")
    stars.innerText = `Stars: 1`

    let planets = document.querySelector(".num-planets")
    planets.innerText = `Planets: ${starSystem.length}`
    
    let spectype = document.querySelector(".spectype")
    if (star.st_spectype){
        spectype.innerText = star.st_spectype
    }else { // if data is missing for spectral type, create a dummy star and obtain its general class.
        let dummy = new Star(0, starSystem)
        spectype.innerText = dummy.class
    }

    let temp = document.querySelector(".stemp")
    temp.innerText = `${star.st_teff} K`

    let mass = document.querySelector(".smass")
    mass.innerText = `${star.st_mass} x solar mass`

    let radius = document.querySelector(".sradius")
    radius.innerText = `${star.st_rad} x solar radius`

    let metallicity = document.querySelector(".metallicity")
    metallicity.innerText = `${star.st_met} ${star.st_metratio}`

    let luminosity = document.querySelector(".luminosity")
    luminosity.innerText = `${star.st_lum} x solar luminosity
`
    let pos = document.querySelector(".coordinates")
    pos.innerText = `RA: ${star.rastr}, DEC: ${star.decstr}`

    let distance = document.querySelector(".distance")
    distance.innerText = `${star.sy_dist} parsecs`
}

export function renderStarChart() {
    let starCard = document.querySelector(".star-card")
    starCard.style.visibility = "visible";
}

export function toggleStarChart() {
    let starCard = document.querySelector(".star-card")
    let starCardButton = document.querySelector("#s-toggle")
    
    starCard.style.visibility = starCard.style.visibility || "hidden"
    if (starCard.style.visibility === "hidden") {
        starCard.style.visibility = "visible";
        starCardButton.className = "fa fa-angle-double-down"
    }else{
        starCard.style.visibility = "hidden"
        starCardButton.className = "fa fa-angle-double-up"
    }
}

