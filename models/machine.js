var fs = require('fs');
module.exports = class machine {
	constructor(name, cpqi, cpqo, wait, timeStop, timeWork, type, path, WISE, destinationPath) {
		this.name = name
		this.cpqi = cpqi
		this.cpqo = cpqo
		this.wait = wait
		this.cpqisaved = []
		this.cpqosaved = []
		this.waitsaved = []
		this.type = type
		this.timeStop = timeStop
		this.timeWork = timeWork
		this.attached = null
		this.readFile = function() {
			var values = ['cpqi', 'cpqo', 'wait']
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
			if (this.type == 'cpqo') {
				for (var i = 0; i < this.cpqosaved.length; i++) {
					if (this.cpqi == null) {
						if (this.wait == null)
							this.calculate(null, this.cpqosaved[i][this.cpqo.register].trim(), new Date(this.cpqosaved[i][1]).getTime(), null)
						else
							this.calculate(null, this.cpqosaved[i][this.cpqo.register].trim(), new Date(this.cpqosaved[i][1]).getTime(), this.waitsaved[i][this.wait.register])
					} else {
						if (this.wait == null)
							this.calculate(this.cpqisaved[i][this.cpqi.register].trim(), this.cpqosaved[i][this.cpqo.register].trim(), new Date(this.cpqosaved[i][1]).getTime(), null)
						else
							this.calculate(this.cpqisaved[i][this.cpqi.register].trim(), this.cpqosaved[i][this.cpqo.register].trim(), new Date(this.cpqosaved[i][1]).getTime(), this.waitsaved[i][this.wait.register])
					}

				}
				this.cpqisaved = []
				this.cpqosaved = []
				this.waitsaved = []
			} else {
				for (var i = 0; i < this.cpqosaved.length; i++) {
					if (this.wait == null)
						this.calculate(this.cpqisaved[i][this.cpqi.register].trim(), null, new Date(this.cpqisaved[i][1]).getTime(), null)
					else
						this.calculate(this.cpqisaved[i][this.cpqi.register].trim(), null, new Date(this.cpqisaved[i][1]).getTime(), this.waitsaved[i][this.wait.register])

				}
				this.cpqisaved = []
				this.cpqosaved = []
				this.waitsaved = []
			}
		}
		this.storage = {
			machinect: null,
			machineresults: null,
			CntInmachine: null,
			CntOutmachine: null,
			machineactual: 0,
			machinetime: 0,
			machinesec: 0,
			machineflagStopped: false,
			machinestate: 0,
			machinespeed: 0,
			machinespeedTemp: 0,
			machineflagPrint: 0,
			machinesecStop: 0,
			machineONS: false,
			machinetimeStop: this.timeStop,
			machineWorktime: this.timeWork,
			machineflagRunning: false
		}
		this.calculate = function(CntIn, CntOut, Dated, WaitSinal) {
			if (CntOut != null) {
				this.storage.machinect = CntOut.trim()
			} else {
				this.storage.machinect = CntIn.trim()
			}
			if (!this.storage.machineONS && this.storage.machinect) {
				this.storage.machinespeedTemp = this.storage.machinect
				this.storage.machinesec = Date.now()
				this.storage.machineONS = true
				this.storage.machinetime = Dated
			}
			if (this.storage.machinect > this.storage.machineactual) {
				if (this.storage.machineflagStopped) {
					this.storage.machinespeed = this.storage.machinect - this.storage.machinespeedTemp
					this.storage.machinespeedTemp = this.storage.machinect
					this.storage.machinesec = Dated
					this.storage.machinetime = Dated
				}
				this.storage.machinesecStop = 0
				this.storage.machinestate = 1
				this.storage.machineflagStopped = false
				this.storage.machineflagRunning = true
			} else if (this.storage.machinect == this.storage.machineactual) {
				if (this.storage.machinesecStop == 0) {
					this.storage.machinetime = Dated
					this.storage.machinesecStop = Dated
				}
				if ((Dated - (this.storage.machinetimeStop * 1000)) >= this.storage.machinesecStop) {
					this.storage.machinespeed = 0
					this.storage.machinestate = 2
					this.storage.machinespeedTemp = this.storage.machinect
					this.storage.machineflagStopped = true
					this.storage.machineflagRunning = false
					this.storage.machineflagPrint = 1
					if (WaitSinal) {
						this.storage.machinestate = 3
					}
				}
			}
			this.storage.machineactual = this.storage.machinect
			if (Dated - 60000 * this.storage.machineWorktime >= this.storage.machinesec && this.storage.machinesecStop == 0) {
				if (this.storage.machineflagRunning && this.storage.machinect) {
					this.storage.machineflagPrint = 1
					this.storage.machinesecStop = 0
					this.storage.machinespeed = this.storage.machinect - this.storage.machinespeedTemp
					this.storage.machinespeedTemp = this.storage.machinect
					this.storage.machinesec = Dated
				}
			}
			this.storage.machineresults = {
				ST: this.storage.machinestate,
				CPQI: CntIn,
				CPQO: CntOut,
				SP: this.storage.machinespeed
			}
			if (this.storage.machineflagPrint == 1) {
				for (var key in this.storage.machineresults) {
					if (this.storage.machineresults[key] != null && !isNaN(this.storage.machineresults[key]))
						fs.appendFileSync(destinationPath + this.name, 'tt=' + this.storage.machinetime + ',var=' + key + ',val=' + this.storage.machineresults[key] + '\n')
				}
				this.storage.machineflagPrint = 0
				this.storage.machinesecStop = 0
				this.storage.machinetime = Dated
			}
		}
	}
}
