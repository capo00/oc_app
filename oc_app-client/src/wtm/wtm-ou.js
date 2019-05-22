//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import Calls from "../calls.js";
import Config from "./config/config.js";

import "./wtm-ou.less";
//@@viewOff:imports

const WtmOu = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.LoadMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "WtmOu",
    classNames: {
      main: Config.CSS + "wtmou",
      panelHeader: Config.CSS + "wtmou-panelheader"
    },
    calls: {
      onLoad: "loadWtm"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount() {
    this.setCalls(Calls)
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  getOnLoadData_(props) {
    return {
      dateFrom: new Date(props.dateFrom).toISOString(),
      dateTo: new Date(props.dateTo).toISOString(),
      ouUri: props.ouUri
    }
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getSummary(dtoOut) {
    let subjects = {};
    dtoOut.timesheetItemList.forEach(item => {
      if (item.supplierContract !== "ues:UU-BT:UU.PDA") {
        let dateFrom = UU5.Common.Tools.formatDate(new Date(item.datetimeFrom), "d.m.Y H:MM");
        let dateTo = UU5.Common.Tools.formatDate(new Date(item.datetimeTo), "H:MM");
        let [_, ouCode] = item.subjectOU.match(/(?:ues:[^:]+:)([^\[]+)/);
        let msg = `${item.authorUuIdentity} has wrong subject (${item.supplierContract}) in ${ouCode} at ${dateFrom} - ${dateTo}.`;
        console.error(msg, item);
      }

      let hours = (new Date(item.datetimeTo) - new Date(item.datetimeFrom)) / (3600 * 1000);

      subjects[item.subject] = subjects[item.subject] || {
        hours: 0,
        users: {},
        name: dtoOut.subjectMap[item.subject].subjectName
      };
      subjects[item.subject].hours += hours;

      subjects[item.subject].users[item.workerUuIdentity] = subjects[item.subject].users[item.workerUuIdentity] || { hours: 0 };
      subjects[item.subject].users[item.workerUuIdentity].hours += hours;
    });

    let panels = [];

    for (let uri in subjects) {
      let rows = [];

      for (let uid in subjects[uri].users) {
        rows.push([<Plus4U5.Bricks.BusinessCard uuIdentity={uid} visual="inline" />, subjects[uri].users[uid].hours]);
      }

      panels.push(
        <UU5.Bricks.Panel bgStyleHeader="underline" header={
          <div className={this.getClassName("panelHeader")} key="header">
            <span><Plus4U5.Bricks.Plus4ULink uri={uri} content={subjects[uri].name} /></span>
            <span>{subjects[uri].hours}</span>
          </div>
        }>
          <UU5.Bricks.DataTable rows={rows} />
        </UU5.Bricks.Panel>
      )
    }

    return dtoOut.timesheetItemList.length ? (
      <UU5.Bricks.Accordion>
        {panels}
      </UU5.Bricks.Accordion>
    ) : "Žádný záznam";
  },

  _getChild() {
    let result;

    switch (this.getLoadFeedback()) {
      case "loading":
        result = <UU5.Bricks.Loading />;
        break;
      case "ready":
        result = this._getSummary(this.getDtoOut());
        break;
      case "error":
        result = <UU5.Bricks.Button colorSchema="danger" onClick={() => this.reload()} content="Reload" />;
        break;
    }

    return result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        {this._getChild()}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default WtmOu;
