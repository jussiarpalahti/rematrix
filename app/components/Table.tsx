
import * as React from "react";
import {get_table} from "../lib/table";

interface Props {
    [name: string]: string,
}

interface TableProps {
    table: any;
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


// test table
let TABLE = get_table(heading, stub);

// Test matrix
let MATRIX = Array.apply(null, Array(TABLE.stub.size)).map((_, i) => {
    return Array.apply(null, Array(TABLE.heading.size)).map((_, j) => j * i);
});
console.log(MATRIX);

class TableHead extends React.Component<TableProps, {}> {
    render () {
        let table = this.props.table;
        let resp = table.heading.hop.map(
            (hopper, index) => {
                let row = [];
                for (let i=0; i < table.size; i++) {
                    let header = hopper();
                    if (header) row.push(
                        <th colSpan={table.heading.hops[index]}>{header}</th>)
                    }
                if (index == 0) {
                    return <tr>
                        <th
                            colSpan={table.stub.headers.length}
                            rowSpan={table.heading.headers.length}>
                            space
                        </th>
                        {row}
                    </tr>
                } else {
                    return <tr>{row}</tr>;
                }
            });
        return <thead>{resp}</thead>;
    }
}

function get_row_headers (stub){
    let resp = [];
    stub.hop.map((hopper, index) => {
        let header = hopper();
        if (header) {
            resp.push(
                <th rowSpan={stub.hops[index]}>{header}</th>
            );
        }
    });
    return resp;
}


class TableBody extends React.Component<TableProps, {}> {
    render () {
        let table = this.props.table;
        let resp = [];
        for (let row=0; row < table.stub.size; row++) {
            let data = [];
            for (let col=0; col < table.heading.size; col++) {
                data.push(
                    <td>{MATRIX[row][col]}</td>
                );
            }
            resp.push(<tr>
                {get_row_headers(table.stub)}
                {data}
            </tr>);
        }
        return <tbody>
            {resp}
        </tbody>
    }
}


export class HierarchicalTable extends React.Component<Props, {}> {
    render() {
        return <div id="datatable">
            <table className="pure-table pure-table-bordered">
                <TableHead table={TABLE} />
                <TableBody table={TABLE} />
                </table>
        </div>
    }
}