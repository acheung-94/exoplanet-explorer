
import * as d3 from 'd3'
export function populatePlanetChart(planet) {

    let name = document.querySelector("#pname")
    name.innerText = planet.pl_name

    let radius = document.querySelector(".pradius")
    radius.innerText = `${Math.floor(planet.pl_rade * 6370)} km`


    let mass = document.querySelector(".pmass")
    mass.innerText = `${planet.pl_bmasse} x Earth mass`

    let density = document.querySelector(".pdensity")
    density.innerText = `${planet.pl_dens} g/cm^3`

    let temp = document.querySelector(".ptemp")
    temp.innerText = `${planet.pl_eqt || `unknown`} K`

    let orbper = document.querySelector(".porb-per")
    orbper.innerText = `${planet.pl_orbper} days`

    let discYr = document.querySelector(".pdisc-year")
    discYr.innerText = planet.disc_year

    let facility = document.querySelector(".pdisc-facility")
    facility.innerText = planet.disc_facility

    let det = document.querySelector(".pdisc-method")
    det.innerText = planet.discoverymethod
}

export function renderPlanetChart(planet, starSystem) {
    let planetCard = document.querySelector(".planet-card")
    let planetCardButton = document.querySelector("#p-toggle")
    let currentPlanetData;
    starSystem.forEach((entry) => {
        if (planet.name === entry.pl_name) currentPlanetData = entry;
    })
    populatePlanetChart(currentPlanetData);
    planet.highlighted = true
    planetCard.style.visibility = "visible";
    planetCardButton.className = "fa fa-angle-double-down"
}

export function togglePlanetChart() {
    let planetCard = document.querySelector(".planet-card")
    let planetCardButton = document.querySelector("#p-toggle")
    planetCard.style.visibility = planetCard.style.visibility || "hidden"
    if (planetCard.style.visibility === "hidden" ) {
        planetCard.style.visibility = "visible"
        planetCardButton.className = "fa fa-angle-double-down"
    }else {
        planetCard.style.visibility = "hidden"
        planetCardButton.className = "fa fa-angle-double-up"
    }
}
