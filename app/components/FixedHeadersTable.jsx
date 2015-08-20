import lodash from 'lodash';
var _ = lodash;

import React from 'react';

require('css.escape');

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

    place: function () {
        let places = {};
        return (key, val) => {
            if (key) {
                places[key] = val;
                return places;
            }
            else return places;
        }
    }(),


    componentDidUpdate: function () {

    },

    componentDidMount:  function () {

    },

    save_dimensions: function(node, heading, index, thindex, axis) {

        let styles = window.getComputedStyle(node);

        let key = `${axis}_${heading.heading}_${heading.header}_${index}_${thindex}`;

        let escaped_key = CSS.escape(key);
        node.id = escaped_key;

        //console.log({
        //    axis: axis,
        //    heading: heading.heading,
        //    header: heading.header,
        //    index: index,
        //    thindex: thindex,
        //    node: node,
        //    cell_index: node.cellIndex,
        //    height: styles.getPropertyValue('height'),
        //    width: styles.getPropertyValue('width'),
        //    place: this.place().length
        //});

        this.place(escaped_key, {
            height: styles.getPropertyValue('height'),
            width: styles.getPropertyValue('width')
        });
    },

    render: function () {
        let table = this.props.table;
        return <div>
            <div id="heading" className="pos">
                <table className="pure-table pure-table-bordered">
                    <ColumnHeaders table={table} skip_data={true} />
                </table></div>
            <div id="stub" className="pos">
                <table className="pure-table pure-table-bordered">
                    <DataCells table={table} skip_data={true} />
                </table></div>
            <div id="cells" className="pos">
            <table className="pure-table pure-table-bordered">
                <ColumnHeaders table={table} save_dimensions={this.save_dimensions} />
                <DataCells table={table} save_dimensions={this.save_dimensions} />
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
                        let col;
                        if (this.props.save_dimensions) {
                            col = <th key={col_index + '_' + thindex}
                                colSpan={heading.hop}
                                ref={
                                (component) => {
                                let node = React.findDOMNode(component);
                                (node!==null) && (node.style!==null)
                                ? this.props.save_dimensions(
                                    node, heading, col_index, thindex, 'heading')
                                : '';
                                }
                            }>{heading.header}
                                <Dimension table={table} spaces={this.props.spaces} />
                            </th>
                        } else {
                            col = <th key={col_index + '_' + thindex}
                                      colSpan={heading.hop}>
                                {heading.header}
                                </th>
                        }
                        columns[thindex].push(col);
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
                        <img src="/app/stylesheets/empty.png" />
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

let RowHeader = function (table, index, save_dimensions, spaces) {
    return _.map(
        table.stub_hopper(index),
        (heading, thindex) => {
            if (heading) {
                if (save_dimensions) {
                    return <th
                        key={index + '_' + thindex}
                        rowSpan={heading.hop}
                        ref={function(component){
                        let node = React.findDOMNode(component);
                        (node!==null) && (node.style!==null)
                        ? save_dimensions(node, heading, index, thindex, 'stub')
                        : '';
                        }}>
                        {heading.header}
                        <Dimension table={table} spaces={spaces} />
                    </th>;
                } else {
                    return <th
                        key={index + '_' + thindex}
                        rowSpan={heading.hop}>
                        {heading.header}
                        </th>;
                }
            }
            else return null;
        });
};

export var DataCells = React.createClass({
    render: function () {
        let table = this.props.table;
        return <tbody>{
            table.matrix.map((row, index) => {
            return <tr
                className={(index % 2) != 0 ? "pure-table-odd" : ""}
                key={index}>
                {
                    [
                        RowHeader(table, index, this.props.save_dimensions),
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

export var Dimension = React.createClass({
    render: function () {
        return <img src="/app/stylesheets/empty.png" />
    }
});
