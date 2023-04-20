//Command line codes, run these in order to run the script, the first5 just imports the files, the next 2 open up mongo shell and the database, and the last one rund this script, change paths as needed
//mongoimport "C:\Users\poona\Downloads\restaurants.json" -d apbd5254 -c restaurants --jsonArray
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
db.restaurants.find({grades : { $elemMatch:{"score":{$gt : 85}}}})
//Question 10, I was going to make a set of documetns where they  all have atleast 1 grade less than 80 and subtract than from the set of all documents and then take taht set and get another set from it where all documetns have atleast 1 grade above 100 and subtract that from the previous set
//But when I took the set of documetns with atleast 1 grade less than 80, it ended up being all documents, so tehre wouldn't be anything here
var x = db.restaurants.find({grades : { $elemMatch:{"score":{$lt : 80}}}})
x.count()
//Just in case the corrections are wrongly worded, the line below gets all of the documents that have a value between 80 and 100
db.restaurants.aggregate([{$match: {"grades.score" : {$gt:80, $lt:100} } }])
//Question 11, with the corrections asked for, longitude is first in the coordinates, guessing because mongo prefers that
db.restaurants.aggregate([{$match: {"address.coord.0" : {$lte:-73.9} } }])
//Question 12, American has a space behind it in the data for some reason
db.restaurants.find({$and: [{"address.coord.0" : {$lt:-65.754168}},{"cuisine" : {$ne: "American "}},{"grades.score" : {$gt: 70}}]})
//Question 13,
db.restaurants.find({"address.coord.0": {$lt:-65.754168},"cuisine" : {$ne: "American "},"grades.score" : {$gt: 70}})
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
//Question 25,
db.restaurants.find({"address.coord.1": {$gt : 42, $lte : 52}},{"restaurant_id" : 1,"name":1,"address":1})


//Part 2
//So there isn't any data for the filters given in the question, so I'm changing the field and value taht was mentioned to Food Service
//Created a new collection with the filtered data, put longitude first since mongo prefers that
db.durham.find({"Rpt_Area_Desc": "Food Service","Seats":{$gte:100},field23: { $exists: true } }).forEach(function(x) { db.output.insert({"_id":x._id,"loc":{"type":"Point","coordinates":[x.field23,x.geolocation]},"ID":x.ID})})
db.output.find().sort({"loc.coordinates.0":-1,"loc.coordinates.1":-1}).forEach(function(x) { print(x.loc.coordinates)})
//Copied and pasted the data from the above line into python and made the coordiantes into a convex hull which got me the key points to make the polygon needed for this question
//Used 2dsphere to get the coordinates in order
db.output.createIndex( { loc : "2dsphere" } )
db.foreclosures.createIndex( { geometry : "2dsphere" } )
db.foreclosures.find({geometry: {$geoIntersects: {$geometry:{"type": "Polygon","coordinates": [[
[-78.9825183, 36.0322856],
[-79.0057432, 35.9067074],
[-78.8667135, 35.8703056],
[-78.8388266, 35.8767831],
[-78.8108783, 35.9205016],
[-78.8264275, 36.0984257],
[-78.8482093, 36.1027227],
[-78.9114595, 36.0765775],
[-78.9825183, 36.0322856]
]]}}}})



//Extra Credit
//Cleaning up the worldcities file, put longitude first since mongo prefers it
db.cities.find().forEach(function(x) { db.newcities.insert({"_id":x._id,"city":x.city,"city_ascii":x.city_ascii,"loc":{"type":"Point","coordinates":[x.lng,x.lat]},"country":x.country,"capital":x.capital,"id":x.id})})
//Making the datetime in readable format
db.meteorites.aggregate([{ $addFields: { date: { $toDate: "$year" } } },{$out:"output2"}])
//Giving the coordinates an index
db.newcities.createIndex( { loc : "2dsphere" } )
db.output2.createIndex( { geolocation : "2dsphere" } )
//Nearest City
db.output2.find({fall: 'Fell',geolocation: { $exists: true },date: { $gte: ISODate("1950-01-01T00:00:00.000Z")}}).forEach(function(x) { print("Meteorite:", x.name, x.geolocation, db.newcities.find({loc:{$near:{$geometry: {"type":"Point","coordinates":x.geolocation.coordinates}}}},{city:1,county:1,loc:1}).limit(1))})



