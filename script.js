// Fetch and convert the data into JSON, then create the chart

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then(response => response.json())
.then(response => {
    createHeatMap(response)
})

function createHeatMap(data) {
    console.log(data);

    let w;
    let h;
    let padding = 60;

    // Set SVG canvas dimensions conditionally based on user's device

    if(window.innerWidth > 992) {
        w = 1200;
        h = 700;
    } else if (window.innerWidth > 768) {
        w = 600;
        h = 400;
        
    } else {
        w = window.innerWidth;
        h = 350;
    }

    const svg = d3.select("#heat-map-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

    // Set up axes; x is based on year (27 ticks so that ticks are approx 10 years apart)
    // y axis is based on months; %B is D3 format for full year; months are zero-indexed in JS

    const xAxisScale = d3.scaleLinear()
    .domain([d3.min(data.monthlyVariance, (item) => item.year), d3.max(data.monthlyVariance, (item) => item.year)])
    .range([padding, w - padding])

    const yAxisScale = d3.scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([padding, h - padding])

    const xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format('d')).ticks(27);
    const yAxis = d3.axisLeft(yAxisScale).tickValues(yAxisScale.domain())
    .tickFormat((month) => {
        let date = new Date(0);
        date.setUTCMonth(month);
        let formatDate = d3.timeFormat('%B');
        return formatDate(date)
    });

    svg.append("g")
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr("transform", "translate(0," + (h - padding) + ")")

    svg.append("g")
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr("transform", "translate(" + padding + ",0)")

}
