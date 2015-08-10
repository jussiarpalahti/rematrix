import lodash from 'lodash';
var _ = lodash;

import {
    fetch_table_previews,
    FullTable,
    get_preview_table_levels,
    load_matrix,
    TABLES
} from './table_utils'

import {
    get_matrix_mask,
    get_header_from_pos
} from './matrix_header';

export function TableStore() {

    let obj = {
        _sentinel: false,
        tables: {},
        _listeners: []
    };
    obj.is_open = function () {
        return !this._sentinel;
    }.bind(obj);
    obj.get_table = get_table.bind(obj)
    obj.get_list = get_list.bind(obj);
    obj.set_choices = set_choices.bind(obj);
    obj.on_change = on_change.bind(obj);
    obj._populate_tablestore = populate_tables.bind(obj);
    obj._fetch_matrix = fetch_matrix.bind(obj);
    obj._call_listeners = call_listeners.bind(obj);

    return obj;
}

function get_table(tableid) {
    let table = this.tables[tableid];

    let row_positions = JSON.stringify(table.stub_mask);
    let column_positions = JSON.stringify(table.heading_mask);
    let table_baseurl = table.url.split("?", 1);
    let new_table_url = table_baseurl + `?rows=${row_positions}&cols=${column_positions}`;
    if (new_table_url === table.url) {
        return table;
    } else {
        table.url = new_table_url;
    }

    if (table.matrix) {
        if (table.preview) {
            let preview_levels = get_preview_table_levels(FullTable(table), 10);
            table = FullTable(table, preview_levels);
            table.preview = false;
            this.tables[tableid] = table;
        } else {
            if (this._sentinel) return null;
            if (!table.url) return null;
            // table layout might might have changed, request new matrix
            this._fetch_matrix(table);
            return null;
        }
        return table;
    } else {
        if (this._sentinel) return null;
        if (!table.url) return null;
        this._fetch_matrix(table);
        return null;
    }
}

function get_list(cb) {
    if (!this._sentinel && _.isEmpty(this.tables)) {
        this._populate_tablestore();
        return null;
    } else {
        return this.tables;
    }
}

function set_choices(table, heading, headers) {
    let new_levels = _.clone(table.levels);
    new_levels[heading] = headers;
    console.log("store levelled", new_levels);
    let new_table = FullTable(table, new_levels);
    console.log("table renewed", new_table);
    this.tables[table.name] = new_table;
    this._call_listeners();
}

function fetch_matrix(table) {
    if (this._sentinel) return null;
    else this._sentinel = true;
    load_matrix(
        table,
        (data) => {
            if (data.matrix.length === table.stub_mask.length) {
                this._sentinel = false;
            } else {
                return null;
            }
            this.tables[table.name].matrix = data.matrix;
            this._call_listeners();
        }
    );
}

function populate_tables() {
    // network operation in progress
    if (this._sentinel) return null;
    //this.tables.test = FullTable(TABLES.test);
    //this.tables.test.preview = true;
    this._sentinel = true;
    let cb = (data) => {
        _.map(data, (table, index) => {
            this.tables[table.name] = FullTable(table);
        });
        this._sentinel = false;
        this._call_listeners();
    };
    fetch_table_previews(cb);
}

function on_change(cb) {
    this._listeners.push(cb);
}

function call_listeners() {
    _.map(this._listeners, (listener) => {
        listener()
    });
}
