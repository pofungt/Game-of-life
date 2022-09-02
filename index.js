const unitLengthObj = {
    big: 20,
    small: 10
};
let square_size = "big";
let unitLength  = unitLengthObj[square_size];
const boxColor    = '#312E16';
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

const shapes = {
    ship: [
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
    ],
    glider: [
        [1, 1, 1],
        [1, 0, 0],
        [0, 1, 0]
    ],
    spaceship: [
        [0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
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
    for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = random() > 0.8 ? 1 : 0;
            nextBoard[i][j] = 0;
		}
	}
}

function draw() {
    background(emptyboxColor);
    frameRate(fr);
    generate();
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

function generate() {
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

 function mouseDragged() {
    if (draw_bool) {
        const x = Math.floor(mouseX / unitLength);
        const y = Math.floor(mouseY / unitLength);
        currentBoard[x][y] = 1;
        fill(boxColor);
        stroke(strokeColor);
        rect(x * unitLength, y * unitLength, unitLength, unitLength);
    }
}

function mousePressed() {
    if (draw_bool) {
        const x = Math.floor(mouseX / unitLength);
        const y = Math.floor(mouseY / unitLength);
        currentBoard[x][y] = 1;
        fill(boxColor);
        stroke(strokeColor);
        rect(x * unitLength, y * unitLength, unitLength, unitLength);
    }
}

function add_icon() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    for (let i = 0; i < shapes[shape].length; i++) {
        for (let j = 0; j < shapes[shape][i].length; j++) {
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows] = shapes[shape][i][j];
        }
    }

    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);

    restart();
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
        loop();
    }    
}

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

let shape;
const add_shapes = document.querySelectorAll('#add_block .dropdown-item');
for (let add_shape of add_shapes) {
    add_shape.addEventListener('click', () => {
        document.querySelector('#add_icons')
        .innerHTML = add_shape.innerHTML;
        shape = add_shape.id;
        setTimeout(() => {
            window.addEventListener('click', add_icon);
        }, 500);
    });
};

const reset_icon = document.querySelector('#reset_button');
reset_icon.addEventListener('click', () => {
    document.querySelector('#add_icons')
        .innerHTML = "Add";
    shape = null;
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
    } else {
        restart();
    }
    draw_bool = !draw_bool;
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

