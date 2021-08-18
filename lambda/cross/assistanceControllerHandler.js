const sqsManager = require("./../utilities/sqsManager");
const daoManager    = require("./../utilities/daoManager");
const util = require("./../utilities/common");
const assistanceRequestDto = require("./../dtos/assistance/assistanceRequestDto");
const auditoryDto = require("./../dtos/auditory/auditoryDto");
const sqsAuditory = process.env.QUEUE_AUDITORY;
const tableAssistance = process.env.TABLE_ASSISTANCE;
const tableTopics = process.env.TABLE_TOPICS;
const tableUser = process.env.TABLE_USER;

module.exports.handler = async (event, context) => {
  var data = JSON.parse(event.body);
  var msgId = context.awsRequestId;

  try {
    var infoRequest = new assistanceRequestDto();
    if(!infoRequest.isLoad(data)){
      return util.cargaClientResponse(400,"Invalid Request!", data);
    };

    var statusUser = await daoManager.searchById(context,tableUser,'id',data.id);
    util.insertLog("Resultdo Consulta Status People DB: " +  JSON.stringify(statusUser));
    if (statusUser!=null){
      if (statusUser.status.toLowerCase() ==='inactivo'){ 
        util.insertLog("202-Solicitud rechazada: El usuario esta inactivo." + data);              
        return util.cargaClientResponse(202,"Solicitud rechazada: El usuario esta inactivo." , data);     
      }else{
        var statusTopic = await daoManager.searchById(context,tableTopics,'id',data.topic);
        util.insertLog("Resultdo Consulta Status People DB: " +  JSON.stringify(statusTopic));
        if (statusTopic!=null){
          if (!statusTopic.status.toLowerCase()==='progreso'){ 
            util.insertLog("202-Solicitud rechazada: El tema no esta en progreso." + data);              
            return util.cargaClientResponse(202,"Solicitud rechazada: El tema no esta en progreso." , data);  
          }else{
            var params ={
              TableName: tableAssistance, 
              Item: {
                id:statusUser.id,
                tema:statusTopic.id,
                fecha:statusTopic.schedulingDate
              }
            };
            var response = await daoManager.register(context,params);
            util.insertLog("Objeto para Asistencia DB: " +  JSON.stringify(params));
    
            var infoAuditory = new auditoryDto(msgId, 200, "Registro Satisfactorio assistanceControllerHandler");
            sqsManager.sendMessage(context,infoAuditory, sqsAuditory); 
            return util.cargaClientResponse(200,"Solicitud aceptada: El usuario asistio." , data);  
          }
        }else{
          return util.cargaClientResponse(202,"Solicitud rechazada: El tema no se encuentra registrado." , data);
        }
      }
    }else{
      return util.cargaClientResponse(202,"Solicitud rechazada: El usuario no se encuentra registrado." , data); 
    }

  } catch (error) {
    util.insertLog("Error en userControllerHandler: " + error);
    var infoAuditory = new auditoryDto(msgId, 500, "Error en assistanceControllerHandler" );
    return util.cargaClientResponse(500,"" + error);
  }
};
