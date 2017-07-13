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

bunyan.getLogger = getLogger;

bunyan.create = function (category, options) {

    var baseOptions = {
        name: category,
        category: category,
        serializers: {
            err: function (error) {

                if (typeof error.getFullStack === 'function') {
                    error.stack = error.getFullStack();
                }

                return bunyan.stdSerializers.err(error);

            }
        }

    };

    options = options || {};

    options = Object.assign(options, baseOptions);

    var logger = bunyan.createLogger(options);

    logger.getLogger = getLogger;


    return logger;

};

module.exports = bunyan;
