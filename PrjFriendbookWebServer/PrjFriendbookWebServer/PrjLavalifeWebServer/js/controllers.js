app.controller('ForgotController', function($http){
	
	var $messages = $('.errors-holder');
	
	$.validate({
		addValidClassOnAll   : true,
		errorMessagePosition : $messages,
		scrollToTopOnError   : false,
		validateOnBlur       : false,
		onError: function() {
					
			$(".form-error:empty").remove();
			$(".selectricWrapper").find(".has-error").parent().addClass("has-error");

		},
		onSuccess : function() {
			$http({
				method : 'POST',
				url : '/member/entrance/sendPassword?' + $( ".forgot-form" ).serialize()
			}).success(function(data, status, headers, config,response) {
				
				if (data.status === "OK") {
                    
                    if ( data.exists === "true" ) {
					    window.location.href = 'forgot-sent.html';
                    } else {
                        $(".errors-holder").append('<div class="form-error">Sorry, we could not find your email address.</div>');
                    }
				} else {
				    	
				}
				
			}).error(function(data) { handleErrors(data); });
			
			return false; 
		}
	});
	

});

app.controller('SignupController', function( $http, $scope, ajaxRequest, $rootScope, $route, Utils, $window, getUrlParam ){

        $scope.fbAccessToken  = $.cookie($rootScope.FB_ACCESS_TOKEN);
        $scope.fbEmail        = $.cookie($rootScope.FB_EMAIL);
        $scope.fbPicture      = $.cookie($rootScope.FB_PICTURE);
        $scope.fbIsSilhouette = ( $.cookie($rootScope.FB_IS_SILHOUETTE) != undefined ? JSON.parse( $.cookie( $rootScope.FB_IS_SILHOUETTE ) ) : $.cookie( $rootScope.FB_IS_SILHOUETTE ) );
        $scope.email;
        $scope.firstName;
        $scope.lastName;
        $scope.iMA = { letter: "", name: "Select" };
        $scope.seeking = [ { letter: "", name: "Select" } ].concat( $rootScope.seeking );
        $scope.step3Loading = false;

		/* declare variabls */
		var currentStep,
			gender,
			email,
			password,
			year,
			month,
			day,
			postalCode,
			nickname,
			openingLine,
			dating,
			height,
			heightFt,
			heightIn,
			body,
			ethnicity,
			smoking,
			religion,
			drinking,
			dob,
			fbgender,
			fbtoken,
			imageIndex = 0,
			backgroundArray,
			messageArray,
			interested,
			jsessionid,
			haveChildren,
			wantChildren,
			looking,
            education,
			setGender,
			lookingFor,
			fname,
			lname,
			income,
            countryId,
            stateId,
            cityId,
            socialVerify = 0,
            ioBB;
		
		/* Arrays to hold steps background images and marketing messages */
		backgroundArray = ["ll_step2_img.jpg","ll_step3_img.jpg","ll_step4_img.jpg"];
		messageArray = ["ll_registration_tag_glance.png","ll_registration_tag_smile.png","ll_registration_tag_kiss.png"];
		
		/* Check for Signup click, and attach what step user is currently on */
		$(".sign-up").click(function(){
			currentStep = $(this).parent().parent().parent().attr("class");
		});
		
		/* Check Facebook click */
        $scope.signUpFacebook = function(){
			handleLogin();
		};
		
		/* Interested in change. This is spefically for changing what background image user sees on next steps */
		$("#interested-select").change(function(){
			
			if( $(this).val() == "m-f" || $(this).val() == "m-m" ){
				
				fbgender = 'M';
				interested = $(this).val();
				
	
			}else if( $(this).val() == "f-m" || $(this).val() == "f-f" ){
				
				fbgender = 'F';
				interested = $(this).val();
				
			}
			
			lookingFor = $(this).val() == "m-f" || $(this).val() == "f-f" ? 'F': 'M';
			
		});
		
		/* ****************************************************************** */
		/* ************ Extend Validator. Age Gate **************** */
		/* ****************************************************************** */
		$.formUtils.addValidator({
			name : 'agegate',
		  	validatorFunction : function(value, $el, config, language, $form) {
		  		
		  		var day = $("#dob-day").val();
		    	var month = $("#dob-month").val();
		    	var year = $("#dob-year").val();
		    	var age =  18;
		    
		    	var mydate = new Date();
		    	mydate.setFullYear(year, month-1, day-1);
		    	
		   		var currdate = new Date();
		   		currdate.setFullYear(currdate.getFullYear() - age);
		    	
		 		return currdate > mydate;
		   
		  	}, errorMessage : 'You must be 18+ to sign up for Lavalife'
		});
		
		$.formUtils.addValidator({
			name : 'username',
		  	validatorFunction : function(value, $el, config, language, $form) {
		  		
                $(".errors-holder").empty();

                return $("#nickname").attr("rel") == "NEW";
		  	
		  	},errorMessage : 'That username has been taken',
		  	errorMessageKey: 'invalideUsername'
		});
		
		
		/* ****************************************************************** */
		/* ************ Extend Validator. Username Check **************** */
		/* ****************************************************************** */
		
		$( "#nickname" ).keyup(function() {
		    
			var data = { username: $(this).val().toUpperCase() };
			
			$.ajax({
				method: 'POST',
				data: data,
				url:'/api/v2/username/uniq',
				success:function(data){
			    				    	
			    	$( "#nickname" ).attr("rel", data.result);
			    	
			  	}
			 });
			 
		});

        $( "#postalCode" ).keyup(function() {
		    
            $("#postalCode").attr('data-validation','valid_postal_code required');

			$.ajax({
				method: 'POST',
				dataType: 'json',
				contentType: 'application/json', processData: false,
				url: '/mobilejoin/json/checkPostalCode?postalCode=' + $(this).val(),
				success:function(data){
			        
                    if ( data.countryId > -1 && data.stateId > -1 && data.cityId > -1 ){
                        
                        $( "#postalCode" ).attr("rel", "VALID");
                        
                        countryId = data.countryId;
                        stateId = data.stateId,
                        cityId = data.cityId;

                    } else {
                        
                        $( "#postalCode" ).attr("rel", "INVALID");
                    }
			  	}
			 });
		});
        
	    $("#locationCancel").click(function( event ){
            
            event.stopImmediatePropagation();
            $("#locationPopup").css('display','none');
			$("#location-modal").modal('hide');
            $("#country").val(-1).selectric();
            $("#province").val(-1).selectric();
            $("#county").val(-1).selectric();
            $("#city").val(-1).selectric();

        });	
    
        $("#locationConfirm").click(function( event ){
            
            event.stopImmediatePropagation();
            
            var error       = false;
            var $country        = $("#country");
            var $province       = $("#province");
            var $county         = $("#county");
            var $city           = $("#city");
            var placeholder = [];

            if ( $country.val() === "Select" || $country.val().length == 0 ){
                $("#countryDiv .selectric").addClass('has-error');
                error = true;
            } else {
                $("#countryDiv .selectric").removeClass('has-error');
                placeholder.push( $("select#country option[value='"+$country.val()+"']").html() );
            }

            if ( $province.val() === "Select" || $province.val().length == 0 ){
                $("#provinceDiv .selectric").addClass('has-error');
                error = true;
            } else {
                $("#provinceDiv .selectric").removeClass('has-error');
                placeholder.push( $("select#province option[value='"+$province.val()+"']").html() );
            }

            if ( $('#countyDiv').is(":visible") && ($county.val() === "Select" || $county.val().length == 0) ){
                $("#countyDiv .selectric").addClass('has-error');
                error = true;
            } else {
                $("#countyDiv .selectric").removeClass('has-error');
                if ( $county.val().length > 0 ) {
                    placeholder.push( $("select#county option[value='"+$county.val()+"']").html() );
                }
            }

            if ( $city.val() === "Select" || $city.val().length == 0 ){
                $("#cityDiv .selectric").addClass('has-error');
                error = true;
            } else {
                $("#cityDiv .selectric").removeClass('has-error');
                placeholder.push( $("select#city option[value='"+$city.val()+"']").html() );
            }


            if ( !error ){
                
                $("#locationPopup").css('display','none');
				$("#location-modal").modal('hide');
                $("#error_required_fields").hide();
                $("#postalCode").removeAttr('rel');
                $("#postalCode").removeAttr('current-error');
                $("#postalCode").removeClass('error');
                $("#postalCodeForm #postalCode").attr("placeholder", placeholder.join(", ") );
                $("#postalCode").val(null);
                
                $("#postalCode").removeAttr('data-validation');

            } else {
                
                $("#error_required_fields").show();
            }
        });
    

        $.formUtils.addValidator({
			name : 'valid_postal_code',
		  	validatorFunction : function(value, $el, config, language, $form) {
                                    
                var postalCodeOK = $("#postalCode").attr("rel") === "VALID";

                if ( $("#postalCode").attr("rel") === "INVALID" ){

                    showThatSelect();
                    $("#location-modal").modal('show');
                }

                return postalCodeOK;
            },
            errorMessage : '',
            errorMessageKey: 'invalidPostalCode'
		});

		
		/* ****************************************************************** */
		/* ************ Validate Each Step. Do Animations **************** */
		/* ****************************************************************** */
	    	
		var $messages = $('.errors-holder');

		$.validate({
			modules : 'date,security',
			addValidClassOnAll : true,
			errorMessagePosition: $messages,
			scrollToTopOnError : false,
			validateOnBlur : false,
			onError: function() {
			    	
				$(".form-error:empty").remove();
				// $(".selectricWrapper").find(".selectric").addClass("has-error");
                $("select[current-error]").parent().siblings(".selectric").addClass('has-error');
                $(".selectricHideSelect.has-success").siblings(".selectric.has-error").removeClass("has-error");

				$(".selectricWrapper").removeClass("has-error");
				$(".selectricHideSelect").removeClass("has-error");
				$(".form-group").removeClass("has-error");
				
                if ( $("#postalCode").attr("rel") === "INVALID" && $("#nickname").attr("rel") == "NEW" ){
                    // if there is an error for postal code, clear other error and let user focus on 
                    // fixing this first
                    $(".errors-holder").empty();
                }
			},
			onSuccess : function() {
			    
                $(".selectricHideSelect.has-success").siblings(".selectric.has-error").removeClass("has-error");

				/* Grab data from the form. Using this instead of serialize as it is easeier to manipulate the data this way (serializeArray is another option) */
				postalCode = $("#postalCode").val();
				nickname = $("#nickname").val();
				openingLine = $("#openingLine").val();
				dating = true;
				height = $("#height").val();
				body = $("#body").val();
				ethnicity = $("#ethnicity").val();
				smoking = $("#smoking").val();
				religion = $("#religion").val();
				drinking = $("#drinking").val();
				haveChildren = $("#have-children").val();
				wantChildren = $("#want-children").val();
				income = $("#income").val();
				education = $("#education").val();
                looking = $("#looking").val();
			    countryId = $("#country").val();
                stateId = $("#province").val();
                cityId = $("#city").val();
                heightFt = $("#height-feet option:selected").text();
                heightIn = $("#height-inches option:selected").text();
                ioBB = $("#ioBB").val();
				fname = $("#fname").val();
				lname = $("#lname").val();

				if(currentStep == "step-1"){ step1(); }
				
				if(currentStep == "step-2"){ step2(); }
				
				if(currentStep == "step-3"){ step3(); }

				return false; 
			}
			
		});
		
		/* ****************************************************************** */
		/* ************ Let User Upload Avatar **************** */
		/* ****************************************************************** */
		
		Dropzone.options.myAwesomeDropzone = {
		    	  
   			init: function() {
    	  	
    	  		acceptedFiles: ["image/*"],
    	    
    	    	this.on("addedfile", function(file) {
    	    		$(".image-loader").css("background-image","url(images/icons/ll_registration_ic_photo_loading.png)");
    	    		$(".image-loader img").removeClass("hidden");
    	    	});
    	    	
    	    	this.on("complete", function(file) { });
				
				this.on("success", function(file,dataImage) {
					var iW,iH,w,h;
					$("#loader").load("partials/picture-crop.html", function(){
						var $modal = $("#my_popup");
						var rotation = 0;
						var coords;
						
						$.fn.popup.defaults.blur = false;
						$('#my_popup').popup('show');
						
						$("#target").attr("src","http://lavalife.com/pictures/" + dataImage.fileName + ".jpeg");
						$("#target").load(function(){
							iW = $("#target").width();
							iH = $("#target").height();
							$("#target").css('max-width','400px');
							$("#target").css('max-height','400px');
							
							if($(".image-crop").height() < 400){
								$(".image-crop").css('padding-top', (400 - $(".image-crop").height()) / 2 + 'px');
								$(".image-crop").css('padding-bottom', (400 - $(".image-crop").height()) / 2 + 'px');
							}
							
							if($(".image-crop").width() < 400){
								$(".image-crop").css('padding-left', (400 - $(".image-crop").width()) / 2 + 'px');
								$(".image-crop").css('padding-right', (400 - $(".image-crop").width()) / 2 + 'px');
							}
							
							w = $("#target").width();
							h = $("#target").height();
							
							$('#target').Jcrop({
								minSize: [ 50, 50 ],
								onChange:   showCoords,
								onSelect:   showCoords
							  },function(){
								jcrop_api = this;
							});
							
							jcrop_api.setOptions({aspectRatio: 1/1});
							jcrop_api.animateTo([0,0,100,100]);
						});
						
						function showCoords(c){
							coords = c;
					   };
						
						$(".rotate-right").click(function(){
							console.log(rotation);
							rotation += 90;
							if (rotation == 360){
								rotation = 0;
							}			
							$('.jcrop-holder').rotate(rotation);
							jcrop_api.setOptions({rotate : rotation});
						});
						
						$(".rotate-left").click(function(){
							console.log(rotation);
							if (rotation == 0){
								rotation = 360;
							}
							rotation -=90;
							$('.jcrop-holder').rotate(rotation);
							jcrop_api.setOptions({rotate : rotation});
						});
						
						$(".crop-close").click(function(){
												
							dataImage.size.split('x');
							
							var postData = { 
								directory: dataImage.directory,
								fileName: dataImage.picName,
								width: dataImage.size[0],
								height: dataImage.size[1],
								action: "submit",
								invalidPictureFormatError: false,
								noPictureNameError: false,
								imageAppearsInDatingProfile: "Y",
								description: ""
							};
							
							var url = '/member/json/myprofile/savePicture';
							var success = function(data){
			
								var neoX = Math.round(coords.x / w * iW);
								var neoY = Math.round(coords.y / h * iH);
								var neoX2 = Math.round(coords.x2 / w * iW);
								var neoY2 = Math.round(coords.y2 / h * iH);
								
								var postData = { x: neoX, y: neoY, x2: neoX2, y2: neoY2, imgInitW: iW, imgInitH: iH, imgW: iW, imgH: iH, degree: rotation, filePath: dataImage.fileName + '.jpeg' };
								
								var url = '/pictProcessor/cropXPicture.act';
								var success = function(data){ 
									$('#my_popup').popup('hide');
									$("#avatar-top").slideUp(1000,"swing", function(){
										$(".avatar-bottom .title").css("background-image","url(images/icons/ll_logo_red_circle.png)");
									});
									
									$(".avatar-bottom").animate({height : "768px"}, 1000, function(){
										ga('send', 'event', 'NewUser', 'SignUp', 'Successful');
										window.location.href = 'dashboard.html' + Utils.appendCJAffiliate() + '#/';
									});
								}
								var error = function(){ };
								ajaxRequest.speak(url,success,error,postData);
						
							}
							var error = function(){ };
							
							ajaxRequest.speak(url,success,error,postData);
							
						 });
						 
						$(".crop-cancel").click(function(){
							$('#my_popup').popup('hide'); 
							window.location.reload();
						 });
					});			

				});
    	  
			}
    	  
		};
						
		/* ****************************************************************** */
		/* ************ Handle Facebook Signup ***************** */
		/* ****************************************************************** */
        function handleLogin() {
            
            FB.login(function(response) {
                
                if (response.status === 'connected') {
                    
                    $.cookie( $rootScope.FB_ACCESS_TOKEN, response.authResponse.accessToken, { path: '/' } );

                    $http({
                        method : 'POST',
                        url    : '/member/entrance/facebookAuth?returnStatusOnly=Y&access_token=' + response.authResponse.accessToken
                    }).success(function(data) {
                        
                        var login = data.fbemail;
                        
                        $.cookie( $rootScope.FB_EMAIL, login, { path: '/' } );
					    $.cookie( $rootScope.FB_PICTURE, data.fbpicture, { path: '/' } );
                        
                        if ( !Utils.isEmpty(data.email) && !Utils.isEmpty(data.password) ){
                            loginAPI( "login=" +  encodeURIComponent(data.email) + "&password=" +  encodeURIComponent(data.password) + "&returnStatusOnly=Y" ); 
                        } else {
                            $window.location.reload(); 
                        }
                    });
                    
                } else if (response.status === 'not_authorized') {
                    //Logged into Facebook, but not Lavalife app
                } else {
                    //The person is not logged into Facebook, so we're not sure if
                }
            }, {scope: 'public_profile,email'});
        }

        function loginAPI( data ){
            
            $.ajax({
                method : 'POST',
                data: data,
                url:'/member/entrance/auth',
                success:function(data){
                    if(data.status == "OK"){
                        
						//$.cookie('jsessionid', data.session);
						Utils.saveJsessionCookie(data.session);
                        window.location.href = 'dashboard.html' + Utils.appendCJAffiliate() + '#/';			    	

                    }else if(data.status == "RELOAD"){
                        $(".errors-holder").append( '<p class="form-error">Something went wrong. Please try again.</p>' );
                    }else if(data.status == "ERR" && data.errorCodes[0] == "loginI"){
                        $scope.jsessionid = data.session;
                        $('#reactivate-modal').modal('show');
                    }else if(data.status == "ERR" && data.errorCodes[0] == "loginWrong"){
                        $(".errors-holder").append( '<p class="form-error">Login information is incorrect.</p>' );
                    }
                    
                }
            }).error(function(data) { handleErrors(data); });
        }
				
		/* ****************************************************************** */
		/* ************ Call Facebook API ***************** */
		/* ****************************************************************** */
		
		window.fbAsyncInit = function() {
			
            FB.init({
				appId      : $scope.appId,
				cookie     : true,  // enable cookies to allow the server to access the session
				xfbml      : true,  // parse social plugins on this page
				version    : 'v2.1' // use version 2.1
			});

            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                } else if (response.status === 'not_authorized') {
                } else {
                    // the user isn't logged in to Facebook.
                    $.removeCookie( $rootScope.FB_ACCESS_TOKEN );
                    $.removeCookie( $rootScope.FB_EMAIL );
                    $scope.fbAccessToken = undefined;
                    $scope.fbEmail = undefined;
                    $scope.$apply();
                }
            });            

            FB.api(
                "/me",
                "get",
                { access_token: $.cookie($rootScope.FB_ACCESS_TOKEN) },
                function(data){
                    
                    var token = $.cookie($rootScope.FB_ACCESS_TOKEN);
                    if ( token != undefined ){

                        $scope.email     = data.email;
                        $scope.firstName = data.first_name;
                        $scope.lastName  = data.last_name;
                        $scope.iMA       = ( data.gender === $rootScope.FB_GENDER_CONST.male ? 'm-f' : 'f-m');
                        $scope.$apply();
                        $("#interested-select").val( $scope.iMA );
                        $("#interested-select").selectric();
                        $("#interested-select").change(); // trigger the change handler
                    } 
                }
            );

            FB.api(
                "/me/picture",
                "get",
                { access_token: $.cookie($rootScope.FB_ACCESS_TOKEN) },
                function(data){
                    $.cookie( $rootScope.FB_IS_SILHOUETTE, data.data.is_silhouette );
                    $scope.fbIsSilhouette = ( $.cookie($rootScope.FB_IS_SILHOUETTE) != undefined ? JSON.parse( $.cookie( $rootScope.FB_IS_SILHOUETTE ) ) : $.cookie( $rootScope.FB_IS_SILHOUETTE ) );
                    $scope.$apply();

                }
            );
		};
		
		// Load the SDK asynchronously
		(function(d, s, id) {
		    var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
		    js = d.createElement(s); js.id = id;
		    js.src = "http://connect.facebook.net/en_US/sdk.js";
		    fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		/* ****************************************************************** */
		/* ************ Function Step 1 ***************** */
		/* ****************************************************************** */
		
		function step1(){
			
			$(".form-error").remove();
			$(".selectricWrapper").find(".selectric").removeClass("has-error");
		    
            if ( $scope.fbAccessToken != undefined ){
                
                email = $scope.fbEmail;
                if ( email === 'undefined' ){
                    email = $("#email").val();
                }
                password = Math.random().toString(36).slice(2);

            } else {
                
                email = $("#email").val();
			    password = $("#password").val();
            }
            
			year  = $("#dob-year").val();
			month = $("#dob-month").val();
			day   = $("#dob-day").val();
			
            $http({

				method : 'POST',
				type   : 'json',
				url    : '/mobilejoin/v1.1/json/saveAccount?terms=true&email=' + email + '&password=' + password +'&emailconf=' + email

			}).success(function(data) {
										
				if ( data.hasOwnProperty('errors') ) {
					$(".errors-holder").empty();
					handleErrors(data);
				}else{
					animateSignup(currentStep,interested,backgroundArray[0],messageArray[0]);
					jsessionid = data.session;
					$(".errors-holder").empty();
					
				}
				
			}).error(function(data) { handleErrors(data); });
		
		}
		
		/* ****************************************************************** */
		/* ************ Function Step 2 ***************** */
		/* ****************************************************************** */
		
		function step2(){
            ga('send', 'event', 'NewUser', 'SignUp', 'Page1');
            $(".form-error").remove();
			$(".selectricWrapper").find(".selectric").removeClass("has-error");
			
			animateSignup(currentStep,interested,backgroundArray[1],messageArray[1]);
		}
		
		/* ****************************************************************** */
		/* ************ Function Step 3 ***************** */
		/* ****************************************************************** */
		
		function step3(){
						
			$scope.$apply(function() {
				
				$scope.userInfo = {
					
					gender: $("#interested-select option:selected").text(),
					heightFt: $("#height-feet option:selected").text(),
					heightIn: $("#height-inches option:selected").text(),
					body: $("#body option:selected").text(),
					ethnicity: $("#ethnicity option:selected").text(),
					haveChildren: $("#have-children option:selected").text(),
					wantChildren: $("#want-children option:selected").text(),
					religion: $("#religion option:selected").text(),
					nickname: $("#nickname").val(),
					education: $("#education option:selected").text(),
                    looking: $("#looking option:selected").text(),
					smoking: $("#smoking option:selected").text(),
					drinking: $("#drinking option:selected").text(),
					income: $("#income option:selected").text(),
					dob: year + '/' + month + '/' + day,
					age: new Date().getFullYear() - year
					
				}

			});
			
			var heightCm = Math.round( ( parseInt(heightFt) * 12 ) * 2.54 );
			
			var postData = { 
				jsessionid: jsessionid, 
				dating: true, 
				email: email, 
				password: password, 
				gender: 
				fbgender, 
				year: year, 
				month: month, 
				day: day, 
				postalCode: postalCode, 
				nickname: nickname, 
				openingLine: "Ask Me Later", 
				bodyType: body, 
				ethnicityType: ethnicity, 
				children: haveChildren, 
				childPlan: wantChildren, 
				religionType: religion, 
				education: education, 
                looking: looking,
				smokerType: smoking, 
				drinkerType: drinking, 
				income: income, 
				targetGender: lookingFor, 
				firstname: fname, 
				lastname: lname,
                countryId: countryId,
                stateId: stateId,
                cityId: cityId,
                heightFt: heightFt,
                heightIn: parseInt(heightIn),
                socialVerify: socialVerify
			};
            
            // looking: Casual Dates, Relationship, Long Term, Friends and Hookups
            postData.casualDates  = 0; // d
            postData.friends      = 0; // f
            postData.hookups      = 0; // h
            postData.longTerm     = 0; // l
            postData.relationship = 0; // r
            if (getUrlParam.speak('contest') == 'NWS'){
				postData.a = 'NWS2015';
			}
            if ( looking === "d" ){
                postData.casualDates = 1;
            }
            if ( looking === "f" ){
                postData.friends = 1;
            }
             if ( looking === "h" ){
                postData.hookups = 1;
            }
             if ( looking === "l" ){
                postData.longTerm = 1;
            }
             if ( looking === "r" ){
                postData.relationship = 1;
            }
			
			var url     = '/mobilejoin/v1.1/json/saveProfile';
			var success = function(data){
				
				var postData = { returnStatusOnly: "Y", login: email, password: password, fbtoken: $scope.fbAccessToken, ioBB: ioBB };
				var url      = '/member/entrance/auth';
				var success  = function(data){
					
					if(data.status === "RELOAD"){
						
						var postData = { returnStatusOnly: "Y", login: email, password: password, fbtoken: $scope.fbAccessToken };
						var url      = '/member/entrance/auth';
						var success  = function(data){
							
							// $.cookie('jsessionid', data.session);
							Utils.saveJsessionCookie(data.session);

							animateSignup(currentStep,interested,backgroundArray[2],messageArray[2]);
								
							$("#register").addClass("hidden");
							$("#upload-avatar").removeClass("hidden");
							$(".dotstyle ul").addClass("hidden");
							
						}
						
						var error = function(){ };
						
						ajaxRequest.speak(url,success,error,postData);
						$scope.step3Loading = false;
					
					}else{
						
						//$.cookie('jsessionid', data.session);
						Utils.saveJsessionCookie(data.session);
					    
                        if ( $scope.fbAccessToken != undefined ){
                            // if this is a FB account get the picture and save it as profile picture
                            // and redirect user to dashboard.html
                            
                            if ( $scope.fbIsSilhouette != undefined && $scope.fbIsSilhouette ){

                                animateSignup(currentStep,interested,backgroundArray[2],messageArray[2]);
                                $("#register").addClass("hidden");
                                $("#upload-avatar").removeClass("hidden");
                                $(".dotstyle ul").addClass("hidden");
                                $scope.step3Loading = false;

                            } else {
                                
                                processFbPictureURL( $scope.fbPicture, function(){
                                    
                                    $scope.step3Loading = false;
                                    ga('send', 'event', 'NewUser', 'SignUp', 'Successful');
                                    window.location.href = 'dashboard.html' + Utils.appendCJAffiliate() + '#/';
                                } );
                            }

                        } else {
                            
                            $scope.step3Loading = false;
                            animateSignup(currentStep,interested,backgroundArray[2],messageArray[2]);
                            $("#register").addClass("hidden");
                            $("#upload-avatar").removeClass("hidden");
                            $(".dotstyle ul").addClass("hidden");
                        }
					}
				}
				var error = function(){ };
				
				ajaxRequest.speak(url,success,error,postData, true);
				
			};
			var error = function(data){  handleErrors(data); };
		    
            $scope.step3Loading = true;
            ajaxRequest.speak(url,success,error,postData, true);
		}
    
    function processFbPictureURL( picUrl, callback ){

        $http({
            
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'post',
            url: '/fb_picture/', 
            data: $.param({ file: picUrl })

        }).success(function(data, status, headers, config) {
           
// replace the weird 'true' at the end of the string
data = data.replace("true",'');
            var dataImage = JSON.parse(data);
            var array = dataImage.size.split('x'),
                width = array[0],
                height = array[1];
                                    
            var postData = { 
                directory                   : dataImage.directory,
                fileName                    : dataImage.picName,
                width                       : width,
                height                      : height,
                action                      : "submit",
                invalidPictureFormatError   : false,
                noPictureNameError          : false,
                imageAppearsInDatingProfile : "Y",
                description                 : ""
            };
            
            var url     = '/member/json/myprofile/savePicture';
            var success = function(data){
                callback();    
            }
            var error = function(){};
            
            ajaxRequest.speak( url, success, error, postData );
        });
    }

});

app.controller('LoginController', function($http, $scope, ngDialog, $window, $rootScope, Utils){
    
    $.removeCookie( $rootScope.FB_ACCESS_TOKEN );
    $.removeCookie( $rootScope.FB_EMAIL );

	var downloadLink;
	
	var isMobile = {
	    Android: function() {
	    	downloadLink = 'http://ad.apps.fm/JRptCBYLtwzGEzEgfc1FiF5KLoEjTszcQMJsV6-2VnHFDLXitVHB6BlL95nuoNYfsVGKgLEUv1qPy5dFxrQDccgp4RxNrwswVEoTPk5cHbU9RCvFMCd7zDVdF5xGilqnGBocb9j0J2E2qEdX1ifb8vCYagKnjd3JTKLywLOw94o';
	        return navigator.userAgent.match(/Android/i);
	    },
	    BlackBerry: function() {
	        //return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        downloadLink = 'http://ad.apps.fm/I1acUkR2GprbHPFHD7RUWvE7og6fuV2oOMeOQdRqrE2RrFJxsIT4RJtkn7WPiEQ4ukKTWcLrKXbbhXA0pcyBGtdKtQRybS_BHEAoq3qHgo7E-75L3Qd4NRCe_NEMY8wc';
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        //return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        //return navigator.userAgent.match(/IEMobile/i);
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
	};
	
	if(isMobile.Android()) {
		$('.mobile-dl').show();
		$('.mobile-dl a').attr('href','https://play.google.com/store/apps/details?id=com.lavalife.mobile');
		$('.mobile-dl img').attr('src','images/ll_android_app_popup.png');
		$('.mobile-dl img').show();
	};
	
	$(".facebook").click( function(){
		handleLogin();
	});
	
	/* ****************************************************************** */
	/* ************ Validate Login Form **************** */
	/* ****************************************************************** */
	
	var $messages = $('.errors-holder');
	$.validate({
		modules : 'date,security',
		addValidClassOnAll : true,
		errorMessagePosition: $messages,
		scrollToTopOnError : false,
		validateOnBlur : false,
		onError: function() {
			
			$(".form-error:empty").remove();
			$(".selectricWrapper").find(".has-error").parent().addClass("has-error");

		},
		onSuccess : function() {
			
            loginAPI( $( ".login-form" ).serialize() );
			return false; 
		}
	});
    
	function getUserInfo(action, jsessionId){
		$http({
			method : 'POST',
			url : '/member/dating/v1.2/json/viewmyprofile;jsessionid=' + $scope.jsessionid
		}).success(function(data) {
			userInfo = data;
			
			if (action = 'login'){
				$window.location.href = 'dashboard.html' + Utils.appendCJAffiliate() + '#/';
			}else{
				$http({
					method : 'POST',
					url : '/member/v1.1/json/myprofile/saveProfile',
					dataType: 'json',
					data: userInfo,
					headers: {
						"Content-Type": "application/json"
					}
				}).success(function(data) {
					$window.location.href = 'dashboard.html' + Utils.appendCJAffiliate() + '#/';
				});
			}
		});
	}
	function getUrlParameter(sParam){
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) 
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	}  
	var changeWelcome = getUrlParameter('lo');

	if (changeWelcome == 'true'){
		$('#login h2 span').html('YOUR LAVALIFE SESSION HAS EXPIRED');
		$('.login-left').css('background-image','url("images/spring/ll_timed_out_img.jpg")');
	}
    
    function loginAPI( vdata ){
        
        $.ajax({
            method : 'POST',
            data: vdata,
            url:'/member/entrance/auth',
            success:function(data){

                if(data.status == "OK"){
					
					//$.cookie('jsessionid', data.session);
					Utils.saveJsessionCookie( data.session );
					getUserInfo('login', data.session);
					
					var deepID = getUrlParameter('deepID');
					
					var urlMap = {
						'dashboard' : 'dashboard.html',
						'subscription': 'subscription.html#membership/subscription',
						'preferences': 'dashboard.html#/account/',
						'myProfile' : 'dashboard.html#/myProfile/',
						'likes' : 'dashboard.html?open=likes#/',
						'messages' : 'dashboard.html?open=messages#/',
						'views' : 'dashboard.html?open=views#/',
						'private' : 'dashboard.html#/profile/' + deepID
					};
					var pageRedirect = getUrlParameter('redirect');
					if (typeof pageRedirect === 'undefined'){
						pageRedirect = 'dashboard';
					}
					if (pageRedirect == 'messages'){
						$.cookie('messages', 'true');
					}
					$window.location.href = urlMap[pageRedirect] + Utils.appendCJAffiliate() + '#/';

                }else if(data.status == "RELOAD"){
                    $(".errors-holder").append( '<p class="form-error">Something went wrong. Please try again.</p>' );
                }else if(data.status == "ERR" && data.errorCodes[0] == "loginI"){
                    $scope.jsessionid = data.session;
                    $('#reactivate-modal').modal('show');
                }else if(data.status == "ERR" && data.errorCodes[0] == "loginWrong"){
                    $(".errors-holder").append( '<p class="form-error">Log in information is incorrect.</p>' );
                }
                
            }
        }).error(function(data) { handleErrors(data); });
    }

	$scope.reactivateAccount = function(){
		$( ".login-form" ).append('<input type="hidden" name="reactivate" value="Y" />');
		$.ajax({
			method : 'POST',
			data: $( ".login-form" ).serialize(),
			url:'/member/entrance/auth',
			success:function(data){	
				$http({
		  			method : 'POST',
		  			url : '/member/account/reactivate/save;jsessionid=' + $scope.jsessionid
		  		}).success(function(data) {

					// $.cookie('jsessionid', data.session);
					Utils.saveJsessionCookie( data.session );
					getUserInfo('reactivate', data.session);
					
				});
			}
		});
	}
	
	/* ****************************************************************** */
	/* ************ Facebook Login **************** */
	/* ****************************************************************** */
	function handleLogin() {
		
		FB.login(function(response) {
            
            if (response.status === 'connected') {
                
                $.cookie( $rootScope.FB_ACCESS_TOKEN, response.authResponse.accessToken, { path: '/' } );

		  		$http({
		  			method : 'POST',
		  			url    : '/member/entrance/facebookAuth?returnStatusOnly=Y&access_token=' + response.authResponse.accessToken
		  		}).success(function(data) {
                    
					var login = data.fbemail;
                    
                    $.cookie( $rootScope.FB_EMAIL, login, { path: '/' } );
					$.cookie( $rootScope.FB_PICTURE, data.fbpicture, { path: '/' } );

                    if ( !Utils.isEmpty(data.email) && !Utils.isEmpty(data.password) ){
                        
                        var v = "login=" + encodeURIComponent(data.email) + "&password=" + encodeURIComponent(data.password) + "&returnStatusOnly=Y";
                        loginAPI( v ); 
                    } else {
                        $window.location.href = 'signup.html'; 
                    }

		  	    });
		  		
			} else if (response.status === 'not_authorized') {
		  		//Logged into Facebook, but not Lavalife app
			} else {
		  		//The person is not logged into Facebook, so we're not sure if
			}
		}, {scope: 'public_profile,email'});
	}
	
	window.fbAsyncInit = function() {
		FB.init({
			appId      : $scope.appId,
			cookie     : true,  // enable cookies to allow the server to access the session
			xfbml      : true,  // parse social plugins on this page
			version    : 'v2.1' // use version 2.1
		});
	};
	
	// Load the SDK asynchronously
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
			
});

app.controller("SearchController", function( Page, $scope, $routeParams, $http, ajaxRequest, myInformation, $location, $rootScope, Utils, SearchFactory, ViewMyProfile, logSessionError ) {

    var mode = $routeParams.mode;
    if (mode === 'freeTrial'){
        $rootScope.isFreeTrial = true;
    } else {
        $rootScope.isFreeTrial = false;
    }

    var currentPage = $rootScope.CURRENT_PAGE;
    $scope.Page = Page;
	$scope.Page.setTitle('Dashboard');
    $scope.advancedSearchCount = SearchFactory.getAdvancedSearchCount();
    $scope.myProfileData; // TODO: merge with ViewMyProfile
    $scope.ViewMyProfile = ViewMyProfile;
	
    var userInfo = function(data, ignoreSearchFilterObject ){
        
        // this will be used to reset the search
        $scope.myProfileData = data;

        // handling unit for distance 
        if ( data.countryId == $rootScope.USA_ID ){
            $scope.distance = $rootScope.distanceMILES; 
        } else {
            $scope.distance = $rootScope.distanceKM;
        }

        // parse search filters from DB
        var searchFilterObject;
        if ( !ignoreSearchFilterObject ){
            
            var result = $.grep( data.savedSearch, function(e){ return e.name == $rootScope.DEFAULT_SAVED_SEARCH_NAME; });
            var searchFilterObject;
            if ( result.length > 0 ){
               var str            = unescape(result[0].searchParameters).replace(/&quot;/g,'"');
               searchFilterObject = JSON.parse(str);
            }

            $scope.resetAdvancedSearch();
        }

        if ( searchFilterObject != undefined ){
            
            /* write searchFilterObject to cookie */
            var seeking              = Utils.findByLetter( $rootScope.lookingAlt, searchFilterObject.c );
            var distance             = Utils.findByLetter( $scope.distance, searchFilterObject.dist );
            var minAge               = Utils.findByLetter( $scope.ages, searchFilterObject.minAge );
            var maxAge               = Utils.findByLetter( $scope.ages, searchFilterObject.maxAge );
            var minHeight            = Utils.findByLetter( $scope.heightFeet, searchFilterObject.minHeightFt + "." + searchFilterObject.minHeightIn );
            var maxHeight            = Utils.findByLetter( $scope.heightFeet, searchFilterObject.maxHeightFt + "." + searchFilterObject.maxHeightIn );
            var ethnicity            = Utils.findAllByLetters( $scope.ethnicity, searchFilterObject.ethnicityType );
            var body                 = Utils.findAllByLetters( $scope.body, searchFilterObject.bodyType );
            var language             = Utils.findAllByLetters( $scope.languageBinary, searchFilterObject.spokenLanguage );
            var religion             = Utils.findAllByLetters( $scope.religion, searchFilterObject.religionType );
            var education            = Utils.findAllByLetters( $scope.education, searchFilterObject.educationType );
            var income               = Utils.findAllByLetters( $scope.income, searchFilterObject.incomeType );
            var onlineSearch         = Utils.findByLetter( $scope.Polar, searchFilterObject.onlineSearch ); 
            var smokingSearch        = Utils.findByLetter( $scope.Polar, searchFilterObject.smokingSearch );
            var haveChildrenSearch   = Utils.findByLetter( $scope.Polar, searchFilterObject.haveChildrenSearch );
            var childPlansTypeSearch = Utils.findByLetter( $scope.Polar, searchFilterObject.childPlansTypeSearch );
            var drinkingSearch       = Utils.findByLetter( $scope.Polar, searchFilterObject.drinkingSearch );
            var interestsSearch      = Utils.findAllByLetters( $scope.interestsBinary, searchFilterObject.interestIn );
            var findMeAtSearch       = Utils.findAllByLetters( $scope.findMeAtBinary, searchFilterObject.findMeAt );

            $.cookie('seeking'             , JSON.stringify(seeking));
            $.cookie('minAge'              , JSON.stringify(minAge));
            $.cookie('maxAge'              , JSON.stringify(maxAge));
            $.cookie('distance'            , JSON.stringify(distance));
            $.cookie('maxHeightSearch'     , JSON.stringify(maxHeight));
            $.cookie('minHeightSearch'     , JSON.stringify(minHeight));
            $.cookie('ethnicitySearch'     , JSON.stringify(ethnicity));
            $.cookie('bodySearch'          , JSON.stringify(body));
            $.cookie('languageSearch'      , JSON.stringify(language));
            $.cookie('religionSearch'      , JSON.stringify(religion));
            $.cookie('educationSearch'     , JSON.stringify(education));
            $.cookie('incomeSearch'        , JSON.stringify(income));
            $.cookie('onlineSearch'        , JSON.stringify(onlineSearch));
            $.cookie('smokingSearch'       , JSON.stringify(smokingSearch));
            $.cookie('haveChildrenSearch'  , JSON.stringify(haveChildrenSearch));
            $.cookie('childPlansTypeSearch', JSON.stringify(childPlansTypeSearch));
            $.cookie('drinkingSearch'      , JSON.stringify(drinkingSearch));
            $.cookie('interestsSearch'     , JSON.stringify(interestsSearch));
            $.cookie('findMeAtSearch'      , JSON.stringify(findMeAtSearch));
            // end parse
            SearchFactory.setAdvancedSearchCount( calculateAdvancedParamsCount( searchFilterObject  ) );
            $scope.advancedSearchCount = SearchFactory.getAdvancedSearchCount();
        }

		$scope.jsessionid = $.cookie('jsessionid');
		$scope.searchId   = $.cookie('searchId');
		$scope.loadGif    = true;
        
		/* ****************************************************************** */
		/* ************ CREATE SEARCH VARIABLES FROM COOKIES ***************** */
		/* ****************************************************************** */
        $scope.getFromCookie();
        
        // console.log( "currentPage: " + $.cookie( currentPage ) );
        var p = ( $.cookie( currentPage ) == 1 ? undefined : $.cookie( currentPage ) ); 
        
        $scope.advancedSearch( p, 'Initial Search' );
        
		/* NICK NAME SEARCH */
		$('#nickname-search').click(function(){
			$http({
				method : 'POST',
				url : '/member/dating/search/viewProfileByNickname;jsessionid=' + $scope.jsessionid +'?nickname=' + $('[name=nickname]').val()
			}).success(function(data) {
                
                $scope.functions.openUsernameSearch(); 
                if (data.userId > 1){
					$location.path('/profile/'+ data.userId)
				}else{
					$('#no-user').modal('show'); 
				}
			});
		});
		
		
	}
    
    // if data in ViewMyProfile changes, such as getting reloaded from DashboardController
    // call userInfo() to refresh;
    $scope.$watch("ViewMyProfile.get()", function( newVal, oldVal ){
        
        if ( !angular.equals( newVal, oldVal ) ){
            userInfo( newVal );
            tutorialStart();
        }
    }, true);

	/************************************************************************\
							ADVANCED SEARCH FUNCTION
	/************************************************************************/
	
	$scope.advancedSearch = function( page, action ){

        // console.log('advancedSearch page: ' + page );

        // page = -1 will clear the currentPage cookie
        if ( page == -1 ){
            $.removeCookie( currentPage );
            page = undefined;
        }
		
		if (action == undefined){
			action = 'Search Call';			
		}

        // clear $rootScope.profileId if user clicks on next or prev
        var actions = ["Grid Previous","Grid Next"];
        if ( actions.indexOf( action ) > -1 ){
            $rootScope.profileId = undefined;
        }

        var minHeight            = $scope.minHeightSearch;
        var maxHeight            = $scope.maxHeightSearch;
        var body                 = $scope.bodySearch;
        var language             = $scope.languageSearch;
        var religion             = $scope.religionSearch;
        var education            = $scope.educationSearch;
        var income               = $scope.incomeSearch;
        var onlineSearch         = $scope.onlineSearch;
        var smokingSearch        = $scope.smokingSearch;
        var haveChildrenSearch   = $scope.haveChildrenSearch;
        var childPlansTypeSearch = $scope.childPlansTypeSearch;
        var drinkingSearch       = $scope.drinkingSearch;

        $.cookie('seeking'             , JSON.stringify( $scope.lookingSearch ));
        $.cookie('minAge'              , JSON.stringify( $scope.minAgeSearch ));
        $.cookie('maxAge'              , JSON.stringify( $scope.maxAgeSearch));
        $.cookie('distance'            , JSON.stringify( $scope.distanceSearch ));
        $.cookie('maxHeightSearch'     , JSON.stringify( $scope.maxHeightSearch ));
        $.cookie('minHeightSearch'     , JSON.stringify( $scope.minHeightSearch ));
        $.cookie('ethnicitySearch'     , JSON.stringify( $scope.ethnicitySearch ));
        $.cookie('bodySearch'          , JSON.stringify( body ));
        $.cookie('languageSearch'      , JSON.stringify( language ));
        $.cookie('religionSearch'      , JSON.stringify( religion ));
        $.cookie('educationSearch'     , JSON.stringify( education ));
        $.cookie('incomeSearch'        , JSON.stringify( income ));
        $.cookie('onlineSearch'        , JSON.stringify( onlineSearch ));
        $.cookie('smokingSearch'       , JSON.stringify(smokingSearch));
        $.cookie('haveChildrenSearch'  , JSON.stringify(haveChildrenSearch));
        $.cookie('childPlansTypeSearch', JSON.stringify(childPlansTypeSearch));
        $.cookie('drinkingSearch'      , JSON.stringify(drinkingSearch));
		    
        if ( $.isEmptyObject(minHeight) ) {
            minHeight = { letter: "4.3", name: "4'3" }; 
        }
        if ( $.isEmptyObject(maxHeight) ) {
            maxHeight = { letter: "7.0", name: "7'0" }; 
        }

        minHeight = createHeightObject(minHeight.letter);
        maxHeight = createHeightObject(maxHeight.letter);
        
        function createMulti(object){
            
            var multi = '';
            
            for (var i = 0; i < object.length; i++) {
                multi += object[i].letter;
            }
            
            return multi;
        }
        
        function createHeightObject( height ){
            
            var height = height.split(".");
            var heightFt = height[0];
            var heightIn = height[1];
            var heightCm = Math.round( (heightFt * 30.48) + (heightIn * 2.54) );
            
            return { feet: heightFt, inches: heightIn, centimeters: heightCm  };
        }
	    
        var formattedDistance = formatDistance( $scope.distanceSearch.letter );

		var initialParams = { 
            picture: false, resultPerPage: 12, minAge: $scope.minAgeSearch.letter, maxAge: $scope.maxAgeSearch.letter, 
            dist: formattedDistance, c: $scope.lookingSearch.letter, 
            minHeightFt: minHeight.feet, minHeightIn: minHeight.inches,
            maxHeightFt: maxHeight.feet, maxHeightIn: maxHeight.inches, 
            minHeightCm: minHeight.centimeters, maxHeightCm: maxHeight.centimeters };
		
		var smoking      = 'null';
		var drinking     = 'null';
		var children     = 'null';
		var childrenPlan = 'null';
	    
        if ( onlineSearch != undefined && onlineSearch.letter === "1" ){
            initialParams.onlineActivity = 31; 
        } else {
            initialParams.onlineActivity = null;  
        }
        if ( smokingSearch != undefined ){
            smokingSearch.letter === "1" ? smoking = 'bcd' : smoking = 'a';
        }         
        if ( haveChildrenSearch != undefined ){
            haveChildrenSearch.letter === "1" ? children = 'b' : children = 'a'; // b - 
        }
        if ( childPlansTypeSearch != undefined ){
            childPlansTypeSearch.letter === "1" ? childrenPlan = 'a' : childrenPlan = 'b'; // b - 
        }        
        if ( drinkingSearch != undefined ){
            drinkingSearch.letter === "1" ? drinking = 'bcd' : drinking = 'a';
        }

		function multiParam(param,spokenParam){
			if( typeof(param) !== 'undefined' && param != null ){
				initialParams[spokenParam] = [];
				for(i=0;i<param.length;i++){
					initialParams[spokenParam].push(param[i].letter);
				};
			}
		}
		multiParam( language,'spokenLanguage');
		multiParam( education,'educationType');
		multiParam( income,'incomeType');
		multiParam( $scope.ethnicitySearch, 'ethnicityType');
		multiParam( body,'bodyType');
		multiParam( religion,'religionType');
		
		smoking !='null' ? initialParams.smokerType = smoking : '';
		drinking !='null' ? initialParams.drinkerType = drinking : '';
		children !='null' ? initialParams.hasChildrenType = children : '';
        childrenPlan !='null' ? initialParams.childPlansType = childrenPlan : '';
		
        /* Interests */
        $.cookie('interestsSearch', JSON.stringify($scope.interestsSearch));
        multiParam($scope.interestsSearch,'interestIn');
        /* Find Me At */
        $.cookie('findMeAtSearch', JSON.stringify($scope.findMeAtSearch));
        multiParam($scope.findMeAtSearch,'findMeAt');
		
		/* check if this is a new search or continuation of previous search (subsequent) */
        var pSearchId = $.cookie('searchId');
	 	var subsequentParams  = { page: page, searchId: pSearchId, resultPerPage: 12};
	 	var searchParamsFinal = ( page == undefined ? initialParams : subsequentParams );
	 	$scope.searchUrl      = ( page == undefined ? '/member/dating/json/search/custom' : '/member/dating/json/search/subsequent/page' );
	 	
	 	/* Set Search Results as an Array */
	 	$scope.searchResults = [];
		
        /* capture filters that were passed in */
        if ( page == undefined ){

            SearchFactory.setAdvancedSearchCount( calculateAdvancedParamsCount( searchParamsFinal ) );
            $scope.advancedSearchCount = SearchFactory.getAdvancedSearchCount();
        }
		
		var postData = searchParamsFinal;
		var url = $scope.searchUrl;
		var success = function(data){ 
			
            $scope.loadGif = false;		
			$scope.nextPage = data.nav.next;
			$scope.prevPage = data.nav.previous;
			
			$.cookie('searchId', data.nav.searchId);
			// $.cookie('searchId', -1);
			$.cookie('nextPage', data.nav.next);
			$.cookie('prevPage', data.nav.previous);
			page == undefined ? $.cookie(currentPage, 1) : $.cookie(currentPage, page);
		
			//Loop through data to apply conditional logic
			for( i=0; i < data.list.length; i++ ){
				
				$scope.searchResults.push(data.list[i]);
				
				/* Remove province from location */
				data.list[i].location = limitText(9, data.list[i].location.split(",")[0]);
				data.list[i].nickname = limitText(11, data.list[i].nickname);
				
				
				/* Create url for Large, Small, and Medium images  */
				if(data.list[i].pictures.length > 0){
				
					data.list[i].large = '/pictures/thumb/' + data.list[i].pictures[0].replace('.jpeg', 'l.jpeg');
					data.list[i].medium = '/pictures/thumb/' + data.list[i].pictures[0].replace('.jpeg', 'm.jpeg');
					data.list[i].small = '/pictures/thumb/' + data.list[i].pictures[0].replace('.jpeg', 's.jpeg');
					
				}else {
					data.list[i].large = '/pictures/thumb/';
				}
				
				/* Update Like and Fav to classes  */
				data.list[i].likeSent = data.list[i].likeSent != 0 ? "liked" : "like";
				data.list[i].hotListed = data.list[i].hotListed != false ? "favorited" : "favorite";
			}
            
            // add the polar type field for ease of parsing
            if ( onlineSearch         != undefined ){ initialParams.onlineSearch         = onlineSearch.letter; }
            if ( smokingSearch        != undefined ){ initialParams.smokingSearch        = smokingSearch.letter; }
            if ( haveChildrenSearch   != undefined ){ initialParams.haveChildrenSearch   = haveChildrenSearch.letter; }
            if ( childPlansTypeSearch != undefined ){ initialParams.childPlansTypeSearch = childPlansTypeSearch.letter; }
            if ( drinkingSearch       != undefined ){ initialParams.drinkingSearch       = drinkingSearch.letter; }
            
			// if the minHeight and maxHeight are set to default, don't include them in saved search
            if ( minHeight.centimeters == 130 ){
                delete( initialParams['minHeightFt'] );
                delete( initialParams['minHeightIn'] );
                delete( initialParams['minHeightCm'] );
            }
            if ( maxHeight.centimeters == 213 ){
                delete( initialParams['maxHeightFt'] );
                delete( initialParams['maxHeightIn'] );
                delete( initialParams['maxHeightCm'] );
            }

            initialParams['dist'] = $scope.distanceSearch.letter;
            var url      = '/member/search/saveCustomSearch';
            var postData = { 
							saveSearchName : $rootScope.DEFAULT_SAVED_SEARCH_NAME,
							searchString   : JSON.stringify(initialParams) };
            var success  = function(data){};
            var error    = function(data){};
            ajaxRequest.speak(url,success,error,postData);

		};
		
		var error = function(data){ 
			logSessionError.log(action);
			$scope.loadGif = false; 
		};
		$scope.functions.openAdvanced(false);
        $scope.loadGif = true;
		ajaxRequest.speak(url,success,error,postData);
        	
	};
	
    var tutorialStart = function () {    
            
			// no styling for checkboxes for now - Pengzhi
			// $("input[type='radio']:not(label.radio input), input[type='checkbox']:not(label.checkbox input, .chat-box input) ").ionCheckRadio();
			
			var edit = $scope.ViewMyProfile.get();

			if (edit.profileExtra.profileStatus == 0){
				$('body').append('<div id="blocker" class="blocker"></div>');
				$.get( "http://gameon.lavalife.com/action/lava_signup.php?email=" + edit.email, function( data ) {});
				$('body').append('<img src="http://web.adblade.com/orders.php?id=25764" border="0" /><script type="text/javascript">twttr.conversion.trackPid("l5gyp");</script><script type="text/javascript">var google_conversion_id = 1062502675;var google_conversion_language = "en";var google_conversion_format = "3";var google_conversion_color = "ffffff";var google_conversion_label = "J-PcCJTJvFkQk4LS-gM";var google_remarketing_only = false;</script><script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js"></script>');
				
			var isFrench = navigator.userLanguage || navigator.language;
			isFrench = isFrench.substring(0, 2);

			if(isFrench == 'fr'){
				var tour = new Tour({
				onEnd: function (tour) {
					$('#blocker').removeClass('blocker');
					$('.tour-backdrop').css('display','none');
					edit.profileExtra.profileStatus = 4;
					$http({
						method : 'POST',
						url : '/member/v1.1/json/myprofile/saveProfile',
						dataTypez: 'json',
						data: edit,
						headers: {
							"Content-Type": "application/json"
						}
					})
				}
				});

				tour.addStep({
				  orphan: true,
				  backdrop: true,
				  template: "<div class='popover heading'>" +
				  "<h1>Bienvenu</h1><h3>Ã  Lavalife!</h3>"+
				  "<p>Nous voulons nous assurer que vous commencez le fun tout de suite, c'est pour cela que l'on vous offre une semaine GRATUITE pour que vous essayez notre nouveau site.Pour commencer, complÃ©tez notre simple tutoriel pour vous familiarisez avec le site et puis sautez dans l'action!</p><div class='col-xs-6'><a data-role='next' class='redBtn' style='width:100%;'>C'EST PARTI</a></div><div class='col-xs-6'><a data-role='end' class='redBtn cancel' style='width:100%;'>NON MERCI</a></div>"
				});

				tour.addStep({
				  element: ".search",
				  onShow: function (tour) {
					$scope.functions.openMiniView($scope.profileId);
				  },
				  backdrop: true,
				  title: "Tableau de bord",
				  content: "PremiÃ¨rement consulter votre <b>tableau de bord</b>. Câ€™est ici que vous pouvez rÃ©gler vos prÃ©fÃ©rences de recherche et voir toutes vos ressemblances.",
				  template: "<div class='popover'><a class='skip-tutorial' data-role='end'>&raquo; FIN</a><div class='arrow'></div><div class='popover-title'></div><div class='popover-content'></div><a data-role='next' class='redBtn'>NEXT</a></div>"
				});

				tour.addStep({
				  element: "#open-mini-view",
				  backdrop: true,
				  title: "Profil version en miniature",
				  content: "Cliquez sur un profil pour voir la version en miniature de celui-ci au cÃ´tÃ© gauche du profil, de sorte que vous pouvez envoyer un message rapide, les aimer, ou aussi les ajouter Ã  votre liste de favoris, tout en continuant Ã  parcourir le site.<br><br>Voulez-vous voir une version plus complÃ¨te? Eh bien cliquez sur Â« Voir le profil Â» pour voir plus. Nâ€™oubliez pas de vÃ©rifier lâ€™option Â«CaractÃ©ristiques CommunesÂ», allez Ã  la vue gÃ©nÃ©rale du profil pour voir ce que vous avez en commun pour un brise-glace rapide!",
				  template: "<div class='popover'><a class='skip-tutorial' data-role='end'>&raquo; FIN</a><div class='arrow'></div><div class='popover-title'></div><div class='popover-content'></div><a data-role='next' class='redBtn'>NEXT</a></div>"
				});

				tour.addStep({
				  element: ".navbar",
				  backdrop: true,
				  placement: 'bottom',
				  title: "Barre Principale de Navigation",
				  content: "Ici vous trouverez le <b>Barre Principale de Navigation</b>. Cliquez sur rubrique <b>Home (maison)</b> de nâ€™importe oÃ¹ dans le site pour revenir Ã  votre tableau de bord, ou visitez notre blog Lavalife, vous trouverez Ã©galement votre profil et tous les paramÃ¨tres de votre compte dans cet endroit.",
				  template: "<div class='popover'><a class='skip-tutorial' data-role='end'>&raquo; FIN</a><div class='arrow'></div><div class='popover-title'></div><div class='popover-content'></div><a data-role='next' class='redBtn'>NEXT</a></div>"
				});
				
				tour.addStep({
				  element: ".navbar",
				  backdrop: true,
				  placement: 'bottom',
				  title: "Barre dâ€™Outils Principale",
				  content: "Une fois que vous commencez Ã  utiliser le rÃ©seau, toutes vos activitÃ©s peuvent Ãªtre trouvÃ©es ici dans votre <b>Barre dâ€™Outils Principale</b>. Cliquez sur chaque icÃ´ne pour vÃ©rifier : les nouveau messages, les messages envoyÃ©s, qui vous a aimÃ©, et aussi vÃ©rifiez votre liste de favoris. Votre liste de favoris ne pas divulguÃ©e aux autres, il est un endroit idÃ©al pour vous de placer les profils que vous dÃ©sirez revoir facilement bien aprÃ¨s.",
				  template: "<div class='popover' style='margin-left:445px;'><div class='arrow'></div><div class='popover-title'></div><div class='popover-content'></div><a data-role='end' class='redBtn'>FIN</a></div>"
				});
				
				tour.restart();
			}else{
				var tour = new Tour({
				onEnd: function (tour) {
					$('#blocker').removeClass('blocker');
					$('.tour-backdrop').css('display','none');
					edit.profileExtra.profileStatus = 4;
					$http({
						method : 'POST',
						url : '/member/v1.1/json/myprofile/saveProfile',
						dataType: 'json',
						data: edit,
						headers: {
							"Content-Type": "application/json"
						}
					})
				}
				});

				tour.addStep({
				  orphan: true,
				  backdrop: true,
				  template: "<div class='popover heading'>" +
				  "<h1>Welcome</h1><h3>to Lavalife!</h3>"+
				  "<p>Weâ€™ve put together a quick tutorial to show you how the site works. Would you like to see it?</p><div class='col-xs-6'><a data-role='next' class='redBtn' style='width:100%;'>YES</a></div><div class='col-xs-6'><a data-role='end' class='redBtn cancel' style='width:100%;'>NO THANKS</a></div></div>"
				});

				tour.addStep({
				  element: ".search",
				  onShow: function (tour) {
					$scope.functions.openMiniView($scope.profileId);
				  },
				  backdrop: true,
				  title: "Search Bar",
				  placement: "bottom",
				  content: "This is your search bar. When you apply Advanced Search filters, youâ€™ll see a number beside the Advanced Search to show you how many are currently applied.",
				  template: "<div class='popover'><a class='skip-tutorial' data-role='end'>&raquo; Skip Tutorial</a><div class='arrow'></div><div class='popover-title'></div><div class='popover-content'></div><a data-role='next' class='redBtn'>OK, GOT IT</a></div>"
				});

				tour.addStep({
				  element: "#open-mini-view",
				  backdrop: true,
				  title: "Sneak Peek",
				  content: "This is where you can get a sneak peek at a profile that interests you. Donâ€™t worry, looking at a userâ€™s Sneak Peek doesnâ€™t show them youâ€™ve viewed them!",
				  template: "<div class='popover'><a class='skip-tutorial' data-role='end'>&raquo; Skip Tutorial</a><div class='arrow'></div><div class='popover-title'></div><div class='popover-content'></div><a data-role='next' class='redBtn'>OK, GOT IT</a></div>"
				});

				tour.addStep({
				  element: ".navbar",
				  backdrop: true,
				  placement: 'bottom',
				  title: "Main Navigation",
				  content: "This is your main toolbar. From here you can edit your profile, visit the blog, access your settings and log out.",
				  template: "<div class='popover'><a class='skip-tutorial' data-role='end'>&raquo; Skip Tutorial</a><div class='arrow'></div><div class='popover-title'></div><div class='popover-content'></div><a data-role='next' class='redBtn'>OK, GOT IT</a></div>"
				});
				
				tour.addStep({
				  element: ".navbar",
				  backdrop: true,
				  placement: 'bottom',
				  title: "Notification Bar",
				  content: "Your notification bar shows you how many people have viewed and liked your profile, how many new message you have and gives you quick access to your favorite profiles.",
				  template: "<div style='margin-left:445px;' class='popover'><div class='arrow'></div><div class='popover-title'></div><div class='popover-content'></div><a data-role='end' class='redBtn'>OK, ALL DONE</a></div>"
				});
				
				tour.restart();
				}
			}
	};
   
    $scope.resetAdvancedSearch = function(){
        $scope.minHeightSearch    = {}; 
        $scope.maxHeightSearch    = {}; 
        $scope.ethnicitySearch    = [];
        $scope.bodySearch         = [];
        $scope.languageSearch     = [];
        $scope.religionSearch     = [];
        $scope.educationSearch    = [];
        $scope.incomeSearch       = [];
        $scope.smokingSearch      = null;
        $scope.onlineSearch       = null;
        $scope.drinkingSearch     = null;
        $scope.haveChildrenSearch = null;
        $scope.childPlansTypeSearch = null;
        $scope.interestsSearch    = [];
        $scope.findMeAtSearch     = [];

        $.cookie('ethnicitySearch'     , null);
        $.cookie('bodySearch'          , null);
        $.cookie('languageSearch'      , null);
        $.cookie('religionSearch'      , null);
        $.cookie('educationSearch'     , null);
        $.cookie('incomeSearch'        , null);
        $.cookie('onlineSearch'        , null);
        $.cookie('smokingSearch'       , null);
        $.cookie('haveChildrenSearch'  , null);
        $.cookie('childPlansTypeSearch', null);
        $.cookie('drinkingSearch'      , null);
        $.cookie('interestsSearch'     , null);
        $.cookie('findMeAtSearch'      , null);
    
        $("#interests-popup input:checked").attr('checked', false);
        $("#find-me-at-popup input:checked").attr('checked', false);
    }
    
    $scope.toggle = function( dom ){
        
        $element = $('#'+dom);
        if ( $element.is(":visible") ) { 
            $element.css('display','none');
        } else {
            
            $element.css('display','block'); 
            
            // yea yea, whatev
            if (dom === 'interests-popup' && $("#find-me-at-popup").is(":visible") ){
                $("#find-me-at-popup").css('display','none'); 
            }
            if (dom === 'find-me-at-popup' && $("#interests-popup").is(":visible") ){
                $("#interests-popup").css('display','none'); 
            }
        }
    }
    
    $('#interests-popup .save').click( function( event ){
        
        event.stopImmediatePropagation();
        
        $scope.interestsSearch = []; 
        $("#interests-popup input:checked").each(function(){
            
            var letter = $(this).attr('name');
            var obj = Utils.findByLetter( $rootScope.interestsBinary, letter );
            $scope.interestsSearch.push( obj );
        });
        $scope.$apply();
        $scope.toggle('interests-popup');
    });

    $('#find-me-at-popup .save').click( function( event ){
        
        event.stopImmediatePropagation();
        
        $scope.findMeAtSearch = []; 
        $("#find-me-at-popup input:checked").each(function(){
            
            var letter = $(this).attr('name');
            var obj = Utils.findByLetter( $rootScope.findMeAtBinary, letter );
            $scope.findMeAtSearch.push( obj );
        });
        $scope.$apply();
        $scope.toggle('find-me-at-popup');
    });
    
    
    $scope.showCount = function( collection ){
        
        if ( collection == undefined ){ return ""; }

        var count = collection.length;
        if ( count > 0 ){
            
            return "(" + count + ")";

        } else {

            return "";
        }
    };
    
    $scope.resetFMA = function(){

        $("#find-me-at-popup input").prop("checked",false);
        $("#find-me-at-popup input").each( function(){
            
            if ( $scope.findMeAtSearch == null ){ return; }

            for( i=0; i < $scope.findMeAtSearch.length; i++ ){
                
                var fma = $scope.findMeAtSearch[i];
                if ( fma.letter === $(this).attr('name') ){
                    $(this).prop( 'checked', true );
                }             
            }
        });
    };

    $scope.resetInterests = function(){
        
        $("#interests-popup input").prop("checked",false);
        $("#interests-popup input").each( function(){
            
            if ( $scope.interestsSearch == null ){ return; }

            for( i=0; i < $scope.interestsSearch.length; i++ ){
                
                var interest = $scope.interestsSearch[i];
                if ( interest.letter === $(this).attr('name') ){
                    $(this).prop( 'checked', true );
                } 
            }
        });
    };

    $scope.getFromCookie = function(){
        
        var minAgeDefault = $scope.myProfileData.age - 10 > 18 ?  $scope.myProfileData.age - 10 : 18;
		var maxAgeDefault = $scope.myProfileData.age + 10 < 99 ?  $scope.myProfileData.age + 10 : 99;
		var looking  = { letter: "d", name: "Casual Dates" };
		var minAge   = { letter: minAgeDefault, name: minAgeDefault };
		var maxAge   = { letter: maxAgeDefault, name: maxAgeDefault };
		var distance = { letter: "50", name: "50 KM" };
        //var minHeight = { letter: "4.3", name: "4'3" };
		//var maxHeight = { letter: "7.0", name: "7'0" };
        var minHeight = {};
		var maxHeight = {};


        var dSearch = $.cookie('distance');
        if ( dSearch != undefined ){
			if ( $scope.myProfileData.countryId == $rootScope.USA_ID ){
				dSearch = dSearch.replace('KM','MILES'); 
			} else {
				dSearch = dSearch.replace('MILES','KM');; 
			}
        }

        $scope.distanceSearch       = cookieObject( dSearch ); 
        $scope.lookingSearch        = cookieObject($.cookie('seeking'));
        $scope.minAgeSearch         = cookieObject($.cookie('minAge'));
        $scope.maxAgeSearch         = cookieObject($.cookie('maxAge'));
        $scope.maxHeightSearch      = cookieObject($.cookie('maxHeightSearch'));
        $scope.minHeightSearch      = cookieObject($.cookie('minHeightSearch'));
        $scope.ethnicitySearch      = cookieObject($.cookie('ethnicitySearch'));
        $scope.bodySearch           = cookieObject($.cookie('bodySearch'));
        $scope.languageSearch       = cookieObject($.cookie('languageSearch'));
        $scope.religionSearch       = cookieObject($.cookie('religionSearch'));
        $scope.educationSearch      = cookieObject($.cookie('educationSearch'));
        $scope.incomeSearch         = cookieObject($.cookie('incomeSearch'));
        $scope.smokingSearch        = cookieObject($.cookie('smokingSearch'));
        $scope.onlineSearch         = cookieObject($.cookie('onlineSearch'));
        $scope.drinkingSearch       = cookieObject($.cookie('drinkingSearch'));
        $scope.haveChildrenSearch   = cookieObject($.cookie('haveChildrenSearch'));
        $scope.childPlansTypeSearch = cookieObject($.cookie('childPlansTypeSearch'));
        $scope.interestsSearch      = cookieObject($.cookie('interestsSearch'));
        $scope.findMeAtSearch       = cookieObject($.cookie('findMeAtSearch'));
 		
		/* Set Defualt Values if Cookies are Empty */
		$scope.lookingSearch = setDefualt($scope.lookingSearch, looking);
		$scope.minAgeSearch = setDefualt($scope.minAgeSearch, minAge);
		$scope.maxAgeSearch = setDefualt($scope.maxAgeSearch, maxAge);
		$scope.distanceSearch = setDefualt($scope.distanceSearch, distance);
		$scope.minHeightSearch = setDefualt($scope.minHeightSearch, minHeight);
		$scope.maxHeightSearch = setDefualt($scope.maxHeightSearch, maxHeight);
	
        $scope.resetInterests();    
        $scope.resetFMA();
    };

    // call userInfo() if ViewMyProfile.get() is defined
    if ( $scope.ViewMyProfile.get() != undefined ){
        userInfo( $scope.ViewMyProfile.get(), true );
    }
    
    $scope.sendFavInMiniView = function ( userId ){
    
        $scope.functions.sendFavorite( userId, 'hotlist', 
            function(){ $rootScope.miniViewed.likeCheck = 'favorited' }
        );
    };

    $scope.sendFavInGrid = function ( user ){
    
        $scope.functions.sendFavorite( user.userId, 'hotlist', 
            function(){ user.hotListed = 'favorited' }
        );
    };
    

	/*
	* Translate value into MILES when user is from outside USA
	*/ 
    function formatDistance( distanceString ){
        
        if ( typeof distanceString !== 'undefined' ){

            var distance = parseInt(distanceString);
            
            if ( $scope.myProfileData.countryId != $rootScope.USA_ID ){
                // if user is not from the states, distance should be in KM.
                // So when a Canadian user enters 100 KM, it should be converted to MILES since the API assumes all distance in MILES
                distance = Math.round(distance * 0.62137);
            }
            return distance;

        } else {

            return distanceString;
    	}
   	};

    function calculateAdvancedParamsCount( params ){
        
        var count = 0;

        if ( params["onlineActivity"] != null ){
            count++;
        }

        var aParams = ["spokenLanguage","educationType","incomeType","ethnicityType","bodyType",
            "religionType","interestIn","findMeAt"];
        
        for (var i = 0; i < aParams.length; i++) {
            if ( aParams[i] != undefined && params[aParams[i]] != undefined && params[aParams[i]].length > 0 ){
                count++;
            }
        }

        var bParams = ["smokerType","drinkerType","hasChildrenType","childPlansType"];
        
        for (var i = 0; i < bParams.length; i++) {
            
            if ( bParams[i] != undefined && params[bParams[i]] != undefined ){
                count++;
            }
        }

        return count;
    };

    function cookieObject(cookie){
        
        if(typeof cookie !== "string"){
            return cookie;
        }else if(cookie === "undefined"){
            return undefined;
        }else{
            return $.parseJSON( cookie );
        }	
        
    }

    function setDefualt(object,defualt){
        
        if(typeof object !== 'undefined'){
            return object
        }else{
            return defualt
        }
    
    }

    function buildMultiSelect(param,array) {
        
        initialParams[param] = array.split('');
    
    }
    function buildMultiSelectArray(param,array) {
        
        var myArray = new Array();
        
        for (var i = 0; i < array.length; i++) {
             myArray[i] = array[i].letter;
        }
        
        initialParams[param] = myArray;
                    
    }

    angular.element(document).ready(function () {
        $(document).keypress(function(e) {
            
            var nicknameFocusEh = ( $(document.activeElement).attr('name') === 'nickname' );
            if(e.which == 13 && nicknameFocusEh) {
                // enter pressed
                $("#nickname-search").click();
            }
        })
    });

});

app.constant('GALLERY', {
    'PUBLIC'         : 1,
    'PRIVATE'        : 2,
    'PRIVATE_TEASER' : 3,
    'PUBLIC_TEASER'  : 4,
});


/* global app */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ProfileController ( GALLERY, Page, $scope, $routeParams, profileData, ll, $rootScope, $route, AccountInfo, getAccountInfo, PrivateTeaserStatus, $timeout )
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
{

    var mode = $routeParams.preview;
    if (mode === 'freeTrial'){
        $rootScope.isFreeTrial = true;
    } else {
        $rootScope.isFreeTrial = false;
    }

    $scope.Page        = Page;
    $scope.AccountInfo = AccountInfo;
    $scope.spinner = {};
    $scope.spinner['default'] = false;
    $scope.spinner['aboutMe'] = false;
    $scope.spinner['idealDate'] = false;
    $scope.currentGallery;

    $scope.getPrivateTeaserStatus = function(){
        
        var free  = !$scope.AccountInfo.get().isActiveSubscription;
        var hasPrivatePhotos = ($scope.user.numBackstage > 0);
        
        return PrivateTeaserStatus.getStatus( free, $scope.user.requestSent, hasPrivatePhotos );
    }
    
    $scope.togglePublicGallery = function(){
       
        if ( $scope.currentGallery === GALLERY.PUBLIC || $scope.currentGallery === GALLERY.PUBLIC_TEASER  ){
            $scope.closeAllGallery();
        } else {
            $scope.showPublicGallery();
        }
    }
    $scope.togglePrivateGallery = function(){
        
        if ( $scope.currentGallery === GALLERY.PRIVATE || $scope.currentGallery === GALLERY.PRIVATE_TEASER ){
            $scope.closeAllGallery();
        } else {
            $scope.showPrivateGallery();
        }
    }

    $scope.showPublicGallery = function(){
        
        if ( $scope.user.carouselPictures.length > 0 ){
            $scope.currentGallery = GALLERY.PUBLIC;
        } else {
            $scope.currentGallery = GALLERY.PUBLIC_TEASER;
        }
    };

    $scope.showPrivateGallery = function(){

        if ( $scope.user.privatePictures.length > 0 ){
            $scope.currentGallery = GALLERY.PRIVATE;
        } else {
            $scope.currentGallery = GALLERY.PRIVATE_TEASER; 
        }
    };
    
    $scope.isTabPublic = function(){
        return ( $scope.currentGallery === GALLERY.PUBLIC || $scope.currentGallery === GALLERY.PUBLIC_TEASER );
    }

    $scope.isTabPrivate = function(){
        return ( $scope.currentGallery === GALLERY.PRIVATE || $scope.currentGallery === GALLERY.PRIVATE_TEASER );
    }

    $scope.isCurrentPublic = function(){
        return $scope.currentGallery === GALLERY.PUBLIC; 
    }
    $scope.isCurrentPrivate = function(){
        return $scope.currentGallery === GALLERY.PRIVATE; 
    }
    $scope.isCurrentPrivateTeaser = function(){
        return $scope.currentGallery === GALLERY.PRIVATE_TEASER; 
    }
    $scope.isCurrentPublicTeaser = function(){
        return $scope.currentGallery === GALLERY.PUBLIC_TEASER; 
    }

    $scope.closeAllGallery = function(){
        $scope.currentGallery = null;
    } 
    
    if (isNaN($.cookie("currentPage")))
    {
        $.cookie("currentPage", 1);
    }
    
    //
    // load next search page; if it has previously been loaded the service will return a cached result set.
    //
    if (ll.searchLastSearchId() !== $.cookie("searchId"))
    {
        ll.resetCachedResults();
    }
    
    ll.searchNext($.cookie("currentPage"), function (data) 
    {
        $scope.currentIndex = findWithAttr(data.list, 'userId', $routeParams.userID);
        if (typeof $scope.currentIndex === "undefined")
        {
            $scope.currentIndex = 0;
            ll.resetCachedResults(); // this will also reset the searchId
        }
        
        if (typeof $scope.currentIndex !== "undefined")
        {
            $scope.maxProfile = data.length;

            $scope.nextProfile = $scope.currentIndex !== 11 && data.list[$scope.currentIndex + 1] 
                    ? data.list[$scope.currentIndex + 1].userId : undefined;
            $scope.prevProfile = $scope.currentIndex !== 0 ? data.list[$scope.currentIndex - 1].userId : undefined;

            $scope.nextPage = data.nav.next;
            $scope.prevPage = data.nav.previous;
            $scope.currentPage = $.cookie("currentPage");

            //
            // we're at the last record in the page, load the next one
            // ll.searchNext will return a cached result set if present
            //
            if ($scope.currentIndex === 11 && typeof data.nav.next !== "undefined")
            {
                ll.searchNext($scope.nextPage, function (data) 
                {
                     $scope.nextProfile = data.list[0].userId;
                });
            }

            //
            // we're at the first record in the page, load the previous one
            // ll.searchNext will return a cached result
            //
            if ($scope.currentIndex === 0 && typeof data.nav.previous !== "undefined")
            {
                ll.searchNext($scope.prevPage, function (data) 
                {
                     $scope.prevProfile = data.list[11].userId;
                });
            }
        }
    });
    
    populateCurrentUserWithData(profileData.getData());

    $scope.changePageNext = function (index, currentPage)
    {
        if (index === 11)
        {
            $.cookie("currentPage", (parseInt(currentPage) + 1));
        }
    };

    $scope.changePagePrev = function (index, currentPage)
    {
        if (index === 0)
        {
            $.cookie("currentPage", (parseInt(currentPage) - 1));
        }
    };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function populateCurrentUserWithData(data)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        $scope.user = {};
        
        if (!data.favCheck)
        {
            data.favCheck = (data.likeSent === true ? "liked" : "like");
            data.likeCheck = (data.hotListed === true ? "favorited" : "favorite");
            data.status = returnName($scope.statusBinary, "letter", data.profileExtra.status);
            data.ethnicity = returnName($scope.ethnicity, "letter", data.ethnicity);
            data.religion = returnName($scope.religion, "letter", data.religion);
            data.bodyType = returnName($scope.body, "letter", data.bodyType);
            data.smoke = returnName($scope.smoking, "letter", data.smoke);
            data.drink = returnName($scope.drinking, "letter", data.drink);
            data.haveChildren = returnName($scope.hasChildren, "letter", data.hasChildren);
            data.wantChildren = returnName($scope.children, "letter", data.childPlan);
            data.education = returnName($scope.education, "letter", data.education);
            data.income = returnName($scope.income, "letter", data.income);
            data.background = returnName($scope.covers, "letter", data.profileExtra.background);
            data.zodiac = {'name': returnName($scope.zodiac, "letter", data.zodiac), 'class': data.zodiac};

            data.personality = {
                'name': returnName($scope.personality, "letter", data.profileExtra.personality),
                'class': returnName($scope.personality,
                'class', data.profileExtra.personality)
            };

            data.fullGender = data.gender === "F" ? "her" : "him";

            data.interests = getMaskArray(data.profileExtra.interests);
            data.findMeAt = getMaskArray(data.profileExtra.findme);           

            data.incommon = data.profileExtra.commonInterests;
            data.incommon = typeof data.incommon === "undefined" ? 0 : getMaskArray(data.profileExtra.commonInterests);

            data.lookingFor = data.profileExtra.casualDates === 1 ? "Casual Dates, " : "";
            data.lookingFor += data.profileExtra.hookups === 1 ? "Hookups, " : "";
            data.lookingFor += data.profileExtra.longTerm === 1 ? "Long-Term, " : "";
            data.lookingFor += data.profileExtra.relationship === 1 ? "Relationship, " : "";
            data.lookingFor += data.profileExtra.friends === 1 ? "Friends, " : "";

            if (typeof data.imow !== "undefined")
            {
                data.imow = data.imow.replace(/(?:\r\n|\r|\n)/g, '<br />');
            }
            if (typeof data.ideal !== "undefined")
            {
                data.ideal = data.ideal.replace(/(?:\r\n|\r|\n)/g, '<br />');
            }
			
			if (data.interests.length == 0 ){
            	data.interests[0] = -1;
            }
            for (var i = 0; i < data.interests.length; i++)
            {
                data.interests[i] = {
                    'name': returnName($scope.interestsBinary, "letter", data.interests[i]),
                    'class': returnClass($scope.interestsBinary, "letter", data.interests[i])
                };
            }
            
			if (data.findMeAt.length == 0 ){
            	data.findMeAt[0] = -1;
            }
            for (var i = 0; i < data.findMeAt.length; i++)
        	{
         	    data.findMeAt[i] = {
            	   'name': returnName($scope.findMeAtBinary, "letter", data.findMeAt[i]),
             	   'class': returnClass($scope.findMeAtBinary, "letter", data.findMeAt[i])
             	};
          	}          

            if (data.incommon.length > 0)
            {
                for (var i = 0; i < data.incommon.length; i++)
                {
                    data.incommon[i] = {
                        'name': returnName($scope.interestsBinary, "letter", data.incommon[i]),
                        'class': returnClass($scope.interestsBinary, "letter", data.incommon[i])
                    };

                    data.commonCheck = true;
                }
            } 
            else
            {
                data.commonCheck = false;
            }

            for (var i = 0; i < data.language.length; i++)
            {
                data.language[i] = " " + returnName($scope.language, "letter", data.language[i].toLowerCase());
            }

            data.carouselPictures = data.pictures.slice(0);

            if (data.pictures.length > 0)
            {
                data.full = '/pictures/' + data.pictures[0];
                data.large = '/pictures/thumb/' + data.pictures[0].replace('.jpeg', 'l.jpeg');
                data.medium = '/pictures/thumb/' + data.pictures[0].replace('.jpeg', 'm.jpeg');
                data.small = '/pictures/thumb/' + data.pictures[0].replace('.jpeg', 's.jpeg');
                data.carouselPictures.shift();
            }
            
            data.privatePictures = data.privatePictures.slice(0);

            ll.updateProfileDataForUserId(data.userId, data);
        }
        
        $scope.user = data;

        $scope.Page.setTitle(data.nickname);
        
        //
        // In Common Anchor
        //
        $('.in-common-yes').click(function ()
        {
            $('html,body').animate({scrollTop: $('#incommon').offset().top});
        });
        //

        // private photo teaser messages
        if ( $scope.AccountInfo.get() == undefined ) {

            getAccountInfo.speak( function(){
                $scope.privateTeaserStatus = $scope.getPrivateTeaserStatus();
            });            

        } else {

            $scope.privateTeaserStatus = $scope.getPrivateTeaserStatus();
        }
    };

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Check if previewing your own profile, 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	if ($routeParams.preview == 'preview'){
		$('.navbar').hide();
		$('.user-info-mini p').hide();
		$('.user-search-avatar ul').hide();
		$('.block-button').hide();
		$('.report-button').hide();
		$('.back-to-search').hide();
		$('.redBtn.cancel').hide();
		$('.profile-preview').show();
		$('.profile-nav').hide();
	};

    $scope.likeAdd = function( user, afterLike ){
        
        $scope.functions.sendLike(user.userId, 'hotlist', function(){
            
            reloadGalleryData( afterLike );
        }); 
        user.favCheck = 'liked';
    };

    $scope.likeRemove = function( user, afterUnlike ){

        $scope.functions.deleteLike(user.userId, 'hotlist', function(){
            $scope.currentGallery = null; 
            reloadGalleryData( afterUnlike );
        }); 
        user.favCheck = 'like'; 
    };
    
    $scope.executeString = function( evalString ){
        
        eval( evalString );
    };
    
    $scope.isLikeActionAndAlreadyLiked = function(){
        return ( $scope.user.likeSent && $scope.privateTeaserStatus.action_id == 4 );
    };
    
    $scope.getHimOrHer = function(){
        return $scope.user.fullGender;
    }

    $scope.getHisOrHer = function(){
        return ($scope.user.gender === "F" ? "her" : "his" );
    }    
    
    $scope.getNickname = function(){
        return $scope.user.nickname;
    }

    $scope.sendRequestAboutMe = function( userId ){
        $scope.functions.sendRequest( userId, 
            $rootScope.REQUEST_SENT.ABOUT_ME, 
            function(){ showSpinner( $rootScope.REQUEST_SENT.ABOUT_ME); },
            function(){ reloadGalleryData( 
                function(){ 
                    hideSpinner( $rootScope.REQUEST_SENT.ABOUT_ME); 
                }); 
            }
        ); 
    }

    $scope.sendRequestIdealDate = function( userId ){
        $scope.functions.sendRequest( userId, 
            $rootScope.REQUEST_SENT.IDEAL_DATE, 
            function(){ showSpinner( $rootScope.REQUEST_SENT.IDEAL_DATE); },
            function(){ 
                reloadGalleryData( 
                    function(){ 
                        hideSpinner( $rootScope.REQUEST_SENT.IDEAL_DATE);
                    }
                ); 
            } 
        ); 
    }

    $scope.sendFavInProfileView = function ( user ){
    
        $scope.functions.sendFavorite( user.userId, 'hotlist', 
            function(){ user.likeCheck = 'favorited'; }
        );
    };

    function privateTeaserGoNow(){
        window.location.href = $scope.SUBCRIPTION_URL; 
    }

    function privateTeaserSend(){
        $scope.functions.sendRequest( $scope.user.userId, $rootScope.REQUEST_SENT.PRIVATE_PHOTO, 
            function(){ showSpinner(); }, 
            function(){ reloadGalleryData( function(){ hideSpinner(); } ); } 
        ); 
    }

    $scope.publicTeaserSend = function(){
        $scope.functions.sendRequest( $scope.user.userId, $rootScope.REQUEST_SENT.PUBLIC_PHOTO, 
            function(){ showSpinner(); }, 
            function(){ reloadGalleryData( function(){ hideSpinner(); } ); } 
        ); 
    }

    function privateTeaserLike(){
        
        showSpinner();
        $scope.likeAdd( $scope.user, function(){ hideSpinner(); } ); 
    }

    function privateTeaserUnlike(){
        
        showSpinner();
        $scope.likeRemove( $scope.user, function(){ hideSpinner(); } ); 
    }

    function showSpinner( name ){
        $timeout(function(){
            $scope.spinner[name||'default'] = true;
        });
    };

    function hideSpinner( name ){
        $timeout(function(){
            $scope.spinner[name||'default'] = false;
        });
    };

    function reloadGalleryData( afterLoad ){
        
        ll.getProfileForUserId ($route.current.params.userID, function (data)
        {
            populateCurrentUserWithData( data );

            if ( $scope.currentGallery === GALLERY.PRIVATE_TEASER ){
                if ($scope.user.privatePictures.length > 0 ){
                    $scope.currentGallery = GALLERY.PRIVATE;
                } else {
                    $scope.currentGallery = GALLERY.PRIVATE_TEASER;
                }
            }

            if ( afterLoad != undefined ){
                
                afterLoad();
            }

        }, false ); // force reload from API
    };

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ProfileController.loadData = function ($q, $route, ll)
{
    var theData = $q.defer();
    
    ll.getProfileForUserId ($route.current.params.userID, function (data)
    {
        theData.resolve({
            getData: function ()
            {
                return data;
            }
        });
    });
    
    return theData.promise;
};

app.controller('DashboardController', function(Page, $http,$scope,$window, $routeParams, search, ngDialog, ajaxRequest,
    $location, $rootScope, Utils, RightSlider, AccountInfo, getAccountInfo, ViewMyProfile, myInformation, socket, $timeout ){

    $scope.Page = Page;
    $scope.Page.setTitle('Dashboard');
	$scope.ACTION              = $rootScope.ACTION;
	$scope.allMessagesSelected = false;
	$scope.RightSlider         = RightSlider;
	$scope.ViewMyProfile       = ViewMyProfile;
	$scope.rightSliderLoading  = true;
    
	var siteURL = document.URL.split('/');
	
	if(siteURL[5] == "membership" || siteURL[4] == "membership"){
		$scope.billing = true;
	}else {
		$scope.billing = false;
	}	

	////////////// TABLET ORIENTATION //////////////
	if(window.orientation == 180){
		alert('We recommend using lavalife in landscape orientation');
	}
	window.addEventListener("orientationchange", function() {
		if(window.orientation == 180){
			alert('We recommend using lavalife in landscape orientation');
		}
	}, false);

    
    $scope.jsessionid = $.cookie('jsessionid');
    
    $scope.functions.updateCounts();
    setInterval(function ()
    {
    	if (!$scope.socketConnected) $scope.functions.updateCounts();
    }, 10000);


    $scope.blockUserOpen = function (userId,userName) {
		$scope.blockUserId = userId;
        $scope.blockUserName = userName;
		ngDialog.open({ template: 'partials/block-user.html?v2', scope: $scope });
	};
    $scope.showBlockedUsername = function(){
       
        var name;
        if ( $scope.blockUserName == undefined ){
            name = 'this member';
        } else {
            name = $scope.blockUserName;
        }
        return name;
    }
	$scope.reportUserOpen = function (userId) {
		$scope.reportUserId = userId;
		ngDialog.open({ template: 'partials/report-user.html?v2', scope: $scope });
	};
	
	$scope.sendNewMessageOpen = function (user) {

        // get profile first to check for eligibleSendMessage
	    var postData = { userId: user.userId };
	    var url      = '/member/dating/v1.1/json/search/viewProfileByUserId';
	    var success  = function(data){
           
           $scope.showSend = false;
            
            var postData1 = { userId: user.userId, showResponseGeneratedByCannedMessage: 1 };
            var url1 = '/member/v1.1/json/stats/conversation/list';
            var error1 = function (errorData) {};
            var success1 = function (successData){
                
                var messagesReceived = $.grep( successData, function(e){ return e.boxType == 1; });
                var conversationIsReplying = ( messagesReceived.length > 0);
				
				console.log(ViewMyProfile.get().emailStatus);
				
				if (ViewMyProfile.get().emailStatus != $rootScope.EMAIL_STATUS.EMAIL_STATUS_VERIFIED) {
				 
						ngDialog.open({ template: 'partials/message-verify-email.html' });
						
				} else if ( ViewMyProfile.get().memberLevel == $rootScope.MEMBER_LEVELS.FREE_TRIAL && !conversationIsReplying ) {
                 
                    if ( ViewMyProfile.get().messageLimit == $rootScope.MESSAGES_REMAINING.FIRST ){
                        
                        $scope.newMessageUserId = user.userId;
                        $scope.newMessageUser = user;
                        ngDialog.open({ template: 'partials/message-free-trial-first.html', scope: $scope });

                    } else if (ViewMyProfile.get().messageLimit == $rootScope.MESSAGES_REMAINING.WARNING){
                           
                        $scope.functions.setSentFalse();
                        $scope.newMessageUserId = user.userId;
                        $scope.newMessageUser = user;
                        ngDialog.open({ template: 'partials/send-message-warning.html', scope: $scope });

                    } else if (ViewMyProfile.get().messageLimit == $rootScope.MESSAGES_REMAINING.LIMIT){

                        ngDialog.open({ template: 'partials/message-free-trial-limit.html' });
					
					} else {

                        $scope.functions.setSentFalse();
                        $scope.newMessageUserId = user.userId;
                        $scope.newMessageUser = user;
                        ngDialog.open({ template: 'partials/send-message.html?v5', scope: $scope });
                    }

                } else if ( data.eligibleSendMessage ){

                    $scope.functions.setSentFalse();
                    $scope.newMessageUserId = user.userId;
                    $scope.newMessageUser = user;
                    ngDialog.open({ template: 'partials/send-message.html?v5', scope: $scope });
               
                } else {
                
                    $('#subscriptionExpiredModal').modal('show');
                    $('#subscriptionExpiredModal #positive').click(function(){
                        
                       $window.location.href = "/subscription.html#/membership/subscription";
                    });
                }

            };
            
           ajaxRequest.speak(url1, success1, error1, postData1);
 
        }
        
        var error = function(data){ };
 
 	    ajaxRequest.speak(url,success,error,postData);
    };
    
    $scope.openNewMessage = function( user ){
        
        $scope.functions.setSentFalse();
        $scope.newMessageUserId = user.userId;
        $scope.newMessageUser = user;

        ngDialog.open({ template: 'partials/send-message.html?v5', scope: $scope });

    };

	$scope.blockUser = function(userId){
	
		var postData = { userId: userId };
		var url = '/member/dating/block/user';
		var success = function(data){

            ngDialog.open({ template: 'partials/block-user-after.html?v2', scope: $scope });

            if ( $rootScope.msgType != undefined ){
                $scope.functions.messageReload( $rootScope.msgType, function(){
                    var message = $rootScope.messages[0];
                    if ( message != undefined ){
                        $scope.functions.openMessage(message.userId,message.profilePicture,$scope.avatar,message.userId);
                    } else {
                        $rootScope.conversation = null;
                    }
                });
            }
        };	
		var error = function(data){ };
		
		ajaxRequest.speak(url,success,error,postData);
	}

    $scope.go = function( path ){
        $location.path( path );
    }

	$scope.reportUser = function(userId,report){
	
		var postData = { abusiveUserId: userId, abusiveReportId: report };
		var url = '/member/report/submit';
		var success = function(data){ 
        
            if ( $rootScope.msgType != undefined ){
                $scope.functions.messageReload( $rootScope.msgType, function(){
                    var message = $rootScope.messages[0];
                    if ( message != undefined ){
                        $scope.functions.openMessage(message.userId,message.profilePicture,$scope.avatar,message.userId);
                    } else {
                        $rootScope.conversation = null;
                    }
                });
            }
        };	
		var error = function(data){ };
		
		ajaxRequest.speak(url,success,error,postData);
	}
	
	function getUrlParameter(sParam){
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) 
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	}  	
	
	var deepAction = getUrlParameter('open');
	
	setTimeout(action, 300);
	function action(){
		if (deepAction == 'likes'){$scope.functions.openLikes($rootScope.likesType);}
		if (deepAction == 'messages'){$scope.functions.openMessages();}
		if (deepAction == 'views'){$scope.functions.openViews($rootScope.viewsType);}
	}
	
	if ($.cookie("messages")){
		$scope.functions.openMessages();
		//$.removeCookie("messages");
	}
	/* ****************************************************************** */
	/* ************ Grab Current Users Profile info ***************** */
	/* ****************************************************************** */
	function forumLogin(userInfo, jsessionId){
		$('.forum-form [name=userId]').val(userInfo.userId);
		$('.forum-form [name=jsessionId]').val(jsessionId);
		$('.forum-form [name=email_address]').val(userInfo.email);
		$('.forum-form [name=username]').val(userInfo.dating.nickname);
		$('.forum-form [name=cj]').val(Utils.appendCJAffiliate());
		$('.forum-form').unbind().submit();
	}
	
    var userInfo = function(data) {

        $scope.ViewMyProfile.load(data);
		
		console.log(data);

	    $scope.accountInfo = AccountInfo;
		getAccountInfo.speak($scope, AccountInfo); 
		
		$('#formLink').click(function(){
			forumLogin(data,$scope.jsessionid);
		});
	
		$scope.confirmAutoRenew = function(){
			$http({
				method : 'POST',
				url : '/member/billing/startAutoRenew;jsessionid=' + $scope.jsessionid
			}).success(function(data) {});
		}
        
		var minAgeDefault = data.age - 10 > 18 ?  data.age - 10 : 18;
		var maxAgeDefault = data.age + 10 < 99 ?  data.age + 10 : 99;
        
        // TODO: remove when right slider is completed
		//$scope.marketingMessage = data.gender == data.profileExtra.targetGender ? 'partials/marketing/' + 3 + '.html' : 'partials/marketing/' + data.profileExtra.profileTag + '.html';

        $scope.myId     = data.userId;
        $scope.nickname = data.dating.nickname;
        $scope.gender   = data.gender;
        $scope.city     = data.city;
        $scope.age      = data.age;
        
        socket.on('connect_error', function (data) { console.log("socket: connect_error: ", data); });
        socket.on('connect_timeout', function (timeout) { console.log("socket: connect_timeout: ", timeout); });
        socket.on('error', function (data) { console.log("socket: error: ", data); });
        socket.on('reconnect', function (attempt) { console.log("socket: reconnect - attempt: ", attempt); });
        socket.on('reconnect_attempt', function (attempts) { console.log("socket: reconnect_attempt - attempts: ", attempts); });
        socket.on('reconnect_failed', function () { console.log("socket: reconnect_failed"); });
        socket.on('reconnect_error', function (data) { console.log("socket: reconnect_error: ", data); });
        socket.on('reconnecting', function (attempts) { console.log("socket: reconnecting - attempts: ", attempts); });
        
        //
        // the following fixes a glitch in Chrome that prevents the 'connect' event to fire; to fix it the 
        // socket connection needs to be recycled.
        // it does not seem to be a problem with firefox and chrome though, but we'll leave it here for everyone
        // just in case.
        //
        $timeout(function() 
        {
            if (!$scope.socketConnected || typeof $scope.socketConnected === 'undefined')
            {
                console.log("socket: failed to connect, recycling");
                
                socket.disconnect();
                
                $timeout(function()
                {
                    socket.connect();
                }, 1000);
            }
        }, 2000);
        
        socket.on('connect', function ()
        {
            $scope.socketConnected = true;
            console.log("socket: connected");
            socket.emit('set-session-id', {
                sessionId: $scope.jsessionid,
                nickname: $scope.nickname,
                userId: $scope.myId
            });
        });
        
        socket.on('disconnect', function ()
        {
            console.log("socket: disconnected");
            $scope.socketConnected = false;
        });

        socket.on('reload-mycounts', function (data)
        {
            $scope.functions.updateCounts();
        });
        
        socket.on('reloadProfile', function()
        {
            var success = function(data){
                $scope.ViewMyProfile.load(data); 
            };
            var error = function(data){};
            
            myInformation.speak( success, $scope.ViewMyProfile, error );
        });

        socket.on('logout', function (data)
        {
            window.location.href = "logout.html?page=login";
        });
        
        socket.on('refresh', function (data)
        {
            if (confirm('We have recently made some changes to the website.\nDo you want to reload this page to apply the changes?'))
            {
                window.location.reload(true);
            }
            else
            {
                alert('Put something up to remind them to refresh the page');
            }
        });

		$http({
			method : 'POST',
			url : '/member/json/myprofile/edit/pictures;jsessionid=' + $scope.jsessionid
		}).success(function(data) {	
			for (i=0;i<data.list.length;i++){
				if (data.list[i].d == "profile"){
					$scope.avatar = data.list[i].filename;
				}
			}
		});
		
		$scope.openingLine = data.dating.openingline;
		$scope.myZodiac = data.zodiac;
		
		/* ****************************************************************** */
		/* ************ Check for popup messages ***************** */
		/* ****************************************************************** */
		
		$http({
			method : 'POST',
			url : '/member/alert/popupmessage;jsessionid=' + $scope.jsessionid
		}).success(function(data) {
			//console.log(data);
            for (i=0;i<data.length;i++){
                if (data[i] == 1){
                    console.log('auto renew');
                    ngDialog.open({ template: 'partials/auto-renew.html?v2', scope: $scope });	
                }
            }
		});
		
		/* ****************************************************************** */
		/* ************ Get right slider info ***************** */
		/* ****************************************************************** */
	    
        $scope.rightSliderLoading = true;
		
        $http({
			method : 'POST',
			url : '/member/alert/rightslider;jsessionid=' + $scope.jsessionid

		}).success(function(data) {
		    
            RightSlider.init( data );
            $scope.rightSliderLoading = false;

		}).error( function(data){

		    RightSlider.init( data );
            $scope.rightSliderLoading = false;
        });
		
		/* ****************************************************************** */
		/* ************ Push user to edit profile if their profile is incomplete ***************** */
		/* ****************************************************************** */
		
		var required = [];
        profileCheck(required, data);
		
		function profileCheck(required, data){
				
                $scope.accountInfo = AccountInfo;
				getAccountInfo.speak($scope, AccountInfo); 

				$scope.confirmAutoRenew = function(){
					$http({
						method : 'POST',
						url : '/member/billing/startAutoRenew;jsessionid=' + $scope.jsessionid
					}).success(function(data) {});
				}
		
				var errors = [];
				for (i=0;i<required.length;i++){
					if (data[required[i]] == undefined || data[required[i]].length < 1 || data[required[i]] == 'z'){
						if (data.profileExtra[required[i]] == undefined || data.profileExtra[required[i]] <1 || data.profileExtra[required[i]] == '0'){
							errors.push(required[i]);
						}
					}
				}
				$http({
					method : 'POST',
					url : '/member/json/myprofile/edit/pictures;jsessionid=' + $scope.jsessionid
				}).success(function(data) {	
					var hasDisplayPic = 0;
					for (i=0;i<data.list.length;i++){
						if (data.list[i].d == "profile"){
							hasDisplayPic = 1;
						}
					}
					
					if (hasDisplayPic == 0){
	                    errors.push('picture');
				    }		
				
				    if (errors.length > 0){
						if($location.path() != '/myProfile/' && $location.path() != '/myProfile/newUser/'){
							$location.path('/myProfile');
						}
				    }             
				});
				
				/* ****************************************************************** */
				/* ************ Check if the user has free trial and adjust tutorial ***************** */
				/* ****************************************************************** */
				
				if(data.profileExtra.profileStatus == 2){
					edit = data;
					$http({
						method : 'POST',
						url : '/member/billing/freetrialSubscription;jsessionid=' + $scope.jsessionid
					}).success(function(data) {
						console.log(data);
						if(data.freeTrial == false){							
							//$('#account-modal').modal('show'); 
							edit.profileExtra.profileStatus = 4;
							$http({
								method : 'POST',
								url : '/member/v1.1/json/myprofile/saveProfile',
								dataType: 'json',
								data: edit,
								headers: {
									"Content-Type": "application/json"
								}
							}).success(function(data) {
								
							});
						}else{
							edit.profileExtra.profileStatus = 4;
							$http({
								method : 'POST',
								url : '/member/v1.1/json/myprofile/saveProfile',
								dataType: 'json',
								data: edit,
								headers: {
									"Content-Type": "application/json"
								}
							}).success(function(data) {
								//window.location.reload();
							});
						}						
					});
				}
		}
		
		$window.ga('send', 'pageview', { page: '/dashboard.html'});
                // TODO: This needs to be revisited
                $scope.$on('$locationChangeStart', function(event) {
                    $window.ga('send', 'pageview', { page: $location.path() });
                });
		
        for(i=0;i<$scope.covers.length;i++){
			if(data.profileExtra.background == $scope.covers[i].letter){
				$rootScope.bg = $scope.covers[i].name;
			}
		}

    };	

	myInformation.speak( userInfo, $scope.ViewMyProfile, function(data){
        if ( data.session == "-1" ){ window.location.href = 'logout.html?page=login'; }
    });


	$scope.messagesChecked = [];

	$scope.$watch('messages', function() {
		
		// neat way to empty an array;		
		while ($scope.messagesChecked.length) { $scope.messagesChecked.pop(); }
	
		if ( $rootScope.messages == undefined || $rootScope.messages.constructor !== Array ){
			return;
		}		

		$.grep( $rootScope.messages, function(e){
			if ( e.checked ){
				$scope.messagesChecked.push(e);
			} 
		});
	}, true);
    
    $scope.selectAllMessages = function( t ){
        
        for ( i = 0; i < $scope.messages.length; i++ ){
            var message = $scope.messages[i];
            message.checked = t;
        }
    }

	$scope.confirmAction = function( action ){
		
		if ( action.id == $scope.ACTION.DELETE.id ){

			//console.log("confirm delete message");
			$scope.confirmPositiveAction = deleteMessages;
            if ( $scope.messagesChecked.length == $scope.messages.length ){
                $scope.confirmMessage = $scope.ACTION.DELETE.message2;
            } else {
                $scope.confirmMessage = $scope.ACTION.DELETE.message1;
            }

		} else if ( action.id == $scope.ACTION.MARK_AS_READ.id ) {
			
			//console.log("confirm mark read message");
			$scope.confirmPositiveAction = markReadMessages;
            if ( $scope.messagesChecked.length == $scope.messages.length ){
                $scope.confirmMessage = $scope.ACTION.MARK_AS_READ.message2;
            } else {
                $scope.confirmMessage = $scope.ACTION.MARK_AS_READ.message1;
            }
		}
		// $scope.action = action;
		ngDialog.open({ template: 'partials/confirm-action.html?v5', scope: $scope });	
	};
	
	var deleteMessages = function(){
		
		//console.log('deleteMessages');
		$scope.positiveActionRunning = true;
		
		var requests = [];
		for ( i = 0; i < $scope.messagesChecked.length; i++ ){
			var msg = $scope.messagesChecked[i];
			requests.push( { url: '/member/action/messages/update' , data: { userId: msg.userId, status: "T" } } );
		}
		
		ajaxRequest
			.serialize( requests )
			.then(
				function() {
					$scope.functions.messageReload( $rootScope.msgType, function(){
						$scope.positiveActionRunning = false;
						ngDialog.closeAll();     
					});
        		}			
			);	
	};

	var markReadMessages = function(){

		//console.log('markReadMessages');
		$scope.positiveActionRunning = true;
		
		var requests = [];
		for ( i = 0; i < $scope.messagesChecked.length; i++ ){
			var msg = $scope.messagesChecked[i];
			requests.push( { url: '/member/action/messages/update' , data: { userId: msg.userId, status: "S" } } );
		}
		
		ajaxRequest
			.serialize( requests )
			.then(
				function() {
					$scope.functions.messageReload( $rootScope.msgType, function(){
						$scope.positiveActionRunning = false;
						ngDialog.closeAll();     
					});
        		}			
			);	
	};
    
    $scope.clearCookie = function (){
        
        $.removeCookie( $rootScope.CURRENT_PAGE ); 
    }
    
    $scope.isMessageSelected = function( userId ){
        return userId === $rootScope.idSelected;
    }

	$scope.$on('$locationChangeStart', function(event) {
        
        $scope.functions.closeMessages();
    });

    $scope.getOpenedMessageNickname = function(){
        return $rootScope.openedMessageNickname;
    }

    $scope.getMyNickname = function(){
        return $scope.ViewMyProfile.get().dating.nickname;
    }
    
    $scope.resendVerifyEmail = function(){
        
        var url = '/member/sendVerifyEmail';
        var success = function(){ $scope.resending = false; $scope.resendSuccess = 1; };
        var error = function(){ $scope.resending = false; $scope.resendSuccess = 0; };
        var postData = {};

        $scope.resending = true;
        ajaxRequest.speak( url,success,error,postData );
		
		ngDialog.open({ template: 'partials/verify-email-sent.html', scope: $scope });

    }
	
	
});

app.controller('MessagesController', function($http,$scope, $routeParams, $rootScope,$timeout, $sce, ajaxRequest){

	$scope.jsessionid = $.cookie('jsessionid');
	
	/* ****************************************************************** */
	/* ************ User Selected / Unselected a Message (click) ***************** */
	/* ****************************************************************** */
	
	/*$(document).on( "click", ".message-select", function() {
			
		if( $(this).hasClass("selected")  ){
			removeMessageSelect();
			$(this).removeClass("selected");
		}else{
		
			selectMessage($(this).attr("id"),$(this).attr("rel"));
			$(".message-select").removeClass("selected");
			$(this).addClass("selected");
		
		}
		
	});*/
	
	/* ****************************************************************** */
	/* ************ User Send a Reply (Click) ***************** */
	/* ****************************************************************** */
	
	/*$(document).on( "click", "#reply-message", function() {
		
		if( $("#reply-content").val() == "" ){
			$("#reply-content").parent().addClass("has-error");
		}else{
			var content = $("#reply-content").val();
			$("#reply-content").parent().removeClass("has-error");
			$("#reply-content").val('');
			sendMessage(content);
		}
				
	});*/
	
	/* ****************************************************************** */
	/* ************ Delete Chat ***************** */
	/* ****************************************************************** */
	
	/*$(document).on( "click", ".delete-messages", function() {
		deleteMessages( $(".userId").val() );
	});
	
	$(document).on( "click", ".delete-messages-right", function() {
		deleteMessages( $(this).attr("rel") );
		return false;
	});*/
	
	/* ****************************************************************** */
	/* ************ Load Recent Messages ***************** */
	/* ****************************************************************** */

	/*var postData = { messageType: "mailGroup", boxType: "Received", resultPerPage: 25  };
	var url = '/member/mailbox/getList';
	
	var success = function(data){
		console.log(data);
		$scope.messages = [];
		
		for( i=0; i < data.list.length; i++ ){
			$scope.messages.push(data.list[i]);
			data.list[i].date = dateToMonthDay(data.list[i].date);
		};
		
	};
	
	var error = function(data){ };
	
	ajaxRequest.speak(url,success,error,postData);*/
	
	
	function loadRecievedMessages(){
		var postData = { messageType: "mailGroup", boxType: "Received", resultPerPage: 12  };
		var url = '/member/mailbox/getList';
		
		var success = function(data){
			console.log(data);
			$scope.messages = [];
			
			for( i=0; i < data.list.length; i++ ){
				$scope.messages.push(data.list[i]);
				data.list[i].date = dateToMonthDay(data.list[i].date);
			};
			
		};
		
		var error = function(data){ };
		
		ajaxRequest.speak(url,success,error,postData);
	}
	
	
	/* ****************************************************************** */
	/* ************ Select Specific Message ***************** */
	/* ****************************************************************** */
	
	/*function selectMessage(userId,image){
		
		var postData = { userId: userId };
		var url = '/member/v1.1/json/stats/conversation/list';
		var success = function(data){
			$scope.conversation = [];
			
			for( i=0; i < data.length; i++ ){
				$scope.conversation.push(data[i]);
				data[i].class = data[i].boxType == 1 ? "pull-left" : "pull-right";
				data[i].date = dateToMonthDay(data[i].timestamp);
				data[i].image =  data[i].boxType == 1 ? image : "images/uploads/george_costanza006.jpg";
				data[i].userId = userId;
			}
			
			$scope.conversation.reverse();
			$("#reply-holder").removeClass("hidden");
			$(".messages-right").animate({"scrollTop": $('.messages-right')[0].scrollHeight}, "slow");
			markSeen(userId);

		};
		var error = function(data){ };
		
		ajaxRequest.speak(url,success,error,postData);
	
	}*/
	
	/* ****************************************************************** */
	/* ************ Send Message ***************** */
	/* ****************************************************************** */
	
	/*function sendMessage(message){
		
		var userId = $(".userId").val();
		var userImage = $(".userImage").val();
		var postData = { targetId: userId, text: message };
		var url = '/member/dating/json/im/send';
		var success = function(data){
			selectMessage(userId, userImage);
		};
		var error = function(data){ };
		
		ajaxRequest.speak(url,success,error,postData);

	}*/
	
	/* ****************************************************************** */
	/* ************ Un Select Message ***************** */
	/* ****************************************************************** */
	
	function removeMessageSelect(){
		$scope.$apply(function () {
			$scope.conversation = [];
		});
		$("#reply-holder").addClass("hidden");
		$("#reply-content").val('');
	}
	
	/* ****************************************************************** */
	/* ************ Delete Message ***************** */
	/* ****************************************************************** */

	/*function deleteMessages(userId){
		
		var postData = { userId: userId, status: "T" };
		var url = '/member/action/messages/update';
		var success = function(data){
			$("#" + userId).fadeOut("slow", function(){
				loadRecievedMessages();
			});
			$scope.conversation = [];
			$("#reply-holder").addClass("hidden");
			$("#reply-content").val('');
		};
		var error = function(data){ };
		
		ajaxRequest.speak(url,success,error,postData);
	
	}*/
	
	function markSeen(userId){	
		var postData = { userId: userId, status: "S" };
		var url = '/member/action/messages/update';
		var success = function(data){
			$("#" + userId + " h2").removeClass("status-N");
		};
		var error = function(data){ };
		
		ajaxRequest.speak(url,success,error,postData);
	}

});
app.controller("AccountController", function( Page, $scope, $routeParams, $http, myInformation) {

	$scope.Page = Page;
	$scope.Page.setTitle('My Account');

	$http({
		method : 'POST',
		url : '/member/billing/accountInfo;jsessionid=' + $scope.jsessionid
	}).success(function(data) {
		if(window.location.href == "http://www.lavalife.com/subscription.html#/account"){
			window.location.href = "http://www.lavalife.com/dashboard.html#/account/";
		}
		
		$scope.cards = data.creditCards;
		$scope.packages = data.offerDetails;
		$('#myAccount').addClass('active');
		

		//Preferences Checkbox Handlers//

		myInformation.speak( function(data){
			var newsletter = data.newsletterEmail;
			var AUE = data.accountUpdateEmail;

			if(AUE == 'Y'){$("[name='notifications']").attr('checked','checked');}
			if(newsletter == 'Y'){$("[name='newsletter']").attr('checked','checked');}		
			
			$("input[type='radio']:not(label.radio input), input[type='checkbox']:not(label.checkbox input, .chat-box input, .messages-left input) ").ionCheckRadio();
			
			//////////// Update Preferences Checkboxes //////////////////
			$('input[type=checkbox][name=notifications]').change(function(){
				if(AUE == 'N'){
					AUE = 'Y';
					$http({
						method : 'POST',
						url : '/member/account/newsletter/save?accountUpdate=Y&newsletter='+newsletter+'&promos=Y&mobilePush=Y;jsessionid=' + $scope.jsessionid
					});
				}else{
					AUE = 'N';
					$http({
						method : 'POST',
						url : '/member/account/newsletter/save?accountUpdate=N&newsletter='+newsletter+'&promos=Y&mobilePush=Y;jsessionid=' + $scope.jsessionid
					})			
				}
			});

			$('input[type=checkbox][name=newsletter]').change(function(){			
				if(newsletter == 'N'){
					newsletter = 'Y';
					$http({
						method : 'POST',
						url : '/member/account/newsletter/save?newsletter=Y&accountUpdate='+AUE+'&promos=Y&mobilePush=Y;jsessionid=' + $scope.jsessionid
					});
				}else{
					newsletter = 'N';
					$http({
						method : 'POST',
						url : '/member/account/newsletter/save?newsletter=N&accountUpdate='+AUE+'&promos=Y&mobilePush=Y;jsessionid=' + $scope.jsessionid
					});			
				}
			});
		});

		/* ****************************************************************** */
		/* ************ BLOCKED USERS ***************** */
		/* ****************************************************************** */	
		
		$http({
			method : 'POST',
			url : '/member/dating/json/search/predefined/blocklist;jsessionid=' + $scope.jsessionid
		}).success(function(data) {
			$scope.blocked = data.list;			
			if (data.nav.next){
				var searchId = data.nav.searchId;
				var page = data.nav.next;
				$http({
					method : 'POST',
					url : '/member/dating/json/search/subsequent/page;jsessionid=' + $scope.jsessionid + '?searchId=' + searchId + '&page=' + page
				}).success(function(data) {
					$.merge($scope.blocked, data.list);
				});
			}
		});
		
		$scope.unblockUser = function(id){
			$http({
				method : 'POST',
				url : '/member/dating/unblock/user;jsessionid=' + $scope.jsessionid + '?userId=' + id
			}).success(function(data) {
				$http({
					method : 'POST',
					url : '/member/dating/json/search/predefined/blocklist;jsessionid=' + $scope.jsessionid
				}).success(function(data) {
					$scope.blocked = data.list;
				});
			});
		}
		
		$('#change-password .save').click(function(){
			if ($('[name=newPass]').val() == $('[name=confirmPass]').val()){
				$http({
					method : 'POST',
					url : '/member/account/secure_info/save;jsessionid=' + $scope.jsessionid + '?oldpasswd=' + $('[name=oldPass]').val() + '&password=' + $('[name=newPass]').val()
				}).success(function(data) {
					if (data.length < 100){
						$('#passChangeModal .modal-title').html('Your password has been changed.');
						$('[name=newPass]').val('');
						$('[name=confirmPass]').val('');
						$('[name=oldPass]').val('');
						
					}else{
						$('#passChangeModal .modal-title').html('Something went wrong! Make sure your old password is correct and you entered your new password correctly both times.');
					}
					$('#passChangeModal').modal('show');
				});
			}
		});

		$('#change-email .save').click(function( event ){
			
			event.stopImmediatePropagation();
			
			var email = $('[name=newEmail]').val();
			var confirmEmail = $('[name=confirmEmail]').val(); 

			if ( !validateEmail( email ) ){
				$('#emailChangeModal .modal-title').html('Oops! Email entered is not valid.');
				$('#emailChangeModal').modal('show');
				return;
			}

			if ( email !== confirmEmail ){
				$('#emailChangeModal .modal-title').html('Oops! Email entered is not the same as Confirm New Email.');
				$('#emailChangeModal').modal('show');	
				return;
			}

			// all good yo!
			$http({

				method : 'POST',
				url : '/member/account/secure_info/emailSave;jsessionid=' + $scope.jsessionid + '?emailLogin=' + $('[name=newEmail]').val()

			}).success(function(data) {

				$('#emailChangeModal .modal-title').html( data.status );
				$('#emailChangeModal').modal('show');

				if ( data.status.match(/successfully/) == null ){ // LOL
					$('[name=newEmail]').val('');
					$('[name=confirmEmail]').val('');
				}
			});
		});
		function validateEmail(sEmail) {

			var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
			if (filter.test(sEmail)) {
				return true;
			} else {
				return false;
			}
		}		

		///////////// MENU TOGGLES ///////////////
		
		$('#account-holder .menu .item').click(function(){
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			
			$('.tabbedContent').css('display','none');
			
			if ($(this).attr("id") == 'preferencesBtn'){
				$('#preferences').css('display','block');
			}
			if ($(this).attr("id") == 'blockedBtn'){
				$('#blockedUsers').css('display','block');
			}
		});
		
		$scope.selectedReason = [];
		$scope.resetReason = function(){
			$scope.selectedReason = [];
		}
		
		$scope.reactivate = false;
		
		$scope.deleteConfirm = function(){
			if($scope.selectedReason.letter){
				$('#delete-modal button').removeClass('has-error');
				$('#delete-modal').modal('hide');
				$('#deleted-modal').modal('show');
			}else{
				$('#delete-modal button').addClass('has-error');
			}
		}
		
		$scope.deactivateConfirm = function(){
			if($scope.selectedReason.letter){
				$('#deactivate-modal button').removeClass('has-error');
				$('#delete-modal').modal('hide');
				$('#deactivate-modal').modal('hide');
				$('#deactivated-modal').modal('show');
			}else{
				$('#deactivate-modal button').addClass('has-error');
			}
		}
		
		$scope.cancelDelete = function(){
			window.location.reload();
		}
		
		$scope.deleteAccount = function(type){		
			if (type == 'Y'){
				var typeText = '.delete-explain';
			}else{
				var typeText = '.deactivate-explain';
			}
			
			var destroy = [{reason: $scope.selectedReason.letter, other: $(typeText).val(), remove: type}];
			console.log(destroy);
			$http({
				method : 'POST',
				url : '/member/account/delete/save',
				dataType: 'json',
				data: destroy[0],
				headers: {
					"Content-Type": "application/json"
				}
			}).success(function(data){
				window.location.href = "logout.html?page=index";
			});			
		}
		
		$('#deleted-modal').on('hidden.bs.modal', function () {
			$scope.deleteAccount('Y');
		})	

		$('#deactivated-modal').on('hidden.bs.modal', function () {
			$scope.deleteAccount('N');
		})		

	});
});

app.controller('LogoutController', function($http, ajaxRequest, $rootScope){
	
    function getUrlParameter(sParam){
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) 
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	}  
	var thisPage = getUrlParameter('page');
	
	function redirectUser(){
        
        // clear those FB cookies
		$.removeCookie( $rootScope.FB_ACCESS_TOKEN );
        $.removeCookie( $rootScope.FB_EMAIL );
		$.removeCookie( $rootScope.FB_PICTURE );
		$.removeCookie( $rootScope.FB_IS_SILHOUETTE );
		
		// clear jsessionid
		$.removeCookie( 'jsessionid' );
		$.removeCookie( 'jsessionid2' );

		typeof thisPage === 'undefined' ? window.location.href = 'logout-landing.html' : window.location.href = thisPage + '.html?lo=true';
	}
			
	var postData = { };
	var url = '/member/logOut'
	var success = function(data){
        redirectUser();
	};
	var error = function(data){
		redirectUser();
	};
	
	ajaxRequest.speak( url, success, error, postData, true );

});

app.controller("myProfileController", function( Page, $scope, $routeParams, $http, ajaxRequest, $location, $window, $rootScope, Utils) {

    $scope.Page = Page;
	$scope.Page.setTitle('My Profile');

	$http({
		method : 'POST',
		url : '/member/dating/v1.2/json/viewmyprofile;jsessionid=' + $scope.jsessionid
	}).success(function(data) {
		console.log(data);
		//CHANGE FOR LIVE
		if(window.location.href == "http://www.lavalife.com/subscription.html#/myProfile"){
			window.location.href = "http://www.lavalife.com/dashboard.html#/myProfile/";
		}
		var edit = data;
		$scope.userId = edit.userId;
		
		$scope.idealDate = edit.ideal;
		if(edit.dating.imowPending){
			$scope.imow = edit.dating.imowPending;
		}else{
			$scope.imow = edit.dating.imow;
		}
		if (edit.dating.openingline == "Ask Me Later" && edit.profileExtra.profileStatus == 0){
			$scope.openingLine = "";
		}else{
			$scope.openingLine = edit.dating.openingline;
		}
		
		$scope.age = edit.age;
		
		$('.profileName, .profileStatus').click(function(){
			$('.profileName, .profileStatus').removeClass('inputSwap');
			$(this).addClass('inputSwap');
		});
		
		// if(edit.profileExtra.profileTag == 1 && edit.profileExtra.profileStatus == 0){
		// 	$('#newUserModal').modal('show');  
		//}
		if(edit.profileExtra.targetGender == edit.gender && edit.profileExtra.profileStatus == 0 && edit.profileExtra.profileTag == 0){
			$('#gayUserModal').modal('show');  
		}else if(edit.profileExtra.profileTag == 0 && edit.profileExtra.profileStatus == 0){
			$('#oldUserModal').modal('show');  
		}
		
		$scope.selectedCity = [];
		$scope.selectedCity.city = edit.city;

		if($scope.selectedCity.city == undefined){
			$scope.selectedCity.city = "Select";
			$('#cities').find('.toggle').css('color','#bdbdbd');
		}
		
		/* ****************************************************************** */
		/* ************ Preselect Users Attributes ***************** */
		/* ****************************************************************** */
		
		preselect($scope.body,edit.bodyType,'selectedBodytype');
		preselect($scope.ethnicity,edit.ethnicity,'selectedEthnicity');
		preselect($scope.religion,edit.religion,'selectedReligion');
		preselect($scope.smoking,edit.smoke,'selectedSmoking');
		preselect($scope.drinking,edit.drink,'selectedDrinking');
		preselect($scope.seekingAlt,edit.profileExtra.targetGender,'selectedSeeking');
		preselect($scope.hasChildren,edit.hasChildren,'selectedChildren');
		preselect($scope.children,edit.wantChildren,'selectedWantChildren');
		preselect($scope.education,edit.education,'selectedEducation');
		preselect($scope.income,edit.income,'selectedIncome');
		
		var inches = edit.heightInches;
        var feet = Math.floor(inches / 12);
        var inches_remain = inches % 12;
        $scope.myHeight = feet+"."+ inches_remain;
		preselect($scope.heightFeet,$scope.myHeight,'selectedHeight');
		
		preselect($scope.personality,edit.profileExtra.personality,'selectedPersonality');
		preselect($scope.statusBinary,edit.profileExtra.status,'selectedStatus');
		preselect($scope.daysAlt,edit.birthDay,'selectedDay');
		preselect($scope.monthsAlt,edit.birthMonth,'selectedMonth');
		preselect($scope.yearsAlt,edit.birthYear,'selectedYear');
		

		function preselect(list,attribute,item){
			for (i=0;i<list.length;i++){				
				if(list[i].letter == attribute){
					$scope[item] = list[i];
				}
				if(list[i].number == attribute){
					$scope[item] = list[i];
				}
				if(list[i].city == attribute){
					$scope[item] = list[i];
				}
			}
			if ($scope[item] == undefined){
				$scope[item] = [];
			}
		}		
		
		/* ****************************************************************** */
		/* ************ Bit Wise conversions ***************** */
		/* ****************************************************************** */
		var langydat = [];
		for(i=0;i<edit.languages.length;i++){
			langydat.push(edit.languages[i]);
		}
		binarize('interestsBinary','myInterests', edit.profileExtra.interests, false);
		binarize('findMeAtBinary','findMe', edit.profileExtra.findme, false);
		binarize('languageBinary','selectedLanguages', langydat, true);

		function binarize(binary, item, data, lang){
			if (lang == true){
				$scope[item] = data;
			}else{
				$scope[item] = getMaskArray(data);
			}
			if ($scope[item].length == 0){
				$scope[item][0] = {
					'name': returnName($scope[binary], "letter", $scope[item][0]), 
					'class': returnClass($scope[binary], "letter", $scope[item][0])
				};
			}else{	
				for (i=0;i<$scope[item].length;i++){
					$scope[item][i] = {
						'name': returnName($scope[binary], "letter", $scope[item][i]), 
						'class': returnClass($scope[binary], "letter", $scope[item][i])
					};
				}
			}
		}
		
		/* ****************************************************************** */
		/* ************ Pop Up Handlers  ***************** */
		/* ****************************************************************** */
		
		$('.toggle').click(function(){
			$('.itemPanel').css('display','none')
			$(this).parents().siblings('.itemPanel').css('display','block');	
			$(this).parents('.itemPanel').css('display','none');
		});

		$('.cancel').click(function(){
			$(this).parents('.itemPanel').css('display','none');
		});
		
		/* ****************************************************************** */
		/* ************ Looking For Pop Up  ***************** */
		/* ****************************************************************** */
		
		$('#looking-for .itemPanel .save').click(function(){
			$(this).parents('.itemPanel').find('.icr.enabled').each(function(){
				var value = $(this).siblings('.icr__hidden').find('input').attr('name');
				edit.profileExtra[value] = 0;
			});
			$(this).parents('.itemPanel').find('.icr.enabled.checked').each(function(){
				var value = $(this).siblings('.icr__hidden').find('input').attr('name');
				edit.profileExtra[value] = 1;
			});
			lookingHandler();
			$scope.$apply();
			$('.itemPanel').css('display','none');
		});
			
		function lookingHandler(){
			$('#looking-for').find('.toggle').css('color','#212121');
			
			var looking = [];
			looking.push({'name' : 'Hookups', 'letter' :edit.profileExtra.hookups});
			looking.push({'name' : 'Relationship', 'letter' :edit.profileExtra.relationship});
			looking.push({'name' : 'Long Term', 'letter' :edit.profileExtra.longTerm});
			looking.push({'name' : 'Casual Dates', 'letter' :edit.profileExtra.casualDates});
			looking.push({'name' : 'Friends', 'letter' :edit.profileExtra.friends});
			
			var count = 0;
			$scope.lookingFor = [];
			for (i=0;i<looking.length;i++){
				if (looking[i].letter == '1'){
					count++;		
					$scope.lookingFor.push(looking[i].name);
				}
			}

			if ($scope.lookingFor.length > 1){
				$scope.lookingFor[0] = $scope.lookingFor.length + ' selected';
			}
			if ($scope.lookingFor.length == 0){
				$scope.lookingFor[0] = "Select";
				$('#looking-for').find('.toggle').css('color','#bdbdbd');
			}
		}
		
		/* ****************************************************************** */
		/* ************ Language Pop Up  ***************** */
		/* ****************************************************************** */
		var languages = edit.profileExtra.languages;
		
		$('#langauges .itemPanel .save').click(function(){
			var languagesTotal = [];
			$(this).parents('.itemPanel').find('.icr.enabled.checked').each(function(){
				languagesTotal.push($(this).siblings('.icr__hidden').find('input').attr('name'));
			});
			
			languages = 0;
			$.each(languagesTotal,function() {
				languages += parseInt(this);
			});
			
			edit.languages = [];
			$.each(languagesTotal,function(i) {
				edit.languages.push(parseInt(this));
			});

			binarize('languageBinary','selectedLanguages', languages, false);	
		
			if($scope.selectedLanguages.length > 1){
				$scope.selectedLanguages[0].name = $scope.selectedLanguages.length + ' selected';
			}
			
			$scope.$apply();	
			$(this).parents('.itemPanel').css('display','none');
		});
		
		/* ****************************************************************** */
		/* ************ Interests Pop Up  ***************** */
		/* ****************************************************************** */
		var interests = edit.profileExtra.interests;
		
		$('#interests .itemPanel .save').click(function(){

			$(this).parents('.itemPanel').find('.icr.enabled.checked').each(function(){          
            	if($(this).siblings('.icr__hidden').find('input').attr('name') == -1 || $(this).siblings('.icr__hidden').find('input').attr('name') == 0){
					$(this).removeClass('checked');
           		}
           });

			var numberOfChecked = $(this).parents('.itemPanel').find('.icr.enabled.checked').length;
			if (numberOfChecked > 10){
				$(this).parents('.itemPanel').find('.help-block').css('display','block');
			}else{
				$(this).parents('.itemPanel').find('.help-block').css('display','none');
				interestsTotal = [];
				$(this).parents('.itemPanel').find('.icr.enabled.checked').each(function(){
					interestsTotal.push($(this).siblings('.icr__hidden').find('input').attr('name'));
				});
									
				interests = 0;

				$.each(interestsTotal,function() {
					if (parseInt(this) >= 0){
						interests += parseInt(this);
					}
				});

				binarize('interestsBinary','myInterests', interests);
				$scope.$apply();
				$(this).parents('.itemPanel').css('display','none');
				//checkInterests();
			}
		});

		/* ****************************************************************** */
		/* ************ Find Me Pop Up  ***************** */
		/* ****************************************************************** */
		
		var findMe = edit.profileExtra.findme;
		
		$('#findMe .itemPanel .save').click(function(){
			$(this).parents('.itemPanel').find('.icr.enabled.checked').each(function(){	
				if($(this).siblings('.icr__hidden').find('input').attr('name') == -1 || $(this).siblings('.icr__hidden').find('input').attr('name') == 0){
					$(this).removeClass('checked');
				}
			});
			var numberOfChecked = $(this).parents('.itemPanel').find('.icr.enabled.checked').length;
			if (numberOfChecked > 5){
				$(this).parents('.itemPanel').find('.help-block').css('display','block');
			}else{
				$(this).parents('.itemPanel').find('.help-block').css('display','none');
				findMeTotal = [];
				
				$(this).parents('.itemPanel').find('.icr.enabled.checked').each(function(){					
					findMeTotal.push($(this).siblings('.icr__hidden').find('input').attr('name'));						
				});
				
				findMe = 0;
				$.each(findMeTotal,function() {
					if (parseInt(this) >= 0){
						findMe += parseInt(this);
					}
				});
				
				binarize('findMeAtBinary','findMe', findMe);
				$scope.$apply();
				$(this).parents('.itemPanel').css('display','none');
				//checkFindme();
			}
		});

		/* ****************************************************************** */
		/* ************ City and Postal code  ***************** */
		/* ****************************************************************** */
		var validPostal = 1;
		$( "#cities .save" ).click(function() {		
			$('#cities').find('.toggle').css('color','#212121');
			if(validPostal == 1){
				$.ajax({
					method: 'POST',
					dataType: 'json',
					contentType: 'application/json', processData: false,
					url:'/mobilejoin/json/checkPostalCode?postalCode=' + $('[name=postal]').val(),
					success:function(data){

						if ( data.cityId > -1 ){
							
							$( "[name=postal]" ).attr("rel", "VALID");

							edit.cityId = data.cityId;
							edit.countryId = data.countryId;
							edit.stateId = data.stateId;
							edit.countyId = -1;
							edit.zipcode = $('[name=postal]').val();
							
							$http({
								method : 'POST',
								url : '/mobilejoin/json/cityLookup?countryId=' + data.countryId + '&stateId=' + data.stateId + '&cityId=' + data.cityId
							}).success(function(location) {
								$scope.selectedCity.city = location.city;
								edit.city = $scope.selectedCity.city;
								$('.itemPanel').css('display','none');
							});
							
						} else {                   
							$scope.selectedCity = [];
							$("#postal").css('display','none');
							$("#postalBackup").css('display','block');	
							validPostal = 0;
							$http({
								method : 'POST',
								url : '/mobilejoin/json/city/select'
							}).success(function(data) {	
								$scope.countryList = data;
								$('#state-select button').attr('disabled','disabled');
								$('#city-select button').attr('disabled','disabled');
							});
						}
					}
				 });
			 }else{
				edit.cityId = $scope.selectedCity.id;
				edit.countyId = -1;
				edit.zipcode = $('[name=postal]').val();
				$('.itemPanel').css('display','none');
			 }
		});
		
		$( "#cities .cancel" ).click(function() {	
			$("#postalBackup").css('display','none');
			$("#postal").css('display','block');	
			$scope.selectedCity.city = edit.city;	
			validPostal = 1;
			$scope.$apply();
		});
		
		$scope.getStates = function(){	
			$http({
				method : 'POST',
				url : '/mobilejoin/json/city/select?countryId=' + $scope.selectedCountry.id
			}).success(function(data) {
				$scope.stateList = data;
				$('#state-select button').removeAttr('disabled');
			});		
		}
		
		$scope.getCities = function(){	
			$http({
				method : 'POST',
				url : '/mobilejoin/json/city/select?countryId=' + $scope.selectedCountry.id + '&stateId=' + $scope.selectedState.id
			}).success(function(data) {
				$scope.cityList = data; 
				$('#city-select button').removeAttr('disabled');
			});		
		}
				
		/* ****************************************************************** */
		/* ************ Pre-select item panel values  ***************** */
		/* ****************************************************************** */
		
		$('#interests .itemPanel').find('input[type=checkbox]').each(function(){
			for(i=0;i<$scope.myInterests.length;i++){
				if ($(this).parents().siblings('.col-xs-9').find('label').html() == $scope.myInterests[i].name){
					$(this).attr('checked','checked');
				}
			}
		});
		$('#findMe .itemPanel').find('input[type=checkbox]').each(function(){
			for(i=0;i<$scope.findMe.length;i++){
				if ($(this).parents().siblings('.col-xs-9').find('label').html() == $scope.findMe[i].name){				
					$(this).attr('checked','checked');
				}
			}
		});

		$('#langauges .itemPanel').find('input[type=checkbox]').each(function(){
			for(i=0;i<$scope.selectedLanguages.length;i++){
				if ($(this).parents().siblings('.col-xs-9').find('label').html() == $scope.selectedLanguages[i].name){				
					$(this).attr('checked','checked');
				}
			}
		});
		
		$('#looking-for .itemPanel').find('input[type=checkbox]').each(function(){
			var looking = [];
			looking.push({'name' : 'Hookups', 'letter' :edit.profileExtra.hookups});
			looking.push({'name' : 'Relationship', 'letter' :edit.profileExtra.relationship});
			looking.push({'name' : 'Long Term', 'letter' :edit.profileExtra.longTerm});
			looking.push({'name' : 'Casual Dates', 'letter' :edit.profileExtra.casualDates});
			looking.push({'name' : 'Friends', 'letter' :edit.profileExtra.friends});
			
			var count = 0;
			$scope.lookingFor = [];
			for (i=0;i<looking.length;i++){
				if (looking[i].letter == '1'){
					count++;		
					$scope.lookingFor.push(looking[i].name);
				}
			}
			for(i=0;i<$scope.lookingFor.length;i++){
				if ($(this).parents().siblings('.col-xs-9').find('label').html() == $scope.lookingFor[i]){	
					
					$(this).attr('checked','checked');
				}
			}
		});
		
		if($scope.selectedLanguages.length > 1){
			$scope.selectedLanguages[0].name = $scope.selectedLanguages.length + ' selected';
		}
		if ($scope.lookingFor.length > 1){
			$scope.lookingFor[0] = $scope.lookingFor.length + ' selected';
		}
		if ($scope.lookingFor.length == 0){
			$scope.lookingFor[0] = "Select";
			$('#looking-for').find('.toggle').css('color','#bdbdbd');
		}
		$("input[type='radio']:not(label.radio input), input[type='checkbox']:not(label.checkbox input, .chat-box input, .messages-left input) ").ionCheckRadio();

		/* ****************************************************************** */
		/* ************ Check if user has filled required information ***************** */
		/* ****************************************************************** */
		
		var required = ["city"];
		
		profileCheck(required);
		
		function profileCheck(required){
			var errors = [];
			for (i=0;i<required.length;i++){
				if (edit[required[i]] == undefined || edit[required[i]].length < 1 || edit[required[i]] == '0'){
					if (edit.profileExtra[required[i]] == undefined || edit.profileExtra[required[i]] <1 || edit.profileExtra[required[i]] == '0'){
						errors.push(required[i]);
					}
				}
			}
			$scope.addThePic = 'nope';
			$http({
				method : 'POST',
				url : '/member/json/myprofile/edit/pictures;jsessionid=' + $scope.jsessionid
			}).success(function(data) {	

				var hasDisplayPic = 0;
			    for (i=0;i<data.list.length;i++){
                    if (data.list[i].d == "profile"){
						hasDisplayPic = 1;
                        $scope.avatar = data.list[i].filename;
                        $scope.profilePhoto = [$scope.avatar];
                    }
			    }
				
				if (hasDisplayPic == 0){
					$scope.profilePhoto = ['nothing-to-see-here-folks'];
                    $scope.addThePic = 'yis';
                    errors.push('picture');
				}
			
			    if ($scope.lookingFor[0] == "Select"){
			       	errors.push('looking for');
			    }
			
			    if (errors.length > 0){
                    $('#settings-holder').append('<style>.backstretch{opacity:.2;}body{background-color:#000000;}.navbar{visibility:hidden;}#settings-holder{border:solid 2px #ffffff;border-bottom:0;}#pictures, #myAccount{display:none;}.profile-completion{display:block;}</style>');
			    }             
			});					
		}

		/* ****************************************************************** */
		/* ************ Add Photo  ***************** */
		/* ****************************************************************** */
		
		$scope.dropzoneConfig = {
		'options': { // passed into the Dropzone constructor
		  'url': '/videoProcessor/json_upload.epl'
		},
		'eventHandlers': {
		  'sending': function (file, xhr, formData) {
		  },
		  'success': function (file, dataImage) {
				var iW,iH,w,h;
				$("#loader").load("partials/picture-crop.html", function(){
					var $modal = $("#my_popup");
					var rotation = 0;
					var coords;
					
					$.fn.popup.defaults.blur = false;
					$('#my_popup').popup('show');
					
					$("#target").attr("src","http://lavalife.com/pictures/" + dataImage.fileName + ".jpeg");
					$("#target").load(function(){
						iW = $("#target").width();
						iH = $("#target").height();
						$("#target").css('max-width','400px');
						$("#target").css('max-height','400px');
						
						if($(".image-crop").height() < 400){
							$(".image-crop").css('padding-top', (400 - $(".image-crop").height()) / 2 + 'px');
							$(".image-crop").css('padding-bottom', (400 - $(".image-crop").height()) / 2 + 'px');
						}
						
						if($(".image-crop").width() < 400){
							$(".image-crop").css('padding-left', (400 - $(".image-crop").width()) / 2 + 'px');
							$(".image-crop").css('padding-right', (400 - $(".image-crop").width()) / 2 + 'px');
						}
						
						w = $("#target").width();
						h = $("#target").height();
						
						$('#target').Jcrop({
							minSize: [ 50, 50 ],
							onChange:   showCoords,
							onSelect:   showCoords
						  },function(){
							jcrop_api = this;
						});
						
						jcrop_api.setOptions({aspectRatio: 1/1});
						jcrop_api.animateTo([0,0,100,100]);
					});
					
					function showCoords(c){
						coords = c;
				   };
					
					$(".rotate-right").click(function(){
						rotation += 90;
						if (rotation == 360){
							rotation = 0;
						}			
						$('.jcrop-holder').rotate(rotation);
						jcrop_api.setOptions({rotate : rotation});
					});
					
					$(".rotate-left").click(function(){
						if (rotation == 0){
							rotation = 360;
						}
						rotation -=90;
						$('.jcrop-holder').rotate(rotation);
						jcrop_api.setOptions({rotate : rotation});
					});
					
					$(".crop-close").click(function(){
											
						dataImage.size.split('x');
						
						var postData = { 
							directory: dataImage.directory,
							fileName: dataImage.picName,
							width: dataImage.size[0],
							height: dataImage.size[1],
							action: "submit",
							invalidPictureFormatError: false,
							noPictureNameError: false,
							imageAppearsInDatingProfile: "Y",
							description: ""
						};
						
						var url = '/member/json/myprofile/savePicture';
						var success = function(data){
		
							var neoX = Math.round(coords.x / w * iW);
							var neoY = Math.round(coords.y / h * iH);
							var neoX2 = Math.round(coords.x2 / w * iW);
							var neoY2 = Math.round(coords.y2 / h * iH);
							
							var postData = { x: neoX, y: neoY, x2: neoX2, y2: neoY2, imgInitW: iW, imgInitH: iH, imgW: iW, imgH: iH, degree: rotation, filePath: dataImage.fileName + '.jpeg' };
							
							var url = '/pictProcessor/cropXPicture.act';
							var success = function(data){ 
								$http({
									method : 'POST',
									url : '/member/json/myprofile/edit/pictures;jsessionid=' + $scope.jsessionid
								}).success(function(data) {		
									
									for (i=0;i<data.list.length;i++){
										if (data.list[i].d == "profile"){
											$scope.addThePic = 'nope';
											$scope.avatar = data.list[i].filename;
											$scope.profilePhoto = [$scope.avatar];
										}
									}
								});
								
								$('#my_popup').popup('hide'); 
							}
							var error = function(){ };
							ajaxRequest.speak(url,success,error,postData);
					
						}
						var error = function(){ };
						
						ajaxRequest.speak(url,success,error,postData);
						
					 });
					 
					$(".crop-cancel").click(function(){
						$('#my_popup').popup('hide'); 
						window.location.reload();
					 });
				});			
					
			  }
			}
	    };
		
		/* ****************************************************************** */
		/* ************ Validate Drop Downs and item Panels ***************** */
		/* ****************************************************************** */	
		
		var basics = ['selectedLanguages','lookingFor', 'selectedBodytype', 'selectedEthnicity','selectedReligion','selectedYear','selectedMonth','selectedDay','selectedStatus','selectedPersonality','selectedHeight','selectedIncome','selectedEducation','selectedWantChildren','selectedChildren','selectedSeeking','selectedDrinking','selectedSmoking'];
		function checkBasics(item){	
			var basicError = [];
			for(i=0;i<basics.length;i++){
				if ($scope[item[i]].length == 0 || $scope[item[i]] == 'Select'){
					basicError.push(item[i]);
				}
			}
			if (basicError.length > 0){
				for(i=0;i<basicError.length;i++){
					$('.'+basicError[i]+'.help-block').css('display','inline-block');
				}
				return 1;
			}else{
				$('#basics .help-block').css('display','none');
				return 0;
			}
		}
		
		function checkInterests(){
			if (interests < 1){
				$('#interests .col-xs-12 .help-block').css('display','block');
				return 1;
			}else{
				$('#interests .col-xs-12 .help-block').css('display','none');
				return 0;
			}
		}
		
		function checkFindme(){
			if (findMe < 1){
				$('#findMe .col-xs-12 .help-block').css('display','block');
				return 1;
			}else{
				$('#findMe .col-xs-12 .help-block').css('display','none');
				return 0;
			}
		}
		
		/* ****************************************************************** */
		/* ************ Edit Profile Validation ***************** */
		/* ****************************************************************** */
		
		$.validate({
			modules : 'date,security',
			addValidClassOnAll : true,
			scrollToTopOnError : true,
			validateOnBlur : false,
			onError : function() {
				$('.failure').css('display','block'); 
			},
			onSuccess : function() {
				edit.profileExtra.interests = interests;
				edit.profileExtra.findme = findMe;
				edit.profileExtra.personality = $scope.selectedPersonality.letter;
				edit.profileExtra.status = $scope.selectedStatus.letter;
				edit.dating.nickname = $("[name=nickname]").val();
				edit.dating.openingline = $("[name=opening-line]").val();
				edit.dating.imow = $("[name=about]").val();
				edit.birthDay = $scope.selectedDay.number;
				edit.birthMonth = $scope.selectedMonth.number;
				edit.birthYear = $scope.selectedYear.number;
				edit.ideal = $("[name=ideal]").val();
				edit.profileExtra.targetGender = $scope.selectedSeeking.letter.toUpperCase();
								
				var substr = $scope.selectedHeight.letter.split('.');
				var height = substr[0] * 12 + parseInt(substr[1]);
				var converter = 2.54;
				var cm = height * converter;
				cm = Math.round(cm);
				edit.heightCm = cm;
				
				edit.bodyType = $scope.selectedBodytype.letter;
				edit.ethnicity = $scope.selectedEthnicity.letter;
				edit.religion = $scope.selectedReligion.letter;
				edit.smoke = $scope.selectedSmoking.letter;
				edit.drink = $scope.selectedDrinking.letter;
				edit.hasChildren = $scope.selectedChildren.letter;
				edit.wantChildren = $scope.selectedWantChildren.letter;
				edit.education = $scope.selectedEducation.letter;
				edit.income = $scope.selectedIncome.letter;
				edit.city = $scope.selectedCity.city;

				$http({
					method : 'POST',
					url : '/member/v1.1/json/myprofile/saveProfile',
					dataType: 'json',
					data: edit,
					headers: {
						"Content-Type": "application/json"
					}
				}).success(function(data) {

					if (data.status == "OK"){
                        
                        // update unit preference for location
						// TODO: deprecated, to remove once verified not intefere with anything
                        //
						//var vUnitPref;
                        //if ( edit.countryId == $rootScope.USA_ID ){
                        //    vUnitPref = $rootScope.IMPERIAL;
                        //} else {
                        //    vUnitPref = $rootScope.METRIC;
                        //}
                        //var url = '/member/account/preference/save';
                        //var postData = { unitPref: vUnitPref };
                        //var success = function(){};
                        //var error = function(){};
						//ajaxRequest.speak(url,success,error,postData);
						//

						$('#doneModal').modal('show');   
						$('#doneModal').click(function(){							
							if (edit.profileExtra.profileStatus == 3){
								edit.profileExtra.profileStatus = 4;
								$http({
									method : 'POST',
									url : '/member/v1.1/json/myprofile/saveProfile',
									dataType: 'json',
									data: edit,
									headers: {
										"Content-Type": "application/json"
									}
								}).success(function(data){
									$('#doneModal').modal('hide'); 
									window.location.href = "dashboard.html" + Utils.appendCJAffiliate() + '#/';
								});
							}else{
								$('#doneModal').modal('hide'); 
                            	window.location.href = "dashboard.html" + Utils.appendCJAffiliate() + '#/';
                            }
						});
					}			
				}).error(function(data){
					for(i=0;i<data.errors.length;i++){
						if(data.errors[i].field == "nickname"){
							$(".profileName .help-me").css('display','block');
							$('.failure').css('display','block'); 
						}
					}
				});
			}
		});

		$('#saveProfile .save').click(function(){
			$('.failure').css('display','none'); 
			$(".profileName .help-me").css('display','none');
			$("[name=about]").css('border','solid 1px #bdbdbd');
			$("[name=ideal]").css('border','solid 1px #bdbdbd');
			$('.noPicture').css('display','none'); 
			$(".errorz").css('display','none');
			var error = 0;
			//error += checkBasics(basics);
			//error += checkInterests();
			//error += checkFindme();
			
			if($("[name=about]").val().length > 0 && ($("[name=about]").val().length < 50 || $("[name=about]").val().length >3000)){
				$("[name=about]").css('border','solid 1px red');
				$("#about .errorz").css('display','block');
				error ++;
			}
			
			if($("[name=ideal]").val().length > 0 && ($("[name=ideal]").val().length < 3 || $("[name=ideal]").val().length >1000)){
				$("[name=ideal]").css('border','solid 1px red');
				$("#dreamDate .errorz").css('display','block');
				error ++;
			}
			
			if ($scope.addThePic == 'yis'){
				error ++;
				$('.noPicture').css('display','block'); 
			}
			
			if (error == 0){
				$('#edit-profile').submit();
			}else{
				$('.failure').css('display','block'); 
			}
		});
		
		$('#saveProfile .cancel').click(function(){
			window.location.href = "dashboard.html" + Utils.appendCJAffiliate() + '#/';
		});
		
		$('#edit-profile').on('submit', function(){
			return false;
		});		
		
		$(document).ready(function() {	
			$('a[target^="_new"]').click(function(e) {
				window.open(this.href, 'newwindow', 'width=' + 1200 + ', height=' + window.innerHeight + ', top=100, left=350');
			});
		});
	});
});

app.controller("myPicturesController", function( Page, $scope, $routeParams, $http, ajaxRequest, $rootScope, 
	Utils, AccountInfo, getAccountInfo, myInformation, $timeout, ViewMyProfile ) {

    $scope.Page = Page;
	$scope.Page.setTitle('My Photos');
    
    var PICTURE_TYPE = $rootScope.PICTURE_TYPE;
    var MAX_PICTURE_PER_GALLERY = 16;

    $scope.ViewMyProfile = ViewMyProfile;

	$http({
		method : 'POST',
		url : '/member/json/myprofile/edit/pictures;jsessionid=' + $scope.jsessionid
	}).success(function(data) {	

		if(window.location.href == "http://www.lavalife.com/subscription.html#/myPictures"){
			window.location.href = "http://www.lavalife.com/dashboard.html#/myPictures/";
		}
		
		$('#myAccount').removeClass('active');
		$('#myPictures').addClass('active');
		
		$('#publicBtn').click(function() {
			$('#publicPhotos').removeClass('hidden');
			$('#coverPhotos').addClass('hidden');
			$('#publicBtn').addClass('active');
			$('#coverBtn').removeClass('active');
			$('#privatePhotos').addClass('hidden');
			$('#privateBtn').removeClass('active');
		});
		
		$('#coverBtn').click(function() {
			$('#publicPhotos').addClass('hidden');
			$('#coverPhotos').removeClass('hidden');
			$('#publicBtn').removeClass('active');
			$('#coverBtn').addClass('active');
			$('#privatePhotos').addClass('hidden');
			$('#privateBtn').removeClass('active');
		});

		$('#privateBtn').click(function() {
			$('#publicPhotos').addClass('hidden');
			$('#coverPhotos').addClass('hidden');
			$('#publicBtn').removeClass('active');
			$('#coverBtn').removeClass('active');
			$('#privatePhotos').removeClass('hidden');
			$('#privateBtn').addClass('active');
 		});
		
		generateGallery();
		
        function generateGallery( afterGenerate ){
			
            $http({
				method : 'POST',
				url : '/member/json/myprofile/edit/pictures;jsessionid=' + $scope.jsessionid
			}).success(function(data) {	
			
				$scope.gallery        = [];
				$scope.addPics        = [];
				$scope.privatePhotos  = [];
				$scope.addPrivatePics = [];
				
                for (i=0;i<data.list.length;i++){
					
					if (data.list[i].d == "profile"){
						$scope.avatar = data.list[i].filename;
					}
				}
				var j = 0;
				var k = 0;
				
				for (i=0;(i<data.list.length)&&(j<MAX_PICTURE_PER_GALLERY);i++){

					if (data.list[i] && (data.list[i].rating == "A" || data.list[i].rating == "Q" || data.list[i].rating == "P") && data.list[i].d != "backstage"){

						$scope.gallery.push({id: data.list[i].mediaId, pic: data.list[i].filename, rating: data.list[i].rating, class: 'hidden'});
						j++;

					} 				
				}

				for (i=0;(i<data.list.length)&&(k<MAX_PICTURE_PER_GALLERY);i++){

					if ( data.list[i] && data.list[i].d === "backstage" ) {

						$scope.privatePhotos.push({id: data.list[i].mediaId, pic: data.list[i].filename, rating: data.list[i].rating, class: 'hidden'});
						k++;	
					}
				}
				
				
				for(i=0;i<(MAX_PICTURE_PER_GALLERY-j);i++) {
					$scope.addPics.push({id: '', pic: '', class: ''});
				}

				for(i=0;i<(MAX_PICTURE_PER_GALLERY-k);i++) {
					$scope.addPrivatePics.push({id: '', pic: '', class: ''});
				}
                
                if ( afterGenerate != undefined ){
                    
                    afterGenerate();
                }

                $scope.generateGalleryPictures = data;
			});
		}
	
		$scope.addCover = function(letter, pic){
			$scope.accountInfo = AccountInfo;
			getAccountInfo.speak($scope, AccountInfo);


				$http({
					method : 'POST',
					url : '/member/dating/v1.2/json/viewmyprofile;jsessionid=' + $scope.jsessionid
				}).success(function(data) {
					edit = data;
					edit.profileExtra.background = letter;
					$rootScope.bg = pic;
					console.log($rootScope.bg);
					$http({
						method : 'POST',
						url : '/member/v1.1/json/myprofile/saveProfile',
						dataType: 'json',
						data: edit,
						headers: {
							"Content-Type": "application/json"
						}
					})
				});
		}		
		
		$scope.dropzoneConfig = {
			'options': { // passed into the Dropzone constructor
		  		'url': '/videoProcessor/json_upload.epl'
			},
			'eventHandlers': {
		  		'sending': function (file, xhr, formData) {
		  	},
		  	'success': function (file, dataImage) {
				var iW,iH,w,h;
				$("#loader").load("partials/picture-crop.html?v=1.0", function(){
					var $modal = $("#my_popup");
					var rotation = 0;
					var coords;
					
					$.fn.popup.defaults.blur = false;
 					
                    $('#my_popup').popup('show');
					
					$("#target").attr("src","http://lavalife.com/pictures/" + dataImage.fileName + ".jpeg");
					$("#target").load(function(){
						iW = $("#target").width();
						iH = $("#target").height();
						$("#target").css('max-width','400px');
						$("#target").css('max-height','400px');
						
						if($(".image-crop").height() < 400){
							$(".image-crop").css('padding-top', (400 - $(".image-crop").height()) / 2 + 'px');
							$(".image-crop").css('padding-bottom', (400 - $(".image-crop").height()) / 2 + 'px');
						}
						
						if($(".image-crop").width() < 400){
							$(".image-crop").css('padding-left', (400 - $(".image-crop").width()) / 2 + 'px');
							$(".image-crop").css('padding-right', (400 - $(".image-crop").width()) / 2 + 'px');
						}
						
						w = $("#target").width();
						h = $("#target").height();
						
						$('#target').Jcrop({
							minSize: [ 50, 50 ],
							onChange:   showCoords,
							onSelect:   showCoords
						  },function(){
							jcrop_api = this;
						});
						
						jcrop_api.setOptions({aspectRatio: 1/1});
						jcrop_api.animateTo([0,0,100,100]);
					});
					
					function showCoords(c){
						coords = c;
				   };
					
					$(".rotate-right").click(function(){
						console.log(rotation);
						rotation += 90;
						if (rotation == 360){
							rotation = 0;
						}			
						$('.jcrop-holder').rotate(rotation);
						jcrop_api.setOptions({rotate : rotation});
					});
					
					$(".rotate-left").click(function(){
						console.log(rotation);
						if (rotation == 0){
							rotation = 360;
						}
						rotation -=90;
						$('.jcrop-holder').rotate(rotation);
						jcrop_api.setOptions({rotate : rotation});
					});
					
					$(".crop-close").click(function(){
											
						dataImage.size.split('x');
						var postData = { 
							directory: dataImage.directory,
							fileName: dataImage.picName,
							width: dataImage.size[0],
							height: dataImage.size[1],
							action: "submit",
							invalidPictureFormatError: false,
							noPictureNameError: false,
							//imageAppearsInDatingProfile: "N",
							description: ""
						};
						
						// private or public?
						var privateEh = ($("#picture-menu").find(".active").attr("id") === 'privateBtn');
						if ( privateEh ){
							postData.imageAppearsInDatingBackstage = 'Y';
						} else {
							postData.imageAppearsInDatingProfile = 'N';	
						}
						
						var url = '/member/json/myprofile/savePicture';
						var success = function(data){
							
							var neoX = Math.round(coords.x / w * iW);
							var neoY = Math.round(coords.y / h * iH);
							var neoX2 = Math.round(coords.x2 / w * iW);
							var neoY2 = Math.round(coords.y2 / h * iH);
							
							var postData = { x: neoX, y: neoY, x2: neoX2, y2: neoY2, imgInitW: iW, imgInitH: iH, imgW: iW, imgH: iH, degree: rotation, filePath: dataImage.fileName + '.jpeg' };
							
							var url = '/pictProcessor/cropXPicture.act';
							var success = function(data){ 
								
								$('#my_popup').popup('hide');
// window.location.reload();
								if ( privateEh ){
									if ( Utils.parseQueryString()["show"] === 'private' ){
										window.location.reload();
									} else {
										window.location.href = "dashboard.html?show=private#/myPictures/";
									}
								} else {
									if ( Utils.parseQueryString()["show"] === 'public' ){
										window.location.reload();
									} else {								
										window.location.href = "dashboard.html?show=public#/myPictures/";
									}
								}
							}
							var error = function(){ };
							ajaxRequest.speak(url,success,error,postData);
					
						}
						var error = function(){ };
						
						ajaxRequest.speak(url,success,error,postData);
						
					 });
					 
					$(".crop-cancel").click(function(){
						$('#my_popup').popup('hide'); 
						window.location.reload();
					 });
				});			
					
			  }
			}
	    };
		
		$scope.profilePic = function(id, action){
		    	
            if (action == undefined){
                action = PICTURE_TYPE.PROFILE;
            }
            
            $scope.action = action; 

			var editPicture = [];
            var data = $scope.generateGalleryPictures;
			
            ////Set current profile pic to gallery
            if ( action === PICTURE_TYPE.PROFILE ){
                for (i=0;i<data.list.length;i++){
                    if(data.list[i].d == PICTURE_TYPE.PROFILE){
                        editPicture.push({"id":data.list[i].mediaId, "r":PICTURE_TYPE.GALLERY, "d":PICTURE_TYPE.GALLERY, "i": PICTURE_TYPE.GALLERY});
                    }
                }
            }
			
            editPicture.push({"id":id, "r":action, "d":action, "i": action});
		    
            $scope.profilePicInAction = true;
    		$http({
				method : 'POST',
				url : '/member/json/myprofile/update/pictures',
				dataType: 'json',
				headers: {
					"Content-Type": "application/json"
				},
				data: editPicture
			}).success(function(data){

				generateGallery( function(){
                    $scope.profilePicInAction = false;
                });
			}).error(function(data){

                $scope.profilePicInAction = false;
            });
		}
		
		/* ****************************************************************** */
		/* ************ Delete Photo ***************** */
		/* ****************************************************************** */
		
		$scope.confirmDeletePic = function(id){
			$scope.selectedPicId = id;
			$("#deleteModal").modal("show");
		}

		$scope.deletePic = function(id){
			var pictureId = {pictureId: id};
    		var url = '/member/json/myprofile/delete/picture;jsessionid=' + $scope.jsessionid;
    		var success = function(data){ 
				generateGallery();
				$("#deleteModal").modal("hide");
			};
    		var error = function(data){ 
				$("#deleteModal").modal("hide");
			};
    		
    		ajaxRequest.speak(url,success,error,pictureId);
		}
		
		var params = Utils.parseQueryString();
		if (params["show"] === 'private'){
			$('#privateBtn').click();
		} else {
			$('#publicBtn').click();
		}
		
	});

    $scope.profilePicAction = function( pictureType ){
        
        if ( $scope.profilePicInAction && $scope.action === pictureType ){
            str = "Updating..";
        } else {
            
            if ($scope.action === PICTURE_TYPE.GALLERY) {
                str = 'MOVE TO PRIVATE';
            } else if ($scope.action === PICTURE_TYPE.BACKSTAGE) {
                str = 'MOVE TO PUBLIC';
            }
        }

        return str;
    }
});

app.controller('MembershipController', function($http,$scope, $routeParams, search, ngDialog, ajaxRequest,$location, $rootScope, $state, myInformation, ViewMyProfile ){
   	
    userInfo = function(data){
		
    	data.background = returnName($scope.coversName, "letter", data.profileExtra.background);
        $scope.myInfo = data;
        
        var postData = { };
        var url = '/member/json/myprofile/edit/pictures';
        var success = function(data){
            for (i=0;i<data.list.length;i++){
                if (data.list[i].d == "profile"){
                    $scope.myInfo.large = '/pictures/thumb/' + data.list[i].filename.replace('.jpeg', 'l.jpeg');
                }
            }
        };
        var error = function(data){ };
        
        ajaxRequest.speak(url,success,error,postData);
        
    };
    
	myInformation.speak(userInfo);
	
	$scope.tabData   = [
	      {
	        heading: 'My Profile',
	        route:   'profile'
	      },
	      {
	        heading: 'My Photos',
	        route:   'pictures'
	      },
	      {
	        heading: 'My Account',
	        route:   'account'
	      },
	      
	      {
	        heading: 'My Subscription',
	        route:   'user.membership'
	      }
	      
	    ];

    $scope.go = function ( path ) {
        $location.path( path );
    };
    
});

app.constant('PURCHASE_REQUEST_MESSAGE', {
    'NO_PACKAGE'     : 'Please select a package first.',
    'NO_CREDIT_CARD' : 'Please select a credit card first.',
    'NO_CVV'         : 'Please enter CVV.',
    'FAILED'         : 'There is an issue processing your transaction. Please try later.',
    'PURCHASING'     : 'Please wait a moment while we process your transaction. Donâ€™t close this page!',
    'CONTINUE'       : 'CONTINUE'
});

app.controller('SubscriptionController', function( PURCHASE_REQUEST_MESSAGE, 
    $http, $scope, $routeParams, search, ngDialog, ajaxRequest,$location, $rootScope, $state, 
    PurchaseRequest, PurchaseRequestStatus, getAccountInfo, AccountInfo, getPaymentHistory, PaymentHistory, ViewMyProfile,
    Utils ){
    
    rootPurchaseRequestStatus    = $rootScope.PURCHASE_REQUEST_STATUSES;
    $scope.purchaseRequestStatus = PurchaseRequestStatus;
    PurchaseRequestStatus.set(rootPurchaseRequestStatus.PACKAGE_NONE);
	
    $scope.addingCreditCard    = false;
    $scope.creditCardSubmit    = PURCHASE_REQUEST_MESSAGE.CONTINUE;
    $scope.purchaseRequest     = PurchaseRequest;
    $scope.selectedOfferDetail = {};
    $scope.creditCardForm      = {};
    $scope.selectedMonth       = {};
    $scope.selectedYear        = {};
    $scope.ViewMyProfile       = ViewMyProfile;
    $scope.phoneNumber = {}; // If you use this in ng-include, this needs to be an object, otherwise the value stored will be gone! NOPE: $scope.phoneNumber = 1;

    $scope.$watch("ViewMyProfile.get()", function( newVal, oldVal ){
        
        if ( newVal != undefined && newVal.countryId != undefined ){
            window.MasterTmsUdo.CJ.CURRENCY = Utils.determineCurrency( newVal.countryId );
        }
    })

    // TODO: deprecated, to remove
    $scope.purchase = function(){
        
        PurchaseRequest.sitrep = {};
        
        if ( PurchaseRequest.offerDetailId == -1 ){
            
            PurchaseRequest.sitrep.message = PURCHASE_REQUEST_MESSAGE.NO_PACKAGE;
            PurchaseRequest.sitrep.approved = false;
            return;
        }    

        if ( !PurchaseRequest.creditCard ){
            
            PurchaseRequest.sitrep.message = PURCHASE_REQUEST_MESSAGE.NO_CREDIT_CARD;
            PurchaseRequest.sitrep.approved = false;
            return;
        }

        if ( !PurchaseRequest.cvv ){
            
            PurchaseRequest.sitrep.message = PURCHASE_REQUEST_MESSAGE.NO_CVV;
            PurchaseRequest.sitrep.approved = false;
            return;
        }            

        var postData = { 
            cardId: PurchaseRequest.creditCard.cardId, 
            offerDetailId: PurchaseRequest.offerDetailId,
            cvv: PurchaseRequest.cvv
        };
		var url = '/member/billing/purchaseWithNewCreditCard';
		var success = function(data){
            
            PurchaseRequest.sitrep = data;
            if ( data.approved ){

                getPaymentHistory.speak( $scope, PaymentHistory );

                //if ( PurchaseRequest.autoRenew === '1' ){
                //    startAutoRenew();
                //}
            } else {
            }
            getAccountInfo.speak($scope, AccountInfo);
            
		};
		var error = function(data){ 

            PurchaseRequest.sitrep = {};
            PurchaseRequest.sitrep.message = PURCHASE_REQUEST_MESSAGE.FAILED;
        };
		
        $('#purchaseComfirmModal').modal('show');
        $('#purchaseComfirmModal #positive').click(function( event ){
            
            event.stopImmediatePropagation();
            PurchaseRequest.sitrep.message = PURCHASE_REQUEST_MESSAGE.PURCHASING;
            ajaxRequest.speak(url,success,error,postData);
            $('#purchaseComfirmModal').modal('hide');
        });
    };
    
    // this will turn on auto renew for purchasing package
    startAutoRenew = function(){
        
        var url = '/member/billing/startAutoRenew';
        ajaxRequest.speak(url,{},{},{});
    }
    
    getExpiry = function( month, year ){
        var mm = monthPad(month.number,2);
        var yy = yearStrip(year.number);
        return mm + yy;
    }

    monthPad = function (num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    }    
    
    yearStrip = function (num) {
        return num.toString().substring(2);
    }

    $scope.confirmAndPay = function() {
        
        PurchaseRequest.sitrep.message = ''; 
        var $purchaseRequestStatus = $("#purchase-request-status");

        if ( PurchaseRequest.creditCard != undefined && PurchaseRequest.creditCard.cardId > 0 ){
            
            var postData = {
                cardId: PurchaseRequest.creditCard.cardId,
                offerDetailId: PurchaseRequest.offerDetailId
            };
            var url = '/member/billing/purchaseWithCreditCard';

        } else {

            var postData = $scope.creditCardForm;
            postData['offerDetailId'] = PurchaseRequest.offerDetailId;
            postData['expiry'] = getExpiry( $scope.creditCardForm.selectedMonth, $scope.creditCardForm.selectedYear );
            delete(postData["selectedYear"]);
            delete(postData["selectedMonth"]);
            var url = '/member/billing/purchaseWithNewCreditCard';
        }
        
        // After a successful purchase, the following needs to happen:
        var success = function(data){
            
            PurchaseRequest.sitrep = data;
            
            if ( data.approved ){
				
				/*
				 * Google Analytics stuff
				 */
				ga('send', 'event', 'Purchase', 'Subscribe', 'Successful');

				if ( !$.isEmptyObject($scope.selectedOfferDetail) ){
					
					var transId     = data.xactionId.toString();;
					var packageName = $scope.selectedOfferDetail.duration + "-Month Package";
					var revenue     = $scope.selectedOfferDetail.totalCost.toString();
					var tax         = $scope.selectedOfferDetail.taxAmount.toString();
					var price       = $scope.selectedOfferDetail.cost.toString();

					ga('ecommerce:addTransaction', {
						'id'      : transId,
						'revenue' : price
					});
					ga('ecommerce:addItem', {
					  'id'       : transId,
					  'name'     : packageName,
					  'price'    : price,
					  'quantity' : '1'
					});

					ga('ecommerce:send');
				}
				// Google Analytics stuff - END
			    
                /*
				* CJ
                */
                var cjPackageName                  = $scope.selectedOfferDetail.duration + "-Month-Package";
                window.MasterTmsUdo.CJ.OID         = data.xactionId.toString();
                window.MasterTmsUdo.CJ.TYPE        = ( Utils.firstTimePurchaseEh( $scope.accountInfo.get().purchaseCount ) ? $rootScope.CJ_FIRST_TIME_ACTION : $rootScope.CJ_RETURNING_ACTION );
                window.MasterTmsUdo.CJ.PRODUCTLIST = [
					{ ITEM: cjPackageName, AMT: price, QTY: '1' }		
				];
				window.MasterTmsUdo.CJ.FIRECJ      = "TRUE";
                // currency is now changed in $scope.$watch("ViewMyProfile.get()") since ViewMyProfile can be changed
                // in MembershipController or DashboardController
                // window.MasterTmsUdo.CJ.CURRENCY = Utils.determineCurrency( ViewMyProfile.get().countryId );
				
                // Fire the tag if cj source exists ( in query string OR cookie )
                if ( Utils.getParameterByName('source') != null || $.cookie('Source') != undefined ){
                    window.top.Pulse.Master = window.top.Pulse.runWidget({type: "MasterTMS",runNow: !0,selector: null});
                }
				/* CJ - END */

                /*
                * Turn on auto-renew
                */
				var vurl = '/member/billing/startAutoRenew';
				var vsuccess = function(){
					getAccountInfo.speak($scope, AccountInfo);
				};
        		ajaxRequest.speak(vurl,vsuccess,{},{});
                
                /*
                * Save the phone number
                * - Only if this is a first time purchase and phoneNumber passes validations
                */
                if ( $scope.accountInfo.get().purchaseCount == 0 && (typeof($scope.phoneNumber.value) !== 'undefined') ){

                    var pUrl     = '/member/billing/setPhoneNumber';
                    var pSuccess = function(){};
                    var pError   = function(){};
                    var postData = { phoneNumber: $scope.phoneNumber.value };
                    ajaxRequest.speak( pUrl, pSuccess, pError, postData );
                }

                PurchaseRequestStatus.set( rootPurchaseRequestStatus.SUCCESS );
                getPaymentHistory.speak( $scope, PaymentHistory );
                $scope.creditCardForm = {};
                $scope.$apply();

            } else {
                
             	PurchaseRequestStatus.set( rootPurchaseRequestStatus.FAILED );
				getAccountInfo.speak($scope, AccountInfo);
            }
        };
        var error = function(data){ 

            PurchaseRequest.sitrep = {};
            PurchaseRequestStatus.set( rootPurchaseRequestStatus.PACKAGE_SELECTED );
        };
       
        // event.stopImmediatePropagation();
        PurchaseRequestStatus.set( rootPurchaseRequestStatus.PURCHASING );
        
        // purchase!
        ajaxRequest.speak(url,success,error,postData);
    };

    findByField = function( array, idYourAreLookingFor ){
        
        var elementPos = array.map(function(x) {return x.offerDetailId; }).indexOf( parseInt(idYourAreLookingFor) );
        var objectFound = array[elementPos];
        return objectFound;
    }

    $scope.$watch('purchaseRequest.offerDetailId', function() {

        if ( typeof $scope.accountInfo.get() != 'undefined' ){

            $scope.selectedOfferDetail = findByField( $scope.accountInfo.get().offerDetails, $scope.purchaseRequest.offerDetailId );
            PurchaseRequestStatus.set( rootPurchaseRequestStatus.PACKAGE_SELECTED ); 
        }
    });

    $scope.$watch('purchaseRequest.creditCard', function( oldVal, newVal ) {
        
		if ( oldVal !== newVal ){
            $scope.purchaseRequest.sitrep.approved = true;
            $scope.purchaseRequest.sitrep.message = "";
        }
    });

    $scope.formatMoney = function( money ){
        
        if ( typeof money != "undefined" ){
            return '$' + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        } else {
            return '';
        }
    }
    
    $scope.continueWithCard = function(){
        
        PurchaseRequestStatus.set( rootPurchaseRequestStatus.RESET );

        if ( $scope.purchaseRequest.offerDetailId == -1 ){

            PurchaseRequestStatus.set(rootPurchaseRequestStatus.PACKAGE_NONE);

        } else if ( $scope.purchaseRequest.creditCard == undefined ){

            PurchaseRequestStatus.set(rootPurchaseRequestStatus.CREDIT_CARD_NONE);

        } else if ( $scope.purchaseRequest.offerDetailId.length > 0 ){

            PurchaseRequestStatus.set(rootPurchaseRequestStatus.PACKAGE_SELECTED);

        }
        
        $('#purchaseComfirmModal').modal('show');
    }

    $scope.setAddingCreditCard = function( bool ){
        
        $scope.creditCardForm = {};
        delete(PurchaseRequest["creditCard"]);
        $scope.addingCreditCard = bool;
    }
});

app.constant('CREDIT_CARD', {
    'ADD'      : 'Add',
    'DELETING' : 'Deleting..',
    'UPDATE'   : 'Update'
});

app.controller('PaymentOptionsController', function( CREDIT_CARD, $http, $scope, $routeParams, 
    search, ngDialog, ajaxRequest,$location, $rootScope, $state, myInformation, PurchaseRequest, getAccountInfo, AccountInfo ){
    
    $scope.showCustomerInformation = false;
    // need to declare this to be used in .customer-information
    $scope.creditCardForm   = {};
    $scope.PurchaseRequest  = PurchaseRequest;
    $scope.accountInfo      = AccountInfo;
    $scope.creditCardSubmit = CREDIT_CARD.ADD;
    $scope.cardToDelete     = -1;

    /*
     * functions: 
     */
	$scope.confirmDelete = function( card ){
		$scope.cardToDelete = card;
		$('#deleteComfirmModal').modal('show');
        $('#deleteComfirmModal #positive').click(function( event ){
			
			event.stopImmediatePropagation();
			$('#deleteComfirmModal').modal('hide');
			$scope.deleteCard( $scope.cardToDelete );
		});
	}

    $scope.deleteCard = function( card ){
        
        card.action  = CREDIT_CARD.DELETING;
        var postData = { cardId: card.cardId };
        var url      = '/member/billing/deleteCreditCard';
		var success = function(data){
           getAccountInfo.speak($scope, AccountInfo);
		   $scope.PurchaseRequest.creditCard = undefined;
		};
		var error = function(data){ 
            card.action = "";
        };
		
		ajaxRequest.speak(url,success,error,postData);
    };
    
    $scope.addCard = function(){

        $scope.creditCardSubmit = CREDIT_CARD.ADD;
        $scope.creditCardForm = {};
        $("#credit-card-result").html("");
		$("#credit-card-result").addClass("hidden");
    };

    $scope.editCard = function( card ){
        
        $scope.showCustomerInformation = true;
        
        $scope.creditCardSubmit = CREDIT_CARD.UPDATE;
        
        $scope.creditCardForm.cardId        = card.cardId;
        $scope.creditCardForm.holderName    = card.holderName;
        $scope.creditCardForm.cvv           = "***";
        $scope.creditCardForm.cardNumber    = "************" + card.partialNumber;
        $scope.creditCardForm.address       = card.cardAddress.address;
        $scope.creditCardForm.city          = card.cardAddress.city;
        $scope.creditCardForm.countryArea   = card.cardAddress.countryArea;
        $scope.creditCardForm.country       = card.cardAddress.country;
        $scope.creditCardForm.zipCode       = card.cardAddress.zipCode;
        $scope.creditCardForm.selectedMonth = getMonth( card.expiry );
        $scope.creditCardForm.selectedYear  = getYear( card.expiry );

        $("#credit-card-result").html("");
		$("#credit-card-result").addClass("hidden");
    };

    $scope.hideCustomerInformation = function(){
        $scope.showCustomerInformation = false;
    };

	$scope.clearNotification = function(){
		$("#credit-card-result").html("");
		$("#credit-card-result").addClass("hidden");
	};
     
    getMonth = function( expiry ){
        // expiry will be something like '0118', mmyy
        var i = parseInt( expiry.substring(0,2) );
        var obj = findByNumber( $rootScope.monthsAlt, i);
        return { number: i, name: obj.name };
    };

    getYear = function( expiry ){
        var i = parseInt( expiry.substring(2) );
        return { number: i, name: i };
    }
    
    findByNumber = function( collection, number ){
        
        var found;
        for (i = 0; i < collection.length; i++) {
            
            if ( collection[i].number == number ){
                         
                found = collection[i];
                break;
            }
        };
        return found;
    }
});

app.controller('PaymentHistoryController', function( $sce, $http,$scope, $routeParams, search, ngDialog, ajaxRequest,$location, $rootScope, $state, 
    getPaymentHistory, PaymentHistory ){

    $scope.paymentHistory = PaymentHistory;
    getPaymentHistory.speak( $scope, PaymentHistory );

    $scope.getContent = function(obj){
        //console.log($sce.parseAsHtml(obj).toString());
        return $sce.parseAsHtml(obj).toString(); 
    }

    $scope.processCost = function( obj ){
       	
		if ( typeof obj === "undefined" ){ return; }

        if ( obj.length == 0 ){
            return "FREE";
        } else {
            return obj;
        }
    }
});


app.controller('MembershipSubnavController', function( $http, $scope, $routeParams, 
    search, ngDialog, ajaxRequest,$location, $rootScope, $state, getAccountInfo, AccountInfo ){
      	
        $scope.accountInfo = AccountInfo;
        getAccountInfo.speak($scope, AccountInfo);
        $scope.tabData   = [
          {
            heading: 'Subscription',
            route:   'user.membership.subscription'
          },
          {
            heading: 'My Payment Method',
            route:   'user.membership.options'
          },
          {
            heading: 'Billing History',
            route:   'user.membership.history'
          },
          {
            heading: 'Change My Subscription',
            route: 'user.membership.change-subscription'
          }
        ];
        
        $scope.range = function(min, max, step){
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push({ number: i, name: i });
            return input;
        };
});

app.controller('ChangeSubscriptionController', function( $scope, ajaxRequest, $rootScope ){
	
	$scope.autoRenew = function(){
		
		var autoRenew = $scope.accountInfo.get().autoRenew;
		var url;
		var success = function(data){
			$scope.requestStatus = $rootScope.REQUEST_STATUS.SUCCESS;
		};
		var error = function(data){
			$scope.requestStatus = $rootScope.REQUEST_STATUS.FAILED;
		};

		if ( autoRenew ){
			url = '/member/billing/startAutoRenew';
		} else {
			url = '/member/billing/cancelAutoRenew';
		}
		
		$scope.requestStatus = $rootScope.REQUEST_STATUS.PENDING; 
		ajaxRequest.speak(url,success,error,{});
	}
});