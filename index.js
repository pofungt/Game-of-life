const unitLength  = 20;
const boxColor    = '#312E16';
const emptyboxColor = '#997B3D';
const strokeColor = 50;
let fr = 30;
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
            if (currentBoard[x][y] == 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
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
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

function mousePressed() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (!(mouseX > unitLength * columns || mouseY > unitLength * rows)) {
        noLoop();
        mouseDragged();
    }
}

function mouseReleased() {
    if (!(mouseX > unitLength * columns || mouseY > unitLength * rows)) {
        loop();
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
}

document.querySelector('#reset-game')
	.addEventListener('click', function() {
		init();
	});

document.querySelector('#reset-game-random')
    .addEventListener('click', function() {
        init_random();
    });

let shape;

const ship = document.querySelector('#ship');
ship.addEventListener('click', function() {
    document.querySelector('#add_icons')
        .innerHTML = ship.innerHTML;
    shape = ship.innerHTML.toLowerCase();
    setTimeout(() => {
        window.addEventListener('click', add_icon);
    }, 500);
});

const glider = document.querySelector('#glider');
glider.addEventListener('click', function() {
    document.querySelector('#add_icons')
        .innerHTML = glider.innerHTML;
    shape = glider.innerHTML.toLowerCase();
    setTimeout(() => {
        window.addEventListener('click', add_icon);
    }, 500);
});

const spaceship = document.querySelector('#spaceship');
spaceship.addEventListener('click', function() {
    document.querySelector('#add_icons')
        .innerHTML = spaceship.innerHTML;
    shape = spaceship.innerHTML.toLowerCase();
    setTimeout(() => {
        window.addEventListener('click', add_icon);
    }, 500);
});

const reset = document.querySelector('#reset_button');
reset.addEventListener('click', function() {
    document.querySelector('#add_icons')
        .innerHTML = "Add";
    shape = null;
    window.removeEventListener('click', add_icon);
});

const slide_speed = [10, 30, 60];
const slide_speed_output = ['LOW', 'MED', 'HIGH'];
const slide = document.querySelector('#framerate_slider');
slide.addEventListener('change', function() {
    fr = slide_speed[parseInt(slide.value)];
    document.querySelector('#framerate_output').innerHTML = slide_speed_output[parseInt(slide.value)];
});

const next_button_pic = ["./asset/pause-button.png", "./asset/play-button.png"];
const play_pause = document.querySelector('#play_pause');
play_pause.addEventListener('click', function() {
    if (isLooping()) {
        document.querySelector('#play_pause img').src = next_button_pic[1];
        noLoop();
    } else {
        document.querySelector('#play_pause img').src = next_button_pic[0];
        loop();
    }
})