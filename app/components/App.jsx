
import React from 'react';

export default class App extends React.Component {

    render() {

      let menu_items = this.props.menu.map((item, index) => {
          return <li key={index} className="pure-menu-item"><a href="#" className="pure-menu-link">{item}</a></li>
      });

      return <div className="pure-menu pure-menu-scrollable custom-restricted">
        <a href="#" className="pure-menu-link pure-menu-heading">My first menu</a>
        <ul className="pure-menu-list">
            {menu_items}
        </ul>
      </div>;
    }
}
