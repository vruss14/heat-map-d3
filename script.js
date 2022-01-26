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

    let firstYear = d3.min(data.monthlyVariance, (item) => item.year);
    let lastYear = d3.max(data.monthlyVariance, (item) => item.year);
    let yrsRange = lastYear - firstYear;

    let tooltip = d3.select('#tooltip');

    // Set up axes; x is based on year (27 ticks so that ticks are approx. 10 years apart)
    // y axis is based on months; %B is D3 format for full year; months are zero-indexed in JS
    // Domain on x axis has a buffer of one year on either side

    const xAxisScale = d3.scaleLinear()
    .domain([firstYear - 1, lastYear + 1])
    .range([padding, w - padding])

    const yAxisScale = d3.scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, h - padding])

    const xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format('d')).ticks(27);
    const yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat('%B'));

    svg.append("g")
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr("transform", "translate(0," + (h - padding) + ")")

    svg.append("g")
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr("transform", "translate(" + padding + ",0)")

    // Create the bars for each data point

    svg.selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr('fill', 'black')
    .attr("data-month", (d) => `${d.month - 1}`)
    .attr("data-year", (d) => `${d.year}`)
    .attr("data-temp", (d) => `${d.variance}`)
    .attr('fill', (d => {

        if(d.variance <= -2) {
            return 'MidnightBlue'
        } else if (d.variance <= -1) {
            return 'SteelBlue'
        } else if (d.variance <= 0) {
            return 'PowderBlue'
        } else if (d.variance <= 1) {
            return 'LightSalmon'
        } else if (d.variance <= 2) {
            return 'Tomato'
        } else {
            return 'DarkRed'
        }
    }))
    .attr('height', ((h - (2 * padding)) / 12))
    .attr('y', (d) => {
        return yAxisScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0))
    })
    .attr('width', () => {
        return ((w - (2 * padding)) / yrsRange)
    })
    .attr('x', (d) => {
        return xAxisScale(d.year);
    })
    .on('mouseover', (event) => {
        let d = event.target.__data__;

        tooltip.transition()
        .style('visibility', 'visible')
        .style('left', () => {
            return (event.target.x + 30)
        })
        .style('top', event.target.y)

        tooltip.attr('data-year', d.year)

        let yearConversion = (num) => {
            switch (num) {
                case 1:
                    return 'January';
                case 2:
                    return 'February';
                case 3:
                    return 'March';
                case 4:
                    return 'April';
                case 5:
                    return 'May';
                case 6:
                    return 'June';
                case 7:
                    return 'July';
                case 8:
                    return 'August';
                case 9:
                    return 'September';
                case 10:
                    return 'October';
                case 11:
                    return 'November';
                case 12:
                    return 'December';
                default:
                    break;
            }
        }
        
        tooltip.html(`
        <p>${yearConversion(d.month)} ${d.year}</p>
        <p>${(data.baseTemperature + d.variance).toPrecision(4)} °C</p>`)

    })
    .on('mouseout', () => {
        tooltip.transition()
        .style('visibility', 'hidden')
    })

}
