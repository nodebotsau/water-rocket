'use strict';

// do all of the graphing functions.

const ACC = 0;
const GYR = 1;
const ALT = 2;
const SMO_ALT = 3;

const MAX_PTS = 1500;
const MV_AVG_PTS = 8;

function Grapher() {

    this.slider_init = false;
    this.base_time_value = 0;
    this.base_time = 0; //new Date.now() / 1000;

    this.series_data = [[], [], [], [] ];

    let palette = new Rickshaw.Color.Palette({scheme: 'colorwheel'});

    let scale_acc = d3.scale.linear().domain([-5, 9]);
    let scale_alt = d3.scale.linear().domain([-30, 120]);

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
            {
                name: 'alt',
                color: palette.color(),
                data: this.series_data[ALT],
                scale: scale_alt,
            },
            {
                name: 'smoothed_alt',
                color: palette.color(),
                data: this.series_data[SMO_ALT],
                scale: scale_alt,
            }],
    } );

    this.slider = null;

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

    this.series_data[ALT].push({
        y: data.alt,
        x: curr_time_s,
    });
    if (this.series_data[ALT].length > MAX_PTS) {
        this.series_data[ALT].shift();
    }

    // work out smoothed average so get the appropriate indexes
    let start = 0;
    const end = this.series_data[ALT].length - 1;
    if (this.series_data[ALT].length > MV_AVG_PTS) {
        start = this.series_data[ALT].length - MV_AVG_PTS;
    }

    let sum = 0;
    for (let i = start; i <= end; i++) {
        sum = sum + this.series_data[ALT][i].y;
    }

    const avg = sum / MV_AVG_PTS;

    this.series_data[SMO_ALT].push({
        y: avg,
        x: curr_time_s,
    });
    if (this.series_data[SMO_ALT].length > MAX_PTS) {
        this.series_data[SMO_ALT].shift();
    }

    this.graph.update();
};

Grapher.prototype.reset = function() {

    let loaded_data = this.slider_init;

    this.remove_slider();
    while (this.series_data[ALT].length > 0) {
        this.series_data[ALT].shift();
    }
    while (this.series_data[SMO_ALT].length > 0) {
        this.series_data[SMO_ALT].shift();
    }
    while (this.series_data[ACC].length > 0) {
        this.series_data[ACC].shift();
    }

    if (! loaded_data) {
        this.graph.update();
    }
};

Grapher.prototype.load = function (data) {
    // load new data up into the graph.
    const loaded_data = JSON.parse(data);

    loaded_data[ALT].forEach((item) => {
        this.series_data[ALT].push(item);
    });

    loaded_data[ACC].forEach((item) => {
        this.series_data[ACC].push(item);
    });

    if (loaded_data[SMO_ALT]) {
        loaded_data[SMO_ALT].forEach((item) => {
            this.series_data[SMO_ALT].push(item);
        });
    }

    this.graph.update();
    this.add_slider();
};

Grapher.prototype.add_slider = function() {
    // adds a slider to the viz.

    if (! this.slider_init) {

        this.slider = new Rickshaw.Graph.RangeSlider({
            graph: this.graph,
            element: document.querySelector('#slider')
        });

        this.slider_init = true;
    }
};

Grapher.prototype.remove_slider = function() {
    // adds a slider to the viz.

    if (this.slider_init) {

        this.slider = null;
        let element = document.querySelector("#slider");
        let new_slider = document.createElement("div");
        new_slider.setAttribute("id", "slider");

        let p = element.parentNode;
        p.replaceChild(new_slider, element);

        this.slider_init = false;
    }
};
