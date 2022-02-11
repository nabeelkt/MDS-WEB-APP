app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrlCheckList', function($scope, $filter, $http, $window, $interval, sharedProperties) {

    scope = $scope;

    $scope.checklist = {
        Particulars: 'All',
        day: 0,
        daytype: 'Day',
        dtfrom: ''
    };

    $scope.msg = '';
    $scope.dtCheckList = [];
    scope.all = false;
    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order
    $scope.checklist.dtfrom = new Date();

    $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }

    scope.LoadCheckListOnLoad = function() {
        var mydata = $window.sessionStorage.getItem('Particulars');
        //        console.log(mydata);
        //        console.log($filter('date')($.trim($('#dtpCheckListDate').val()), 'dd/MM/yyyy'));
        if (mydata !== null) {
            $('#loader').show();
            scope.checklist.Particulars = mydata;
            scope.checklist.day = 10;
            scope.checklist.daytype = 'Day';
            $.ajax({
                type: 'get',
                url: 'GService.asmx/fn_GetCheckList',
                data: {
                    as_datefrm: 'null',
                    as_particulars: scope.checklist.Particulars,
                    ai_days: scope.checklist.day,
                    as_daytype: scope.checklist.daytype,
                    ls_euid: $window.sessionStorage.getItem('EUID')
                },
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, textStatus, jqXHR) {
                $scope.dtCheckList = data;
                scope.$apply();
                $('#loader').hide();
            }).error(function(xhr, ajaxOptions, thrownError) {
                scope.msg = data[0].message;
                scope.$apply();
                scope.MsgBox();
                $('#loader').hide();
            });
        }
    }


    scope.LoadCheckList = function() {

        $('#loader').show();
        $.ajax({
            type: 'get',
            url: 'GService.asmx/fn_GetCheckList',
            data: {
                as_datefrm: $filter('date')($.trim($('#dtpCheckListDate').val(), 'dd/MM/yyyy')),
                as_particulars: scope.checklist.Particulars,
                ai_days: scope.checklist.day,
                as_daytype: scope.checklist.daytype,
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtCheckList = data;
            scope.$apply();
            $('#loader').hide();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
            $('#loader').hide();
        });

    }

    scope.usersetting = function(data) {
        if (data.checked == 'true') {
            data.checked = 'false';
        } else {
            data.checked = 'true';
        }
    }

    scope.checkAll = function() {
        if (scope.all == true) {
            angular.forEach($scope.dtCheckList, function(value, index) {
                value.checked = 'true';
            })
        } else {
            angular.forEach($scope.dtCheckList, function(value, index) {
                value.checked = 'false';
            })
        }
    }

    scope.SendSMS = function() {

        var ls_cusid = '';
        angular.forEach($scope.dtCheckList, function(value, index) {
            if (value.checked == 'true') {
                if (ls_cusid == '') {
                    ls_cusid = value.cusid;
                } else {
                    ls_cusid = ls_cusid + ',' + value.cusid;
                }
            }
        })
        if (ls_cusid == '') {
            scope.msg = "Please Select An Item To Send SMS.";
            scope.MsgBox();
            return;
        }
        var names = $scope.dtCheckList.map(function(item) {
            return item['cusid'] + '|' + item['ids'] + '|' + item['particulars'] + '|' + convert(toDate(item['expdate'])) + '|' + item['checked'] + '|' + item['mob'] + '|' + item['vehno'] + '|' + item['refstatus'];
        });

        var theIds = JSON.stringify(names);
        //        console.log(theIds);
        $('#loader').show();
        $.ajax({
            type: 'get',

            url: 'GService.asmx/fn_SendSMS',
            data: {
                as_cusids: theIds,
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
            scope.LoadCheckList();
            $('#loader').hide();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
            $('#loader').hide();
        });

    }

    function convert(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    function toDate(dateStr) {
        var parts = dateStr.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]);
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