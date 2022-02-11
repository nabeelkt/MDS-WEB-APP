app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrlVehclass', function($scope, $filter, $http, $window, $interval) {

    scope = $scope;

    $scope.msg = '';
    $scope.dtClass = [];

    $scope.checkName = function(data, id) {
        if (data === '') {
            return "Class of vechile should not be empty";
        }
    };

    $scope.saveData = function(iudata, id, flag) {

        if (iudata.name === undefined) {
            iudata.name = '';
        }
        $.ajax({
            url: 'GService.asmx/fn_InsertVehclass',
            type: 'POST',
            data: {
                flag: flag,
                li_id: id,
                classname: iudata.name,
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
                $interval(scope.LoadVechileclass(), 1000);
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

        $scope.inserted = {
            SlNo: $scope.dtClass.length + 1,
            ClassName: '',
            id: 0
        };
        $scope.dtClass.push($scope.inserted);

    };


    scope.LoadVechileclass = function() {

        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetVehclass',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtClass = data;
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
                        $scope.dtClass.splice(index, 1);
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