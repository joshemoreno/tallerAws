const sqsManager = require("./../utilities/sqsManager");
const daoManager    = require("./../utilities/daoManager");
const util = require("./../utilities/common");
const topicsRequestDto = require("./../dtos/topicsManger/topicsRequestDto");
const auditoryDto = require("./../dtos/auditory/auditoryDto");
const sqsAuditory = process.env.QUEUE_AUDITORY;
const tableTopics = process.env.TABLE_TOPICS;

module.exports.handler = async (event, context) => {
  var data = JSON.parse(event.body);
  var msgId = context.awsRequestId;
  var currentDay = new Date().getDate();
  var currentMonth = new Date().getMonth();
  var currentYear = new Date().getFullYear();
  var day = parseInt(data.schedulingDate.split('/')[0]);
  var month = parseInt(data.schedulingDate.split('/')[1])-1;
  var year= parseInt(data.schedulingDate.split('/')[2]);

  var scheduling = new Date(year,month,day);
  var currentDate = new Date(currentYear,currentMonth,currentDay);

  try {
    var infoRequest = new topicsRequestDto();
    if(!infoRequest.isLoad(data)){
      return util.cargaClientResponse(400,"Invalid Request!", data);
    };
    data.id=data.name+"-"+data.schedulingDate;
    data.status="Programado";

    var params = {
      TableName: tableTopics,
      Item: data
    };
    util.insertLog("Objeto para DDB: ",JSON.stringify(params));

    var statusTopic = await daoManager.searchById(context,tableTopics,'id',data.id);
    if (statusTopic!=null){
      return util.cargaClientResponse(202,"Solicitud rechazada: El tema ya existe." , data);
    }else{
      if (scheduling > currentDate){
        // Registro de tema
        const response = await daoManager.register(context,params);
        util.insertLog("Resultado Insert DDBB: ",JSON.stringify(response));
  
        // Registro de auditoria
        var infoAuditory = new auditoryDto(msgId,"Init", data, {});
        var resultAudit = await sqsManager.sendMessage(context, infoAuditory, sqsAuditory);
        util.insertLog("Result envío SQS Auditoria: " + JSON.stringify(resultAudit));
  
      }else{
        return util.cargaClientResponse(400,"Invalid schedulingDate!",data);
      }
      return util.cargaClientResponse(200,"Solicitud recibida", data);
    }

  } catch (error) {
    util.insertLog("Error en userControllerHandler: " + error);
    var infoAuditory = new auditoryDto(msgId, 500, "Error en topicsControllerHandler" );
    return util.cargaClientResponse(500,"" + error);
  }

};
