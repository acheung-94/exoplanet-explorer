
class Planet {
    constructor (planetData, hostStar){
        this.name = planetData["pl_name"]
        this.radius = this.scaleRadius(planetData["pl_rade"])
        this.distance = this.scaleDistance(planetData["pl_orbsmax"], hostStar)
        this.angle = (Math.random() * (Math.PI*2)) // random starting angle in radians.
        this.color = "pink" // planetData["pl_insol"]
        this.angSpeed = this.angularVelocity(planetData["pl_orbper"]) // radians per frame
        this.x = this.distance * Math.cos(this.angle) // pos updated every time draw gets called.
        this.y = this.distance * Math.sin(this.angle)
    }

    scaleRadius(radius) {
        let km = radius * 6360
        let scaled = km * 0.00047
        return scaled
    }

    scaleDistance(semiMajorAxis, hostStar) {

        if (semiMajorAxis <= 5){
            return hostStar.radius + ((semiMajorAxis/10) * 25)
        }else if (semiMajorAxis > 5 && semiMajorAxis < 100) {
            return hostStar.radius + ((semiMajorAxis / 100) * 50)
        }else if (semiMajorAxis >= 100 && semiMajorAxis <= 500) {
            return hostStar.radius + 50 + (semiMajorAxis / 10)
        }else if (semiMajorAxis > 500){ // big distance = 150~200px rad
            return (((semiMajorAxis / 1000 )+ 0.3) * 200) // ok this is just some made up stuff here but uh... tis the best i can do right now. 
        }
    }


    angularVelocity (orbPer){
        let velocity = ((Math.PI * 2) / (orbPer * 50)) // equates to radians per frame, ie the amount the planet must move per frame.
        return velocity
    }

    draw(ctx){

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

    }

    move(ctx){
        
    }

}

export default Planet;