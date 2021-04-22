// -----------
// Tools: Extends native functions of JS
// -----------

(function() {
    // Prefix a value with a number of zeros
    Number.prototype.zeroize = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) { s = "0" + s; }
        return s;
    }
}());
