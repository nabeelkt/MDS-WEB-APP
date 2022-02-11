var elemFocus = false;
app.controller('ctrlAgent', ['$scope', '$http', '$window', 'Upload', '$timeout', '$filter', function($scope, $http, $window, Upload, $timeout, $filter) {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    $scope.customer = {
        id: 0,
        cusname: '',
        swof: '',
        cusadd: '',
        pin: 0,
        mob: '',
        dob: '',
        age: 0,
        blood: '',
        email: '',
        companyid: 0,
        phone: '',
        optype: 'Debit',
        opbal: 0
    };
    var flag = "I";
    var li_id = 0;
    var ls_activeItem = '';

    $scope.foo = {
        Veh: false,
        Cus: false
    };

    $scope.selectedRow = 0;
    $scope.msg = '';
    scope = $scope;

    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    $scope.autocompCustomer = function() {
        console.log('test');
        $scope.foo.Cus = true
        $scope.dtCust = [];
        var min_length = 0; // min caracters to display the autocomplete 
        var keyword = $scope.customer.cusname;
        if (keyword.length >= min_length) {

            $.ajax({
                url: "GService.asmx/fn_GetAgents",
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
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    alert('my error = ' + thrownError);
                    alert('my error1 = ' + ajaxOptions);
                    alert('my error2 = ' + xhr);
                }
            });

        }
    }





    $scope.btnDelete = function() {
        scope.DeleteConfirm()
    }


    $scope.btnClear = function() {


        $scope.customer.cusname = '';
        $scope.customer.cusadd = '';
        $scope.customer.mob = '';
        $scope.customer.email = '';
        $scope.customer.id = 0;
        $scope.customer.pin = 0;
        $scope.customer.phone = '';
        $scope.customer.optype = 'Debit';
        $scope.customer.opbal = 0;

        scope.foo.Cus = false;
        $("#txtVehNo").focus();

        flag = "I"
        li_id = 0
        return;
    }

    scope.myFunct = function() {
        $scope.selectedRow = 0;
        elemFocus = true;
    }

    scope.setClickedRow = function(index) {
        $scope.selectedRow = index;
    }

    //    $scope.$watch('selectedRow', function () {
    //        console.log($scope.selectedRow);
    //    });


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


    scope.DeleteConfirm = function() {
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
                        flag = "D";
                        scope.btnSubmit();
                        $(this).dialog("close");
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

    scope.btnSubmit = function() {
        console.log('test1');
        scope.msg = '';

        if ($.trim($('#txtcusname').val()).length == 0) {
            $("#txtcusname").focus();
            scope.msg = "Please Enter The Customer Name.";
            scope.MsgBox();
            return;
        } else {

            $.ajax({
                url: 'GService.asmx/fn_InsertCustomer',
                type: 'POST',
                data: {
                    flag: flag,
                    li_id: li_id,
                    ls_euid: $window.sessionStorage.getItem('EUID'),
                    cusname: scope.customer.cusname,
                    cusadd: scope.customer.cusadd,
                    li_pin: scope.customer.pin,
                    mob: scope.customer.mob,
                    ls_phone: scope.customer.phone,
                    ls_optype: scope.customer.optype,
                    ls_opbal: scope.customer.opbal,
                    ls_custype: 'A'
                },
                dataType: 'json',
                success: function(data, textStatus) {
                    console.log(data);
                    if (data[0].Error === 'False') {
                        scope.btnClear();
                        scope.msg = data[0].message;
                        scope.$apply();
                        scope.MsgBox();
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
    }




    $scope.SetData = function(ids) {

        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadCustomer',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ai_liid: ids,
                as_CusType: 'A'
            }),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {

            $scope.customer.id = data[0].ids;

            $scope.customer.cusname = data[0].Name;
            $scope.customer.cusadd = data[0].Address;
            $scope.customer.mob = data[0].Mob;
            $scope.customer.pin = data[0].pin;
            $scope.customer.phone = data[0].phnos;
            $scope.customer.optype = data[0].optype;
            $scope.customer.opbal = data[0].opbal;

            scope.foo.Cus = false;
            li_id = data[0].ids;
            flag = 'U';
        }).error(function(data, status, headers, config) {
            console.log(data);
        });

    }


    $scope.SetDataCustomer = function() {
        scope.customer.cusname = scope.dtCust[scope.selectedRow].Name;
        scope.customer.swof = scope.dtCust[scope.selectedRow].swof;
        scope.customer.pin = scope.dtCust[scope.selectedRow].pin;
        scope.customer.cusadd = scope.dtCust[scope.selectedRow].Address;
        scope.customer.mob = scope.dtCust[scope.selectedRow].Mob;
        scope.customer.phone = scope.dtCust[scope.selectedRow].phnos;
        scope.customer.email = scope.dtCust[scope.selectedRow].email;
        scope.customer.blood = scope.dtCust[scope.selectedRow].blood;
        scope.customer.dob = new Date(scope.dtCust[scope.selectedRow].dob);
        scope.customer.age = scope.dtCust[scope.selectedRow].age;
        scope.customer.optype = scope.dtCust[scope.selectedRow].optype;
        scope.customer.opbal = scope.dtCust[scope.selectedRow].opbal;

        scope.customer.id = scope.dtCust[scope.selectedRow].ids;
        li_id = scope.dtCust[scope.selectedRow].ids;
        flag = 'U';
        scope.foo.Cus = false;
    }


    $scope.LoadData = function() {
        $('#loader').show();
        $scope.dtCus = [];
        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadCustomer',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ai_liid: 0,
                as_CusType: 'A'
            }),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {

            $scope.dtCus = data;
            $('#loader').hide();
        }).error(function(data, status, headers, config) {
            console.log(data);
            $('#loader').hide();
        });

    }

}]);