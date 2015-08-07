
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
import TableSelect from './components/TableSelect.jsx'

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

import {build, handle_visibility, get_table} from './lib/table_utils';
import {register_dispatch, get_dispatcher, del_dispatcher} from './lib/converser';
import {TABLES, fetch_table_previews} from './lib/table_utils';

let Main = React.createClass({
    getInitialState : function () {
        return {
            rtable: get_table("test"),
            visible_table: get_table("test")
        };
    },
    componentDidMount: function () {
        let dispatcher = register_dispatch('app', {
            toggle : [
                (heading, headers) => {
                    console.log('toggle')
                    handle_visibility(
                        this.state.visible_table, this.state.rtable,
                        heading, headers);
                this.forceUpdate();
            }],
            data_change: [
                (tableid) => {
                    console.log('data change')
                    this.setState({
                        rtable:  get_table(tableid),
                        visible_table: get_table(tableid)
                });
            }],
            table_loaded: [
                (tableid) => {
                    /*
                    Data change started table loading which dispatches
                    this event so that table change can be tried again
                     */
                    console.log('table loaded')
                    this.state.dispatcher.data_change(tableid);
                }
            ]
        });
        this.setState({dispatcher: dispatcher});
    },

    componentWillUnmount: function () {
        del_dispatcher('app');
    },
    render: function () {
        return <div>
            <div className="top_header">
                <TableSelect tables={TABLES} initial_table="test" /></div>
            <div className="header_menu">
                <div>Rows</div>
                {this.state.rtable.stub.map((heading, index) => {
                    return <Menu start={index} key={index}
                                 menu={this.state.rtable.levels[heading]}
                                 name={heading}/>
                })}</div>
            <div className="header_menu">
                <div>Columns</div>
                {this.state.rtable.heading.map((heading, index) => {
                    return <Menu start={index} key={index}
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
    let init = false;
    let renderer = () => {
        init = true;
        React.render(<div>
            <h1>React Table Viewer</h1>
            <Main />
        </div>, app);
    };

    // point here is to see if renderer has run once so init is assumed done
    if (init) renderer();
    else fetch_table_previews(renderer);

}

main();
