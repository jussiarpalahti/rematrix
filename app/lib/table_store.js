import lodash from 'lodash';
var _ = lodash;

import {
    fetch_table_previews
} from './table_utils'

let TableStore = () => {

    let obj = {
        _sentinel: false,
        tables: {},
        chosen: {},
        matrix: {},
        listeners: []
    };
    obj.get_table = get_table.bind(obj)
    obj.get_fullmeta = get_fullmeta.bind(obj)
    obj.get_fullmeta = get_fullmeta.bind(obj);
    obj.get_fullmeta = get_fullmeta.bind(obj);
    obj._populate_tablestore = populate_tablestore.bind(obj);
    obj._fetch_matrix = fetch_matrix.bind(obj);
    obj._call_listeners = call_listeners.bind(obj);
    obj._on_change = on_change.bind(obj);
};

function get_table(tableid) {

}

function get_list(cb) {
    if (this.sentinel && this.tables.length === 0) {
        return null;
    } else {
        return this.tables;
    }
}

function set_choices(tableid, choices) {

}

function fetch_matrix(tableid) {

}

function populate_tablestore(tableid) {
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
