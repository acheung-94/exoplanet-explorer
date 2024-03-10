
class Planet {
    constructor (planetData, hostStar){
        this.hostStar = hostStar
        this.name = planetData["pl_name"]
        this.radius = this.scaleRadius(planetData["pl_rade"], hostStar)
        this.distance = this.scaleDistance(planetData["pl_orbsmax"], hostStar)
        this.angle = (Math.random() * (Math.PI*2)) // random starting angle in radians.
        this.color = "pink" // planetData["pl_insol"]
        this.vel = this.angularVelocity(planetData["pl_orbper"]) // radians per frame
        this.x = hostStar.pos[0] + (this.distance * Math.cos(this.angle)) // pos updated every time draw gets called.
        this.y = hostStar.pos[1] + (this.distance * Math.sin(this.angle))
        //console.log(this.name, this.vel) // for adjustment
    }

    scaleRadius(radius, hostStar) {

        if (radius > 10){
            let conversion = hostStar.radius * 0.01
            let scaled = radius * conversion
            return scaled
        }else {
            return radius
        }
    }

    scaleDistance(semiMajorAxis, hostStar) {// if smax is null... give it a default value pls.
        semiMajorAxis ??= 10

        if (semiMajorAxis <= 5){
            console.log(semiMajorAxis)
            let adjusted = hostStar.radius + 25 + ((semiMajorAxis/10) * 50)
            console.log(adjusted)
            return adjusted
        }else if (semiMajorAxis > 5 && semiMajorAxis < 100) {
            return hostStar.radius + 50 + ((semiMajorAxis / 100) * 50)

        }else if (semiMajorAxis >= 100 && semiMajorAxis <= 500) {
            return hostStar.radius + 75 + (semiMajorAxis / 10)

        }else if (semiMajorAxis > 500){ // big distance = 150~200px rad
            return (((semiMajorAxis / 1000 )+ 0.3) * 200) // ok this is just some made up stuff here but uh... tis the best i can do right now. 
        }
    }


    angularVelocity (orbPer){
        let velocity = ((Math.PI * 2) / (orbPer * 50)) // equates to radians per frame, ie the amount the planet must move per frame.
        if (velocity < 0.01) {
            velocity = (Math.random() * (1.0 - 0.5) + 0.5) * 0.01
        }else if (velocity > 0.1) {
            velocity = (Math.random() * (1.0 - 0.5) + 0.5) * 0.1
        }
        return velocity 
    }

    draw(ctx){
         
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    move(){    
        this.angle += this.vel // add this many radians to the current angle.
        this.x = this.hostStar.pos[0] + (this.distance * Math.cos(this.angle))
        this.y = this.hostStar.pos[1] + (this.distance * Math.sin(this.angle))

    }

}

export default Planet;