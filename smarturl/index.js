//server always run the index file first so we give name index.js
//header file..important file that tells about server and routes..
var express=require('express');
//calling the express function and store in app var--
var app=express();
//mongodb connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://aarti:aartiv123@ds161322.mlab.com:61322/aartiv');
//Database Setup
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {         
      // we're connected!
      console.log("Connected To MongoLab Cloud Database :p");
}); 
//Schema Setup
var urlSchema = mongoose.Schema({
    url: String,
    key: String,
   hits: Number,
    created: String
});
//Model Setup
var Url = mongoose.model('Url', urlSchema);

app.set('views', __dirname+'/views');
app.use(express.static(__dirname+ '/public'));
app.use(express.static(__dirname+ '/static'));
//parse/convert the req into its own format and works as middleware
var bodyParser = require('body-parser')
 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json())
//create a route-- / is a route
app.get('/',function(req,res){
	res.sendFile('simp1.html',{root:__dirname});
});
//array to store url and key
//var url_arr=[];
//var key_arr=[];
//for processing to get short url like http://googl.com/
app.post('/short',function(req,res){
	//generating a key
	function makeId(){
		var text = "";
   	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    	for(var i=0; i < 5; i++)
        	text += possible.charAt(Math.floor(Math.random() * possible.length));
    	return text;	
	}

	//req get the data which is send in init.js
    var u=req.body.url;
    var k=req.body.key;
    if(k == "")
	k = makeId();
	var h = 0;
	var c = new Date();
	if(u != ""){
		// Adding values in DB
	var newUrl = new Url({ url: u,key:k, hits: h, created: c});
	newUrl.save(function (err, testEvent) {
  if (err) 
  	return console.error(err);
  console.log("Short Url Created!!");
});

	//adding values in array
	//url_arr.push(u);
	//key_arr.push(k);
	console.log("Url: "+u+'\nKey: '+k+'\nHits: '+h+'\nCreated at: '+c+'\n');
	res.send(k);
}
});
app.post('/check',function(req, res){
	var k = req.body.key;
    Url.find({key:k},function (err, success) {
        if(success.length>0)
          res.send('available');
        else
          res.send('unavailable');
        if (err) 
        	return console.error(err);
    });
});


//to redirect
app.get('/:link', function(req,res){
	var key=req.params.link;
	//console.log("redirect request for: "+key);
	//check if the key exist
	//for(var i=0; i<key_arr.length;i++)
	//{
	//	if(key_arr[i]==key)
	//		res.redirect(url_arr[i]);
	//}
	Url.findOne({key:key},function (err, url) {
        console.log(url);
        if (url) 
        	res.redirect(url.url);
        else if(err)
        	return console.error(err);
    });
    console.log("redirect request for: "+key);
	//if the url is not available in
	//res.send('404 page is not found!');
});
app.get('/*',function(req,res){
	res.send('404 page is not found!');
});

//server configuration
app.listen(process.env.PORT || 3000,function(){
	console.log('server is up and running');
});