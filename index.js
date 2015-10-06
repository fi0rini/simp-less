#!/usr/bin/env node
'use strict'

// Help functions
let Log = console.log.bind(console);

// Node Module Loading
let _path 		= require('path');
let argv		= require('minimist')(process.argv.slice(2));
let less    	= require('less');
let chokidar	= require('chokidar');
let isadir		= require('isadir');
let fs 			= require('fs');
let errors		= require('./errors.js');


// private variables

// i[n]Directory
let iDirectory = argv.in && argv.in.replace(/\/$/,'');
// o[out]Directory
let oDirectory = argv.out && argv.out.replace(/\/$/,'');

// check arguments
iDirectory && oDirectory || errors.usage();

// handle arguments
isadir(iDirectory) || errors.notADir(iDirectory);
isadir(oDirectory) || fs.mkdirSync(oDirectory);

let mapDirectory = (path, inD, outD) => {
	let parsedPath 		= _path.parse(path);
		parsedPath.dir 	= parsedPath.dir.replace(inD, outD);
		parsedPath.ext 	= '.css';
		parsedPath.base = parsedPath.name + parsedPath.ext;

	let outPath 		= _path.format(parsedPath);

	return outPath;
}

// compile less into css output
let compileLess = (path) => {
	// If it's a less file, then compile
	let mappedPath = mapDirectory(path, iDirectory, oDirectory);
	let mappedDir  = _path.parse(mappedPath).dir;

	if(!isadir(mappedDir)) {
		fs.mkdirSync(mappedDir);
	}

	(() => {
		let lessData 		= '';
		let outputStream 	= fs.createWriteStream(mappedPath);

		Log('mapping:', path, '->', mappedPath);

		fs.createReadStream(path)
			.on('data', (data) 	=> lessData += data)
			.on('end', 	() 		=>
				less.render(
					lessData, {
                        compress: argv.m || false // argv.m is minify switch
                    },
					(err, output) => {
						if(err) throw err
						outputStream.write(output.css);
					}
				)
			)
			.on('error', (err) 	=> console.log(err));
	}());

}

// delete less file
let deleteLess	= (path) => {
	isLess(path) && Log('Delete less 	:', path);
}

// makeDir for less
let makeDir = (path) => {
	isLess(path) && Log('Makedir less 	:', path);
}

// check if a file is less... (see 1:)
let isLess = (p) => _path.extname(p) === ".less"

if(argv.W) {
	// setup watcher
	let watcher = chokidar.watch(iDirectory, {
		depth: 			argv.R ? 99 : argv.recursive ? argv.recursive : 0,
		ignored: 		/^.*\.(?!less$)[^.]+$/, // This picks up files without ext's (1: needs to be fixed)
		persistent: 	true,
		followSymlinks: false
	});

	watcher.on( 'add', (path) => {
		if( isLess(path) ) {
			compileLess(path)
		}
	});

	watcher.on( 'change', (path) => {
		if( isLess(path) ) {
			compileLess(path)
		}
	});

	watcher.on('addDir', makeDir);
	watcher.on('unlink', deleteLess);
	watcher.on('error', (err) => console.error(err));
} else {
	//TODO
	//compile less code once into output directory
	// walkdir() && compile less
}