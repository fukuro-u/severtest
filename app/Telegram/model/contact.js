
let telegram = require('../../Models/Telegram');
let Phone    = require('../../Models/Phone');
let UserInfo = require('../../Models/UserInfo');
let helpers  = require('../../Helpers/Helpers');

module.exports = function(redT, id, contact) {
	let phoneCrack = helpers.phoneCrack(contact);
	if (phoneCrack) {
		Phone.findOne({'phone':phoneCrack.phone}, 'uid region phone', function(err, check1){
			if (check1) {
				try {
					telegram.create({'form':id, 'phone':phoneCrack.phone}, function(err, cP){
						phoneCrack = null;
						if (!!cP) {
							UserInfo.findOneAndUpdate({id:check1.uid}, {$set:{veryphone:true,veryold:true}, $inc:{red:2000}}).exec(function(err, info){
								if(!!info){
									redT.telegram.sendMessage(id, '_XÁC THỰC THÀNH CÔNG_\nBạn nhận được +2000 Vào tài khoản *'+info.name+'*, chúc bạn chơi game vui vẻ...', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
									if (void 0 !== redT.users[check1.uid]) {
										redT.users[check1.uid].forEach(function(client){
											client.red({notice:{title:'THÀNH CÔNG', text: 'Xác thực thành công.!\nBạn nhận được +2000 trong tài khoản.\nChúc bạn chơi game vui vẻ...'}, user:{red:info.red*1+2000, phone:helpers.cutPhone(check1.region+check1.phone), veryphone:true}});
										});
									}
									redT = null;
									id = null;
								}
							});
						}else{
							redT.telegram.sendMessage(id, '_Thao tác thất bại_', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
							redT = null;
							id = null;
						}
					});
				} catch (error) {
					redT.telegram.sendMessage(id, '_Thao tác thất bại_', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
					redT = null;
					id = null;
					phoneCrack = null;
				}
			}else{
				redT.telegram.sendMessage(id, 'Số điện thoại này chưa được đăng ký. Vui lòng đăng ký tại Ku789', {parse_mode:'markdown',reply_markup:{remove_keyboard:true}});
				redT = null;
				phoneCrack = null;
				id = null;
			}
		});
	}
}
