
import * as d3 from 'd3'
export function populatePlanetChart(planet) {
    //planet is a data object
    //console.log(currentPlanetData)
    let name = document.querySelector(".pname")
    name.innerText = planet.pl_name

    let radius = document.querySelector(".pradius")
    radius.innerText = `${Math.floor(planet.pl_rade * 6370)} km`
    let pixels = renderRadScale(radius, planet.pl_rade)
    let marker = document.querySelector("#radmarker")
    console.log(pixels)
    marker.style.left = pixels

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
    let currentPlanetData;
    starSystem.forEach((entry) => {
        if (planet.name === entry.pl_name) currentPlanetData = entry;
    })
    populatePlanetChart(currentPlanetData);
    planetCard.style.visibility = "visible";
}

export function closePlanetChart() {
    let planetCard = document.querySelector(".planet-card") // a way to dry this all up? :/ may not be able to since i'm exporting these functions
    planetCard.style.visibility = "hidden";

}

function renderRadScale(dom, radius) {
    let item;
    if( radius < 1.5 && radius > 0.5){
        item = 1
    }else if (radius > 1.5) {
        item = (radius / 33 )
    }else {
        item = radius * -1
    }
    let pixels = item * 50
    return pixels
}