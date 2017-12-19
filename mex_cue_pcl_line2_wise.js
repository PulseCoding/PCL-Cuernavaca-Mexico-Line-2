var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');

try{
var secPubNub=0;
var Rotobotct = null,
    Rotobotresults = null,
    CntInRotobot = null,
    CntOutRotobot = null,
    Rotobotactual = 0,
    Rotobottime = 0,
    Rotobotsec = 0,
    RotobotflagStopped = false,
    Rotobotstate = 0,
    Rotobotspeed = 0,
    RotobotspeedTemp = 0,
    RotobotflagPrint = 0,
    RotobotsecStop = 0,
    RotobotdeltaRejected = null,
    RotobotONS = false,
    RotobottimeStop = 60, //NOTE: Timestop
    RotobotWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    RotobotflagRunning = false,
    RotobotRejectFlag = false;
var Fillerct = null,
    Fillerresults = null,
    CntInFiller = null,
    CntOutFiller = null,
    Filleractual = 0,
    Fillertime = 0,
    Fillersec = 0,
    FillerflagStopped = false,
    Fillerstate = 0,
    Fillerspeed = 0,
    FillerspeedTemp = 0,
    FillerflagPrint = 0,
    FillersecStop = 0,
    FillerdeltaRejected = null,
    FillerONS = false,
    FillertimeStop = 60, //NOTE: Timestop
    FillerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    FillerflagRunning = false,
    FillerRejectFlag = false,
    FillerReject,
    FillerVerify = (function(){
      try{
        FillerReject = fs.readFileSync('FillerRejected.json')
        if(FillerReject.toString().indexOf('}') > 0 && FillerReject.toString().indexOf('{\"rejected\":') != -1){
          FillerReject = JSON.parse(FillerReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('FillerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          FillerReject = {
            rejected : 0
          }
        }
      }
    })();
var CoolingTunelct = null,
    CoolingTunelresults = null,
    CntInCoolingTunel = null,
    CntOutCoolingTunel = null,
    CoolingTunelactual = 0,
    CoolingTuneltime = 0,
    CoolingTunelsec = 0,
    CoolingTunelflagStopped = false,
    CoolingTunelstate = 0,
    CoolingTunelspeed = 0,
    CoolingTunelspeedTemp = 0,
    CoolingTunelflagPrint = 0,
    CoolingTunelsecStop = 0,
    CoolingTuneldeltaRejected = null,
    CoolingTunelONS = false,
    CoolingTuneltimeStop = 60, //NOTE: Timestop
    CoolingTunelWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CoolingTunelflagRunning = false,
    CoolingTunelRejectFlag = false;
var Capperct = null,
    Capperresults = null,
    Capperactual = 0,
    Cappertime = 0,
    Cappersec = 0,
    CapperflagStopped = false,
    Capperstate = 0,
    Capperspeed = 0,
    CapperspeedTemp = 0,
    CapperflagPrint = 0,
    CappersecStop = 0,
    CapperdeltaRejected = null,
    CapperONS = 0,
    CapperStartTime = null,
    CappertimeStop = 30, //NOTE: Timestop
    CapperWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
    CapperflagRunning = false,
    CapperRejectFlag = false,
    CapperReject,
    CntOutCapper=null,
    CntInCapper=null;
var Depuckerct = null,
    Depuckerresults = null,
    Depuckeractual = 0,
    Depuckertime = 0,
    Depuckersec = 0,
    DepuckerflagStopped = false,
    Depuckerstate = 0,
    Depuckerspeed = 0,
    DepuckerspeedTemp = 0,
    DepuckerflagPrint = 0,
    DepuckersecStop = 0,
    DepuckerdeltaRejected = null,
    DepuckerONS = 0,
    DepuckerStartTime = null,
    DepuckertimeStop = 30, //NOTE: Timestop
    DepuckerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
    DepuckerflagRunning = false,
    DepuckerRejectFlag = false,
    DepuckerReject,
    CntOutDepucker=null,
    CntInDepucker=null;
var Labellerct = null,
    Labellerresults = null,
    Labelleractual = 0,
    Labellertime = 0,
    Labellersec = 0,
    LabellerflagStopped = false,
    Labellerstate = 0,
    Labellerspeed = 0,
    LabellerspeedTemp = 0,
    LabellerflagPrint = 0,
    LabellersecStop = 0,
    LabellerdeltaRejected = null,
    LabellerONS = 0,
    LabellerStartTime = null,
    LabellertimeStop = 30, //NOTE: Timestop
    LabellerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
    LabellerflagRunning = false,
    LabellerRejectFlag = false,
    LabellerReject,
    CntOutLabeller=null,
    CntInLabeller=null;
var CasePackerct = null,
    CasePackerresults = null,
    CntInCasePacker = null,
    CntOutCasePacker = null,
    CasePackeractual = 0,
    CasePackertime = 0,
    CasePackersec = 0,
    CasePackerflagStopped = false,
    CasePackerstate = 0,
    CasePackerspeed = 0,
    CasePackerspeedTemp = 0,
    CasePackerflagPrint = 0,
    CasePackersecStop = 0,
    CasePackerdeltaRejected = null,
    CasePackerONS = false,
    CasePackertimeStop = 60, //NOTE: Timestop
    CasePackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CasePackerflagRunning = false,
    CasePackerRejectFlag = false;
var Checkweigherct = null,
    Checkweigherresults = null,
    Checkweigheractual = 0,
    Checkweighertime = 0,
    Checkweighersec = 0,
    CheckweigherflagStopped = false,
    Checkweigherstate = 0,
    Checkweigherspeed = 0,
    CheckweigherspeedTemp = 0,
    CheckweigherflagPrint = 0,
    CheckweighersecStop = 0,
    CheckweigherdeltaRejected = null,
    CheckweigherONS = 0,
    CheckweigherStartTime = null,
    CheckweighertimeStop = 30, //NOTE: Timestop
    CheckweigherWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
    CheckweigherflagRunning = false,
    CheckweigherRejectFlag = false,
    CheckweigherReject,
    CntOutCheckweigher=null,
    CntInCheckweigher=null;
var CntOutEOL=null,
    secEOL=0;

var files = fs.readdirSync("C:/PULSE/L2_LOGS/"); //Leer documentos
var text2send=[];//Vector a enviar
var i=0;
var intId1,intId2,intId3;
var publishConfig;
var pubnub = new PubNub({
publishKey:    "pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
subscribeKey:    "sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
  uuid: "CUE_PCL_LINE2"
});
var flagInfo2Send;
var k;
var senderData=function (){
  pubnub.publish(publishConfig, function(status, response) {
});};



var client1 = modbus.client.tcp.complete({
  'host': "192.168.10.93",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client2 = modbus.client.tcp.complete({
  'host': "192.168.10.94",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client3 = modbus.client.tcp.complete({
  'host': "192.168.10.95",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});

  /*----------------------------------------------------------------------------------Rotobot-------------------------------------------------------------------------------------------*/
  client1.connect();
  client2.connect();
  client3.connect();

  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };
  var CapperVerify = function(){
        try{
          CapperReject = fs.readFileSync('CapperRejected.json');
          if(CapperReject.toString().indexOf('}') > 0 && CapperReject.toString().indexOf('{\"rejected\":') != -1){
            CapperReject = JSON.parse(CapperReject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('CapperRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            CapperReject = {
              rejected : 0
            };
          }
        }
      };

  CapperVerify();
  var DepuckerVerify = function(){
        try{
          DepuckerReject = fs.readFileSync('DepuckerRejected.json');
          if(DepuckerReject.toString().indexOf('}') > 0 && DepuckerReject.toString().indexOf('{\"rejected\":') != -1){
            DepuckerReject = JSON.parse(DepuckerReject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('DepuckerRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            DepuckerReject = {
              rejected : 0
            };
          }
        }
      };

  DepuckerVerify();
  var LabellerVerify = function(){
        try{
          LabellerReject = fs.readFileSync('LabellerRejected.json');
          if(LabellerReject.toString().indexOf('}') > 0 && LabellerReject.toString().indexOf('{\"rejected\":') != -1){
            LabellerReject = JSON.parse(LabellerReject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('LabellerRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            LabellerReject = {
              rejected : 0
            };
          }
        }
      };

  LabellerVerify();
  var CheckweigherVerify = function(){
        try{
          CheckweigherReject = fs.readFileSync('CheckweigherRejected.json');
          if(CheckweigherReject.toString().indexOf('}') > 0 && CheckweigherReject.toString().indexOf('{\"rejected\":') != -1){
            CheckweigherReject = JSON.parse(CheckweigherReject);
          }else{
            throw 12121212;
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('CheckweigherRejected.json','{"rejected":0}'); //NOTE: Change the object to what it usually is.
            CheckweigherReject = {
              rejected : 0
            };
          }
        }
      };

  CheckweigherVerify();
  setInterval(function(){
    //PubNub --------------------------------------------------------------------------------------------------------------------
            if(secPubNub>=60*5){

              function idle(){
                i=0;
                text2send=[];
                for ( k=0;k<files.length;k++){//Verificar los archivos
                  var stats = fs.statSync("C:/PULSE/L2_LOGS/"+files[k]);
                  var mtime = new Date(stats.mtime).getTime();
                  if (mtime< (Date.now() - (15*60*1000))&&files[k].indexOf("serialbox")==-1){
                    flagInfo2Send=1;
                    text2send[i]=files[k];
                    i++;
                  }
                }
              }
              secPubNub=0;
              idle();
              publishConfig = {
                channel : "Cue_PCL_Monitor",
                message : {
                      line: "2",
                      tt: Date.now(),
                      machines:text2send

                    }
              };
              senderData();
            }
            secPubNub++;
    //PubNub --------------------------------------------------------------------------------------------------------------------


  },1000);

client1.on('connect', function(err) {
    intId1=setInterval(function(){


        client1.readHoldingRegisters(0, 16).then(function(resp) {
          CntInFiller = joinWord(resp.register[2], resp.register[3]);
          CntOutFiller = joinWord(resp.register[4], resp.register[5]);
          CntInCoolingTunel =  joinWord(resp.register[6], resp.register[7]);
          CntOutRotobot = joinWord(resp.register[8], resp.register[9]);
        //------------------------------------------Rotobot----------------------------------------------
              Rotobotct = CntOutRotobot // NOTE: igualar al contador de salida
              if (!RotobotONS && Rotobotct) {
                RotobotspeedTemp = Rotobotct
                Rotobotsec = Date.now()
                RotobotONS = true
                Rotobottime = Date.now()
              }
              if(Rotobotct > Rotobotactual){
                if(RotobotflagStopped){
                  Rotobotspeed = Rotobotct - RotobotspeedTemp
                  RotobotspeedTemp = Rotobotct
                  Rotobotsec = Date.now()
                  RotobotdeltaRejected = null
                  RotobotRejectFlag = false
                  Rotobottime = Date.now()
                }
                RotobotsecStop = 0
                Rotobotstate = 1
                RotobotflagStopped = false
                RotobotflagRunning = true
              } else if( Rotobotct == Rotobotactual ){
                if(RotobotsecStop == 0){
                  Rotobottime = Date.now()
                  RotobotsecStop = Date.now()
                }
                if( ( Date.now() - ( RotobottimeStop * 1000 ) ) >= RotobotsecStop ){
                  Rotobotspeed = 0
                  Rotobotstate = 2
                  RotobotspeedTemp = Rotobotct
                  RotobotflagStopped = true
                  RotobotflagRunning = false
                  RotobotflagPrint = 1
                }
              }
              Rotobotactual = Rotobotct
              if(Date.now() - 60000 * RotobotWorktime >= Rotobotsec && RotobotsecStop == 0){
                if(RotobotflagRunning && Rotobotct){
                  RotobotflagPrint = 1
                  RotobotsecStop = 0
                  Rotobotspeed = Rotobotct - RotobotspeedTemp
                  RotobotspeedTemp = Rotobotct
                  Rotobotsec = Date.now()
                }
              }
              Rotobotresults = {
                ST: Rotobotstate,
                CPQO : CntOutRotobot,
                SP: Rotobotspeed
              }
              if (RotobotflagPrint == 1) {
                for (var key in Rotobotresults) {
                  if( Rotobotresults[key] != null && ! isNaN(Rotobotresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L2_LOGS/CUE_PCL_Rotobot_l2.log', 'tt=' + Rotobottime + ',var=' + key + ',val=' + Rotobotresults[key] + '\n')
                }
                RotobotflagPrint = 0
                RotobotsecStop = 0
                Rotobottime = Date.now()
              }
        //------------------------------------------Rotobot----------------------------------------------
        //------------------------------------------Filler----------------------------------------------
              Fillerct = CntOutFiller // NOTE: igualar al contador de salida
              if (!FillerONS && Fillerct) {
                FillerspeedTemp = Fillerct
                Fillersec = Date.now()
                FillerONS = true
                Fillertime = Date.now()
              }
              if(Fillerct > Filleractual){
                if(FillerflagStopped){
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                  FillerdeltaRejected = null
                  FillerRejectFlag = false
                  Fillertime = Date.now()
                }
                FillersecStop = 0
                Fillerstate = 1
                FillerflagStopped = false
                FillerflagRunning = true
              } else if( Fillerct == Filleractual ){
                if(FillersecStop == 0){
                  Fillertime = Date.now()
                  FillersecStop = Date.now()
                }
                if( ( Date.now() - ( FillertimeStop * 1000 ) ) >= FillersecStop ){
                  Fillerspeed = 0
                  Fillerstate = 2
                  FillerspeedTemp = Fillerct
                  FillerflagStopped = true
                  FillerflagRunning = false
                  if(CntInFiller - CntOutFiller - FillerReject.rejected != 0 && ! FillerRejectFlag){
                    FillerdeltaRejected = CntInFiller - CntOutFiller - FillerReject.rejected
                    FillerReject.rejected = CntInFiller - CntOutFiller
                    fs.writeFileSync('FillerRejected.json','{"rejected": ' + FillerReject.rejected + '}')
                    FillerRejectFlag = true
                  }else{
                    FillerdeltaRejected = null
                  }
                  FillerflagPrint = 1
                }
              }
              Filleractual = Fillerct
              if(Date.now() - 60000 * FillerWorktime >= Fillersec && FillersecStop == 0){
                if(FillerflagRunning && Fillerct){
                  FillerflagPrint = 1
                  FillersecStop = 0
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                }
              }
              Fillerresults = {
                ST: Fillerstate,
                CPQI : CntInFiller,
                CPQO : CntOutFiller,
                CPQR : FillerdeltaRejected,
                SP: Fillerspeed
              }
              if (FillerflagPrint == 1) {
                for (var key in Fillerresults) {
                  if( Fillerresults[key] != null && ! isNaN(Fillerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L2_LOGS/CUE_PCL_Filler_l2.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n')
                }
                FillerflagPrint = 0
                FillersecStop = 0
                Fillertime = Date.now()
              }
        //------------------------------------------Filler----------------------------------------------

      });//Cierre de lectura

    },1000);
});//Cierre de cliente

client1.on('error', function(err) {
		clearInterval(intId1);
});
client1.on('close', function() {
	clearInterval(intId1);
});


client2.on('connect', function(err) {
          intId2=setInterval(function(){


              client2.readHoldingRegisters(0, 16).then(function(resp) {

                //CntInCapper = joinWord(resp.register[0], resp.register[1]);
                CntInCapper = joinWord(resp.register[2], resp.register[3]);
                CntOutCoolingTunel = joinWord(resp.register[2], resp.register[3]);
                CntOutCapper  = joinWord(resp.register[4], resp.register[5]);
                CntInDepucker = joinWord(resp.register[4], resp.register[5]);
                CntInLabeller = joinWord(resp.register[6], resp.register[7]);
                CntOutDepucker=joinWord(resp.register[6], resp.register[7]);
        //------------------------------------------CoolingTunel----------------------------------------------
              CoolingTunelct = CntOutCoolingTunel // NOTE: igualar al contador de salida
              if (!CoolingTunelONS && CoolingTunelct) {
                CoolingTunelspeedTemp = CoolingTunelct
                CoolingTunelsec = Date.now()
                CoolingTunelONS = true
                CoolingTuneltime = Date.now()
              }
              if(CoolingTunelct > CoolingTunelactual){
                if(CoolingTunelflagStopped){
                  CoolingTunelspeed = CoolingTunelct - CoolingTunelspeedTemp
                  CoolingTunelspeedTemp = CoolingTunelct
                  CoolingTunelsec = Date.now()
                  CoolingTuneldeltaRejected = null
                  CoolingTunelRejectFlag = false
                  CoolingTuneltime = Date.now()
                }
                CoolingTunelsecStop = 0
                CoolingTunelstate = 1
                CoolingTunelflagStopped = false
                CoolingTunelflagRunning = true
              } else if( CoolingTunelct == CoolingTunelactual ){
                if(CoolingTunelsecStop == 0){
                  CoolingTuneltime = Date.now()
                  CoolingTunelsecStop = Date.now()
                }
                if( ( Date.now() - ( CoolingTuneltimeStop * 1000 ) ) >= CoolingTunelsecStop ){
                  CoolingTunelspeed = 0
                  CoolingTunelstate = 2
                  CoolingTunelspeedTemp = CoolingTunelct
                  CoolingTunelflagStopped = true
                  CoolingTunelflagRunning = false
                  CoolingTunelflagPrint = 1
                }
              }
              CoolingTunelactual = CoolingTunelct
              if(Date.now() - 60000 * CoolingTunelWorktime >= CoolingTunelsec && CoolingTunelsecStop == 0){
                if(CoolingTunelflagRunning && CoolingTunelct){
                  CoolingTunelflagPrint = 1
                  CoolingTunelsecStop = 0
                  CoolingTunelspeed = CoolingTunelct - CoolingTunelspeedTemp
                  CoolingTunelspeedTemp = CoolingTunelct
                  CoolingTunelsec = Date.now()
                }
              }
              CoolingTunelresults = {
                ST: CoolingTunelstate,
                CPQI : CntInCoolingTunel,
                CPQO : CntOutCoolingTunel,
                SP: CoolingTunelspeed
              }
              if (CoolingTunelflagPrint == 1) {
                for (var key in CoolingTunelresults) {
                  if( CoolingTunelresults[key] != null && ! isNaN(CoolingTunelresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L2_LOGS/CUE_PCL_CoolingTunel_l2.log', 'tt=' + CoolingTuneltime + ',var=' + key + ',val=' + CoolingTunelresults[key] + '\n')
                }
                CoolingTunelflagPrint = 0
                CoolingTunelsecStop = 0
                CoolingTuneltime = Date.now()
              }
        //------------------------------------------CoolingTunel----------------------------------------------
        //------------------------------------------Capper----------------------------------------------
              Capperct = CntOutCapper; // NOTE: igualar al contador de salida
              if (CapperONS == 0 && Capperct) {
                CapperspeedTemp = Capperct;
                CapperStartTime = Date.now();
                CapperONS = 1;
              }
              if(Capperct > Capperactual){
                if(CapperflagStopped){
                  Capperspeed = Capperct -CapperspeedTemp;
                  CapperspeedTemp = Capperct;
                  Cappersec = 0;
                  CapperStartTime = Date.now();
                  CapperdeltaRejected = null;
                  CapperRejectFlag = false;
                }
                CappersecStop = 0;
                Cappersec++;
                Cappertime = Date.now();
                Capperstate = 1;
                CapperflagStopped = false;
                CapperflagRunning = true;
              } else if( Capperct == Capperactual ){
                if(CappersecStop == 0){
                  Cappertime = Date.now();
                }
                CappersecStop++;
                if(CappersecStop >= CappertimeStop){
                  Capperspeed = 0;
                  Capperstate = 2;
                  CapperspeedTemp = Capperct;
                  CapperflagStopped = true;
                  CapperflagRunning = false;

                  if(CntInCapper - CntOutCapper - CapperReject.rejected != 0 && ! CapperRejectFlag){
                    CapperdeltaRejected = CntInCapper - CntOutCapper - CapperReject.rejected;
                    CapperReject.rejected = CntInCapper - CntOutCapper;
                    fs.writeFileSync('CapperRejected.json','{"rejected": ' + CapperReject.rejected + '}');
                    CapperRejectFlag = true;
                  }else{
                    CapperdeltaRejected = null;
                  }
                }
                if(CappersecStop % (CappertimeStop * 3) == 0 ||CappersecStop == CappertimeStop ){
                  CapperflagPrint=1;

                  if(CappersecStop % (CappertimeStop * 3) == 0){
                    Cappertime = Date.now();
                    CapperdeltaRejected = null;
                  }
                }
              }
              Capperactual = Capperct;
              if(Cappersec == CapperWorktime){
                Cappersec = 0;
                if(CapperflagRunning && Capperct){
                  CapperflagPrint = 1;
                  CappersecStop = 0;
                  Capperspeed = Math.floor( (Capperct - CapperspeedTemp) / (Date.now() - CapperStartTime) * 60000 );
                  CapperspeedTemp = Capperct;
                }
              }
              Capperresults = {
                ST: Capperstate,
                CPQI: CntInCapper,
                CPQO: CntOutCapper,
                CPQR: CapperdeltaRejected,
                SP: Capperspeed
              };
              if (CapperflagPrint == 1) {
                for (var key in Capperresults) {
                  if(Capperresults[key]!=null&&!isNaN(Capperresults[key]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L2_LOGS/CUE_PCL_Capper_l2.log', 'tt=' + Cappertime + ',var=' + key + ',val=' + Capperresults[key] + '\n');
                }
                CapperflagPrint = 0;
              }
        //------------------------------------------Capper----------------------------------------------
        //------------------------------------------Depucker----------------------------------------------
        //------------------------------------------Depucker----------------------------------------------
              Depuckerct = CntOutDepucker; // NOTE: igualar al contador de salida
              if (DepuckerONS == 0 && Depuckerct) {
                DepuckerspeedTemp = Depuckerct;
                DepuckerStartTime = Date.now();
                DepuckerONS = 1;
              }
              if(Depuckerct > Depuckeractual){
                if(DepuckerflagStopped){
                  Depuckerspeed = Depuckerct -DepuckerspeedTemp;
                  DepuckerspeedTemp = Depuckerct;
                  Depuckersec = 0;
                  DepuckerStartTime = Date.now();
                  DepuckerdeltaRejected = null;
                  DepuckerRejectFlag = false;
                }
                DepuckersecStop = 0;
                Depuckersec++;
                Depuckertime = Date.now();
                Depuckerstate = 1;
                DepuckerflagStopped = false;
                DepuckerflagRunning = true;
              } else if( Depuckerct == Depuckeractual ){
                if(DepuckersecStop == 0){
                  Depuckertime = Date.now();
                }
                DepuckersecStop++;
                if(DepuckersecStop >= DepuckertimeStop){
                  Depuckerspeed = 0;
                  Depuckerstate = 2;
                  DepuckerspeedTemp = Depuckerct;
                  DepuckerflagStopped = true;
                  DepuckerflagRunning = false;

                  if(CntInDepucker - CntOutDepucker - DepuckerReject.rejected != 0 && ! DepuckerRejectFlag){
                    DepuckerdeltaRejected = CntInDepucker - CntOutDepucker - DepuckerReject.rejected;
                    DepuckerReject.rejected = CntInDepucker - CntOutDepucker;
                    fs.writeFileSync('DepuckerRejected.json','{"rejected": ' + DepuckerReject.rejected + '}');
                    DepuckerRejectFlag = true;
                  }else{
                    DepuckerdeltaRejected = null;
                  }
                }
                if(DepuckersecStop % (DepuckertimeStop * 3) == 0 ||DepuckersecStop == DepuckertimeStop ){
                  DepuckerflagPrint=1;

                  if(DepuckersecStop % (DepuckertimeStop * 3) == 0){
                    Depuckertime = Date.now();
                    DepuckerdeltaRejected = null;
                  }
                }
              }
              Depuckeractual = Depuckerct;
              if(Depuckersec == DepuckerWorktime){
                Depuckersec = 0;
                if(DepuckerflagRunning && Depuckerct){
                  DepuckerflagPrint = 1;
                  DepuckersecStop = 0;
                  Depuckerspeed = Math.floor( (Depuckerct - DepuckerspeedTemp) / (Date.now() - DepuckerStartTime) * 60000 );
                  DepuckerspeedTemp = Depuckerct;
                }
              }
              Depuckerresults = {
                ST: Depuckerstate,
                CPQI: CntInDepucker,
                CPQO: CntOutDepucker,
                CPQR: DepuckerdeltaRejected,
                SP: Depuckerspeed
              };
              if (DepuckerflagPrint == 1) {
                for (var key in Depuckerresults) {
                  if(Depuckerresults[key]!=null&&!isNaN(Depuckerresults[key]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L2_LOGS/CUE_PCL_Depucker_l2.log', 'tt=' + Depuckertime + ',var=' + key + ',val=' + Depuckerresults[key] + '\n');
                }
                DepuckerflagPrint = 0;
              }
        //------------------------------------------Depucker-----------------------------------------------


      });//Cierre de lectura

    },1000);
});//Cierre de cliente
client2.on('error', function(err) {
	clearInterval(intId2);
});
client2.on('close', function() {
	clearInterval(intId2);
});


client3.on('connect', function(err) {
  intId3=setInterval(function(){


      client3.readHoldingRegisters(0, 16).then(function(resp) {
        CntOutEOL = joinWord(resp.register[0], resp.register[1]);
        CntOutCheckweigher = joinWord(resp.register[0], resp.register[1]);
        CntInCheckweigher = joinWord(resp.register[2], resp.register[3]);
        CntOutCasePacker = CntInCheckweigher;
        CntInCasePacker = joinWord(resp.register[4], resp.register[5]);
        CntOutLabeller = CntInCasePacker;

                //------------------------------------------Labeller----------------------------------------------
                      Labellerct = CntInLabeller; // NOTE: igualar al contador de salida
                      if (LabellerONS == 0 && Labellerct) {
                        LabellerspeedTemp = Labellerct;
                        LabellerStartTime = Date.now();
                        LabellerONS = 1;
                      }
                      if(Labellerct > Labelleractual){
                        if(LabellerflagStopped){
                          Labellerspeed = Labellerct -LabellerspeedTemp;
                          LabellerspeedTemp = Labellerct;
                          Labellersec = 0;
                          LabellerStartTime = Date.now();
                          LabellerdeltaRejected = null;
                          LabellerRejectFlag = false;
                        }
                        LabellersecStop = 0;
                        Labellersec++;
                        Labellertime = Date.now();
                        Labellerstate = 1;
                        LabellerflagStopped = false;
                        LabellerflagRunning = true;
                      } else if( Labellerct == Labelleractual ){
                        if(LabellersecStop == 0){
                          Labellertime = Date.now();
                        }
                        LabellersecStop++;
                        if(LabellersecStop >= LabellertimeStop){
                          Labellerspeed = 0;
                          Labellerstate = 2;
                          LabellerspeedTemp = Labellerct;
                          LabellerflagStopped = true;
                          LabellerflagRunning = false;

                          if(CntInLabeller - CntOutLabeller - LabellerReject.rejected != 0 && ! LabellerRejectFlag){
                            LabellerdeltaRejected = CntInLabeller - CntOutLabeller - LabellerReject.rejected;
                            LabellerReject.rejected = CntInLabeller - CntOutLabeller;
                            fs.writeFileSync('LabellerRejected.json','{"rejected": ' + LabellerReject.rejected + '}');
                            LabellerRejectFlag = true;
                          }else{
                            LabellerdeltaRejected = null;
                          }
                        }
                        if(LabellersecStop % (LabellertimeStop * 3) == 0 ||LabellersecStop == LabellertimeStop ){
                          LabellerflagPrint=1;

                          if(LabellersecStop % (LabellertimeStop * 3) == 0){
                            Labellertime = Date.now();
                            LabellerdeltaRejected = null;
                          }
                        }
                      }
                      Labelleractual = Labellerct;
                      if(Labellersec == LabellerWorktime){
                        Labellersec = 0;
                        if(LabellerflagRunning && Labellerct){
                          LabellerflagPrint = 1;
                          LabellersecStop = 0;
                          Labellerspeed = Math.floor( (Labellerct - LabellerspeedTemp) / (Date.now() - LabellerStartTime) * 60000 );
                          LabellerspeedTemp = Labellerct;
                        }
                      }
                      Labellerresults = {
                        ST: Labellerstate,
                        CPQI: CntInLabeller,
                        CPQO: CntOutLabeller,
                        CPQR: LabellerdeltaRejected,
                        SP: Labellerspeed
                      };
                      if (LabellerflagPrint == 1) {
                        for (var key in Labellerresults) {
                          if(Labellerresults[key]!=null&&!isNaN(Labellerresults[key]))
                          //NOTE: Cambiar path
                          fs.appendFileSync('C:/PULSE/L2_LOGS/CUE_PCL_Labeller_l2.log', 'tt=' + Labellertime + ',var=' + key + ',val=' + Labellerresults[key] + '\n');
                        }
                        LabellerflagPrint = 0;
                      }
                //------------------------------------------Labeller----------------------------------------------
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
              if(secEOL>=60 && CntOutEOL){
                fs.appendFileSync("C:/PULSE/L2_LOGS/CUE_PCL_EOL_l2.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                secEOL=0;
              }else{
                secEOL++;
              }
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
        //------------------------------------------CasePacker----------------------------------------------
              CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
              if (!CasePackerONS && CasePackerct) {
                CasePackerspeedTemp = CasePackerct
                CasePackersec = Date.now()
                CasePackerONS = true
                CasePackertime = Date.now()
              }
              if(CasePackerct > CasePackeractual){
                if(CasePackerflagStopped){
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                  CasePackerdeltaRejected = null
                  CasePackerRejectFlag = false
                  CasePackertime = Date.now()
                }
                CasePackersecStop = 0
                CasePackerstate = 1
                CasePackerflagStopped = false
                CasePackerflagRunning = true
              } else if( CasePackerct == CasePackeractual ){
                if(CasePackersecStop == 0){
                  CasePackertime = Date.now()
                  CasePackersecStop = Date.now()
                }
                if( ( Date.now() - ( CasePackertimeStop * 1000 ) ) >= CasePackersecStop ){
                  CasePackerspeed = 0
                  CasePackerstate = 2
                  CasePackerspeedTemp = CasePackerct
                  CasePackerflagStopped = true
                  CasePackerflagRunning = false
                  CasePackerflagPrint = 1
                }
              }
              CasePackeractual = CasePackerct
              if(Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0){
                if(CasePackerflagRunning && CasePackerct){
                  CasePackerflagPrint = 1
                  CasePackersecStop = 0
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                }
              }
              CasePackerresults = {
                ST: CasePackerstate,
                CPQI : CntInCasePacker,
                CPQO : CntOutCasePacker,
                SP: CasePackerspeed
              }
              if (CasePackerflagPrint == 1) {
                for (var key in CasePackerresults) {
                  if( CasePackerresults[key] != null && ! isNaN(CasePackerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L2_LOGS/CUE_PCL_CasePacker_l2.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
                }
                CasePackerflagPrint = 0
                CasePackersecStop = 0
                CasePackertime = Date.now()
              }
        //------------------------------------------CasePacker----------------------------------------------
        //------------------------------------------Checkweigher----------------------------------------------
              Checkweigherct = CntOutCheckweigher; // NOTE: igualar al contador de salida
              if (CheckweigherONS == 0 && Checkweigherct) {
                CheckweigherspeedTemp = Checkweigherct;
                CheckweigherStartTime = Date.now();
                CheckweigherONS = 1;
              }
              if(Checkweigherct > Checkweigheractual){
                if(CheckweigherflagStopped){
                  Checkweigherspeed = Checkweigherct -CheckweigherspeedTemp;
                  CheckweigherspeedTemp = Checkweigherct;
                  Checkweighersec = 0;
                  CheckweigherStartTime = Date.now();
                  CheckweigherdeltaRejected = null;
                  CheckweigherRejectFlag = false;
                }
                CheckweighersecStop = 0;
                Checkweighersec++;
                Checkweighertime = Date.now();
                Checkweigherstate = 1;
                CheckweigherflagStopped = false;
                CheckweigherflagRunning = true;
              } else if( Checkweigherct == Checkweigheractual ){
                if(CheckweighersecStop == 0){
                  Checkweighertime = Date.now();
                }
                CheckweighersecStop++;
                if(CheckweighersecStop >= CheckweighertimeStop){
                  Checkweigherspeed = 0;
                  Checkweigherstate = 2;
                  CheckweigherspeedTemp = Checkweigherct;
                  CheckweigherflagStopped = true;
                  CheckweigherflagRunning = false;

                  if(CntInCheckweigher - CntOutCheckweigher - CheckweigherReject.rejected != 0 && ! CheckweigherRejectFlag){
                    CheckweigherdeltaRejected = CntInCheckweigher - CntOutCheckweigher - CheckweigherReject.rejected;
                    CheckweigherReject.rejected = CntInCheckweigher - CntOutCheckweigher;
                    fs.writeFileSync('CheckweigherRejected.json','{"rejected": ' + CheckweigherReject.rejected + '}');
                    CheckweigherRejectFlag = true;
                  }else{
                    CheckweigherdeltaRejected = null;
                  }
                }
                if(CheckweighersecStop % (CheckweighertimeStop * 3) == 0 ||CheckweighersecStop == CheckweighertimeStop ){
                  CheckweigherflagPrint=1;

                  if(CheckweighersecStop % (CheckweighertimeStop * 3) == 0){
                    Checkweighertime = Date.now();
                    CheckweigherdeltaRejected = null;
                  }
                }
              }
              Checkweigheractual = Checkweigherct;
              if(Checkweighersec == CheckweigherWorktime){
                Checkweighersec = 0;
                if(CheckweigherflagRunning && Checkweigherct){
                  CheckweigherflagPrint = 1;
                  CheckweighersecStop = 0;
                  Checkweigherspeed = Math.floor( (Checkweigherct - CheckweigherspeedTemp) / (Date.now() - CheckweigherStartTime) * 60000 );
                  CheckweigherspeedTemp = Checkweigherct;
                }
              }
              Checkweigherresults = {
                ST: Checkweigherstate,
                CPQI: CntInCheckweigher,
                CPQO: CntOutCheckweigher,
                CPQR: CheckweigherdeltaRejected,
                SP: Checkweigherspeed
              };
              if (CheckweigherflagPrint == 1) {
                for (var key in Checkweigherresults) {
                  if(Checkweigherresults[key]!=null&&!isNaN(Checkweigherresults[key]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L2_LOGS/CUE_PCL_Checkweigher_l2.log', 'tt=' + Checkweighertime + ',var=' + key + ',val=' + Checkweigherresults[key] + '\n');
                }
                CheckweigherflagPrint = 0;
              }
        //------------------------------------------Checkweigher----------------------------------------------

      });//Cierre de lectura

    },1000);
});//Cierre de cliente
client3.on('error', function(err) {
	clearInterval(intId3);
});
client3.on('close', function() {
	clearInterval(intId3);
});

//------------------------------Cerrar-código------------------------------
var shutdown = function () {
  client1.close()
  client2.close()
  client3.close()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
//------------------------------Cerrar-código------------------------------

}catch(err){
    fs.appendFileSync("error.log",err + '\n');
}
