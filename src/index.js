var bunyan = require('bunyan');

var getLogger = function (category, options, simple) {

    if (this.fields.category) {
        category = this.fields.category + '.' + category;
    }

    options = options || {};

    options.category = category;

    var child = this.child(options, simple);

    child.getLogger = getLogger;

    return child;
};

function getFullErrorStack (ex) {
    var ret = ex.stack || ex.toString();
    if (ex.cause && typeof (ex.cause) === 'function') {
        var cex = ex.cause();
        if (cex) {
            ret += '\nCaused by: ' + getFullErrorStack(cex);
        }
    }
    return (ret);
}

bunyan.getLogger = getLogger;

bunyan.create = function (category, options) {

    var baseOptions = {
        name: category,
        category: category,
        serializers: {
            req: bunyan.stdSerializers.req,
            res: bunyan.stdSerializers.res,

            err: function (err) {
                if (!err || !err.stack) {
                    return err;
                }


                if (typeof err.getFullStack === 'function') {
                    err.stack = err.getFullStack();
                }

                var obj = {
                    message: err.message,
                    name: err.name,
                    stack: getFullErrorStack(err),
                    code: err.code,
                    signal: err.signal
                };

                if (err.details) {
                    obj.details = err.details;
                }

                if (err.list) {
                    obj.list = err.list;
                }

                return obj;

                // return bunyan.stdSerializers.err(error);

            }
        }

    };

    options = options || {};

    options = Object.assign(options, baseOptions);

    if (options.logResponseBody) {
        delete options.logResponseBody;
        options.serializers.res = function (res) {
            if (!res || !res.statusCode) {
                return res;
            } else {
                return {
                    statusCode: res.statusCode,
                    header: res._header,
                    body: res.body
                };
            }
        };
    }

    var logger = bunyan.createLogger(options);

    logger.getLogger = getLogger;


    return logger;

};

module.exports = bunyan;
