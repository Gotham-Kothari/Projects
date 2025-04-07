class Road{
    constructor(x,width,laneCount=3){
        this.x=x; //the central axis (x-coordinate) of the road
        this.width=width; //width of the road
        this.laneCount=laneCount; //number of lanes

        this.left=x-width/2; //left border of the road
        this.right=x+width/2; //right border of the road

        const infinity=1000000;
        this.top=-infinity; //top limit of the road
        this.bottom=infinity; //bottom limit of the road

        const topLeft={x:this.left,y:this.top}; //top-left border
        const topRight={x:this.right,y:this.top}; //top-right border
        const bottomLeft={x:this.left,y:this.bottom}; //bottom-left border
        const bottomRight={x:this.right,y:this.bottom}; //bottom-right border
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }

    getLaneCenter(laneIndex){ //obtains the center of a lane given its index
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";
        for(let i=1;i<=this.laneCount-1;i++){ //obtains the lane borders
            /*
            eg: x = lerp(this.left, thid.right, i/this.laneCount) = (this.left + (this.right - this.left)*i/this.laneCount)
            when i = 1, and suppose laneCount = 3
            x = L + (R - L)*1/3
            which means the first lane border/divider is 1/3rd of the width
            */
            const x=lerp(
                this.left,
                this.right,
                i/this.laneCount
            );

            //Draw the dashed line
            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]); //Remove dashed lines

        //Draws the road borders
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
            /*
            Starts from top left and moves to bottom left (x and y)
            Starts from top right and then moves to bottom right (x and y)
            */
        });
    }
}
