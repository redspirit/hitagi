function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index");
    $stateProvider
        .state('index', {
            url: "/index",
            templateUrl: "views/index.html",
            data: {
                pageTitle: 'index'
            }
        })
        .state('account', {
            url: "/account",
            templateUrl: "views/account.html",
            data: {
                pageTitle: 'Аккаунт пользователя'
            }
        })
        .state('settings', {
            url: "/settings",
            templateUrl: "views/settings.html",
            data: {
                pageTitle: 'Настройки'
            }
        })
        .state('rooms', {
            url: "/rooms",
            templateUrl: "views/rooms.html",
            data: {
                pageTitle: 'Комнаты'
            }
        })
        .state('roomsAdd', {
            url: "/rooms/add",
            templateUrl: "views/rooms-add.html",
            data: {
                pageTitle: 'Создать новую комнату'
            }
        })
        .state('forms', {
            abstract: true,
            url: "/forms",
            templateUrl: "views/common.html"
        })
        .state('forms.components', {
            url: "/components",
            templateUrl: "views/forms-components.html",
            data: {
                pageTitle: 'Components'
            }
        })
        .state('forms.validation', {
            url: "/validation",
            templateUrl: "views/forms-validation.html",
            data: {
                pageTitle: 'Validation'
            }
        })
        .state('forms.mask', {
            url: "/mask",
            templateUrl: "views/forms-mask.html",
            data: {
                pageTitle: 'Mask'
            }
        })
        .state('forms.multi-upload', {
            url: "/multi-upload",
            templateUrl: "views/forms-multi-upload.html",
            data: {
                pageTitle: 'Multiple File Upload'
            }
        })
        .state('tables', {
            abstract: true,
            url: "/tables",
            templateUrl: "views/common.html"
        })
        .state('tables.basic', {
            url: "/basic",
            templateUrl: "views/tables-basic.html",
            data: {
                pageTitle: 'Basic Table'
            }
        })
        .state('tables.data', {
            url: "/data",
            templateUrl: "views/tables-data.html",
            data: {
                pageTitle: 'Data Tables'
            }
        })
        .state('mail', {
            abstract: true,
            url: "/mail",
            templateUrl: "views/common.html"
        })
        .state('mail.inbox', {
            url: "/inbox",
            templateUrl: "views/mail-inbox.html",
            data: {
                pageTitle: 'Mail Inbox'
            }
        })
        .state('mail.compose', {
            url: "/compose",
            templateUrl: "views/mail-compose.html",
            data: {
                pageTitle: 'Compose Mail'
            }
        })
        .state('pages', {
            abstract: true,
            url: "/pages",
            templateUrl: "views/common.html"
        })
        .state('pages.profile', {
            url: "/profile",
            templateUrl: "views/pages-profile.html",
            data: {
                pageTitle: 'Profile'
            }
        })
        .state('animations', {
            url: "/animations",
            templateUrl: "views/animations.html",
            data: {
                pageTitle: 'Animations'
            }
        })


}
angular
    .module('neuboard')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
