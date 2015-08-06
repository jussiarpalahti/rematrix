import lodash from 'lodash';
var _ = lodash;

import React from 'react';
import {get_dispatcher} from '../lib/converser';

let TableSelect = React.createClass({
    chooser: (tableid) => {},
    render: function () {
        let menu_items = [];
        _.forOwn(this.props.tables, (table, tableid) => {
            console.log("taulu", table)
            console.log("tauluid", tableid)
            menu_items.push(
                <li onClick={this.chooser.bind(this, tableid)}
                     className="pure-menu-item">
                    <a href="#" className="pure-menu-link">
                    <span>{
                        this.props.chosen_table === tableid ? '\u2713' : ''} </span>{tableid}
                </a>
            </li>);
      });

      return <div className="header_menu">
          <div className="pure-menu pure-menu-scrollable custom-restricted">
        <a href="#" className="pure-menu-link pure-menu-heading">Taulukot</a>

        <ul className="pure-menu-list">
            {menu_items}
        </ul>
      </div></div>;
    }
});

export default TableSelect;
