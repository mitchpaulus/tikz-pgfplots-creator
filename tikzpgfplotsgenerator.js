var delimiterOptions = ["space", "tab", "comma", "colon", "semicolon","braces","&","ampersand"]

var addPlotTable = function () {
    var self = this;

    self.delimiter = ko.observable("");


    self.options = [ self.delimiter]; 

    
    self.ToOutput = ko.computed(function () {
        return "\\addplot[col sep=" + self.delimiter() + "] table{filename};\r\n";
    });

    self.templateName = function () {
        return "table";
    };
};


var mathSeries = function () {
    var self = this;



    self.minDomain = ko.observable(0);
    self.maxDomain = ko.observable(1);

    self.samples = ko.observable(50);

    self.expression = ko.observable("x+1");

    self.ToOutput = ko.computed(function () {
        return "\\addplot[domain=" + self.minDomain() + ":" + self.maxDomain() + ", samples=" + self.samples() + "] {" + self.expression() + "};\r\n";
    });

    self.templateName = function () {
        return "math-expression";
    };

};




var axis = function () {
    var self = this;


    self.allGrid = ko.observable(true);
    self.hideAllTicks = ko.observable(true);

    self.xMin = ko.observable("0");
    self.xMax = ko.observable("1");
    self.yMin = ko.observable("0");
    self.yMax = ko.observable("1");

    self.setAxisLimits = ko.observable(false);

    self.styleXLabel = ko.observable(false);
    self.xLabelXLocation = ko.observable("0.5");
    self.xLabelYLocation = ko.observable("-0.1");

    self.styleYLabel = ko.observable(false);

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
            optionArray.push("xmax=" + self.xMax())
            optionArray.push("ymin=" + self.yMin())
            optionArray.push("ymax=" + self.yMax())
        }

        if (self.styleXLabel()) {
            optionArray.push(`x label style={at{(axis description cs:${self.xLabelXLocation()},${self.xLabelYLocation()})}}`);
        }

        return optionArray;
    });


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

    self.seriesTemplateName = function (series) {
        return series.templateName();
    }

    self.includeGrid = ko.observable(true);

    self.axes = ko.observableArray([new axis()]);

    self.series = ko.observableArray([]);

    self.addAxis = function () {
        self.axes.push(new axis());
    };

    self.addTableSeries = function () {
        self.series.push(new addPlotTable());
    };

    self.addMathSeries = function () {
        self.series.push(new mathSeries());
    };

    var baseOutput = "\\begin{tikzplot}\r\n\\end{tikzplot}";

    self.output = ko.computed(function () {

        var outputSring = "\\begin{tikzplot}\r\n";

        self.axes().map(function (axis) {
            outputSring = outputSring + axis.ToOutput();
        });

        self.series().map(function (serie) {
            outputSring = outputSring + serie.ToOutput();
        });


        outputSring = outputSring + "\\end{tikzplot}\r\n";

        self.axes().map(function (axis) {
        });


        return outputSring;
    });

}


ko.applyBindings(new viewModel());


