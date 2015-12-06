
import '../stylesheets/pure/pure-min.css';
import '../stylesheets/main.css';

import React from 'react';

var Plotly = require('../lib/plotly.js/dist/plotly.js');

var data = {
    x: [1, 2, 3, 4, 5, 6],
    y: [10, 15, 12, 5, 7, 14],
    name: 'eka',
    type: 'bar'
};

var data2 = {
    x: [1, 2, 3, 4, 5, 6],
    y: [9, 15, 10, 5, 8, 14],
    name: 'toka',
    type: 'bar'
};

var all_data = [data, data2];

var layout = {
    title: 'plotly.js with React',
    barmode: 'group',
    hovermode:'closest'
};

let PViz = React.createClass({

    componentDidMount: function() {
        Plotly.newPlot(
            this.refs.viz.getDOMNode(), all_data, layout
        );
        this.refs.viz.getDOMNode().on('plotly_click', function(data){
            console.log("event with plotly", data);
        });
    },

    shouldComponentUpdate: function() {
        // Let's just never update this component again.
        return false;
    },

    render: function () {
        return <div ref="viz" id="plots">Jee</div>;
    }
});

export default PViz;

function main() {
    var app = document.getElementById('app');
    if (!app) {
        app = document.createElement('div');
        app.setAttribute("id", "app");
        document.body.appendChild(app);
    }
    React.render(<div id="app">
        <PViz />
    </div>, app);
}

main();