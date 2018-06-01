import socketio from 'socket.io-client';

module.exports =
class Insight {
	constructor(url){
		this.url = url;
	}
	getBlock(hash){

	}
	getBlockIndex(height){

	}
	getRawBlock(hash){

	}
	getBlockSummary(limit, blockDate){

	}
	getTransaction(txid){

	}
	getRawTransaction(txid){

	}
	getAddress(address){

	}
	getAddressProperties(address, property){

	}
	getAddressUtxo(address){

	}
	getAddressesUtxo(addresses){

	}
	getTransactionsForBlock(hash){

	}
	getTransactionsForAddress(address){
		
	}
	getTransactionsForAddresses(addresses, options){
		
	}
	broadcastRawTransaction(rawtx){

	}
	getSync(){

	}
	getPeer(){

	}
	getStatus(query){

	}
	on(event, callback){
		if (!this.socket){
			this.socket = socketio(this.url)
		}

		if (this.socket){
			this.socket.on(event, callback);
		} else {
			console.error("Failure to subscribe to WebSocket!")
		}
	}
}