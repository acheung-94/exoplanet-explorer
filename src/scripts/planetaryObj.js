
class Planet {
    constructor (planetData){
        this.name = planetData["pl_name"]
        this.rad = planetData["pl_rade"]
        this.pos = []
        this.color = "pink" // planetData["pl_insol"]
        this.speed = planetData["pl_orbper"]
    }

    scaleRadius(radius) {


    }


}

export default Planet;