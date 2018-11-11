import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import Calls from "../calls.js";
import Balance from "./balance.js";
import DataTable from "./data-table.js";

import "./transactions.less";

export const Transactions = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.LoadMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Transactions",
    classNames: {
      main: Config.CSS + "transactions",
      table: Config.CSS + "transactions-table",
      sum: Config.CSS + "transactions-sum",
      sumExpected: Config.CSS + "transactions-sumexpected"
    },
    calls: {
      onLoad: "loadTransactions"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentWillMount() {
    this.setCalls(Calls);
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  setFilter(values) {
    let dtoIn = this._getReloadDtoIn();
    dtoIn.data = this.getOnLoadData_(values);
    this.reload(null, dtoIn);
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  getOnLoadData_(props) {
    return {
      dateFrom: UU5.Common.Tools.formatDate(props.from, "Y-mm-dd"),
      dateTo: UU5.Common.Tools.formatDate(props.to, "Y-mm-dd")
    }
  },

  onLoadSuccess_(dtoOut) {
    this.setState({ loadFeedback: "ready", balance: Balance.parse(dtoOut.itemList) });
  },
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getHeader() {
    return [
      "Datum",
      "Částka",
      "Účet",
      "Detail"
    ];
  },

  _getRows(rows, shouldRender) {
    let newRows = [];

    rows.forEach((row, i) => {
      if (!shouldRender || shouldRender(row)) {
        let account = [];
        row.account && account.push(row.account);
        row.accountName && account.push(row.accountName);

        newRows.push([
          UU5.Common.Tools.formatDate(row.date, "dd.mm.Y"),
          `${this._formatAmount(row.value, row.currency)}`,
          `<uu5string/>${account.join("<br/>")}`,
          `<uu5string/>${row.details.replace("\n", "<br/>")}`
        ]);
      }
    });

    return newRows;
  },

  _formatAmount(num, currency = "CZK") {
    return num.toLocaleString("cs", { style: "currency", currency: currency });
  },

  _openModal(name, amount, shouldRender) {
    this._modal.open({
      header: name + ": " + this._formatAmount(amount),
      content: (
        <DataTable
          className={this.getClassName("table")}
          header={this._getHeader()}
          rows={this._getRows(this.state.balance.payments, shouldRender)}
        />
      )
    });
  },

  _getChildren() {
    let account = this.state.balance.firstAccount;

    if (account) {
      let balance = account.getPayments();

      let sum = [
        [
          "Příjmy",
          <UU5.Bricks.Link
            colorSchema="success"
            onClick={() => this._openModal("Příjmy", balance.incomes, row => (row.value >= 0))}
          >
            <UU5.Bricks.Text content={this._formatAmount(balance.incomes)} />
          </UU5.Bricks.Link>
        ],
        [
          "Výdaje",
          <UU5.Bricks.Link
            colorSchema="danger"
            onClick={() => this._openModal("Výdaje", balance.costs, row => (row.value < 0))}
          >
            <UU5.Bricks.Text content={this._formatAmount(balance.costs)} />
          </UU5.Bricks.Link>
        ],
        [
          <b className="uu5-common-font-size-150">Rozdíl</b>,
          <b>
            <UU5.Bricks.Text
              className="uu5-common-font-size-150"
              colorSchema={balance.incomes + balance.costs > 0 ? "success" : "danger"}
              content={this._formatAmount(balance.incomes + balance.costs)}
            />
          </b>
        ]
      ];

      let sumExpected = [
        [
          "Očekávané příjmy",
          <UU5.Bricks.Link
            onClick={() => this._openModal("Očekávané příjmy", balance.incomesExpected, row => (row.value >= 0 && row.isExpectedIncome))}
          >
            <UU5.Bricks.Text content={this._formatAmount(balance.incomesExpected)} />
          </UU5.Bricks.Link>
        ],
        [
          "Neočekávané příjmy",
          <UU5.Bricks.Link
            colorSchema="danger"
            onClick={() => this._openModal("Neočekávané příjmy", balance.incomes - balance.incomesExpected, row => (row.value >= 0 && !row.isExpectedIncome))}
          >
            <UU5.Bricks.Text content={this._formatAmount(balance.incomes - balance.incomesExpected)} />
          </UU5.Bricks.Link>
        ],
        [
          "Očekávané výdaje",
          <UU5.Bricks.Link
            onClick={() => this._openModal("Očekávané výdaje", balance.costsExpected, row => (row.value < 0 && row.isExpectedCost))}
          >
            <UU5.Bricks.Text content={this._formatAmount(balance.costsExpected)} />
          </UU5.Bricks.Link>
        ],
        [
          "Neočekávané výdaje",
          <UU5.Bricks.Link
            colorSchema="danger"
            onClick={() => this._openModal("Neočekávané příjmy", balance.costs - balance.costsExpected, row => (row.value < 0 && !row.isExpectedCost))}
          >
            <UU5.Bricks.Text content={this._formatAmount(balance.costs - balance.costsExpected)} />
          </UU5.Bricks.Link>
        ]
      ];

      let colWidth = "xs6 s6 m6 l6 xl4";

      return (
        <UU5.Bricks.Div {...this.getMainPropsToPass()}>
          <UU5.Bricks.Row>
            <UU5.Bricks.Column colWidth="xs12 m6">
              <UU5.Bricks.Div className={this.getClassName("sum")}>
                {sum.map((row, i) => {
                  return (
                    <UU5.Bricks.Row key={i}>
                      <UU5.Bricks.Column colWidth={colWidth}>
                        {row[0]}
                      </UU5.Bricks.Column>
                      <UU5.Bricks.Column colWidth={colWidth}>
                        {row[1]}
                      </UU5.Bricks.Column>
                    </UU5.Bricks.Row>
                  )
                })}
              </UU5.Bricks.Div>
            </UU5.Bricks.Column>
            <UU5.Bricks.Column colWidth="xs12 m6">
              <UU5.Bricks.Div className={this.getClassName("sumExpected")}>
                {sumExpected.map((row, i) => {
                  return (
                    <UU5.Bricks.Row key={i}>
                      <UU5.Bricks.Column colWidth={colWidth}>
                        {row[0]}:
                      </UU5.Bricks.Column>
                      <UU5.Bricks.Column colWidth={colWidth}>
                        {row[1]}
                      </UU5.Bricks.Column>
                    </UU5.Bricks.Row>
                  )
                })}
              </UU5.Bricks.Div>
            </UU5.Bricks.Column>
          </UU5.Bricks.Row>

          <DataTable
            className={this.getClassName("table")}
            header={this._getHeader()}
            rows={this._getRows(balance.payments)}
          />

          <UU5.Bricks.Modal size="l" ref_={modal => this._modal = modal} />
        </UU5.Bricks.Div>
      );
    } else {
      return (
        <UU5.Bricks.Div {...this.getMainPropsToPass()}>
          Za dané období nebyly žádné transakce nalezeny.
        </UU5.Bricks.Div>
      )
    }
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return this.getLoadFeedbackChildren(this._getChildren);
  }
  //@@viewOff:render
});

export default Transactions;
