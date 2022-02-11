 var elemFocus = false;
 app.controller('ctrlLicence', ['$scope', '$http', '$window', 'Upload', '$timeout', '$filter', function($scope, $http, $window, Upload, $timeout, $filter) {
     var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
     $scope.licence = {
         id: 0,
         cusid: 0,
         regyear: 0,
         entno: '',
         entdate: '',
         lendate: '',
         classofveh: '',
         remark: '',
         tot: 0,
         adv: 0,
         bal: 0,
         imgfile: '',
         lenlicno: '',
         isudate: '',
         lenlicfrom: '',
         lenlicto: '',
         dltestdate: '',
         attemptno: '',
         licno: '',
         ntvfrom: '',
         ntvto: '',
         tvfrom: '',
         tvto: '',
         authid: 0,
         badge: '',
         porf: ''
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
         email: '',
         phone: ''
     };
     var flag = "I";
     var li_id = 0;


     $scope.foo = {
         Veh: false,
         Cus: false
     };

     $scope.selectedRow = 0;
     $scope.msg = '';
     $scope.ImgFound = 'False';
     scope = $scope;

     $scope.sortType = 'SlNo'; // set the default sort type
     $scope.sortReverse = false; // set the default sort order


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

     $scope.uploadPic = function(ids, msg) {

         var file = scope.picFile;
         console.log(file);
         console.log(ids);
         file.upload = Upload.upload({
             url: 'UploadHandler.ashx',
             data: {
                 file: file,
                 filename: ids + '.jpg'
             }
         });

         file.upload.then(function(response) {
             $timeout(function() {

                 scope.btnClear();
                 scope.msg = msg;
                 scope.$apply();
                 scope.MsgBox();
             });
         }, function(response) {
             if (response.status > 0)
                 $scope.errorMsg = response.status + ': ' + response.data;
         }, function(evt) {
             // Math.min is to fix IE which reports 200% sometimes
             file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
         });
     }

     scope.ClickLedger = function() {
         $window.sessionStorage.setItem('CusId', $scope.licence.cusid);
         window.location = "home.html#/Ledger";
     }

     $scope.btnDelete = function() {
         scope.DeleteConfirm()
     }

     $scope.LoadDef = function() {
         $scope.licence.regyear = new Date().getFullYear();
         $scope.licence.entdate = new Date();
         var mydata = parseInt($window.sessionStorage.getItem('defAuthoId'));
         $scope.licence.authid = mydata;

         var mydata1 = $window.sessionStorage.getItem('LicId');
         if (mydata1 !== null) {
             $scope.SetData(mydata1);
         }
     }

     $scope.btnClear = function() {

         $scope.licence.cusid = 0;
         $('#cmpclsofveh').val("");
         $("#cmpclsofveh").multiselect("refresh");
         $scope.ImgFileName = '';

         $scope.licence.regyear = new Date().getFullYear();
         $scope.licence.entno = '';
         $scope.licence.entdate = new Date();
         $scope.licence.lendate = '';
         $scope.picFile = '';
         $scope.picFile.progress = 0;
         $scope.licence.remark = '';
         $scope.licence.tot = 0;
         $scope.licence.adv = 0;
         $scope.licence.bal = 0;
         $scope.licence.imgfile = '';
         $scope.licence.lenlicno = '';
         $scope.licence.isudate = '';
         $scope.licence.lenlicfrom = '';
         $scope.licence.lenlicto = '';
         $scope.licence.dltestdate = '';
         $scope.licence.attemptno = '';
         $scope.licence.licno = '';
         $scope.licence.ntvfrom = '';
         $scope.licence.ntvto = '';
         $scope.licence.tvfrom = '';
         $scope.licence.tvto = '';
         $scope.customer.cusname = '';
         $scope.customer.swof = '';
         $scope.customer.cusadd = '';
         $scope.customer.pin = 0;
         $scope.customer.mob = '';
         $scope.customer.dob = '';
         $scope.customer.age = 0;
         $scope.customer.blood = '';
         $scope.customer.email = '';
         $scope.customer.phone = '';
         $scope.licence.badge = '';
         $scope.licence.porf = '';
         $scope.licence.authid = 0;

         scope.GetEntroNo();
         var mydata = parseInt($window.sessionStorage.getItem('defAuthoId'));
         $scope.licence.authid = mydata;
         $scope.ImgFound = 'False';
         $("#user-profile-1").hide();
         $("#uploadid").show();
         scope.ClearUploadObject();
         $("#txtcusname").focus();

         flag = "I"
         li_id = 0
         return;
     }

     scope.myFunct = function() {

         $scope.selectedRow = 0;

         //        $scope.$apply();
         elemFocus = true;
         //            alert('I am an alert');
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


         scope.msg = '';

         if ($.trim($('#txtcusname').val()).length == 0) {
             scope.msg = "Please Enter The Student Name.";
             scope.MsgBox();
             return;
         } else if ($.trim($('#cmpclsofveh').val()).length == 0) {
             scope.msg = "Please Select Class Of Vehicle.";
             scope.MsgBox();
             return;
         } else {
             if (scope.picFile !== undefined && scope.picFile !== '') {
                 $scope.ImgFound = 'True';
             }
             $.ajax({
                 url: 'GService.asmx/fn_InsertLicence',
                 type: 'POST',
                 data: {
                     flag: flag,
                     liid: li_id,
                     cusid: scope.licence.cusid,
                     ls_euid: $window.sessionStorage.getItem('EUID'),
                     regyear: scope.licence.regyear,
                     entno: scope.licence.entno,
                     entdate: $filter('date')($.trim($('#dtpentdate').val(), 'dd/MM/yyyy')),
                     lendate: $filter('date')($.trim($('#dtplendate').val(), 'dd/MM/yyyy')),
                     classofveh: $.trim($('#cmpclsofveh').val()),
                     remark: scope.licence.remark,
                     tot: scope.licence.tot,
                     adv: scope.licence.adv,
                     bal: scope.licence.bal,
                     imgfile: $scope.ImgFound,
                     lenlicno: scope.licence.lenlicno,
                     isudate: $filter('date')($.trim($('#dtpissuedate').val(), 'dd/MM/yyyy')),
                     lenlicfrom: $filter('date')($.trim($('#dtpllfrom').val(), 'dd/MM/yyyy')),
                     lenlicto: $filter('date')($.trim($('#dtpllto').val(), 'dd/MM/yyyy')),
                     dltestdate: $filter('date')($.trim($('#txtdltestdate').val(), 'dd/MM/yyyy')),
                     attemptno: scope.licence.attemptno,
                     licno: scope.licence.licno,
                     ntvfrom: $filter('date')($.trim($('#dtpntvfrom').val(), 'dd/MM/yyyy')),
                     ntvto: $filter('date')($.trim($('#dtpntvto').val(), 'dd/MM/yyyy')),
                     tvfrom: $filter('date')($.trim($('#dtptvfrom').val(), 'dd/MM/yyyy')),
                     tvto: $filter('date')($.trim($('#dtptvto').val(), 'dd/MM/yyyy')),
                     cusname: scope.customer.cusname,
                     swof: scope.customer.swof,
                     cusadd: scope.customer.cusadd,
                     pin: scope.customer.pin,
                     mob: scope.customer.mob,
                     dob: $filter('date')($.trim($('#dtpdob').val(), 'dd/MM/yyyy')),
                     age: scope.customer.age,
                     blood: scope.customer.blood,
                     email: scope.customer.email,
                     ls_lictype: 'L',
                     ls_phnos: scope.customer.phone,
                     ls_pftype: scope.licence.porf,
                     ls_badno: scope.licence.badge,
                     ls_authoid: scope.licence.authid
                 },
                 dataType: 'json',
                 success: function(data, textStatus) {
                     console.log(data);
                     if (data[0].Error === 'False') {
                         if (scope.picFile !== undefined && scope.picFile !== '') {
                             scope.uploadPic(data[0].ids, data[0].message);
                         } else {
                             scope.btnClear();
                             scope.msg = data[0].message;
                             scope.$apply();
                             scope.MsgBox();
                         }
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
                     //window.location = "error.html?message="+textStatus+"&statuscode=Status Code:"+jqXHR.status+"&statustext=Status Text:"+errorThrown;
                 }
             });
         }
     }


     $scope.ClearUploadObject = function() {

         var whitelist_ext, whitelist_mime;
         var btn_choose
         var no_icon
         if (this.checked) {
             btn_choose = "Drop images here or click to choose";
             no_icon = "ace-icon fa fa-picture-o";

             whitelist_ext = ["jpeg", "jpg", "png", "gif", "bmp"];
             whitelist_mime = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp"];
         } else {
             btn_choose = "Drop files here or click to choose";
             no_icon = "ace-icon fa fa-cloud-upload";

             whitelist_ext = null; //all extensions are acceptable
             whitelist_mime = null; //all mimes are acceptable
         }
         var file_input = $('#id-input-file-3');
         file_input
             .ace_file_input('update_settings', {
                 'btn_choose': btn_choose,
                 'no_icon': no_icon,
                 'allowExt': whitelist_ext,
                 'allowMime': whitelist_mime
             })
         file_input.ace_file_input('reset_input');

         file_input
             .off('file.error.ace')
             .on('file.error.ace', function(e, info) {

             });

     }


     $scope.autocompCustomer = function() {
         $scope.dtCust = [];
         $scope.foo.Cus = true
         var min_length = 0; // min caracters to display the autocomplete 
         var keyword = $scope.customer.cusname;
         if (keyword.length >= min_length) {
             $('#contno').addClass('ne-pre-con');
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

     $scope.GetEntroNo = function() {
         $.ajax({
             url: "GService.asmx/fn_GetEntrolNo",
             type: "GET",
             data: {
                 ls_euid: $window.sessionStorage.getItem('EUID')
             },
             dataType: "json",
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             },
             success: function(data, textStatus, jqXHR) {

                 $scope.licence.entno = data;
                 scope.$apply();
             },
             error: function(xhr, ajaxOptions, thrownError) {
                 scope.msg = data;
                 scope.$apply();
                 scope.MsgBox();
             }
         });
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
         $scope.licence.lenlicto = addMonths($scope.licence.lenlicfrom, 6);
     }

     $scope.chntv = function() {
         console.log($.trim($('#txtage').val()));
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
         $scope.licence.tvto = addMonths($scope.licence.tvfrom, 36);

     }

     $scope.Fun_ChangeBal = function() {
         $scope.licence.bal = $scope.licence.tot - $scope.licence.adv;
     }


     $scope.fn_ClearImage = function() {
         $http({
             method: 'post',
             url: 'GService.asmx/fn_ClearImage',
             data: $.param({
                 ls_imagepath: $scope.ImgFileName2,
                 li_cusid: $scope.licence.cusid
             }),
             dataType: 'json',
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             }
         }).success(function(data, status, headers, config) {
             $scope.ImgFileName2 = '';
             $("#user-profile-1").hide();
             $("#uploadid").show();
             $scope.ImgFound = 'False';
             console.log(data);
         }).error(function(data, status, headers, config) {
             console.log(data);
         });


     }





     $scope.SetData = function(ids) {
         $http({
             method: 'post',
             url: 'GService.asmx/fn_LoadLicence',
             data: $.param({
                 ls_euid: $window.sessionStorage.getItem('EUID'),
                 ai_liid: ids,
                 ai_lictype: 'L'
             }),
             dataType: 'json',
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             }
         }).success(function(data, status, headers, config) {
             var data2 = data[0].classofveh;
             var dataarray = data2.split(",");
             $('#cmpclsofveh').val(dataarray);
             $("#cmpclsofveh").multiselect("refresh");


             $scope.licence.cusid = data[0].cusid;

             $scope.licence.regyear = data[0].regyear;
             $scope.licence.entno = data[0].entno;
             $scope.licence.entdate = SNLDateSet(data[0].entdate);
             $scope.licence.lendate = SNLDateSet(data[0].lendate);

             $scope.licence.remark = data[0].remark;
             $scope.licence.tot = data[0].tot;
             $scope.licence.adv = data[0].adv;
             $scope.licence.bal = data[0].bal;
             $scope.licence.imgfile = data[0].imgfile;
             $scope.licence.lenlicno = data[0].lenlicno;
             $scope.licence.isudate = SNLDateSet(data[0].isudate);
             $scope.licence.lenlicfrom = SNLDateSet(data[0].lenlicfrom);
             $scope.licence.lenlicto = SNLDateSet(data[0].lenlicto);
             $scope.licence.dltestdate = SNLDateSet(data[0].dltestdate);
             $scope.licence.attemptno = data[0].attemptno;
             $scope.licence.licno = data[0].licno;
             $scope.licence.ntvfrom = SNLDateSet(data[0].ntvfrom);
             $scope.licence.ntvto = SNLDateSet(data[0].ntvto);
             $scope.licence.tvfrom = SNLDateSet(data[0].tvfrom);
             $scope.licence.tvto = SNLDateSet(data[0].tvto);
             $scope.customer.cusname = data[0].cusname;
             $scope.customer.swof = data[0].swof;
             $scope.customer.cusadd = data[0].cusadd;
             $scope.customer.pin = data[0].pin;
             $scope.customer.mob = data[0].mob;
             $scope.customer.dob = SNLDateSet(data[0].dob);
             $scope.customer.age = data[0].age;
             $scope.customer.blood = data[0].blood;
             $scope.customer.email = data[0].email;
             $scope.customer.phone = data[0].phnos;

             $scope.licence.porf = data[0].porf;
             $scope.licence.badge = data[0].badno;
             $scope.licence.authid = data[0].authoid;

             $scope.ImgFound = data[0].ImageFound
             var num = Math.random();
             $scope.ImgFileName = 'uploads/' + data[0].cusid + '.jpg?v=' + num;
             $scope.ImgFileName2 = 'uploads/' + data[0].cusid + '.jpg';
             if ($scope.ImgFound === 'False') {
                 $("#user-profile-1").hide();
                 $("#uploadid").show();
             } else {
                 $("#user-profile-1").show();
                 $("#uploadid").hide();
             }


             li_id = data[0].licid;

             flag = 'U';
         }).error(function(data, status, headers, config) {
             console.log(data);
         });

     }


     function SNLDateSet(dateStr) {

         var parts = dateStr.split("-");
         return new Date(parts[2], parts[1] - 1, parts[0]);
     }

     $scope.SetDataCustomer = function() {
         scope.customer.cusname = scope.dtCust[scope.selectedRow].Name;
         scope.customer.swof = scope.dtCust[scope.selectedRow].swof;
         scope.customer.cusadd = scope.dtCust[scope.selectedRow].Address;
         scope.customer.pin = scope.dtCust[scope.selectedRow].pin;
         scope.customer.mob = scope.dtCust[scope.selectedRow].Mob;
         scope.customer.phone = scope.dtCust[scope.selectedRow].phnos;
         scope.customer.blood = scope.dtCust[scope.selectedRow].blood;

         scope.customer.dob = new Date(scope.dtCust[scope.selectedRow].dob);
         scope.customer.age = scope.dtCust[scope.selectedRow].age;
         scope.customer.id = scope.dtCust[scope.selectedRow].ids;
         scope.licence.cusid = scope.dtCust[scope.selectedRow].ids;
         $scope.ImgFound = scope.dtCust[scope.selectedRow].imgPath;
         var num = Math.random();
         $scope.ImgFileName = 'uploads/' + scope.customer.id + '.jpg?v=' + num;
         $scope.ImgFileName2 = 'uploads/' + scope.customer.id + '.jpg';
         if ($scope.ImgFound === 'False') {
             $("#user-profile-1").hide();
             $("#uploadid").show();
         } else {
             $("#user-profile-1").show();
             $("#uploadid").hide();
         }
         scope.foo.Cus = false;
     }


     $scope.LoadData = function() {
         $('#loader').show();
         $scope.dtLen = [];
         $http({
             method: 'post',
             url: 'GService.asmx/fn_LoadLicence',
             data: $.param({
                 ls_euid: $window.sessionStorage.getItem('EUID'),
                 ai_liid: 0,
                 ai_lictype: 'L'
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

 }]);