app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('ctrlOpening', function($scope, $filter, $http, $window, $interval, $timeout) {



    $scope.msg = '';
    $scope.dtAccHead = [];
    $scope.dtAccounts = [];
    $scope.dtLicFees = [];
    $scope.dtLicStudents = [];
    $scope.licfees = {
        dt: ''
    };
    $scope.nara = '';
    scope = $scope;

    var ls_mob = '';
    $scope.statuses = [{
            value: 'Account',
            text: 'Account'
        },
        {
            value: 'Party',
            text: 'Party'
        }
    ];

    $scope.showStatus = function(user) {
        var selected = [];
        if (user.ClassName) {
            selected = $filter('filter')($scope.statuses, {
                value: user.ClassName
            });
        }
        return selected.length ? selected[0].text : 'Not set';
    };
    $scope.formatStatus = function(status, slno) {

        var displayText;
        var stacus;

        angular.forEach($scope.dtAccounts, function(data) {

            if (status !== undefined) {
                if (status.CusName === undefined) {
                    stacus = status;
                } else {
                    stacus = status.CusName;
                }
                if (data.CusName === stacus) {

                    displayText = data.CusName;
                    $scope.dtLicFees[slno - 1].CusName = data.CusName;
                    if ($scope.dtLicFees[slno - 1].ids === 0) {
                        $scope.dtLicFees[slno - 1].Tot = data.bal;
                    } else {
                        if ($scope.dtLicFees[slno - 1].CusId !== data.cusid) {
                            $scope.dtLicFees[slno - 1].Tot = data.bal;
                        }
                    }
                    $scope.dtLicFees[slno - 1].CusId = data.cusid;
                    return;
                }
            }
        });
        return displayText ? displayText : '';
    };


    $scope.LoadDef = function() {
        $scope.LoadAccountHead();
        $scope.LoadOpening();
    }

    $scope.onSelectedCallback = function($item, $model, $label, $event) {

        $model.CusName = $item.CusName;
    };

    $scope.showLicStudent = function(user) {
        var selected = [];
        if (user.CusName) {
            selected = $filter('filter')($scope.dtAccounts, {
                CusName: user.CusName
            });
        }

        return selected.length ? selected[0].CusName : 'Not set';
    };


    $scope.changeeventAsset = function(adv, slno) {
        scope.dtLicFees[slno - 1].Asset = adv;
        scope.dtLicFees[slno - 1].Liability = 0;
    }

    $scope.changeeventLia = function(adv, slno) {
        scope.dtLicFees[slno - 1].Liability = adv;
        scope.dtLicFees[slno - 1].Asset = 0;
    }

    $scope.changeNara = function(nara, slno) {
        scope.dtLicFees[slno - 1].Nara = nara;
    }


    $scope.LoadAccountHead = function() {
        $('#loader').show();
        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadAccountHeadsPayment',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID')
            }),
            dataType: 'json',
            async: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {
            //$scope.dtAccHead = data;
            $scope.dtAccounts = data;

            $scope.$apply;
            $('#loader').hide();
        }).error(function(data, status, headers, config) {
            console.log(data);
            $('#loader').hide();
        });

    }

    $scope.showLicStudentMob = function(user) {
        var selected = [];
        if (user.Mob) {
            selected = $filter('filter')($scope.dtAccounts, {
                Mob: user.Mob
            });
        }
        return selected.length ? selected[0].Mob : 'Not set';
    };

    $scope.showClass = function(user) {

        var selected = [];
        if (user.ClassName) {
            selected = $filter('filter')($scope.licClass, {
                value: user.ClassName
            });
        }
        return selected.length ? selected[0].text : 'Not set';
    };



    $scope.checkName = function(data, id) {
        $scope.nara = data;

    };

    scope.ClickLedger = function(ids) {
        $window.sessionStorage.setItem('CusId', ids);
    }

    $scope.saveData = function(iudata, id, flag) {
        console.log(iudata.Asset);
        var li_accid = 0;
        var li_cusid = 0;
        if (iudata.ClassName === 'Account') {
            li_accid = iudata.CusId;
            li_cusid = 0;
        } else if (iudata.ClassName === 'Party') {
            li_accid = 0;
            li_cusid = iudata.CusId;
        }

        if (flag === 'D') {
            iudata.name = '';
        }


        $.ajax({
            url: 'GService.asmx/fn_InsertOpening',
            type: 'POST',
            data: {
                flag: flag,
                li_id: id,
                ai_accid: li_accid,
                li_cusid: li_cusid,
                nar: iudata.Nara,
                ls_asset: iudata.Asset,
                ls_liab: iudata.Liability,
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            success: function(data, textStatus) {
                console.log(data);
                if (data[0].Error === 'False') {
                    scope.msg = data[0].message;
                    scope.$apply();
                    scope.MsgBox();
                    scope.LoadOpening();
                    //$scope.dtLicFees[iudata.SlNo - 1].ids = data[0].ids;
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

    };

    $scope.ChangeType = function(typ, slno) {
        if (typ == 'Party') {
            //            $scope.dtAccounts = angular.copy($scope.dtLicStudents);
            scope.dtLicFees[slno - 1].ClassName = 'Party';
        } else if (typ == 'Account') {
            scope.dtLicFees[slno - 1].ClassName = 'Account';
            //            $scope.dtAccounts = angular.copy($scope.dtAccHead);
        }
    }

    // add user
    $scope.addUser = function() {
        ls_mob = '';
        $scope.inserted = {
            SlNo: $scope.dtLicFees.length + 1,
            ClassName: 'Account',
            CusId: 0,
            CusName: '',
            Mob: '',
            Nara: '',
            Asset: 0,
            Liability: 0,
            id: 0,
            isFocused: true
        };
        $scope.dtLicFees.push($scope.inserted);
        console.log($scope.dtLicFees);

        //        $timeout(function () {
        //            $scope.dtLicFees.isFocused = true;
        //        }, 0);
    };

    //    $scope.setFocus = function (id, index) {
    //        angular.element.find('CusName')[0].focus();
    ////        angular.element(document.querySelectorAll("#CusName"))[0].focus();
    //    };


    scope.LoadOpening = function() {

        $('#loader').show();
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetOpening',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }

        }).success(function(data, textStatus, jqXHR) {
            $scope.dtLicFees = data;

            $('#loader').hide();
            scope.$apply();
        }).error(function(xhr, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            $('#loader').hide();
            scope.$apply();
            scope.MsgBox();
        });

    }


    //    scope.LoadLicStudents = function () {

    //        $scope.licfees.dt = new Date();
    //        $('#loader').show();
    //        $.ajax({
    //            type: 'post',
    //            url: 'GService.asmx/fn_GetLicStudentsLedBal',
    //            data: { ls_euid: $window.sessionStorage.getItem('EUID') },
    //            dataType: 'json',            
    //            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    //        }).success(function (data, textStatus, jqXHR) {

    //            $('#loader').hide();
    //            $scope.dtAccounts = $.merge($.merge([], $scope.dtAccounts), data);
    //            $scope.dtLicStudents = data;
    //            scope.$apply();
    //        }).error(function (xhr, ajaxOptions, thrownError) {
    //            $('#loader').hide();
    //            scope.msg = data[0].message;
    //            scope.$apply();
    //            scope.MsgBox();
    //        });

    //    }


    // Start Message Box
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


    scope.DeleteConfirm = function(iudata, id, index) {
        $("#dialog-delete").removeClass('hide').dialog({
            resizable: false,
            width: '320',
            modal: true,
            title: "<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> Confirmation!</h4></div>",
            title_html: true,
            buttons: [{
                    html: "<i class='ace-icon fa fa-trash-o bigger-110'></i>&nbsp; Delete Record.",
                    "class": "btn btn-danger btn-minier",
                    click: function() {
                        $(this).dialog("close");
                        if (id !== 0) {
                            scope.saveData(iudata, id, 'D');
                        }
                        $scope.dtLicFees.splice(index, 1);
                        scope.$apply();
                    }
                },
                {
                    html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Cancel",
                    "class": "btn btn-minier",
                    click: function() {

                        $(this).dialog("close");
                    }
                }
            ]
        });
    }

    // End Message Box

});



app.directive('focusMe', function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                if (value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function() {
                scope.$apply(model.assign(scope, false));
            });
        }
    };
});