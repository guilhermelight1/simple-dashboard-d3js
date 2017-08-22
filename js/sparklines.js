(function () {
    // get data and draw things
    d3.json('data/2017-category-sales.json', (error, data) => {
        if (error) {
            return console.error(error);
        }

        data.contents.forEach(function (ds) {
            showHeader(ds);
            buildLine(ds);
        });
    });

    function showHeader(ds) {
        d3.select('#bottomLeft')
            .append('h2')
            .text(`${ds.category} Sales Trend (2017)`);
    }

    function buildLine(ds) {
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 100 - margin.top - margin.bottom;

        //scales
        const xScale = d3.scale.linear()
            .domain([
                d3.min(ds.monthlySales, d => d.month),
                d3.max(ds.monthlySales, d => d.month)
            ])
            .range([0, width])
            .nice();


        const yScale = d3.scale.linear()
            .domain([0, d3.max(ds.monthlySales, d => d.sales)])
            .range([height, 0])
            .nice();

        const lineFun = d3.svg.line()
            .x(d => xScale(d.month))
            .y(d => yScale(d.sales))
            .interpolate('linear');


        const svg = d3.select('#bottomLeft')
            .append('svg')
            .attr({ width, height });

        const viz = svg.append('path')
            .attr({
                d: lineFun(ds.monthlySales),
                'stroke': '#666666',
                'stroke-width': 2,
                'fill': 'none'
            });
    }
})();