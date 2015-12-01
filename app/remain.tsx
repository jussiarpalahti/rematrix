/// reference path="../typings/ramda.d.ts"

import './stylesheets/pure/pure-min.css';
import './stylesheets/main.css';

import * as React from "react";

import {get_data, piping, clsnames} from "./lib/piper";
import {HierarchicalTable} from "./components/Table";
import {get_table} from "./lib/table";

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


export class DataList extends React.Component<any, {hideList:boolean}> {

    constructor(props) {
        super(props);
        this.state = { hideList: true };
    }

    onClick() {
        if (this.props.datasets.length == 0) {
            this.props.my_pipe();
        }
        this.setState({ hideList: !this.state.hideList });
    }

    select_dataset(dset) {
        if (dset.name !== this.props.chosen_table) {
            console.log("dataset selected", dset);
            this.props.select_table(dset.name);
        }
    }

    render() {

        let css = clsnames("modal", {hidden: this.state.hideList});

        return <div className="top_header">
            <h2>Taulukot</h2>
            <button onClick={this.onClick.bind(this)}>Datasetit</button>
            <div className={css}>
                {this.props.datasets.length > 0 ? <ul className="hidable datasetlist">
                    {this.props.datasets.map((dset, i) => {
                            return <li key={i} onClick={() => this.select_dataset(dset)}>
                                <span>{this.props.chosen_table == dset.name ? '\u2713' : ' '} </span>
                                {dset.title}
                            </li>
                        })
                    }
                </ul> : null}
            </div>
        </div>
    }

}


export class VariableSelection extends React.Component<any, {hideList:boolean}> {

    constructor(props) {
        super(props);
        this.state = { hideList: true };
    }

    onClick() {
        this.setState({ hideList: !this.state.hideList });
    }

    render() {

        let res = [];

        let css = clsnames("modal", {hidden: this.state.hideList});

        if (!this.state.hideList) {
            if (this.props.datasets.length > 0) {
                let dataset = this.props.datasets[0];
                for (let heading in dataset.levels) {
                    res.push(<li key={res.length}>{heading}</li>);
                }
            } else {
                res.push(<div key={res.length}>Valitse ensin taulukko</div>);
            }
        }

        return <div className="top_header">
            <h2>Muuttujat</h2>
            <button onClick={this.onClick.bind(this)}>Muuttujat</button>
            <div className={css}>
                <ul className="hidable datasetlist">
                    {res ? res : null}
                </ul>
            </div>
        </div>
    }

}


export class TableView extends React.Component<any, {}> {

    render() {
        let {table, matrix} = this.props;
        // TODO: we reset since React Hot Loader regards hoppers as state to be preserved
        reset(table);
        return <div>A table:
            <HierarchicalTable table={table} matrix={matrix} />
        </div>
    }

}


export class DataView extends React.Component<{}, {}> {

    render() {
        return <div> </div>
    }

}

function reset (table) {
    /*
    Since heading cell span calculator functions keep their state around,
    their counters need to be reset for every render cycle anew.

    Functional approach would use cell position, but that's more involved
    calculation. Decisions decisions.

    TODO: With proper fetch data + render cycle this will can be removed
     */

    table.heading.hop.forEach((hopper) => hopper(true));
    table.stub.hop.forEach((hopper) => hopper(true));

}

export class Main extends React.Component<any, {}> {

    render() {
        let data = this.props.data;
        return <div>
            <h1>React Typed Table Viewer</h1>
            <DataList {...data} />
            <VariableSelection {...data} />
            <TableView {...data} />
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

    // test table
    let TABLE = get_table(heading, stub);

    // Test matrix
    let MATRIX = Array.apply(null, Array(TABLE.stub.size)).map((_, i) => {
        return Array.apply(null, Array(TABLE.heading.size)).map((_, j) => j * i);
    });

    let rerender = () => {
        reapp = React.render(
            <div>
                <Main data={data} />
            </div>, app);
        console.log("re-rendering");
    };

    let data = {
        datasets: [],
        chosen_table: null,
        table: TABLE,
        matrix: MATRIX,
        arg: 0,
        my_pipe: function () {
            get_data(
                (res) => {
                    data.datasets = res.pxdocs;
                    rerender();
                }
            );
        },
        select_table: (name) => {
            data.chosen_table = name;
            rerender();
        }
    };

    reapp = React.render(
        <div>
            <Main data={data} />
        </div>, app);
}


let stub = [
    [1,2,3],
    [4,5],
    [6,7]
];

let heading = [
    ['a', 'b', 'c', 'd'],
    ['x', 'y', 'z']
];

main();
