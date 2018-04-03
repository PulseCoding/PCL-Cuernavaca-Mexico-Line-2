var fs = require('fs');
module.exports = class eol {
	constructor(name, eolCome, path, WISE, destinationPath) {
		this.name = name
		this.eol = eolCome
		this.eolsaved = []
		this.tt = null
		this.attached = null
		this.readFile = function() {
			var values = ['eol']
			for (var i in values) {
				if (this[values[i]] != null) {
					var subfolders = fs.readdirSync(path + WISE[this[values[i]].wise] + "\\signal_log\\");
					for (var j in subfolders) {
						var files = fs.readdirSync(path + WISE[this[values[i]].wise] + "\\signal_log\\" + subfolders[j]);
						if (files.length == 0) {
							fs.rmdirSync(path + WISE[this[values[i]].wise] + "\\signal_log\\" + subfolders[j]);
						} else {
							for (var k in files) {
								var arr = this.csvArray(fs.readFileSync(path + WISE[this[values[i]].wise] + "\\signal_log\\" + subfolders[j] + '\\' + files[k]).toString());
								arr.pop();
								this[values[i] + 'saved'] = this[values[i] + 'saved'].concat(arr);
								this.attached = path + WISE[this[values[i]].wise] + "\\signal_log\\" + subfolders[j] + '\\' + files[k];
							}
						}
					}
				}
			}
		}
		this.csvArray = function(text) {
			text = text.replace(/\n/g, '').split('\r');
			text.shift()
			var arr = [];
			for (var i in text) {
				arr[i] = text[i].split(',');
			}
			return arr;
		}
		this.passingValues = function() {
			this.readFile();
			var date = new Date(this.eolsaved[0][1]).getTime()
			fs.appendFileSync(destinationPath + this.name, 'tt=' + date +',var=eol,val=' + this.eolsaved[0][this.eol.register])
			for(var i = 0; i < 60) {
				this.eolsaved.shift();
			}
		}
	}
}
