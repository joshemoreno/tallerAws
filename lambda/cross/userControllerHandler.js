const sqsManager = require("./../utilities/sqsManager");
const daoManager    = require("./../utilities/daoManager");
const util = require("./../utilities/common");
const userRequestDto = require("./../dtos/userManager/userRequestDto");
const auditoryDto = require("./../dtos/auditory/auditoryDto");
const sqsAuditory = process.env.QUEUE_AUDITORY;
const tableUser = process.env.TABLE_USER;

module.exports.handler = async (event, context) => {
  var data = JSON.parse(event.body);
  var msgId = context.awsRequestId;

  try {
    var infoRequest = new userRequestDto();
    if(!infoRequest.isLoad(data)){
      return util.cargaClientResponse(400,"Invalid Request!", data);
    };
    var params = {
      TableName: tableUser,
      Item: data
    };
    util.insertLog("Objeto para DDB: ",JSON.stringify(params));

    var statusUser = await daoManager.searchById(context,tableUser,'id',data.id);
    if (statusUser!=null){
      return util.cargaClientResponse(202,"Solicitud rechazada: El usuario ya existe." , data);  
    }else{
      // Registro de usuarios
      const response = await daoManager.register(context,params);
      util.insertLog("Resultado Insert DDBB: ",JSON.stringify(response));

      // Registro de auditoria
      var infoAuditory = new auditoryDto(msgId,"Init", infoRequest, {});
      var resultAudit = await sqsManager.sendMessage(context, infoAuditory, sqsAuditory);
      util.insertLog("Result envío SQS Auditoria: " + JSON.stringify(resultAudit));

      return util.cargaClientResponse(200,"Solicitud recibida", data);
    }
  } catch (error) {
    util.insertLog("Error en userControllerHandler: " + error);
    var infoAuditory = new auditoryDto(msgId, 500, "Error en userControllerHandler" );
    return util.cargaClientResponse(500,"" + error);

  }
};
