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

    componentWillReceiveProps: function(nextProps) {
        console.log('table changed, stretching');
        this.stretch_window();
    },

    place: function () {
        let places = {};
        return (key, val) => {
            if (key==='reset') {
                places = {};
                return;
            }
            if (key) {
                places[key] = val;
                return places;
            }
            else return places;
        }
    }(),

    stretch_window: function () {
        let stretch_width;
        let stretch_height;
        let table_width = $('#cells table').width();
        let table_height = $('#cells table').height();
        let window_height = $(window).height();
        let window_width = $(window).width();
        let visible_width = $('#cells').width();
        let visible_height = $('#cells').height();
        stretch_width = table_width + window_width - visible_width;
        stretch_height = table_height + window_height - visible_height;
        $('#tablesizer').css({
            width: stretch_width + 5,
            height: stretch_height + 5,
            'z-index' : 0
        });
    },

    update_dimensions: function () {
        console.log('update dimensions');
        // Stretch document to data table's dimensions
        this.stretch_window();

        // Get sizes for th elements and push them to style list
        let style = $('#places');
        let places = [];
        _.forOwn(this.place(), (val, key) => {
            let node = document.getElementById('cell_' + key);
            let styles = window.getComputedStyle(node);
            let width_prop = styles.getPropertyValue('width');
            let height_prop = styles.getPropertyValue('height');
            let width = width_prop ? `width: ${width_prop};` : '';
            let height = height_prop ? `height: ${height_prop};` : '';

            places.push(`#${key} div {${width} ${height} }\n`);
            places.push(`#${key} {${width} ${height} }\n`);
        });

        // Table's empty top left corner size needs to be identical also
        let base_topleftcorner = $('#cells .topleftcorner');
        let styles = window.getComputedStyle(base_topleftcorner[0]);
        let width_prop = styles.getPropertyValue('width');
        let height_prop = styles.getPropertyValue('height');
        places.push(
            `#heading .topleftcorner div, #stub .topleftcorner div {width: ${width_prop}; height: ${height_prop};}`
        );

        // Apply dimensions as document level style element
        if (style) style.text(places.join(" "));
    },

    componentWillMount: function () {
        this.place('reset');
    },

    componentWillUpdate: function () {
        this.place('reset');
    },

    componentDidMount:  function () {
        console.log("component mounted");
        window.requestAnimationFrame(() => {
            this.mount_scroller();
            this.update_dimensions()
        });
    },

    componentDidUpdate: function () {
        console.log("component update");
        window.requestAnimationFrame(() => {
            this.mount_scroller();
            this.update_dimensions()
        });
    },

    mount_scroller: function () {
        $(window).off('scroll');
        $(window).scroll(function (ev) {
            let heading = $('#heading');
            let stub = $('#stub');
            let cells = $('#cells');
            return (ev) => {
                var top = ev.currentTarget.scrollY;
                var left = ev.currentTarget.scrollX;
                requestAnimationFrame(() => {
                    heading.scrollLeft(left);
                    stub.scrollTop(top);
                    cells.scrollTop(top).scrollLeft(left);
                });
            };
        }());
        $(window).off('resize');
        $(window).resize((ev) => {
            this.stretch_window();
        });
    },

    save_dimensions: function(node, heading, index, thindex, axis, key) {

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

        this.place(key, node);
    },

    render: function () {
        let table = this.props.table;
        return <div>
            <div id="cells" className="pos">
                <table className="pure-table pure-table-bordered">
                    <ColumnHeaders table={table} save_dimensions={this.save_dimensions} />
                    <DataCells table={table} save_dimensions={this.save_dimensions} />
                </table></div>
            <div id="heading" className="pos">
                <table className="pure-table pure-table-bordered">
                    <ColumnHeaders table={table} skip_data={true} />
                </table></div>
            <div id="stub" className="pos">
                <table className="pure-table pure-table-bordered">
                    <thead><tr><th className="topleftcorner centered"
                                   key={'stub_th1'}
                                   rowSpan={table.heading.length}
                                   colSpan={table.stub.length}>
                        <div>placeholder</div>
                    </th></tr>
                    </thead>
                    <DataCells table={table} skip_data={true} />
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
                            col = <th
                                key={col_index + '_' + thindex}
                                id={'cell_' + key}
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
                        id={'cell_' + key}
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
