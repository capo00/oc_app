import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5codekitg01";

import Config from "./config/config.js";
import Calls from "../calls.js";

import Transaction from "./model/transaction.js";

// import "./migration1.less";

const Migration1 = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.CallsMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Migration1",
    classNames: {
      main: Config.CSS + "migration1"
    },
    calls: {
      save: "updateMonthTransactions"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {};
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      items: this.props.items,
      feedback: "ready"
    };
  },

  componentWillMount() {
    this.setCalls(Calls);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ items: nextProps.items });
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _save(txs) {
    let call = this.getCall("save");
    this.setState({ feedback: "loading" }, () => {
      call({
        data: txs,
        done: () => this.setState({ feedback: "ready" }),
        fail: (err) => console.error("Migrace selhala", err)
      })
    });
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let { payments, ...otherData } = this.props.balance;

    let txs = payments.map(payment => {
      payment.vc && (payment.vc += "");
      return new Transaction(payment).toObject();
    });

    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Button disabled={this.state.feedback === "loading"} onClick={() => this._save(txs)}>
          Send
        </UU5.Bricks.Button>
        <UU5.Bricks.Row {...this.getMainPropsToPass()}>
          <UU5.Bricks.Column colWidth="m-6">
            <UU5.Bricks.Pre>
              {JSON.stringify(otherData, null, 2)}
            </UU5.Bricks.Pre>
            <UU5.Bricks.Pre>
              {JSON.stringify(txs, null, 2)}
            </UU5.Bricks.Pre>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="m-6">
            <UU5.CodeKit.JsonEditor
              value={this.state.items}
              format="pretty"
              valueFormat="object"
              onBlur={opt => this.setState({ items: opt.value })}
            />
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Migration1;
