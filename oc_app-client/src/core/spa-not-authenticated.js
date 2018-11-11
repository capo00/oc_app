//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import Left from "./left.js";
import Bottom from "./bottom.js";
import About from "../routes/about.js";
import NotAuthenticated from "../routes/not-authenticated.js";

import "./spa-not-authenticated.less";
//@@viewOff:imports

const SpaNotAuthenticated = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaNotAuthenticated",
    classNames: {
      main: Config.CSS + "spanotauthenticated"
    },
    lsi: {
      name: Lsi.appName
    }
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
      <Plus4U5.App.Page
        {...this.getMainPropsToPass()}
        top={<Plus4U5.App.Top content={this.getLsiComponent("name")} />}
        bottom={<Bottom />}
        type={2}
        displayedLanguages={["cs", "en"]}
        left={<Left />}
        leftWidth="!xs-320px !s-320px !m-256px l-256px xl-256px"
      >
        <UU5.Common.Router
          route=""
          routes={{
            "home": { component: <NotAuthenticated /> },
            "": "home",
            "about": { component: <About /> }
          }}
        />
      </Plus4U5.App.Page>
    );
  }
  //@@viewOff:render
});

export default SpaNotAuthenticated;
