const carCanvas=document.getElementById("carCanvas"); //carCanvas object
carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas"); //networkCanvas object
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d"); //car context ---> drawing space + tools
const networkCtx = networkCanvas.getContext("2d"); // network context
const road=new Road(carCanvas.width/2,carCanvas.width*0.9); //road object
const cars = generateCars(1000); //all initially superimposed cars

let bestCar = cars[0]; //obtain the best car out of all superimposed cars
if(localStorage.getItem("bestBrain")){ //checks if local storage contains bestBrain item
    for(let i = 0; i < cars.length; i++) { //loop through all superimposed cars
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")); 
        /*
        takes the saved "bestBrain" from localStorage, 
        parses the JSON string into a JavaScript object, 
        and assigns it as the neural brain of each car
        */
        //every car uses the previously saved best-performing brain

        if(i!=0) {
            NeuralNetwork.mutate(cars[i].brain, 0);
        }
        //if i != 0, cars are subject to mutation by amount = 0
    } 
}

//Preparing dummy cars to serve as traffic
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2)
];

animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    )
} 
/*
Saves the current best-performing car's neural network 
(bestCar.brain) to the browser's localStorage under the key bestBrain
*/

function discard() {
    localStorage.removeItem("bestBrain");
} //Deletes the "bestBrain" entry from localStorage

//generates cars ---> used later in traffic generation
function generateCars(N) {
    const cars = []
    for(let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars;
}

//cars and network visualization animation
function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    
    for(let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders,traffic);
    }

    const bestCar = cars.find(
        c=>c.y == Math.min(...cars.map(c=>c.y))
    ); //obtains bestCar by finding car with minimum y value

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y + carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha = 0.2;

    for(let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,"blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset=time/50;
    Visualizer.drawNetwork(networkCtx, cars[0].brain);
    requestAnimationFrame(animate);
}
