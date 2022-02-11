app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('ctrlRptWorkStatus', function($scope, $filter, $http, $window, $interval, sharedProperties) {

    scope = $scope;

    $scope.Work = {
        WorkStatus: 'All',
        day: 0,
        daytype: 'Day'
    };
    $scope.customer = {
        id: 0,
        cusname: '',
        swof: '',
        cusadd: '',
        pin: 0,
        mob: 0,
        dob: '',
        age: 0,
        blood: '',
        email: ''
    };
    $scope.msg = '';
    $scope.dtWorkStatus = [];

    $scope.foo = {
        Veh: false,
        Cus: false
    };

    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }

    $scope.dtStatusDef = [];
    scope.LoadWorkStatusDef = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetWorkStatusName',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $scope.dtStatusDef = data;
            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }

    scope.setClickedRow = function(index) {
        $scope.selectedRow = index;
    }

    scope.ClickLedger = function(ids) {
        $window.sessionStorage.setItem('CusId', ids);
    }

    scope.ClickWorkBook = function(ids) {
        $window.sessionStorage.setItem('Ids', ids);
    }

    scope.SetModalData = function(ids, staid, inwardno) {
        scope.liid = ids;
        scope.wstatusmodal = staid;
        scope.inwno = inwardno;
    }

    function addMonths(date, months) {
        var myDate = new Date(date);
        myDate.setMonth(myDate.getMonth() + months);
        myDate.setDate(myDate.getDate() - 1);
        return myDate;
    }

    scope.btnUpdateStatus = function() {


        $.ajax({
            url: 'GService.asmx/fn_UpdateWorlStatus',
            type: 'POST',
            data: {
                li_id: scope.liid,
                li_statusid: scope.wstatusmodal,
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ls_inwardno: scope.inwno
            },
            dataType: 'json',
            success: function(data, textStatus) {
                console.log(data);
                if (data[0].Error === 'False') {
                    scope.LoadWorkStatusReport();

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

    }


    scope.LoadWorkStatusReport = function() {

        if ($scope.customer.cusname === '') {
            $scope.customer.id = 0;
        }
        console.log('test1');
        $('#loader').show();
        $.ajax({
            type: 'get',
            url: 'GService.asmx/fn_GetWorkStatusReport',
            data: {
                as_datefrm: $filter('date')($.trim($('#dtptvfrm').val(), 'dd/MM/yyyy')),
                as_dateto: $filter('date')($.trim($('#dtptvto').val(), 'dd/MM/yyyy')),
                as_statusid: scope.wstatus,
                as_serviceid: scope.wservice,
                as_agentid: scope.wagent,
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ls_cusid: $scope.customer.id
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtWorkStatus = data;
            scope.$apply();
            $('#loader').hide();
        }).error(function(data, ajaxOptions, thrownError) {
            console.log(data);
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
            $('#loader').hide();
        });

    }

    $scope.LoadDef = function() {
        $scope.datefrm = addMonths(new Date(), -1);
        $scope.dateto = new Date();
        $scope.wstatus = 0;
        $scope.wservice = 0;
        $scope.wagent = 0;
        scope.LoadWorkStatusReport();

    }

    $scope.dtStatus = [];
    scope.LoadWorkStatus = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetWorkStatusNameAll',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtStatus = data;
            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }

    $scope.dtAgent = [];
    scope.LoadWorkAgent = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetWorkAgentNameAll',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtAgent = data;
            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    $scope.dtService = [];
    scope.LoadWorkService = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetWorkServiceNameAll',
            data: {
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $scope.dtService = data;
            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    $scope.dtWork = [];
    scope.LoadStatus = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetStatus',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $scope.dtWork = data;
            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
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

    scope.myFunct = function() {
        $scope.selectedRow = 0;
        elemFocus = true;
    }

    $scope.SetDataCustomer = function() {
        scope.customer.cusname = scope.dtCust[scope.selectedRow].Name;
        scope.customer.swof = scope.dtCust[scope.selectedRow].swof;
        scope.customer.cusadd = scope.dtCust[scope.selectedRow].Address;
        scope.customer.pin = scope.dtCust[scope.selectedRow].pin;
        scope.customer.mob = scope.dtCust[scope.selectedRow].Mob;
        scope.customer.blood = scope.dtCust[scope.selectedRow].blood;

        scope.customer.dob = new Date(scope.dtCust[scope.selectedRow].dob);
        scope.customer.age = scope.dtCust[scope.selectedRow].age;
        scope.customer.id = scope.dtCust[scope.selectedRow].ids;

        scope.foo.Cus = false;
    }

    $scope.autocompCustomer = function() {
        $scope.foo.Cus = true
        $scope.dtCust = [];
        var min_length = 0; // min caracters to display the autocomplete 
        var keyword = $scope.customer.cusname;
        if (keyword.length >= min_length) {
            $('#contno').addClass('ne-pre-con');
            $.ajax({
                url: "GService.asmx/fn_GetCustomersLedger",
                type: "GET",
                data: {
                    strSearchkey: keyword,
                    ls_euid: $window.sessionStorage.getItem('EUID')
                },
                dataType: "json",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function(data, textStatus, jqXHR) {
                    $scope.dtCust = data;
                    scope.$apply();
                    $('#contno').removeClass('ne-pre-con');
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    alert('my error = ' + thrownError);
                    alert('my error1 = ' + ajaxOptions);
                    alert('my error2 = ' + xhr);
                    $('#contno').removeClass('ne-pre-con');
                }
            });

        }
    }
    // End Message Box

});