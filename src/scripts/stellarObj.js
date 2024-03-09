// fixed position. center of canvas
// scaled radius based on data (st_rad)
import Planet from "./planetaryObj"

class Star {
    constructor (canvas, starSystem){
        this.pos = [canvas.width / 2, canvas.height / 2]
        this.class = this.setStellarClass(starSystem[0])
        this.radius = this.scaleRadius(starSystem[0]["st_rad"]) // given stellar radius in units of radius of the sun, scale to num pixels
        this.planets = []
        this.color = this.scaleColorByTemperature(starSystem[0]["st_teff"])
        this.addPlanets(starSystem)

    }
    setStellarClass(system){
        if (system["st_spectype"]){ // some entries have null for spectral type.
            return system["st_spectype"]
        }else{ // so i have to approximate my own.
            let kelvin = system["st_teff"]

            if (kelvin > 30000){
                return 'O'
            }else if (kelvin < 30000 && kelvin > 9700){
                return 'B'
            }else if (kelvin < 9700 && kelvin > 7200){
                return 'A'
            }else if (kelvin < 7200 && kelvin > 5700){
                return 'F'
            }else if (kelvin < 5700 && kelvin > 4900){
                return 'G'
            }else if (kelvin < 4900 && kelvin > 3400){
                return 'K'
            }else if (kelvin < 3400 && kelvin > 2100) {
                return 'M'
            }
        }
    }

    scaleColorByTemperature(kelvin){
        let r, g, b;
        if (kelvin > 11000) { // blue
            r = 222
            g = 244
            b = 255
        }else if (kelvin > 8000 && kelvin < 11000) { //white
            r = 255
            g = 255
            b = kelvin / 45
        }else if (kelvin > 5000 && kelvin < 8000) { //yellow
            r = 255
            g = kelvin / 30
            b = 0
        }else if (kelvin > 3500 && kelvin < 5000) { // orange
            r = 255
            g = kelvin / 200
            b = 0
        }else { // < 3500 k
            r = 215
            g = kelvin/100
            b = 0
        }

        return `rgb(${r}, ${g}, ${b})`
    }

    scaleRadius(radius){
        let km = radius * 695700
        let scaled = km * 0.00005
        
        if (scaled >= (this.pos[1] * 2)){
            return scaled * 0.3
        }else{
            return scaled
        }
    }
    
    addPlanets(starSystem){
        starSystem.forEach( (planetData) => {
            let planet = new Planet(planetData, this)
            this.planets.push(planet)
        })
    }


    draw(ctx){
        ctx.beginPath()
        ctx.arc(...this.pos, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.shadowColor = this.color
        ctx.shadowBlur = (Math.random() * 5)
    }

    update(){
        //this will be for updating the chart with new data...
    }
}

export default Star;