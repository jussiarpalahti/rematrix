import lodash from 'lodash';
var _ = lodash;

import React from 'react';

let App = React.createClass({
    getInitialState : function () {
        return {
            items : this.props.menu,
            hidden_items: {}
        };
    },

    toggle : function (item) {
        let newly_hidden = _.clone(this.state.hidden_items);
        newly_hidden[item] = newly_hidden[item] ? false : true;
        this.setState({hidden_items: newly_hidden});
    },

    render: function () {

      let menu_items = this.props.menu.map((item, index) => {
          return <li onClick={this.toggle.bind(this, item)} key={index} className="pure-menu-item"><a href="#" className="pure-menu-link">
            <span>{this.state.hidden_items[item] ? "\u2718" : "\u2713"} </span>{item}
          </a></li>

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

export default App;
