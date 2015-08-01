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

    TODO: find out why trying to add to an array during reduce fails
    */

    let hidden_headers = _.flatten(
        hiding_queries.map((hide_query) => {
            return _.where(headers, hide_query);
        })
    );

    return (header) => {
        return _.where(hidden_headers, header).length > 0;
    }
}

export function generate_hidden_index(original_headers, visible_headers) {
    /*
    Goes through all headers and returns their index position
    if the header is in visible_headers
    This means that for this index all cells on this point of the axis
    can be used in the matrix
     */
    return original_headers.map((header, index) => {
       if (visible_headers.indexOf(header) !== -1) {
           return index;
       }
    });
}