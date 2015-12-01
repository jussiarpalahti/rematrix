
import * as React from "react";
import {get_table} from "../lib/table";

interface Props {
    [name: string]: string,
}

interface TableProps {
    table: any;
    matrix?: any;
}

function get_dimensions(table, matrix): any {
    /*
    Available data determines table size
    */
    let width = matrix[0].length < table.heading.size ? matrix[0].length : table.heading.size;
    let height = matrix.length < table.stub.size ? matrix.length : table.stub.size;

    return {height, width};
}

class TableHead extends React.Component<TableProps, {}> {
    render () {
        let {table, matrix} = this.props;

        let {_, width} = get_dimensions(table, matrix);

        let resp = table.heading.hop.map(
            (hopper, index) => {
                let row = [];
                for (let i=0; i < width; i++) {
                    let header = hopper();
                    if (header) {
                        row.push(
                            <th key={"head" + index + i} colSpan={table.heading.hops[index]}>{header}</th>)
                    }
                    }
                if (index == 0) {
                    return <tr key={index}>
                        <th
                            className="centered"
                            colSpan={table.stub.headers.length}
                            rowSpan={table.heading.headers.length}>

                        </th>
                        {row}
                    </tr>
                } else {
                    return <tr key={index}>{row}</tr>;
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

        let {height, width} = get_dimensions(table, matrix);

        for (let row=0; row < height; row++) {
            let data = [];
            for (let col=0; col < width; col++) {
                data.push(
                    <td key={"heading" + row + col}>{matrix[row][col]}</td>
                );
            }
            resp.push(<tr key={row}>
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
                <TableHead table={table} matrix={matrix} />
                <TableBody table={table} matrix={matrix} />
            </table>
        </div>
    }
}