app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.controller('CtrChangePassword', function($scope, $http, $window) {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    scope = $scope;
    $scope.pwd = {
        oldpwd: '',
        newpwd: '',
        repwd: ''
    };
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

    scope.btnSubmit = function() {

        if ($.trim($('#txtOld').val()).length == 0) {
            scope.msg = "Enter Current Pssword.";
            $("#txtOld").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtNew').val()).length == 0) {
            scope.msg = "Enter New Pssword.";
            $("#txtNew").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtConfirm').val()).length == 0) {
            scope.msg = "Enter Confirm Pssword.";
            $("#txtConfirm").focus();
            scope.MsgBox();
            return;
        } else if ($.trim($('#txtOld').val()).length <= 3) {
            scope.msg = "Password requires minimum 4 letters.";
            $("#txtOld").focus();
            scope.MsgBox();
            return;

        } else if ($.trim($('#txtNew').val()).length <= 3) {
            scope.msg = "New Password requires minimum 4 letters.";
            $("#txtNew").focus();
            scope.MsgBox();
            return;

        } else if ($.trim($('#txtConfirm').val()).length <= 3) {
            scope.msg = "ReEnter Password requires minimum 4 letters.";
            $("#txtConfirm").focus();
            scope.MsgBox();
            return;

        } else if ($.trim($('#txtNew').val()) != $.trim($('#txtConfirm').val())) {
            scope.msg = "Re-Enter Password Not Match.";
            $("#txtNew").focus();
            scope.MsgBox();
            return;

        } else if ($.trim($('#txtNew').val()) == $.trim($('#txtOld').val())) {
            scope.msg = "New Password And Old Password Are Same.";
            $("#txtNew").focus();
            scope.MsgBox();
            return;

        } else {
            console.log($scope.pwd.oldpwd);
            $http({
                method: 'POST',
                url: 'GService.asmx/fn_ChangePass',
                data: $.param({
                    ai_UserId: $window.sessionStorage.getItem('EUID'),
                    as_curpwd: $scope.pwd.oldpwd,
                    as_newpwd: $scope.pwd.newpwd
                }),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, status, headers, config) {
                scope.msg = data[0].ErrorMsg;
                scope.pwd.oldpwd = '';
                scope.pwd.newpwd = '';
                scope.pwd.repwd = '';
                $("#txtNew").focus();
                scope.MsgBox();
                return;
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