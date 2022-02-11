app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrlDash', function($scope, $filter, $http, $window, $interval, sharedProperties) {

    scope = $scope;
    $scope.msg = '';
    $scope.ngType = 'This Week';
    $scope.ngTestType = 'DL Test';
    $scope.dtChkListSummary = [];
    $scope.dtDlTestList = [];
    $scope.dtPendingList = [];
    $scope.dash = {
        dt: ''
    };

    $scope.dash.dt = new Date();
    $window.sessionStorage.removeItem('Particulars');
    $scope.CusStatus = $window.sessionStorage.getItem('ComStatus');

    $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }

    var myEUID = $window.sessionStorage.getItem('EUID');
    if (myEUID == null) {
        myEUID = $window.localStorage.getItem('EUID');
        if (myEUID == null) {
            setTimeout(function() {
                window.location = "Index.html";
            }, 500);
            return;
        }
    }

    $http({
        method: 'POST',
        url: 'GService.asmx/fn_CheckLoginEID',
        data: $.param({
            EUID: myEUID
        }),
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).success(function(data, status, headers, config) {

        sessionStorage.email = data[0].Email;
        sessionStorage.companyname = data[0].companyname + "  " + data[0].branchname;
        sessionStorage.status = data[0].Status;
        sessionStorage.ComStatus = data[0].ComStatus;
        sessionStorage.username = data[0].UserName;
        $scope.nguser = data[0].UserName;
        $scope.ngCompany = data[0].companyname + ", " + data[0].branchname;
        sessionStorage.EUID = data[0].euid;
        sessionStorage.companyid = data[0].eid;
        if (sessionStorage.status == 'P') {
            scope.msg = 'Dear Customer, We can`t receive your payment. Please pay your amount immediatiley. Other wise your account will be blocked. Thank You. Golden Software. Mob: 9447577781. AcNo: 31290291132. Bank: SBI. IFSC: SBIN0010114 Name: Vinod P John';
            scope.$apply();
            scope.MsgBox();
        }
    }).error(function(data, status, headers, config) {
        console.log(data);
    });


    scope.LogOut = function() {
        $window.localStorage.removeItem('EUID');
        $window.sessionStorage.removeItem('EUID');
        $window.sessionStorage.removeItem('companyid');
        $window.sessionStorage.removeItem('companyname');
        $window.sessionStorage.removeItem('email');
        $window.sessionStorage.removeItem('status');
        $window.sessionStorage.removeItem('userid');
        $window.sessionStorage.removeItem('username');
        setTimeout(function() {
            window.location = "Index.html";
        }, 500);
    }
    scope.ClickCheckList = function(headname) {
        $window.sessionStorage.setItem('Particulars', headname);
    }

    scope.ClickStudentName = function(ids) {
        $window.sessionStorage.setItem('LicId', ids);
    }

    scope.LoadCheckListSummary = function() {
        $('#loader').show();
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_LoadCheckList',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtChkListSummary = data;
            scope.$apply();
            $('#loader').hide();
        }).error(function(xhr, ajaxOptions, thrownError) {

            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
            $('#loader').hide();
        });

    }

    scope.LoadPendingStudList = function(periodtyp) {
        console.log('test');
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_LoadCashPendingStudListSummary',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ls_period: periodtyp
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            console.log(data);
            $scope.ngType = periodtyp;
            $scope.ngTypeCon = data[0].wochart;
            $scope.ngTotCon = data[0].totwo;
            $scope.dtPendingList = data;
            $scope.advance = data[0].adv;
            scope.$apply();
        }).error(function(xhr, ajaxOptions, thrownError) {

            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    scope.LoadDLTestStudents = function(testtype) {
        if (testtype == 'Learners') {
            $scope.ngTestType = 'Learners Test';
        } else {
            if (testtype == '') {
                if ($scope.ngTestType == '') {
                    $scope.ngTestType = 'DL Test';
                } else {
                    $scope.ngTestType = $scope.ngTestType;
                }
            } else {
                $scope.ngTestType = 'DL Test';
            }
        }
        console.log($scope.ngTestType);
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_LoadLenTestStudent',
            data: {
                as_date: $filter('date')(scope.dash.dt, 'yyyy/MM/dd'),
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ls_testtype: $scope.ngTestType
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            console.log(data);
            $scope.dtDlTestList = data;
            scope.$apply();
        }).error(function(xhr, ajaxOptions, thrownError) {
            console.log(data);
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }

    scope.usersetting = function(data) {
        if (data.checked == 'true') {
            data.checked = 'false';
        } else {
            data.checked = 'true';
        }
    }

    scope.SendSMS = function() {

        var ls_cusid = '';
        angular.forEach($scope.dtDlTestList, function(value, index) {
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
        var names = $scope.dtDlTestList.map(function(item) {
            return item['cusid'] + '|' + item['ids'] + '|' + $scope.ngTestType + '|' + $filter('date')(scope.dash.dt, 'yyyy/MM/dd') + '|' + item['checked'] + '|' + item['mob'];
        });

        var theIds = JSON.stringify(names);
        console.log(theIds);
        $('#loader').show();
        $.ajax({
            type: 'get',

            url: 'GService.asmx/fn_SendSMSDLTest',
            data: {
                as_cusids: theIds,
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            console.log(data);
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
            scope.LoadDLTestStudents('');
            $('#loader').hide();
        }).error(function(data, ajaxOptions, thrownError) {
            console.log(data);
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