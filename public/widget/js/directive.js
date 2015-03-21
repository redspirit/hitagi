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