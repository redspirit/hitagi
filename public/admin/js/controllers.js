app.controller('MainCtrl', function($scope) {

});


app.controller('gaugeCtrl', function($scope, $timeout) {
    $scope.animationTime = 10;
    $scope.value = 3200;
    $scope.maxValue = 5000;
    $scope.gaugeType = 'gauge';

    $scope.gaugeOptions = {
        lines: 12,
        // The number of lines to draw
        angle: 0,
        // The length of each line
        lineWidth: 0.4,
        // The line thickness
        pointer: {
            length: 0.75,
            // The radius of the inner circle
            strokeWidth: 0.042,
            // The rotation offset
            color: '#1D212A' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#1ABC9C',
        // Colors
        colorStop: '#1ABC9C',
        // just experiment with them
        strokeColor: '#F0F3F3',
        // to see which ones work best for you
        generateGradient: true
    };

    $scope.donutGaugeOptions = {
        lines: 12,
        // The number of lines to draw
        angle: 0.15,
        // The length of each line
        lineWidth: 0.044,
        // The line thickness
        pointer: {
            length: 0.09,
            // The radius of the inner circle
            strokeWidth: 0.0035,
            // The rotation offset
            color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#E0E0E0',
        // to see which ones work best for you
        generateGradient: true
    };
});

app.controller('modalCtrl', function($scope, $modal) {

    $scope.open1 = function() {

        var modalInstance = $modal.open({
            templateUrl: 'views/modal_1.html',
            controller: ModalInstanceCtrl
        });
    };

    $scope.open2 = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal_2.html',
            controller: ModalInstanceCtrl
        });
    };

    $scope.open3 = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal_3.html',
            controller: ModalInstanceCtrl
        });
    };

});

function ModalInstanceCtrl($scope, $modalInstance) {

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};


app.controller('AddDynamicNotificationsExampleCtrl', function($scope, $modal) {

    /**
     * Initialize index
     * @type {number}
     */
    var index = 0;

    /**
     * Boolean to show error if new notification is invalid
     * @type {boolean}
     */
    $scope.invalidNotification = false;

    /**
     * Placeholder for notifications
     *
     * We use a hash with auto incrementing key
     * so we can use "track by" in ng-repeat
     *
     * @type
     */
    $scope.notifications = {};

    /**
     * Add a notification
     *
     * @param notification
     */
    $scope.add = function(notification) {

        var i;

        if (!notification) {
            $scope.invalidNotification = true;
            return;
        }

        i = index++;
        $scope.invalidNotification = false;
        $scope.notifications[i] = notification;
    };

});


/**
 * nestableCtrl - Controller for nestable list
 */
app.controller('nestableCtrl', function($scope) {

    $scope.list = [{
        "id": 1,
        "title": "node1",
        "items": []
    }, {
        "id": 2,
        "title": "node2",
        "items": [{
            "id": 21,
            "title": "node2.1",
            "items": [{
                "id": 211,
                "title": "node2.1.1",
                "items": []
            }, {
                "id": 212,
                "title": "node2.1.2",
                "items": []
            }],
        }, {
            "id": 22,
            "title": "node2.2",
            "items": []
        }],
    }, {
        "id": 3,
        "title": "node3",
        "items": []
    }, {
        "id": 4,
        "title": "node4",
        "items": []
    }];

    $scope.selectedItem = {};

    $scope.options = {};

    $scope.remove = function(scope) {
        scope.remove();
    };

    $scope.toggle = function(scope) {
        scope.toggle();
    };

    $scope.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        nodeData.items.push({
            id: nodeData.id * 10 + nodeData.items.length,
            title: nodeData.title + '.' + (nodeData.items.length + 1),
            items: []
        });
    };
});


app.controller('validationCtrl', function($scope) {
    // function to submit the form after all validation has occurred            
    $scope.submitForm = function(isValid) {

        // check to make sure the form is completely valid
        if (isValid) {
            alert('our form is amazing');
        }

    };

});

app.controller('calCtrl', function($scope) {
    $scope.options = {
        weekOffset: 1,
        daysOfTheWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    };
});


app.controller('calCtrl', function($scope) {

    $scope.chart = null;
    $scope.columns = [];
    $scope.types = {};
    $scope.axis = {};
    $scope.axes = {};
    $scope.xValues = null;
    $scope.xTick = null;
    $scope.names = null;
    $scope.colors = null;
    $scope.grid = null;
    $scope.legend = null;
    $scope.tooltip = null;
    $scope.chartSize = null;
    $scope.colors = null;
    $scope.jsonKeys = null;

    this.showGraph = function() {
        var config = {};
        config.bindto = "#" + $scope.bindto;
        config.data = {}

        if ($scope.chartData && $scope.chartColumns) {
            $scope.$watchCollection('chartData', function() {
                loadChartData();
            });
            $scope.jsonKeys = {};
            $scope.jsonKeys.value = [];
            angular.forEach($scope.chartColumns, function(column) {
                $scope.jsonKeys.value.push(column.id);
                addColumnProperties(column.id, column.type, column.name, column.color);
            });
            if ($scope.chartX) {
                $scope.jsonKeys.x = $scope.chartX.id;
            }
            config.data.keys = $scope.jsonKeys;
            config.data.json = $scope.chartData;
        }

        if ($scope.xValues) {
            config.data.x = $scope.xValues;
        }
        if ($scope.columns) {
            config.data.columns = $scope.columns;
        }
        config.data.types = $scope.types;
        config.data.axes = $scope.axes;
        if ($scope.names) {
            config.data.names = $scope.names;
        }
        if ($scope.colors) {
            config.data.colors = $scope.colors;
        }
        if ($scope.showLabels && $scope.showLabels === "true") {
            config.data.labels = true;
        }
        if ($scope.showSubchart && $scope.showSubchart === "true") {
            config.subchart = {
                "show": true
            };
        }
        if ($scope.enableZoom && $scope.enableZoom === "true") {
            config.zoom = {
                "enabled": true
            };
        }
        config.axis = $scope.axis;
        if ($scope.xTick) {
            config.axis.x.tick = $scope.xTick;
        }
        if ($scope.grid != null) {
            config.grid = $scope.grid;
        }
        if ($scope.legend != null) {
            config.legend = $scope.legend;
        }
        if ($scope.tooltip != null) {
            config.tooltip = $scope.tooltip;
        }
        if ($scope.chartSize != null) {
            config.size = $scope.chartSize;
        }
        if ($scope.colors != null) {
            config.color = {
                "pattern": $scope.colors
            };
        }
        $scope.chart = c3.generate(config);
    };

    this.addColumn = function(column, columnType, columnName, columnColor) {
        $scope.columns.push(column);
        addColumnProperties(column[0], columnType, columnName, columnColor);
    };

    this.addYAxis = function(yAxis) {
        $scope.axes = yAxis;
        if (!$scope.axis.y2) {
            $scope.axis.y2 = {
                "show": true
            };
        }
    };

    this.addXAxisValues = function(xValues) {
        $scope.xValues = xValues;
    };

    this.addAxisProperties = function(id, axis) {
        $scope.axis[id] = axis;
    };

    this.addXTick = function(tick) {
        $scope.xTick = tick;
    };

    this.rotateAxis = function() {
        $scope.axis.rotated = true;
    };

    this.addGrid = function(axis) {
        if ($scope.grid == null) {
            $scope.grid = {};
        }
        if ($scope.grid[axis] == null) {
            $scope.grid[axis] = {};
        }
        $scope.grid[axis].show = true;
    };

    this.addGridLine = function(axis, value, text) {
        if ($scope.grid == null) {
            $scope.grid = {};
        }
        if (axis === "x") {
            if ($scope.grid.x == undefined) {
                $scope.grid.x = {};
            }
            if ($scope.grid.x.lines == undefined) {
                $scope.grid.x.lines = [];
            }
        } else {
            if ($scope.grid.y == undefined) {
                $scope.grid.y = {};
            }
            if ($scope.grid.y.lines == undefined) {
                $scope.grid.y.lines = [];
            }

        }
        if (axis === "y2") {
            $scope.grid.y.lines.push({
                "value": value,
                "text": text,
                "axis": "y2"
            });
        } else {
            $scope.grid[axis].lines.push({
                "value": value,
                "text": text
            })
        }
    };

    this.addLegend = function(legend) {
        $scope.legend = legend;
    };

    this.addTooltip = function(tooltip) {
        $scope.tooltip = tooltip;
    };

    this.addSize = function(chartSize) {
        $scope.chartSize = chartSize;
    };

    this.addColors = function(colors) {
        $scope.colors = colors;
    };

    function addColumnProperties(id, columnType, columnName, columnColor) {
        if (columnType !== undefined) {
            $scope.types[id] = columnType;
        }
        if (columnName !== undefined) {
            if ($scope.names === null) {
                $scope.names = {};
            }
            $scope.names[id] = columnName;
        }
        if (columnColor !== undefined) {
            if ($scope.colors === null) {
                $scope.colors = {};
            }
            $scope.colors[id] = columnColor;
        }
    }

    function loadChartData() {
        var data = {};
        data.keys = $scope.jsonKeys;
        data.json = $scope.chartData;

        $scope.chart.load(data);
    }
});


function wizardCtrl($scope) {
    $scope.user = {};
    $scope.processForm = function() {
        alert('information completed');
    };
}


