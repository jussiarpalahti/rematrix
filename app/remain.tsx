/// <reference path="../typings/ramda.d.ts" />

//import React from 'react';
import * as React from "react";
import {get_data} from "./lib/piper.js";

interface Props {
    foo: string;
}

export default class Tyyppi extends React.Component<Props, {}> {
    render() {
        return <span>Rendered with types: {this.props.foo}</span>
    }
}

declare var fetch: any;

function piper() {
    console.log("pipe started");
    get_data();
    console.log("piped");
}

function main() {
    var app = document.getElementById('app');
    if (!app) {
        app = document.createElement('div');
        app.setAttribute("id", "app");
        document.body.appendChild(app);
    }

    React.render(<div id="app">
        <h1>React Typed Table Viewer</h1>
        <div><button onClick={piper}>Fetch data</button></div>
        <div><Tyyppi foo="hoh hoo" /></div>
    </div>, app);
}

main();
