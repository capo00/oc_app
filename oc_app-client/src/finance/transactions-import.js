import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5codekitg01";

import Config from "./config/config.js";
import Calls from "../calls.js";
import CSV from "./model/csv.js";
import Balance from "./model/balance.js";

import "./transactions-import.less";

const TransactionsImport = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.CallsMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TransactionsImport",
    classNames: {
      main: Config.CSS + "transactionsimport"
    },
    calls: {
      import: "importTransactions"
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
      transactions: null,
      state: "ready",
      error: null
    };
  },

  componentWillMount() {
    this.setCalls(Calls);
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _parse(opt) {
    let onChange = () => opt.component.setValue(opt.value);

    if (opt.value) {
      let reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (e) => {
        let rows = CSV.convert(e.target.result);
        let txs = Balance.getTransactions(rows);
        this.setState({ transactions: txs.map(tx => tx.toObject()) });
      };

      // Read text
      reader.readAsText(opt.value);
      onChange();
    } else {
      this.setState({ transactions: null }, onChange);
    }
  },

  _import(opt) {
    this.setState({ state: "loading" }, () => {
      this.getCall("import")({
        data: {
          data: opt.values.transactions
        },
        done: dtoOut => {
          this.setState({ state: "ready", transactions: null }, () => {
            let alertBus = UU5.Environment.page.getAlertBus();
            alertBus.addAlert({
              content: "Transakce byly naimportovány.",
              colorSchema: "success",
              closeTimer: 3000
            })
          });
        },
        fail: dtoOut => {
          this.setState({ state: "error", error: dtoOut }, () => {
            let alertBus = UU5.Environment.page.getAlertBus();
            alertBus.addAlert({
              content: "Chyba při importu transakcí.",
              colorSchema: "danger",
              closeTimer: 5000
            })
          })
        }
      });
    });
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      this.state.state === "loading" ? <UU5.Bricks.Loading /> :
        <UU5.Forms.Form {...this.getMainPropsToPass()} onSave={this._import}>
          <UU5.Forms.File name="file" label="Export z banky" onChange={this._parse} controlled={false} />
          {
            this.state.transactions && (
              <UU5.Bricks.Panel header="Data">
                <UU5.CodeKit.JsonEditor
                  name="transactions"
                  value={this.state.transactions}
                  format="pretty"
                  valueFormat="object"
                />
              </UU5.Bricks.Panel>
            )
          }
          <UU5.Forms.Controls />

          {this.state.state === "error" && <UU5.Common.Error errorData={this.state.error} />}
        </UU5.Forms.Form>
    );
  }
  //@@viewOff:render
});

export default TransactionsImport;
