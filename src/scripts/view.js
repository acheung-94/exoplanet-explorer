//import stellar card, planetary card, and planet/star classes.
//responsible for taking in stellar system data, creating star and planets, and animating. 
//consider not using an actual View, but export this thing as a collection of functions. 
//starting to think it doesn't really make sense to have it be a class with a instance methods.. 
//the background will likely not change from instance to instance.

import Star from "./stellarObj"

class View {

    constructor( starSystem, canvas ) {
        this.canvas = canvas
        console.log(`this should only happen once per button click...`)
        this.ctx = canvas.getContext("2d")
        this.starSystem = starSystem
        this.hostStar = new Star(canvas, starSystem)
        this.planets = this.hostStar.planets
    } 
    //should take in data from query to instantiate new objects
    // let animation = document.querySelector(".animations")
    // animation.width = 600
    // animation.height = 450
    // let renderCtx = animation.getContext('2d')
    animate () {//update to a different method, nothing is moving yet./
        this.draw(this.ctx)
        this.hostStar.draw(this.ctx)
        this.planets.forEach ( (planet) => {
            planet.move()
            planet.draw(this.ctx)
        })
    }

    draw(ctx){
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
        ctx.fillStyle = "black"
        ctx.fillRect(0,0, this.canvas.width, this.canvas.height)
    }
   
}

export default View;