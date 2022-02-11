var app = angular.module('App', []);

app.controller('CtrlSignin', function($scope, $http, $window) {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    scope = $scope;
    $scope.Register = {
        companyname: '',
        mob: '',
        email: '',
        place: '',
        user: '',
        pwd: ''
    };

    scope.chkRem = 'false';

    scope = $scope;

    $scope.msg = '';


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

    $scope.btnRegisterCompany = function() {

        console.log($scope.Register.email);
        if ($.trim($('#compname').val()).length == 0) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Please Enter Company Name.</strong> </div>');
            $('#divMessage1').show();
            $("#compname").focus();
            return;
        } else if (!MobileValidation()) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Please Enter Your Mobile Number.</strong> </div>');
            $('#divMessage1').show();
            $("#txtmob").focus();
            return;
        } else if ($.trim($('#txtemail').val()).length == 0 || !EMAIL_REGEXP.test($scope.Register.email)) {

            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Please Enter a Valid Email.</strong> </div>');
            $('#divMessage1').show();
            $("#txtemail").focus();
            return;
        } else if ($.trim($('#txtplace').val()).length == 0) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Please Enter Your Place.</strong> </div>');
            $('#divMessage1').show();
            $("#txtplace").focus();
            return;

        } else if ($.trim($('#txtuser').val()).length == 0) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Please Enter User Name.</strong> </div>');
            $('#divMessage1').show();
            $("#txtuser").focus();
            return;

        } else if ($.trim($('#txtpwd').val()).length == 0) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Please Enter Your Password.</strong> </div>');
            $('#divMessage1').show();
            $("#txtpwd").focus();
            return;

        } else if ($.trim($('#txtrepwd').val()).length == 0) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Please Re-Enter Your Password.</strong> </div>');
            $('#divMessage1').show();
            $("#txtrepwd").focus();
            return;

        } else if ($.trim($('#txtpwd').val()).length <= 3) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Password requires minimum 4 letters.</strong> </div>');
            $('#divMessage1').show();
            $("#txtpwd").focus();
            return;
        } else if ($.trim($('#txtrepwd').val()).length <= 3) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Re-Enter Password requires minimum 4 letters.</strong> </div>');
            $('#divMessage1').show();
            $("#txtrepwd").focus();
            return;
        } else if ($.trim($('#txtpwd').val()) != $.trim($('#txtrepwd').val())) {
            $('#divMessage1').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Re-Enter Password Not Match.</strong> </div>');
            $('#divMessage1').show();
            $("#txtrepwd").focus();
            return;
        }
        $("#ajxloader1").show();
        $http(

            {
                method: 'post',
                url: 'GService.asmx/fn_InsertCompany',
                data: $.param({
                    ButtonFlag: 'I',
                    li_id: 0,
                    ls_companyname: $scope.Register.companyname,
                    ls_Branchname: '',
                    ls_holder: '',
                    ls_address: '',
                    ls_place: $scope.Register.place,
                    ls_state: '',
                    ls_pin: 0,
                    ls_phnos: '',
                    ls_mob: $scope.Register.mob,
                    ls_Email: $scope.Register.email,
                    ls_licno: '',
                    ls_website: '',
                    ls_username: $scope.Register.user,
                    strPwd: $scope.Register.pwd,
                }),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, status, headers, config) {
            //			    console.log(data);
            //                scope.msg = "Enter a Valid Email"
            //                $("#txtemail").focus();
            //                scope.MsgBox();
            //                return;
            $('#divMessage1').html(data);
            $('#divMessage1').show();
            $("#ajxloader1").hide();

        }).error(function(data, status, headers, config) {
            console.log(data);
            $('#divMessage1').html(data);
            $('#divMessage1').show();
            $("#ajxloader1").hide();

        });
    }


    scope.btnSignIn = function() {

        if ($.trim($('#txtusername').val()).length == 0) {

            $('#divMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Please Enter Your UserName.</strong> </div>');
            $('#divMessage').show();
            $("#txtusername").focus();
            return;
        } else if ($.trim($('#txtPassword').val()).length <= 4) {
            $('#divMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button><strong>Login failed, Password can not be blank and is too short (minimum is 5 characters)</strong> </div>');
            $('#divMessage').show();
            $("#txtPassword").focus();
            return;
        } else {

            $("#ajxloader").show();
            $('#divMessage').hide();
            $http({
                method: 'POST',
                url: 'GService.asmx/fn_CheckLogin',
                data: $.param({
                    strUserName: scope.username,
                    strPwd: scope.password
                }),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, status, headers, config) {
                console.log(data);
                if (data[0].Error === 'True') {
                    $('#divMessage').html(data[0].ErrorMsg);
                    $('#divMessage').show();
                    $("#ajxloader").hide();
                } else {
                    var chk = scope.chkRem;
                    if (chk !== 'false') {

                        localStorage.setItem('EUID', data[0].euid);
                    }
                    sessionStorage.EUID = data[0].euid;
                    sessionStorage.companyid = data[0].eid;
                    sessionStorage.email = data[0].Email;
                    sessionStorage.companyname = data[0].companyname + " - " + data[0].branchname;
                    sessionStorage.status = data[0].Status;
                    sessionStorage.ComStatus = data[0].ComStatus;
                    sessionStorage.username = data[0].UserName;
                    sessionStorage.defAuthoId = data[0].authoid;
                    setTimeout(function() {
                        window.location = "Home.html";
                    }, 2000);
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
                $('#divMessage').html('<p class="bg-error text-center" >oops something wend wrong. </p>');
                $('#divMessage').show();
                $("#ajxloader").hide();
            });
        }
    }

    $scope.btnClear = function() {
        flag = "I"
        li_id = 0
        $scope.username = ""
        $scope.password = ""
        $("#ajxloader").hide();
        $('#divMessage').hide();
        $("#txtdioname").focus();
        return;
    }



});