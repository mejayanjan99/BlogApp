var express=require('express'),
	mongoose=require("mongoose"),
	app=express(),
	bodyParser=require("body-parser"),
	methodOverride=require("method-override"),
	expressSanitizer=require("express-sanitizer");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// APP CONFIG
mongoose.connect("mongodb://localhost/BlogApp");
app.set("view engine",	"ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//https://upload.wikimedia.org/wikipedia/commons/a/ae/Carandache_Ecridor.jpg

// MONGOOSE/MODEL CONFIG
var blogSchema= new mongoose.Schema({
	name: String,
	image: String,
	body: String,
	created: {type:Date , default:Date.now}
});
var Blog=mongoose.model("Blog",	blogSchema);

/*Blog.create({
	name:"BlogPost",
	image: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Carandache_Ecridor.jpg",
	body:"This is my first blogpost "
});*/

//RESTFUL ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
})

//INDEX Route
app.get("/blogs",function(req,res){
	Blog.find({},function(err,	blogs){
		if(err){
			console.log("You have an error");
		}
		else{
			res.render("index", {blogs: blogs});
		}
	});
	
});

//NEW Route
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE Route
app.post("/blogs",function(req,res){
	//console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//console.log(req.body);
	Blog.create(req.body.blog,	function(err,NewBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

//SHOW Route
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundblog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",	{blog: foundblog});
		}
	});
});

//EDIT Route
app.get("/blogs/:id/edit", function(req,res){
	//Finding the blog
	Blog.findById(req.params.id,	function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	});
	
});

//UPDATE Route
app.put("/blogs/:id",	function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,	req.body.blog,	function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
	//res.send("Updated");
});

//DELETE Route
app.delete("/blogs/:id",	function(req,res){
	Blog.findByIdAndRemove(req.params.id,	function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
		
	});
});

app.listen("3000",	function(){
	console.log("BlogApp has started");
});