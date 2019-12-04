let c = document.getElementById("track");
let ctx = c.getContext("2d");
ctx.fillStyle = "#000000";

const second = (input) => {
    
};


fetch('../day13Input.txt').then(resp => resp.text()).then(data => {
    second(data);
});