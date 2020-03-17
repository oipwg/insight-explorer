import axios from 'axios'

module.exports =
  class Insight {
    constructor (url) {
      this.url = url

      this.api = axios.create({
        baseURL: this.url
      })
    }

    async getBlock (hash) {
      try {
        const response = await this.api.get('/block/' + hash)
        return response.data
      } catch (e) {
        throw this.createErrorString('getBlock', e)
      }
    }

    async getBlockIndex (height) {
      try {
        const response = await this.api.get('/block-index/' + height)
        return response.data
      } catch (e) {
        throw this.createErrorString('getBlockIndex', e)
      }
    }

    async getRawBlock (block) {
      try {
        const response = await this.api.get('/rawblock/' + block)
        return response.data
      } catch (e) {
        throw this.createErrorString('getRawBlock', e)
      }
    }

    async getBlockSummary (limit, blockDate) {
      const reqURL = '/blocks'
      const q = {}

      if (limit && limit !== '') {
        q.limit = limit
      }

      if (blockDate && blockDate !== '') {
        q.blockDate = blockDate
      }

      try {
        const response = await this.api.get(reqURL, { params: q })
        return response.data
      } catch (e) {
        throw this.createErrorString('getBlockSummary', e)
      }
    }

    async getTransaction (txid) {
      try {
        const response = await this.api.get('/tx/' + txid)
        return response.data
      } catch (e) {
        throw this.createErrorString('getTransaction', e)
      }
    }

    async getRawTransaction (txid) {
      try {
        const response = await this.api.get('/rawtx/' + txid)
        return response.data
      } catch (e) {
        throw this.createErrorString('getRawTransaction', e)
      }
    }

    async getAddress (address, options) {
      const reqURL = '/addr/' + address + '?'
      const q = {}
      if (options) {
        if (options.noTxList) {
          q.noTxList = options.noTxList
        }
        if (options.from) {
          q.from = options.from
        }
        if (options.to) {
          q.to = options.to
        }
      }

      try {
        const response = await this.api.get(reqURL, { params: q })
        return response.data
      } catch (e) {
        throw this.createErrorString('getAddress', e)
      }
    }

    async getAddressProperties (address, property) {
      try {
        const response = await this.api.get('/addr/' + address + '/' + property)
        return response.data
      } catch (e) {
        throw this.createErrorString('getAddressProperties', e)
      }
    }

    async getAddressUtxo (address) {
      try {
        const response = await this.api.get('/addr/' + address + '/utxo')
        return response.data
      } catch (e) {
        throw this.createErrorString('getAddressUtxo', e)
      }
    }

    async getAddressesUtxo (addresses) {
      try {
        const response = await this.api.post('/addrs/utxo', { addrs: addresses.join() })
        return response.data
      } catch (e) {
        throw this.createErrorString('getAddressesUtxo', e)
      }
    }

    async getTransactionsForBlock (hash) {
      try {
        const response = await this.api.get('/txs/?block=' + hash)
        return response.data
      } catch (e) {
        throw this.createErrorString('getTransactionsForBlock', e)
      }
    }

    async getTransactionsForAddress (address) {
      try {
        const response = await this.api.get('/txs/?address=' + address)
        return response.data
      } catch (e) {
        throw this.createErrorString('getTransactionsForAddress', e)
      }
    }

    async getTransactionsForAddresses (addresses, options) {
      const opts = options || {}
      opts.addrs = addresses.join()

      try {
        const response = await this.api.post('/addrs/txs', opts)
        return response.data
      } catch (e) {
        throw this.createErrorString('getTransactionsForAddresses', e)
      }
    }

    async broadcastRawTransaction (rawtx, options) {
      const opts = options || {}
      opts.rawtx = rawtx

      try {
        const response = await this.api.post('/tx/send', opts)
        if (response.data && typeof response.data.txid === 'object') {
          response.data.txid = response.data.txid.result
          return response.data
        }
        return response.data
      } catch (e) {
        throw this.createErrorString('broadcastRawTransaction', e)
      }
    }

    async getSync () {
      try {
        const response = await this.api.get('/sync')
        return response.data
      } catch (e) {
        throw this.createErrorString('getSync', e)
      }
    }

    async getPeer () {
      try {
        const response = await this.api.get('/peer')
        return response.data
      } catch (e) {
        throw this.createErrorString('getPeer', e)
      }
    }

    async getStatus (query) {
      try {
        const response = await this.api.get('/status?q=' + query)
        return response.data
      } catch (e) {
        throw this.createErrorString('getStatus', e)
      }
    }

    async getExchangeRate () {
      try {
        const response = await this.api.get('/currency')
        return response.data
      } catch (e) {
        throw this.createErrorString('getExchangeRate', e)
      }
    }

    async estimateFee (nbBlocks) {
      const reqURL = '/utils/estimatefee'
      const q = {}

      if (nbBlocks && nbBlocks !== '') {
        q.nbBlocks = nbBlocks
      }

      try {
        const response = await this.api.get(reqURL, { params: q })
        return response.data
      } catch (e) {
        throw this.createErrorString('estimateFee', e)
      }
    }

    createErrorString (functionName, error) {
      let extraErrorText = ''

      if (error && error.response) {
        if (error.response.status) { extraErrorText += error.response.status + ' ' }
        if (error.response.statusText) { extraErrorText += error.response.statusText + ' | ' }
        if (error.response.data) { extraErrorText += error.response.data }
      } else {
        extraErrorText = error.toString()
      }

      return new Error('Unable to ' + functionName + ': ' + extraErrorText)
    }
  }
