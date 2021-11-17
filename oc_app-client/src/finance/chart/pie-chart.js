import UU5 from "uu5g04";
import "uu5chartg01";

const COLOR_GREY = "#93A4AD";

const COLORS_BLUE1 = [
  "#1976D2",
  "#2196F3",
  "#64B5F6",
  "#9AD6FE",
  "#C4E7FE"
];

const COLORS_BLUE2 = [
  "#303F9F",
  "#3F51B5",
  "#7986CB",
  "#9AD6FE",
  "#B1B8E5"
];

const COLORS_VIOLET = [
  "#7B1FA2",
  "#9C27B0",
  "#BA68C8",
  "#E0A5E3",
  "#EDC9EF"
];

const COLORS_CYAN = [
  "#0097A7",
  "#00BCD4",
  "#4DD0E1",
  "#81E6F0",
  "#B6F0F6"
];

const COLORS = [
  COLORS_BLUE1,
  COLORS_BLUE2,
  COLORS_VIOLET,
  COLORS_CYAN
];
const COLOR_PALETTE_COUNT = 4;

//@@viewOn:helpers
function buildColors(count) {
  let colors = [];
  if (count < 1) return colors;
  count = count > 20 ? 20 : count;
  let rest = count % COLOR_PALETTE_COUNT;
  let palette = Math.floor(count / COLOR_PALETTE_COUNT);

  for (let p = 0; p < COLOR_PALETTE_COUNT; p++) {
    for (let i = 0; i < palette; i++) {
      colors.push(COLORS[p][i]);
    }
    if (p < rest) colors.push(COLORS[p][palette]);
  }
  return colors;
}

function renderTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "rgba(255, 255, 255, .7)",
        padding: 8,
        border: "1px solid lightgray",
        borderRadius: 4
      }}>
        {payload[0].name}:
        &nbsp;
        <UU5.Bricks.Number value={payload[0].value} rounded={0} />
        &nbsp;
        Kč
      </div>
    );
  }
  return null;
}

function PieChart(props) {
  const data = props.data.reverse();

  const colors = buildColors(data.length).reverse();

  return (
    <UU5.Chart.PieChart responsive series={[{ labelKey: "label", valueKey: "value" }]} height={400}>
      <UU5.Chart.Pie
        data={data}
        dataKey="value"
        nameKey="label"
        cx="40%"
        label={({ label }) => label}
        startAngle={90}
        endAngle={360 + 90}
      >
        {data.map(({ color, onClick }, i) => (
          <UU5.Chart.Cell key={i} fill={color === "grey" ? COLOR_GREY : (color || colors[i])} onClick={onClick} />
        ))}
      </UU5.Chart.Pie>
      <UU5.Chart.Tooltip content={renderTooltip} />
    </UU5.Chart.PieChart>
  );
}

export default PieChart;
