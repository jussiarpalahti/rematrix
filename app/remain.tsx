/// reference path="../typings/ramda.d.ts"

//import React from 'react';
import * as React from "react";

import {get_data, piping} from "./lib/piper";

//import piper = require('piper');
//let {piping} = piper;


interface Props {
    foo: string;
    arg: number;
    pipe: Function
}

interface data {
    any: any;
}

export class Tyyppi extends React.Component<Props, {}> {

    handler() {
        this.props.pipe();
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
            <div><Tyyppi arg={data.arg} foo={data.foo} pipe={data.my_pipe} /></div>
        </div>
    }
}

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
