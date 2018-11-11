//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";

import "./welcome-row.less";
//@@viewOff:imports

const WelcomeRow = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "WelcomeRow",
    classNames: {
      main: Config.CSS + "welcomerow",
      text: Config.CSS + "welcomerow-text",
      iconColumn: Config.CSS + "welcomerow-iconcolumn"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    icon: PropTypes.string,
    textPadding: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      icon: undefined, // default of UU5.Bricks.Icon
      textPadding: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let margin = "-" + this.props.textPadding;
    return (
      <UU5.Bricks.Row {...this.getMainPropsToPass()}>
        <UU5.Bricks.Column className={this.getClassName("iconColumn")} colWidth="xs-12 s-2">
          <UU5.Bricks.Icon icon={this.props.icon} style={{ marginTop: margin, marginBottom: margin }} />
        </UU5.Bricks.Column>
        <UU5.Bricks.Column
          className={this.getClassName("text")}
          colWidth="xs-12 s-10"
          content={this.props.children}
        />
      </UU5.Bricks.Row>
    );
  }
  //@@viewOff:render
});

export default WelcomeRow;
