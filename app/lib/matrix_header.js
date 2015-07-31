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

        let obj = {};
        let hop = null;

        headers.map((heading, index) => {

            let hopper = table.hopper[heading];

            let header = hopper();

            if (header) {
                hop = table.meta.hops[heading];
            }
            else {
                header = data[i - 1][heading].header;
                hop = null;
            }

            obj[heading] = {
                header: header,
                hop: hop
            };
        });

        data.push(obj);
    }
    return data;
}
