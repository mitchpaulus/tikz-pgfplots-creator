var delimiterOptions = ["comma", "tab"]

var addPlotTable = function () {
    var self = this;

    self.delimiter = ko.observable("");


    
    self.ToOutput = ko.computed(function () {
        return "\\addplot[] table{filename};\r\n";
    });
};





var axis = function () {
    var self = this;

    self.allGrid = ko.observable(true);
    self.hideAllTicks = ko.observable(true);

    self.xMin = ko.observable("0");

    self.setAxisLimits = ko.observable(false);

    self.options = ko.computed(function () {
        optionArray = [];

        if (self.allGrid()) {
            optionArray.push("grid")
        }

        if (self.hideAllTicks()) {
            optionArray.push("ticks=none")
        }

        if (self.setAxisLimits()) {
            optionArray.push("xmin=" + self.xMin())
        }

        return optionArray;
    }
    )


        self.ToOutput = function () {
            var output = "\\begin{axis}\r\n[\r\n";

            var addedOptions = self.options().reduce(function (accum, value, index, options) {
                return accum + '    ' + value + ",\r\n";
            }, output )
            return addedOptions + "]\r\n\\end{axis}\r\n"
        };


}


var viewModel = function () {

    var self = this;
    self.includeGrid = ko.observable(true);

    self.axes = ko.observableArray([new axis()]);

    self.series = ko.observableArray([]);

    self.addAxis = function () {
        self.axes.push(new axis());
    };

    self.addSeries = function () {
        self.series.push(new addPlotTable());
    };

    var baseOutput = "\\begin{tikzplot}\r\n\\end{tikzplot}"

        self.output = ko.computed(function () {

            var outputSring = "\\begin{tikzplot}\r\n"

            self.axes().map(function (axis) {
                outputSring = outputSring + axis.ToOutput();
            })

            self.series().map(function (serie) {
                outputSring = outputSring + serie.ToOutput();
            })


        outputSring = outputSring + "\\end{tikzplot}\r\n"

            self.axes().map(function (axis) {
            });


        return outputSring;
        })

}


ko.applyBindings(new viewModel() );


