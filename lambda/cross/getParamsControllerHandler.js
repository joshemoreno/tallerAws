const daoManager = require("./../utilities/daoManager");
const util = require("./../utilities/common");
const tableParams = process.env.TABLE_PARAMS;
// const dbRegion = process.env.REGION_DB;

module.exports.handler = async (event, context) => {

    try {
    var param = event.queryStringParameters.typeParam;
    var params = await daoManager.searchById(context,tableParams,'typeParam',param);

    return util.cargaClientResponse(200,"Solicitud recibida", params);

    } catch (error) {
        util.insertLog("Error en userControllerHandler: " + error);
        // var infoAuditory = new auditoryDto(msgId, 500, "Error en topicsControllerHandler" );
        return util.cargaClientResponse(500,"" + error);
    }

}