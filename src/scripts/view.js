
import Star from "./star"

class View {

    constructor( starSystem, canvas ) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.starSystem = starSystem
        this.hostStar = new Star(canvas, starSystem)
        this.planets = this.hostStar.planets
    } 

    animate (animating) {
        this.draw(this.ctx)
        this.hostStar.draw(this.ctx)
        this.planets.forEach ( (planet) => {
            if(animating){
                planet.move()
            }
            planet.draw(this.ctx)
        })
    }

    draw(ctx){
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
        
        let g = ctx.createRadialGradient (
            this.hostStar.pos.x, this.hostStar.pos.y, (this.hostStar.radius / 10),
            this.hostStar.pos.x, this.hostStar.pos.y, (this.hostStar.radius + 20)
            )
        g.addColorStop (0, this.hostStar.color)
        g.addColorStop(1, "black")
        ctx.fillStyle = g
        ctx.fillRect(0,0, this.canvas.width, this.canvas.height)
    }
   
}

export default View;