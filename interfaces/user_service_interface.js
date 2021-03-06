var bluebird = require('bluebird');
var request = bluebird.promisifyAll(require('request'), {multiArgs: true}); // See: http://stackoverflow.com/questions/34796172/request-getasync-only-returns-1-parameters
var current_env = process.env.NODE_ENV || "development";
var config = require('../config/config.json');
var timeout = config['product-configuration']['httpTimeout'];
var baseUrl = config['service-connection'][current_env]['user-service'];
var urls = require('../config/url.json')['user-service'];

var parseResponseMessage = function (body) {
    var obj = JSON.parse(body);

    if (obj.type !== undefined && obj.type === "Error") {
        throw new Error(obj.message);
    }

    return obj;
};

exports.requestUserArticles = function (userId, classifyId, pageNumber) {
    classifyId = classifyId || 0;
    pageNumber = pageNumber || 0;

    var url = urls['getUserArticles'].replace(':userId', userId.toString())
                                     .replace(':classifyId', classifyId.toString())
                                     .replace(':pageNumber', pageNumber.toString());

    return request.getAsync({
        url:  url,
        baseUrl: baseUrl,
        timeout: timeout
    }).spread((res, body) => {
        var obj = parseResponseMessage(body);       
        return obj;
    });
};

exports.requestUserInformation = function (userId) {
    var url = urls['getUserInformation'].replace(':userId', userId);

    return request.getAsync({
        url:  url,
        baseUrl: baseUrl,
        timeout: timeout
    }).spread((res, body) => {
        var obj = parseResponseMessage(body);       
        return obj;
    });
};

exports.requestUserInformationByTelephone = function (telephone) {
    var url = urls['getUserInformationByTelephone'].replace(':telephone', telephone);

    return request.getAsync({
        url:  url,
        baseUrl: baseUrl,
        timeout: timeout
    }).spread((res, body) => {
        var obj = parseResponseMessage(body);       
        return obj;
    });
}