//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import Left from "./left.js";
import Bottom from "./bottom.js";
import About from "../routes/about.js";
import Home from "../routes/home.js";

import "./spa-authenticated.less";
//@@viewOff:imports

const SpaAuthenticated = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaAuthenticated",
    classNames: {
      main: Config.CSS + "spaauthenticated"
    },
    lsi: {
      name: Lsi.appName
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    identity: PropTypes.shape()
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      identity: null
    }
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
    return (
      <Plus4U5.App.Page
        {...this.getMainPropsToPass()}
        top={<Plus4U5.App.Top content={this.getLsiComponent("name")} />}
        bottom={<Bottom />}
        type={2}
        displayedLanguages={["cs", "en"]}
        left={<Left identity={this.props.identity} />}
        leftWidth="!xs-320px !s-320px !m-256px l-256px xl-256px"
      >
        <UU5.Common.Router
          route=""
          routes={{
            "home": { component: <Home identity={this.props.identity} /> },
            "": "home",
            "about": { component: <About identity={this.props.identity} /> }
          }}
          controlled={false}
        />
      </Plus4U5.App.Page>
    );
  }
  //@@viewOff:render
});

export default SpaAuthenticated;
