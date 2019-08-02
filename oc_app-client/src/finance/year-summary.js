import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5chartg01";

import Config from "./config/config.js";
import YearTransactions from "./model/year-transactions.js";
import BarChart from "./chart/bar-chart.js";
import MonthSummary from "./month-summary";

// import "./year-summary.less";

export const YearSummary = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "YearSummary",
    classNames: {
      main: Config.CSS + "yearsummary",
      table: Config.CSS + "yearsummary-table",
      sum: Config.CSS + "yearsummary-sum",
      sumExpected: Config.CSS + "yearsummary-sumexpected"
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
      yearTransactions: this.props.data ? new YearTransactions(this.props.data) : null
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ yearTransactions: nextProps.data ? new YearTransactions(nextProps.data) : null });
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
    alert("Not implemented yet");
    // this._modal.open({
    //   header: name + ": " + this._formatAmount(amount),
    //   content: (
    //     <DataTable
    //       className={this.getClassName("table")}
    //       header={this._getHeader()}
    //       rows={this._getRows(transactions)}
    //     />
    //   )
    // });
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
      colorSchema: colors.shift()
    }));

    let data = [];

    txs.forEach((tx, i) => {
      let value = tx.value > 0 ? tx.value : tx.value * -1;

      let index = groups.findIndex(gr => gr.regex.test(tx.category));
      if (index > -1) {
        categories[index].value += value;
      } else {
        data.push({
          label: tx.getCategoryTitle(),
          value,
          colorSchema: colors[i % colors.length]
        });
      }
    });

    return [...data, ...categories];
  },

  _getIncomesCostsData(labels) {
    let txs = [];

    let data = [
      {
        label: "Příjmy", values: [], colorSchema: "green-rich", onClick: (i) => {
          this._modal.open({
            content: <MonthSummary data={txs[i]} month={`${this.props.year}/06`} />
          })
        }
      },
      {
        label: "Výdaje", values: [], colorSchema: "red-rich", onClick: (i) => {
          this._modal.open({
            content: <MonthSummary data={txs[i]} month={`${this.props.year}/06`} />
          })
        }
      }
    ];

    labels.forEach((month, i) => {
      let monthTransactions = this.state.yearTransactions.transactions[`${this.props.year}/${month}`];
      if (monthTransactions) {
        data[0].values[i] = monthTransactions.incomes;
        data[1].values[i] = monthTransactions.costs * -1;
        txs[data[0].values.length - 1] = monthTransactions;
      }
    });

    return data;
  },

  _getCostsData() {
    let data = this._getTxData(this.state.yearTransactions.costsExpectedTransactions, [
      { label: "Pojištění", regex: /^insurance/ },
      { label: "Penze", regex: /^pension/ },
      { label: "Dům KH", regex: /^flat-kh/ },
      { label: "Byt Praha", regex: /^flat-prague/ },
      { label: "Byt Čáslav", regex: /^flat-caslav/ }
    ]);

    let unexpectedValue = Math.round((this.state.yearTransactions.costs - this.state.yearTransactions.costsExpected) * 100) / 100;
    if (unexpectedValue) {
      data.push({
        label: "Nečekané",
        value: unexpectedValue * -1,
        colorSchema: "grey-rich"
      });
    }

    return data;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    if (this.props.data && this.props.data.length && this.state.yearTransactions) {
      let yearTransactions = this.state.yearTransactions;

      let sum = [
        [
          "Příjmy",
          <UU5.Bricks.Link
            colorSchema="success"
            onClick={() => this._openModal("Příjmy", yearTransactions.incomes, yearTransactions.incomesTransactions)}
          >
            <UU5.Bricks.Text content={this._formatAmount(yearTransactions.incomes)} />
          </UU5.Bricks.Link>
        ],
        [
          "Výdaje",
          <UU5.Bricks.Link
            colorSchema="danger"
            onClick={() => this._openModal("Výdaje", yearTransactions.costs, yearTransactions.costsTransactions)}
          >
            <UU5.Bricks.Text content={this._formatAmount(yearTransactions.costs)} />
          </UU5.Bricks.Link>
        ],
        [
          <b className="uu5-common-font-size-150">Rozdíl</b>,
          <b>
            <UU5.Bricks.Text
              className="uu5-common-font-size-150"
              colorSchema={yearTransactions.difference > 0 ? "success" : "danger"}
              content={this._formatAmount(yearTransactions.difference)}
            />
          </b>
        ]
      ];

      let sumExpected = [
        [
          "Očekávané příjmy",
          <UU5.Bricks.Link
            onClick={() => this._openModal("Očekávané příjmy", yearTransactions.incomesExpected, yearTransactions.incomesExpectedTransactions)}
          >
            <UU5.Bricks.Text content={this._formatAmount(yearTransactions.incomesExpected)} />
          </UU5.Bricks.Link>
        ],
        [
          "Neočekávané příjmy",
          <UU5.Bricks.Link
            colorSchema="danger"
            onClick={() => this._openModal("Neočekávané příjmy", yearTransactions.incomes - yearTransactions.incomesExpected, yearTransactions.incomesUnexpectedTransactions)}
          >
            <UU5.Bricks.Text
              content={this._formatAmount(yearTransactions.incomes - yearTransactions.incomesExpected)} />
          </UU5.Bricks.Link>
        ],
        [
          "Očekávané výdaje",
          <UU5.Bricks.Link
            onClick={() => this._openModal("Očekávané výdaje", yearTransactions.costsExpected, yearTransactions.costsExpectedTransactions)}
          >
            <UU5.Bricks.Text content={this._formatAmount(yearTransactions.costsExpected)} />
          </UU5.Bricks.Link>
        ],
        [
          "Neočekávané výdaje",
          <UU5.Bricks.Link
            colorSchema="danger"
            onClick={() => this._openModal("Neočekávané příjmy", yearTransactions.costs - yearTransactions.costsExpected, yearTransactions.costsUnexpectedTransactions)}
          >
            <UU5.Bricks.Text content={this._formatAmount(yearTransactions.costs - yearTransactions.costsExpected)} />
          </UU5.Bricks.Link>
        ]
      ];

      let colWidth = "xs6 s6 m6 l6 xl4";
      let labels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

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

          <BarChart
            data={this._getIncomesCostsData(labels)}
            xAxisLabels={labels}
            stacked={false}
          />

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

export default YearSummary;
