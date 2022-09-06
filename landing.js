let cube = document.querySelector(".image-cube");
let btnNext = document.getElementById("next");
let btnPrev = document.getElementById("prev");

let pos = 0;

btnNext.addEventListener("click", () => {
  pos -= 90;
  cube.style.transform = `rotateY(${pos}deg)`;
});
btnPrev.addEventListener("click", () => {
  pos += 90;
  cube.style.transform = `rotateY(${pos}deg)`;
});

setInterval(() => {
    btnNext.click();
}, 4000);

document.body.onkeydown = function(e) {
    if (e.key == " " ||
    e.code == "Space" ||      
    e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        window.location = "./index.html";
    }
  }