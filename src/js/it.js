(function(root){
    "use strict";

    /**
     * Initialization function.
     * @param val: value to be validated
     * @returns new instance of _checkedObj_ which contains all the validation functions and default attributes
     */
    var it = function(val){
        return new _checkedObj_(val);
    };

    /**
     * Constructor function
     * @param val
     * @private
     */
    var _checkedObj_ = function(val){
        this.originalValue = val;
        this.value = val;
    };

    _checkedObj_.prototype = {
        originalValue: "",
        formatter: "",
        value: "",
        valid: true,
        errorMessages: [],
        forcedValidate: false,
        pipe: function(callback){
            if(this.valid === true) {
                callback.call(this);
            }
            return this;
        },
        is: function(filterString){
            if(filterString !== undefined && typeof filterString === "string" && filterString.length !== 0){
                var filterList = filterString.split(".");
                if(filterList.length !== 0){
                    for(var c=0; c<filterList.length; c++){
                        var validator = filterList[c];
                        if(validator.indexOf("|") === -1){
                            var params = [];
                            if(validator.indexOf(" ") !== -1) {
                                params = getParamsForValidator.call(this, validator);
                                var name = validator.split(" ")[0];
                                this[name].apply(this, params);
                            }else {
                                this[validator]();
                            }
                        }else {
                            var forcedValidations = validator.split("|");
                            for(var i=0; i<forcedValidations.length; i++){
                                var forcedValidation = forcedValidations[i];
                                if(forcedValidation !== "" ) {
                                    forceValidate.call(this, forcedValidation);
                                }
                            }
                        }
                    }
                }
            }else{
                throw new Error("Validation string cannot be empty");
            }
            return this;
        }
    };
    var getParamsForValidator = function(name){
        var params = [];
        if(name !== undefined){
            var paramsList = name.split(" ");
            if(paramsList.length > 1 && paramsList[1] !== ""){
                params=paramsList[1].split(",");
            }
        }
        return params;
    };
    var forceValidate = function(validator){
        this.forcedValidate = true;
        var params = [];
        var name = validator.split(" ")[0];
        var callback = this[name];
        params = getParamsForValidator.call(this, validator);
        callback.apply(this, params);
        this.forcedValidate = false;
    };
    it.to = function(name){
        var config = null;
        var callback = null;
        var nameCheck = checkFilterName(name);
        var checkedObj = checkFunctionParams(arguments);
        config = checkedObj.config;
        callback = checkedObj.callback;
        _checkedObj_.prototype[name] = function() {
            callback.apply(this, arguments);
            return this;
        }
    };

    it.is = function(name){
        var config = null;
        var callback = null;
        checkFilterName(name);
        var checkedObj = checkFunctionParams(arguments);
        config = checkedObj.config;
        callback = checkedObj.callback;
        _checkedObj_.prototype[name] = function() {
            if(this.valid === true || this.forcedValidate === true) {
                callback.apply(this, arguments);
            }
            return this;
        }
    };
    var checkFunctionParams = function(args){
        var config = null;
        var callback = null;
        var name = args[0];
        if(args.length >= 2){
            if(typeof args[1] === "object" && args[1] !== null){
                config = args[1];
                if(args.length > 2){
                    if(typeof args[2] === "function"){
                        callback = args[2];
                    }else{
                        throw new Error("Please provide a callback function as third parameter for validator: " + name);
                    }
                }else {
                    throw new Error("Please provide a callback function as third parameter for validator: " + name);
                }
            }else if(typeof args[1] === "function"){
                callback = args[1];
            }else {
                throw new Error("Please provide a callback function or configuration object as second parameter for validator: " + name);
            }
        }else {
            throw new Error("Please provide a callback function as second parameter for validator: " + name);
        }
        return {
            config: config,
            callback: callback
        };
    };

    var checkFilterName = function(name){
        if(name === undefined || typeof name !== "string"){
            throw new Error("Please provide a string value as name of the validator");
        }else {
            var regEx = new RegExp(/^[\w]*$/);
            if(regEx.test(name) !== true ){
                throw new Error("Only alphanumeric characters allowed in name");
            }
        }
    };
    root.it = it;
})(this);