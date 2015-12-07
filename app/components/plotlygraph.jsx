
import '../stylesheets/pure/pure-min.css';
import '../stylesheets/main.css';

import React from 'react';

var Plotly = require('../lib/plotly.js/dist/plotly.js');

var layout = {
    title: 'plotly.js with React',
    barmode: 'group',
    hovermode:'closest'
};

let PViz = React.createClass({

    componentDidMount: function() {
        Plotly.newPlot(
            this.refs.viz.getDOMNode(), this.props.data, layout
        );
        this.refs.viz.getDOMNode().on('plotly_click', function(data){
            console.log("event with plotly", data);
        });
    },

    componentWillReceiveProps: function (nextProps) {
        Plotly.redraw(this.refs.viz.getDOMNode());
    },

    shouldComponentUpdate: function() {
        // Let's just never update this component again.
        return false;
    },

    render: function () {
        return <div ref="viz" id="plots"></div>;
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

    function update() {
        let min = 0, max = 100;
        data.y = Array.apply(null, Array(data.y.length)).map((_, i) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        });
        data2.y = Array.apply(null, Array(data.y.length)).map((_, i) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        });
        rerender();
    }

    let rerender = () => {
        React.render(<div id="app">
            <button onClick={update}>Päivitä</button>
            <PViz data={all_data} />
        </div>, app);
        console.log("re-rendering");
    };
    rerender();
}

main();