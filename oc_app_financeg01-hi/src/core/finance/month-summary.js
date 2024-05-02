//@@viewOn:imports
import { createVisualComponent, useEffect, useState, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Uu5Charts from "uu5chartsg01";
import Config from "../config/config.js";
import MonthTransactions from "./model/month-transactions";
import DataTable from "./data-table";
import Categories from "./categories";
import Category from "./model/category";
import { UuDate } from "uu_i18ng01";
//@@viewOff:imports

function Amount({ value }) {
  return (
    <Uu5Elements.Text colorScheme={value < 0 ? "negative" : "positive"}>
      <Uu5Elements.Number value={value} currency="CZK" />
    </Uu5Elements.Text>
  );
}

function TxModal({ header, amount, data, onClose }) {
  return (
    <Uu5Elements.Modal
      open
      onClose={onClose}
      header={
        <>
          {header}: <Amount value={amount} />
        </>
      }
      width="full"
    >
      <DataTable data={data} />
    </Uu5Elements.Modal>
  );
}

function FinPartRow({ name, value, data, colorScheme }) {
  const [tx, setTx] = useState(null);

  return (
    <>
      <Uu5Elements.Text
        colorScheme={colorScheme}
        className={Config.Css.css({ display: "flex", justifyContent: "space-between" })}
      >
        <span>{name}</span>
        <Uu5Elements.Link onClick={() => setTx(data)} colorScheme={colorScheme}>
          <Uu5Elements.Number value={value} currency="CZK" />
        </Uu5Elements.Link>
      </Uu5Elements.Text>

      {tx && <TxModal header={name} amount={value} data={tx} onClose={() => setTx(null)} />}
    </>
  );
}

function _getTxData(txs, groups = [], onModal) {
  let categories = groups.map((gr) => ({
    ...gr,
    value: 0,
    transactions: [],
  }));

  let data = [];

  txs.forEach((tx, i) => {
    let value = tx.value > 0 ? tx.value : tx.value * -1;

    let group = Category.findGroup(tx.category, categories);
    if (group) {
      group.value += value;
      group.transactions.push(tx);
      group.onClick = () => onModal(group.name, group.value, group.transactions);
    } else {
      const label = tx.getCategoryTitle();
      const foundTxIndex = data.findIndex((t) => t.label === label);
      if (foundTxIndex > -1) {
        data[foundTxIndex].value += value;
      } else {
        data.push({
          label,
          value,
          onClick: () => onModal(label, value, [tx]),
        });
      }
    }
  });

  return [...data, ...categories.filter((cat) => cat.value)];
}

const RADIAN = Math.PI / 180;

function polarToCartesian(cx, cy, radius, angle) {
  return {
    x: cx + Math.cos(-RADIAN * angle) * radius,
    y: cy + Math.sin(-RADIAN * angle) * radius,
  };
}

function getDataForPieChart(sum, expected, expectedData, unexpectedData, groups, onModal) {
  let data = _getTxData(expectedData, groups, onModal).sort((a, b) => {
    if (a.value < b.value) return 1;
    return -1;
  });

  let unexpectedValue = Math.round((sum - expected) * 100) / 100;
  if (unexpectedValue) {
    let label = "Nečekané";
    data.push({
      key: "unexpected",
      name: label,
      value: Math.abs(unexpectedValue),
      onClick: () => onModal(label, unexpectedValue, unexpectedData),
    });
  }

  return {
    data,
    serieList: [
      {
        valueKey: "value",
        labelKey: "name",
        unit: "Kč",
        color: ({ key }) => (key === "unexpected" ? "grey" : undefined),
        label: [{ position: "outside", type: "label" }],
        // label: {
        //   children: (props) => {
        //     const { value, viewBox, data } = props;
        //     const { cx, cy, startAngle, endAngle, outerRadius } = viewBox;
        //     const midAngle = (startAngle + endAngle) / 2;
        //
        //     const { x, y } = polarToCartesian(cx, cy, outerRadius + 10, midAngle);
        //     const textAnchor = x >= cx ? "start" : "end";
        //
        //     console.log(data.label, x, y, textAnchor);
        //
        //     return (
        //       <text x={x} y={y} fill="black" textAnchor={textAnchor} dominantBaseline="central">
        //         {data.label}
        //       </text>
        //     );
        //   },
        // },
      },
    ],
  };
}

function FinPart({ name, sum, sumData, expected, expectedData, unexpectedData, groups }) {
  const [modal, setModal] = useState();

  return (
    <>
      <Uu5Elements.Block
        header={
          <FinPartRow
            name={Utils.String.capitalize(name)}
            value={sum}
            data={sumData}
            colorScheme={sum < 0 ? "negative" : "positive"}
          />
        }
        headerType="title"
        card="full"
      >
        <FinPartRow name={"Očekávané " + name} value={expected} data={expectedData} />
        <FinPartRow name={"Neočekávané " + name} value={sum - expected} data={unexpectedData} />

        <Uu5Charts.PieChart
          {...getDataForPieChart(sum, expected, expectedData, unexpectedData, groups, (header, amount, data) =>
            setModal({ header, amount, data })
          )}
        />
      </Uu5Elements.Block>
      {modal && <TxModal {...modal} onClose={() => setModal(null)} />}
    </>
  );
}

const MonthSummary = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MonthSummary",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { data, date, account } = props;

    const [tx, setTx] = useState(() => new MonthTransactions(data));
    useEffect(() => setTx(new MonthTransactions(data)), [data]);

    const dateFrom = new UuDate(date).startOfMonth().toIsoString();
    const dateTo = new UuDate(date).shiftMonth(1).startOfMonth().toIsoString();

    //@@viewOn:render
    return (
      <Uu5Elements.Block header={<Amount value={tx.difference} />} headerType="heading">
        <Uu5Elements.Grid templateColumns="repeat(auto-fit, minmax(320px, 1fr))">
          <FinPart
            name="příjmy"
            sum={tx.incomes}
            sumData={tx.incomesTransactions}
            expected={tx.incomesExpected}
            expectedData={tx.incomesExpectedTransactions}
            unexpectedData={tx.incomesUnexpectedTransactions}
            groups={Category.GROUP_LIST}
          />
          <FinPart
            name="výdaje"
            sum={tx.costs}
            sumData={tx.costsTransactions}
            expected={tx.costsExpected}
            expectedData={tx.costsExpectedTransactions}
            unexpectedData={tx.costsUnexpectedTransactions}
            groups={Category.GROUP_LIST}
          />
        </Uu5Elements.Grid>

        <Categories txList={tx.transactions} dateFrom={dateFrom} dateTo={dateTo} account={account} />
      </Uu5Elements.Block>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { MonthSummary };
export default MonthSummary;
//@@viewOff:exports
