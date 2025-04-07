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
        this.controls=new Controls(controlType); //apply keyboard controls to the car (also depends on the control type)
    }

    update(roadBorders,traffic){
        //if car is not damaged
        if(!this.damaged){
            this.#move(); //instructs car to move in appropriate direction
            this.polygon=this.#createPolygon(); //creates car's structure
            this.damaged=this.#assessDamage(roadBorders,traffic); //assesses damage caused by crash
        }

        //if the sensor exists
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

            if(this.useBrain) { //If we are using AI
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }   
        }
    }

    //Check damage causes either due to traffic or road borders
    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){ //checks if the car collides with the road
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){ //checks if the car collides with another (dummy car)
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[]; //a polygon here has been defined as a collection points connected by lines
        const rad=Math.hypot(this.width,this.height)/2; //radius of the car (dist b/w car's centre and a corner; a car is a rectangle)
        const alpha=Math.atan2(this.width,this.height); //alpha = angle between radius 'rad' and the width

        //Top-right corner
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });

        //Top-left corner
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });

        //Bottom-left corner
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });

        //Bottom-right corner
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration; //increase speed in forward direction
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration; //increase speed in -ve direction
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed; //create a barrier speed (+ve direction)
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2; //create a barrier speed (-ve direction)
        }

        if(this.speed>0){
            this.speed-=this.friction; //stop the car by deceleration (when moving forward)
        }
        if(this.speed<0){
            this.speed+=this.friction; //stop the car (when moving backward)
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0; //when speed is minimal, reduce it 0 instantly
        }

        //To allow car to steer, depending on forward/reverse movement
        if(this.speed!=0)
            const flip=this.speed>0?1:-1; //define flip; if speed > 0, flip = 1; else, flip = 1
            if(this.controls.left){ //when pressing left key
                /*
                moves counter-clockwise while moving forward
                moves car clockwise while moving backward
                */
                this.angle+=0.03*flip;
            }
            if(this.controls.right){ //when pressing right key
                /*
                moves clockwise while moving forward
                moves counter-clockwise moving backward
                */
                this.angle-=0.03*flip;
            }
        }

        //Car rotates and moves in the angle
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,color, drawSensor = false){
        if(this.damaged){
            ctx.fillStyle="gray"; //color the car gray if the car gets damaged
        }else{
            ctx.fillStyle=color; //set the car to a different color, otherwise
        }
        ctx.beginPath();
        //Draw the car by drawing borders between every adjacent point, and filling the formed polygon
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
