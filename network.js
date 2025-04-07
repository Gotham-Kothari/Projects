//Defining a Neural Network class, which is practically a collection of layers/levels of neurons
class NeuralNetwork {
    /*
    The following constructor function connects every layer to each other forming: input layer --> hidden layer --> output layer
    */
    constructor(neuronCounts) {//neuronCounts = array which consists of [no of neurons in input level, hidden level, output level]
        this.levels = [];
        for(let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1]
            ))
        }
    }

    //Forward propagation
    static feedForward(givenInputs, network) {
        //apply forward propagation on the first layer/level
        let outputs = Level.feedForward(
            givenInputs, 
            network.levels[0]
        );

        //Update the outputs by applying forward propagation on every remaining layer/level
        for(let i = 1; i < network.levels.length; i++ ){
            outputs = Level.feedForward(
                outputs, 
                network.levels[i]);
        }
        return outputs;
    }

    static mutate(network, amount = 1){  
        network.levels.forEach(level => {
            for(let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2 - 1,
                    amount
                );
            }

            for(let i = 0; i < level.weights.length; i++) {
                for(let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2 - 1,
                        amount
                    );
                }
            }
        });
    }
}

/* 
Level class: simulates a fullt connected layer in a neural network
1. Each input is connected to every output
2. Each output has a bias
3. We apply the logic for forward propagation

Following computation is performed on a neural network
z = w.x + b
z = w1.x1 + w2.x2 + ..... + b

Applying the above in an activation function (ReLu, Sigmoid, Tanh)
a = f(z) = f(w.x + b)
*/
class Level {
    constructor(inputCount, outputCount) {
        //inputCount = number of inputs
        //outputCount = number of outputs
        this.inputs = new Array(inputCount); //Input neurons
        this.outputs = new Array(outputCount); //Output neurons
        this.biases = new Array(outputCount); //Initializes biases (thresholds for activation) for each output neuron

        this.weights = []; //2D array which will hold weights from each input to each output neuron
        for(let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount); //Initialising empty array of the same size as the number of outputs
        }

        Level.#randomize(this);
    }

    static #randomize(level) {
        //For each input-output pair, assigns a random weight between -1 and 1
        for(let i = 0; i < level.inputs.length; i++) {
            for(let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random()*2 - 1 // belongs to the range [-1, 1]
            }
        }

        //Assigns a random bias to each output neuron, between -1 and 1
        for(let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random()*2 - 1; //again, belongs to the range [-1, 1]
        }
    }

    //Performs forward propagation: calculates output values from given inputs using weights and biases
    static feedForward(givenInputs, level) {
        for(let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        } //Stores the given input values into the layer's input neurons

        //Computing the weighted sum of all input values
        for(let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for(let j =0; j < level.inputs.length; j++) {
                sum += level.inputs[j]*level.weights[j][i] //weights[j][i] = weight between the jth input and the ith output
            }

            /*
            Implementing a simple threshold activation function: step function
            If weighted sum > bias: turn output neuron ON
            else: turn output neuron off
            */
            if(sum > level.biases[i]) {
                level.outputs[i] = 1; //Turn output neuron 'ON'
            } else {
                level.outputs[i] = 0; //Turn output neuron 'OFF'
            }
        }

        //Returns the output neurons' values valvulated
        return level.outputs;
    }
}
