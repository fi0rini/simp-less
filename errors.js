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
exports.missingargs = () => {
	Err('Required arguments:')
	Err('\t--in,  input directory path')
	Err('\t--out, output directory path')
	process.exit(1);
}
