import lodash from 'lodash';
var _ = lodash;

import React from 'react';
import {generate_headers, PositionChecker} from '../lib/utils';

export class MatrixTable extends React.Component {

    render() {
        let table = this.props.table;

        // TODO: we reset since React Hot Loader regards hoppers as state to be preserved
        _.forOwn(table.hopper, (hopper, key) => {
            hopper(true);
        });

        let column_headings = table.heading.map((heading, index) => {
            let header;
            let resp = [];
            let hopper = table.hopper[heading];

            for (var i=0; i < table.meta.heading_size; i++) {
                header = hopper();
                if (header) {
                    resp[resp.length] = <th key={index + i} colSpan={ table.meta.hops[heading] }>{header}</th>;
                }
            }
            if (index === 0) {
                return <tr key={index}><th rowSpan={table.heading.length} colSpan={table.stub.length} />{resp}</tr>
            } else {
                return <tr key={index}>{resp}</tr>;
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

            return <tr className={(index % 2) != 0 ? "pure-table-odd" : ""} key={index}>{
                [
                    row_heading,
                    row.map((cell, cindex) => {

                        return <td key={index + '_' + cindex}>
                            {cell}
                        </td>})
                ]
            }</tr>
        });

        return <table className="pure-table pure-table-bordered">
            <thead>
                {column_headings}
            </thead>
            <tbody>
            {data}
            </tbody>
        </table>;
    }
}

export class HeaderTable extends React.Component {

    render() {
        let table = this.props.table;

        let column_headings = table.heading_headers.map((header, index) => {
            return table.heading.map((heading) => {

                if (header.hop[heading]) {
                    return <th key={index} colSpan={header.hop[heading]}>
                        {header[heading]}</th>;
                }
            });
        });

        // NOTE: column_headings is at this point a list of lists of th elements which must be divided into rows
        let columns = _.zip.apply({}, column_headings).map((row, index) => {
            if (index==0) {
                return <tr key={index}>
                    <th rowSpan={table.heading.length} colSpan={table.stub.length} />
                    {row}
                </tr>
            } else {
                return <tr key={index}>{row}</tr>
            }
        });

        let data = table.matrix.map((row, index) => {

            let row_heading = table.row_headers[index];

            let row_headings = table.stub.map((heading, thindex) => {

                let header = row_heading[heading];

                if (row_heading.hop[heading]) {

                    let elem = <th key={index + '_' + thindex}
                                   rowSpan={row_heading.hop[heading]}>
                        {header}</th>;

                    return elem;
                }
            });

            return <tr className={(index % 2) != 0 ? "pure-table-odd" : ""} key={index}>{
                [
                    row_headings,
                    row.map((cell, cindex) => {
                        return <td key={index + '_' + cindex}>
                            {cell}
                        </td>

                    })
                ]
            }</tr>
        });

        return <table className="pure-table pure-table-bordered">
            <thead>
            {columns}
            </thead>
            <tbody>
            {data}
            </tbody>
        </table>;

    }
}

export class HiddenTable extends React.Component {

    render() {
        let table = this.props.table;

        let column_headings = table.heading_headers.map((header, index) => {
            return table.heading.map((heading) => {

                if (header.hop[heading]) {
                    return <th key={index} colSpan={header.hop[heading]}>
                        {header[heading]}</th>;
                }
            });
        });

        // NOTE: column_headings is at this point a list of lists of th elements which must be divided into rows
        let columns = _.zip.apply({}, column_headings).map((row, index) => {
            if (index==0) {
                return <tr key={index}>
                    <th rowSpan={table.heading.length} colSpan={table.stub.length} />
                    {row}
                </tr>
            } else {
                return <tr key={index}>{row}</tr>
            }
        });

        let data = table.matrix.map((row, index) => {

            let row_heading = table.row_headers[index];

            let row_headings = table.stub.map((heading, thindex) => {
                let header = row_heading[heading];
                if (row_heading.hop[heading]) {
                    let elem = <th key={index + '_' + thindex}
                                   rowSpan={row_heading.hop[heading]}>
                        {header}
                    </th>;
                    return elem;
                }
            });

            return <tr className={(index % 2) != 0 ? "pure-table-odd" : ""} key={index}>{
                [
                    row_headings,
                    row.map((cell, cindex) => {
                        return <td key={index + '_' + cindex}>
                            {cell}
                        </td>
                    })
                ]
            }</tr>
        });

        return <table className="pure-table pure-table-bordered">
            <thead>
            {columns}
            </thead>
            <tbody>
            {data}
            </tbody>
        </table>;

    }
}