import React, { useState } from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5chartg01";

import Config from "./config/config.js";
import MonthTransactions from "./model/month-transactions.js";
import DataTable from "./data-table.js";
import PieChart from "./chart/pie-chart.js";

import "./month-summary.less";

function LineChart({ data }) {
  const [isIncomes, setIsIncomes] = useState(false);
  const [isCosts, setIsCosts] = useState(false);

  return (
    <div>
      <UU5.Bricks.Button
        onClick={() => {
          setIsIncomes(false);
          setIsCosts(false);
        }}
        pressed={!isIncomes && !isCosts}
      >
        Vše
      </UU5.Bricks.Button>
      <UU5.Bricks.Button onClick={() => setIsIncomes(!isIncomes)} pressed={isIncomes}>Příjmy</UU5.Bricks.Button>
      <UU5.Bricks.Button onClick={() => setIsCosts(!isCosts)} pressed={isCosts}>Výdaje</UU5.Bricks.Button>
      <UU5.Chart.LineChart data={data} responsive>
        <UU5.Chart.XAxis dataKey="label" />
        <UU5.Chart.YAxis unit=" Kč" />
        <UU5.Chart.Tooltip content={<CustomTooltip isIncomes={isIncomes} isCosts={isCosts} />} />
        {!isIncomes && !isCosts && [
          <UU5.Chart.Line
            key="sumExp"
            type="monotone"
            dataKey="sumExp"
            stroke={UU5.Environment.colors.blue.c500}
            activeDot={{ r: 8 }}
          />,
          <UU5.Chart.Line
            key="sum"
            type="monotone"
            dataKey="sum"
            stroke={UU5.Environment.colors.grey.c900}
            activeDot={{ r: 8 }}
          />
        ]}
        {isIncomes && [
          <UU5.Chart.Line
            key="incomesExp"
            type="monotone"
            dataKey="incomesExp"
            stroke={UU5.Environment.colors.green.c500}
            activeDot={{ r: 8 }}
          />,
          <UU5.Chart.Line
            key="incomes"
            type="monotone"
            dataKey="incomes"
            stroke={UU5.Environment.colors.green.c200}
            activeDot={{ r: 8 }}
          />
        ]}
        {isCosts && [
          <UU5.Chart.Line
            key="costsExp"
            type="monotone"
            dataKey="costsExp"
            stroke={UU5.Environment.colors.red.c500}
            activeDot={{ r: 8 }}
          />,
          <UU5.Chart.Line
            key="costs"
            type="monotone"
            dataKey="costs"
            stroke={UU5.Environment.colors.red.c100}
            activeDot={{ r: 8 }}
          />
        ]}
      </UU5.Chart.LineChart>
    </div>
  )
}

function PaymentInfo({
                       payload: { value, account, currency = "CZK", details, category, ...payload },
                       color,
                       sumKey,
                       header
                     }) {
  return (
    <p>
      {value.toLocaleString("cs", { style: "currency", currency })} ({category})<br />
      {account}{account ? <br /> : null}
      {details}
    </p>
  )
}

function getSumRow(payload) {
  return (header, i) => {
    const { color, dataKey, payload: data } = payload[i];
    return (
      <div key={header} style={{ color }}>
        <b>{header}:</b> {data[dataKey].toLocaleString("cs", { style: "currency", currency: data.currency })}
      </div>
    );
  }
}

function CustomTooltip({ active, payload, label, isCosts, isIncomes }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "#fff",
        padding: 8,
        boxShadow: "rgb(33 33 33 / 40%) 1px 2px 10px 0px",
        maxWidth: "50vw",
      }}>
        <h4 style={{ margin: 0 }}>{label}</h4>
        <PaymentInfo {...payload[0]} />
        {!isIncomes && !isCosts && ["Pravidelné platby", "Celkem platby"].map(getSumRow(payload))}
        {isIncomes && ["Pravidelné příjmy", "Celkem příjmy"].map(getSumRow(payload))}
        {isCosts && ["Pravidelné výdaje", "Celkem výdaje"].map(getSumRow(payload))}
      </div>
    );
  }

  return null;
};

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
        const label = tx.getCategoryTitle();
        const foundTxIndex = data.findIndex(t => t.label === label);
        if (foundTxIndex > -1) {
          data[foundTxIndex].value += value;
        } else {
          data.push({
            label,
            value,
            colorSchema: colors[i % colors.length],
            onClick: () => this._openModal(label, value, [tx])
          });
        }
      }
    });

    return [...data, ...categories.filter(cat => cat.value)];
  },

  _getIncomesData() {
    let data = this._getTxData(this.state.monthTransactions.incomesExpectedTransactions, [{
      label: "Tarify",
      regex: /^mobile-tarif/
    }]).sort((a, b) => {
      if (a.value < b.value) return 1;
      return -1;
    });

    let unexpectedValue = Math.round((this.state.monthTransactions.incomes - this.state.monthTransactions.incomesExpected) * 100) / 100;
    if (unexpectedValue) {
      let label = "Nečekané";
      data.push({
        label,
        value: unexpectedValue,
        color: "grey",
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
      { label: "Byt Čáslav", regex: /^flat-caslav/ },
      { label: "OSVČ", regex: /^osvc/ }
    ]).sort((a, b) => {
      if (a.value < b.value) return 1;
      return -1;
    });

    let unexpectedValue = Math.round((this.state.monthTransactions.costs - this.state.monthTransactions.costsExpected) * 100) / 100;
    if (unexpectedValue) {
      let label = "Nečekané";
      data.push({
        label,
        value: unexpectedValue * -1,
        color: "grey",
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


      let sum = 0;
      let sumExp = 0;
      let incomes = 0;
      let incomesExp = 0;
      let costs = 0;
      let costsExp = 0;
      const data = this.state.monthTransactions.transactions.map((tx) => {
        let account = [];
        tx.account && account.push(tx.account);
        tx.accountName && account.push(tx.accountName);

        const label = UU5.Common.Tools.formatDate(tx.date, "d.m.");
        sum += tx.value;
        if (tx.value >= 0) incomes += tx.value;
        if (tx.value < 0) costs += tx.value;
        if (tx.category) {
          sumExp += tx.value;
          if (tx.value >= 0) incomesExp += tx.value;
          if (tx.value < 0) costsExp += tx.value;
        }

        return {
          label,
          value: tx.value,
          sum,
          sumExp,
          incomes,
          costs,
          incomesExp,
          costsExp,
          currency: tx.currency,
          account: account?.join("\n"),
          details: tx.details,
          category: tx.category,
        };
      });

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
              <PieChart data={this._getIncomesData()} />
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
              <PieChart data={this._getCostsData()} />
            </UU5.Bricks.Column>
          </UU5.Bricks.Row>

          <LineChart data={data} />

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
      );
    }
  }
  //@@viewOff:render
});

export default MonthSummary;
