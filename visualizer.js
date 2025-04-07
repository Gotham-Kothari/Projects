class Visualizer {
    static drawNetwork(ctx,network) {
        const margin = 50; //creates a 50 px margin on all sides
        //Defining the actual drawing area
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin*2;
        const height = ctx.canvas.height - margin*2;

        const levelHeight = height/network.levels.length;
        for(let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top + lerp(
                height - levelHeight,
                0,
                network.levels.length == 0 ? 0.5 : i/(network.levels.length - 1)
            );

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, 
                i == network.levels.length - 1? ['🠉','🠈','🠊','🠋']: [])
        }
    }
    
    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        //More helper variables
        const right = left + width;
        const bottom = top + height;

        const {inputs, outputs, weights, biases} = level; //improves readability, works same as level.inputs.length
        //Drawing input neurons
        const nodeRadius = 18;

        //Drawing lines between each input and output node
        for(let i = 0; i < inputs.length; i++) {
            for(let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right), bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right), top
                );

                //Stylizing the connections
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]); //weight of each connection
                ctx.stroke();
            }
        }

        for(let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right); //x-coordinate
            //If there is only node, it is centered (0.5). Otherwise, they're all spaced out
            
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI*2)
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius*0.6, 0, Math.PI*2)
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        for(let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right); //x-coordinate
            //If there is only node, it is centered (0.5). Otherwise, they're all spaced out
            
            //If there
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI*2)
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius*0.6, 0, Math.PI*2)
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius*0.8, 0, Math.PI*2);
            ctx.strokeStyle = getRGBA(biases[i])
            ctx.setLineDash([3,3])
            ctx.stroke();
            ctx.setLineDash([]);

            // if(outputLabels[i]) {
            //     ctx.begin();
            //     ctx.textAlign = "center";
            //     ctx.fillStyle = "black";
            //     ctx.strokeStyle = "white";
            //     ctx.font = (nodeRadius*1.5) + "px Arial";
            //     ctx.filltext(outputLabels[i], x, top);
            //     ctx.lineWidth = 0.5;
            //     ctx.strokeText(outputLabels[i], x, top);
            // }
        }
    }

    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left, 
            right,
            nodes.length == 1?0.5:index/(nodes.length - 1)
        );
    }
}