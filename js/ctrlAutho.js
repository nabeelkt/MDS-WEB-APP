app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrlAutho', function($scope, $filter, $http, $window, $interval) {

    scope = $scope;

    $scope.msg = '';
    $scope.dtAutho = [];

    $scope.checkName = function(data, id) {
        if (data === '') {
            return "Username 2 should be `awesome`";
        }
    };

    $scope.saveData = function(iudata, id, flag) {
        console.log(iudata.name);
        if (iudata.name === undefined) {
            iudata.name = '';
        }
        $.ajax({
            url: 'GService.asmx/fn_InsertAuthority',
            type: 'POST',
            data: {
                flag: flag,
                li_id: id,
                authoname: iudata.name,
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
                $interval(scope.LoadAuthority(), 1000);
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
            SlNo: $scope.dtAutho.length + 1,
            AuthoName: '',
            id: 0
        };
        $scope.dtAutho.push($scope.inserted);

    };


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
                        $scope.dtAutho.splice(index, 1);
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