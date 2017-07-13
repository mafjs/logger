var terror = require('maf-error');

var TestError = terror.create('TestError', {
    TEST_CODE: 'test code: %code%'
});

var Logger = require('../src/index');

var logger = Logger.create('test');

logger.info('1');

var l1 = logger.getLogger('test1', {test: 1});

l1.info('1');


var l2 = l1.getLogger('test2', {test: 2});

l2.info('2');

var oe = new Error('original error');

var e = new TestError(TestError.CODES.TEST_CODE, oe)
    .bind({code: '100500'});

l2.error(e);
