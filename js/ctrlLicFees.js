app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrlLicFees', function($scope, $filter, $http, $window, $interval) {

    scope = $scope;

    $scope.msg = '';
    $scope.dtLicFees = [];
    $scope.dtLicStudents = [];
    $scope.licfees = {
        dt: ''
    };
    var ls_mob = '';
    $scope.licClass = [{
            value: '2 Wheel',
            text: '2 Wheel'
        },
        {
            value: '3 Wheel',
            text: '3 Wheel'
        },
        {
            value: '4 Wheel',
            text: '4 Wheel'
        },
        {
            value: '2 & 4 Wheel',
            text: '2 & 4 Wheel'
        },
        {
            value: '2 & 3 Wheel',
            text: '2 & 3 Wheel'
        },
        {
            value: '3 & 4 Wheel',
            text: '3 & 4 Wheel'
        },
        {
            value: '2 3 & 4 Wheel',
            text: '2,3 & 4 Wheel'
        },
        {
            value: 'LMV AMT',
            text: 'LMV AMT'
        },
        {
            value: 'Theory Level - 1',
            text: 'Theory Level - 1'
        },
        {
            value: 'Theory Level - 2',
            text: 'Theory Level - 2'
        },
        {
            value: 'Theory Level - 3',
            text: 'Theory Level - 3'
        },
        {
            value: '4 Wheel - H',
            text: '4 Wheel - H'
        },
        {
            value: '2 Wheel - 8',
            text: '2 Wheel - 8'
        }
    ];

    $scope.formatStatus = function(status, slno) {
        var displayText;
        var stacus;

        angular.forEach($scope.dtLicStudents, function(data) {
            if (status !== undefined) {
                if (status.CusName === undefined) {
                    stacus = status;
                } else {
                    stacus = status.CusName;
                }
                if (data.CusName === stacus) {
                    displayText = data.CusName;
                    $scope.dtLicFees[slno - 1].CusName = data.CusName;
                    $scope.dtLicFees[slno - 1].Mob = data.Mob;
                    $scope.dtLicFees[slno - 1].CusId = data.id;
                    return;
                }
            }
        });
        return displayText ? displayText : '';
    };


    $scope.LoadDef = function() {
        $scope.licfees.dt = new Date();

    }

    $scope.onSelectedCallback = function($item, $model, $label, $event) {

        $model.CusName = $item.CusName;
    };

    $scope.showLicStudent = function(user) {

        var selected = [];
        if (user.CusName) {
            selected = $filter('filter')($scope.dtLicStudents, {
                CusName: user.CusName
            });
        }

        return selected.length ? selected[0].CusName : 'Not set';
    };


    $scope.changeeventAdv = function(adv, slno) {
        scope.dtLicFees[slno - 1].Bal = scope.dtLicFees[slno - 1].Tot - adv;
        scope.dtLicFees[slno - 1].Adv = adv;
    }

    $scope.changeeventTot = function(tot, slno) {
        scope.dtLicFees[slno - 1].Bal = tot - scope.dtLicFees[slno - 1].Adv;
        scope.dtLicFees[slno - 1].Tot = tot;
    }

    $scope.changeevent = function(clsname, slno) {

        $.ajax({
            url: 'GService.asmx/fn_GetClassChange',
            type: 'POST',
            data: {
                clsname: clsname,
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            success: function(data, textStatus) {
                $scope.dtLicFees[slno - 1].ClassName = data[0].classname;
                $scope.dtLicFees[slno - 1].Tot = data[0].rate;
                $scope.dtLicFees[slno - 1].Bal = $scope.dtLicFees[slno - 1].Tot - $scope.dtLicFees[slno - 1].Adv;
                scope.$apply();
            },
            error: function(data, textStatus, errorThrown) {

                scope.msg = data[0].message;
                scope.$apply();
                scope.MsgBox();
            }
        });

    };

    $scope.showLicStudentMob = function(user) {
        var selected = [];
        if (user.Mob) {
            selected = $filter('filter')($scope.dtLicStudents, {
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


    scope.ClickLedger = function(ids) {
        $window.sessionStorage.setItem('CusId', ids);
    }

    $scope.checkName = function(data, id) {
        if (data === '') {
            return "Student Name Should Not Be Empty";
        }
    };

    $scope.saveData = function(iudata, id, flag) {
        console.log(iudata.Tot);
        if (flag === 'D') {
            iudata.name = '';
        }
        $.ajax({
            url: 'GService.asmx/fn_InsertStudLicFees',
            type: 'POST',
            data: {
                flag: flag,
                li_id: iudata.ids,
                ls_feedate: $filter('date')($.trim($('#dtpfeedate').val(), 'dd/MM/yyyy')),
                li_cusid: iudata.CusId,
                ls_classname: iudata.ClassName,
                li_tot: iudata.Tot,
                li_adv: iudata.Adv,
                li_bal: iudata.Bal,
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            success: function(data, textStatus) {

                if (data[0].Error === 'False') {
                    scope.msg = data[0].message;
                    scope.$apply();
                    scope.MsgBox();
                    $scope.dtLicFees[iudata.SlNo - 1].ids = data[0].ids;
                } else {
                    $scope.msg = data[0].message;
                    scope.$apply();
                    scope.MsgBox();
                }
                //                $interval(scope.LoadAuthority(), 1000);
            },
            error: function(data, textStatus, errorThrown) {

                scope.msg = data[0].message;
                scope.$apply();
                scope.MsgBox();
            }
        });

    };



    // add user
    $scope.addUser = function() {
        ls_mob = '';
        $scope.inserted = {
            SlNo: $scope.dtLicFees.length + 1,
            CusId: 0,
            CusName: '',
            Mob: '',
            ClassName: '',
            Tot: 0,
            Adv: 0,
            Bal: 0,
            ids: 0
        };
        $scope.dtLicFees.push($scope.inserted);

    };


    scope.LoadStudDailyFees = function() {


        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetLicFees',
            data: {
                feedate: $filter('date')($scope.licfees.dt, 'MM/dd/yyyy'),
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $scope.dtLicFees = data;
            if (data.length !== 0) {
                $scope.total = data[0].tottot;
                $scope.advancetotal = data[0].totadv;
                $scope.balancetotal = data[0].totbal;
            }
            scope.$apply();
        }).error(function(xhr, ajaxOptions, thrownError) {

            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    scope.LoadLicStudents = function() {
        $scope.licfees.dt = new Date();
        $('#loader').show();
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetLicStudents',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $('#loader').hide();
            $scope.dtLicStudents = data;
            scope.$apply();
        }).error(function(xhr, ajaxOptions, thrownError) {
            $('#loader').hide();
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


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