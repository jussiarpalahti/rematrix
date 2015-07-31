import lodash from 'lodash';
var _ = lodash;

import {
    Table,
    generate_headers,
    create_header_hopper,
    get_cursor_position,
    toggle_header,
    remove_hidden_from_table,
    remove_hidden_from_matrix
} from './utils.js';

export function generate_matrix_headers(table, headers, size) {

    _.forOwn(table.hopper, (hopper, key) => {
        hopper(true);
    });

    let data = [];
    for (var i=0; i < size; i++) {

        let obj = {hop:{}};
        let hop = null;

        headers.map((heading, index) => {

            let hopper = table.hopper[heading];
            let header = hopper();

            if (header) {
                hop = table.meta.hops[heading];
            }
            else {
                header = data[i - 1][heading];
                hop = null;
            }

            obj[heading] = header;
            obj['hop'][heading] = hop;
        });
        data.push(obj);
    }
    return data;
}

export function generate_hidden_check(headers, hiding_queries) {
    /*
    Generates a helper function that tells if a given header
    is hidden.
    hidden argument is a list of query objects, with header
    values set for any necessary headings:
        [{level1: value1}, {level2: value2}]
    Query is all inclusive, all matching objects are removed
    */
    let hidden_headers = hiding_queries.reduce((hidden_headers, hide_query) => {
        return _.where(hidden_headers, hide_query);
    }, headers);

    return (header) => {
        console.log(headers)
        console.log(hidden_headers)
        return hidden_headers.indexOf(header) !== -1;
    }
}
