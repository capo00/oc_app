//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import WelcomeRow from "../bricks/welcome-row.js";

import "./not-authenticated.less";
//@@viewOff:imports

const NotAuthenticated = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.RouteMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "NotAuthenticated",
    classNames: {
      main: Config.CSS + "notauthenticated",
      login: Config.CSS + "notauthenticated-login",
      loginButton: Config.CSS + "notauthenticated-loginbutton"
    },
    lsi: Lsi.notAuth
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
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
    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()} header={this.getLsiComponent("welcome")} level="2">
        <WelcomeRow textPadding="14px" icon="mdi-human-greeting">
          {this.getLsiComponent("intro")}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" icon="mdi-monitor">
          {this.getLsiComponent("clientSide")}
        </WelcomeRow>
        <WelcomeRow textPadding="8px" icon="mdi-server">
          {this.getLsiComponent("serverSide")}
        </WelcomeRow>
        <WelcomeRow className={this.getClassName("login")} textPadding="14px" icon="mdi-account-key">
          <UU5.Bricks.Span>
            {this.getLsiComponent("login")}
          </UU5.Bricks.Span>
          <Plus4U5.App.LoginButton className={this.getClassName("loginButton")} colorSchema="primary" />
        </WelcomeRow>
      </UU5.Bricks.Section>
    );
  } //@@viewOff:render
});

export default NotAuthenticated;
