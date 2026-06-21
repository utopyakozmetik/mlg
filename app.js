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
    if(index < 0) index = videos.length - 1;
    if(index >= videos.length) index = 0;
    current = index;
    player.src = videos[index].iframe;
    channelText.innerHTML = `VIDEO ${index + 1} / ${videos.length}`;
}

function nextVideo(){ loadVideo(current + 1); }
function prevVideo(){ loadVideo(current - 1); }
function jump(step){ loadVideo(current + step); }

document.getElementById("nextBtn").addEventListener("click", nextVideo);
document.getElementById("prevBtn").addEventListener("click", prevVideo);
document.getElementById("plus10").addEventListener("click",()=>jump(10));
document.getElementById("minus10").addEventListener("click",()=>jump(-10));
document.getElementById("plus100").addEventListener("click",()=>jump(100));
document.getElementById("minus100").addEventListener("click",()=>jump(-100));

document.getElementById("jumpInput").addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        const value = parseInt(e.target.value);
        if(!isNaN(value)) loadVideo(value - 1);
    }
});

// TEK KEYDOWN LISTENER
document.addEventListener("keydown",(e)=>{
    const frame = document.getElementById("screenFrame");
    const style = window.getComputedStyle(frame);
    let left = parseFloat(style.left);
    let top = parseFloat(style.top);
    let width = parseFloat(style.width);

    // Video kontrol (normal ok tuşları)
    if(e.key === "ArrowRight" && !e.shiftKey){
        nextVideo();
    }
    if(e.key === "ArrowLeft" && !e.shiftKey){
        prevVideo();
    }

    // Ekran oturtma (Shift + ok tuşları)
    if(e.key === "ArrowRight" && e.shiftKey){
        frame.style.left = (left + 0.5) + "%";
    }
    if(e.key === "ArrowLeft" && e.shiftKey){
        frame.style.left = (left - 0.5) + "%";
    }
    if(e.key === "ArrowUp" && e.shiftKey){
        frame.style.top = (top - 0.5) + "%";
    }
    if(e.key === "ArrowDown" && e.shiftKey){
        frame.style.top = (top + 0.5) + "%";
    }

    // Büyüt/küçült
    if(e.key === "+"){
        frame.style.width = (width + 0.5) + "%";
    }
    if(e.key === "-"){
        frame.style.width = (width - 0.5) + "%";
    }

    // F tuşu ile tam ekran
    if(e.key === "f" || e.key === "F"){
        goFullscreen();
    }
});

// Tam ekran fonksiyonu
function goFullscreen(){
    const frame = document.getElementById("screenFrame");
    if(frame.requestFullscreen){
        frame.requestFullscreen();
    } else if(frame.webkitRequestFullscreen){
        frame.webkitRequestFullscreen();
    } else if(frame.msRequestFullscreen){
        frame.msRequestFullscreen();
    }
}

init();
