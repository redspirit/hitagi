/**
 *
 * TABLE OF CONTENTS
 * Use @ along with function name to search for the directive.
 *
 *  @pageTitle - Page Title Directive for page title name
 *  @widgetToggle - Directive to toggle widgets
 *  @widgetClose - Directive to close widget
 *  @toggleLeftSidebar - Left Sidebar Directive to toggle sidebar navigation
 *  @navToggleSub - Directive to toggle sub-menu down
 *  @slider - Directive to run bootstrap sliders
 *  @gaugejs - Directive for the gauge graph
 *  @css3animate - css3 animations
 *  @iCheck - Directive for custom checkboxes
 *  @fullscreenMode - Directive for fullscreen browsers
 *  @fullscreenWidget - Directive for fullscreen widgets
 *  @toggleSettings - Directive to toggle settings widgets for DEMO
 *  @switchTheme - Directive to switch theme colors for DEMO
 *
 */

/*
 * @pageTitle - Page Title Directive for page title name
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                var title = 'NeuBoard - Responsive Admin Theme';
                if (toState.data && toState.data.pageTitle) title = 'NeuBoard | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * @widgetToggle - Directive to toggle widget
 */
function widgetToggle() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.click(function() {
                $(this).parent().parent().next().slideToggle("fast"), $(this).toggleClass("fa-chevron-down fa-chevron-up")
            });
        }
    }
};

/**
 * @widgetClose - Directive to close widget
 */
function widgetClose() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.click(function() {
                $(this).parent().parent().parent().fadeOut()
            });
        }
    }
};

/*
 * @toggleLeftSidebar - Left Sidebar Directive to toggle sidebar navigation
 */
function toggleLeftSidebar() {
    return {
        restrict: 'A',
        template: '<button ng-click="toggleLeft()" class="sidebar-toggle" id="toggle-left"><i class="fa fa-bars"></i></button>',
        controller: function($scope, $element) {
            $scope.toggleLeft = function() {
                ($(window).width() > 767) ? $('#main-wrapper').toggleClass('sidebar-mini'): $('#main-wrapper').toggleClass('sidebar-opened');
            }
        }
    };
}

/**
 * @navToggleSub - Directive to toggle sub-menu down
 */
function navToggleSub() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.navgoco({
                caretHtml: false,
                accordion: true
            })
        }
    };
};

/**
 * @sliders - Directive to run bootstrap sliders
 */
function slider() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.slider();
        }
    }
};

/**
 * @gaugejs - Directive for the gauge graph
 */
function gauge() {
    return {
        restrict: 'AC',
        scope: {
            'animationTime': '=',
            'value': '=',
            'options': '=',
            'maxValue': '=',
            'gaugeType': '='
        },
        controller: function($scope, $element) {
            if ($scope.gaugeType === 'donut') {
                $scope.gauge = new Donut($element[0]);
            } else {
                $scope.gauge = new Gauge($element[0]);
            }
            $scope.gauge.maxValue = $scope.maxValue;
            $scope.$watchCollection('[options, value]', function(newValues) {
                $scope.gauge.setOptions(newValues[0]);
                if (!isNaN(newValues[1])) {
                    $scope.gauge.set(newValues[1]);
                }
            });
        }
    }
};


/**
 * @css3animate - css3 animations
 */
function css3animate() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.click(function() {
                var animate = $(this).attr("data-animated");
                $(this).closest('.panel').addClass(animate).delay(1000).queue(function(next) {
                    $(this).removeClass(animate);
                    next();
                })
            })
        }
    }

};

/**
 * @iCheck - Directive for custom checkboxes
 */
function ichecks($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            return $timeout(function() {
                return $(element).iCheck({
                    checkboxClass: 'icheckbox_flat-grey',
                    radioClass: 'iradio_flat-grey',
                    increaseArea: '20%'
                });
            });
        }
    };
};


/**
 * Directive for the calendar widget
 */

(function() {
    var TienClndrDirective, module;

    module = angular.module('tien.clndr', []);

    TienClndrDirective = function() {
        var controller, scope;
        scope = {
            clndr: '=tienClndrObject',
            events: '=tienClndrEvents',
            options: '=?tienClndrOptions'
        };
        controller = function($scope, $element, $attrs, $transclude) {
            return $transclude(function(clone, scope) {
                var options, render;
                $element.append(clone);
                $scope.$watch('events', function(val) {
                    if (val != null ? val.length : void 0) {
                        return $scope.clndr.setEvents(angular.copy(val));
                    }
                });
                render = function(data) {
                    return angular.extend(scope, data);
                };
                options = angular.extend($scope.options || {}, {
                    render: render
                });
                return $scope.clndr = angular.element("<div/>").clndr(options);
            });
        };
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: scope,
            controller: controller
        };
    };

    module.directive('tienClndr', TienClndrDirective);

}).call(this);


/**
 * @fullscreenMode - Directive for fullscreen browsers
 */

function fullscreenMode() {
    return {
        restrict: 'A',
        template: '<button ng-click="toggleFullscreen()" type="button" class="btn btn-default expand" id="toggle-fullscreen"><i class="fa fa-expand"></i></button>',
        controller: function($scope, $element) {
            $scope.toggleFullscreen = function() {
                $(document).toggleFullScreen()
                $('#toggle-fullscreen .fa').toggleClass('fa-expand fa-compress');
            }
        }
    };
};

/**
 * @fullscreenWidget - Directive for fullscreen widgets
 */

function fullscreenWidget() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.click(function() {
                var panel = $(this).closest('.panel');
                panel.toggleClass('widget-fullscreen');
                $(this).toggleClass('fa-expand fa-compress');
                $('body').toggleClass('fullscreen-widget-active')

            });
        }
    }
};

/*
 * Pass functions to module
 */
angular
    .module('neuboard')
    .directive('pageTitle', pageTitle)
    .directive('widgetToggle', widgetToggle)
    .directive('widgetClose', widgetClose)
    .directive('toggleLeftSidebar', toggleLeftSidebar)
    .directive('navToggleSub', navToggleSub)
    .directive('slider', slider)
    .directive('gauge', gauge)
    .directive('css3animate', css3animate)
    .directive('ichecks', ichecks)
    .directive('fullscreenMode', fullscreenMode)
    .directive('fullscreenWidget', fullscreenWidget)
