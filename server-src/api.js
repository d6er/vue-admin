const fs = require('fs')
const moment = require('moment-timezone')
const mongo = require('./mongo')
const google = require('./google')
const config_client = require('../config/client')

const methods = {
  
  fetchItems: ({ user_id, list, filter, filterForm, page }) => {
    
    let mergedFilter = methods.getMergedFilter(list, filter, filterForm)
    
    let zone = moment.tz.guess()
    
    return mongo.fetchItems({ user_id, list, filter: mergedFilter, page }).then(result => {
      
      let listConfig = config_client.lists.find(l => l.name == list)
      
      mergedFilter.columns.map(column => {
        let fieldConfig = listConfig.fields.find(field => field.name == column)
        if (fieldConfig.type == 'datetime') {
          result.items.forEach(item => {
            item[column] = moment(item[column]).tz(zone).format('MMM D HH:mm')
          })
        }
      })
      
      result.mergedFilter = mergedFilter
      
      return result
    })
  },
  
  refreshList: ({ user_id, list, filter, page }) => {
    
    return mongo.getUser(user_id).then(user => {
      
      return user.accounts.filter(account => account.provider == 'google')
      
    }).then(googleAccounts => {
      
      return Promise.all(googleAccounts.map(account => {
        
        let oauth2Client = google.getOAuth2Client(account)
        
        return mongo.getMaxHistoryId(user_id, list, account).then(r => {
          
          if (r && r.historyId) {
            
            // partial sync
            return google.historyList(oauth2Client, r.historyId).then(r => {
              let message_ids = []
              if (r.history) {
                r.history.map(e => {
                  if (e.messages) {
                    e.messages.map(message => {
                      message_ids.push(message.id)
                    })
                  }
                })
              }
              message_ids = [...new Set(message_ids)]
              return message_ids
            })
            
          } else {
            
            // full sync
            return google.messagesList(oauth2Client).then(r => {
              let message_ids = []
              r.messages.map(message => {
                message_ids.push(message.id)
              })
              return message_ids
            })
          }
          
        }).then(message_ids => {
          
          console.log(account.emails[0].value + ' : ' + message_ids.length)
          
          return Promise.all(message_ids.map((message_id, idx) => {
            
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log(idx)
                return google.messagesGet(oauth2Client, message_id).then(responseMessage => {
                  let converted = google.convertMessage(responseMessage)
                  converted.account = account.emails[0].value
                  return mongo.saveItem({ user_id: user_id,
                                          list: list,
                                          item: converted })
                }).then(r => {
                  resolve()
                })
              }, idx * 500)
            })
            
          }))
        }).catch(e => {
          console.dir(e)
          return
        })
      }))
      
    }).then(savedResults => {
      return mongo.fetchItems({ user_id: user_id,
                                list: list,
                                filter: filter,
                                page: page })
    })
  },
  
  uploadImage: ({ name, file }) => {
    const buffer = Buffer.from(file, 'base64');
    return new Promise((resolve, reject) => {
      fs.writeFile('./images/' + name, buffer, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve({ path: '/images/' + name })
        }
      })
    })
  },
  
  getMergedFilter: (listName, urlFilter, filterForm) => {
    
    let filter = { queries: [], sorting: [], columns: [] }
    let definedFilters = config_client.lists.find(e => e.name == listName).filters
    let path = urlFilter.split(',')
    
    for (let i in path) {
      let arr = path[i].split(/:/)
      
      let thisFilter = {}
      if (filterForm && i == (path.length - 1)) {
        thisFilter = filterForm
      } else {
        let refFilter = definedFilters.find(filter => filter.name == arr[0])
        thisFilter = JSON.parse(JSON.stringify(refFilter)) // deep copy
      }
      
      // queries
      if (arr.length == 2) {
        filter.queries.push({
          field: thisFilter.foreach,
          condition: 'is equal to',
          value: arr[1]
        })
      }
      if (thisFilter.queries) {
        filter.queries.push.apply(filter.queries, thisFilter.queries)
      }
      
      // sorting
      if (thisFilter.sorting) {
        filter.sorting = thisFilter.sorting
      }
      
      // columns
      if (thisFilter.columns) {
        filter.columns = thisFilter.columns
      }
    }
    
    return filter
  }
  
}

module.exports = methods
