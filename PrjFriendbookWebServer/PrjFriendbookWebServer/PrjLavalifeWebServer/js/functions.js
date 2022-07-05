var siteURL = document.URL.split('/');

function Constants () {}
Constants.HOST = 'http://172.16.72.136/';
Constants.ENGLAND = 242;
Constants.HOST = '//' + siteURL[2] + '/';


/* ****************************************************************** */
/* ************  Convert Date To Month & Day ***************** */
/* ****************************************************************** */

function dateToMonthDay(unixTime){
	
	var date = new Date(unixTime*1000);
	var month = new Array();
	month[0] = "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "Jun";
	month[6] = "Jul";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";
	
	return month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

}

function animateSignup(currentStep,gender,image,messageImage){
	
	$("#register ." + currentStep).addClass("hidden").next().removeClass("hidden");
	$('.dot-nav-holder span.current').removeClass('current').next().addClass('current');
	
	$(".backgrounds img.selected").fadeOut(2000, function(){ $(this).remove(); });
	$(".backgrounds img" ).before('<img class="selected" src="images/backgrounds/' + gender + '/' + image + '" />').fadeIn(2000);
	
	$(".moment-register img").fadeOut(2000, function(){  $(".moment-register img").attr("src", "images/" + messageImage).fadeIn(2000); });
	
}

function handleErrors(data){
	
	for (i = 0; i < data.errors.length; i++) { 
	    return $(".errors-holder").html( '<p class="form-error">' + data.errors[i].fieldErrors[0].errMsg + '</p>' );
	}

}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function js_yyyy_mm_dd_hh_mm_ss () {
  now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function returnName(array, key, value) {
 
	for (var i = 0; i < array.length; i++) {
 
		if (array[i][key] == value) {
			return array[i].name;
		}
	}
	return "Ask Me Later";
}

function returnClass(array, key, value) {
 	
	for (var i = 0; i < array.length; i++) {
 		
		if (array[i][key] == value) {
			return array[i].class;
		}
	}
}


function limitText(length, string){
	
	if(string.length > length ){
		return string.substring(0, length) + '..';
	}else{
		return string.substring(0, length);
	}
}

function getMaskArray(value) {
	
	if(value >= 0){

	   var masksResult = [];
	   for (var bitMask = 1, temp = value; temp != 0; bitMask <<= 1, temp >>= 1) {
	      if ((value & bitMask) != 0) {
	         masksResult.push(bitMask);
	      }
	   }
	   return masksResult;
	   
	}else{
		return [-1];
	}
	  
}


function findWithAttr(array, attr, value) {
    
    if ( array == undefined ){ return; }

    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] == value) {
            return i;
        }
    }
}

function findSearch(array, attr, value) {
   
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] == value) {
            return [array[i], i];
        }
    }
}

function returnName(array, key, value) {
	
	if ( array != undefined ){

		for (var i = 0; i < array.length; i++) {
	 
			if (array[i][key] == value) {
				return array[i].name;
			}
		}

	}
	return "Ask Me Later";
}


function showThatSelect(){
    
    var nicknameRel = $( "#nickname" ).attr("rel");
    
    //if (nicknameRel === 'TAKEN'){
    //    return;
    //}
    
    $(".errors-holder").empty();

    // remove postal code 
    // $("#postalCodeForm").remove();
    // show country, province & city select
    //$("#country").attr("data-validation","number");
    //$("#country").attr("data-validation-allowing","range[1;9999999]");
    //$("#province").attr("data-validation","number");
    //$("#province").attr("data-validation-allowing","range[1;9999999]");
    //$("#city").attr("data-validation","number");
    //$("#city").attr("data-validation-allowing","range[1;99999999]");

    $("#countryDiv").show();
    $("#provinceDiv").show();
    $("#cityDiv").show();

    $("#locationPopup").css('display','block');
}

function dropThatSelect(){
		
    var $country = $('#country');
    var $province = $('#province');
    var $county = $('#county');
    var $countyDiv = $('#countyDiv');
    var $city = $('#city');
    var countryId = -1;
    var stateId = -1;
    var loading = "loading...";
    var select = "Select";

    $.getJSON(Constants.HOST + 'mobilejoin/json/city/select').done(function (data) {

        
        $country.find('option').remove();
        $country.append($('<option />').text(select));
        $.each(data, function () {
            $country.append($('<option />').val(this.id).text(this.country));
        });
        $country.selectric();
    });

    $country.change(function(){
        
        var selected = parseInt(this.value);
        
        if ( !selected ){
            return;
        }

        // show loading on select province
        $province.find('option').remove();
        $province.append($('<option />').text( loading ));
        $province.selectric();

        // clear city select
        $city.find('option').remove();
        $city.append($('<option />').text( select ));
        $city.selectric();

        $.getJSON(Constants.HOST + 'mobilejoin/json/city/select?countryId=' + selected)
            .done(function (data) {
                $province.find('option').remove();
                $province.append($('<option />').text(select));
                $.each(data, function () {
                    $province.append($('<option />').val(this.id).text(this.state));
                });
                $province.selectric();
                countryId = selected;
                if ( countryId == Constants.ENGLAND ){
                    
                    $countyDiv.show();
                    $county.attr("data-validation","number");
                    $county.attr("data-validation-allowing","range[1;99999999]");

                } else {
                    $countyDiv.hide();
                    $county.removeAttr("data-validation");
                    $county.removeAttr("data-validation-allowing");
                }
            });
    });

    $province.change(function(){
        
        var selected = parseInt(this.value);

        if ( !selected ){
            return;
        }
        
        if ( countryId == Constants.ENGLAND ){
            
            showCountySelect( countryId, selected );

        } else {
            
            showCitySelect( countryId, selected );
        }
        stateId = selected;
    });

    $county.change(function(){
        
        var countyId = parseInt(this.value);

        if ( !countyId ){
            return;
        }
        showCitySelect( countryId, stateId, countyId );
    })
}

function showCitySelect( countryId, stateId, countyId ){
    
    var $country = $('#country');
    var $province = $('#province');
    var $city = $('#city');
    var loading = "loading...";
    var select = "Select";

    // show loading on select city
    $city.find('option').remove();
    $city.append($('<option />').text( loading ));
    $city.selectric();
    
    var url;
    if ( typeof countyId === 'undefined' ){
        url = Constants.HOST + 'mobilejoin/json/city/select?countryId=' + countryId + '&stateId=' + stateId; 
    } else {
        url = Constants.HOST + 'mobilejoin/json/city/select?countryId=' + countryId + '&stateId=' + stateId + '&countyId=' + countyId;
    }

    $.getJSON( url )
        .done(function (data) {
            $city.find('option').remove();
            $city.append($('<option />').text(select));
            $.each(data, function () {
                $city.append($('<option />').val(this.id).text(this.city)); 
            });
            $city.selectric();
        });
}

function showCountySelect( countryId, countyId ){
   
    var $city = $('#city');
    var $county = $('#county');
    var loading = "loading...";
    var select = "Select";
   
    // show loading on select county
    $county.find('option').remove();
    $county.append($('<option />').text( loading ));
    $county.selectric();

    $.getJSON(Constants.HOST + 'mobilejoin/json/city/select?countryId=' + countryId + '&stateId=' + countyId)
    .done(function (data) {
        $county.find('option').remove();
        $county.append($('<option />').text(select));
        $.each(data, function () {
            $county.append($('<option />').val(this.id).text(this.county)); 
        });
        $county.selectric();
    });
}
