const AWS =require('aws-sdk');
const util = require("./common");

module.exports.register = async (context, params) => {
    var mensajeText;
    var dbRegion = context.invokedFunctionArn.split(':')[3];  
    var documentClient = new AWS.DynamoDB.DocumentClient({region: dbRegion});

    try{
        await documentClient.put(params, function(err, data) {
            if (err) {
                mensajeText = util.cargaMensaje(201,err);
            } else {
                mensajeText = util.cargaMensaje(200,'Registro Satisfactorio');
            }
        }).promise();
        return mensajeText;
    }
    catch(err){
        mensajeText = util.cargaMensaje(500,"" + err);
        util.insertLog("Error en daoManager.register: " + err);
        return mensajeText;
    }

};

module.exports.searchById = async (context, tableName, nameKey, valueKey) => {
    var mensajeText;
    var dbRegion = context.invokedFunctionArn.split(':')[3];  
    var documentClient = new AWS.DynamoDB.DocumentClient({region: dbRegion});

    var paramsGet = {
        TableName : tableName,
        Key: {}
    };
    paramsGet.Key[nameKey] = valueKey;
    try{
        await documentClient.get(paramsGet, function(error, data) {
            if (error) {
                mensajeText=null
            } else {
                mensajeText=data.Item;               
            }
            util.insertLog("Resultado consulta en DynamoDB: " + 
                JSON.stringify({
                    resultado: mensajeText,
                    parametros: data 
                })
            );
        }).promise();
        return mensajeText;
    }
    catch(err){
        mensajeText = util.cargaMensaje(500,"" + err);
        util.insertLog("Error en daoManeger.searchById: " + err);
        return mensajeText;
    }
    
};

module.exports.searchAll = async (context, tableName, field, data) => {
    var mensajeText;
    var documentClient = new AWS.DynamoDB({region: context});
    var statement='';

    if (field==null){
        statement = `SELECT * FROM "${tableName}"`;
    }else{
        statement = `SELECT * FROM "${tableName}" WHERE "${field}" = '${data}'`;
    }

    var paramsGet = {
        Statement: statement
    };

    try{
        await documentClient.executeStatement(paramsGet, function(error, data) {
            if (error) {
                mensajeText=error
            } else {
                mensajeText=data;               
            }
            util.insertLog("Resultado consulta en DynamoDB: " + 
                JSON.stringify({
                    resultado: mensajeText,
                    parametros: data 
                })
            );
        }).promise();
        return mensajeText;
    }
    catch(err){
        mensajeText = util.cargaMensaje(500,"" + err);
        util.insertLog("Error en daoManeger.searchById: " + err);
        return mensajeText;
    }
    
};



module.exports.updateRecord = async (context, tableName, id, field, data) => {
    var mensajeText;
    var documentClient = new AWS.DynamoDB.DocumentClient({region: context});

    var paramsUpdate = {
        TableName: tableName,
        Key:{
            "id":id,
        },
        UpdateExpression: `set ${field} = :data`,
        ExpressionAttributeValues: {
            ":data": data,
        }
    };

    try{
        await documentClient.update(paramsUpdate, function(error, data) {
            if (error) {
                mensajeText=error
            } else {
                mensajeText=data;               
            }
            util.insertLog("Resultado consulta en DynamoDB: " + 
                JSON.stringify({
                    resultado: mensajeText,
                    parametros: data 
                })
            );
        }).promise();
        return mensajeText;
    }
    catch(err){
        mensajeText = util.cargaMensaje(500,"" + err);
        util.insertLog("Error en daoManeger.searchById: " + err);
        return mensajeText;
    }
    
};