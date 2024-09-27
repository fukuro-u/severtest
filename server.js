require('dotenv').config();
let express = require('express');
let app = express();
let expressWs  = require('express-ws')(app);
let redT = expressWs.getWss()
let cors = require('cors');
let bodyParser = require('body-parser');
let configDB = require('./config/database');
let mongoose = require('mongoose');
require('mongoose-long')(mongoose);

//let fs 		= require('fs');
let Telegram      = require('node-telegram-bot-api');
let TelegramToken = process.env.TELEGRAM_KEY || '';
let TelegramBot   = new Telegram(TelegramToken, {polling: true});
// TelegramBot.setWebHook(`${process.env.BOT_WEBHOOK}/bot-${TelegramToken}`);
let port = process.env.PORT || 80;
app.use(cors({
    origin: [
        'https://redapp.pages.dev',
        process.env.EXTRA_ORIGIN || 'n.o.t'
    ],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

mongoose.connect(configDB.url, configDB.options).then(
  () => { initApp(); },
  err => { 
	console.log("Error connect MongoDB " +err.reason);
	process.exit(1);
  }
);

let initApp = () =>{
	process.redT = redT;
	redT.telegram = TelegramBot;                                                                    
	global['redT'] = redT;
	global['userOnline'] = 0;
	require('./app/Helpers/socketUser')(redT);
	require('./routerHttp')(app, redT);                                                             
	// require('./routerCMS')(app, redT);
	require('./routerSocket')(app, redT);
	require('./app/Cron/taixiu')(redT);
	require('./app/Cron/baucua')(redT);
	require('./config/cron')();
	require('./app/Telegram/Telegram')(redT); // Telegram Bot
	app.listen(port, function() {
	    console.log("Server listen on port ", port);
	});
}
