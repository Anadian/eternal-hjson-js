#!/usr/local/bin/node
var Hjson = require("..");
var fs = require("fs");
var path = require("path");
var rootDir = path.normalize(path.join(__dirname, "assets")); //The path to the test/assets directory.

var args={}, argv=[]; 
process.argv.slice(2).forEach(function(x){
	if (x[0]==="-"){ //Checks if argument begins with a hyphen.
		var i = x.indexOf("="); //Set `i` to the first '='.
		args[x.substr( 1, ( i > (0?i-1:undefined) ) )] = (i > (0?x.substr(i+1):true)); //Checks if `i` is greater than undefined? Assigns args['<string before the =>'] to the string after the '='. I think....
	} else argv.push(x); //Ignores the argument if it doesn't begin with a hyphen.
}); //Performs some sort of dismissive argument handling? The only recognised argument I can find in this source file is '-dump' for writing test reports to a file but even that doesn't seem to work.

var filter=argv[0]; //"node" is most cases?
var success=true; //The ultimate value, a boolean representing if all test passed successfully.
var defaultOptions = { legacyRoot: false }; //The default options used when no metadata file is found for a test.

/**
### failErr (private)
> Logs a failure message to STDOUT and and sets the global success boolean to false;

Parametres:
| name | type | description |
| --- | --- | --- |
| name | {string} | The name of the test that failed. |
| type | {string} | A user-level type for the sort of error. |
| s1 | {string} | A string representing what we actually got. |
| s2 | {string} | A string representing what we expected. |
| msg | {string} | An additional message to log before showing the strings. |

*/
function failErr(name, type, s1, s2, msg) {
	msg=msg||"	"+name+" "+type+" FAILED!";
	console.log(msg);
	if (s1 || s2) {
		var i=0;
		while (i<s1.length && s1[i]===s2[i]) i++;
		console.log("--- actual (length: "+s1.length+")(diff at "+i+";"+(s1[i]||'').charCodeAt(0)+":"+(s2[i]||'').charCodeAt(0)+"):");
		console.log(s1);
		console.log("--- expected (length: "+s2.length+"):");
		console.log(s2);
		if (args.dump)
			fs.writeFileSync(args.dump, s1, "utf8");
	}
	success=false;
}

/**
### load (private)
> Loads a JSON/HJSON file for testing.

Parametres:
| name | type | description |
| --- | --- | --- |
| file | {string} | A string containing the name of the file to load. |
| cr | {boolean} | A boolean representing whether to reformat the file's text to use Windows-style CRLF line breaks instead of the default Unix-style LF line breaks. |

*/
function load(file, cr) {
	var text = fs.readFileSync(path.join(rootDir, file), "utf8");
	var std = text.replace(/\r/g, ""); // make sure we have unix style text regardless of the input
	return cr ? std.replace(/\n/g, "\r\n") : std; //Replaces \n with \r\n if parametre `cr` is `true`.
}

/**
### test (private)
> Runs a test.

Parametres:
| name | type | description |
| --- | --- | --- |
| name | {string} | The name of the test for reports. |
| file | {string} | The filename for the test data. |
| isJson | {boolean} | A boolean representing whether the file specified should be parsed as JSON instead of the deafult parsing as HJSON |
| inputCr | {boolean} | A boolean representing whether the input data should be reformatted to use Windows-style CRLF line breaks instead of the default Unix-style LF line breaks. |
| outputCr | {boolean} | A boolean representing whether the output data should be reformatted to use Windows-style CRLF line breaks instead of the default Unix-style LF line breaks. |

*/
function test(name, file, isJson, inputCr, outputCr) {
	var text = load(file, inputCr); //text is the filedata at `file` as a UTF8 string/
	var shouldFail = (name.substr(0, 4) === "fail"); //A boolean repsenting whether the test should fail for the given file based off of whether the filename begins with "fail".
	var metaPath = path.join(rootDir, name+"_testmeta.hjson"); //File path for optional(?) metatdata for the test.
	var meta = fs.existsSync(metaPath) ? Hjson.parse(fs.readFileSync(metaPath, "utf8")) : defaultOptions; //Loads meta data if it exists, else uses `defaultOptions`.
	Hjson.setEndOfLine(outputCr?"\r\n":"\n"); //Sets the output line-break style for the global `Hjson` module.

	try {
		var data = Hjson.parse(text); //Attempt to parse `text` has Hjson.

		if (!shouldFail) { //Should be successful.
			var jsonFromData = JSON.stringify(data, null, '\t'); //Creates a JSON string from the `data` object.
			var hjsonFromData = (Hjson.stringify(data, meta.options)+(outputCr?'\r\n':'\n')); //Creates an HJSON string from the `data` object.
			var jsonResultRaw = load(name+"_result.json", inputCr); //Loads a <name>_result.json file as a UTF8 string.
			var jsonResult = JSON.stringify(JSON.parse(jsonResultRaw), null, '\t'); //Converts UTF8 string to JSON object and then stringify that object for finalised JSON string.
			var hjsonResult = (load(name+"_result.hjson", outputCr)+(outputCr?'\r\n':'\n')); //Loads a <name>_result.hjson file as a UTF8 string.
			if (jsonFromData !== jsonResult) return failErr(name, "parse", jsonFromData, jsonResult); //Fails if the JSON string from the input test data doesn't match the expected JSON string from the result file.
			if (hjsonFromData !== hjsonResult) return failErr(name, "stringify", hjsonFromData, hjsonResult); //Fails if the HJSON string from the input test data doesn't match the expected HJSON string from the result file. There seems to be a major issue with how the serialiser handles trailing line breaks.
			if (!inputCr && !outputCr && jsonResultRaw !== jsonResult) return failErr(name, "json-input", jsonResultRaw, jsonResult); //Seems to test the validity of the result JSON file itself.
			if (isJson) {
				// if the input is JSON we can also compare Hjson.parse to JSON.parse
				var json1 = JSON.stringify(data), json2 = JSON.stringify(JSON.parse(text)); //Checks that HJSON interal structure serialises as if it was plain-old JSON.
				if (json1 !== json2) return failErr(name, "json chk", json1, json2); //Returns a failure code if the previous check isn't true.
			}
		}
		else return failErr(name, null, null, null, "	should fail but succeeded"); //No error when there was supposed to be one. Returns failure value.
	}
	catch (err) {
		if (!shouldFail) return failErr(name, "exception", err.toString(), ""); //An error occured when there shouldn't have been one. Returns a failure code.
	}
	return true;
}

console.log("running tests...");

var tests=fs.readFileSync(path.join(rootDir, "testlist.txt"), "utf8").split("\n"); //Gets the tests listed in testlist.txt as an array.
tests.forEach(function(file) {
	var name = file.split("_test."); //`name` is an array with the 0th entry being the test name and the 2nd entry being the file extension(?).
	if (name.length < 2) return; //Skip test if filename is invalid.
	var isJson = (name[2] === "json"); //Assign isJson to true if the file extension is "json".
	name = name[0]; //Assign test name.

	if (filter && name.indexOf(filter) < 0) return; // ignore

	console.log("Test Name: "+name); //Print the test name.
	test(name, file, isJson, false, false) &&
	test(name, file, isJson, false, true) &&
	test(name, file, isJson, true, false) &&
	test(name, file, isJson, true, true); //Run test with every permutation of inputCr and outputCr
});

console.log(success?"ALL OK!":"FAIL!"); //Print "ALL OK!" to STDOUT if all test passed, "FAIL!" otherwise.
process.exit(success?0:1); //Exit with 0 if all test pass, 1 if a test fails.

