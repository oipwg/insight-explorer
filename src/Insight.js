import axios from 'axios'
import socketio from 'socket.io-client'

module.exports =
class Insight {
	constructor(url){
		this.url = url;

		this.api = axios.create({
			baseURL: this.url,
			transformResponse: [function (data) {
				return data.data;
			}]
		})
	}
	getBlock(hash){
		return this.api.get("/block/" + hash)
	}
	getBlockIndex(height){
		return this.api.get("/block-index/" + height)
	}
	getRawBlock(block){
		return this.api.get("/rawblock/" + block)
	}
	getBlockSummary(limit, blockDate){
		var reqURL = "/blocks";
		var addedQuestionMark = false;

		if (limit && limit !== ""){
			reqURL += "?limit=" + limit;
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

		return this.api.get(reqURL)
	}
	getTransaction(txid){
		return this.api.get("/tx/" + txid)
	}
	getRawTransaction(txid){
		return this.api.get("/rawtx/" + txid)
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

		return this.api.get(reqURL)
	}
	getAddressProperties(address, property){
		return this.api.get("/addr/" + address + "/" + property)
	}
	getAddressUtxo(address){
		return this.api.get("/addr/" + address + "/utxo")
	}
	getAddressesUtxo(addresses){
		return this.api.post("/addrs/utxo", {addrs: addresses.join()})
	}
	getTransactionsForBlock(hash){
		return this.api.get("/txs/?block=" + hash)
	}
	getTransactionsForAddress(address){
		return this.api.get("/txs/?address=" + address)
	}
	getTransactionsForAddresses(addresses, options){
		var opts = options;
		opts.addrs = addresses.join();

		return this.api.post("/addrs/txs", opts)
	}
	broadcastRawTransaction(rawtx, options){
		var opts = options;
		opts.rawtx = rawtx;

		return this.api.post("/tx/send", opts)
	}
	getSync(){
		return this.api.get("/sync")
	}
	getPeer(){
		return this.api.get("/peer")
	}
	getStatus(query){
		return this.api.get("/status?q=" + query)
	}
	estimateFee(nbBlocks){
		var reqURL = "/utils/estimatefee";

		if (nbBlocks && nbBlocks !== "")
			reqURL += "?nbBlocks=" + nbBlocks

		return this.api.get(reqURL)
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