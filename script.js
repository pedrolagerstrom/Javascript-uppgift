const url = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/96350/period/latest-months/data.json";
var stationData = {};
var dates = [];
var filterdData = [];
const stationTable = document.querySelector(".station-table tbody");
const tableTemp = document.querySelector(".temp");
const tableDate = document.querySelector(".date");
const infobox = document.querySelector(".info-box");
const filterBtn = document.querySelector(".filter-btn");
const fromDate = document.querySelector(".fromDate");
const toDate = document.querySelector(".toDate");


tableDate.addEventListener("click", sortDate);
tableTemp.addEventListener("click", sortTemp);
filterBtn.addEventListener("click", filterByDate);

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
	filterdData = jsonData.value;
	renderDatesTable();
	renderInfobox();
	updateChart(filterdData);
}


function renderInfobox() {
	var html = `<p>Kallaste temperaturen: <strong>${getColdestTemperature().value} (°C) ${new Date(getColdestTemperature().date).toLocaleString()}</strong></p>
	<p>Varmaste temperaturen: <strong>${getWarmestTemperature().value} (°C) ${new Date(getWarmestTemperature().date).toLocaleString()}</strong></p>
	<p>Dagens temperatur: <strong>${toDay().value} (°C) ${new Date(toDay().date).toLocaleString()}</strong></p>`;
	
	infobox.innerHTML = html;
}


function renderDatesTable() {
	var html = filterdData.map((value) =>
	 `<tr>
		<td>${value.value}</td>
		<td>${new Date(value.date).toLocaleString()}</td>
	<tr>`).join("");
	
	stationTable.innerHTML = html;
}

function sortDate() {
	this.dataset.sortAsc ? filterdData.sort((a, b) => 
		a[this.dataset.valueField] < b[this.dataset.valueField] ? 1 : -1)
		: filterdData.sort((a, b) =>
		a[this.dataset.valueField] > b[this.dataset.valueField] ? 1 : -1);
	
	this.dataset.sortAsc = this.dataset.sortAsc ? "" : "true";

renderDatesTable();	
};


function sortTemp() {
	this.dataset.sortAsc ? filterdData.sort((a, b) => 
		parseFloat(a[this.dataset.valueField]) < parseFloat(b[this.dataset.valueField]) ? 1 : -1)
		: filterdData.sort((a, b) =>
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

function filterByDate() {
	const filterdDates = dates.filter((currentValue) =>
	currentValue.date > new Date(fromDate.value).getTime() &&
	currentValue.date <= new Date(toDate.value).setHours(23));
	//console.log(fromDate.value)
	//console.log(filterdDates);
filterdData = filterdDates;
renderDatesTable();
updateChart(filterdData);
}

function toDay(){
	return stationData.value[260];
}


const ctx = document.getElementById("line-chart").getContext("2d");
const chart = new Chart(ctx, {
    type: "line",
    options: {
        scales: {
            xAxes: [
                {
                    type: "time",
                },
            ],
        },
    },
});

function updateChart(filterdData) {
    const newDataset = {
        label: `${stationData.parameter.name} - ${stationData.station.name}`,
        data: filterdData.map((dataPoint) => {
            return { t: dataPoint.date, y: dataPoint.value };
        }),
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
    };

    chart.data.datasets.push(newDataset);
    chart.update();
}