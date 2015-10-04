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
iDirectory && oDirectory || errors.missingargs();

// handle arguments
isadir(iDirectory) || errors.notADir(iDirectory);
isadir(oDirectory) || fs.mkdirSync(oDirectory);

// recursive watcher
let watcher = chokidar.watch(iDirectory, {
	persistent: true,
	ignored: /^.*\.(?!less$)[^.]+$/, // This picks up files without ext's (1: needs to be fixed)
	followSymlinks: false
});

// check if a file is less... (see 1:)
let isLess = (p) => _path.extname(p) === ".less"

// compile less into css output
let compileLess = (path) => {
	// If it's a less file, then compile
	isLess(path) && ( () => {
		let parsedPath 		= _path.parse(path);		
			parsedPath.dir 	= parsedPath.dir.replace(iDirectory, oDirectory);
			parsedPath.ext 	= '.css';
			parsedPath.base = parsedPath.name + parsedPath.ext;

		(() => {
			let lessData 		= '';
			let outPath 		= _path.format(parsedPath);
			let outputStream 	= fs.createWriteStream(outPath);

			Log('mapping:', path,'->', outPath);

			fs.createReadStream(path)
				.on('data', (data) 	=> lessData += data)
				.on('end', 	() 		=> 
					less.render(
						lessData, 
						(err, output) => {
							if(err) throw err
							outputStream.write(output.css) 
						}
					)
				)
				.on('error', (err) 	=> console.log(err));
		}());

	}());
}

let deleteLess	= (path) => {
	isLess(path) && Log('Delete less 	:', path);
}

let makeDir = (path) => {
	isLess(path) && Log('Makedir less 	:', path);
	
}

watcher.on('add', 	 compileLess);
watcher.on('change', compileLess);

watcher.on('addDir', makeDir);
watcher.on('unlink', deleteLess);
watcher.on('error', (err) => console.error(err));