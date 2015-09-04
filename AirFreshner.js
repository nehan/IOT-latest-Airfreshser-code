	var isEnable=false;

	$(document).ready(function(){
	 localStorage.setItem('prevDistant', -1.0);

     setInterval(userlocationTrack,30000);

	 $("input.search_btn").click(function(){
	   var username=$('#username').val();
	   var password=$('#password').val();
	   $.ajax({
							type: 'GET',
							url: 'http://airfresh.site50.net/index.php',
							dataType:"jsonp",
							jsonp: 'callback',
	        				jsonpCallback: 'checkdata',
							data: {user_name:username,
							password:password,
							operation:'login'
	                     	},
							success: function(response){
								 console.log(response);
								 alert("Login Success");
								 var user_data={
								 	username:username,
								 	password:password,
								 	home_address:response[0].home_address

								 };
								 localStorage.setItem('user_details', JSON.stringify(user_data));
								 window.location.href = 'welcomeUser.html';
	                             
							},
							error:function(response){
								alert("error");
								console.log(response);
							}
											
	           }); 	

	  

	 });

	 $("input.reg_btn").click(function(){
	    var username=$('#userid').val();
	    var password=$('#pswd').val();
	    var user_address=$('#home_address').val();
	   $.ajax({
							type: 'GET',
							url: 'http://airfresh.site50.net/index.php',
							dataType:"jsonp",
							jsonp: 'callback',
	        				jsonpCallback: 'checkdata',
							data: {user_name:username,
							password:password,
							home_address:user_address,
							operation:'insert'
	                     	},
							success: function(response){
								 console.log(response);
								 alert("You are Resgistered Sucessfully, please login and activate the system");
								 window.location.href = 'index.html';

							},
							error:function(response){
								alert("error");
								console.log(response);
							}
											
	           }); 	

		
	 });

	$(".start_btn").click(function(){
		 	
		 if(!isEnable){
		 	$(".start_btn").attr('src',"stop.png");
		 	$(".start_lbl").html("Click on Stop to De-activate");
		     isEnable=true;
		      var userData=JSON.parse(localStorage.getItem('user_details'));
		  $.ajax({
							type: 'GET',
							url: 'http://airfresh.site50.net/index.php',
							dataType:"jsonp",
							jsonp: 'callback',
	        				jsonpCallback: 'checkdata',
							data: {user_name:userData.username,
							password:userData.password,
							activate:"yes",
							operation:'update'
	                     	},
							success: function(response){
								 console.log(response);
								 alert("Your airfreshner is activated");
							},
							error:function(response){
								alert("error");
								console.log(response);
							}
											
	           }); 	  
		 }
		 else
		 {
		 	$(".start_btn").attr('src',"start.jpg");
		 	$(".start_lbl").html("Click on Start to Activate");
		     isEnable=false;
		      var userData=JSON.parse(localStorage.getItem('user_details'));
		     $.ajax({
							type: 'GET',
							url: 'http://airfresh.site50.net/index.php',
							dataType:"jsonp",
							jsonp: 'callback',
	        				jsonpCallback: 'checkdata',
							data: {user_name:userData.username,
							password:userData.password,
							activate:"no",
							operation:'update'
	                     	},
							success: function(response){
								 console.log(response);
								 alert("Your airfreshner is De-activated");
							},
							error:function(response){
								alert("error");
								console.log(response);
							}
											
	           }); 	  
		 }

		
	 	
	 });
    
     function userlocationTrack(){
     	var userData=JSON.parse(localStorage.getItem('user_details'));
     	var destination_address=userData.home_address;
      	var geocoder = new google.maps.Geocoder();
		var destination=[];
			geocoder.geocode( { 'address': destination_address}, function(results, status) {
	         
            if (status === google.maps.GeocoderStatus.OK) {
               watchUserLocation(results[0].geometry.location.lat(), results[0].geometry.location.lng());
             }   

  			 });

		}

		function watchUserLocation(destLat,destLong){
			  navigator.geolocation.watchPosition(function(position) {
			   dist=calculateDistance(destLat, destLong,position.coords.latitude, position.coords.longitude);
			  
			  var str_prevDist = localStorage.getItem("prevDistant");
			  prevDist = parseFloat(str_prevDist);
			 
			  if( prevDist == -1.0)
			  {
			     localStorage.setItem("prevDistant", dist);  
			    	 
			  }
			   if(prevDist < 1 && dist >=1)
			  {
			      alert("You are moving away - so turning off Air Freshner");  
			      updateDB("no");
			  }
			  else if(prevDist > 1 && dist <=1)
			  {
			     alert("You are coming home - so turning on Air Freshner");  
			     updateDB("yes");
			  }
			  localStorage.setItem("prevDistant", dist);
			 
			   
			  });

       }

       function calculateDistance(lat1, lon1, lat2, lon2) {
			  var R = 6371; // km
			  var dLat = (lat2-lat1).toRad();
			  var dLon = (lon2-lon1).toRad();
			  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
			          Math.sin(dLon/2) * Math.sin(dLon/2);
			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			  var d = R * c;
			  return d;
        }
		Number.prototype.toRad = function() {
		  return this * Math.PI / 180;
		}
	    function updateDB(activity){
	     var userData=JSON.parse(localStorage.getItem('user_details'));
		  $.ajax({
							type: 'GET',
							url: 'http://airfresh.site50.net/index.php',
							dataType:"jsonp",
							jsonp: 'callback',
	        				jsonpCallback: 'checkdata',
							data: {user_name:userData.username,
							password:userData.password,
							activate:activity,
							operation:'update'
	                     	},
							success: function(response){
								 console.log(response);
								 
							},
							error:function(response){
								
								console.log(response);
							}
											
	           }); 	 
	    }
	});



