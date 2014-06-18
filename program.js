if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	};
}

Function.prototype.method = function(name, func) {
	if (!this.prototype[name]) {
		this.prototype[name] = func;
		return this;
	}
}

document.writeln("Hello, world!");

// Create myObject. It has a value and an increment
// method. The increment method takes an optional
// parameter. If the argument is not a number, then 1
// is used as the default.

var myObject = {
	value: 0,
	increment: function(inc) {
		this.value += typeof inc === 'number' ? inc : 1;
	}
};

myObject.increment();
document.writeln(myObject.value);

myObject.increment(2);
document.writeln(myObject.value);

// Augment myObject with a double method

var add = function(x, y) {
	if (typeof x !== 'number' || typeof y !== 'number') {
		throw {
			name: 'TypeError',
			message: 'add needs numbers'
		}
	}
	return x + y;
}

myObject.double = function() {
	var that = this;
	
	var helper = function() {
		that.value = add(that.value, that.value);
	};
	
	helper();
}

myObject.double();
document.writeln(myObject.value);

// Create a constructor function call Quo.
// It makes an object with a status property.

var Quo = function(string) {
	this.status = string;
};

// Give all instances of Quo a public method
// called get_status

Quo.prototype.get_status = function() {
	return this.status;
};

// Make an instance of Quo.

var myQuo = new Quo("confused");

document.writeln(myQuo.get_status()); // confused

// Make an array of 2 numbers and add them.

var array = [3,4];
var sum = add.apply(null, array); // sum is 7

// Make an object with a status member.

var statusObject = {
	status: 'A-OK'
};

// statusObject does not inherit from Quo.prototype,
// but we can invoke the get_status method on
// statusObject even though statusObject does not have
// a get_status method.

var status = Quo.prototype.get_status.apply(statusObject);
// status is 'A-OK'

// Make a function that adds a lot of stuff.

// Note that defining the variable sum inside of
// the function does not interfere with the sum
// defined outside of the function. The function
// only sees the inner one.

var sum2 = function () {
	var i, sum = 0;
	for (i = 0; i < arguments.length; i += 1) {
		sum += arguments[i];
	}
	return sum;
};

document.writeln(sum2(4,8,15,16,23,42)); // 108

// Make a try_it function that calls the new add
// function incorrectly.

var try_it = function() {
	try {
		add("seven");
	} catch(e) {
		document.writeln(e.name + ': ' + e.message);
	}
};

try_it();

Number.method('integer', function() {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});

document.writeln((-10/3).integer());

String.method('trim', function() {
	return this.replace(/^\s+|\s+$/g, '');
});

document.writeln('"'+"     neat      ".trim()+'"');

var hanoi = function hanoi(disc, src, aux, dst) {
	if (disc > 0) {
		hanoi(disc - 1, src, dst, aux);
		document.writeln('Move disc ' + disc + ' from ' + src + ' to ' + dst);
		hanoi(disc - 1, aux, src, dst);
	}
};

hanoi(3, 'Src', 'Aux', 'Dst');

// Define a walk_the_DOM function that visits every
// node of the tree in HTML source order, starting
// from some given node. It invokes a function,
// passing it each node in turn, walk_the_DOM calls
// itself to process each of the child nodes.

var walk_the_DOM = function walk(node, func) {
	func(node);
	node = node.firstChild;
	while(node) {
		walk(node, func);
		node = node.nextSibling;
	}
};

