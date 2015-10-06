'use strict';
// error.js, errors export

// error log helper
let Err	= console.error.bind(console);

// if user passes in non-directory
exports.notadir = (dir) => {
	Err('Path is not a directory:', iDirectory);
	process.exit(1);
},

// if user is missing options (--in, --out)
exports.usage = () => {
	Err('simp-less usage:');
	Err('\t--in \t\t\tinput directory path (required)');
	Err('\t--out \t\t\toutput directory path (required)');
	Err('');
	Err('\t-W\t\t\twatch less files');
	Err('\t-R,--recursive\t\trecurse or if --recursive specify a depth');
    Err('\t-m,--minify \t\tminify css output');
    Err('\t-c,--concat \t\tconcatenate all input files together into one output');
    Err('');
	process.exit(1);
}
