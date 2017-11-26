'use strict';

// do all of the graphing functions.

const ACC = 0;
const GYR = 1;
const ALT = 2;
const MAX_PTS = 1500;

function Grapher() {

    this.slider_init = false;
    this.base_time_value = 0;
    this.base_time = 0; //new Date.now() / 1000;

    this.series_data = [[], [], [] ];

    let palette = new Rickshaw.Color.Palette({scheme: 'colorwheel'});

    let scale_acc = d3.scale.linear().domain([-2, 5]);
    let scale_alt = d3.scale.linear().domain([-5, 120]);
    //let scale_gyr = d3.scale.linear().domain([0, 2000]);

    let chart = document.getElementById("chart");

    this.graph = new Rickshaw.Graph( {
            element: document.querySelector("#chart"),
            width: chart.clientWidth,
            height: chart.clientHeight,
            renderer: 'line',
            series: [ {
                name: 'acc',
                color: palette.color(),
                data: this.series_data[ACC],
                scale: scale_acc,
            },
            /**{
                name: 'gyr',
                color: palette.color(),
                data: series_data[GYR],
                scale: scale_gyr,
            }, **/
            {
                name: 'alt',
                color: palette.color(),
                data: this.series_data[ALT],
                scale: scale_alt,
            }],
    } );

    let time = new Rickshaw.Fixtures.Time();
    let units = time.unit('second');

    let x_axis = new Rickshaw.Graph.Axis.Time({
        graph: this.graph,
        ticksTreatment: 'glow',
        //timeUnit: units,
        timeFixture: new Rickshaw.Fixtures.Time.Local(),
        //tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    });

    x_axis.render();

    let y_axis_alt = new Rickshaw.Graph.Axis.Y.Scaled( {
            graph: this.graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis_alt'),
            scale: scale_alt,
    });

    /**let y_axis_gyr = new Rickshaw.Graph.Axis.Y.Scaled({
            graph: graph,
            orientation: 'right',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis_gyr'),
            scale: scale_gyr,
    });**/

    let y_axis_acc = new Rickshaw.Graph.Axis.Y.Scaled({
            graph: this.graph,
            orientation: 'right',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis_acc'),
            scale: scale_acc,
    });

    let legend = new Rickshaw.Graph.Legend( {
        element: document.querySelector('#legend'),
        graph: this.graph
    });

    let shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: this.graph,
        legend: legend
    });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: this.graph,
        legend: legend
    });

    let hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: this.graph,
        xFormatter: (x) => { return (x * 1000 - this.base_time) + "ms"},
        yFormatter: (y) => { return y },
    });

    this.graph.render();
}

Grapher.prototype.add_data = function(data){

    if (this.base_time_value === 0) {
        this.base_time_value = parseInt(data.t);
        this.base_time = Date.now();
    }

    const curr_time = this.base_time + data.t - this.base_time_value;
    const curr_time_s = curr_time / 1000;

    // change this to add and remove data.
    this.series_data[ACC].push({
        y: data.acc,
        x: curr_time_s,
    });

    if (this.series_data[ACC].length > MAX_PTS) {
        this.series_data[ACC].shift();
    }

    /**series_data[GYR].push({
        y: data.gyr,
        x: data.t,
    });**/

    this.series_data[ALT].push({
        y: data.alt,
        x: curr_time_s,
    });
    if (this.series_data[ALT].length > MAX_PTS) {
        this.series_data[ALT].shift();
    }

    this.graph.update();

    // now add a slider
    if (this.series_data[ALT].length > 10 && ! this.slider_init) {

        /**let slider = new Rickshaw.Graph.RangeSlider({
            graph: graph,
            element: document.querySelector('#slider')
        });**/

        /**var sliderXAxis = new Rickshaw.Graph.Axis.Time({
            graph: graph,
            timeFixture: new Rickshaw.Fixtures.Time.Local(),
            ticksTreatment: 'glow',
        });

        sliderXAxis.render();**/

        this.slider_init = true;
    }
};

Grapher.prototype.reset = function() {
    this.series_data.forEach((series) => {
        series.length = 0;
    });
    this.graph.update();
};

Grapher.prototype.load = function (data) {
    const loaded_data = JSON.parse(data);

    loaded_data[ALT].forEach((item) => {
        this.series_data[ALT].push(item);
    });

    loaded_data[ACC].forEach((item) => {
        this.series_data[ACC].push(item);
    });

    this.graph.update();
//    this.graph.render();
};
