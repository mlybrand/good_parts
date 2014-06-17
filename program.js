if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	};
}

Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
}

document.writeln("Hello, world!");

document.writeln(foo());

foo = function() {
	return "bar";
}