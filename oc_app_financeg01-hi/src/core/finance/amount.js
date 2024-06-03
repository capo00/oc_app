import Uu5Elements from "uu5g05-elements";

function Amount({ value }) {
  return (
    <Uu5Elements.Text colorScheme={value < 0 ? "negative" : "positive"}>
      <Uu5Elements.Number value={value} currency="CZK" />
    </Uu5Elements.Text>
  );
}

export default Amount;
