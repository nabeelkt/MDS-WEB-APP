var test = 'vibnod';
var app = angular.module('App', ['ngRoute', 'xeditable', 'angularUtils.directives.dirPagination', 'ngFileUpload', 'ui.bootstrap'])


    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'dashboard.html?v=35',
                controller: 'CtrlDash'
            })
            .when('/WorkBook', {
                templateUrl: 'workbook.html?v=48',
                controller: 'CtrlWorkBook'
            })
            .when('/Dashboard', {
                templateUrl: 'dashboard.html?v=34',
                controller: 'CtrlDash'
            })
            .when('/Licence', {
                templateUrl: 'Licence.html?v=23',
                controller: 'ctrlLicence'
            })
            .when('/Test', {
                templateUrl: 'MyReport/Default.aspx?v=2'
            })
            .when('/Vehicle', {
                templateUrl: 'NewVehicle.html?v=26',
                controller: 'ctrlRegistration'
            })
            .when('/DailyClass', {
                templateUrl: 'LicFees.html?v=10',
                controller: 'CtrlLicFees'
            })
            .when('/VehClass', {
                templateUrl: 'Vehclass.html?v=5',
                controller: 'CtrlVehclass'
            })
            .when('/LicClass', {
                templateUrl: 'LicClass.html?v=5',
                controller: 'ctrllicclass'
            })
            .when('/Authority', {
                templateUrl: 'Authority.html?v=7',
                controller: 'CtrlAutho'
            })
            .when('/Renewal', {
                templateUrl: 'Renewal.html?v=16',
                controller: 'ctrlRenewal'
            })
            .when('/CheckList', {
                templateUrl: 'CheckList.html?v=15',
                controller: 'CtrlCheckList'
            })
            .when('/FeesPending', {
                templateUrl: 'FeesPending.html?v=6',
                controller: 'CtrlFeesPending'
            })
            .when('/Receipt', {
                templateUrl: 'Receipt.html?v=14',
                controller: 'CtrlReceipt'
            })
            .when('/Ledger', {
                templateUrl: 'Ledger.html?v=14',
                controller: 'CtrlLedger'
            })
            .when('/ChangePassword', {
                templateUrl: 'ChangePassword.html?v=4',
                controller: 'CtrChangePassword'
            })
            .when('/AccountHead', {
                templateUrl: 'AccountHead.html?v=5',
                controller: 'CtrlAccountHead'
            })
            .when('/StatusName', {
                templateUrl: 'WorkStatus.html?v=2',
                controller: 'ctrlWorkStatus'
            })
            .when('/Profile', {
                templateUrl: 'profile.html?v=5',
                controller: 'ctrlprofile'
            })
            .when('/WorkStatusReport', {
                templateUrl: 'WorkStatusReport.html?v=14',
                controller: 'ctrlRptWorkStatus'
            })
            .when('/Payment', {
                templateUrl: 'Payment.html?v=11',
                controller: 'ctrlPayment'
            })
            .when('/Settings', {
                templateUrl: 'Setting.html?v=10',
                controller: 'ctrlSetting'
            })
            .when('/DayBook', {
                templateUrl: 'DayBook.html?v=6',
                controller: 'ctrlDayBook'
            })
            .when('/WorkBookCashBalance', {
                templateUrl: 'WorkbookCashBalance.html?v=2',
                controller: 'ctrlWorkbookCashBalance'
            })
            .when('/Customer', {
                templateUrl: 'Customer.html?v=5',
                controller: 'ctrlCustomer'
            })
            .when('/Agent', {
                templateUrl: 'Agent.html?v=5',
                controller: 'ctrlAgent'
            })
            .when('/Opening', {
                templateUrl: 'OpeningBal.html?v=7',
                controller: 'ctrlOpening'
            })
            .when('/SMSReport', {
                templateUrl: 'SMSReport.html?v=1',
                controller: 'ctrlSMSReport'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);