import lodash from 'lodash';
var _ = lodash;

import React from 'react';

import jQuery from 'jquery';
var $ = jQuery;

let hashCode = function(s) {
    let hash = 0, i, chr, len;
    if (s.length == 0) return hash;
    for (i = 0, len = s.length; i < len; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
let get_key = function (heading, index, thindex) {
    let basekey = `stub_${heading.heading}_${heading.header}_${index}_${thindex}`
    return 'key_' + hashCode(basekey);
};

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

    componentDidMount:  function () {
        console.log("component mounted");
        let style = $('#places');
        let places = [];
        _.forOwn(this.place(), (dimensions, key) => {
            let width = dimensions.width ? `max-width: ${dimensions.width};` : '';
            let height = dimensions.height ? `max-height: ${dimensions.height};` : '';
            places.push(`#${key} div {${width} ${height} }\n`);
            places.push(`#${key} {${width} ${height} }\n`);
        });
        let base_topleftcorner = $('#cells .topleftcorner');
        let base_width = base_topleftcorner.width();
        let base_height = base_topleftcorner.height();
        places.push(
            `#heading .topleftcorner div, #stub .topleftcorner div {width: ${base_width}px; height: ${base_height}px;}`
        );
        if (style) style.text(places.join(" "));
    },

    componentDidUpdate: function () {
        console.log("component update");
        let style = $('#places');
        let places = [];
        _.forOwn(this.place(), (dimensions, key) => {
            let width = dimensions.width ? `width: ${dimensions.width};` : '';
            let height = dimensions.height ? `height: ${dimensions.height};` : '';
            places.push(`#${key} div {${width} ${height} }\n`);
            places.push(`#${key} {${width} ${height} }\n`);
        });
        let base_topleftcorner = $('#cells .topleftcorner');
        let base_width = base_topleftcorner.width();
        let base_height = base_topleftcorner.height();
        places.push(
            `#heading .topleftcorner div, #stub .topleftcorner div {width: ${base_width}px; height: ${base_height}px;}`
        );
        if (style) style.text(places.join(" "));
    },

    save_dimensions: function(node, heading, index, thindex, axis, key) {

        let styles = window.getComputedStyle(node);

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

        this.place(key, {
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
                    <thead><tr><th className="topleftcorner centered"
                                         key={'stub_th1'} rowSpan={table.heading.length}
                                         colSpan={table.stub.length}><div>placeholder</div></th></tr>
                    </thead>
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
                        let key = get_key(heading, col_index, thindex);
                        if (this.props.save_dimensions) {
                            col = <th key={col_index + '_' + thindex}
                                colSpan={heading.hop}
                                ref={
                                (component) => {
                                let node = React.findDOMNode(component);
                                (node!==null) && (node.style!==null)
                                ? this.props.save_dimensions(
                                    node, heading, col_index, thindex, 'heading', key)
                                : '';
                                }
                            }><div>{heading.header}</div>
                            </th>
                        } else {
                            col = <th
                                id={key}
                                key={col_index + '_' + thindex}
                                colSpan={heading.hop}>
                                <div>{heading.header}</div>
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
                    <th className="topleftcorner centered"
                        key={'th1'} rowSpan={table.heading.length}
                        colSpan={table.stub.length}><div></div>
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
                let key = get_key(heading, index, thindex);
                if (save_dimensions) {
                    return <th
                        key={index + '_' + thindex}
                        rowSpan={heading.hop}
                        ref={function(component){
                        let node = React.findDOMNode(component);
                        (node!==null) && (node.style!==null)
                        ? save_dimensions(node, heading, index, thindex, 'stub', key)
                        : '';
                        }}>
                        <div>{heading.header}</div>
                    </th>;
                } else {
                    return <th
                        id={key}
                        key={index + '_' + thindex}
                        rowSpan={heading.hop}>
                        <div>{heading.header}</div>
                        </th>;
                }
            }
            else return null;
        });
};

export var DataCells = React.createClass({
    render: function () {
        let table = this.props.table;
        return <tbody>
            {
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
