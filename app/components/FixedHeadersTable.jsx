import lodash from 'lodash';
var _ = lodash;

import React from 'react';

export var FullTable = React.createClass({
    render: function () {
        let table = this.props.table;
        return <div id="datatable">
            <table className="pure-table pure-table-bordered">
                <thead>
                <ColumnHeaders table={table} />
                </thead>
                <tbody>
                <DataCells table={table} />
                </tbody>
            </table></div>;
    }
});

export var FixedHeadersTable = React.createClass({
    render: function () {
        let table = this.props.table;
        return <div>
            <div id="heading" className="pos">
                <table className="pure-table pure-table-bordered">
                    <ColumnHeaders table={table} />

                </table></div>
            <div id="stub" className="pos">
                <table className="pure-table pure-table-bordered">
                    <DataCells table={table} skip_data={true} />
                </table></div>
            <div id="cells" className="pos">
            <table className="pure-table pure-table-bordered">
                <ColumnHeaders table={table} />
                <DataCells table={table} />
            </table></div>
            </div>;
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

        return <thead>{
            columns.map((heading, index) => {
            if (index==0) {
                return <tr key={index}>
                    <th className="centered"
                        key={'th1'} rowSpan={table.heading.length}
                        colSpan={table.stub.length}>
                    </th>
                    {heading}
                </tr>
            } else {
                return <tr key={index}>{heading}</tr>
            }
            })
        }</thead>;

    }
});

let RowHeader = function (table, index) {
    return _.map(
        table.stub_hopper(index),
        (heading, thindex) => {
            if (heading) {
                return <th key={index + '_' + thindex}
                           rowSpan={heading.hop}>
                    {heading.header}</th>;}
            else return null;
        });
};

export var DataCells = React.createClass({
    render: function () {
        let table = this.props.table;
        return <tbody>{
            table.matrix.map((row, index) => {
            return <tr className={(index % 2) != 0 ? "pure-table-odd" : ""} key={index}>{
                [
                    RowHeader(table, index),
                    this.props.skip_data
                    ? null
                    : row.map((cell, cindex) => {
                        return <td key={index + '_' + cindex}>
                            {cell}
                        </td>})
                ]
            }</tr>
            })
        }</tbody>;
    }
});
