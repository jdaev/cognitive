import { React, useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Block, Box, Table, Form } from "react-bulma-components";
import { weekday } from "./constants";
import {
  get25HourChanges,
  get25HourChangePercent,
  getXDaysBeforeDate,
  getStringDate,
} from "./utils";

function App() {
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("bitcoin");
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  var numberOfDays = 30;
  var currency = "cad";
  var startDate = Date.now();

  function handleSearchSubmit(search) {
    setSearch(search);
  }
  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${search}/market_chart?vs_currency=${currency}&days=${numberOfDays}&interval=daily`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function searchField() {
    return (
      <Form.Field>
        <Form.Label>Search Coin</Form.Label>
        <Form.Control>
          <Form.Input
            placeholder="e.g. Bitcoin, Arweave, Dowcoin, Efinity (CoinGecko Coin Id)"
            type="text"
            onChange={(e) => handleSearchSubmit(e.target.value)}
          />
        </Form.Control>
      </Form.Field>
    );
  }

  function dataTable() {
    console.log(items);
    if (error) {
      return <>{error.message}</>;
    } else if (items.error !== undefined) {
      return <>{items.error}</>;
    } else if (!isLoaded) {
      return <>loading...</>;
    } else {
      var rows = [];
      for (var i = 0; i < items.prices.length -1; i++) {
        rows.push(
          <tbody key={i}>
            <tr>
              <td>{getStringDate(getXDaysBeforeDate(startDate, i))}</td>
              <td>
                {weekday[new Date(getXDaysBeforeDate(startDate, i)).getDay()]}
              </td>
              <td>{items.prices[i][1].toFixed(2)}</td>
              <td>
                {get25HourChanges(items.prices[i][1], items.prices[i + 1][1])}
              </td>
              <td>
                {get25HourChangePercent(
                  items.prices[i][1],
                  items.prices[i + 1][1]
                )}
              </td>
              <td>{items.market_caps[i][1].toFixed(2)}</td>
              <td>{items.total_volumes[i][1].toFixed(2)}</td>
            </tr>
          </tbody>
        );
      }
      return (
        <Table align="center">
          <tbody>
            <tr>
              <th>Date</th>
              <th>Day Of The Week</th>
              <th>1 {search.toUpperCase()} to {currency.toUpperCase()} </th>
              <th>24 Hour Changes</th>
              <th>Change %</th>
              <th>Market Caps</th>
              <th>Total Volume</th>
            </tr>
          </tbody>
          {rows}
        </Table>
      );
    }
  }

  return (
    <>
      <Box style={{ width: 1280, margin: "auto" }} alignContent="center">
        <Block>{searchField()}</Block>
        <Block>{dataTable()}</Block>
      </Box>
    </>
  );
}

export default App;
