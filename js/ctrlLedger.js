app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrlLedger', function($scope, $filter, $http, $window, $interval) {
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
    scope = $scope;
    var sumcredit = '';
    var sumdebit = '';
    var balance = '';

    $scope.foo = {
        Veh: false,
        Cus: false
    };
    $scope.selectedRow = 0;



    $scope.msg = '';
    $scope.dtLedger = [];

    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    $scope.LoadDef = function() {
        $scope.datefrm = addMonths(new Date(), -1);
        $scope.dateto = new Date();
    }

    function addMonths(date, months) {
        var myDate = new Date(date);
        myDate.setMonth(myDate.getMonth() + months);
        myDate.setDate(myDate.getDate() - 1);
        return myDate;
    }
    scope.LoadLedgerSearch = function() {
        $window.sessionStorage.setItem('CusId', $scope.customer.id);
        scope.LoadLedger();
    }
    scope.LoadLedger = function() {
        var mydata = $window.sessionStorage.getItem('CusId');
        console.log(mydata);
        console.log($filter('date')($.trim($('#dtpfrm').val(), 'dd/MM/yyyy')))
        if (mydata !== null) {
            $.ajax({
                type: 'get',
                url: 'GService.asmx/fn_GetAutoLedger',
                data: {
                    ls_datefrm: $filter('date')($.trim($('#dtpfrm').val(), 'dd/MM/yyyy')),
                    ls_dateto: $filter('date')($.trim($('#dtpto').val(), 'dd/MM/yyyy')),
                    ls_euid: $window.sessionStorage.getItem('EUID'),
                    li_cusid: mydata
                },
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, textStatus, jqXHR) {
                $window.sessionStorage.removeItem('CusId');
                console.log(data);
                $scope.dtLedger = data;
                $scope.sumcredit = data[0].cretotal;
                $scope.sumdebit = data[0].debtotal;
                $scope.balance = data[0].balance;
                $scope.opening = data[0].opening;
                $scope.customer.cusname = data[0].cusame;
                $scope.customer.id = data[0].cid;
                $scope.customer.mob = data[0].mob;
                scope.$apply();
            }).error(function(xhr, ajaxOptions, thrownError) {
                $window.sessionStorage.removeItem('CusId');
                console.log(data);
                scope.msg = data[0].message;
                scope.$apply();
                scope.MsgBox();
            });
        }
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

    scope.setClickedRow = function(index) {
        $scope.selectedRow = index;
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
        $window.sessionStorage.setItem('CusId', $scope.customer.id);
        scope.LoadLedger();

        //        scope.licence.cusid = scope.dtCust[scope.selectedRow].ids;
        //        $scope.ImgFound = scope.dtCust[scope.selectedRow].imgPath;
        //        var num = Math.random();
        //        $scope.ImgFileName = 'uploads/' + scope.customer.id + '.jpg?v=' + num;
        //        $scope.ImgFileName2 = 'uploads/' + scope.customer.id + '.jpg';
        //        if ($scope.ImgFound === 'False') {
        //            $("#user-profile-1").hide();
        //            $("#uploadid").show();
        //        } else {
        //            $("#user-profile-1").show();
        //            $("#uploadid").hide();
        //        }
        scope.foo.Cus = false;
    }

    $scope.autocompCustomer = function() {

        console.log($window.sessionStorage.getItem('EUID'));
        $scope.foo.Cus = true
        $scope.dtCust = [];
        var min_length = 0; // min caracters to display the autocomplete 
        var keyword = $scope.customer.cusname;
        console.log(keyword);
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
                    console.log(data);
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