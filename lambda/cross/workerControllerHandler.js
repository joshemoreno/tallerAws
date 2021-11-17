const sqsManager = require("./../utilities/sqsManager");
const daoManager    = require("./../utilities/daoManager");
const util = require("./../utilities/common");
const topicsRequestDto = require("./../dtos/topicsManger/topicsRequestDto");
const auditoryDto = require("./../dtos/auditory/auditoryDto");
const sqsAuditory = process.env.QUEUE_AUDITORY;
const tableTopics = process.env.TABLE_TOPICS;
const dbRegion = process.env.REGION_DB;

module.exports.handler = async () => {
    var currentDay = new Date().getDate();
    var currentMonth = new Date().getMonth()+1;
    var currentYear = new Date().getFullYear();
    var items = [];
    var itemsPast = [];

    if(currentMonth.toString().length === 1){
        month = `0${currentMonth}`;
    }
 
    try {
    var searchField = 'schedulingDate';
    var updateField = 'topicStatus';
    var searchData = `${currentYear}-${month}-${currentDay}`;
    // var searchData = `2021-08-20`;
    var statusTopic = await daoManager.searchAll(dbRegion,tableTopics,searchField,searchData);
    items = statusTopic.Items;
    if (items.length != 0){
        for (let i = 0; i < items.length; i++) {
            var updateData = 'progreso';
            var id =  items[i].id.S;
            var statusTopic = await daoManager.updateRecord(dbRegion,tableTopics,id,updateField,updateData);
        }
    }

    searchData = `${currentYear}-${month}-${currentDay-1}`;
    var statusTopic = await daoManager.searchAll(dbRegion,tableTopics,searchField,searchData);
    itemsPast = statusTopic.Items;
    if (itemsPast.length != 0){
        for (let i = 0; i < itemsPast.length; i++) {
            var updateData = 'finalizado';
            var id =  itemsPast[i].id.S;
            var statusTopic = await daoManager.updateRecord(dbRegion,tableTopics,id,updateField,updateData);
        }
    }

    return util.cargaClientResponse(200,"Solicitud recibida", searchData);
    
    } catch (error) {
        util.insertLog("Error en userControllerHandler: " + error);
        return util.cargaClientResponse(500,"" + error);
    }

};