/* globals chrome */
import { APICall } from '../popup/ajax';

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		let username;
		if (request.data.type == "SENDTRANSACTION") {
			chrome.storage.sync.get(['username'], function (response) {
				username = response.username
				/*const params = {
	    			username: username,
					fromAddress: request.data.fromAddress,
					toAddress: request.data.toAddress,
					valueOfEth: request.data.valueOfEth,
					gas: request.data.gas,
					gasPrice: request.data.gasPrice,
					data: request.data.data,
					nonce: request.data.nonce,
	    			appUrl: request.data.url
				}

				const url = '/api/1/auth/request';*/

				const params = { username: username }
				const url = '/api/1/pair';
				APICall(url, params)
				.then(function(response){
					let message = '';
					if(response.status == 200) {
						message = "A transaction has been sent to the TapTrust Wallet Mobile App."
					}
					else {
						message = "Transaction could not be sent to the TapTrust Wallet Mobile App."
					}

					const notificationParams = {
			          		type: "basic",
			          		iconUrl: chrome.runtime.getURL("../assets/img/icon48.png"),
			          		title: "TapTrust Wallet",
			          		message: message,
			          		buttons: [{ title: 'Dismiss' }],
			          		requireInteraction: true
	        			}
	        		chrome.notifications.create('transaction', notificationParams);
  					sendResponse({response: "Sent the transaction data to server"});
				})
				.catch(function(error){
					const notificationParams = {
			          		type: "basic",
			          		iconUrl: chrome.runtime.getURL("../assets/img/icon48.png"),
			          		title: "TapTrust Wallet",
			          		message: "Transaction could not be sent to the TapTrust Wallet Mobile App.",
			          		buttons: [{ title: 'Dismiss' }],
			          		requireInteraction: true
        			}
	        		chrome.notifications.create('transaction', notificationParams);
  					sendResponse({response: "Failure in sending transaction data to server"});
				})
					
			})
		}
		return true; // wrt function(request, sender, sendResponse) {
	}
);
