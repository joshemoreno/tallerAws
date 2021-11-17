const daoManager    = require("./../utilities/daoManager");
const util = require("./../utilities/common");
const tableTopics = process.env.TABLE_TOPICS;
const dbRegion = process.env.REGION_DB;

module.exports.handler = async () => {

    try {
    var field = 'topicStatus';
    var data = 'progreso';
    var statusTopic = await daoManager.searchAll(dbRegion,tableTopics,field,data);
    return util.cargaClientResponse(200,"Solicitud recibida", statusTopic);

    } catch (error) {
        util.insertLog("Error en userControllerHandler: " + error);
        // var infoAuditory = new auditoryDto(msgId, 500, "Error en topicsControllerHandler" );
        return util.cargaClientResponse(500,"" + error);
    }

}