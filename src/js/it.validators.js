if(window.it == undefined || it.is === undefined || it.to === undefined){
    throw new Error("Please load 'it' library");
}
it.is("required", function () {
    if(this.originalValue !== undefined && this.originalValue !== null && this.originalValue !== "") {
        this.valid = true;
    } else {
        this.valid = false;
        this.errorMessages.push("Value cannot be empty")
    }
});

it.is("integer", function () {
    if(this.originalValue !== undefined && this.originalValue !== null && this.originalValue !== "") {
        var value = this.originalValue + "" - 0;
        if(isNaN(value) || (this.originalValue + "").indexOf(".") !== -1){
            this.valid = false;
            this.errorMessages.push("Can contain only integers");
        }else{
            this.valid = true;
        }
    }
});

it.is("minLength", function (minLength) {
    if(this.originalValue !== undefined && this.originalValue !== null && this.originalValue !== "") {
        var value = this.originalValue + "" - 0;
        if(isNaN(value) || (this.originalValue + "").indexOf(".") !== -1){
            this.valid = false;
            this.errorMessages.push("Minimum " + minLength + " characters are required");
        }else{
            this.valid = true;
        }
    }
});