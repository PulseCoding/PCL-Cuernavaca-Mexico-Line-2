var machine = require('./models/machine.js')
var eolType = require('./models.eol.js')

/*NOTE: FOLDER DE DÓNDE LEER LOS CSV*/
var path = "C:\\Users\\LT-064\\Dropbox\\Apps\\WISE_Cloud_Log\\";
/*NOTE: FOLDER DE DESTINO DEL LOG*/
var destinationPath = 'C:\\PULSE\\L2_LOGS\\';
/*NOTE: ARREGLO DE WISE*/
var WISE = ["WISE-4051_00D0C9F8F20E"];

/*NOTE: DEFINICIÓN DE OBJETOS*/

var Filler = new machine('CUE_PCL_Filler_l2.log', {
	wise: 0,
	register: 4
}, {
	wise: 0,
	register: 5
}, null, 60, 0.98, 'cpqo', path, WISE, destinationPath)
var CoolingTunel = new machine('CUE_PCL_CoolingTunel_l2.log', {
	wise: 0,
	register: 6
}, {
	wise: 1,
	register: 4
}, null, 60, 0.98, 'cpqo', path, WISE, destinationPath)
var Capper = new machine('CUE_PCL_Capper_l2.log', {
	wise: 1,
	register: 4
}, {
	wise: 1,
	register: 5
}, null, 60, 0.98, 'cpqo', path, WISE, destinationPath)
var Depucker = new machine('CUE_PCL_Depucker_l2.log', {
	wise: 1,
	register: 5
}, {
	wise: 1,
	register: 6
}, null, 60, 0.98, 'cpqo', path, WISE, destinationPath)
var Labeller = new machine('CUE_PCL_Labeller_l2.log', {
	wise: 1,
	register: 6
}, {
	wise: 2,
	register: 5
}, null, 60, 0.98, 'cpqo', path, WISE, destinationPath)
var CasePacker = new machine('CUE_PCL_CasePacker_l2.log', {
	wise: 2,
	register: 5
}, {
	wise: 2,
	register: 4
}, null, 60, 0.98, 'cpqo', path, WISE, destinationPath)
var Checkweigher = new machine('CUE_PCL_Checkweigher_l2.log', {
	wise: 2,
	register: 4
}, {
	wise: 2,
	register: 2
}, null, 60, 0.98, 'cpqo', path, WISE, destinationPath)
var EOL = new eol('CUE_PCL_Checkweigher_l2.log', {
	wise: 2,
	register: 2
}, path, WISE, destinationPath)
var doWrite = setInterval(parser, 30000);

function parser() {
	Filler.passingValues();
	CoolingTunel.passingValues();
	Capper.passingValues();
	Depucker.passingValues();
	Labeller.passingValues();
	EOL.passingValues();
	CasePacker.passingValues();
	Checkweigher.passingValues();
	fs.unlinkSync(Checkweigher.attached);
}

process.on('SIGINT', function() {
	clearInterval(doWrite);
})
