//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import WtmOu from "../wtm/wtm-ou.js";

import "./wtm.less";
//@@viewOff:imports

const Wtm = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.RouteMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Wtm",
    classNames: {
      main: Config.CSS + "wtm",
      subject: Config.CSS + "wtm-subject"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._wtms = {};
    let date = new Date();
    date.setDate(1);
    return { date };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let format = "Y-mm-dd";
    let dateFrom = UU5.Common.Tools.formatDate(this.state.date, format);

    let dateEnd = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 0);
    let dateTo = UU5.Common.Tools.formatDate(dateEnd, format);

    let projects = [
      "PRD.UU-UU5",
      "PRD.UU-PLUS4U5",
      "PRD.UU-UU5CODEKIT",
      "PRD.UU-UU5IMAGING",
      "PRD.UU-UU5LIBRARYREGISTRY",
      "PRD.UU-PLUS4U5FILES",
      "PRD.UU-PLUS4UGO",
      "PRD.UU-UU5TILES",
      "PRD.UU-UU5RICHTEXT",
      "PRD.UU-UU5CHART",
      "PRD.UU-UU5MAPS",
      "PRD.UU-UU5COMPONENTCATALOGUE",
      "PRD.UU-UU5DATATABLE",
      "PRD.UU-UU5TREE",
      "PRD.UU-UU5CALENDAR",
      "PRD.UU-UU5MATH",
      "PRD.UU-UU5AMCHARTS"
    ];

    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Calendar
          minSelection="months"
          value={this.state.date}
          dateTo={new Date()}
          onChange={opt => this.setState({ date: opt.value })}
        />

        {projects.map(code => {
          let wtm;

          return (
            <UU5.Bricks.Section
              key={code}
              className={this.getClassName("subject")}
              level={3}
              header={[
                code,
                <UU5.Bricks.Button colorSchema="primary" onClick={() => wtm.reload()}>
                  <UU5.Bricks.Icon icon="mdi-reload" />
                </UU5.Bricks.Button>
              ]}
            >
              <WtmOu
                id={code + dateFrom}
                ref_={c => wtm = c}
                ouUri={`UU-BT:${code}`}
                dateFrom={dateFrom}
                dateTo={dateTo}
                controlled={false}
              />
            </UU5.Bricks.Section>
          )
        })}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Wtm;
