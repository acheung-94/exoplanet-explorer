import Star from "./stellarObj"

export function populateStarChart(starSystem) {
    let star = starSystem[0]
    //how should i go about this....? programatically create field names? it would be weird to iterate through and put like 17 different conditions... 
    // i could also just manually create field names in the html, then grab each name and append the data values to it. 
    let name = document.querySelector(".host-star")
    name.innerText = star.hostname

    let spectype = document.querySelector(".spectype")
    //alright get ready for some crazy stuff...
    if (star.st_spectype){
        spectype.innerText = star.st_spectype
    }else { // if data is not provided for spectral type, create a dummy star and obtain its general class.
        let dummy = new Star(0, starSystem)
        spectype.innerText = dummy.class
    }

    let temp = document.querySelector(".stemp")
    temp.innerText = `${star.st_teff} K`

    let mass = document.querySelector(".smass")
    mass.innerText = `${star.st_mass} units Solar mass`

    let radius = document.querySelector(".sradius")
    radius.innerText = `${star.st_rad}`

    let metallicity = document.querySelector(".metallicity")
    metallicity.innerText = `${star.st_met} ${star.st_metratio}`

    let luminosity = document.querySelector(".luminosity")
    luminosity.innerText = `${star.st_lum} units solar luminosity
`
    let pos = document.querySelector(".coordinates")
    pos.innerText = `RA: ${star.rastr}, DEC: ${star.decstr}`

    let distance = document.querySelector(".distance")
    distance.innerText = `${star.sy_dist} parsecs`
}

export function renderStarChart(star) {
    let starCard = document.querySelector(".star-card")
    populateStarChart(star);
    starCard.hidden = false;
}

export function closeStarChart() {
    let starCard = document.querySelector(".star-card") // a way to dry this all up? :/ may not be able to since i'm exporting these functions
    starCard.hidden = true
}

