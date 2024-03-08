//import stellar card, planetary card, and planet/star classes.
//responsible for taking in stellar system data, creating star and planets, and animating. 
//consider not using an actual View, but export this thing as a collection of functions. 
//starting to think it doesn't really make sense to have it be a class with a instance methods.. 
//the background will likely not change from instance to instance.

class View {
    //should take in data from query to instantiate new objects
    constructor(canvas){
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.dimensions = {"height": canvas.height, "width": canvas.width}
    }

    draw(ctx){
        //draw canvas
        ctx.fillStyle = "black"
        console.log(ctx.width)
        ctx.fillRect(0 ,0, this.dimensions["width"], this.dimensions["height"])
        //draw objects
    }
    //animate loop?
}

export default View;