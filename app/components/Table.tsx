
import * as React from "react";
import {get_table, get_key} from "../lib/table";

interface Props {
    [name: string]: string,
}

interface TableProps {
    table: any;
    matrix?: any;
}

class TableHead extends React.Component<TableProps, {}> {
    render () {
        let table = this.props.table;
        let resp = table.heading.hop.map(
            (hopper, index) => {
                let row = [];
                for (let i=0; i < table.size; i++) {
                    let header = hopper();
                    if (header) {
                        row.push(
                            <th key={"head" + index + i} colSpan={table.heading.hops[index]}>{header}</th>)
                    }
                    }
                if (index == 0) {
                    return <tr>
                        <th
                            className="centered"
                            colSpan={table.stub.headers.length}
                            rowSpan={table.heading.headers.length}>

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
                <th key={"header" + index} rowSpan={stub.hops[index]}>{header}</th>
            );
        }
    });
    return resp;
}


class TableBody extends React.Component<TableProps, {}> {
    render () {
        let {table, matrix} = this.props;
        let resp = [];
        for (let row=0; row < table.stub.size; row++) {
            let data = [];
            for (let col=0; col < table.heading.size; col++) {
                data.push(
                    <td key={"heading" + row + col}>{matrix[row][col]}</td>
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
        let {table, matrix} = this.props;
        return <div id="datatable">
            <table className="pure-table pure-table-bordered">
                <TableHead table={table} />
                <TableBody table={table} matrix={matrix} />
            </table>
        </div>
    }
}