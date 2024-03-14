import * as d3 from 'd3'

class Planet {
    constructor (planetData, hostStar){
        this.data = planetData
        this.hostStar = hostStar
        this.name = planetData["pl_name"]
        this.radius = this.newRadiusScaling(planetData["pl_rade"])
        this.distance = this.newDistanceScaling(planetData["pl_orbsmax"], hostStar)
        this.angle = (Math.random() * (Math.PI*2))
        this.color = this.scaleColor(planetData.pl_eqt)
        this.vel = this.newAngularVelocity(planetData["pl_orbper"],planetData["pl_orbsmax"] ) // radians per frame
        this.pos = { "x" : hostStar.pos.x + (this.distance * Math.cos(this.angle)),
                     "y" : hostStar.pos.y + (this.distance * Math.sin(this.angle))}
        this.highlighted = false;
        this.selected = false
    }

    scaleColor(temp){
        if (temp) {
            const tempScale = d3.scaleSequential([50, 1200], d3.interpolateTurbo)
            return tempScale(temp)
        }else{
            return "#666666"
        }
    }


    draw(ctx){
        let g;
        let vecX = this.pos.x + ((this.radius * 0.5)*(Math.cos(this.angle - Math.PI)))
        let vecY = this.pos.y + ((this.radius * 0.5)*(Math.sin(this.angle - Math.PI)))
        
        if (this.color === "#666666"){
            g = ctx.createRadialGradient(
                vecX, vecY, (this.radius/10), 
                this.pos.x, this.pos.y, this.radius)
            g.addColorStop(0, "white")
            g.addColorStop(1, "#666666")
        }else{
            let o = this.color.slice(0, 3) + `a` + this.color.slice(3, this.color.length - 1) + `, 0.8)`
            g = ctx.createRadialGradient(
                vecX, vecY, (this.radius/10),
                this.pos.x, this.pos.y, this.radius)
            g.addColorStop(0, this.color)
            g.addColorStop(1, o)
        }

        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill() 
        
        
        if (this.highlighted || this.selected){
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
        this.angle += this.vel 
        this.pos.x = this.hostStar.pos.x + (this.distance * Math.cos(this.angle))
        this.pos.y = this.hostStar.pos.y + (this.distance * Math.sin(this.angle))

    }

    newAngularVelocity (orbper, smax){
        if (!smax) {
            smax = this.estimateSMAxis(this.hostStar, this.data)
        }

        let orbPerRange = [1, 9000]
        let velRange = [0.08, 0.0015]

        let velScale = d3.scaleLog().domain(orbPerRange).range(velRange)
        velScale.clamp(true)

        return velScale(orbper)
    }

    newDistanceScaling(smax, hostStar) {
        if (!smax) {
            smax = this.estimateSMAxis(hostStar, this.data)
        }
        let smaxRange = [0.02, 10]
        let px = [hostStar.radius + 20, hostStar.radius + 220]

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

    newRadiusScaling(radius){
        let pxRange = [5,25]
        let radRange = [0.3, 20]

        let radScale = d3.scaleLinear().domain(radRange).range(pxRange)
        radScale.clamp(true)
        return radScale(radius)
    }

}

export default Planet;