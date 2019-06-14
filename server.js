var http = require('http');
http.createServer(makeResponse).listen(3001);
imagesURL = "http://gwf-demo.usask.ca/DummyServer/"
/* var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "pass"
});

con.connect(function(err) {
  if (err) throw err;
  
});
 */
function makeResponse(req, res){
	const url = require('url');

	const parsedURL = url.parse(req.url,true);
	action = parsedURL.query.action;
	callback = (parsedURL.query.callback)? parsedURL.query.callback : "callback";
	let query = parsedURL.query;
	response = "";
	if(action !== undefined){

		switch(action){
			case "fetchHomepageComponents":
					response = fetchHomepageComponents();
			break;
			case "fetchProductById":
					response = fetchProductById(query.productId);
			break;
			case "fetchListOfCategories":
					response = fetchListOfCategories();
			break;
			case "fetchProductsByCategoryId":
					response = fetchProductsByCategoryId(query.categoryId,query.loadedProductsOffset,query.searchKey,query.sortBy);
			break;
			case "fetchRelatedItemsByProductId":
					response = fetchRelatedItemsByProductId(query.productId);
			break;
			default:
				res.writeHead(404, {
					'Content-Type': 'text/plain',
					"Access-Control-Allow-Origin": "*",
					'Access-Control-Allow-Methods': 'DELETE, PUT, GET, POST',
					"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
				});
				res.end('{"message": Invalid Request}');
			break;
		}
		header = {
			'Content-Type': 'text/plain',
			"Access-Control-Allow-Origin": "*",
			'Access-Control-Allow-Methods': 'DELETE, PUT, GET, POST',
			"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
		}
		res.writeHead(200, header);
 
		res.end(JSON.stringify(response));

	}
	

}

fetchProductById = (productId) => {
	let productArray = allProducts.filter(product => {
		return (product.id == parseInt(productId)) ;
	});
	return productArray[0];
}


fetchProductsByCategoryId = (categoryId,loadedProductsOffset,searchKey,sortBy) => {
	const LIMIT = 10;
	searchKey = searchKey.toLowerCase();
	loadedProductsOffset = parseInt(loadedProductsOffset);
	const START_INDEX = loadedProductsOffset * LIMIT;
	const END_INDEX = ((loadedProductsOffset+1)*LIMIT)
	let productsArray = [];
	if(categoryId == -1 ){
		productsArray = allProducts.filter(product => {

			return (product.productTitle.toLowerCase().indexOf(searchKey) !== -1) ;
		});;
	}else{
		productsArray = allProducts.filter(product => {

			return ((product.category === parseInt(categoryId))&&(product.productTitle.toLowerCase().indexOf(searchKey) !== -1)) ;
		});

	}
	if((sortBy !== undefined)&&(sortBy.length > 0)){
		// todo run sort by sortBy
		let newArray = [];
		switch (sortBy) {
			case "priceHighToLow":
					newArray = productsArray.sort(function(a, b){
						var keyA = parseInt(a.priceIs),
							keyB = parseInt(b.priceIs);
						// Compare the 2 dates
						if(keyA < keyB) return -1;
						if(keyA > keyB) return 1;
						return 0;
					});
				break;
			case "priceLowToHigh":
					newArray = productsArray.sort(function(a, b){
						var keyA = parseInt(a.priceIs),
							keyB = parseInt(b.priceIs);
						// Compare the 2 dates
						if(keyA > keyB) return -1;
						if(keyA < keyB) return 1;
						return 0;
					});
				break;
			case "ratingHighToLow":
					newArray = productsArray.sort(function(a, b){
						var keyA = parseFloat(a.avarageRate),
							keyB = parseFloat(b.avarageRate);
						// Compare the 2 dates
						if(keyA > keyB) return -1;
						if(keyA < keyB) return 1;
						return 0;
					});
				break;
		
			default:
				newArray = productsArray;
				break;
		}

		
		return newArray.slice(START_INDEX  ,END_INDEX);


	}

	return productsArray.slice(START_INDEX  ,END_INDEX);
}

fetchRelatedItemsByProductId = (productId) => {
	productId = parseInt(productId);
	product = allProducts.filter(product => product.id === productId)[0];
	categoryId = product.category;

	let productsArray = allProducts.filter(product => {
		return ((product.category == parseInt(categoryId)) && (product.id !== productId)) ;
	});
	return productsArray.slice(0,4);
}


fetchHomepageComponents = () =>{
	let newCategoriesList = allCategories.map(category => {
		category.numberOfProducts = getNumberOfProducts(category.id);
		return category
	});
	
	
	return( {
		"mainSlider":[
			{
				"img" : imagesURL+"images/slides/slide1.jpg",
				"caption":{
					"tag" : "#NEW ARRIVAL",
					"title" : "Shop by Occasion",
					"description" : "Lorem ipsum dolor sit amet, consectetur elit hendrerit tincidunt nec eu lorem. Nam non."				
				}
			},
			{
				"img" : imagesURL+"images/slides/slide2.jpg",
				"caption":{
					"tag" : "#The Joy of Shoping",
					"title" : "Peace of mind",
					"description" : "Lorem ipsum dolor sit amet, consectetur elit hendrerit tincidunt nec eu lorem. Nam non."				
				}
			}
		],
		"categories" : newCategoriesList,
/* 		"featuredProducts" : [
								allProducts[105],
								allProducts[100],
								allProducts[150],
								allProducts[20],
								allProducts[25],
								allProducts[30],
								allProducts[35],
								allProducts[40],
								allProducts[45]
							], */
		"featuredProducts" : [
								{"Beauty":[
										allProducts[0],
										allProducts[5],
										allProducts[10],
										allProducts[11],
									]
								},
								{"Electronics":[
										allProducts[31],
										allProducts[34],
										allProducts[36],
										allProducts[17],
									]
								},
								{"Jewelry":[
										allProducts[9],
										allProducts[12],
										allProducts[40],
										allProducts[23],
									]
								},
								{"Sport":[
										allProducts[19],
										allProducts[20],
										allProducts[30],
										allProducts[35],
									]
								}
							],
		"todayDeals" : [
						allProducts[55],
						allProducts[60],
						allProducts[65],
						allProducts[70],
					]
	});

}
fetchListOfCategories = () =>{
	let newCategoriesList = allCategories.map(category => {
		category.numberOfProducts = getNumberOfProducts(category.id);
		return category
	});
	
	return newCategoriesList ;

}


getNumberOfProducts = (categoryId) =>{
	let productsWithSameCategoryId = allProducts.filter(product =>{
		return product.category === categoryId
	});
	return productsWithSameCategoryId.length;
}

allCategories = [
/* 	{
		"name" : "Outdoor",
		"id" : 0,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Outdoor.jpg"
	}, */
	{
		"name" : "Beauty",
		"id" : 1,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Beauty.jpg"
	},
	{
		"name" : "Health",
		"id" : 2,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Health.jpg"
	},		{
		"name" : "Jewelry",
		"id" : 3,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Jewelry.jpg"
	},
	{
		"name" : "Kids",
		"id" : 4,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Kids.jpg"
	},		{
		"name" : "Men's Clothing",
		"id" : 5,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/MensClothing.jpg"
	},
	{
		"name" : "Shoes",
		"id" : 6,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Shoes.jpg"
	},
	{
		"name" : "Women's Clothing",
		"id" : 7,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/WomensClothing.jpg"
	},
	{
		"name" : "Camera",
		"id" : 8,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Camera.jpg"
	},
	{
		"name" : "Car Electronics",
		"id" : 9,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/CarElectronics.jpg"
	},
	{
		"name" : "Cell Phones",
		"id" : 10,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/CellPhones.jpg"
	},
	{
		"name" : "Video Games",
		"id" : 11,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/VideoGames.jpg"
	},
	{
		"name" : "Sports",
		"id" : 12,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Sports.jpg"
	},
	{
		"name" : "Stamp",
		"id" : 13,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Stamp.jpg"
	},
	{
		"name" : "Bedding",
		"id" : 14,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Bedding.jpg"
	},
	{
		"name" : "Crafts",
		"id" : 15,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Crafts.jpg"
	},
	{
		"name" : "Housekeeping",
		"id" : 16,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Housekeeping.jpg"
	},
	{
		"name" : "Kitchen",
		"id" : 17,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Kitchen.jpg"
	},
	{
		"name" : "Tools",
		"id" : 18,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/Tools.jpg"
	}

];

allProducts = [
	{
	   "productTitle":"nonda ZUS Smart Vehicle Health Monitor, Wireless OBD2 Car Code Reader Scan Tool, OBD with App, World’s First Predictive Safety Center Analyzing Historical Engine Data for Potential Issues",
	   "desc":"",
	   "category":1,
	   "images":[
		  "71DCB9G8zwL._SX679_.jpg",
		  "71-bs7jLmML._SX679_.jpg",
		  "61IB80g1nbL._SX679_.jpg",
		  "61NcJf4-m3L._SX679_.jpg",
		  "61JPdHe1o4L._SX679_.jpg",
		  "61lw5i5N9%2BL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"59.99",
	   "priceIs":93,
	   "comments":[
		  "This is the best OBD I’ve used! It operates as advertised. I stumbled trying to connect it to the app, because I assumed I had to connect it with Bluetooth to the phone first. After actually reading the very simple instructions I discovered that it connects through the app directly. The interface is fantastic. The detail from a check engine light is extensive. I can’t wait to try to out their other products.",
		  "Super produit",
		  "Got this today and tried it on my truck dodge ram 1500 2014 ,sadly it doesn't scan but you'll see the rev and temp not much use ,",
		  "Very informative",
		  "Great lightweight gadget. Let me know about an error code that didnt even come up on my dash.",
		  "Not very satisfied he can’t give me status on my wheel sensor code",
		  "This is an amazing gadget, it checks your car health including fuel , ignition system, air flow and many other items and gives you full report",
		  "great product with great customer service"
	   ],
	   "numberOfRates":181,
	   "avarageRate":4.030907598078368,
	   "id":1
	},
	{
	   "productTitle":"OTC 5610 Transmission/Engine Oil Pressure Kit",
	   "desc":"",
	   "category":2,
	   "images":[
		  "71crRxVRB0L._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":2775,
	   "comments":[
		  "I love OTC tools and they have never let me down, until now. Although there is nothing wrong with this tool, I was really disappointed when I discovered that none of the adapters would fit in a 2008 BMW X5 (3.0). The one time I was really depending upon this tool, it could not deliver. Needless to say, I was left looking around for alternatives and other oil pressure testing units, more things that I need to purchase to do the exact same thing. I know it is hard to get all the fittings for all the manufacturers, but at least you should be able to find them for the big manufacturers, such as BMW.",
		  "No complaints about anything included in this kit, only issue is that I've run into a few oil pressure switches with uncommon threads that this kit does not cover. I don't mean to be picky or unreasonable, but OTC tools are marketed to the professional technician, and I don't think it's too unreasonable to expect a bit more complete model coverage for the extra couple dollars it would cost them to include the few needed adaptors.",
		  "I used it to verify my electric oil pressure gauge as I had some weird things happening and it worked great. It's nice to get a product that has everything you need versus having to head to the store to grab fittings. My one and only complaint is the case is a bit tight getting all that hose in and out, but it does fit, you just have to work at it a bit.",
		  "This is a nice gauge set and seems accurate when compared to other gauges. Some of the fittings are machined from soft aluminum though and the threads don't hold up at all to regular use. A good improvement to this product would be to ditch the aluminum for all brass or stainless fittings.",
		  "Received in a timely fashion. Happy with purchase. Recommend as a good buy.",
		  "I am a licensed mechanic and My expectations were exceeded on this purchase. another great OTC product! very satisfied! amazon is mint!",
		  "Tres Satisfait !",
		  "good buy, comes with a lot of standard fittings for oil ports/transmission ports"
	   ],
	   "numberOfRates":45,
	   "avarageRate":4.286715035922383,
	   "id":2
	},
	{
	   "productTitle":"OTC 4506 Fuel Line Clamp Set - 2 Piece",
	   "desc":"",
	   "category":3,
	   "images":[
		  "511ut0KBVbL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"19.98",
	   "priceIs":3509,
	   "comments":[
		  "These work great for small coolant and fuel hoses on sleds in tight spaces. I was very pleased with the quality and strength of these little guys.",
		  "Do the job as expected,also work well to hold objects together while maybe fasting a screw or whatever ,nice",
		  "Used it on a small coolant hose and it worked perfectly. Easy to use.",
		  "Same price $12.26 CAD which u can buy from store, but ok!!",
		  "very good recommended.",
		  "These are made of steel vs the plastic ones you see elsewhere. Perfect for brake lines when your replacing rotors."
	   ],
	   "numberOfRates":30,
	   "avarageRate":5.809510505109554,
	   "id":3
	},
	{
	   "productTitle":"Innova 3020d Check Engine Code Reader w/ABS (Brakes), DTC Severity, Emissions Diagnostics Easy to Use HotKeys OBD2 (OBD II) Vehicles",
	   "desc":"",
	   "category":3,
	   "images":[
		  "71cQVqghlxL._SY355_.jpg",
		  "71z7pC3eNFL._SY355_.jpg",
		  "71OMfo0LQAL._SY355_.jpg",
		  "716rHAxBM8L._SY355_.jpg",
		  "81FTELQz5qL._SY355_.jpg",
		  "71JHTCIhR5L._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":4113,
	   "comments":[
		  "Do not waste your money on this scanner, the cord is too short for you to sit up in the seat and read the info and the screen is very tiny. It is not back lit so you have to use a light to read it. I couldn’t find any vehicle that ABS would read, it said “no support”. It did read codes but with zero explanation of what the codes meaning was. It did not read any live data. Absolutely useless.",
		  "Easy to read, easy to understand, easy to hook up",
		  "Unit reads and erases codes, and that's about it. Very few instructions.",
		  "paid for its self the day it came Awesome",
		  "Work great drop the check engine light out and stayed out",
		  "Have used this on both domestic and import cars with no issues. Picks up the abs codes that our cheap Bluetooth model doesn't, so we're quite happy with it.",
		  "Bought as a gift for my husband. This will be useful for when the engine light comes on.",
		  "Basic scan tool but does what it is supposed to."
	   ],
	   "numberOfRates":114,
	   "avarageRate":1.6332693290771205,
	   "id":4
	},
	{
	   "productTitle":"Sunex Tools 3930 Master Brake Caliper Tool Set",
	   "desc":"",
	   "category":1,
	   "images":[
		  "716c%2BDAESHL._SX569_.jpg",
		  "71bCzE-daUL._SX569_.jpg",
		  "71UzCbG91OL._SX569_.jpg",
		  "81aLaUa4b%2BL._SX569_.jpg",
		  "915l6fVw3XL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"98.19",
	   "priceIs":4540,
	   "comments":[
		  "It works fine for a Ford Escape 2013 and 2017 with electric park brake.",
		  "Does everything I want it to do",
		  "A bit pricey but overall quality is excellent. Beautiful gun metal rust resistant finish. This tool set should last a DIY or seasoned mechanic a lifetime. Tried renting a similar set from my auto parts store. Also tried purchasing another brand prior to this one. Unfortunately neither had the proper adapter for my car. I hit pay dirt with this one. It fits my 2013 Ford Escape rear caliper pistons perfectly and made rewinding the pistons an absolute breeze. Wish I had this tool set in my arsenal years ago.",
		  "I bought this to replace my Astro set that the pins broke in and the handles bent. This set feels soooo much better than the cheap Astro set . It feels so much stronger and far better built and it ever feels smoother turning in the caliper pistons. This is an amazing set ! And did a great price ! Not the cheapest but not the most expensive either . Don’t cheap out get this set",
		  "Fantastic product once again. Super high quality for bargain prices. Way to go Sunex... Keep doing what your doing and you will put the price gouging tool truck guys out of business.",
		  "This tool is a replacement for a bluepoint one I had as this covers more makes and models.",
		  "This is a reasonably priced quality caliper service tool set. It includes a reverse screw press tool needed for service on Ford Taurus, Freestyle, and Taurus X models. The blow molded case secures the tools well. I had ordered another brand that was less expensive, but of hideous quality, thanks Amazon for efficient returns. This Sunex set is highly recommended."
	   ],
	   "numberOfRates":34,
	   "avarageRate":3.392286535178978,
	   "id":5
	},
	{
	   "productTitle":"Robinair 15510 VacuMaster Single Stage Vacuum Pump",
	   "desc":"",
	   "category":2,
	   "images":[
		  "914fMuutwLL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":2332,
	   "comments":[
		  "The pump seems fine although I have not used it yet because it was delivered with the Amazon Box facing up but the box inside upside-down so the bottle of vacuum oil leaked everywhere and there wasn't enough to fill the pump. I now need to go out and buy a bottle of expensive oil and roll of paper towels to clean this mess up.",
		  "I used it to draw down a car AC unit. Worded really well. But that was only once. It might sit for a long time before I use it again. It would have cost a lot more than the price of the pump for someone else to do it.",
		  "I love this pump I have used it's baby brother for many years and am pleasantly surprised how much faster big brother is.",
		  "Great product! Works great.",
		  "Good value for the price.",
		  "Great quiet pump. Works awesome and has power toggle switch and detachable AC power supply. Great name brand for good price.",
		  "Good product",
		  "Loved this machine."
	   ],
	   "numberOfRates":46,
	   "avarageRate":2.7832526444126504,
	   "id":6
	},
	{
	   "productTitle":"Slime 2080-A Rubber Tire Valve Stems 1 1/4\" TR 413",
	   "desc":"",
	   "category":2,
	   "images":[
		  "71QuHvzX8%2BL._SY879_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":1902,
	   "comments":[
		  "Good",
		  "good quality",
		  "Parfait",
		  "I got these when I was having some tires mounted and balanced on my Acura RSX. My local tire shop charges $3 per valve stem. These were half the price per valve stem so I saved a couple bucks. Valve stems are a standard diameter (the only thing that differs among valve stems is the length) so these will fit any passenger vehicle.",
		  "Used these with my yard sprayers to allow me to pressurize them from my air compressor, rather than manually pumping them repeatedly. Used an 11/16\" bit for a perfect fit",
		  "These are standard fit for most lawn tires. I use these for garden tractor tires, and they have never leaked or dry rotted over the years. I just recently installed these in a Craftsman Riding mower, and they look great.\n\nTIP: Leave these in the sun, or in-front of a heater for 15 mins before installing to soften the rubber a bit. They will glide right in.",
		  "Use these in conjunction with replacing the tires on your golf cart wheels. The golf cart valve stem wheel hole is 0.463\" in diameter so an automotive valve stem will not work. Use a STEELMAN 00040R valve stem installer tool (available from Amazon) to install.",
		  "Like many others, I purchased this to make my yard sprayer easy to pressurize. Drilled a 15/32 hole, lubed up the rubber with a touch of dish soap, fed the threaded end through and used a claw hammer as puller. Dynamite. Push the tire valve on, pressurize to 20 or 25 PSI, and spray out a full gallon before needing to re-pressurize."
	   ],
	   "numberOfRates":49,
	   "avarageRate":0.4053199091536883,
	   "id":7
	},
	{
	   "productTitle":"Astro Pneumatic 7865 Ball Joint Service Tool with 4-wheel Drive Adapters",
	   "desc":"Designed for high turn-over suspension shops and for use with the most powerful 1/2\" impacts on the market, the 7865 kit provides professional quality in a small form factor kit.",
	   "category":3,
	   "images":[
		  "71bZfi545xL._SX569_.jpg",
		  "916K%2BbfNOrL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"128.00",
	   "comments":[
		  "Two guys at my shop have this kit. one kit is this exact one, the other is branded MAC Tools. They are identical. I waited for it to go on sale for $90 as opposed to paying $350 for the Mac kit. It’ll work for just about any vehicle and they’re invincible. Hammer them tight with an impact gun them pound on it with a 48 oz hammer if need be. No mercy, there’s a lifetime warranty.",
		  "This tool paid for its self and then some during its first use.\n\nQuote was 4 hours per side at over $100 per hour shop rate to do the lower ball joints on our SUV. This tool easily handled the job and will be around for probably the rest of my lifetime. The case is junky and will probably break but for the price I'm super happy. I also did some ATV joints by making an adapter out of pipe.\n\nThe quality of the tool is great. I can't say for sure but I think that this would probably even work in a professional setting surprisingly. You would need more adapters though. Quality seems to be on par with the units that NAPA sells for twice the money. At the very least this would get you going for a few years until you can drop the bucks on a Snapon or something like that.",
		  "Not sure if the never seize that I used on the ball joints last time I did them helped me this time but the tool indeed did its part. very pleased with this product, the downfall in my opinion is that it doesn't have a good variety of cup sizes.",
		  "If you have a 2010 style Silverado 4x4. This kit will work perfectly for upper and lower ball joints. Great kit for the price, lots of different sized cups and the press is heavy duty. Not a \"professional kit\" for a garage but it's all you'll ever need at a home shop for the do it yourself'er.",
		  "Worked great I used it on my upper and lower ball joints on my 87 Chev 4x4 pick up.\nThe only thing that could have made this better was if the kit included the half die.\nThe C press is Heavy duty and can withstand tremendous force.\nVery happy with my purchase\nHighly recommended",
		  "Got the job done and saved on the cost of a mechanic shop doing the job for me. However the lightwall pipe didn't enjoy the amount of pressure I needed to remove one lower balljoint and cracked. Could have been user error or just bad luck...",
		  "Don't waste your money on cheap harbour freight of power fist junk. Get this set and never worry about bending or breaking it again. No problem doing ball joints on my 2500hd.",
		  "I have a few of the astro Pneumatic products in my tool crib.All are exceptionally well made and the price is very reasonable. The ball joint joint kit has exceeded my expectations in quality and performance."
	   ],
	   "numberOfRates":200,
	   "avarageRate":5.212216099139916,
	   "id":8
	},
	{
	   "productTitle":"Mountain 8205 R-134a Brass Manifold Gauge Set with Couplers",
	   "desc":"",
	   "category":3,
	   "images":[
		  "51KDF7u2ynL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":1765,
	   "comments":[
		  "I see this is $10 cheeper than when I ordered it 5 days ago. This guage will not hold a vacuum by itself. L and H not hooked up. That tells me there is a leak in the guage somewhere. I have taken apart every fitting and put pipe tape and still leaks???\nI guess you better reed my policy. It states that what ever I buy had better do what it says or I will reverse cc charge and throw in trash. That is my right as a consumer. You'd better make this right Mountain....",
		  "A year in, and they work well. I have had a few of the o-rings leak a little, but the set comes with replacements. Also strongly recommend putting Nylog on the o-rings - keeps everything from leaking. I replaced the quick changer ends with manual screw type just so I had better control of the connections.\n\nWhen you receive the set, make sure the quick couplers are well tightened onto the hoses - mine weren't and blew open while using (a quick tighten fixed that",
		  "This is a very good kit and will be very handy on diagnostics as well as recharging my a/c system after I repair the leak found by the leak finder . Looks like it is well made and designed and am hoping it will give me good service for years to come .",
		  "Good set. Does the job but take care on purging the air when hooking up the refrigerant. Good value.",
		  "Was cheap to buy but not sure it's really any good for 40 bucks its ok",
		  "good",
		  "Very good no leak ! The only thing is the 14mm adapter on the yellow hose .. It will only fit small cans . Not 30 lbs bottle . So i did cut it and put the standard one for all bottle !!!",
		  "Nice gauge set for the price. Has worked very well so far. Quality seems to be good."
	   ],
	   "numberOfRates":189,
	   "avarageRate":4.144325572249821,
	   "id":9
	},
	{
	   "productTitle":"Fibreglass Evercoat 942 Fiberglass Matting - 8 Square Foot",
	   "desc":"",
	   "category":1,
	   "images":[
		  "51sAEm6ZoFL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"25.26",
	   "priceIs":1941,
	   "comments":[
		  "As described",
		  "great",
		  "Not much to go wrong here folks. It wetted up nice and I had almost no air bubbles at all. What I did have was my fault from working it too long. Great value. Thanks",
		  "Fantastic! Used it to fix a spongie floor on my old boat. Worked amazing!",
		  "Works as intended",
		  "Great price",
		  "As described"
	   ],
	   "numberOfRates":153,
	   "avarageRate":4.0635102175600695,
	   "id":10
	},
	{
	   "productTitle":"Dura Vac AA255 Armor All 10-Litre 2.5-Gallon 2 HP Wet Dry Vaccum Cleaner, Red/Grey",
	   "desc":"",
	   "category":1,
	   "images":[
		  "81VuilBpmhL._SX569_.jpg",
		  "71SV2IZlejL._SX569_.jpg",
		  "81q023weZHL._SX569_.jpg",
		  "71g9MyahH%2BL._SX569_.jpg",
		  "81BEZm%2BscQL._SX569_.jpg",
		  "71FsKNDiSPL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"54.62",
	   "comments":[
		  "I did not get paid or receive anything for my review. I personally purchased and paid for this item on line from Amazon.ca ( Verified Purchase ).\n\nThe “ Armor All “ Dura Vac AA255 2.5-Gallon 2 HP Wet and Dry Vac is very light at 7 lbs. 7.3 oz with all the attachments and the hose inside it, and it has a flat bottom and will not tip over very easily. The hose is just plastic but long enough to reach any area inside any vehicle. The unit is the correct size and shape for both carrying or for placing it inside on the car floor to vacuum. The dimensions are 14 inches tall to the top of the handle and 14 inches wide - front hole to back hole - and 10 inches thick. The on and off switch is a solid rocking style switch with a very audible click and the suction is \" unbelievably super strong \" for only a 2 HP vacuum.\n\nThe noise is sufficient but still less than any household canister vac that I have ever used or owned. It comes with a small piece of velcro attached to the 2 prong power cord to keep the power cord neatly secured either around or through the handle. There are 4 slots on the outside at the top back of the canister to store the 4 solid and well made attachments in an upright position. There are plastic areas on both sides to snap in and secure the hose but I find it quicker and much simpler to simply store the hose inside the unit. The unit is very easy to clean and dry after every use.\n\nThe colours are a really nice orange and black with “ ArmorAll Utility Vac “ decals on top and both sides of the canister. At the very modest price I paid for the unit ( under $50. ) I’m pleased to inform everyone that the “ Armor All “ Dura Vac AA255 10-Litre / 2.5-Gallon 2 HP Wet and Dry Vacuum is 100% worth every penny and does live up to the reviews it has accumulated. For those that are intending to use this little \"super vac\" on a daily basis for everything in your household you can buy a 3 Pack of blue cloth filters available at amazon.ca for less than $10.00\n\nI strongly recommend this product and I hope you enjoyed my review and it was helpful.",
		  "I used shop vacs for years but I wanted a vacuum for clean up on my installs that I could carry and transport in a rubbermaid bin that had enough power to clean up drywall dust, wood shavings and the occasional water spill.\n\nMy Dad had the Stinger/Workshop 2.5 Gallon Vac but it was tool tall to fit inside a rubbermaid bin and only had 1.75hp.\nWORKSHOP Wet Dry Vac WS0250VA Compact, Portable Wet Dry Vacuum Cleaner, 9.5 L (2.5 Gallon) Small Shop Vacuum Cleaner, 1.75 Peak HP Portable Vacuum\n\nLikewise Shop Vac's 2.5 gallon Vacuum didn't fit in the rubbermaid bin and the design of the base made it tip over easy.\nShop-Vac 2036000 2.5-Gallon 2.5 Peak HP Wet Dry Vacuum, Small, Red/Black\n\nI took a chance on the Dura Vac AA255 and it has exceeded my expectations.\n\n1 - Compact Size: First off it's compact size fits neatly inside a large 77L Rubbermaid bin so it is easy to carry the vacuum and all my accessories\ninside the rubbermaid bin. This makes it easy for me to carry the vacuum to and from my job sites and stores nicely in my van. This was the only Shop Vac styled Wet/Dry vacuum I could find that could do this\n\n2 - Doesn't Tip Over: The second thing I like about this Dura Vac is that it doesn't tip over easily, even when I'm using a wand and floor attachment.\n\n3 - Suction: As far as suction goes this vacuum has a 2HP, 6Amp motor and for it's size has excellent suction. My previous vacuums were an old hoover compact vacuum, a Dewalt vacuum and lastly a Milwaukee cordless 18V vacuum and this Dura Vac beat them all with power to spare.\n\n4 - Standard Hose: This vacuum uses a standard sized vacuum hose and attachments which some others don't (Hoover/Dewalt). I used a floor wand extension and floor brush from another Vacuum with not problem.\n\n5 - Easy to Clean: The dust bin is quick and easy to empty and the filter is easy to clean.\n\n6 - Blower: I love the ability to use this vacuum as an air blower as well as a vacuum.\n\n7 - Wet/Dry Pickup: Most of my work is cleaning up dust and debris, but occasionally I have the need to do a small wet pickup.\n\nCons:\n1 - Friction Fit Dust Bin: I wish the friction fit dust bin clips on the side were snap hinges like other larger shop vacs. The friction fit plastic slots work but if they ever crack or loosen up there's no easy way to repair or replace them.\n\nOverall I'm very happy with the Dura Vac and would highly recommend it to anyone looking for a small, compact Wet/Dry shop vac.",
		  "Relatively light and very practical, I am very pleased with this Dura Vac shop vacuum cleaner.\nPro's:\n- Very good suction. Hose is long enough for a \"carry on\" type VC like this one.\n- Good variety of accessories that can be clipped on the vacuum cleaner top.\n- Can use bag filters (dry vacuum only) or washable foam filter. No dust seen coming out when using bag filter but foam filter less efficient for small particles. Not really an issue since the foam filter is used mostly for wet vacuuming. Replacement bag filters are available in three pack at a very reasonable price on Amazon.\n- Small and light enough to be carried around while vacuuming although you'll likely put it down now and then to rest your arm.\n- Reasonable sound level.\n- Can also be used to fill inflatable mattress and toys.\n- Power cord is long enough without being intrusive. Extension cord could be required depending on electrical outlet availability.\n- 2.5 gallon container easy to empty.\n\nCon's:\n- None so far but I do have a concern with the durability of the clips holding the container to the motor head."
	   ],
	   "numberOfRates":149,
	   "avarageRate":4.5426369576178995,
	   "id":11
	},
	{
	   "productTitle":"NOCO Boost Plus GB40 1000 Amp 12V UltraSafe Lithium Jump Starter",
	   "desc":"",
	   "category":3,
	   "images":[
		  "91QeQxZB5hL._SX569_.jpg",
		  "81cx5cZ%2BiQL._SX569_.jpg",
		  "81bOvQeRx6L._SX569_.jpg",
		  "81rbAf8fV%2BL._SX569_.jpg",
		  "81eVn9-PpRL._SX569_.jpg",
		  "81Vo0V%2B30fL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"145.43",
	   "comments":[
		  "I work as a mechanic in the engine department at bus shop. so, I am always dealing with dead batteries. I bought this primarily for home use but, I took it to work to give it the ultimate test. I had a bus that I had cranked the batteries pretty much flat on and I hooked it up to try it out. this thing blew me away. this bus has 3 large 12v batteries and a 6.7 litre diesel engine. it gave me 2 5-6 second cranks on an engine that I had just put in and was just priming up for the first time..i would say the 1000 amps is pretty accurate. it was down to 50% after that. start your car No problem.my boss was so impressed he bought the 4000amp model for the shop. takes some time to charge just uses usb . slow charge is always best, works like a deep cycle. the clamps and cables are heavy duty to handle the load. Very good buy. the only thing I can't say at this time is how well it holds it's charge over time, only had it 3 weeks.",
		  "I used to have a motomaster with the same ratings, I could use that thing to jump my van multiple times but then it got stolen so I purchased this instead because I liked how compact it was. This thing barely gets it going once even though it states it can do it \"up to 20 times on a single charge\"??? For the cost I'm pretty disappointed. It's also really hard to test this type of thing until you really need it. It's resulted in me having to get jumped by other vehicles a few times now (oh the joys of having an old van!!). The battery wasn't even that dead, the jumps from the other cars literally took seconds, it just needed a quick jump. Anyway, if you think you'll need this (ie. camping, in secluded places which is what I need it for etc) make sure you have it fully charged because you may only get one jump out of it. Keep in mind if you buy this that you can't return it after a month!! Ugh! Make sure you test it out (not sure how you'd do that unless you kill your battery on purpose or run around looking for people in distress with dead batteries. At this point I can't return mine and I'm out $150 which for me is a lot of money. I miss my old jumper :(",
		  "Great battery pack perfect to boost your car. I boosted my V8 5.0L Mercedes battery, completely dead, and the engine started within 3 sec ! Then I boosted a Totota 1400 Corolla dead battery and once again engine was running in 2 or 3 secs !\nAfter those 2 boosts, the Noco booster was still at 75% capacity, meaning able to start at least 2 or 3 other cars !!!\nEasy to charge with USB cable and provided 12v car charger (lighter plug).\nThe GB40 is very compact, relatively light, you can charge your phone or any accessory with the USB port and the led light could be very helpful in dark night.\nI believe considering the reasonable price, build quality and efficiency, it is a must have accessory to have in your car.\nI already did recommend this Noco GB40 to several friends and I would definitely buy again if needed.",
		  "I bought this to boost my escape 2005.\nToday the battery was dead (not totally, it would turn over once but not enough to start)\n\nSo I tried this booster pack. Lights turned on, it's fully charged, but the car only turns over once or twice before it stops. So this booster pack doesn't even have enough power for a 2.3L gasoline engine... Very disappointed.",
		  "This is a great product,I bought it as a precaution and shortly after my wife and loaded the truck to go to the cottage. I glanced at the gas gauge, it was on 0, I new there was gas in but I proceeded to the gas station. All my gauges were going to 0. My speedometer quit, i pulled into gas station and when I turned the ignition, nothing, I hooked up the genius and it started right away, I travelled 15 meters and it quit, I guessed the alternator was shot. I hooked up the genius, it has real strong clamps, closed the hood which stopped it bouncing. I started the truck and drove the 2 k home, parked the truck and it quit, but it got us home.",
		  "My partner and I always had issues with our car battery during the winter, but ever since we bought this, we used it once and never have had any issues with the battery again, despite extreme cold. It seems that it truly charged our battery well that first time! I would definitely recommend, this is a lifesaver, and so useful to keep in the trunk of your car!",
		  "Works well.. but I find I must NOT be stored in the car at -20 . will not start my car.. however If you keep it warm and make sure all car accessories are off (radio, fans, lights, AC, Heat).. . it starts the car. (it is small and I keep min in day/messenger bag/). Few days ago My Optima yellow top 12V Battery would not start my car at -24 deg C.. apparently due to stultification)... this unit saved me form having to wait and pay for a toe truck..and wait outside at -24 deg C...",
		  "The weather here gets quite cold in the winter and I was hoping this thing would help me boost cars outside in the freezing temperature. So, I thought i would get this early and test it out a few times before the cold weather got here, but this thing really disappointed when it couldn't even start a little Nissan Versa who's battery had just died as I had the ignition on for a while. I wasn't too surprised when this device couldn't start another vehicle a couple of days later. Both times the booster was fully charged using the charger that came with it."
	   ],
	   "numberOfRates":182,
	   "avarageRate":5.354016683775306,
	   "id":12
	},
	{
	   "productTitle":"STANLEY STST16331 16\" Essential Toolbox",
	   "desc":"Color: Yellow/BlackHeight (in): 15 3/4 inHeight (mm): 402 mmOverall Length (in): 22 5/8 inOverall Length (mm): 576 mmWater Resistant: NoWeight (kg): 1.3 kgWeight (lbs): 1.8 lbsWidth (in): 16 1/4 inWidth (mm): 415 mm",
	   "category":3,
	   "images":[
		  "51GcD7wnZsL._SX679_.jpg",
		  "51oK19dlYLL._SX679_.jpg",
		  "61Ng7TWgQ2L._SX679_.jpg",
		  "51gxNYYiqrL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"13.99",
	   "comments":[
		  "This little Stanley toolbox makes a great portable storage solution for frequently used tools. I also have a larger Mastercraft MAXIMUM toolbox but wanted something smaller to tote around.\n\nThis toolbox is cheap and very cheerful. It has a small upper tray on the inside along with 4 small storage compartments accessible from the outside. In the tray I keep a couple of multi-bit screw drivers, a small measuring tape, knife, and a few other smaller tools. In the main box I keep larger wrenches, pliers, 12-inch level, hammer, larger measuring tape and several other tools. The 4 small storage compartments are good for keeping some general purpose screws, nuts/bolts, nails, drywall screw anchors or even small precision drivers.\n\nHere's a list of my pros and cons.\n::::: Pros :::::\n- Solid construction of toolbox with sturdy latch and handle\n- Lightweight\n- Outer storage compartments\n- Stackable\n- Holds a good amount of tools\n- Made in Israel\n\n::::: Cons :::::\n- I honestly can't think of any, for the price of what you get it's pretty great\n\nHighly recommend for a small basic toolbox. It doesn't have a ton of storage compartments or capacity for larger hand tools (like a saw) or power tools, but this is a fantastic storage solution for the \"essential\" tools that anyone should own. At this price, you can't go wrong.",
		  "I'm living in a small apartment and have been keeping all of my small tools around the house, either in cardboard boxes or on shelves where I forget about them. I added this item to my last order to take advantage of the add-on program and I was very glad I did.\n\nIt's a very well constructed box, very sturdy and holds all the basics. I have all my screw drivers, a hammer and some other small tools easy in there. It's great that I can grab and go anywhere with it, but I think the best aspect is the compact size, which allows me to tuck it away and forget about it. Something that's a godsend when space is at a minimum. This is an item everyone should have in their house for their most used tools, so they're always together and easy to get at when you need them.",
		  "Quality is not good. Tool tray is completely warped beyond use. Tons of plastic imperfections around the case like strings of plastic that were never cleaned off. Pulled one off of the case that was longer than the box itself. Small grease stains through the inside of the case.\nMain issue is with the warped plastic tray, but the many other shortcomings don't help my opinion of the tool box. Just looks as thought there is 0 quality checking being done.",
		  "One thing not clear from the photos is that the tray is shorter than the toolbox. This is unusual, but works well for me, as it lets me store taller items in the box while keeping the tray. In my case I use it for screwdrivers, with hex bits and \"jewelers screwdrivers\" in the top compartments, smallish drivers in the tray, and sets in the bottom, where having the full height of the box available helps.",
		  "I am living in a condo and needa do DIY stuff sometimes. Always looking for a toolbox but those ones in the market are really expensive. (usually, they are too big as well)\nI picked the smallest size for this Stanley Brand toolbox, used mine to put only basic equipment (mainly form miniso, ikea.) Bear in mind if you have a full size house or you have heavy and large size equipment, go for the largest size one.\n\nPros: Solid material (it's plastic tho)\nI like the idea of there's two hidden space you can put screws or pins in it\nReally cheap\n\nCons: There lock is a bit loose (Maybe it's a defect)\nNothing fancy or the material is the cheap one",
		  "Needed a case to carry around some of my tools that I use the most and this fit the bill. It's got a couple of spaces up top, where the yellow bits are, for smaller pieces like my USB drives and other small devices.\n\nIt's solid enough and a good value for the price .",
		  "At first glance, the box looks flimsy, it is actually well constructed. New home for all my screwdrivers (from mini eye glasses ones to giant handle ones) , wrenches/spanners and velcro tapes. The tool box has two compartments for small items like elastic bands , screws, bolts, nails....etc. Couldn't say much about its durability but time will tell. But most important of all, the price is awesome.",
		  "Love it and nice to have all my \"apartment\" tools together in one place instead of various drawers. I wish the top opened 180 degrees so you could place the tray onto it when accessing the interior cavity. It locks at 90 degrees."
	   ],
	   "numberOfRates":183,
	   "avarageRate":2.1277764805358212,
	   "id":13
	},
	{
	   "productTitle":"Battery Tender 021-0123 Battery Tender Junior 12V, 0.75A Battery Charger will charge and maintain your battery so that it is ready to go when you are! It's lightweight, fully automatic and easy to use",
	   "desc":"",
	   "category":2,
	   "images":[
		  "71KhKd1rejL._SY879_.jpg",
		  "81o1a-KpgYL._SX569_.jpg",
		  "716DkoiYqtL._SX569_.jpg",
		  "71zXPrzl9%2BL._SX569_.jpg",
		  "71auQqwE0DL._SX569_.jpg",
		  "71ABKlKtxkL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"43.81",
	   "comments":[
		  "Great product. It's small, well thought-out and does what it says on the box.\n\nI travel a lot for work, so my car is parked at home for 2-3 weeks every month. I drive a BMW, and the electronics draw the battery down while it's parked. It will start after 2 weeks but not after 3 if no one runs the engine. So I picked up a battery tender junior and I've been very happy with it. It's small enough to tuck in the trunk, and the detachable leads are a great feature - I leave them attached to my car's jumping posts under the hood, so it takes all of a few seconds to connect or disconnect.\n\nIt's kept my battery in great shape. In fact I've gained a few tenths of a volt both with and without the engine running, which is pretty fantastic considering my battery is 4 years old. I run a couple aftermarket amps, an obd2 wifi dongle, and a radar detector, which I know is taxing on my car's electrical device, so this guy gives me some peace of mind. And it's a steal for the price... it's a half to a third the price of a decent trickle charger, and it's better for my battery which is going to save me money over time. Very happy with this purchase.",
		  "If you own an automobile, a lawn tractor, or even a generator that requires a 12 volt lead-acid battery to start and are stored for several months between use, then you owe it to yourself to get one of these. Just attach the (included) cable to the battery, and when you store the car/boat/ATV/etc for the winter, simply connect the wire and plug it in. The Battery Tender will maintain your battery without overcharging it, and use very little electrical power doing so. When it comes time to start that equipment in the spring, the battery will be fully charged. And since the Battery Tender does not overcharge or allow the battery to drop below a safe threshold, your battery will last longer as well. I've purchased three to date, and they were well worth the investment even at manufacturer's suggested retail, which is what I paid for the first one; Amazon's price is about half that, so I bought two more!",
		  "I'm using this Battery Tender Jr. to keep my NA Miata's battery topped up while it's stored for the winter. Installation takes only a few minutes, and the instructions that come with it give all the necessary information. That being said, it's pretty much the same as hooking up a battery booster, or jump starting a car, so anyone familiar with cars (the target demographic) won't need the instructions anyway.\nIn my opinion, the best feature of the Battery Tender trickle chargers is that most of them have split cables with capped connectors in the middle, and the way they hook up to the battery and ground is with ring terminals, so you can effectively connect the battery side and leave it hooked up permanently, and just connect the two halves of the cable when the vehicle is stored.\nRemove your car's positive battery terminal, pull the tension bolt out of the clamp, add the BT Jr's positive cable's ring terminal to the clamp, put the bolt back through and reinstall. Connect the BT Jr's negative ring terminal to a good ground (an existing body ground in the engine bay, or in my case the trunk is ideal), plug the two halves of the cble to each other, and plug the brick into an outlet. Takes like 5 minutes, and when you are ready to take your vehicle out of storage, unplug the brick, unplug the two halves of the cable from each other, slide on the attached rubber caps, and you're ready to go. Being able to just leave it connected permanently is such a great feature for something like this meant specifically for summer vehicles or motorcycles. 100% recommended for ease of installation, good build quality, and very reasonable price.",
		  "I purchased three of the Juniors (one for a deep cycle RV battery, and two for lawnmower/ATV batteries). I have two of them connected to batteries (the deep cycle and the ATV) at the moment. They are both working fine - no issues.\n\nThe ATV battery was approx, 50% depleted - the battery tender brought it up to a full charge within 2-days and has maintained it there for the past week (Note: the battery is outside in below freezing weather). I have the battery tender in a weather protected compartment.",
		  "The only thing that PISSES ME OFF about this battery tender is that I never had one years ago. Since I purchased this unit, I have saved thousands of dollars. I'm pretty sure batteries are my kryptonite. I never get more than a year out of a battery, if it goes dead i cant revive it no matter how hard I try. If the battery goes dead even for a few weeks I'm replacing the darn thing. After 2 battery replacements in my quad I purchased this battery tender. I use the quad mostly to shovel snow, so using the winch over and over then putting the quad away, made for a deadly combination. I use at least half the battery power on a good shovel day and now when I park the quad, I hook up the cables and in a couple hours she's good as new. I hook it up to everything just to top it up and I haven't had a battery go dead since!! I even had 2 deep cycle 6v batteries tied together from my RV and unplugged the RV for a month and the batteries were dead. I could see a bubble by the post which usually means it's done, but I hooked this up to the 2 batteries and charged for 10 days and it finally said it was good, unplugged it and it went dead the next day. I kept hooking it up unhooking and repeating over and over and I managed to save my batteries, they have both held charge for over a week now with no drain. I will never be without a battery tender again, so long as I own a battery that needs charging!!!",
		  "I have no idea who is leaving these great reviews but honestly the product is not good. I have been using these chargers for years, this brand is more expensive than most but they were always made in the USA so well worth it. Not anymore, the newest ones say made in China, and that alone is a huge problem. Tried this with several batteries and while it charges, very slowly it never enters float mode, so it's always charging - even when another charger will show it's full. After 24 hours and the battery overcharging already, we just disconnected it. Very poor product, clearly there is no longer any quality. Sorry you lost out on our business - all because of China."
	   ],
	   "numberOfRates":6,
	   "avarageRate":5.628851663176462,
	   "id":14
	},
	{
	   "productTitle":"Chemical Guys BUF_209X Complete Detailing Kit (12 Items, TORQ TORQX)",
	   "desc":"",
	   "category":3,
	   "images":[
		  "61i1dckQ%2BoL._SX569_.jpg",
		  "A1QalVUwEuL._SX569_.jpg",
		  "61wfc5gSt%2BL._SX569_.jpg",
		  "61zK0xKPOoL._SX569_.jpg",
		  "61MTn9L2NFL._SX569_.jpg",
		  "61OsVpegs6L._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"273.28",
	   "priceIs":3099,
	   "comments":[
		  "Just used it today, works well. I used the orange pad and it did a good job or removing most of the the swirls and after waxing my truck the pad showed no wear.. The machine does get warm but not uncomfortably so. Velcro stuck well with no flying pads. The cleaner works well to remove the product after use. I used the VSS liquid for removing swirls and scratches and it did a good job and was easy to remove.",
		  "I'm a newbie to polishing/buffing and I can't really compare it to anything else I have, but I find this polisher very easy to work with. So far I've only used it for buffing, but on to polishing and waxing shortly. At times I wish it had a handle at the front to help manipulate it, but at other times I'm glad it doesn't so I can get up tight to the door mirrors. Maybe a quick removable handle could be an option on a future model?? Also, maybe I'm still getting used to this unit, but I found I accidently change the speed with my rear hand as I'm working the polisher around. For this reason I would give it 4 1/2 stars instead of 5. The speed control in a different area might be useful, or recess the dial more so its harder to inadvertently change the speed.",
		  "Great Starter kit for a newbie or someone getting into it as a side hobby, arms tend to get sore after a while but nothing breaks in between cant fix, unit is heavier then thought at first but overall a great combo deal. Helped my dad use this on his Highlander and got pretty much all the swirl scratches out of his paint as well as revived the black color.",
		  "Edit: Amazon warrantied it no drama, polisher works as desired.\n\nThe TorqX bursted into a ball of smoke within the first 5 minutes of use, I'm hoping that they will handle the warranty claim quickly.\n\nAs for the rest of the kit everything seems very high quality and well assembed.",
		  "Really good polisher, though this is my first polisher I ever purchased. I bought some foam pads and used mother 3 step polish, microglaze and wax on 4.5speed. My black benz became a mirror. Absolutely love this thing and would easily buy it again.",
		  "I was ready to buy the Porter Cable polisher (tool only) and then the price jumped $25 overnight to I kept looking around and found this one. More or less the same polisher plus a few extra goodies included. Selling this as a kit is a great idea - especially for someone who is just getting into polishing. You get all the pads you’d ever need plus a decent selection of sample size polishes and cutters. Polisher is really easy to handle and not overly noisy. Build quality seems really good.",
		  "Now that I had a chance to use these items. it's not worth the money. the polisher is very heave and awkward and heavier than expected, if I didn't use some of the products I would return the polisher.",
		  "Comes with everything you need to start polishing your car. Works as it should. Polishing compounds are great!\nEasy to use as a beginner."
	   ],
	   "numberOfRates":33,
	   "avarageRate":1.9858144922326684,
	   "id":15
	},
	{
	   "productTitle":"NOCO Genius G3500 6V/12V 3.5 Amp Battery Charger and Maintainer",
	   "desc":"",
	   "category":2,
	   "images":[
		  "81Sf3scg2bL._SX569_.jpg",
		  "71j7lAJLJmL._SX569_.jpg",
		  "81ZRlKrV5-L._SX569_.jpg",
		  "81qknaOJHxL._SX569_.jpg",
		  "81l9%2BSXxHZL._SX569_.jpg",
		  "81OAolFDpBL._SX569_.jpg",
		  "71ZQqFMUkCL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"83.94",
	   "priceIs":"71.99",
	   "comments":[
		  "Seems to work great but, you have to know exactly what you are buying, which I did'nt and I think the specs were not that precise on what this item can do. This charger CAN NOT charge a battery with more than 30 Ah capacity. It will keep it in charge as a \"maintenance charge\", but will not charge it if is empty. A regular 12v Marine battery has at least 60 Ah, so juste be aware to know what are your needs.\n\nFor an 80 Ah battey like mine, the \"Genius\" brand is very expensive compare to other brands that do the exact same thing. I bought an other brand after returning that one and saved 100$. But, this brand has the reputation to be the best long term investment. Just be sure to evaluate your needs.\n\nGreat service when returning the item, easy and fast.",
		  "So far seems like a great product. Excellent variety of modes and easy to understand. Lots of operational feedback with the LED status lights. Properly diagnosed my 8 year old SLA battery as being unable to hold a charge, thumbs up as the NOCO is properly assessing the battery. Charged my new 92AH AGM replacement battery in about 9 hours (dealer sold it to me with only a base-charge) but wouldn't have known that status without this NOCO Genius. The eyelets for the battery disconnect are a tad large, I had to use washers to ensure good contact with my 10mm factory nut-bolt battery post clamp. I'll be using the NOCO to keep my battery maintained as I often don't use my car for periods of 4 or as many as 10 days on occasion, then I use it for longer trips. It's small and light, which is great... only about 1 quarter the size of the typical 12v garage bench-top battery charger everyone typically owns and about 1 sixth the weight of one of those dinosaurs! I DO wish however for two improvements : The cables could be 1 or 2 feet longer... I have readily available AC outlets in my garage but the cables of the NOCO are still a bit too short. They should ALSO be made of a higher grade casing, which I'd gladly pay a premium. The current wiring casing gets quite stiff in cooler temperatures, so to mfg them with high silicon content would protect them better and keep them as flexible as cooked pasta even if you have your NOCO in sub zero temperatures. I hope the wire casings last for years as they are BUT I know from higher quality extension cords, when they're silicon based, they'll never crack from age, UV damage or cold conditions.... so I'd encourage NOCO to consider that upgrade on future versions. Really great product otherwise!",
		  "This is a great unit to keep your battery charged, but avoid using this in severe cold weather as I found out.\nI left my unit in the trunk and when I went to plug it in the wires snapped and cracked revealing the copper inside.\nThis does not survive -25C, otherwise it's a good unit.",
		  "As previously mentioned in various reviews, this item worked great until in got below the freezing point. The insulation snaped like a 4 year old candy cane. Pas pour le Québec!",
		  "I bought 3 Schumacher chargers to charge my RV's 2 x 6v deep cycle batteries (hooked up in serie for 12v), and not ONE of the 3 would charge. They would work for 5 minutes and then switch off, and Schumacher's customer service is to say the least, ATROCIOUS.\n\nSo, I ordered this unit last week on a BF sale on Amazon. Hooked up the same 2 6v batteries, and it charged them with NO issues at all. this thing just plain WORKS!!!!\n\nI am so, so, so happy with it, and super glad I got it.",
		  "I purchased this charger (Genius G1100) after it being recommended by a friend. I needed a charger to maintain all types of motorcycle batteries from regular lead acid types, AGM and lithium ion. This charger works great with all of them and can even top up and maintain my larger car battery. Excellent quality smart charger for the money.",
		  "Do not buy if you live in Alberta Canada this thing cant handle cold the red charging cables break due to cold weather and the wire insulation is coming of the wire .....\nI am forced to give a star which i dont want to.",
		  "Excellent for charging batteries.\n\nI bought this for the large AGM trunk battery in my Mercedes. I have a smaller trickle charger rated at 5 amps, which was unable to charge the large battery. The G26000 is rated at 26 amps for charging an AGM battery, so caution is necessary to unhook the cars terminals before charging.\nThe clamps supplied can be removed from the charging harness and connected directly to the battery terminals. The harness has a quick disconnect to be able to connect/disconnect the charger when needed.\nReview the Genius website for correct accessories, as I bought a harness extension on Amazon Canada which was not compatible, and I had to return it. The heavy wire charging harness with clamps supplied is rated for 40 Amps and require special heavy wire harnesses. Check the Genius website for correct accessory numbers to order from Amazon if needed, as some of the accessories for the charger on Amazon are not listed correctly."
	   ],
	   "numberOfRates":10,
	   "avarageRate":2.558013385076452,
	   "id":16
	},
	{
	   "productTitle":"Fujifilm X-A5 Mirrorless Digital Camera w/XC15-45mmF3.5-5.6 OIS PZ Lens - Brown",
	   "desc":"",
	   "category":7,
	   "images":[
		  "81Cfn57vJKL._SX355_.jpg",
		  "81EwqsqZFML._SX355_.jpg",
		  "81uDHe55XnL._SX355_.jpg",
		  "818dcMLguLL._SX355_.jpg",
		  "81yMMuF4ljL._SX355_.jpg",
		  "81tH-cVD4-L._SX355_.jpg",
		  "91MogGpyA4L._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"649.00",
	   "comments":[
		  "great quality, easy to use, lightweight and excellent sharpness. Big and important change for me from the big DSLR i usually carry.",
		  "I just bought this xa5 few days now. I have tested few photos and it look great. Except the body itself is plastic and the power lens for me it is decent lens. If there are kits come with sharper lens can be more options for sure more expensive. I prefer upgrade for few hundred for the upgrade to better lens.",
		  "This was a nice camera but we ultimately ended up returning it.\n\nWe chose this camera to take nicer photos than our phones without having to lug around a massive DSLR everywhere with us. We did our research and this topped the charts. We tried the camera out for two weeks in a variety of settings - indoor, outdoor, night, distance, etc. I wished that it would zoom in more with the lens it came with but when we saw the photos on the computer you could zoom in all the way on the photo and still have a very clear image, so the zoom was in post processing. I also really didn’t like not having a viewfinder, though it didn’t bother my husband. He played a lot with the settings and seemed to hone in on what he was doing in less than a week of using it.\n\nUltimately what made us return the camera was this - my husband often chose not to bring it with him when we would leave to see stuff, because he could take photos with his phone that were good enough. If we were going somewhere and he had a backpack on, he’d bring the camera and use it. But if it was just wallet, keys, and phone, he wouldn’t grab the camera, even in a small carrying case. So it didn’t make sense for us. It is a great camera, easy to use, but we ended up choosing not to use it a lot of the time.\n\nAlso the fujifilm photo transfer to your Phone was junk and I never got it to work. Glitchy app so I couldn’t post photos on social media. That was a big selling point for me and it was a bust.",
		  "This camera produces the best color images I’ve seen! The price was great and I love the retro look! I highly recommend it!",
		  "I love everything about this camera, from its ultra-light weight and cute look to the cool power zoom lens and sharp images, except for the lack of viewfinder. Whyyyy, why didn't they add the tiny little viewfinder that is so important for outdoor shootings? I bought this camera mainly for travel/landscape photos so viewfinder is a must. If you buy it mainly for everyday uses (i.e. family photos and indoor events), this camera is probably the best!",
		  "Still testing out my new camera. Trying to master the setting to optimize pictures. I purchased this before my trip to Europe next month. It is hard to write an objective view until you master all of the settings to take the best pictures you can. So far, I like the Fujifilm X-A5. I do have difficulties with macro settings, my previous camera captured macro shots easily with great details. To be fair, I have to read the manual again to make sure I know macro on this new camera. I do have difficulties with the Bluetooth/WiFi to transfer to my iPhone. I can get a few pictures transferred and then it looses the connection. Perhaps it is user error. Overall this is a good purchase. I am hoping to learn more on how to take even better pictures. I did not like the neck strap that was included. I opted to purchase a third party wrist strap.",
		  "I bought this camera for our trip to Japan. It worked well. It's lightweight which was the most important for me, I didn't want to lug around a heavy camera. It was easy to use and took really nice quality photos. However I did have problems with it freezing several times, and would have to remove the battery and reinsert it to fix it which is why I removed one star from the review. The battery lasted all day long. I took over 2,000 photos and would recommend this camera for anyone looking for something other than just a cell phone to take their vacation photos."
	   ],
	   "numberOfRates":51,
	   "avarageRate":0.5995136720665069,
	   "id":17
	},
	{
	   "productTitle":"Ooma Telo Air 2 Smart Home Phone Service with Wireless and Bluetooth Connectivity",
	   "desc":"Upgrade to Ooma Premier, and get all the features included in Basic Service plus these amazing features:",
	   "category":5,
	   "images":[
		  "61DIwEYoSOL._SX355_.jpg",
		  "81H3TzAX%2BhL._SY355_.jpg",
		  "71Ngz7XWTIL._SY450_.jpg",
		  "81BaEdxw6ZL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"149.99",
	   "priceIs":"119.99",
	   "comments":[
		  "Ooma est parfait pour le prix et les features inclus.\nIl faut s'habituer au téléphone IP qui a quelque limitation sonores, mais 95% du temps c'est comme le \"vrai\" téléphone.",
		  "Good product —no major issues so far and it’s almost crystal clear reception",
		  "Easy set up and customer service was good. Glad to be rid of Bell! Phone quality clear and can forward all to cell phone.",
		  "Good product sound crystal clear",
		  "Product works great, easy to setup and sounds great. Sounds clear like my old home service.\nJust waiting for my old phone number to get ported to phone.",
		  "Very easy set up and works exactly as promised. I use it daily and haven't had any issues.",
		  "Frost week used,works good",
		  "Parfait!"
	   ],
	   "numberOfRates":171,
	   "avarageRate":5.469196954219854,
	   "id":18
	},
	{
	   "productTitle":"Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal",
	   "desc":"",
	   "category":4,
	   "images":[
		  "61%2B1AfYZxCL._SX425_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"69.99",
	   "priceIs":2831,
	   "comments":[
		  "Honestly I'm seeing such low reviews for this product and it drives me crazy lol...Alexa isn't going to make a sandwich for you or put your kids to bed! Maybe expectations are a little high lol...... I received my 3 Echo Dot devices for the Black Friday Special...and I'm ready to order 3 more! Installation was incredibly easy, pairing echo dots in groups was incredibly easy, setting reminders, playing Spotify, CBC News briefing, everything is incredible! If your in doubt honestly you will not regret buying these! The packaging is even gorgeous. Sound is great. I have two on my main floor living... Ask Alexa to set volume to 4 or 5 and your rocking! I've been a heavy smart phone user for years, I've had apple, Siri is junk, Google assistant mehhhh... but Alexa.... amazing! Feels like part of the family lol... All jokes aside you will not be disappointed with this purchase!",
		  "I initially misunderstood the ordering instructions. When I ordered \"1\" I thought that it was 1 pair, not a single unit. But Amazon was great at fixing my mistake.\n\nSo for the review - the Echo Dot is fantastic. Easy to set up and easy to link my Alexa compatible products. I linked up my Smart Outlet plugs and it is so nice to just tell Alexa to turn on/off my lights as I go from room to room.\n\nThe sound quality is very surprisingly good - really very good.\n\nMy only issue is that while in the set up I have a Chinese language option, that option does not work when enabled. Also, I don't think that you can enable more than 1 language, which is a pain, as we speak Mandarin, French, English at home and my boys are learning German and Spanish at school.\n\nI will be buying some more Echo Dots so that I can leave them in other areas of the house.\n\nMy only complaint is that when Alexa confirms she has done something, she sounds so bland or apathetic which I find very annoying. Come on Alexa, put some spirit into your voice and sound interested in your work.",
		  "Bonjour je viens de recevoir mon echo dot. Je dois dire que j ai eu de la difficulté due as une erreur de mots de passe de ma part. A moi la faute mais réparer cette erreur n as pas été chose facile après deux appelles aux service technique ça fonctionné. Merci a eux. Ma plus grande déception a été de voir que je ne pouvais pas faire grand choses avec Alexia. Quand j ai demander ecouter ma musique elle a lancer essais gratuit sur amazon.Donc une fois les 14 jours terminer.Je ne pourrais pas écouter de musique sauf si je paye de la musique que j ai déjà. Pourquoi pas les fameux skills et bien la coût de génie . Le canada pour votre information est bilingue Anglais et français. Ma province le québec est une des plus grande province et elle est unilingue FRANÇAISE . Vos skills pour le canada français sont presque inexistant a part les flashs de radio canada. ça rend votre Alexa très démunie. Pourtant en france il y as des skill géniaux encore la quelle deception . Je ne peux pas les activer car je suis au canada. Pas de recherche internet possible. finalement Alexia de sert pas a grand chose pour moi canadien francais. Bien a vous, Patrice Veilleux",
		  "Decent sound for something the size of a hockey puck. Pretty handy i must say. Keep it in the kitchen, good for timers music, conversions, weather and asking general or even area specific. questions etc. I was surprised how well it picks up voice. Wife still basically can’t fight the instinct to yell at it like an overseas call. My two year old somehow gets her to play whitney houston consistency even though she is speaking gibberish. I’m starting to think its an actual language that only alexa understands. Some free advice: never ask it to play hide and seek, it will never shut up, be warned. Would reccomend to people who aren’t afraid of robots eventually taking over the world. I think it would be a bit overwhelming for my mom’s generation.(no offence to you oldr folks). Thumbs up.",
		  "I tried to love it, but to be honest, it's pretty mediocre. Sound is pretty bad (expected) but better than previous version. Now the real problem is that it pretty much never does what I ask it to do apart from some really basic stuff. Even then, I need to use a \"robotic\"voice for the echo to understand. Also, the app has a really bad design and is not user-friendly.\n\nNow the only cool thing about it is its design. Otherwise, it's really not that good.",
		  "I have a google mini it was ok.. So I bought the alexa dot 3rd gene. to see the difference and hands down google blow it out of the water That little dot just pissed me off .. I,m o happy to get it GONE",
		  "Très bien maintenant on veux un bon français svp",
		  "First, the sound is a massive improvement over the 2nd Generation Dot. I would say volume level 5 is about as loud if not louder than volume 10 on the 2nd generation. That being said my there are some bugs that Amazon needs to work out. Alexa's speech is a bit 'choppy' compared to the Echo and 2nd generation dot. My biggest beef is the response lag with this new Dot. The 3rd generation dot is noticeably slower in responding to commands and questions when compared to my 2nd generations echo and dot."
	   ],
	   "numberOfRates":116,
	   "avarageRate":3.315442482820796,
	   "id":19
	},
	{
	   "productTitle":"Fujifilm Instax Mini 9 Instant Camera, Flamingo Pink",
	   "desc":"",
	   "category":7,
	   "images":[
		  "71n0IwzJu-L._SX425_.jpg",
		  "71UcFQEiedL._SX425_.jpg",
		  "41ysow5gFgL._SY355_.jpg",
		  "71PEloMINLL._SY450_.jpg",
		  "91jWS05mGhL._SX355_.jpg",
		  "31ioNIbPX6L._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"89.99",
	   "priceIs":"69.00",
	   "comments":[
		  "Great camera, bought it for my Fiance as a gift. Takes great instant pictures that can be used in scrapbooks and such. Quality of the picture is exactly as expected but, when trying to use any of the lighting settings the pictures turn out too dark. I would recommend leaving the lighting option as default (Auto).\n\nNOTE: Does not come with film, must be purchased separately.",
		  "I'm in love with my new Instax Mini 9! Only took three pictures since I received it so I can save my films for my upcoming vacations :-) It's pretty, easy to use and the pictures look cute! I recommend it! Only downside is the price of the films, but I really think it's worth it.",
		  "I love it!!! Except for the fact that sometimes the photos don't work at all.. like it prints the photo and it turns completely black or completely white.\nAnd I bought different brand photo things so I know it's the actual camera it's self. (I've also read the instructions and it's not cause I'm to close or in to bright of an area etc etc. )\nSo that's the only down side. Is at over a dollar a photo it kinda sucks when a photo is wasted.",
		  "Such a perfect gift! Bought this for a teenager for Christmas. Its a perfect size to bring to school and events. Most companies now sell frames, albums etc that match the size of the Instax minis. Love this little camera and the moments it captures!",
		  "I bought as a gift for my daughter, to take on our trip to Peru, and was very dissappointed as the non of the outdoor pictures turned out. The “automatic” light adjustment never changed from the home position when in different settings. She was so excited to use it on this once in a lifetime trip and it simply didn’t work!",
		  "Bought this on Amazon just after Christmas for my daughter's birthday this week (Feb 6th) the pictures are underexposed which means that there isn't enough light getting to the film so it is printing black prints. The only setting it does print on is the hi def setting which isn't always ideal. Also went through 2 packs of film to figure out that it wasn't something we were doing wrong! Now we have passed the deadline to return it as well! Not a happy customer!",
		  "I bought this for my 5 year old because he was interested in photography. He's mastered it and created some amazing shots. It's so much better for him to have a tangible result vs just a image in a phone. The picture quality is ok, reminiscent of old Polaroids, and can be good with some planning. The flash is a little weak so don't expect to get huge group shots with it and having to manually set the exposure takes away from the ease of use.\n\nIt works out to about $1/shot which can be expensive but not much worse than developing and printing 35mm. Obviously digital would be cheaper to print but it's nice for kids to get the picture immediately. It also seems to have helped him understand the value of money since he either has to buy his own film or wait for birthdays/christmas.",
		  "So awesome, easy to use, and the picture quality is pretty good. Definitely takes better pictures in good lighting/ outdoors. PERFECT for travel journals and gifts for guests at special events. The sound of an instant camera alone is worth it."
	   ],
	   "numberOfRates":199,
	   "avarageRate":1.691672529890563,
	   "id":20
	},
	{
	   "productTitle":"Ooma Butterfleye Smart Security Camera with Battery Backup, 7 Days of Free Storage, and 16GB of Internal Storage",
	   "desc":"Protect and watch over your home or business from anywhere with live video streaming and smart alerts.",
	   "category":7,
	   "images":[
		  "61JbrJPCiKL._SX679_.jpg",
		  "71itQqOiAUL._SX679_.jpg",
		  "61JNQVrMN5L._SX679_.jpg",
		  "71%2BRavRetIL._SX679_.jpg",
		  "71dLCrRepbL._SX679_.jpg",
		  "612KIIntnML._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"217.15",
	   "priceIs":"199.98",
	   "comments":[
		  "When the camera arrived i found it packaged in a sturdy and well designed box.\nThe camera its self is solid, well built and looks well.\nAfter using the camera I found the picture is clear and the app is simple to use. Setting up the camera was easy.\nThe live streaming is simple to use and the stranger detection works well once it has learnt your face.\nOne of the impressive features i found was the camera has a built in battery that allows it to work even during a power cut and record to local storage if there is no internet available.\nI also liked the way the camera has only one usb cable to power the camera keeping it simple to place anywhere in your home as it dose not require any network cables or special wiring.\nOverall the camera is a simple and impressive addition to your home for home monitoring / security.",
		  "I had to buy an Android Tablet just to be able to run the software and see the video. There is NO standard Browser or Web Based Interface that will allow you to access this camera from a standard laptop or desktop computer. Also will not work with a chromebook. I own two Ooma Telo Phones, and the support for this device is extremely poor by comparison.\n\nAlso you are unable to unlock premium features like face recognition unless you are willing to share your credit card with Google Pay.\n\nSort of works, but the hoops you have to jump thru left a sour taste in my mouth.",
		  "Being battery operated and wirelessly connected has made it really easy to use. The app feels a little wonky, but allows easy access to live video and historical video clips which is its main purpose.\n\nThe camera is definitely a bit bigger and heavier than I expected, but it isn't a camera meant for carrying around anyways. So the larger and heavier size I think are justifiable for a longer battery life. I use the live video feature multiple times a week and the batter lasts between 2 and 3 weeks for me.\n\nOverall very happy with the purchase.",
		  "The setup of the camera was very simple and took less than 5 minutes. The video and audio quality are good and real time viewing works well, even remotely (away from the home wi-fi). We have used the camera to keep an eye on our dogs when we are out of the house.\nIt's also cool that there is a 2-way audio/talk feature to communicate with someone near the camera.",
		  "I already have two security cameras from different brands. I liked the specs on this Ooma camera so I made the purchase. The features in this camera even without the paid subscription are superior to my Dlink and Nest cameras. The portability with the built in battery is a game changer. The set up with my Butterfleye was simple and fast. I did have some technical questions and contacted Butterfleye support and was instantly connected with their excellent tech support. The camera has a beautiful design however, the unit sits flat thus it does not have a stand to pivot on. Not a big deal but just an FYI to others. I am very pleased with this camera and may replace my other cameras with Butterfleye's.",
		  "I bought 3 cameras strictly for fun to watch what the dogs are up to during the day.\nPros:\n1) THE COMPANY IS EXTREMELY SUPPORTIVE AND RESPOND QUICKLY AND APPROPRIATELY.\n2) When the cameras and the app/connections are working , the VIDEO IS EXCELLENT QUALITY and the SOUND COMPONENT is quite a nice thing.\n3) Initial set-up was easy and first night it worked well.\nCons:\nThe morning after the initial set up, the locked me out and while i was using exactly the same sign in, it kept repeating that there was an error with my log-in.\nThe support staff were friendly and while the first person kept insisting that my internet probably wasn't working (despite telling him that it was and now that im at the office, using another internet connection, it still wasn't letting me into my account, he persisted), the second person worked to resolve my problem.\nThe customer service by the company is good.... you receive a standard form email from the general manager of the company, asking you how your experience has been. I was honest and told it him that so far, the experience had been kind of terrible.\nMagically, that evening, the app was working and i was later told by him that the problem had been on their end and corrected.\nIt worked for 4 days.\nOnce again, the app is not letting me log in.\n\nIm a little torn... the quality of the video is so good for the price but with the problems i've had, I have no confidence that their system is locked down enough to make me comfortable that they are secure against hackers (although I am assured by their general manager that the system is secure)\n\nBECAUSE Ive had frequent communication with the General Manager Ben (who has been very helpful), Im willing to give the cameras a try for longer...I WILL UPDATE THIS REVIEW AFTER ONE MONTH HAS PASSED with the final outcomes.\nSo ... for now... buyer beware.... others haven't seemed to have my experience so i guess you take your chances .",
		  "Très bonne caméra belle qualité et très solide excellent service à la clientèle merci Ooma",
		  "We love the ease of set up and the clear picture, very reactive sensor. Wish the speaker was louder with built in message."
	   ],
	   "numberOfRates":34,
	   "avarageRate":2.0297974157499223,
	   "id":21
	},
	{
	   "productTitle":"Ooma Motion Sensor, Works with Ooma Telo",
	   "desc":"",
	   "category":5,
	   "images":[
		  "714l98jTKoL._SX569_.jpg",
		  "81ApX-HQpRL._SX569_.jpg",
		  "81wffpS-pRL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"53.91",
	   "priceIs":"51.21",
	   "comments":[
		  "We love our OOMA Telco and this was an obvious choice to monitor our basement laundry room for water leaks or backup. We actually glued it to the floor about a foot from the sewer so weather we have a laundry or hot water tank leak or a drain backup we'll know. Another good thing about this is it works flawlessly with the OOMA Telco and there is no monitoring charge. If the sensor is tampered with or if water is sensed, OOMA calls my cell phone with a message. HINT: We also hooked up a Wyzecam in the laundry room pointing at the sensor and drain so if the sensor senses something no matter where we are in the world, we can use the Wyzecam app to see what is going on.",
		  "So far, it seems good. Good to know = if you have an old model telo, to pair the sensor you have also to push the handset locator button (rear of telo) for three seconds.\nJusqu`a present fonctionne bien. Note: Pour appairer le detecteur avec un ancien Telo, il faut aussi appuyez 3 secondes sur le bouton à l`arière du Telo.",
		  "Pro: Connects quickly to my Ooma Telo HUB ia Android app. Sensor works even though base and sensor are two floors apart. Reports when power outage so you're aware that sensor is also offline.\n\nCon: Sensor can take up to a min to detect water and send out the notification.",
		  "Love the Ooma phone and security system! have been an Ooma user for 2 years now, just upgraded to the security system and it's working great. have a door sensor, water sensor and motion detector. all work as expected and are easy to setup.",
		  "Excellent does what I wanted it to do. Easy set up. Calls my cell phone when there is motion detected",
		  "Works as it should",
		  "Vert good product",
		  "Works as described"
	   ],
	   "numberOfRates":100,
	   "avarageRate":3.611458637113215,
	   "id":22
	},
	{
	   "productTitle":"All-new Kindle Paperwhite – Now Waterproof with 2x the Storage",
	   "desc":"",
	   "category":4,
	   "images":[
		  "61UsM2Ij%2BjL._SY355_.jpg",
		  "61eAq6gg-XL._SY355_.jpg",
		  "61i%2BWuveOxL._SY355_.jpg",
		  "610DzWqXbfL._SY355_.jpg",
		  "619vNQedtjL._SY355_.jpg",
		  "71tgWeImVvL._SY355_.jpg",
		  "61nvEiERc1L._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"139.99",
	   "comments":[
		  "The short of my review is to say that this new Kindle PaperWhite is the best yet.\n\nBluetooth - YES. The Canadian version has bluetooth. There is a lot of confusion about the bluetooth capability because of the lack of Canadian Audible support. If you want to verify that the Kindle has bluetooth just follow the directions to pair it with a bluetooth device for VoiceView. It has bluetooth hardware - 100%.\n\nAudible - The reason why there are a lot of questions about bluetooth and Audible is because presently there is no support for Canadian audible accounts (.ca). If you have a US Audible account (.com) then you'll be able to use Audible without issue. You can change the region of your Audible account (.ca to .com) if this is a make or break feature for you. This will allow you to use the this feature. There are some gives and takes with regards to pricing for new purchases but changing the region of your existing library should be fairly painless and you will retain access to all of it.\n\nScreen - Very low glare matte finish strongly resembles print depending on your backlight level. There are some comments and concerns about contrast but as an electronic device this is completely customizable. Text size and boldness can be adjusted to suit you taste. Font, spacing and margins are among other user-configurable parameters. The reconfigured backlights on this model make it the most evenly lit PaperWhite to date. The 300 PPI screen is unchanged from the previous version but is more than adequate for crisp, contrasty lettering.\n\nWakeup - Some users have noticed that this Kindle wakes up slower than previous models. This is because the unit goes into a deeper sleep state than previous models to conserve battery. You can disable this feature in SETTINGS - DEVICE OPTIONS - ADVANCED OPTIONS - POWER SAVER.\n\nAs for the rest this Kindle is very fast. This is the first Kindle I've used with Page Refresh on where I don't really notice any lag or flicker when moving through pages. Base model memory is more than adequate for the average user who does keep a lot of audio books on the device. With the power saving feature mentioned above I'm getting the best battery life of any Kindle to date. WiFi connectivity is stable and adequately fast for the tasks the device will face. WAN (4G) connectivity is fast and reliable (My spouse own the WAN model).\n\nDoes it have a flaw? Yes. I agree with other reviews about the placement of the power button. I can see this as a potential problem for some but it has not affected my use which is typically handheld without a case. Despite this design issue I still give my highest recommendation for this device.",
		  "My experience is coming from using the previous generation Kindle. In many ways I like the new features like the flush screen and waterproofed design but there are a few design flaws with this new Kindle.\n\nNegatives:\n1. the power button was moved to the bottom and this can cause the device to accidentally turn off while placing it on a surface like a treadmill.\n2. Glare - this model has more glare than the previous one because of the glass screen. It's pretty noticable to me and distracting.\n3. No bluetooth. I dont understand why the US version has audible support but not the Canadian one.\n4. Contrast seems to be worse, text is not as black as the older model when the brightness is turned up. It causes the text to look blurry when reading in low light conditions.\n\nPositive\n1. Good battery life.\n2. Sharp text when reading in good lighting conditions.\n3. Inverted mode.\n4. Waterproof.\n5. Seems to be noticeably faster when opening the store and navigating around.",
		  "Have to give only 4 stars on this version of the paperwhite. The reader works perfectly. Sits well in your hands. I have no issues with the lighting quality. I absolutely love the flush screen. But, the bezel attracts a lot of fingerprints and my number 1 reason for only giving 4 stars is that the canadian version does not have bluetooth or Audible. I think this is absolutely ridiculous and Amazon has no reason for not including this. It's in the international version if bought from Amazon.com but not if you but from Amazon.ca.\n\nUPDATE: Read another review and discovered you can enable Bluetooth through Voice view. Also, changing your audible from ca to com will allow you to listen to your audio books.",
		  "I've purchased a Kindle Paperwhite for my wife. Wanting to make sure it was configured and ready to go, I used the supplied cable to charge the device. However, it would not insert into socket. Not wanting to break the cable plug or the Kindle I tried my own USB cable. Inserted easily and charged Kindle without issue.\n\nStarted a 'chat' with Amazon customer service, being passed from the initial rep to a 'Kindle expert'. It took forever to get responses after I replied to each of her questions. All I was asking for was a replacement USB cable. No big deal ... you'd think. Eventually, I couldn't spare any more time and accepted the USB charging cable at 'promo' price.\n\nBear in mind, I'd already paid for this AND it wasn't functional. Amazon - extremely poor service. In fact, worse, no 'service' at all. Just gouging. The Kindle better work!"
	   ],
	   "numberOfRates":118,
	   "avarageRate":0.47871776292275126,
	   "id":23
	},
	{
	   "productTitle":"Ooma Office Business Phone System with Virtual Receptionist",
	   "desc":"",
	   "category":5,
	   "images":[
		  "71RmuqxChOL._SY355_.jpg",
		  "31QEB4hZJHL._SX355_.jpg",
		  "81juJ8wBXaL._SY355_.jpg",
		  "61OWwbOMtSL._SY355_.jpg",
		  "71w0RcvOtSL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"199.99",
	   "comments":[
		  "Good product and works well.\n\nA few things to keep in mind. Each wireless Linx requires it's own registration and phone number. You can't just connect a bunch of remote phones to them without the added cost of extra phone numbers. Each number and extension costs $25 cdn each.\n\nThe service doesn't disclose its costs until after you register, set it all up and then get the bill. It can be costly. It would be nice if they gave you the costs online before purchasing any of their products.\n\nOverall it is cheaper than traditional phone lines.\n\nThis is what I have: I got a 1-800 number, one main phone number and two extension numbers with Linx.\nOne of the Linx is hooked up to a physical fax machine. It works well. Mind you, you can opt in for a virtual fax service, but I prefer a physical machine since I had the extra Linx.\n\nI would recommend this product. But, keep in mind it's not a free setup. Yet cheaper than traditional phone lines.",
		  "We decided to try out Ooma Office as soon as it made its way to Canada. We'd been using Ooma at our house without an issue and were considering grabbing a Telo for the office, but its lack of extension or multiple lines held us back. Now that we've setup Ooma Office at our dental office, it has certainly been a fantastic experience. Much better than our previous phone system at a fraction of the cost! The virtual receptionist also makes the office look very technologically advanced, which is important to patients (first impressions are everything). Our staff absolutely love the quality of service. We're also running 3 lines with 1 being a vital EDI line and it's doing even better than our previous landline provider.\n\nIf you're looking for a good office phone system at a fraction of the cost, I don't see any drawbacks stopping you from jumping out and grabbing this today! We were hesitant to make the switch, but everything from ordering the box, to the number port and daily use, has been absolutely fantastic. I'd recommend this office phone system to anyone any day without any hesitation!",
		  "This product is absolutely useless. You need to get a voip number from ooma for each extension you add to the system. Lets say you have 12 extensions, you need 12 individual phone numbers with ooma. That means 12 times $19.xx\nThat is extremely expensive!!!!! This works fine for a small office with a couple of extensions, thats it! Other than that don't waste your money. There are better stuff out there to put your office on a voip system at a reasonable price.",
		  "The Ooma Office Business Phone System has come a very long way.\nI purchased this product in 2014 and I now feel it has been a sufficient amount of time for me to properly review not only this product but also the company as a whole.\n\nThe product itself is a very good bargain. (Yes it's expensive up front, but the box pays for itself with the savings you get from your monthly bill) In our case, it took only 1 month to pay off the entire equipment. Our regular landline phones were totaling over $600 a month. Our first service invoice from Ooma was $112.00. Within that first month alone, we had recuperated our initial set up costs (equipment and time setting up), paid for a full month of service and still had $300 savings compared to the month prior.\nThe equipment since day 1 has never malfunctioned or has never needed to be replaced although at there was a period of about 6 months were we kept having interrupted service. (I later found out that this was due to the company moving and causing disruptions and doing updates in the middle of business hours) Due to this, there has been a lot of backlash from customers including myself, but I can honestly say that these issues have not happened for well over a year.\nThe benefits of having this system for a business office include not paying a physical receptionist to answer and sort incoming calls. This is huge for a small business like ours. The virtual receptionist directs calls to the correct individual before we even hear the phone ring. Furthermore, it keeps most of the annoying telemarketers out. Any business owner knows how frustrating it is to have incoming calls from fax machines, or telemarketers wanting to sell products. The virtual receptionist keeps them at bay and offers the business to focus on important tasks. The system navigation and controls are extremely user friendly. This enables small businesses to set up a answering service that will satisfy the needs of the business all without being complicated like server based answering systems that require an actual installer to set up.\nIn the recent years Ooma has really expanded on their office line and it is now possible to connect bases together to grow the system to more than 5 extensions. The system is fully customizable and with a little tweaking here and there, you can set up a system that will work for your exact needs.\nThe support staff from Ooma are really great, and easy to reach through live chat or phone. I like that you are able to send and receive faxes without wasting paper and the efficient and professional look of the overall system is great.\nI would recommend this product to any small business owner.",
		  "We've been using Ooma office for almost a year now and its mostly okay. There have been a few technical difficulties which have caused me to complain to Ooma on more than one occasion, but the past few months have been not bad for service. They apparently went through a server upgrade which seems to have solved some, if not most of the issues we had with breaks in service and poor quality. They gave us 3 months of free service due to the complaints.\nPros\nEasy to set up!\nVoice mail sent by email!\nOnly one phone number but as you add extensions, all extensions can be used at the same time.\nYou can drop and add lines/extensions as you need them to save money.\nI haven't used it but the simultaneous ring could be very useful! (where your desk phone and cell phone ring at the same time.)\nUse ordinary phones!\n\nCons\nStill a few technical issues with the service but much improved.\nLimit of 5 lines unless you use virtual lines with cell phones.\n\nNote: If you have technical issues with quality, call Ooma as they can tweak the base unit remotely to optimize it for the internet service that you have available. This helped a lot at the beginning of our service.\n\nI recommend this product and would buy it again."
	   ],
	   "numberOfRates":125,
	   "avarageRate":5.573141156767243,
	   "id":24
	},
	{
	   "productTitle":"Echo Spot - Smart Display with Alexa - White",
	   "desc":"",
	   "category":6,
	   "images":[
		  "611GEYEsinL._SX425_.jpg",
		  "61%2B2igQUJqL._SX425_.jpg",
		  "71%2BHXfJSx0L._SX425_.jpg",
		  "71XfWaQ2WgL._SX425_.jpg",
		  "61gts2el51L._SX425_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"169.99",
	   "comments":[
		  "Beware of the advertised skills fellow Canadians. For some stupid reason a lot of these skills are not available to us. Why not just make all skills available to any device no mater where its located????\nSure you can change content to amazon.com but after doing this and linking accounts properly for my home security system....Alexa still refuses to work with it.\n\nAlso this thing has a major bug that amazon seems to not want to fix after researching it online. If you say \"Alexa turn screen off\" or \"Alexa good night\" when the screen is turned back on it stays really dim unless you unplug it and restart. After doing some reading it seems I'm not the the only person having the issue and its been thoroughly reported to amazon.\nhttps://www.amazonforum.com/forums/devices/echo-alexa/484677-echo-spot-remains-dimmed-from-night-mode-even\nThis dimming issue has happened to me a few times already.\n\nAll in all I have to say I'm pretty disappointed with this thing and amazons stupid choice to limit Canadian content.",
		  "I like the spot as a bedside clock. Also to quickly tell me the news and the weather in the morning. If you have Prime, its also good for music, although Amazon needs to add to their music library if they want to compete with Apple Music or Spotify.\n\nAlexa doesn't seem to be THAT knowledgeable compared to google home. Many questions go unanswered. This will get better over time as they update their information, but its not as revolutionary as I expected.\n\nI like that you can call your contacts for free. I don't need a home phone or to carry my cell phone around the house.",
		  "I being a AI scientist, decided to bring ALEXA echo products to help my kids improve their communication skills. This might be different use you may have heard ever ...certainly defies the use of these voice enable smart devices. Even though I have Amazon prime, I needed additonal unlimited scubscriptions to play contents related to kids, choices of education programs for kids are not huge. The quality of such contents is also not that great.\n\nI got ECHO, ECHO-DOT and SPOT to bridge the gap and functionalities I had originally with Echo. However, I cannot in improve the quality of devices because it needs an exact same model to pair. So, three devices cannot work simultaneously. I may not be aware of more features, but that's one thing. I was able to pair DOT to SPOT and music from DOT was played on SPOT but not vice versa. Same thing with ECHO. It was very disappointing, as I thought I can stream VIDEOS on SPOT and use the good quality sound experience from ECHO and DOT.\n\nOne of the biggest disappointment I had was unable to stream videos or browse web-browsers to play third party contents on non-video enabled devices. This is a killer feature if implemented and can surely kill Google HOME. Imaging, you can play video contents on non-video devices. Why do I need to have VIDEO/TV-enabled devices to use video features?\n\nI also purchased GOOGLE HOME to make comparisons and found that ECHO device and HOME are almost the same. However, speech recognition is far better on ECHO than google. Content-wise, Google wins.\n\nI got a call from AMAZON rep about this review and I will try a few things, she suggested me to improve the experience. However, for my specific needs, I have really limited choices.",
		  "Wonderful product and really simple to setup. I am going to get a dot to put in my office and one for the bedroom too. I have Google Home but kept looking at this because of the screen. Phone calls are easy peasy and I had no trouble having a conversation with a friend in Ireland. Overall I find it much smarter than the Google product. There is only one thing I have had a problem with so far and that is configuring a smart power bar I have. It recognises the bar but not the individual sockets (Google can do this). I am sure I just have missed something and will have another look. I definitely recommend it.",
		  "Not sure I’d recommend one of these over the echo dot. The camera and video functions are “neat” but of limited use. The fixed position of the camera is inconvenient as a video call device.",
		  "I was not satisfied with the product. Definately, It need more development. The commands have to be repeated a few times in order to begin. Naturally,I am music lover, especially European song, unfortunately, echo Alexa has limited amount and category of music which was a big surprise for me,especially for this price. Simply, I was offered by amazon to get monthly suscription for 3.99$ to get unlimited amount of music which is ridiculous for me. Alexa doesn’t play YouTube because of the fight between Amazon and Google. However, you can make a video call.",
		  "Love the design of it. Use it as a bedside clock. I like having new gadgets so I bought one but if not needing it right away, I would wait till price drops and more skills are available, right now it’s basically an expensive alarm clock. The camera is weird to have inthe bedroom but can be turned off. Skills I use video for are CBC news and sports updates etc. YouTube does not work on this and it uses Bing as it’s search engine which isn’t the greatest as opposed to google. Again, they are promising more skills.",
		  "Amazon Prime Day was a great opportunity to get into Alexa and this Echo device is my favorite of all. The shape and the fact it has a screen makes it so much more useful than the normal voice unit. At the same time it these very features that do not make it suitable for all locations in the home. But for places like my desk and beside the bed it is great. It will be a while, if ever, before I can get the max out of Alexa and Echo but so far I am impressed."
	   ],
	   "numberOfRates":188,
	   "avarageRate":2.379234126373233,
	   "id":25
	},
	{
	   "productTitle":"Echo Show (2nd Gen) – Premium sound and a vibrant 10.1” HD screen - Charcoal",
	   "desc":"",
	   "category":7,
	   "images":[
		  "61VgO36wOpL._SX522_.jpg",
		  "51Q9SoJbqOL._SX522_.jpg",
		  "61ZJndRqDRL._SX522_.jpg",
		  "61jaxSW2EXL._SX522_.jpg",
		  "61Yz0bUnFQL._SX522_.jpg",
		  "613qKKvyAGL._SX522_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"299.99",
	   "comments":[
		  "(2nd UPDATE) We are seeing growth in the Amazon Alexa devices, unlike the regression we are seeing in Google Home. Some skills now continue to work when you switch back to the Canadian store even though their options may disappear. Also Amazon has added the ability to add a timed delay in the routines sections. Some of these may have been along time coming but atleast they are here now. Also in Amazons defense they do not program the skills they just approve them in their store, it is up to the skill designer to choose which stores they want their skill available in. I can confirm this as I have submitted my own skill to the store, an Odd or Evens game, and I was given the option to select country availability.\n\n(UPDATED) You are able to switch over to the Amazon US Skill Store in the content and device settings on the Amazon Account page (Not in the Alexa app) and install any skills from the US Store BUT when you switch back to Canadian they stop responding, VICE VERSA my Canadian News Skills don't work when leaving the device in the US Store...WHY CAN'T WE ALL JUST GET ALONG!!! #OneEnglishSkillStore! Increased rating from 2 stars to 3 cause at least they let you try.\n\n-----------------------------------------------------------------------------------------------------------------------------------------\n\nThis is my 3rd Amazon device and probably my last.\n\nI have been automating my entire household and I am completely and utterly disappointed with the lack of support/skills for the Canadian market. While this is not entirely Amazons fault as skill developers get to choose which countries the skills are available in, and I have developed my own skills for the Amazon.ca market so I can confirm this is true, however the fact that Amazon distinguishes an app skill store to be different between Canada and the USA is beyond stupid.\n\nTop Skills that do not work in Canada/features locked out for no smart reason:\n• Jeopardy (Skill available in US)\n• Nvidia Shield TV (Skill available in US)\n• Tile/SmartKeys (Skill available in US)\n• Amazon Prime Video (Hard to access and very limited in Canada the US users have more functionality)\n• Ring doorbell (Alexa Chime option is available in US)\n• Ring doorbell (Two way communication, the Show has a microphone for two way communication between Show devices)\n• Amazon Show camera can NOT be accessed via the Alexa app as a security/pet/baby monitor\n• No Ability to add a timed pause between actions in a routine (Restart device X , pause for 30 seconds, adjust setting Y once device is restarted)\n\nAnd I am sure there will be many more simplistic features that will disappoint me in days to come. The fact that Amazon owns Ring doorbell makes it even more disappointing that the two are not more compatible.\n\nPlus items:\n• Speaker quality has improved\nThat is about it.",
		  "We really love having Alexa in our lives. However, before you purchase know that in Canada the recipe feature does not work. There may be companion apps with recipes, but when asked about recipes Alexa will answer “sorry this feature is not supported.” It’s a bit disappointing as the above Alexa description mentions recipes and kitchen usage several times. Kind of false advertising.",
		  "I bought the echo show yesterday thinking it would be a great addition to my kitchen. Device's sound and sceen are excellent. But after testing alot of skills/features, I am disappointed that many don't work in Canada. And those that do work are buggy. For example, one basic feature that I use everyday isn't working.. I normally say \"Alexa play 104.7 on tunein radio\" it starts to load saying \"playing 104.7 outaouais on tunein\", screen appears and then flashes and then says \"104.7 isn't available.\" Then I go in my living room and say the exact same command to my normal echo, and it works no problem. I reset the echo show and try again, same thing. I can browse google, listen to music and even \"Alexa play ultimate art bell on tunein radio\" works. But for some reason, 104.7 radio station refuses to work on the echo show. It's very annoying. Another bug is any video I play on youtube just stops after a few minutes. No netflix either.\nI chatted with amazon support.. Only to be asked to reset the device. I wish they would just unblock the content ohere in Canada. Anyways.. Big warning for this device.. Should have held off on buying it.",
		  "Buyer beware. We recently got this as a gift and wish our family hadn’t wasted their money. As mentioned in previous reviews, many of the features don’t work in Canada and the ones that do are glitchy at best. Music stops for no reason, albums are shuffled but songs can’t be played, customer support is non existent. I’ve called twice to assist with troubleshooting only to be conveniently disconnected while on hold. All in all looks flashy and has lots of promises but an overall pain to try to use.",
		  "This is a well built Robust screen/Speaker with a good resolution and good sound. But I spent my $300 CDN purposely for a Kitchen monitor to view and follow on screen receipes. This is shown as a capability even on the Canadian Amazon site. IT DOES NO SUCH THING. This is disingenuous Marketing. Amazon should be ashamed of themselves and remove it. Good Corporate Philosphy would be to honestly respresent what their products capabilites are in the market in which they sell it. I will not return it but my loyalty to Amazon has been permanently tarnished.",
		  "The build quality and sound are excellent with this unit but the smarts have a ways to go!\nAsking for a recipe returns a statement to the effect \"I don't know how to do that yet\"\nVarious other requests were met with the same reply. I returned this and bought a Google Home Hub\nwhich has exceeded expectation with the exception of not having sound as nice as the Echo unit.\nMaybe I'll try again in a few years but for now Alexa is going back to Amazon!"
	   ],
	   "numberOfRates":174,
	   "avarageRate":5.74159850748587,
	   "id":26
	},
	{
	   "productTitle":"Fujifilm Instax Square SQ6 - Instant Film Camera - Pearl White",
	   "desc":"Time goes by. Before you know it there are so many precious moments that you'll never have again. The 1:1 square format instax Square SQ6 captures the beauty in each and every moment, so that you can cherish those memories for a lifetime.",
	   "category":5,
	   "images":[
		  "81FnGZ71jBL._SX355_.jpg",
		  "81dX6v2aOyL._SY550_.jpg",
		  "819Iia0B8zL._SX355_.jpg",
		  "914BcCjQNyL._SX355_.jpg",
		  "81Hw5t%2BEA-L._SY450_.jpg",
		  "91qeHf6oeHL._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"129.99",
	   "comments":[
		  "The Rose Gold finish is a beautiful touch to this instant print camera! It's easy to carry around with the complementary camera strap. The only reason why I rated it 4 stars instead of 5 is because you have to shoot closer than you'd expect to get more detailed/crisp shots. You lose more details and sharp lines the farther your subject is from the camera.",
		  "Love it! We choose this one over sq10 for its original polariod style. Great purchase",
		  "I like this camera",
		  "Love my camera.. I bought this rose gold color. Altho downside is that its a little hard to take photos because the lens and view finder is not aligned.. so you have to learn how to adjust a little.. the film and battery are both expensive as well thats why i have it 3.. but all in all i like the quality and more settings to use. And the looks of the camera is just my style.",
		  "I ordered this as a gift for a friend, it worked but only if you firmly held the back latch shut with your thumb while it printed. So, I contacted amazon and they sent a replacement (very speedy and easy to do); the replacement seemed to have the same issue with the back not latching all the way, but the lens also wouldn't \"open\". I put the batteries in and the lights on the back came on, but the lens wouldn't expand so I couldn't take any pictures. I didn't realize this until I had already loaded it with film and was unable to remove it. So, I've returned both of them and lost a pack of film in the process. Overall, very disappointed with this product.",
		  "I love this camera. It's really nice and looks great in my instax collection. Takes nice photos.",
		  "Fun camera. Does a lot for a little instant camera and the film develops fairly fast. Shipping was fast and packaging was appropriate.",
		  "Price way too high, especially didnt like how they raised the price right before the holidays."
	   ],
	   "numberOfRates":19,
	   "avarageRate":2.145480042161297,
	   "id":27
	},
	{
	   "productTitle":"Ooma Air Telo Free Home Phone Service with Wireless and Bluetooth Adapter, Black",
	   "desc":"Download the Ooma Mobile HD app and take your Ooma service on-the-go. Make calls on your smartphone using your Ooma phone number from almost anywhere in the world using Wi-Fi or 3G/4G. Features include the ability to upload contacts to the Ooma address book, listen to Ooma voicemail, and change Ooma preferences directly from the app.",
	   "category":5,
	   "images":[
		  "71HB9QtzQ6L._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"129.99",
	   "priceIs":3853,
	   "comments":[
		  "Great product, works well so far, it does help to cut on costs. Unlimited long distance in Canada, caller ID, standard voicemail, it's still great for the price.\n\nEasy to install (but some advanced network/router knowledge is recommended for tweaking), got activated quickly, so far I am not getting any telemarketing calls on OOMA, so a new number was appreciated.\n\nI got the package with the WiFi+Bluetooth adapter (same price), but to be honest, I decided not to use it to avoid unnecessary delays in my voice calls. So I cannot really comment on that, except that I was able to sync my smartphone when I tested it with no issues.\n\nSome additional notes in regards to OOMA and its services:\n-The service is being advertised as *free. Do not forget that 9-1-1 and other minimum services and taxes need to be payed. It came up to 4.98$ per month for me, which is still a lot better than what I used to pay with my previous provider.\n\n-The voice quality is not perfect, being Voice Over IP. It does depend a lot of your internet speed and its reliability. I still detect a small delay in my voice vs the service provided by regular providers (Bell, Telus, Videotron, etc.). It is annoying, but not enough to cancel OOMA if I consider the lesser monthly cost.\nSome will say to put your OOMA device directly after your internet modem, then connect your home router through OOMA. Not only that does not guarantee a \"delay free\" experience, but it also means that all trafic is now passing right through your OOMA device before getting to your router and home network. On top of that, the internet port of the OOMA device is limited to 100mbps, so you are limiting your \"Out to router\" speed to that. With internet speeds these days, it becomes a real bottleneck. I would not advise to do so. Some router tweaking are also available all over the internet to help getting a trouble free experience with OOMA, but again, nothing that can guarantee it.\nSo instead of doing this: Internet modem -> OOMA -> Router\nI advise to do this: Internet modem -> router -> OOMA to fully benefit of your high speed internet (if the speed is higher than 100mbps)\n\n-No integrated UPS/battery backup. If your power goes down, you lose your phone, even if your internet is still up with a battery backup. Most standard providers will supply a battery backup with their phone and internet services, so you need to consider getting one if you do not want to lose your phone when there's a power outage.\n\n-The Premier package is at 10$ per month, plus tax. On top of that, you still need to add the monthly minimum that I mentioned earlier (4.98$). A lot of great features are part of the Premier package (call blocking, telemarketing blocking, etc.). Take a look here for a full comparison between packages: http://support.ooma.com/home/feature-comparison-ooma-premier-basic). You can probably live without the Premier package, but if you do activate it, bare in mind that it will get you a lot closer to 20$ per month with taxes, which is not that far from what a standard provider would charge (I used to pay around 28$ per month). Unfortunately, OOMA does not provide discounts on annual subscription. 9.99$ per month for Premier and 119.98$ for a full year (even more expensive than 9.99$ X 12!), but you do get a \"gift\" for the annual subscription. In my case, it was not worth it. I would have preferred a rebate.\n\n-One last thing to keep in mind if you decide to port your number to your OOMA service, it says that the delay will take about 4 to 6 weeks in Canada, which means that you will need to keep your service with your previous provider (and pay for it!) until the number is ported. It can add up costs quite fast as there are no guarantees on delay either. According to some bad reviews, it was a nightmare for some. I did not have to port my number, so it wasn't an issue for me.\n\n-DECT support only works with OOMA phones, and from what I read, they are not good. What that means is that while you will still be able to plug your cordless base straight into the OOMA device, don't expect your handsets to be able to sync straight into OOMA as it will not work. OOMA will talk to your cordless base that will then talk to your cordless phones. Not that it really changes the experience, but I would have hoped for a OOMA to Phones communication.\n\nOn a last (but important) note, OOMA also sells some linx for people who want to add additional phones or faxes to their OOMA service, which only has 1 phone jack (RJ11) at the back of the device. The role of the OOMA linx is to communicate with the main OOMA router wirelessly since there are no additional jacks available. As another reviewer mentioned, I was able to plug multiple devices in my home without using any LINX.\nIn my electrical panel, I have a phone jack that provides a line to all phone jacks in the house. I simply plugged my OOMA's RJ11 cable straight into that main phone jack in my electrical panel and voila, all phone jacks in the house are now provided with OOMA service. It works well and I've had no issue so far.",
		  "Le systeme téléphonique Ooma est excellent et le son est nettement meilleure que celui des autres téléphones internet. Il se compare assez bien avec celui d'une ligne fixe conventionnelle. Le coût d'utilisation est inférieure à celui d'une ligne fixe ou d'un cellulaire. Le seul désavantage est l'absence de service en cas de panne d'électricité ou de serveur internet, ce qui n'est pas vraiment un problème si on possède un cellulaire.",
		  "I purchased Ooma Telo with wifi/bluetooth adapter because I wanted to have the phone centrally located in the house rather than connected to the modem on the top floor. Set-up and even number porting was fairly simple. But from day one the call quality was that great. Sometimes there was a voice delay or it would drop momentarily, which made it frustrating. After chatting with Ooma a couple of times, each time they strong recommended connecting it directly to the modem for best call quality. I did that it it truly works like a dream. However, Ooma should not sell the wifi/BT adapter if they know it doesn't work that great. I paid extra for it and wish I could at least get my money back for the adapter.",
		  "Vraie belle solution et alternative au téléphone filaire. Plus besoin d'une ligne de téléphone et d'un forfait pour les interurbains. Très satisfait de mon achat. La configuration est assez simple et si vous voulez garder votre numéro de téléphone actuel, il vous faut payer un supplément pour faire transférer votre ligne.",
		  "Works as well as the company says it does on their web site. It only took two weeks to get my land line phone number ported to the Ooma. I love the ability to forward all calls to my cell phone. Controlling the features on line works great.\n\nMy monthly bill for unlimited CDN and US calls and basic phone service has dropped from about $48 a month to Telus to about $18 a month to Ooma. I'm now also have a lot of features that I was not getting before from Telus.\n\nWhen you plug the Ethernet cable into it to set it up with your modem be sure to plug the cable into the correct outlet. There's an in line and an out line. If you get it wrong the Help and Q&A are of no use to figuring it out.",
		  "My old unit was no longer able to be updated. I was told I needed to upgrade to get the new software and that initially peeved me a bit because technically my unit was still working. Then I checked and realized it was 5 years old and technology does not stand still. All in all I have saved enough money over the five years that even factoring in a second Telo is still considered a good deal. If this one lasts another 5 years then I guess I will be happy. I still get occasional connection issues and I have to reboot but that is par for the course if you are dealing with an internet phone. All in all I have recommended the service to my friends."
	   ],
	   "numberOfRates":55,
	   "avarageRate":1.9148896865230425,
	   "id":28
	},
	{
	   "productTitle":"XP-Pen StarG640 6x4 Inch OSU! Ultrathin Tablet Drawing Tablet Digital Graphics Tablet Battery-Free Stylus(8192 Levels Pressure)",
	   "desc":"",
	   "category":4,
	   "images":[
		  "51c0%2B7%2BudkL._SX569_.jpg",
		  "61JGKH%2BxuYL._SX569_.jpg",
		  "61UxxD0pCBL._SX569_.jpg",
		  "61%2BUwNluTvL._SX569_.jpg",
		  "612HfRhN4YL._SX569_.jpg",
		  "61ADRAZvrKL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"42.99",
	   "comments":[
		  "Disclaimer: I use this as my main tablet, but to play osu. I do draw with this, but this is about the product not the use.\nI'll summarize:\nTablet - fantastic quality, low profile, responsive, better than Intuos Pro tablet (with a price point that's absurdly worth it). The durability is pretty incredible considering how much I use this. The only fault is the matte finish on the tablet does wear out, but I prefer the sleek feeling over the \"paper\" feeling of dragging a pen on the surface. Shouldn't be an issue for drawing though.\n\nPen - Works.. well. Responsive, clicky buttons*. The tablet comes with a no grip stylus so if you have sweaty hands, it'll slip pretty easily. Otherwise, honestly the nibs last a VERY long time, and they give you 20. Wacom for sure is way too expensive when it comes to replacement nibs, and these guys are literally giving them away. I press hard, and the nib I've been using for about a month doesn't have any bad wear and tear.\n\nPressure sensitivity - a number doesn't really explain, but with me pressing down pretty hard with default settings, it goes about up to 6000/8192. Regular taps were maybe 100-250, and drawing was 500-2000 depending. I felt pretty uncomfortable trying to max out the sensitivity on purpose. (there's a custom curve setting on the application. great for sensitivity tuning)\n\nWarranty - Wow, 18 months for the tablet itself, and it's pretty extensive (excluding wear&tear) and yes this applies if you're ordering from amazon. Because the pen is included, it's 3 months if the pen breaks.\n\nCustomer Service - Yes, I had to deal with the dreaded conversation of something being broken(note the asterisk above for pen*). The pens are resilient, but unfortunately my buttons stopped working. All I did was explain that to them, an image and an invoice of the purchase, and without question (EVEN WHEN I WAS PAST THE WARRANTY TIME) they passed it over to sales and I'm going to get a replacement pen free of charge. This is seriously above and beyond, in my opinion, especially since usually big companies don't care about outlier issues like this. All this, and this was at 21:30 (-8h).\n\nPersonal opinion:\nIf you honestly want a good tablet, get this. I prefer this over the other tablets I've used, even when the pen can be a pain, but this company SHINES when it comes to its customer service. It's affordable, and I really can't say anything bad about it. Besides not having any other pens that work with the G640, but you can just take a pen grip off an old pen and slip it on there.",
		  "As someone who never bought a pen tablet before to play Osu, I have to say this one feels pretty good and in terms of build quality and responsiveness I have had no issues. HOWEVER, there is a huge issue with the pen, and that is the fact that it has no rubber sleeve where you grip it, or even any kind of grooves at all save for a small widening at nearly the tip of the pen, and for a person who often plays the game with sweaty hands this is almost a game breaking issue, as your grip will shift significantly through a medium to long length song.\n\nIf you don't have an issue with sweaty hands, are comfortable with holding a pencil really close to the tip, or unlike me actually use it to be productive and casually draw art, this tablet is definitely worth it for the price. Unfortunately for me, said product will not be a long term solution for my tablet needs",
		  "It got connected to my computer pretty easily and it's fun to use. Downloading and installing the driver from their website was easy too. The price is comparatively pretty good and it's useful for beginners. It's good that you don't need a battery for the pen, and the design is slim which is good. The build quality is not the best though, and the buttons seem flimsy as well, but overall and considering its price I think it's a good choice. The only thing that's could make me take one star away (I haven't though :P) is that the pen sometimes does what it wants and you need to take it away completely from the pad so that it stops and then you need to start again.",
		  "This is the 2nd tablet i have purchased in under a month. i first tried a Huion H610 and had a very unpleasant experience with it, the pen for it broke on the third day, after spending 2 days trying to find drivers for windows 10 that actually worked. The quality of the pen, tablet and the drivers for XP-Pen StarG640 is much better quality than Huion. I use this tablet for both Osu! and drawing and it is very good for both. After switching from mouse to tablet for Osu! There was a short time where learning to use the tablet was kinda frustrating, but i would expect that from any tablet. After a while though i noticed a huge accuracy increase and was finally able to complete maps that i previously was not able to. I would highly recommend this tablet to anyone looking to get their first tablet for both drawing and playing Osu!",
		  "It was the easiest plug and play install. I started playing with it immediately without any glitches. The pad is very sensitive and responsive. I like that matt surface finish of the pad that allows you to feel a bit of a scratch to simulate a real paper doodling feeling. The pad is pretty small if you have a 24\" or larger screen, however the price is unbeatable."
	   ],
	   "numberOfRates":80,
	   "avarageRate":1.1764042611845595,
	   "id":29
	},
	{
	   "productTitle":"Edifier H297 Around-The-Ear Hi-Fi Headphones - Micro Tuned in-Ear Monitor Earphones",
	   "desc":"",
	   "category":4,
	   "images":[
		  "71ek6F9-TjL._SX679_.jpg",
		  "61%2BFewYbdML._SX679_.jpg",
		  "71f5e3MIziL._SX679_.jpg",
		  "61Ap0tMAAsL._SX679_.jpg",
		  "71xtCsivIUL._SX679_.jpg",
		  "71Id71hM1fL._SX679_.jpg",
		  "71jLecm241L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"129.99",
	   "comments":[
		  "Excellent sound clarity, especially the mids and highs. Always a pleasure to hear nuances in my favorite songs I haven't heard before. Comes with a bunch of earbud attachments, though I recommend the foam tips if you like more pronounced bass.",
		  "I have small ears inside and out and these are extremely versatile with sizing options. Finally I have a pair that fit in my ears and when my inner ear gets tired I loop it around using the rubber ear piece provided. Great product!",
		  "great",
		  "Great sound which works well. My only complaint is the ear attachment doesn’t really hold the speaker stable in my ears when running.",
		  "These are Honestly the best headphones I've had so far the overall sound is just great I mostly love the minimal design though. The one thing I didn't notice is that there was no volume control I was mainly absorbed by the sound and it was slightly concerning but the sound quality overcame it.",
		  "My husband plays in our church band. He absolutely loves this head phones. I think he's mentioned it five or six times now. He says they make a huge difference in being able to hear each person in the band and he can still accurately hear himself. (They use in-ear monitors.) He also loves them just to listen to music.",
		  "Great sound!",
		  "great product just as described and would recommend it to friends",
		  "Excellent sound with a fair price!"
	   ],
	   "numberOfRates":105,
	   "avarageRate":1.2881969805400852,
	   "id":30
	},
	{
	   "productTitle":"True Wireless Earbuds，XIAOWU Latest Bluetooth 5.0 Headphones Sweatproof Sports Headsets in-Ear Noise Cancelling Mini Twins Stereo Earphone with Built-in Mic (Gold)",
	   "desc":"Aluminium alloy charging compartment, This exclusive patented independent power management technology enables The charging compartment can separately control the charging of the left and right earphones separately, place the L&R earphone into the Charging Station, One Red LED indicates the earphone No power, One blue LED indicates the ear-bud charged fully, The ear-buds will charge automatically .1. The charging compartment can control the charging of the Left & Right earphones separately， Intelligent Mono charging controls increase the Ear-buds battery life.2. Middle LED show the charging case power level3. Intelligent control and no repeat charging, increasing battery power by 30-50% and extending battery life.",
	   "category":5,
	   "images":[
		  "71xRjJWW9GL._SX355_.jpg",
		  "61PtrVAtUoL._SY355_.jpg",
		  "61ThYnoZpWL._SY355_.jpg",
		  "61gZHpHFgnL._SY355_.jpg",
		  "61x7e5uH8zL._SY355_.jpg",
		  "61htekBNa%2BL._SY355_.jpg",
		  "51vBU9GCnDL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"58.99",
	   "comments":[
		  "I boxed with these in my ears and one fell out when I went to answer my phone.... Then I remembered I could answer with the headphones... Quality on phone calls is perfect .. no echo ... Good sound... And I'm 30% deaf",
		  "Love having bluetooth headphones. But the sound isn't so great. Plus had one experience when after connecting my phone to my car, the headphones wouldn't work with my phone anymore - telephone functions worked, but media would play and there would be no sound in the headphones. After numerous attempts, it reconnected.",
		  "Missing the 3 earbuds still,found my own wire to charge but ear pieces would of been be nice not happy so far",
		  "I like that they fit the contour of my ear and stay put without a lot of pushing.",
		  "I like",
		  "Bought this one for my friend and he really love it",
		  "There was no bass and they were not noise cancelling",
		  "Product was as advertised I'm very satisfied with its performance."
	   ],
	   "numberOfRates":62,
	   "avarageRate":1.22548195092113,
	   "id":31
	},
	{
	   "productTitle":"SanDisk Ultra 128GB microSDXC UHS-I Card with Adapter(SDSQUAR-128G-GN6MA)",
	   "desc":"(1) Full HD (1920x1080) video support may vary based upon host device, file attributes, and other factors. See HD UHS-1 (U1) designates a performance option designed to support real-time video recording with UHS enabled host devices.(2) Card only. See proof for additional information and limitations.(3) Results may vary based on host device, app type and other factors.(4) For 64-256GB: Up to 100MB/s read speed; write speed lower. For 16-32GB: Up to 98MB/s read speed; write speed lower. Based on internal testing; performance may be lower depending on host device, interface, usage conditions and other factors. 1MB = 1,000,000 bytes.(5) 1GB = 1,000,000,000 bytes. Actual user storage less.(6) Approximations; results and Full HD (1920x1080) video support may vary based on host device, file attributes and other factors.Western Digital Technologies, Inc. is the seller of record and licensee in the Americas of SanDisk products.",
	   "category":7,
	   "images":[
		  "61iWTnvk0xL._SX569_.jpg",
		  "6187smQuJQL._SX569_.jpg",
		  "81yROlQskhL._SX569_.jpg",
		  "61Cu4fF1MBL._SX569_.jpg",
		  "5183Fad9zVL.jpg",
		  "81fFqsoyKfL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"31.00",
	   "comments":[
		  "Ordered another card to replace the returned fake one. This one tested ok. Lots of fakes out there so always test your cards with an app like “SD Insight” to make sure you have a legit card. You’ll save yourself a lot of grief In the long run.\n\nThird one of these I've purchased. First two tested ok with info about manufacturer, ser #, size and manufacture date ect provided when tested. This card tested with the result of \"invalid card\" with no info about the card provided. Pretty sure it's a fake. Returned and will try another one.",
		  "I've purchased this card to extend my Nintendo Switch space and it works well! Formatted in extFAT, run the firmware version 5.1.0 on your Switch and absolutely no problem. However, you don't really get 400GB. In fact, it's more 366GB, which is normal in Windows environment. Just in case it would have been a fake, I've ran the H2testw test to check everything and it's a legit card. Very please with my purchase.",
		  "I had good experiences with SanDisk products in the past, but I will be buying other brands from now on.\nI purchased a 128gb card for use with my Samsung S7. One of the main functions I need, is the ability to transfer files to and from my laptop at home.\nWith my old 64gb SanDisk card, my laptop and phone both had no problems working with the card, but for some reason, the 128gb card never worked (it kept giving a \"Catastrophic Failure\" error message when I attempted to transfer files to the card).\nA replacement card also failed in the exact same way.\n\nThinking it might have been my laptop or phone, I purchased a Samsung memory card as a test. Lo and behold, it worked perfectly on the first try, leading me to believe that the 128gb SanDisk cards were the problem, and not my hardware. Definitely will not be purchasing from SanDisk again.",
		  "You can see from the screenshot I linked. The sd card starts corrupting data at 32gbs. This card is clearly a rebranded 32gb card with a false reporting controller. Be careful, test your cards.",
		  "A lot of people received fake SD cards out there, so I'm lucky I got a genuine one. Paired this with my Surface Go and I can transfer files and watch videos with no errors or any distortion occurring.\n\nH2testw says read/write speed is 62.8 and 37.8 Mb/s, which is far below Sandisk's claim of 90 Mb/s. Also, if you have the 200 GB card the actual usable space will be 183 GB.",
		  "Been using SanDisk for years now, and it's the only brand I trust (after having had a couple negative incidents with the other major brand).\n\nI use these microSD cards mainly for home security cameras, my phone, and my drone. They have served me very well and reliably in all these cases.\n\nEven though the write speed on this card is only about 15-20 MB/s, that seems to be sufficient for all the uses I mentioned above (and my drone records in 4k 30fps, at a bit rate of about 60 Mbps).",
		  "SanDisk Ultra 128GB microSDXC UHS-I card with Adapter(SDSQUAR-128G-GN6MA)SanDisk Ultra 128GB microSDXC UHS-I card with Adapter(SDSQUAR-128G-GN6MA)\n\nIt works perfectly in adding storage to our Android LG X Power 2 phone. Transferring videos and photos from internal storage to the SD card is fast and easy.\nWe also purchased a second SD card for our HP Stream 14\" notebook. This solved a major issue with internal storage that was constantly running out due to Windows and HP updates.",
		  "Works great in my Gopro 6 shooting 4K video at a better price point than most other options! Just got back from a week long dive trip without issues."
	   ],
	   "numberOfRates":7,
	   "avarageRate":2.3335672399507628,
	   "id":32
	},
	{
	   "productTitle":"AmazonBasics AAA Performance Alkaline Batteries (36 Count)",
	   "desc":"",
	   "category":4,
	   "images":[
		  "81qmNyJo%2BkL._SX355_.jpg",
		  "51g3uIwzOIL._SX355_.jpg",
		  "81ZTa1BrkzL._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"14.96",
	   "comments":[
		  "Cheap price and delivered quickly but these batteries don't last nearly as long as a standard energizer or Duracell battery. I was lead to believe based on other reviews here that it would be close.\n\nI bought several led lanterns on here and used two with standard energizer batteries and two with the amazon batteries (exact same lanterns, was a 4 pack)\n\nNot even halfway to their rated run time for the lanterns the amazon batteries were already half the brightness while the energizers were still at full brightness. The lanterns are rated to last 12 hours at full brightness, and it's easily achieving these times on the energizers, but after 4 hours they were already dimming on the amazons\n\nNot as good of a value if they last not even half as long =\\",
		  "I haven’t actually seen battery acid since the 80’s but the smell and visual appearance was so obvious as soon as I opens my\nOrder. They were wrapped in packages and two of the packages were like this. I wanted to like amazon batteries as we have a toddler and we seem to go through them like tissues but I couldn’t ignore the fact I threw half of them out before use. The ones I did use were for a small light we use during power outages. After two hours we had to remove the batteries and put new ones in. My energizers last three days of steady use. Very disappointed and don’t think I will be giving these another try.",
		  "I bought two 48 packs in December 2016. Shelf life of 06-2026. Been using them steady since then, always worked great in various devices. And I would have had no trouble buying more or recommending them until tonight. I opened up a device to find one leaked. I was shocked. Maybe I got a dud, as I've used nearly all of the 96 batteries I bought (only have 2 left). One battery leaking out of nearly 100, that's about a 1% leak rate. Not sure if that's high, low, or average. For me though, that's too high. Although I might give them another shot if they go on sale for cheap, like $9.99.",
		  "Bought these batteries in preparation for hunting for flashlights, cameras, camp lights and I have to say that we are not impressed with the power of those batteries. Lamps and flash lights would not keep the light bright for long enough.\nThe peak of power is not enough for our needs.\nWe are disapointed. Will not buy again.",
		  "Took me a while to write this review as I wanted to fully go through a few batteries before I did.\n\nThese are great batteries at an amazing price. Hard to say if they last as long as the big name brands, but if they don't, the difference is barely noticeable. You can also tell they are built very well. These aren't cheap batteries that will leak out the acid of anything.\n\nI honestly dont see any reason to buy the big name brands anymore. AmazonBasics batteries from now on. For that price, and the length they last, you can't go wrong.",
		  "They work fine in all the battery-powered devices I own, except for one: my wireless game controller (and I've tried many of those AmazonBasics batteries with it, just in case). I find this is really weird, because not only any other brand of alkaline batteries I've tried work well in it, but even NiMH rechargeable batteries (which naturally yield a voltage lower than 1.5V) work well. Since my multimeter tells me they really yield an expected 1.5-1.6V output, the only hypothesis I have to explain the problem is that they might be unable to handle the amperage needed by my controller, which makes the \"Performance\" claim doubtful.",
		  "These are alkaline so don't think the will last very long, I use them for my xbox controller and need to change them once every 2-3 weeks after regular 5-8 hours a week use, although xbox controllers does need alot of juice... they are great with everyday electronic household item",
		  "I was rather impressed by these. I had expected them to be not as good for the lower price, and had planned on using them for my kids toys. I was pleasantly (or unpleasantly) surprised at how long they kept Elmo talking...\n\nAll I use around the house now is Amazon basics' batteries, because you can't tell any difference in quality from the big name brands, but these are much cheaper. They also came in cute little boxes that were neat and easy to store, which was much better than having various collections of half opened cardboard and plastic that the brand name comes in."
	   ],
	   "numberOfRates":21,
	   "avarageRate":2.788452497967451,
	   "id":33
	},
	{
	   "productTitle":"SoundPEATS True Wireless Bluetooth Earbuds in-Ear Stereo Bluetooth Headphones Wireless Earphones (Bluetooth 5.0, Built-in Mic, Stereo Calls, Total 15 Hours Playtime)",
	   "desc":"",
	   "category":7,
	   "images":[
		  "61tCk-XLh1L._SX679_.jpg",
		  "71dQi0I4-oL._SX679_.jpg",
		  "617QerRSMqL._SX679_.jpg",
		  "81vOkQZWEGL._SX679_.jpg",
		  "71cM6ItqnTL._SX679_.jpg",
		  "712Vw9zTR1L._SX679_.jpg",
		  "81NpnKoHiqL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"42.99",
	   "comments":[
		  "I had previously purchased another pair of earbuds that had lots of great reviews but the more I used the earbuds, the more disappointed I was. The sound quality was lacking, the build quality of the earbuds and charging case were under par and the bluetooth connectivity was spotty. It only took me two days before I decided to return them.\n\nWOW, I am so happy that I took a chance with these earbuds.\n\nI did a lot of research before buying these earbuds and on 'paper', I was super impressed. The only thing that was keeping me back from making the purchase was the lack of reviews. When I purchased these earbuds two weeks ago, there were only 3 reviews... but they were all 5/5. So I took a chance and decided to be one of the 'guinea pigs' to try these out.\n\nMy first impression was that the packaging quality was really good, it was even shrink wrapped. After opening the box and taking the product out, I noticed that it had so many parts that weren't even listed on the product page (you can see everything in the picture posted). For those wondering, the charge case is like all the other ones where it has a magnet suction to charge the earbuds. The charge case is sturdy and had a nice weight to it, most likely because of how big the battery is.\n\nThe earbuds paired really easy. I began listening to music and was blown away by the sound quality. If you read the description of this product... there is no information regarding the sound quality. This was my biggest fear purchasing these earbuds. I am happy to say that the sound is equal to and maybe even better than the apple airpods - which I have tried several times. Also, the noise cancelling on these earbuds is incredible. I was using these earbuds last night, which was Halloween and so fireworks were going off for several hours. When I was listening to music, I could not hear any of the fireworks. My wife came running in, waving her arms at me and then I pulled the earbuds out to hear the fireworks super loud, right outside our house.\n\nOverall I am super impressed and glad that I took a chance with these earbuds. The price is right and the sound is amazing.\n\nUpdate in November 2018:\nAs mentioned above, these earbuds are amazing. Sound clarity is perfect, basses are not the deepest but still enough. I have been using them for a week now and the charge case indicator light on the front still reads a full charge! I have a feeling I am going to get a lot of use out of these before needing to charge.\n\nUpdate 3 months after purchase (Feb. 4, 2019)\nWith moderate use, 2-3 times a week for a couple hours, the battery on the charge case is still going strong and indicates over half charge still (I have yet to charge it since my first charge on day 1). Thank you to everyone for you feedback, I am so happy that I was able to help you make an informed decision regarding your purchase! Can't say enough good things about these earbuds.",
		  "Bought these for my nephew for his birthday present. Already did not get off with a good start from amazon with the delay in shipping but once he tried these, he thought it was worth the wait. Sound was amazingly clear, with enough bass as well. All was great until we found out that it was missing some parts mentioned in the description. As you can see from the pictures, the one we received did not come with the wing-type ear tips and pouch. You might think those are not that important but false advertising should not be tolerated. Especially since the pouch could be very handy since the case is metal and would probably be very prone to scratches. Might return and repurchase and hope for a \"good set\". The review would have been 5/5 had it not been for the missing accessories.\n\n*Pic with Nivea lip balm shown for scale*\n\nUpdate: Was told by customer service that their \"new batch\" does not include the ear tips and pouch... even though it clearly states on the product description. This is very misleading. Changed to one star!",
		  "I have to say, when the Air Pods came out, I was the first one to criticize them. I found them too easy to lose, and being honest, kind of ugly.\n\nBut as more companies started doing true wireless earbuds, I became more and more curious about the concept, and finally, a couple of weeks ago, when I renounced to the headphone jack on my old phone, I decided to give these a try. I had already owned a couple of SoundPEATS products that gave me great results so I went ahead and bought them.\n\nAnd... I'm pretty impressed! First of all, SoundPEATS has turned up their packaging game a few notches. This looks like a premium product, sleek and minimalistic. So the first impression was already really good.\nAnd then you put them on, they automatically turn on when taking them out of the case, and you pair them in seconds... And that's it. You just forget you're wearing earbuds.\n\nThey're incredibly comfortable, at least on my ears. They're light but they stay on their spot even when working out.\n\nAnd the sound quality is pretty great, specially considering how small these are. Nice bass and treble, mids are a bit low for my taste but that's of course a personal thing.\n\nThe battery life is pretty great too. I wear them during most of my working hours and they usually last the whole day without needing to put them on the charging case, and regarding the case... I charged it when I got the earbuds and haven't done it again since. It's still going and will probably do so for a couple more weeks. Quite impressive.\n\nI had a couple of issues with the Bluetooth connection on the first few days, but SoundPEATS customer support recommended me to restore factory defaults on the earbuds and pair them again, and after doing that they've been great.\n\nOverall, they've replaced my 1MORE Triple Driver when going out, which is a lot to say since I loved those earbuds. The sound on these is obviously not quite as good (since they're also half the price and wireless) but it's close enough for it to be neglible when they're so comfortable to wear."
	   ],
	   "numberOfRates":75,
	   "avarageRate":4.574265805612326,
	   "id":34
	},
	{
	   "productTitle":"Fujifilm Instax Mini Film, Multi-Pack White (3 x 20pk, 60 shots total)",
	   "desc":"Compatible with all Fujifilm Instax Mini Cameras, Polaroid Mio, 300 & Lomo Diana instant Back+.The Instax Instant film creates small photos (2.13-Inch x 3.4-Inch) that are a blast to capture and treasure forever. Never miss a picture perfect moment again with the Fujifilm Instax mini instant film.",
	   "category":5,
	   "images":[
		  "819R9Ja%2B-OL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"56.99",
	   "priceIs":"52.34",
	   "comments":[
		  "The twin-pack (20 shots total) is a good value at $1.10/print. For much better value, consider ordering the multi-pack (60 shots total). This reduces the cost per print to just $0.95/print.\n\nFujifilm Instax Mini Film, Multi-Pack White (3 x 2pk, 60 shots total)\n\nFujifilm Instax Mini Film, Twin Pack (20 Exposures)",
		  "Usually no complaints with the film, although one of the film packs must have been slightly damaged as after taking a photo, nothing came out. I tried to take a photo 3 more times and ruined a couple more pieces of film in the process but finally got it working again.\nThe other pack was fine. The film is pricey but can't really find better deals anywhere else.",
		  "This product is for the Fujifilm Mini polaroid camera. The film is very easy to instal and the package gives you step by step instructions. These polaroid pictures are a perfect way to remember events with friends or family! You don't have to the best photographer to capture a great picture. I find purchasing from this vendor is cheaper than purchasing this film from box stores - saving you money while still getting the same great product. The more film you buy at one time the bigger the discount.",
		  "On the picture you see that i opened the 1st box to try it out, and it was great. Quality is the same. Nothing changed. Great item for the price. You'll definitely save more money buying 100 pcs film in one payment than buying single 20 pcs one at a time each week or month. I recommend buying this bundle. Btw I'm using this on my Instax mini 8",
		  "Its nice. More of a novelty than anything. The colours look only okay but still leaves a lot to be desired (the colours feel muted to me when compared with some other films I've used in the past). But then again these are for the colourful fujifilm polaroid cameras which are novelties in it of themselves. Definitely fun and great for producing simple instant photos to give to people. But this is definitely not an effective way of actually recording memories or being anything more than a novelty toy. I guess you can stretch it and say that this thing produces a unique aesthetic but I dont buy it. Whatever unique aesthetic it can be charged of having, it is ultimately hindered by it's size and muted colours. Regardless fun little thing at a great price. Buying more is obviously cheaper than buying less.",
		  "Convenient package but they have to be kept with silicagel and used before expiration date. I left a package in my camera for a few months and the pictures developed only in part",
		  "Picked up a 100-pack of these things on a subscription as this was the best value I could find anywhere, Amazon or elsewhere. Still, worked out to about 90 cents per shot (taxes in) and when the film is for a photo-happy six-year old girl, well, we go through these things pretty quickly, so it adds up fast. So, value for money is pretty questionable, but you're not going to find a better price anywhere else, at least from what I could find in my search for this particular film. As for the product, it does what it's designed to do, no issues with quality or performance.\n\n* Helpful votes always appreciated *",
		  "I wish this film wasn't so expensive because I would take more pictures if it were cheaper. I would not buy the camera for a child even though the Instax Mini 8 is recommended for youngsters. It would be way too costly. It takes a couple of minutes for the pictures to develop but it is fun watching the images appear and it is instantly gratifying to have images of special events. I like the space provided on the surface for comments or dates."
	   ],
	   "numberOfRates":102,
	   "avarageRate":5.080870624492577,
	   "id":35
	},
	{
	   "productTitle":"JETech Screen Protector for Apple iPhone 8 and iPhone 7, 4.7-Inch, Tempered Glass Film, 2-Pack",
	   "desc":"",
	   "category":7,
	   "images":[
		  "71yvSomwuNL._SY355_.jpg",
		  "61D%2B5UtrheL._SY355_.jpg",
		  "81MhkC0TMKL._SY355_.jpg",
		  "71xgKOpQDLL._SY355_.jpg",
		  "61ApgvGgQNL._SY355_.jpg",
		  "819midLjXwL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"14.99",
	   "priceIs":"10.99",
	   "comments":[
		  "Picked this product up for a newly acquired iPhone 8. Good value ($10.99 at time of purchase) for a pack of two screen protectors. This is good for a couple of possible reasons. First, should you screw up your first attempt at application you’ve got the backup. Second, assuming you successfully applied the protector on your first attempt, you retain an extra in the event you damage the first one after, for example, dropping your phone.\n\nIn addition to the glass protectors, the package also includes a felt cleaning cloth and guide stickers to assist with application (two of each). Missing is an alcohol wipe which I’ve received with previous protectors for other iPads/iPhones I’ve owned, but it’s not a deal killer for me.\n\nApplication is exceedingly simple. Dust is your enemy here. I had kept the original plastic film covering the iPhone that it came packed with until this arrived in the mail. Even still I highly encourage use of the dust removal sticker as it’s your best defence against dust bubbles forming. Another suggestion is to do the application in your bathroom with a hot shower running. The steam suppresses the dust in the room.\n\nApplication is fairly straight forward. Clean the screen as best you can with the cloth and make judicious use of the dust sticker after a thorough clean. IMMEDIATELY after use of the dust sticker use the guide stickers to apply the protector as flat as possible positioning the camera and home button holes as best as you can. Lay flat to the screen and press firmly in the middle of the screen to begin the sealing process. The glass should then, from the centre out, fully adhere to the screen without any further action from you. The process should take only about five to ten seconds. Done properly there should be no bubbles to push out.\n\nThere is no degradation of touch control with the glass fully applied. It’s like there’s no cover at all.\n\nI’m quite satisfied with this product and glad to have the spare protector in the event I need to replace a damaged cover. Good value, quality and ease of application. Highly recommend.\n\nMy opinions are my own and my reviews are on products purchased with my own money. If you found this review helpful please hit the button below.",
		  "Recently bought an iphone 8 and was in the market for a reasonable priced screen protector but didn't want to spend too much money on one and found this as a result. The price was reasonable as it comes with 2 screen protectors and the item arrived very quickly. First glance, it liked the packaging, with is like a book as it opens and surrounds it is a foam cushion. The item come with 2 screen protectors and 2 bags of items (glide tabs, cleaning cloth, and dust sticker) also a Lifetime Warranty Card and instructions which is great.\nJust a tip, ensure you are in a LOW DUST environment when applying it. Even with the dust sticker that is provided, dust still managed to get underneath some how. I had to re-position it 4-5 times before \"almost\" getting it right. If your someone that is OCD and doesn't like the air bubbles or dust bubbles. Take it to a professional phone store or your phone carrier as most will do it for free if you do not have the patience or steady hand. It can be re-positioned a few times but could eventually damage the screen protected so don't keep removing it and reinstalling. The dust sticker is KEY, because if not there with bubbles all over the screen and also take your time do not rush. I tired using a credit card to ensure all the air bubbles are out or something slim if you have. Me personally, i was rushing as i was going to be late for work when this arrived at my door and just wanted to get it on. In the end, it did have 2 dust bubbles in the middle and close to the end of the screen also was slightly off to one side. Unfortunate but what can you do, i am impatient!\nOverall, visually. This doesn't cover the whole entire screen. It does leave a 4-5 mm gap. I understand the manufacture says it is due to a case that you can put on because of the bezels but even with a phone case and a slight bezel on the phone case it still has a large gap from the case to the screen protector. I think this was more made for a iphone 7 and not an 8 because the 8's have more of a curved display and rounded edges. Regrading the touch and touch ID, everything is still responsive and works respectively. Doesn't interfere with it from what i can see or feel but may in your application. I cannot comment if the screen protector works as in protection as i have not dropped it yet and hope it remains that way but just in case it's also nice to know that it's there and have another one as a backup PLUS the lifetime warranty on the product. I would recommend this product but could do with a little easier of a installation.\n\nUpdate:\nAfter having this on my phone for over 3 months i can say it is working out good. The response is great and sometimes it doesn’t feel like there is even a screen protecter on it. One thing that is annoying is that it doesn’t cover the entire front glass of the phone. There is a 2-4mm gap which annoys me and also aside from that I recently dropped my phone right on the corner where the screen protector is and completely cracked the protector which i didn’t expect. I didn’t even land flat on the face of the phone just the corner and there is a case on it. I am not on my second one in the package. I am very glad that i had it on my phone or it would have cracked the screen. It is up to you, $150 for a new screen or $15 for a screen protector. All i wish it would have lasted longer than it did but i guess that is my fault.",
		  "Not impressed - the edges of the glass didn't conform to the slight curve of my iPhone 8, so there's a visible margin around the screen protector, which I imagine will fill up with dirt and dust over time.",
		  "I have ordered JETech products several time in the past and have always been very satisfied with their quality and fit. This is the first time that I’ve had to deal with their customer service and I have to say that I continue to be very impressed. One of the two protectors that I received had a small glue in the backing that caused a bubble to appear after application. After contacting customer service they promptly sent me a replacement with no hassle at all. They definitely stand by their products and I’ll be happy to order from them again in the future.",
		  "i Keep a pocket knife on me. At a party someone offered to take my coat and throw it on the bed. They missed, the knife opened ever so slightly and got the very edge of this screen protector. It was punctured and cracked. I wasn’t able to get home to the second protector until the next day, and then I legit just kept forgetting to change it. For like a week. By then I had placed my phone in my bag, and let keys, change, all the random crap I’ve got in my bag bash around in it. I’m sure from the knife the protector had weakened a bit, but it was fine for a while. And then I happened to knock it off a counter while cleaning. Did one of those things where you try to catch it but actually just end up smacking it around mid air and making it worse. Loud smack on the tile kitchen floor. The lower half of the protector friggin shattered (but stuck together) And I thought my phone was done for. Went to see the damage, wonder if it’s even worth trying to find the second one.\nTake the thing off my phone, not even a scratch. Anywhere. Excellent."
	   ],
	   "numberOfRates":22,
	   "avarageRate":3.1409397900095577,
	   "id":36
	},
	{
	   "productTitle":"Anker Powerline 6ft Lightning Cable, MFi Certified for iPhone X / 8/8 Plus / 7/7 Plus / 6/6 Plus / 5 / 5S (White)",
	   "desc":"",
	   "category":6,
	   "images":[
		  "51FBcG3tsML._SX679_.jpg",
		  "61w1pVVDdHL._SX679_.jpg",
		  "51Se3RrHqJL._SX679_.jpg",
		  "61ZZEpfiVHL._SX679_.jpg",
		  "6126lv3YX3L._SX679_.jpg",
		  "51shAhJXjxL._SX679_.jpg",
		  "61Zc75ZhtML._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"13.99",
	   "comments":[
		  "I've bought 3 Anker Cables, A red one almost a year ago and because that one was good I bought two more, but this time purchased the white chords. The two white cords I bought in January have not proven to be very good. They have all been used the same, without a lot of travel or rough use. Yet for some reason the red one bought in May 2016 has lasted and the other two have stopped working. Up until this, last purchase I have recommended how great all of my anker products were.\n\nUPDATE - was contacted by AnkerDirect Customer Service Team. They offered apologies, were super kind, offering unsolicited assistance to replace the chords that stopped working, & they informed me of the warranty(that I was unaware of).",
		  "I have a million Anker products as they are always quality made. This was the only one that actually didn't perform as expected. I got a 6 foot cable to hook up next to my bed so that I can still use my phone while charging, so I've obviously used it very lightly being hooked up next to my bed. I didn't constantly travel with or anything. It stopped working last month and I'm not sure why. Not overly impressed due to it ceasing to work after very light use.\n\nUPDATE: I received a new cable by Anker which arrived in 3 days on a weekend. I havent had the time to put too much time in with the new cable but it works and I'm sure the one that was faulty was just a one off. But what really impressed me was their customer service, its really nice knowing that after I've spent a lot of money on various anker products over the years that they care about their customers as well, and my faith in their products has certainly not been lost. Good job guys, please don't change and I will continue to support you",
		  "I'm changing my original review. At first I was happy with the 2 cables I have purchased, but after 3 months, both cables have come apart at the lighting connect side. The ground shielding is exposed, and the both cables will no longer charge my phone.\n\nThe cables were never subjected to any extraordinary stress. (One was kept on my desk.) The product is not as durable as the description suggests.\n\nYet another iPhone charging cable that does not survive normal use. The manufacturer should do more to secure the connector shielding with the wire shielding.",
		  "I purchased two of these charging cables months apart, both are used everyday to charge my iPhone and my children's iPads. I like the thickness of these Anker cables, the USB end has more to hold on to, and the six foot length is good for when I'm laying in bed and using a device while its charging. I'm not sure which of the two, whether it was the first or second purchase, came apart at the lightning end of the cable. The insulation was even popping out, seen when I bend the cable back. It appears this issue has affected other customers as well, not to thrilled when I learned of this. I contacted Anker and inquired on the warranty, was informed that there is an eighteen month warranty on this product. I provided some relevant information and then promptly a new cable was sent to me. I am satisfied with the customer service at Anker, from when they quickly answered my email to when they sent a new cable, however one would now question it's build quality. I'd still buy another one these because the price is good, on sale a white cable can be $10. It probably isn't the most durable lighting cable in the world. As far as how much quicker it can charge a device, I can't comment as it's not relevant for my uses of this cable. Thanks.",
		  "I really liked this cord. The material seemed thick and the cord was long, which was super useful when you need to use your phone but it needs to be charged and the plug is far away. However, I bought this in June 2017 and after about one year of usage, in Sept 2018 this cord stopped working. Contrarily, with the Apple original cords, although they are much shorter I've never had one die on me yet! I was expecting a much better quality cord with a much longer life expectancy out of this.",
		  "UPDATE: Anker contacted me directly and asked if they could send me a new cord. I received the new cord after a few days waiting and it is working fine, so far so good. Not sure if it will stop working again after a few weeks, but I will contact anker directly if it does. They said it was a defect and it is not normal for the cord to just stop working like it did.\n\n10/10 customer service, Anker is amazing.\n\nStopped working after a few weeks.\n\nNo issues other than the fact that it stopped working after a few weeks. iPad Pro now says that it's an uncertified product and is 'not charging' in the corner of the iPad.\n\nNo longer properly charges the iPad mini either.\n\nWasted 25 dollars for the cord plus express shipping.\n\nMight as well have just bought a real apple cord if I knew this was going to happen.",
		  "The cord seems very durable; it is covered in thick plastic. Words instantly with my iPhone 6. My quarry is with Amazon. I have a Prime account and love to use this service however this is ridiculous. I ordered the 10ft cord but to my surprise, the cord I received is only (highlighted in blue), the new page states that it is a 6ft cord. I DO NOT appreciate Amazon switching the cords without notifying me of this change. I specifically ordered a long cord since I do lots of travelling and hotel plugs are sometimes scarce. I leave for a trip tomorrow and only left with the option of keeping this cord. Very disappointed with this bait and switch.",
		  "Ce chargeur est de qualité très médiocre. Le premier soir que je reçois le fil, je le mets dans mon iPhone et rien fonctionne. Je le sors et je m’aperçois qu’il y a des pines noircis sur le fil.\n\nJ’ai été au Apple store et l’agent m’a dit qu’il ne connaissait pas cette certification.\n\nEn gros, acheter Apple pour de la qualité."
	   ],
	   "numberOfRates":166,
	   "avarageRate":3.757149845811116,
	   "id":37
	},
	{
	   "productTitle":"NETGEAR N300 WiFi Range Extender - Essentials Edition (EX2700)",
	   "desc":"",
	   "category":5,
	   "images":[
		  "51Bq5gmIOiL._SY879_.jpg",
		  "61XWpgAfraL._SX569_.jpg",
		  "61z3FJA26uL._SX569_.jpg",
		  "61ZtSZLBPUL._SX569_.jpg",
		  "81cdIg%2Bam%2BL._SX569_.jpg",
		  "71YB7-WEveL._SY741_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"38.88",
	   "priceIs":"29.88",
	   "comments":[
		  "This was my 2nd Wi-Fi extender that I bought. 1st from Netgear.\nIt worked GREAT for the first 5 months.\nI have mine plugged in the garage. The range is great.\nThe past few weeks.. It just started to cut out. Every 20 mins it will just go dead. I have to unplug and plug it back in.\n\nThis happened to the 1st one I bought from another company. The little boxes run pretty HOT. 🔥 A little too hot for my liking.\n\nI need to buy a new one. But I am going to unplug it at night when I'm not using it. Maybe extend the lifetime.\n\nThese things .. No matter what company seem to last a year.. And then start messing up",
		  "I have this plugged in about 200ft from the router. It extends the signal easily another 150ft. This is in an office with concrete block walls.",
		  "I couldn't find a range extender that would work with the Bell network due to the routers they used (does not have the WPA button to press on them to connect). I gave this one a shot for someone else said it worked for Bell. Well, it does!! All I had to do was plug it in near the router, wait for it to turn green, and then I moved it to the new location where it removed the near to dead zone (full bars now). My office is now a Wi-Fi zone, meaning I can use my wireless printer again without having to plug into it! So excited, and so worth the money. Mine does not make any noise like some other posts, so perhaps they fixed the noise glitch or maybe theirs had a defect.",
		  "Has worked extremely well for 2-3 months now. I haven't had any outages longer than a half hour or so and only have had one of those that I've ever noticed. As our family is a heavy user of wifi, we'd know if there were major issues.\n\nThe setup was very easy and my least favorite part of the whole device is that it adds _EXT at the end of my wifi network name. The range is much better than my router and has been effective in covering my house.",
		  "I hope I'm not being unfair given the many excellent reviews of this product, but mine has made no difference whatsoever. Interestingly, the computer indicator shows excellent connection, but the actual speed is probably slower than before I installed it. I really did want to like this product, but have to return, alas.\n\nI should add that mine is a communal office WiFi and not a home one.",
		  "This little box was such a necessity in our house! It was super easy to set up and use. Plug it into an outlet about half way between your wifi and where it will extend to. Log onto the extender with a wireless device and it takes you to a sign up page, to edit passwords and such. Initially you have to enter your existing password to your wifi and set up some secret questions, then you are connected! Each device connecting to it will have to enter the new password. You can change the name and password of your new connection through the extender if you want or keep it the same password as your wifi. Two minutes to set up online and BINGO that's it! Super fast with our wifi speed of 60mbps. We are loving it and well worth the money!",
		  "Good for if you plan on hooking up a printer across your yard in your shed for some reason but probably nothing else. I set this up beside my router and it will not pass 20MB/s. On the website control panel it states it has a signal of 144MB/s (keep in mind it is plugged in within a foot of the high-speed router) and will go up to 145MB/s but regularly sits around 10MB/s download. Testing my main network in the exact same position shows me at 250+MB/s. Pretty huge difference.",
		  "Extremely easy to set up - pretty much plug it in and go. Our router is on the 3rd level of a townhouse and we installed this in the basement and it works perfectly. I would absolutely purchase this again and would recommend it to anyone who just needs a little signal boost."
	   ],
	   "numberOfRates":140,
	   "avarageRate":5.521397205827464,
	   "id":38
	},
	{
	   "productTitle":"Samsung 860 EVO 2.5\" SATA III 1TB Internal SSD (MZ-76E1T0B/AM) [Canada Version]",
	   "desc":"The Samsung 860 EVO is specially designed to enhance performance of mainstream PCs and laptops. With the latest V-NAND technology, this fast and reliable SSD comes in a wide range of compatible form factors and capacities.Up to 8x higher TBW (Terabytes Written)* than the 850 EVO. Feel secure storing and rendering large sized 4K videos and 3D data used by the latest applications.",
	   "category":6,
	   "images":[
		  "91JA5-hAnoL._SX569_.jpg",
		  "91uXmOzjQNL._SX569_.jpg",
		  "81%2B99hHIJHL._SX569_.jpg",
		  "81fJOD3u34L._SX569_.jpg",
		  "8107%2BoAFSmL._SX569_.jpg",
		  "610oxS4oHwL._SX569_.jpg",
		  "81hx8uSm9LL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"219.99",
	   "priceIs":"199.98",
	   "comments":[
		  "I started purchasing SSD's a few years ago and haven't looked back since. When I bought my Dell laptop a couple of years ago, since for some reason, laptop manufacturers overcharge for SSD's, I bought it with a standard hard drive then replaced it with a Samsung SSD. Now I only use standard hard drives for backups and large data storage. My desktop also has a SSD for the boot drive.\n\n*** Update ***\n\nI just had my first Samsung SSD failure and the Samsung warranty support is abysmal. Although it has a critical SMART error and was only 8 months old, they refused to replace it. I will never purchase another Samsung again.",
		  "Excellent, as with any Samsung SSD, quality of all around performance is hard to match (especially for the price).\nPerformance is about the same as the 850evo, however the life time write endurance is up in a huge way, now up to 300TB up from the 850s 150TB which is 16X more durability.\nThis means that the 860evo will allow 168.78GB/day of writes every day for 5 years, compared to 850s 84.39GB/day (1TB = 1024GB).\nFantastic for small studios & small business video editors.\nStill same great value for gaming & all around quick storage.",
		  "I installed the Samsung 860 EVO ssd and found that the system locks up for a few minutes every so often. According to the Samsung utility 'Magician' there was a compatibility error. After many attempts trying to fix this, I ended up returning the drive.\nFrom my Googling, it would appear that Samsung knows about the problem, but isn't interested in fixing it.\n\nMAKE SURE your system is compatible with this device before purchase.",
		  "So far, so good. I replaced the stock drive in a mid-2012 MacBook Pro (non-Retina), and the difference has been unbelievable. What took a minute to start (InDesign, Photoshop) before, now takes seconds. Best tech investment ever. Also--not very difficult to do yourself. Just make sure you have the right screwdrivers.",
		  "Je voulais remplacer mon disque SSD Kingston Hypex Savage de 960 Goctets. Le Kingston fonctionne parfaitement, monté sur un MacBook Pro mi 2012. Aucun problème de montage avec Carbon Copy Cloner.\nAvec le Samsung 860 EVO. I M P O S S I B L E de monter ce SSD avec Mojave. Attention, attendez-vous à un cauchemar de montage où il y a plein de messages d'erreurs. Ce disque Samsung 860 EVO est compatible avec El Capitan mais pas High Sierra et plus récent. Système AFPS de Apple problématique avec Mojave. Pourtant le Kingston monté en Sierra fonctionne toujours avec Mojave mais pas le Kingston.\n\nI wanted to replace my 960 Gbyte Kingston Hypex Savage SSD. The Kingston works perfectly, mounted on a MacBook Pro mid 2012. No mounting problem with Carbon Copy Cloner.\nWith the Samsung 860 EVO. I M P O S S I B L E to mount this SSD with Mojave. Be careful, expect a nightmare of editing where there are plenty of error messages. This Samsung 860 EVO is compatible with El Capitan but not High Sierra and newer. Apple AFPS problematic with Mojave. Yet the Sierra-mounted Kingston still works with Mojave but not Kingston.",
		  "Amazing, all I can say.\nI have an 8 years old MacBook Pro, I was almost throwing in the trash, so ridiculous slow it got when a friend of mine just suggest to get this baby. I did and I'm glad I did, I now can work even with photo editing, which I do, I use with my Capture One Pro, and it works flawlessly.",
		  "My old laptop (heck, not even that old, maybe 2-3 years) has been dying ever since updating to win 10, stuck at 100% disk. I was looking up solutions online and switching the hdd to an ssd was an option. I know nothing about the intricacies of computers, but this was incredibly easy to setup! You will need a sata cable to plug in to your laptop to do a backup, but it's great because then you can use the old hdd as storage space. Also, samsung has the programs ready to do this, just need to download them.\nIt was a little slimmer than my hdd, but it sits well in the cage inside the laptop and so it was an easy swap. Needless to say, it works great, my disk finally came down, and my computer fan isn't whirrrrrrring all the time now. And my startup times went from minutes to seconds! Awesome!",
		  "I have a 500GB 860 Evo that I previously bought elsewhere. After the prices of SSD's went down, I decided it was time to go with an all SSD system. Buying this 1TB 860 Evo was the greatest choice I could have made.\n\nSamsung's hardware is top notch and my games not only run faster, but I no longer have to worry about whether or not the game is on an SSD or a HDD! There's absolutely no excuse to have an all SSD system in this day and age anymore since the prices are extremely flexible!\n\nOne thing I will mention though as I did make a mistake (this was a mistake on my part, not the manufacturers part) is to make sure you purchase a SSD to HDD bracket to mount it if you don't have any more space to mount SSD's!"
	   ],
	   "numberOfRates":195,
	   "avarageRate":5.993281048139803,
	   "id":39
	},
	{
	   "productTitle":"Amazon.ca $100 Gift Card in a Premium Greeting Card by Carlton Cards - Amazing Moms",
	   "desc":"",
	   "category":8,
	   "images":[
		  "61udR%2BA%2B5nL._SX679_.jpg",
		  "61LRN8VU3qL._SY741_.jpg",
		  "614N1iyfHZL._SX679_.jpg",
		  "51t3hVay-8L._SX679_.jpg",
		  "51lbt7Y90BL._SX679_.jpg",
		  "41MtTjkFFPL._SX679_.jpg",
		  "51s5ZP3PhdL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"100.00",
	   "comments":[
		  "My mom got it on time which is great, but it was blank and she didn't even have a clue who sent it, while the fact that I wrote a message for mothers day with my name on it. This gift card I purchased said they will print the free messages. I wondered why was it blank?\nI just knew about it when I gave my mom a call today.\nHope to hear from you guys.\nThanks,\nRosanna"
	   ],
	   "numberOfRates":136,
	   "avarageRate":4.5981904481778155,
	   "id":40
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a White Gift Box (Classic White Card Design)",
	   "desc":"",
	   "category":10,
	   "images":[
		  "41uWie6tclL.jpg",
		  "71S1RLr8AIL._SX679_.jpg",
		  "71dsGuclk6L._SX522_.jpg",
		  "81ewNxr8%2BiL._SX679_.jpg",
		  "31h3Y-jfkEL.jpg",
		  "71gUoW2rQ5L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"500.00",
	   "comments":[
		  "Right, so this is a gift card. I'm mainly writing a review so that I can make it disappear off my list of items to review.... I gave it four stars because the box was very nice. Other than that, I really can't think of anything to say about a gift card. The amount was right.",
		  "Beautiful gift to give to friends and family",
		  "Très très jolie boîte!",
		  "Perfect gift ! Cute little box, perfect condition.",
		  "I like this box than the black amazon box! great as a gift",
		  "Works as a great gift and came in a nice little gift box",
		  "Well Ok. What can you say in a review of a gift card? Seriously. The box was nice?",
		  "Didn't say limit of one in the promo, bought two and had to fight for the promo on the second one."
	   ],
	   "numberOfRates":171,
	   "avarageRate":2.478579365955242,
	   "id":41
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a Birthday Cupcake Tin (Birthday Cupcake Card Design)",
	   "desc":"",
	   "category":10,
	   "images":[
		  "41rwuwyp6bL.jpg",
		  "81vFCpeJCVL._SX679_.jpg",
		  "81gol29qmCL._SX679_.jpg",
		  "81Bq2L2uhEL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"50.00",
	   "comments":[
		  "it is cute tin box,I love it, I think it would be nice birthday gift when I am not sure what I buy for.\nBut the box can't be reusable cause there is a small hole covered by the plastic.",
		  "I wish they would have this cupcake gift card & tin in the $25 option!!!!!!!!!!!!! Super Quick Delivery!!\nPretty and fun Gift Card Tin, so the 2 people I've given it to LOVE IT!!!\nI also put self-adhesive magnet on it and viola-pretty magnet when done being GiftCardTin!!",
		  "It's basically a gift card that comes with a free tin. What is there not to love? It's super cute. I'm not sure if you would want to reuse the tin though because it does say amazon written in small print on the back.",
		  "Personally, I would think that an Amazon gift card is the best gift of all. But you always feel a little bad about not getting someone an actual gift, as if buying a gift card is the easy way out. Well, that's not a problem with this adorable gift card and tin combo! It's so cute that you'll still seem super thoughtful, and it will be very well received indeed. Happy gifting!",
		  "Probably one of the easiest gifts to get for the online shopper. Comes in a nice metal case, which is a nice touch and got it in 2 days with my prime membership. Saves me from having to go into a mall and shop! Highly recommend.",
		  "Doesn’t everyone like a gift certificate mostly when they use Amazon themselves. My grandson thought it was really cool",
		  "Super cute card holder. Arrived the next day. Very pleased with purchase and will definitely buy again for other birthdays/ occasions!",
		  "This is perfect! Once the card is given, the person can reuse the tin of any occasion. Its free, so that's neet!"
	   ],
	   "numberOfRates":168,
	   "avarageRate":0.4924309342524906,
	   "id":42
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a Hello Baby Reveal (Classic White Card Design)",
	   "desc":"",
	   "category":8,
	   "images":[
		  "81%2BHNrkgb5L._SX569_.jpg",
		  "81Li7hV7GXL._SX679_.jpg",
		  "71GnfubgtQL._SX679_.jpg",
		  "61uCF-8ImCL._SX679_.jpg",
		  "81P%2BBk3llnL._SX679_.jpg",
		  "31pHdZQ-bpL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"25.00",
	   "comments":[
		  "It came in a pretty card. Other than than it is a gift card. As long as it works it is fine",
		  "Cute card sleeve, with a bow and allows new parents to purchased what they want for the baby, when they want it and it is delivered to their home conveniently",
		  "Bought this as a gift. Easy way to gift!",
		  "Always good to have one to use as gift when you don't know what to give as a present.",
		  "Great baby shower gift! Lots to choose from that new parents need.",
		  "Cute card, my husband's colleague loves it",
		  "What you see is what you get. Quick shipping, as expected.",
		  "Great gift."
	   ],
	   "numberOfRates":187,
	   "avarageRate":1.633176542219394,
	   "id":43
	},
	{
	   "productTitle":"Amazon.ca Gift Cards, Pack of 3 (Various Card Designs)",
	   "desc":"",
	   "category":9,
	   "images":[
		  "81mdAtwvOhL._SX679_.jpg",
		  "71tDwSJyMNL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"30.00",
	   "comments":[
		  "Amazon, the everything store. By giving this gift card you are essentially giving the person the freedom to purchase ANYTHING. Unlike a specific gift card for a clothing store or a the likes of, this card gives the person who receives it the ability to purchase essentially WHATEVER THEY WANT. Anything from pet toys to sex toys the freedom is there to get it all!. I highly recommend giving these cards to anyone. Quite possibly the most thoughtful gift on the planet!",
		  "Excellent gift idea - for anyone's budget.\nAmazon is about the only company that excepts gift cards online to make a purchase, so take advantage of it.\nAll other stores make you use it in the store, not online.\nIf the kids do not have a credit card these will be perfect",
		  "Hard to keep track of the lives of my dozen nieces and nephews. These were a welcome solution",
		  "I looked for some other interesting gift card design in the $10 increments, but was stuck giving snow globe design gift cards in the spring. I would have liked to see spring design options for the $10 gift cards. I was shocked to find nicely designed all-season options completely lacking. Consider that design reflects the giver's aesthetic and their intent to give the recipient a gift of suitably pleasing appearance. I love the Starbucks' gift card designs. They're gifts in themselves.",
		  "Product as expected bonus $10 amazon credit!",
		  "I got the prime day $5 credit with a three pack.\nEasy to use and once you load the credit on amazon you can use it anytime without the card.\nGreat git as Amazon has almost everything!",
		  "As described. Works perfectly. Love you that you can just load them onto your account right away instead of having to wait until you order something.",
		  "Amazon gift cards are always a great gift. I really like that they have them in denominations of $10, they are great for stocking stuffers or to give as little tokens of appreciation."
	   ],
	   "numberOfRates":86,
	   "avarageRate":1.1591660459897941,
	   "id":44
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a Mini Envelope",
	   "desc":"",
	   "category":10,
	   "images":[
		  "91ElQ8bR0JL._SX679_.jpg",
		  "A1jtYd5ttYL._SY679_.jpg",
		  "A1QKbKYz-pL._SX679_.jpg",
		  "71zXjf32XhL._SX679_.jpg",
		  "A1BTaLu8A-L._SY679_.jpg",
		  "917Bk-vROFL._SY679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"10.00",
	   "comments":[
		  "Hard to keep track of the lives of my dozen nieces and nephews. These were a welcome solution",
		  "Excellent.",
		  "As advertised.",
		  "A gift to be included in a parcel..I was afraid I would not receive it on time, but no problem.",
		  "very handy item to give",
		  "Cadeau",
		  "Perfect, super cute packaging too!",
		  "its a gift card"
	   ],
	   "numberOfRates":16,
	   "avarageRate":4.3762683562164515,
	   "id":45
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a XOXO Box",
	   "desc":"",
	   "category":8,
	   "images":[
		  "81%2Bc0Mxm8OL._SX679_.jpg",
		  "91lXYBZgRtL._SX679_.jpg",
		  "91HCCViQmlL._SX679_.jpg",
		  "81hS405qNeL._SX569_.jpg",
		  "81vytz1YD0L._SX679_.jpg",
		  "818dAPVbNnL._SX679_.jpg",
		  "41-Kxy2ItLL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"100.00",
	   "comments":[
		  "Great little gift box for an amazon gift-card.",
		  "I am very happy with the product and fast service.",
		  "Parfait et arrivée en 2 jours",
		  "It works! Packaging good!",
		  "I love buying this <3"
	   ],
	   "numberOfRates":133,
	   "avarageRate":0.5808632367247646,
	   "id":46
	},
	{
	   "productTitle":"Amazon.ca Card in a Birthday Reveal",
	   "desc":"",
	   "category":8,
	   "images":[
		  "71L%2Bux9IRML._SY679_.jpg",
		  "81U5mEQkJCL._SX679_.jpg",
		  "31uQvyJaKsL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"50.00",
	   "comments":[
		  "You get what you pay for and I was happy that each twenty five dollar card had twenty five dollars on it",
		  "really nice. It was a birthday gift for my son, and he liked the way the card popped up. Obviously, he liked it more when he saw the amount on it. The card arrived well wrapped and within a couple of days of ordering it.",
		  "This is a super gift idea. The recipient picks what they want, the style they like, the colour they like, the size they need, etc. They are not disappointed.",
		  "As a gift card, there is not much to say except that my legal assistant was grateful and plans to use it for sewing supplies so she was glad it was from some place that carries them.",
		  "Amazon 'Birthday' gift card, bought as a Birthday gift and very happily received by the recipient who wasted no time in using it.",
		  "Amazon carries such a big variety of products to suit evrybody's taste .... makes a gift card a no brainer.",
		  "Love the packaging, I didn’t have to buy a card holder...\nAmazon is awesome to provide it...thanks!",
		  "Love the Amazon gift cards. Seems all my family shop at Amazon. They get them for Xmas and birthdays."
	   ],
	   "numberOfRates":169,
	   "avarageRate":0.6782186516756039,
	   "id":47
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a Hello Baby Reveal (Classic White Card Design)",
	   "desc":"",
	   "category":8,
	   "images":[
		  "81%2BHNrkgb5L._SX569_.jpg",
		  "81Li7hV7GXL._SX679_.jpg",
		  "71GnfubgtQL._SX679_.jpg",
		  "61uCF-8ImCL._SX679_.jpg",
		  "81P%2BBk3llnL._SX679_.jpg",
		  "31pHdZQ-bpL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"25.00",
	   "comments":[
		  "It came in a pretty card. Other than than it is a gift card. As long as it works it is fine",
		  "Cute card sleeve, with a bow and allows new parents to purchased what they want for the baby, when they want it and it is delivered to their home conveniently",
		  "Bought this as a gift. Easy way to gift!",
		  "Always good to have one to use as gift when you don't know what to give as a present.",
		  "Great baby shower gift! Lots to choose from that new parents need.",
		  "Cute card, my husband's colleague loves it",
		  "What you see is what you get. Quick shipping, as expected.",
		  "Great gift."
	   ],
	   "numberOfRates":195,
	   "avarageRate":3.086593992538125,
	   "id":48
	},
	{
	   "productTitle":"$100CAD/ CANADIAN Apple iTunes Gift Card Certificate, Worldwide Delivery - iTune CANADA, not US.",
	   "desc":"",
	   "category":9,
	   "images":[
		  "51ATUVzmnQL.jpg",
		  "61qg6NsBEGL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"109.99",
	   "comments":[
		  "***Update - Oct 23/18. Five days later and company has not responded. Calling Amazon today to report fraud!\n\nI was sent a $100 iTunes gift card ( 4 x $25) that was intentionally redeemed then returned to the package.\nWhoever redeemed the gift cards, glued them together like they were originally, in the package.\nThen they put them in the package and glued them to the back of wall of the cardboard/plastic bubble\nFinally the whole package was then glued up to look brand new.\n\nYou could not tell until you tried to open them.\n\nIn the second picture you can see how much glue was used as the back of the package came off with the gift cards\n\nIn the third picture, I am trying to pry the cards apart and the glue is quite strong. If you look at the top card, you can see the start of the redeem code for the gift card. the grey \"tape\" that Apple uses to mask this code has been peeled away.\n\ni tried to redeem the cards, just in case, and iTunes confirmed they were previously redeemed.\n\nSucks as i ordered these for my young boys. Disappointed and feeling scammed!!!!!\n\nP.S. One star because Amazon does not allow for 0 stars!!!",
		  "this is a scam!!!! All cards had been redeemed DO NOT BUY!!!!",
		  "These gift cards can be purchased for the face value through any retail store with no extra fee or shipping charges. Will not purchase gift cards by this method again. I learned my lesson and should have researched prior to purchasing by this method. Very disappointed.",
		  "What could be better? An excellent product, excellent price, super fast delivery.",
		  "I received only 1 card of 25$....!!!!!",
		  "Flawless product and fast delivery! thank you!",
		  "Do not buy. Item is defective. Seller is misleading & will not help you.",
		  "Four of them were already redeemed.\n\nDon’t buy!"
	   ],
	   "numberOfRates":66,
	   "avarageRate":4.981427412025356,
	   "id":49
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a Silver Reveal (Classic Black Card Design)",
	   "desc":"",
	   "category":9,
	   "images":[
		  "714H468HcGL._SY679_.jpg",
		  "31in1lPFsIL.jpg",
		  "71xLZUppcML._SX679_.jpg",
		  "71g8HC37x3L._SX569_.jpg",
		  "81GioG0rE4L._SX569_.jpg",
		  "71YSTNCYbnL._SY679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"50.00",
	   "comments":[
		  "I liked that I in the US was able to send a gift to my Canadian niece who just got married. Dislike was that a gift card from US cannot be sent to Canada. And US Amazon support was perplexed as I was on how to do it. In the world of Global Economics please inform Mr. Bezos to let his minions know to tell customers from one country on sending gift cards to another country just to create an account on that country's Amazon. Because that's what I did. You see, my credit card works cross country. But not my Amazon US account. I came up with that solution and not Amazon!",
		  "Nothing to say about a gift card. Just a piece of plastic. It was worth exactly the same amount as a $50 bill. But if Amazon was giving them away I would write a very nice review.",
		  "I am not happy with the packaging of the gift cards as you have to open to see the value of the card. I order for a company so we order multiple cards with different denominations and I have no idea which are which.",
		  "Perfect. Just what I needed.",
		  "This is a great gift idea love it!",
		  "Everybody loved them and they were here faster than expected",
		  "As described",
		  "Nice looking card sleeve and great to have cards on hand for gifts."
	   ],
	   "numberOfRates":170,
	   "avarageRate":5.3518604298345025,
	   "id":50
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a Silver Reveal (Classic Black Card Design)",
	   "desc":"",
	   "category":8,
	   "images":[
		  "714H468HcGL._SY679_.jpg",
		  "31in1lPFsIL.jpg",
		  "71xLZUppcML._SX679_.jpg",
		  "71g8HC37x3L._SX569_.jpg",
		  "81GioG0rE4L._SX569_.jpg",
		  "71YSTNCYbnL._SY679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"50.00",
	   "comments":[
		  "I liked that I in the US was able to send a gift to my Canadian niece who just got married. Dislike was that a gift card from US cannot be sent to Canada. And US Amazon support was perplexed as I was on how to do it. In the world of Global Economics please inform Mr. Bezos to let his minions know to tell customers from one country on sending gift cards to another country just to create an account on that country's Amazon. Because that's what I did. You see, my credit card works cross country. But not my Amazon US account. I came up with that solution and not Amazon!",
		  "Nothing to say about a gift card. Just a piece of plastic. It was worth exactly the same amount as a $50 bill. But if Amazon was giving them away I would write a very nice review.",
		  "I am not happy with the packaging of the gift cards as you have to open to see the value of the card. I order for a company so we order multiple cards with different denominations and I have no idea which are which.",
		  "Perfect. Just what I needed.",
		  "This is a great gift idea love it!",
		  "Everybody loved them and they were here faster than expected",
		  "As described",
		  "Nice looking card sleeve and great to have cards on hand for gifts."
	   ],
	   "numberOfRates":170,
	   "avarageRate":5.3518604298345025,
	   "id":51
	},
	{
	   "productTitle":"Amazon.ca Gift Card in a Mini Envelope",
	   "desc":"",
	   "category":10,
	   "images":[
		  "91ElQ8bR0JL._SX679_.jpg",
		  "A1jtYd5ttYL._SY679_.jpg",
		  "A1QKbKYz-pL._SX679_.jpg",
		  "71zXjf32XhL._SX679_.jpg",
		  "A1BTaLu8A-L._SY679_.jpg",
		  "917Bk-vROFL._SY679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"10.00",
	   "comments":[
		  "Hard to keep track of the lives of my dozen nieces and nephews. These were a welcome solution",
		  "Excellent.",
		  "As advertised.",
		  "A gift to be included in a parcel..I was afraid I would not receive it on time, but no problem.",
		  "very handy item to give",
		  "Cadeau",
		  "Perfect, super cute packaging too!",
		  "its a gift card"
	   ],
	   "numberOfRates":122,
	   "avarageRate":0.11236528980596727,
	   "id":52
	},
	{
	   "productTitle":"Amazon.ca $250 Gift Card in a White Gift Box (Amazon Icons Card Design)",
	   "desc":"",
	   "category":10,
	   "images":[
		  "816z7hENeHL._SX679_.jpg",
		  "81AsXnFqRAL._SX679_.jpg",
		  "81vmrGEWKZL._SX679_.jpg",
		  "31EZ4T%2BXzWL.jpg",
		  "81S9zcx-p7L._SX679_.jpg",
		  "714Nvr84ZSL._SX569_.jpg",
		  "61uakHu8hzL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"250.00",
	   "comments":[
 
	   ],
	   "numberOfRates":180,
	   "avarageRate":0.08014769377017439,
	   "id":53
	},
	{
	   "productTitle":"KitchenAid 6-Qt. Bowl-Lift Stand Mixer with Wire Whip, Flat Beater, and Spiral Dough Hook - Silver",
	   "desc":"Burnished metal flat beater, PowerKnead Spiral Dough Hook and 6-wire whisk will help you mix, knead and whip ingredients into culinary masterpieces quickly and easily. And for even more versatility, the power hub fits optional attachments from food grinders to pasta makers and more.",
	   "category":12,
	   "images":[
		  "81CVP1dzqZL._SX569_.jpg",
		  "71SaCfALzML._SX569_.jpg",
		  "71l3838-8lL._SY879_.jpg",
		  "71UG7D33yQL._SY879_.jpg",
		  "71uieDPJ8qL._SY879_.jpg",
		  "61O6ezXzbdL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"505.76",
	   "priceIs":557,
	   "comments":[
		  "Quite disappointed in this so far, after having the 4.5qt for almost 8 years working flawlessly, we decided for something bigger. Out of the box, the gearbox was grinding. After calling the U.S. helpline (who said it needed to be replaced) transfered me to the Canadian dept. They needed a video send in that is supposed to get attached to the file right away. Well that took 2 weeks. Now they are saying it's not attached and I have to go through it again.so far, it's horriable service",
		  "I'm not very impressed with this mixer. I had an old KitchenAid mixer that I loved (and it still works great). I was going to get this new one and give my old beloved one to my mom, who loves it too.\n\nSo I bought this one and then realized quickly that I couldn't whip a couple of egg whites in it. The whisk barely touches the egg whites and it just won't whip. Even today, trying to whip six egg whites, it takes forever because the whisk doesn't pick it all up right away.\n\nI knew it was a higher capacity than the previous one, which I thought would be great for Christmas baking so I could do double batches of small recipes at a time. But I wasn't prepared for it to be impossible to do small batches of certain things in it when I'm doing every day cooking.\n\nI ended up giving the new one to Mom (because she only uses it for Christmas baking) and got my old one back from her to keep at home. I will cry if and when my old one dies.\n\nI also don't love the way the bowl goes in and out of the mixer arms. Tricky to figure out at first and I don't like having to use so much force to get it in and out of the mixer arms. Wouldn't be great for someone with weaker hands or arms (like an elderly baker perhaps).\n\nOverall disappointed. Kept it because I didn't realize for a while after I got it that it was problematic for small batches. We're living with it, but not thrilled with it. Definitely do not recommend.",
		  "I used to have the older version of this exact KitchenAid. I bought it 10 years ago. Once I got this new one, I felt the difference right away. Despite the motor being the same power, it felt really weak. It sounds like it is about to die at anytime, even though it is brand-new and there's not much in it. Anyways, it is a good product but wished that my old one didn't break :(",
		  "Came quickly and as described. very strong machine. However, even after moving the bowl to the highest position, it has a hard time reaching those items in the bottom of the bowl, so it's not good for things like beating just 2 eggs.\nvery heavy and large so it needs to be on the countertop. it would be difficult to store and move in and out of a cupboard.",
		  "My mixer arrived in perfect condition and ready to use. It looks great, and is relatively easy to use though there is a trick to getting the bowl in. A little bit of learning should be expected when you get a professional tool, which this definitely is. This mixer brings the joy back to baking for me, because everything is so quick and easy. I’ve made muffins, scones, breads, and even used it to mix up a crab dip. This is such a great addition to your kitchen if you are a serious home cook who likes to make everything from scratch.",
		  "Great Mixer Easy to set up, and easy to use, with no problems. Works perfectly, motor strong enough to mix anything. Lots of great attachments looking forward to getting a few and testing them out. One somewhat of a negative thing is the black spots inside the bowl, they are a byproduct of the manufacturing and are not dirt. Mine did have a couple of small spots but honestly it doesn't bother me but from reading the reviews a lot of people for some reason find that a big problem.",
		  "Great new addition to my kitchen gadgets. A small recipe book would have been nice (showing uses of the attachments )",
		  "Though the bowl is nice and big and can accommodate a big batch of bread dough, the motor slowed and seemed to have trouble with it. Also, the bowl tilt is very stiff and I'm sure many would have difficulty snapping it in and out. Lastly, after putting the mixing bowl in the dishwasher one, it came out with rust spots along the rim. I was expecting a lot more from this machine and don't think I'd buy it again"
	   ],
	   "numberOfRates":11,
	   "avarageRate":2.0500118315413487,
	   "id":54
	},
	{
	   "productTitle":"Nespresso VertuoPlus Deluxe Coffee and Espresso Machine by DeLonghi - Black",
	   "desc":"",
	   "category":12,
	   "images":[
		  "612gAD6FkHL._SX569_.jpg",
		  "61gltpLQGQL._SX569_.jpg",
		  "71pjp7m9HIL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"279.00",
	   "priceIs":1923,
	   "comments":[
		  "Acheté pour cadeau d’anniverssaire . J’ai du la retourner pour remplacement car le réservoir ce vidait tout seul sur le comptoir . Meme résultat avec la deuxième . La compagnie affirme qu’elle n’est pas au courant de ce défaut .",
		  "THE GOOD\n1. Makes absolutely everything! Americano, capachino, latte, expresso, and more! Many machines, especially from Nespresso usually only expresso, lately they've been expanding this to including all types after Delonghi was included.\n2. Add your milk, heats and froth is added depending on your drink choice\n3. even though the pods spin with the centrifuge process it’s not louder than any other coffee machine which is great\n4. on our trip to Paris all hotels and places had these and we absolutely fell in love with the quality of coffee and espresso\n5. Setup is easy also includes innovative hard water test strip which the machine will adapt to provide slightly altered brewing settings for a much better tasting cup.\n6. Swingable innovative water tank can be position to hide/show 200 degrees\n7. Most important; makes an incredible tasting cup of coffee!\n\nTHE DRAWBACKS\n1. You have to use the Nespresso pods. Unless you find a refillable reusable compatible basket, you cannot use your own grounds. It also doesn't grind your coffee.\n2. It's more of a high end pod coffee machine that makes everything. Deep coffee and expresso enthusiasts tend to get freshly roasted coffee local as the flavour deprecates chronologically immediately after roasting; even more after grinding. You have to use pods with this machine.\n3. The milk froather is a tad wasteful if you don't use it all once filled must be dumped because of the boiling process.\n4. Very large machine, takes up a lot of space on the counter. Much to heavy to bring out each time.\n\nTHE VERDICT\n1. If your looking to make every type of high end coffee and your low on time and effort, it's get. If you want the absolute freshest healthiest coffee/expresso experience, don't. Remember if it's fast and cheap it's low quality. Great machine, if it suits your needs you'll love it!",
		  "This machine is intended for someone that wants the same quality, every time; no hassles, and fast. No need to buy coffee beans, no need for a grinder, no need to tamp the coffee and to adjust anything. No messing around. Just buy pods online and you're done.\nThis machine is NOT for the espresso aficionado. You simply cannot get the same flavors and crema as you would with a classic espresso machine and grinder. I happen to have both and well, I won't compare since it's not fair.\nThe VertuoPLus Deluxe machine looks nice, doesn't take much counter space and has the water container that can be shifted position to accommodate deeper counters and save you some space. It also has a motorized open/close function to insert the pods.\nThe regular coffee was easy to make and tasted great. The espressos were quick and easy. This is a great machine if you want convenience above all else. At this price point you can get yourself a simple espresso machine and maybe even a cheapo grinder which requires much more work\nTwo things to consider: The VertuoPlus Deluxe I found makes less noise than the Vertuo coffee and espresso by delonghi, and I would consider the package with the aeroccino frother, so you can make your lattes. This machine will be at its best making regular coffees and lattes.\nI give the VertuoPlus Deluxe 4.5 stars, (I gave the vertuo one 4) because it's quieter and has the auto-open/close feature which is cool (but more at risk of failure) along with the adjustable water container position.",
		  "If you would like to take a plunge into Nespresso pod coffee system, NESPRESSO Vertuo / VertuoPlus is one of the best and most expensive option and has plenty of features and functionality that any coffee lover will be satisfied with. Nespresso Vertuo/VertuoPlus os a single-serve coffee maker that can brew traditional coffee as well as gourmet expressos. It has pod system similar to Keurig so instead of brewing entire pot, you simply stick a pod in the machine for making either coffee of espresso. One of the advantage of pod system is you can experiment with different blends and it’s faster and way simpler to use. This machine is so intelligent that you do not need to adjust setting for different kind of pods. It auto-adjusts based on the bar code on the rim of pod capsule.\n\nVertuo machines comes in two models : Vertuo and VertuoPlus (This model). Though neither of these machines come with milk frother, you can buy both options with bundle which will include Aeroccino Milk Frother as a bundle. I highly recommend getting bundle with Aeroccino Milk Frother if you are like me who like rich and creamy coffee with smooth texture.\n\nIt is not as slim, compact and light weight as entry-level Nespresso Inissia, but still good enough to be kept on countertop. First thing you notice as you take out this from the box is how nicely built and designed and beautiful this machine is. It is just 4.9 Kg which is not bad for a full featured machine. It is compact enough so that you can fit it reasonably well on any countertops or under the kitchen cabinets.\n\nThis machine is ridiculously simple to use. Everything is done with just one button and there are no complicated buttons and settings. All you need is to inserting the pod, close the compartment and let centrifusion process begin. Centrifusion technology rotates the pod at high RPM to ensure perfect blend of coffee. This model also comes with a detached milk brother that can be used in conjunction with the machine. Making coffee is simply a press of button. Each time I tried this machine it produced consistently incredibly fine coffee and espresso. Included Aeroccino Milk Frother consistently provided smooth and fine texture to coffee.\n\nMachine turns off after 9 minutes automatically. Machine is also very easy to clean and maintain.\n\nKey Features:\n• 5 cup sizes : 40ml (Espresso), 80ml (Double Espresso), 150ml (Gran Lungo), 230ml (Coffee Mug) and 414 ml(alto) and it depends on 3 capsule sizes.\n• Brew head is motorized.\n• Fast pre-heating time of 25 seconds\n• Removable large 60oz water reservoir. Water tank swivels out or stays behind the machine based on available space\n• Used capsule drawer that holds 10 capsules.\n• Cable Storage\n* Complimentary Nespresso Vertuo capsules included\n\nPROS\n• Best Nespresso machine\n• Super-simple to use\n• Very compact\n• Great Coffee\n• Includes Milk Frother\n\nCONS\n• Expensive\n• Limited to Nespresso pod system\n\nConclusion:\nNespresso VirtuoPlus is a smart choice as a Pod system coffee machine. It may not be fanciest coffee maker in the market, but it’s sheer ease of use and nice coffee it makes makes it ideal choice for most people. It has small foot print and has good features. And most importantly, makes great coffee. It may not be a winner in many customizable features compared to high end non-pod systems features and design statement, but if simplicity, compactness and great coffee is the priority, this may be a good choice."
	   ],
	   "numberOfRates":125,
	   "avarageRate":0.478918011054529,
	   "id":55
	},
	{
	   "productTitle":"Breville BREBTM800XL Tea Maker",
	   "desc":"",
	   "category":11,
	   "images":[
		  "81%2BpgHhjBML._SX679_.jpg",
		  "81cVerlHayL._SX679_.jpg",
		  "91vBjh2TbsL._SX679_.jpg",
		  "81q4UiWw8KL._SY879_.jpg",
		  "819SodzuvkL._SX679_.jpg",
		  "6190tFOQPNL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"299.98",
	   "priceIs":2629,
	   "comments":[
		  "Oh Joy, Oh Bliss. If this is for you or for anyone else for whom you are considering buying this tea maker, DO IT. My husband kept saying we didn't need an instant tea maker because it is easy to make tea the old fashioned way. True, it is easy to make tea using a teapot, but I'm not a morning person. I am REALLY not a morning person and I don't drink coffee, only tea. I kept glaring at his programmable coffee maker, and one day, I snapped. Realising I was contemplating smashing my husband's coffee maker over his head and murdering him if he sighed happily over his first cup of pre-made, ready and waiting morning coffee one more time, I decided that it was history for him and his coffee pot or a Breville tea maker for me. Fortunately the Black Friday sales were on and I got the tea maker at almost reasonable price.\n\nI got tired of replacing electric tea kettles every year and bought a Breville tea kettle, which I have had since since 2009, and which still woks like a charm. That's why I chose the Breville tea maker, which seems to be as well built as their tea kettle. There is nothing flimsy about it and the various settings available are wonderful for the dedicated tea drinker. The glass pot is solid and the water heats up very quickly. I used to set a timer when I was making tea in a teapot, but sometimes I would get busy and not hear it. An hour or so later, I would be faced with an extremely bitter brew. The Breville tea maker is great because it removes this problem by lowering and raising the basket of tea leaves as programmed.\n\nSo, for anyone who loves tea and would like to hang onto their spouse or significant other, I highly recommend the Breville Tea Maker. It's expensive, but if purchased on sale the \"ouch\" factor will be reduced. If it lasts as long as the Breville Tea Kettle, it is also less expensive than a cheaper, unreliable product in the long run..",
		  "Bought it for my mom, she uses it every day. It's very versatile and easy to use. It's also very unique and we get compliments on it whenever people come over.\n\nIt uses magnets to drop the basket depending on what kind of tea setting you input. You can also use custom settings.\n\nOnly thing is after a while, the bottom metal part discolors and looks like rust .Overall excellent but the bottom discoloration bothers me.",
		  "I never expected to own a tea maker because we love teapots. Thank you to all the reviewers whose enthusiasm convinced me to buy one.\nAmazon.ca offered the best price at the time of purchase. The shipping was free.\n\nThe cord can be stored under the base if you want to put it away after using it. It is attractive enough to be left on the counter.\nWe drink mostly green, white, oolong and herbal teas. We did have to adjust the settings to get the brews the way we liked them which was usually different from the manufacturer’s recommendations. We use the custom settings for teas that are meant to be brewed at different temperatures than\nthe standard ones offered.\n\nThe carafe is sturdy but you must take care not to get too much water on the outside because of the electrical components underneath.\nIt keeps tea warm for an hour. You must remember to press the KEEP WARM button after you return the carafe to its base.\nI needed a sticky note at first as a reminder. 🤭\nThe tea does get stronger the longer it sits. However, there is no bitterness to it. I don’t particularly care for the darker colour but no one else minds.\nIf the brew is too weak letting it sit on Keep Warm is an advantage. About half an hour on Keep Warm is my limit.\nThe strainer is good. With certain teas fine bits will get through even our small superfine strainer.\n\nWhen serving tea in the dining room I pour the perfectly brewed tea into a teapot and place it on a tea stove with a candle to keep it warm.\nI refrigerate leftover tea to use in smoothies.\n\nThe cleaner works well. Next time I am going to try vinegar and baking soda because it’s a natural cleaner. One reviewer suggested Oxy.\nI have never timed it but the water seems to boil really fast. We have never programmed it to brew at a specific time.\nI use a Hario dripper to make coffee occasionally. I can boil the water in the teamaker at 205 degrees which is apparently the the best temperature for coffee.\n\nThis is one of the best purchases we’ve ever made. It really makes a difference to the way tea tastes. We use mainly loose tea but tea bags work too. You can use more water than normal for second and third brews. I love the way the basket moves up and down to gently move the tea leaves around.\n\nWe absolutely ❤️ this tea maker.",
		  "Whilst I do have a propensity for hyperbole, I do believe this is the finest purchase I have made to date under $300. I love tea, but it is easy to ruin it by over steeping, or by using the wrong water temp, especially black tea, my tea of choice. With the Breville, you can play around with the settings to get it just how you like it, set it and have your tea made perfectly every time, on command. It's simply awesome to be able to make tea with all of the consistency and convenience that coffee drinkers have long enjoyed. I use Twinnings loose tea in it which I believe produces less waste and is much healthier than tea bags. I saved the box and styrofoam, and with a little tape reinforcement on the corners travel with it when ever I leave for more than a week. This is a premium product, at an appropriate price. I have had it nearly a year and no complaints with performance."
	   ],
	   "numberOfRates":146,
	   "avarageRate":1.9762976711015794,
	   "id":56
	},
	{
	   "productTitle":"Russell Hobbs CM3100BLR Retro Style Coffeemaker, 8-Cup, Blue",
	   "desc":"",
	   "category":13,
	   "images":[
		  "819nORS6HiL._SX569_.jpg",
		  "91wH94PN8fL._SX569_.jpg",
		  "91jHJrppV5L._SX569_.jpg",
		  "91xPQp3P91L._SX569_.jpg",
		  "91GYrvNzcGL._SX569_.jpg",
		  "9137ZTc16OL._SX569_.jpg",
		  "91%2Bp9R3%2BexL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"119.99",
	   "priceIs":3017,
	   "comments":[
		  "On the expensive side - but the coffee is wonderful and i personally enjoy the 40minute timer / auto shut off feature.\n\nPersonally, coffee tastes burnt to me after 40min - 60minutes on a hot plate. I think 40 minutes is perfect for an auto-shut off feature.",
		  "Very snazzy looking. Makes great coffee fast. The only negative point is that the cut-off is only 40 minutes - then the hot plate automatically shuts off. I wish the timer was an hour. I have to warm up my second cup of coffee in the microwave every time. But the format of 8 cups (4 mugs) is exactly what I was looking for and could not find anywhere.\n\nWhy is the red model much more expensive than the black one? That's a rip-off.",
		  "While it worked, it was a great little coffee maker. It was the perfect size for just me working at home or my wife and I on weekends. The magic stopped yesterday.\n\nIt now appears to be clogged with no obvious way to clean out the hose. I tried running a vinegar solution through it but for the 8 cups, only one cup made it to the pot; 3 cups steamed away and after that 20 minutes of wasted time I stopped the process, pulled out the 20 year old “crappy” coffee maker I was trying to replace and made a less enjoyable coffee.\n\n2.5 months doesn’t add up in terms of value for money for this model.",
		  "It’s a great looking pot, produces great coffee. The lid doesn’t come off the carafe, it’s hard to dry the interior lid and the scoop on the side is forever fallling off.",
		  "Its very expensive but the material feels very cheap. You're paying only for the antique looks I guess. But for the same price or less, you can get lots of functionalities and features. There is No Keep warm, no timer, no delay, no temperature control. I would rather go for another brand which has all those function than for the antique looks.",
		  "Was for my wife she felt it was a little pricey. And it doesn’t keep the coffee hot as long as she’s used to with her old one. But it matches the kettle and toaster I gave her for her new kitchen renovation.",
		  "As noted in previous reviews, it brews in higher temperature than the cheaper machines. We brew the same coffee bean with exact same amount of water and coffee, and noticed the difference in taste, by how much? I would say 10% improvement....",
		  "Full flavour and HOT! Best I've ever had."
	   ],
	   "numberOfRates":195,
	   "avarageRate":1.7879313332184568,
	   "id":57
	},
	{
	   "productTitle":"Vitamix Eastman Tritan Copolyester Soft-Grip 64-Ounce Container with Wet Blade and Lid",
	   "desc":"",
	   "category":13,
	   "images":[
		  "41bbukCuwUL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"205.99",
	   "priceIs":3033,
	   "comments":[
		  "Perfect replacement.",
		  "It's exactly what I had before which was broken. Delivery was perfect.",
		  "This is the real deal.",
		  "fast and dependable",
		  "It is a bit looser on the base the my original jug was but it still works quite well and I am glad I went for the soft grip handle instead of just a plastic one. Too bad these things are so expensive.",
		  "Pleasantly surprised with this container. My original container broke when it fell on the floor. It is great quality, the blade is really sharp and it works perfectly. Definitely recommend and will buy this again if anything happens to mine."
	   ],
	   "numberOfRates":92,
	   "avarageRate":4.939373903055468,
	   "id":58
	},
	{
	   "productTitle":"Starfrit 094268-004-0000 Starfrit 094268-004-0000 Perfect Bagel Cutter, Multicolored",
	   "desc":"",
	   "category":11,
	   "images":[
		  "51EfFDXPehL._SX679_.jpg",
		  "61EUTNNEnvL._SX679_.jpg",
		  "61x8HTxIuML._SX679_.jpg",
		  "51zLTTvuYIL._SX679_.jpg",
		  "61Y-3MvGk1L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"18.80",
	   "priceIs":3912,
	   "comments":[
		  "Not perfect but less restrictive than the guillotine style, good quality and inexpensive.",
		  "Good in a pinch or when camping. Other than that not quite what I wanted"
	   ],
	   "numberOfRates":12,
	   "avarageRate":3.0680503387136393,
	   "id":59
	},
	{
	   "productTitle":"Cuisinart CPT-435C 4-Slice Countdown Mechanical Toaster Silver",
	   "desc":"",
	   "category":12,
	   "images":[
		  "71g2nh0sUHL._SX679_.jpg",
		  "61WxMA4YyCL._SX679_.jpg",
		  "612XdVieLvL._SX679_.jpg",
		  "71KYvp-QqqL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"119.62",
	   "comments":[
		  "NOISY. It makes a VERY loud beep when your toast is ready. You can't turn it off. This \"feature\" is not mentioned anywhere on the box. When it is not toasting, you can hear its power converter make that electronic high humming sound (like if you had tinnitus).\n\nUNRELIABLE. Mine lasted a year and a half before a lever was stuck and rendered half of it unusable. Cuisinart's warranty requires you to ship the device to their service center at your expense.",
		  "Documentation recommends unplugging after each use.\nI don't want to unplug my toaster ... leaving it plugged in creates an electrical whine over time.\n\nOtherwise toaster seems to toast relatively well and consistent. Not sure how long will last yet.\n\nOne of the better toasters, but its hard to come by a perfect one.",
		  "Très beau et fonctionne bien...Très déçu un silment constant à off un bip quand toast son prêt .Je reçois un autre pour le remplacement même chose silement et endommagé ...Très déçu cuisinart",
		  "Love this thing no longer burn my fingers removing gluten free bread and no longer have to toast it two times. Good to go in one toasting.",
		  "Aucun commentaire pour le moment, sauf ma satisfaction pour la vitesse de faire des bonnes roties",
		  "Très esthétique.\nNous l'avons maintenant depuis près d'un, nous l'utilisons sur une base quotidienne avec notre famille de 5 et il fonctionne très bien.",
		  "works great",
		  "Je l'ai reçu dans un délai plus que raisonnable et il est parfait. Meilleur achat de grill-pain jamais."
	   ],
	   "numberOfRates":157,
	   "avarageRate":4.6969319612254345,
	   "id":60
	},
	{
	   "productTitle":"Breville BREBWM520XL \"The No Mess\" Waffle Iron, Metallic",
	   "desc":"",
	   "category":12,
	   "images":[
		  "81goAG5nIJL._SX679_.jpg",
		  "81%2BIPaPryPL._SX679_.jpg",
		  "71-jRMsj5EL._SX679_.jpg",
		  "71rdO54hurL._SX679_.jpg",
		  "818rdTBiW4L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"169.99",
	   "priceIs":839,
	   "comments":[
		  "I didn't know what to think about having a moat on a waffle iron but I love it. I'm pretty generous with how much batter I pour and every time the moat catches it and cooks it making clean up as easy as wiping it with a paper towel.\n\nThe waffles come out a nice size for 1 person. I find the 4 setting is a good one if you want a golden brown and crispy waffle.",
		  "This was for a family member and they were more than pleased with it and have enjoyed many waffle breakfasts since. Very easy clean up. We did lots of research before choosing this one. A wise choice.",
		  "It's sturdy and beeps when its hot enough to use and when the waffle is ready.",
		  "Family and friends have complimented my purchase when they had seen this waffle iron in action. Really no mess!",
		  "Love this waffle maker, no mess for sure",
		  "Fonctionne super bien aucun nettoyage a faire facile à utiliser .",
		  "Love this item. My messy 20 year old son has proven this is truly \"No Mess\" Waffle maker",
		  "Love it!!!!"
	   ],
	   "numberOfRates":68,
	   "avarageRate":1.5306274213678943,
	   "id":61
	},
	{
	   "productTitle":"HIC Brands that Cook Stainless Steel Dough Scraper with Wood Handle",
	   "desc":"",
	   "category":13,
	   "images":[
		  "7158PBg-uzL._SX569_.jpg",
		  "81MtxtWBU0L._SX569_.jpg",
		  "81n%2BUqde%2B6L._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"24.69",
	   "priceIs":4390,
	   "comments":[
		  "I bought this dough scraper for my sister in law's birthday. I have a similar scraper, but when I received this one in the mail, I was instantly sorry that I didn't order two, one for my sister in law and one for myself. This is a great quality, well made scraper. I loved how heavy it felt in my hand, and how sturdy it felt. It should last a very long time. I would definitely order it again in the future for myself, or other gifts.",
		  "I've been using this dough scraper fairly often since I got it, and it's been great. A good size for small hands, solid built, and the wood is holding up beautifully. Almost wish it was a big bigger.",
		  "The most useful accessory for pizza lovers who intend to make their own recipes. It's a must have item for those people.",
		  "WOODEN PART NOT GOOD FOR DISHWASHER\nWORKS VERY WELL\nSAW ONE SINCE WHICH WAS ALL METAL WISH I HAD SEEN IT FIRST",
		  "ok pour l'article je n'ai pas plus de chose a dire la dessus ok ok ok ok o ok ok",
		  "I was looking for this as a Christmas gift for a girlfriend. I have one and she wanted it! She's very happy with her gift.",
		  "Maybe not the scraper's fault, but I bought it hoping it would work well for manipulating a pie crust. However, the metal edge is \"squared off\" and somewhat thick, so when you try to slide it under a pie crust, it tends to \"catch\" the crust and crumple it. I'm sure it's fine for scraping a board clean, but that's not what I wanted it for.",
		  "This is a basic Bench scraper, not that sharp and not that thin.\nHowever the price is quite low so if you're just looking for one for occasional use this will do."
	   ],
	   "numberOfRates":109,
	   "avarageRate":3.030542079166627,
	   "id":62
	},
	{
	   "productTitle":"Cybrtrayd E134 Large Bunny Chocolate/Candy Mold with Exclusive Copyrighted Molding Instructions",
	   "desc":"",
	   "category":13,
	   "images":[
		  "51qVDWWCAdL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"16.96",
	   "priceIs":4271,
	   "comments":[
		  "Can't wait to try it .....mold looks great!!",
		  "Tought it was a 3D mold",
		  "Got it today",
		  "This is an awesome Easter bunny mold. I bought this mold to make chocolate bunnies for my dairy, nut, and egg-allergic kids. I used one package of Enjoy Life chocolate chips for each mold. These bunnies are huge and the kids were wow-ed on Easter morning. What I did was melt the chocolate in a bowl in the microwave and add about a Tbsp. of vegetable oil before pouring the chocolate into the mold. I then put the molds in the refrigerator. The bunnies looked great well done. I packaged the bunnies in a ziploc baggie with a ribbon for each of my children and they were very excited on Easter morning. I also saved a lot of money going this route versus buying allergy-safe chocolate bunnies online, which is what I did the previous Easter. This mold will get lots of use for years to come!",
		  "High quality bunny mold, packaging was good and this mold has held up well. I made 10 chocolate bunnies for Easter and they were beautiful! I would definitely order additional molds.",
		  "This actually ended up making a couple of ginormous bunnies. Like mondo huge. These chocolate bunnies almost ate my kids before the kids could eat them! If you tend to wait until the last minute, go ahead and get one per kid.",
		  "Holds 8 oz chocolate. Cute face.",
		  "A very pretty mold and a nice size."
	   ],
	   "numberOfRates":56,
	   "avarageRate":1.2307360121838893,
	   "id":63
	},
	{
	   "productTitle":"Cuisinart AMB-95FCPC Chef's Classic Nonstick Bakeware 9.5\" Fluted Cake Pan",
	   "desc":"",
	   "category":11,
	   "images":[
		  "61WC6KJn3aL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"29.99",
	   "priceIs":3400,
	   "comments":[
		  "it is indeed non-stick but for some reason the color inside changed a little after i used spray oil on it and became dark but it is still working great after so many uses.",
		  "Great tin.",
		  "Super",
		  "Very pleased with this item.",
		  "Great product. Arrived in 2 days.",
		  "The nonstick Cuisinart is excellent, I am quite satisfied\nThank You so much",
		  "works well",
		  "that's what I needed"
	   ],
	   "numberOfRates":56,
	   "avarageRate":0.13952416660062195,
	   "id":64
	},
	{
	   "productTitle":"G&S Metal Products OvenStuff Non-Stick Personal Size Bake, Broil and Roast Set",
	   "desc":"",
	   "category":11,
	   "images":[
		  "81bQji%2B1piL._SX679_.jpg",
		  "81HP7aSi43L._SX679_.jpg",
		  "81L6aV6yeTL._SX679_.jpg",
		  "91sjrJ5vuML._SX679_.jpg",
		  "81Q1t4MPG7L._SX679_.jpg",
		  "81JmkjqdFgL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":3839,
	   "comments":[
		  "This is perfect for a single person...a lot smaller than I thought it would be. Fits my toaster oven perfectly. Easy to clean and a good sturdy product.",
		  "Don't be fooled by the pictures This is very small. It is 10 \" long 6 1/2 \" wide and 2 \" deep",
		  "Description of product on Amazon says dishwasher safe, which is not to be found on package at all. Package only says \"hand wash.\"",
		  "product is smaller than I expected. unfortunately I had to return it, but the refund was incredibly fast and hassle free !",
		  "The metal coating started to deteriorate almost immediately and was no longer usable as it soon began to rust.",
		  "Non-Stick as described.",
		  "Works great. Very handy",
		  "Just as described. Very easy to clean, right size."
	   ],
	   "numberOfRates":51,
	   "avarageRate":0.18658198037064677,
	   "id":65
	},
	{
	   "productTitle":"Etekcity Digital Kitchen Scale Multifunction Food Scale, 11lb/5kg, Silver, Stainless Steel (Batteries Included)",
	   "desc":"",
	   "category":11,
	   "images":[
		  "71k4OEMr97L._SX569_.jpg",
		  "61u0n79RGtL._SX569_.jpg",
		  "71KOyz4L-iL._SX569_.jpg",
		  "71VymrUuKfL._SX569_.jpg",
		  "71rrtjSv2xL._SX569_.jpg",
		  "71L5LzKQnvL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"21.99",
	   "comments":[
		  "I'm finally writing this review after owning it for almost three years, and so it's pretty easy for me to decipher its pros and cons.\n\nI bought this scale after switching from a non-digital one, and that made a huge difference. First off, it's super simple to use and switch the conversion units, as well as \"tar\" the scale to bring it back down to zero as needed. It needs no further configuration other than replacing the batteries once in a while.\n\nAs for accuracy and reliability, I haven't found any issues on it. Most I've ever seen it do is maybe be one gram off, but after a ton of use, there haven't been any major inaccuracies. I've read other reviewers complain about it being off, but personally haven't dealt with such a thing.\n\nFor the most part, cleaning the smooth surface is super simple and easy as the metal surface doesn't get stained and can be quickly wiped down with water. The kinda gross part is the dust and particles that can get stuck in the crevices of the scale, mainly the edges of the LCD display and the buttons. The best solution I found for that was to take a toothpick and run it along the edges. Not perfect, but it still gets most of the job done.\n\nOne more thing I wanted to add was that overtime, the conversion button gets harder to press and you really have to push on it to switch units. It might be mostly due to the fact that dust and particles can also get trapped underneath the buttons, so be aware of that. I also somehow had water stuck under the display one day despite my scale not being near my sink, so it might have just been some wrongdoing on my part.\n\nAll in all, this has been a great food scale that I still use after all these years. Despite some drawbacks it's still reliable, durable, convenient, and portable enough to take anywhere with you. :)",
		  "I researched various food scales, and settled on this one due to the overwhelmingly high reviews. Biggest disappointment ever. There is zero accuracy with this scale. Sometimes under, sometimes over. Sometimes by a little, sometimes by a lot. If it were at least consistent in its miscalculations, I could just do the math for each item.\n\nA waste of money and completely unusable.",
		  "Will not measure weight until there is 4-5 grams on it to begin with. From there the accuracy seems to be within about 2 grams. Fine if you are measuring things at home AND don’t need 100% accuracy AND don’t plan to measure anything below 4 grams (salt, spices, etc). As a culinary student who needed an accurate scale that could scale starting at 1 gram, this scale was not for me and had to return it.",
		  "I purchased another brand that has a section that pulls out to see the weight, but it never seemed to work right and was clunky to use. This scale is gorgeous, accurate and simple to use. It doesn't take up much space on the counter. I use it everyday to measure ground coffee, as well I use it for measuring flour. It came within 2 days and was nicely packaged and protected. I highly recommend this scale.",
		  "very lightweight and the buttons have a satisfying click. some people are upset about the scale sensitivity but for the price point i think its quite good. yall need to relax and spend an extra $10 if you're ruffled by a cheap scale not detecting a tiny change in the amount of herbs you sprinkled onto it especially when you sprinkle it so slowly it can hardly tell the difference",
		  "I got this after much debate on what scale to order, every scale I looked at had good reviews and horrible reviews. I ordered this one based on the reviews and am glad to say that I am very happy with this scale. It is easy to operate, I tested it with some known weights and sure enough it was spot on accurate so in that sense I am very happy.\n\nI would highly recommend this product, I did not have any of the complaints the people with bad reviews have here, sure the LED turns off after a bit, but one press of a button and its back on so not a big deal. I would definitely buy again if I had to do over.",
		  "Great handy helper in kitchen! Especially for freezing things wanting to know weights prior to packaging and freezing is awesome. Helped significantly for defrost time too!\n\nAlso good for weighing snacks like nuts, dried fruit. Helps definitely in the portion department would recommend",
		  "Works as expected. It measures down to the last single gram. If this works for a good while, I’ll be recommending it to family and friends. So far, it’s good.\n\nA rep from Etekcity just helped me out with the registration. All good for two years now. Wow! And the product is great! We measure a lot of dried herbs in our family and the scale has to be sensitive down to 1 gram. Parents are loving it. Makes our cooking much, much better now. Thanks, Etekcity!"
	   ],
	   "numberOfRates":91,
	   "avarageRate":0.12014975360043101,
	   "id":66
	},
	{
	   "productTitle":"Wilton 415-2179 300 Count Rainbow Bright Standard Baking Cups",
	   "desc":"",
	   "category":12,
	   "images":[
		  "81cGuIlUbDL._SY879_.jpg",
		  "81%2BFqjpJC9L._SY879_.jpg",
		  "81PLLBhDNKL._SX569_.jpg",
		  "91DrUAKSoKL._SY879_.jpg",
		  "81k5-CuRW2L._SX569_.jpg",
		  "91bTUi3FfSL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"7.97",
	   "comments":[
		  "These were such a good deal when I bought them. However, when I went to finally use them, there was a terrible odor coming from inside the plastic tube. It was very chemical smelling...and for that reason I didn't use them! I was afraid the dye would either leak into the baked goods, or the taste of them would.\n\nI buy wilton products frequently at the store, so it's a shame that this one fell short, as having that many colorful cupcake wrappers would have been beneficial.",
		  "Purchased these for my elderly neighbour who bakes muffins and cupcakes nearly all week. She kept running out of the liners and so I stocked her up with lots of them in great colours to keep her busy.",
		  "Lovely vivid colours and the thickness is good. I didn't notice a strong chemically smell as some reviewers noted, but maybe I'm just less sensitive.",
		  "Vibrant colours that you can still see after you have baked in them. Thick, durable and easy to peel off. Will definitely buy again.",
		  "It is the best out there and I will definitely recommend it, it it doesn’t smells, as some reviews suggested, thank you Amazon",
		  "As described. Not happy with all the extra plastic packaging. companies need to be more conscientious of our environment",
		  "Color fades and becomes greasy where it's made of paper. Foil wrappers better",
		  "These r the best liners! They keep their color after baking & r easy to peel off cupcake"
	   ],
	   "numberOfRates":91,
	   "avarageRate":0.516365735909333,
	   "id":67
	},
	{
	   "productTitle":"Bissell 2258C Cleanview Swivel Pet Rewind Upright Vacuum",
	   "desc":"",
	   "category":12,
	   "images":[
		  "71EB7fd8wuL._SY679_.jpg",
		  "71LWjY3slJL._SY679_.jpg",
		  "7135x%2BSSI2L._SY679_.jpg",
		  "81%2BJqJAMLAL._SX355_.jpg",
		  "81nK-Vqh5oL._SX355_.jpg",
		  "81zARSQi06L._SY550_.jpg",
		  "81IOeNwlNWL._SY550_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"169.99",
	   "comments":[
		  "I had a small handheld Dyson as I used to only have a rug. Was going to get a full size Dyson but wanted to try this vacuum first. I am so pleased with the Bissell. Even vacuuming my rug the day after I had with my small dyson there was so much dirt and pet hair picked up.\n\nWhen reading reviews before I was concerned about the small attachment for pet hair having problems because it is suction propelled. while it is considerably loud, it works like a charm.\n\nPros:\nIt works well! We have hardwood, linoleum, a low pile rug and medium carpet. It worked on all. I'm amazed at how much this vacuum sucks up.\nHas an indicator to let you know when suction is lowered (canister needs to be emptied)\nLight for a full size vacuum\nIncludes attachments to do stairs, light dusting, crevices, and corners\n\nCons\nPretty loud as is but very loud when using the pet hair tool\nThe hose is tight so it doesn't extend well, probably gets better over time though.\nThe brush bar continues to run when using attachments\nThere are a couple filters that have to be changed eventually",
		  "This vacuum is amazing. The first time I used it I grinned the whole time! It picks up pet hair off carpets on the first run, and does a really deep clean of any level, from bare floors to higher carpets. It’s very maneuverable and easy to push. I use it once or twice a day as I have a large breed shedding dog. I highly recommend it for anyone who has a lot of pet hair around their house.",
		  "I have two cats who both shed A LOT and this vacuum does a great job of handling the fur without getting clogged. It's not perfect and you should try to avoid sucking up giant balls of hair of course but for the most part, for hair and everyday dirt around the house it's awesome! It scares the hell out of my cats though, but I'm pretty sure that's all vacuum cleaners haha!",
		  "This is a great vacuum! I didn't want a heavy vacuum as I only have a couple of area rugs. BUT, we have two cats. I couldn't believe how well this picked up cat hair that had become woven into the area rugs. It seemed our carpet was darker - and not faded, as I thought, but coated with grey cat-hair. :0",
		  "This has substantial cleaning power. We have a built in, a shop vac, An Electrolux and a roomba... hands down this cleans like nothing we have ever owned or used.\n\nAmazing.",
		  "This vacuum is absolutely awesome. I have a Tristar which I've been using but beater bar doesn't pick up the dog hair. I've been having to brush the carpeting by hand to pick up the hair. I received my order and did a quick and easy assembly using the online videos. That in itself was great being able to see what was to be done rather than having to read it and still be clueless. When I plugged in the unit, I crossed my fingers and hoped for the best. Believe me. This Bissell 1820C Clean View Pet Rewind Upright Vacuum is better than good. All the dog hair and dust was picked up on one pass. The see through cannister is great so that I can see when it's getting ready to empty. It's easy to clean and the online videos explain everything you need to know about the machine from assembly to cleaning filters and more. Would I suggest this machine to others? That's a big YES!",
		  "I thought my old Bissell vacuum that I got for a $49.00 roll back price at Walmart worked well this new vacuum is amazing I turned it on and it very nearly led itself across the floor. From reading other reviews I expected it to be loud which this model definitely isn't only a little loud on the bare floors. I just loved the suction and couldn't believe the quick work the turbo brush attachment made of the fine cat fur. Then came the joy of all joys the automatic cord rewind no more manually winding the cord.",
		  "The vacuum is quite loud which I don't like. Sometimes the suction is overpowering that it makes it quite difficult to vacuum things like bath mats and small carpets. It does cause debris to blow away so I sometimes need to pass it 2 or 3 times in the same area. Cleaning the filter and bagless \"bag\" is extremely easy. I soaked mine in soapy water in the kitchen sink for about an hour or so (except the black filter!!) and it looks almost like brand new. FINAL THOUGHTS: if you have babies or children and want to get some cleaning in while they nap/sleep, DO NOT USE THIS MACHINE!! Otherwise, I think it's a good value for the cost, but you could probably find something that works just as well and may even be cordless."
	   ],
	   "numberOfRates":113,
	   "avarageRate":2.7687088000152946,
	   "id":68
	},
	{
	   "productTitle":"Bissell 2484C Easysweep Compact Manual Sweeper",
	   "desc":"For Best Cleaning Results:",
	   "category":13,
	   "images":[
		  "51wEBHTSHnL._SY355_.jpg",
		  "71HY-ER2EaL._SY355_.jpg",
		  "61leBB21d4L._SX355_.jpg",
		  "71NE-JM7%2B1L._SX355_.jpg",
		  "71%2BWzuQSsiL._SY355_.jpg",
		  "61XuqIpbrdL._SX355_.jpg",
		  "71lrWae-oIL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"24.99",
	   "comments":[
 
	   ],
	   "numberOfRates":173,
	   "avarageRate":4.140223320595542,
	   "id":69
	},
	{
	   "productTitle":"iRobot XLife Extended Life Battery Accessories, Blue",
	   "desc":"",
	   "category":12,
	   "images":[
		  "51GuTc2Cc5L._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"95.98",
	   "comments":[
		  "I bought this replacement battery because it’s an exact replacement which lasted over three years",
		  "Perfect fit and now my Roomba works again! With two dogs and two teenagers, Roomba is a floor saver!",
		  "Brought my roomba back to life🎉",
		  "My roomba is back to life cleaning like it did originally. Great battery",
		  "Just as I had hoped!! It fit and she runs like new!!!"
	   ],
	   "numberOfRates":152,
	   "avarageRate":5.1868774333586085,
	   "id":70
	},
	{
	   "productTitle":"Miele 41CAE005CDN C1 Canister Vacuum Compact Obsidian Black",
	   "desc":"",
	   "category":12,
	   "images":[
		  "61uFaP0Uk%2BL._SY550_.jpg",
		  "61Arumfd2DL._SY679_.jpg",
		  "61cOChMZ7vL._SY550_.jpg",
		  "61yKBH8BPEL._SY550_.jpg",
		  "714kAxFB%2BPL._SY550_.jpg",
		  "61spAFOckdL._SX355_.jpg",
		  "71c7satNDCL._SY606_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"299.00",
	   "comments":[
		  "I have never been so happy with a vacuum before. This vacuum has the best suction ever and is a nice light weight machine. Quiet as can be and cord retracted nicely. Very happy with this product.",
		  "Cet aspirateur fait le travail à merveille, il n'est pas trop bruyant et sa force d'aspiration est parfaite.\n\nJe le recommande.",
		  "Fonctionne très bien.",
		  "great suction. but with my 2 cats the bags will fill up fast..... and if i suck up jewelry, etc. i have to wait till the bag is empty and open it up to get it out.",
		  "Pretty happy with this so far just wish the power cord was longer.",
		  "Great Vacuum it works like a charm, its light and has great suction been using it for a week now ...so far I'm glad I bought\nit. I recommend this product.",
		  "Is horrible. Wish I could return. Does not work on càrpets or hardwood",
		  "Excellent suction, very easy to use and lightweight!!"
	   ],
	   "numberOfRates":2,
	   "avarageRate":0.38415213395106385,
	   "id":71
	},
	{
	   "productTitle":"BISSELL 2X Concentrated Deep Clean Professional Carpet Shampoo, 48 ounces 78H6Y",
	   "desc":"",
	   "category":12,
	   "images":[
		  "41zr5xPxX-L.jpg",
		  "81NzQbU84ZL._SY355_.jpg",
		  "71EFxw5jPPL._SY355_.jpg",
		  "61uU2Adyf0L._SY355_.jpg",
		  "81GzL7VmeaL._SY355_.jpg",
		  "71h-M7p6ZrL._SY355_.jpg",
		  "710aXx2ttLL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"26.99",
	   "comments":[
		  "These bottles are 1.41 litres, for those (like me) who are fluid ounce challenged. This product is perfectly good, but the problem is that I use it in the Big Green Bissell machine, so I have found that any Bissell product cleans perfectly. Because the machine is so good, I can user it at significantly reduced concentrations, which is nice. Like all Bissell products, it is scented - I wish they would make an unscented one.. It did take a while to arrive - so be sure to check the delivery date before you order.",
		  "Used to clean light grey carpets that had not been cleaned in 15 years. The product worked well its the boost produced added. The looks looked new. Only one high traffic area still has a shadow area. Very pleased, would highly recommend.",
		  "Perfect sized spot cleaner to do stairs , upholstery, car mats as well interior of your vehicle. Easy to use and not too heavy , very maneuverable . Cleans great ! I would highly recommend.",
		  "We never use a commercial carpet cleaning service now",
		  "Have not used yet but other Bissell cleaner I used was great",
		  "Very good product. Needs only 2 oz per 1 gallon of water and cleans very well. I was pleasantly surprised.",
		  "works well",
		  "Get price for product"
	   ],
	   "numberOfRates":158,
	   "avarageRate":3.630784486894429,
	   "id":72
	},
	{
	   "productTitle":"Elrene Home Fashions Solid Grommet Outdoor Window Curtain, 52\"x95\", Blue",
	   "desc":"",
	   "category":13,
	   "images":[
		  "A1l-gq2E2gL._SY355_.jpg",
		  "91zkiv2q0IL._SY355_.jpg",
		  "912AQqmHMtL._SY355_.jpg",
		  "71uqemLOUHL._SY355_.jpg",
		  "91q%2Bmnq-ejL._SY355_.jpg",
		  "81joJk5mCnL._SY355_.jpg",
		  "71%2BiRbBfdFL._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"50.79",
	   "priceIs":4816,
	   "comments":[
		  "Love these curtains. They are pricey but i believe worth it.",
		  "Update: I love the effect but after less than 2 months all grommets are rusted and one torn. These are mislabeled las rust proof grommets.\n\nVery nice effect. The fabric has a sheen that looks a little cheap. I am hoping that is a finish that makes it water/mildew resistant. I will update later on the mildew resistance. I used a conduit rod and hanger from Home Depot for the curtain rod-inexpensive and easy to install. As you can see from the picture, I will need to put in weights or some sort of tie-down.",
		  "Love these drapes! Looked for weeks for bright yellow and needed 108 inch which made it more challenging. I used these for a long breezeway. And since it is a breezeway, we definitely get some wind so we had heavy 4 ft chains cut to put in the bottom of the hemline to reduce movement. I have received lots of compliments so far. I definitely recommend.",
		  "Love these!",
		  "Had these hanging outside for about 20 days, ordered 3 more because they were just slightly different color than ones there so I wanted all to match. Got up on the ladder to get ready to hand the new ones and the ones that were only hanging for about 20 days the grommets were rusting already.\n\nAll 3 curtains the grommets were rusting."
	   ],
	   "numberOfRates":81,
	   "avarageRate":3.7363093327880272,
	   "id":73
	},
	{
	   "productTitle":"Deconovo Navy Blue Valances for Window Kitchen Valance Grommet Tier Curtains for Living Room 52x18 Inch 2 Panels",
	   "desc":"",
	   "category":12,
	   "images":[
		  "61-kpbtfJzL._SY355_.jpg",
		  "61h%2B%2BI2NFFL._SY355_.jpg",
		  "61fr7NPK9FL._SY355_.jpg",
		  "61WkKiUL7SL._SY355_.jpg",
		  "71fDtXEyNBL._SY355_.jpg",
		  "71EOYBAq7FL._SY355_.jpg",
		  "615u4RIq7nL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"23.99",
	   "comments":[
		  "5 stars!!! These Thermal curtains are beautiful! They are so soft and well made. I ordered the dusty pink ones - the color is lovely. They hang well, not too thick not too thin, just perfect. I'm thinking of ordering more in different colors - very good quality for the price. Amazon service was 100% as usual. *****\n\n* UPDATE * January 2017. I ordered 2 more sets in grass green, the color is gorgeous. I recommend these curtains without hesitation. I ironed them on medium setting with steam to get the folds out. Very happy with my purchase. I have received many compliments.",
		  "Good, but don't claim to be something you're not.\nThe quality of these curtains is fantastic, the colour is also nice. Overall they're very nice curtains, especially for the price. That said, they are NOT blackout curtains and as such the seller should stop claiming them as such. They do a decent job of blocking light, but quite a bit still gets through.\n\nI recommend for any thing except a bedroom.",
		  "These curtains were great value for the price. Definitely darkens the room and they came with a set of velcro tiebacks.\n\nMatched my bedspread perfectly. I liked them so much, I've ordered another set in dark blue for the guest bedroom.",
		  "I ordered some other Deconovo curtains and the color was way off. I was uncertain with these when I ordered them, but the price was too good to pass up. I was pleasantly surprised as the color was fairly close to what is displayed. These block about 90% of the light which is what I was after. If you need more like blocking look else where or buy more. It was a bonus to find tie backs with these.",
		  "Was expecting a lighter product but got exactly what I was looking for! Very durable! Disappointed I spend hundreds of dollars elsewhere for the ones in my living room now! Color is pretty close. Find it more pink then lavender but still love them for our little girls room! Would recommend!! Will be purchasing more for around my house:)",
		  "They are ok but 1 star because they aren't as described at all. There are patches where the stitching isn't even. They 100% are not blackout, I don't understand why people are saying they are. They are very far from it. For what you pay they are top dollar for room darkening like I said they still have problems. Only reason I kept was because they gave me 30% off when I called them out on their complete lie. I know people don't take 1 star reviews serious but regardless you've been warned.",
		  "I was surprised to read some of the reviews saying that these were not full blackout curtains. They definitely are. There is always a small amount of light that finds its way around the grommet holes or between the panels if they are not closed fully. But I find they provide an inky blackness and I'm very happy with them. The fabric is very soft. No smell. And the colour is navy blue but more of a smokey navy blue than a deep navy blue.",
		  "These beauties just showed up at my front door even though i received an email yesterday stating that they might be late.\nActually showed up before estimated delivery date. Can't ask for better service, this is why i am a Prime member.\nNeeded these dark curtains for a bright living room that we watch movies and play video games in. They perform exactly as expected.\n\nVery Satisfied so far."
	   ],
	   "numberOfRates":42,
	   "avarageRate":2.3674750865285885,
	   "id":74
	},
	{
	   "productTitle":"nexxt Sydney Wall Shelf and Mail Holder with 3 Hooks, 24-Inch by 6-Inch, White",
	   "desc":"",
	   "category":13,
	   "images":[
		  "51YxoV%2B80nL._SX355_.jpg",
		  "51zqun5dU2L._SX355_.jpg",
		  "71kg-k74E4L._SY355_.jpg",
		  "81KgKeQXlHL._SY355_.jpg",
		  "91EvqexEhSL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"54.99",
	   "comments":[
		  "Just what I was looking for !\nOur keys and wallets would always be cluttering the mantle .. now it’s nice and organized !\nVery modern look , does not look cheap at all!\nTons of storage available on it, and a fantastic size !\nShipping was very quick as expected with amazon :)",
		  "As pictured. LOVE that the screw holes are 16\" apart, so you can actually mount on studs. That's a detail most people miss. Mounting hardware included was excellent. Two minor complaints: 1) The black coating on the rack chipped off as I was mounting, in one of the corners. Absolutely my fault but annoying, as it is white underneath. I coloured it in with a Sharpie. 2) The mail rack is as pictured, only fitting standard size envelopes not larger document mail. We will be using more for cheque books, phones, post office notices, etc. than to actually organize our mail.",
		  "I really like these small hooks in my entrance, holds my heaviest jacket perfect (Although that has more to do with the nails you use). I mostly bought it for the organizing of my mail though. I hate having a bunch of mail on my kitchen table, so I plop them in here until I have a moment to go through them. Love it.",
		  "I purchased this a few weeks ago and while the item came damaged, I was able to replace it quickly. The replacement was in near perfect condition (small scratches, but it was easy to cover them up with liquid paper).\n\nWhile the shelf was not very easy to hang (getting the screws leveled was a little difficult, so hanging this with 2 people and a level is a must), it is a beautiful shelf that serves multiple purposes. This piece looks beatiful on the wall and the great thing is that it is also very practical! I know that I will use this for years to come. Highly recommend this item to anyone that is looking for a modern looking wall storage piece.",
		  "Haven't installed it yet but it's well worth the pricetag. It does not feel cheap like cheap materials. I can't wait to put it up, its nice and smooth and looks really nice!\n\nOnly downside was I ordered it as a Christmas present and it was shipped in its original packaging. So there was no disguising what it was when it was left on our doorstep. Luckily it was not damaged as there only bubble wrap inside to protect it.\n\nWorth it!",
		  "The drywall screw supplied are horrible, do not use these to install this product. Take the time to go get REAL drywall screws if you don't want this thing ripping out of the wall with miniscule weight applied.\n\nCame in with some chipped paint, but otherwise it looks great, covered the chips and it does its job great with real drywall screws to hold it up",
		  "I love this key holder! It holds everything from our mail, keys, dog leash and wallets. It did arrive slightly damage which by reading all of the other reviews, seems very common. Maybe the company should re-visit their packaging? The piece acting as a mini shelf above the hooks was very wiggly. Nothing my husband couldn't fix though. Very happy with this product!",
		  "It was shipped in a thin box that was not taped closed. The shelf was wrapped in thin bubble wrap that did not cover the whole shelf.\nThe corner of the shelf was crushed so I requested a new one, which arrived the next day.\nThe new shelf was not damaged.\nThe shelf looks nice, seems like it would chip or break easily if joy handled with care."
	   ],
	   "numberOfRates":97,
	   "avarageRate":3.9554944966303207,
	   "id":75
	},
	{
	   "productTitle":"Kate Aspen Vintage Lantern, Blue",
	   "desc":"Kate Aspen began designing truly unique favors for weddings in 2004 and has been keeping up with customer demands by expanding into other party favors. Kate Aspen wedding favors are known for being unique, on trend, beautifully packaged and practical.Brides can choose from a large selection of wedding and bridal shower favors that coordinate with any wedding theme. The Kate Aspen line boasts a wide selection of personalized favors that include bottle stoppers, bottle openers, glassware, candles, luggage tags, coasters, favor boxes and containers, party bags, frames and place card holders.",
	   "category":11,
	   "images":[
		  "71mMp9d-F0L._SY606_.jpg",
		  "617sOjOYwtL._SY355_.jpg",
		  "91LzsCq2VXL._SX355_.jpg",
		  "51MA8TrFjrL._SY355_.jpg",
		  "51b2U0xgCjL._SY355_.jpg",
		  "416CPiVdUBL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"5.99",
	   "comments":[
		  "I ordered two of these. One was in original Kate Aspen Packaging, however the other wasn't. The lanterns are different sizes and material. The one in original packaging is cute. The other one feels cheap and worn.",
		  "these are so cute! yes, they are small, about the height of a soup can, but i expected that. i got three of these and three of another colour and will be hanging them across a window. these blue ones do have glass, and are a little fussy to get the lid off first time, but you do get the hang of it. they come with a tea light to get you started.",
		  "These are adorable! I bought two, but I would have them all over my house if I could. I love the colour, and they add so nicely to my living room decor. There was a little bit of assembly required, as the handles were not properly on, and that was a little bit tricky. But definitely worth it. I love them.",
		  "Look cute, but are very cheaply made. The glass on the inside flops around. Be careful not to cut yourself. Also I don't think that I want to light the candle inside. It looks like it might burn the paint off. I am just going to use it as a decoration without the light.",
		  "I couldn't stop laughing when I opened the box and pulled out a fairy's lantern. Very cute, however. Could be for you if you are looking for a very small accent decoration. Color is nice.",
		  "I used these for my Wedding center pieces ! Everyone loved them and the colour! Just note they are small. Size of a soup can 😀",
		  "Buyer Beware! The two lanterns that I received are not true Kate Aspen ones. They both look different from what is pictured on the product webpage. The window cut outs in mine are square shaped. The Kate Aspen ones are rectangular. I ordered two white Kate Aspen lanterns and they arrived in original Kate Aspen packaging, the blue ones did not. The difference in quality is obvious.",
		  "I got one for my wedding. I had a sign that read \"this candle burns in memory of those who couldn't be here today\". It was the perfect size that I could put it anywhere I wanted. Its is smaller that i thought but i love it just as much and I will be buying more to put around my house!"
	   ],
	   "numberOfRates":74,
	   "avarageRate":3.163621418196357,
	   "id":76
	},
	{
	   "productTitle":"Skip Hop Moonlight & Melodies Crib Soother and Baby Night Light, Owl",
	   "desc":"",
	   "category":12,
	   "images":[
		  "81jXtrSD7PL._SY355_.jpg",
		  "81DNXsaZbmL._SY355_.jpg",
		  "91BNG9JYEoL._SY355_.jpg",
		  "81DNXsaZbmL._SY355_.jpg",
		  "31TU143GP1L.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"54.95",
	   "priceIs":"43.96",
	   "comments":[
		  "Iam outraged. Wrapped this and gave to friend for baby shower and No PRODUCT!!!!!!!",
		  "My baby was one of those who never slept more than 3 hours a night (and refused to nap!) until well over 6 months. Like most parents we tried everything and this little owl was a big help! We prefer the \"wind\" sound as it's not annoying over the monitor. Not only does it lull baby to sleep, but I love the 3 timer settings (we generally keep it on infinity mode to drown out ambient noises). We've drilled into the wall right by the baby's room and my dog barks all the time and she never wakes up. The nightlight is also great because you can turn it very low and leave it on. And the little stars are great for distracting baby when changing her diaper. Overall, I love this little owl. It saved my sanity.",
		  "I just opened this box today so we’ll see about durability/quality.\nThe material seems ok - doesn’t look high quality but its cute. The cord is a little short but if you have a plug next to your table, it should be enough.\nThe sound - i was expecting it to be louder ... not sure if the high volume will replace the sound my fan makes. its definitely not as loud as i thought. the noght light is good ... not too strong ... enough to see in the dark.\nI bought it to replace the fan in my baby’s room since I don’t like to have the fan turned on all night, every night. We’ll see how it compares and if my baby sleeps well.\nThe projector is not very strong but i really don’t care about it.",
		  "I now have 2 of these.. 1 in each kids bedroom.\nAs soon as the stars go to sleep (shut off on set timer).. it's time to close your eyes and go to sleep as well.\nOption of timed lullabies with or without the stars reflecting on the ceiling.\nNewer model has option of USB plug in.. helpful if taking on trips with you to maintain some sort of consistency/routine.. hotels often have multiple USB ports for charging.\nThis owl has definitely made our bedtime routine easier..",
		  "Oh my god... this thing has been a life saver. I bought one for my son as he is such a light sleeper. It solved my problems instantly! I welcomed my daughter this summer and I bought one for her too. I also bought one for my friend for her baby shower and she is very happy with it! I love that it plugs in so you can keep it turned on all night. We use the white noise sound but I love that there are so many different sound options. Also love the night light as my son as just started fearing the dark! Definitely recommend this product!",
		  "Although the songs aren't all that soothing, we've been using the white noise option almost every night since he was born. The projected stars are a nice feature, and can be turned on and off independently of the main night light.\nCons: all settings are lost if you unplug the light. Music is not very relaxing or soothing.",
		  "Our little one started putting herself to sleep instantly when I purchased this 5 months ago. Honestly I purchased the travel sized battery operated one first since I was skeptical about the effectiveness of a sound machine.\n\nI ate my words.\n\nThe child who had never put herself to sleep instantly went to bed in her bassinet with no rocking or swaddling or bouncing. She also really minded the car for the first few months of her life and the travel version of this really came in handy when we had to travel anywhere.\n\nI purchased this one and am thankful that it plugs in. We don’t really use any of the other features, but the light on the belly is a nice addition as you can adjust the brightness. My older son is jealous of the stars that project onto the ceiling as well, but she doesn’t seem to care if they are on or off.\n\nI recommend this to any parent ready to pull their hair out ready to try anything... that’s where I was.",
		  "very cute seems to work well. I have not used it much as the baby has not arrived yet but all trial runs worked and no concerns found. my friend has the same one and has been using it daily for almost a year with no problems."
	   ],
	   "numberOfRates":163,
	   "avarageRate":4.757425540495281,
	   "id":77
	},
	{
	   "productTitle":"Flickering Battery Powered Flameless Real Wax LED Pillar Candle Set with Timer Remote, Valentine's Day Romantic Home Décor",
	   "desc":"",
	   "category":12,
	   "images":[
		  "712eUCyccYL._SX425_.jpg",
		  "715rI8Ds3RL._SY355_.jpg",
		  "71VaW0Nl8QL._SY355_.jpg",
		  "81Q5D%2BGM5%2BL._SY355_.jpg",
		  "61a4o9DLujL._SY355_.jpg",
		  "616hSwa2f-L._SY355_.jpg",
		  "51BvJcGZElL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"32.16",
	   "comments":[
		  "Was given as a gift, but I have been told that they love it. Just want they were looking for.",
		  "Love the remote. I have received compliments from friends. Many comments on how real they look"
	   ],
	   "numberOfRates":122,
	   "avarageRate":2.9505370982600447,
	   "id":78
	},
	{
	   "productTitle":"Sterling Silver Turtle Family Necklace, 18\"",
	   "desc":"Sterling silver is a combination of 92.5% fine (pure) silver and 7.5% other metals, usually copper. Natural mined silver, called fine silver, is too soft for producing jewelry and must be combined with another strong metal. Sterling silver jewelry is traditionally stamped 925.Sterling silver jewelry is often plated with rhodium to keep the jewelry shiny and offer tarnish resistance. Other platings include yellow gold, rose gold, platinum, and black rhodium, which gives a shiny gunmetal finish.Polish silver frequently with a jewelry polishing cloth for best results. Note that use of tissue or paper towels can cause scratches because of fibers. For oxidized silver jewelry, you will only want to polish with a jewelry cloth to maintain the natural patina of the silver.",
	   "category":14,
	   "images":[
		  "81lmp9nWUBL._UY500_.jpg",
		  "71ZSeQAbeGL._UX395_.jpg",
		  "61MqoBmlQlL._UY500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Amazon Collection",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"rose-gold-plated-silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"Fine-other-material",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"no-setting-type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.84 inches",
			 "val: ":"Height"
		  },
		  null,
		  {
			 "Key: ":"1.5 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"18 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Cable",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"3.55 grams",
			 "val: ":"Total Metal Weight﻿"
		  },
		  null,
		  {
			 "Key: ":"S0A4Z59718",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":"52.88",
	   "priceIs":"41.25",
	   "comments":[
		  "It's very cute but the chain is the thinnest I have ever seen and I don't have a lot of hope it will last long. When it arrived it was in a knot behind the velvet backing so when my daughter opened it she couldn't put it on right away. Instead we had to spend 25 minutes getting the knot out of the chain. A small piece of tape on the back before shipping would have been considerate.",
		  "This is such a sweet necklace, it is close to my heart for sure. My children got this for me for Christmas and they did all on their own. It fits perfect and I absolutely love it! It is a priceless gift for me and I will treasure it for always. I have three kids so it is one turtle for each child. Its perfect!",
		  "Would have been the perfect gift for my sister who loves turtles and has two boys... Except it came broken :/ I don't know why it won't let me upload a photo but I suggest not buying, very cheaply made",
		  "I purchased this for my wife and she loves it. The chain isn't too long, and it sits just right around her collar versus down her chest. The turtles aren't too large and didn't get in the way when she moved. It looks great, just like the picture and feels sturdy. I don't worry about the turtles snapping off.",
		  "Beautiful!! I absolutely love it"
	   ],
	   "numberOfRates":42,
	   "avarageRate":1.7601926596108215,
	   "id":79
	},
	{
	   "productTitle":"JewelryPalace Eternity 7ct Created Blue Spinel Statement Ring Channel Sets 925 Sterling Silver",
	   "desc":"",
	   "category":16,
	   "images":[
		  "71B-ozj2ahL._UY395_.jpg",
		  "51iJuYbblIL._UY395_.jpg",
		  "81nFnIRDRoL._UY395_.jpg",
		  "618azAovgKL._UY395_.jpg",
		  "81SJKu8bN1L._UY395_.jpg",
		  "610bBg-gVCL._UY395_.jpg",
		  "814S0IWZNRL._UY395_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Jewelrypalace",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"S925",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"gemstone",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"spinel",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Band-Setting",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.89 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"7",
			 "val: ":"Ring Size"
		  },
		  null,
		  {
			 "Key: ":"7.68 carats",
			 "val: ":"Stone Weight"
		  },
		  null,
		  {
			 "Key: ":"CA-AR26297207",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"59.99",
	   "comments":[
 
	   ],
	   "numberOfRates":17,
	   "avarageRate":4.8248688061148,
	   "id":80
	},
	{
	   "productTitle":"Destina 7-8mm AAAA Quality Freshwater 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":15,
	   "images":[
		  "61h2iq76iPL._UX395_.jpg",
		  "61RtxyNtE1L._UX395_.jpg",
		  "61u0aoZJF8L._UX395_.jpg",
		  "716O57wUUKL._UY500_.jpg",
		  "81A7aYkWu6L._UX395_.jpg",
		  "71M3kngreDL._UX395_.jpg",
		  "41MtLqesCjL._UY395_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"cubic-zirconia",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"0.02 carats",
			 "val: ":"Minimum total gem weight﻿"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.80 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.30 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"0.80 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"4",
			 "val: ":"Number of Stones"
		  },
		  null,
		  {
			 "Key: ":"0.02 carats",
			 "val: ":"Stone Weight"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-B-AAAA-78-P-Destina",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"129.00",
	   "comments":[
		  "As advertised. Great price, fast delivery, very pleased.",
		  "Very nice, but my wife's friends had fun calling her a pirate. Maybe a black pearl wasn't the best choice for a gift...",
		  "Beautiful black pearl pendant.",
		  "Absolutely beautiful!",
		  "The pearl was dull and I really wish you could pick what size of the chain.",
		  "It's pretty and delicate, l like it :)."
	   ],
	   "numberOfRates":194,
	   "avarageRate":3.393009577476739,
	   "id":81
	},
	{
	   "productTitle":"Heart 9-10mm AA Quality Freshwater 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":15,
	   "images":[
		  "61iEZDMxD-L._UX500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"cubic-zirconia",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"0.061 carats",
			 "val: ":"Minimum total gem weight﻿"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.90 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.80 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"0.90 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"1",
			 "val: ":"Number of Stones"
		  },
		  null,
		  {
			 "Key: ":"0.061 carats",
			 "val: ":"Stone Weight"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-B-Fresh-pend-S-910-Heart",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"105.00",
	   "comments":[
		  "Pearl is more of a green tinge despite the lighting. The overall necklace comes with an appraisal for half of what you pay. I returned all three of mine. They looked gorgeous in each colour until they arrived...they just were not the same",
		  "I purchased this item as a \"future\" gift for my gf on the week before Valentine's day, not expecting it to arrive until later in February. I picked the free shipping option which was not Amazon Prime two-day shipping. This pearl necklace was on sale for 50% off so it was a pretty good deal to not pass on, not even sure if she likes pearls haha. To my astonishment, I received it in the mail 4 days after I purchased it, still a few days before Valentines. I wonder if they expedited shipping for potential last minute guys buying gifts? Anyways that was great.\n\nThe packaging is very comprehensive and you get a document of authenticity and some flawed pearls from the same batch in a small plastic bag to compare the necklace with. There's a small cloth bag with a nice pattern on it too. Very nice presentation. The pearl necklace itself looks very nice and quite high quality for how much it you pay.",
		  "The Pink Pearl is stunning, of high quality. Love the classic design of the pendant. The silver chain is a bit more delicate than expected, however. it is as depicted in the picture. Perhaps the fine chain is a better match for this pendant than a heavier chain would be. Overall, this is a beautiful piece of jewellery. Am very happy with my purchase.",
		  "Packaging and pearl quality is what really stands out about this item. The stone casing at the top is crooked on the one I received, I will try to - softly - straighten it if I can without breaking it. Comes with a certificate of authenticity and more paperwork. Quite nice really.",
		  "I was given this for Christmas and it is beautiful. One star was withheld because I didn’t see anywhere on the listing that it was not a naturally black pearl but on the paper work for the pearl it states it is dyed",
		  "Ordered three different colored pearls for my granddaughters and they were all different in size and the width of the heart pendant also varied in size! The black pearl was significantly smaller than the other two.",
		  "Ordered three different colored pearls for my granddaughters and they were all different in pearl size and the width of the heart pendant! One pearl was significantly smaller than the other two.",
		  "Ordered three different colored pearls for my granddaughters and they were all different in pearl size and the width of the heart pendant! One pearl was significantly smaller than the other two."
	   ],
	   "numberOfRates":171,
	   "avarageRate":4.332990758605057,
	   "id":82
	},
	{
	   "productTitle":"Black Jasmine White 5-6mm A Quality Freshwater Cultured Pearl Necklace-18 in Princess Length",
	   "desc":"",
	   "category":14,
	   "images":[
		  "71FW-t4oj1L._UX535_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"Not stamped",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"base﻿",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"18 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.40 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"18 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"other-chain-type",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"no-clasp-type",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-B-A-56-N-Jasmine",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"69.00",
	   "comments":[
		  "I just received this necklace. It is so delicate and beautiful. It was very nicely packaged and the looks amazing when worn. This is easily paired with a pair if pearls studs. I am really happy I discovered i on Amazon.",
		  "Stunning!!!!",
		  "Beautiful and well designed. Very elegant",
		  "I wanted to find that one-more-gift for Christmas for my girlfriend, and found I could get an excellent deal on this necklace. I was a bit skeptical at first (because I read another review here from a disappointed customer)... to be honest I went so far as to open the necklace to examine it before I ever told my girlfriend I got it for her, just in case it wasn't good enough.\n\nThe necklace absolutely passed my inspection. While the box it came in wasn't exactly a Tiffany's high-quality protective box, it came with some extra sample pearls, it came with a neat little pouch for storage, and the necklace itself was much better than I expected.\n\nMy girlfriend loved it.",
		  "I bought this as a birthday present for my mother and I am quite pleased with this pearl necklace. The pearls are beautiful and the necklace is different, which my mother will like. I also am more than happy with the price. The only thing I am disappointed about is that I did not receive all of the products that were supposed to come with the necklace. I did not receive the extra pearls, or the PearlsOnly VIP Card, which I would have liked since I plan to buy from this company again. I have to say I am amazed with Amazon's shipping. I ordered the necklace at about 9 PM last night for overnight shipping and I received the package at around 11 AM this morning. I would have given this a 5 star review if not for the missing products.",
		  "Really chic and trendy. My 14 year old daughter loves it",
		  "Great quality,service, and price. Shipping was very timely. Love shopping on amazon. Especially with my prime account and free two day shipping. My wife loved the pearls and they were certified. I wasn't sure what they were strung on when I bought them, it's a cloth like material that is transparent.",
		  "I found this a very nice and stylish necklace. i bought it for my young mother and she loved it. The wrap looks very nice too, so it makes a wonderful present for someone, without looking cheap. very classy, i will not regret."
	   ],
	   "numberOfRates":160,
	   "avarageRate":0.1491878792057033,
	   "id":83
	},
	{
	   "productTitle":"Sophia Black and White 5-7mm A Quality Freshwater Cultured Pearl Necklace-18 in Princess length",
	   "desc":"",
	   "category":16,
	   "images":[
		  "61KvewWBWYL._UX535_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"Not stamped",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"base﻿",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"18 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.40 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"18 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"no-chain-type",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"no-clasp-type",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-BW-F-57-Sophia",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"75.00",
	   "comments":[
		  "this pearl necklace is well worth the price, good craftsmanship and unique design",
		  "The pearls are a funny color, the necklace does not lay flat, and the connectors don't fit well. I want to like this necklace. I love pearls! This is just an ugly piece of jewelry, in my opinion, with a clunkiness where none should be.",
		  "Took it back - it looked so cheap. It made me not fall again for buying jewelery on-line. You can get better deals and with more interesting pieces if instead of browsing the net you actually go to the mall!",
		  "The necklace looks so good in the photo, but unfortunately the metal tubing between the pearls won't lay correctly to give the pretty, round appearance. Many of the pieces kept twisting around so that they lay inward. It ruined the whole effect, making the necklace look bumpy and awkward, and cheap. Very disappointing, poorly-made necklace.",
		  "Would give a 5 star, except black pearls look more of a lavender than black. Everyone that has looked at them, says the same thing.",
		  "As advertised and expected. Can't really ask for more -- except lower price?"
	   ],
	   "numberOfRates":163,
	   "avarageRate":1.3750953619175683,
	   "id":84
	},
	{
	   "productTitle":"Rocio 9-10mm AA Quality Freshwater 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":15,
	   "images":[
		  "61XN%2BMGaUsL._UX500_.jpg",
		  "71N-b4QQrDL._UY500_.jpg",
		  "61bJvbhAg2L._UX500_.jpg",
		  "71NCM-BlZ2L._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71VZ2-YvH7L._UX500_.jpg",
		  "41MtLqesCjL.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.60 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.60 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"0.60 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-B-AA-910-P-Rocio",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"105.00",
	   "comments":[
		  "Good.",
		  "Looks very nice and stylish. Would definitely recommend!",
		  "Lovely pearl necklace which hangs nicely. The pearl is. A little larger than I expected but is pretty. The clasp is very small....could have used a bigger claw type clasp to make for easy on and off. Otherwise, a keeper .",
		  "Nice quality and beatiful. Will buy other jewelries from this seller in the future.",
		  "Product was similar to picture. No surprises. Overall happy with product.",
		  "Original deign and Beautiful",
		  "It's very beautiful. When I wear it, I get a lot of compliment. If the pearl is more shiny, that will be super. However, considering the price, it's a deal. The company has a lot of good products. I bought another set from them too."
	   ],
	   "numberOfRates":75,
	   "avarageRate":3.05581804293231,
	   "id":85
	},
	{
	   "productTitle":"Single White 7-8mm A Quality Freshwater 925 Sterling Silver Cultured Pearl Necklace",
	   "desc":"",
	   "category":15,
	   "images":[
		  "61k31CwXrZL._UX500_.jpg",
		  "61Twj-kq27L._UX500_.jpg",
		  "610TGgRBS1L._UX500_.jpg",
		  "71mHOjl2f6L._UX500_.jpg",
		  "71O7azTnQLL._UX500_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71pHP1kdIiL._UY675_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"strung",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.40 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"16 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"no-chain-type",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"other-clasp-type",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-W-A-78-N-16",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"99.00",
	   "comments":[
		  "Very pleased with this order! Outstanding quality for the price!",
		  "A truly nice necklace at a reasonable price.",
		  "Very uneven shaped pearls, many are egg shaped. They look cheap, and I am sending them back."
	   ],
	   "numberOfRates":100,
	   "avarageRate":4.728920011128935,
	   "id":86
	},
	{
	   "productTitle":"Boxing Glove Titanium Steel Necklace, Punk Pendant Necklace for Women Men",
	   "desc":"",
	   "category":15,
	   "images":[
		  "610gfbyn8kL._UY500_.jpg",
		  "61OJhaxWrTL._UY500_.jpg",
		  "41%2BUGqOLQcL.jpg",
		  "41iyXu4VthL.jpg",
		  "61NAOpuI0mL.jpg",
		  "31yMV6fTQnL.jpg",
		  "61raT%2B87lDL._UY500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Joeyan",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"No-metal-stamp",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"titanium-and-stainless-steel",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"Titanium Steel",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other Chain Type",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"YKJ0013A",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"25.15",
	   "comments":[
 
	   ],
	   "numberOfRates":48,
	   "avarageRate":1.9182166605762911,
	   "id":87
	},
	{
	   "productTitle":"Jasmine White 5-6mm A Quality Freshwater Cultured Pearl Necklace-18 in Princess length",
	   "desc":"",
	   "category":16,
	   "images":[
		  "71zlI-JT0iL._UX500_.jpg",
		  "71Cd2MA1k2L._UX500_.jpg",
		  "710RtMtlDPL._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71JlVAwTgVL._UX500_.jpg",
		  "41MtLqesCjL.jpg",
		  "51EsVHx6ycL._UY500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"Not stamped",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"base﻿",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.40 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"18 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"other-chain-type",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"no-clasp-type",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-W-A-56-N-Jasmine",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"69.00",
	   "comments":[
		  "This is not great jewelry, but it looks pretty and is perfect for when you want to wear pearls but in a more contemporary way. (You can wear it with jeans, in other words). The pearls themselves were a little more cream-colored (rather than white) than they showed in the picture. I'd give it a five stars, because I really do like it, except I doubt it'll be very long-wearing. The ribbons aren't flimsy, but they aren't something you could wear every day, either.\n\nIt's also perfect for a teenage girl who wants something pretty to wear out to dinner that doesn't make her look 40.",
		  "Elegant and ivory white, it's a simple beautiful necklace, goes well with just about anything",
		  "Our daughter asked for something in fresh water pearls for Christmas. At 14 she wasn't wanting the traditional strand, yet wanted to feel special. This was the perfect gift. Goes with fancy dress and blue jeans. Price is reasonable; constructed well and was shipped promptly.",
		  "Didn't wear it at all. This is cheaply made and doesn't look the same as the picture.",
		  "I purchased this as a christmas gift for a friend. This is a very cute little necklace. It is delicate and colors are soft and creamy."
	   ],
	   "numberOfRates":10,
	   "avarageRate":4.598634433173746,
	   "id":88
	},
	{
	   "productTitle":"Sally 9-10mm AA Quality Freshwater 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":15,
	   "images":[
		  "61ga2xLUPHL._UX500_.jpg",
		  "61Zh7cXCXTL._UX500_.jpg",
		  "71x%2Bfkk86SL._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71EGn8hWEFL._UX500_.jpg",
		  "41MtLqesCjL.jpg",
		  "51EsVHx6ycL._UY500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"17.50 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.40 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"17.50 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-P-AA-910-P-Sally",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"89.00",
	   "comments":[
		  "I must have missed reading that this was not a completely round pearl......flatter on both sides so it sits nicely in place when worn. I just love that feature and the luster of the pearl along with the setting looks wonderful!",
		  "Excellent product at a good price. Packaging included history and quality explanation very well presented. Follow up from the company was very positive right from delivery to post sales. I would purchase from this vendor again.",
		  "Beautiful and so pleased with it I love the glow it gives and looks so simple and elegant. The flatter back keeps it from rolling around",
		  "Bought as a present. Received with smiles! Guess it was a hit!",
		  "Nice pearl, I'm happy with my purchase!",
		  "great",
		  "Très classe et beau, belle qualité.",
		  "They look great - it said small flaw - cant find it - must be really small"
	   ],
	   "numberOfRates":192,
	   "avarageRate":2.094115056947308,
	   "id":89
	},
	{
	   "productTitle":"Boxing Glove Titanium Steel Necklace, Punk Pendant Necklace for Women Men",
	   "desc":"",
	   "category":14,
	   "images":[
		  "61TSOfW%2BC4L._UY500_.jpg",
		  "71Nw-aObDOL._UY500_.jpg",
		  "51uMk4vqAlL.jpg",
		  "51GqzhsY6bL.jpg",
		  "41HhaTYd%2BJL.jpg",
		  "61mYS-SMN7L._UY500_.jpg",
		  "31yMV6fTQnL.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Joeyan",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"No-metal-stamp",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"titanium-and-stainless-steel",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"Titanium Steel",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other Chain Type",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"YKJ0013D",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"23.33",
	   "comments":[
 
	   ],
	   "numberOfRates":59,
	   "avarageRate":4.823940044175787,
	   "id":90
	},
	{
	   "productTitle":"Black 8.5-9mm AA Quality Freshwater 10K White Gold Cultured Pearl Necklace",
	   "desc":"",
	   "category":15,
	   "images":[
		  "61VbdFZIVdL._UX500_.jpg",
		  "61Lu5MnvWCL._UX500_.jpg",
		  "61Kdk046V8L._UX500_.jpg",
		  "71ARA0lAliL._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71kBNdhry8L._UX500_.jpg",
		  "5147X3pafRL.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"10k",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"white-gold﻿",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"strung",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.40 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"16 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"no-chain-type",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"single-strand-fishhook",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-B-AA-89-N-16-inch",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"205.00",
	   "comments":[
 
	   ],
	   "numberOfRates":70,
	   "avarageRate":5.616682398561407,
	   "id":91
	},
	{
	   "productTitle":"Heart 9-10mm AA Quality Freshwater 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":14,
	   "images":[
		  "61TngmR4iIL._UX500_.jpg",
		  "61Gs-oGQ-vL._UX500_.jpg",
		  "71BEi8T0b3L._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71xwI8xBxfL._UX500_.jpg",
		  "41MtLqesCjL.jpg",
		  "51EsVHx6ycL._UY500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"cubic-zirconia",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"0.061 carats",
			 "val: ":"Minimum total gem weight﻿"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.90 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.80 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"0.90 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"1",
			 "val: ":"Number of Stones"
		  },
		  null,
		  {
			 "Key: ":"0.061 carats",
			 "val: ":"Stone Weight"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-W-Fresh-Pend-S-10-heart",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"109.00",
	   "comments":[
		  "Pearl is more of a green tinge despite the lighting. The overall necklace comes with an appraisal for half of what you pay. I returned all three of mine. They looked gorgeous in each colour until they arrived...they just were not the same",
		  "I purchased this item as a \"future\" gift for my gf on the week before Valentine's day, not expecting it to arrive until later in February. I picked the free shipping option which was not Amazon Prime two-day shipping. This pearl necklace was on sale for 50% off so it was a pretty good deal to not pass on, not even sure if she likes pearls haha. To my astonishment, I received it in the mail 4 days after I purchased it, still a few days before Valentines. I wonder if they expedited shipping for potential last minute guys buying gifts? Anyways that was great.\n\nThe packaging is very comprehensive and you get a document of authenticity and some flawed pearls from the same batch in a small plastic bag to compare the necklace with. There's a small cloth bag with a nice pattern on it too. Very nice presentation. The pearl necklace itself looks very nice and quite high quality for how much it you pay.",
		  "The Pink Pearl is stunning, of high quality. Love the classic design of the pendant. The silver chain is a bit more delicate than expected, however. it is as depicted in the picture. Perhaps the fine chain is a better match for this pendant than a heavier chain would be. Overall, this is a beautiful piece of jewellery. Am very happy with my purchase.",
		  "Packaging and pearl quality is what really stands out about this item. The stone casing at the top is crooked on the one I received, I will try to - softly - straighten it if I can without breaking it. Comes with a certificate of authenticity and more paperwork. Quite nice really.",
		  "I was given this for Christmas and it is beautiful. One star was withheld because I didn’t see anywhere on the listing that it was not a naturally black pearl but on the paper work for the pearl it states it is dyed",
		  "Ordered three different colored pearls for my granddaughters and they were all different in size and the width of the heart pendant also varied in size! The black pearl was significantly smaller than the other two.",
		  "Ordered three different colored pearls for my granddaughters and they were all different in pearl size and the width of the heart pendant! One pearl was significantly smaller than the other two.",
		  "Ordered three different colored pearls for my granddaughters and they were all different in pearl size and the width of the heart pendant! One pearl was significantly smaller than the other two."
	   ],
	   "numberOfRates":93,
	   "avarageRate":3.974473278404024,
	   "id":92
	},
	{
	   "productTitle":"Tin Cup White 7-8mm AA Quality Freshwater 925 Sterling Silver Cultured Pearl Necklace-17.5 in length",
	   "desc":"",
	   "category":14,
	   "images":[
		  "61lhzMgtvdL._UX500_.jpg",
		  "61o7MZ2UxTL._UX500_.jpg",
		  "7162mOMTWwL._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71xiPc7xgwL._UX500_.jpg",
		  "5147X3pafRL.jpg",
		  "51EsVHx6ycL._UY500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"17.50 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.30 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"17.50 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-W-AA-78-N-Station",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"115.00",
	   "comments":[
		  "The pearls are very dull and ALL of them show a lot of blemishes. Some of them do have visible scratches that you can notice from the distance. I'm a pearl fan and do have experience purchasing pearls. I know these are not Akoya's so I wasn't expecting something perfect but for AA quality pearls, these are too far below my expectations.\n\nI'm giving it two stars because the packaging was good."
	   ],
	   "numberOfRates":189,
	   "avarageRate":1.3465607886901432,
	   "id":93
	},
	{
	   "productTitle":"Heart 9-10mm AA Quality Freshwater 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":15,
	   "images":[
		  "612GvZ0Au1L._UX500_.jpg",
		  "614oy29GXLL._UX500_.jpg",
		  "71z-WC8t1YL._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "41vBNoeti6L.jpg",
		  "41MtLqesCjL.jpg",
		  "51EsVHx6ycL._UY500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"cubic-zirconia",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"0.061 carats",
			 "val: ":"Minimum total gem weight﻿"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.90 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.80 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"0.90 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"1",
			 "val: ":"Number of Stones"
		  },
		  null,
		  {
			 "Key: ":"0.061 carats",
			 "val: ":"Stone Weight"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-P-Fresh-pend-S-910-Heart",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"105.00",
	   "comments":[
		  "Pearl is more of a green tinge despite the lighting. The overall necklace comes with an appraisal for half of what you pay. I returned all three of mine. They looked gorgeous in each colour until they arrived...they just were not the same",
		  "I purchased this item as a \"future\" gift for my gf on the week before Valentine's day, not expecting it to arrive until later in February. I picked the free shipping option which was not Amazon Prime two-day shipping. This pearl necklace was on sale for 50% off so it was a pretty good deal to not pass on, not even sure if she likes pearls haha. To my astonishment, I received it in the mail 4 days after I purchased it, still a few days before Valentines. I wonder if they expedited shipping for potential last minute guys buying gifts? Anyways that was great.\n\nThe packaging is very comprehensive and you get a document of authenticity and some flawed pearls from the same batch in a small plastic bag to compare the necklace with. There's a small cloth bag with a nice pattern on it too. Very nice presentation. The pearl necklace itself looks very nice and quite high quality for how much it you pay.",
		  "The Pink Pearl is stunning, of high quality. Love the classic design of the pendant. The silver chain is a bit more delicate than expected, however. it is as depicted in the picture. Perhaps the fine chain is a better match for this pendant than a heavier chain would be. Overall, this is a beautiful piece of jewellery. Am very happy with my purchase.",
		  "Packaging and pearl quality is what really stands out about this item. The stone casing at the top is crooked on the one I received, I will try to - softly - straighten it if I can without breaking it. Comes with a certificate of authenticity and more paperwork. Quite nice really.",
		  "I was given this for Christmas and it is beautiful. One star was withheld because I didn’t see anywhere on the listing that it was not a naturally black pearl but on the paper work for the pearl it states it is dyed",
		  "Ordered three different colored pearls for my granddaughters and they were all different in size and the width of the heart pendant also varied in size! The black pearl was significantly smaller than the other two.",
		  "Ordered three different colored pearls for my granddaughters and they were all different in pearl size and the width of the heart pendant! One pearl was significantly smaller than the other two.",
		  "Ordered three different colored pearls for my granddaughters and they were all different in pearl size and the width of the heart pendant! One pearl was significantly smaller than the other two."
	   ],
	   "numberOfRates":96,
	   "avarageRate":0.5675745095103157,
	   "id":94
	},
	{
	   "productTitle":"Katie Heart 9-10mm AA Quality Freshwater 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":16,
	   "images":[
		  "61zWQvrbjaL._UX500_.jpg",
		  "71h4Vrw7cxL._UY625_.jpg",
		  "61aQ614TGCL._UX500_.jpg",
		  "71fmz0n19HL._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "41vBNoeti6L.jpg",
		  "41MtLqesCjL.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"cubic-zirconia",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"0.168 carats",
			 "val: ":"Minimum total gem weight﻿"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.70 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.60 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"0.70 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"2",
			 "val: ":"Number of Stones"
		  },
		  null,
		  {
			 "Key: ":"0.168 carats",
			 "val: ":"Stone Weight"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-W-AA-910-P-Katie",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"105.00",
	   "comments":[
		  "looks great",
		  "Perfect and just beautiful",
		  "Very nice piece of jewelry.My wife loved it.The jewelry came very guick with no issue I would diffently recommend this chain .",
		  "Very please good quality for the price.",
		  "Very good",
		  "A++ beautiful item",
		  "A beautiful piece of jewelry. Looks just like the picture.\nNecklace comes in a box, with a little satin bag for safe keeping, a certificate, and a few pearls that didn't make the cut. Very cute.\nIt was a wonderful surprise for Valentine's Day.\n\nI am planning on purchasing from them again. I will be keeping an eye on their sales, but have no problem paying full price for such stunning pieces.\n\n~The Wife",
		  "Girlfriend seemed to like it. Lol. I thought it was pretty nice when I saw it. My one complaint would be that the necklace isn't balanced. In the few days since I gave it to her I often notice it flips around backwards. My opinion is that it's because of the design."
	   ],
	   "numberOfRates":101,
	   "avarageRate":5.262613826988402,
	   "id":95
	},
	{
	   "productTitle":"Empress Pink 7-8mm AA Quality Freshwater 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":15,
	   "images":[
		  "614lLGrG53L._UY575_.jpg",
		  "61NPBDaXTyL._UX535_.jpg",
		  "71DsEOyBEWL._UY695_.jpg",
		  "81A7aYkWu6L._UX535_.jpg",
		  "41MtLqesCjL.jpg",
		  "71NcgKwYiNL._UX535_.jpg",
		  "51EsVHx6ycL._UY535_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.70 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.50 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"0.70 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-P-Fresh-Pend-S-77-Empress",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"119.00",
	   "comments":[
		  "I think I bought these for around 30, not 50, or anything higher. It is an okay necklace, the silver tarnishes, and the pearl has come a little loose over the last 3 years. I bought these for my wedding party and they were well received. It is a nice enough necklace, but the silver isn't treated to prevent tarnishing, which just doesn't make sense - they are marketing this more as fine jewelry. I would buy it again for what I paid, but not what it's currently priced at.",
		  "Beautiful and delicate. The pink is pale and silky. I purchased this for a June birthday and I know she will love it.",
		  "I purchased this item for my son's girlfriend. She loved it!\nThanks for the prompt service and the \"extra\" goodies in the package!"
	   ],
	   "numberOfRates":93,
	   "avarageRate":0.10401501692773918,
	   "id":96
	},
	{
	   "productTitle":"Trinity 6-7mm AA Quality Japanese Akoya 925 Sterling Silver Cultured Pearl Pendant",
	   "desc":"",
	   "category":15,
	   "images":[
		  "71EATP73YyL._UX500_.jpg",
		  "61p5JCMLnPL._UX500_.jpg",
		  "61l%2BlkYtgrL._UX500_.jpg",
		  "714gvfK6%2BkL._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71kBzUi7jLL._UX500_.jpg",
		  "5147X3pafRL.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"Other type",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.50 inches",
			 "val: ":"Item Length"
		  },
		  null,
		  {
			 "Key: ":"0.50 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"0.50 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"Box",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"Spring ring",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-JAK-B-AA-67-P-Trinity",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"115.00",
	   "comments":[
		  "I got this for mt grandmother.And she cryd! Any women of any age would love this neaklace!!!!"
	   ],
	   "numberOfRates":160,
	   "avarageRate":5.3938706489992345,
	   "id":97
	},
	{
	   "productTitle":"Joyce White 8-9mm A Quality Freshwater 925 Sterling Silver Cultured Pearl Necklace",
	   "desc":"",
	   "category":15,
	   "images":[
		  "61Yiy3Mi8ZL._UX500_.jpg",
		  "61FwaoHnA6L._UX500_.jpg",
		  "61DB1WC1rHL._UX500_.jpg",
		  "61U0jad6H6L._UX500_.jpg",
		  "71PneloiIrL._UY675_.jpg",
		  "81A7aYkWu6L._UX500_.jpg",
		  "71N9SrmU8iL._UX500_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"PearlsOnly",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"925 Sterling",
			 "val: ":"Metal Stamp﻿"
		  },
		  null,
		  {
			 "Key: ":"Sterling silver",
			 "val: ":"Metal﻿"
		  },
		  null,
		  {
			 "Key: ":"pearl",
			 "val: ":"Material"
		  },
		  null,
		  {
			 "Key: ":"NA",
			 "val: ":"Gem Type"
		  },
		  null,
		  {
			 "Key: ":"strung",
			 "val: ":"Setting"
		  },
		  null,
		  {
			 "Key: ":"0.40 inches",
			 "val: ":"Width"
		  },
		  null,
		  {
			 "Key: ":"23 inches",
			 "val: ":"Length"
		  },
		  null,
		  {
			 "Key: ":"no-chain-type",
			 "val: ":"Chain Type"
		  },
		  null,
		  {
			 "Key: ":"other-clasp-type",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"No",
			 "val: ":"Resizable﻿"
		  },
		  null,
		  {
			 "Key: ":"CA-AMZ-FW-W-A-89-N-Joyce",
			 "val: ":"Model Number"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"145.00",
	   "comments":[
		  "whe have bought other tyhings from pearlys only and are very satisfied everytime. good quality"
	   ],
	   "numberOfRates":50,
	   "avarageRate":2.84570752276981,
	   "id":98
	},
	{
	   "productTitle":"Under Armour Womens Micro G Assert 7 Sneaker",
	   "desc":"",
	   "category":17,
	   "images":[
		  "71nl1P4zSAL._UX575_.jpg",
		  "71zvnojqIXL._UY575_.jpg",
		  "71p1rb9GqhL._UX575_.jpg",
		  "71J7w1wfKuL._UY695_.jpg",
		  "71hUeO3aBNL._UX575_.jpg",
		  "71nlynSWiWL._UX575_.jpg",
		  "81C%2BVb9Q-ZL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"53.05 - 246.76",
	   "comments":[
		  "just got these sneakers yesterday and i already wore them outside today. love the construction,the colour combo, the sole adds about an inch in height which i like and are very comfortable. i have trouble finding sneakers that dont rub on the heel and on the side of the ankles and these sneakers dont do that. thank goodness because i really love them! however i always wear a sock in my sneakers so not sure if they would rub if worn without socks. i did get size 7.5 even though i am usually a 7....the reviews said order a half size up and its a good thing i did.",
		  "I normally wear a size 10. I bought a size 11 assuming they would be too small by the reviews on Amazon.com. I'm glad I did, the size 11 fits perfectly and they're very comfy!! Love these.",
		  "Got this on an impulse buy. I needed new running shoes and honestly, I’m lot into colours and glitz. I wanted a simple black and white out that won’t fall apart ina year. Given, I haven’t had it a year lol but it seems like it’s pretty decent quality, fits well and comfortable. Very pleased with the price too! I was not looking to spend too much and this was very reasonable.",
		  "JUST GOT IT YESTERDAY MOST UNCORFORTABLE SHOES. THERE'S THIS HARD PART THAT'S PRESSING ON MY TOES WHEN WALKING. I WOULD RETURN IT BUT THE BOX WAS ALREADY THROWN AWAY. REALLY REGRET BUYING THIS!!!",
		  "Love these shoes, after reading the reviews I wondered a 1/2 larger than I normally wear & they fit perfectly. The shoe offers great support for my feet while I'm working out.\nWould definitely purchase again if needed",
		  "I love Under Armour, but these shoes are terrible! They fit a bit small and theres something hard at the toes that hurts with every step, its built into the shoe, I would never buy these again!",
		  "Order half a size bigger for under armour sneakers",
		  "J'adore mes nouveaux souliers! Je les utilise pour aller travailler (je passe de longues heures debout), pour aller au gym et pour les cours d'éducs. J'ai pris une taille 9 (ma taille de soulier réelle) ils étaient un peu serré au début mais après les avoir porté 2-3 fois, elle me sied à ravir.\n\nLe rose paraît particulier sur la photo, mais est vraiment plus beau en vraie. Ça vaut totalement la peine de l'acheter."
	   ],
	   "numberOfRates":136,
	   "avarageRate":1.810940915010566,
	   "id":99
	},
	{
	   "productTitle":"Skechers Sport Women's Flex Appeal 2.0 Fashion Sneaker",
	   "desc":"",
	   "category":19,
	   "images":[
		  "91q9c6cb9fL._UX575_.jpg",
		  "91raCtHPBhL._UY625_.jpg",
		  "91fns14taHL._UY695_.jpg",
		  "71u59Mgt2uL._UX575_.jpg",
		  "911VQetMSWL._UX575_.jpg",
		  "81Ac2%2BOkkwL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"50.00 - 243.49",
	   "comments":[
		  "1.Simply simply simply loved it. I am so happy with these shoes.\n2.First of all order the size that is the manufacturer size. Don't get confused with US and other sizes. I am in Canada and I ordered the manufacturer size and it was ok.\n3. these shoes are feather light, I have no idea how can shoes be so light.\n4.everythung is exactly how it's explained in the description.\n5. Great price of such nice shoes. Memory foam inside makes it so comfortable.\n6.if you are looking for comfort, light weight and memory foam please go for these.",
		  "Love these sneakers. Comfortable-walked for miles in these shoes with no blisters and discomfort. They have a lot of bounce in the foot bed. The fit was a little snug but after wearing them for a few days they were just right. Really like the color . Will definitely buy Skechers again.",
		  "These are great so far! Receieved then today and put them on right away. Super light and comfy! I ordered a size 11 when I'm normally a 10 and I'm glad i did because they fit perfect :) I've read different people saying they run small but I'm my case no way. I'll wear them to work tomorrow and give them a true test :)",
		  "I wear these shoes for maybe 3 hrs per day (walking to and from work or doing light exercise), about 2-3 days per week. After just 2.5 months of use like this, the upper left portion, right above the glue between the sole and the upper jersey bit, developed a hole and the upper is separating from the sole. I expected better from Sketchers, and am seriously doubting my purchase.",
		  "I ordered a size 5.5 because that's what I usually wear, but it was actually too small. A size 5.5 is typically a size 36 in EU sizing, but inside the flap of this shoe, it clearly shows that it was actually a size 35.5. That minimal difference made my toes feel very squished despite the fact that the rest of the shoe is very comfortable. My recommendation is to order 1 or 1.5 size up if you'd like to have room for your toes to breathe.",
		  "Nice looking shoe, lightweight and comfortable fit. I have a wide foot, so it's noticeably a tighter fit but I don't wear them all day, just to workout.\nLove how it feels like your NOT wearing anything on your feet because they are so light!!",
		  "Okay, I love these shoes and I got them in my usual size the 6.5. They are very comfortable and very cute. However, the right shoe is noticeably larger in the toe box than the left shoe! The left shoe fits perfectly. I think I got one regular 6.5 and one wide. I don't like the look of the right shoe at all. I have worn them a few times and already the right shoe which was already larger is stretching. Even my husband who notices nothing like this, ever, noticed the difference in size. I am not sure if I got a \"wide\" in the one shoe or if this pair were a try on pair. I think I got the wide in the right shoe because of the way the toe box is cut so much wider than the left shoe. So, I'm not really that happy with my purchase. I don't usually order shoes off of here and do go into the store to try on. I was going on a trip soon and needed a closed shoe that would accommodate my many foot problems. I wish I had sent these back for a pair that matched and fit perfectly but, I did not have time then. Buyer beware of ordering online shoes. Comfort level is wonderful, fit is so/so and these are mismatched.",
		  "Don’t get confused with all the sizes they just have a lot to choose from. I got 9.5 wide because my mom has swollen feet and they fit her wonderfully. The colour is beautiful and she says they are the most confyorable shoes she’s ever had. Great for the price. Same shoes are way more expensive in store. She is very happy with them. Awesome quality and shipped within a couple days. Very happy with this purchase."
	   ],
	   "numberOfRates":39,
	   "avarageRate":3.7941220753385756,
	   "id":100
	},
	{
	   "productTitle":"Adidas Womens Cloudfoam Advantage Sneakers",
	   "desc":"",
	   "category":20,
	   "images":[
		  "81whEMcO8VL._UX575_.jpg",
		  "81IdxCBlOHL._UY695_.jpg",
		  "81gnaye%2B5qL._UY695_.jpg",
		  "81MRAxZROyL._UX575_.jpg",
		  "81no55SaIDL._UX575_.jpg",
		  "816TRww8QVL._UX575_.jpg",
		  "81jAESlPpyL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"69.11 - 342.50",
	   "comments":[
		  "I bought a half size larger than my usual size like some of the reviews stated and they were too large. I returned for my usual size 8 and they fit perfect. The cloud foam insoles are more comfort than Skechers if that’s even possible. I love these shoes so much! Not to mention they are very much on trend right now. Love them!",
		  "Nice shoe and the cloudfoam is comfortable. However, because of its thickness, it makes tje shoe fit a little small. You can also remove it and put it a regular insole. Otherwise, buy a size or half size bigger.",
		  "Size up",
		  "This is so comfortable! I am size 7 with Nike (tight) but this one I needed 6.5, it fits perfectly. Very cute looking too! I am ready for summer with this nice white shoes!",
		  "LOVE these kicks... The \"cloudform\" is basically memory foam. So comfortable, I am going to get another pair when these wear out.",
		  "A little snug but cushy on the bottom and still comfortable",
		  "Very comfortable. I wear these for work, fit as expected. I'm happy with the purchase.",
		  "They fit really well I love them a lot plus I’m short and they add like 1.5 inches to my height"
	   ],
	   "numberOfRates":149,
	   "avarageRate":0.3883558387415458,
	   "id":101
	},
	{
	   "productTitle":"Skechers for Work Women's 76578 Bungee Lace-Up Sneaker",
	   "desc":"",
	   "category":17,
	   "images":[
		  "8193iUw8-OL._UX575_.jpg",
		  "711N1HlJ0lL._UY675_.jpg",
		  "618Swc34JEL._UY695_.jpg",
		  "71ck91ZqOcL._UX575_.jpg",
		  "718%2BNuBueKL._UX575_.jpg",
		  "717PHucEtmL._UX575_.jpg",
		  "81WIT-b4pxL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"67.45 - 172.51",
	   "comments":[
		  "I really liked this shoe, but it fits very small. Unfortunately had to return it. I think I needed a half size larger, but I've never had that size in a shoe so I think it might be particular to this style or brand of shoe. Great return policy though. Thanks Amazon Prime.",
		  "J'ai acheté ses souliers pour mon travail et il sont parfait! Les meilleurs souliers que J'ai trouvé !",
		  "The work-related footwear was exactly as advertised and the size was exactly as defined. This was good purchase and a positive experience. Delivery was faster than promised. Thank you.",
		  "These shoes don't open wide enough to get my foot in even though i ordered a medium width. Will be returning",
		  "THE best non-slip work shoes I've ever had, both in terms of comfort and slip-resistance. Would highly recommend these shoes.",
		  "These shoes look good and are comfortable. What more could you ask for?",
		  "fast shipping product as described.",
		  "Perfect"
	   ],
	   "numberOfRates":32,
	   "avarageRate":0.5961311432275158,
	   "id":102
	},
	{
	   "productTitle":"EMMARR Women's Breathable Fashion Walking Sneakers Lightweight Athletic Tennis Running Shoes",
	   "desc":"",
	   "category":18,
	   "images":[
		  "71cHeffklHL._UY575_.jpg",
		  "51A6wBCn4FL._UY575_.jpg",
		  "61dQIPG2dCL._UY575_.jpg",
		  "61yc-E6lP3L._UY575_.jpg",
		  "51OYc5Wi%2B3L._UY575_.jpg",
		  "71JtkBK14sL._UY575_.jpg",
		  "717QSq7yipL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"38.99",
	   "comments":[
		  "Hope they fit. Bought for a friend. Nice cool looking with vibrant red!"
	   ],
	   "numberOfRates":57,
	   "avarageRate":5.145491904271173,
	   "id":103
	},
	{
	   "productTitle":"Skechers Sport Women's Flex Appeal 2.0 Fashion Sneaker",
	   "desc":"",
	   "category":20,
	   "images":[
		  "91q9c6cb9fL._UX575_.jpg",
		  "91raCtHPBhL._UY625_.jpg",
		  "71u59Mgt2uL._UX575_.jpg",
		  "91fns14taHL._UY695_.jpg",
		  "911VQetMSWL._UX575_.jpg",
		  "81Ac2%2BOkkwL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"50.00 - 243.49",
	   "comments":[
		  "1.Simply simply simply loved it. I am so happy with these shoes.\n2.First of all order the size that is the manufacturer size. Don't get confused with US and other sizes. I am in Canada and I ordered the manufacturer size and it was ok.\n3. these shoes are feather light, I have no idea how can shoes be so light.\n4.everythung is exactly how it's explained in the description.\n5. Great price of such nice shoes. Memory foam inside makes it so comfortable.\n6.if you are looking for comfort, light weight and memory foam please go for these.",
		  "Love these sneakers. Comfortable-walked for miles in these shoes with no blisters and discomfort. They have a lot of bounce in the foot bed. The fit was a little snug but after wearing them for a few days they were just right. Really like the color . Will definitely buy Skechers again.",
		  "These are great so far! Receieved then today and put them on right away. Super light and comfy! I ordered a size 11 when I'm normally a 10 and I'm glad i did because they fit perfect :) I've read different people saying they run small but I'm my case no way. I'll wear them to work tomorrow and give them a true test :)",
		  "I wear these shoes for maybe 3 hrs per day (walking to and from work or doing light exercise), about 2-3 days per week. After just 2.5 months of use like this, the upper left portion, right above the glue between the sole and the upper jersey bit, developed a hole and the upper is separating from the sole. I expected better from Sketchers, and am seriously doubting my purchase.",
		  "I ordered a size 5.5 because that's what I usually wear, but it was actually too small. A size 5.5 is typically a size 36 in EU sizing, but inside the flap of this shoe, it clearly shows that it was actually a size 35.5. That minimal difference made my toes feel very squished despite the fact that the rest of the shoe is very comfortable. My recommendation is to order 1 or 1.5 size up if you'd like to have room for your toes to breathe.",
		  "Nice looking shoe, lightweight and comfortable fit. I have a wide foot, so it's noticeably a tighter fit but I don't wear them all day, just to workout.\nLove how it feels like your NOT wearing anything on your feet because they are so light!!",
		  "Okay, I love these shoes and I got them in my usual size the 6.5. They are very comfortable and very cute. However, the right shoe is noticeably larger in the toe box than the left shoe! The left shoe fits perfectly. I think I got one regular 6.5 and one wide. I don't like the look of the right shoe at all. I have worn them a few times and already the right shoe which was already larger is stretching. Even my husband who notices nothing like this, ever, noticed the difference in size. I am not sure if I got a \"wide\" in the one shoe or if this pair were a try on pair. I think I got the wide in the right shoe because of the way the toe box is cut so much wider than the left shoe. So, I'm not really that happy with my purchase. I don't usually order shoes off of here and do go into the store to try on. I was going on a trip soon and needed a closed shoe that would accommodate my many foot problems. I wish I had sent these back for a pair that matched and fit perfectly but, I did not have time then. Buyer beware of ordering online shoes. Comfort level is wonderful, fit is so/so and these are mismatched.",
		  "Don’t get confused with all the sizes they just have a lot to choose from. I got 9.5 wide because my mom has swollen feet and they fit her wonderfully. The colour is beautiful and she says they are the most confyorable shoes she’s ever had. Great for the price. Same shoes are way more expensive in store. She is very happy with them. Awesome quality and shipped within a couple days. Very happy with this purchase."
	   ],
	   "numberOfRates":32,
	   "avarageRate":5.734938728697935,
	   "id":104
	},
	{
	   "productTitle":"Skechers Sport Women's D'Lites Original Non-Memory Foam Lace-Up Sneaker",
	   "desc":"",
	   "category":18,
	   "images":[
		  "81GYzmBjORL._UX575_.jpg",
		  "81n1y9yMPYL._UY695_.jpg",
		  "81zu%2BU6giPL._UY695_.jpg",
		  "71eSYn6OQdL._UX575_.jpg",
		  "71cElcWelOL._UX575_.jpg",
		  "71YTL2vkEjL._UX575_.jpg",
		  "81v-i59yN7L._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"66.71 - 178.10",
	   "comments":[
		  "Though I love Skechers sneakers and it's now the only brand I buy, I must say I am very disappointed in the level of comfort of these shoes. I work all day on my feet and wore out my last pair of Skechers. I loved the look of these shoes and thought that all Skechers sneakers had memory foam insoles...WRONG! These hurt my feet so much and are about as comfortable as a pair from Walmart. Looking back on the product description,it says nothing about having memory foam. My bad, I assumed all Skechers had it. Stuck with them now :-(",
		  "These are my favourite sketchers. Last forever. After 10 years i decided it was time for a fresh new pair. So comfortable. Especially when on your feet all day. I've wanted a new pair for a while, so when I finally found the exact pair, under $100, i jumped on them.",
		  "These shoes are truly amazing. They are lightweight. Great quality. Especially for the cost. They are very stylish and comfy. I loved them so much I bought the man's version for my husband. He loves them too.",
		  "trop raide, très peu de flexibilité pour ce modele comparativement aux autres sketchers, sinon bon matériel.\nmoi je les ai retourné, mais ceux qui aiment une chaussure peu flexible, alors ce modele est fait pour vous",
		  "I wear orthotics so buy larger size than foot size but love them. I have about 10 pair if not more. I wear,8 to 8 1/2 shoe size but 10 with orthotics.",
		  "The shoes fit too tight across the toes. It is a nice lightweight shoes but I just can't wear it. I was hoping it would stretch.",
		  "My favourite shoes. Had a pair before but wore out was stoked to find them again.",
		  "These are exactly what i expected. The only thing is i paid over half the cost was a return. Great discounts on prime shoes is a bonus. Thanks Amazon for offering the lower price... Happy feet Kelly...lol"
	   ],
	   "numberOfRates":128,
	   "avarageRate":1.7456576333489195,
	   "id":105
	},
	{
	   "productTitle":"Yellow Shoes - MARYGOLD - Women's Sport Fashion Sneakers - Breathable and Lightweight",
	   "desc":"",
	   "category":18,
	   "images":[
		  "61O2dhSKaBL._UX575_.jpg",
		  "512oss1ZgxL._UX575_.jpg",
		  "51%2BgKgFB7HL._UX575_.jpg",
		  "51eGgkFQDUL._UX575_.jpg",
		  "5127HhQ9QaL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"39.99",
	   "comments":[
		  "Love these nice and light...fit perfect take size 6..ordered a 6 and perfect fit color is more of a sandy beige which i love"
	   ],
	   "numberOfRates":197,
	   "avarageRate":0.15757676222720862,
	   "id":106
	},
	{
	   "productTitle":"Saucony Women's Peregrine 8 Running Shoes",
	   "desc":"",
	   "category":20,
	   "images":[
		  "81yeqcrk6uL._UX575_.jpg",
		  "81-e8CGacLL._UY675_.jpg",
		  "81A4LsXDsfL._UY695_.jpg",
		  "71yknFmExIL._UX575_.jpg",
		  "81-RvKc8EAL._UX575_.jpg",
		  "81a5wgTUxML._UX575_.jpg",
		  "81hDtXeDU6L._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"92.69 - 328.80",
	   "comments":[
		  "Not much wearing in needed! Less ankle support than ASICS I had but happy with comfort level and amazing grip even ran in the snow!"
	   ],
	   "numberOfRates":135,
	   "avarageRate":3.8299432919142786,
	   "id":107
	},
	{
	   "productTitle":"Skechers Sport Women's Loving Life Memory Foam Fashion Sneaker",
	   "desc":"",
	   "category":18,
	   "images":[
		  "71i0OuOd5TL._UX575_.jpg",
		  "512UAObMG9L.jpg",
		  "41tCsEtcs-L.jpg",
		  "61GhoNXw5dL._UX575_.jpg",
		  "61vyWJoloIL._UX575_.jpg",
		  "61wGFHdMJrL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"70.68 - 164.40",
	   "comments":[
		  "My favorite brand and style! These shoes are stylish, breathable and literally envelop my feet in a \"cloud like\" comfort layer that makes hiking and walking absolutely enjoyable. I find the heel height particularly conducive for my activities as I generally wear a higher heel and other brands do not offer the same level of comfort and support. They are stylish and extremely versatile for a variety of activities. I generally have two waiting just in case this type is discontinued!",
		  "5 stars because I own a different pair and ADORE them. Unfortunately this pair was rather narrow, and despite ordering a size up from my usual skechers size, they didn't fit. I have wide feet, but even my 'regular' sized friends/coworkers found them rather narrow.",
		  "A bit showy as they got attention from others in the workplace, very comfortable they fit a bit loose but that was in an effort to avoid a shoe that was too tight but in this case, a half size would have done the job.",
		  "These run a bit wide for a bit narrow foot. The heel was just too wide so my foot 'walked out' of the shoes.\n\nThe memory foam sole seemed nice. The colourful band on the top seems more decorative than functional and could likely be removed if desired.",
		  "After reading reviews I order a 1/2 larger than I would normally wear & they fit perfectly.\nVery happy with this shoe & would order again if needed.",
		  "Extremely comfortable. I walk a lot at work and I never have sore feet at the end of the day.",
		  "Comfortable with nice memory foam inside, plus easy to just slip on",
		  "Bought them for a friend and she absolutely loves them. Thank you!"
	   ],
	   "numberOfRates":127,
	   "avarageRate":5.64836843072988,
	   "id":108
	},
	{
	   "productTitle":"Steve Madden Women's Ecentrcq Fashion Sneaker",
	   "desc":"",
	   "category":18,
	   "images":[
		  "81YSJCG3WqL._UX575_.jpg",
		  "71tsuqAYvfL._UY695_.jpg",
		  "71NOWhpIomL._UY625_.jpg",
		  "81FnTQK%2BMjL._UX575_.jpg",
		  "81Oykt288dL._UX575_.jpg",
		  "81x8aCl8amL._UX575_.jpg",
		  "81ZmCMxPFjL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"70.73 - 276.22",
	   "comments":[
		  "I generally wear a size 6.5 womens shoe but they didn't have that so I got a 7 and they fit like a glove! They're just the right size and I absolutely love them. Super functional & fairly comfortable for Steve Madden shoes. Not really a better deal than if you were to buy them in store when taking into account the price of shipping, but works out to cost about the same either way.",
		  "After reading the other reviews on the size issue, I ordered the shoe a half size larger, however it's still too small. I should have ordered a full size larger than my regular my size. I kept them because I thought they would stretch, but they are synthetic leather and so far they haven't stretched at all and my toes hurt after wearing them. Other than that, they are a cute shoe.",
		  "Love these shoes. So comfy and cute, each size comes in 3 fits so make sure to choose the one for your foot width. Mine are wide so the wides fit perfect!",
		  "Disappointed because these shoes do not fit to size! They are much too small and I will be returning them.",
		  "Fits fine.Very slightly snug, but maybe will loosen with more use.",
		  "Love the colour. Very comfortable.\nThey are a wide shoe. If you don't have a wide foot, they will feel big. I don't mind because they're easier to slip on and off.",
		  "I went half size up, still bit small, other than that good shoes",
		  "Je les aimes ❣️❣️"
	   ],
	   "numberOfRates":25,
	   "avarageRate":4.232379489846316,
	   "id":109
	},
	{
	   "productTitle":"Skechers Womens Summits - Quick Getaway Fashion Sneakers",
	   "desc":"",
	   "category":17,
	   "images":[
		  "81wjCtEL03L._UX575_.jpg",
		  "81agx1RMGCL._UY695_.jpg",
		  "81QUiMxDRcL._UY695_.jpg",
		  "71C8GiM5s2L._UX575_.jpg",
		  "81HI7NwPh-L._UX575_.jpg",
		  "818mZc5k4NL._UX575_.jpg",
		  "818fbe5HSrL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"45.85 - 137.00",
	   "comments":[
		  "The shoes fit fine in the legs but I found that my feet are size 8 and I bought a size 8 but my feet were hanging off the edges of the sole of the shoe which made it super uncomfortable to wear I so I have to send them back and I haven't ordered anything new from them just because Skechers isn't having any sales at this moment",
		  "Arrived fast. Good quality. Very comfortable.",
		  "Fits to size and very comfortable",
		  "Used this for work super comfortable..",
		  "Not as comfortable as other sketchers"
	   ],
	   "numberOfRates":123,
	   "avarageRate":1.3345521031568786,
	   "id":110
	},
	{
	   "productTitle":"Skechers Sport Women's Empire Fashion Sneaker",
	   "desc":"",
	   "category":19,
	   "images":[
		  "815Y4rQUh8L._UX575_.jpg",
		  "81pLke6w-vL._UY625_.jpg",
		  "71KzNowlrFL._UY695_.jpg",
		  "71WgI7UrcZL._UX575_.jpg",
		  "81PJSI487CL._UX575_.jpg",
		  "81gMNhd2McL._UX575_.jpg",
		  "81e3y%2BUwu%2BL._UX575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"50.18 - 191.80",
	   "comments":[
		  "Look no further than the Skechers Sport Relaxed Fit if it is comfort you are in search of. We cannot neglect our feet and place them in shoes which might have a certain \"look\",yet torture our feet with each footstep we take.This shoe is a charm and cushions the foot with memory foam hugs. Slip your foot in and breathe a sigh of \"thankful appreciation\".If your foot is regular width measure, this fabric shoe will cradle your feet in comfort for many hours. The shoes cannot be worn to a wedding or Cinderella's ball, but for everyday activities anywhere, These will become your \"go to\" shoes.",
		  "I love Skechers sneakers. This is my third pair of sneakers and I got these to wear at the hospital. My feet felt great after a long shift. Sometimes I have to do a lot of walking the floors and sometimes, it's standing in one spot. Skechers held up to both and neither my legs nor my feet were tired. I love the multicolours and I got compliments on them by both patients and staff. They go with any pair of scrubs I want to wear. No laces to deal with, just slip on and go. As for size reference, I have a normal woman's size 7 foot and I got a 7. Perfect fit. If you have wide feet, however, you may find these a little snug.",
		  "I love the colours of these shoes. But they wore out really quickly, within a month. The memory foam insoles collapsed and they became too painful to wear. Shame, coz they look really good.",
		  "Very comfortable for work as I am a nurse in a busy doctor's office. The fit is perfect.",
		  "Excellent shoe. I have a very high arch therefore it is a bit tight on top but that is not the shoes fault. I like the sho very much.",
		  "a little hard to slip into with the lace structure but overall they are great !",
		  "Very comfortable",
		  "Love these sneakers!!!! Comfortable and perfect!"
	   ],
	   "numberOfRates":137,
	   "avarageRate":4.357621184596389,
	   "id":111
	},
	{
	   "productTitle":"Timberland Women's FlyRoam Go Knit Chukka Fashion Sneakers",
	   "desc":"",
	   "category":19,
	   "images":[
		  "91pj2yp9leL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"50.44 - 167.29",
	   "comments":[
		  "I love the support ,quality,construction and look of these timberlands.\nI got a start the car deal on these and am thrilled to have a great pair of walking shoes that are functional and stylish\nI am normally a womens size 8 but the size 7 is a perfect fit, so they do run large.\nPeace",
		  "Timberland all the way!!! Great reputation for comfort n these don't disappoint. Also very cute. Completely pleased, esp with the price!!!! Recommend",
		  "The product fits well. I like the colour only one regret I have I thought it not a lace up. Apart from that loved it."
	   ],
	   "numberOfRates":60,
	   "avarageRate":3.141084809303555,
	   "id":112
	},
	{
	   "productTitle":"Peach Bands | Premium Pink Resistance Hip Band with Carrying Bag | Non-Slip Design",
	   "desc":"",
	   "category":22,
	   "images":[
		  "91Jh6a8pJFL._SX425_.jpg",
		  "71Qc4ePQ0vL._SX425_.jpg",
		  "71SOGHCtg8L._SX425_.jpg",
		  "81%2Bbv2XcNAL._SX425_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"24.99",
	   "comments":[
		  "I was so excited about this band... finally something that would stay and not snap or roll up like the rubber ones!!!\n- BUT unfortunately this band is so tight, I can get it around my legs and thighs BUT I can hardly move when it on. My squat form is so bad with it on because its so tight it forces my knees in and its actually very painful. other than it being way too tight this is a really nice band look and texture wise. Maybe make a medium strength one PLEASE!\n-I also feel like it is over priced.",
		  "After hurting my back and hip running, I found myself needing a band to do the exercises my physio was recommending. I first tried some of the common plastic/rubber bands. They rolled, pinched and pulled out leg hair - not the kind of support I was looking for during my rehabilitation. After scanning the multitude of band offerings on Amazon, I decided to purchase a Peach Band. While I had reservations about the colour (pink is far from my favourite), the pictures and the reviews indicated the quality and performance I was looking for. I am happy to say that I am extremely satisfied with my purchase - so much so that I am purchasing a second to use in my exercises. It is well-built, comfortable, and sufficiently strong. Thanks Peach Bands for this excellent product! Please consider offering it in say, steel blue!",
		  "LOVE MY COTTON BAND!\nThis us a must buy for people who like to do resistance and band workouts. I have both cotton and regular plastic bands. The cotton band has more of a resisitance and harder to use (which is awesome!). Your first two uses will be ridiculously hard and painful, but it gets better. Another great thing is that these don't roll up like the plastic ones. Cute and great resistance!",
		  "I am a competitive athlete/bodybuilder and these Peach bands are BOMB. I was hesitant as some reviews said it was too stiff, but I don't find that an issue what so ever. This is the best band that I've used to-date! I am in love and will certainly purchase again! 100%",
		  "Looks just like the photos and I absolutely love the product! These are the best resistance bands I've ever bought. Both the hip band and set of 4 loop bands. They don't roll up on your leg nor do they move much while working out. I definitely know I'll be getting better results with these! I also love the colours!",
		  "Great quality resistant band. I had used the stretchy rubber ones for a while and always found them irritating when they would roll while I’m doing my workout. This one stays in place and is made out of a fabric that’s durable. This one will last years and has a great amount of resistance to make your workouts that much better!",
		  "Sadly disappointed by this band due to how many positive reviews it seems to have. I couldn't agree more with the 1-star review about the band being incredibly tight. The band is SO restricting / tough that you can barely get any range of motion whether it be squatting, side steps, abduction movements, etc. My knees caved in while squatting and the band does not support or allow you to maintain good form whatsoever. I paid for the shipping fee to return this item which is something I normally never do but it would have been a even more waste of money to keep the band and never use it.",
		  "I ordered this to do banded squats for Physiotherapy, so far they work great!. The bands stay in place really well, the tension is good too. These are a small size band with what I'd consider a fairly high tension. I would definitely recommend. Love the bright pink colour and the bag it comes in is big enough that I actually can fit a second band in it"
	   ],
	   "numberOfRates":30,
	   "avarageRate":2.751948432407747,
	   "id":113
	},
	{
	   "productTitle":"Comfortable Men Women Bike Seat - DAWAY C99 Memory Foam Padded Leather Wide Bicycle Saddle Cushion with Taillight, Waterproof, Dual Spring Designed, Soft, Breathable, Fit Most Bikes, 1 Year Warranty",
	   "desc":"",
	   "category":21,
	   "images":[
		  "91y44M6E4YL._SY355_.jpg",
		  "81hW0mDBLSL._SY355_.jpg",
		  "91R3P9yJl6L._SY355_.jpg",
		  "81YZ-d8fHiL._SY355_.jpg",
		  "81ppiofsCYL._SY355_.jpg",
		  "81g8IYoeDEL._SY355_.jpg",
		  "91XXhIjJjLL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"37.99",
	   "comments":[
		  "I’m quite impressed with my Daway bicycle seat. It’s made with high-density memory foam and has an ergonomic design that makes it super comfortable to sit on. It also has a double spring rubber ball suspension so it really absorbs shocks.\n\nIt’s supposed to be water resistant, but I’ve been using the included seat cover just to be sure it doesn’t get soaked in the rain.\n\nThere’s an LED light on the back that’s really bright. I don’t drive a lot after dark but when I do I use the flasher mode so I can be seen from a good distance. The light is powered by an included CR2032 battery, so I’m assuming it will last a long time. I liked that it worked right out of the box.\n\nI’d recommend this seat for long-distance bicyclists or for those who just bike around town. It gives you a really comfortable ride.",
		  "First of all, over the last several years I have purchased several saddles for my electric bicycle. Each one promised to be designed to provide a high level of comfort, which I'm sure they did for many people, but none seemed to work for me. On top of that, these saddles were fairly expensive, some costing over one hundred dollars. So, in my quest for riding comfort, I came across the Daway c99 saddle and thought that I'd give it a try, (after all, it was only around CAD $35.00). When I opened the package and saw the very, very high quality of construction I was hopeful. However the ultimate test for a bicycle saddle is how comfortable it is; and this saddle is comfortable!!! I have finally found a saddle that lives up to its claims. I would not hesitate to purchase another one. It works very well for me.",
		  "A reasonably comfortable seat at a decent price. It is a bit harder than you would think by looking at it but I have done 100km rides on it. The first one I was sent developed a creaking noise due to the plastic light on the bottom of the seat, it creaks when you pedal. Eventually it drove me nuts and I replaced the seat. The seller contacted me and asked how to make it right. I told them I would be willing to try the seat again if they sent me another. They did, and 3 rides later no creaking noise. I guess I will see if this is a long term fix or if it develops a creak again but so far I am happy with the seat. A decent seat but really excellent customer service.",
		  "The saddle is a well designed and seems to be of good quality product. We are not professional riders and we only ride occasionally for leisure. We have had it on my wife's bike for a couple of months and she likes it very much. It is very comfortable but she doesn't bike often so we'll see about its durability.\nSolid shock-absorbing springs, nice cover materials and good sewing. We didn't try it in the rain.\nThe only thing I don't like about it is that the switch for the light is in the middle underneath the light so it is right at the place where you'd put your hand when you grab the saddle. As a result, I always hit the switch inadvertently whenever I move the bike.\nNonetheless, it is a very nice saddle and I'd recommend it although I believe it is a bit expensive compared to some other nice saddles :-)",
		  "PRO:\n1- I recieved the product 1 day after my purchased which is 1 week earlier...( Subliminal )\n2- Package cames as published ( Amen )\n3- Quality very good and foam is squeezy and comfy ( Marvelous )\n4- Comes with rain protector + tool to fix your seat and mount it up ( Very nice )\n5- Comes with battery already inside + 1 extra battery ( very sexy )\n6- Red lights have 3 settings. Functionnal and ready to go. ( Awesome )\n\nCON:\n\n1- In order to make your battery work ( the one already inside ), you need to remove the \"plastic protector \" within it which is super HARD to remove because it is located way \"deep\" in the opposite side where it is \"almost\" impossible to reach unless you unscrew the entire seat itself ( which I didnt want to do)... however, I had a \"very\" hard time removing it...I had to use a little screwdriver to remove the batterie ( there is little whole at the back )... in order to remove the battery & the plastic.. and THEN re-install the battery inside to make it work. That was a pain. Not good.\n\nConclusion, I would suggest the seller to make the plastic \" longer \" so the tip comes outside of the battery holder so it is easier for us to remove the plastic and the batterie at the same time as a starter. That's it.\n\nApart from that, I would recomment it. Cheers",
		  "The seat is excellent (purchased for use on a woman's upright hybrid road bike). Comes with mounting post clamps (not needed) and the rails under the seat easily fit the universal mount of most modern bikes. The seat itself is well constructed and provides excellent cushioning for recreational riding. The springs also absorb majority of vibration/jolts when going over rough bumps, ridges etc. My bike has hybrid road/recreational tires which are very high pressure (hard) so the tires do not absorb any bumps. The light is a nice added feature and very bright .... making one even more visible riding in traffic. The seat finish is like a weave which also means it is not slippery so you seat stays in place as compared to my earlier leather one .... no padding and very slippery. Highly recommend,",
		  "It provides better support than the original narrow bike seat. The light works great, I like the nightrider mode (LED scanning from one side to the other and back). It shipped with the wrench and extra battery (nice bonus). The most important feature, it fit my bike that did not have a bar clamp mechanism, I used the existing hardware from the original seat to mount it.",
		  "I love that I no longer get blisters riding my bicycle.My old seat was a wide seat but it would always lead to rubbing thighs and blisters in painful places.I read the reviews again and again on this one and finally decided my comfort was worth it.The lights are super bright and easy to use.This seat sits a little higher and helps take the strain off of my legs when I pedal.I enjoy riding my bicycle everyday now ❤️"
	   ],
	   "numberOfRates":176,
	   "avarageRate":2.57729259264655,
	   "id":114
	},
	{
	   "productTitle":"AmazonBasics 1/2-Inch Extra Thick Exercise Mat with Carrying Strap, Blue",
	   "desc":"The yoga and exercise mat features a textured surface for enhanced traction. This type of reliable traction is important for stability and to safely maintain poses--anything from warrior one or downward dog to extended side-angle pose or plank. Just as useful for beginners new to floor-exercise routines as it is for experienced yogis, the AmazonBasics mat helps ensure you get the most out of your workout.The AmazonBasics 1/2-inch-thick mat offers an enhanced level of thickness. This extra-thick layer cushions your feet when standing and stretching, and it supports your body throughout all types of routines, especially during restorative poses.Designed to withstand everyday use, the AmazonBasics 1/2-inch yoga and exercise mat is made from durable foam that's both lightweight and strong.When finished with your workout, simply roll up your mat and attach the elastic carrying strap (included) to either end. With the strap in place, slip it over your shoulder for gym-bag-style carrying. The strap provides secure storage (preventing the mat from unrolling when propped up in the closet or stored in the car) and easy transport from home to the yoga studio or fitness club and back again.",
	   "category":22,
	   "images":[
		  "81NAFYPZYvL._SX355_.jpg",
		  "81U4xc2yi7L._SX355_.jpg",
		  "91QIQNpz0QL._SX355_.jpg",
		  "71qotgt8gEL._SX355_.jpg",
		  "71GmR7tuHHL._SY355_.jpg",
		  "714hoxByp1L._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"25.27",
	   "comments":[
		  "Much like others have said this may is very soft and spongy but it also tends to pull apart like a processed cheese slice. I am a big and I did a plank on it. Where my hands were started to pull apart the fabric on the first use.\n\nI don't think this is a great yoga mat but if you just want to use it for exercising (i.e. crunches) it is fine.",
		  "So far this exercise mat has been fantastic. I expected there to be a smell as I have experienced with similar mats in the past however I didn't notice one at all! It lays out well and doesn't curl back up after it has been rolled out. It does a great job staying in place without slipping and cushions the floor very well. The strap is only decent, not amazing.",
		  "This thing is THICK! You probably won't want to travel with it because it's quite thick and heavier than a usual mat but I keep this one at home for using on a hardwood floor while using my foam roller. For this purpose it's perfect. Downside is that now my partner wants in on the foam roller too and I have to wait my turn. Apparently buying bright pink wasn't a deterrent for him and I have to share my mat anyway.",
		  "When I saw how many people liked this mat I thought it would be a good idea, But when I got it firstly the box was damaged secondly the mat had holes and like tiny tears on it thirdly after my workout I noticed that the more tears appearing on the mat. I think the only good thing about this mat is when you’re doing a workout the gripping of the mat is good",
		  "Soft, thick mat is exactly what I was looking for. My injuries/disabilities make it difficult and painful to be on the floor, this mat gives enough padding so that I can get back to doing some adapted yoga and other rehab exercises. I don't recommend standing on it if your balance isn't good, the thickness can make you unstable (I only have one working leg, so my balance is poor).",
		  "I had this yoga mat for a total of 4 days before it tore (delivered March 27 tore March 30). I used it the first 3 days at home for light stretching and a beginners yoga class on day 4. While turning on my heal into a different pose, it tore the fabric. So disappointing, I loved the colour, length & thickness. But if this happened my first class, it’ll be destroyed in no time. Will be returning :(",
		  "Not impressed with this product. Right off the bat it seemed pretty good, very nice cushioning on the knees. However, after only a few months of sporatic use, the foam is packing out at the ends where your feet would go for plank, downward dog etc. I can tell the material will eventually fully disintegrate. This would only be useful for going very light exercises and its too stretchy and slippery for yoga anyway. Even plank would likely cause the foam to pack out.",
		  "I purchased this mat thinking it was a great deal for the price, and it looked good. I had to stop using it because it smells terrible and is really noisy. It seems like it has a permanent \"gassing off\" smell that plastic sometimes has, but it doesn't go away, and the smell is left on me after I am done using it. It is noisy as well when used. It makes squeaky sounds from the friction on the floor and hands and feet. I had to get rid of it and buy another mat. I wish it was ok because the price is good."
	   ],
	   "numberOfRates":103,
	   "avarageRate":0.675371481792959,
	   "id":115
	},
	{
	   "productTitle":"Peach Bands | Core Exercise Sliders Set of 2 | Dual Sided Gliding Discs for Abs and Full Body Workout Fitness Exercise Equipment | Use on Carpet or Hard Floor | Bonus Carrying Bag",
	   "desc":"",
	   "category":21,
	   "images":[
		  "91af7ibHcxL._SX355_.jpg",
		  "718KcxM5haL._SY355_.jpg",
		  "711nbsmho6L._SY355_.jpg",
		  "71tnHBQ8yyL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"16.99",
	   "comments":[
		  "I live by peach band products! I'm so happy they came out with a slider! It works perfect on my old flooring at home, carpets gym flooring. I've been able to do new ab workouts with these, in love.\n\nMy collection keeps growing from this amazing brand. Can't wait for all the new products coming and hoping I could work with them one day.\n\nNot lying either! Check out my insta for workouts with the band's @caitlynnwestt\n100% recommend",
		  "I bought a pair for myself and a pair from another brand for my husband because he wanted black ones. My pair from Peach Bands works so well; it glides on carpet so easily, and the quality of the disks are great too! In comparison the ones my husband got are grippe on carpet and the foam side has air bubbles underneath. So we ended up returning that one, and ordered another pair from Peach Bands. Great work!\nMy suggestion for the brand: More colors and more shapes (oval & foot shape) please!",
		  "Absolutely love this product! Really well made, and amazingly priced. At home I have hardwood floors, but when I travel most hotel rooms have carpet so I love that I can use them for both, for the same price as regular sliders that can only be used on gym floors. The pouch for travelling is just an added bonus, but absolutely amazing! I guarantee you won’t regret buying these.",
		  "Perfect for anytime .. slip in your gym bag or purse and you are ready for a great workout. I have been using gliders for a few years and these are by far the nicest I have seen and used. They come in a nice mesh bag, are well made and the price is just right. Thanks for creating a product that is affordable and gives you a great workout.",
		  "LOVE. Planking and doing workouts with these really work. I thought doing my mountain climbers would be just as difficult but these actually make it easier to move and finish a proper workout. The double sides for carpet and hard wood is so convenient when I’m at the gym and have to use different areas. Perfect! Came fast and I’m great condition. Thanks!!",
		  "These sliders work great and are well made. No issues with the foam pad on my hard wood floor. It would be nice if they had a small dip in them just to place your toes but great product overall. The little bag they come with to store them is a nice touch! You will not be disappointed if you purchase this item!",
		  "these are unlike any sliders I’ve used, usually my feet slip off, not with this they have amazing grip as well as sliding perfectly on any surface. The packing and brand is so cute and looks good when you pull it out of your bag at the gym! This is not just for the ladies, my boyfriend uses these too and loves them! So so so impressed with these companies and I’ll be buying more of their products in the future!",
		  "Very high quality sliders. The foamy side is dense and not cheap foam. Codes easily on my laminate floors. The hard plastic side is solid and easy to grip with bare feet or sneakers."
	   ],
	   "numberOfRates":125,
	   "avarageRate":1.6861364659264053,
	   "id":116
	},
	{
	   "productTitle":"Adjustable Aerobic Stepper 78cm, 3 Levels (10/15/20cm - 4''/6''/8'') Exercise Step Platform for Home Gym and Fitness Training; 78 x 28cm - 31'' x 11''",
	   "desc":"",
	   "category":21,
	   "images":[
		  "91a0aHGl7UL._SY355_.jpg",
		  "91UoOgsXrEL._SY355_.jpg",
		  "A1lt9gmZJVL._SY355_.jpg",
		  "A1tPhqhvq%2BL._SY355_.jpg",
		  "91d3lOeWmlL._SY355_.jpg",
		  "81W%2B1TqNTYL._SY355_.jpg",
		  "91dwIoMNmWL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"42.95",
	   "comments":[
		  "I used this product for the Transform 20 workout program by Beachbody. I find the stepper to be very good quality (very hard plastic), and sturdy. It does not move and move while I step or jump on it so that’s a plus. Only thing that annoys me is that I somehow find it hard putting in the additional steppers in/out of the steps. Other than that, I will recommend this product.",
		  "This is a very cheap product. The plastic is coming apart at the seams where it was molded together. The adjustable legs are so loose that the board sinks as you step on and rises as you step off.\n\nThere are tiny tiny rubber stops about half the size of a dime that are too small to work so on non carpeted surfaces this thing slides like crazy.\n\nVery disappointed.",
		  "Very happy with this stepper. Just the right height. Doesn’t slip around or scratch my floor when I’m using it. Seems to be made of sturdy plastic. Doesn’t feel cheap. Great price.",
		  "The overall product is good. It does what it says compact, light weight and easy to store. However, every time I tried to put the risers underneath the stepper for storage they will fall out. The risers wouldn’t stick/stay in place for storage. Quality is not that good but it does the job.",
		  "Step très simple à utiliser. Les \"hauteur\" se trouvent à l'intérieur du step quand on le reçoit. Par contre, il n'est pas possible de ranger les \"hauteur\" lorsqu'une est installée. Il y a une odeur forte de plastique à l'ouverture du paquet, mais elle part après quelques heures. Très solide et il ne bouge pas durant les entraînements. Il était en parfaite condition lorsque je l'ai reçu.",
		  "Product arrived on time. No instructions but easy to assemble. If you want to store pieces in the step, you should take a picture before you take it apart. It is not that easy to figure out how to store the pieces.\nI use the step 4-5 times a week. I have been using it for a few weeks for aerobic exercise at home. It is pretty sturdy and just the right height. You have the choice of three different heights. If you use it on hard wood floors, you should put something underneath. You\nmay scratch your floors. Very attractive looking. Picture posted is accurate.\nI highly recommend this step for home exercise. Great for the price. You won't be disappointed.",
		  "Made of cheap material. The box it arrived in appeared intact and fine, the step however was cracked along the corners and edges. Had to return it",
		  "Great stepper. We bought it to be a versatile piece to help with circuit training. So the adjustable height options are great. And I love that the “legs” tuck into the step for storage. Seems very sturdy as well!"
	   ],
	   "numberOfRates":108,
	   "avarageRate":3.0365064128031745,
	   "id":117
	},
	{
	   "productTitle":"Resistance Bands | Premium Set of 3 Hip Circle Loop Bands for Exercise, Fitness & Workout. | Non Slip, Anti Roll & Anti Snap Design.",
	   "desc":"",
	   "category":21,
	   "images":[
		  "91NHocbbn6L._SY355_.jpg",
		  "71nvtuQT3yL._SX355_.jpg",
		  "71li-u8eMtL._SY355_.jpg",
		  "71%2B%2Bofis8dL._SY355_.jpg",
		  "81tQ6nJL-aL._SY355_.jpg",
		  "71tCNvCKmwL._SY355_.jpg",
		  "81DN%2BvZtzqL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"29.99",
	   "comments":[
		  "These are phenomenal. The quality is excellent, and the bands are so much more challenging than any of those rubber resistance bands. I was looking to replace the set of rubber rb's I had, but didn't want ones that would risk breaking or stretching out, and be out another $15. I saw these, decided to spend the extra $$ and I'm so happy with these. Totally worth it. And it comes with a free lifetime warranty.",
		  "The bands were well packaged and just as described. They are very high intensity products and perfect for our athlete population at the physiotherapy clinic that I manage at. We were looking for a fabric lined and durable band that would not break when under extreme stretch or used with stronger individuals. These bands are exactly what I was looking for and have replaced the use of our elastic resistance bands that previously kept on breaking for certain exercises. The fabric material also decreases the pinching and hair pulling of tranditional resistance bands. Thank you.",
		  "I was very excited to get these as i have been using rubber resistance bands for about 3 years and at least 2-3 times a week so naturally they get stretched out. The rubber bands are all the same size but different resistances so they don’t fall down. These xtreme bands are all the same resistance but different sizes. The biggest one falls down and the smallest one is almost impossible to use. I’m having a hard time enjoying them.",
		  "These are phenomenal, three different resistance levels for your best workout, very resistant but also very elastic so I will be using these a lot, including bringing them on vacation with me - it's all you really need for a great workout!",
		  "Unfortunately I am returning this item. There's nothing wrong with the quality of the product at all, however, I noticed that in comparison to similar products it didn't have the anti-slip bands inside the band & found when doing any type of lateral movements such as side steps, leg lifts and clams the band did not stay in place. It shifted and slipped around on my leg.",
		  "These feel great! It comes with three different sizes, and I like that the colours are blue/green/black. I'm not a pink kind of person lol. It also comes with lifetime warranty, which I thought was great.",
		  "Have used these a few times since receiving them. They are fantastic! Great price, do not roll or slide. Would definitely recommend!",
		  "Oh my, these are the best bands I have ever bought. The material is so thick and high quality. The resistance on then is so great too."
	   ],
	   "numberOfRates":170,
	   "avarageRate":3.6729390099941828,
	   "id":118
	},
	{
	   "productTitle":"[Up to 150 lbs] Exercise Resistance Bands Set,TOPELEK Fitness Resistance Bands Set with 5 Fitness Tubes/Handles/Stronger Door Anchor/Ankle Straps/Carrying Pouch/Workout Guides and Band Guard,Best for Men,Women and the Elders",
	   "desc":"",
	   "category":21,
	   "images":[
		  "716nABKD9ML._SY355_.jpg",
		  "71SubSin8HL._SY355_.jpg",
		  "71P9J4hE3-L._SY355_.jpg",
		  "713PTaBxyhL._SY355_.jpg",
		  "71qmUiT6xfL._SY355_.jpg",
		  "613GQJ5GDdL._SY355_.jpg",
		  "71lNH5i7wlL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"29.99",
	   "comments":[
		  "I'll start off with this. I got the kit that goes up to 50lbs with the metal carabinieres. The bands are really sturdy, I've been using them for almost a month now, 5 days a week and not one broke. The resistance on them is great. You could even use the 10lbs for mobility work. The door aparatus is what you expect. It goes under and above the door, and you close it. It works.\nI've had no problem with the legs straps either.\n\nNow, the band protector I don't use. I've tried it and I quickly stopped, because of changing the bands during the workout, you have to open that up and close it to. Its just extra time. Does it work? Probably, but like I said, the bands are really sturdy. As long as you don't step on them over wood chips, gravel, or pretty much anything that looks like it could ruin the band, you're good. Grass is ok. The band protector is optional.\n\nThe bag is really cheap, the stitching is terrible. It broke on me in the first week. I didn't buy the kit for the bag though, so I don't care. If you can stitch or sew, you could probably do a better job of making your own.\n\nOverall, go for the 3rd tier kit. It costs a little more, but you want quality.",
		  "I'm no expert on resistance band training but as a begginer and someone who is willing to learn, at this price point you can't really get any better. It pretty much at least to my understanding brings everything you need to turn your little apartment into a full blown gym as long as you have a good anchor point to set things up (at least for some exercises).\n\nI live in a small apartment so this was my best choice but I did not do my research thoroughly and I do not really have much space to stretch with a good anchor point other than my roomate's door (which I really don't want to bother every single time I use these things). I do like them for travel since it's pretty compact (the bag isn't amazing but it does the job). The bands are very sturdy and I've stretched the 40lb band quite a lot without any signs of it snapping.\nThe door anchor works really well if you have a door that opens outwards, it's perfect!",
		  "I recommend this product to anyone who is a beginner at the gym and wants to build strength safely before hitting the weights as well as those who have injured themselves and want to rebuild their strength. This product is amazing because if you buy each band separately at your local shop itll cost you roughly $25 and here you can get from 10 lb to 50lb and upto 150lb together, which is a steal. The quality of the product is amazing, overall its a 5 out of 5 product and it was delivered the 3rd day of my purchase so I know if I need replacement where to go.",
		  "The bands are pretty great, I don't know how you can verify that the weight on them is what they simulate, but they certainly all feel different.\n\nThe book that comes with the bands could be better in explaining about the product, it really just gives you some exercises, I would have like to have seen a more detailed explanation of how they are to be used, for example, if you connect the two ends of one band together, how this increases the tension.\n\nThe fabric that connects the bands came frayed on a few of them, but only one the end, so it hasn't caused an issue yet, and I don't think it will.",
		  "I Purchased these bands to supplement my gym equipment and to give myself a larger range of exercise options to workout. The nice thing about these bands is the ability to increase tension by simply attaching another band with the quick snap ends. The other bands that I do have have handles permanently attached on each band making increased tension impossible unless you twist the handles together. Not convenient! Great for everything from squats to pull downs and all in between.",
		  "Product works great, the bands and cords are holding up well to daily use. I really like the level of customization on the weights, and the durability of the handles. Great kit, especially for the price.",
		  "These resistance brands are quite sturdy and they will last for plenty of sessions. The bag and cloth materials on the grips are quite cheap so be warned. The price is really cheap so there isn't really much to complain. I do, however recommend this product as a great workout tool to integrate into your sessions!",
		  "I had 2 set of bands from another company, but I need more and upgrade bands as well. These bands are not as the seller claimed. the 35lbs is the same stretch strength as the 25lbs strength band that I had. I even used my bands everyday over a month now, and it still hold the weight higher than this 35lbs."
	   ],
	   "numberOfRates":139,
	   "avarageRate":3.080569838529033,
	   "id":119
	},
	{
	   "productTitle":"AmazonBasics 32-Pound Dumbbell Set with Stand",
	   "desc":"A nice alternative to round heads, the dumbbells feature unique hexagonal heads, which help keep them in place on the floor. When set to the side during a workout, they won’t roll away or get under foot. They safely remain right where you left them for a safe workout environment and easy grabbing during your routine. They also stay in place and out of the way when stored.",
	   "category":22,
	   "images":[
		  "91OvDPsdAWL._SX355_.jpg",
		  "81xxFZDz7TL._SY450_.jpg",
		  "71QKoGjC-ML._SX355_.jpg",
		  "91OvDPsdAWL._SX355_.jpg",
		  "819C2C452WL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"58.79",
	   "comments":[
		  "Very happy with these, for the price paid. They are basic, but exactly what I was looking for. The stand is kind of flimsy plastic, but was easy to assemble and feels sturdy now that it's assembled. The weights themselves seem fine. Ive been using them a few weeks and no issues.",
		  "Arrived promptly, and was as described. Will be using these to build up my arm strength. Amazing how much they weigh as opposed to what I envisioned...\nUpdate - they are great, comfortable, small and easy to store, and really great to gradually build up your arm strength, and great to take on a treadmill or outside.",
		  "Arrived in excellent condition. I love them. I just got back into exercising but don’t have room for a bench and no gym access.\nI had 5lb dumbbells that were great for getting back into it, but quickly became insufficient. I was holding both in the same hand for a 10lb weight but it was hurting my fingers, so I ordered these 12lb ones. What a difference.\nI do overhead press, side raise, front raise, bent over raises, shrugs, bicep curls, triceps extensions, chest flys, bench press, skull crushers, calf raises, and squats with these.\nMy 12lbs are becoming obsolete for some exercises, but I have workarounds. I do chest flys first then go into bench presses immediately after. You’ll be surprised at how heavy 12lb dumbbells feel doing this.\nI need to get the 20lb ones soon, but will still get great use from my 12lb weights.",
		  "Bad quality, the cover plastic started to pill 3 days later",
		  "I like the fact that the finish on the weights is matt and not glossy, makes them a lot easier to hold as they are not slippery.",
		  "they are no slip and because of the shape the don't roll away. They feel good and secure in your hand.",
		  "These dumbbells are simple and don't roll away. The grip is pretty comfortable as well. They are exactly as described and I'm quite impressed. Just about a week in and they haven't shown any signs for wear and tear. I've bought a few AmazonBasic items now and they never disappoint!",
		  "I purchased these 15# weights. I new they were used but I figured I would be safe with used weights... When I received them I could hear a rattle in the one weight, figured maybe a piece had chipped off inside, nbd.. went to use them and realized the whole end of the weight was broken off and the only thing stopping it from dropping on my head was the nylon coating...the disscription stated the weights were in good shape.. who’s standards are they rating them by? Those are a lawsuit waiting to happen"
	   ],
	   "numberOfRates":95,
	   "avarageRate":1.5902052072889274,
	   "id":120
	},
	{
	   "productTitle":"Valeo Ab Roller Wheel, Exercise and Fitness Wheel with Easy Grip Handles for Core Training and Abdominal Workout, VA2413RE",
	   "desc":"",
	   "category":21,
	   "images":[
		  "81nL6Ck3QVL._SY355_.jpg",
		  "81H2zMz6MbL._SY355_.jpg",
		  "81iBOIlje6L._SX355_.jpg",
		  "610YQ00Vs2L._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"10.36",
	   "comments":[
		  "This is very functional. It's definitely worth the price. I think the wheels must have been repurposed for this product but it gets the job done and I didn't really care about how it looks. The reason I think the wheels have been repurposed is there are five holes on each wheel where screws and bolts should go. They look like they were probably originally for a kids' wagon or something but then something went wrong and they couldn't complete production on the wagons. Or else they just intended to make the wheels attach for the ab roller, but then they realized the assembly could be easier and they don't have to provide screws and bolts. Plus, screws and bolts would likely become loose in no time since its plastic.\n\nAs I said it functions very well as the ab wheel and its definitely worth the price. I wasn't willing to spend more than $12 on a workout right now and this suits my needs.",
		  "Should’ve kept the one I had 10 years ago it’s identical. And inexpensive. It’s a really simple tool and as long as you don’t over extend your arms and hurt your back dragging the wheel back to words you then it’s easy as pie if you do drag the wheel out too far just drop your arms to the ground and don’t try to pull the wheel back if it is straining your back nothing is worth hurting your back over so I start by marking and easy distance and if I can do 10 repetitions at that easy distance then I can try rolling a slight bit further just increasing it by say 3 inches It’s a really simple tool and as long as you don’t over extend your arms and hurt your back dragging the wheel back towards you then it’s easy as pie if you do drag the wheel out too far just drop your arms to the ground and don’t try to pull the wheel back if it is straining your back nothing is worth hurting your back all over so I start my marking an easy distance and if I can do 10 repetitions at that easy distance then I can try ruling a slight bit further just increasing it by say 3 inches and so on. The best rule of thumb is if you can do 15 repetitions take a break do something different for a couple of minutes and then come back to it and do another set of 10 to 15 repetitions once you can build up to three sets of 15 repetitions then you are ready to do more with an exercise like this I would just change and add a different type of abdominal exercises ones I had built up to three sets of 15 Or if you want you could try doing the repetition is wearing a weighted vest ones you can do three sets of 15 add the weighted vest and start doing them again always been cautious with how it feels to your lower back It seems like an easy exercises but it’s very easy to overdo it as well Check my blog getting fit over 50 With Linda Campbell",
		  "Regarding this ab wheel, it is your standard ab wheel. It is using generic parts, as the wheel feels like it was made for another product. However, this does not bother me. This wheel is overpriced at its normal price. It's a small plastic wheel made with generic wheels from a bulk bin in China. No, it is not worth 20 dollars. I recommend you look around for the cheapest wheel you can find.\n\nAssembly is a bit of a pain. Ensure the grips are aligned perfectly as they are really hard to adjust once they are at the end. Once the wheel is put together, it's pretty much impossible to take it out by yourself.\n\nI think the only con I find with this product is that the grips are hard plastic. Therefore, if your hands are sweaty, you will lose a lot of friction required to keep grip with the device itself. It should have been made with a more grippy material, like silicone or rubber. This issue, however, really depends on how long you use the device in one sitting as for short bursts, it's perfectly fine.",
		  "The roller action is smooth and does not slip on hardwood floor. Very easy to assemble.\n\nHowever the grip is cheap plastic. You have to hold on very hard to maintain grip. This can be uncomfortable after a few sets. Some simple rubber grip would be much easier on your hands",
		  "works as expected, easy to assemble and stays assembled while rolling. good for the money, been using it about a month now multiple times a week, no issues",
		  "Solid ab roller. Has a steel rod in between, looks like it will last a long time. If you’ve never used this before, be weary it’s not that easy!",
		  "I was first introduced to this device at my gym by my personal trainer. If used properly, it doesn't harm your lower back and definitely works your abdominal muscles hard! I have found it to be the most effective abdominal training device there is!",
		  "Somewhat cheap plastic but it works"
	   ],
	   "numberOfRates":11,
	   "avarageRate":0.8770168098180089,
	   "id":121
	},
	{
	   "productTitle":"Peach Bands | Barbell Squat Pad with Secure Straps | Thick Foam Cushion (Pink)",
	   "desc":"",
	   "category":21,
	   "images":[
		  "81-9Y9u9MWL._SY355_.jpg",
		  "71oikFOPNKL._SY355_.jpg",
		  "71Pg-eya1TL._SY355_.jpg",
		  "71O5oZdnFFL._SY355_.jpg",
		  "813uXYgjVbL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"22.99",
	   "comments":[
		  "This is the best squat bar pad. It’s so comfortable and stays in place. Came very quickly I ordered it 3 days, it was at my door 3 days later. It’s so pretty too, I got the pink one ❤️ I would definitely recommend and will buy another when I need to.",
		  "i got this at the end of last week and received a day before ! love this product i used it for the first time today and its awesome ! on thr smith machine for squats or kneeling squats its perfect it doesnt hurt my neck or my shoulders ! super comfy and cute , i got the pink one of course 😉 the strap ensure that it stays and doesnt move and its a great feature ! i also used it to do my hip thrust with a barbell and it was great and comfortable ! great products i also have the sets of elastic band from peachband 💗",
		  "I used this product while hip thrusting 365lbs and experienced zero discomfort and the foam didn't warp or flatten out at all. It's 1000x better that using a mat or a towel to protect your hip bones. I have not and will never use this product for squatting so I cannot comment on that. I like that it comes with the velcro straps to keep the foam in place. Just to be safe I always put the velcro straps on tight when storing the pad so that it maintains its shape. Great product fair price solid quality.",
		  "First of all the customer service is AMAZING, its not very often you have a company reach out to you and ask how you like the product. The squat pad is the PERFECT size - not big and bulky but not too small, fits in my gym bag like a glove. The straps are removable for quick sets but are incredibly handy and give you the extra security while growing the booty! Will 100% be ordering the other color\"",
		  "Love love love this product!! It fits the bar perfectly and protects me whether I’m doing hip thrusts or squats. I feel proud owning my own knowing it’s clean and hygienic and holds it shape.\nIt’s evident, quality went into this, and I will definitely purchase their other products. It’s a thumbs up 👍",
		  "I love this barbell pad — I was looking for something that was high quality, had functionality and was pretty at the same time....what can I say.....pumping iron can be pretty 🙂. Well peach bands barbell pad delivered what I wanted and I couldn’t be happy. All peach bands products that I have purchased have exceeded expectations.",
		  "This product arrived exactly as it was described. I primarily use it for hip thrusters and it offers great support, allowing me to lift heavy without the bar digging into my hip bones. Much better support than I was getting with the regular flimsy padding.",
		  "this barbell squat pad makes hip thrusts SO much more comfortable! I got it in pink; I love how it comes with straps for security. Definitely my new best friend on leg days! I'm so pleased with it that I just placed an order for the resistance bands, core sliders & padded ankle straps! Taking my leg days to a whole new level!"
	   ],
	   "numberOfRates":133,
	   "avarageRate":2.175184688977441,
	   "id":122
	},
	{
	   "productTitle":"TETON Sports Trailrunner 2 Liter Hydration Backpack; Free 2-Liter Hydration Bladder; For Backpacking, Hiking, Running, Cycling, and Climbing; Black",
	   "desc":"",
	   "category":22,
	   "images":[
		  "81IOiPrE0ML._SY679_.jpg",
		  "81p8VOVoSyL._SY679_.jpg",
		  "91IIfDSEQrL._SY355_.jpg",
		  "91qlIyCPaLL._SY355_.jpg",
		  "A1RYJEkwgSL._SX355_.jpg",
		  "911i%2Byg8t6L._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"32.49",
	   "comments":[
		  "I really like this backpack. It has been a huge help when running longer distances (15k or above). I found that it was a little tough to draw water from but that may be a good thing as it forces me to take smaller amounts of water at a time.\n\nAs long as you take care of the bladder this backpack is great",
		  "I wanted to try running with a water backpack before I committed to a $100+ bag from a specialty store, and my brother suggested this. I paid C$22. It's a bit annoying to fill it up and get the bladder into place without overly bending the straw, and it's further not all that much fun to empty it out and clean it after. A bit awkward. But ... Once you get past setting it up, it works really well. It doesn't leak. I fill it about half way most of the time (1L) and add a bunch of ice. As long as you make sure you let extra air out before closing it up, there isn't too much sloshing. The front pocket (not really a pocket, more of a mesh) is big enough to hold my car key and 2 Gu gels as well as my emergency kit. I could fit my large smartphone in there as well if I need it. I've used this thing for about 12 weeks, at least once a week, and it's been through the laundry once, and still looks pretty new and shows no signs of wear.\n\nI will probably treat myself to a higher-end product next year, but this TETON sports bag did not let me down at all. GREAT value for $22, in my opinion.",
		  "I used this for a spartan race. It's very thin and comfortable. The front pouch is useful to additional objects. The water remained cool for a good amount of time (several hours), we were in the sun quite long.\n\nI'm removing a star because the straw kept falling out of the strap holder? this became annoying after a while. But overall, pleased with the purchase and the price point.",
		  "This is a great beginner backpack.\n\nPros:\n~ cheap (I got it on sale for about $25)\n~ lightweight, but sturdy.\n~ shoulder straps breathe and don't cut into your shoulders\n~ includes a water bladder* (see notes below)\n~ has a pocket for snacks/sunscreen/phone\n\nCons:\n~ The water bladder itself has multiple problems. 1) the spout has a very small opening so sucking water out is an effort. 2) because of the way the opening is designed, it's nearly impossible to get a full 2L into the bladder. 1.8L is a more appropriate volume. 3) there is no stop valve between the bladder and the hose. This means that when you're filling the bladder with water, the hose must be attached, otherwise it just leak out the bottom. Due to the opening on the side of the bladder, you have to take it out of the backpack to fill with water and then you have shove everything back in and pull the hose out from the inside. It is a hassle. I replaced the bladder with a different 2L hydration pack I owned after a couple of uses. Something like this:Platypus Big Zip LP Reservoir, 1.5-Liter\n~ The fit. The fit was a little awkward for me (5'5\" female). The chest strap is adjustable, but end up sitting too low on me, especially when the bladder is less than half full. I have to loosen the arm straps to get the chest strap higher which causes the pack to jump around a bit when running. The waist strap is nearly useless because it sits around the waist (just above the belly button) rather than on the hips. Since your abdomen expands when breathing, you can't tighten this waist strap or it will severely limit your breathing.\n\nOverall:\nIf you're just starting out running/hiking/biking and are looking to try out a small, lightweight backpack that holds water and a snack or two, this is a great starting point. If you're a bit more serious about those activities, you're probably not even looking at this backpack.",
		  "I cycle allot during the summer time, which becomes my main method of transportation as well as simply joy riding and keeping in shape. And I tend to either leave without any fluids and then have to stop somewhere to pick something up. So after bit consideration I decided to get a hydration pack that had sufficient fluid storage and wasn't overly large as well as was not overly expensive so I would not have to break the bank.\n\nThe TETON Trail Runner 2.0 was just the thing, I used this product truth most of the scorching summer days and it keeps fluids nice and cold. Only problem is that it takes a while getting used to to drinking on the go and the entire fluid intake. But ones you figure that out then there is really no issue. This is a good buy for amateur riders, commuters or amateur mtb riders such as myself. There is more uses for this such as hiking or using it during hot summer days to keep yourself hydrated outside in the park or wooded area.\n\nOverall this is a great buy for the money you pay for it.",
		  "I needed a hydration pack for going offroad with my KLR 650. Reading some of the reviews, I was worried that I may have bought a hydration pack to fit one of my dollies, but this thing is big enough to fit over my EVS armour. It does have a large opening for the water (large enough for ice to go in if you like cold water), it hasn't leaked yet. I have put this thing through its paces so far. I've crashed the bike a few times and expected this thing to pop and it hasn't. I've rested, forgetting that this was on it's so comfortable and laid on it, and it hasn't leaked or punctured yet. The tube is long enough to reach into my helmet when I'm riding and water flow isn't an issue - so long as you remember/understand that there is a push/pull valve on the tube to limit the leaking. If it's pushed closed, you no getta watta. If it's open, you can get water by putting your teeth on the notches carefully engineered into the silicone mouthpiece and squeezing gently. It's really not that difficult. You'll get a manageable trickle of water entering your mouth, but if you want more flow, get a firetruck or something to follow you and blast you in the face when you're thirsty."
	   ],
	   "numberOfRates":119,
	   "avarageRate":0.9535767174685694,
	   "id":123
	},
	{
	   "productTitle":"REEHUT 1/2-Inch Extra Thick High Density NBR Exercise Yoga Mat for Pilates, Fitness & Workout w/Carrying Strap (Black)",
	   "desc":"",
	   "category":21,
	   "images":[
		  "71txs8ik3YL._SY355_.jpg",
		  "61dTbxHI58L._SY355_.jpg",
		  "61fCvi7W8VL._SY355_.jpg",
		  "61w1fc3gBML._SY355_.jpg",
		  "71C68%2BAD4cL._SY355_.jpg",
		  "71rVcdOYMFL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"27.49",
	   "comments":[
		  "I am in my early 20s but have had some injuries that make it hard for me to excercise on my hardwood floor. Here's the break down of the product:\n\nPros:\n- Surprisingly sturdy\n- Great colour and size\n- Comfortable and not too thick\n- Great for doing most workouts (haven't tried advanced yoga poses)\n-Quick shipping and exactly as described\n\nCons\n- Squeak like a mouse while I was doing push ups but not a problem when music is on\n- Legit a giant piece of foam in first sight. Redeemed itself after use",
		  "When I first received this mat, it seemed like the perfect solution to having my aging knees on my hardwood floors, unfortunately it has not worked out exactly as I had imagined. There are two main problems with this mat: 1. It stretches when you're on it, especially when you're trying to get into downward facing dog. You end up having to adjust constantly because it's moving around under neath you. 2. The surface of the mat is really soft unlike my regular yoga mat, causing it to peel when I'm putting a bit of pressure on it, especially noticeable in DFD. What I've ended up doing is using my regular yoga mat on top of this one and this seems to provide me the softness I need for my knees and the stability and non-stretching I need from a yoga mat.",
		  "I purchase this matt for my wife. She tried it before she took it to her class, she instantly noticed it was tearing everywhere, from very little use . I attached pictures to show everyone who thinks of purchasing this item to think twice.\nUnless my wife received a defective item I would not believe any of the positive reviews.\nIts not a expensive item but the thought of packing it up driving to the post office then waiting for a small refund. Well I will probably just throw it in the garbage.",
		  "I specifically need this for my knees and boney spine!. Even a regular mat on carpet does not suffice, however, this mat is thick enough for mat work and pilates. It's harder to balance on when doing yoga, but that isn't necessarily a bad thing, just makes your body work a bit harder to balance.",
		  "Although this exercise mat is long and much thicker than most and has great traction to avoid slipping, the material gets worn out really quickly. Already after my first use of just doing 20 minutes of yoga/pilates (no shoes) on the mat I wore out the top (where my hands and forearms were) and bottom (where my feet were) so that the foam is now permanently pressed in, making the material much thinner and more susceptible to tears. Luckily, my material has yet to break through to the other side, but where my hands and feet go is already much thinner and worn out. I was really hoping this would be a more durable exercise mat, but it is not. I plan on purchasing a new mat made out of stronger material that doesn't get worn out so quickly.",
		  "The exercise mat isn't as thick as they say (the Amazon Basics is much thicker and stronger), although it's not horrible. It's more airy than the more expensive $30+ price point, but that's to be expected. I say for the price, it's fine. However, if you want it to last longer than a year without any major kinks, scratches or small tears, I would spend the extra money. My $50 mat from 5 years ago looks better than my Reehut after only a couple months. I'll continue using it as it does the job, but I don't see this lasting more than a year.",
		  "I love this yoga mat, use it a lot, but only for Yin yoga (where you hold poses for a long time, mostly on your back, sometimes on your knees.) Provides great protection for knees.\n\nWarning: Do not buy this item if your intention is to do yoga that includes a lot of standing, especially one legged poses. It is not good for that. Hard to stay stable. Our yoga instructor even warned those who had doubled up their mats so their knees would not hurt when they kneeled that they were putting pressure on their knees when standing.\n\nI gave it a good rating because I had read some warnings that it was bad in the way I described so I fully expected to need 2 yoga mats.",
		  "What is the point of all that time moving weight 1 to 2 feet at a time in a repetitive fashion? Fitness? Longer life? No! It's so people know you're better than them!\nTo that end when I am feeling particularly jacked (BEEFCAKE!), I like to roll out this nice thick yoga mat, strap on my tightest tights and do some big stretches in the back window for all to see. Be assured, my neighbours know my superior physique well and I can thank this yoga mat for that. I hope it serves you as well as it has me and my neighbours."
	   ],
	   "numberOfRates":23,
	   "avarageRate":5.158806976886684,
	   "id":124
	},
	{
	   "productTitle":"Fitness Training Pro Suspension System Training Kit Professional Gym Fitness Training Straps for Home Gym Workout by KEAFOLS",
	   "desc":"",
	   "category":22,
	   "images":[
		  "61VgQMlkb9L._SX355_.jpg",
		  "416VV2QcA1L._SY355_.jpg",
		  "71vjH8cPmOL._SY355_.jpg",
		  "51M-3YW8ysL._SY355_.jpg",
		  "814h7tInniL._SY355_.jpg",
		  "61JZJtKXPdL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"49.99",
	   "comments":[
		  "Comparing these to the Gold Standard TRX, they are very very close.\nFor a third of the price, these are a terrific purchase. The anchor strap works terrific on soccer nets and gym squat racks. I installed a hitch anchor on my garage ceiling and this is good to go. Definitely worth the purchase.\nAdjusting the length of each strap takes a bit of patience, but it's very sturdy and strong setup",
		  "Exactly what I was looking for!\n\nI debated getting the original TRX suspension set versus this set. I decided to buy this set as it was half the price and the reviews looked decent. I definitely don’t regret this purchase! I was able to do full body HIIT workout in 30 minutes while my baby slept.\n\nIt comes with two different end pieces that easily switch (like a seltbelt bucket). The material is very durable. I don’t imagine I would need to replace these for years.\n\nWaiting for my ceiling bracket (not included) to arrive however it works over my door!",
		  "I love them, easy to install, doesn't take much space to carry, product is made solid. Adjustment of the straps are easy.\nThere are 2 attachments, the handles and the stirrups. They are interchangeable, they clip like a car seatbelt.\n\nThe different with the TRX, is that the latest, have 1 attachment handles/stirrups all together, so you don't need to interchange them. Also, some exercise maybe a bit more comfortable if you would have the TRX 2in1 attachment, however, with the Pro Suspension System, it is still feasable to do them. Interchanging the attachements takes 2-3 seconds.\n\nSo for $100 cheaper than the TRX, it's all worth it!\n\nExercise with Suspension system is a lot of fun, and very good for strengh of every muscles, upper body, lower body, back and core strengh and takes minimal space, excercises goes from beginner to intermediate and advanced, you won't get bored.",
		  "Perfect for the price - can't imagine paying the trx prices - just as good if not better quality than the original",
		  "Super product. I was use to the real TRX (yellow and black) at the gym but I purchased this ont for my house and it's perfect. It's really esay to change the leg part for the hand part. The only thing I would change it's the top because I don't use it on a door because there is a lot of exercises that you cannot do and it's harder to install it on the roof than the real TRX.",
		  "Other than the lack of instructions the product is good. Strong, good quality materials and feels solid. I am 250 pounds and have had no fear of the product failing.",
		  "Honestly it is a great piece of equipment. Now paying 200-300$ for this is just pure instanity!!!!\nEven at 50$ it’s pricey for what it is . I love this item and don’t waste your money on a original trx . I traina couple of times with it and it a great workout and a well made piece",
		  "A friend of mine purchased the real TRX online and recommended it to me.\nI was no way going to spend over $100 on another piece of gym equipement.\nThis product was the perfect alternative.\nMy friend tried it out and confirmed it is almost exactly the same as real TRX and cannot see any downfall in having this version vs. the real one."
	   ],
	   "numberOfRates":47,
	   "avarageRate":2.887322868308267,
	   "id":125
	},
	{
	   "productTitle":"Polar H10 Heart Rate Monitor, Bluetooth HRM Chest Strap - iPhone & Android Compatible",
	   "desc":"",
	   "category":22,
	   "images":[
		  "61x7I9X2tNL._SX355_.jpg",
		  "71Dn720iS%2BL._SY550_.jpg",
		  "61AJbpRK08L._SY355_.jpg",
		  "71paRoti5VL._SY355_.jpg",
		  "71OePw-e9eL._SY355_.jpg",
		  "51WMJQzE77L._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"128.85 - 2,100.20",
	   "comments":[
		  "This works great, a little more reliable than my wahoo tickr which also does a decent job but the H10 is on another level.",
		  "Excellent product. Very sensitive and accurate. Love watching my progress on the phone app when on my stationary bike.",
		  "Works well",
		  "Heart rate",
		  "the polar h10 is the best strap you can buy. it's very accurate and easy to use. I really love's it. I recommend to everyone. The app polar beat is user friendly and I use the h10 with the Polar Loop 2 activity tracker also. the 2 work perfectly together."
	   ],
	   "numberOfRates":98,
	   "avarageRate":2.032495190198261,
	   "id":126
	},
	{
	   "productTitle":"BalanceFrom GoYoga All Purpose High Density Non-Slip Exercise Yoga Mat with Carrying Strap, 1/4\", Purple",
	   "desc":"",
	   "category":21,
	   "images":[
		  "81w5jRd8R5L._SX355_.jpg",
		  "81SizRGHFsL._SX355_.jpg",
		  "91BGFoITXYL._SX355_.jpg",
		  "91XpKBNO5hL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"20.23",
	   "comments":[
		  "VERY disappointed with this product!! I purchased it less than a month ago on Amazon.ca, and with use less than 5x week it is already falling apart! At first, I was pleased with the mat when it arrived. It was as described: non-slip on both sides, large enough to do yoga/exercise, very comfortable, and sturdy. But then the foam started to peel off a couple of weeks into use! I received a warranty guarantee slip with the mat when it arrived, so I emailed the company's customer service department (per instructions on warranty card) to see what they could do to help. They told me since I was within the 30-day Amazon return window, to return the mat for a full refund.. but there are two BIG problems with this. First, I don’t want a refund, I want the 'quality' yoga mat that I was promised. Second, even if I did want a refund, do you know how hard it is to find a box that will fit a yoga mat?! Or how expensive it would be to ship said awkwardly-shaped/heavy box back using Canada Post? It's unacceptable that BalanceFrom expects me to pay more money out of pocket to return a defective item that I paid full price for, when the defect is the company’s fault. Extremely unhappy and won't be purchasing from this company again. Buyer beware!!!",
		  "This mat only lasted three weeks before it started ripping. I contacted the manufacturer who advised me they could only provide a replacement to US customers, and that I would need to work through my retailer for a refund or exchange. The exchange deadline passed while waiting a week to receive a response from the manufacturer, so it looks like I'm out of luck. If you're a Canadian customer, customer service might be an issue for you.",
		  "It is not non-slip. It is just another $20 worth cheap yoga mat. You get what you pay for. That being said, in other ways this mat was fine for anyone who was not looking for anything special. But anti-slip was really important to me so i would not recommend. The carrying strap was handly. The smell went away after i left it unrolled for a night.",
		  "If I could, I would give it 4.5 stars. The only reason I take 1 off is because it does sometimes get slippery. Other than that I am very very happy with it. This is my very first yoga mat ever, and I think it's a good choice for beginners who are going to start yoga and aren't sure if they want to spend a large sum of money on an expensive mat. The holder strap that comes with it is very convenient too. I have had it for 4 months now and I really like it. No wear and tear yet.",
		  "After ordering the mat I received it very quickly in the exact colour I was expecting. The size of it was also exactly what I expected and needed. It is an awesome length that gives you the ability to do many different things. The thickness of the mat I find to be perfect. It is just thick enough that it is comfy to use, but not hard to balance on. The traction on the mat also makes doing yoga much easier since I find my feet do not even slide while wearing socks or bare feet. I love that the mat comes with straps to keep it rolled up, its super easy to store and transport to wherever I want to bring it with me. As an added bonus my mat came with a 2 year warranty. Overall, it is a super good quality yoga mat, especially for the price you are getting it for. Would recommend this mat to anyone.",
		  "Very pleased with quick shipping.. Received it in 2 days. The mat is exactly as in product description. I love the soft feel. It’s perfect for my sore wrists and knees. My daughter also uses it and it’s very long so it easily accommodates both of us. The strap is also very good quality and helps me exercise when I go out as well. Overall amazing product and price can’t be beat!",
		  "This was my first yoga mat, unfortunately I had to return it. It's foam is good for laying on for me, it has great grip with the floor and is very lightweight.\n\nDue to my hands/feet getting sweaty, I would have a poor grip midway through my yoga sessions where my focus becomes on trying to not slip rather than breath/poses.\n\nGreat inexpensive mat if you don't have sweaty hands/feet issues, it was suggested to me to buy a yoga towel but at that point I'm paying the same price as a mid-range mat.",
		  "This is very soft and squishy, which is great for my knees but not great for a yoga flow. It definitely holds an indent after you put weight on it, so it can be difficult to balance when you're moving around. I started using this under another mat as additional support, rather than by itself. I would say that this is ideal for floor poses if you have some pain, but if you're looking for a regular mat or you're a serious yogi, it might be worth paying a little more for a better quality thick one."
	   ],
	   "numberOfRates":78,
	   "avarageRate":0.038257465227259146,
	   "id":127
	},
	{
	   "productTitle":"Peach Bands | Padded Ankle Strap for Cable Machines (Pair Pack)",
	   "desc":"",
	   "category":22,
	   "images":[
		  "81XwdspVZ0L._SY355_.jpg",
		  "71GQLxybJzL._SY355_.jpg",
		  "71CobyMCYKL._SY355_.jpg",
		  "71Zwjj5qwCL._SY355_.jpg",
		  "71aWLy6lKbL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"28.99",
	   "comments":[
		  "In Love with this not only because of how perfect of a pink the colour is and it looks super girly and amazing when I take it to the gym, it’s become a part of my fashion accessory when it’s leg day and I just wear it on my ankle throughout the entire workout lol🤷🏻‍♀️ It’s also extremely comfortable and painless, you never have to worry about it digging in your ankle at all or coming loose! But in all honesty the quality of Peach 🍑 Band equipment is just amazing for the price, really well made I couldn’t be happier or say enough good things about them! In love, I just want them to make more pink accessories/equipment I’d buy it all!🤗💗xo",
		  "These are so great for small ankles! I have exceptionally small ankles and found a hard time finding an ankle strap that fit my legs! I love this product and its pink so what could be better! BUT I did not realize I ordered just one strap which was my fault so make sure you order two because it can be frustrating changing them back and fourth.",
		  "Worth it!! Peach Bands have created durable padded ankle straps that are comfortable, easy to attach to the cable machine and even better if you love the colour pink ;) You can really amp up your glute and hamstring workouts with these! I purchased these straps recently and have used them a few times; they feel secure when on and don't move around in the middle of your set.\nThey arrived sooner than expected and in perfect condition. Extremely happy with these straps!! Definitely recommend!",
		  "Was super excited to get this product so I could not only have my own straps, but to spice up my Instagram as well. Unfortunately, as soon as I unpackaged the product, I was met with multiple stains and an overall used looking cuff. Another issue is that one of the D links is SO jagged that it will most likely scrape against the carabiner and make it even worse. In general it looks like ankle straps were dropped on the floor and mishandled. Very disappointed with this product.",
		  "I LOVE it!! It stays in place when doing exercices and it’s confortable! Way better than using the one at the gym thats not adjustable and kind of gross. Love having mine plus pink is my favorite color! Lets grow the glutes now! 🍑",
		  "Been using for about 2 weeks now a couple times a week. They are comfortable and fit snug compared to most other straps so they stay in place quite nicely. Seem strong hopefully they last a long time :)",
		  "The product quality exceeded my expectations ! It Stays tight on your ankle even with heavy weights.\nGot everything (Barbell pad, ankle straps & resistance band ) within 2 days! Customer service is excellent!\nI definitely recommend to everyone :)",
		  "Absolutely love all Peach bands products!! They’re the most durable I’ve had to date! Never disappointed with anything! The delivery was insane , got the very next day! Keep it up guys you guys are my favourite 💖💖💖💖"
	   ],
	   "numberOfRates":157,
	   "avarageRate":2.8939381412613656,
	   "id":128
	},
	{
	   "productTitle":"AGPTEK 1 Pack Lightweight Bright Reflective Adjustable Vest Strap for Running Bike Riding Horse Riding Cycling Jogging Walking Motorcycle",
	   "desc":"",
	   "category":21,
	   "images":[
		  "61o7x82K9lL._SX679_.jpg",
		  "513fNy4wQ2L.jpg",
		  "412U4LXaw0L.jpg",
		  "610Ea-TQ2ML._SX679_.jpg",
		  "610Ea-TQ2ML._SX679_.jpg",
		  "71zi4sv3fmL._SX679_.jpg",
		  "71QHfO4cDXL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"8.26",
	   "comments":[
		  "Highly adjustable for various sizes. I'm a 5'1\" female and I wasn't very sure that this would fit me, but it's fine. I have it as tight as the shoulder straps can go (you would have to undo the stitching at the back to make these shorter) but the waist can still be tightened more for someone with a smaller waist than mine. I haven't worn out outside yet, but I've tried the reflectivity with my phone flashlight and it is very bright. This will definitely increase my confidence while cycling at night. Drivers won't be able to say they didn't see me now!",
		  "Bought this to wear when I ride my scooter at nighttime due to living in a rural area with no streetlights, and I didn't want a heavy vest or jacket for the summer. Very impressed with the quality, seems very sturdy and not flimsy. Easily adjustable, and works as intended. Would highly recommend as a lightweight alternative to reflective vests or jackets.",
		  "Seemingly good quality and the price was fair. My \"challenge\" with this item is putting it on with the buckle in the best place. My solution is to first fasten the buckle and put it on over my head and then, when I return from a morning run, I use the buckle to take it off. Highly recommended.",
		  "I bought this for my husband who needs to wear hi-viz for work, I was hoping it would be something he could wear over anything but he seems to find it uncomfortable and prefers to wear hi-viz t shirts instead. It seems like a good product though, for biking or for situations where you'd need to be high visibility temporarily",
		  "I wear this when I walk to work early mornings or late nights because I'm concerned about getting run over by careless drivers. This product does what it is intended to do. The straps are easy to adjust and fit well. No surprises, no complaints here.",
		  "This is great for walking, running, or cycling! It doesn't have as much surface area as a full vest, but it also bundles up and stores a lot smaller and easier than a full vest. When it's on you can't even tell, it's so light and this it doesn't restrict airflow which is great for exercise.",
		  "Exactly what I was looking for. I was in need of a minimal hi vis vest for work in landscaping and I don't even notice wearing this all day. I was a little worried as some people say it has fallen off their shoulders but I am a broad shouldered male and haven't had that problem with this product. Will buy again if I need a replacement.",
		  "This is a great product, I bought it for my son who bicycles to school & it fits over his winter jacket because it is adjustable. Much better than those bulky safety vests. Also very quick delivery time."
	   ],
	   "numberOfRates":27,
	   "avarageRate":2.738431377993719,
	   "id":129
	},
	{
	   "productTitle":"5BILLION Microfiber Yoga Towel for Yoga Mat - 61cm x 183cm - Hot Yoga Towel, Bikram Yoga Towel, Ashtanga Yoga Towel - Non Slip, Super Absorbent, Machine Washable, Fast Drying - Free Carry Bag (Gray)",
	   "desc":"",
	   "category":21,
	   "images":[
		  "71EJEiYxKCL._SY355_.jpg",
		  "71A9IxL%2BnQL._SY355_.jpg",
		  "81KkmTg4bBL._SY355_.jpg",
		  "71v1pd1UkbL._SY355_.jpg",
		  "71qHOEd8%2BzL._SY355_.jpg",
		  "71dWqrYkoxL._SY355_.jpg",
		  "71DYQFlaowL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"23.99",
	   "comments":[
		  "It is great for workouts where I am really sweaty during a workout and that causes slipping on my mat. However, when doing downward dog or plank, my toes are still slipping too much to be as stable as I'd like. Great fit for my mat though (from lululemon).\n\nUPDATE: The customer service is really great though, I was immediately contacted following my review to see if I wanted a refund, but this towel is still great for keeping my mat dry. I was pleasantly surprised that they cared enough to contact me.",
		  "A bit oversized for my gaiam mat but this makes it really easy to put on and the little tabs work great. It doesn't slide around on the mat but it's slippery when dry. Putting some water where your hands and feet go worked really well for me.\n\nGreat mat for the price",
		  "Great value! You can buy 3 of these for the price of one towel at the local hot yoga studio. If you want it to be truly non sip then I recommend sprinkling some water on it before use. We have also found after numerous washes this towel remains as good as new.",
		  "Feels good. Soft. Thick like my yogitoes towel. Haven't yet used it for hot yoga but I will change my review of I am less than 4 star happy.5 stars if the logo wasn't so big on the towel as I do find it a bit of a distraction. Future design might be no words and a simple symbol that has some zen balance to the design. Perhaps in the center for allignment use. Just a thought.",
		  "It doesn’t even hold grip, my feet slide off of it\nNot a very good towel for hot yoga\nStarted off really absorbent and non-slip. However, After a several washes, it now retains a sweaty gym-like smell and is quite slippery.\nNot as long-lasting as I had hoped!",
		  "I bought this as an additional yoga towel to use during Hot Yoga classes, but I find the shape is too narrow and long for my Lululemon yoga mat so the functionality isn't great.\n\nIt's ok as a backup towel, but it is never my go-to towel for yoga. I would say save up your money and buy the lululemon one/wait until it goes on sale.",
		  "I am into Hot Yoga and at first I was hesitant to make an unnecessary purchase - But this towel is like magic where soaking is concerned and is actually a must have! Love the colour and quality.",
		  "Started off really absorbent and non-slip. However, After a several washes, it now retains a sweaty gym-like smell and is quite slippery.\nNot as long-lasting as I had hoped!"
	   ],
	   "numberOfRates":81,
	   "avarageRate":1.7745887471526132,
	   "id":130
	},
	{
	   "productTitle":"AmazonBasics 1/2-Inch Extra Thick Exercise Mat with Carrying Strap, Blue",
	   "desc":"The yoga and exercise mat features a textured surface for enhanced traction. This type of reliable traction is important for stability and to safely maintain poses--anything from warrior one or downward dog to extended side-angle pose or plank. Just as useful for beginners new to floor-exercise routines as it is for experienced yogis, the AmazonBasics mat helps ensure you get the most out of your workout.The AmazonBasics 1/2-inch-thick mat offers an enhanced level of thickness. This extra-thick layer cushions your feet when standing and stretching, and it supports your body throughout all types of routines, especially during restorative poses.Designed to withstand everyday use, the AmazonBasics 1/2-inch yoga and exercise mat is made from durable foam that's both lightweight and strong.When finished with your workout, simply roll up your mat and attach the elastic carrying strap (included) to either end. With the strap in place, slip it over your shoulder for gym-bag-style carrying. The strap provides secure storage (preventing the mat from unrolling when propped up in the closet or stored in the car) and easy transport from home to the yoga studio or fitness club and back again.",
	   "category":21,
	   "images":[
		  "81NAFYPZYvL._SX355_.jpg",
		  "714hoxByp1L._SY355_.jpg",
		  "71GmR7tuHHL._SY355_.jpg",
		  "71qotgt8gEL._SX355_.jpg",
		  "81U4xc2yi7L._SX355_.jpg",
		  "91QIQNpz0QL._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"25.27",
	   "comments":[
		  "Much like others have said this may is very soft and spongy but it also tends to pull apart like a processed cheese slice. I am a big and I did a plank on it. Where my hands were started to pull apart the fabric on the first use.\n\nI don't think this is a great yoga mat but if you just want to use it for exercising (i.e. crunches) it is fine.",
		  "So far this exercise mat has been fantastic. I expected there to be a smell as I have experienced with similar mats in the past however I didn't notice one at all! It lays out well and doesn't curl back up after it has been rolled out. It does a great job staying in place without slipping and cushions the floor very well. The strap is only decent, not amazing.",
		  "This thing is THICK! You probably won't want to travel with it because it's quite thick and heavier than a usual mat but I keep this one at home for using on a hardwood floor while using my foam roller. For this purpose it's perfect. Downside is that now my partner wants in on the foam roller too and I have to wait my turn. Apparently buying bright pink wasn't a deterrent for him and I have to share my mat anyway.",
		  "When I saw how many people liked this mat I thought it would be a good idea, But when I got it firstly the box was damaged secondly the mat had holes and like tiny tears on it thirdly after my workout I noticed that the more tears appearing on the mat. I think the only good thing about this mat is when you’re doing a workout the gripping of the mat is good",
		  "Soft, thick mat is exactly what I was looking for. My injuries/disabilities make it difficult and painful to be on the floor, this mat gives enough padding so that I can get back to doing some adapted yoga and other rehab exercises. I don't recommend standing on it if your balance isn't good, the thickness can make you unstable (I only have one working leg, so my balance is poor).",
		  "I had this yoga mat for a total of 4 days before it tore (delivered March 27 tore March 30). I used it the first 3 days at home for light stretching and a beginners yoga class on day 4. While turning on my heal into a different pose, it tore the fabric. So disappointing, I loved the colour, length & thickness. But if this happened my first class, it’ll be destroyed in no time. Will be returning :(",
		  "Not impressed with this product. Right off the bat it seemed pretty good, very nice cushioning on the knees. However, after only a few months of sporatic use, the foam is packing out at the ends where your feet would go for plank, downward dog etc. I can tell the material will eventually fully disintegrate. This would only be useful for going very light exercises and its too stretchy and slippery for yoga anyway. Even plank would likely cause the foam to pack out.",
		  "I purchased this mat thinking it was a great deal for the price, and it looked good. I had to stop using it because it smells terrible and is really noisy. It seems like it has a permanent \"gassing off\" smell that plastic sometimes has, but it doesn't go away, and the smell is left on me after I am done using it. It is noisy as well when used. It makes squeaky sounds from the friction on the floor and hands and feet. I had to get rid of it and buy another mat. I wish it was ok because the price is good."
	   ],
	   "numberOfRates":21,
	   "avarageRate":5.688135472979749,
	   "id":131
	},
	{
	   "productTitle":"AMPM24 Men's Mechanical Skeleton Automatic Self-winding Black Stainless Steel Band Watch PMW269",
	   "desc":"",
	   "category":27,
	   "images":[
		  "712zcVdjW6L._UX522_.jpg",
		  "71SEm7VbhtL._UX522_.jpg",
		  "71IwP093sQL._UX522_.jpg",
		  "71puHyXiI0L._UX522_.jpg",
		  "811Dn3vIbtL._UX522_.jpg",
		  "71NMnSGOvLL._UX522_.jpg",
		  "71D3b2-e-8L._UX522_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"AMPM24",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"PMW269",
			 "val: ":"Model Number"
		  },
		  null,
		  {
			 "Key: ":"PMW269",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2017",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"Analog",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"fold-over-clasp-with-double-push-button",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"Alloy",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"42 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"14",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"alloy",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"22 millimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"Black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"Skeleton dial design",
			 "val: ":"Special features"
		  },
		  null,
		  {
			 "Key: ":"77 grams",
			 "val: ":"Item weight"
		  },
		  null,
		  {
			 "Key: ":"automatic-self-wind",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"10 millimeters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"manufacturer-and-seller-combination",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"32.18",
	   "comments":[
		  "AMPM24 Men's Mechanical Skeleton Automatic Self-winding Black Stainless Steel Band Watch PMW269\n\nI don't normally review items, but I have had an extremely good first impression with this watch. Bang for buck this watch is a home run, the watch has a good weight to it. It doesn't feel cheap, I will say that the band isn't the best band, but for the price I can't complain. I recently purchased an entry level Citizen watch and I will say that this watches band definitely feels higher quality surprisingly, but still is nothing to write home about. The watch case didn't have any loose pieces and seems solid overall. The watch looks like it is pictured, detail and inner workings look crisp.\n\nI cannot speak to how well this watch keeps time as I just received it, that is why I'm leaving my rating at a 4 star and ill be updating in the coming weeks to a 5 star if I don't have any technical issues.\n\nBased on first impressions and price point I would definitely consider purchasing another watch from this brand though.",
		  "It's a good watch, looks great, but feels a bit cheap, plasticky.\n\nThe main issue for me however is that, if you want to buy another watch band (the one it has is fine but I prefer silicon bands) you cannot take the info as it is written in this product description. Now I have a useless watch band and out 20$. Hey thanks guys ... It's not a 22mm band but a 20mm one. Beware because 22mm doesn't fit. (The description has three mentions of watch band width: two 22mm, one 2.0cm. Get your stuff together, seller.)",
		  "This watch is very good for the price, some of these mechanical watches can cost up to $250 but this is very good, the links aren't the best but overall it's a decent watch",
		  "I love this watch.\n\nI see everything that is moving and it's a self winding mechanism\n\nClassic and amazing",
		  "Although the face of the watch is really nice, the band is extremely cheap and caused a lot of grief trying to remove links. The band actually broke on me one day (mind you I hit it against something).",
		  "The face seems smaller than I thought but it’s exactly what you see. Seems durable enough. Does the job.",
		  "Nice watch. Great value",
		  "It's a nice looking watch, just hope that you don't need to remove links. The pins are near impossible to remove, and the band is extremely low quality."
	   ],
	   "numberOfRates":67,
	   "avarageRate":0.4352056926967167,
	   "id":132
	},
	{
	   "productTitle":"Mens Watches Top Brand Luxury LIGE Automatic Mechanical Watch Men Waterproof Full Steel Wrist Watch",
	   "desc":"",
	   "category":23,
	   "images":[
		  "71tYIPzqegL._UX679_.jpg",
		  "71ThKzRMURL._UX679_.jpg",
		  "71RouYmpJ-L._UX679_.jpg",
		  "71wVgLNUgkL._UX679_.jpg",
		  "81dHr8Z0wKL._UX522_.jpg",
		  "71QblrMB%2BqL._UX679_.jpg",
		  "81LeXJV5-iL._UX569_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"LIGE",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"5566233393",
			 "val: ":"Model Number"
		  },
		  null,
		  {
			 "Key: ":"LIGE9841",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2017",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"hardlex",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analog",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Fold-over-clasp-with-double-push-button-safety",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"1.57 inches",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"0.55 inches",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"0.79 inches",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"gold silver",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"blue",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"metal",
			 "val: ":"Bezel material"
		  },
		  null,
		  {
			 "Key: ":"calendar",
			 "val: ":"Bezel function﻿"
		  },
		  null,
		  {
			 "Key: ":"day-date-and-month",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"waterproof, calendar, luminous pointer",
			 "val: ":"Special features"
		  },
		  null,
		  {
			 "Key: ":"154 grams",
			 "val: ":"Item weight"
		  },
		  null,
		  {
			 "Key: ":"japanese-automatic",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"Contact seller of record",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"66.99",
	   "comments":[
		  "Great looking and feeling watch. Just be careful when sizing it as i stabbed myself down to the bone in my finger with the link sizing tool",
		  "Beautifully finished, reliable, enjoyable, gets compliments. I love it. The blue display background is darker than shown. It is a self wind automatic. Unless you are very active in day time. it will not run through the night Give it a few winds at night and it works well. Far preferable to laying out $22 annually to have a battery installed. There are self wind automatics available that run longer, otherwise this would rate five stars",
		  "Hi. I got my delivery, so far all is good only I need to readjust the side of the bracelet and not idea how make it. I follow what the manual said and I don't see anything of what the manual describe. BUT I still good with the watch.",
		  "This watch was defective.\nI had to returned it.",
		  "Great looking watch. Feels good to wear. Many compliments and it's only been a week.\n\nCrazy value. Looks and feels like a $1000 watch.\n\nI wear it all the time.",
		  "This is a beautiful watch....definitely worth the reasonable price.",
		  "This item is neat and beautiful... it’s good for passion..",
		  "only if it work as good as the looks will not buy again"
	   ],
	   "numberOfRates":27,
	   "avarageRate":0.8871030720010165,
	   "id":133
	},
	{
	   "productTitle":"Maserati epoca R8821118003 Mens automatic-self-wind watch",
	   "desc":"",
	   "category":23,
	   "images":[
		  "71VHafhJepL._UX679_.jpg",
		  "71VHafhJepL._UX679_.jpg",
		  "71FGottKNcL._UX679_.jpg",
		  "91Wm0dC0tKL._UX679_.jpg",
		  "71xCSQh7vML._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Maserati",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"R8821118003",
			 "val: ":"Model Number"
		  },
		  null,
		  {
			 "Key: ":"R8821118003",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"42",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"9.8 millimeters",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"calfskin",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"21 millimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"silver",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"499 grams",
			 "val: ":"Item weight"
		  },
		  null,
		  {
			 "Key: ":"automatic-self-wind",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"100 meters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"manufacturer",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"402.47",
	   "comments":[
 
	   ],
	   "numberOfRates":44,
	   "avarageRate":3.7959401248145492,
	   "id":134
	},
	{
	   "productTitle":"Men's Watches Chronograph Waterproof Military Quartz Luxury Wristwatches for Men Stainless Steel Band Black Gold Color",
	   "desc":"",
	   "category":27,
	   "images":[
		  "81fMkvcsXHL._UX679_.jpg",
		  "81T%2BnYnjZ9L._UX679_.jpg",
		  "81WDfgUOiGL._UX679_.jpg",
		  "71llRz8LPaL._UX679_.jpg",
		  "61Du0%2BHmwwL._UX679_.jpg",
		  "81kno5DwL1L._UX679_.jpg",
		  "61bY9FABVYL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"NIBOSI",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"2309-1-MKHMgd",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2018",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"fold-over-clasp-with-double-push-button-safety",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"1.69 inches",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"0.39 inches",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"0.86 inches",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"silver",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"date",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"chronograph, luminous, stop-watch, second-hand, waterproof",
			 "val: ":"Special features"
		  },
		  null,
		  {
			 "Key: ":"analog-quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"seller",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"35.99",
	   "comments":[
		  "Bought as gift, hope it works for the person receiving. Looks great",
		  "Love it"
	   ],
	   "numberOfRates":111,
	   "avarageRate":0.8616246465511743,
	   "id":135
	},
	{
	   "productTitle":"BOBO BIRD Mens Wooden Watches Luxury Mechanical Watch Lightweight Wood Band Timepieces for Men",
	   "desc":"",
	   "category":27,
	   "images":[
		  "51ALpxgPacL.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"BOBO BIRD",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":".",
			 "val: ":"Model Number"
		  },
		  null,
		  {
			 "Key: ":"CR05",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"15 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"R05-1",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"automatic-self-wind",
			 "val: ":"Movement﻿"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"69.99",
	   "comments":[
		  "Love the style. It's as cool as it looks in person as it does online. The extra pieces were very helpful, however the tool included to loosen or tighten the cuff BROKE on my second try, so it was difficult to adjust. Overall the watch is very cool and my husband loves it.",
		  "I LOVE this watch and so did the person I bought it for.\nI wish there was a similar one in a womens size!!!\nIt is well made, quality work. It is a substantial watch but is quite light. It's really fantastic.",
		  "Really liked to watch when it came but it only kept time for about 2 weeks before it stopped working. Emailed them with the problem a week ago and they still haven't responded. Don't waste your time and money",
		  "Fantastique! Livré en 1 jour. Produit d'excellente qualité. L'outil pour enlever ou ajouter des mailles au bracelet est bien fait. Je recommande sans réserve.",
		  "tres bien",
		  "Watch looked great until it stopped working after a couple of weeks. Now its a wooden bracelet.",
		  "Super confortable and light. More colors would be great. All black. Etc",
		  "Beautiful watch I like it"
	   ],
	   "numberOfRates":38,
	   "avarageRate":5.279182939709802,
	   "id":136
	},
	{
	   "productTitle":"Men's Sports Watches Analogue-Digital Quartz Watch Multifunctional Waterproof Military Wrist Watch Black Silicone Band",
	   "desc":"Package:1*Classic Sports Watch, 1* Exquisite gift box;Sports Watch is a great gift for Fashion, Birthday, Christmas, Valentine’s day, Wedding, New Year.",
	   "category":26,
	   "images":[
		  "71rmIYfqOqL._UX679_.jpg",
		  "81O8n5u-DyL._UY679_.jpg",
		  "71jpLw05kmL._UX679_.jpg",
		  "81sIaQaTNcL._UX679_.jpg",
		  "61t34w56kTL._UX679_.jpg",
		  "71kfNwRTZKL._UX679_.jpg",
		  "71RHbKsL%2BSL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"SPOTALEN",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"AL1606B",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"analogue-digital",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"1.88 inches",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"0.60 inches",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"Silicone",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"0.98 inches",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Bezel material"
		  },
		  null,
		  {
			 "Key: ":"japanese-quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"31.99",
	   "comments":[
		  "It arrived on the exact date it was promised (I believe it was 3 days after ordering it - came really fast), it looks and feels like an expensive watch, I would definitely buy this watch again and I would buy from this shipper again and I have with the same great results. It was also packaged really nice, came in a nice metal tin. This is the best value for money that I have ever gotten from amazon. The watch is a little heavy, but I knew that before I bought it and I am ok with it. I have had many compliments on how nice it looks from the first day I put it on.",
		  "This watch is beauty . It looks like a very expensive watch but isn't . A little bigger than I expected , but after wearing it , I love it . It's easy to read , looks good, and easy to set . The analog and digital settings were easy to set , but the day, month, & date were a little tougher , but it wasn't a Wall Street Investment so I figured it out . The watch came from ACFS1 in Mississauga Ont. and it came exactly when they acknowledged it would . If you want a good watch that's not too expensive , this is the one to buy .",
		  "Really nice feel. You know you have it on. Works great,I really like the style.",
		  "No bad. The only issue for me is that the metallic looking material( probably plastic) that is integrated in the watch is too shiny (unlike how to looks in the picture) to be believed metal so it looks somewhat cheap. other than that, it is a good looking, good functioning watch.",
		  "I’ve bought this for my dad, who likes wearing wrist watches and pretty much have a huge collection of them. I think it’s his favourite piece now, cause I’ve been told he wears it every day, which didn’t happend to all the previous watches he owns.\nI took a look at the watch and set time and date, when I got them delivered. Setting up it’s not terribly complicated, and I figured it out within minutes. It comes in a nice metal box, so if you thinking about gifting them - it’s already nicely packaged.\nIt’s quiet big though, so definitely made for man only.",
		  "Wow nice worth the price",
		  "Purchased as Gift for my buy, who loves it! It’s a bit bigger on his wrist than I thought, but it is an attractive watch. It’s got a few more bells and whistles we haven’t figured out how to work yet. Love the back light, the stop watch, date, time at a glance. Oh and it’s waterproof- helpful for working outside.",
		  "This watch looks nice, but you need to avoid any water getting on it. It rained and it got wet.. well there is a load of condensation that built up inside the watch. It was a light rain so this watch is not even water resistant. Disappointed as this was purchased 4 months ago, and the wear on it is excessive also. Very upset."
	   ],
	   "numberOfRates":164,
	   "avarageRate":3.5071003421587728,
	   "id":137
	},
	{
	   "productTitle":"Sewor Skeleton Transparent Mechanical Hand Wind Stainless Steel Leather Watch With Gift Box (Rose Gold)",
	   "desc":"",
	   "category":25,
	   "images":[
		  "81slaKyK1bL._SY450_.jpg",
		  "81tpZEVo0vL._SY450_.jpg",
		  "71Rmr%2BF1TeL._SY355_.jpg",
		  "71sNXmGKInL._SY355_.jpg",
		  "81knt%2BUOhPL._SY355_.jpg",
		  "51Nww7SJMTL._SX355_.jpg",
		  "91cyuU5quiL._SY450_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"36.00",
	   "comments":[
		  "I was so excited to receive this watch based on previous reviews. I always loved the idea of owning a mechanical watch and thought that this would be a great introductory model.\n\nTo start off, the packaging was very secure. The watch comes insulated within its own watch box. The watch box itself is lined with foam. There were no damages and the watch looked very good.\n\nHowever, the first detail i noticed was that the strap buckle is a stainless steel colour and takes away from the rose-gold aesthetics of the watch face. The leather strap is very stiff, but instructions in the box are reassuring in that it will become more comfortable with wear.\n\nAs for the watch sizing, the diameter of the watch is advertised accurately at 43mm, but the height of the watch is way off. It is not the advertised height of 10mm, but almost double that at a measured 19mm. The height difference gives the watch a very bulky appearance.\n\nSo far, the watch has kept time pretty accurately. I have yet to see how long the spring life lasts before needing to be rewound.\n\nOverall, I would say that this watch is an okay product. You definitely get what you pay for.",
		  "A very nice watch. Does not look cheap like some other watches in this price range. doesn't keep the time very well but I do not care. This more of a fashion statement than an accurate time keeping watch",
		  "Very sexy. Works fine so far. Love it. Edited review, the back of the watch fell off after one month. Cheap quality I guess, too bad, it looked really good.",
		  "good balcen quality/price",
		  "Great watch for the price just be careful not to over wind it. The band starts to crack after about a month or two.",
		  "This watch looks a lot more expensive than what it sells for. I have not had it long but so far I am very happy with it.",
		  "thia has tonbe the sexiest sewor watch for a women",
		  "Great for time."
	   ],
	   "numberOfRates":20,
	   "avarageRate":4.412448845718986,
	   "id":138
	},
	{
	   "productTitle":"Sewor Men's Dress Mechanical Skeleton Transparent Vintage Style Leather Wrist Watch",
	   "desc":"",
	   "category":24,
	   "images":[
		  "818KaIQfrYL._UX569_.jpg",
		  "81Dw7ccnqcL._UX679_.jpg",
		  "81AV4wXM9cL._UX679_.jpg",
		  "81iJWVfZrCL._UX679_.jpg",
		  "81Gnb3ec8GL._UX679_.jpg",
		  "91BwsrgzBvL._UX679_.jpg",
		  "51J%2ByS4ZzKL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"SEWOR",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"C847",
			 "val: ":"Model Number"
		  },
		  null,
		  {
			 "Key: ":"C847",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2016",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"Glass",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"4.10 centimeters, 5 centimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"1",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"Leather",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"2.10 centimeters, 2.1 centimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"white",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"mechanical-hand-wind",
			 "val: ":"Movement﻿"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"35.00",
	   "comments":[
		  "Never having owned a skeletonized watch I bought this out of curiosity and as a novelty. The watch is better looking than I had expected and I love seeing the mechanism in operation. It arrived well packaged, in an attractive box. The crown works smoothly, so far. After some initial problems with starting and stopping the movement seems to have settled out and is now keeping good time with a power reserve of about 24 hours. It uses a variant of the Chinese Standard Movement and is not the most rugged of watches, you have to guard against shocks and knocks. It takes a little practice to distinguish the hands from the movement (in order to tell the time) but once you get used to it, it's a cinch. As reported by other customers the supplied strap is initially very stiff and hard to put on . I'm hoping it will become more supple with wear. It appears to be real leather (it's stamped \"genuine leather\"- for whatever that's worth) and it does look good with the watch. The strap is just big enough for thick (8-9 inch circumference) wrists. Bottom line is that for the price this is a good looking fashion or novelty watch that keeps reasonable time, for a manual wind-up. If you are looking for a sturdy, dependable, very accurate timepiece in this budget range I would recommend a Timex or Casio.\n\nOne year on, watch is going strong. Strap has become more pliable with wear. Still accurate enough for everyday use. Like any mechanical watch it tends to lose time. I find I'm adjusting it < 1 minute every week, or so. Good enough for me. I have other watches for accuracy. This is my skeletonized, Mao Tse Tung watch!",
		  "The watch looks very classy and I've received several compliments about it. Since it's a mechanical watch, you do have to wind it every so often or it dies and loses the time. The watch generally lasts half a day before it dies on me. The watch strap is very stiff, and even after using it many times it is still very stiff. The strap now has permanent wrinkles at the length I strap it at, and scuff marks because the stiffness makes it so hard to put on. It looks great for the price, but I would replace the strap.",
		  "It looses or gains 5min a day but for 40$ what do you want. I love how it looks all gears no batteries. The face was more silver then it looked and would have probably bought the black wristband if I had realized but a wrist band is an easy thing to change.",
		  "Bought two of these watches. The brown and black models. The time pieces are exactly as described. For the price you can’t go wrong. Everything works perfectly. The watch is stunning, and a great conversation piece. To loosen up the leather band you can wrap it around a watch pillow so that it takes a more circular form. As you use it more, the band forms to your wrist and becomes more comfortable.",
		  "La montre fonctionne très bien, le mécanisme est en mouvement ce qui l’an rens vraiment intéressante, c’était le but de l’achat. Par contre , les pièces du mécanisme semblent de piètre qualité (finition, poli esthétisme)et on peut voir le manque de finition, mais pour le prix et comme nous n’avons pas les yeux rivés dessus, ça peut aller. Assez satisfaite en général.",
		  "the watch itself is fantastic for the price. It looks very unique and it functions as advertised! The only complaint i have is the strap is pretty cheap and the leather doesn't bend or flex well even after repeated use..still a cool watch!",
		  "Very stylish looking watch. Seems to be on the delicate side of things. So just be careful when winding it up. Works great. Bought it for my boyfriend he loved it. The straps take a couple days to loosen up. They were pretty stiff at first. Othere then that happy with my purchuse and the price.",
		  "Looks fancy. Obviously, the gears on it doesn't move and it's glued on, but it doesn't look bad.\n\nIt's a fun watch if you're not looking to be taken seriously."
	   ],
	   "numberOfRates":116,
	   "avarageRate":0.06088041997386817,
	   "id":139
	},
	{
	   "productTitle":"Mens Watches Analog Quartz Casual Stainless Wrist Watch with Black Milanese Mesh Band and Date Window",
	   "desc":"A watch with a stylish classic design. With date, week and 24-hour system. This time, the week’s expression is no longer in English, but in German. This will be a special part of the watch. It meet your daily needs. Whether it is in appearance or quality, this will be a good gift choice for friends and relatives.We have a strict quality control systemAll watches sold in ALICOU have undergone strict quality control. We carefully check the watch so that everyone can enjoy the cost-effective products.",
	   "category":23,
	   "images":[
		  "71YOT%2BUJWsL._UY679_.jpg",
		  "619cywJEI3L._UX679_.jpg",
		  "61BkxP6ESTL._UX679_.jpg",
		  "61lT2JEM5lL._UX679_.jpg",
		  "51Y2sTkiVmL._UX679_.jpg",
		  "614hYdhwFGL._UX679_.jpg",
		  "719oDuhfrhL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"SPOTALEN",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"AL0123B",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"1.57 inches",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"0.37 inches",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"0.79 inches",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"japanese-quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"31.99",
	   "comments":[
		  "This watch is slightly small for men's. I bought this for myself but my daughter ended up keeping it because it suited her better. The watch comes in a little black box so if you're thinking of purchasing it as a gift, you may have to repackage as the box looks like it could be used for tea leaves.\n\nThe strap was different from the other leather watch straps that we were used to. Strap texture feels like it's made of metal but it's not too heavy. There is a tool included so you can move the buckle along the strap to fit your wrist size. Without instructions it is a little hard to do that, and takes a while to figure out how to adjust the size. Would be nice if company included clear instructions of how to adjust the buckle with the given tool.\n\nThe best part is the watch face - very classy, elegant, and encased in nice glass. The watch also shows the date, which is convenient. One drawback is that when the arms line up together, sometimes you have to look closely to see what time it actually is (the arms blend into one when lined up).\n\nOverall good watch for its low price, and can be great for ladies.",
		  "Good watch, thenclosing may be a little tricky, just follow the instruction on youtube ( type how tlto adjust watch clasp on aetal mesh strap) the closing is tricky, you need to apply little bit of pressure to fix the clasp the it will be perfect. Overall really nice and simple watch. You can adjut the day following the instruction. Picture attached.",
		  "I returned the watch for credit because I had problem with the steel bracelet . I drop three times the watch because the bracelet opened by itself . Luckily I was able to recuperate the watch each time . So I returned the watch for that purpose . The watch though works perfectly and looks beautiful .",
		  "Beautiful simplicity. I can summarize by saying I do recommend this watch. I've never warn a watch with this type of bracelet before and was worried that the metal links might grab my hair, but they did not. The domed watch glass is nice looking - I am not sure what it is made of, so time will tell how scratch resistant it is. The little diamond bits are slightly misplaced inside the watch... it's not very noticeable, so I'm going to say that it only adds to the character, but I may have been annoyed if they were more crooked. Overall, I really like it and would definitely recommend at the price i paid $34\n\nUPDATE: I still like this watch, but i have adjusted my rating from 5 to 4 stars for two reasons:\n1. The bracelet is actually difficult to unclip and remove from my wrist. Generally, I have to use the tool which comes with this watch, or a key if i am not at home to be able to remove the pry the clasp open. Slightly inconvenient.\n2. The bracelet edge is a bit abrasive, and I have a small spot on my skin chafing, though I don't actually feel any pain.",
		  "Très jolie montre. Excellent mécanisme d'horlogerie. Elle indique l'heure exacte sans perdre ni gagner de secondes depuis que je l'ai reçue il y a plus de 3 semaines.\nBiden est une bonne marque de montre.\nMerci Alicou pour l'emballage sécuritaire.\nCette montre offre un bon rapport qualité/prix.",
		  "This watch is a very decent looking and great quality watch. It arrived on time, in great shape no scratches or anything during shipping. All of the dials work as they should. The watch feels very comfy on the hand, it has an adjustable band which is very easy to adjust. Great quality.",
		  "Took me a while to figure out how to adjust and fasten the strap but its easy once i got the hang of it. The mesh strap feels great, much better leather. I also haven't notice the ticking when i sleep... though i usually watch Netflix untill i pass out so... The date window is probably the aspect i like the most. I can always remember what day of the week it is but the never the day of the month, so it just has what i need. Overall its very nice looking minimalist watch and goes well with whatever you wear...or don't wear",
		  "I knew I was purchasing a very cheap watch. The lock latch would not stay done up. Had to get my tools to adjust the connection. It’s okay, just thought it would look a little nicer based on the photos."
	   ],
	   "numberOfRates":130,
	   "avarageRate":3.9613016664079743,
	   "id":140
	},
	{
	   "productTitle":"CADISEN Mens Sport Military Chronograph Casual Quartz Watch with Genuine Leather Band",
	   "desc":"",
	   "category":26,
	   "images":[
		  "71NArxwFo8L._UX679_.jpg",
		  "81hZVBgrorL._UX679_.jpg",
		  "81M-N-v3y1L._UX679_.jpg",
		  "81jti3WvY%2BL._UX679_.jpg",
		  "71IhJfuAZ8L._UX679_.jpg",
		  "51H9-DidXGL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"CADISEN",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"B9017MNBB",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2017",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"Glass",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"43 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"12 millimeters",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"calfskin",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"22 millimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"Black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"date",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"50 grams",
			 "val: ":"Item weight"
		  },
		  null,
		  {
			 "Key: ":"Quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"19.90",
	   "comments":[
		  "This is a nice watch. I like that it has the date as well as a stop watch. I also like that it has glow in the dark hands and spots where the numbers would be. However, as a woman with a tiny wrist and hands, it looks huge and disproportionate on me. I understand that it is a men's watch so I didn't exactly expect it to be dainty but it's clunky. It's also very heavy. I decided on this watch because I can never find a women's watch with the date that is also waterproof. If this is actually waterproof then I'll consider giving it a higher rating but if it's not then I'll likely be returning it.",
		  "Very nice looking watch, but after owning it for only 6 weeks, it has stopped working. Tried a new battery and it still didn't work. Bad quality.",
		  "Very nice",
		  "It was really good left it out Side in rain and snow and it still works like new",
		  "Nice.satisfied"
	   ],
	   "numberOfRates":185,
	   "avarageRate":5.560459372476068,
	   "id":141
	},
	{
	   "productTitle":"CRRJU Men's Multifunctional Luminous Quartz Watches with Leather Strap, Mens Sports Waterproof Wristwatch",
	   "desc":"",
	   "category":23,
	   "images":[
		  "71hI8QzY9VL._UX679_.jpg",
		  "71lZhF5FoNL._UX679_.jpg",
		  "71ZaJhAIwML._UX679_.jpg",
		  "71xQckWsTWL._UX679_.jpg",
		  "71ca8a7htOL._UX679_.jpg",
		  "7185Bb18owL._UX679_.jpg",
		  "61fI7amV4DL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"CRRJU",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"CA2215or",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"hardlex",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"45 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"12 millimeters",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"leather",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"22 millimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"orange",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"calendar",
			 "val: ":"Bezel function﻿"
		  },
		  null,
		  {
			 "Key: ":"date",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"luminous, light",
			 "val: ":"Special features"
		  },
		  null,
		  {
			 "Key: ":"analog-quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"38.99",
	   "comments":[
		  "love this watch, straight from the box to my wrist, right away fell in love with it. +++",
		  "Great price and works well i get lots of compliments on the watchh",
		  "the only thing about this watch is that the watch does not glow long in the dark"
	   ],
	   "numberOfRates":167,
	   "avarageRate":0.56973213022146,
	   "id":142
	},
	{
	   "productTitle":"LIGE Mens Watches Waterproof Chronograph Sport Analog Quartz Watch Men Mesh Stainless Steel Black Wristwatch",
	   "desc":"",
	   "category":24,
	   "images":[
		  "71BiXKpYzGL._UX679_.jpg",
		  "81SyohXW5FL._UX679_.jpg",
		  "71cqhpAqQvL._UX679_.jpg",
		  "71RtEScsE9L._UX679_.jpg",
		  "81o7lhnAskL._UX679_.jpg",
		  "71NBytxQ-XL._UX679_.jpg",
		  "71XFKmZRjRL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"LIGE",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"LIGE9834",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2018",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"hardlex",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"hook-buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"1.65 inches",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"0.45 inches",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"0.79 inches",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"metal",
			 "val: ":"Bezel material"
		  },
		  null,
		  {
			 "Key: ":"calendar",
			 "val: ":"Bezel function﻿"
		  },
		  null,
		  {
			 "Key: ":"day",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"japanese-quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"seller",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"35.99",
	   "comments":[
		  "I ordered this watch for myself and have been using it for roughly 2 weeks now. It seems to keep time very well and looks great. I have bigger than average wrists and it fit with about 1.5\" of band to spare. I have only noticed one issue and that is when setting the time the minute hand jumps ahead 10 to 15 minutes when you engage the dial button. It can be a little frustrating, but it doesn't do it all the time so if you mess around with it you eventually get it to set where you want it. I would still recommend this watch especially for the price.",
		  "Good watch, - received product but was missing the DIY tool to adjust the watch band.\nThe box was not sealed properly so looked as if it was shipped to someone prior to me who returned the product having taken out Band Tool.\nBecause of that I cannot rate this 5 stars.",
		  "tres belle montre ,mais le bracelet est a chier.",
		  "Very nice but not sizeable as stated in advertisement. Came with a small tool that is not the right one.",
		  "A light weight and very classy watch. I was bit worried about this product but when it arrived and I used it, truly a amazing product. We can adjust the watch on our own, this is the cool feature of it. You can buy it without thinking twice. I am just loving it",
		  "Great looks but unfortunately not sealed, face fogs from time of arrival.",
		  "A great looking watch at a very affordable price. Looks much more expensive. Get more compliments then I do with my expensive TAGS.",
		  "Great looking watch.\n\nElegant and professional...\n\nVery pleased.... definitely recommend it"
	   ],
	   "numberOfRates":89,
	   "avarageRate":4.447375543484608,
	   "id":143
	},
	{
	   "productTitle":"CADISEN Men Watch Chronograph Calendar Waterproof Sporty Quartz Wrist Watch for Men with Stainless Steel Band,Blue",
	   "desc":"",
	   "category":23,
	   "images":[
		  "71-Yq6PpqyL._UX679_.jpg",
		  "81roVTBb52L._UX679_.jpg",
		  "81h6DfJI0ZL._UX679_.jpg",
		  "81nTPKE0dDL._UX679_.jpg",
		  "51C4Xi4jvOL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"CADISEN",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":".",
			 "val: ":"Model Number"
		  },
		  null,
		  {
			 "Key: ":"9054",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2017",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"Glass",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"fold-over-clasp-with-double-push-button-safety",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"metal",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"46 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"13 millimeters",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"24 millimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Bezel material"
		  },
		  null,
		  {
			 "Key: ":"calendar",
			 "val: ":"Bezel function﻿"
		  },
		  null,
		  {
			 "Key: ":"date",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"159 grams",
			 "val: ":"Item weight"
		  },
		  null,
		  {
			 "Key: ":"Quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"33.99",
	   "comments":[
 
	   ],
	   "numberOfRates":22,
	   "avarageRate":5.085621139407107,
	   "id":144
	},
	{
	   "productTitle":"Mens Watches Men Steampunk Automatic Skeleton Mechanical Waterproof Black Designer Stainless Steel Wrist Watch Luxury Classic Luminous Tourbillon Hand Wind Analogue Watches for Men",
	   "desc":"",
	   "category":27,
	   "images":[
		  "71N8BnrATGL._UX679_.jpg",
		  "71FxnmT5ozL._UX522_.jpg",
		  "81jXEvxqtKL._UX679_.jpg",
		  "71EG06mdnKL._UX679_.jpg",
		  "71OvGIJ6AUL._UX679_.jpg",
		  "719jTpmL66L._UX679_.jpg",
		  "81M43JkYPrL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"MEGALITH",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"meca-8006 black",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2019",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"Glass",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Double-locking-fold-over-clasp",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"43 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"13",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"21 millimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"24-hour-time-display",
			 "val: ":"Bezel function﻿"
		  },
		  null,
		  {
			 "Key: ":"automatic-self-wind",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"seller",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"52.99",
	   "comments":[
		  "J'aime bien la montre, mais l'aspect mécanique ne fonctionne pas bien. je la porte depuis 1 semaine sans arrête et je la porte meme en allant faire du jogging. Par contre, le temps continue d'arrêter par manque de batterie. le mécanisme pour charger ne bouge pas facilement."
	   ],
	   "numberOfRates":47,
	   "avarageRate":3.1860791315636345,
	   "id":145
	},
	{
	   "productTitle":"MDC Mens Minimalist Ultra Thin Brown Leather Watch Dress Casual Classic Slim Simple Wrist Watches for Men",
	   "desc":"",
	   "category":23,
	   "images":[
		  "71GuT7qMOFL._UX679_.jpg",
		  "71qhluJ0JyL._UX679_.jpg",
		  "81bOo6AxRNL._UX679_.jpg",
		  "71H6SSNzxrL._UX679_.jpg",
		  "71GWNkYQkPL._UX679_.jpg",
		  "81i0DVQsi1L._UX679_.jpg",
		  "61kPMcUUdUL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Infantry",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"4895203600968",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2018",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"Mineral",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analog",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"40 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"7.50",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"leather-synthetic",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"20 millimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"blue",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"blue",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Bezel material"
		  },
		  null,
		  {
			 "Key: ":"date",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"41 grams",
			 "val: ":"Item weight"
		  },
		  null,
		  {
			 "Key: ":"japanese-quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"manufacturer-and-seller-combination",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"34.99",
	   "comments":[
		  "Looks very beautiful, in fact a lot better in person than in pictures.\n\nThe hour hand and the minute hand is about 5 minutes off from each other (the hour lags behind by about 5 minutes or it's the minute hand that is 5 minutes ahead of the hour hand). Bothered me a little bit but eventually I got used to it.\n\nStrap is stiff, I don't think it's real leather and I don't know how long the leather look would last until it starts deteriorating if not peeling.\n\nThis watch gets the job done and looks great as a business-casual minimalist watch.",
		  "Bought this as a Christmas present for my brother. He was very happy with it! It has a beautiful classical look that compliments any wardrobe style. The straps are a tad stiff but with time they will soften, but definitely not a deal breaker!",
		  "Seemed like it didnt work cos theres seconds arm. Opened it up to change battery and there wasntmuch in there just very tiny motor very cheap looking. Adjusted to right time and realized its actually working. Well worth the money overall",
		  "This is a simple watch that will get lots of complements! It's a timeless piece that keeps time. Leather straps a bit stiff at the start but you'll break it in with use.",
		  "The watch stopped working after using for less than 4 months. I replaced the battery but it still doesn’t work. The watch is very cheaply made. Do yourself a favour and buy something else",
		  "Strong, looks good, seems very durable, keeps good time, comfortable",
		  "Watch is alright, very simple, doesn't have a luxury look, leather straps are also not the best. Overall for it's price the watch is a pretty good buy and if your not looking to buy something too flashy and on the less expensive side, this is what youd be looking for",
		  "The watch face was really nice although I found the wristband too stiff ... packing was well done.\n\nThank you !!"
	   ],
	   "numberOfRates":162,
	   "avarageRate":5.7430735489659845,
	   "id":146
	},
	{
	   "productTitle":"LIGE Watches Men Classic Sport Waterproof Quartz Analog Watch Fashion Stainless Steel Wrist Watches with Chronograph Date Gold Blue",
	   "desc":"",
	   "category":27,
	   "images":[
		  "71N19t7Jq8L._UX679_.jpg",
		  "81wLbL1Ep2L._UX679_.jpg",
		  "715OXQXkc1L._UX679_.jpg",
		  "818DE5NQyhL._UX679_.jpg",
		  "713wLkISA9L._UX569_.jpg",
		  "710fxMUIrDL._UX679_.jpg",
		  "71G4sHuGRQL._UX569_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"LIGE",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"LG9874A-HSJ-CA",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2018",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"hardlex",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analogue",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"1.65 inches",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"0.47 inches",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"leather",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"0.87 inches",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"calendar",
			 "val: ":"Bezel function﻿"
		  },
		  null,
		  {
			 "Key: ":"date",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"Waterproof, luminous, calenda, running seconds, 24-hour display",
			 "val: ":"Special features"
		  },
		  null,
		  {
			 "Key: ":"Analogue Quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"seller",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"39.99",
	   "comments":[
		  "I bought this watch for my grandson just after Christmas. It arrived in 2 days and we were both impressed with the apparent quality of both the watch and the leather band. It functions well, has a good weight to it and looks expensive. Very good value.",
		  "I bought this watch for my friend as a gift and he was very satisfied with it. The design is very eye catching and looks like an expensive watch. In the future, I am going to buy my dad this watch for his birthday.",
		  "Super fast shipping.\nWatch was exactly as described. Maybe even better. Didn't have my Hope's set to high for the price but it definetly delivered. I have paid 5 times the price for this kind of style,quality and features.\nHighly recommend.",
		  "My 15 year old boy fancies himself a snappy dresser. He loved getting this watch for Christmas.",
		  "This watch looks very nice, has a nice weight to it, the material is superior and all the dials work as expected. Overall very good",
		  "Awesome",
		  "Good quality everything works well. Will by another one. It’s rose gold",
		  "Excellent product."
	   ],
	   "numberOfRates":7,
	   "avarageRate":2.5790574962652433,
	   "id":147
	},
	{
	   "productTitle":"Akribos XXIV AK864 Enterprise Mens Casual Watch - Sunburst Effect Dial - Quartz Movement - Leather Strap",
	   "desc":"",
	   "category":25,
	   "images":[
		  "81n0aROR2eL._UX679_.jpg",
		  "81V4NsksKDL._UX679_.jpg",
		  "71CShGSu2eL._UX679_.jpg",
		  "81AwpyA5TXL._UX679_.jpg",
		  "71KT0va0DKL._UX679_.jpg",
		  "918t1quWGuL._UX679_.jpg",
		  "91n8-3lJaIL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Akribos XXIV",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"AK864",
			 "val: ":"Model Number"
		  },
		  null,
		  {
			 "Key: ":"AKN864",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"Rounded Mineral Crystal with Sapphire Coating",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analog",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"42 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"leather-synthetic",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"7.50 inches",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"Black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"silver",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"Day of Month, Day of Week, Tachymeter, Classic Three Hand Movement with Two Time Zones and Date Complication, Sunburst Effect Dial with Engraved Concentric Circles on Subdials, Baton Style Hands with Luminous Fill, Applied Roman Numerals and Stick Index",
			 "val: ":"Special features"
		  },
		  null,
		  {
			 "Key: ":"Quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"100 Feet",
			 "val: ":"Water resistant depth"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":3373,
	   "comments":[
		  "Low quality. As I found out these watches are overpriced in order to sell them with a large discount and people fell into the trap. It seems fancy but the quality is not that good and you can feel how cheap it is the time you will wear it. The buttons for the days and date change them directly without any \"lock mechanism\" and as a result every time you look at your watch while wearing it the date and day will be different than before and you will have to fix every time!",
		  "This watch is everything I hoped it'd be:\nHuge\nBlack\nHeavy\nDistinguished\nI've had it about a year now, wear it daily, and I have had virtually no problems with the watch. I did bump/pinch it and one of the pins fell out of the bracelet, but I was able to put it back in on the spot and never had trouble with it again. After reading other reviews I must add that indeed the date buttons are active all the time, not just when the crown is out in time adjuatment mode. So yes, you can lose the day and date quite easily, but I never have. I love it. The finish is beginning to thin out a bit around the edges and corners, showing the intermediate platings of metals underneath. But then I wear it every single day, including at the gym. If they could only make a bigger one...",
		  "I was very disappinted in the cheap feel of the watch. It was expensive even on sale - I paid $80 after CDN exchange and it was not worth it. The strap is sharp edged and tinny sounding and even though it looks nice, it's a disappointment. I would never buy this brand again!!",
		  "I bought this for my dad on Father's Day and he really liked it. The quality and style is good but I feel it could be a bit heavier. I won't say it feels cheap but it's just not there yet. Haven't been able to figure out the buttons but that's my fault for trying things without reading the manual. Still, it's not as intuitive to use as I had hoped. I know my dad certainly isn't going to use all the features on it due to this fact.",
		  "Looks nice but I wouldn't wear it anywhere fancy. Very cheap made watch. Guaranteed to break within the first year of purchase. After sizing it 2 days after I got it the strap's pin is now too small for the hole and my strap is constantly falling apart. And it sounds hollow",
		  "Decent watch, It's fairly heavy which i prefer. Knocked it at some point and now one of the coverings for where the bad attaches to the watch itself is lose and rattles. Other than that it seems fairly well built The only thing i really don't like is how easy the date is to change because all one has to do is push the top button and the date changes but I find I knock it a lot and am almost constantly a day or two ahead. That's the only problem i have with what is otherwise a decent looking watch.",
		  "Great for the price I paid, even at regular price at about $80 it’s definitely worth the buy, I’m a watch guy and trust me for under a $100 this brand is giving you A LOT!",
		  "Don't buy this watch. Had it for about one year . I wore it on special occaions. Now the watch quit working. Took it to a jewler, battery ok but mechanism no longer operative. Will cost more than original cost of watch to have it fixed. Can't believe this product is available for sale. I bought cheaper watches at a relaible store many years ago and still using.\nThis watch looks great but is a piece of junk!!!!"
	   ],
	   "numberOfRates":100,
	   "avarageRate":1.450726698662471,
	   "id":148
	},
	{
	   "productTitle":"Luxury Fashion Mens Watches Stainless Steel Heavy Sport Chronograph Waterproof Date Alarm Multifunction Analog Digital Watch",
	   "desc":"",
	   "category":24,
	   "images":[
		  "71b-42reuZL._UX679_.jpg",
		  "71zX0ARSzFL._UX679_.jpg",
		  "71N1xoC8sIL._UX679_.jpg",
		  "71s9agyv%2BzL._UX679_.jpg",
		  "81NicMN8U-L._UX679_.jpg",
		  "71J9g9lMq0L._UX679_.jpg",
		  "81ojh%2BvHqZL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Affute",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"108-G-B",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"2018",
			 "val: ":"Model Year"
		  },
		  null,
		  {
			 "Key: ":"round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"hardlex",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analogue-digital",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"1.81 inches",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"0.63",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"0.83",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"gold",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"stainless-steel",
			 "val: ":"Bezel material"
		  },
		  null,
		  {
			 "Key: ":"24-hour-time-display",
			 "val: ":"Bezel function﻿"
		  },
		  null,
		  {
			 "Key: ":"day-and-date",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"Stop Watch, dual-time-display, alarm, light",
			 "val: ":"Special features"
		  },
		  null,
		  {
			 "Key: ":"japanese-quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"30 meters",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"seller",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"35.99",
	   "comments":[
		  "I've been collecting quite a few watches recently. I do not have the funds to get a lot of brand name ones, but I do want to have a versatile wardrobe with plenty of watches. I currently do not own any metal watches/watch bands, so this one was an accent piece for me. I really like the chronograph and digital day and date tracking on this watch. I won't wear this a whole lot, but when I do, the gold accent makes this watch look like a million bucks. Really happy with this watch!",
		  "This watch is very nice and comes with east instructions.\nThe style and looks are just outstanding. I'm impressed with this item and would recomend it to any one. It also comes well packaged..\n\nas for the pin removal tool for taking out links is nearly impossible to get a link out. The tool lasted maybe 1 min and was broke the watch links were rusted . The watch is nice but the company needs to Revis there product.\nI would NOT recomend this item to anyone at this time.",
		  "A very nice looking watch (very shiny) with a chrome like finish that will show fingerprints easily. Push button B three times and C and D. Setting the digital part takes a bit of effort to get it right so don't expect to be successful the first try. Also be aware that this watch is big at about 5/8 \" thick and probably has two batteries in it but is not as heavy as I thought it would be. If you have tight cuffs on a shirt this watch could be a problem. Runs quietly and so far has been accurate in both analogue and digital (some of these can lag a little). An okay watch for the price and very obviously made in China.",
		  "This watch is exactly what I was looking for. I have been shopping around for a watch that meets the criteria below:\n-Dress watch made of stainless steel (i.e. 'silver' colored)\n-Stainless steel 'silver' colored bracelet (leather bracelets feel sticky and smelly after a while)\n-Analog + digital combination (I am amazed that there are relatively few watches that combine analog for aesthetics with digital technology for convenience) I needed a stopwatch, alarm and date function at the minimum but want an analog display for elegant aesthetics (over a purely digital display which looks geeky)\n- Big; I had the idea that a 'bigger' looking watch conveys masculinity and power;\n- Not too expensive (similar digital/analog dress watches cost 3 digit figures)\nI had a Casio dress watch analog-digital which I prefer for technology but I like this watch for the look.",
		  "Looked good lots of features quick delivery .but turned my arm green second time I wore it",
		  "Watch arrived few days after ordering it and it looks really nice, instructions were easy to follow and I didn’t have to do any adjustments it fit me fine right out of box. Can’t comment on longevity as I’ve only used it for a week but it looks a lot more expensive then it actually is. At this price point you can’t really go wrong.",
		  "Honnêtement ce produit a l'air d'une montre de riche : la montre est lourde , elle brille ,elle est grosse .\nHonnêtement je ne peux vraiment pas \"chialer\" ,j'aurais été dans un \"vrai magasin\" et cette montre m'aurais coûter 100$ au moins j'ai l'impression",
		  "easy to set up. wrist band is simple enough to adjust but little pins had to be hammered out . last watch they just pushed out. they send tool with watch to do it which helped. has been keeping time good ,last watch lost 2 hours a day so I am happy"
	   ],
	   "numberOfRates":155,
	   "avarageRate":4.894480666130903,
	   "id":149
	},
	{
	   "productTitle":"Timex Weekender Chronograph 40mm Watch",
	   "desc":"",
	   "category":25,
	   "images":[
		  "91XmsZDfjlL._UX679_.jpg",
		  "71YkUBUpKLL._UX679_.jpg",
		  "813fNhszeUL._UX679_.jpg",
		  "61a3CilrcKL._UX679_.jpg"
	   ],
	   "specifications":[
		  null,
		  {
			 "Key: ":"Timex",
			 "val: ":"Brand, Seller, or Collection Name"
		  },
		  null,
		  {
			 "Key: ":"TW2R42800",
			 "val: ":"Model Number"
		  },
		  null,
		  {
			 "Key: ":"TW2R428009J",
			 "val: ":"Part Number"
		  },
		  null,
		  {
			 "Key: ":"Round",
			 "val: ":"Item Shape"
		  },
		  null,
		  {
			 "Key: ":"Mineral",
			 "val: ":"Dial window material type﻿"
		  },
		  null,
		  {
			 "Key: ":"analog",
			 "val: ":"Display Type"
		  },
		  null,
		  {
			 "Key: ":"Buckle",
			 "val: ":"Clasp Type"
		  },
		  null,
		  {
			 "Key: ":"brass",
			 "val: ":"Case material"
		  },
		  null,
		  {
			 "Key: ":"40 millimeters",
			 "val: ":"Case diameter"
		  },
		  null,
		  {
			 "Key: ":"9 millimeters",
			 "val: ":"Case Thickness"
		  },
		  null,
		  {
			 "Key: ":"genuine-leather",
			 "val: ":"Band Material"
		  },
		  null,
		  {
			 "Key: ":"mens-standard",
			 "val: ":"Band length"
		  },
		  null,
		  {
			 "Key: ":"20 millimeters",
			 "val: ":"Band width"
		  },
		  null,
		  {
			 "Key: ":"black",
			 "val: ":"Band Colour"
		  },
		  null,
		  {
			 "Key: ":"white",
			 "val: ":"Dial colour"
		  },
		  null,
		  {
			 "Key: ":"brass",
			 "val: ":"Bezel material"
		  },
		  null,
		  {
			 "Key: ":"stationary",
			 "val: ":"Bezel function﻿"
		  },
		  null,
		  {
			 "Key: ":"date",
			 "val: ":"Calendar﻿"
		  },
		  null,
		  {
			 "Key: ":"n/a",
			 "val: ":"Special features"
		  },
		  null,
		  {
			 "Key: ":"59 grams",
			 "val: ":"Item weight"
		  },
		  null,
		  {
			 "Key: ":"Japanese Quartz",
			 "val: ":"Movement﻿"
		  },
		  null,
		  {
			 "Key: ":"100 Feet",
			 "val: ":"Water resistant depth"
		  },
		  null,
		  {
			 "Key: ":"manufacturer",
			 "val: ":"Warranty type"
		  }
	   ],
	   "priceWas":-1,
	   "priceIs":"80.61",
	   "comments":[
		  "I love this watch. The face is bright and easy to read. I love dials with the 12 numerals visible around the face. The complications are easy to read. Hands are a classic and thin. It's just the right size to be comfortable, but not obtrusive when wearing a jacket or long sleeved shirt. Indiglo is a nice touch.\nThe manual can be found online, which saves paper, but makes it a bit difficult to find the exact movement that this particular model has.\nI really like the olive NATO strap. Sturdy metal buckles and guides that are well sewn into the fabric. The olive fabric is dark enough to show off the face and case, without being overpowering. Your eyes are drawn to the watchface and not distracted by the band.\nAll in all, I am really happy that I purchased this watch from Timex.",
		  "I recently purchased this Timex, with great experience in the past with the brand. I love the look of this timepiece, but the chronograph feature does not work, or Timex has bad QC. The first watch I received, both the minute face and the hour face of the chronograph did not actually sit at 0, both were slightly off (pictured). Along with this, the main set screw/indiglow button was sticky and the backlight would stay on for a few seconds, or longer until it unstuck. So I ordered a replacement. This time the chronograph faces both line up at 0 as they should, HOWEVER, the hour face simply does not work. I've run the chronograph multiple times beyond a full hour, and the hour hand does not budge. And again, the set screw/indiglow button was sticky, though seems to have loosened up with some repetitive pressing. Rather dissapointed with a brand I like. I'll be contacting Timex to see what they say, and try one last time to get a good copy of this nice looking minimal watch. Will update review.",
		  "Pretty cool looking watch. Virtually silent, you can only hear the ticking if you hold up up to your ear. Easy to use and set-up. The timer feature works pretty well too, but honestly not sure if I'll ever find a practical use for it. I got it just for the asthetics. The leather band is definitely thin, doesn't feel very high quality, but it doesn't add bulk. It's really easy to switch out the strap for other NATO straps though. The watch face itself isn't huge and doesn't look too ridiculous on my wrist (I'm a woman with 5 1/2 inch wrists? something like that). It's not any bigger and only slightly thicker than the Garmin vivoactive3 that I normally wear. Feels sturdy, but kinda heavy...\n\nI think it's a pretty good oversized watch for women who want something a little different, classic, not overly minimalist, and not bedazzled in shiny things. Also a great price for something like this. We'll see how well it lasts with use, but overall I like the look and feel of it.",
		  "I have a good number of expensive watches but love my Timex, push the button and it glows so u can read it, lol. I leather band quickly ‘aged’ and I wish I could have bought a metal bracelet. Love the big numbers and the look of it",
		  "This watch was great while it worked. Purchased in November and by January the second hand fell off inside the watch face and it no longer tells time. Too bad, I loved the look of it.",
		  "For the price I would argue this is the best watch you could ever possibly purchase. The quality is great. The band is ok. I purchased the blue strap with the cream coloured dial and it looks great.",
		  "I like the watch. Its real leather. Thinner than expected but when compared to the picture it is accurate. The strap colour changes with wear and turns a darker colour thats nicer than the picture.",
		  "Just as shown. My husband was very happy with it. Only comment otherwise is the strap was thinner than he expected it to be."
	   ],
	   "numberOfRates":176,
	   "avarageRate":4.051227259157489,
	   "id":150
	},
	{
	   "productTitle":"Jessica McClintock Women's Alexis Pleated Flap with Rhinestones",
	   "desc":"",
	   "category":28,
	   "images":[
		  "91irhQLqs-L._UX679_.jpg",
		  "71NB1k%2BywrL._UX679_.jpg",
		  "71YKez-Mg9L._UY741_.jpg",
		  "81YqkRNsCLL._UX679_.jpg",
		  "81pAfrgJOhL._UX679_.jpg",
		  "612F3USnlRL._UY741_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"26.73",
	   "comments":[
		  "Very nice purse and comfortable size . I only returned because the navy was more royal blue than my dress."
	   ],
	   "numberOfRates":65,
	   "avarageRate":1.2344322688194138,
	   "id":151
	},
	{
	   "productTitle":"Sakroots Foldover Crossbody",
	   "desc":"",
	   "category":29,
	   "images":[
		  "81iCwUXyy%2BL._UX679_.jpg",
		  "71GWSiiKVUL._UX679_.jpg",
		  "81yyJInfXZL._UX679_.jpg",
		  "61I9v9o-ESL._UX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"77.06",
	   "comments":[
		  "I have always struggled with purses being to big or small, when I saw the price I first said not worth it, however I finally caved in and bought it.\n\nI am glad I did! The size worried me at first yet once I fit everything of mine in there I was super happy with it. It's comfortable and small without being TOO small.",
		  "I bought this to use as a work bag, so wanted it to fit a wallet, large phone (iphone plus), a container of leftovers for lunch and maybe sneak in a pair of heels to change into after my long walk to the office. The size is true to description except that the top is not an open mouth but is fairly constrained. I can't widen the mouth even to the size of the inside of the bag so I'm really constrained on the amount of stuff I can put in the bag, even to overflowing. I'm keeping the bag as a purse but now I'm looking for a larger tote for the other items. Good construction and quality fabric, just an FYI about the size constraints depending on what you want to do with this bag.",
		  "Absolutely love this handbag!!! Lots of room without being huge! Very well made, excellent craftsmanship. I actually have 6 Sakroots handbags. I ordered another bag just like this one except in a different design because I like it so much.Fast delivery and good service.",
		  "Excuse my socks swag!...But this crossbody handbag it's lovely. It has a lot of space, plus is stylish!",
		  "This is my 3rd SakRoots purse and I have loved all of them. The colors on this one are vibrant and the space inside seems a little larger than my previous ones. It wears really well - I think my other two lasted well over 5 years. In fact, I'm thinking I'll buy one in a different pattern."
	   ],
	   "numberOfRates":143,
	   "avarageRate":0.4831130788369835,
	   "id":152
	},
	{
	   "productTitle":"GUESS Digital Multi Clutch Wallet",
	   "desc":"",
	   "category":28,
	   "images":[
		  "91e%2BRn7UUrL._UX679_.jpg",
		  "91q2HOx78BL._UX679_.jpg",
		  "71Mm5mypJlL._UY741_.jpg",
		  "A15vR6U6gOL._UX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"51.26",
	   "comments":[
 
	   ],
	   "numberOfRates":119,
	   "avarageRate":2.006454949221813,
	   "id":153
	},
	{
	   "productTitle":"Relic by Fossil Relic Kari Wallet On A String Black",
	   "desc":"",
	   "category":30,
	   "images":[
		  "91Nk2IjgmAL._UX679_.jpg",
		  "91gLAXOE4yL._UX679_.jpg",
		  "81c0lh06toL._UX679_.jpg",
		  "81VXBWsqfsL._UX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"30.75",
	   "comments":[
 
	   ],
	   "numberOfRates":180,
	   "avarageRate":5.976723302772774,
	   "id":154
	},
	{
	   "productTitle":"Nautica Perfect Carry-All RFID Blocking Mini Crossbody Wallet Wristlet Clutch",
	   "desc":"",
	   "category":28,
	   "images":[
		  "91Vx7mU4e1L._UX679_.jpg",
		  "91FhQRMitRL._UX679_.jpg",
		  "71IuRvtOvXL._UY741_.jpg",
		  "71UNim20fuL._UX679_.jpg",
		  "81SE3wPXDxL._UX679_.jpg",
		  "713%2BcBJC0WL._UY741_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"22.43",
	   "comments":[
		  "The colour of the bone/ Sand is not bone colour, its NICOTINE yellow … the bag it's self is very cute... I was expecting more of a Indigo/Bone/Sand ) colour… this is very yellowish-brown … like I said, looks like its stained with NICOTINE … awful yellow.",
		  "Super qualité de materiaux. Très beau sac.",
		  "love this crossbody - just large enough for phone, credit cards, sunglasses, a few other small extras. I wear it everywhere - on walks, shopping, etc. Please note this is NOT fabric - it's nylon - but still very classy and good for getting caught in the rain also. Will definitely bring to airport - fits right into my laptop bag.",
		  "The perfect bag when you don't want to take a big purse, and I love that it can be a wristlet or crossbody. Great for grocery shopping, I don't like to leave my purse in the cart ever.",
		  "This bag was a gift but from what I have been told she loved it! Great size and totally functional. I want one now, it needs to be in different colors that would be awesome!!",
		  "Cute purse that is big enough for my wallet, phone, and a diaper in case the kiddo needs a change. Great value.",
		  "Beautifull coler and looks like picture"
	   ],
	   "numberOfRates":192,
	   "avarageRate":5.620170496542012,
	   "id":155
	},
	{
	   "productTitle":"Vince Camuto Riley Tote Bag",
	   "desc":"",
	   "category":29,
	   "images":[
		  "915PTmAhWaL._UX679_.jpg",
		  "91eBWTyU%2B7L._UX569_.jpg",
		  "710L-F-J7-L._UY741_.jpg",
		  "81LZVzLgCPL._UX679_.jpg",
		  "91DpA%2B17tbL._UX679_.jpg",
		  "71qLRFDsKdL._UY741_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"318.84",
	   "comments":[
		  "This is the softest leather I have seen for a purse but very sturdy. Love this purse, got a lot of compliments.",
		  "This bag is beautiful! It is genuine leather, very rich and soft. I do wish the opening was wider, it feels a bit narrow. But overall the right size for my needs as a tote for work and travel. It is slouchy when not full and does not have outter pockets or studs on bottom. so it looks and feels more like a purse, but still works for me.",
		  "Rich navy bag. Nice and roomy but not sloppy. Metal trim is black silver. Very new trend. I use a purse organizer, which makes changing bags very fast and also gives forms to bag contents. It works well with the soft leather of this tote bag, which might be too slouchy for some. Double handle and also cross body strap. Top zip and unique side zippers that expand main section, if needed.",
		  "Very stylish and on-trend. I love the shiny gold hardware and zippers. I usually go for silver hardware but the gold here is quite elegant. My only gripe about this bag is that it's smaller inside that I'm used to. I'm still able to fit everything I need inside but it gets a bit tight. I'm willing to carry less stuff because this is a truly gorgeous bag.",
		  "I loved a lot about this purse. The leather is super soft, the hardware is quality, and length of the drop strap of the purse was perfect. Ultimately I returned it because the bag is SO heavy. And after I added my things to the bag it was too heavy to carry. The bag was also too floppy for my liking. If it had more structure and was a little less heavy, It would have been perfect for me.",
		  "This tote is just the right size for my tablet, iPhone and peripheral items. It is a well made bag, so very soft and pliable. It smells heavenly. Because it has no weight I can carry all my goods comfortably. The only downside is there is no outside pocket for the phone. The inside pocket is large enough for the iphone7 Plus so it will be at the top & hopefully I won't have to fish for it."
	   ],
	   "numberOfRates":190,
	   "avarageRate":5.59205483004792,
	   "id":156
	},
	{
	   "productTitle":"Tommy Hilfiger Unisex Crossbody Bag for Women Jaden",
	   "desc":"",
	   "category":29,
	   "images":[
		  "91S2WIy4kxL._UX679_.jpg",
		  "81AlXpa08pL._UX679_.jpg",
		  "71Hr9yiJFeL._UY741_.jpg",
		  "8176XvSFNtL._UX679_.jpg",
		  "71690WFzp%2BL._UX679_.jpg",
		  "71IvJbUmcgL._UY741_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"54.71",
	   "comments":[
		  "This is a stylish little purse that is great for shopping as it is smaller than my usual purse, it holds the essentials (wallet, phone, keys, Kleenex, and maybe a couple of additional small items). It's great not having to lug around a much heavier, bigger purse when shopping.",
		  "Arrived quickly, vibrant colours, good stitching and solid strap. Fits my charger, wallet, phone and others (gum, chap stick, makeup). Would have given 5 starts but there was a very very small mark on the material on the back corner. You really cant notice it unless you analyze and look for it. Over all a great purse",
		  "Very good quality. Too small for me. I give to my 15yr old daughter who loves it a lot",
		  "perfect size and shape; I got compliments from using it.",
		  "Just what I ordered perfect cross body bag. Able to fit phone, wallet and some makeup. Not leather but seems to be well made.",
		  "I got it as a gift and my granddaughter absolutely loves it",
		  "Just love this bag..matches my THF coat perfectly 💖",
		  "Absolutely lovely ! Such a beautiful bag. Definitely recommend, great quality."
	   ],
	   "numberOfRates":17,
	   "avarageRate":1.9859257614725343,
	   "id":157
	},
	{
	   "productTitle":"TcIFE Purses Satchel Handbags for Women Shoulder Tote Bags Wallets",
	   "desc":"",
	   "category":30,
	   "images":[
		  "71yOHx6O2FL._UY575_.jpg",
		  "71syNzuzVBL._UY575_.jpg",
		  "71iqimiOoOL._UY575_.jpg",
		  "71tHE9KEdtL._UY575_.jpg",
		  "61vZ%2BIcQQmL._UY575_.jpg",
		  "7114jT46kYL._UY575_.jpg",
		  "81doeY8V8oL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"29.00",
	   "comments":[
		  "This purse is really nice, I bought it and it arrived on time. The packaging was very well too, the purse itself is not cheaply made. It's very good quality and very stylish. It is true to size and can fit alot of things, it also comes with a mini purse which I love. It's very roomy inside and it is also very comfortable to wear. The straps don't hurt if you wear it for a long time. I personally use this purse very often as it's one of the best I've ever bought. I would definitely recommend this to other buyers.",
		  "The package includes a nice handbag and cute purse. I really like both of them: their sizes, color, material quality and style. Very happy with this purchase",
		  "This purse is absolutely beautiful! It's very well made and nice and thick PU leather. The gold accents on it are stunning to look at and just the right amount not to much not too little \"bling\" it's a great size again not to big but not to small I was able to fit everything needed for an outri g for the day followed by a bday party get together the same evening (without having to come home to change or empty my purse. It's very stylish in the way of you can either dress it up for an evening outting (formal/semi formal type deal) or dress down or normal and carry it's along for a normal day of running errands, beat part, it also comes with a smaller \"wristlet\" bag for like example going to the bar or formal outting where you just need something cute and small to hold a few items. All in all I am very happy with this purchase",
		  "I ordered this purse weeks ago. I've been using it almost every day. It's super-spacious and has enough space for anything I need to carry with me. Since I got this purse I'm no longer worried about leaving any stuff behind at home. Several of my friends have come in love with this purse. I took it on a trip to Europe and asked someone who had the knowledge of the purse industry to make his determination about it. His view was affirmative as to the quality and the design of this item. Also, the color is really great, the design is fashionable and modern. The quality of material used both inside and outside is decent. It has extra pockets so that I can sort my items and put any category in a different place. Overall, I'm satisfied with it.",
		  "I have received the handbags and matching wallets for couple of weeks now. The actual products is the same as shown on picture. I am very happy with my purchase. It is chic and stylish, the PU leather feels comfortable. The size is just right for me to store my day to day stuff.",
		  "It looked better in the picture. Not soft at all in person. I tried packing it with heavy things to wear it out a bit hoping it would soften up a little. No luck there, still as stiff as when it arrived. There's also a crease on the other side from when it was folded. The metal hardware is only on one side of the bag and they were not properly fastened. Had to use pliers to secure it to the straps. The color is as pictured. It's my biggest handbag and I have to say it is very roomy. I can even pack 2 water bottles and kid snacks in it. For the price point, I can't complain. Would upgrade it to 5 stars if the material eventually softens up.",
		  "I was shopping online for a black purse as a gift to my auntie. This one fits what I imagined and it's within my budget. Its not too big nor too small. It has several pockets big enough for most items and great for organizij. It has both a handle and straps si a person can carry it or strap across shoulder.",
		  "I purchased this hand bag, great value, for my weekend travels but it has worked out to be such a great hand bag that it is my go to bag for everyday running around. The wristlet is a great add on for me to use as a wallet when I do not need to take the hand bag for quick running around."
	   ],
	   "numberOfRates":92,
	   "avarageRate":0.6914342686191488,
	   "id":158
	},
	{
	   "productTitle":"ZIIPOR Women's Canvas Crossbody Bag Casual Hobo Bag Shoulder Bag Shopping Bag",
	   "desc":"",
	   "category":30,
	   "images":[
		  "61DYhleXhqL._UY575_.jpg",
		  "71sjuySM7TL._UY575_.jpg",
		  "71z24XrPsrL._UY575_.jpg",
		  "813TCsc0ruL._UY575_.jpg",
		  "71ITDjeSQaL._UY575_.jpg",
		  "71qGBlrN9yL._UY575_.jpg",
		  "71R63jJx%2BwL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"19.99",
	   "comments":[
		  "The bag is very cheaply made and much smaller than the photos make it seem. It doesn’t hang loose like the photos it is very boxy. It’s similar to the free bags you get at stores like Roots but it costs $20! I ended up returning the bag thanks to Amazons free returns. I would not recomend buying this bag for any reason!",
		  "Nice bag, good quality canvas. Lays nice and flat to carry but bottom is expandable to carry a lot of items if needed.",
		  "I bought this so I wouldn't have to take an expensive purse on a trip, hoping it would carry my wallet, phone, maybe a bottle of water, a sweater, but I don't think it's big enough (and it's pretty flimsy). But it'll get the job done. Going to have to wash it immediately too, it has a STRONG smell, like a mixture between hot glue and bad body odor. Ick.",
		  "Light weight. Big enough for all my junk. Stylish\nIn LOVE with this bag",
		  "I really like this bag the only negative it's a bit thin but I'm still using it and enjoying it. It even has a slot for water bottle and cell phone on the inside",
		  "I purchased it in three colours and preferred the grey one.",
		  "I love this bag! It holds everything I want and is comfortable to wear.",
		  "La description n'est pas réellement exact, le produit reçu est similaire mais les matériaux sont de tres mauvaise qualité et très mince et les dimensions son inexacte.\n\nCependant le service d’expédition et retour est excellent"
	   ],
	   "numberOfRates":150,
	   "avarageRate":3.42439034096443,
	   "id":159
	},
	{
	   "productTitle":"Aitbags Soft PU Leather Wristlet Clutch Crossbody Bag with Chain Strap Cell Phone Purse",
	   "desc":"This beautiful crossbody bag comes with a wristlet, it can be a clutch wallets, small and convenient, suitable for party, wedding, prom and so on.",
	   "category":29,
	   "images":[
		  "71FdbafST6L._UX575_.jpg",
		  "814BV9Fvg0L._UX575_.jpg",
		  "71jwmk-D%2BiL._UX575_.jpg",
		  "81VmpIVTHJL._UY625_.jpg",
		  "71aWiXi9thL._UX575_.jpg",
		  "814BV9Fvg0L._UX575_.jpg",
		  "81PEILPrauL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"18.65",
	   "comments":[
		  "Finding the perfect purse to hold my essentials when going out on the town or dancing has been a bit of a challenge, but I've finally found it!\nPros:\n- great looking, soft feeling faux leather (purchased the black, have now ordered 2 more colors)\n- perfect fit for my \"evening out\" necessities (reg sized cell phone, mini brush, lip gloss, rfid money/id holder & car key)\n- small enough to dance with it on when in unfamiliar places\n- full length zipper: ensures all is safe & sound inside no matter how much my partner may spin me!\n- handy side zippered pocket: quick access to my phone\n- affordable to get in various colors to match wardrobe\n- both vibrant & classic colors available\n- having both the wristlet & cross body straps provides handy switch between casual & classier wear\n\nCon: - chain crossbody strap: it is very pretty, but in my case I would prefer a leather strap as chain straps sometimes over rub on my clothes (causing a little damage) when worn while dancing. It is a very minor thing as most wouldn't be keeping the purse on. & it is much classier looking with the chain than leather... only a personal preference",
		  "Beyond expected. Arrived 9 days earlier. Wasnt sure about zipper location, since it wasnt clear & no pictures viewed from up. It has compartments 💘I loved it, I didnt understand the features of the pursr, so has very hapoy. Plus it came with a note book.\nWhat u c, +zipper on top+compartments inside+notebook. Was✔✔✔\nPurse,matetial,length of chain is as shows. Good price",
		  "Love it! It’s small enough but holds your phone, cards, money, lip stick/chapstick and then some really well.\n\nI purchased the dark green color for an overseas trip where I only had a single backpack. I needed something small and soft that I could stick inside for travel but have for day use and this did the job perfectly. I wish there was a leather strap option, but the chain is fine.",
		  "I wanted a cross body purse that could go with everything but didn't want to spend a fortune, so I'm really glad I found this bag. It's stylish, just the right size to hold what I need (including a large smartphone), and will go with a lot of different outfits. It even came with its own dust bag. Can't go wrong with such a cute bag for a great price.",
		  "It's nicer than I had thought, considering the low price. It's quite nice - fairly bigger than the usual clutch/wristlet purse, but I think it's good, since I can fit a little more things in there, especially when I have the plus-size cellphone. Great product, recommended. Quality is pretty good for its price.",
		  "Purchased as bridesmaid gifts. The leather is soft with the black and wine colours. The gold or shiny colours are not as soft. Product has pockets inside. Gold zipper on the outside. Wristlet and gold chain included.",
		  "I purchased this bag as a gift for my friend, and she absolutely loved it. It's the perfect size to hold your keys, phone and miscellaneous items on a night out. The interior is well designed with slots for cards, and the exterior looks like a high end purse. I'm very satisfied with this bag. Also, the package came 12 days before the expected delivery date, which was a plus.\n\nOverall: Would Recommend",
		  "This is nicely designed and allows room for all your must haves. Perfect place for your phone, room for more cards, such as your credit cards that you want to keep more secure, cash and those other must have items. Inside this lovely crafted purse is 3 different compartments to keep everything organized."
	   ],
	   "numberOfRates":6,
	   "avarageRate":1.8858060861724595,
	   "id":160
	},
	{
	   "productTitle":"Women RFID Blocking Wallet Leather Zip Around Phone Clutch Large Capacity Travel ladies Purse Wristlet (Black)",
	   "desc":"Bveyzi RFID wallets are equipped with advanced unique proprietary blocking material, which blocks RFID signals and protects the valuable private information stored on RFID chips from unauthorized scans.",
	   "category":29,
	   "images":[
		  "81ayzBdWBaL._SX569_.jpg",
		  "71w4RGE144L._SX569_.jpg",
		  "71Z%2B5NuHfRL._SX569_.jpg",
		  "817YKbeEAkL._SX569_.jpg",
		  "71sUB-Ne1rL._SX569_.jpg",
		  "81qYyDi6AaL._SX569_.jpg",
		  "71j7UxSXudL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"42.99",
	   "comments":[
		  "This wallet is just amazing!! It fits everything I need and more!! I can fit my lip gloss, 2 lipsticks, my pill case, lozenges, and all of my cards!! It is so perfect and very high quality! I would absolutely recommend this item if you are looking for a spacious wallet to hold everything you need!!",
		  "I’ve been using this wallet for 2 months now and I can seriously say that I love it. You have enough card holders to put in as many as you want yet your wallet still doesn’t feel stuffed. I never write reviews on anything yet I rely on those to decide whether or not I buy a product and I can say this product is worth it",
		  "So far I love it, I’ve only had it a couple days. As a Mum of 4 kids I need a huge wallet and this basically holds everything I need. Just wish there was a opening behind the back of the card slots on the left to store more things.",
		  "I like the fact that it holds everything. a little bigger than I anticipated but at least my cards are safe ! The color is exact and style is exact !",
		  "not fancy, but has lots of room and the wrist strap keeps me from putting it down and forgetting it.",
		  "I really like the size, it's a mom purse! Where you could just grab your purse and a key to run to Walmart. It is decent quality and enough room for everything you own. Cards, expired receipts 😂.",
		  "Okay but the material is cheaper than expected. Very stiff. Pretty sure the faux leather will rip in no time. Returning.",
		  "Came neatly wrapped and packaged. It had a funny smell when I first opened it but the smell quickly faded. Doesn’t smell like leather, even though the product description states that it is. I love the colour, I got purple. Wrist strap is great and the zipper is solid. Easily fits all my cards and phone."
	   ],
	   "numberOfRates":27,
	   "avarageRate":0.7501605797231745,
	   "id":161
	},
	{
	   "productTitle":"TcIFE Purses and Handbags for Women Satchel Shoulder Tote Bags",
	   "desc":"",
	   "category":30,
	   "images":[
		  "71aRy6gjFxL._UY575_.jpg",
		  "71BpD8XiEoL._UY575_.jpg",
		  "81b337i%2Bj9L._UY575_.jpg",
		  "71N%2Bqtum6JL._UY575_.jpg",
		  "61LqQVETC1L._UY625_.jpg",
		  "71cZPTL7vpL._UY575_.jpg",
		  "71xzsQ-d9ZL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"28.70",
	   "priceIs":"25.53",
	   "comments":[
		  "this is a lovely bags exactly what i am looking for . I can put everything in it and still got lots space . Good quality . Very nice tote for this price .happy about this bag .",
		  "Very nice bag for everyday use, like the leather quality and the design. Definitely recommendable!",
		  "Awesome bags !Very nice and large.I can put everything I need in it .It look very sturdy .Planning buy one for my mom.",
		  "Handbag is a good size and because of the description, I did not realize it had a take out middle section which also has a zip pocket and two slip pockets on the opposite side. I don't think this information was in the description. The insert is held in place securely with tabs on the sides and so it can be removed if not needed. This then makes a three section bag with the middle section having zip, inner zip and two slip pockets. Did not give a five star as I always like to have the security of a top zipper and that one issue is missing. Otherwise, a very nice, rich looking, sophisticated handbag.",
		  "Very happy with this purse. It’s very good for everyday use, very versatile. I also like it has a zipper inside.",
		  "I received my bag today and it is gorgeous! I always read reviews and write reviews but this purse was more than I expected. Very well made and spacious. I will definitely buy from this seller again.",
		  "Love the color and quality for the price.",
		  "Love this bag, for the price of doesn't look like a cheapy bag! I got the coffee color and it's perfect for work as a teacher. I fit my laptop, personal items and lunch in it. Its not bulky looking and has a inside pocket that can come in/out with button attachments. Looks professional while functional. I'd def advise to buy as a everyday tote/lil overnight bag..I'm only 5 ft so finding a bag that's not too big on me and holds what I need is a bonus"
	   ],
	   "numberOfRates":164,
	   "avarageRate":0.07716150162552449,
	   "id":162
	},
	{
	   "productTitle":"Nevenka Brand Women Bags Backpack PU Leather Zipper Bags Women Casual Backpacks Shoulder Bag Book Bags",
	   "desc":"Added Timeless Fashion to Your Wardrobe: Paying homage to the luxury fashion house's technical craftsmanship and sleek aesthetic, this timeless purse will be the perfect finish to your whole year wardrobe.Size: 10.2 (L) x 3.9 (W) x 12.6 (H) Inches;Top Handle Size: 3.5 Inches;Adjustable Shoulder: 15.75 in (min)-31.50 in (max);",
	   "category":28,
	   "images":[
		  "71YzVEmB7JL._UY575_.jpg",
		  "61XprWm34ZL._UY575_.jpg",
		  "617WeiObM-L._UY575_.jpg",
		  "51lE%2Br7pcWL._UY575_.jpg",
		  "91TcHz-36LL._UY675_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"24.99",
	   "comments":[
		  "As expected. It's a low budget bag, I don't expect it to last too long, but it's decently built (good seams), but I don't think it could handle any substantial weight. It's cute like the pics. I agree with other reviewers that the middle pocket was useless so I cut it out (very easy - see pic for how open it looks after- last pic is the cut out piece). I feel like the pockets inside are shallow (pics again), I'm worried stuff will fall out easily, but overall it's functional. Material feels nicer than expected. The zippers look really cheap I suspect the gold will peel off very fast.",
		  "I really like this bag; it looks exactly as it does in the picture. It is a little larger than I expected. I would estimate it can fit an iPad in it. Inside, there is a divider to break the bag up for easy organisation and a zippered pocket. The front pocket is not very deep but will hold the essentials i.e. keys and phone that you want easy access to. It smells like it was shipped direct from a factory and is obviously not real leather, so I don't know how it will hold up over time. However, the bag itself seems sturdy (for now) and I anticipate that it can handle average weight loads (just don't go putting rocks in it). I usually carry my wallet, a 500ml water bottle, a book, my phone, and my keys in this bag. I've had multiple compliments on this since purchasing :) For the price, I am very pleased.",
		  "I really like this pack pack purse, especially for traveling. My camera and my IPad fit into it. The only thing I would change is that zipped pocket on the back of the purse is not deep enough to carry a wallet and I always look for a backpack purse where my wallet is securely against my back. Inside, there is a zipped pocket down the middle it I would have preferred not be there at all, otherwise, nice quality backpack/purse.",
		  "I love this bag. It stays on one shoulder fairly well, but I try not to do that often, since I use a backpack purse for my neck and shoulders.\n\nSlight downsides: the middle divider is flimsy, and stuff moves from one side to the other underneath; and the front pocket can stick out if it or the body of the bag is too full.",
		  "Product came in great shipping time, one day sooner than expected. Love the style and size, has a slight smell but not too worried about it. However, it came damaged. The bag has a tear on the front pocket which renders it useless until I get it fixed. Could have been 5 stars but that teat is upsetting",
		  "It looks really nice : color and material exactly like the picture, definitely worth the money. Gave 4 stars just because the intérieur compartiments’ zippers look fragile but the exterieure seems ok.",
		  "I like that this bag will work with anything from casual to semi-dressy. Overall, I like the size of this bag, and I like the zippered compartment on the front as well as on the back. My biggest complaint is that, while there is a centre divider (a zippered compartment inside), it is not attached to the bottom. So, if you put something in the \"front\" section, it might very well migrate to the bottom, and over to the \"back\" section, making it harder to stay organized.",
		  "This little backpack is great, exactly as expected, zippers are nice and smooth, enough room for a bottle of water, wallet, cosmetics bag... very satisfied. The delivery took 3days more than promised and when I called to inquire they said it was held in customs but there was no indication of that on the package. Anyways I'm happy with my purchase."
	   ],
	   "numberOfRates":169,
	   "avarageRate":5.066083810967838,
	   "id":163
	},
	{
	   "productTitle":"Travelon Anti-Theft Cross-Body Bucket Bag, Black, One Size",
	   "desc":"",
	   "category":28,
	   "images":[
		  "91LjU1JLU4L._SX569_.jpg",
		  "81IjpTgKjML._SY879_.jpg",
		  "91WnD4flfPL._SX569_.jpg",
		  "817etRIaX-L._SX569_.jpg",
		  "916qxBQUmCL._SX569_.jpg",
		  "A1Anmt7BPRL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"55.99",
	   "comments":[
		  "I am writing this review after having returned home from using this purse on my 8 day trip; I really loved it at first, so roomy, classic simple look, and the strap extended nice and long for me. I felt very very secure using it. Safety was not my issue at all, but two things ended up annoying me about the bag, which was unfortunate because I would've bumped it to a five star rating had it not been for:\n1) the main zipper compartment cannot be opened with one hand even when the locking feature was not in use. I always always needed to use both hands to unzip this bag. Maybe a redundant complaint as the locking mechanism is kind of the point of the purse, however, I had so many instances where I just didn't have need for that feature and it was a pain having to get in to my bag and not spill my coffee etc.\n2) the shoulder strap was constantly twisting and I found myself unraveling it just about every time I wore it.\n\nIn summary, these are just first world problems. I'll def use the bag on future travels and endure the struggles described above. But be warned!",
		  "I loved all the pocket and zippered sections, especially the holders on the side for bottled water or umbrella. It has room for all kinds of things... small hip wallet/purse or an iPad, This is a great travel purse that is secure for travelers. One suggestion for Travelon -- make more slots for credit cards, health card. etc. The lighter colour interior makes it easier to find things, plus the little light is great at night.Unfortunately if you pack too many thing in it then it can get quite heavy but since it's a cross-body style that you can switch from one side to the other helps with carrying it. I also liked having the different color choices but I selected the black since it works with everything.",
		  "We just completed a 24-day visit in Europe during which my wife used this bag every dayand was very pleased with it. She felt it was very secure in the dense crowds we encountered in Rome and Barcelona, and it was comfortable to wear. Extensively used the capability to carry a water bottle at one end, and occasionally a collapsed umbrella at the other end. Size is enough to store a scarf, vest and/or lightweight rain jacket. Liked that there was an internal strap to which she could attach a change purse.\nOnly improvement we could suggest is to supply a change purse with the bag,",
		  "I had a baggallini everywhere bag for several years, which I loved . Well-made, lots of pockets . When it finally gave out, I decided I’d like one a little larger. This one is quite a bit larger than the baggallini, and is even better made! Very sturdy and zippers extremely well made. The strap is very strong as well. (The strap is what gave out on my baggallini, and replacement straps aren’t available for those in Canada)\nI had to get a wallet .. it’s been years since I’ve used a wallet, but I’m used to it now.\nI love this bag.. I’m sure it will last many years. I’m the type of person that owns only one purse and uses it every day.",
		  "I bought this for my wife. She has a longstanding interest in the American Civil War and has for years has wanted to visit the places she has read about, or some of them. She is also a worrier. So for our retirement tour of Civil War sites, I got her this. When she first got her hands on it she said, \"It's not as big as I was expecting.\" But as we flew back from Washington she remarked on the plane that it was \"just the right size.\" It's light, she reports, so she can carry it around all day over battlefields and plantations and it's got various impenetrable places to stash this and that. Her final judgment: \"It's great.\" Not, I should say, that anyone tried to rob us. But, then, our plane didn't crash either.",
		  "I love the compact nature of this bag as an alternative to a pac-safe bag I have. It has RFID features but I can't attest to how well that feature works or doesn't work. It's design has it hugging the body. It is big enough without being too big and has enough pockets to make organizing easy enough. The strap is substantial and very sturdy with a heavy clasp that swivels so the strap doesn't become twisted. It has contrasting grey interior that makes it easier to find items inside it. Although, more than one compartment in the body of the bag or a center zipper compartment to divide it would be appreciated, as this like every bag can feel like a bottomless pit.",
		  "So far so good. Quality of the bag is really good. I’m not a huge fan of the strap but I think you are limited to materials when you are making it cut or slash proof. Lots of pockets both inside and out. So far I have my tablet, phone, 4 passports, all my cards and knick knacks like lipsticks and hand cream in there and it all fits well. Much better size than the old travel purse I was using. Love the water bottle holder. I can put an empty water bottle in it, pass through security then fill it at the fountain without spending a dime. I think I’ll get my monies worth out of this bag. Going to use it Saturday for our next voyage.",
		  "Took this bag on our trip to Costa Rica. I have another smaller travel purse but wanted something which could carry my DSL camera in addition to a cellphone glasses and wallet. The locking feature was great and easy for me to open while wearing the bag crossbody. Only thing missing is a sleeve for a pen. End mesh pockets were great for an umbrella and a water bottle. Material was water repellant in light rain and even loaded up bag was comfortable to carry. Very pleased."
	   ],
	   "numberOfRates":66,
	   "avarageRate":1.8034411607234415,
	   "id":164
	},
	{
	   "productTitle":"Neverfull Style Canvas Woman Organizer Handbag Damier Tote Shoulder Fashion Bag MM Size by LAMB",
	   "desc":"",
	   "category":29,
	   "images":[
		  "81qM43hk9rL._UY625_.jpg",
		  "71ZyNmk9H9L._UY625_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"46.90",
	   "comments":[
		  "This is an amazing bag! Comes with dust bag and small pouch inside. Highly recommend this purchase!",
		  "Nothing like described! Straps are small with white stitching. The interior is black with a middle zipper compartment. The bag also zips shut. Neverfull is a tote bag with a red or beige interior and it’s not supposed to zip shut. This is just a cheap brown checkered purse. Louis Vuitton is not written anywhere on it. Reported seller to Amazon and requested a refund!",
		  "All I can say is WOW. I am thoroughly impressed. Looks exactly like the real thing. If I didn’t know any better, I would think it was. As everyone has said, it does have a funny smell, like leather, but the bag is beautiful. Worth every penny.",
		  "OMG I can not believe what they sent me! It looked nothing like what the picture I ordered from. The picture showed a red lining, didn't get that at all. Oh, there was no \"printed name\" on the squares of the design as shown in their picture. It had very poor white stitching, threads hanging everywhere. Inside zippers wouldn't work. It was thin plastic & felt like something from the dollar store. This bag should not have had a zipper across the top but it did and the pull was tarnishing. The inside of bag was like a brown plastic fabric. Don't waste your money on this, it is not worth $2. Had to give it one star in order to make this post. Should be a \"negative\".",
		  "very happy with the bag that arrived today....you are toally getting what your paid for...pleasantly surprised\nThe only negative that i have is the heavy chemical smell of the bag ...hoping that it fades with time...",
		  "Very Disappointed,\nI did not receive the bag that is showed in the picture, I received the bag with the LV monograms all over in tan.\nAlso, it didn't come in a box, bag, or dust bag, it came in a black plastic bag.\nWill be returning.",
		  "I knew this was a dupe of the LV Neverfull of course but still, the bag not only took months to arrive, it's incredibly cheaply made and looks super cheap in person. I was so disappointed as it also wasn't the size the ad claimed it would be and the handles are too short to wear it over my shoulder. Don't waste your money on this junk bag. It also still smells funky a week later.",
		  "Beautiful quality! Structure, color, and most of all it has identical feautues as the real bag! I’m in love thank you!"
	   ],
	   "numberOfRates":65,
	   "avarageRate":2.9598318852450767,
	   "id":165
	},
	{
	   "productTitle":"Travel Crossbody Purse - Hidden RFID Pocket - Includes Lifetime Lost & Found ID",
	   "desc":"",
	   "category":30,
	   "images":[
		  "71JacnrE62L._SY355_.jpg",
		  "91rvrnd1V2L._SY550_.jpg",
		  "81hAdXCbIvL._SY550_.jpg",
		  "81germ7spvL._SY550_.jpg",
		  "81JpUxy-N1L._SY550_.jpg",
		  "81GRxGodiiL._SY550_.jpg",
		  "811-bFaBtLL._SY550_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"29.99",
	   "comments":[
		  "This bag is exactly what I was looking for. I don't like carrying a purse or backpack all of the time when I am travelling so this bag will be perfect for my next trip. I've given it a \"test run\" and fits everything I need to carry in a day, but most of all, it's comfortable - the strap doesn't dig into my neck. Looking forward to using it on my next trip!",
		  "Love it. Holds my cell\\sunglasses with lots of room to spare. Good quality and value. Durable. Recommend to anyone. Would buy again.",
		  "I needed this for dog walking necessities, have 4 dogs, it’s great! Fits everything we need including theirs and my water bottles. Security feature is great when traveling and “find me” feature is great as well, hope I never have to use it lol.",
		  "Haven't fully explored all that the bag has to offer but so far very happy with purchase. Even found an extra pouch area with magnetic closure which was a nice surprise. Lots of pockets. Wish there were some individual card slots tho for easy access. The 2 smaller slots serve as an alternative to this purpose.\nDelivery was amazingly fast. Ordered in the AM and received by dinner time. Awesome! Thank you.",
		  "Just what I wanted - a small bag that can be a crossover or just over the shoulder, that does not get in the way and can keep your money, phone and small items safe and easy to access.",
		  "this little purse was exactly what I had been looking for....it was lightweight but had ample compartments for everything I need for my trip...I know I will use it again...Mhughes",
		  "Seems very well made and heavy duty. Staps seemed a bit thin for walking around with every day with a full bag but we will see how it goes!",
		  "Loved this purse!! My Lug travel wallet fits perfectly as well. Thank you for a great product ! Looking forward to using it on many trips!!"
	   ],
	   "numberOfRates":163,
	   "avarageRate":3.1393814084972127,
	   "id":166
	},
	{
	   "productTitle":"Hynbase Women Fashion Korean Canvas Cross Shoulder Tote Handbag Purse",
	   "desc":"",
	   "category":28,
	   "images":[
		  "612fHjx4v%2BL._UY575_.jpg",
		  "61PF06lqevL._UY575_.jpg",
		  "71qkq6z080L._UX575_.jpg",
		  "71oTdJLCLCL._UX575_.jpg",
		  "71zcPlerDgL._UY575_.jpg",
		  "71susGEYSSL._UY575_.jpg",
		  "71nXTyCNvsL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"28.30",
	   "comments":[
		  "Hello. I really like this product very sturdy and I love the different compartments of the purse. One thing that I would like different about the purse is the straps. If the straps were made With the same material as the rest of the purse I believe that it would make the purse even more sturdier than it is. Great product though I do like it.",
		  "Product is similar to the photo. The handles/straps are made of faux leather which look and feel like not very durable. It would have been better if the handles/straps were doubled or the same material as the purse it self. they made The brown lining for the inside a little thicker this time. This purse is suitable for light items and i do not recommend putting in heavy stuff.\n\nUpdate... i've been using this purse for a week now. And not a very good quality. The snap button just came off and my purse only contains my wallet, a small notebook and my phone.",
		  "It looks similar to the advertised photo, BUT the inside liner is plain cheap brown material, not the nicer looking liner with a bit of design in the fabric shown in their picture. I don’t think this liner will hold up for long. The zippered pocket inside has a crappy flimsy zipper. There is no logo patch on outside of bag as shown in their pictures. The main zipper for opening center compartment is also very cheap, looking nothing like the quality zipper shown. That being said, I am using the purse as it is still ok looking, but I would not purchase another one",
		  "Received my purse yesterday and went home and switched over. Everything had a place to go and I love the large pockets that have been designed. It feels like you are putting a lot in and think its going to look like a big brick when done, but it doesn't. I love the clean look of the purse from the outside. The way it has been put together shows they care about the quality of their product. This will be one of my favorites!",
		  "Absolutely LOVE it!\nAlthough, I would of like the straps in black instead of brown...\nThe quality is good, and there's ALOT of room in there! I use it everyday, ever since I received it, and it's better then most purses I've owned so far.\nThe only thing is the stitching of the \"phone pouch\" isn't as sturdy as the rest (I use it for my cards), but it's more at it's corners, so it isn't a big deal.",
		  "I love this purse. It has the perfect amount of space for everything you need. 3 sections with one zipping up. It fits perfectly under my arm.\nThe only negative thing I can say is that the inside fabric is thin and doesn’t stand up to keys. Mine tore and I have had to sew it up in different places a few times.",
		  "It's cheap canvas but I don't care. Love the color. Love the functionality. Love the design. Only hand bag I use now. This does not go cross shoulder.",
		  "I love love this purse. It is exactly the size and compartments I wanted. It's a bit plain but that's ok. I will probably purchase another color in the spring."
	   ],
	   "numberOfRates":117,
	   "avarageRate":3.154216971290565,
	   "id":167
	},
	{
	   "productTitle":"NeoNoe Style Monogram with Rose Ballerina Tightening and Strap Crossbody Shoulder Bag for Women Perfect to Hold Cash Cards Checkbook Keys Make up Phone",
	   "desc":"",
	   "category":30,
	   "images":[
		  "81EUjWpXW2L._UY575_.jpg",
		  "712-uyD7KdL._UY695_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"59.90",
	   "comments":[
		  "The quality of this bag is excellent. There is no cons. Everything from canvas to style make it a tasteful great bag! The delivery is super fast. Will definitely order again from this seller that always provide excellent customer services and well made products. Highly recommended.",
		  "Absolutely stunning. So happy with this bag. It was exactly what I was looking for. And the seller wrapped it up nicely. :)\n5 stars",
		  "Very good quality product and super customer service, recommend it.",
		  "Excellente",
		  "Not bad, but the lv buttons have fallen off!"
	   ],
	   "numberOfRates":194,
	   "avarageRate":5.008412731258137,
	   "id":168
	},
	{
	   "productTitle":"Realer Crossbody Purses for Women Multi Pocket Lightweight",
	   "desc":"",
	   "category":30,
	   "images":[
		  "71KjS-X85pL._UY575_.jpg",
		  "71ITRMEu8kL._UY575_.jpg",
		  "71-ygEvvbRL._UY575_.jpg",
		  "71fG-rJtySL._UY575_.jpg",
		  "7106kUtWs-L._UY575_.jpg",
		  "81pIhZvQXLL._UY575_.jpg",
		  "814aX0nCNXL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"28.99",
	   "comments":[
		  "This crossbody bag comes in two colours and the one I got my wife is in brown. This bag is perfect for day-to-day use as it's lightweight and big enough to hold a lot of things while maintaining a sleek design. You can easily fit an iPad in there. The strap is adjustable which means you can wear it as a crossbody bag or a shoulder bag. The quality of the bag is amazing! It's durable and scratch-resistant and most importantly, it doesn't look cheap. The gold zippers are a great accent and add flavour and a nice subtle premium touch to the overall bag. The bag has many different compartments which is a plus for my wife who has a ton of 'stuff' and needs the storage space. There's a sleeve pouch that fits your phone for easy access. Overall, I was very satisfied with this purchase and I'm actually looking into buying the black one for my mom for Christmas.",
		  "I was looking for crossbody purse from long time. Finally I ordered this crossbody purse for my wife. This purse is high quality and very light weight. Material is very good. This purse has enough pocket to hold necessary stuff. This purse is quitecomfortable and length of strips is well enough which fitted well with crossbody.Inner material of this purse is also quite good.Really worth of my money.",
		  "Very nice. Does not look cheap. However in the reviews I read there were multiple compartments. But there is only one compartment in the inside with 2 pockets sewn on one side of the purse. There are 3 zippered compartments on the outside, one of which would be perfect for the phone. It is not bulgy and sits smooth along the body. It is also light which is a good thing. Overall very pleased!",
		  "so surprised by the quality of this bag. looks just as good as a high end purse.\ngreat pockets and space inside. beautiful hardware that gilds easily.",
		  "The perfect size. Can fit a book in it if I want. But it’s very flat and difficult to search through because the bottom doesn’t hold it up in any way if that makes sense",
		  "ordered it in brown and liked it so much ordered another one in black, looks smart, has lots of compartments for various items, not a huge purse but big enough and it is light weight, highly recommend this purse.",
		  "One of the best bags I have ever owned. It is light and compact. Don’t worry It holds a lot.",
		  "Slick looking. Lots of compartments. Nice material. Fast shipping. Really like it. Good price too"
	   ],
	   "numberOfRates":138,
	   "avarageRate":3.180032673813984,
	   "id":169
	},
	{
	   "productTitle":"HPASS Pochette Soft Canvas CrossbodyHandbag Tote Bag Shoulder Bag",
	   "desc":"",
	   "category":29,
	   "images":[
		  "616PHuVVvwL._UY575_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"55.93",
	   "comments":[
		  "Very impressed with my purse.... Many compliments......Thanks.....",
		  "Update:. I added a star because the seller made the issue right. I wouldn’t hesitate to shop with them again. Their customer service was great.\n\nI ended up getting my bag yesterday 3/20 and it wasn’t due to be here until sometime between the begging- end of April. Getting it weeks before it was due to come was nice. So far I’m pretty impressed for the price but there are flaws. First the stamping on the handle and inside are both crooked. Not a huge thing but for the price I paid I expected it to be straight. Second the stitching of the material inside is crooked in two spots. Third the strap is kind of sticky and I worry the glazing won’t last unless I’m really careful with it. The bag does stink but it isn’t unbearable and I have no doubt it will go away once it airs out. I ordered from WenYe and for the amount of money you save it’s not bad but I wish it were perfect. I don’t think most people would notice the flaws but I’m picky. Keep in mind that the strap is shorter than you might expect as well. I have a bigger bust so if I wear it crossbody it sits ever so slightly higher than I would like but at least it’s not weird looking.",
		  "This shoulder bag is beautiful. I read some mix reviews and I had my concerns, but this handbag does not have the flaws that I read about in other reviews. It comes with strap that matches nicely, and it looks authentic. I am extremely satisfied, and will buy the reversed monogram next. I purchased this handbag from WenYe Appliances Trading Company. The seller was responsive to all my questions.\n\nUPDATE: I was so pleased with the brown HPASS Pochette that I purchased from WenYe Appliances that I bought the reverse monogram. It's just as nice as the first one. I inspected it carefully and found ZERO flaws. Everything is even, the flowers on the strap are not cut off, and the handbag is well made. I would buy another if sold in another color.",
		  "Beautiful! Bought from BGFNGN. And was SUPER NERVOUS! I have always wanted a LV but as a Mom to a large family, sometimes Moms come last haha! This was a splurge for me and it’s perfect for what I paid! Ordered March 7 and got it March 23! After all, Who is really going to ask “IS THAT REAL?” Thank you! I just may be sleeping with my new purse tonight!!",
		  "Seriously amazed! Looks just like the real one! I bought through the WenYe appliance trading seller and I love it! Only 3 stars cuz there is a slight smell but hopefully it airs out and goes away.. but also the side is already coming undone!",
		  "So pleased with this purchase. Unfortunately, I don’t have an authentic bag to compare it to but after receiving this bag, it seems silly to purchase the real thing based on the quality of this one. MAYBE THEY ARE THE SAME?! No regrets and you won’t have any either! Perfect size for convenient carrying. Just buy the bag!"
	   ],
	   "numberOfRates":131,
	   "avarageRate":3.972676183172378,
	   "id":170
	},
	{
	   "productTitle":"TELLM Lady Women Clutch Wallet Long Purse Wallet Black",
	   "desc":"",
	   "category":28,
	   "images":[
		  "51LTucpECiL._SX569_.jpg",
		  "71BwUTzkvNL._SX569_.jpg",
		  "918nvQKRt7L._SX569_.jpg",
		  "91we2%2BxzxTL._SX569_.jpg",
		  "91OR2JUFdKL._SX569_.jpg",
		  "71zx-bKY0eL._SX569_.jpg",
		  "715S9f0IvbL._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"13.79",
	   "priceIs":"7.60",
	   "comments":[
		  "If I could give a half a star or no star I would! I received this wallet after a lengthy wait which was fine, but upon receiving it I could not open the latch. I pulled and pulled at the tab (shown in the image) but I didn't want to damage it either.. as the whole thing seemed like it would rip out of the leather-like fabric. The snap felt fused together and I could only pry it open with a screwdriver or a knife. Worse however was when I contacted the seller regarding the problem they repeatedly indicated that that the problem was with me. They responded with no apology but with a statement that their wallet is \"very easy to open\" and later on with an image of the snap and instructions that I just had to pull up on the tab. I was floored! I can guarantee that I know how to open a snap closure on a wallet. Waiting now to see how Amazon resolves this as the seller is not.",
		  "Pretty design, lots of space inside the wallet. Unfortunately the materials are very cheap and the button (likely made of plastic and not metal) on my wallet broke after just a few weeks of use so it no longer closes.",
		  "Beautiful wallet! I really love it! The only thing that sucks is that it fits a little small for my Canadian money, and there is no place for change, but I still love it anyway =)",
		  "My buckle broke after a few months now its basically just swinging open all the time and I'm here to shop for a better one. Other than that its cute and i did get some compliments... buy at your own risk i guess.",
		  "It is just like the picture and has very nice design. As for the materials read the product description remember it is not a $200 wallet so do not compare it to like coach. The only reason I’m giving this one less star (4 stars) is because the latch button isn’t properly locking. But all in all it was as described.",
		  "The wallet arrived with a broken clasp and is already starting to fall apart inside where my cards go. Seller offered a small refund (hardly worth it). You get what you pay for.",
		  "I bought this as a gift in blue for my mother, she fell in love with it the moment she saw it.\nThe quality feels good but again you should take care to clean it regularly and take care of what you purchase instead of expecting it to hold out through neglect.\nThe gold pops beautifully through the blue, they compliment each other really well; I highly recommend the blue over the other colours.",
		  "I bought it as a gift for a young adult and she loved it because it's not too small but it's not as large as most women's wallets this one is youthful and classy and it has lots of convenient compartments. I will actually buy another one different color for myself later on. Delivery took less than 2 days"
	   ],
	   "numberOfRates":41,
	   "avarageRate":5.610613325404555,
	   "id":171
	},
	{
	   "productTitle":"Travelon 33226 540 Anti-Theft Heritage Small Crossbody Bag, Pewter, One Size",
	   "desc":"We are at the forefront of interpreting changing market conditions into products designed to make Travel Easier and Safer for our consumers and to make the sale of our products easier and financially rewarding for our retail partners.",
	   "category":29,
	   "images":[
		  "A1wFy9HvjFL._SX569_.jpg",
		  "918%2BU9VVC8L._SX569_.jpg",
		  "91rsG2nw%2BcL._SX569_.jpg",
		  "81Oyl5gNgCL._SY879_.jpg",
		  "91PWRdF8Z-L._SX569_.jpg",
		  "81ho6OVBuML._SX569_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"36.77",
	   "comments":[
		  "The fabric and stitching are of good quality.\nThe strap is ok- it's made from same fabric as the bag, but the one side attaching it to the bag has no hook, so the strap tangles VERY easily and needs to be constantly adjusted. Plus, the adjustment part of the strap is on the front of the bag if it's worn on the right side.\nThe bag itself is made well and the size is perfect. Fits a book, phone, wallet, keys and a bit more. RFD pocket should be way larger though.",
		  "Super cute purse, not just for traveling. Great size to fit the basics, and looks great with casual attire. The added security features are a bonus no matter where you go. For traveling, it is discreet rather than flashy and being able to wear it cross body means you can be more aware of it.",
		  "All the features of the larger sized bags. Nice black and white striped lining. Easy to find stuff inside. Small size that I wanted to be able to not have to lug all the stuff in my big bag when I went out for dinner. Very pleased with this purchase.",
		  "I really like the clip on. makes it harder for a thief to get in the purse. not that i encounter any. but it especially helpful for when i was on cvert crowded train when i was in europe.",
		  "Purse is slightly smaller than anticipated. Outside front pocket is a tight fit for cell phone.",
		  "Perfect size for what I needed. Great little travel purse that's secure. Wish it was just a bit wider to fit a larger wallet in it.",
		  "This is a really well designed purse, with just the right number of side pockets in just the right places. Not giving it 5 stars because it is a bit on a heavy side.",
		  "It's perfect size, wish the material was less rough looking but it fits everything and is comfortable on the shoulder"
	   ],
	   "numberOfRates":132,
	   "avarageRate":2.243530141007049,
	   "id":172
	},
	{
	   "productTitle":"L'Oreal Paris Voluminous Original Mascara, Black Brown",
	   "desc":"Voluminous Original Mascara is uniquely formulated to resist clumping and build lashes up to 5X their natural thickness. The Volume Maximizing Brush thickens lashes evenly and smoothly, leaving them soft with virtually no flakes for a full and dramatic look.Clump-resistant. Fragrance-free. Ophthalmologist-tested and allergy-tested. Suitable for sensitive eyes and contact lens wearers.*Based on Nielsen data for mascara units sold in food, drug and major discount retailers during the 52 week period ending 6/11/16.",
	   "category":32,
	   "images":[
		  "614mTDXXMCL._SX679_.jpg",
		  "61RhdHmOIoL._SX679_.jpg",
		  "51vPaaQwXrL._SX679_.jpg",
		  "218O2ZGn1WL.jpg",
		  "81mG6Dz1SEL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"6.72",
	   "comments":[
		  "I'm so mad at myself for spending so much on mascaras before this one... this is better than They're Real, Better Than Sex and Glossier's mascara put together! I would go as far as to say its better than Le Volume de Chanel. That good! It goes on so easily, builds volume right away and doesn't clump at all. It lasts all day and comes off so easily at night, obsessed!",
		  "I bought this along with the white L’Oréal Primer. Best lash effect I’ve ever had. (I have fair, short eyelashes.). Other products make my eyes itch and the lashes feel stiff and dry. I returned my $30 boutique mascara and will be using this from now on.",
		  "Not sure this would get purchased again. The brush bristles are fairly large and seemed to get clumpy as it was used. THe briteles did not do a good job of removing clumps from eye lashes and separating.",
		  "I love this mascara. Its my all time favourite! I have bought 2 from amazon in the last couple months because of the amazing price compared to in store. This mascara is a must have!!!!!!!!",
		  "This is one of the best mascaras you can by at the drugstore if you are looking for natural looking volume for your lashes. The brush gives the lashes more volume without clumps. I have recently started using this with Loreal's white lash primer and the products combined work great together.",
		  "When I purchased this I wanted it to be a more of a navy blue instead of the electric blue.\n\nIt is good for when I want to give a more fun look to my eye makeup or something more extravagant.",
		  "I love this mascara its my favorite daily go to \"drug store\" mascara.\nLong wearing full coverage no clumping drying or flaking.\nI buy it all the time and will continue to do so unless something else captures my eye and I highly recommend it.",
		  "The best mascara on the market. I love that it is unscented and suitable for my sensitive eyes. I used to spend $30 on designer brands, but this is significantly better than any of those. I recommend it to all of my friends!"
	   ],
	   "numberOfRates":107,
	   "avarageRate":2.863825830401802,
	   "id":173
	},
	{
	   "productTitle":"L'Oreal Paris Lash paradise liquid eyeliner, rose gold, 1.5ml",
	   "desc":"",
	   "category":32,
	   "images":[
		  "61nXT5fGDTL._SX679_.jpg",
		  "61Rlpn8vB2L._SX679_.jpg",
		  "61ecCrn2i7L._SX679_.jpg",
		  "61zVa7m4IFL._SX679_.jpg",
		  "81435-fljaL._SX679_.jpg",
		  "81RsGvr2llL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"10.96",
	   "priceIs":"8.96",
	   "comments":[
		  "Update: Amazon replaced it. Upon further inspection I found that the original one I got was not bone dry as i suspected but instead, empty. Not a drop of eyeliner in there. I guess it happens. I have tried the replacement and the liner itself is decent, good enough for me. Good on Amazon for offering to replace or refund.\n\nI'm sure this liner is usually good. But the one I recieved is bone dry. Sealed package, but literally dried right out, useless.",
		  "Extremely beautiful. I do a intense wing with this rose gold liner and I bring it all the way to my inner corner as well. Then I go over it with a thinner black wing and it looks AMAZING. I’ve never gotten so many compliments from a makeup look. People say it’s subtle but eye catching as well. Love it!!",
		  "I love this product for my skin. It is very light and can be washed off with water. Let it sit on your skin for a minute to dry before you touch it much. I have light olive skin and it works for me. I find the light colour helps offset dark circles.",
		  "Honestly the worst liquid liner I've ever used. Hard to apply, dries and flakes off and not highly pigmented.",
		  "I have seen better products from lo'real",
		  " If i only could give zero star!\nDo not buy this eyeliner!\nIt came completely dry (see video) and for few bucks no worth to even return it!",
		  "Came in a somewhat broken package, didn’t work, was dried out, when I checked the date it was expired.",
		  "The colour is so pretty and I love the brush. super easy to apply."
	   ],
	   "numberOfRates":109,
	   "avarageRate":2.8780591392765253,
	   "id":174
	},
	{
	   "productTitle":"L'Oreal Paris Double Extend Beauty Tubes Mascara, Blackest Black, 0.33-Fluid Ounce",
	   "desc":"Let your eyes do all the talking with a dramatic look that speaks volumes.Follow these expert tips to get the perfect lash:1. First, begin by combing your lashes2. Create the look of extra long lashes using an eyelash curler. Carefully align the eyelash curler with your lashes and hold for five to ten seconds.3. After lashes are curled, pull the wand out of the tube and wipe any excess product against the opening of the container - you can always add more later on.4. Hold your mascara wand in one hand, and with the other, gently lift the eyelid back so you have full leverage to coat the lashes from root to tip.5. Apply mascara at the base of your lashes and sweep down through the ends, wiggling the wand from side to side. This will coat the sides of the lashes too.",
	   "category":32,
	   "images":[
		  "61DeqntJfnL._SX679_.jpg",
		  "711DBfWdW8L._SX679_.jpg",
		  "51ISevEe3aL._SX679_.jpg",
		  "41oJ0MIptkL.jpg",
		  "41GxEL-FVTL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"12.96",
	   "priceIs":"11.96",
	   "comments":[
		  "So, this one is a bit difficult to review. It made my lashes look longer but some did clump so I didn't get that fanned out look I wanted. The major draw back for me was the allergic reaction that followed! Puffy eyelids right around the base of my eyelashes, rashes where the lashes made contact around my eye... So for those of you with sensitivities to makeup and other products, be cautious",
		  "the best mascara!! not only is it affordable, it lasts all day and doesn't cause any raccoon eyes. At the end of the day, wash your face, let your eye lashes get wet and then just gently pinch your eyelash and the mascara comes off in pieces. It may sound weird, but once you try this type of mascara you won't go back to the other stuff. Such a great find, can't recommend this enough!",
		  "I liked this mascara for the first week and then it started to dry out. Between the cost and it only be good for a few weeks O would rather spend $25 on a professional bra d mascara that lasts 6 monthes.",
		  "I have short asian lashes. This doesn't hold a curl (sort of kills the curl, actually) or add volume - maybe just a little length. My eyes are pretty watery and putting this on the lower lash line makes the tubes fall off and get major clumps.",
		  "This holds a curl better than any mascara I’ve used. (just by brushing up, no eyelash curlers required) Perhaps the low price point makes me feel like the quality isn’t there, but when I use it I feel like I’m putting something bad on my body. Perhaps it’s the strong chemical/glue smell. The skin in the corners of my eyes is sensitive, and so it gets irritated if I wear this too much, but I like it for every once and a while.",
		  "Im not overly experienced with make-up, but I feel like my lashes look clumpy after using this. With warm water, it comes off easily though!",
		  "I used a high end brand called kiss for years and years because it tubes your lashes and doesn't run ect and easy to remove. My sister told me about this and I was hesitant to try it cause I didn't want to be disappointed but now it's my mascara of choice and it's a 1/3 of the price. Best part, I actually like it better because you can build up the lenght with the white side!!! In love:) they just better not stop making it !!!",
		  "Je travaille à l’extérieur et même les meilleurs mascaras hydrofuges finissaient toujours par me faire des yeux de ratons. Ce mascara est merveilleux, il ne tâche pas, tient toute la journée et ne « coule » jamais."
	   ],
	   "numberOfRates":93,
	   "avarageRate":1.3847328050171668,
	   "id":175
	},
	{
	   "productTitle":"Maybelline New York Instant Age Rewind Eraser Treatment Makeup, Sandy Beige 220, 0.68 Fluid Ounce",
	   "desc":"Instantly erase fine lines, creases and age spots with Maybelline New York Instant Age Rewind Eraser Treatment Makeup, the first anti-aging makeup combining a patented micro-corrector applicator and a breakthrough formula with active ingredients. Patented micro-corrector applicator micro-fills and smoothes imperfections on skin's surface. Super-concentrated foundation formula with goji berry and collagen tightens & improves skin elasticity. SPF 18 sunscreen helps protect skin from sun damage. Clinically proven effectiveness.",
	   "category":32,
	   "images":[
		  "71A%2BYcfOVvL._SY879_.jpg",
		  "71Obr-TF44L._SY879_.jpg",
		  "71uRx921dNL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"15.99",
	   "priceIs":"12.96",
	   "comments":[
		  "This is my best friend when I need to rush out the door, cover some redness and a few blemishes, rub the sponge all over my face then quickly blend it out with my \"beauty blender\" and out the door I go. I've I dont do concealer, I dont even set this with powder (in the colder months, in the summer everything needs to be set with powder for me) but I absolutely love it. It's high light coverage, can be sheer or closer to medium coverage, its lightweight on the face and looks natural. I've gone through 2 sticks. Why is no one talking about this?! Everyone only talks about the Age Rewind Concealer. This IS AMAZING!",
		  "Love this product, I found my perfect colour match with it and it applies very smoothly when using a beauty blender. Very affordable, no reaction with my skin, why would I use anything else?",
		  "I’ Used this for years and lately I’ve had difficulty finding it in drugstore so I get it here. Great product to apply to mask dark circles around eyes.",
		  "This stuff is GREAT!!",
		  "Love this concealer! Easy to apply",
		  "Purchased for my wife and she loves it!",
		  "Great cover up.",
		  "Great cover up."
	   ],
	   "numberOfRates":16,
	   "avarageRate":0.6880899891884558,
	   "id":176
	},
	{
	   "productTitle":"Waterproof Mascara Black for Eyelash Growth - Combo Lash Lift Kit for Makeup Lash Enhancer & Voluminizing Mascara with Growth Serum",
	   "desc":"All of our products are CRUELTY FREE and are manufactured in the USA. Unlike other lash and brow serums, our Advanced Lash Duo comes infused with Pentapeptides, Hyaluronic acid, and White tea extracts, essential B vitamin, Biotin, and powerful peptides so you can BOOST AND ENHANCE your look as well as your confidence with ingredients that are proven and effective. High-performance botanical formula that features multi-action peptides that progressively increase the length, thickness and fullness of lashes and brows.",
	   "category":32,
	   "images":[
		  "71iuuvENBPL._SX679_.jpg",
		  "81CU9Y1p0PL._SX679_.jpg",
		  "81%2Bl5Uk6ynL._SX679_.jpg",
		  "41MBKl7JpNL.jpg",
		  "81SRc%2BbuQ7L._SX679_.jpg",
		  "71K9Lh-WfSL._SX679_.jpg",
		  "71oNbhljSwL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"84.99",
	   "comments":[
		  "After two weeks, I did not see any results and I have really bad irritation in my eyes and the mascara is definetly not waterproof. It stuck under my eyes and even through the day. It is also very expensive for something that doesn’t really work.",
		  "5 stars is for the eyeliner. The brush is awesome!",
		  "i really like how this goes on",
		  "What an awesome product, within a week of using this product I am already seeing a difference, they are longer and fuller.",
		  "Grew very well"
	   ],
	   "numberOfRates":148,
	   "avarageRate":4.201781867961643,
	   "id":177
	},
	{
	   "productTitle":"Grande Cosmetics GrandePRIMER",
	   "desc":"",
	   "category":32,
	   "images":[
		  "51Yk2dycSnL._SX522_.jpg",
		  "71uKiXJMcaL._SX522_.jpg",
		  "717IfK-hT9L._SX522_.jpg",
		  "71yrA54ZwZL._SX522_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":" 34.00",
	   "priceIs":"31.00",
	   "comments":[
		  "I had a sample of this from Sephora and was IN love with it. It made my lashes look 10 times longer. I was delighted that Amazon was selling it, but when I got it I noticed a few things:\n1. There didn't seem to be much product in the container\n2. It did not lengthen my lashes but made them clumpy looking, and crunchy.\n3. It is so difficult to get this stuff off my lashes.\n\nI'm sure what is going on, or if I just a bad batch of it, but for the price, and it's cheap, it was a HUGE disappointment, and waste of money.",
		  "Very happy with my order I would definitely order again this product is Stellar amazing or the lashes all my beauty Divas out there if you get a chance to grab this do it! and of course dealing with Amazon was a great experience as always",
		  "Love love love this product",
		  "This is a quality product I can only recommend. So far, I have only bought it from professional beauty supply where you need a cosmetology license to shop and when I found it here on Amazon, I was happy.\nThe product is really easy to apply, does not clump, does not smudge, extends the lashes and coats evenly. My natural lashes are blond, so I always look for a bit of dramatic application.\nI have super sensitive eyes and this is one of the few eye lash primers I can wear. The built-in lash conditioner prevents breakage.\nThe image I am posting is ONLY 1 coat of primer coupled with the Grande Mascara, applied at 4:30am this morning. I know one should always remove make-up at night, but at times I fall asleep on the couch and I don't wake up until it's time to get up again...and my eye make-up is still the same like the day before.\nI can only recommend it. This is a great product for people with super sensitive eyes.",
		  "I am shocked every day at what a phenomenal product this is: there is no unpleasant scent, and it removes easily (I use baby oil). The primer seems to make my lashes appear noticeably longer and fuller - just as advertised! I'm impressed - and I'm definitely not easily impressed!",
		  "Today was my first day using this primer before using my grande mascara, and I must say WHAT a difference the primer makes. My roomie thought they were lash extensions! See my attached photo and the difference between 1. Naked lashes, 2. grande mascara only, and 3. Grande primer + grande mascara.",
		  "I always use primer with my mascara, being that I LOVE blue mascara a white primer is very helpful in making the color pop. But to my surprise, this primer also lengthens my lashes, and I am so so happy. I do not like the spider lashes, or the longer clumpy lashes, this primer is a very nice surprise. I received a sample in a subscription box, and fell in love with it, I was thrilled to see it available on Amazon at a very reasonable price as well.",
		  "I always use lash primer to lengthen & thicken my lashes and recently decided to try this one over my usual go to Clinique primer. Works excellent, lengthens and thickens my straight short thin lashes. My only con would be that it suddenly got clumpy in the bottle after the first week but doesn't seem to effect it on the brush or application very much. Would definitely buy again."
	   ],
	   "numberOfRates":30,
	   "avarageRate":3.3143987258856327,
	   "id":178
	},
	{
	   "productTitle":"COVERGIRL - Lash Blast Fusion Mascara - Packaging May Vary",
	   "desc":"Get up to 10X volume + length in one stroke!Fiberstretch formula and an oversized brush make every little lash bigger, fuller, longer-looking and more dramatic.Step 1: If desired, curl eyelashes before application.Step 2: Start at the base of your lash line and wiggle brush upward to coat lashes.Step 3: Apply multiple coats for added volume.",
	   "category":32,
	   "images":[
		  "61xSHZZnHwL._SX679_.jpg",
		  "71n8E%2BzAMaL._SX679_.jpg",
		  "715DeJtYIUL._SX679_.jpg",
		  "71U1kjVLkBL._SX679_.jpg",
		  "814w8fvmhuL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"9.49",
	   "comments":[
		  "I love this line of mascara; it's the most natural-looking stuff I've ever had, lengthening and slightly volumizing without any clumps at all. They don't market it as waterproof, but this stuff has only ever budged when snow has landed and then melted on my eyelashes. Rain and even showering doesn't give me raccoon eyes with this.\n\nMeanwhile, the 3 \"waterproof\" MAC mascaras I've tried are clumpy and leave black marks under my eyes if I so much as blink too hard.\n\n100% recommend this and the other ones in the line.",
		  "The bristles were SO short, they didn't grab onto my eyelashes at ALL. Although the product was very thin (In a bad way), it still managed to create clumps on my lashes? It didn't thicken them at all (Which I don't believe it claimed to do?), but it also didn't lengthen or curl them what so ever. If anything, all it did was dye the very ends. I couldn't build it up, because the initial application is very important in \"setting your lashes in place\". It also didn't separate the lashes because of the non-existent SHORT SHORT SHORT bristles. Waste of money. Will not buy again. Very disappointed.",
		  "My fault...I ordered wrong type of mascara. It's okay but I'll be more careful in future of what makeup I order",
		  "I would recommend this product. It is exactly as described and a great value for the money",
		  "My go-to mascara. Love the brush bc it doesn't result in clumps.",
		  "Good, even better when dried up a bit",
		  "My favourite mascara!!",
		  "Always great make up from Covergirl"
	   ],
	   "numberOfRates":60,
	   "avarageRate":0.5420987092322402,
	   "id":179
	},
	{
	   "productTitle":"NIVEA Pearly Shine Caring Lip Balm Stick, 4.8 g",
	   "desc":"",
	   "category":31,
	   "images":[
		  "61I1S6leCCL._SX679_.jpg",
		  "61ZpG605mTL._SY879_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"1.98",
	   "comments":[
		  "I added this to my order to qualify for free shipping. I've thrown it out since then. If you use it liberally as a balm, you end up with frosted, metallic-white lips. If you use it for its pearly shine, it's ineffective as a balm. It makes for a decent highlighter on the face though, if you want to get creative.",
		  "The reason why I decided to try this one out from Nivea is because of how highly I think of their milk & honey lip balm. That one works amazingly on my lips and keeps it moisturized. Compared to the milk & honey one, I find the cherry one does give a nice tint but is not as moisturizing. The texture feels slightly more chalky to me. The cherry one also smells yummy!\n\nStill makes a great cart filler item though and is great for days when you want just a bit of colour.",
		  "I love the slight colour this shade gives my lips. It is very light and natural. No need for lipstick. For a lighter shade choose Strawberry. For a frosty pale pink, choose Pearl Shine.",
		  "LOVE THIS LIP BALM! Initially I bought this on a whim for stocking stuffers and a couple extra just to have on hand...after receiving and trying the one I got for myself I have been hooked ever since. Keeps my lips perfectly moisturized during these cold canadian winters and looks great. Love that I can just throw it on and it looks like a proper light pink pearly lipstick... these have quickly made way into my makeup routine and will be buying many more in the future",
		  "I purchased the pearly shine and this balm lives up to its name. Texture and appearance are very ‘pearl’ like. A bit luminescent as well. I like to use this as a backup item in my purse or drawer at work. Since it’s relatively cheap I don’t worry if it gets tossed around in my bag.",
		  "Got 2 of these. Best add on item. Leaves lips with a tinted sheen. If you found my review helpful please click the Helpful button below.",
		  "The consistency is really smooth and it goes on easily. It's not as moisturizing as some of the other Nivea lip balms (e.g. the soothing care one with vitamin E) but it does a decent job. If your lips get really chapped, it's not the best lip balm for the job though. It smells really good but I wish the tint was stronger since it's basically nonexistent.",
		  "This is a fairly red and shimmery product and has a strong scent to it. If either of those bother you, I wouldn't recommend this to you! That aside, these do a good job of keeping my lips moist, but have to be reapplied quite often. Perhaps it's the Canadian winters and the fact that I have very dry lips, but one stick doesn't last too long for me. Despite that, for the price, I think it's a fair deal. Would recommend."
	   ],
	   "numberOfRates":25,
	   "avarageRate":5.962258067485562,
	   "id":180
	},
	{
	   "productTitle":"Dove Men +Care Hydration Balance Micro Moisture Body + Face Wash 400ml",
	   "desc":"",
	   "category":31,
	   "images":[
		  "71zfRQhi9JL._SX679_.jpg",
		  "81r7YmTD%2BQL._SY879_.jpg",
		  "61T7mLnlSSL._SX679_.jpg",
		  "31AzcnqDHML.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"6.49",
	   "comments":[
		  "I regularly use this product and it was my first time purchasing these (3) from Amazon. Would it have been the same quality that would be ideal for me as i usually order in multiples and not worry about restocking for a while. However what inside the bottle was not on par with the products i usually buy elsewhere.\n\nThe product came out very liquid with odd chunks blocking the way causing massive waste of product as it's flowing in all directions. The scent was the same as the normal ones.\n\nOut of 6, 3 Awake Energizing Scent (yellow) and 3 Extra Fresh Micro Moisture (green), 5 of them were as described above (liquid with some chunk). Only 1 of the 6 (Extra Fresh Micro Moisture) was as the product usually intended to come out.\n\nGiven the amount of similar comments, i would expect Amazon or Dove Men + Car teams to contact their customers given that this is not a singular issue with my purchase.\n\nToo bad cause this is something is use all the time.",
		  "Amazon is selling old, or expired stock. This is supposed to be a gel soap, but the gel has all disolved, and it's now a very runny liquid. Since it pours from the bottom of the bottle, it will pour out very quickly, and far too much soap comes out. Then it drips everywhere, because it has no cohesion. Bought 2 bottle, and both were expired.",
		  "I actually really like this product.\n\nIt cleans you, which of course it should. It has a scent that isn't overpowering or perfume-y, and doesn't leave my skin feeling dry or greasy.\n\nI don't particularly like the design of the bottle or the top valve-like hole. It tends to hold a few showers worth of wash after it starts acting like its empty, and the top-down resting position doesn't really help get the last of the wash out as much as one would expect. Its not too much of a big deal though: Twist the top off, swish some water around, and get clean.\n\nI tried to use it without an accessory like a sponge/loofah/poof/whatever, but ended up using 10x more than I would normally use. Its thick and needs some kind of accessory to use efficiently.",
		  "I don't know why but product came either expired or something, it wasn't a gel form and when you squeeze it was just water so I won't buy this specific one I may buy other Dove products.",
		  "I've been using this for more than a year, and have had it with Subscribe and Save through Amazon for almost a year. Unfortunately, the latest one I got seemed to be extremely runny, and was not the usual consistency. I could actually hear it sloshing around inside the container and when I open it, instead of squeezing it out, it just runs out on its own.\n\nAnyway, Amazon, being great as usual have refunded it. Looks like I'm the second one this month to receive a bottle like this, based on the reviews, so it may be a QA issue over at Dove.\n\nBarring that, though, it's a great bodywash, and as you can tell I've liked it enough to keep using it for more than a year.",
		  "Cleanses my skin unlike any other body wash I've used, thus far. Excellent exfoliation properties, of which rival any shower loofah or exfoliation cloth. Unlike traditional exfoliation methods, there's no arduousness involved -- rather -- its application is not much different than any other body wash.\n\nAfterwards, there's zero residue left on your skin, with the absence of any sort of obnoxious scent; something I've rarely ever experienced with any body wash. There is, however, a faint charcoal odour left within the bathtub after each shower session. Not something that is particularly bothersome to me, but it could be to some individuals.\n\nAll in all, I'd say this body wash blew my expectations out of the water. Very much obliterated any prior skepticism I had. Never did I imagine, in my wildest dreams, a body wash which could exfoliate and cleanse my skin this well.",
		  "[Review for Oil Control]\nIt works really well. I used it after coming back from doing exercises (I smelled really bad) and it immediately removed all oil and odors. It smells like normal men perfume. The only complaint is that it feels and looks like water, which is hard to distinguish the amount when being in the shower. I would've expected it to be a \"gel\" like it is written on the bottle. Also, the content immediately flows out when opening and putting the bottle upside down. It should only work when I press the bottle.",
		  "I use this stuff in the shower like a normal human being, and it seems to work quite well with the scrunchy that I keep there for a similar purpose. It doesn't reallly lather up all that well on a facecloth, but I don't use a face cloth so it's fine."
	   ],
	   "numberOfRates":86,
	   "avarageRate":1.2533330697459308,
	   "id":181
	},
	{
	   "productTitle":"NIVEA MEN Cool Kick 24H Fresh Effect Shower Gel, 500 mL",
	   "desc":"",
	   "category":31,
	   "images":[
		  "61uzrt%2BXKrL._SX679_.jpg",
		  "8140nmNuM1L._SY879_.jpg",
		  "31CqSBkAWxL.jpg",
		  "61v1B-L9sGL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"10.99",
	   "priceIs":"3.97",
	   "comments":[
		  "I usually go with irish springs for body wash but the price was a bit high so I decided on trying something new. I have tried Nivea men products before and I have found them to be pretty reasonable. I was looking around and found this. The price was decent and the reviews said good things as well. It was also $3 at the time of purchase so I ordered it.\n\nIt arrived quickly and it was just wrapped up in some plastic. I have been using it for the past few days. I find that the product can have a strong cologne smell almost when it comes out of the container. Luckily after applying it and washing it off that smell fades. If it did not then I would have an issue there.\n\nI know the product says that you can apply it to your face, body and hair but I would not recommend it. This is funny because there are even memes about how men can use one product for everything and women have to buy a million separate products. The truth is that using one product for everything is not a good idea as the product is quite generic. I would recommend this for a bodywash, a daily facial cleaner/exfoliator and shampoo/conditioner. This is just my 2 cents but I have noticed since doing that my face and hair look great.\n\nOverall, if it is $3 in the future then I would buy this again.",
		  "I decided to buy this Nivea \"Active Clean\" shower gel and give it a try to see if it can really clean my hair aswell as mentionned on the bottle, but i use hair gel (not a huge quantity) and i had to take another shower to wash them and remove the gel (wich is not a very strong hair gel).. Unfortunatly i guess that Nivea products are not for me, but the smell is ok!",
		  "So the description clearly states...\" NIVEA MEN Cool Kick 24H Fresh Effect Shower Gel, 500 mL, Pack of 3\" with a minimum order of 2 sets. Assuming that I'm getting a great deal of 6 units and forced to buy more than I need and find that I received only 2 units at regular retail price. Highly disappointed that this would be represented under the umbrella of Amazon Prime delivery.",
		  "Watch out for this product description, they change it to and from “3 pack”. Thought I was ordering a 3 pack when one came, I then looked at the product heading and it had been changed within 2 days",
		  "Excellent product. Bought to deal with elderly parent’s skin condition leading to severe itching problem. Since the active ingredient is Menthol, this cools the skin and prevents dryness. Leaves skin feeling smooth, clean and cool. Skin condition improves dramatically and is reversing skin problems. Now I USE IT myself now, too. Also Amazon price is way cheaper than in-store.",
		  "I’ve tried different shower gels over the years including Old Spice and Dove for men. This one from Nivea is my favorite. I like the scent and the texture, great product.",
		  "I have used many of the Nivea skin care brand and I have never been disappointed.\n\nI gave this to the men in my family for Christmas and they loved it. This body, face, and hair gel is really refreshing and has a fresh minty scent. The price is similar to stores as well, a great buy!",
		  "Mildly scented but I don't really like the scent. I wish it could have had a cleaner fresher scent. Whatever that is. I just know this isn't it."
	   ],
	   "numberOfRates":100,
	   "avarageRate":5.151221450841335,
	   "id":182
	},
	{
	   "productTitle":"eos Essential Berry Blossom Hand Lotion, 44ml, Pack of 1",
	   "desc":"",
	   "category":31,
	   "images":[
		  "71spRbpweQL._SX679_.jpg",
		  "61myi-89OBL._SY879_.jpg",
		  "71qZEqmFpeL._SX679_.jpg",
		  "61gK2v0Vg%2BL.jpg",
		  "21v3f-zwIoL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"2.80",
	   "comments":[
		  "Fun fact about me: I hate the feeling of grease on my hands. Unfortunately, this hatred is so pervasive that it extends even to my skin's natural oils, so I wash my hands even when they aren't really dirty, drying them out. This means that I consume a lot of lotion (particularly in the dry Canadian winter), but if the lotion feels greasy, I usually end up cracking and washing it off, rendering it useless.\nTrue, this hand lotion isn't really that moisturizing, but it absorbs very quickly and leaves almost no residue (which seems to be a relatively rare quality, despite pretty much every lotion ever labelling themselves as non-greasy) and it's enough to help save you from full-on leather hands.\nOn another note, the scent of this was a little disappointing. It's quite strong and artificial, and smells more generically sweet than specifically fruity/floral. I don't mind it very much, but be conscientious in how much you put on at a time if you have a sensitive sniffer.",
		  "Great little hand cream. Perfect dor carrying around in your bag/purse. Works greatvfor dry cracked hands and nonus has a nice clean, fresh smell.",
		  "The smell is a wee bit strong but I don't mind that others might. But the way this feels on my hands I absolutely love it. Super silky smooth and not greasy at all.",
		  "J’adore cette crème à main. Elle hydrate mes mains sans laisser d'effet huileux. Je recommande ce produit et ce marchand.",
		  "this lotion in amazing. if you use it you so not even need perfume. it smells so nice",
		  "Good hand cream! Good size for large purses or travel. Eos really know how to moisturize and this product is no different!",
		  "Feels nice and adds just a bit of moisture without being greasy at all which I wanted.",
		  "I like to cucumber smell, and it absorbs into yipur skin quickly"
	   ],
	   "numberOfRates":198,
	   "avarageRate":3.7976414054449674,
	   "id":183
	},
	{
	   "productTitle":"Organic Castor Oil - Eyelash & Eyebrow Growth Serum 100% Pure USDA Certified 60ml - 2 Oz (Made in Canada) for Hair Loss, Beard, Eyelashes and Eyebrows. Free Set of Brush & Eyeliner Applicators kit and a Free E-Book",
	   "desc":"Ecla Skin Care Castor Oil is organically grown and cold pressed with no added preservatives. Because it’s 100% pure, it easily absorbs into your lashes and brows to boost hair growth. Castor Oil is also a key ingredient in dandruff shampoo, hair growth serums, and can be used as fingernail oil as well.Besides hair growth, Castor Oil is also great to use as a natural moisturizer and for skin health. It help retain moistures so your skin doesn't get dry during the day.It comes in an amber glass bottle to protect from harmful UV light and it also include a glass dropper. The bottle is 100% pure castor oil with no carrier oil added.Apply Castor Oil Serum with one stroke of the brush-applicator on clean, dry skin of the eyelids along the upper lash line (after removing make-up).",
	   "category":31,
	   "images":[
		  "71Rp3e4xP%2BL._SX679_.jpg",
		  "81X2YozRvuL._SX679_.jpg",
		  "81wxLZJ66TL._SX679_.jpg",
		  "71ybMTWMN5L._SX679_.jpg",
		  "71n9Ua5gOqL._SX679_.jpg",
		  "719Z0BXY5%2BL._SX679_.jpg",
		  "71AT6Crxm7L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"16.97",
	   "comments":[
		  "I'm an asian woman with such short eye lashes to begin with. Since last year I have been getting the eyelash extensions and my natural eyelashes got eventually ruined and my eyelash technician admitted that she no longer could perform her mad skills to my eyes unless my natural eyelashes come back within a year.\nI was devastated. so I did A LOT of research and bought this castor oil. First, I only applied at night, so about 8-9 hours a day. I did NOT notice any difference for a while (about 2 months).\n\nso I decided to increase the time of applying, and plus adding 'Organic Coconut oil' (Google said so). so I applied the castor oil + coconut oil in the morning 7am, and 6 pm and 11 pm before bed. 3 times a day 24/7.\nA month passed. (I suspect this period varies per different person)\nGOOD GOD, the magic has begun. my natural eyelashes are starting to grow back like a weed!!! This is a really happy development.\nMy natural eyelashes are stronger, thicker and longer. I can NOT believe this is happening. It's like a magic.\n\nI strongly suggest everyone investing your time, efforts to see the real happy results. You have to be diligent to be beautiful! :)",
		  "Since Écla skin care uses 100% natural Canadian ingredients, this product is very gentle on skin and doesn’t burn my eyes at all compared to other similar product that I’ve tried. It’s an oil so it’s thicker but I find it easier to apply. My hairs and lashes look healthier than before. The package came as described, including 2 eyelash and 2 eyebrow brushes.\n\nPuisque Écla Skin care utilise des ingrédients Canadiens 100% naturel, ce produit est très doux pour la peau et ne brûle pas les yeux comparativement à d’autres produits similaires que j’ai pu essayer. Il s’agit d’une huile, donc c’est un liquide plus épais, mais je trouve l’application plus facile pour cette raison. Mes cheveux et cils sont beaucoup plus brillants paraissent en meilleure santé qu’avant. Les description de l’item est juste, j’ai bien reçu la bouteille ainsi que les 2 brosses pour les cils et 2 autres pinceaux pour les sourcils.",
		  "I purchased this for my boyfriend who virtually had no eyebrow hair. I kept telling him he'd have to apply it EVERY night for at least a few months before we would even see results, so not to get too excited. I was completely wrong because it's only been a couple weeks and there is already a massive improvement! I'm very impressed with this product, and the brushes it comes with are super convenient.",
		  "Received an email from Tim one of the co-founders of Ecla Skin Care, thanking me for the purchase.\nAsking of I had any questions, and giving a brief history of the company and it's products.\nClass act in an era of invisibility with online purchasing.",
		  "Ive been using this oil for months now and Ive noticed a huge difference on the size of my eyelashes. They are so much longer and fuller than they were. I also use this mixed with coconut oil for my hair and my hair comes out really silky and thick looking. Need to buy another batch soon!",
		  "Great product but after looking on Amazon I found another brand with really great reviews that is far more cost efficient. So I’m happy with the product (does wonders on my hair and skin!!!) but I won’t be purchasing again because it’s far overpriced in my opinion.",
		  "just started using this product not long ago but I got a bunch in my eye lol and it's super gentle thank God and I get fake eye lashes so my eye lashes were very scarce and my eyelashes seem fuller and longer now!\nI also have serious hair loss right now being 3 months post partum and I put it all over my itchy dry falling out head of hair (yes it is very sticky but I'm desperate) mixed with my other olive oil hair growth left in over night (and next day) and along with jojoba shampoo conditioner and their rose water (a must buy) and a little shampoo brush be bop thing\nIt's working!!!!! hallelujah!! lol my hair stopped falling out as much and actually seeing results feels so amazing !!\n\nI also saw another comment someone puts a dab on the back of their hand and rubs the brush in, that works great!\nAnd the oil is so dense it's hard for the dropper to hold so just take caution, I made a huge mess the first time lol",
		  "The dropper didnt really work, it would just leak out immediately. I would also recommend purchasing a carrier oil with it, as castor oil is very sticky and hard to apply to your hair.\nProduct works as expected, making my hair easier to brush, less tangly, significantly softer, and less frizzy. Have not noticed any increase in hair growth."
	   ],
	   "numberOfRates":71,
	   "avarageRate":1.873672457749462,
	   "id":184
	},
	{
	   "productTitle":"Blackhead and Acne Remover Vacuum, COOFO Rechargeable Electronic Facial Pore Cleaner Extractor Tool Beauty Machine with 5 Adjustable Suction Levels",
	   "desc":"2*Big circular hole head: it can remove blackhead effectively, promoting blood and lymphatic circulation, letting the skin rejuvenate again. Can be applied to blackheads and V face.Using area: Any area on face except around the eyes.1*Oval Hole Head: Firming skin, removing fine wrinkles, increasing skin elasticity. Suitable for canthus, the corner of mouth and other areas where easy to have fine lines to prevent the growing of wrinkles.Using area: Can be used on sensitive area, such as, the area around the eyes, the corner of mouth and also other areas.1* Small Circular Hole Head: Suction is weak, which can be used to remove blackhead at the sensitive area.Using area: Can be used on sensitive area such as: the area around the ey",
	   "category":31,
	   "images":[
		  "61S4YzWW1ZL._SX679_.jpg",
		  "61zDEHpP%2BOL._SX679_.jpg",
		  "61wSczYj79L._SX679_.jpg",
		  "61moLKOUBwL._SX679_.jpg",
		  "61suk4Irf2L._SX679_.jpg",
		  "61zTCfspfzL._SX679_.jpg",
		  "51AmfBEo44L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"29.99",
	   "comments":[
		  "I loved the fact that it came with the tweezers kit. Really helped make this a complete experience. After using for about two weeks my face cleared up tremendously. I'll be using this for a very long time. Also, it is great that it is rechargeable!",
		  "The suction power is strong.I definitely feel my skin is lifted.dont stay on the skin too long or you may get purple skin.good to have 4 different heads for some sensitive area such as eyes and nose.there is 5 levels of suction power.even the weakest is strong enough in my opinion.",
		  "I was a little skeptical buying this as I watched videos and read reviews of people saying it dosen't do anything - but I really wanted to try it. I have horrible blackheads on my nose and chin - after using this just once i saw a huge difference. However , to see a difference you have to know how to use it.\n\nIt will do you no good unless you EXFOLIATE EXFOLIATE EXFOLIATE ! I bought a face steamer that I use for 8 minute prior to allow my pores to open and than while my face is still sweaty i use the vacuum and gently but constantly move it around the areas I need. It's not a one time - fix - all wonder it requires upkeep but if you do it often and properly the results are amazing. Better than any face mask or scrub.\n\nJust to add it has four or five levels of vacuum and I recommend starting low until you get used to it and than moving up - if you're not used to using it and moving it around constantly (but slowly !) You could end up with hickey like bruises on your face. No matter what it will get red after but I just take an ice cube to my face to help my pores close and reduce the redness and within an hour or so it's gone with noticable less blackheads !",
		  "I'm impressed! After spending 100's of dollars on facials I decided to try this product out! It works amazing! My nose is completely clear off blackheads. I highly recommend it.",
		  "The description is very accurate, it has 5 Adjustable strong suction, Usb charging with 4 replaceable suction tips can easily remove the dirty skin pores as well as be friendly to my skin, no discomfort. Looks good grade, suitable as a gift to a friend.",
		  "The blackhead remover can clear clogged pores. The machine is very powerful and useful.And no pains. The quality is really good.Best pore vacuum for the price.",
		  "As long as you don’t leave it in the same area for too long it works and doesn’t leave any marks. It got rid of all my blackheads. I recommend it. Powerful sucking motion and very well made. It’s not like those cheap “as seen on tv” products.",
		  "Well made and useful, I use a few times a week. Suction is enough to clean my pores. The battery is very good haven’t charged it yet after a handful of times. It is really better than peel of masks."
	   ],
	   "numberOfRates":177,
	   "avarageRate":4.579218647417678,
	   "id":185
	},
	{
	   "productTitle":"Mario Badescu Facial Spray with Aloe",
	   "desc":"",
	   "category":31,
	   "images":[
		  "71rKjeg-THL._SY679_.jpg",
		  "718buK%2B9SHL._SY679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"11.00",
	   "comments":[
		  "smells hella fresh. spray pump is a little bit resistant and hard to press down.\n\n-1 star off because mario badescu has been accused of adding skin-damaging steroids to their products and not listing it in the ingredients.-\n\nNever had any personal issues though. In the future I think I will just try and buy actual rosewater, which amazon doesn't seem to sell at a reasonable price. I will go to my local Farm boy grocery store to look.",
		  "Has a nice rosy scent to it and feels incredibly refreshing on the skin. I use it after washing my face (before moisturizing) and then after makeup application. I can't say it prolongs the life of my makeup any--I didn't notice any effects like that. However, it does make your skin look less powdery and more skin-like, and it feels really nice. The mist is nice and fine. It gives you a kind of glow, which I love.",
		  "Seriously, I'm in love with this stuff, I was so sick of paying so much for Mac's Fix+ and the setting sprays by urban decay, Glad this one is better for my skin and arrived so quick! decluttering my makeup and skincare items for the new year and I only want to use stuff thats a fair price for healthier skin and this is it. I dont have to look around and spend extra money that I dont have on setting sprays and facial mists that may or may not be the perfect one. This is it and I'll be repurchasing this whenever I run out. lives up to the hype, trust me.",
		  "Je suis une fan de ce genre de produit! (Truc de pro: vaporiser directement après les produits crème et tapoter tout le visage avec une éponge ensuite. Appliquez vos poudres par la suite et vaporiser à la toute fin pour la tenue du reste du maquillage. le teint sera PLUS QUE PARFAIT!!) Seul petit bémol avec celui-ci en particulier c'est le vaporisateur..... Oubliez la fine bruine délicate qui se dépose égale partout.... il fait de petits amas de liquide sur le visage très souvent.\nOdeur: ok on ne sent rien\nTonique: aide à l'hydratation avant la crème\nJe ne le rachèterais pas mais je suis contente de l'avoir découvert. Je suis maquilleuse professionnelle donc j'en essaie beaucoup. Un 10$ que je ne regrette pas, je l'utiliserai jusqu'à la fin mais je le changerai probablement de contenant pour avoir un meilleur vaporisateur.",
		  "Love, love, love this spray - fast delivery, great price, and love the smell. I have sensitive skin and I have never had any issues using this product - I mist this on heavily and frequently throughout the day - I swear it makes you look like you have perfect glowing skin - I even use this as a final step and refresher on my hair too. I’ll be buying this over and over.",
		  "This is the real deal.Use it daily..I use it as a setting spray as well as before I moisturize and it works great. It softens that cakey makeup look in my opinion from using it. It smells like roses and it's not too strongly scented. Love the price point as well..im sick of paying lotsa $$$ for Mac and UD Setting sprays and this one is very hydrating as well and works great on my sensitive skin. Would buy again!!",
		  "I use this spray as a daily moisturizer (along with an actual face cream on drier days) & it is lightweight, doesn’t have a strong smell, and it does not feel like I even sprayed anything on my face. I noticed it has also helped fade some of my acne scars & it has really made my skin look healthier and feel more refreshed.",
		  "BEST. THING. EVER!!! I cannot go a day without it. It's refreshing to use at night and in the morning. I have sensitive skin and it has helped reduce redness and oil in my T-Zone. Highly recommend in adding it to your daily skincare routine."
	   ],
	   "numberOfRates":144,
	   "avarageRate":4.614673065913738,
	   "id":186
	},
	{
	   "productTitle":"(2 Pack - 0.5mm / 1.0mm) Derma Roller Micro Needle Kit for Skin Care, Face Wrinkles, Body Cellulite Stretch Marks, 540 Titanium Microneedles for Acne Scars, Anti Aging Treatment, Hair Loss, Puffy Eye Bags, Blackheads, Facial Pores - Increases Absorption of Vitamin C Serum, 20% Serum, Hyaluronic Acid, Other SkinCare Products - Professional High Grade Beauty Massager DermaRoller Tool for Use on Large & Delicate Areas - Sealed & Sterilized",
	   "desc":"",
	   "category":31,
	   "images":[
		  "71f99kYwkwL._SY355_.jpg",
		  "71bC1oxkmtL._SY355_.jpg",
		  "71TC8jHHReL._SY355_.jpg",
		  "71Lxf3NaU2L._SY355_.jpg",
		  "71b0twPwgVL._SX355_.jpg",
		  "81J-oK5rzCL._SX355_.jpg",
		  "81iMYnEgMZL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"10.29",
	   "comments":[
		  "My skin improves significantly after using this. I used my favourite Hyloronic and Vitamin C Serum with 0.5 roller on my face roiling 4x each way crisscross directions avoiding the lower part of soft eye area 3 x a week. I also avoid make-up for a while just sunscreen when I go out when using the Derma roller. Rinse Roller after used in running water, soak in rubbing alcohol and air dry and I store it back to the case it came with.",
		  "It’s okay - good quality and packaging. You have to watch out and look closely at the needle alignment to see if there are any bends. I had one that was really out of alignment in the 1mm needles (in photo, reflects light differently, hard to capture in photo) and bent needles can damage your skin further.",
		  "Shipment was very quick and it was well packaged. I used it the first time yesterday. Although it didn't say this on the box, I looked it up and you are supposed to use the 0.5 mm on your face 1x every 3 weeks for the first month and then 1x a week. Since it provides great absorption for your creams/serums, it is recommended that you use natural products (free from sulphates & parabens).",
		  "First time dermaroller user! Ordered these after reading loads of reviews on several brands and also by comparing the needle sizes and matching them with my needs. (different sizes have different utility so be sure what you order)\nPackaging was good, the product feels good to hold, sturdy and well designed. The rollers roll smoothly (no issues with them getting stuck as I read in a few brands) The needles are even sized (no needle longer than others leading to any issue; again, I had read some such reports on a few other brands)\nThe needles are made with titanium which is supposedly better than steel, that is good to know. Also, both the rollers were packed in a seemingly-sterile package (It didnt really say thet they have been sterilized though) and I would recommend cleaning them by dipping in rubbing alcohol (the plastic cases for dermarollers could easily be used for this purpose)\nI have used it on my face (yes, both sizes) and I feel fine I could only sense a little tingling but no rashes etc.\nI want to see how long the rollers last before I need to replace them.",
		  "I recently bought this product and received it within 3 days I believe... Pretty fast for standard delivery. They come in a box, inside the rollers are packed separately on a plastic bag. They both also come with an individual clear container to keep them store which is very nice. So far I have only use the 0.5 for my face. The instructions for use are on the box but you can also Google them. It's super easy to use, and can barely feel any pain. My skin was slightly red right after using it, but I applied a vitamin C serum that I purchased from Amazon as well. Overall, I'm very happy withmy purchase and recommend this product 100%",
		  "These are such a pretty rose gold colour, good quality, and come with really nice storage containers to keep them sanitary! Was very happy with my purchase. I have been using the 0.5 on my face after cleansing and before applying a serum before bed. The serum absorbs so nicely and I am starting to notice improvement in my melisma around my mouth! Would recommend this product to friends and family.",
		  "I did a lot of researching before finally deciding on this product. I like that you got one for face and one for body and that they come in handy cases. I've only used the rollers once a week for the last 3 weeks so results have been hard to tell because it could be products I'm using too. My skin seems smoother esp. on cheeks. It's true though when they say that rolling over acne you can't see under the skin could pass on bacteria to other areas so I've stopped rolling my chin as that's where I get most spots. After use, I spray with alcohol and let them sit for a few minutes before rinsing and air drying. This is a good tool to add to my skin care regimen!",
		  "I like the product....nicely packaged and high quality! I will continue to use Derma Roller. It is effective and I am already getting compliments how my face is glowing,,,in only a matter of using this twice.\n\nJeremy,\n\nLets hope Patrick finds a nice old lady to hug and possible give kisses too. I think maybe Albert would take a shot of tequila,,,,irregardless of a review...:)\n\nThank you for the smile and great product!"
	   ],
	   "numberOfRates":185,
	   "avarageRate":4.253011321431083,
	   "id":187
	},
	{
	   "productTitle":"Live Clean Baby Gentle Moisture Tearless Shampoo & Wash, Baby Soap, 750 mL",
	   "desc":"Live Clean Baby Gentle Moisture Tearless Shampoo & Wash is a mild, tear-free formula.It gently cleanses, leaving baby's skin and hair feeling soft. Our formulas are enriched with Organic Botanicals of Chamomile, Lavender and Aloe, this unique formula rinses clean with a gentle scent to soothe baby.",
	   "category":31,
	   "images":[
		  "51OW37xeWsL._SX679_.jpg",
		  "51r2Bry0dcL._SX679_.jpg",
		  "71ED4L01aTL._SX679_.jpg",
		  "71pGLwhndQL._SX679_.jpg",
		  "71DUB1zY42L._SX679_.jpg",
		  "61wSLYNvQFL._SX679_.jpg",
		  "71u1uZESN5L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"10.98",
	   "comments":[
		  "I buy Live Clean products all the time. My pre-schooler uses LC shampoo and lotion. It smells nice, but not too scented. Serves the purpose to keep him clean. I like the big container because it lasts forever. I have tried a few times to make a bubble bath out of this, and you have to use a fair amount, but it works and smells nice. The Amazon price is pretty decent. Superstore may be slightly cheaper if it goes on sale, which doesn't happen very often. I would recommend going with the non-lavender scented ones, though. The lavender one is still fairly gentle, but I am not a big fan of overly-scented items.",
		  "So glad I switched from Johnsons. Not only is this stuff 97% natural but it has stopped my baby's scalp and face from flaking and clearly provides more moisture than what I was using before. It smells heavenly and leaves baby feeling soft. Highly recommend.",
		  "Excellent product, i gave only 1 star because pump part was not properly closed allowing soap to leak, the clear soap is not as easy to see the leak. Not happy about the mess to clean when i open this bag, some even leaked out of the bag its in and the same situation with the other bottle in the box. No easy way to contact seller about this either(ie contact seller link). If it happens again ill cancel my subscription and just buy it at walmart.",
		  "This is the only baby shampoo I use because I don’t trust any other brand. It also doesn’t dry out my kids skin! It doesn’t leave soap residue on their skin either. And its natural ingredients.",
		  "Its a great product!\nThere is no overwhelming smell!\nI like that it is eco-friendly but still does a great job cleaning.\nGreat product for babies and toddlers!\nRecommend!",
		  "One of the best natural baby soap in my opinion. Love this brand in general. Their products smell great and don't harm the skin as some other brands do. Also, a little goes a long way and the price is excellent.",
		  "Love the natural ingredients. Worth the $. Great for kids. The bubbles do not last super long in a bath but that is normal for natural products. I recommend.",
		  "Love the smell. I've been using it on my kids for years. I like that I can use it on both hair and body."
	   ],
	   "numberOfRates":21,
	   "avarageRate":4.4426092167531905,
	   "id":188
	},
	{
	   "productTitle":"Jojoba Oil by Leven Rose, Pure Cold Pressed Natural Unrefined Moisturizer for Skin Hair and Nails 4 oz",
	   "desc":"",
	   "category":32,
	   "images":[
		  "81BINcr4vQL._SY355_.jpg",
		  "718m6fC3mtL._SY355_.jpg",
		  "710JZa1CbaL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"19.37",
	   "comments":[
		  "I'm very pleased with this oil! I have been using it as a face moisturizer (with a few drops of essential oils mixed in) for about 3 weeks now, and my skin has significantly improved (I noticed improvements less than a week in). I was a bit nervous to rub pure oil on my face, as I have been prone to blemishes and hormonal jawline acne, and my skin is that oily/dry combo. But it has not caused any breakouts, and actually, I don't even think I've had a zit since I started using it. That could be coincidence of course, ha. My skin is softer, more dewy and way less blotchy, dull and stressed looking. My mineral powder foundation goes on so much nicer now! I've also been using it in my hair, just a couple drops on the ends before or after drying, and my hair looks and feels softer and healthier as well. I did not expect such positive and quick results on both face and hair. I also use it as my carrier oil for essential oils and it's great! Apparently jojoba is the oil for me! Thanks Leven Rose! I'll definitely be reordering, though a little goes a long way and I think the bottle will last quite a while.",
		  "This is my first time buying Jojoba oil. I bought it after my hair started to thin and my husband was helping me with some research and people recommended using Jojoba oil.\nI've actually just started using it for a few other things instead. Mainly I use it as a make up remover and my skin has never looked better (all the little dry spots I suffered from around my mouth and the sides of my nose are gone). I also would mix it with essential oils to apply topically.",
		  "At first I have doubts about putting oils on my body but since winter times are extremely dry in Winnipeg, I just had to try this... And oh boy, did it work for me! I apply a small amount after I shower and it dries fast and no icky oily residue left. I also add Vaseline Intensive care lotion on top and it works wonders! My extremely dry skin is gone and what comes is soft and replenished skin!",
		  "amazing product! I've probably ordered this product 5-6 times now. I've done some research and found out that jojoba oil helps balance pH and hence, oiliness. I find that when I don't use this product, my face tends to get oily really fast and a loooot. When I do use it, my face still oils up BUT not as quick and not as much! it works! Does it work for acne/pimple scars? I'm a little iffy.... it has lessen the colour of my scars but it def took awhile. I would still recommend this product!",
		  "From what I’ve seen so far on the little I’ve used, my dry hands have noticeably improved. The dropper makes it much easier to apply to the desired area as well. I’ve also observed that my skin absorbed it quite well with no greasy feeling afterwards. I would recommend. Best value for your money hands down.",
		  "Great oil. I was using it on a cotton pad to remove make-up originally and then as a face moisturizer. I found the cotton pad was soaking up way to much oil and was going through the product crazy fast. I switched to rubbing it on with my fingers as a moisturizer with some essential oils in it and it works amazing. Customer service is very helpful. They followed up to see if I was liking the product and had some tips. Will be ordering again!",
		  "My husband said to update my review to say just how amazing this is for his tattoo! The scabs are soft and the skin is supple and not dry, crusty, or flaking like his previous tattoos. He went back to a regular aveeno moisturizer for a few hours and felt the difference! He says the oil has made his healing process way easier and more comfortable!\n\nBeen using for a week alongside raw african black soap and already my skin is softer, clearer, and less flaky! My acne and any scratches or cuts seem to heal and close up with skin (not scabby blood) overnight! I've been using it to moisturize my pregnant belly and breasts and they feel so soft and soothed. I am hoping it will prevent some stretch marks. My husband has been using it on a fresh tattoo and tells me it is the fastest he has ever had a tattoo heal (this is his 8th) and the most comfortable healing process. It absorbs nicely so I can use it under makeup no problem, has a mild olive-oily type scent. Overall very happy with the product. My only complaint would be that the dropper with the bottle doesn't work well, it drips whether you squeeze it or not, and doesn't hold the product in, causing some mess and waste.",
		  "I love jojoba oil! I use it on my face at night and mix it with my body lotion - it always leaves my skin soft and makes it glows...in fact, ever since I started using it, I haven’t had a breakout on my face. I also add a few drops to my newborn’s scalp to help treat his dry scalp/cradle cap. Works like a charm in clearing it up and I don’t need to worry about any harsh chemicals coming in contact with his sensitive skin. The dropper also makes dispensing the oil super easy with no mess or spillage, which was always my biggest problem with other bottles I had purchase from the drugstore. Will definitely be buying again!"
	   ],
	   "numberOfRates":8,
	   "avarageRate":2.5550514561671136,
	   "id":189
	},
	{
	   "productTitle":"Cosrx (3 pack) cosrx acne pimple master patch, 0.27 pounds",
	   "desc":"",
	   "category":32,
	   "images":[
		  "51-5vRGfRXL._SX679_.jpg",
		  "41bOAcXCY8L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"16.50",
	   "comments":[
		  "I tried these as a desperate attempt to clear a recent acne problem. I am happy to say that they work as promised. I find that they work faster on popped pimples and when used overnight. However, I have used during the day (when I am not going anywhere important as they are not invisible) and on more cystic acne. It certainly cuts down healing time, helps you resist the urge to pick and limits redness. I wish they would create one that covered your whole face. I would suggest buying them in bulk if you get a lot of acne. Once you stop using them you won't want to stop and the expiry is about 3 years.",
		  "These are amazing! They do their job perfectly and it's oddly satisfying to see the patch turn white as it draws out all the gunk inside. They only work if the pimple has come to head or if you've already popped it. If it's a deeper cystic pimple this isn't going to solve anything, but I've also used them as protective coverings since I like to touch my face a lot and it helps keep that spot covered. They don't come off when I sleep, which is an issue I've had with other brands and I will definitely repurchase.",
		  "Great price compared to a lot of other brands that have the exact same product. They stay on forever and do their job. Very handy if you have an open zit that needs to be contained (aka not get bacteria on the skin around it, potentially causing more breakouts). These work really well creating an occlusive barrier that draws out the gunk from spots making the healing time faster. I will say, these won't do anything if you just have a little red spot that hasn't developed a \"head\" yet, the spot has to be active/open in order for the patch to do its job. Just be careful not to damage your skin by picking at your spots, let them develop on their own and when you can see that it's become active, apply the patch overnight.",
		  "These work fantastic! I get horrible, painful, deep cystic acne on my face and neck. Puncture the cyst with a pin, slap one of these on, and in the morning the entire nasty pus cyst is drawn out onto the sticky pad and into an easily removable whitehead. Beauty lifesaver!",
		  "I have cystic acne, and these helps tremendously. If your pimple is ''popped'' or broken, you just stick it on and wait for it to do its magic. It will suck all the gunk out of your skin in no time. Some use it after lancing a pimple, but I personnally don't like this method. I will keep it on all night and it stays put; it has excellent sticking power. I've also worn it during the day at times, and it's not incredibly noticeable while obviously still being visible. I would not advise to use makeup on top of it, it looks bulky and weird. The only downside is that I wish it came in bigger packages, but at the price it's still affordable. If you hesitate, don't, buy one and see for yourself. This has been a cult favourite for a while and I don't see myself ever living without them!!!",
		  "I have pretty bad acne and was hoping for something that would make a significant difference in healing time. I bought these patches base on the many good reviews. I used them several times and what I noticed was that on pimples that have come to a white head, they do suck a little bit of the stuff out, but not a significant amount. Some of the reviews mentioned piercing the pimple before placing the patch and I did that but it didnt make a differnence. I will not be purchasing them again.",
		  "An absolutely amazing product, COSRX never disappoints and arrived very quickly! This definitely works on popped pimples better than unpopped pimples (they don't absorb the nasty pimple puss if unpopped), but I do believe their instruction video somewhere also indicates this anyway. Pop or no pop the patch still works for me, the unpopped pimples were significantly smaller and shrinking overnight, while the popped one almost completely disappears the next day with little to no irritation.\n\nI wish they had a version where they had the same formula but for a face mask or something, that way I don't have to stick 10+ patches on my face which actually kind of looks pretty scary.",
		  "I don't get breakouts often but when I get one or two pimples, I ALWAYS use these. They don't necessarily shrink my pimples right away but they help keep the pimples under control, prevents bacteria from making the pimples worse, and clears my skin after a few days. I like these because they prevent me from popping my pimples and leaving scars."
	   ],
	   "numberOfRates":181,
	   "avarageRate":3.988883329581578,
	   "id":190
	},
	{
	   "productTitle":"Mario Badescu Drying Lotion, 1 fl. oz.",
	   "desc":"",
	   "category":31,
	   "images":[
		  "71WGwP2HfGL._SY679_.jpg",
		  "71QZ0Dc5KKL._SY679_.jpg",
		  "71HcDr0u15L._SY679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"22.70",
	   "priceIs":"21.00",
	   "comments":[
		  "Since I turned 40 years old three years ago I have suffered with really bad cystic acne. So bad I couldn't leave the house. I tried EVERYTHING. I had been on Vyvanse for ADHD for several years. I looked like I belonged on The Faces of Meth. I quit the med cold turkey. 6 weeks later I had my face back. I am still off meds, but my good luck only lasted 3 months. Last week I woke up and my entire face was COVERED in red bumps. My forehead alone made me cry. I had nothing left to try. I got on to Amazon and found this product. I have used 90% isopropyl on my face & calamine lotion as well, so I wasn't sure if this would work. But I was desperate. It arrived the following day. The first few times I applied with a q-tip. I pulled half of the cotton off cuz I didn't want to waste it. I wasn't getting the coverage I wanted, and I had A LOT to cover. So I took an eyedropper and sucked up the sediment and gently squeezed the bulb of the eyedropper over my entire face. I rubbed it into my face each time with clean fingers. I went to bed. When I woke up I couldn't believe it. The bumps had all gone down and the redness was GONE. I still have tiny little scabs, but they aren't swollen, they no longer hurt and you can't really see them with the redness gone. I am SO grateful I stumbled on this. I read tons of reviews and as always there were lots of negative reviews. There always is. Not every product works for everyone. Lucky for me it did an incredible job!!! It's well worth the $20 to try it. I highly recommend giving it a chance.",
		  "I love this drying lotion!\nPreviously I had used drying masks and would leave them on at night, but I often found that they weren't doing anything to my acne. They would only dry out my skin.However, after reading many reviews and finally deciding to try the Mario Badescu Drying Lotion, I love it!\nNo product is perfect, so it doesn't always get rid of every single pimple overnight as some claim. Yet, after some trial and error, I found that it works amazing when you apply tea tree oil to the pimples (with a clean face) and after apply the drying lotion.\nThe results of this lotion? It will dry out your white heads quickly (probably 1-3 days) and for bigger pimples, it will speed up the healing process.\nSimply because of using this product, my skin has improved tremendously! Thank you so much Mario Badescu!",
		  "I've heard a lot of people rave about this product and unfortunately it didn't live up to the hype.\n\nI found that it crumbled off my face in the night and ended up all over my pillowcase. It barely dried out my blemishes.\n\nIf you are considering purchasing this product, I would first try using hydrocolloid bandages, which I find to be more effective in pulling the impurities from deep within the blemish resulting in a shorter healing time.",
		  "do not shake - use once pink settles at bottom and apply with cotton swab. it didn't clear my acne at all but i think my acne must be immortal, so it's not this product's fault. anyway, it kind of of stings and eventually starts flaking.. im not sure how others keep their pillow/hair flake free when using this but i haven't found the trick yet..",
		  "There has been so many reviews on this product being amazing. While I do like it and use it, I don’t believe a pimple will disappear the next day with it. It would not be mixed rather stick a q tip into reach pink and dab. Very fast shipping and well packaged.",
		  "I’m pretty lazy about skin care and beauty routines, I get occasional pimples and they tend to stay red and inflamed without developing a head for most of their lives, so the pimple patches don’t help me much but this product really helps move them along, doesn’t irritate my skin, and is super easy to apply. Went through one bottle over about 1 year and have re-ordered it!",
		  "I had previously used the Kate Somerville Eradikate spot treatment that is very similar to this one. There is a bit of a difference. The kate Somerville one is a bit more effective and doesn’t flake off quite as easily. I recommend trying the Mario Badescu drying lotion, but if you can afford it, buy Kate Somerville.",
		  "The jury is out... on one hand it seemed like I had some drying, but on the other I had zero changes. I think perhaps this is targeted towards pus pimples... little bumpy hormonal under the skin pimples not so much. I have preteens... I suspect this product will become more valuable as time passes!"
	   ],
	   "numberOfRates":98,
	   "avarageRate":2.8626969658560237,
	   "id":191
	},
	{
	   "productTitle":"Blackhead Remover, UBITREE 4-in-1 Beauty Suction, Rechargeable Led Facial Pores Cleaner, Deep Cleaning Comedo Suction Extractor with 4 Beauty Probes",
	   "desc":"Big Hole Head: It has stronger suction, which is suitable for stubborn blackhead. And can also work for firming and lifting your skin.Small Hole Head: Remove blackhead, it has weaker suction, which is suitable for sensitive skin; Or remove blackhead at the unreachable area.Oval Hole Head: Reduce micro wrinkle on the corner of eyes, making your skin smooth and tightened.",
	   "category":32,
	   "images":[
		  "61H4ZBoI0iL._SX679_.jpg",
		  "5138XAdmhSL._SX679_.jpg",
		  "51YkcJsl-NL.jpg",
		  "61hJWUR5bfL._SX679_.jpg",
		  "61GFXYLYQpL._SX679_.jpg",
		  "61ETTbsPiGL._SX679_.jpg",
		  "51bs6Zf2G5L._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"30.99",
	   "comments":[
		  "Following the instructions, I used this on my boyfriend before myself - because he can hide his face with a beard, and makeup is expensive...\n\nIt cleared his pores SO well!\nBlackheads that were honestly nasty, and big, and just there since probably high school (we're in our mid-late 20s for perspective's sake), were just BOOM! sucked up into this bad boy!\n\nThe only downside is that we didn't know he had sensitive skin, and uh, we were rather eager to see how it worked.. Meaning the poor guy was a little on the bruised side for a few days....\n\nHis family and friends said they could notice a difference immediately!\n\nConsidering he works in a restaurant kitchen, where there is sweat, heat, grease, and just so much gunk to ruin one's face - he's in love!\n\nAs for me?\nI'm addicted to doing my own, however I have to keep reminding myself to not \"over do it\" to ensure I don't get bruised.\nI'm such a picker, but this has allowed me to literally suck it up instead!\n\nSo easy to clean too!!!\n\nAnd, for what it matters, it came with a charge as well, so I didn't have to wait a few hours for it to fully charge like I thought I would.\n\nABSOLUTELY recommend to anyone with any level of breakouts or if they're prone to pick.\n\n(I may or may not have misused this item, and used it on my legs, and it managed to help clear up ingrown hairs from shaving/waxing, way faster than compresses or traditional gouging them out...)",
		  "I was very skeptical to buy this product. However now that I have it is a game-changer, I use it primarily on my nose cuz the rest of my face is very clear and it clears out blackheads and all the crap there. I have either a hot bath or shower and then I go and use it on my nose it does take after a couple uses to get everything out is not going to pull it out in one go but I highly recommend this if somebody's looking to clear up acne.",
		  "It works. It has great suction and does remove blackheads. I tried different heads, different strength settings, different filters, and it was fully charged. Seems like a charming.It feels like it is made very well and the suction is where can pull the blackheads out of my pores which should be so easy especially after taking hot shower.",
		  "This product is very useful for people having acne and blackheads. It’s been like 2weeks and I have started seeing results. There are various options and sizes of the remover which is the cool feature of it and very easy to use.",
		  "Overall it's a really good product. The box it came in doesn't feel like cheap plastic, but a nice hard cover box. The items themselves felt like good quality too.\n\nI mainly bought it because I get a lot of blackheads on my nose. I usually use nose strips to pull them out but this blackhead remover is so much easier and faster to use. Plus it comes with different attachments for different purposes. I tried using the main one and surprisingly enough it sucked out almost all of the black heads there by just using 3/4 of the suction. I went to Max and it pulled everything out. It's very easy to use and the instruction manual basically tells you everything you need to know about how to use it and for what applications.\n\nMy nose feels very smooth and looks a lot cleaner. I'd suggest taking a hot shower or even a hot towel over the face to open up the pores so it's a lot easier to pull out the blackheads.",
		  "love this product. use it once a week, my skin is significantly cleaner now!",
		  "Really wasn't expecting this to work very well but was pleasantly surprised it cleaned out the pores really well. Just make sure to read the advice on how to use it because I can see it easily causing redness or even bruising if used incorrectly",
		  "Sucking black head instrument super invincible easy to use, can suck out a lot of white things, feeling nose super dirty"
	   ],
	   "numberOfRates":162,
	   "avarageRate":4.23529865441035,
	   "id":192
	},
	{
	   "productTitle":"Cetaphil Gentle Skin Cleanser 500ml",
	   "desc":"",
	   "category":31,
	   "images":[
		  "71XYauUComL._SY879_.jpg",
		  "411N5%2B46e3L.jpg",
		  "61AkQJoosJL._SX679_.jpg",
		  "31mpjnjxuwL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"16.98",
	   "priceIs":"13.97",
	   "comments":[
		  "I just moved into my own place a year ago and just recently started putting more effort into taking care of myself. I grew with the message that products like these are for women only and guys do not need it but that is not the case. Also, what I found out is that taking care of yourself improves your self-esteem which is a benefit I would like to have.\n\nI was just washing my face with a bar of soap in the morning and that was it. I was still breaking out and it was much better than before but I started thinking their is probably a better way to wash your face with a better product as well. I googled face washing (sounds pretty ridiculous). AskMen had an article devoted to face washing for guys. They recommended several products for using daily on your face. This was one of them. I have never heard of this product but it has good reveiws on amazon and the AskMen article spoke highly of it so I decided to go ahead and buy it. This is also recommended for people with sensitive skin which is great as well.\n\nThe 500mL bottle is quite big and it will last you quite some time. I also found out that this product is a bit cheaper on amazon than it is in shoppers drug-mart which is nice. The smell itself is subtle and not over powering. As for the results: I would say it is working. It is subtle but I see the results. My skin is a bit more clearer and the colour itself is a little bit lighter (if that makes sense). Today I was waiting to get into the office and there were mirrors in the lobby and I was looking at myself and I was quite happy with my appearance especially my face. I would say it is slightly helping with my self esteem. I have not had any major breakouts either but if I do have any negative effects with this product then I will update my review.",
		  "The product is meant for overly dry or sensitive skin. As a result, it's cleansing power is somewhat weaker compared to other traditional cleansers. If you're just using this as a face wash and you don't constantly get your face painted or you don't work in the sulfur and coal mines of Africa, it should be fine for you.",
		  "This is my first time using this cleanser after having it recommended to me by a doctor because I have sensitive skin. I was surprised that it has a gel-like consistency. And you can even use it without water (I haven't tried it yet though) and it claims to remove makeup (haven't tried it yet either). It's soap-free, so it doesn't foam/bubble. The great thing is that it leaves my skin soft after. Usually after I use a foam cleanser, it makes my face feel tight and dry, but never with this. It feels like I already have a layer of thin lotion on. I love it enough within the first few weeks that I've already purchased a larger bottle.",
		  "The consistency of this threw me off for a moment, but don't let that deter you! It is a milky, soapy, lotiony looking consistency, which is a bit strange at first, but it works so well! It removes makeup with ease, and it cleans my skin so gently - this is the product I never knew I needed!\n\nBefore trying this, I was using a cleanser that was stripping the moisture from my skin and leaving me dry, itchy, and irritated. I thought maybe my moisturizer wasn't cutting it, or it was just the cold/windy/Canadian winter days that was drying me out. Since switching to this cleanser, I haven't had that tight, dry, itchy sensation once. Not to mention all my blemishes have cleared up and I haven't had anymore since! (I was having quite the breakout situation when I started using this)\n\n10/10 would rave about to family and friends, 11/10 am buying again when I run out!",
		  "Cetaphyl has a strange, kind of waxy texture, that seems to cling to your skin whether you use it wet in the shower or dry on a cotton pad. It does remove every bit of makeup, and once you dry your face, the clinginess completely disappears, and all is left is clean, soft skin.\nI have been using this product for a month, and ever since I got it I have not experienced any dry patches on my cheeks nor any acne. The T-Zone is still there, because no product will ever change your nature, peoples, but much less oilier than usual. I'm very, very happy and will buy again.",
		  "After using this product my face feels very nice, and I feel it helps abit with my acne. Not a lot, but helps with redness, and feeling cleaner. I would buy this again, over the years, I have tried many acne products, but was left very disappointed, or even made it worst.. This just feels good, and does not flare it up..",
		  "I was excited to use this because this is one of those products I've only ever heard good things about. I'd been using the lotion and had no complaints.\n\nThe bottom line is that the \"soap-free\" part of this product's description should be taken seriously. It does not lather up and I found that it won't clean anything off your face, including mild makeup. It should be used just as a mild cleanser when there isn't anything visible to remove.\n\nI tried it again yesterday after removing makeup. I found my very poor makeup wipe (that's another story) smeared around some of my eye makeup instead of removing it all but I figured that at that point, the cleanser could just wipe off what was left. Please note that I do not wear waterproof makeup or anything too heavy, just light coverage foundation, liquid eyeliner, and mascara. This is all makeup that my previous cleanser could take off easily (I would be able to see the colour from my foundation mixing with the cleanser as it came off). In the end, this cleanser did not even manage to smeare the leftover makeup around. It just slid over my face and the leftover makeup. If it's sliding over visible material on my face, is it taking anything off, when I want daily diet to come off?\n\nLesson learned. I shouldn't have tried something new when the product I was using was perfectly fine. I thought I'd see what all the hype was about. I'll stick to my Olay cleanser (the foaming one and very highly recommended if anyone is looking for something with a little more power without being harsh). If it ain't broke don't fix it."
	   ],
	   "numberOfRates":8,
	   "avarageRate":2.0956517163143786,
	   "id":193
	},
	{
	   "productTitle":"Millenium Tanning New Solid Black Bronzer Tanning Bed Lotion, 100x, 13.5-Ounce",
	   "desc":"",
	   "category":32,
	   "images":[
		  "81SAmK6SBXL._SY879_.jpg",
		  "81C1cApzyRL._SY879_.jpg",
		  "71X%2BriTu7AL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"24.95",
	   "comments":[
		  "Awesome stuff. Make sure you rub in thoroughly, and don't get wet right away. I always wash my hands after use. This stuff smells so good and gives you great colour! Noticeable after one use. Will be buying again. Results will vary but this is after two uses and I'm normally fair to medium tone",
		  "Amazing! I bought and used this lotion for the first time today. I applied it with an application mitt after exfoliating and showering and then went off to my first tanning session of the summer, after spending it until now indoors working. WOW what a difference one application and tanning session made to my pasty white skin. I came home and my mother asked me \"how did you get so dark after just one tan?\" And my sister agreed, saying I had a nice tan, like I had been out by the pool for the day. I highly recommend this stuff! Mild, pleasant smell, no sticky residue and definitely does what it claims to do.",
		  "been using tanning beds for almost a year now.. never liked my tanning lotions I felt they worked really slow.. this tanning lotion made me noticibly darker first time use! I love this will buy more. I'm still going to give this 5 stars but only thing is you have to really make sure you rub in completely I ended up with a blotchy spot on my arm. But with proper application this stuff is gold!! Love love love! If your a first time tanner take it easy this stuff is strong. Could burn your skin if not careful!",
		  "The smell is light and fresh, not overpowering at all. The lotion goes on really smooth, so a little goes a long way. It does have bronzer in it, but I have never had staining on my hands or in dryer areas (elbows, knees) etc. from using this lotion. I would definitely by this lotion again.",
		  "HORRIBLE ! Every bad review for this product is accurate. It’s streaky , leaves you with patches of orange where it seems to have clinged to during application. I took my time with this product and made sure I spread it evenly and didn’t over do it and still it was patch and it made me look orange rather than a natural tan. 3 days and about 6 showers later and I still have patches on my body from it. The only plus side is the scent is really nice. Other than that it’s a waste of money.",
		  "This lotion is worth the money. You get really nice and dark. I even noticed some change in the first application. However I couldn't give it a full 5 stars because I found the smell a little too strong like perfume for my liking. A quick shower fixes that solution, but I feel self conscious that the smell is so strong when out afterwards in public and thats what people smell on me. Also make sure to wash your hands after since it does stain the hands if not washed afterwards. ( Minor staining). Can't go wrong with the price it does what it needs.",
		  "I have used many tanning lotions as I tend to get very pale in the winter but using this product for the past few months has shown better results even after a single use than most products I've tried. This is one of the cheapest lotions I've bought so I didnt expect much but it has definately exceeded my expectations! I typically apply the lotion before leaving to the tanning salon so that I can wash my hands and gives time for the lotion to set in. I roughly go for a tan once every 1-2 weeks and this lotion has helped maintain my tan and yeild a nice colour. Would definately recommend giving this product a try!",
		  "Good product!! I definitely noticed a difference using this product. I would not have gotten as dark as quickly without using this lotion. I didn't use it every tan as I found the bronzers were pretty intense. Definitely wash your hands thoroughly after applying. I didn't notice any streaks after applying either."
	   ],
	   "numberOfRates":197,
	   "avarageRate":5.352224430300254,
	   "id":194
	},
	{
	   "productTitle":"USDA Organic Jojoba Oil, 100% Pure (120ml Large) | Natural Cold Pressed Unrefined Hexane Free Oil for Hair, Face, Nails & Cuticles | Carrier Oil - Certified Organic | Cliganic 90 Days Warranty",
	   "desc":"Cliganic 100% Pure Organic Jojoba Oil is cold pressed, unrefined and all natural, making it the ultimate treatment for dry skin and hair. Often referred to as nature’s moisturizer for its ability to mimic the skin’s sebum, our virgin jojoba oil contains vitamins and minerals essential for healthy skin and hair, including vitamin E, B-complex. Its anti-bacterial, anti-inflammatory and non-toxic properties make it a powerhouse multi-purpose oil. Chemical free and fast absorbing, it’s gentle enough to be used on even the most sensitive skin.Included in this product:Only One Ingredient: Our premium Jojoba Oil is 100% Pure & Natural – No Additives, No Chemicals, No Alcohol, No Fragrance and Not Diluted.",
	   "category":31,
	   "images":[
		  "71eV%2BX531cL._SX679_.jpg",
		  "615O5D5qmUL._SY879_.jpg",
		  "71q0FJIxL5L._SY879_.jpg",
		  "71ikg15VYdL._SY879_.jpg",
		  "71ZcjHLwqML._SY879_.jpg",
		  "71I%2B3qz5moL._SX679_.jpg",
		  "41wG-vz0JeL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"16.95",
	   "comments":[
		  "Huge bottle of jojoba oil! I use it for everything: cuticle oil multiple times a day, lip moisturizer, put on a layer at night before sleeping to lock in my skin care, to moisturizer my elbows and knees! I’ll probably mix it in with my body moisturizer or use it as a body moisturizer.\nOnly reason I took off one star is because the dropper it comes with doesn’t hold the product in and it can drip everywhere.",
		  "Arrived on time and was very impressed with the packaging. The oil was solidified when it arrived due to our cold Canadian weather, but soon returned to liquid once left out at room temperature (nice way of proving that it's the real thing). Love the fact that both the bottle and dropper are glass! Only giving it a four star, because it's too early to tell how well it works, but I use it on my scalp, skin and face.",
		  "It was a really cold winter and no moisturizer was working on my face. I did some research on oils and decided to try out jojoba oil. After a day or two of use, my skin felt a million times better! I stopped using moisturizing creams. Make sure to apply on damp skin or it doesn't work as well. You can even use it before you apply makeup -- use a few drops and let it sink into your skin. It helps makeup look much smoother. I've been using it everyday for a few weeks and I've barely put a dent in the bottle. I highly recommend!",
		  "This arrived promptly and was exactly as pictured. For those of you who are not familiar with this scent, don't expect something flowery; the scent is actually very subtle and almost smells like dried pasta. It it a very useful oil when making skin care products as rosehip is known to help with improving the tone and texture of skin and also is amazing for your hair.",
		  "I use this jojoba oil for my finger and toes. The oil has antibacterial and fungal properties which is great as my cuticle are often dry in the winter and I get hang nails. I also get ingrown and so I use this oil to moisturize and prevent infection. The oil doesn't have a fragrance. The product came in a nice glass bottle with a pipette that works well and easily dispenses the oil.",
		  "love the pump bottle and quantity. i rather buy a large bulk bottle instead of a million little tiny bottles and this way i am saving money. thank you to this brand for offering a bulk bottle!. i use this in my hair and beard and it works perfectly. it’s okay for skin but i prefer other products for my skin needs. also useful on lips too.",
		  "I love jojoba oil for my skin and this one is really nice for that, also it has little to no smell unlike the one I was using before which I like. The only issue is, my dropped came cracked and broken because the way it was packaged in the box. It was in a little bubble wrap baggie but since the bottle isn't fixed, it probably rolled around and broke it.",
		  "On my 4th bottle - This stuff is just amazing, it's pure, it's authentic, and high quality. I use it to mix other essential oils with it, I also use it as a moisturizer and it works great! I love how it's odorless as well, highly recommended!"
	   ],
	   "numberOfRates":62,
	   "avarageRate":0.6561072762100308,
	   "id":195
	},
	{
	   "productTitle":"Garnier Micellar All-in-1 Waterproof Make-Up Cleansing Water for All Skin Types Including Sensitive. Gentle Makeup Remover, 400ml",
	   "desc":"",
	   "category":31,
	   "images":[
		  "61rGNIOL9QL._SX679_.jpg",
		  "81aCHpzYoIL._SX679_.jpg",
		  "81zf33fX2GL._SX679_.jpg",
		  "819FhsVLCHL._SX679_.jpg",
		  "81EDPWrb7jL._SX679_.jpg",
		  "81ggwZpApmL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"7.99",
	   "comments":[
		  "I kept hearing about micellar water so I decided to give it a try. So far I've been fairly disappointed. It doesn't do a great job at removing makeup or cleansing your face as some people use it for. I found that my cleansing oil did a much better job at removing makeup, especially mascara.\n\nWhen I used it to cleanse my face without rinsing it left an oily residue on my face but also left my face dry. My skin also has been irritated after using it even though it's supposed to be good for sensitive skin. There's no way I'm leaving this on my face without rinsing or cleansing afterwards before my skincare routine. I don't usually have issues with skincare products either. I would recommend trying one of the smaller travel sizes to see if this works for you before you purchase this large size.",
		  "Saw it in sale on Amazon, bought it right a way :) because mine is almost done.\nI bought the one with the blue cap. My skin is very sensible and it's my first choice of product when it comes to remove my makeup (first step).\nEasy to use. No oil (because I have lashes extensions). Not harsh for my skin. Cheaper compare to other brand like (e.g Bioderma).",
		  "Pretty sure I recieved a knock off. Label was not straight. Made me break out in little blisters after a week of use, I'm still trying to get my skin back to normal, I Tossed it immediately. I have heard amazing things about this product but would highly recommend just going to the local drug store to get it.",
		  "This product is amazing and it does exactly what it says it does. It removes all traces of makeup and dirt, including waterproof makeup, and lash glue residue. I would compare this product to Lancôme’s waterproof make up remover, as it is very similar in every sense. It is necessary to shake the bottle before use, other wise it leaves a slightly greasy residue on skin. I have dry skin, which gets even drier during extreme temperatures fluctuations. This product does not dry my skin out. There are some no-Rinse cleansers that leave my skin feeling parched and almost cardboard-like. This is not one of them. Since my skin is so dry it is crucial that I moisturize after using any cleanser, BUT if I don’t moisturize after using THIS micellar water my skin will not have that uncomfortably dry feeling.",
		  "I have never used micellar water before so don't have anything to compare against but I absolutely love this stuff. It removes waterproof mascara with no effort whatsoever. It's extremely gentle on my skin and leaves my face feeling really soft. It's better than toner... it's better than makeup remover. I use it even when I'm not wearing any makeup just because I love how it feels on my skin. Very refreshing and does not leave my skin dry like toner does. Would highly and definitely recommend this to anyone. Very little goes a long way.",
		  "The product removes eyeliner well enough, and it's alright with lipstick, but come hell or high water, my mascara stays on. No amount of saturation of the cotton pad or rubbing/wiping removes my mascara with ease. I usually press my lashes against the pad before wiping - doesn't help at all. Taking my mascara off at night is a nightmare, and I usually have to use two pads before it's been wiped off enough for me to rest easy. Even then, I'll always find traces of mascara on my lashes in the morning. Good on my mascara though, but seriously.",
		  "Je ne peux plus me passer de ce produit! Il me démaquille tout en douceur, ne chauffe pas les yeux et n'irrite pas ma peau qui est ultra sensible! Il laisse une petite couche hydratante sur ma peau qui la rend radieuse et confortable, et pas trop grasse donc le maquillage tiens bien quand je l'utilise au matin avant mon make up. J'adore, et prix très raisonnable! Me démaquiller les yeux est devenu une routine agréable!",
		  "I love that there's no greasy mess. It's just like washing with normal water, and it takes everything off so effortlessly. My mom was visiting and had just taken all the makeup off of one eye with her greasy eye pad (that she's used as long as I can remember), and I ran in and made her take off the other eye's makeup with this stuff. She was immediately sold on it, and then stole my bottle."
	   ],
	   "numberOfRates":60,
	   "avarageRate":2.6070411302415,
	   "id":196
	},
	{
	   "productTitle":"Earth Mama Organic Nipple Butter for Breastfeeding and Dry Skin, 2-Ounce",
	   "desc":"",
	   "category":31,
	   "images":[
		  "71mH3BnVFjL._SY355_.jpg",
		  "81SVhE8HqQL._SY355_.jpg",
		  "81AV3N2N7oL._SX355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"14.95",
	   "comments":[
		  "I really like this balm; I was using Lansinoh. I exclusively pump due to my son's latching issues; it's been tough on my swollen , inflammed nipples and the Lansinoh didn't help relieve the pain too much. This balm is able to offer the moisture I needed, as well as some healing. By my next pumping session, my nipples would no longer be red and swollen. The smell is light cocoa and the texture is smooth and non sticky.",
		  "This stuff is fantastic. I wish I started using it immediately when I started nursing. I put this on after every time I nurse. I love that it’s safe for baby too because I’ve put it on before and baby has decided he’s not done eating yet and I have to pop him back on. I also used this on my chapped lips. fantastic. And it smells yummy too.",
		  "I like the natural smell. I did not like that there are solid particles in it which takes time to melt between fingers. So I had to be careful applying on my extra sensitive nipples because these particles would scratch. It was calming though.\nI tried it on my baby's mild diaper rash in one evening and it WORKED. The next day the redness was gone. A little dry patch left which I am currently treating with the nipple balm..",
		  "Love this product. This is so much better than thick lanolin type ointments. This has the consistency of vaseline when applying and does not hurt like thick, sticky lanolin products can. Generous amount, enough to share half a jar with my expecting sister. I would definitely recommend this product.",
		  "Needed lansinoh in the end to heal breastfeeding battle wounds. I wanted to stick with this but after a week, I caved and started Lansinoh (next step was Newman's). This earth mama product just wasn't cutting it, and feeding was getting too painful while we were working on our latch. Great as a lip balm though. I've also used as diaper balm in a pinch.",
		  "I've tried a lot of popular nipple ointments and this one is the best. Not overly oily and doesn't smell bad,l and chemically, my little one doesn't mind the taste or smell, and it works great too! My little one is pretty rough sometimes and my nipples will hurt for sometimes over an hour after a feed but they always feel better after that. Regular use works wonders.",
		  "This product was amazing for a first time mom navigating breastfeeding! Healed any cracks quickly, never felt thick or sticky, and best of all since it's all natural ingredients, I never worried if my baby wanted to nurse again shortly after putting it on!\nA little goes a long way! And now that we're past the sore nipple phase, I use it for minor skin irritations and even lip chap!",
		  "Great product when breastfeeding. Keeps your nipples from drying and cracking. It’s a bit pricey though but you don’t need much so it will last awhile! Has a nice cocoa butter smell. Gentle and doesn’t irritate. Used it on chapped lips too."
	   ],
	   "numberOfRates":179,
	   "avarageRate":0.3273899218636438,
	   "id":197
	},
	{
	   "productTitle":"Huggies Natural Care Unscented baby Wipes, Sensitive, 4 Refill Packs (768 Wipes)",
	   "desc":"",
	   "category":31,
	   "images":[
		  "81Kx21dHCzL._SY355_.jpg",
		  "712d29bgEmL._SY355_.jpg",
		  "71ykXsU8EJL._SY355_.jpg",
		  "71huVYrFUjL._SY355_.jpg",
		  "71MD-il13AL._SY355_.jpg",
		  "71SdW09adbL._SY355_.jpg",
		  "71N7WwzV9PL._SY355_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"23.99",
	   "comments":[
		  "I provide these to Home Care staff to use for an adult relative with incontinence. It comes with one plastic dispenser, plus I already had one dispenser from a previous purchase, so it is easy to prepare a supply that will last at least a couple of weeks - or more - at a time.",
		  "These are my favourite wipes. They don't smell weird like others I have used, the size is great, the thickness is great and doesn't rip easily for me, they are soft enough, and I really like the tub this box comes with.",
		  "We love these wipes! The only wipes we have found that don’t give our baby a sore bottom, and we’ve tried a lot of the other natural products. And all we usually need is one wipe. We’re hooked now.",
		  "These are great wipes. Very effective at... well, you get the picture, I'm sure. They are scent free, so that's always great for people wanting an alternative to some of those super-scented wipes.",
		  "Yes they are exactly what I want in a wipe. I use only Huggies!!!\nI would like to add the girls good notes that I always order I do hope they come in stock again very soon. Only place I can get them. Thank you. Satisfied customer!!",
		  "these will last me forever! why have i never bought baby wipes in bulk?!?! best decision of my life!",
		  "Doesn't leave a residue like so many other wipes do (like pampers), just feels like water. Not as soft as pampers but the thickness seems stronger to me.",
		  "Best wipes! Nice and thick and gently on our baby’s skin!"
	   ],
	   "numberOfRates":195,
	   "avarageRate":5.907306153383976,
	   "id":198
	},
	{
	   "productTitle":"Cetaphil Daily Facial Moisturizer SPF 15 120ml",
	   "desc":"",
	   "category":31,
	   "images":[
		  "61hQTNqobAL._SX679_.jpg",
		  "71Zgj3l%2BoQL._SX679_.jpg",
		  "41jY1W1Mu3L.jpg",
		  "316MSIthCeL.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"12.99",
	   "priceIs":"11.99",
	   "comments":[
		  "This product works amazing on my sensitive, combination skin. After applying it at first it had a burning/heating sensation but I left it on and after about 2/3mins the sensation went away. My face looks brighter and more plump. I loveeeeeee this product. For some reason it does not make me break out. Try it out if you have to but results are different for everyone :)",
		  "I find it burns my eyes if I put the cream on my eyelids which im used to doing, wouldn't get it again for an overall makeup base moisturizer but if not around your eyes its great, very creamy and does the job. so for me 4 stars",
		  "I've been through many moisturizers, this is by far the best one in my opinion and experience. My skin is quite dry and just a small amount every morning and night of this one works miracles for my skin. I highly recommend it to anyone who is searching for a simple, clean and effective everyday moisturizer.",
		  "It is a light product. Doesn't feel grease on the skin. No parfum and you can feel the moisturizer on the skin. The delivery was very fast. The price is great and the size format are a winner. The shipping was really fast. I was really surprised that the day, after I made the order, I received it. I will buy it again. It is a A+++",
		  "Great for very dry skin.\nI am really enjoying this product as an everyday moisturizer. I can have dry patches on my face and I feel that this paired with the Moisturizer for dry to very skin at night and using the gentle cleanser is a good combination for my naturally dry skin.",
		  "It doesn't adsorb well, it'd be better to use a face serum and then put a bit of sunscreen on top. It makes oily skinlooks extremely oily.",
		  "Non-greasy, moisturizing, light weight, makes my skin look and feel good... I have absolutely no complaints about this guy! It seems to be moisturizing my skin better than my $54 face cream I had been using, and that's even throughout some cold, windy, Canadian winter days! I will happily continue to order this!",
		  "It is a very standard and simple face moisturizer. It is what you'd expect and works the way it should. It's really that simple."
	   ],
	   "numberOfRates":166,
	   "avarageRate":3.515847878507483,
	   "id":199
	},
	{
	   "productTitle":"Bioré® Deep cleansing Charcoal Pore Strip Value Pack 14-Count",
	   "desc":"",
	   "category":32,
	   "images":[
		  "81QYndAX8HL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"11.97",
	   "comments":[
		  "Works great People complain because they don’t know how to use it. A skin tip for those who care, get a dermatologist appointment and ask for Retin A cream....it’s $250 per bottle but your benefits will cover it ;) It’s the PURE medical ingredient in all the high end face creams....you’ll NEVER find anything better for your skin. Use it in combo with these strips and you’ll be laughing!!!",
		  "You can see the some of the gunk it got on the sheet. You likely won't see a difference (even after lots of uses), but you can see some of the pour gunk on the sheet, which is addictive. Don't get these to clear up your blackheads, but for the mild satisfaction.",
		  "Used hundreds of pore strips of various brands in my lifetime, never have I experienced such poor quality. The strip just doesn't hold/stick to the skin at the edge. I made sure my nose was sufficiently wet, tore the bending slits and applied with dry hands - as I do with all other strips (including other Biore strips bought from drugstore). This one just doesn't stay. Used 2 so far, same result. Would not rebuy. Stick to buying from drugstore or another supplier/brand.",
		  "I find that the regular version works better than this charcoal edition. However, both work well. The charcoal leaves some residue on your face after application, however it is easily rinsed off with a bit of water.",
		  "Have yet to find better. Tried about 12 different brands over the years because my nose blackheads are so consistent and persistent. Biore are the best! Use these on my chin as well",
		  "You can see all the crap it pulls out",
		  "Works better than I expected. Certainly cleans out the pores lol",
		  "Used them before, I love to use them every once in a while for a treat"
	   ],
	   "numberOfRates":71,
	   "avarageRate":2.8648588379177595,
	   "id":200
	},
	{
	   "productTitle":"L'Oreal Paris Pure-Clay Daily Cleanser with 3 Mineral Clays + Charcoal, Energizes and Brightens Dull Skin, 140 ml",
	   "desc":"",
	   "category":31,
	   "images":[
		  "71nKg8MCyUL._SX679_.jpg",
		  "810P1TuGyaL._SX679_.jpg",
		  "51%2BPJQsY9GL._SX679_.jpg",
		  "51dxni5NnjL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":"9.97",
	   "priceIs":"8.97",
	   "comments":[
		  "Cleaned my face so well leaves it looking so bright!",
		  "Amazing product! Would buy again👍",
		  "Holy fragrance! Such a shame. Highly perfumed products aren't really what people are looking for anymore. I broke out from it",
		  "So I've been using this for a few weeks with an electronic cleansing brush and its made my skin look SO good... like my pores look smaller, my skin is glowing, and this cleanser is not drying one bit!! I'm in love with this product!!\nHow I like to use it:\n1. Squeeze some into your hand then add a little water, Apply like a face mask all over face, avoiding eye area\n2. Wet Cleansing Brush & bring the mouse mask to a lather, then continue cleansing for about 1-2 mins\n3. Rinse off with warm water, Pat dry, then Apply your favorite moisturizer (mine is a home made Whipped Shea Butter + Coconut Oil + Olive Oil) *Your skin absorbs moisturizers best up to 5 Mins after you wash your face!*",
		  "Smells like CHEAP mens aftershave...WHY? It isn't necessary to use cheap perfumes in face wash. Bad move.\nYou can't DETOX with PERFUME....false claim.\nI threw it away. There isn't any ingredient in it to detox. They claim 'brighten' because they slapped some glittery crap in it.\nBad product.",
		  "Had acne since i was 13. I am 39 and it shows no signs of slowing down. After my first use, my face looked clearer. It erased some marks i had. My face is looking clearer with every wash.\nIn my monthlys now and i have not gotten a big break out. Not sure if its the reason though..... but i love it. It gives you a great wash with just a dime size amount.",
		  "This cleanser contains fragrance and SLS. This cleanser felt nice while using it (but be gentle, those pieces of clay are no joke) but once I stopped using it my random all over my face breakout went away. Stay away from this if you have sensitive skin or are just sensitive to fragrance or SLS.",
		  "💙💙💙 Im a huge fan of the clay masks from L’Oreal so my heart skipped a beat when these clay cleansers hit the market all three immediately went on my “get list”. They smell just like the masks and make my skin feel great! Get em!"
	   ],
	   "numberOfRates":129,
	   "avarageRate":3.1766981284235927,
	   "id":201
	},
	{
	   "productTitle":"Maritime Naturals Face Bundle (Pack of 3) – 1% Retinol Cream (120ml), 20% Vitamin C Serum (60ml), Vitamin C Facial Cleanser (240ml)",
	   "desc":"",
	   "category":32,
	   "images":[
		  "71uLJBpg2HL._SX679_.jpg",
		  "81GTIKrMNIL._SX679_.jpg",
		  "81%2BgckpP5ZL._SX679_.jpg",
		  "819LyuXOOmL._SX679_.jpg"
	   ],
	   "specifications":[
 
	   ],
	   "priceWas":-1,
	   "priceIs":"94.99",
	   "comments":[
		  "I rarely write reviews of my amazon purchases, if not ever, but HAD to review this product. I have been using these three products for only fours days and I have already noticed a change. Not only does my skin feel great after using these, but it actually looks great! My skin was okay to begin with, not too oily, usually no acne, but I definitely needed to moisturize very often. Now I do this process every night and it has my skin glowing all day. The bonus is that it organic and Canadian-made. I love it and will be a customer for life if it continues to be this great.",
		  "Absolutely in LOVE!!!!!! Best face products ever!!! Made with much love and care from Nova Scotia. My skin is radiant and knowing this supports a Canadian Family business is a huge bonus.",
		  "I'm 39 years old and recently had a bout with annoying, unsightly acne and weird pigmentation on my face. This face bundle has worked wonders for my face. I've been using it for a few days now, twice a day and my face is smoother, complexion is more even looking. It's even significantly faded one particular dark spot on my cheek as well as some freckles. I've had no adverse reactions. My face feels more plump, has a youthful glow that I haven't had for a while and makeup goes on so perfectly. I also love that the products are cruelty free. Thanks for these face saving products!",
		  "Requires some patience... but after a few weeks, you will definitely see results. My skin is brighter, wrinkles and dark circles have absolutely diminished...seriously impressed! And am happy its vegan/animal friendly.",
		  "I also purchased the scrub, which I alternate with the cleanser to clean my skin before applying the serum and lotion. I used to love my R&F Reverse system but, I find this system works just as well for a fraction of the cost (and it’s Canadian)! Be sure to follow it with sunscreen. I use neutrogena ultra sheer",
		  "Package came on time and in perfect condition/packaging. No leaks or whatever..about the product, it looks good on my skin 1st time i used it. I dont feel dry at all, Its Hydrating and feels so smooth after wash, the serum and the retinol moisturizer.. im loving it now.",
		  "All three of these products are my favorite: i use the cream during the day and the serum for night time. The serum is indeed very liquid and not so easy to apply, but it's the only issue with it. The cleanser is gentle: i use it in the morning. All of these have a nice orange smell.",
		  "Opened for the 1st time yesterday and split my finger open (badly) on the inner foil seal of the jar. There is no way to foresee this, so be warned. While this has nothing to do with the product itself (which I will review at a later date) it's still significant enough to be mentioned. I get their focus isn't expensive packaging but people shouldn't be getting injured."
	   ],
	   "numberOfRates":10,
	   "avarageRate":0.2847940747478903,
	   "id":202
	}
 ]

/*
allCategories = [

	{
		"name" : "Beauty",
		"id" : 1,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/beauty.jpg"
	},
	{
		"name" : "Books",
		"id" : 2,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/books.jpg"
	},		{
		"name" : "Electronics",
		"id" : 3,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/electronics.jpg"
	},
	{
		"name" : "Gift",
		"id" : 4,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/gift.jpg"
	},		{
		"name" : "Amazon Giftcard",
		"id" : 5,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/giftcard.jpg"
	},
	{
		"name" : "Jewelry",
		"id" : 6,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/jewelry.jpg"
	},
	{
		"name" : "Kitchen",
		"id" : 7,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/kitchen.jpg"
	},
	{
		"name" : "Shoes",
		"id" : 8,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/shoes.jpg"
	},
	{
		"name" : "Sport",
		"id" : 9,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/sport.jpg"
	},
	{
		"name" : "Watches",
		"id" : 10,
		"parentId" : 0,
		"image" : imagesURL+"images/categories/watches.jpg"
	}
];



*/













