const util = require("./../utilities/common");
const jwt = require('jsonwebtoken');

const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
      const policyDocument = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      const statementOne = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }
    return authResponse;
  };


module.exports.auth = (event, context, callback) => {
    
    console.log('event', event);
    if (!event.authorizationToken) {
        return callback('Unauthorized');
    }

    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];

    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        return callback('Unauthorized');
    }

    try {
        jwt.verify(tokenValue, 'QVmsxAcs-i5k4G7-X.d46gCIV-8x7J_0NL', (verifyError, decoded) => {
            if (verifyError) {
                console.log('verifyError', verifyError);
                console.log(`Token invalid. ${verifyError}`);
                return callback('Unauthorized');
            }
            console.log('valid from customAuthorizer', decoded);
            return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
            });
        } catch (err) {
            console.log('catch error. Invalid token', err);
            return callback('Unauthorized');
        }
};