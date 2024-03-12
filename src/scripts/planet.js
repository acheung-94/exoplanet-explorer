import * as d3 from 'd3'

class Planet {
    constructor (planetData, hostStar){
        this.hostStar = hostStar
        this.name = planetData["pl_name"]
        this.radius = this.scaleRadius(planetData["pl_rade"], hostStar)
        this.distance = this.scaleDistance(planetData["pl_orbsmax"], hostStar)
        this.angle = (Math.random() * (Math.PI*2)) // random starting angle in radians.
        this.color = this.scaleColor(planetData.pl_eqt) // planetData["pl_insol"]
        this.vel = this.angularVelocity(planetData["pl_orbper"]) // radians per frame
        this.pos = { "x" : hostStar.pos.x + (this.distance * Math.cos(this.angle)),
                     "y" : hostStar.pos.y + (this.distance * Math.sin(this.angle))}
        this.highlighted = false;
        //console.log(this.name, this.vel) // for adjustment
    }

    scaleColor(temp){
        if (temp) {
            const tempScale = d3.scaleSequential([50, 1200], d3.interpolateTurbo)
            console.log(tempScale(temp))
            return tempScale(temp)
        }else{
            return "gray"
        }
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
        if (!semiMajorAxis || semiMajorAxis < 1.0){
            return hostStar.radius + (Math.random() * (40-10) + 10)
        }

        if (semiMajorAxis >= 1.0 && semiMajorAxis < 2.0) {
            return hostStar.radius + ((semiMajorAxis / 2) * 30) + 40
        }else if (semiMajorAxis >= 2.0 && semiMajorAxis < 3.0) {
            return hostStar.radius + ((semiMajorAxis / 3) * 30) + 80
        }else if (semiMajorAxis >= 3.0 && semiMajorAxis < 4.0) {
            return hostStar.radius + ((semiMajorAxis / 4) * 30) + 120
        }else if (semiMajorAxis >= 4.0 && semiMajorAxis < 5.0) {
            return hostStar.radius + ((semiMajorAxis / 5) * 30) + 160
        }else{
            return hostStar.radius + (Math.random() * (225-200) + 200)
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
        let g;
        let vecX = this.pos.x + ((this.radius * 0.5)*(Math.cos(this.angle - Math.PI)))
        let vecY = this.pos.y + ((this.radius * 0.5)*(Math.sin(this.angle - Math.PI)))
        //let o = this.hostStar.color.slice(0, 3) + `a` + this.hostStar.color.slice(3, this.hostStar.color.length - 1) + `, 0.2)`
   
        if (this.color === "gray"){
            g = ctx.createRadialGradient(
                vecX, vecY, (this.radius/10), //starting circle in a vector pointing towards host star.
                this.pos.x, this.pos.y, this.radius)
            g.addColorStop(0, "white")
            g.addColorStop(1, "gray")
        }else{
            let o = this.color.slice(0, 3) + `a` + this.color.slice(3, this.color.length - 1) + `, 0.8)`
            g = ctx.createRadialGradient(
                vecX, vecY, (this.radius/10), //starting circle
                this.pos.x, this.pos.y, this.radius)
            g.addColorStop(0, this.color)
            g.addColorStop(1, o)
        }

        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill() 
        
        
        if (this.highlighted){
            let radConversion = Math.PI / 180
            let degStart = 10
            let degEnd = 80
            for(let i = 0; i < 4; i++){
                ctx.beginPath()
                ctx.arc(this.pos.x, this.pos.y, this.radius + 10, degStart*radConversion, degEnd*radConversion)
                ctx.lineWidth = 2
                ctx.strokeStyle = "white"
                ctx.stroke()  

                degStart += 90
                degEnd += 90
            }

        } 

    }

    move(){    
        this.angle += this.vel // add this many radians to the current angle.
        this.pos.x = this.hostStar.pos.x + (this.distance * Math.cos(this.angle))
        this.pos.y = this.hostStar.pos.y + (this.distance * Math.sin(this.angle))

    }

}

export default Planet;