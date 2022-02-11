app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('ctrlSetting', function($scope, $http, $window) {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    scope = $scope;
    $scope.settings = {
        smsbal: 0,
        footer: '',
        authid: 0,
        AccHeadid: 0,
        AccBankid: 0,
        AccStudentid: 0,
        AccDailyid: 0,
        AccLicenceid: 0,
        smsonnewwork: 'true',
        smsOnWorkUpdate: 'true',
        smsOnReceipt: 'true',
        smsOnStudReg: 'true'
    };
    $scope.msg = '';

    $scope.LoadCombo = function() {
        scope.LoadAuthority();
        scope.LoadSettings();
        scope.LoadAccountHead();
    }

    $scope.dtAutho = [];
    scope.LoadAuthority = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetAuthority',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $scope.dtAutho = data;
            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }

    $scope.LoadAccountHead = function() {
        $('#loader').show();
        $scope.dtAccHead = [];
        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadAccountHeads',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ai_liid: 0
            }),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.dtAccHead = data;
            $('#loader').hide();
        }).error(function(data, status, headers, config) {
            console.log(data);
            $('#loader').hide();
        });

    }

    scope.LoadSettings = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetAutoSettings',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID')
            }),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.settings.smsbal = data[0].smsbal;
            $scope.settings.footer = data[0].smsfooter;
            $scope.settings.authid = data[0].defAuthoid;

            $scope.settings.AccHeadid = data[0].defcashaccid;
            $scope.settings.AccBankid = data[0].defbankaccid;
            $scope.settings.AccStudentid = data[0].defStuRaccid;
            $scope.settings.AccDailyid = data[0].defClaRaccid;
            $scope.settings.AccLicenceid = data[0].defLicrRaccid;
            if (data[0].smsOnWorkUpdate === 'Y') {
                $scope.settings.smsOnWorkUpdate = true;
            } else {
                $scope.settings.smsOnWorkUpdate = false;
            }
            if (data[0].smsOnNewWork === 'Y') {
                $scope.settings.smsonnewwork = true;
            } else {
                $scope.settings.smsonnewwork = false;
            }
            if (data[0].smsOnReceipt === 'Y') {
                $scope.settings.smsOnReceipt = true;
            } else {
                $scope.settings.smsOnReceipt = false;
            }
            if (data[0].smsOnStudReg === 'Y') {
                $scope.settings.smsOnStudReg = true;
            } else {
                $scope.settings.smsOnStudReg = false;
            }


            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    scope.MsgBox = function() {
        $("#dialog-confirm").removeClass('hide').dialog({
            resizable: false,
            width: '320',
            modal: true,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon fa fa-check'></i> Information!</h4></div>",
            title_html: true,
            buttons: [{
                    html: "<i class='ace-icon fa fa-flag fa-2x pull-left'></i>&nbsp; OK",
                    "class": "btn btn-success btn-minier",
                    click: function() {
                        $(this).dialog("close");
                    }
                }

            ]
        });
    }

    scope.snl = function(myVar) {
        if (myVar !== null) {
            return myVar;
        } else {
            return 0;
        }
    }

    scope.btnSubmit = function() {
        console.log(scope.snl(scope.settings.smsOnWorkUpdate));
        console.log(scope.snl(scope.settings.AccBankid));
        //    if ($.trim($('#txtfooter').val()).length == 0) {
        //        scope.msg = "Please Enter The SMS Footer.";
        //        $("#txtfooter").focus();
        //        scope.MsgBox();
        //        return;
        //    }

        if (scope.settings.authid == 0) {
            scope.msg = "Please Select  Authority.";
            $("#cmbAutho").focus();
            scope.MsgBox();
            return;
        } else {

            $.ajax({
                url: 'GService.asmx/fn_UpdateSettings',
                type: 'POST',
                data: {
                    ls_euid: $window.sessionStorage.getItem('EUID'),
                    li_smsbal: scope.settings.smsbal,
                    ls_smsfooter: scope.settings.footer,
                    li_defAuthoid: scope.snl(scope.settings.authid),
                    li_defcashaccid: scope.snl(scope.settings.AccHeadid),
                    li_defbankaccid: scope.snl(scope.settings.AccBankid),
                    li_defStuRaccid: scope.snl(scope.settings.AccStudentid),
                    li_defClaRaccid: scope.snl(scope.settings.AccDailyid),
                    li_defLicrRaccid: scope.snl(scope.settings.AccLicenceid),
                    ls_smsOnWorkUpdate: scope.settings.smsOnWorkUpdate,
                    ls_smsOnNewWork: scope.settings.smsonnewwork,
                    ls_smsOnReceipt: scope.settings.smsOnReceipt,
                    ls_smsOnStudReg: scope.settings.smsOnStudReg
                },
                dataType: 'json',
                success: function(data, textStatus) {
                    console.log(data);
                    if (data[0].Error === 'False') {

                        scope.msg = data[0].message;
                        scope.$apply();
                        scope.MsgBox();
                    } else {
                        $scope.msg = data[0].message;
                        scope.$apply();
                        scope.MsgBox();
                    }
                },
                error: function(data, textStatus, errorThrown) {
                    console.log(data);
                    scope.msg = data[0].message;
                    scope.$apply();
                    scope.MsgBox();
                }
            });
        }
    }


});