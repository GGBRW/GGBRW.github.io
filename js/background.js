const c = document.querySelector(".background");
[c.height,c.width] = [innerHeight,innerWidth];

const ctx = c.getContext("2d");
ctx.lineJoin = "round";

let zoom = 100;

const offset = {
  x: 0,
  y: 0
}

const height = c.height / zoom;
const width = c.width / zoom;

const components = [];

for(let i = 0; i < 8; ++i) {
  if(Math.random() < .2) {
      components.push(new Input(undefined, { x: Math.random() * width | 0, y: -Math.random() * height | 0 }));
  } else if(Math.random() < .4) {
    components.push(new AND(undefined, { x: Math.random() * width | 0, y: -Math.random() * height | 0 }));
  }
}

function draw() {
  [c.height,c.width] = [innerHeight,innerWidth];
  ctx.clearRect(0,0,c.width,c.height);

  ctx.fillStyle = "#888";
  for(let i = (-offset.x * zoom) % zoom; i < c.width; i = i + zoom) {
    for(let j = (offset.y * zoom) % zoom; j < c.height; j = j + zoom) {
      ctx.fillRect(i - zoom / 24, j - zoom / 24, zoom / 12, zoom / 12);
    }
  }

  for(let i = 0; i < components.length; ++i) {
    components[i].draw();
  }
}

draw();
