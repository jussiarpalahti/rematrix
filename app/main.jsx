
import './stylesheets/pure/pure-min.css';
import './stylesheets/main.css';

import React from 'react';
import {
    MatrixTable,
    HeaderTable,
    HiddenTable
} from './components/matrix_table.jsx';
import App from './components/App.jsx'
import Menu from './components/Menu.jsx';

import lodash from 'lodash';
var _ = lodash;

import {
    Table,
    generate_headers,
    create_header_hopper,
    remove_hidden_from_matrix
} from '../app/lib/utils';
import {
    generate_matrix_headers,
    generate_hidden_check,
    generate_hidden_index
} from '../app/lib/matrix_header';

import {build} from '../app/lib/table_utils';

let Main = React.createClass({

    getInitialState : function () {

        let [rtable, visible_table] = build();

        return {
            rtable: rtable,
            visible_table: visible_table
        };
    },

    render: function () {

        let visibility = (heading, headers) => handle_visibility(
            visible_table, rtable,
            heading, headers);

        return <div>
            <div className="header_menu">
                <div>Rows</div>
                {this.state.rtable.stub.map((heading, index) => {
                    return <Menu change_visibility={visibility} start={index} key={index}
                                 menu={this.state.rtable.levels[heading]}
                                 name={heading}/>
                })}</div>
            <div className="header_menu">
                <div>Columns</div>
                {this.state.rtable.heading.map((heading, index) => {
                    return <Menu change_visibility={visibility} start={index} key={index}
                                 menu={this.state.rtable.levels[heading]}
                                 name={heading}/>
                })}</div>
            <HiddenTable table={this.state.visible_table}/>
        </div>
    }
});

function main() {
    var app = document.createElement('div');
    document.body.appendChild(app);
    React.render(<div>
        <h1>React Table Viewer</h1>
        <Main />
    </div>, app);
}

main();
