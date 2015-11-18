/// reference path="../typings/ramda.d.ts"

import './stylesheets/pure/pure-min.css';
import './stylesheets/main.css';

import * as React from "react";

import {get_data, piping, clsnames} from "./lib/piper";


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
            <div><button onClick={() => this.handler() }>Fetch data</button></div>
            <div><span>Rendered with types: {this.props.foo}</span></div>
            <div>Data: {this.props.arg}</div>
        </div>
    }
}


export class DataList extends React.Component<{}, {hideList:boolean}> {

    constructor(props) {
        super(props);
        this.state = { hideList: true };
    }

    onClick() {
        this.setState({ hideList: !this.state.hideList });
    }

    render() {

        let css = clsnames("modal", {hidden: this.state.hideList});

        return <div className="top_header">
            <h2>Datalist</h2>
            <button onClick={this.onClick.bind(this)}>Show</button>
            <div className={css}>
                <ul className="hidable">
                    <li>List of stuff</li>
                    <li>Not very long</li>
                    <li>Not very long</li>
                    <li>Not very long</li>
                </ul>
            </div>
        </div>
    }

}


export class VariableSelection extends React.Component<{}, {}> {

    render() {
        return <div>Variables</div>
    }

}


export class TableView extends React.Component<{}, {}> {

    render() {
        return <div>Table</div>
    }

}


export class DataView extends React.Component<{}, {}> {

    render() {
        return <div>Data</div>
    }

}


export class Main extends React.Component<any, {}> {

    render() {
        let data = this.props.data;
        return <div>
            <h1>React Typed Table Viewer</h1>
            <DataList />
            <VariableSelection />
            <TableView />
            <DataView />
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
