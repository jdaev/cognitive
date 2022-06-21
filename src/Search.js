import "bulma/css/bulma.min.css";
import { Form } from "react-bulma-components";

function SearchCoin() {
  return (
    <Form.Field>
      <Form.Label>Search Coin</Form.Label>
      <Form.Control>
        <Form.Input placeholder="e.g. Bitcoin" type="text" />
      </Form.Control>
    </Form.Field>
  );
}

export default SearchCoin;
