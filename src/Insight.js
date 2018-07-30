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
	async getBlock(hash){
		var response = await this.api.get("/block/" + hash)

		return response.data
	}
	async getBlockIndex(height){
		var response = await this.api.get("/block-index/" + height)

		return response.data
	}
	async getRawBlock(block){
		var response = await this.api.get("/rawblock/" + block)

		return response.data
	}
	async getBlockSummary(limit, blockDate){
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

		var response = await this.api.get(reqURL)

		return response.data
	}
	async getTransaction(txid){
		var response = await this.api.get("/tx/" + txid)

		return response.data
	}
	async getRawTransaction(txid){
		var response = await this.api.get("/rawtx/" + txid)

		return response.data
	}
	async getAddress(address, options){
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

		var response = await this.api.get(reqURL)

		return response.data
	}
	async getAddressProperties(address, property){
		var response = await this.api.get("/addr/" + address + "/" + property)

		return response.data
	}
	async getAddressUtxo(address){
		var response = await this.api.get("/addr/" + address + "/utxo")

		return response.data
	}
	async getAddressesUtxo(addresses){
		var response = await this.api.post("/addrs/utxo", {addrs: addresses.join()})

		return response.data
	}
	async getTransactionsForBlock(hash){
		var response = await this.api.get("/txs/?block=" + hash)

		return response.data
	}
	async getTransactionsForAddress(address){
		var response = await this.api.get("/txs/?address=" + address)

		return response.data
	}
	async getTransactionsForAddresses(addresses, options){
		var opts = options || {};
		opts.addrs = addresses.join();

		var response = await this.api.post("/addrs/txs", opts)

		return response.data
	}
	async broadcastRawTransaction(rawtx, options){
		var opts = options || {};
		opts.rawtx = rawtx;

		var response = await this.api.post("/tx/send", opts)

		return response.data
	}
	async getSync(){
		var response = await this.api.get("/sync")

		return response.data
	}
	async getPeer(){
		var response = await this.api.get("/peer")

		return response.data
	}
	async getStatus(query){
		var response = await this.api.get("/status?q=" + query)

		return response.data
	}
	async getExchangeRate(){
		var response = await this.api.get("/currency")

		return response.data
	}
	async estimateFee(nbBlocks){
		var reqURL = "/utils/estimatefee";

		if (nbBlocks && nbBlocks !== "")
			reqURL += "?nbBlocks=" + nbBlocks

		var response = await this.api.get(reqURL)

		return response.data
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