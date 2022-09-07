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
let shapes_list_HTML = [];
let shape;
let add_icon_counter = 0;
let mouse_drawn = false;
let custom_on = false;
let custom_error_bool = false;
let over_dropup_bool = false;
let over_panel_bool = false;
let drawBool = false;
let addIconBool = false;
const custom_error = [
    "No name detected",
    "Letters or numbers only",
    "Duplicated name",
    "No pattern detected"
];
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
    updatePopUpMenu();
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

function checkOutsideCanvas() {
    return mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0;
}

function allowDrawingBoolean() {
    return !(custom_on || over_dropup_bool || over_panel_bool);
}

function mouseDraw() {
    if (!drawBool || !allowDrawingBoolean() || checkOutsideCanvas()) { return; }

    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    // In monotone mode
    if (mono) {
        // Add 1 to the currentBoard
        currentBoard[x][y] = 1;
        // Immediately show the effect of the added blocks
        fill(boxColor);
    // In color mode
    } else {
        // Add the turn's color to the currentBoard
        currentBoard[x][y] = turn;
        // Immediately show the effect of the added blocks with the turn's color
        const mouse_color = turn === "brown" ? boxColor : boxColor_blue;
        fill(mouse_color);
    }
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);

    mouse_drawn = true;
}

 function mouseDragged() {
    mouseDraw();
}

function mousePressed() {
    mouseDraw();
    if (addIconBool) {
        addIcon();
    }
}

function addIcon() {
    if (drawBool || !allowDrawingBoolean() || checkOutsideCanvas()) { return; }

    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    if (shape !== null) {
        for (let i = 0; i < shapes[shape].length; i++) {
            for (let j = 0; j < shapes[shape][i].length; j++) {
                // In mono mode, just plug in '1's in the currentBoard
                if (mono) {
                    currentBoard[(x + i + columns) % columns][(y + j + rows) % rows] = shapes[shape][i][j];
                // In color mode, plug in the turn's color in the currentBoard
                } else {
                    currentBoard[(x + i + columns) % columns][(y + j + rows) % rows] = shapes[shape][i][j] === 1 ? turn : 0;
                }
            }
        }    
    }
    // Switch color turn when color mode on
    if (!mono) {
        turn = turn === "brown" ? "blue" : "brown";
    }
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
        drawBool = false;
        // Check if anything is drawn with mouse, if yes switch the color turn, if not remain the same color
        if (mouse_drawn) {
            turn = turn === "brown" ? "blue" : "brown";
            mouse_drawn = false;
        }
        loop();
    }    
}

function updatePopUpMenu() {
    // Empty the HTML list
    shapes_list_HTML = [];
    // Add list items to add_icon bar
    for (list_name in shapes) {
        shapes_list_HTML.push(`<li><a id="${list_name}" class="shapePopUp dropdown-item" href="#">${list_name}</a></li>`);
    }
    shapes_list_HTML.push(`<li><a id="custom_list_item" class="dropdown-item" data-bs-toggle="modal"        
                            data-bs-target="#staticBackdrop" href="#">Custom</a></li>`);
    // Update the HTML in the dropup menu of "Add"
    document.querySelector('#add_block .dropdown-menu').innerHTML = shapes_list_HTML.join("");

    // Monitor if the pattern buttons are clicked, if clicked, update the {shape} to that particular shape, and activate the addIcon function
    const add_shapes = document.querySelectorAll('#add_block .shapePopUp');
    for (let add_shape of add_shapes) {
        add_shape.addEventListener('click', () => { 
            addIconBool = true;
            shape = add_shape.id;
            document.querySelector('#add_icons').innerHTML = shape;
        });
    }

    // Denote a variable for state of custom add function being activated
    const custom_on_button = document.querySelector("#custom_list_item");
    custom_on_button.addEventListener('click', () => { custom_on = true; });
}

// Reload when window size changes
window.onresize = function(){
    setup();
    restart();
};

// Reset board button (Blank)
document.querySelector('#reset-game').addEventListener('click', () => {
		init();
        restart();
	});

// Reset board button (Random)
document.querySelector('#reset-game-random').addEventListener('click', () => {
        init_random();
        restart();
    });

// When reset button is pressed again, reset the add icon function to default, also disable the add icon function when mouse is clicked
const reset_icon = document.querySelector('#reset_button');
reset_icon.addEventListener('click', () => {
    document.querySelector('#add_icons').innerHTML = "Add";
    shape = null;
    addIconBool = false;
});

// Slider to set frame speed
const slide_speed_output = ['LOW', 'MED', 'HIGH'];
const slide = document.querySelector('#framerate_slider');
slide.addEventListener('change', () => {
    fr = slide_speed[square_size][parseInt(slide.value)];
    document.querySelector('#framerate_output').innerHTML = slide_speed_output[parseInt(slide.value)];
});

// Pay/pause button
const next_button_pic = ["./asset/pause-button.png", "./asset/play-button.png"];
const play_pause = document.querySelector('#play_pause');
play_pause.addEventListener('click', () => {
    if (isLooping()) {
        pause();
    } else {
        restart();
    }
});

// Size change switch
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

const draw_pen = document.querySelector('#draw_pen');
draw_pen.addEventListener('click', () => {
    if (!drawBool) {
        draw_pen.style.background = "radial-gradient(#382D17, #9e7f3f)";
        pause();
        drawBool = true;
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

// Color mode switch
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

// Instance mode for p5.js canvas for another canvas in modal
let sketch = function(p) {
    /*Calculate the number of columns and rows */
    p.col_row = 3;
    p.unitLength = 30;

    p.setup = function() {
        /* Set the canvas to be under the element #canvas*/
        const p_canvas = p.createCanvas(p.col_row * p.unitLength, p.col_row * p.unitLength);
        p_canvas.parent(document.querySelector('#p_canvas'));
    
        /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
        p.currentBoard = [];
        for (let i = 0; i < p.col_row; i++) {
            p.currentBoard[i] = [];
        }

        for (let i = 0; i < p.col_row; i++) {
            for (let j = 0; j < p.col_row; j++) {
                p.currentBoard[i][j] = 0;
            }
        }
    }

    p.draw = function() {
        for (let i = 0; i < p.col_row; i++) {
            for (let j = 0; j < p.col_row; j++) {
                if (p.currentBoard[i][j] == 1){
                    p.fill(red(boxColor), green(boxColor), blue(boxColor));  
                } else {
                    p.fill(red(emptyboxColor), green(emptyboxColor), blue(emptyboxColor));
                } 
                p.stroke(strokeColor);
                p.rect(i * p.unitLength, j * p.unitLength, p.unitLength, p.unitLength);
            }
        }
    }

    p.mousePressed = function() {
        if (p.mouseX > p.unitLength * p.col_row || p.mouseY > p.unitLength * p.col_row) {
            return;
        }
        p.x = Math.floor(p.mouseX / p.unitLength);
        p.y = Math.floor(p.mouseY / p.unitLength);
        p.currentBoard[p.x][p.y] = p.currentBoard[p.x][p.y] === 1 ? 0 : 1;
    }

    p.reset = function() {
        for (let i = 0; i < p.col_row; i++) {
            for (let j = 0; j < p.col_row; j++) {
                p.currentBoard[i][j] = 0;
            }
        }
        document.querySelector('#name_of_newicon').value = "";
        document.querySelector('.custom_icon_screen #icon_size_button').innerHTML = "Icon Size";
        p.col_row = 3;
        p.setup();
    }
}

// Assign variable to the new canvas
let little_canvas = new p5(sketch);

// Denote a viable for state of custom add function being deactivated
const custom_close_button = document.querySelector("#close_custom");
custom_close_button.addEventListener('click', () => { setTimeout(() => {
    little_canvas.reset();
    custom_on = false;
}, 100); });

let icon_size = document.querySelector('.custom_icon_screen #icon_size');
const original_icon_size_HTML = icon_size.innerHTML;

// When submit button is pressed in custom add mode
const submitIcon = document.querySelector('#submit_custom');
submitIcon.addEventListener('click', () => {
    icon_size.innerHTML = original_icon_size_HTML;
    // Add a new item in shapes
    let new_arr_icon = [];
    let new_name_icon = document.querySelector('#name_of_newicon').value;
    let sum_of_cells = 0;
    for (let i = 0; i < little_canvas.currentBoard.length; i++) {
        new_arr_icon.push([]);
        for (let j = 0; j < little_canvas.currentBoard[i].length; j++) {
            new_arr_icon[i].push(little_canvas.currentBoard[i][j]);
            sum_of_cells += little_canvas.currentBoard[i][j];
        }
    }

    // Error messages
    if (new_name_icon.length === 0) {
        icon_size.innerHTML = `<div id="error_message">` + custom_error[0] + `</div>` + original_icon_size_HTML;
        icon_size_monitor();
        return;
    } else if (!(/^[A-Za-z0-9]*$/.test(new_name_icon))) {
        icon_size.innerHTML = `<div id="error_message">` + custom_error[1] + `</div>` + original_icon_size_HTML;
        icon_size_monitor();
        return;
    } else if (Object.keys(shapes).includes(new_name_icon)) {
        icon_size.innerHTML = `<div id="error_message">` + custom_error[2] + `</div>` + original_icon_size_HTML;
        icon_size_monitor();
        return;
    } else if (sum_of_cells === 0) {
        icon_size.innerHTML = `<div id="error_message">` + custom_error[3] + `</div>` + original_icon_size_HTML;
        icon_size_monitor();
        return;
    }

    // Proceeds the below when no errors occurred
    // Add the new shape into shapes array
    shapes[new_name_icon] = new_arr_icon;
    document.querySelector('#add_icons').innerHTML = new_name_icon;
    shape = new_name_icon;
    // Add the newly added shape into the shapes object
    shapes_list_HTML.splice((shapes_list_HTML.length - 1),0 , `<li><a id="${new_name_icon}" class="dropdown-item" href="#">${new_name_icon}</a></li>`);
    // Update the HTML tags in the popup menu of Add button
    updatePopUpMenu();
    // Allow add icon function
    addIconBool = true;
    // Close the custom window
    custom_close_button.click();
});

function icon_size_monitor() {
    // When size change is set for custom modal canvas
    const add_icon_size_changes = document.querySelectorAll('.custom_icon_screen .dropdown-item');
    for (let add_icon_change of add_icon_size_changes) {
        add_icon_change.addEventListener('click', () => {
            // Change the variable for col and row
            document.querySelector('.custom_icon_screen #icon_size_button').innerHTML = add_icon_change.innerHTML;
            little_canvas.col_row = parseInt(add_icon_change.getAttribute('num'));

            // Reload the canvas
            little_canvas.setup();
        });
    };
};

icon_size_monitor();

document.querySelector('#add_block .dropup').addEventListener('mouseenter', () => { over_dropup_bool = true; });

document.querySelector('#add_block .dropup').addEventListener('mouseleave', () => { over_dropup_bool = false; });

function slideToggle(el) {
    var elem = document.getElementById(el);
    elem.classList.toggle("open");
}

document.querySelector('#control_panel').addEventListener('mouseenter', () => { over_panel_bool = true; });

document.querySelector('#control_panel').addEventListener('mouseleave', () => { over_panel_bool = false; });