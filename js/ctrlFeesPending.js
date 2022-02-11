app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrlFeesPending', function($scope, $filter, $http, $window, $interval) {

    scope = $scope;

    $scope.checklist = {
        Particulars: '',
        day: 0,
        daytype: ''
    };

    $scope.msg = '';
    $scope.dtFeesPending = [];
    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    $window.sessionStorage.removeItem('CusId');

    scope.ClickFeePending = function(ids) {
        $window.sessionStorage.setItem('CusId', ids);
    }

    scope.LoadFeesPending = function() {
        $('#loader').show();
        $.ajax({
            type: 'get',
            url: 'GService.asmx/fn_GetAutoCashPendingStud',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtFeesPending = data;
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



    // End Message Box

});