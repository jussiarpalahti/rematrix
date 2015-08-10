import lodash from 'lodash';
var _ = lodash;

import React from 'react';
import {get_dispatcher} from '../lib/converser';

let Menu = React.createClass({
    getInitialState : function () {
        let hidden_items = {};
        _.map(this.props.menu, (header, index) => {
            if (this.props.visible.indexOf(header) !== -1) {
                hidden_items[header] = false;
            } else {
                hidden_items[header] = true;
            }
        });
        return {
            items : this.props.menu,
            hidden_items: hidden_items
        };
    },

    componentWillReceiveProps: function(nextProps) {
        let hidden_items = {};

        _.map(nextProps.menu, (header, index) => {
            if (this.props.name === nextProps.name && this.state.hidden_items[header]) {
                hidden_items[header] = true;
            } else if (nextProps.visible.indexOf(header) !== -1) {
                hidden_items[header] = false;
            } else {
                hidden_items[header] = false;
            }
        });
        this.setState({
            items : nextProps.menu,
            hidden_items: hidden_items
        });
    },

    toggle : function (item, e) {
        e.preventDefault();
        let newly_hidden = _.clone(this.state.hidden_items);
        if (newly_hidden[item]) {
            newly_hidden[item] = false;
        } else {
            newly_hidden[item] = true;
        }
        this.setState({hidden_items: newly_hidden}, () => {
            get_dispatcher('app').toggle(this.props.name, this.state.hidden_items);
        });
    },

    render: function () {
        let menu_items = this.state.items.map(
            (item, index) => {
                return <li
                    onClick={this.toggle.bind(this, item)} key={index}
                    className="pure-menu-item">
                        <a href="#" className="pure-menu-link">
                        <span>{this.state.hidden_items[item] ? "\u2717" : "\u2713"} </span>{item}</a>
            </li>
      });

      return <div className="header_menu">
          <div className="pure-menu pure-menu-scrollable custom-restricted">
        <a href="#" className="pure-menu-link pure-menu-heading">{this.props.name}</a>

        <ul className="pure-menu-list">
            {menu_items}
        </ul>
      </div></div>;
    }
});

export default Menu;
