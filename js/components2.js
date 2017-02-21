class Component {
    constructor(
        name,
        pos,
        width = 2,
        height = 2,
        icon
    ) {
        // If no name is given, create a standard name in the format [Component type]#[Number of components with the same type that are already on the board]
        // Example: if you create an AND gate and there are already 16 AND gates on the board, the name will be AND#16
        if(!name) {
            name =
                this.constructor.name + "#" +
                components.filter(a => a.constructor == this.constructor).length;
        }
        this.name = name;

        // The position of the component on the grid
        // Each dot on the screen is a point in the grid, the space between the dots is 1
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        this.icon = icon;

        this.properties = {};

        this.input = [];
        this.output = [];
    }

    update() {
        // Update output ports
        this.function();

        const wires = [];
        const values = [];
        for(let i = 0; i < this.output.length; ++i) {
            const port = this.output[i];
            // If the port is empty, skip to the next port
            if(!port.connection) continue;
            // // If this output port's value has changed, update all the connected components
            // if(port.value != port.connection.value) {
            //     port.connection.update(port.value);
            // }

            const index = wires.indexOf(port.connection);
            if(index == -1) {
                wires.push(port.connection);
                values.push(port.value);
            } else if(values[index] < port.value) {
                values[index] = port.value;
            }
        }

        for(let i = 0; i < wires.length; ++i) {
            //wires[i].update(values[i]);
            updateQueue.push(wires[i].update.bind(wires[i],values[i]));
        }
    }

    draw() {
        const x = (this.pos.x - offset.x) * zoom;
        const y = -(this.pos.y - offset.y) * zoom;

        if(!(
            x + this.width * zoom + zoom / 2 >= 0 &&
            x - zoom * 1.5 <= c.width &&
            y + this.height * zoom + zoom / 2 >= 0 &&
            y - zoom * 1.5 <= c.height
        )) return;

        // Draw the frame of the component
        ctx.strokeStyle = "#888";
        ctx.fillStyle = "#111";
        ctx.lineWidth = zoom / 12;
        ctx.beginPath();
        ctx.rect(
            x - zoom / 2,
            y - zoom / 2,
            this.width * zoom,
            this.height * zoom
        );
        ctx.fill();
        ctx.stroke();

        ctx.textBaseline = "middle";

        // Draw the icon of the component
        if(this.icon && zoom > 3) {
            ctx.textAlign = "center";

            if(this.icon.type == "icon") {
                ctx.fillStyle = this.value ? "#aaa" : "#888";
                ctx.font = zoom / 1.3 + "px Material-icons";
                ctx.fillText(
                    this.icon.text,
                    x + (this.width - 1) / 2 * zoom,
                    y + (this.height - 1) / 2 * zoom
                );
            } else if(this.icon.type == "char") {
                ctx.fillStyle = this.value ? "#aaa" : "#888";
                ctx.font = "normal normal normal " + zoom / 1.2 + "px Ubuntu";
                ctx.fillText(
                    this.icon.text,
                    x + (this.width - 1) / 2 * zoom,
                    y + (this.height - 1) / 2 * zoom
                );
            } else if(this.icon.type == "value") {
                ctx.fillStyle = "#888";
                ctx.font = "normal normal normal " + zoom / 1.3 + "px Monospaced";
                ctx.fillText(
                    this.value,
                    x + (this.width - 1) / 2 * zoom,
                    y + (this.height - .85) / 2 * zoom
                );
            }
        }

        // Draw the name of the component in the upper left corner
        if(this.name && zoom > 30) {
            ctx.textAlign = "left";
            ctx.font = "italic normal normal " + zoom / 7 + "px Ubuntu";
            ctx.fillStyle = "#888";
            ctx.fillText(
                this.name,
                x - .5 * zoom + zoom / 15,
                y - .37 * zoom
            );
        }

        // Draw input pins
        for(let i = 0; i < this.input.length; ++i) {
            const screen = { x,y };
            const pos = this.input[i].pos;

            const angle = Math.PI / 2 * pos.side;
            screen.x += Math.sin(angle) * zoom;
            screen.y -= Math.cos(angle) * zoom;
            if(pos.side == 1) screen.x += (this.width - 1) * zoom;
            else if(pos.side == 2) screen.y += (this.height - 1) * zoom;

            if(pos.side % 2 == 0) screen.x += pos.pos * zoom;
            else screen.y += pos.pos * zoom;

            ctx.beginPath();
            ctx.moveTo(
                screen.x - Math.sin(angle) / 2 * zoom,
                screen.y + Math.cos(angle) / 2 * zoom
            );
            ctx.lineTo(
                screen.x,
                screen.y
            );
            ctx.lineWidth = zoom / 8;
            ctx.stroke();

            if(zoom > 10) {
                ctx.beginPath();
                ctx.arc(
                    screen.x,
                    screen.y,
                    zoom / 8 - zoom / 20,
                    0,
                    Math.PI * 2
                );
                ctx.lineWidth = zoom / 10;
                ctx.fillStyle = "#111";
                ctx.stroke();
                ctx.fill();
            }

            if(zoom > 30) {
                const name = this.input[i].name;
                if(name) {
                    ctx.fillStyle = "#888";
                    ctx.font = zoom / 7 + "px Ubuntu";
                    ctx.fillText(
                        name,
                        screen.x - ctx.measureText(name).width / 2,
                        (pos.side == 2 ? screen.y + zoom / 4 : screen.y - zoom / 4)
                    );
                }
            }
        }

        // Draw output pins
        for(let i = 0; i < this.output.length; ++i) {
            const screen = { x,y };
            const pos = this.output[i].pos;

            const angle = Math.PI / 2 * pos.side;
            screen.x += Math.sin(angle) * zoom;
            screen.y -= Math.cos(angle) * zoom;
            if(pos.side == 1) screen.x += (this.width - 1) * zoom;
            else if(pos.side == 2) screen.y += (this.height - 1) * zoom;

            if(pos.side % 2 == 0) screen.x += pos.pos * zoom;
            else screen.y += pos.pos * zoom;

            ctx.beginPath();
            ctx.moveTo(
                screen.x - Math.sin(angle) / 2 * zoom,
                screen.y + Math.cos(angle) / 2 * zoom
            );
            ctx.lineTo(
                screen.x,
                screen.y
            );
            ctx.lineWidth = zoom / 8;
            ctx.stroke();

            if(zoom > 10) {
                ctx.beginPath();
                ctx.arc(
                    screen.x,
                    screen.y,
                    zoom / 8,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = "#888";
                ctx.fill();
            }

            if(zoom > 30) {
                const name = this.output[i].name;
                if(name) {
                    ctx.fillStyle = "#888";
                    ctx.font = zoom / 7 + "px Ubuntu";
                    ctx.fillText(
                        name,
                        screen.x - ctx.measureText(name).width / 2,
                        (pos.side == 2 ? screen.y + zoom / 4 : screen.y - zoom / 4)
                    );
                }
            }
        }
    }

    addInputPort(pos,name,properties = {}) {
        const port = {
            type: "input",
            component: this,
            name,
            pos,
            value: 0
        }

        Object.assign(port,properties);

        this.input.push(port);
        return port;
    }

    addOutputPort(pos,name,properties = {}) {
        const port = {
            type: "output",
            component: this,
            name,
            pos,
            value: 0
        }

        Object.assign(port,properties);

        this.output.push(port);
        return port;
    }

    rotate() {
        // TODO: solution for input/output
        for(let i = 0; i < this.input.length; ++i) {
            if(this.input[i].connection) {
                return;
            }
        }

        for(let i = 0; i < this.output.length; ++i) {
            if(this.output[i].connection) {
                return;
            }
        }

        this.rotation = ++this.rotation % 4;

        const tmp = this.height;
        this.height = this.width;
        this.width = tmp;

        if(this.rotation == 0) {
            this.pos.y -= this.width - this.height;
        }

        if(this.rotation == 2) {
            this.pos.x -= this.width - this.height;
        }

        if(this.rotation == 3) {
            this.pos.y += this.height - this.width;
            this.pos.x += this.height - this.width;
        }

        for(let i = 0; i < this.input.length; ++i) {
            this.input[i].pos.side = ++this.input[i].pos.side % 4;
        }

        for(let i = 0; i < this.output.length; ++i) {
            this.output[i].pos.side = ++this.output[i].pos.side % 4;
        }
    }
}

class Input extends Component {
    constructor(name,pos) {
        super(name,pos,2,1,{ type: "value" });
        this.addOutputPort({ side: 1, pos: 0 });
        this.value = 0;
    }

    onmousedown() {
        this.value = 1 - this.value;
        this.update(true);
    }

    function() {
        this.output[0].value = this.value;
    }
}

class Output extends Component {
    constructor(name,pos) {
        super(name,pos,2,1,{ type: "value" });
        this.addInputPort({ side: 3, pos: 0 });
        this.value = 0;
    }

    function() {
        this.value = this.input[0].value;
    }
}

class TimerStart extends Component {
    constructor(name,pos) {
        super(name,pos,2,1,{ type: "value" });
        this.addOutputPort({ side: 1, pos: 0 });
        this.value = 0;
    }

    onmousedown() {
        this.value = 1 - this.value;
        this.update(true);
    }

    update() {
        console.time();

        this.function();

        this.output[0].value = this.value;
        this.output[0].connection && this.output[0].connection.update(this.value);
    }

    function() {
        this.output[0].value = this.value;
    }
}

class TimerEnd extends Component {
    constructor(name,pos) {
        super(name,pos,2,1,{ type: "value" });
        this.addInputPort({ side: 3, pos: 0 });
        this.value = 0;
    }

    update() {
        console.timeEnd();

        this.function();

        this.input[0].value == 1 && (this.value = 1);
    }

    function() {
        this.value = this.input[0].value;
    }
}

class NOT extends Component {
    constructor(name,pos) {
        super(name,pos,1,1,{ type: "char", text: "!" });
        this.addInputPort({ side: 3, pos: 0 });
        this.addOutputPort({ side: 1, pos: 0 });
        this.function = function() {
            this.output[0].value = 1 - this.input[0].value;
        }
    }
}

class AND extends Component {
    constructor(name,pos) {
        super(name,pos,2,2,{ type: "char", text: "&" });
        this.addInputPort({ side: 3, pos: 1 });
        this.addInputPort({ side: 3, pos: 0 });
        this.addOutputPort({ side: 1, pos: 0 });
        this.function = function() {
            this.output[0].value = this.input[0].value & this.input[1].value;
        }
    }
}

class OR extends Component {
    constructor(name,pos) {
        super(name,pos,2,2,{ type: "char", text: "|" });
        this.addInputPort({ side: 3, pos: 1 });
        this.addInputPort({ side: 3, pos: 0 });
        this.addOutputPort({ side: 1, pos: 0 });
        this.function = function() {
            this.output[0].value = this.input[0].value | this.input[1].value;
        }
    }
}

class XOR extends Component {
    constructor(name,pos) {
        super(name,pos,2,2,{ type: "char", text: "^" });
        this.addInputPort({ side: 3, pos: 1 });
        this.addInputPort({ side: 3, pos: 0 });
        this.addOutputPort({ side: 1, pos: 0 });
        this.function = function() {
            this.output[0].value = this.input[0].value ^ this.input[1].value;
        }
    }
}

class Wire {
    constructor(
        pos = [],
        intersections = [],
        color = [136,136,136],
        from,
        to
    ) {
        this.id = generateId();
        this.pos = pos;
        this.intersections = intersections;

        this.from = from;
        this.to = to;
        this.value = 0;

        // Input and output from other wires
        this.input = [];
        this.output = [];

        this.color = color;
    }

    updateValue(value = 0,from) {
        if(value == 1) {
            value = 1;
        } else if(this.from && this.from.value == 1) {
            value = 1;
        } else if(this.input.find(wire => wire != from && wire.value == 1)) {
            const input = this.input.map(wire => wire.value);

            for(let i = 0; i < this.input.length; ++i) {
                if(this.input[i].input.includes(this)) {
                    input[i] = this.input[i].updateValue(value,this);
                }
            }

            if(input.indexOf(1) > -1) {
                value = 1;
            } else {
                value = 0;
            }
        } else {
            value = 0;
        }

        return value;
    }

    update(value,from) {
        if(this.input.length > 0) {
            value = this.updateValue(value, from);
        }

        if(this.value == value) return;
        this.value = value;

        for(let i = 0; i < this.output.length; ++i) {
            const wire = this.output[i];
            if(wire != from) {
                wire.update && updateQueue.push(wire.update.bind(wire,this.value,this));
            }
        }

        if(this.to && this.to.value != this.value) {
            this.to.value = this.value;
            this.to.component && updateQueue.push(this.to.component.update.bind(this.to.component));
        }
    }

    draw() {
        const pos = this.pos;

        if(zoom > 50) {
            ctx.lineCap = "round";
        }

        let color;
        if(this.value == 1) {
            color = this.color;
        } else {
            color = this.color.map(n => (n + 255 + 255 + 255) / 4 | 0);
        }
        ctx.strokeStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";

        const path = [];
        for(let i = 0; i < pos.length; ++i) {
            if(i == 0 || i == pos.length - 1) {
                path.push(Object.assign({}, pos[i]));
            } else if(pos[i].x - pos[i - 1].x != pos[i + 1].x - pos[i].x ||
                      !pos[i].y - pos[i - 1].y != pos[i + 1].y - pos[i].y) {
                path.push(Object.assign({}, pos[i]));
            }
        }

        ctx.beginPath();
        ctx.lineTo(
            (path[0].x - offset.x) * zoom | 0,
            -(path[0].y - offset.y) * zoom | 0
        );
        for(let i = 1; i < path.length - 1; ++i) {
            // if(!isVisible(path[i - 1].x,path[i - 1].y) &&
            //    !isVisible(path[i + 1].x,path[i + 1].y)) continue;

            ctx.lineTo(
                (path[i].x - offset.x) * zoom | 0,
                -(path[i].y - offset.y) * zoom | 0
            );
        }
        ctx.lineTo(
            (path[path.length - 1].x - offset.x) * zoom | 0,
            -(path[path.length - 1].y - offset.y) * zoom | 0
        );
        ctx.stroke();

        for(let i = 0; i < this.intersections.length; ++i) {
            const pos = this.intersections[i];

            if(!pos.type) ctx.fillStyle = "#111";
            else if(pos.type == 1) ctx.fillStyle = "#11f";
            else if(pos.type == 2) ctx.fillStyle = "#1f1";
            else if(pos.type == 3) ctx.fillStyle = "#f11";

            ctx.beginPath();
            ctx.arc(
                (pos.x - offset.x) * zoom,
                -(pos.y - offset.y) * zoom,
                zoom / 8,
                0, Math.PI * 2
            );
            ctx.fill();
        }
    }
}

class CompressedWire {
    constructor(
        pos = [],
        intersections = [],
        color = [0,0,0],
        from,
        to
    ) {
        this.id = generateId();
        this.pos = pos;
        this.intersections = intersections;

        this.from = from;
        this.to = to;
        this.value = 0;

        this.color = color;
    }

    update(value) {
        this.value = value;

        if(this.to) {
            this.to.value = value;
            updateQueue.push(this.to.component.update.bind(this.to.component));
        }
    }

    draw() {
        const pos = this.pos;

        if(zoom > 50) {
            ctx.lineCap = "round";
        }


        let color;
        if(this.value == 1) {
            color = this.color;
        } else {
            color = this.color.map(n => (n + 255 + 255 + 255) / 4 | 0);
        }
        ctx.strokeStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";

        ctx.lineWidth = zoom / 4;

        ctx.beginPath();
        ctx.lineTo(
            (pos[0].x - offset.x) * zoom,
            -(pos[0].y - offset.y) * zoom
        );
        for(let i = 1; i < pos.length - 1; ++i) {
            if(i + 1 < pos.length
                && pos[i].x - pos[i - 1].x == pos[i + 1].x - pos[i].x
                && pos[i].y - pos[i - 1].y == pos[i + 1].y - pos[i].y) continue;

            ctx.lineTo(
                (pos[i].x - offset.x) * zoom,
                -(pos[i].y - offset.y) * zoom
            );
        }
        ctx.lineTo(
            (pos[pos.length - 1].x - offset.x) * zoom,
            -(pos[pos.length - 1].y - offset.y) * zoom
        );
        ctx.stroke();
    }
}

let Selected = Input;
