import lodash from 'lodash';
var _ = lodash;

import {
    fetch_table_previews,
    FullTable,
    get_preview_table_levels,
    load_matrix
} from './table_utils'

import {
    get_matrix_mask,
    get_header_from_pos
} from './matrix_header';

let TableStore = () => {

    let obj = {
        _sentinel: false,
        tables: {},
        listeners: []
    };
    obj.get_table = get_table.bind(obj)
    obj.get_list = get_list.bind(obj);
    obj.set_choices = set_choices.bind(obj);
    obj.on_change = on_change.bind(obj);
    obj._populate_tablestore = populate_tables.bind(obj);
    obj._fetch_matrix = fetch_matrix.bind(obj);
    obj._call_listeners = call_listeners.bind(obj);
};

function get_table(tableid) {
    let table = this.tables[tableid];
    if (table.matrix) return table;
    else {
        this._fetch_matrix(tableid);
    }
}

function get_list(cb) {
    if (this.tables.length === 0) {
        this._populate_tablestore();
        return null;
    } else {
        return this.tables;
    }
}

function set_choices(tableid, choices) {
    let table = this.tables[tableid];

    let new_levels = {};
    this.tables[tableid] = FullTable(table, new_levels);
    this._call_listeners();
}

function fetch_matrix(tableid) {
    load_matrix(
        this.tables[tableid],
        (matrix) => {
            let table = this.tables[tableid];
            table.matrix = matrix;
            this._call_listeners();
        }
    );
}

function populate_tables() {
    // network operation in progress
    if (this._sentinel) return null;

    this._sentinel = true;
    let cb = (data) => {
        _.map(data.pxdocs, (table, index) => {
            let preview_levels = get_preview_table_levels(table);
            this.tables[table.name] = FullTable(table, preview_levels);
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
    _.map(this.listeners, (listener) => listener());
}
