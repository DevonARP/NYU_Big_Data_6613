//Command line codes, run these in order to run the script, the first5 just imports the files, the next 2 open up mongo shell and the database, and the last one rund this script, change paths as needed
//mongoimport "C:\Users\poona\Downloads\restaurants.json" -d apbd5254 -c restaurants
//mongoimport "C:\Users\poona\Downloads\durham-nc-foreclosure-2006-2016.json" -d apbd5254 -c foreclosures --jsonArray
//I had to edit the dataset below as it was semicolon seperated, which isn't an allowed seperator in Mong, so I used Notepad++ to and just replaced every semicolon with a comma
//mongoimport "C:\Users\poona\Downloads\Restaurants_in_Durham_County_NC_comma.csv" -d apbd5254 -c durham --type csv --headerline
//mongoimport "C:\Users\poona\Downloads\meteorites.json" -d apbd5254 -c meteorites
//mongoimport "C:\Users\poona\Downloads\worldcities.csv" -d apbd5254 -c cities --type csv --headerline
//mongosh
//use apbd5254
//load("C:/Users/poona/Desktop/ap5254-hw4.js")


//Part1
//Question 1
db.restaurants.count()
//Question 2
db.restaurants.find()
//Question 3
db.restaurants.find({},{restaurant_id:1, name:1, borough:1, cuisine:1})
//Question 4
db.restaurants.find({},{restaurant_id:1, name:1, borough:1, cuisine:1, _id:0})
//Question 5
db.restaurants.find({},{restaurant_id:1, name:1, borough:1, address: {zipcode:1}, _id:0})
//Question 6
db.restaurants.find({borough: 'Bronx'})
//Question 7
db.restaurants.find({borough: 'Bronx'}).limit(5)
//Question 8
db.restaurants.find({borough: 'Bronx'}).skip(5).limit(5)
//Question 9
db.restaurants.aggregate([{$match: {"grades.score" : {$gt: 85} } }])
//Question 10
db.restaurants.aggregate([{$match: {"grades.score" : {$gt:80, $lt:100} } }])
//Question 11
db.restaurants.aggregate([{$match: {"address.coord.0" : {$lt:-95.754168} } }])
//Question 12, American has a space behind it in the data for some reason
db.restaurants.aggregate([{$match: {"address.coord.0" : {$lt:-65.754168},"cuisine" : {$ne: "American "}, "grades.score" : {$gt: 70} } }])
//Question 13, Can't find any for the specified criteria
db.restaurants.find({"address.coord.1": {$lt:-65.754168},"cuisine" : {$ne: "American "},"grades.score" : {$gt: 70}},{"restaurant_id" : 1,"name":1,"address":1})
//Question 14
db.restaurants.aggregate([{$match: {"cuisine" : {$ne: "American "}, "grades.grade" : "A", "borough" : {$ne: "Brooklyn"} } }]).sort({"cuisine":-1})
//Question 15
db.restaurants.find({"name": /^Wil/},{restaurant_id:1, name:1, borough:1, cuisine:1})
//Question 16
db.restaurants.find({"name": /ces$/},{restaurant_id:1, name:1, borough:1, cuisine:1})
//Question 17
db.restaurants.find({"name": /Reg/},{restaurant_id:1, name:1, borough:1, cuisine:1})
//Question 18
db.restaurants.find({borough: 'Bronx', $or: [ { "cuisine" : "American " }, { "cuisine" : "Chinese" }]})
//Question 19
db.restaurants.find({$or: [ { "borough" : "Staten Island" }, { "borough" : "Queens" }, { "borough" : "Bronx" }, { "borough" : "Brooklyn" }]},{restaurant_id:1, name:1, borough:1, cuisine:1})
//Question 20
db.restaurants.find({borough: {$nin :["Staten Island","Queens","Bronx","Brooklyn"]}},{restaurant_id:1, name:1, borough:1, cuisine:1})
//Question 21
db.restaurants.aggregate([{$match: {"grades.score" : {$lt: 10} } }, { "$project": {restaurant_id:1, name:1, borough:1, cuisine:1}}])
//Question 22
db.restaurants.find({$or: [{"name": /^Wil/},{$and: [{"cuisine" : {$ne :"American "}},{"cuisine" : {$ne :"Chinese"}}]}]},{restaurant_id:1, name:1, borough:1, cuisine:1})
//Question 23
db.restaurants.find({"grades.date":ISODate("2014-08-11T00:00:00Z"), "grades.grade":"A", "grades.score" : 11.},{restaurant_id:1, name:1, grades:1})
//Question 24
db.restaurants.find({"grades.1.date":ISODate("2014-08-11T00:00:00Z"), "grades.1.grade":"A", "grades.1.score" : 9.},{restaurant_id:1, name:1, grades:1})
//Question 25
db.restaurants.find({"address.coord.1": {$gt : 42, $lte : 52}},{"restaurant_id" : 1,"name":1,"address":1})


//Part 2
//Question 1
//So there isn't any data for the filters given in the question, so I'm changing the field and value taht was mentioned to Type_Description and 1 - Restaurant
//Created a new collection with the filtered data
db.durham.find({"Type_Description": "1 - Restaurant","Seats":{$gte:100} }).forEach(function(x) { db.output.insert({"_id":x._id,"loc":{"type":"Point","coordinates":[x.geolocation,x.field23]},"ID":x.ID})})
//Used 2dsphere to get the coordinates in order
db.output.createIndex( { geolocation : "2dsphere" } )
//Center Point
//35.9618939, -78.9779035
db.output.find().skip(db.output.find().count()/2).limit(1)
//Question 2
//Used 2dsphere to get the coordinates in order
db.foreclosures.createIndex( { geometry : "2dsphere" } )
//Had to switch the positions because MongoDB and the data had it with longitude first
db.foreclosures.find({geometry:{$geoWithin: { $centerSphere: [ [ -78.9779035, 35.9618939 ], 10/3958.8 ] } }})
db.foreclosures.find({geometry:{$geoWithin: { $centerSphere: [ [ -78.9779035, 35.9618939 ], 10/3958.8 ] } }}).count()


//Extra Credit
//Cleaning up the worldcities file, had to switch lat and long
db.cities.find().forEach(function(x) { db.newcities.insert({"_id":x._id,"city":x.city,"city_ascii":x.city_ascii,"loc":{"type":"Point","coordinates":[x.lng,x.lat]},"country":x.country,"capital":x.capital,"id":x.id})})
//Making the datetime in readable format
db.meteorites.aggregate([{ $addFields: { date: { $toDate: "$year" } } },{$out:"output2"}])
//Giving the coordinates an index
db.newcities.createIndex( { loc : "2dsphere" } )
db.meteorites.createIndex( { geolocation : "2dsphere" } )
db.output2.createIndex( { geolocation : "2dsphere" } )
//Nearest City
db.output2.find({fall: 'Fell',geolocation: { $exists: true },date: { $gte: ISODate("1950-01-01T00:00:00.000Z")}}).forEach(function(x) { print("Meteorite:", x.name, x.geolocation, db.newcities.find({loc:{$near:{$geometry: {"type":"Point","coordinates":x.geolocation.coordinates}}}},{city:1,county:1,loc:1}).limit(1))})


