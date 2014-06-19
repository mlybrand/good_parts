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

// Define a getElementsByAttribute function. It
// takes an attribute name string and an optional
// matching value. It calls walk_the_DOM, passing it aLinkcolor
// function that looks for an attribute name in the
// node. The matching nodes are accumulated in a 
// results array.

var getElementsByAttribute = function(att, value) {
	var results = [];
	
	walk_the_DOM(document.body, function(node) {
		var actual = node.nodeType === 1 && node.getAttribute(att);
		if (typeof actual === 'string' && (actual === value || typeof value !== 'string')) {
			results.push(node);
		}
	});
	
	return results;
};

// Make a factorial function with tail
// recursion. It is tail recursive because
// it returns the result of calling itself.

// JavaScript does not currently optimize this form.

var factorial = function(i, a) {
	a = a || 1;
	if (i < 2) {
		return a;
	}
	return factorial(i - 1, a * i);
};

document.writeln(factorial(4));

// Crate a maker function called quo. It makes an
// object with a get_status method and a private
// status property.

var quo = function(status) {
	return {
		get_status: function() {
			return status;
		}
	};
};

// Make an instance of quo.

var myQuo = quo("amazed");
document.writeln(myQuo.get_status());

// Define a function that sets a DOM node's color
// to yellow and then fades it to white.

var fade = function(node) {
	var level = 1;
	var step = function() {
		var hex = level.toString(16);
		node.style.backgroundColor = '#FFFF' + hex + hex;
		if (level < 15) {
			level += 1;
			setTimeout(step, 100);
		}
	};
	setTimeout(step, 100);
};

fade(document.body);


String.method('deentitify', function() {
	var entity = {
		quot: '"',
		lt: '<',
		gt: '>'
	};
	return function() {
		return this.replace(/&([^&;]+);/g,
			function(a, b) {
				var r = entity[b];
				return typeof r === 'string' ? r : a;
			}
		);
	};
}());

document.writeln('&lt;&quot;&gt;'.deentitify());

var serial_maker = function() {
	var prefix = '';
	var seq = 0;
	return {
		set_prefix: function(p) {
			prefix = String(p);
		},
		set_seq: function(s) {
			seq = s;
		},
		gensym: function() {
			var result = prefix + seq;
			seq += 1;
			return result;
		}
	};
};

var seqer = serial_maker();
seqer.set_prefix('Q');
seqer.set_seq(1000);
var unique = seqer.gensym();

Function.method('curry', function() {
	var slice = Array.prototype.slice,
		args = slice.apply(arguments),
		that = this;
	return function() {
		return that.apply(null, args.concat(slice.apply(arguments)));
	};
});

// var fibonacci = function(n) {
// 	return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
// };

// var fibonacci = (function() {
// 	var memo = [0,1];
// 	var fib = function(n) {
// 		var result = memo[n];
// 		if (typeof result !== 'number') {
// 			result = fib(n-1) + fib(n-2);
// 			memo[n] = result;
// 		}
// 		return result;
// 	};
// 	return fib;
// }());

var memoizer = function(memo, formula) {
	var recur = function(n) {
		var result = memo[n];
		if(typeof result !== 'number') {
			result = formula(recur, n);
			memo[n] = result;
		}
		return result;
	};
	return recur;
};

var fibonacci = memoizer([0,1], function(recur, n) {
	return recur(n-1) + recur(n-2);
});

for (var i = 0; i <= 10; i++) {
	document.writeln('// ' + i + ': ' + fibonacci(i));
}

var factorial2 = memoizer([1,1], function(recur, n) {
	return n * recur(n-1);
};
