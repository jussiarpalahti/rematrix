import lodash from 'lodash';
var _ = lodash;

import React from 'react';
import {get_dispatcher} from '../lib/converser';

let TableSelect = React.createClass({
    nogetInitialState : function () {
        return {
            chosen_table : this.props.chosen_table
        };
    },
    componentWillReceiveProps: function(nextProps) {
        console.log("setting table select state",
            this.props.chosen_table,
            nextProps.chosen_table)
    },
    chooser: function (tableid, ev) {
        ev.preventDefault();
        this.props.on_change(tableid);
    },
    render: function () {
        let menu_items = [];
        _.forOwn(this.props.tables, (table, tableid) => {
            menu_items.push(
                <li key={tableid} onClick={this.chooser.bind(this, tableid)}
                     className="pure-menu-item">
                    <a href="#" className="pure-menu-link">
                    <span>
                        {this.props.chosen_table === tableid ? '\u2713' : ' '} </span>
                        {table.title}
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
