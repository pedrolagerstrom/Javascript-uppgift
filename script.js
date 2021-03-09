const url = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/96350/period/latest-months/data.json";
// const url = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/98210/period/latest-months/data.json";
var stationData = {};
var dates = [];
const stationTable = document.querySelector(".station-table tbody");
const tableTemp = document.querySelector(".temp");
const tableDate = document.querySelector(".date");
const infobox = document.querySelector(".info-box");


tableDate.addEventListener("click", sortDate);
tableTemp.addEventListener("click", sortTemp);

getData();
async function getData() {
	try{
		var response = await fetch(url);
		var jsonData = await response.json();
	}catch (error) {
		console.error(error);
	}
	
	stationData = jsonData;
	dates = jsonData.value;
	renderDatesTable();
	renderInfobox();
}


function renderInfobox() {
	var html = `<p>Kallaste temperaturen: <strong>${getColdestTemperature().value} (°C)</strong></p>
	<p>Varmaste temperaturen: <strong>${getWarmestTemperature().value} (°C)</strong></p>`;
	
	infobox.innerHTML = html;
}


function renderDatesTable() {
	var html = dates.map((value) =>
	 `<tr>
		<td>${value.value}</td>
		<td>${new Date(value.date).toLocaleString()}</td>
	<tr>`).join("");
	
	stationTable.innerHTML = html;
}

function sortDate() {
	this.dataset.sortAsc ? dates.sort((a, b) => 
		a[this.dataset.valueField] < b[this.dataset.valueField] ? 1 : -1)
		: dates.sort((a, b) =>
		a[this.dataset.valueField] > b[this.dataset.valueField] ? 1 : -1);
	
	this.dataset.sortAsc = this.dataset.sortAsc ? "" : "true";

renderDatesTable();	
};


function sortTemp() {
	this.dataset.sortAsc ? dates.sort((a, b) => 
		parseFloat(a[this.dataset.valueField]) < parseFloat(b[this.dataset.valueField]) ? 1 : -1)
		: dates.sort((a, b) =>
		parseFloat(a[this.dataset.valueField]) > parseFloat(b[this.dataset.valueField]) ? 1 : -1);
		
	this.dataset.sortAsc = this.dataset.sortAsc ? "" : "true";

renderDatesTable();	
};


function getColdestTemperature() {
	return stationData.value.reduce((max, currentTemperature) => {
		if (parseFloat(currentTemperature.value) < parseFloat(max.value)) {
			return currentTemperature;
		} else {
			return max;
		}
	});
}

function getWarmestTemperature() {
	return stationData.value.reduce((max, currentTemperature) => {
		if (parseFloat(currentTemperature.value) > parseFloat(max.value)) {
			return currentTemperature;
		} else {
			return max;
		}
	});
}