let videos = [];
let current = 0;

const player = document.getElementById("player");
const channelText = document.getElementById("channelText");

async function init(){

    const res = await fetch("videos.json");

    videos = await res.json();

    if(!videos.length) return;

    loadVideo(0);
}

function loadVideo(index){

    if(index < 0){
        index = videos.length - 1;
    }

    if(index >= videos.length){
        index = 0;
    }

    current = index;

    player.src = videos[index].iframe;

    channelText.innerHTML =
    `VIDEO ${index + 1} / ${videos.length}`;
}

function nextVideo(){
    loadVideo(current + 1);
}

function prevVideo(){
    loadVideo(current - 1);
}

function jump(step){
    loadVideo(current + step);
}

document
.getElementById("nextBtn")
.addEventListener("click", nextVideo);

document
.getElementById("prevBtn")
.addEventListener("click", prevVideo);

document
.getElementById("plus10")
.addEventListener("click",()=>jump(10));

document
.getElementById("minus10")
.addEventListener("click",()=>jump(-10));

document
.getElementById("plus100")
.addEventListener("click",()=>jump(100));

document
.getElementById("minus100")
.addEventListener("click",()=>jump(-100));

document
.getElementById("jumpInput")
.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        const value =
        parseInt(e.target.value);

        if(!isNaN(value)){

            loadVideo(value - 1);
        }
    }
});

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){
        nextVideo();
    }

    if(e.key==="ArrowLeft"){
        prevVideo();
    }

});

init();

document.addEventListener("keydown", (e) => {
  const frame = document.getElementById("screenFrame");
  const style = window.getComputedStyle(frame);

  let left = parseFloat(style.left);
  let top = parseFloat(style.top);
  let width = parseFloat(style.width);

  switch (e.key) {
    case "ArrowLeft":
      frame.style.left = (left - 0.5) + "%"; // sola kaydır
      break;
    case "ArrowRight":
      frame.style.left = (left + 0.5) + "%"; // sağa kaydır
      break;
    case "ArrowUp":
      frame.style.top = (top - 0.5) + "%"; // yukarı
      break;
    case "ArrowDown":
      frame.style.top = (top + 0.5) + "%"; // aşağı
      break;
    case "+":
      frame.style.width = (width + 0.5) + "%"; // büyüt
      break;
    case "-":
      frame.style.width = (width - 0.5) + "%"; // küçült
      break;
  }
});
