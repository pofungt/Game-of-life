const unitLengthObj = {
    big: 20,
    small: 10
};
let square_size = "big";
let unitLength  = unitLengthObj[square_size];
const boxColor = '#312E16';
const boxColor_blue = '#3D5B99';
const emptyboxColor = '#997B3D';
const strokeColor = 50;
const slide_speed = {
    big: [5, 15, 30],
    small: [1, 5, 10]
};
let fr = slide_speed[square_size][1];
let b = [3, NaN];
let s = [2, 3];
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let mono = true;
let turn = "brown";
let mouse_drawn = false;
let custom_on = false;
let shapes_list_HTML = [];
const shapes = {
    Ship: [
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
    ],
    Glider: [
        [1, 1, 1],
        [1, 0, 0],
        [0, 1, 0]
    ],
    Spaceship: [
        [0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
    ],
    Toad: [
        [0, 0, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 0, 0]
    ]
}

function setup() {
	/* Set the canvas to be under the element #canvas*/
	const canvas = createCanvas(windowWidth - 20, windowHeight - 200);
	canvas.parent(document.querySelector('#canvas'));

	/*Calculate the number of columns and rows */
	columns = floor(width  / unitLength);
	rows    = floor(height / unitLength);
	
	/*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
	currentBoard = [];
	nextBoard = [];
	for (let i = 0; i < columns; i++) {
		currentBoard[i] = [];
		nextBoard[i] = []
    }
	// Now both currentBoard and nextBoard are array of array of undefined values.
	init();  // Set the initial values of the currentBoard and nextBoard
}

function init() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			currentBoard[i][j] = 0;
			nextBoard[i][j] = 0;
		}
	}
}

function init_random() {
    if (mono) {
        init_random_mono();
    } else {
        init_random_color();
    }
}

function init_random_mono() {
    for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = random() > 0.8 ? 1 : 0;
            nextBoard[i][j] = 0;
		}
	}
}

function init_random_color() {
    for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = random() > 0.8 ? (random() > 0.5 ? "brown" : "blue") : 0;
            nextBoard[i][j] = 0;
		}
	}
}

function draw() {
    background(emptyboxColor);
    frameRate(fr);

    if (mono) {
        generate_mono();
        draw_mono();
    } else {
        generate_color();
        draw_color();
    }
}

function draw_mono() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1){
                fill(red(boxColor), green(boxColor), blue(boxColor));  
            } else {
                fill(red(emptyboxColor), green(emptyboxColor), blue(emptyboxColor));
            } 
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}

function draw_color() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == "brown"){
                fill(red(boxColor), green(boxColor), blue(boxColor));  
            } else if (currentBoard[i][j] == "blue") {
                fill(red(boxColor_blue), green(boxColor_blue), blue(boxColor_blue));
            } else {
                fill(red(emptyboxColor), green(emptyboxColor), blue(emptyboxColor));
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}

function generate_mono() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if( i == 0 && j == 0 ){
	                    // the cell itself is not its own neighbor
	                    continue;
	                }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && !s.includes(neighbors)) {
                // Die case
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && b.includes(neighbors)) {
                // Reproduction case
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function generate_color() {
        //Loop over every single box on the board
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                // Count all living members in the Moore neighborhood(8 boxes surrounding)
                let neighbors = {
                    brown: 0,
                    blue: 0
                };
                for (let i of [-1, 0, 1]) {
                    for (let j of [-1, 0, 1]) {
                        if( i == 0 && j == 0 ){
                            // the cell itself is not its own neighbor
                            continue;
                        }
                        // The modulo operator is crucial for wrapping on the edge
                        let neighbor_color = currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                        if (neighbor_color !== 0) {
                            neighbors[neighbor_color]++;
                        }
                    }
                }
                
                // Calculate number of neighbors irrespective of colors
                const neighbors_values = Object.values(neighbors);
                const num_of_neighbors = neighbors_values.reduce((acc, value) => {
                    return acc + value;
                }, 0);

                // Rules of Life
                if (currentBoard[x][y] !== 0) {
                    if (!s.includes(num_of_neighbors)) {
                        // Die case
                        nextBoard[x][y] = 0;
                    } else {
                        // Continue to live case
                        if (neighbors["brown"] > neighbors["blue"]) {
                            nextBoard[x][y] = "brown";
                        } else if (neighbors["blue"] > neighbors["brown"]) {
                            nextBoard[x][y] = "blue";
                        } else {
                            nextBoard[x][y] = currentBoard[x][y];
                        }
                    }
                } else {
                    if (b.includes(num_of_neighbors)) {
                        // Reproduction case
                        if (neighbors["brown"] > neighbors["blue"]) {
                            nextBoard[x][y] = "brown";
                        } else if (neighbors["blue"] > neighbors["brown"]) {
                            nextBoard[x][y] = "blue";
                        } else {
                            nextBoard[x][y] = random() > 0.5 ? "brown" : "blue";
                        }
                    } else {
                        // Continue as dead case
                        nextBoard[x][y] = currentBoard[x][y] // Which is 0
                    }
                }
            }
        }
    
        // Swap the nextBoard to be the current Board
        [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

 function mouseDragged() {
    if (draw_bool && !custom_on) {
        if (mono) {
            mouse_draw_mono();
        } else {
            mouse_draw_color();
        }
        mouse_drawn = true;
    }
}

function mousePressed() {
    if (draw_bool && !custom_on) {
        if (mono) {
            mouse_draw_mono();
        } else {
            mouse_draw_color();
        }
        mouse_drawn = true;
    }
}

function mouse_draw_mono() {
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

function mouse_draw_color() {
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = turn;
    const mouse_color = turn === "brown" ? boxColor : boxColor_blue;
    fill(mouse_color);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

function add_icon() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }

    if (!draw_bool && !custom_on) {
        if (mono) {
            add_icon_mono();
        } else {
            add_icon_color();
        }
        restart();
    }

}

function add_icon_mono() {
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    for (let i = 0; i < shapes[shape].length; i++) {
        for (let j = 0; j < shapes[shape][i].length; j++) {
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows] = shapes[shape][i][j];
        }
    }
}

function add_icon_color() {
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    for (let i = 0; i < shapes[shape].length; i++) {
        for (let j = 0; j < shapes[shape][i].length; j++) {
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows] = 
                shapes[shape][i][j] === 1 ? turn : 0;
        }
    }
    turn = turn === "brown" ? "blue" : "brown";
}

function pause() {
    if (isLooping()) {
        document.querySelector('#play_pause img').src = next_button_pic[1];
        noLoop();
    }
}

function restart() {
    if (!isLooping()) {
        document.querySelector('#play_pause img').src = next_button_pic[0];
        draw_pen.removeAttribute('style');
        draw_bool = false;
        if (mouse_drawn) {
            turn = turn === "brown" ? "blue" : "brown";
            mouse_drawn = false;
        }
        loop();
    }    
}

window.onresize = function(){ location.reload(); };

document.querySelector('#reset-game')
	.addEventListener('click', () => {
		init();
        restart();
	});

document.querySelector('#reset-game-random')
    .addEventListener('click', () => {
        init_random();
        restart();
    });

// Add list items to add_icon bar
for (list_name in shapes) {
    shapes_list_HTML.push(`<li><a id="${list_name}" class="dropdown-item" href="#">${list_name}</a></li>`);
}
shapes_list_HTML.push(`<li><a id="custom_list_item" class="dropdown-item" data-bs-toggle="modal"        
                        data-bs-target="#staticBackdrop" href="#">Custom</a></li>`);
document.querySelector('#add_block .dropdown-menu').innerHTML
    = shapes_list_HTML.join("");

let shape;
let add_icon_counter = 0;
const add_shapes = document.querySelectorAll('#add_block .dropdown-item');
for (let add_shape of add_shapes) {
    add_shape.addEventListener('click', () => {
        if (add_shape.getAttribute('id') !== 'custom_list_item') {
            if (add_icon_counter > 0) {
                window.removeEventListener('click', add_icon);
            }
            document.querySelector('#add_icons')
            .innerHTML = add_shape.innerHTML;
            shape = add_shape.id;
            setTimeout(() => {
                window.addEventListener('click', add_icon);
            }, 10);
            add_icon_counter++;    
        }
    });
};

const reset_icon = document.querySelector('#reset_button');
reset_icon.addEventListener('click', () => {
    document.querySelector('#add_icons')
        .innerHTML = "Add";
    shape = null;
    add_icon_counter = 0;
    window.removeEventListener('click', add_icon);
});

const slide_speed_output = ['LOW', 'MED', 'HIGH'];
const slide = document.querySelector('#framerate_slider');
slide.addEventListener('change', () => {
    fr = slide_speed[square_size][parseInt(slide.value)];
    document.querySelector('#framerate_output').innerHTML = slide_speed_output[parseInt(slide.value)];
});

const next_button_pic = ["./asset/pause-button.png", "./asset/play-button.png"];
const play_pause = document.querySelector('#play_pause');
play_pause.addEventListener('click', () => {
    if (isLooping()) {
        pause();
    } else {
        restart();
    }
});

const size_checkbox = document.querySelector("#size_block #flexSwitchCheckChecked");
size_checkbox.addEventListener('change', () => {
  if (size_checkbox.checked) {
    square_size = "big";
    unitLength  = unitLengthObj[square_size];
    document.querySelector('#size_block label').innerHTML = "Big";
    setup();
    restart();
  } else {
    square_size = "small";
    unitLength  = unitLengthObj[square_size];
    document.querySelector('#size_block label').innerHTML = "Small";
    setup();
    restart();
    }
});

// When draw is clicked, either to enable or disable drawing
let draw_bool = false;
const draw_pen = document.querySelector('#draw_pen');
draw_pen.addEventListener('click', () => {
    if (!draw_bool) {
        draw_pen.style.background = "radial-gradient(#382D17, #9e7f3f)";
        pause();
        draw_bool = true;
    } else {
        restart();
    }
});

// When new rules are submitted
const B0 = document.querySelector('#B0');
const B1 = document.querySelector('#B1');
const S0 = document.querySelector('#S0');
const S1 = document.querySelector('#S1');
const rules_submit = document.querySelector('#submit-rules');
rules_submit.addEventListener('click', () => {
    b = [parseInt(B0.value), parseInt(B1.value)];
    s = [parseInt(S0.value), parseInt(S1.value)];
});

// When rules reset button is clicked
const rules_reset = document.querySelector('#reset-rules');
rules_reset.addEventListener('click', () => {
    b = [3, NaN];
    s = [2, 3];
    B0.value = '3';
    B1.value = '';   
    S0.value = '2';
    S1.value = '3';  
});

const color_checkbox = document.querySelector("#color_block #color_flexSwitchCheckChecked");
color_checkbox.addEventListener('change', () => {
  if (color_checkbox.checked) {
    mono = true;
    document.querySelector('#color_block label').innerHTML = "Mono";
    setup();
    restart();
  } else {
    mono = false;
    document.querySelector('#color_block label').innerHTML = "Color";
    setup();
    restart();
    }
});

const custom_on_button = document.querySelector("#custom_list_item");
custom_on_button.addEventListener('click', () => { custom_on = true; });

const custom_close_button = document.querySelector("#close_custom");
custom_close_button.addEventListener('click', () => { setTimeout(() => {
    custom_on = false;
}, 100); });

const custom_submit_button = document.querySelector("#submit_custom");
custom_submit_button.addEventListener('click', () => { setTimeout(() => {
    custom_on = false;
}, 100); });