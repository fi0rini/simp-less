#simp-less
a simple package for watching a less directory and compiling it into source code

##installation
	npm i simp-less [-g]|[--save-dev]|[--save]

## usage
*cli*

	usage: simp-less --in directory --out directory
		--in				directory in
		--out 				directory out
		-R,--recursive		recursive watch (with --recursive specify level) default 0
		-W					watch
		-m,--minify			minify css output
    	-c,--concat 		concatenate all input files together into one output
	

*npm scripts*

	scripts: {
		...
	    "watch:less": "simp-less --in directory --out directory -WR",
		...
	}

## notes
still in progress. basic recursive watch with/without minification is most functionality right now. One time compilation is under construction.

