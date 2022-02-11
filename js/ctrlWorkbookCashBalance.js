app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('ctrlWorkbookCashBalance', function($scope, $filter, $http, $window, $interval) {

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

    $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }

    scope.LoadFeesPending = function() {
        $('#loader').show();
        $.ajax({
            type: 'get',
            url: 'GService.asmx/fn_GetAutoCashPendingWorkBook',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtFeesPending = data;
            $scope.sumtot = data[0].tottot;
            $scope.sumadv = data[0].advtot;
            $scope.sumbal = data[0].baltot;
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