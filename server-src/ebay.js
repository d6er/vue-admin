const axios = require('axios')
const xml2js = require('xml2js')
const js2xml = require('js2xmlparser')

const apiUrl = 'https://api.sandbox.ebay.com/ws/api.dll'

const config = {
  headers: {
    'X-EBAY-API-COMPATIBILITY-LEVEL': 1027,
    'X-EBAY-API-SITEID': 0,
    'X-EBAY-API-DEV-NAME': 'e60361cd-e306-496f-ad7d-ba7b688e2207',
    'X-EBAY-API-APP-NAME': 'Yoshihir-1b29-4aad-b39f-1be3a37e06a7',
    'X-EBAY-API-CERT-NAME': '8118c1eb-e879-47f3-a172-2b08ca680770'
  }
}
    
const methods = {
  
  call: function (callName, data) {
    
    config.headers['X-EBAY-API-CALL-NAME'] = callName
    
    let xml = methods.js2xml(callName, data)
    
    return axios.post(apiUrl, xml, config).then(response => methods.xml2js(response.data))
  },
  
  xml2js: function (xml) {
    return new Promise((resolve, reject) => {
      const parser = xml2js.Parser({ explicitArray: false })
      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err)
        } else {
          let keys = Object.keys(result)
          let data = result[keys[0]]
          delete data['$']
          resolve(data)
        }
      });
    })
  },
  
  js2xml: function (rootName, data) {
    
    let xml = js2xml.parse(rootName, data, {
      declaration: { encoding: 'UTF-8' }
    });
    
    xml = xml.replace('<' + rootName + '>',
                      '<' + rootName + ' xmlns="urn:ebay:apis:eBLBaseComponents">');
    return xml;
  }
  
}

module.exports = methods
