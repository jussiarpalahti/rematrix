
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

    is_plot: false,

    create_plot: function (data) {
        if (data) {
            if (!this.is_plot) {
                Plotly.newPlot(
                    this.refs.viz.getDOMNode(), data, layout
                );
                this.refs.viz.getDOMNode().on('plotly_click', function(data){
                    console.log("event with plotly", data);
                });
                this.is_plot = true;
            } else {

                this.refs.viz.getDOMNode().data = data;
                Plotly.redraw(this.refs.viz.getDOMNode());
            }
        }
    },

    componentDidMount: function() {
        this.create_plot(this.props.data);
    },

    componentWillReceiveProps: function (nextProps) {
        this.create_plot(nextProps.data);
    },

    render: function () {
        return <div ref="viz" id="plots"></div>;
    }
});

//export default PViz;

exports.PViz = PViz;

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
