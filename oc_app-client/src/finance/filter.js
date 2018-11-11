import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "./config/config.js";

export const Filter = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Filter",
    classNames: {
      main: Config.CSS + "filter"
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

  //@@viewOn:overridingMeUU5.Bricks.Table.Thods
  //@@viewOff:overridingMeUU5.Bricks.Table.Thods

  //@@viewOn:componentSpecificHelpers
  _submit(opt) {
    this.props.onSubmit(opt.values);
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <UU5.Forms.Form {...this.getMainPropsToPass()} onSave={this._submit}>
        <UU5.Forms.Datepicker required
                              label="Od"
                              name="from"
                              ref_={from => this._from = from}
                              value={this.props.from} />
        <UU5.Forms.Datepicker required
                              label="Do"
                              name="to"
                              ref_={to => this._to = to}
                              value={this.props.to} />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
  }
  //@@viewOff:render
});

export default Filter;
