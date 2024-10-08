
let CronJob = require('cron').CronJob;
let CronHu          = require('../app/Cron/EventHu');
let XSMB            = require('../app/Cron/XSMB/XSMB');
let XSMB_trathuong  = require('../app/Cron/XSMB/XSMB_trathuong');

module.exports = function() {
	new CronJob('0 0 0 * * *', function() {
		CronHu();
	}, null, true, 'Asia/Ho_Chi_Minh');

	 new CronJob('0 30 19 * * *', function() {
	 	XSMB();
	 }, null, true, 'Asia/Ho_Chi_Minh');

	new CronJob('0 45 19 * * *', function() {
		XSMB_trathuong();
	}, null, true, 'Asia/Ho_Chi_Minh');
}
