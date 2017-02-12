let clipbord = {};
clipbord.components = [];
clipbord.wires = [];

clipbord.copy = function(components = [], wires = [], selection) {
    const clone = cloneSelection(components,wires);
    clipbord.components = clone.components;
    clipbord.wires = clone.wires;
    if(selection) {
        clipbord.selection = Object.assign({},selection);
    } else {
        delete clipbord.selection;
    }
}

clipbord.paste = function(x,y) {
    if(this.selection) {
        const dx = Math.round(x - this.selection.x) || 0;
        const dy = Math.round(y - this.selection.y) || 0;

        const clone = cloneSelection(this.components,this.wires,dx,dy);
        components.push(...clone.components);
        wires.push(...clone.wires);

        selecting = Object.assign({},this.selection);
        selecting.x = x;
        selecting.y = y;
        selecting.components = [...clone.components];
        selecting.wires = [...clone.wires];

        contextMenu.show(
            selecting.x + selecting.w,
            selecting.y + selecting.h
        );
    } else if(this.components.length > 0) {
        const clone = cloneComponent(this.components[0])
        clone.pos.x = x;
        clone.pos.y = y;
        components.push(clone);
    }
}

// clipbord.paste = function(x,y) {
//     if(this.components.length == 0 && this.wires.length == 0) {
//         return;
//     }
//
//     let components = [...this.components];
//     let wires = [...this.wires];
//     const connections = this.connections;
//
//     let added = [];
//     if(clipbord.selection) {
//         const dx = Math.round(x - this.selection.x) || 0;
//         const dy = Math.round(y - this.selection.y) || 0;
//
//         // for(let i = clipbord.components.length - 1; i >= 0; --i) {
//         //     const pos = clipbord.components[i].pos;
//         //
//         //     clipbord.components[i] = clone(clipbord.components[i]);
//         //
//         //     if(Array.isArray(pos)) {
//         //         for(let j = 0, len2 = pos.length; j < len2; ++j) {
//         //             clipbord.components[i].pos.push({
//         //                 x: Math.round(pos[j].x + dx),
//         //                 y: Math.round(pos[j].y + dy)
//         //             });
//         //         }
//         //
//         //         added.unshift(clipbord.components[i]);
//         //     }
//         //     else {
//         //         clipbord.components[i].pos.x = Math.round(pos.x + dx);
//         //         clipbord.components[i].pos.y = Math.round(pos.y + dy);
//         //         added.push(clipbord.components[i]);
//         //     }
//         // }
//
//         components = components.map(component => cloneComponent(component,dx,dy));
//         wires = wires.map(wire => cloneWire(wire,dx,dy));
//
//         for(let i = 0; i < connections.length; ++i) {
//             const from = components[connections[i][0]];
//             const to = components[connections[i][1]];
//             const wire = wires[connections[i][4]];
//
//             const fromPort = from.output[connections[i][2]];
//             const toPort = to.input[connections[i][3]];
//
//             wire.from = fromPort;
//             wire.to = toPort;
//
//             connect(fromPort,toPort,wire);
//         }
//
//         if(this.selection) {
//             setTimeout(() => {
//                 selecting = Object.assign({}, this.selection);
//                 selecting.x = Math.round(x);
//                 selecting.y = Math.round(y);
//
//                 selecting.components = components;
//                 selecting.wires = wires;
//
//                 contextMenu.show(
//                     (selecting.x + selecting.w - offset.x) * zoom,
//                     (-(selecting.y + selecting.h) + offset.y) * zoom
//                 );
//
//                 action("addSelection",[components,wires],true);
//             });
//         }
//     }
//     else {
//         const component = cloneComponent(components[0]);
//         component.pos.x = x;
//         component.pos.y = y;
//         action("add",component,true);
//     }
// }
