import axios from 'axios'
import socketio from 'socket.io-client'

module.exports =
class Insight {
	constructor(url, useWebSockets = true){
		this.url = url;

		this.api = axios.create({
			baseURL: this.url
		})

		this.socketReady = false
		this.socketSubscribedToInv = false

		if (useWebSockets){
			var urlNoTrail = this.url.split("/")
			urlNoTrail.pop();
			urlNoTrail = urlNoTrail.join("/")
			
			this.socket = socketio(urlNoTrail);
			this.socket.on("connect", () => {
				this.socketReady = true;
			})

		}
	}
	async getBlock(hash){
		try {
			var response = await this.api.get("/block/" + hash)
		} catch (e) {
			throw new Error("Unable to getBlock: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getBlockIndex(height){
		try {
			var response = await this.api.get("/block-index/" + height)
		} catch (e) {
			throw new Error("Unable to getBlockIndex: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getRawBlock(block){
		try {
			var response = await this.api.get("/rawblock/" + block)
		} catch (e) {
			throw new Error("Unable to getRawBlock: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

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

		try {
			var response = await this.api.get(reqURL)
		} catch (e) {
			throw new Error("Unable to getBlockSummary: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getTransaction(txid){
		try {
			var response = await this.api.get("/tx/" + txid)
		} catch (e) {
			throw new Error("Unable to getTransaction: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getRawTransaction(txid){
		try {
			var response = await this.api.get("/rawtx/" + txid)
		} catch (e) {
			throw new Error("Unable to getRawTransaction: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

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

		try {
			var response = await this.api.get(reqURL)
		} catch (e) {
			throw new Error("Unable to getAddress: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getAddressProperties(address, property){
		try {
			var response = await this.api.get("/addr/" + address + "/" + property)
		} catch (e) {
			throw new Error("Unable to getAddressProperties: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getAddressUtxo(address){
		try {
			var response = await this.api.get("/addr/" + address + "/utxo")
		} catch (e) {
			throw new Error("Unable to getAddressUtxo: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getAddressesUtxo(addresses){
		try {
			var response = await this.api.post("/addrs/utxo", {addrs: addresses.join()})
		} catch (e) {
			throw new Error("Unable to getAddressesUtxo: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getTransactionsForBlock(hash){
		try {
			var response = await this.api.get("/txs/?block=" + hash)
		} catch (e) {
			throw new Error("Unable to getTransactionsForBlock: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getTransactionsForAddress(address){
		try {
			var response = await this.api.get("/txs/?address=" + address)
		} catch (e) {
			throw new Error("Unable to getTransactionsForAddress: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getTransactionsForAddresses(addresses, options){
		var opts = options || {};
		opts.addrs = addresses.join();

		try {
			var response = await this.api.post("/addrs/txs", opts)
		} catch (e) {
			throw new Error("Unable to getTransactionsForAddresses: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async broadcastRawTransaction(rawtx, options){
		var opts = options || {};
		opts.rawtx = rawtx;

		try {
			var response = await this.api.post("/tx/send", opts)
		} catch (e) {
			throw new Error("Unable to broadcastRawTransaction: " + e.response.status + " " + e.response.statusText + " | " + e.response.data);
		}

		return response.data
	}
	async getSync(){
		try {
			var response = await this.api.get("/sync")
		} catch (e) {
			throw new Error("Unable to getSync: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getPeer(){
		try {
			var response = await this.api.get("/peer")
		} catch (e) {
			throw new Error("Unable to getPeer: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getStatus(query){
		try {
			var response = await this.api.get("/status?q=" + query)
		} catch (e) {
			throw new Error("Unable to getStatus: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async getExchangeRate(){
		try {
			var response = await this.api.get("/currency")
		} catch (e) {
			throw new Error("Unable to getExchangeRate: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	async estimateFee(nbBlocks){
		var reqURL = "/utils/estimatefee";

		if (nbBlocks && nbBlocks !== "")
			reqURL += "?nbBlocks=" + nbBlocks

		try {
			var response = await this.api.get(reqURL)
		} catch (e) {
			throw new Error("Unable to estimateFee: " + e.response.status + " " + e.response.statusText + " | " + e.response.data)
		}

		return response.data
	}
	onAddressUpdate(address, subscriberMethod){
		if (this.socketReady){
			this.socket.on(address, subscriberMethod)
		} else {
			setTimeout(() => { this.onAddressUpdate(address, subscriberMethod) }, 100)
		}
	}
	onTX(subscriberMethod){
		if (this.socketReady){
			this.socket.on('tx', subscriberMethod)

			if (!this.socketSubscribedToInv){
				this.socket.emit("subscribe", "inv")
				this.socketSubscribedToInv = true
			}
		} else {
			setTimeout(() => { this.onTX(subscriberMethod) }, 100)
		}
	}
	onBlock(subscriberMethod){
		if (this.socketReady){
			this.socket.on('block', subscriberMethod)

			if (!this.socketSubscribedToInv){
				this.socket.emit("subscribe", "inv")
				this.socketSubscribedToInv = true
			}
		} else {
			setTimeout(() => { this.onBlock(subscriberMethod) }, 100)
		}
	}
}