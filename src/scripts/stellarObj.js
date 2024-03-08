// fixed position. center of canvas
// scaled radius based on data (st_rad)
import Planet from "./planetaryObj"

class Star {
    constructor (canvas, starSystem){
        console.log(starSystem)
        console.log(canvas)
        this.pos = [canvas.width / 2, canvas.height / 2]
        this.radius = this.scaleRadius(starSystem[0]["st_rad"]) // given stellar radius in units of radius of the sun, scale to num pixels
        this.planets = []
        this.color = "blue"
        this.addPlanets(starSystem)
    }
    
    scaleRadius(radius){
        let km = radius * 695700
        let scaled = km * 0.00005
        return scaled
    }
    
    addPlanets(starSystem){
        starSystem.forEach( (planetData) => {
            let planet = new Planet(planetData, this)
            this.planets.push(planet)
        })
    }


    draw(ctx){
        //ctx.clearRect(0,0, this.pos[0]*2, this.pos[1]*2)
        ctx.beginPath()
        ctx.arc(...this.pos, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

export default Star;