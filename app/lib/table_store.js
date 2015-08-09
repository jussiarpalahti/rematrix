import lodash from 'lodash';
var _ = lodash;

import {
    fetch_table_previews,
    FullTable
} from './table_utils'

import {
    get_matrix_mask
} from './matrix_header';

let TableStore = () => {

    let obj = {
        _sentinel: false,
        active_table: null,
        tables: {},
        chosen: {},
        matrix: {},
        listeners: []
    };
    obj.get_table = get_table.bind(obj)
    obj.get_list = get_list.bind(obj);
    obj.set_choices = set_choices.bind(obj);
    obj.on_change = on_change.bind(obj);
    obj._populate_tablestore = populate_tables.bind(obj);
    obj._fetch_matrix = fetch_matrix.bind(obj);
    obj._call_listeners = call_listeners.bind(obj);
    obj._get_preview_table = get_preview_table.bind(obj);
};

function get_table(tableid) {
    if (this.active_table === tableid) return this.chosen[tableid];
    else if (!this.chosen[tableid]) {
        this.chosen[tableid] = this._get_preview_table(tableid);
    } else {
        this.active_table = tableid;
    }
    this._call_listeners();
    return this.chosen[tableid]
}

function get_list(cb) {
    if (this.tables.length === 0) {
        this._populate_tablestore();
        return null;
    } else {
        return this.tables;
    }
}

function set_choices(choices) {
    let table = this.tables[this.active_table];
    let new_levels = {};
    this.chosen[table.name] = FullTable(table, new_levels);
    this._call_listeners();
}

function fetch_matrix(tableid) {

}

function populate_tables() {
    this._sentinel = true;
    let cb = (data) => {
        _.map(data.pxdocs, (table, index) => {
            this.tables[table.name] = table;
        });
        this.sentinel = false;
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

function get_preview_table (tableid) {

}
