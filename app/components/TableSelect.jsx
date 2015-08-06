import lodash from 'lodash';
var _ = lodash;

import React from 'react';
import {get_dispatcher} from '../lib/converser';

let TableSelect = React.createClass({
    getInitialState : function () {
        return {
            chosen_table : this.props.initial_table,
        };
    },
    chooser: function (tableid) {
        this.setState({chosen_table: tableid}, () => {
            get_dispatcher('app').data_change(tableid);
        });
    },
    render: function () {
        let menu_items = [];
        _.forOwn(this.props.tables, (table, tableid) => {
            menu_items.push(
                <li key={tableid} onClick={this.chooser.bind(this, tableid)}
                     className="pure-menu-item">
                    <a href="#" className="pure-menu-link">
                    <span>{
                        this.state.chosen_table === tableid ? '\u2713' : ' '} </span>{tableid}
                </a>
            </li>);
      });

      return <div className="header_menu">
          <div className="pure-menu pure-menu-horizontal">
        <a href="#" className="pure-menu-link pure-menu-heading">Tables</a>

        <ul className="pure-menu-list">
            {menu_items}
        </ul>
      </div></div>;
    }
});

export default TableSelect;
