import lodash from 'lodash';
var _ = lodash;

import React from 'react';
import {generate_headers, PositionChecker} from '../lib/utils';
import {BoxContainer} from './viz';

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
        if (!table) return <div>no table</div>;
        if (!table.matrix) return <div>no matrix</div>;

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

        return <div id="table">
            <table className="pure-table pure-table-bordered">
            <thead>
            {columns}
            </thead>
            <tbody>
            {data}
            </tbody>
        </table></div>;

    }
}

export var HoppingTable = React.createClass({

    render: function () {
        let table = this.props.table;

        // initialize an array of empty arrays for headings
        let columns = _.map(_.range(table.heading.length), () => []);

        // iterate once for each column, headers go into column list as TH elements
        for (let col_index = 0; col_index < table.meta.heading_size; col_index++) {
            _.forEach(
                table.heading_hopper(col_index),
                    (heading, thindex) => {
                    if (heading) {
                        columns[thindex].push(<th key={col_index + '_' + thindex}
                                   colSpan={heading.hop}>{heading.header}</th>);
                    }
            });
        }

        let data = table.matrix.map((row, index) => {

            let row_headings = _.map(
                table.stub_hopper(index),
                (heading, thindex) => {
                    if (heading) {
                        return <th key={index + '_' + thindex}
                                   rowSpan={heading.hop}>
                                {heading.header}</th>;
                    }
            });

            return <tr className={(index % 2) != 0 ? "pure-table-odd" : ""} key={index}>{
                [
                    row_headings,
                    row.map((cell, cindex) => {
                        return <td key={index + '_' + cindex}>
                            {cell}
                        </td>
                    }),
                    this.props.colviz
                    ? <td style={{'borderRight':  '1px solid #cbcbcb'}}
                          className="viz">
                      <BoxContainer row={index} data={table.matrix} />
                      </td>
                    : null
                ]
            }</tr>
        });
        let colviz;
        if (this.props.viz) {
            colviz = <tr>
                <th key={'th1'} colSpan={table.stub.length} />
                {_.times(table.meta.heading_size, (index) => {
                    return <td className="viz"><BoxContainer
                        col={index} data={table.matrix} /></td>
                })}
                <td style={{'borderRight':  '1px solid #cbcbcb'}}></td>
            </tr>;
        } else {
            colviz = null;
        }

        return <div id="table">
            <table className="pure-table pure-table-bordered">
                <thead>
                {
                    columns.map((heading, index) => {
                        if (index==0) {
                            return <tr key={index}>
                                <th key={'th1'} rowSpan={table.heading.length}
                                    colSpan={table.stub.length} />
                                    {heading}
                                {this.props.viz
                                    ? <th key={'th2'}
                                          colSpan={table.stub.length}
                                          rowSpan={table.heading.length}/>
                                    : null}
                            </tr>
                        } else {
                            return <tr key={index}>{heading}</tr>
                        }
                    })
                }
                </thead>
                <tbody>
                {data}
                {colviz}
                </tbody>
            </table></div>;
    }
});
