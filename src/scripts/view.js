//import stellar card, planetary card, and planet/star classes.
//responsible for taking in stellar system data, creating star and planets, and animating. 
//consider not using an actual View, but export this thing as a collection of functions. 
//starting to think it doesn't really make sense to have it be a class with a instance methods.. 
//the background will likely not change from instance to instance.

import Star from "./stellarObj"

function renderObjects ( starSystem ) {
    //should take in data from query to instantiate new objects
    let animation = document.querySelector(".animations")
    animation.width = 600
    animation.height = 450
    let renderCtx = animation.getContext('2d')

    let hostStar = new Star(animation, starSystem)
    let planets = hostStar.planets

    function animate (renderCtx) {
        hostStar.draw(renderCtx) //update to a different method, nothing is moving yet.
        planets.forEach( (planet) => {
            planet.draw(renderCtx)
        })
    }

    requestAnimationFrame(animate(renderCtx), 20)
}

export default renderObjects;