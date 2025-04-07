class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5; //no. of rays (that is emmitted from the sensor)
        this.rayLength=150; //Length of each ray
        this.raySpread=Math.PI/3; //angle of spread of all rays

        this.rays=[]; //list of all rays
        this.readings=[]; //readings of an array: points of intersection between a ray and a border/traffic car
    }

    update(roadBorders,traffic){
        this.#castRays(); //casts the rays from the car
        this.readings=[];
        for(let i=0;i<this.rays.length;i++){ //iterate between all rays
            this.readings.push(
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic
                ) //add the readings obtained by each ray from the #getReading function
            );
        }
    }

    #getReading(ray,roadBorders,traffic){
        let touches=[]; //stored points of intersection between rays and road borders/traffic cars

        //With road borders
        for(let i=0;i<roadBorders.length;i++){ //iterating across all borders
            const touch=getIntersection(
                ray[0], //start point of ray
                ray[1], //end point of ray
                roadBorders[i][0], //start point of road border
                roadBorders[i][1] // end point of road border
            );
            if(touch){
                touches.push(touch);
            }
        }

        //With nearby traffic
        for(let i=0;i<traffic.length;i++){ //iterating across all other (dummy) cars
            const poly=traffic[i].polygon; //defining a variable poly which refers to a car in traffic
            for(let j=0;j<poly.length;j++){ //iterating across all borders of the car
                const value=getIntersection(
                    ray[0], //start point of ray
                    ray[1], //end point of ray
                    poly[j], //one corner of the car
                    poly[(j+1)%poly.length] //adjacent corner of the car
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset); //offset = how far along the ray the intersection has occurred
            const minOffset=Math.min(...offsets); // minOffset = minimum of all offsets (... = spread syntax) 
            return touches.find(e=>e.offset==minOffset); //return corresponding touch object
        }
    }

    #castRays(){
        this.rays=[]; //list of all rays
        for(let i=0;i<this.rayCount;i++){ //iterating through the number of rays
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1) //divides all the rays coming from the car in equally spaced parts
            )+this.car.angle; //ensures the rays move wiht the car (as the car turns)

            const start={x:this.car.x, y:this.car.y}; //point of start for all rays
            const end={
                x:this.car.x-
                    Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-
                    Math.cos(rayAngle)*this.rayLength
            }; //point of end of all rays
            this.rays.push([start,end]); //all rays are a collection of a start point and an end point
        }
    }

    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }

            /*
            The following code ensures that a sensor that doesn't sense its surroundings (nothing intersects with the rays) is yellow in colour,
            while the portion of the ray that is in contact with the obstacle is black in colour. This easily distinguishes the following
            */
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }        
}
