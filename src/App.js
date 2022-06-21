import { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Table } from "react-bulma-components";
import { weekday } from "./constants";
import {
  get25HourChanges,
  get25HourChangePercent,
  getXDaysBeforeDate,
  getStringDate,
} from "./utils";

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  var coin = "bitcoin";
  var numberOfDays = 30;
  var startDate = Date.now();

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/arweave/market_chart?vs_currency=cad&days=30&interval=daily"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <>{error.message}</>;
  } else if (!isLoaded) {
    return <>loading...</>;
  } else {
    var rows = [];
    for (var i = 0; i < numberOfDays; i++) {
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
      <Table>
        <tbody>
          <tr>
            <th>Date</th>
            <th>Day Of The Week</th>
            <th>Prices</th>
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

export default App;
