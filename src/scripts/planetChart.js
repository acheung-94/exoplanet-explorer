export function populatePlanetChart(planet) {

    //how should i go about this....? programatically create field names? it would be weird to iterate through and put like 17 different conditions... 
    // i could also just manually create field names in the html, then grab each name and append the data values to it. 

    let name = document.querySelector(".pname")
    name.innerText = planet.pl_name

    let radius = document.querySelector(".pradius")
    radius.innerText = `${planet.pl_rade * 6370} km`

    let mass = document.querySelector(".pmass")
    mass.innerText = `${planet.pl_masse} times Earth mass`

    let density = document.querySelector(".pdensity")
    density.innerText = `${planet.pl_dens} g/cm^3`

    let temp = document.querySelector(".ptemp")
    temp.innerText = `${planet.pl_eqt} K`

    let orbper = document.querySelector(".porb-per")
    orbper.innerText = `${planet.pl_orbper} days`

    let discYr = document.querySelector(".pdisc-year")
    discYr.innerText = planet.disc_year

    let facility = document.querySelector(".pdisc-facility")
    facility.innerText = planet.disc_facility

    let det = document.querySelector(".pdisc-method")
    det.innerText = planet.discoverymethod
}

export function renderPlanetChart(planet) {
    let planetCard = document.querySelector(".planet-card")
    populatePlanetChart(planet);
    planetCard.hidden = false;
}

export function closePlanetChart() {
    let planetCard = document.querySelector(".planet-card") // a way to dry this all up? :/ may not be able to since i'm exporting these functions
    planetCard.hidden = true
}
