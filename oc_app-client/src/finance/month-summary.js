import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5chartg01";

import Config from "./config/config.js";
import MonthTransactions from "./model/month-transactions.js";
import DataTable from "./data-table.js";

import "./month-summary.less";

export const MonthSummary = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "MonthSummary",
    classNames: {
      main: Config.CSS + "monthsummary",
      table: Config.CSS + "monthsummary-table",
      sum: Config.CSS + "monthsummary-sum",
      sumExpected: Config.CSS + "monthsummary-sumexpected"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      monthTransactions: this.props.data ? (this.props.data instanceof MonthTransactions ? this.props.data : new MonthTransactions(this.props.data)) : null,
      allTx: false
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ monthTransactions: nextProps.data ? new MonthTransactions(nextProps.data) : null, allTx: false });
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
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

  _getRows(rows) {
    let newRows = [];

    rows.forEach((tx, i) => {
      let account = [];
      tx.account && account.push(tx.account);
      tx.accountName && account.push(tx.accountName);

      newRows.push([
        UU5.Common.Tools.formatDate(tx.date, "dd.mm.Y"),
        `${this._formatAmount(tx.value, tx.currency)}`,
        `<uu5string/>${account.join("<br/>")}`,
        `<uu5string/>${tx.details.replace("\n", "<br/>")}`
      ]);
    });

    return newRows;
  },

  _formatAmount(num, currency = "CZK") {
    return num.toLocaleString("cs", { style: "currency", currency });
  },

  _openModal(name, amount, transactions) {
    this._modal.open({
      header: name + ": " + this._formatAmount(amount),
      content: (
        <DataTable
          className={this.getClassName("table")}
          header={this._getHeader()}
          rows={this._getRows(transactions)}
        />
      )
    });
  },

  _getColors() {
    let newColors = [];

    let [de, p, s, i, w, d, ...colors] = UU5.Environment.colorSchema;
    colors.pop();

    let richColors = [];
    let poorColors = [];

    colors.forEach(color => {
      if (!/^grey/.test(color)) {
        if (/-rich$/.test(color)) {
          richColors.push(color);
        } else {
          poorColors.push(color);
        }
      }
    });

    while (richColors.length) {
      let i = Math.floor(Math.random() * richColors.length);
      newColors.push(richColors[i]);
      richColors.splice(i, 1);
    }

    while (poorColors.length) {
      let i = Math.floor(Math.random() * poorColors.length);
      newColors.push(poorColors[i]);
      poorColors.splice(i, 1);
    }

    return newColors;
  },

  _getTxData(txs, groups = []) {
    let colors = this._getColors();

    let categories = groups.map(gr => ({
      label: gr.label,
      value: 0,
      colorSchema: colors.shift(),
      transactions: []
    }));

    let data = [];

    txs.forEach((tx, i) => {
      let value = tx.value > 0 ? tx.value : tx.value * -1;

      let index = groups.findIndex(gr => gr.regex.test(tx.category));
      if (index > -1) {
        categories[index].value += value;
        categories[index].transactions.push(tx);
        categories[index].onClick = () => this._openModal(categories[index].label, categories[index].value, categories[index].transactions);
      } else {
        data.push({
          label: tx.getCategoryTitle(),
          value,
          colorSchema: colors[i % colors.length],
          onClick: () => this._openModal(tx.getCategoryTitle(), value, [tx])
        });
      }
    });

    return [...data, ...categories.filter(cat => cat.value)];
  },

  _getIncomesData() {
    let data = this._getTxData(this.state.monthTransactions.incomesExpectedTransactions, [{
      label: "Tarify",
      regex: /^mobile-tarif/
    }]);

    let unexpectedValue = Math.round((this.state.monthTransactions.incomes - this.state.monthTransactions.incomesExpected) * 100) / 100;
    if (unexpectedValue) {
      let label = "Nečekané";
      data.push({
        label,
        value: unexpectedValue,
        colorSchema: "grey-rich",
        onClick: () => this._openModal(label, unexpectedValue, this.state.monthTransactions.incomesUnexpectedTransactions)
      });
    }

    return data;
  },

  _getCostsData() {
    let data = this._getTxData(this.state.monthTransactions.costsExpectedTransactions, [
      { label: "Pojištění", regex: /^insurance/ },
      { label: "Penze", regex: /^pension/ },
      { label: "Dům KH", regex: /^flat-kh/ },
      { label: "Byt Praha", regex: /^flat-prague/ },
      { label: "Byt Čáslav", regex: /^flat-caslav/ }
    ]);

    let unexpectedValue = Math.round((this.state.monthTransactions.costs - this.state.monthTransactions.costsExpected) * 100) / 100;
    if (unexpectedValue) {
      let label = "Nečekané";
      data.push({
        label,
        value: unexpectedValue * -1,
        colorSchema: "grey-rich",
        onClick: () => this._openModal(label, unexpectedValue, this.state.monthTransactions.costsUnexpectedTransactions)
      });
    }

    return data;
  },

  _getRow(name, value, txs, colorSchema) {
    let colWidth = "xs6 s6 m6 l6 xl4";

    return (
      <UU5.Bricks.Row>
        <UU5.Bricks.Column colWidth={colWidth}>
          {name}
        </UU5.Bricks.Column>
        <UU5.Bricks.Column colWidth={colWidth}>
          <UU5.Bricks.Link
            colorSchema={colorSchema}
            onClick={() => this._openModal(name, value, txs)}
          >
            <UU5.Bricks.Text content={this._formatAmount(value)} />
          </UU5.Bricks.Link>
        </UU5.Bricks.Column>
      </UU5.Bricks.Row>
    );
  },

  _getAllTransactions() {
    if (this.state.allTx) {
      return (
        <DataTable
          className={this.getClassName("table")}
          header={this._getHeader()}
          rows={this._getRows(this.state.monthTransactions.transactions)}
        />
      );
    } else {
      return (
        <UU5.Bricks.Div className="center">
          <UU5.Bricks.Link content="Všechny transakce" onClick={() => this.setState({ allTx: true })} />
        </UU5.Bricks.Div>
      );
    }
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    if (this.props.data && this.props.data.length && this.state.monthTransactions) {
      let monthTransactions = this.state.monthTransactions;

      return (
        <UU5.Bricks.Div {...this.getMainPropsToPass()}>
          <UU5.Bricks.Header level={1} className="center">
            {this.props.month} <UU5.Bricks.Text colorSchema={monthTransactions.difference > 0 ? "success" : "danger"}>
            {this._formatAmount(monthTransactions.difference)}
          </UU5.Bricks.Text>
          </UU5.Bricks.Header>

          <UU5.Bricks.Row>
            <UU5.Bricks.Column
              colWidth="m-6"
              level={3}
              header={[
                "Příjmy ",
                <UU5.Bricks.Link
                  nestingLevel="inline"
                  colorSchema="success"
                  onClick={() => this._openModal("Příjmy", monthTransactions.incomes, monthTransactions.incomesTransactions)}
                >
                  <UU5.Bricks.Text content={this._formatAmount(monthTransactions.incomes)} />
                </UU5.Bricks.Link>
              ]}
            >
              {this._getRow("Očekávané příjmy", monthTransactions.incomesExpected, monthTransactions.incomesExpectedTransactions, "success")}
              {this._getRow("Neočekávané příjmy", monthTransactions.incomes - monthTransactions.incomesExpected, monthTransactions.incomesUnexpectedTransactions, "success")}
              <UU5.SimpleChart.PieChart data={this._getIncomesData()} displayLegend={false} />
            </UU5.Bricks.Column>
            <UU5.Bricks.Column
              colWidth="m-6"
              level={3}
              header={[
                "Výdaje ",
                <UU5.Bricks.Link
                  nestingLevel="inline"
                  colorSchema="danger"
                  onClick={() => this._openModal("Výdaje", monthTransactions.costs, monthTransactions.costsTransactions)}
                >
                  <UU5.Bricks.Text content={this._formatAmount(monthTransactions.costs)} />
                </UU5.Bricks.Link>
              ]}
            >
              {this._getRow("Očekávané výdaje", monthTransactions.costsExpected, monthTransactions.costsExpectedTransactions, "danger")}
              {this._getRow("Neočekávané výdaje", monthTransactions.costs - monthTransactions.costsExpected, monthTransactions.costsUnexpectedTransactions, "danger")}
              <UU5.SimpleChart.PieChart data={this._getCostsData()} displayLegend={false} />
            </UU5.Bricks.Column>
          </UU5.Bricks.Row>

          {this._getAllTransactions()}

          {/*<Migration1 balance={balance} items={this.state.items} />*/}

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
  }
  //@@viewOff:render
});

export default MonthSummary;
