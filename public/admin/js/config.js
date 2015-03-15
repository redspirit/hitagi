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
        .state('ui', {
            abstract: true,
            url: "/ui",
            templateUrl: "views/common.html"
        })
        .state('ui.buttons', {
            url: "/buttons",
            templateUrl: "views/ui-buttons.html",
            data: {
                pageTitle: 'Buttons'
            }
        })
        .state('ui.sliders-progress', {
            url: "/sliders-progress",
            templateUrl: "views/ui-sliders-progress.html",
            data: {
                pageTitle: 'Sliders and Progress'
            }
        })
        .state('ui.modals-popups', {
            url: "/modals-popups",
            templateUrl: "views/ui-modals-popups.html",
            data: {
                pageTitle: 'Modals and Popups'
            }
        })
        .state('ui.tabs-accordions', {
            url: "/tabs-accordions",
            templateUrl: "views/ui-tabs-accordions.html",
            data: {
                pageTitle: 'Tabs and Accordions'
            }
        })
        .state('ui.alerts-notifications', {
            url: "/alerts-notifications",
            templateUrl: "views/ui-alerts-notifications.html",
            data: {
                pageTitle: 'Alerts and Notifications'
            }
        })
        .state('ui.nestable-lists', {
            url: "/nestable-lists",
            templateUrl: "views/ui-nestable-lists.html",
            data: {
                pageTitle: 'Nestable and Lists'
            }
        })
        .state('ui.panels', {
            url: "/panels",
            templateUrl: "views/ui-panels.html",
            data: {
                pageTitle: 'Panels'
            }
        })
        .state('ui.icons', {
            url: "/icons",
            templateUrl: "views/ui-icons.html",
            data: {
                pageTitle: 'Icons'
            }
        })
        .state('ui.typography', {
            url: "/typography",
            templateUrl: "views/ui-typography.html",
            data: {
                pageTitle: 'Typography'
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
