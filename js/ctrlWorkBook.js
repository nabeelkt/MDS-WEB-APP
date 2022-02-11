app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrlWorkBook', function($scope, $filter, $http, $window, $interval) {

    var flag = "I";
    var li_id = 0;
    var ls_activeItem = '';

    $scope.msg = '';
    $scope.dtLicFees = [];
    $scope.dtLicStudents = [];
    $scope.foo = {
        Veh: false,
        Cus: false
    };
    $scope.selectedRow = 0;


    $scope.msg = '';

    $scope.customer = {
        id: 0,
        cusname: '',
        mob: 0,
        dob: '',
        age: 0
    };
    $scope.vehicle = {
        id: 0,
        vehno: '',
        clasid: 0,
        regfrm: '',
        regto: '',
        taxfrm: '',
        taxto: '',
        cffrm: '',
        cfto: '',
        insfrm: '',
        insto: '',
        prmtfrm: '',
        prmto: ''
    };
    $scope.licence = {
        id: 0,
        licno: '',
        tvfrm: '',
        tvto: '',
        ntvfrom: '',
        ntvto: ''
    };
    $scope.workbook = {
        id: 0,
        date: '',
        wtype: '',
        accid: '',
        authoid: 0,
        agentid: 0,
        cusid: 0,
        vehid: 0,
        licid: 0,
        wstaid: 0,
        invwardno: '',
        tot: 0,
        adv: 0,
        bal: 0,
        remarks: '',
        polyno: '',
        polytyp: '',
        insname: '',
        insadd: '',
        idv: '',
        ncb: '',
        premamnt: 0
    };

    scope = $scope;
    var ls_mob = '';

    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    scope.myFunct = function() {

        $scope.selectedRow = 0;
        elemFocus = true;
    }

    scope.setClickedRow = function(index) {
        $scope.selectedRow = index;
    }

    $scope.LoadDef = function() {
        $scope.workbook.date = new Date();
        var mydata = $window.sessionStorage.getItem('Ids');
        console.log(mydata);
        if (mydata !== null) {
            $scope.SetData(mydata);
            $window.sessionStorage.removeItem('Ids');
        }
    }

    $scope.licClass = [{
            value: '2 Wheel',
            text: '2 Wheel'
        },
        {
            value: '3 Wheel',
            text: '3 Wheel'
        },
        {
            value: '4 Wheel',
            text: '4 Wheel'
        },
        {
            value: '2 & 4 Wheel',
            text: '2 & 4 Wheel'
        },
        {
            value: '2 & 3 Wheel',
            text: '2 & 3 Wheel'
        },
        {
            value: '3 & 4 Wheel',
            text: '3 & 4 Wheel'
        },
        {
            value: '2 3 & 4 Wheel',
            text: '2,3 & 4 Wheel'
        }
    ];

    scope.LoadCombo = function() {
        scope.LoadAuthority();
        scope.LoadAgent();
        scope.LoadVehClass();
        scope.LoadWorkStatus();
        var mydata = parseInt($window.sessionStorage.getItem('defAuthoId'));
        $scope.workbook.authoid = mydata;
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
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    $scope.dtAgent = [];
    scope.LoadAgent = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_LoadCustomer',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ai_liid: 0,
                as_CusType: 'A'
            }),
            dataType: 'json',
            async: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $scope.dtAgent = data;
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

    $scope.dtStatus = [];
    scope.LoadWorkStatus = function() {
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
        }).error(function(data, ajaxOptions, thrownError) {
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    scope.LoadServiceHeads = function() {
        $scope.dtAcc = [];

        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetServiceHeads',
            data: {
                wtype: scope.workbook.wtype,
                ls_euid: $window.sessionStorage.getItem('EUID')
            },
            dataType: 'json',
            async: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            if (scope.workbook.wtype == 'Licence') {
                $('#divVeh').hide();
                $('#divVeh1').hide();
                $('#divLic').show();
                $('#divLic1').show();
                $('#divLic2').show();
            } else if (scope.workbook.wtype == 'Vehicle') {
                $('#divVeh').show();
                $('#divVeh1').show();
                $('#divLic').hide();
                $('#divLic1').hide();
                $('#divLic2').hide();
            }
            $scope.dtAcc = data;
            //            scope.$apply();
        }).error(function(data, ajaxOptions, thrownError) {
            console.log(data);
            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }



    $scope.formatStatus = function(status, slno) {
        var displayText;
        var stacus;

        angular.forEach($scope.dtLicStudents, function(data) {
            if (status !== undefined) {
                if (status.CusName === undefined) {
                    stacus = status;
                } else {
                    stacus = status.CusName;
                }
                if (data.CusName === stacus) {
                    displayText = data.CusName;
                    $scope.dtLicFees[slno - 1].Mob = data.Mob;
                    $scope.dtLicFees[slno - 1].CusId = data.id;
                    return;
                }
            }
        });
        return displayText ? displayText : '';
    };

    $scope.onSelectedCallback = function($item, $model, $label, $event) {

        $model.CusName = $item.CusName;
    };

    $scope.showLicStudent = function(user) {


        var selected = [];

        if (user.CusName) {

            selected = $filter('filter')($scope.dtLicStudents, {
                CusName: user.CusName
            });

        }

        return selected.length ? selected[0].CusName : 'Not set';
    };


    $scope.changeeventAdv = function(adv, slno) {
        scope.dtLicFees[slno - 1].Bal = scope.dtLicFees[slno - 1].Tot - adv;
        scope.dtLicFees[slno - 1].Adv = adv;
    }

    $scope.changeevent = function(clsname, slno) {

        $.ajax({
            url: 'GService.asmx/fn_GetClassChange',
            type: 'POST',
            data: {
                clsname: clsname,
                companyid: 1
            },
            dataType: 'json',
            success: function(data, textStatus) {
                $scope.dtLicFees[slno - 1].ClassName = data[0].classname;
                $scope.dtLicFees[slno - 1].Tot = data[0].rate;
                $scope.dtLicFees[slno - 1].Bal = $scope.dtLicFees[slno - 1].Tot - $scope.dtLicFees[slno - 1].Adv;
                scope.$apply();
            },
            error: function(data, textStatus, errorThrown) {

                scope.msg = data[0].message;
                scope.$apply();
                scope.MsgBox();
            }
        });

    };

    $scope.showLicStudentMob = function(user) {
        var selected = [];
        if (user.Mob) {
            selected = $filter('filter')($scope.dtLicStudents, {
                Mob: user.Mob
            });
        }
        return selected.length ? selected[0].Mob : 'Not set';
    };

    $scope.showClass = function(user) {

        var selected = [];
        if (user.ClassName) {
            selected = $filter('filter')($scope.licClass, {
                value: user.ClassName
            });

        }
        return selected.length ? selected[0].text : 'Not set';
    };



    $scope.checkName = function(data, id) {
        if (data === '') {
            return "Student Name Should Not Be Empty";
        }
    };

    function MobileValidation() {
        var y = $('#txtcontno').val();
        var valid = true;
        if (isNaN(y) || y.indexOf(" ") != -1) {
            valid = false;
        }
        if (y.length > 11 || y.length < 10) {
            valid = false;
        }
        return valid;
    };


    $scope.Fun_ChangeBal = function() {
        $scope.workbook.bal = $scope.workbook.tot - $scope.workbook.adv;
    }

    $scope.btnDelete = function() {
        scope.DeleteConfirm()
    }


    $scope.btnClear = function() {

        $scope.customer.id = 0;
        $scope.customer.cusname = '';
        $scope.customer.mob = '';
        $scope.customer.dob = '';
        $scope.customer.age = 0;

        $scope.vehicle.vehno = '';
        $scope.vehicle.id = 0;
        $scope.vehicle.clasid = 0;

        $scope.vehicle.regfrm = '';
        $scope.vehicle.regto = '';
        $scope.vehicle.taxfrm = '';
        $scope.vehicle.taxto = '';
        $scope.vehicle.cffrm = '';
        $scope.vehicle.cfto = '';
        $scope.vehicle.insfrm = '';
        $scope.vehicle.insto = '';
        $scope.vehicle.prmtfrm = '';
        $scope.vehicle.prmto = '';

        $scope.licence.id = 0;
        $scope.licence.licno = '';
        $scope.licence.ntvfrom = '';
        $scope.licence.ntvto = '';
        $scope.licence.tvfrm = '';
        $scope.licence.tvto = '';

        $scope.workbook.id = 0;
        $scope.workbook.date = '';
        $scope.workbook.wtype = '';
        $scope.workbook.accid = 0;
        $scope.workbook.authoid = 0;
        $scope.workbook.agentid = 0;
        $scope.workbook.cusid = 0;
        $scope.workbook.vehid = 0;
        $scope.workbook.licid = 0;
        $scope.workbook.wstaid = 0;
        $scope.workbook.invwardno = '';
        $scope.workbook.tot = 0;
        $scope.workbook.adv = 0;
        $scope.workbook.bal = 0;
        $scope.workbook.polyno = '';
        $scope.workbook.polytyp = '';
        $scope.workbook.insname = '';
        $scope.workbook.insadd = '';
        $scope.workbook.idv = '';
        $scope.workbook.ncb = '';
        $scope.workbook.premamnt = 0;
        $scope.workbook.remarks = '';

        scope.foo.Veh = false;
        scope.foo.Cus = false;
        $scope.LoadDef();
        var mydata = parseInt($window.sessionStorage.getItem('defAuthoId'));
        $scope.workbook.authoid = mydata;
        $("#txtwrktype").focus();

        $scope.dtAcc = [];
        $scope.apply;

        flag = "I"
        li_id = 0
        return;
    }


    $scope.LoadData = function() {
        $('#loader').show();
        $scope.btnClear();
        $scope.dtLen = [];
        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadWorkBook',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ai_liid: 0
            }),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {
            $scope.dtLen = data;
            $('#loader').hide();
        }).error(function(data, status, headers, config) {
            console.log(data);
            $('#loader').hide();
        });

    }

    $scope.btnSubmit = function() {
        //        console.log($filter('date')($.trim($('#dtpdob').val(), 'dd/MM/yyyy')));
        //        console.log($filter('date')($.trim($('#dtptvfrm').val(), 'dd/MM/yyyy')));

        $("#ajxloader").show();
        if ($scope.workbook.wtype == '') {
            scope.msg = "Select Work Type.";
            $("#txtwrktype").focus();
            scope.MsgBox();
            return;
        } else if ($scope.workbook.accid == 0) {
            scope.msg = "Select Service Type.";
            $("#cmbserv").focus();
            scope.MsgBox();
            return;
        } else if ($scope.workbook.authoid == 0) {
            scope.msg = "Select Authority Name.";
            $("#cmbAutho").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtcusname').val()).length == 0) {
            scope.msg = "Enter Customer Name.";
            $("#txtcusname").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtcontno').val()).length !== 0) {
            if (!MobileValidation()) {
                scope.msg = "Invalid Mobile Number.";
                $("#txtcontno").focus();
                scope.MsgBox();
                return;
            }
        }


        if (($.trim($('#txtwrktype').val()) == 'Vehicle')) {

            if ($.trim($('#txtVehNo').val()).length == 0) {
                scope.msg = "Enter Vechicle Number.";
                $("#txtVehNo").focus();
                scope.MsgBox();
                return;
            } else if ($scope.vehicle.clasid == 0) {
                scope.msg = "Selcet Vehicle Class.";
                $("#cmbClass").focus();
                scope.MsgBox();
                return;
            }


        }
        if (($.trim($('#txtwrktype').val()) == 'Licence')) {
            scope.vehicle.clasid = 0;
            if ($.trim($('#txtlicno').val()).length == 0) {
                scope.msg = "Enter Licence Number.";
                $("#txtlicno").focus();
                scope.MsgBox();
                return;
            }
            //            else if ($.trim($('#dtpregfrm').val()).length == 0) {
            //                scope.msg = "Enter Validity.";
            //                $("#dtpregfrm").focus();
            //                scope.MsgBox();
            //                return;
            //            }
        }
        if ($scope.workbook.wstaid == 0) {
            scope.msg = "Select Work Status.";
            $("#cmbwstatus").focus();
            scope.MsgBox();
            return;
        }
        //        console.log(flag);
        //        console.log(li_id);
        //        console.log($filter('date')($.trim($('#dtpDate').val(), 'dd/MM/yyyy')));
        //        console.log(scope.workbook.wtype);
        //        console.log(scope.workbook.accid);
        //        console.log(scope.workbook.wtype);
        //        console.log(scope.workbook.authoid);
        //        console.log(scope.workbook.cusid);
        //        console.log(scope.workbook.vehid);
        //        console.log(scope.workbook.licid);
        //        console.log(scope.workbook.wstaid);
        //        console.log(scope.workbook.invwardno);
        //        console.log(scope.workbook.tot);
        //        console.log(scope.workbook.adv);
        //        console.log(scope.workbook.bal);

        //        console.log(scope.workbook.remarks);
        ////        console.log(scope.workbook.cusname);
        ////        console.log(scope.workbook.mob);
        ////        console.log(scope.workbook.vehno);
        ////        console.log(scope.workbook.clasid);
        ////        console.log(scope.workbook.licno);
        //        console.log(scope.workbook.polyno);
        //        console.log(scope.workbook.polytyp);
        //        console.log(scope.workbook.insname);
        //        console.log(scope.workbook.insadd);
        //        console.log(scope.workbook.idv);
        //        console.log(scope.workbook.ncb);
        //        console.log(scope.workbook.premamnt);


        $.ajax({
            url: 'GService.asmx/fn_InsertAutoWorkbook',
            type: 'POST',
            data: {
                flag: flag,
                li_id: li_id,
                ls_wdate: $filter('date')($.trim($('#dtpDate').val(), 'dd/MM/yyyy')),
                ls_wtype: scope.workbook.wtype,
                li_accid: scope.workbook.accid,
                li_authid: scope.workbook.authoid,
                li_cusid: scope.workbook.cusid,
                li_vehid: scope.workbook.vehid,
                li_licid: scope.workbook.licid,
                li_statusid: scope.workbook.wstaid,
                ls_inwardno: scope.workbook.invwardno,
                ld_total: scope.workbook.tot,
                ld_adv: scope.workbook.adv,
                ld_bal: scope.workbook.bal,
                ls_remark: scope.workbook.remarks,
                ls_cusname: scope.customer.cusname,
                ls_mob: scope.customer.mob,
                ls_vehno: scope.vehicle.vehno,
                li_classid: scope.vehicle.clasid,
                ls_licno: scope.licence.licno,
                ls_tvfrm: $filter('date')($.trim($('#dtptvfrm').val(), 'dd/MM/yyyy')),
                ls_tvto: $filter('date')($.trim($('#dtptvto').val(), 'dd/MM/yyyy')),
                ls_dob: $filter('date')($.trim($('#dtpdob').val(), 'dd/MM/yyyy')),
                ls_age: scope.customer.age,
                ls_regfrm: $filter('date')($.trim($('#dtpregfrm').val(), 'dd/MM/yyyy')),
                ls_regto: $filter('date')($.trim($('#dtpregto').val(), 'dd/MM/yyyy')),
                ls_taxfrm: $filter('date')($.trim($('#dtptaxfrm').val(), 'dd/MM/yyyy')),
                ls_taxto: $filter('date')($.trim($('#dtptaxto').val(), 'dd/MM/yyyy')),
                ls_insfrm: $filter('date')($.trim($('#dtpinsfrm').val(), 'dd/MM/yyyy')),
                ls_insto: $filter('date')($.trim($('#dtpinsto').val(), 'dd/MM/yyyy')),
                ls_cffrm: $filter('date')($.trim($('#dtpcffrm').val(), 'dd/MM/yyyy')),
                ls_cfto: $filter('date')($.trim($('#dtpcfto').val(), 'dd/MM/yyyy')),
                ls_ntvfrm: $filter('date')($.trim($('#dtpntvfrom').val(), 'dd/MM/yyyy')),
                ls_ntvto: $filter('date')($.trim($('#dtpntvto').val(), 'dd/MM/yyyy')),
                ls_prmtfrm: $filter('date')($.trim($('#dtpperfrm').val(), 'dd/MM/yyyy')),
                ls_prmto: $filter('date')($.trim($('#dtpperto').val(), 'dd/MM/yyyy')),
                ls_euid: $window.sessionStorage.getItem('EUID'),
                li_agentid: scope.workbook.agentid,
                ls_polyno: scope.workbook.polyno,
                ls_polytyp: scope.workbook.polytyp,
                ls_insname: scope.workbook.insname,
                ls_insadd: scope.workbook.insadd,
                ls_idv: scope.workbook.idv,
                ls_ncb: scope.workbook.ncb,
                ls_premamnt: scope.workbook.premamnt
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
                //                $interval(scope.LoadAuthority(), 1000);
            },
            error: function(data, textStatus, errorThrown) {
                console.log(data);
                scope.msg = data[0].message;
                scope.$apply();
                scope.MsgBox();
            }
        });

    };






    scope.LoadStudDailyFees = function() {
        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetLicFees',
            data: {
                feedate: $filter('date')($scope.licfees.dt, 'MM/dd/yyyy'),
                companyid: 1
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {
            $scope.dtLicFees = data;
            scope.$apply();
        }).error(function(xhr, ajaxOptions, thrownError) {

            scope.msg = data[0].message;
            scope.$apply();
            scope.MsgBox();
        });

    }


    scope.LoadLicStudents = function() {
        $scope.licfees.dt = new Date();

        $.ajax({
            type: 'post',
            url: 'GService.asmx/fn_GetLicStudents',
            data: {
                companyid: 1
            },
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, textStatus, jqXHR) {

            $scope.dtLicStudents = data;
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
                            flag = "D";
                            scope.btnSubmit();
                        }
                        $scope.dtLicFees.splice(index, 1);
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

    $scope.autocompCustomer = function() {
        if ($scope.workbook.wtype == '') {
            scope.msg = "Select Work Type.";
            $("#txtwrktype").focus();
            scope.MsgBox();
            return;
        } else if ($scope.workbook.accid == 0) {
            scope.msg = "Select Service Type.";
            $("#cmbserv").focus();
            scope.MsgBox();
            return;
        }

        $scope.foo.Cus = true
        $scope.dtCust = [];
        var min_length = 0; // min caracters to display the autocomplete 
        var keyword = $scope.customer.cusname;
        if (keyword.length >= min_length) {

            $.ajax({
                url: "GService.asmx/fn_GetCustomersWorkBook",
                type: "GET",
                data: {
                    strSearchkey: keyword,
                    strWType: $scope.workbook.wtype,
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
        if ($scope.workbook.wtype == '') {
            scope.msg = "Select Work Type.";
            $("#txtwrktype").focus();
            scope.MsgBox();
            return;
        } else if ($scope.workbook.accid == 0) {
            scope.msg = "Select Service Type.";
            $("#cmbserv").focus();
            scope.MsgBox();
            return;
        }
        $scope.foo.Veh = true
        $scope.dtVeh = [];
        var min_length = 0; // min caracters to display the autocomplete 
        var keyword = $scope.vehicle.vehno;
        if (keyword.length >= min_length) {
            $('#contno').addClass('ne-pre-con');
            $.ajax({
                url: "GService.asmx/fn_GetVehNumbersWorkBook",
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
                error: function(data, ajaxOptions, thrownError) {
                    console.log(data);
                    $('#contno').removeClass('ne-pre-con');
                }
            });

        }
    }


    $scope.SetDataCustomer = function() {
        console.log(scope.dtCust);
        scope.customer.cusname = scope.dtCust[scope.selectedRow].Name;
        scope.customer.mob = scope.dtCust[scope.selectedRow].Mob;
        scope.workbook.cusid = scope.dtCust[scope.selectedRow].ids;
        if (scope.workbook.wtype == 'Vehicle') {

            if (scope.dtCust[scope.selectedRow].vehcnt == 1) {
                scope.vehicle.vehno = scope.dtCust[scope.selectedRow].vehno;
                scope.workbook.vehid = scope.dtCust[scope.selectedRow].vehid;
                scope.vehicle.clasid = scope.dtCust[scope.selectedRow].clasid;

                scope.vehicle.regfrm = SNLDateSet(scope.dtCust[scope.selectedRow].regfrm);
                scope.vehicle.regto = SNLDateSet(scope.dtCust[scope.selectedRow].regto);
                scope.vehicle.taxfrm = SNLDateSet(scope.dtCust[scope.selectedRow].taxfrm);
                scope.vehicle.taxto = SNLDateSet(scope.dtCust[scope.selectedRow].taxto);
                scope.vehicle.cffrm = SNLDateSet(scope.dtCust[scope.selectedRow].cffrm);
                scope.vehicle.cfto = SNLDateSet(scope.dtCust[scope.selectedRow].cfto);
                scope.vehicle.insfrm = SNLDateSet(scope.dtCust[scope.selectedRow].insfrm);
                scope.vehicle.insto = SNLDateSet(scope.dtCust[scope.selectedRow].insto);
                scope.vehicle.prmtfrm = SNLDateSet(scope.dtCust[scope.selectedRow].prmtfrm);
                scope.vehicle.prmto = SNLDateSet(scope.dtCust[scope.selectedRow].prmto);

            }
        } else if (scope.workbook.wtype == 'Licence') {

            if (scope.dtCust[scope.selectedRow].licno !== '') {
                scope.licence.licno = scope.dtCust[scope.selectedRow].licno;
                scope.licence.ntvfrom = SNLDateSet(scope.dtCust[scope.selectedRow].ntvfrm);
                scope.licence.ntvto = SNLDateSet(scope.dtCust[scope.selectedRow].ntvto);
                scope.licence.tvfrm = SNLDateSet(scope.dtCust[scope.selectedRow].tvfrm);
                scope.licence.tvto = SNLDateSet(scope.dtCust[scope.selectedRow].tvto);

                scope.customer.dob = SNLDateSet(scope.dtCust[scope.selectedRow].dob);
                scope.customer.age = scope.dtCust[scope.selectedRow].age;

                scope.workbook.licid = scope.dtCust[scope.selectedRow].licid;
            }
        }
        scope.foo.Cus = false;
    }

    $scope.NewVehicle = function() {
        scope.vehicle.vehno = '';
        scope.workbook.vehid = 0;
        scope.vehicle.clasid = 0;
        scope.vehicle.regfrm = '';
        scope.vehicle.regto = '';
        scope.vehicle.taxfrm = '';
        scope.vehicle.taxto = '';
        scope.vehicle.cffrm = '';
        scope.vehicle.cfto = '';
        scope.vehicle.insfrm = '';
        scope.vehicle.insto = '';
        scope.vehicle.prmtfrm = '';
        scope.vehicle.prmto = '';

    }

    function SNLDateSet(dateStr) {

        if (dateStr !== null) {
            var parts = dateStr.split("-");
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
    }

    function SNLDateSetIND(dateStr) {

        var parts = dateStr.split("-");
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }


    $scope.SetDataVehicle = function() {

        scope.vehicle.vehno = scope.dtVeh[scope.selectedRow].vehno;
        scope.workbook.vehid = scope.dtVeh[scope.selectedRow].ids;
        scope.vehicle.clasid = scope.dtVeh[scope.selectedRow].classid;

        scope.vehicle.regfrm = SNLDateSet(scope.dtVeh[scope.selectedRow].regfrm);
        scope.vehicle.regto = SNLDateSet(scope.dtVeh[scope.selectedRow].regto);
        scope.vehicle.taxfrm = SNLDateSet(scope.dtVeh[scope.selectedRow].taxfrm);
        scope.vehicle.taxto = SNLDateSet(scope.dtVeh[scope.selectedRow].taxto);
        scope.vehicle.cffrm = SNLDateSet(scope.dtVeh[scope.selectedRow].cffrm);
        scope.vehicle.cfto = SNLDateSet(scope.dtVeh[scope.selectedRow].cfto);
        scope.vehicle.insfrm = SNLDateSet(scope.dtVeh[scope.selectedRow].insfrm);
        scope.vehicle.insto = SNLDateSet(scope.dtVeh[scope.selectedRow].insto);
        scope.vehicle.prmtfrm = SNLDateSet(scope.dtVeh[scope.selectedRow].prmtfrm);
        scope.vehicle.prmto = SNLDateSet(scope.dtVeh[scope.selectedRow].prmto);


        scope.workbook.polyno = scope.dtVeh[scope.selectedRow].polyno;
        scope.workbook.polytyp = scope.dtVeh[scope.selectedRow].polytyp;
        scope.workbook.insname = scope.dtVeh[scope.selectedRow].insname;
        scope.workbook.insadd = scope.dtVeh[scope.selectedRow].insadd;
        scope.workbook.idv = scope.dtVeh[scope.selectedRow].idv;
        scope.workbook.ncb = scope.dtVeh[scope.selectedRow].ncb;
        scope.workbook.premamnt = scope.dtVeh[scope.selectedRow].premamnt;
        scope.foo.Veh = false;
    }

    $scope.SetData = function(ids) {
        console.log('test');
        console.log(ids);
        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadWorkBook',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID'),
                ai_liid: ids
            }),
            dataType: 'json',

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {
            console.log(data);
            //ids,convert(varchar, wdate, 103) as wdate,wtype,accid,authid,cusid,vehid,licid,statusid,inwardno,total,adv,bal,remark,cusname,mob,accname,status_name,vehno,licno,tvfrm,tvto
            $scope.workbook.id = data[0].ids;
            $scope.workbook.date = SNLDateSet(data[0].wdate);
            $scope.workbook.wtype = data[0].wtype;
            scope.LoadServiceHeads();
            scope.$apply();

            $scope.workbook.accid = data[0].accid;
            $scope.workbook.authoid = data[0].authid;
            $scope.workbook.agentid = data[0].agentid;
            $scope.workbook.cusid = data[0].cusid;
            $scope.workbook.vehid = data[0].vehid;
            $scope.workbook.licid = data[0].licid;

            $scope.customer.cusname = data[0].cusname;
            $scope.customer.mob = data[0].mob;

            $scope.workbook.wstaid = data[0].statusid;
            $scope.workbook.invwardno = data[0].inwardno;
            $scope.workbook.tot = data[0].total;
            $scope.workbook.adv = data[0].adv;
            $scope.workbook.bal = data[0].bal;

            $scope.workbook.polyno = data[0].polyno;
            $scope.workbook.polytyp = data[0].polytyp;
            $scope.workbook.insname = data[0].insname;
            $scope.workbook.insadd = data[0].insadd;
            $scope.workbook.idv = data[0].idv;
            $scope.workbook.ncb = data[0].ncb;
            $scope.workbook.premamnt = data[0].premamnt;
            $scope.workbook.remarks = data[0].remark;

            $scope.vehicle.vehno = data[0].vehno;
            $scope.vehicle.clasid = data[0].clasid;

            if (data[0].wtype === 'Vehicle') {
                scope.vehicle.regfrm = SNLDateSet(data[0].regfrm);
                scope.vehicle.regto = SNLDateSet(data[0].regto);
                scope.vehicle.taxfrm = SNLDateSet(data[0].taxfrm);
                scope.vehicle.taxto = SNLDateSet(data[0].taxto);
                scope.vehicle.cffrm = SNLDateSet(data[0].cffrm);
                scope.vehicle.cfto = SNLDateSet(data[0].cfto);
                scope.vehicle.insfrm = SNLDateSet(data[0].insfrm);
                scope.vehicle.insto = SNLDateSet(data[0].insto);
                scope.vehicle.prmtfrm = SNLDateSet(data[0].prmtfrm);
                scope.vehicle.prmto = SNLDateSet(data[0].prmto);


            } else if (data[0].wtype === 'Licence') {
                $scope.customer.dob = SNLDateSet(data[0].dob);
                $scope.customer.age = data[0].age;
                $scope.licence.tvfrm = SNLDateSet(data[0].tvfrm);
                $scope.licence.tvto = SNLDateSet(data[0].tvto);
                $scope.licence.ntvfrom = SNLDateSet(data[0].ntvfrm);
                $scope.licence.ntvto = SNLDateSet(data[0].ntvto);
                $scope.licence.licno = data[0].licno;
            }

            li_id = data[0].ids;

            flag = 'U';
        }).error(function(data, status, headers, config) {
            console.log(data);
        });

    }


    $scope.chage = function() {
        var myDate = new Date($scope.customer.dob);
        var ageDifMs = Date.now() - myDate.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch        
        $scope.customer.age = Math.abs(ageDate.getUTCFullYear() - 1970);

    }


    $scope.chntv = function() {

        if ($.trim($('#txtage').val()) <= 30) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 240);
            return;
        } else if ($.trim($('#txtage').val()) == 31) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 288);
            return;

        } else if ($.trim($('#txtage').val()) == 32) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 216);
            return;

        } else if ($.trim($('#txtage').val()) == 33) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 204);
            return;

        } else if ($.trim($('#txtage').val()) == 34) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 192);
            return;

        } else if ($.trim($('#txtage').val()) == 35) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 180);
            return;

        } else if ($.trim($('#txtage').val()) == 36) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 168);
            return;

        } else if ($.trim($('#txtage').val()) == 37) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 156);
            return;

        } else if ($.trim($('#txtage').val()) == 38) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 144);
            return;

        } else if ($.trim($('#txtage').val()) == 39) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 132);
            return;

        } else if ($.trim($('#txtage').val()) == 40) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 120);
            return;

        } else if ($.trim($('#txtage').val()) == 41) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 108);
            return;

        } else if ($.trim($('#txtage').val()) == 42) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 96);
            return;

        } else if ($.trim($('#txtage').val()) == 43) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 89);
            return;

        } else if ($.trim($('#txtage').val()) == 44) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 72);
            return;

        } else if ($.trim($('#txtage').val()) == 45) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 60);
            return;

        } else if ($.trim($('#txtage').val()) >= 46) {
            $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 60);
            return;

        }
        //        $scope.licence.ntvto = addMonths($scope.licence.ntvfrom, 240);

    }

    $scope.chtv = function() {
        $scope.licence.tvto = addMonths($scope.licence.tvfrm, 240);

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

    $scope.chnPer = function() {
        $scope.vehicle.prmto = addMonths($scope.vehicle.prmtfrm, 60);
    }

    $scope.chnCf = function() {
        $scope.vehicle.cfto = addMonths($scope.vehicle.cffrm, 12);
    }

    function addMonths(date, months) {
        var myDate = new Date(date);
        myDate.setMonth(myDate.getMonth() + months);
        myDate.setDate(myDate.getDate() - 1);
        return myDate;
    }

});