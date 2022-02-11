 var elemFocus = false;
 app.controller('CtrlAccountHead', ['$scope', '$http', '$window', 'Upload', '$timeout', '$filter', function($scope, $http, $window, Upload, $timeout, $filter) {
     var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

     $scope.accounts = {
         id: 0,
         accname: '',
         acctype: '',
         LicHead: 'false',
         RTOHead: 'false'
     };
     var flag = "I";
     var li_id = 0;
     $scope.sortType = 'SlNo'; // set the default sort type
     $scope.sortReverse = false; // set the default sort order

     scope = $scope

     $scope.btnDelete = function() {
         scope.DeleteConfirm()
     }


     $scope.LoadDef = function() {
         $scope.licence.regyear = new Date().getFullYear();
         $scope.licence.entdate = new Date();
     }

     $scope.LoadData = function() {
         $('#loader').show();
         $scope.dtAccHead = [];
         $http({
             method: 'post',
             url: 'GService.asmx/fn_LoadAccountHeads',
             data: $.param({
                 ls_euid: $window.sessionStorage.getItem('EUID'),
                 ai_liid: 0
             }),
             dataType: 'json',
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             }
         }).success(function(data, status, headers, config) {

             $scope.dtAccHead = data;
             $('#loader').hide();
         }).error(function(data, status, headers, config) {
             console.log(data);
             $('#loader').hide();
         });

     }

     $scope.btnClear = function() {
         flag = "I";
         li_id = 0;
         $scope.accounts.id = 0;
         $scope.accounts.accname = '';
         $scope.accounts.acctype = '';
         $scope.accounts.LicHead = 'false';
         $scope.accounts.RTOHead = 'false';
         $("#txtaccountname").focus();
     }

     scope.myFunct = function() {

         $scope.selectedRow = 0;

         //        $scope.$apply();
         elemFocus = true;
         //            alert('I am an alert');
     }




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
         scope.msg = '';
         if ($.trim($('#txtaccountname').val()).length == 0) {
             scope.msg = "Please Enter The Account Name.";
             $("#txtaccountname").focus();
             scope.MsgBox();
             return;
         } else if ($.trim($('#cmpaccounttype').val()).length == 0) {
             scope.msg = "Please Select Account Type.";
             $("#cmpaccounttype").focus();
             scope.MsgBox();
             return;
         } else {

             $.ajax({
                 url: 'GService.asmx/fn_InsertAccountHead',
                 type: 'POST',
                 data: {
                     flag: flag,
                     li_id: li_id,
                     ls_accname: scope.accounts.accname,
                     ls_acctype: scope.accounts.acctype,
                     ls_LicHead: ((scope.accounts.LicHead == true) ? 'Y' : 'N'),
                     ls_RTOHead: ((scope.accounts.RTOHead == true) ? 'Y' : 'N'),
                     ls_euid: $window.sessionStorage.getItem('EUID')
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


     $scope.SetData = function(ids) {

         $http({
             method: 'post',
             url: 'GService.asmx/fn_LoadAccountHeads',
             data: $.param({
                 ls_euid: $window.sessionStorage.getItem('EUID'),
                 ai_liid: ids
             }),
             dataType: 'json',
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             }
         }).success(function(data, status, headers, config) {

             $scope.accounts.id = data[0].cusid;
             $scope.accounts.accname = data[0].accname;
             $scope.accounts.acctype = data[0].acctype;
             $scope.accounts.LicHead = ((data[0].LicHead == 'Y') ? true : false);
             $scope.accounts.RTOHead = ((data[0].RTOHead == 'Y') ? true : false);

             li_id = data[0].ids;
             flag = 'U';
         }).error(function(data, status, headers, config) {
             console.log(data);
         });

     }


 }]);