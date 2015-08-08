import lodash from 'lodash';
var _ = lodash;

import {
    fetch_table_previews
} from './table_utils'

let TableStore = () => {

    let obj = {
        tables: {},
        chosen: {},
        matrix: {}
    };

    obj.get_table = get_table.bind(obj)
    obj.get_fullmeta = get_fullmeta.bind(obj)
    obj.get_fullmeta = get_fullmeta.bind(obj);
    obj.get_fullmeta = get_fullmeta.bind(obj);
    obj._populate_tablestore = _populate_tablestore.bind(obj);
    obj._fetch_matrix = _fetch_matrix.bind(obj);

};

function get_table(tableid) {

}

function set_choices(tableid, choices) {

}

function _fetch_matrix(tableid) {

}

function _populate_tablestore(tableid) {
    let cb = (data) => {
        _.map(data.pxdocs, (table, index) => {
            this.tables[table.name] = table;
        });
    };
    fetch_table_previews(cb);
}
