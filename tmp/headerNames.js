db['emails.31'].find().forEach(doc => {
  
  let headerNames = doc.payload.headers.map(h => h.name)
  headerNames = headerNames.filter((n,i) => {
    return headerNames.indexOf(n) == i
  })
  
  db['emails.31'].updateOne(
    {
      _id: doc._id
    },
    {
      $set: {
        headerNames: headerNames
      }
    }
  )
})
