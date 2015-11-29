
import * as React from "react";
import {get_table} from "../lib/table";

interface Props {
    [name: string]: string,
}

interface TableProps {
    table: any;
}

let start = [
    [1,2,3],
    [4,5],
    [6,7,8,9]
];

let TABLE = get_table(start);


class TableHead extends React.Component<TableProps, {}> {
    render () {
        let table = this.props.table;
        let resp = table.hoppers.map(
            (hopper, index) => {
                let row = [];
                for (let i=0; i < table.size; i++) {
                    let header = hopper();
                    if (header) row.push(
                        <th colSpan={table.hops[index]}>{header}</th>)
                    }
                if (index == table.headers.length - 1) {
                    return <tr><th rowSpan={table.headers.length}>space</th>{row}</tr>
                } else {
                    return <tr>{row}</tr>;
                }
            });
        resp.reverse();
        return <thead>{resp}</thead>;
    }
}


class TableBody extends React.Component<Props, {}> {
    render () {
        return <tr>
            <th>Row header</th>
            <td>Data</td>
        </tr>
    }
}


export class HierarchicalTable extends React.Component<Props, {}> {
    render() {
        return <div id="datatable">
            <table className="pure-table pure-table-bordered">
                <TableHead table={TABLE} />
                <tbody>
                </tbody>
                </table>
        </div>
    }
}