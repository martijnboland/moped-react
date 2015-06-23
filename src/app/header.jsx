import React from 'react';
import Reflux from 'reflux';
import actions from './actions';

let Header = React.createClass({
  toggleSidebar(e) {
    e.preventDefault();
    actions.toggleSidebar();
  },
  goBack(e) {
    e.preventDefault();
    window.history.back();
  },
  render() {
    let backButton;
    if (this.props.isBackVisible) {
      backButton = <a href="#" onClick={this.goBack}>Back</a>;
    } else {
      backButton = null;
    }
    return (
      <header>
        <button type="button" className={"navbar-toggle" + (this.props.isSidebarVisibleForMobile ? " outtaway" : "")} data-toggle="collapse" onClick={this.toggleSidebar}>
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <div className="title-bar">
          <div className="pull-right">
            Status: {this.props.connectionState}
          </div>
          <div className="pull-right "></div>
          {backButton}
          <a href="#">Home</a>
        </div>
      </header>
    )
  }
});

export default Header;