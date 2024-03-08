// fixed position. center of canvas
// scaled radius based on data (st_rad)


class StellarObject {
    constructor (view, starSystem){
        this.pos = [view.dimensions["width"] / 2, view.dimensions["height"] / 2]
        this.radius = this.scaleRadius(starSystem[0]["st_rad"]) // given stellar radius in units of radius of the sun, scale to num pixels
        this.planets = []
        this.color = "white"
    }
    
    scaleRadius(radius){
        let km = radius * 695700
        let scaled = km * 0.00005
        return scaled
    }

    draw(ctx){
        //ctx.clearRect(0,0, this.pos[0]*2, this.pos[1]*2)
        ctx.beginPath()
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

    }
}

export default StellarObject;