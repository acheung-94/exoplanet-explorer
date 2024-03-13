import * as d3 from 'd3'

class Planet {
    constructor (planetData, hostStar){
        this.data = planetData
        this.hostStar = hostStar
        this.name = planetData["pl_name"]
        this.radius = this.scaleRadius(planetData["pl_rade"], hostStar)
        this.distance = this.newDistanceScaling(planetData["pl_orbsmax"], hostStar)
        this.angle = (Math.random() * (Math.PI*2)) // random starting angle in radians.
        this.color = this.scaleColor(planetData.pl_eqt) // planetData["pl_insol"]
        this.vel = this.newAngularVelocity(planetData["pl_orbper"],planetData["pl_orbsmax"] ) // radians per frame
        this.pos = { "x" : hostStar.pos.x + (this.distance * Math.cos(this.angle)),
                     "y" : hostStar.pos.y + (this.distance * Math.sin(this.angle))}
        this.highlighted = false;
    }

    scaleColor(temp){
        if (temp) {
            const tempScale = d3.scaleSequential([50, 1200], d3.interpolateTurbo)
            return tempScale(temp)
        }else{
            return "gray"
        }
    }

    scaleRadius(radius, hostStar) {

        if (radius > 10){
            let conversion = hostStar.radius * 0.02
            let scaled = radius * conversion
            return scaled
        }else {
            return radius
        }
    }

    scaleDistance(semiMajorAxis, hostStar) {
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

    newAngularVelocity (orbper, smax){
        if (!smax) {
            smax = 10 // unknown semimajor axes
        }

        let orbPerRange = [1, 9000]
        let velRange = [0.08, 0.0015]

        let velScale = d3.scaleLog().domain(orbPerRange).range(velRange)
        velScale.clamp(true)

        return velScale(orbper)
    }

    newDistanceScaling(smax, hostStar) {
        if (!smax) {
            console.log(this.data)
            smax = this.estimateSMAxis(hostStar, this.data)
        }
        let smaxRange = [0.02, 10]
        let px = [hostStar.radius + 10, hostStar.radius + 220]

        let distScale = d3.scaleLog().domain(smaxRange).range(px)
        distScale.clamp(true)
        return distScale(smax)
    }

    estimateSMAxis(hostStar, planet) {
        hostStar.st_mass = hostStar.st_mass || 1.6
        planet.pl_bmasse = planet.pl_bmasse || 1.0

        let m1 = hostStar.st_mass * 1.989e30
        let m2 = planet.pl_bmasse * 5.972e24
        let g = 6.67430e-11
        let t = planet.pl_orbper * 86400

        let top = (t**2)*g*(m1+m2)
        let bottom = (4* Math.PI **2)
        let meters = Math.cbrt (top / bottom)

        return meters / 1.496e11
    }

}

export default Planet;