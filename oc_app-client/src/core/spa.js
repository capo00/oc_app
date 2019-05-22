import React from "react";
import createReactClass from "create-react-class";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Left from "./left.js";
import Home from "../routes/home.js";
import About from "../routes/about.js";
import Finance from "../routes/finance.js";
import FinanceImport from "../routes/finance-import.js";
import Wtm from "../routes/wtm.js";

import "./spa.less";

const Spa = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.IdentityMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Spa",
    classNames: {
      main: Config.CSS + "spa"
    }
  },

  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getRoutes() {
    let routes = {
      home: { component: <Home identity={this.getIdentity()} /> },
      "": "home"
    };

    let menuRoutes = {
      about: { component: <About />, content: "O aplikaci" }
    };

    if (this.isAuthenticated()) {
      menuRoutes = UU5.Common.Tools.merge({}, {
        finance: {
          component: <Finance />, content: "Finance", itemList: {
            "finance/import": {
              component: <FinanceImport />, content: "Import"
            }
          }
        },
        wtm: {
          component: <Wtm />, content: "WTM"
        }
      }, menuRoutes);

      routes = UU5.Common.Tools.merge({}, routes, menuRoutes.finance.itemList);
    }

    return {
      menuRoutes,
      allRoutes: UU5.Common.Tools.merge({}, routes, menuRoutes)
    };
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let child;
    if (this.isPending()) {
      child = <Plus4U5.App.Loading {...this.getMainPropsToPass()} />;
    } else {
      let routes = this._getRoutes();

      let content;
      if (this.isAuthenticated()) {
        content = <UU5.Common.Router route="" routes={routes.allRoutes} />;
      } else {
        content = <Plus4U5.App.Login />;
      }

      child = (
        <Plus4U5.App.Page
          {...this.getMainPropsToPass()}
          top={<Plus4U5.App.Top content="ocApp" />}
          displayedLanguages={["cs", "en"]}
          type={1}
          left={<Left routes={routes.menuRoutes} />}
          leftWidth="!xs-320px !s-320px !m-256px l-256px xl-256px"
        >
          {content}
        </Plus4U5.App.Page>
      )
    }

    return child;
  }
  //@@viewOff:render
});

export default Spa;
