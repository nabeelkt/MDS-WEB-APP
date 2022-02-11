var elemFocus = false;
app.controller('ctrlRegistration', ['$scope', '$http', '$window', 'Upload', '$timeout', '$filter', function($scope, $http, $window, Upload, $timeout, $filter) {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    $scope.vehicle = {
        id: 0,
        cusid: 0,
        authid: 0,
        clasid: 0,
        vehno: '',
        chasno: '',
        fuel: '',
        cc: '',
        seatcap: '',
        regfrm: '',
        regto: '',
        taxfrm: '',
        taxto: '',
        prmtfrm: '',
        prmto: '',
        cffrm: '',
        cfto: '',
        polyno: '',
        polytyp: '',
        insname: '',
        insadd: '',
        idv: '',
        ncb: '',
        premamnt: 0,
        insfrm: '',
        insto: '',
        welno: '',
        welamnt: 0,
        welfrm: '',
        welto: '',
        companyid: 0,
        engno: '',
        bhp: '',
        make: '',
        monthyear: '',
        color: '',
        unlead: '',
        authfrm: '',
        authto: '',
        remarks: ''
    };
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
        phone: ''
    };
    var flag = "I";
    var li_id = 0;
    var ls_activeItem = '';

    $scope.vehicle.companyid = 1

    $scope.foo = {
        Veh: false,
        Cus: false
    };

    $scope.selectedRow = 0;
    $scope.msg = '';
    scope = $scope;

    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    function addMonths(date, months) {
        var myDate = new Date(date);
        myDate.setMonth(myDate.getMonth() + months);
        myDate.setDate(myDate.getDate() - 1);
        return myDate;
    }

    $scope.chnReg = function() {
        $scope.vehicle.regto = addMonths($scope.vehicle.regfrm, 180);
    }

    $scope.chnTax = function() {
        $scope.vehicle.taxto = addMonths($scope.vehicle.taxfrm, 240);
    }

    $scope.chnIns = function() {
        $scope.vehicle.insto = addMonths($scope.vehicle.insfrm, 12);
    }

    $scope.chnauth = function() {
        $scope.vehicle.authto = addMonths($scope.vehicle.authfrm, 12);
    }

    $scope.chnPer = function() {
        $scope.vehicle.prmto = addMonths($scope.vehicle.prmtfrm, 60);
    }

    $scope.chnCf = function() {
        $scope.vehicle.cfto = addMonths($scope.vehicle.cffrm, 12);
    }

    scope.LoadCombo = function() {
        scope.LoadAuthority();
        scope.LoadVehClass();

    }

    scope.LoadDef = function() {

        var mydata = parseInt($window.sessionStorage.getItem('defAuthoId'));

        $scope.vehicle.authid = mydata;

    }



    $scope.dtAutho = [];
    scope.LoadAuthority = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetAuthority',
            dataType: 'json',
            async: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $scope.dtAutho = data;
            //            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }

    $scope.dtClass = [];
    scope.LoadVehClass = function() {
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
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    $scope.autocompCustomer = function() {
        $scope.foo.Cus = true
        $scope.dtCust = [];
        var min_length = 0; // min caracters to display the autocomplete 
        var keyword = $scope.customer.cusname;
        if (keyword.length >= min_length) {

            $.ajax({
                url: "GService.asmx/fn_GetCustomers",
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


    $scope.autocompVehicle = function() {
        $scope.foo.Veh = true
        $scope.dtVeh = [];
        var min_length = 0; // min caracters to display the autocomplete 
        var keyword = $scope.vehicle.vehno;
        if (keyword.length >= min_length) {
            $('#contno').addClass('ne-pre-con');
            $.ajax({
                url: "GService.asmx/fn_GetVehNumbers",
                type: "GET",
                data: {
                    ls_euid: $window.sessionStorage.getItem('EUID'),
                    strSearchkey: keyword
                },
                dataType: "json",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function(data, textStatus, jqXHR) {

                    if (data[0].Error === 'True') {
                        if (data[0].message === 'NO ITEMS FOUND') {
                            scope.foo.Veh = false;
                            scope.$apply();
                        }
                    } else {
                        $scope.dtVeh = data;
                        scope.$apply();
                    }
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



    $scope.btnDelete = function() {
        scope.DeleteConfirm()
    }


    $scope.btnClear = function() {

        $scope.vehicle.cusid = 0;
        $scope.vehicle.authid = 0;
        $scope.vehicle.clasid = 0;
        $scope.vehicle.vehno = '';
        $scope.vehicle.chasno = '';

        $scope.vehicle.fuel = '';
        $scope.vehicle.cc = '';
        $scope.vehicle.seatcap = '';
        $scope.vehicle.regfrm = '';
        $scope.vehicle.regto = '';
        $scope.vehicle.taxfrm = '';
        $scope.vehicle.taxto = '';
        $scope.vehicle.prmtfrm = '';
        $scope.vehicle.prmto = '';
        $scope.vehicle.cffrm = '';
        $scope.vehicle.cfto = '';
        $scope.vehicle.authfrm = '';
        $scope.vehicle.authto = '';
        $scope.vehicle.polyno = '';
        $scope.vehicle.polytyp = '';
        $scope.vehicle.insname = '';
        $scope.vehicle.insadd = '';
        $scope.vehicle.idv = '';
        $scope.vehicle.ncb = '';
        $scope.vehicle.premamnt = 0;
        $scope.vehicle.insfrm = '';
        $scope.vehicle.insto = '';
        $scope.vehicle.welno = '';
        $scope.vehicle.welamnt = 0;
        $scope.vehicle.welfrm = '';
        $scope.vehicle.welto = '';
        $scope.vehicle.remarks = '';

        $scope.customer.cusname = '';
        $scope.customer.cusadd = '';
        $scope.customer.mob = '';
        $scope.customer.email = '';
        $scope.customer.id = 0;

        $scope.customer.phone = '';
        $scope.vehicle.engno = '';
        $scope.vehicle.bhp = '';
        $scope.vehicle.monthyear = '';
        $scope.vehicle.color = '';
        $scope.vehicle.unlead = '';
        $scope.vehicle.make = '';



        scope.foo.Veh = false;
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
        console.log(scope.customer.phone);

        scope.msg = '';

        if ($.trim($('#txtVehNo').val()).length == 0) {
            $("#txtVehNo").focus();
            scope.msg = "Please Enter The Vehicle No.";
            scope.MsgBox();
            return;
        } else if ($scope.vehicle.authid == 0) {
            $("#cmbAutho").focus();
            scope.msg = "Please Select The Authority.";
            scope.MsgBox();
            return;
        } else if ($scope.vehicle.clasid == 0) {
            $("#cmbClass").focus();
            scope.msg = "Please Select The Class Of Vehicle.";
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtcusname').val()).length == 0) {
            $("#txtcusname").focus();
            scope.msg = "Please Enter The Name Of Owner.";
            scope.MsgBox();
            return;
        } else {

            $.ajax({
                url: 'GService.asmx/fn_InsertVehicle',
                type: 'POST',
                data: {
                    flag: flag,
                    li_id: li_id,
                    cusid: scope.customer.id,
                    authid: scope.vehicle.authid,
                    clasid: scope.vehicle.clasid,
                    vehno: scope.vehicle.vehno,
                    chasno: scope.vehicle.chasno,
                    fuel: scope.vehicle.fuel,
                    cc: scope.vehicle.cc,
                    seatcap: scope.vehicle.seatcap,
                    regfrm: $filter('date')($.trim($('#dtpregfrm').val(), 'dd/MM/yyyy')),
                    regto: $filter('date')($.trim($('#dtpregto').val(), 'dd/MM/yyyy')),
                    taxfrm: $filter('date')($.trim($('#dtptaxfrm').val(), 'dd/MM/yyyy')),
                    taxto: $filter('date')($.trim($('#dtptaxto').val(), 'dd/MM/yyyy')),
                    prmtfrm: $filter('date')($.trim($('#dtpperfrm').val(), 'dd/MM/yyyy')),
                    prmto: $filter('date')($.trim($('#dtpperto').val(), 'dd/MM/yyyy')),
                    cffrm: $filter('date')($.trim($('#dtpcffrm').val(), 'dd/MM/yyyy')),
                    cfto: $filter('date')($.trim($('#dtpcfto').val(), 'dd/MM/yyyy')),
                    polyno: scope.vehicle.polyno,
                    polytyp: scope.vehicle.polytyp,
                    insname: scope.vehicle.insname,
                    insadd: scope.vehicle.insadd,
                    idv: scope.vehicle.idv,
                    ncb: scope.vehicle.ncb,
                    premamnt: scope.vehicle.premamnt,
                    insfrm: $filter('date')($.trim($('#dtpinsfrm').val(), 'dd/MM/yyyy')),
                    insto: $filter('date')($.trim($('#dtpinsto').val(), 'dd/MM/yyyy')),
                    welno: scope.vehicle.welno,
                    welamnt: scope.vehicle.welamnt,
                    welfrm: $filter('date')($.trim($('#dtpweldtdfrm').val(), 'dd/MM/yyyy')),
                    welto: $filter('date')($.trim($('#dtpweldtdto').val(), 'dd/MM/yyyy')),
                    ls_euid: $window.sessionStorage.getItem('EUID'),
                    cusname: scope.customer.cusname,
                    cusadd: scope.customer.cusadd,
                    mob: scope.customer.mob,
                    email: scope.customer.email,
                    ls_phone: scope.customer.phone,
                    ls_engno: scope.vehicle.engno,
                    ls_bhp: scope.vehicle.bhp,
                    ls_monthyear: scope.vehicle.monthyear,
                    ls_color: scope.vehicle.color,
                    ls_unlead: scope.vehicle.unlead,
                    ls_make: scope.vehicle.make,
                    authfrm: $filter('date')($.trim($('#dtpauthfrm').val(), 'dd/MM/yyyy')),
                    authto: $filter('date')($.trim($('#dtpauthto').val(), 'dd/MM/yyyy')),
                    ls_remarks: scope.vehicle.remarks
                },
                dataType: 'json',
                success: function(data, textStatus) {

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




    function addMonths(date, months) {
        var myDate = new Date(date);
        myDate.setMonth(myDate.getMonth() + months);
        myDate.setDate(myDate.getDate() - 1);
        return myDate;
    }

    $scope.chage = function() {
        var myDate = new Date($scope.customer.dob);
        var ageDifMs = Date.now() - myDate.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch        
        $scope.customer.age = Math.abs(ageDate.getUTCFullYear() - 1970);

    }
    $scope.chlenlic = function() {
        $scope.vehicle.lenlicto = addMonths($scope.vehicle.lenlicfrom, 6);

    }
    $scope.chntv = function() {
        $scope.vehicle.ntvto = addMonths($scope.licence.ntvfrom, 240);

    }
    $scope.chtv = function() {
        $scope.licence.tvto = addMonths($scope.licence.tvfrom, 240);

    }

    $scope.Fun_ChangeBal = function() {
        $scope.licence.bal = $scope.licence.tot - $scope.licence.adv;
    }

    $scope.SetData = function(ids) {

        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadVehicle',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ai_liid: ids
            }),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {

            var curDate = new Date();
            $scope.vehicle.cusid = data[0].cusid;
            $scope.customer.id = data[0].cusid;
            $scope.vehicle.companyid = data[0].companyid;
            $scope.vehicle.authid = data[0].authid;
            $scope.vehicle.clasid = data[0].clasid;
            $scope.vehicle.vehno = data[0].vehno;
            $scope.vehicle.chasno = data[0].chasno;

            $scope.vehicle.fuel = data[0].fuel;
            $scope.vehicle.cc = data[0].cc;
            $scope.vehicle.seatcap = data[0].seatcap;
            $scope.vehicle.regfrm = SNLDateSet(data[0].regfrm);
            $scope.vehicle.regto = SNLDateSet(data[0].regto);
            if (new Date($scope.vehicle.regto) > curDate) {
                $scope.RegStyle = {
                    color: 'darkgreen',
                    'font-size': 'large'
                };
            } else {
                $scope.RegStyle = {
                    color: 'crimson',
                    'font-size': 'large'
                };
            }


            $scope.vehicle.taxfrm = SNLDateSet(data[0].taxfrm);
            $scope.vehicle.taxto = SNLDateSet(data[0].taxto);
            if (new Date($scope.vehicle.taxto) > curDate) {
                $scope.TaxStyle = {
                    color: 'darkgreen',
                    'font-size': 'large'
                };
            } else {
                $scope.TaxStyle = {
                    color: 'crimson',
                    'font-size': 'large'
                };
            }
            $scope.vehicle.prmtfrm = SNLDateSet(data[0].prmtfrm);
            $scope.vehicle.prmto = SNLDateSet(data[0].prmto);
            if (new Date($scope.vehicle.prmto) > curDate) {
                $scope.PerStyle = {
                    color: 'darkgreen',
                    'font-size': 'large'
                };
            } else {
                $scope.PerStyle = {
                    color: 'crimson',
                    'font-size': 'large'
                };
            }
            $scope.vehicle.cffrm = SNLDateSet(data[0].cffrm);
            $scope.vehicle.cfto = SNLDateSet(data[0].cfto);
            console.log($scope.vehicle.cfto);
            if (new Date($scope.vehicle.cfto) > curDate) {
                $scope.CFStyle = {
                    color: 'darkgreen',
                    'font-size': 'large'
                };
            } else {
                $scope.CFStyle = {
                    color: 'crimson',
                    'font-size': 'large'
                };
            }
            $scope.vehicle.polyno = data[0].polyno;
            $scope.vehicle.polytyp = data[0].polytyp;
            $scope.vehicle.insname = data[0].insname;
            $scope.vehicle.insadd = data[0].insadd;
            $scope.vehicle.idv = data[0].idv;
            $scope.vehicle.ncb = data[0].ncb;
            $scope.vehicle.premamnt = data[0].premamnt;
            $scope.vehicle.insfrm = SNLDateSet(data[0].insfrm);
            $scope.vehicle.insto = SNLDateSet(data[0].insto);
            if (new Date($scope.vehicle.insto) > curDate) {
                $scope.InsStyle = {
                    color: 'darkgreen',
                    'font-size': 'large'
                };
            } else {
                $scope.InsStyle = {
                    color: 'crimson',
                    'font-size': 'large'
                };
            }
            $scope.vehicle.welno = data[0].welno;
            $scope.vehicle.welamnt = data[0].welamnt;
            $scope.vehicle.welfrm = SNLDateSet(data[0].welfrm);
            $scope.vehicle.welto = SNLDateSet(data[0].welto);

            $scope.vehicle.authfrm = SNLDateSet(data[0].authfrm);
            $scope.vehicle.authto = SNLDateSet(data[0].authto);

            $scope.customer.cusname = data[0].cusname;
            $scope.customer.cusadd = data[0].cusadd;
            $scope.customer.mob = data[0].mob;
            $scope.customer.email = data[0].email;

            $scope.customer.phone = data[0].phnos;
            $scope.vehicle.engno = data[0].engno;
            $scope.vehicle.bhp = data[0].bhp;
            $scope.vehicle.monthyear = data[0].monthyear;
            $scope.vehicle.color = data[0].color;
            $scope.vehicle.unlead = data[0].unlead;
            $scope.vehicle.make = data[0].make;
            $scope.vehicle.remarks = data[0].remarks;

            scope.foo.Veh = false;
            scope.foo.Cus = false;
            //scope.$apply();
            //            scope.$apply();
            li_id = data[0].vid;
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

        scope.customer.id = scope.dtCust[scope.selectedRow].ids;
        scope.foo.Cus = false;
    }

    $scope.SetDataVehicle = function() {
        scope.SetData(scope.dtVeh[scope.selectedRow].ids);
    }

    function SNLDateSet(dateStr) {

        var parts = dateStr.split("-");
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    $scope.LoadData = function() {
        $('#loader').show();
        $scope.dtVeh = [];
        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadVehicle',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ai_liid: 0
            }),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {
            $scope.dtVeh = data;
            $('#loader').hide();
        }).error(function(data, status, headers, config) {
            console.log(data);
            $('#loader').hide();
        });

    }

}]);



app.directive('arrowSelector2', ['$document', function($document) {

    return {
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {

            elem.on('mouseenter', function() {
                elemFocus = true;

            });
            elem.on('mouseleave', function() {

                elemFocus = false;

            });
            $document.bind('keyup', function(e) {

                if (document.activeElement.id !== '') {
                    ls_activeItem = document.activeElement.id;
                }

                if (elemFocus) {
                    if (e.keyCode == 38) {

                        if (scope.selectedRow == 0) {
                            return;
                        }
                        scope.selectedRow--;
                        scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ls_activeItem === 'txtcusname') {
                            if (scope.selectedRow == scope.dtCust.length - 1) {
                                return;
                            }
                            $("#txtcusname").blur();
                        } else if (ls_activeItem === 'txtVehNo') {

                            if (scope.selectedRow == scope.dtVeh.length - 1) {
                                return;
                            }
                            $("#txtVehNo").blur();
                        }

                        scope.selectedRow++;
                        scope.$apply();
                        e.preventDefault();
                        return;
                    }
                    if (e.keyCode == 13) {
                        if (ls_activeItem == 'txtVehNo') {
                            scope.SetDataVehicle();
                            //                            scope.SetData(scope.dtVeh[scope.selectedRow].ids);
                            scope.foo.Veh = false;
                        } else if (ls_activeItem === 'txtcusname') {
                            scope.SetDataCustomer();
                            scope.foo.Cus = false;
                        }
                        scope.$apply();
                    }
                    if (e.keyCode == 27) {
                        console.log('test27');
                        if (ls_activeItem === 'txtVehNo') {
                            scope.foo.Veh = false;
                        } else if (ls_activeItem === 'txtcusname') {
                            scope.foo.Cus = false;
                        }
                        scope.$apply();
                    }
                }
            });
        }
    };
}]);