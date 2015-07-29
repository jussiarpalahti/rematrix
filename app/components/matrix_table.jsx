
import React from 'react';
import {generate_headers, PositionChecker} from '../lib/utils';

export default class MatrixTable extends React.Component {

    render() {
        let table = this.props.table;

        // TODO: we reset since React Hot Loader regards hoppers as state to be preserved
        for (let key in table.hopper) table.hopper[key](true);

        let column_headings = table.heading.map((heading, index) => {
            let header;
            let resp = [];
            let hopper = table.hopper[heading];

            for (var i=0; i < table.meta.heading_size; i++) {
                header = hopper();
                if (header) {
                    resp[resp.length] = <th colSpan={ table.meta.hops[heading] }>{header}</th>;
                }
            }
            if (index === 0) {
                return <tr><th rowSpan={table.heading.length} colSpan={table.stub.length} />{resp}</tr>
            } else {
                return <tr>{resp}</tr>;
            }
        });

        let data = table.matrix.map((row, index) => {

            let row_heading = table.stub.map((heading, index) => {
                let header;
                let hopper = table.hopper[heading];

                header = hopper();
                if (header) {
                    return <th rowSpan={ table.meta.hops[heading] }>{header}</th>;
                } else {
                    return null;
                }
            });

            return <tr key={index}>{
                [
                    row_heading,
                    row.map((cell, cindex) => {
                        return <td key={index + '_' + cindex}>
                            {cell}
                        </td>})
                ]
            }</tr>
        });

        return <table>
            <thead>
                {column_headings}
            </thead>
            <tbody>
            {data}
            </tbody>
        </table>;
    }
}
