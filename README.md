# Self-Driving Car Simulation (No Libraries)

A simulation of a self-driving car using JavaScript with zero external libraries. It features real-time training, neural networks, sensors, AI vs. dummy traffic, and a visual representation of the car's "brain".

## Features

- AI-controlled car using a neural network
- Real-time training and visualization
- Dynamic sensor system for obstacle detection
- Simulated road with traffic
- Option to save and discard the best-performing model
- Neural network visualizer
- Fully written in vanilla JavaScript (no external libraries)

## File Structure

| File           | Description                                                           |
|----------------|-----------------------------------------------------------------------|
| `index.html`   | Main HTML structure; initializes canvases and UI                      |
| `style.css`    | Styling for layout, canvases, and buttons                             |
| `main.js`      | Entry point: initializes cars, road, training loop                    |
| `car.js`       | Car class: handles physics, AI behavior, and rendering                |
| `controls.js`  | Keyboard input and dummy logic for car movement                       |
| `sensor.js`    | Simulates car sensors (rays) for detecting obstacles                  |
| `road.js`      | Creates road and lanes with infinite scrolling logic                  |
| `network.js`   | Contains the neural network logic and mutation                        |
| `visualizer.js`| Draws the neural network as it evolves                                |
| `utils.js`     | Helper functions (e.g., linear interpolation, intersection detection) |

## Neural Network Architecture

- Input Layer: Number of sensor rays
- Hidden Layer: 6 neurons
- Output Layer: 4 neurons (Forward, Reverse, Left, Right)

Weights and biases are randomized initially and evolve through simulation.

## Running the Project

Simply open `index.html` in your browser. No dependencies or build tools needed.

### Controls

- Arrow Keys: Control the car manually (when control type is set to `"KEYS"`)
- AI Cars: Controlled via neural network (`"AI"`)

### Buttons

- 💾 Save the best-performing brain to `localStorage`
- 🧺 Discard saved brain and retrain from scratch

## How It Works

1. **Car Physics**: Simulates acceleration, friction, turning, and collision.
2. **Sensors**: Rays detect the environment and feed data into the neural network.
3. **Neural Network**: Decides movements based on sensor inputs.
4. **Mutation**: Best-performing brain is used as a base for the next generation.
5. **Visualizer**: Displays the structure and behavior of the neural network in real-time.


## Credits
Inspired by educational videos and projects on neural networks and simulations. All logic is implemented from scratch, as guided by the instructor.
