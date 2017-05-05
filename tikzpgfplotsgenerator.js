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

const lineSettingOptions = [
    "box","left","middle","center","right","none"
];

const legendPosOptions = [
"south west","south east","north west","north east","outer north east"
]

const anchorOptions = [
"center","north","south","west","east","north east","south east","south west","north west"
]

var commonPlotOptions = function () {

    var self = this;

    self.color = ko.observable("black");
    self.mark = ko.observable("");

    self.makeSmooth = ko.observable(false);

    self.commonPlotOptionArray = ko.computed(function () {
        var optionArray = [];


        if (self.color()) {
            optionArray.push(self.color());
        }

        if (self.mark() == "" || self.mark() === "no marks"){
            optionArray.push("no marks");
        }
        else {
            optionArray.push(`mark=${self.mark()}`)
        }


        if (self.makeSmooth()) {
            optionArray.push("smooth");
        }

        return optionArray;
    });

}


var addPlotTable = function () {
    var self = this;

    self.delimiter = ko.observable("");

    self.filename = ko.observable("samplefile.csv");

    self.commonPlotOptions = new commonPlotOptions();


    self.options = ko.computed(function () {
        var optionArray = [];

        optionArray.push("col sep=" + self.delimiter());

        return optionArray;
    
    }); 
    

    self.ToOutput = ko.computed(function () {

        var output = "\\addplot[";

        var addedOptions = self.commonPlotOptions.commonPlotOptionArray().reduce(function (accum, value, index, options) {
            if (index === self.commonPlotOptions.commonPlotOptionArray().length-1){
                return accum + value;
            } else {
                return accum + value + ", ";
            }
        }, output );

        var tableSpecificOptions = self.options().reduce(function (accum, value, index, options) {
            if (index === self.options().length-1){
                return accum + value;
            } else {
                return accum + value + ", ";
            }
            return accum + value + ", ";
        }, "" );

        return `${addedOptions}] table[${tableSpecificOptions}]{${self.filename()}};\r\n`;
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

    self.rotateYAxis = ko.observable(false);
    self.rotateYAxisAngle = ko.observable("-90");

    self.removePlot = function (plot) {
        self.plots.remove(plot);
    };

    self.allGrid = ko.observable(false);
    self.hideAllTicks = ko.observable(false);


    self.yLabel = ko.observable("y");
    self.xLabel = ko.observable("x");

    self.xMin = ko.observable("0");
    self.xMax = ko.observable("1");
    self.yMin = ko.observable("0");
    self.yMax = ko.observable("1");

    self.setAxisLimits = ko.observable(false);

    self.styleXLabel = ko.observable(false);
    self.xLabelXLocation = ko.observable("0.5");
    self.xLabelYLocation = ko.observable("-0.1");

    self.styleYLabel = ko.observable(false);

    self.useNonBoxAxis = ko.observable(false);
    self.axisXLineSetting = ko.observable("box");
    self.axisYLineSetting = ko.observable("box");
    self.axisLineSetting = ko.observable("box");
    

    self.showLegend = ko.observable(false);
    self.shorthandLegendPos = ko.observable("north east");
    self.legendPosType = ko.observable("shorthand");
    self.legendXCustomPos = ko.observable("0.9");
    self.legendYCustomPos = ko.observable("0.9");
    self.legendAnchor = ko.observable("south");


    self.options = ko.computed(function () {
        optionArray = [];

        optionArray.push("x label={" + self.xLabel() + "}");
        optionArray.push("y label={" + self.yLabel() + "}");

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

        if (self.rotateYAxis()) {
            optionArray.push("y label style={rotate=" + self.rotateYAxisAngle() + "}");
        }

        if (self.useNonBoxAxis()) {
            optionArray.push("axis lines=" + self.axisLineSetting());
        }


        if (self.showLegend()) {
           if (self.legendPosType() === "shorthand") {
               optionArray.push("legend pos=" + self.shorthandLegendPos());
           }
           else if (self.legendPosType() === "custom") {
               optionArray.push("legend style={at={(" + self.legendXCustomPos() + "," + self.legendYCustomPos() + ")}, anchor=" + self.legendAnchor() + "}");
           }
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
    self.preambleOutput = ko.computed(function () {
        return  "%% Some packages you will need\r\n" +  "\\usepackage{tikz}\r\n\\usepackage{pgfplots}\r\n\r\n";
    });


    self.output = ko.computed(function () {
        var outputSring =  "\\begin{tikzpicture}\r\n";

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


