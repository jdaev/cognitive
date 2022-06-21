import { months } from "./constants";

function get25HourChanges(start, finish) {
  return (finish - start).toFixed(2);
}

function get25HourChangePercent(start, finish) {
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

export {
  get25HourChanges,
  get25HourChangePercent,
  getXDaysBeforeDate,
  getStringDate,
};
