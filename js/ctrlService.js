app.service('sharedProperties', function() {
    var ls_particulars = 'All';
    var objectValue = {
        data: 'test object value'
    };

    return {
        getParticulars: function() {
            return ls_particulars;
        },
        setParticulars: function(value) {
            ls_particulars = value;
        },
        getObject: function() {
            return objectValue;
        }
    }
});