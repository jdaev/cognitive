import { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Table } from "react-bulma-components";

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

  function calculate25HourChanges(start, finish) {
    return (finish - start).toFixed(2);
  }

  function calculate25HourChangePercent(start, finish) {
    return (((finish - start) / start) * 100).toFixed(2);
  }

  function getXDaysBeforeDate(start, interval) {
    var days = 86400000; //number of milliseconds in a day
    var xDaysAgo = new Date(start - interval * days);
    return xDaysAgo;
  }

  function getStringDate(date) {
    var parsedDate = new Date(date);
    var month = months[parsedDate.getMonth()];

    return month + " " + parsedDate.getDate() + ", " + parsedDate.getFullYear();
  }

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
              {calculate25HourChanges(
                items.prices[i][1],
                items.prices[i + 1][1]
              )}
            </td>
            <td>
              {calculate25HourChangePercent(
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
