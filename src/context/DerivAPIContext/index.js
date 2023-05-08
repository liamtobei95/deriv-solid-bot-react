import React, { useState, useEffect } from "react";
import {NotificationContainer, NotificationManager} from 'react-notifications';

import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089; // Replace with your app_id or leave as 1089 for testing.
let connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
// const api = new DerivAPIBasic({ connection });
let default_modal = "0.35";
let market = "R_100";
let currency = "USD";
let p_arr_d = '';
let settings = {
	currentMarket : "R_100",
    currentTargetProfit : "35",
    currentStopLoss : "10",
    currentModal : default_modal,
    modalOriginal : default_modal,
    ModalTracking : default_modal,
    ModalTracking2 : default_modal,
    currentToken : "",
    countTrendDown : 0,
    countTrendUP : 0,
    rangeJumpPrice : 0,
    rangeJumpPriceUp : 0,
    rangeJumpPriceDown : 0,
    BreakerVal : "",
    curMovement : "Down",
    ProfitNow : "0.00",
    OPStatus : "START",
    globalOpenPos : "STOP",
    paramTradeKind : "Digit Over",
	paramTickKind : "1",
    arrayDgtVal : "0",
    arrayUpdownVal : '"Down"',
    curMovementArr : '"Down"',
    countOP : 0,
    barrierTrade : 0,
    digitBefore : 0,
    countSameDigit : 1,
	balanceNow : 0,
	isAuthorized : false,
}



const DerivAPIContextTemplate = {
	info: {},
	table: [],
	notifications: [],
	auThorized: () => {},
	logout: () => {},
	updateSettings: () => {},
	startTrade: () => {},
	pauseTrade: () => {},

};

const DerivAPIContext = React.createContext(DerivAPIContextTemplate);

const DerivAPIProvider = ({children}) => {

	const [info, setInfo] = useState(
		{
			isAuthorized: false, 
			balance: 0, 
			email: "", 
			currency: "",
			fullname: "",
			loginid: "",
			profit: 0,
			profitPercent: 0,
			ModalTracking: 0,
			target: 0,
			stop: 0,
			isStarted: false,
		});
	const [pattern, setPattern] = useState("");
	const [table, setTable] = useState([]);
	const [notifications, setNotifications] = useState([]);

	useEffect(()=>{
		testWebSocket();
	},[])
	
	const createNotification = (type, title, message) => {
        
		switch (type) {
		  case 'info':
			NotificationManager.info(message);
			break;
		  case 'success':
			NotificationManager.success(title, message);
			break;
		  case 'warning':
			NotificationManager.warning(title, message, 3000);
			break;
		  case 'error':
			NotificationManager.error(title, message, 5000, () => {
			});
			break;
		}
	}

	const initWebSocket = () => {
		connection = new WebSocket(
			`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
		  );
		  testWebSocket();
	}
	const testWebSocket = () => {
		connection.onopen = function (evt) { onOpen(evt) };
		connection.onmessage = function (evt) { onMessage(evt) };
		connection.onerror = function (evt) { onError(evt)};
		connection.onclose = function (evt) { onClose(evt)};

	}
	const onOpen = (evt) => {

		var tokenThisSession = localStorage.getItem("token") || settings.currentToken;
		if(tokenThisSession.length > 0){
			settings.currentToken = tokenThisSession;
			auThorized(tokenThisSession);
		}
		
	}
	
	const auThorized = (token) => {
		console.log(token, "here");
		localStorage.setItem("token", token);
		settings.currentToken = token;
		if(connection.readyState == WebSocket.CLOSED)
			initWebSocket();
		else{
			connection.send(JSON.stringify({ authorize: token }));
			setNotifications(prev => ([getTimeStamp() + " - Try to Connecting..", ...prev]) );
		}
	}

	const logout = () => {
		connection.close();
		localStorage.removeItem("token");
		setInfo({isAuthorized: false});
	}
	
	const updateSettings = (updated) => {
		settings = {...settings, ...updated};
		setNotifications(prev => ([
			'<span style="color: #b522b5;"> Setting has been changed!</span>',
			...prev
		]))
	}

	function onMessage(evt) {
    
		// var timestamp = dateFormat(new Date(), 'd-M-y/h:i:s');
		var timestamp = getTimeStamp();
		var call = JSON.parse(evt.data);
		var status = call.msg_type;

		// console.log(call);
		
		if (status == 'tick') {

			connection.send(JSON.stringify({ "ping": 1 }));

		  var CurrentTickPricexx = call.tick.quote;
		  var CurrentTickPrice = CurrentTickPricexx.toFixed(2);
		  var temp = CurrentTickPrice.toString();

		  if (/\d+(\.\d+)?/.test(temp)) {
			var lastNum = parseInt(temp[temp.length - 1]);
			var lastNum2 = parseInt(temp[temp.length - 2]);
			settings.lastNumCurrent = lastNum;
		  }


		  if (settings.globalOpenPos == "START") {
			// console.log(settings.globalOpenPos, settings.paramTradeKind);
			if (settings.paramTradeKind == "Digit Over" && settings.OPStatus == "START") {

			  settings.OPStatus = "STOP";
			  settings.lockingDigit = "1";
			  digitOver(1);



			} else if (settings.paramTradeKind == "Digit Odd" && settings.OPStatus == "START") {


			  if (p_arr_d.length == pattern.length) {
				p_arr_d = p_arr_d.substring(1) + getType(settings.lastNumCurrent)
			  } else
				p_arr_d = p_arr_d + getType(settings.lastNumCurrent)

			  //digit processing
			  if (pattern == p_arr_d) {
				// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
				// writeToScreen(timestamp + " - Found Spot OP! Current Pattern " + pattern + " == " + p_arr_d);
				setNotifications(prev => ([getTimeStamp() + " - Found Spot OP! Current Pattern " + pattern + " == " + p_arr_d, ...prev]))
				settings.OPStatus = "STOP";
				Odd();
			  } else {
				// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
				// writeToScreen(timestamp + " - Analizing price.. Current Digit Pattern " + p_arr_d);
				setNotifications(prev => ([getTimeStamp() + " - Analizing price.. Current Digit Pattern " + p_arr_d, ...prev]))

			  }

			} else if (settings.paramTradeKind == "Digit Even" && settings.OPStatus == "START") {



			  if (p_arr_d.length == pattern.length) {
				p_arr_d = p_arr_d.substring(1) + getType(settings.lastNumCurrent)
			  } else
				p_arr_d = p_arr_d + getType(settings.lastNumCurrent)

			  //digit processing
			  if (pattern == p_arr_d) {
				// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
				// writeToScreen(timestamp + " - Found Spot OP! Current Pattern " + pattern + " == " + p_arr_d);
				setNotifications(prev => ([getTimeStamp() + " - Found Spot OP! Current Pattern " + pattern + " == " + p_arr_d, ...prev]))

				settings.OPStatus = "STOP";
				Even();
			  } else {
				// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
				// writeToScreen(timestamp + " - Analizing price.. Current Digit Pattern " + p_arr_d);
				setNotifications(prev => ([getTimeStamp() + " - Analizing price.. Current Digit Pattern " + p_arr_d, ...prev]))

			  }


			} else if (settings.paramTradeKind == "Digit Under" && settings.OPStatus == "START") {

			  settings.OPStatus = "STOP";
			  settings.lockingDigit = "8";
			  digitUnder(8);

			} else if (settings.paramTradeKind == "Rise" && settings.OPStatus == "START") {

			  settings.OPStatus = "STOP";
			  CaLL();

			} else if (settings.paramTradeKind == "Fall" && settings.OPStatus == "START") {

			  settings.OPStatus = "STOP";
			  PuTT();

			}

			else if (settings.paramTradeKind == "Higher" && settings.OPStatus == "START") {

			  settings.OPStatus = "STOP";
			  Higher();

			} else if (settings.paramTradeKind == "Lower" && settings.OPStatus == "START") {

			  settings.OPStatus = "STOP";
			  Lower();

			} else if (settings.paramTradeKind == "Digit Differs" && settings.OPStatus == "START") {

			  //var ranDomVal = Math.floor(Math.random() * 10);

			  //digit processing
			  if (settings.lastNumCurrent == settings.digitBefore) {
				var total_dgt_sama = Number(settings.countSameDigit) + 1;
				settings.countSameDigit = total_dgt_sama;
				settings.digitBefore = settings.lastNumCurrent;
			  } else {
				settings.countSameDigit = 1;
				settings.digitBefore = settings.lastNumCurrent;
			  }
			  //digit processing
			  if (settings.countSameDigit == 3) {
				
				// writeToScreen(timestamp + " - Found Spot OP! Current Digit " + settings.lastNumCurrent + " - Digit = " + settings.countSameDigit + " ( " + settings.lastNumCurrent + " Vs " + settings.digitBefore + " )");
				setNotifications(prev => ([getTimeStamp()+ " - Found Spot OP! Current Digit " + settings.lastNumCurrent + " - Digit = " + settings.countSameDigit + " ( " + settings.lastNumCurrent + " Vs " + settings.digitBefore + " )", ...prev]))
				settings.OPStatus = "STOP";
			  console.log("stop");

				digitDiff(settings.lastNumCurrent);
			  } else {
				// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
				// writeToScreen(timestamp + " - Analizing price.. Current Digit " + settings.lastNumCurrent + " - Digit = " + settings.countSameDigit + " ( " + settings.lastNumCurrent + " Vs " + settings.digitBefore + " )");
				setNotifications(prev => ([getTimeStamp() + " - Analizing price.. Current Digit " + settings.lastNumCurrent + " - Digit = " + settings.countSameDigit + " ( " + settings.lastNumCurrent + " Vs " + settings.digitBefore + " )", ...prev]))
			  
			}
			}

		  }


		} else if (status == "buy") {

		  settings.OPStatus = "STOP";

		} else if (status == "balance") {

		  var balance_now = call.balance.balance;
		  var session_bal = settings.balanceNow;
		
		  
		  if (typeof (Storage) !== "undefined") {
			settings.balanceNow = Number(balance_now);
		  }

		  var selisih = balance_now - session_bal;
		  var result = selisih.toFixed(2);
		  settings.resultData = result;

		  
		  var profit = balance_now - Number(settings.balanceStarting);
		  var upDtProftCurrent = Number(settings.ProfitNow);

		  if (profit > upDtProftCurrent) {
			var proftStatusVar = "profit";
			settings.ProfitNow = profit;
		  } else if (profit < upDtProftCurrent) {
			var proftStatusVar = "loss";
			settings.ProfitNow = profit;

		  }

		  var pftPercent = (profit / Number(settings.balanceStarting)) * 100;
		  var pftPercentDisply = pftPercent.toFixed(2);
		  setInfo(prev => ({...prev, profitPercent: pftPercentDisply, profit: profit}))

		  var countSL = Number(settings.currentStopLoss);
		  var countSLProcess = Number(settings.currentStopLoss) - (Number(settings.currentStopLoss) + Number(settings.currentStopLoss));

		  if (profit >= Number(settings.currentTargetProfit)) {

			targetClose();

		  } else if (profit <= countSLProcess && result == 0) {

			stopLoss();

		  }


		  if (result > 0) {

			var profit_session = result - Number(settings.currentModal);
			var profit_sesDsp = profit_session.toFixed(2);

			console.log("profit", profit_sesDsp, settings.paramTradeKind);

			// $.post("save_data_trade.html", { trade_mode:settings.paramTradeKind,full_name:settings.fullnameSaved,cr_account:settings.cr_accountSaved,is_virtual:settings.virtual_accSaved,email:settings.emailSaved,stake_value:settings.currentModal,return_value: result});

			settings.currentModal = settings.modalOriginal;

			var crrnmdlx = settings.currentModal;
			var crrnmdlxx = Number(settings.currentModal);
			var crrnmdlxxx = crrnmdlxx.toFixed(2);
			if (settings.paramTradeKind == "Digit Over" || settings.paramTradeKind == "Digit Under") {

			  create_table(timestamp + " " + "$" + profit.toFixed(2) + " $" + result + " " + pftPercentDisply + "%" + " $" + crrnmdlxxx + " " + settings.lockingDigit);
			} else if (settings.paramTradeKind == "Rise" || settings.paramTradeKind == "Fall" || settings.paramTradeKind == "Digit Odd" || settings.paramTradeKind == "Digit Even"
			  || settings.paramTradeKind == "Higher" || settings.paramTradeKind == "Lower") {
			  create_table(timestamp + " " + "$" + profit.toFixed(2) + " $" + result + " " + pftPercentDisply + "%" + " $" + crrnmdlxxx + " " + settings.paramTradeKind);
			}

			setNotifications(prev => ([
				'<span style="color: #4CAF50;"> ' + getTimeStamp() + ' - Profit $' + profit.toFixed(2) + '</span>',
				...prev
			]))

			settings.OPStatus = "START";

		  } else if (result == 0) {

			var crrnmdlx = settings.currentModal;
			var crrnmdlxx = Number(settings.currentModal);
			var crrnmdlxxx = crrnmdlxx.toFixed(2);

			if (settings.balanceStarting != settings.balanceNow) {


			  if (settings.paramTradeKind == "Digit Over" || settings.paramTradeKind == "Digit Under") {
				create_table(timestamp + " " + "$" + profit.toFixed(2) + " $" + result + " " + pftPercentDisply + "%" + " $" + crrnmdlxxx + " " + settings.lockingDigit);
			  } else if (settings.paramTradeKind == "Rise" || settings.paramTradeKind == "Fall" || settings.paramTradeKind == "Digit Odd" || settings.paramTradeKind == "Digit Even"
				|| settings.paramTradeKind == "Higher" || settings.paramTradeKind == "Lower") {
				create_table(timestamp + " " + "$" + profit.toFixed(2) + " $" + result + " " + pftPercentDisply + "%" + " $" + crrnmdlxxx + " " + settings.paramTradeKind);
			  }

			  setNotifications(prev => ([
				'<span style="color: #f20202;"> ' + getTimeStamp() + ' - Loss $' + crrnmdlxxx + '</span>',
				...prev
			]))
			  //$.post("save_data_trade.html", { trade_mode:settings.paramTradeKind,full_name:settings.fullnameSaved,cr_account:settings.cr_accountSaved,is_virtual:settings.virtual_accSaved,email:settings.emailSaved,stake_value:settings.currentModal,return_value: result});
			}

			var hitungOp = Number(settings.countOP);
			var max_op = 1;
			if (hitungOp == max_op) {

			  if (settings.paramTradeKind == "Digit Over") {
				var modalMarti = Number(settings.currentModal) * 7;
			  } else if (settings.paramTradeKind == "Digit Differs") {
				var modalMarti = Number(settings.currentModal) * 13.5;
			  } else if (settings.paramTradeKind == "Digit Under") {
				var modalMarti = Number(settings.currentModal) * 7;
			  } else if (settings.paramTradeKind == "Rise") {
				var modalMarti = Number(settings.currentModal) * 2.1;
			  } else if (settings.paramTradeKind == "Fall") {
				var modalMarti = Number(settings.currentModal) * 2.1;
			  } else if (settings.paramTradeKind == "Higher") {
				var modalMarti = Number(settings.currentModal) * 6;
			  } else if (settings.paramTradeKind == "Lower") {
				var modalMarti = Number(settings.currentModal) * 6;
			  } else if (settings.paramTradeKind == "Digit Odd") {
				var modalMarti = Number(settings.currentModal) * 2.1;
			  } else if (settings.paramTradeKind == "Digit Even") {
				var modalMarti = Number(settings.currentModal) * 2.1;
			  }

			  settings.currentModal = modalMarti;

			  if (Number(settings.ModalTracking2) < modalMarti) {

				settings.ModalTracking2 = modalMarti;

				var jumlahinModalSekarang = Number(settings.ModalTracking);
				var jumlahinModal = jumlahinModalSekarang + modalMarti;
				var jumlahin = jumlahinModal.toFixed(2);

				settings.ModalTracking = jumlahin;
				setInfo(prev => ({...prev, ModalTracking: jumlahin}))
			  }

			  var CurrentModv = modalMarti.toFixed(2);

			} else {
			  settings.countOP = 1;
			}

			settings.OPStatus = "START";
		  }

		  var crrnmdlxxx = settings.currentModal;
		  var crrnmdlxxxx = Number(crrnmdlxxx);
		  var crrnmdlxxxxx = crrnmdlxxxx.toFixed(2);

		} else if (status == "authorize") {

		  if (call.error) {
			// writeToScreen('<span style="color: red;"> ' + timestamp + ' - Invalid Token Please Re loging or Create new account..</span>');
			
			// setError("Invalid Token Please Re loging or Create new account..");
			createNotification("warning", "warning", "invalid token")
		  } else {
			console.log(call);
			settings.isAuthorized = true;
			analyzingMarket();
			var balance = call.authorize.balance;
			var email = call.authorize.email;

			currency = call.authorize.currency

			console.log("----------currency------", currency)

			settings.balanceStarting = balance;
			setNotifications(prev => ([
				'<span style="color: blue;"> ' + timestamp + ' - Connection Established with Binary.Com Server..</span>',
				...prev
			]))
			setInfo(prev => (
				{...prev, 
					isAuthorized: true, 
					balance: call.authorize.balance, 
					email: call.authorize.email, 
					currency: call.authorize.currency,
					fullname: call.authorize.fullname,
					loginid: call.authorize.loginid
				}));
			var saveCurrentToken = settings.currentToken;
			var savebalanceStart = balance;
			var savebalanceNow = balance;
			var saveprofit_now = settings.profitNow;
			var saveEmail = email;
			var full_name = call.authorize.fullname;
			var virtual_acc = call.authorize.is_virtual;
			var crAccount = call.authorize.loginid;

			//save to Session Storage
			settings.fullnameSaved = full_name;
			settings.cr_accountSaved = crAccount;
			settings.virtual_accSaved = virtual_acc;
			settings.emailSaved = email;
			//save to Session Storage

			if (virtual_acc == '0') {
			  settings.accountType = "RealAccount";
			} else {
			  settings.accountType = "VirtualAccount";
			}

			var accountType = settings.accountType;

			//$.post("./save_data.html", { full_name:full_name,virtual_acc:virtual_acc,token:saveCurrentToken,balance_start:savebalanceStart,balance_now:savebalanceNow,profit: "0", email: saveEmail, cr_akun: crAccount });

			settings.balanceNow = Number(balance);

			var crrnmdlxxx = settings.currentModal;
			var crrnmdlxxxx = Number(crrnmdlxxx);
			var crrnmdlxxxxx = crrnmdlxxxx.toFixed(2);


			CheckBalance();
		  }
		}
	  }

	  const CheckBalance = () => {
		connection.send(JSON.stringify({ "balance": 1, "subscribe": 1 }));
	  }

	  const analyzingMarket = () => {
		connection.send(JSON.stringify({ "ticks": settings.currentMarket, "subscribe": 1 }));
	  }

	  function startTrade() {
        settings.globalOpenPos = "START";
        settings.OPStatus = "START";
        settings.balanceStarting = settings.balanceNow;
        settings.profitNow = "0.00";
        settings.ModalTracking = settings.currentModal;
        settings.ModalTracking2 = settings.currentModal;
		setInfo(prev => ({...prev, isStarted: true}));
		setNotifications(prev => ([
			'<span style="color: blue;"> ' + getTimeStamp() + ' - Start Trade!</span>',
			...prev
		]))
      }

	  const closeConn = () => {
		connection.close();
	  }


	  const pauseTrade = () => {
		settings.globalOpenPos = 'STOP';
		setInfo(prev => ({...prev, isStarted: false}));
		setNotifications(prev => ([
			'<span style="color: red;"> ' + getTimeStamp() + ' - Pause Trade!</span>',
			...prev
		]))
	  }

	

	  const getType = (number) => {
		return (number % 2) == 0 ? 'E' : 'O'
	  }

	  const stopLoss = () => {

		settings.globalOpenPos = "STOP";
		settings.OPStatus = "STOP";
		setInfo(prev => ({...prev, isStarted: false}));
		setNotifications(prev => ([
			'<span style="color: Red;"> ' + getTimeStamp() + ' - Stop Loss Touched!</span>',
			...prev
		]))
		var loss_ceil = Number(settings.currentStopLoss);
		var loss_alrt = loss_ceil.toFixed(2);

	  }

	  const balInsuficient = () => {

		settings.globalOpenPos = "STOP";
		settings.OPStatus = "STOP";
		setInfo(prev => ({...prev, isStarted: false}));
		
		var balance = Number(settings.balanceNow);
		var balance_alrt = balance.toFixed(2);

		var modal = Number(settings.currentModal);
		var modal_alrt = modal.toFixed(2);
		setNotifications(prev => ([
			'<span style="color: Red;"> ' + getTimeStamp() + ' - Your account balance ($' + balance_alrt + ') is insufficient to buy this contract ($' + modal_alrt + ').</span>',
			...prev
		]))

	  }


	  const digitDiff = (last_digit) => {
		// console.log("here");
		
		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))

		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {
			console.log("buy", modalOrder, settings.paramTradeKind);

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "DIGITDIFF",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market,
			  "barrier": last_digit
			}
		  }));

		}
	  }

	  const Odd = () => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {

			console.log("buy", modalOrder, settings.paramTradeKind);

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "DIGITODD",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market
			}
		  }));

		}
	  }

	  const Even = () => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {

		console.log("buy", modalOrder, settings.paramTradeKind);
		 

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "DIGITEVEN",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market
			}
		  }));

		}
	  }


	  const digitOver = (last_digit) => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;

		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))

		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {

		console.log("buy", modalOrder, settings.paramTradeKind);
		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "DIGITOVER",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market,
			  "barrier": last_digit
			}
		  }));

		}
	  }

	  const digitUnder = (last_digit) => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {
			console.log("buy", modalOrder, settings.paramTradeKind);

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "DIGITUNDER",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market,
			  "barrier": last_digit
			}
		  }));

		}
	  }


	  const Higher = () => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {
			console.log("buy", modalOrder, settings.paramTradeKind);

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "barrier": '-' + getBarrier(market),
			  "contract_type": "CALL",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market
			}
		  }));

		}
	  }



	  const Lower = () => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {
			console.log("buy", modalOrder, settings.paramTradeKind);

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "barrier": '+' + getBarrier(market),
			  "contract_type": "PUT",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market
			}
		  }));

		}
	  }


	  const PuTT = () => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {

		console.log("buy", modalOrder, settings.paramTradeKind);
		 
		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "PUT",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market
			}
		  }));

		}
	  }

	  const CaLL = () => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {
			console.log("buy", modalOrder, settings.paramTradeKind);

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "CALL",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market
			}
		  }));

		}
	  }

	  const PuTT_hilow = () => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;
		var barrier = settings.barrierTrade;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {

			console.log("buy", modalOrder, settings.paramTradeKind);

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "PUT",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market,
			  "barrier": barrier
			}
		  }));

		}
	  }

	  const CaLL_hilow = () => {

		var modalOrderx = Number(settings.currentModal);
		var modalOrder = modalOrderx.toFixed(2);
		var market = settings.currentMarket == "Random" ? getRandomMarket() : settings.currentMarket;
		var total_tick = settings.paramTickKind;
		var barrier = settings.barrierTrade;

		// var timestamp = dateFormat(new Date(), 'd-M-y h:i:s');
		// writeToScreen('<span style="color: #003edb;"> ' + timestamp + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>');
		setNotifications(prev => ([
			'<span style="color: #003edb;"> ' + getTimeStamp() + ' - Stake ' + settings.paramTradeKind + ' $' + modalOrder + '</span>',
			...prev
		]))
		if (Number(settings.balanceNow) < modalOrder) {

		  balInsuficient();

		} else {

			console.log("buy", modalOrder, settings.paramTradeKind);

		  connection.send(JSON.stringify({
			"buy": "1",
			"price": modalOrder,
			"parameters": {
			  "amount": modalOrder,
			  "basis": "stake",
			  "contract_type": "CALL",
			  "currency": currency,
			  "duration": total_tick,
			  "duration_unit": "t",
			  "symbol": market,
			  "barrier": barrier
			}
		  }));

		}
	  }


	  const getBarrier = (markt) => {

		if (markt == 'R_10')
		  return 0.25
		if (markt == 'R_25')
		  return 0.3
		if (markt == 'R_50')
		  return 0.03
		if (markt == 'R_75')
		  return 250
		if (markt == 'R_100')
		  return 2.5

		if (markt == '1HZ10V')
		  return 0.20
		if (markt == '1HZ25V')
		  return 20
		if (markt == '1HZ50V')
		  return 75
		if (markt == '1HZ75V')
		  return 3
		if (markt == '1HZ100V')
		  return 1

	  }


	  const getRandomMarket = () => {
		var items = ['R_10', 'R_25', 'R_50', 'R_75', 'R_100', '1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V'];
		return items[Math.floor(Math.random() * items.length)];
	  }

	  const targetClose = () => {

		settings.globalOpenPos = "STOP";
		settings.OPStatus = "STOP";
		setInfo(prev => ({...prev, isStarted: false}));
		setNotifications(prev => ([
			'<span style="color: Green;"> ' + getTimeStamp() + ' - Target Achieved!!</span>',
			...prev
		]))
		var profit_ceil = Number(settings.currentTargetProfit);
		var profit_alrt = profit_ceil.toFixed(2);
	
	
	  }

	 const  onClose = (evt) => {
        var timestamp = getTimeStamp();
        // writeToScreen(timestamp + " - Disconnect From Binary.com Server..");
		setNotifications(prev => ([
			timestamp + " - Disconnect From Binary.com Server..",
			...prev
		]))
      }

     const onError = (evt) => {
        var timestamp = getTimeStamp();
		setNotifications(prev => ([
			'<span style="color: red;"> ' + timestamp + ' - Please Check Your Internet Connection..</span>',
			...prev
		]))
        // writeToScreen('<span style="color: red;"> ' + timestamp + ' - Please Check Your Internet Connection..</span>');
        // show_form_login();
		// setInfo(prev => ({...prev, isAuthorized: false}));
      }

	  const create_table = (message) => {

        var array = message.split(" ");
		setTable(prev => ([{
			timestamp: array[0],
			profit: array[1],
			result: array[2],
			pftPercentDisply: array[3],
			crrnmdlxxx: array[4],
			lockingDigit: array[5]
		}, ...prev]))

      }

	  const getTimeStamp = () => {
		var now = new Date();
		return `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
	  }

return(
	<DerivAPIContext.Provider
		value={{
			info,
			table,
			notifications,
			auThorized,
			logout,
			updateSettings,
			startTrade,
			pauseTrade,
		}}
	>
		{children}
        <NotificationContainer/>
	</DerivAPIContext.Provider>
);

}


export {DerivAPIContext};
export default DerivAPIProvider;
