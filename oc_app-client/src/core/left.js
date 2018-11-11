import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";

import "./left.less";

export const Left = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Left",
    classNames: {
      main: Config.CSS + "left"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    routes: PropTypes.shape()
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      routes: {}
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getItems(routes) {
    return routes && Object.keys(routes).map(route => {
      return { code: route, content: routes[route].content, itemList: this._getItems(routes[route].itemList) };
    });
  },

  _onClick(component) {
    UU5.Environment.setRoute(component.code);
  },

  _openTab(component) {
    let url = UU5.Common.Url.parse().setUseCase(component.code).toString();
    window.open(url, "_blank");
  },

  _onClickHome() {
    UU5.Environment.setRoute("home");
  },

  _openTabHome(component) {
    this._openTab({ code: "home" });
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Div className="center">
          <UU5.Bricks.Link onClick={this._onClickHome} onWheelClick={this._openTabHome} onCtrlClick={this._openTabHome}>
            <UU5.Bricks.Image name="Logo" responsive src="assets/logo.png" />
          </UU5.Bricks.Link>
        </UU5.Bricks.Div>

        <Plus4U5.App.Menu
          items={this._getItems(this.props.routes)}
          onClick={this._onClick}
          onWheelClick={this._openTab}
          onCtrlClick={this._openTab}
        />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Left;
