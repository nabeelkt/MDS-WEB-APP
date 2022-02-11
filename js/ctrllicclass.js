app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('ctrllicclass', function($scope, $filter, $http, $window, $interval) {

    scope = $scope;

    $scope.msg = '';
    $scope.dtlicclass = [];
    $scope.statuses = [{
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

    $scope.showStatus = function(user) {
        var selected = [];
        if (user.ClassName) {
            selected = $filter('filter')($scope.statuses, {
                value: user.ClassName
            });
        }
        return selected.length ? selected[0].text : 'Not set';
    };


    $scope.checkName = function(data, id) {
        if (data === '') {
            return "Username 2 should be `awesome`";
        }
    };

    $scope.saveData = function(iudata, id, flag) {
        console.log(iudata);
        if (iudata.class === undefined) {
            iudata.class = '';
            iudata.rate = 0;
        }
        $.ajax({
            url: 'GService.asmx/fn_Insertlicclass',
            type: 'POST',
            data: {
                flag: flag,
                li_id: id,
                classname: iudata.class,
                Rate: iudata.rate,
                ls_euid: $window.sessionStorage.getItem('EUID')
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
                $interval(scope.Loadlicclass(), 1000);
            },
            error: function(data, textStatus, errorThrown) {
                console.log(data);
                scope.msg = data[0].message;
                scope.$apply();
                scope.MsgBox();
            }
        });

    };



    // add user
    $scope.addUser = function() {

        $scope.inserted = {
            SlNo: $scope.dtlicclass.length + 1,
            licclassName: '',
            id: 0
        };
        $scope.dtlicclass.push($scope.inserted);

    };


    scope.Loadlicclass = function() {

        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_Getlicclass',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            console.log(data);
            $scope.dtlicclass = data;
            scope.$apply();
        }).error(function(xhr, ajaxOptions, thrownError) {
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
                        $scope.dtlicclass.splice(index, 1);
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