app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('ctrlWorkStatus', function($scope, $filter, $http, $window, $interval) {

    scope = $scope;

    $scope.msg = '';
    $scope.dtStatus = [];

    $scope.checkName = function(data, id) {

        if (data === '') {
            return "Status Name Should Not Be Empty";
        }
    };

    $scope.saveData = function(iudata, id, flag) {
        console.log(iudata.name);
        if (iudata.name === undefined) {
            iudata.name = '';
        }
        $('#loader').show();
        $.ajax({
            url: 'GService.asmx/fn_InsertWorkStatusName',
            type: 'POST',
            data: {
                flag: flag,
                li_id: id,
                StatusName: iudata.name,
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            success: function(data, textStatus) {
                console.log(data);
                if (data[0].Error === 'False') {
                    scope.msg = data[0].message;
                    scope.$apply();
                    scope.MsgBox();
                    $('#loader').hide();
                } else {
                    $scope.msg = data[0].message;
                    scope.$apply();
                    scope.MsgBox();
                    $('#loader').hide();
                }
                $interval(scope.LoadStatus(), 1000);
            },
            error: function(data, textStatus, errorThrown) {
                scope.msg = data[0].message;
                scope.$apply();
                scope.MsgBox();
                $('#loader').hide();
            }
        });

    };



    // add user
    $scope.addUser = function() {

        $scope.inserted = {
            SlNo: $scope.dtStatus.length + 1,
            AuthoName: '',
            id: 0
        };
        $scope.dtStatus.push($scope.inserted);

    };


    scope.LoadStatus = function() {
        $('#loader').show();
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetWorkStatusName',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtStatus = data;
            scope.$apply();
            $('#loader').hide();
        }).error(function(xhr, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
            $('#loader').hide();
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
                        $scope.dtStatus.splice(index, 1);
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