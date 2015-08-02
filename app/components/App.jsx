
import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count: props.start};
    }
    toggle = function () {
        this.setState({count: this.state.count + 1});
    }.bind(this);

    render() {

      let menu_items = this.props.menu.map((item, index) => {
          return <li onClick={this.toggle} key={index} className="pure-menu-item"><a href="#" className="pure-menu-link">{item}</a></li>
      });

      return <div className="header_menu">
          <h2>{this.state.count}</h2>
          <div className="pure-menu pure-menu-scrollable custom-restricted">
        <a href="#" className="pure-menu-link pure-menu-heading">{this.props.name}</a>

        <ul className="pure-menu-list">
            {menu_items}
        </ul>
      </div></div>;
    }
}
