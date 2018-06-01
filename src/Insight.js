import axios from 'axios'
import socketio from 'socket.io-client'

module.exports =
class Insight {
	constructor(url){
		this.url = url;

		this.api = axios.create({
			baseURL: this.url
		})
	}
	getBlock(hash){
		return this.api.get("/block/" + hash).then((res) => { return res.data })
	}
	getBlockIndex(height){
		return this.api.get("/block-index/" + height).then((res) => { return res.data })
	}
	getRawBlock(block){
		return this.api.get("/rawblock/" + block).then((res) => { return res.data })
	}
	getBlockSummary(limit, blockDate){
		var reqURL = "/blocks";
		var addedQuestionMark = false;

		if (limit && limit !== ""){
			reqURL += "?limit=" + limit;
			addedQuestionMark = true;
		}

		if (blockDate && blockDate !== ""){
			if (addedQuestionMark){
				reqURL += "&"
			} else {
				reqURL += "?"
				addedQuestionMark = true
			}

			reqURL += "blockDate=" + blockDate;
		}

		return this.api.get(reqURL).then((res) => { return res.data })
	}
	getTransaction(txid){
		return this.api.get("/tx/" + txid).then((res) => { return res.data })
	}
	getRawTransaction(txid){
		return this.api.get("/rawtx/" + txid).then((res) => { return res.data })
	}
	getAddress(address, options){
		var reqURL = "/addr/" + address;
		var addedQuestionMark = false;

		if (options) {
			if (options.noTxList){
				reqURL += "?noTxList=" + options.noTxList
				addedQuestionMark = true
			}
			if (options.from){
				if (addedQuestionMark){
					reqURL += "&"
				} else {
					reqURL += "?"
					addedQuestionMark = true
				}

				reqURL += "from=" + options.from
			}
			if (options.to){
				if (addedQuestionMark){
					reqURL += "&"
				} else {
					reqURL += "?"
					addedQuestionMark = true
				}

				reqURL += "to=" + options.to
			}
		}

		return this.api.get(reqURL).then((res) => { return res.data })
	}
	getAddressProperties(address, property){
		return this.api.get("/addr/" + address + "/" + property).then((res) => { return res.data })
	}
	getAddressUtxo(address){
		return this.api.get("/addr/" + address + "/utxo").then((res) => { return res.data })
	}
	getAddressesUtxo(addresses){
		return this.api.post("/addrs/utxo", {addrs: addresses.join()}).then((res) => { return res.data })
	}
	getTransactionsForBlock(hash){
		return this.api.get("/txs/?block=" + hash).then((res) => { return res.data })
	}
	getTransactionsForAddress(address){
		return this.api.get("/txs/?address=" + address).then((res) => { return res.data })
	}
	getTransactionsForAddresses(addresses, options){
		var opts = options || {};
		opts.addrs = addresses.join();

		return this.api.post("/addrs/txs", opts).then((res) => { return res.data })
	}
	broadcastRawTransaction(rawtx, options){
		var opts = options || {};
		opts.rawtx = rawtx;

		return this.api.post("/tx/send", opts).then((res) => { return res.data })
	}
	getSync(){
		return this.api.get("/sync").then((res) => { return res.data })
	}
	getPeer(){
		return this.api.get("/peer").then((res) => { return res.data })
	}
	getStatus(query){
		return this.api.get("/status?q=" + query).then((res) => { return res.data })
	}
	estimateFee(nbBlocks){
		var reqURL = "/utils/estimatefee";

		if (nbBlocks && nbBlocks !== "")
			reqURL += "?nbBlocks=" + nbBlocks

		return this.api.get(reqURL).then((res) => { return res.data })
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