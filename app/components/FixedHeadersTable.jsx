import lodash from 'lodash';
var _ = lodash;

import React from 'react';

export var FixedHeadersTable = React.createClass({

    render: function () {

    }

});

let RowHeader = React.createClass({
    render: function () {
        return _.map(
            this.props.table.stub_hopper(this.props.index),
            (heading, thindex) => {
                if (heading) {
                    return <th key={index + '_' + thindex}
                               rowSpan={heading.hop}>
                        {heading.header}</th>;}
                else return null;
        });
    }
});

export var ColumnHeaders = React.createClass({
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
        return columns;
    }
});

export var DataCells = React.createClass({
    render: function () {
        let table = this.props.table;
        return table.matrix.map((row, index) => {
            return <tr className={(index % 2) != 0 ? "pure-table-odd" : ""} key={index}>{
                [
                    <RowHeader table={table} index={index} />,
                    row.map((cell, cindex) => {
                        return <td key={index + '_' + cindex}>
                            {cell}
                        </td>
                    })
                ]
            }</tr>
        });
    }
});
