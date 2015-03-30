/**
 * Created by Алексей on 21.03.2015.
 */

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                element.val('');

                event.preventDefault();
            }
        });
    };
});

var test;

app.directive('autoscrollDown', function () {
    return {
        link: function postLink($scope, element, attrs) {

            var enableAutoscroll = true;
            var forceScroll = true;

            element.perfectScrollbar({'wheelSpeed':2, 'suppressScrollX':true});

            element.scroll(function(e){
                enableAutoscroll = element.prop('offsetHeight') + element.prop('scrollTop') + 15 >= element.prop('scrollHeight');

                if(element.prop('scrollTop')  == 0) {
                    // функция срабатывает когда сктролл в самом верху
                    //$scope.testAction();
                }

            });

            setTimeout(function() {
                forceScroll = false;
            }, 3000);


            test = element.children();

            $scope.$watch(
                function () {
                    //return element.find('.message-line').length;
                    return element.children().length;
                },
                function () {

                    if(enableAutoscroll || forceScroll) {
                        element.animate({ scrollTop: element.prop('scrollHeight')}, 1000);
                    }

                    if(forceScroll) setTimeout(function() {
                        element.animate({ scrollTop: element.prop('scrollHeight')}, 1000);
                    }, 800);

                }
            );
        }
    }
});