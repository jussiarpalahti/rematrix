/// <reference path="../typings/ramda.d.ts" />

//import React from 'react';
import * as React from "react";
import {get_data, piping} from "./lib/piper.js";

interface Props {
    foo: string;
    arg: number;
    piper: Function
}

interface data {
    any: any;
}

export class Tyyppi extends React.Component<Props, {}> {

    handler() {
        this.props.piper();
    }

    render() {
        return <div>
            <div><button onClick={this.handler.bind(this)}>Fetch data</button></div>
            <div><span>Rendered with types: {this.props.foo}</span></div>
            <div>Data: {this.props.arg}</div>
        </div>
    }
}

export class Main extends React.Component<any, {}> {

    render() {
        let data = this.props.data;
        return <div>
            <h1>React Typed Table Viewer</h1>
            <div><Tyyppi arg={data.arg} foo={data.foo} piper={data.my_pipe} /></div>
        </div>
    }
}

const piper = function () {
    console.log("pipe started");
    get_data((data) => {
        return null;
    });
    console.log("piped");
};

function main() {
    var app = document.getElementById('app');
    if (!app) {
        app = document.createElement('div');
        app.setAttribute("id", "app");
        document.body.appendChild(app);
    }

    var reapp;

    let data = {
        arg: 0,
        foo: "hoh hoo",
        my_pipe: function () {
            piping(
                data,
                (data) => {
                    console.log("called back with ", data);
                    reapp = React.render(
                        <div id="app">
                            <Main data={data} />
                        </div>, app);
                    console.log("re-rendering");
                }
            );
        }
    };

    reapp = React.render(
        <div id="app">
            <Main data={data} />
        </div>, app);
}

main();
