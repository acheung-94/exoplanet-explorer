
import Star from "./star"

class View {

    constructor( starSystem, canvas ) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.starSystem = starSystem
        this.hostStar = new Star(canvas, starSystem)
        this.planets = this.hostStar.planets
    } 

    animate () {
        this.draw(this.ctx)
        this.hostStar.draw(this.ctx)
        this.planets.forEach ( (planet) => {
            planet.move()
            //todo add a conditional during elliptical orbit phase - if distance between planet and host star center is < host star radius, do not draw.
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