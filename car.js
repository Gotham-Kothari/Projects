class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3){
        this.x=x; //x-coordinate of the center of the car
        this.y=y; //y-coordinate of the center of the car
        this.width=width; //width of the car
        this.height=height; //length of the car

        this.speed=0; //initial speed of the car (default), when no button is pressed
        this.acceleration=0.2; //acceleration of the car
        this.maxSpeed=maxSpeed; //maximum speed of the car
        this.friction=0.05; //friction experienced by the car
        this.angle=0; //angle with the vertical initially (default; for turning cars)
        this.damaged=false; //check if the car is damaged

        this.useBrain = controlType == "AI" //implement Neural Network if we use AI to control the car

        if(controlType !="DUMMY"){ //If car is not a dummy car (dummy car = used to simulate traffic)
            this.sensor=new Sensor(this); //implement sensors to a car
            //implement a neural network to the brain of the car
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4] //[number of input neurons, number of neurons in hidden layer, number of output]
                //4 ---> 1 for forward, 1 for backward, 1 for left and 1 for right
            );
        }
        this.controls=new Controls(controlType);
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets = this.sensor.readings.map(
                s=>s==null?0:1 - s.offset
            );
            /* Above two lines:
            sensor.readings : array of intersection points
            s.offset = value between 0 to 1 (0 = near-by, 1 = far-away)
            1 - s.offset causes values to be reversed (0 = far-away, 1 = close-by)
            */
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            // feedings offsets as givenInputs in forward propagation operation in the NeuralNetwork this.brain

            if(this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }   
        }
    }

    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,color, drawSensor = false){
        if(this.damaged){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}
