app.controller('ctrlprofile', function($scope, $http, $window, $timeout) {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    $scope.Register = {
        companyname: '',
        ownername: '',
        Licence: '',
        branch: '',
        phone: '',
        mob: '',
        email: '',
        website: '',
        place: '',
        address: '',
        pin: 0,
        state: ''
    };
    $scope.dtData = [];
    var flag = "I";
    var li_id = 0;

    scope = $scope;

    $scope.msg = '';

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

    function MobileValidation() {
        var y = $('#txtmob').val();
        var valid = true;
        if (isNaN(y) || y.indexOf(" ") != -1) {
            valid = false;
        }
        if (y.length > 11 || y.length < 10) {
            valid = false;
        }
        return valid;
    };

    $scope.btnCreate = function() {

        $("#ajxloader").show();
        if ($.trim($('#compname').val()).length == 0) {
            scope.msg = "Enter Company Name.";
            $("#compname").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#ownername').val()).length == 0) {
            scope.msg = "Enter Owner Name.";
            $("#ownername").focus();
            scope.MsgBox();
            return;
        }

        //        else if ($.trim($('#txtlince').val()).length == 0) {
        //            scope.msg = "Enter Licence Number.";
        //            $("#txtlince").focus();
        //            scope.MsgBox();
        //            return;
        //        }
        else if ($.trim($('#branchname').val()).length == 0) {
            scope.msg = "Enter Branch Name.";
            $("#branchname").focus();
            scope.MsgBox();
            return;
        } else if (!MobileValidation()) {
            scope.msg = "Enter Mobile Number.";
            $("#txtmob").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtemail').val()).length == 0 || !EMAIL_REGEXP.test($scope.Register.email)) {
            scope.msg = "Enter a Valid Email"
            $("#txtemail").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtplace').val()).length == 0) {
            scope.msg = "Enter Your Place.";
            $("#txtplace").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtAddress').val()).length == 0) {
            scope.msg = "Enter Address.";
            $("#txtAddress").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtstate').val()).length == 0) {
            scope.msg = "Enter State.";
            $("#txtstate").focus();
            scope.MsgBox();
            return;
        }
        if ($scope.Register.pin == '') {
            $scope.Register.pin = 0;
        }

        $http(

            {
                method: 'post',
                url: 'GService.asmx/fn_InsertCompany',
                data: $.param({
                    ButtonFlag: 'U',
                    li_id: li_id,
                    ls_companyname: $scope.Register.companyname,
                    ls_Branchname: $scope.Register.branch,
                    ls_holder: $scope.Register.ownername,
                    ls_address: $scope.Register.address,
                    ls_place: $scope.Register.place,
                    ls_state: $scope.Register.state,
                    ls_pin: $scope.Register.pin,
                    ls_phnos: $scope.Register.phone,
                    ls_mob: $scope.Register.mob,
                    ls_Email: $scope.Register.email,
                    ls_licno: $scope.Register.Licence,
                    ls_website: $scope.Register.website,
                    ls_username: '',
                    strPwd: ''
                }),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, status, headers, config) {

            scope.msg = data
            scope.MsgBox();
            return;
            //			    $('#divMessage').html(data);
            //			    $('#divMessage').show();
            //			    $("#ajxloader").hide();

        }).error(function(data, status, headers, config) {
            console.log(data);
            $('#divMessage').html(data);
            $('#divMessage').show();
            $("#ajxloader").hide();

        });
    }





    $scope.LoadCompDetails = function() {



        $http({
            method: 'post',
            url: 'GService.asmx/fn_LoadCompanyDetails',
            data: $.param({
                ls_euid: $window.sessionStorage.getItem('EUID')
            }),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config) {

            $scope.Register.companyname = data[0].companyname;
            $scope.Register.ownername = data[0].holder;
            $scope.Register.Licence = data[0].licno;
            $scope.Register.branch = data[0].branchname;
            $scope.Register.phone = data[0].phnos;
            $scope.Register.mob = data[0].mob;
            $scope.Register.email = data[0].Email;
            $scope.Register.website = data[0].WebSite;
            $scope.Register.place = data[0].address1;
            $scope.Register.address = data[0].address;
            $scope.Register.pin = data[0].Pin;
            $scope.Register.state = data[0].State;
            li_id = data[0].companyid;
            console.log($scope.Register.state);
        }).error(function(data, status, headers, config) {
            console.log(data);
        });

    };


});