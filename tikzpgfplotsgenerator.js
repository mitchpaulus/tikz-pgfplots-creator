const delimiterOptions = ["space", "tab", "comma", "colon", "semicolon","braces","&","ampersand"];
const markOptions = ["no marks", "*", "x", "+", "-", "|", "o",
      "asterisk", "star", "10-pointed-star","oplus","oplus*",
      "otimes","otimes*","square","square*","triangle","triangle*",
      "diamond","diamond*","halfdiamond*","halfsquare*",
      "halfsquare right*", "halfsquare left*","Mercedes star", "Mercedes star flipped",
      "halfcircle", "halfcircle*", "pentagon",
      "pentagon*", "cube", "cube*"];
const colorOptions = [
"red", "green","blue","cyan",
    "magenta","yellow","black","gray",
    "white","darkgray","lightgray","brown",
    "lime","olive","orange","pink","purple",
    "teal","violet"];


var commonPlotOptions = function () {

    var self = this;

    self.color = ko.observable("black");

    self.commonPlotOptionArray = ko.computed(function () {

        if (self.color()) {
            return [self.color()];
        }
        return [];
    });

}


var addPlotTable = function () {
    var self = this;

    self.delimiter = ko.observable("");
    self.mark = ko.observable("");

    self.filename = ko.observable("samplefile.csv");

    self.commonPlotOptions = new commonPlotOptions();


    self.options = ko.computed(function () {
        var optionArray = [];

        if (self.mark() == "" || self.mark() === "no marks"){
            optionArray.push("no marks");
        }
        else {
            optionArray.push(`mark=${self.mark()}`)
        }

        optionArray.push("col sep=" + self.delimiter());

        optionArray.push(self.commonPlotOptions.commonPlotOptionArray());

        return optionArray;
    
    }); 
    

    self.ToOutput = ko.computed(function () {

        var output = "\\addplot[";

        var addedOptions = self.options().reduce(function (accum, value, index, options) {
            return accum + value + ", ";
        }, output );

        return `${addedOptions}] table{${self.filename()}};\r\n`;
        //return "\\addplot[col sep=" + self.delimiter() + "] table{filename};\r\n";
    });

    self.templateName = function () {
        return "table";
    };
};


var mathSeries = function () {
    var self = this;

    self.commonPlotOptions = new commonPlotOptions();

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


    self.plots = ko.observableArray([]);

    self.addTableSeries = function () {
        self.plots.push(new addPlotTable());
    };

    self.addMathSeries = function () {
        self.plots.push(new mathSeries());
    };

    self.seriesTemplateName = function (plot) {
        return plot.templateName();
    }


    self.removePlot = function (plot) {
        self.plots.remove(plot);
    };

    self.allGrid = ko.observable(false);
    self.hideAllTicks = ko.observable(false);

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
        }, output );

        addedOptions = addedOptions + "]\r\n";

        self.plots().map(function (plot) {
            addedOptions = addedOptions + plot.ToOutput();
        });

        return addedOptions + "\r\n\\end{axis}\r\n"
    };

}


var viewModel = function () {

    var self = this;


    self.includeGrid = ko.observable(true);

    self.axes = ko.observableArray([new axis()]);

    //self.series = ko.observableArray([]);

    self.addAxis = function () {
        self.axes.push(new axis());
    };



    //var baseOutput = "\\begin{tikzpicture}\r\n\\end{tikzplot}";

    self.output = ko.computed(function () {

        var outputSring = "\\begin{tikzpicture}\r\n";

        self.axes().map(function (axis) {
            outputSring = outputSring + axis.ToOutput();
        });

        //self.series().map(function (serie) {
         //   outputSring = outputSring + serie.ToOutput();
        //});


        outputSring = outputSring + "\\end{tikzpicture}\r\n";

        self.axes().map(function (axis) {
        });


        return outputSring;
    });

}


ko.applyBindings(new viewModel());


