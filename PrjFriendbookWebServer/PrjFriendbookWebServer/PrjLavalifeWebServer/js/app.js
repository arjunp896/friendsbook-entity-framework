/* global ProfileController, io */

// need a better place to put this
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == deleteValue) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };
  
  // Angular:
  var app = angular.module('Lavalife', 
      [ 'ngRoute','ngTextTruncate', 'ui.multiselect', 
        'luegg.directives', 'ngDialog','ui.checkbox', 
        'ui.router', 'ui.router.tabs', 'ui.bootstrap', 
        'ngSanitize','ngAnimate', 'btford.socket-io']);
  
  app.config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  }]);
  
  
  app.config(function($stateProvider) {
      
      $stateProvider.state('user', {
          url:'/membership',
          controller: 'MembershipController',
          templateUrl: 'partials/subscription/header.html'
      })
      
      .state('profile', {
          url:'/myProfile',
          controller: 'myProfileController',
          templateUrl: 'partials/my-profile.html'
      })
      
      .state('account', {
          url:'/account',
          controller: 'AccountController',
          templateUrl: 'partials/my-account.html'
      })
      
      .state('pictures', {
          url:'/myPictures',
          controller: 'myPicturesController',
          templateUrl: 'partials/my-pictures.html'
      })
            
      .state('user.membership', {
          url:'/subscription',
          controller: 'MembershipSubnavController',
          templateUrl: 'partials/subscription/subnav.html'
      })
    
      .state('user.membership.subscription', {
          url:'/subscription',
          controller: 'SubscriptionController',
          templateUrl: 'partials/subscription/subscription.html'
      })
    
      .state('user.membership.options', {
          url: '/options',
          controller: 'PaymentOptionsController',
          templateUrl: 'partials/subscription/options.html'
      })
      
      .state('user.membership.history', {
          url         : '/history',
          controller  : 'PaymentHistoryController',
          templateUrl : 'partials/subscription/history.html'
      })
      
      .state('user.membership.change-subscription', {
          url         : '/change-subscription',
          controller  : 'ChangeSubscriptionController',
          templateUrl : 'partials/subscription/change-subscription.html'
      });
  
  });
  
  
  /* ****************************************************************** */
  /* ************ GLOBAL VARIABLES ***************** */
  /* ****************************************************************** */
  
  app.run(function ($rootScope) {
      
      /*
      * Subscription url needs to be full because safari will sporadically discard anchor tag
      * when redirects to subscription.html. A full url redirect however seems to force safari to
      * retain the anchor tag.
      */
      //$rootScope.SUBCRIPTION_URL = "https://172.16.72.136/subscription.html#membership/subscription"; // DEV
      // $rootScope.SUBCRIPTION_URL = "http://staging2.lavalife.com/subscription.html#membership/subscription"; // STAGING
      $rootScope.SUBCRIPTION_URL = "https://www.lavalife.com/subscription.html#membership/subscription"; // PRODUCTION
  
      /* Facebook APPID */
      $rootScope.appId = '617191578342941'; //880037925358015
      // $rootScope.appId = '842205155841581'; // lavalife.com - Test
  
      /* Constants */
      $rootScope.USA_ID                    = 244;
      $rootScope.METRIC                    = "M";
      $rootScope.IMPERIAL                  = "I";
      $rootScope.DEFAULT_SAVED_SEARCH_NAME = 'SAVED_SEARCH';
      $rootScope.CURRENT_PAGE              = "currentPage";
      $rootScope.FB_ACCESS_TOKEN           = "fb_access_token";
      $rootScope.FB_EMAIL                  = "fb_email";
      $rootScope.FB_PICTURE                = "fb_picture";
      $rootScope.FB_IS_SILHOUETTE          = "fb_is_silhouette";
      $rootScope.FB_GENDER_CONST           = { male: "male", female: "female" };
      $rootScope.CJ_FIRST_TIME_ACTION      = "375815";
      $rootScope.CJ_RETURNING_ACTION       = "375816";
      
      /* member level */
      $rootScope.MEMBER_LEVELS = {
          FREE_TRIAL_EXPIRED : 0,
          FREE_TRIAL         : 1,
          PAID               : 2,
          VIP                : 3
      };
  
      /* Messages Remaining:
      * - The count will be decremented by API after each successful message sent
      * - The field that carries this count is sendRemainingCount
      */
      $rootScope.MESSAGES_REMAINING = {
         FIRST   : 1000, // every free trial will start with this number
         LIMIT   : 0, // this means the limit has been reached.
         WARNING : 2 // this is used to trigger visual cue when limit is about to be reached
      };
  
      $rootScope.FAVORITES_LIMIT = 1000;
  
      /* messages */
      $rootScope.ACTION = {
  
          DELETE : { 
              id: 1, 
              message1: "Delete selected messages?",
              message2: "Delete ALL messages?" },
          MARK_AS_READ : { 
              id: 2, 
              message1: "Mark selected messages as read?",
              message2: "Mark ALL messages as read?" }
      };	
  
  
      $rootScope.PURCHASE_REQUEST_STATUSES = {
          
          RESET            : -1,
          PACKAGE_SELECTED : 1,
          PACKAGE_NONE     : 2,
          PURCHASING       : 3,
          SUCCESS          : 4,
          FAILED           : 5,
          EXPIRY_NONE      : 6,
          CREDIT_CARD_NONE : 7
      };
  
      $rootScope.REQUEST_STATUS = {
          PENDING : 0,
          SUCCESS : 1,
          FAILED  : 2
      };
  
      $rootScope.PRIVATE_TEASER_STATUSES = {
          VIEWER_SENT_RECEIVED_PRIVATE : { id: -1, action_id: 0, text: "<p>This is the Private Photos section.</p>" },
          FREE_Y_N_Y      : { id : 1 , action_id  : 1, text : "<h4>Want to see more?</h4> <p>Unlock the Private Photos feature by activating a paid subscription.</p>" },
          FREE_Y_Y_Y      : { id : 2 , action_id  : 1, text : "<h4>Want to see more?</h4> <p>Unlock the Private Photos feature by activating a paid subscription now.</p>" },
          FREE_Y_Y_N      : { id : 3 , action_id  : 1, text : "<h4>Want to see more?</h4> <p>Unlock the Private Photos feature by activating a paid subscription now.</p>" },
          PAID_Y_N_Y      : { id : 4 , action_id  : 4, text : "<h4>Only Matches can see each otherâ€™s private photos.</h4> <p>Youâ€™ve already liked this profile. Send a message or check back soon.</p>" },
          PAID_Y_Y_Y      : { id : 5 , action_id  : 0, text : "" },
          PAID_Y_Y_N_SENT : { id : 6 , action_id  : 0, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>You already sent a reminder, so check back again soon!</p>" },
          PAID_Y_Y_N      : { id : 7 , action_id  : 2, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>Send a message to remind <span ng-bind-html='getHimOrHer()'></span> to upload some.</p>" },
          FREE_N_N_Y      : { id : 8 , action_id  : 1, text : "<h4>Want to see more?</h4> <p>Unlock the Private Photos feature by activating a paid subscription.</p>" },
          FREE_N_N_N      : { id : 9 , action_id  : 1, text : "<h4>Want to see more?</h4> <p>Unlock the Private Photos feature by activating a paid subscription.</p>" },
          PAID_N_N_Y      : { id : 10, action_id  : 3, text : "<h4>Only Matches can see each otherâ€™s private photos.</h4> <p>Send a like to show <span ng-bind-html='getHimOrHer()'></span> youâ€™re interested!</p>" },
          PAID_N_N_N_SENT : { id : 11, action_id  : 0, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>You already sent a reminder, so check back again soon!</p>" },
          PAID_N_N_N      : { id : 12, action_id  : 2, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>Send a message to remind <span ng-bind-html='getHimOrHer()'></span> to upload some.</p>" },
          FREE_N_Y_Y      : { id : 13, action_id  : 1, text : "<h4>Want to see more?</h4> <p>Unlock the Private Photos feature by activating a paid subscription.</p>" },
          PAID_N_Y_Y      : { id : 14, action_id  : 3, text : "<h4>Only Matches can see each otherâ€™s private photos</h4> <h5>You haven't liked this user back yet!</h5> <p>Send a like to unlock <span ng-bind-html='getHisOrHer()'></span> private photos.</p>" },
          FREE_Y_N_N      : { id : 15, action_id  : 1, text : "<h4>Want to see more?</h4> <p>Unlock the Private Photos feature by activating a paid subscription.</p>" },
          PAID_Y_N_N      : { id : 16, action_id  : 2, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>Send a message to remind <span ng-bind-html='getHimOrHer()'></span> to upload some.</p>" },
          FREE_N_Y_N      : { id : 17, action_id  : 2, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>Send a message to remind <span ng-bind-html='getHimOrHer()'></span> to upload some.</p>" },
          PAID_N_Y_N      : { id : 18, action_id  : 2, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>Send a message to remind <span ng-bind-html='getHimOrHer()'></span> to upload some.</p>" },
          PAID_Y_N_N_SENT : { id : 19, action_id  : 0, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>You already sent a reminder, so check back again soon!</p>" },
          FREE_N_Y_N_SENT : { id : 20, action_id  : 0, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>You already sent a reminder, so check back again soon!</p>" },
          PAID_N_Y_N_SENT : { id : 21, action_id  : 0, text : "<h4><span ng-bind-html='getNickname()'></span> hasn't added any private photos yet.</h4> <p>You already sent a reminder, so check back again soon!</p>" }
          // PAID_Y_N_Y_SENT : { id : 22, action_id  : 0, text : "<h4>Only Matches can see each otherâ€™s private photos.</h4> <p>You have sent a like to this person.</p>" },
          // PAID_N_N_Y_SENT : { id : 23, action_id  : 0, text : "<h4>Only Matches can see each otherâ€™s private photos.</h4> <p>You have sent a like to this person.</p>" },
          // PAID_N_Y_Y_SENT : { id : 24, action_id  : 0, text : "<h4>Only Matches can see each otherâ€™s private photos</h4> <p>You have sent a like to this person.</p>" }
      };
  
      $rootScope.REQUEST_SENT = {
          ABOUT_ME      : "aboutMe",
          FIND_ME_AT    : "findMeAt",
          HOT_LISTED    : "hotListed",
          IDEAL_DATE    : "idealDate",
          INTERESTS     : "interests",
          LIKE_RECEIVED : "likeReceived",
          LIKE_SENT     : "likeSent",
          PRIVATE_PHOTO : "privatePhoto",
          PUBLIC_PHOTO  : "publicPhoto",
      };
      
      $rootScope.PRIVATE_TEASER_ACTIONS = {
          0 : undefined,
          1 : { text : "GO NOW", action : "privateTeaserGoNow()" },
          2 : { text : "SEND"  , action : "privateTeaserSend()" },
          3 : { text : "LIKE"  , action : "privateTeaserLike()" },
          4 : { text : "UNLIKE", action : "privateTeaserUnlike()" }
      };
          
      $rootScope.PICTURE_TYPE = {
          BACKSTAGE : 'backstage',
          GALLERY : 'gallery',
          PROFILE : 'profile',
      }
      
      $rootScope.EMAIL_STATUS = {
          EMAIL_STATUS_VERIFIED : "A",
          EMAIL_STATUS_PENDING : "N",
          EMAIL_STATUS_UNVERIFIED : "U",
          EMAIL_STATUS_REVERIFIED : "R"
     }
  
      /* Create Status Array */
      $rootScope.status = [
          { letter: "a", name: "Single" },
          { letter: "b", name: "Taken" },
          { letter: "c", name: "It's Complicated" },
          { letter: "d", name: "Separated" },
          { letter: "e", name: "Divorced" },
          { letter: "f", name: "Widowed" },
          { letter: "x", name: "Ask Me Later" }
      ];
      
      /* Create Status Binary Array */
      $rootScope.statusBinary = [
          { class: "a", letter: "0", name: "Ask Me Later"},
          { class: "b", letter: "1", name: "Single" },
          { class: "c", letter: "2", name: "Taken" },
          { class: "d", letter: "3", name: "It's Complicated" },
          { class: "e", letter: "4", name: "Separated" },
          { class: "f", letter: "5", name: "Divorced" },
          { class: "g", letter: "6", name: "Widowed" },
      ];
  
      /* Create Seeking Array */
      $rootScope.seeking = [
          { letter: "m-f", name: "Man Interested in Women" },
          { letter: "f-m", name: "Woman Interested in Men" },
          { letter: "m-m", name: "Man Interested in Men" },
          { letter: "f-f", name: "Woman Interested in Women" }
      ];
      
      /* Create Seeking Alt */
      $rootScope.seekingAlt = [
          { letter: "F", name: "Women" },
          { letter: "M", name: "Men" },
      ];
      
      /* Create Body Type array */
      $rootScope.body = [
          { letter: "b", name: "Athletic" },
          { letter: "d", name: "Average" },
          { letter: "e", name: "Curvy" },
          { letter: "f", name: "Plus Size" },
          { letter: "a", name: "Slim" },
          { letter: "x", name: "Ask Me Later" }
      ];
      
      /* Create Ethnicity array */
      $rootScope.ethnicity = [
          { letter: "b", name: "Black" },
          { letter: "a", name: "Caucasian" },
          { letter: "m", name: "East Asian" },
          { letter: "n", name: "European" },
          { letter: "e", name: "First Nations" },
          { letter: "d", name: "Hispanic / Latino" },
          { letter: "g", name: "Middle Eastern" },
          { letter: "i", name: "Mixed" },
          { letter: "k", name: "Pacific Islander" },
          { letter: "o", name: "South Asian" },
          { letter: "h", name: "Other" },
          { letter: "x", name: "Ask Me Later" },
          { letter: "-1", name: "Ask Me Later" }
      ];
      
      /* Create Religion array */
      $rootScope.religion = [
          { letter: "r", name: "Agnostic" },
          { letter: "s", name: "Atheist" },
          { letter: "f", name: "Buddhist" },
          { letter: "d", name: "Catholic" },
          { letter: "e", name: "Christian" },
          { letter: "g", name: "Hindu" },
          { letter: "b", name: "Islamic" },
          { letter: "c", name: "Jewish" },
          { letter: "a", name: "New Age" },
          { letter: "h", name: "Other" },
          { letter: "k", name: "Sikh" },
          { letter: "q", name: "Spiritual" },
          { letter: "x", name: "Ask Me Later" },
          { letter: "-1", name: "Ask Me Later" }
      ];
      
      /* Create Smoking array */
      $rootScope.smoking = [
          { letter: "a", name: "Never" },
          { letter: "b", name: "Socially" },
          { letter: "c", name: "Regularly" },
          { letter: "d", name: "Trying to Quit" },
          { letter: "x", name: "Ask Me Later" }
      ];
      
      /* Create Drinking array */
      $rootScope.drinking = [
          { letter: "a", name: "Never" },
          { letter: "b", name: "Socially" },
          { letter: "c", name: "Often" },
          { letter: "x", name: "Ask Me Later" }
      ];
      
      
      /* Create Looking For Array */
      $rootScope.looking = [
          { letter: "d", name: "Casual Dates" }, //d
          { letter: "r", name: "Relationship" }, //r
          { letter: "l", name: "Long-Term" }, //c
          { letter: "f", name: "Friends" }, //d
          { letter: "h", name: "Hookups" } //i
      ];
      
      /* Create Looking For Array */
      $rootScope.lookingAlt = [
          { letter: "casualDates", name: "Casual Dates" },
          { letter: "relationship", name: "Relationship" },
          { letter: "longTerm", name: "Long Term" },
          { letter: "friends", name: "Friends" },
          { letter: "hookups", name: "Hookups" }
      ];
      
      /* Create Language Array */
      $rootScope.language = [
          { letter: "en", name: "English" },
          { letter: "fr", name: "French" },
          { letter: "es", name: "Spanish" },
          { letter: "pt", name: "Portuguese" },
          { letter: "it", name: "Italian" },
          { letter: "ru", name: "Russian" },
          { letter: "de", name: "German" },
          { letter: "ma", name: "Mandarin" },
          { letter: "cz", name: "Cantonese" },
          { letter: "nl", name: "Dutch" },
          { letter: "el", name: "Greek" },
          { letter: "ja", name: "Japanese" },
          { letter: "ar", name: "Arabic" },
          { letter: "he", name: "Hebrew" },
          { letter: "da", name: "Danish" },
          { letter: "sv", name: "Swedish" },
          { letter: "hi", name: "Hindi" },
          { letter: "th", name: "Thai" },
          { letter: "hu", name: "Hungarian" },
          { letter: "pl", name: "Polish" },
          { letter: "fi", name: "Finnish" },
          { letter: "tl", name: "Tagalog" },
          { letter: "hr", name: "Croatian" },
          { letter: "vi", name: "Vietnamese" },
          { letter: "ko", name: "Korean" },
          { letter: "uk", name: "Ukrainian" }
      ];
      
      /* Create Language Array */
      $rootScope.languageBinary = [
          { class: "en", letter: "1", name: "English" },
          { class: "fr", letter: "2", name: "French" },
          { class: "es", letter: "4", name: "Spanish" },
          { class: "pt", letter: "8", name: "Portuguese" },
          { class: "it", letter: "16", name: "Italian" },
          { class: "ru", letter: "32", name: "Russian" },
          { class: "de", letter: "64", name: "German" },
          { class: "ma", letter: "128", name: "Mandarin" },
          { class: "cz", letter: "256", name: "Cantonese" },
          { class: "nl", letter: "512", name: "Dutch" },
          { class: "el", letter: "1024", name: "Greek" },
          { class: "ja", letter: "2048", name: "Japanese" },
          { class: "ar", letter: "4096", name: "Arabic" },
          { class: "he", letter: "8192", name: "Hebrew" },
          { class: "da", letter: "16384", name: "Danish" },
          { class: "sv", letter: "32768", name: "Swedish" },
          { class: "hi", letter: "65536", name: "Hindi" },
          { class: "th", letter: "131072", name: "Thai" },
          { class: "hu", letter: "262144", name: "Hungarian" },
          { class: "pl", letter: "524288", name: "Polish" },
          { class: "fi", letter: "1048576", name: "Finnish" },
          { class: "tl", letter: "2097152", name: "Tagalog" },
          { class: "hr", letter: "4194304", name: "Croatian" },
          { class: "vi", letter: "8388608", name: "Vietnamese" },
          { class: "ko", letter: "16777216", name: "Korean" },
          { class: "uk", letter: "33554432", name: "Ukrainian" }
      ];
      
      /* Create Education array */
      $rootScope.education = [
          { letter: "b", name: "High School" },
          { letter: "e", name: "Trade" },
          { letter: "f", name: "College" },
          { letter: "g", name: "University" },
          { letter: "d", name: "Post-Graduate" },
          { letter: "y", name: "Other" },
          { letter: "x", name: "Ask Me Later" }
      ];
      
      /* Create Children array */
      $rootScope.hasChildren = [
          { letter: "a", name: "No" },
          { letter: "b", name: "Yes" },
          { letter: "x", name: "Ask Me Later" }
      ];
      
      /* Create Want Children array */
      $rootScope.children = [ 
          { letter: "a", name: "Yes" },
          { letter: "b", name: "No / No More" },
          { letter: "x", name: "Ask Me Later" }
      ];
  
      
      /* Create Income array */
      $rootScope.income = [
          { letter: "a", name: "Under $30K" },
          { letter: "b", name: "$30K - $40K" },
          { letter: "c", name: "$40K - $60K" },
          { letter: "d", name: "$60K - $80K" },
          { letter: "e", name: "$80K - $100K" },
          { letter: "f", name: "$100K - $150K" },
          { letter: "g", name: "Over $150K" },
          { letter: "x", name: "Ask Me Later" }
      ];
      
      /* Create Fubd Ne At Array */
      $rootScope.findMeAt = [
          { letter: "a", name: "A Casino" },
          { letter: "b", name: "A Club / Bar" },
          { letter: "c", name: "A Concert" },
          { letter: "d", name: "A Library" },
          { letter: "e", name: "A Park" },
          { letter: "f", name: "A Rave" },
          { letter: "g", name: "A Sporting Event" },
          { letter: "h", name: "Camping" },
          { letter: "i", name: "College / University" },
          { letter: "j", name: "Computer Gaming" },
          { letter: "k", name: "My House" },
          { letter: "l", name: "The Beach" },
          { letter: "m", name: "The Gym" },
          { letter: "n", name: "The Mall" },
          { letter: "o", name: "The Movies" },
          { letter: "p", name: "Traveling" },
          { letter: "q", name: "Watching Live Music" },
          { letter: "r", name: "With my Pet" },
          { letter: "s", name: "Work" }
      ];
      
      /* Create Fubd Ne At Array */
      $rootScope.findMeAtBinary = [
          { class: "c", name: "A Concert", letter: "1" },
          { class: "b", name: "A Club / Bar", letter: "2" },
          { class: "q", name: "Watching Live Music", letter: "4" },
          { class: "f", name: "A Rave", letter: "8" },
          { class: "g", name: "A Sporting Event", letter: "16" },
          { class: "n", name: "The Mall", letter: "32" },
          { class: "l", name: "The Beach", letter: "64" },
          { class: "k", name: "My House", letter: "128" },
          { class: "e", name: "A Park", letter: "256" },
          { class: "o", name: "The Movies", letter: "512" },
          { class: "m", name: "The Gym", letter: "1024" },
          { class: "a", name: "A Casino", letter: "2048" },
          { class: "j", name: "Computer Gaming", letter: "4096" },
          { class: "s", name: "Work", letter: "8192" },
          { class: "r", name: "With my Pet", letter: "16384" },
          { class: "d", name: "A Library", letter: "32768" },
          { class: "i", name: "College / University", letter: "65536" },
          { class: "p", name: "Traveling", letter: "131072" },
          { class: "h", name: "Camping", letter: "262144" },
          { class: "none", name: "Ask Me Later", letter: "0" },
          { class: "none", name: "Ask Me Later", letter: "-1" }
      ];
      
      /* Create Interests Array */
      $rootScope.interests = [
          { letter: "a", name: "Art" },
          { letter: "b", name: "Astrology" },
          { letter: "c", name: "Books" },
          { letter: "d", name: "Cars" },
          { letter: "e", name: "Cuddling" },
          { letter: "f", name: "DIY" },
          { letter: "g", name: "Drinking Games" },
          { letter: "h", name: "Extreme Sports" },
          { letter: "i", name: "Family / Friends" },
          { letter: "j", name: "Fitness" },
          { letter: "k", name: "Food" },
          { letter: "l", name: "Gaming" },
          { letter: "m", name: "Home Renovation" },
          { letter: "n", name: "Movies" },
          { letter: "o", name: "Music" },
          { letter: "p", name: "News / Politics" },
          { letter: "q", name: "Outdoors" },
          { letter: "r", name: "Pets" },
          { letter: "s", name: "Philanthropy" },
          { letter: "t", name: "Photography" },
          { letter: "u", name: "Shopping" },
          { letter: "v", name: "Social Media" },
          { letter: "w", name: "Sports" },
          { letter: "x", name: "Technology" },
          { letter: "y", name: "Travel" },
          { letter: "z", name: "TV" },
          { letter: "zz", name: "Video Games" },
          { letter: "zzz", name: "Yoga" },
          { letter: "-1", name: "Ask Me Later" },
      ];
      
      /* Create My Interests Binary Array */
      $rootScope.interestsBinary = [
          { letter: "1", name: "Travel", class: "y" },
          { letter: "2", name: "Pets", class: "r" },
          { letter: "4", name: "Sports", class: "w"  },
          { letter: "8", name: "Fitness", class: "j"  },
          { letter: "16", name: "Gaming", class: "l"  },
          { letter: "32", name: "Outdoors", class: "q"  },
          { letter: "64", name: "Movies", class: "n"  },
          { letter: "128", name: "Music", class: "o"  },
          { letter: "256", name: "Books", class: "c"  },
          { letter: "512", name: "Yoga", class: "zzz"  },
          { letter: "1024", name: "Food", class: "k"  },
          { letter: "2048", name: "Drinking Games", class: "g"  },
          { letter: "4096", name: "Cars", class: "d"  },
          { letter: "8192", name: "Cuddling", class: "e"  },
          { letter: "16384", name: "Extreme Sports", class: "h"  },
          { letter: "32768", name: "Technology", class: "x"  },
          { letter: "65536", name: "Astrology", class: "b"  },
          { letter: "131072", name: "News / Politics", class: "p"  },
          { letter: "262144", name: "DIY", class: "f"  },
          { letter: "1048576", name: "Shopping", class: "u"  },
          { letter: "2097152", name: "TV", class: "z"  },
          { letter: "4194304", name: "Social Media", class: "v"  },
          { letter: "8388608", name: "Video Games", class: "zz"  },
          { letter: "16777216", name: "Art", class: "a"  },
          { letter: "33554432", name: "Photography", class: "t" },
          { letter: "67108864", name: "Home Renovation", class: "m" },
          { letter: "134217728", name: "Philanthropy", class: "s" },
          { letter: "268435456", name: "Family / Friends", class: "i" },
          { letter: "0", name: "Ask Me Later", class: "none" },
          { letter: "-1", name: "Ask Me Later", class: "none" }
          
      ];
      
      /* Create My Personality Array */
      $rootScope.personality = [
          { letter: "1", class: "a", name: "Creative" },
          { letter: "2", class: "b", name: "Athletic" },
          { letter: "3", class: "c", name: "Adventurer" },
          { letter: "4", class: "d", name: "Hopeless Romantic" },
          { letter: "5", class: "e", name: "Pessimist" },
          { letter: "6", class: "f", name: "Activist" },
          { letter: "7", class: "g", name: "Comedian" },
          { letter: "8", class: "h", name: "Artistic" },
          { letter: "9", class: "i", name: "Lazy" },
          { letter: "10", class: "j", name: "Party Animal" },
          { letter: "11", class: "k", name: "Music Lover" },
          { letter: "12", class: "l", name: "Geek" },
          { letter: "13", class: "m", name: "Intellectual" },
          { letter: "14", class: "n", name: "Player" },
          { letter: "15", class: "o", name: "Shy" },
          { letter: "16", class: "p", name: "Night Owl" },
          { letter: "17", class: "q", name: "Animal-Lover" },
          { letter: "18", class: "r", name: "Professional" },
          { letter: "19", class: "s", name: "Techie" },
          { letter: "20", class: "t", name: "Hippie" },
          { letter: "21", class: "u", name: "Ambitious" },
          { letter: "22", class: "v", name: "Stubborn" },
          { letter: "23", class: "w", name: "Optimist" },
          { letter: "24", class: "x", name: "Easy Going" }
      ];
  
      /* Create Zodiac Array */
      /*$rootScope.zodiac = [
          { letter: "a", name: "Aries" },
          { letter: "b", name: "Taurus" },
          { letter: "c", name: "Libra" },
          { letter: "d", name: "Gemini" },
          { letter: "e", name: "Cancer" },
          { letter: "f", name: "Leo" },
          { letter: "g", name: "Virgo" },
          { letter: "h", name: "Scorpio" },
          { letter: "i", name: "Sagittarius" },
          { letter: "j", name: "Capricorn" },
          { letter: "k", name: "Aquarius" },
          { letter: "l", name: "Pisces" }
      ];*/
      
      /* Create Zodiac Array */
      $rootScope.zodiac = [
          { letter: "a", name: "Aries" },
          { letter: "b", name: "Taurus" },
          { letter: "c", name: "Gemini" },
          { letter: "d", name: "Cancer" },
          { letter: "e", name: "Leo" },
          { letter: "f", name: "Virgo" },
          { letter: "g", name: "Libra" },
          { letter: "h", name: "Scorpio" },
          { letter: "i", name: "Sagittarius" },
          { letter: "j", name: "Capricorn" },
          { letter: "k", name: "Aquarius" },
          { letter: "l", name: "Pisces" }
      ];
      
      /* Create Height Feet array */
      $rootScope.heightFeet = [
          { letter: "3.0", name: "3'0" },
          { letter: "3.1", name: "3'1" },
          { letter: "3.2", name: "3'2" },
          { letter: "3.3", name: "3'3" },
          { letter: "3.4", name: "3'4" },
          { letter: "3.5", name: "3'5" },
          { letter: "3.6", name: "3'6" },
          { letter: "3.7", name: "3'7" },
          { letter: "3.8", name: "3'8" },
          { letter: "3.9", name: "3'9" },
          { letter: "3.10", name: "3'10" },
          { letter: "3.11", name: "3'11" },
          { letter: "4.0", name: "4'0" },
          { letter: "4.1", name: "4'1" },
          { letter: "4.2", name: "4'2" },
          { letter: "4.3", name: "4'3" },
          { letter: "4.4", name: "4'4" },
          { letter: "4.5", name: "4'5" },
          { letter: "4.6", name: "4'6" },
          { letter: "4.7", name: "4'7" },
          { letter: "4.8", name: "4'8" },
          { letter: "4.9", name: "4'9" },
          { letter: "4.10", name: "4'10" },
          { letter: "4.11", name: "4'11" },
          { letter: "5.0", name: "5'0" },
          { letter: "5.1", name: "5'1" },
          { letter: "5.2", name: "5'2" },
          { letter: "5.3", name: "5'3" },
          { letter: "5.4", name: "5'4" },
          { letter: "5.5", name: "5'5" },
          { letter: "5.6", name: "5'6" },
          { letter: "5.7", name: "5'7" },
          { letter: "5.8", name: "5'8" },
          { letter: "5.9", name: "5'9" },
          { letter: "5.10", name: "5'10" },
          { letter: "5.11", name: "5'11" },
          { letter: "6.0", name: "6'0" },
          { letter: "6.1", name: "6'1" },
          { letter: "6.2", name: "6'2" },
          { letter: "6.3", name: "6'3" },
          { letter: "6.4", name: "6'4" },
          { letter: "6.5", name: "6'5" },
          { letter: "6.6", name: "6'6" },
          { letter: "6.7", name: "6'7" },
          { letter: "6.8", name: "6'8" },
          { letter: "6.9", name: "6'9" },
          { letter: "6.10", name: "6'10" },
          { letter: "6.11", name: "6'11" },
          { letter: "7.0", name: "7'0" },
          { letter: "7.1", name: "7'1" },
          { letter: "7.2", name: "7'2" },
          { letter: "7.3", name: "7'3" },
          { letter: "7.4", name: "7'4" },
          { letter: "7.5", name: "7'5" },
          { letter: "7.7", name: "7'6" },
          { letter: "7.7", name: "7'7" },
          { letter: "7.8", name: "7'8" },
          { letter: "7.9", name: "7'9" },
          { letter: "7.10", name: "7'10" },
          { letter: "7.11", name: "7'11" },
          { letter: "8.0", name: "8'0" }
      ];
      
      /* Create Height Feet (3 to 8) array */
      $rootScope.heightFt = [
          { letter: "3", name: "3" },
          { letter: "4", name: "4" },
          { letter: "5", name: "5" },
          { letter: "6", name: "6" },
          { letter: "7", name: "7" },
          { letter: "8", name: "8" }
      ];
      
      /* Create Height Inches (0 to 11) array */
      $rootScope.heightIn = [
          { letter: "0", name: "0" },
          { letter: "1", name: "1" },
          { letter: "2", name: "2" },
          { letter: "3", name: "3" },
          { letter: "4", name: "4" },
          { letter: "5", name: "5" },
          { letter: "6", name: "6" },
          { letter: "7", name: "7" },
          { letter: "8", name: "8" },
          { letter: "9", name: "9" },
          { letter: "10", name: "10" },
          { letter: "11", name: "11" }
      ];
      
      $rootScope.Polar = [
          { letter: "1", name: "Yes" },
          { letter: "0", name: "No" }
      ];
  
      $rootScope.CURRENCY = {
         13: "AUD",
         40: "CAD",
         244: "USD"
      };
  
      /* Create Years array */
      $rootScope.years = [];
      for (var year = new Date().getFullYear() - 110; year <= new Date().getFullYear(); year++) {
          $rootScope.years.push(year);
      }
      
      /* Create Years Alt */
      $rootScope.yearsAlt = [];
      for (var year = new Date().getFullYear() - 110; year <= new Date().getFullYear()-18; year++) {
          $rootScope.yearsAlt.push({number:year, name:year});
      }
      
      /* Create Days array */
      $rootScope.days = [];
      for (var count = 1; count <= 31; count++) {
          $rootScope.days.push(count);
      }
      
      /* Create Days Alt */
      $rootScope.daysAlt = [];
      for (var count = 1; count <= 31; count++) {
          $rootScope.daysAlt.push({number:count, name:count});
      }
  
      /* Create Age array */
      $rootScope.ages = [];
      for (var count = 18; count <= 99; count++) {
          $rootScope.ages.push( { letter: count, name: count });
      }
      
      /* Create Months array */
      $rootScope.months = [ 
          { number: 1, name: "January" },
          { number: 2, name: "February"} ,
          { number: 3, name: "March" },
          { number: 4, name: "April"} ,
          { number: 5, name: "May" },
          { number: 6, name: "June" },
          { number: 7, name: "July" },
          { number: 8, name: "August" },
          { number: 9, name: "September" },
          { number: 10, name: "October" },
          { number: 11, name: "November" },
          { number: 12, name: "December" } 
      ];
      
      /* Create Months Alt */
      $rootScope.monthsAlt = [ 
          { number: 1, name: "Jan" },
          { number: 2, name: "Feb" } ,
          { number: 3, name: "Mar" },
          { number: 4, name: "Apr" } ,
          { number: 5, name: "May" },
          { number: 6, name: "Jun" },
          { number: 7, name: "Jul" },
          { number: 8, name: "Aug" },
          { number: 9, name: "Sep" },
          { number: 10, name: "Oct" },
          { number: 11, name: "Nov" },
          { number: 12, name: "Dec" } 
      ];
      
      /* Create Distance array */
      $rootScope.distanceKM = [ 
          { letter: "5", name: "5 KM" },
          { letter: "10", name: "10 KM"} ,
          { letter: "25", name: "25 KM" },
          { letter: "50", name: "50 KM"} ,
          { letter: "100", name: "100 KM" },
          { letter: "500", name: "500 KM" },
          { letter: "1000", name: "1000 KM" },
          { letter: "2000", name: "2000 KM" },
          { letter: "3000", name: "All" },
      ];
      $rootScope.distanceMILES = [ 
          { letter: "5", name: "5 MILES" },
          { letter: "10", name: "10 MILES"} ,
          { letter: "25", name: "25 MILES" },
          { letter: "50", name: "50 MILES"} ,
          { letter: "100", name: "100 MILES" },
          { letter: "500", name: "500 MILES" },
          { letter: "1000", name: "1000 MILES" },
          { letter: "2000", name: "2000 MILES" },
          { letter: "3000", name: "All" },
      ];
      
      
      /* Create Covers array */
      $rootScope.covers = [ 
          { letter: "0", name: "images/backgrounds/covers/ll_my_profile_cover.jpg", class: ''},
          { letter: "1", name: "images/backgrounds/covers/ll_profile_cover_1.jpg", class: ''},
          { letter: "2", name: "images/backgrounds/covers/ll_profile_cover_2.jpg", class: ''},
          { letter: "3", name: "images/backgrounds/covers/ll_profile_cover_3.jpg", class: ''},
          { letter: "4", name: "images/backgrounds/covers/ll_profile_cover_5.jpg", class: ''},
          { letter: "100", name: "images/backgrounds/covers/ll_profile_cover_paid_v1.jpg", class: ''},
          { letter: "101", name: "images/backgrounds/covers/ll_profile_cover_paid_v2.jpg", class: ''},
          { letter: "102", name: "images/backgrounds/covers/ll_profile_cover_paid_v3.jpg", class: ''},
          { letter: "103", name: "images/backgrounds/covers/ll_profile_cover_paid_v4.jpg", class: ''},
          { letter: "104", name: "images/backgrounds/covers/ll_profile_cover_paid_v5.jpg", class: ''},
          { letter: "105", name: "images/backgrounds/covers/ll_profile_cover_paid_v6.jpg", class: ''},
          { letter: "106", name: "images/backgrounds/covers/ll_profile_cover_paid_v7.jpg", class: ''},
          { letter: "107", name: "images/backgrounds/covers/ll_profile_cover_paid_v8.jpg", class: ''},
          { letter: "108", name: "images/backgrounds/covers/ll_profile_cover_paid_v9.jpg", class: ''},
          { letter: "109", name: "images/backgrounds/covers/ll_profile_cover_paid_v10.jpg", class: ''},
          { letter: "110", name: "images/backgrounds/covers/ll_profile_cover_paid_v11.jpg", class: ''},
          { letter: "111", name: "images/backgrounds/covers/ll_profile_cover_paid_v12.jpg", class: ''},
          { letter: "112", name: "images/backgrounds/covers/ll_profile_cover_paid_v13.jpg", class: ''},
          { letter: "113", name: "images/backgrounds/covers/ll_profile_cover_paid_v14.jpg", class: ''},
          { letter: "114", name: "images/backgrounds/covers/ll_profile_cover_paid_v15.jpg", class: ''},
          { letter: "115", name: "images/backgrounds/covers/ll_profile_cover_paid_v16.jpg", class: ''},
          { letter: "116", name: "images/backgrounds/covers/ll_profile_cover_paid_v17.jpg", class: ''},
          { letter: "117", name: "images/backgrounds/covers/ll_profile_cover_paid_v18.jpg", class: ''},
          { letter: "118", name: "images/backgrounds/covers/ll_profile_cover_paid_v19.jpg", class: ''},
          { letter: "119", name: "images/backgrounds/covers/ll_profile_cover_paid_v20.jpg", class: ''},
          { letter: "120", name: "images/backgrounds/covers/ll_profile_cover_paid_v21.jpg", class: ''},
          { letter: "121", name: "images/backgrounds/covers/ll_profile_cover_paid_v22.jpg", class: ''},
          { letter: "200", name: "images/backgrounds/covers/ll_profile_cover_4_wm.jpg", class: ''},
          { letter: "201", name: "images/backgrounds/covers/ll_profile_cover_1_wm.jpg", class: ''},
          { letter: "202", name: "images/backgrounds/covers/ll_profile_cover_2_wm.jpg", class: ''},
          { letter: "203", name: "images/backgrounds/covers/ll_profile_cover_3_wm.jpg", class: ''},
          { letter: "204", name: "images/backgrounds/covers/ll_profile_cover_5_wm.jpg", class: ''},
          
      ];
  
      /*Create Reasons Array*/
      $rootScope.reasons = [
          { letter: "6", name: "Iâ€™ve met someone through Lavalife.com"},
          { letter: "7", name: "Iâ€™ve met someone through another online dating site"},
          { letter: "8", name: "I havenâ€™t had any luck on Lavalife.com and need a break"},
          { letter: "9", name: "Iâ€™m considering switching to another online dating site"},
          { letter: "10", name: "Iâ€™d prefer not to say"},
          { letter: "11", name: "Other"}	
      ];
      
      /* Create Search Type array */
      $rootScope.searchList = [
          { name: 'blocklist', searchId: '' , page: '', next: '', data: '', date: '' },
          { name: 'connection', searchId: '' , page: '', next: '', data: '', date: 'likeReceived' },
          { name: 'smileReceived', searchId: '' , page: '', next: '', data: '', date: 'likeReceived' },
          { name: 'smileSent', searchId: '' , page: '', next: '', data: '', date: 'likeSent' },
          { name: 'hotlist', searchId: '' , page: '', next: '', data: '', date: '' },
          { name: 'viewedMe', searchId: '' , page: '', next: '', data: '', date: 'viewReceived' },
          { name: 'viewedYou', searchId: '' , page: '', next: '', data: '', date: 'viewSent' }
      ];
      
      /* Global variables for type of "notification" */
      $rootScope.msgType = 'Received';
      $rootScope.likesType = 'smileReceived';
      $rootScope.viewsType = 'viewedMe';
      $rootScope.favoritesType = 'hotlist';
          
      $rootScope.defaultProfileImage = 'images/ll_profile_blank_img.png';
      
         
  
      // CJ - this is the part where "source=cjaffiliate" need to persist in query string	
      $rootScope.$on("$routeChangeSuccess", function (e, current) {
          $rootScope.query = $.param(current.params);
      });
  
  });
  
  
  /* ****************************************************************** */
  /* ************ ROUTE PROVIDER ***************** */
  /* ****************************************************************** */
  
  app.config(['$routeProvider',function($routeProvider, $location) {
      
      
      $routeProvider.
          when('/', {
              templateUrl: 'partials/search-results.html',
              controller: 'SearchController'
          })
          .when('/dashboard2.html#/', {
              templateUrl: 'partials/my-pictures.html',
              controller: 'myPicturesController'
          })
          .when('/search/:param/minAge/:minAge?/maxAge?/:maxAge/distance/:distance/seeking/:seeking?', {
              templateUrl: 'partials/search-results.html',
              controller: 'SearchController'
          })
          .when('/search/:param/minAge/:minAge?/maxAge/:maxAge?/distance/:distance?/seeking/:seeking?/online/:online?/ethnicityType/:ethnicity?/minHeightFt/:minHeightFt?/minHeightIn/:minHeightIn?/maxHeightFt/:maxHeightFt?/maxHeightIn/:maxHeightIn?/minHeightCm/:minHeightCm?/maxHeightCm/:maxHeightCm?/bodyType/:bodyType?/smokerType/:smokerType?/drinkerType/:drinkerType?/language/:language?/religionType/:religionType?/hasChildrenType/:hasChildrenType?/education/:education?/income/:income?', {
              templateUrl: 'partials/search-results.html',
              controller: 'SearchController'
          })
          .when('/search/:param/', {
              templateUrl: 'partials/search-results.html',
              controller: 'SearchController'
          })
      .when('/search/newUser/', {
              templateUrl: 'partials/search-results.html',
              controller: 'SearchController'
          })
          .when('/profile/:userID/:preview?', {
              templateUrl: 'partials/view-profile.html',
              controller: ProfileController,
              resolve: { profileData: ProfileController.loadData }
          })
          .when('/account/', {
              templateUrl: 'partials/my-account.html',
              controller: 'AccountController'
          })
          .when('/myProfile/', {
              templateUrl: 'partials/my-profile.html',
              controller: 'myProfileController'
          })
          .when('/myProfile/newUser/', {
              templateUrl: 'partials/my-profile.html',
              controller: 'myProfileController'
          })
          .when('/myPictures/', {
              templateUrl: 'partials/my-pictures.html',
              controller: 'myPicturesController'
          })
          .when('/membership/', {
              //templateUrl: 'partials/my-pictures.html',
              //controller: 'myPicturesController',
              resolve: {
                  urlCheck: function(){
                      var siteURL = document.URL.split('/');
                      console.log(siteURL);
                      
                  }
              }
          })
          .when('/:mode', {
              templateUrl: 'partials/search-results.html',
              controller: 'SearchController'
          })
          .otherwise({
              redirectTo: '/'
          });
  }]);
  
  /* ****************************************************************** */
  /* ************ SEARCH FUNCTIONS ***************** */
  /* ****************************************************************** */
  
  app.factory('search', function($rootScope, ajaxRequest, ViewMyProfile) {
  
      function stringInArrayEh(str, strArray)
      {
          for (var j = 0; j < strArray.length; j++)
          {
              if (strArray[j].match(str))
                 
                  return j;
          }
          return -1;
      }
  
      return {
          
          openUrl: function(url) {
              
              $rootScope.functions.closeLikes();
              $rootScope.functions.closeViews();
              $rootScope.functions.closeFavorites();
              $rootScope.functions.closeMessages();
              
              location.href = url;
          },
          search: function(name, ignoreSearchId, afterSearch ){	
              var findObject = findSearch($rootScope.searchList, 'name', name);
              var searchObject = findObject[0];
                          
              if ( !ignoreSearchId && searchObject.searchId > 0) {
                  $rootScope.functions.subsequentSearch(searchObject.name, searchObject.searchId, searchObject.page, findObject[1]);
              } else {
                  $rootScope.functions.initialSearch( searchObject.name, findObject[1], afterSearch );
              }
              
          },
          initialSearch: function (name, index, afterSearch )
          {
              $rootScope.searchStart = true;
              dateCheck = $rootScope.searchList[index].date;
  
              var postData = {};
              var url = '/member/dating/json/search/predefined/' + name;
              var success = function (data)
              {
                  $rootScope.mySearchObjects = [];
                  $rootScope.searchList[index].name = name;
                  $rootScope.searchList[index].searchId = data.nav.searchId;
                  
                  $rootScope.searchList[index].page = typeof data.nav.page !== "undefined" ? data.nav.next - 1 : 1;
                  $rootScope.searchList[index].next = typeof data.nav.next !== "undefined" ? data.nav.next : undefined;
  
                  // console.log("$rootScope.mySearchObjects: ", $rootScope.mySearchObjects);
                  for (i = 0; i < data.list.length; i++)
                  {
                      data.list[i].date = dateToMonthDay(data.list[i][dateCheck]);
                      data.list[i].gender == "F" ? data.list[i].thumb = "images/ll_profile_female_img.png" : data.list[i].thumb = "images/ll_profile_male_img.png" ;
                      
                      if (data.list[i].pictures.length > 0 && typeof data.list[i].pictures[0] !== 'undefined')
                      {
                          data.list[i].thumb = '/pictures/thumb/' + data.list[i].pictures[0].replace('.jpeg', 'l.jpeg');
                      }
                      
                      $rootScope.mySearchObjects.push(data.list[i]);
                  };
                  $rootScope.searchStart = false;
                  
                  if ( afterSearch != undefined ){
                      afterSearch();
                  }
  
                  console.log( "isFreeTrial: ", $rootScope.isFreeTrial );
                  
                  if ( ViewMyProfile.get().memberLevel == $rootScope.MEMBER_LEVELS.FREE_TRIAL && name === "viewedMe" ){
                      
                      // Membership limitations for Viewed Me as Free Trial member is here for now.
                      var hiddenCount = $rootScope.mySearchObjects.length - 100;
                      $rootScope.freeTrialHiddenCount = hiddenCount; 
                      $rootScope.mySearchObjects.splice( 100, ($rootScope.mySearchObjects.length - 100) );
                      $rootScope.searchList[index].next = undefined;
                  }
              };
              var error = function (data)
              { };
  
              ajaxRequest.speak(url, success, error, postData);
  
          }, 
          subsequentSearch: function(name, searchId, page, index){
              
              $rootScope.mySearchObjects = [];
              dateCheck = $rootScope.searchList[index].date;
              $rootScope.searchStart = true;
              
              var postData = { searchId: searchId, page: page };
              var url = '/member/dating/json/search/subsequent/page';
              var success = function(data){ 
                  
                  $rootScope.searchList[index].name = name;
                  $rootScope.searchList[index].searchId = data.nav.searchId;
                  $rootScope.searchList[index].page =  typeof data.nav.page !== "undefined" ? data.nav.next - 1 : 1;
                  $rootScope.searchList[index].next =  typeof data.nav.next !== "undefined" ? data.nav.next : undefined;
                  
                  for( i=0; i < data.list.length; i++ ){
                      data.list[i].date = dateToMonthDay(data.list[i][dateCheck]);
                      $rootScope.mySearchObjects.push(data.list[i]);
                  };
                  $rootScope.searchStart = false;	
              };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
              
          },
          
          searchNextPage: function (name)
          {
              var findObject = findSearch($rootScope.searchList, 'name', name);
              var searchObject = findObject[0];
              //var page = parseInt(searchObject.page) + 1;
              var index = findObject[1];
  
              if (typeof searchObject.next !== 'undefined')
              {
                  var postData = { searchId: searchObject.searchId, page: searchObject.next };
                  var url = '/member/dating/json/search/subsequent/page';
                  var success = function (data)
                  {  
                      $rootScope.searchNextPageStart = false;
  
                      if ( data.nav != undefined ){
                          $rootScope.searchList[index].next = data.nav.next;
                      } else {
                          $rootScope.searchList[index].next = undefined; 
                      }
                      
                      if (data.list != undefined){
                          for (i = 0; i < data.list.length; i++)
                          {
                              //data.list[i].date = name === "hotlist" ? dateToMonthDay(data.list[i].viewSent) : dateToMonthDay(data.list[i].viewReceived);
                              data.list[i].date = dateToMonthDay( data.list[i][searchObject.date] );
                              data.list[i].thumb = "images/ll_profile_blank_img.png";
                              if (data.list[i].pictures.length > 0 && typeof data.list[i].pictures[0] !== 'undefined')
                              {
                                  data.list[i].thumb = '/pictures/thumb/' + data.list[i].pictures[0].replace('.jpeg', 'l.jpeg');
                              }
                              
                              $rootScope.mySearchObjects.push(data.list[i]);
                          };
                      }
                                      };
                  var error = function (data) {};
                  
                  $rootScope.searchNextPageStart = true;
                  ajaxRequest.speak(url, success, error, postData);
              }
          }, 
          
          openMiniView: function (userId){
              
              $rootScope.miniOpen = true;
              $rootScope.profileId = userId;
              
              var postData = { userId: userId };
              var url = '/member/dating/v1.1/json/search/viewProfileByUserId';
              
              var success = function(data){
                  
                  data.favCheck = (data.likeSent == true ? "liked" : "like");
                  data.likeCheck = data.hotListed != false ? "favorited" : "favorite";	    		
                  data.zodiac = { 'name': returnName($rootScope.zodiac, "letter", data.zodiac), 'class': data.zodiac  };
                  if (data.gender == 'F'){
                      data.fullGender = 'her';
                      data.posGender = 'her';
                  }else{
                      data.fullGender = 'him';
                      data.posGender = 'his';
                  }
                  data.incommon = data.profileExtra.commonInterests;
                  data.incommon = typeof data.incommon == "undefined" ? 0 : getMaskArray(data.profileExtra.commonInterests);
                                      
                  data.personality = { 
                      'name': returnName($rootScope.personality, "letter", data.profileExtra.personality), 
                      'class': returnName($rootScope.personality,
                      'class', data.profileExtra.personality)
                  };
                                      
                  if( data.incommon.length > 0){
                  
                  for (var i = 0; i < data.incommon.length; i++) {
                      
                      data.incommon[i] = { 
                          'name': returnName($rootScope.interestsBinary, "letter", data.incommon[i]), 
                          'class': returnClass($rootScope.interestsBinary, "letter", data.incommon[i])
                      };
                      
                      data.commonCheck = true;
                      
                  }
                  
                  }else{
                  
                      data.commonCheck = false;
                  }
  
                  $rootScope.miniViewed = data;
                  $rootScope.miniViewed.gender == "F" ? $rootScope.miniViewed.errSrc = 'images/ll_profile_female_img.png' : $rootScope.miniViewed.errSrc = 'images/ll_profile_male_img.png';
                  $rootScope.miniViewed.pictures[0] ? $rootScope.miniViewed.src = "/pictures/thumb/"+$rootScope.miniViewed.pictures[0].replace('.jpeg', 'l.jpeg') : $rootScope.miniViewed.src = $rootScope.miniViewed.errSrc;
                   
              }
              
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
          
          },
          openFirst: function (userId, index){
                          
              if(index == 0){
                  
                  
                  $rootScope.profileId = userId;
                  
                  var postData = { userId: userId };
                  var url = '/member/dating/v1.1/json/search/viewProfileByUserId';
                  
                  var success = function(data){
                      
                      data.favCheck = (data.likeSent == true ? "liked" : "like");
                      data.likeCheck = (data.hotListed == true ? "favorited" : "favorite");
                      data.zodiac = { 'name': returnName($rootScope.zodiac, "letter", data.zodiac), 'class': data.zodiac  };
                      data.incommon = getMaskArray(data.profileExtra.commonInterests);
                      if (data.gender == 'F'){
                          data.fullGender = 'her';
                          data.posGender = 'her';
                      }else{
                          data.fullGender = 'him';
                          data.posGender = 'his';
                      }
  
                                          
                      data.personality = { 
                          'name': returnName($rootScope.personality, "letter", data.profileExtra.personality), 
                          'class': returnName($rootScope.personality,
                          'class', data.profileExtra.personality)
                      };
                                          
                      if( data.incommon.length > 0){
                      
                      for (var i = 0; i < data.incommon.length; i++) {
                          
                          data.incommon[i] = { 
                              'name': returnName($rootScope.interestsBinary, "letter", data.incommon[i]), 
                              'class': returnClass($rootScope.interestsBinary, "letter", data.incommon[i])
                          };
                          
                          data.commonCheck = true;
                          
                      }
                      
                      }else{
                      
                          data.commonCheck = false;
                      }
                  
                      $rootScope.miniViewed = data;
                  }
                  
                  var error = function(data){ };
                  
                  ajaxRequest.speak(url,success,error,postData);
              }
          
          },
          closeMarketingMessage: function(){
              $rootScope.miniOpen = true;
          },
          openMarketingMessage: function(){
              $rootScope.miniOpen = false;
          },
          openAdvanced: function( forceClose ){
              
              if ( forceClose == false ){
                  
                  $("#advanced-search-popup").css('display','none');
                  $("#advanced-search-modal").modal('hide');
                  $rootScope.searchAdvance = false;
                  return;
              }
  
              $rootScope.searchAdvance = $rootScope.searchAdvance == true ? false : true
  
              if ($rootScope.searchAdvance){
                  $("#advanced-search-popup").css('display','block');
                  $("#advanced-search-modal").modal('show');
              } else {
                  $("#advanced-search-popup").css('display','none');
                  $("#advanced-search-modal").modal('hide'); 
              }
          },
          openUsernameSearch: function () {

              $rootScope.searchUsername = $rootScope.searchUsername == true ? false : true
  
              if ($rootScope.searchUsername){
                  $("#username-search-popup").css('display','block');
                  $("#username-search-modal").modal('show');
              } else {
                  $("#username-search-popup").css('display','none');
                  $("#username-search-modal").modal('hide'); 
              }
          }
      };
  });
  
  
  app.factory('socket', function (socketFactory)
  {
      var mySocket = io.connect('/socket', {
          reconnectionDelay: 5000
      });
  
      mySocket = socketFactory({
          ioSocket: mySocket
      });
      
      return mySocket;
  });
  
  /* ****************************************************************** */
  /* ************ MESSAGES FUNCTIONS ***************** */
  /* ****************************************************************** */
  
  app.factory('messages', function($http, ajaxRequest, $rootScope, logSessionError, ngDialog, ViewMyProfile) {
      
      return {
          openMessages: function (name) 
          {
              $rootScope.messagesOpen = true;
              $rootScope.messagesProfileData = [];
  
              if ($rootScope.likesOpen) $rootScope.functions.closeLikes();
              if ($rootScope.viewsOpen) $rootScope.functions.closeViews();
              if ($rootScope.favoritesOpen) $rootScope.functions.closeFavorites();
  
              //$(".messages").css("z-index","6").slideDown(10);
              //$(".mask-nav").fadeIn(100);
              $(".messages").css("z-index","6").fadeIn(150);
              $(".mask-nav").fadeIn(200);
  
              $("body").addClass('noscroll');
  
              var postData = { messageType: "mailGroup", boxType: $rootScope.msgType, resultPerPage: 25 };
              var url = '/member/mailbox/getList';
              
              var success = function (data)
              {
                  $rootScope.messages = [];
                  $rootScope.messagesSearchId = data.nav.searchId;
                  $rootScope.messagesSearchNext = data.nav.next;
  
                  for (i = 0; i < data.list.length; i++)
                  {
                      if (!data.list[i].profilePicture){
                          data.list[i].gender == "F" ? data.list[i].profilePicture = "images/ll_profile_female_img.png" :  "images/ll_profile_male_img.png" ;
                      } 
                      $rootScope.messages.push(data.list[i]);
                      data.list[i].date = dateToMonthDay(data.list[i].date);
                      data.list[i].status = $rootScope.msgType === 'Sent' ? 'S' : data.list[i].status;
                  };
              };
              
              var error = function (data) {};
              ajaxRequest.speak(url, success, error, postData);
  
              ajaxRequest.speak('/member/billing/accountInfo', 
                  function (data) {
                      $rootScope.subscribed = data.isActiveSubscription;
                  }, 
                  function (data) {}, 
                  {});
          },
          
          closeMessages: function ()
          {
              // $rootScope.idSelected = undefined;
              $rootScope.messagesOpen = false;
              $(".messages").css("z-index", "5").fadeOut(150);
              $("body").removeClass('noscroll');
              $rootScope.messagesOpen || $rootScope.likesOpen || $rootScope.viewsOpen || $rootScope.favoritesOpen ? '' : $(".mask-nav").hide();
  
              $rootScope.functions.reloadCounts('message');
          },
          
          openMessage: function(userId, image, avatar, idSelected, nickname ) 
          {
              $rootScope.avatar = avatar;
              $rootScope.openedMessageNickname = nickname;
  
              var postData = { userId: userId, showResponseGeneratedByCannedMessage: 1 };
              var url = '/member/v1.1/json/stats/conversation/list';
              
              //image = image && image !== $rootScope.defaultProfileImage ? '/pictures/' + image : $rootScope.defaultProfileImage;
              //avatar = avatar && avatar !== $rootScope.defaultProfileImage ? '/pictures/' + avatar : $rootScope.defaultProfileImage;
              //image = '/pictures/' + image;
              //avatar = '/pictures/' + avatar;
              
              if ($rootScope.subscribed)
              {
                  var success = function (data)
                  {
                      $rootScope.conversation = [];
  
                      for (i = 0; i < data.length; i++)
                      {
                          $rootScope.conversation.push(data[i]);
                          data[i].class = data[i].boxType === 1 ? "pull-left" : "pull-right";
                          data[i].date = dateToMonthDay(data[i].timestamp);
                          data[i].image = data[i].boxType === 1 ? image : avatar;
                          data[i].userId = userId;
                          data[i].imageUser = image;
                          
                          if (data[i].image 
                                  && data[i].image.indexOf("pictures") !== 0 
                                  && data[i].image !== $rootScope.defaultProfileImage)
                          {
                              data[i].image = '/pictures/' + data[i].image;
                          }
                          else
                          {
                              data[i].gender == "F" ? data[i].image = "images/ll_profile_female_img.png" :  "images/ll_profile_male_img.png";
                          }
                      }
  
                      $rootScope.conversation.reverse();
                      
                      if ($.inArray(userId, $rootScope.messagesProfileData) === -1)
                      {
                          $rootScope.messagesProfileData.push(userId);
                          $rootScope.functions.markAsSeen(userId);
                      }
                      
                      // this is to find out if we are replying to a message or initiating a conversation:
                      // boxType = 0 ;sent
                      // boxType = 1 ;received
                      var messagesReceived = $.grep( $rootScope.conversation, function(e){ return e.boxType == 1; });
                      $rootScope.conversationIsReplying = ( messagesReceived.length > 0);
                      
                  };
                  var error = function (data) {};
                  
                  $rootScope.functions.setSelected(idSelected);
                  ajaxRequest.speak(url, success, error, postData);
              }
          },
          
          loadMoreMessages: function(msgType){
              // console.log("loadMoreMessages ", $rootScope.messagesSearchNext );    		
              if(typeof $rootScope.messagesSearchNext !== 'undefined'){
                                        
                  var postData = { messageType: "mailGroup", boxType: msgType, searchId: $rootScope.messagesSearchId, page: $rootScope.messagesSearchNext, resultsPerPage: 25 };
                  var url = '/member/mailbox/getList';
                  var success = function(data){ 
  
                      $rootScope.messagesSearchNext = data.nav.next;
                      $rootScope.messagesSearchId = data.nav.searchId;
  
                      for( i=0; i < data.list.length; i++ ){
                          
                          $rootScope.messages.push(data.list[i]);
                          data.list[i].date = dateToMonthDay(data.list[i].date);
                          data.list[i].status = $rootScope.msgType === 'Sent' ? 'S' : data.list[i].status;
                          
                      };
  
                      
                  };
                  var error = function(data){ };
                  
                  ajaxRequest.speak(url,success,error,postData);
              
              }
          
          },
          messageReload: function(msgType, onSuccess){
              
              var postData        = { messageType: "mailGroup", boxType: msgType, resultPerPage: 25 };
              var url             = '/member/mailbox/getList';
              $rootScope.msgType  = msgType;
              
              var success = function(data){
                  
                  $rootScope.messages = [];
                  $rootScope.idSelected = $rootScope.idSelected;
                  $rootScope.messagesSearchNext = data.nav.next;
                  $rootScope.messagesSearchId = data.nav.searchId;
  
                  for( i=0; i < data.list.length; i++ ){
                      $rootScope.messages.push(data.list[i]);
                      data.list[i].date = dateToMonthDay(data.list[i].date);
                      data.list[i].status = $rootScope.msgType === 'Sent' ? 'S' : data.list[i].status;
                  };
                  
                  if (typeof onSuccess === "function") {
                      onSuccess();
                  }
              };
              
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
              
          },
          sendMessage: function(userId,messageToSend,image,avatar){
              
              var postData = { targetId: userId, text: messageToSend };
              var url      = '/member/dating/json/im/send';
              var success  = function(data){
                  $rootScope.functions.messageSentReload(userId,image,avatar);
                  $rootScope.functions.messageReload($rootScope.msgType);
                  //$rootScope.functions.chatBoxSentReload(userId,image,avatar);
                  document.getElementById("reply-content").value = '';
                  
                  ViewMyProfile.get().messageLimit = data.sendRemainingCount;
              };
              var error = function(data){ };
              
              if ( ViewMyProfile.get().memberLevel == $rootScope.MEMBER_LEVELS.FREE_TRIAL && !$rootScope.conversationIsReplying ) {
                  
                  $rootScope.userId        = userId;
                  $rootScope.messageToSend = messageToSend;
                  $rootScope.image         = image;
                  $rootScope.avatar        = avatar;
                  $rootScope.showSend      = true;
  
                  if ( ViewMyProfile.get().messageLimit == $rootScope.MESSAGES_REMAINING.FIRST ){
                      
                      ngDialog.open({ template: 'partials/message-free-trial-first.html', scope: $rootScope });
  
                  } else if (ViewMyProfile.get().messageLimit == $rootScope.MESSAGES_REMAINING.WARNING){
                         
                      ngDialog.open({ template: 'partials/message-free-trial-warning.html', scope: $rootScope });
  
                  } else if (ViewMyProfile.get().messageLimit == $rootScope.MESSAGES_REMAINING.LIMIT){
                  
                      ngDialog.open({ template: 'partials/message-free-trial-limit.html' });
  
                  } else {
                  
                      ajaxRequest.speak(url,success,error,postData);
                  }
  
              } else {
              
                  ajaxRequest.speak(url,success,error,postData);
              
              }
          },
  
          sendMessageNoCheck: function( userId,messageToSend,image,avatar ){
              var postData = { targetId: userId, text: messageToSend };
              var url      = '/member/dating/json/im/send';
              var success  = function(data){
                  $rootScope.functions.messageSentReload(userId,image,avatar);
                  $rootScope.functions.messageReload($rootScope.msgType);
                  document.getElementById("reply-content").value = '';
  
                  ViewMyProfile.get().messageLimit = data.sendRemainingCount;
  
                  $rootScope.showSend = false;
              };
              var error = function(data){
                  $rootScope.showSend = false;
              };
              
              ajaxRequest.speak(url,success,error,postData);
          
          },
  
          messageSentReload: function(userId, image, avatar){
                  
              var postData = { userId: userId, showResponseGeneratedByCannedMessage: 1};
              var url = '/member/v1.1/json/stats/conversation/list';
              avatar = '/pictures/' + avatar;
              var success = function(data){
                  
                  if( data.length >= $rootScope.conversation.length ){
                      
                      $rootScope.conversation = [];
                      
                      for( i=0; i < data.length; i++ ){
                          $rootScope.conversation.push(data[i]);
                          data[i].class = data[i].boxType == 1 ? "pull-left" : "pull-right";
                          data[i].date = dateToMonthDay(data[i].timestamp);
                          data[i].image =  data[i].boxType == 1 ? image :  avatar;
                          data[i].userId = userId;
                          data[i].imageUser = image;
                      }
                  
                      $rootScope.conversation.reverse();
                      
                  }
                      
      
              };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
          
          },
                  
          deleteMessage: function(userId){
              var postData = { userId: userId, status: "T" };
              var url = '/member/action/messages/update';
              var success = function(data){
                  console.log(userId);
                  $("#" + userId).fadeOut("slow", function(){
                      $rootScope.functions.messageReload($rootScope.msgType);
                      $rootScope.conversation[0].userId == userId ? $rootScope.conversation = [] : '' ;
                  });
              };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
          
          },
                  
          setSelected: function(idSelected) {
                      //console.log("setSelected", idSelected);
                      $rootScope.idSelected = idSelected;
                      //$rootScope.userConvoInfo = '';
  
                      /*var postData = { userId: idSelected };
                      var url = '/member/dating/v1.1/json/search/viewProfileByUserId';
                      var success = function(data){ $rootScope.userConvoInfo = data; };
                      var error = function(data){ };
                      ajaxRequest.speak(url,success,error,postData);*/
               
          },
                  
          markAsSeen: function(userId) {
                      var postData = { userId: userId, status: "S" };
                      var url = '/member/action/messages/update';
                      var success = function(data){
                              $("#" + userId + " h2").removeClass("status-N");
                              $rootScope.functions.updateCounts();
                      };
                      var error = function(data){ };
  
                      ajaxRequest.speak(url,success,error,postData);
          },
                  
          openChatBox: function(userId, image, avatar, idSelected){
              
              
              $rootScope.chatBoxOpen = true;
              $rootScope.avatar = avatar;
              $rootScope.chatBoxSelected = userId;
                      
              var postData = { userId: userId, showResponseGeneratedByCannedMessage: 1};
              var url = '/member/v1.1/json/stats/conversation/list';
              image = '/pictures/' + image;
              avatar = '/pictures/' + avatar;
              
              var success = function(data){
                  $rootScope.chatBoxConvo = [];
                  
                  for( i=0; i < data.length; i++ ){
                      $rootScope.chatBoxConvo.push(data[i]);
                      data[i].class = data[i].boxType == 1 ? "pull-left" : "pull-right";
                      data[i].date = dateToMonthDay(data[i].timestamp);
                      data[i].image =  data[i].boxType == 1 ? image :  avatar;
                      data[i].userId = userId;
                      data[i].imageUser = image;
                  }
                  
                  $rootScope.chatBoxConvo.reverse();
                  $rootScope.functions.markAsSeen(userId);
      
              };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
              
          },
          sendChatBox: function(userId,messageToSend,image,avatar){
          
              var postData = { targetId: userId, text: messageToSend };
              var url = '/member/dating/json/im/send';
              var success = function(data){
                  $rootScope.functions.chatBoxSentReload(userId,image,avatar);
                  $rootScope.functions.messageSentReload(userId,image,avatar);
                  
                  //$rootScope.functions.messageReload($rootScope.msgType);
                  document.getElementById("reply-chatbox").value = '';
              };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
    
          },
          chatBoxSentReload: function(userId, image, avatar){
                      
              var postData = { userId: userId };
              var url = '/member/v1.1/json/stats/conversation/list';
              avatar = '/pictures/' + avatar;
              var success = function(data){
                                  
                  if( data.length > $rootScope.chatBoxConvo.length ){
                      
                      $rootScope.chatBoxConvo = [];
                      
                      for( i=0; i < data.length; i++ ){
                          $rootScope.chatBoxConvo.push(data[i]);
                          data[i].class = data[i].boxType == 1 ? "pull-left" : "pull-right";
                          data[i].date = dateToMonthDay(data[i].timestamp);
                          data[i].image =  data[i].boxType == 1 ? image :  avatar;
                          data[i].userId = userId;
                          data[i].imageUser = image;
                      }
                  
                      $rootScope.chatBoxConvo.reverse();
                      
                  }
                      
      
              };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
          
          },
          closeChatBox: function(){
              $rootScope.chatBoxOpen = false;
          },
          setSentFalse: function(){
              $rootScope.messageSent = false;
          },
          sendNewMessage: function(userId,newMessage){
              
              var postData = { targetId: userId, text: newMessage };
              var url = '/member/dating/json/im/send';
              var success = function(data){
                  $rootScope.messageSent = true;
                  $rootScope.functions.updateCounts();
                  ngDialog.closeAll();
                  
                  //if ( ViewMyProfile.get().messageLimit != 0 ){
                  //    ViewMyProfile.get().messageLimit--;
                  //}
                  ViewMyProfile.get().messageLimit = data.sendRemainingCount;
              };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
          
          },
          sendRequest: function( userId, request, beforeSend, afterSend ){
              
              var postData = { targetId: userId, requestSent: request };
              var url      = '/member/dating/json/im/send';
              var error    = afterSend || function(){};
              var success  = afterSend || function(){}; 
              
              if ( beforeSend != undefined ){
                  beforeSend();
              }
  
              ajaxRequest.speak(url,success,error,postData);
          },
          updateCounts: function(){
  
              var postData = { };
              var url = '/member/v1.1/json/mycounts';
              var success = function(data){
                  if( data.newMessage > $rootScope.messagesCount && typeof $rootScope.idSelected !== "undefined"){
                      
                      var image = '';
                      
                      for( i=0; i < $rootScope.conversation.length; i++ ){
                          $rootScope.conversation[i].boxType == 1 ? image = $rootScope.conversation[i].image : '';
                      };
                      
                      $rootScope.functions.messageSentReload($rootScope.idSelected, image, $rootScope.avatar);
                      $rootScope.functions.markAsSeen($rootScope.idSelected);
                      
                  
                  }
                  
                  if( data.newMessage > $rootScope.messagesCount && typeof $rootScope.chatBoxSelected !== "undefined"){
                      
                      var image = '';
                      
                      for( i=0; i < $rootScope.chatBoxConvo.length; i++ ){
                          $rootScope.chatBoxConvo[i].boxType == 1 ? image = $rootScope.chatBoxConvo[i].image : '';
                      };
                      
                      $rootScope.functions.chatBoxSentReload($rootScope.chatBoxSelected, image, $rootScope.avatar);
                      $rootScope.functions.markAsSeen($rootScope.chatBoxSelected);
                  
                  }
                  
                  
                  
                  if( data.newMessage > $rootScope.messagesCount && typeof $rootScope.idSelected === "undefined"){
                      $rootScope.functions.messageReload($rootScope.msgType);
                  }
                  
                  $rootScope.newLike = data.newLike;
                  $rootScope.newMatch = data.newMatch;
                  
                  
                  $rootScope.likesCount = data.newLike + data.newMatch;
                  $rootScope.messagesCount = data.newMessage;
                  $rootScope.viewsCount = data.newView;
              
              
              };
              var error = function(data){
  
                  if(data.session == -1){
                      logSessionError.log('Timeout');
                      //window.location.href = "logout.html?page=login";			
                  }
              };
              
              ajaxRequest.speak(url,success,error,postData);
              
              
          },
          reloadCounts: function(type){
              var postData = { type: type };
              var url = '/member/v1.1/json/resetCounts';
              var success = function(data){ $rootScope.functions.updateCounts(); };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
          }
          
      };
  });
  
  
  /* ****************************************************************** */
  /* ************ LIKES FUNCTIONS ***************** */
  /* ****************************************************************** */
  
  app.factory('likes', function($http, ajaxRequest, $rootScope) {
      return {
      
          openLikes: function(name){
  
              $rootScope.likesOpen = true;
              
              if ($rootScope.messagesOpen) $rootScope.functions.closeMessages();
              if ($rootScope.viewsOpen) $rootScope.functions.closeViews();
              if ($rootScope.favoritesOpen) $rootScope.functions.closeFavorites();
  
              $rootScope.functions.search(name,true);
              //$(".likes").css("z-index","6").slideDown(100);
              //$(".mask-nav").fadeIn(100);
              $(".likes").css("z-index","6").fadeIn(150);
              $(".mask-nav").fadeIn(200);
              $("body").addClass('noscroll');
              
          },
          closeLikes: function(){
              
              //$(".likes").css("z-index","5").slideUp(1);
              $(".likes").css("z-index","5").fadeOut(150);
                  $rootScope.likesOpen = false;
              $("body").removeClass('noscroll');
              $rootScope.messagesOpen || $rootScope.likesOpen || $rootScope.viewsOpen || $rootScope.favoritesOpen ? '' : $(".mask-nav").hide();
              
              $rootScope.functions.reloadCounts('like');
              $rootScope.functions.reloadCounts('match');
          },
          sendLike: function(userId,name,likeSuccess){
              
              var findObject = findSearch($rootScope.searchList, 'name', name);
              var index = findObject[1];
              
              $rootScope.searchList[index].searchId = '';
                           
              var postData = { smileId1: 1, smileId1: 2, targetUserId: userId };
              var url = '/member/dating/json/smile/send'
              var success = function(data){ 
                  $rootScope.functions.search(name); 
                  if (likeSuccess){
                      likeSuccess();
                  }
              };
              var error = function(data){ };
              
              ajaxRequest.speak(url,success,error,postData);
              
          },
          deleteLike: function(userId,name,deleteSuccess){
               
               var findObject = findSearch($rootScope.searchList, 'name', name);
               var index = findObject[1];
               
               $rootScope.searchList[index].searchId = '';
                            
               var postData = { community: 'd', ids: userId };
               var url = '/member/json/smile/outbox/delete'
               var success = function(data){ 
                  $rootScope.functions.search(name); 
                  if (deleteSuccess){
                      deleteSuccess();
                  }
               };
               var error = function(data){ };
               
               ajaxRequest.speak(url,success,error,postData);
          
          },
          moreLikes: function( viewsType ){
              
              if (!$rootScope.searchNextPageStart){
                  $rootScope.functions.searchNextPage( viewsType ); 
              }
          }
      }
  });
  
  /* ****************************************************************** */
  /* ************ VIEWS FUNCTIONS ***************** */
  /* ****************************************************************** */
  
  app.factory('views', function($http, ajaxRequest, $rootScope) {
      return {
          openViews: function(name){
              
              $rootScope.viewsOpen = true;
              
              if ($rootScope.messagesOpen) $rootScope.functions.closeMessages();
              if ($rootScope.likesOpen) $rootScope.functions.closeLikes();
              if ($rootScope.favoritesOpen) $rootScope.functions.closeFavorites();
              
              $rootScope.functions.search(name,true);
  
              //$(".views").css("z-index","6").slideDown(100);
              //$(".mask-nav").fadeIn(100);
              $(".views").css("z-index","6").fadeIn(150);
              $(".mask-nav").fadeIn(200);
              $("body").addClass('noscroll');
              
          },
          closeViews: function(){
              
              $rootScope.viewsOpen = false;
              //$(".views").css("z-index","5").slideUp(1);
              $(".views").css("z-index","5").fadeOut(150);
              $("body").removeClass('noscroll');
              $rootScope.messagesOpen || $rootScope.likesOpen || $rootScope.viewsOpen || $rootScope.favoritesOpen ? '' : $(".mask-nav").hide();
              
              
              $rootScope.functions.reloadCounts('view');
              
              
          },
          moreViews: function( viewsType ){
              
              if (!$rootScope.searchNextPageStart){
                  $rootScope.functions.searchNextPage( viewsType );
              }
          }
      }
  });
  
  /* ****************************************************************** */
  /* ************ FAVORITES FUNCTIONS ***************** */
  /* ****************************************************************** */
  
  app.factory('favorites', function($http, ajaxRequest, $rootScope, ngDialog, ViewMyProfile,Utils) {
      
      function addFavorite( name, userId, afterAdd ){
          
          var findObject = findSearch($rootScope.searchList, 'name', name);
          var index      = findObject[1];
          
          $rootScope.searchList[index].searchId = '';
                       
          var postData = { userId: userId };
          var url      = '/member/dating/action/hotlist/add'
          var success  = function(data){ };
          var error    = function(data){ };
          
          if ( afterAdd != null ){
              
              afterAdd();
          }
          ajaxRequest.speak(url,success,error,postData);
      };
      
      return {
          
          openFavorites: function(name){
              
              $rootScope.favoritesOpen = true;
              
              if ($rootScope.messagesOpen) $rootScope.functions.closeMessages();
              if ($rootScope.likesOpen) $rootScope.functions.closeLikes();
              if ($rootScope.viewsOpen) $rootScope.functions.closeViews();
              
              $rootScope.functions.search(name,true);
              
              //$(".favorites").css("z-index","6").slideDown(100);
              //$(".mask-nav").fadeIn(100);
              $(".favorites").css("z-index","6").fadeIn(150);
              $(".mask-nav").fadeIn(200);
              $("body").addClass('noscroll');
              
          },
          closeFavorites: function(){
              $rootScope.favoritesOpen = false;
              //$(".favorites").css("z-index","5").slideUp(1);
              $(".favorites").css("z-index","5").fadeOut(150);
              $("body").removeClass('noscroll');
              $rootScope.messagesOpen || $rootScope.likesOpen || $rootScope.viewsOpen || $rootScope.favoritesOpen ? '' : $(".mask-nav").hide();
              
          },
          sendFavorite: function(userId, name, afterSend ){
              
              var levels = $rootScope.MEMBER_LEVELS;
              
              if ( Utils.oneOf( ViewMyProfile.get().memberLevel, [ levels.FREE_TRIAL, levels.FREE_TRIAL_EXPIRED ] ) ){
                 
                  $rootScope.functions.search( $rootScope.favoritesType, true, function(){
                      if ( $rootScope.mySearchObjects.length == $rootScope.FAVORITES_LIMIT ){
                         
                          ngDialog.open({ template: 'partials/favourite-free-trial.html', scope: $rootScope });
                      
                      } else {
                      
                          addFavorite( name, userId, afterSend );
                          
                      } 
                  });
  
              } else {
  
                  addFavorite( name, userId, afterSend );
              }
              
          },
          deleteFavorite: function(userId,name){
               
               var findObject = findSearch($rootScope.searchList, 'name', name);
               var index = findObject[1];
               
               $rootScope.searchList[index].searchId = '';
                            
               var postData = { community: 'd', ids: userId };
               var url = '/member/json/hotlist/delete'
               var success = function(data){ $rootScope.functions.search(name); };
               var error = function(data){ };
               
               ajaxRequest.speak(url,success,error,postData);
          
          }
      }
  });
  
  app.factory('misc', function($rootScope, $window) 
  {
      return {
  
          closeOpenMessagingWindows: function(name)
          {
              if ($rootScope.messagesOpen) $rootScope.functions.closeMessages();
              if ($rootScope.likesOpen) $rootScope.functions.closeLikes();
              if ($rootScope.viewsOpen) $rootScope.functions.closeViews();
              if ($rootScope.favoritesOpen) $rootScope.functions.closeFavorites();
          },
  
          href: function( url ){
              $window.location.href = url;
          }
      };
  });
  
  app.factory( 'PurchaseRequest', function() {
      
      return { 
          offerDetailId: -1,
          cardId: -1,
          autoRenew: 1,
          cvv: null,
          sitrep:{}
      };
  });
  
  app.factory( 'SearchFactory', function() {
      var data = {
          advancedSearchCount: 0
      };
  
      data.setAdvancedSearchCount = function(val) {
        this.advancedSearchCount = val;
      };
  
      data.getAdvancedSearchCount = function() {
          return this.advancedSearchCount;
      };
  
      return data;
  });
  
  
  /* ****************************************************************** */
  /* ************ COMPILE FUNCTIONS ***************** */
  /* ****************************************************************** */
  
  app.run(function($rootScope, search, messages, likes, views, favorites, misc, Utils) {
      $rootScope.functions = $.extend(search, messages, likes, views, favorites, misc, Utils);
  });
  
  
  /* ****************************************************************** */
  /* ************ AJAXREQUEST SERVICE ***************** */
  /* ****************************************************************** */
  
  app.service('ajaxRequest', function($http, $q, logSessionError) {
      
      var jsessionAlreadyLogged = false;
  
      this.speak = function (url,success,error,data, doNotlogoutWhenSessionEmpty ) {
          
          // check for jsessionid, if undefined check for jsessionid2
          // if jsessionid2 is undefined still, log this
          var jsession  = $.cookie('jsessionid');
          var jsession2 = $.cookie('jsessionid2');
  
          if ( jsession == undefined && !jsessionAlreadyLogged ){
              logSessionError.log('jsession is empty');
              jsessionAlreadyLogged = true;
          }
          if ( jsession == undefined && jsession2 == undefined ){
  
              logSessionError.log('jsession and jsession2 are empty');
              if ( !doNotlogoutWhenSessionEmpty ){
                 // window.location.href = "logout.html?page=login";
              }
          }
          // logging - end
          
          var jsessionid = jsession || jsession2;
  
          $http({
              method : 'POST',
              url : url + ';jsessionid=' + jsessionid,
              data: $.param(data)
          }).success(function(data) {
              success(data);
          }).error(function(data){
              error(data);
          });     
      
      }
      
      // requests is an array that contains objects like the following:
      // [ 
      //	{ url: abc, data: { param1: 'xxx'}},
      // 	...
      // ]
      this.serialize = function ( requests ){
          
          var previous = $q.when(null); //initial start promise that's already resolved
          for(var i = 0; i < requests.length; i++) {
              (function (i) {
                  previous = previous.then(function () { //wait for previous operation
                      return firePromise( requests[i]);
                  });
              }(i)); //create a fresh scope for i as the `then` handler is asynchronous
          }
          return previous;	
      }
  
      function firePromise( request ){
          return $http({
              method : 'POST',
              url : request.url + ';jsessionid=' + $.cookie('jsessionid'),
              data: $.param( request.data )
          });		
      }
  });
  
  /* ****************************************************************** */
  /* ************ AUTOGROW DIRECTIVE ***************** */
  /* ****************************************************************** */
  
  app.directive('autogrow', function() {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
             $(element).autosize();
          }
      };
  });
  
  
  /* ****************************************************************** */
  /* ************ OWLCAROUSEL DIRECTIVE ***************** */
  /* ****************************************************************** */
  
  app.directive('owlcarousel', function() {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
             $(element).owlCarousel({ items: 1, transitionStyle: "fade", responsiveBaseWidth: "#marketing-message" });
          }
      };
  });
  
  app.directive("owlRousel", function(){
      return {
          restrict : 'A',
          link     : function(scope, elem, attrs){
              
              if ( parseInt(attrs.owlAmount) === ( parseInt(attrs.owlIndex) + 1)){
              // not sure why this IF statement is necessary - Pengzhi
                  $(elem).parents(".owl-carousel").owlCarousel({
                      pagination: false,
                      navigation: true,
                      navigationText: [
                            "",
                            ""
                            ],                    
                      items: 3,
                      rewindNav: false,
                      scrollPerPage: true,
                      responsive: false
                  });
              }
          }
      }
  });
  
  /* ****************************************************************** */
  /* ************ RADIOSTYLE DIRECTIVE ***************** */
  /* ****************************************************************** */
  
  app.directive('radiostyle', function() {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
             $(element).ionCheckRadio();
          }
      };
  });
  
  /* ****************************************************************** */
  /* ************ IMAGE ERROR DIRECTIVE ***************** */
  /* ****************************************************************** */
  
  app.directive('errSrc', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
      }
    }
  });
  
  
  /* ****************************************************************** */
  /* ************ STOP EVEN DIRECTIVE ***************** */
  /* ****************************************************************** */
  
  app.directive('stopEvent', function () {
      return {
          restrict: 'A',
          link: function (scope, element, attr) {
              element.bind(attr.stopEvent, function (e) {
                  e.stopPropagation();
              });
          }
      };
  });
  
  /*
  * CJ affiliate directive
  */
  app.directive('cjAffiliate', function () {
  
      function getParameterByName(name) {
          var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
          return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
      }
  
      return {
          link: function(scope, element, attrs) {
              
              attrs.$observe('href', function ( value ) {
  
                  var theName             = 'source';
                  var persistedQueryParam = getParameterByName( theName );
                  var elem                = $(element);
                  var href                = elem.attr('href');
  
                  if ( persistedQueryParam != null ){
                      
                      var anchorTagIndex = href.indexOf('#');
                      var queryString = (href.indexOf('?') != -1 ? '&' : '?') + theName + '=' + persistedQueryParam;
                      
                      if ( anchorTagIndex != -1 ){
                          // if anchor tag is found
                          var newHref = href.slice(0, anchorTagIndex) + queryString + href.slice(anchorTagIndex);
                          elem.attr( 'href', newHref ); 
                      } else {
  
                          elem.attr( 'href', href + queryString );
                      }
                  }
              });
          }
      }
  });
  
  /*
  *   prevent parent element from scrolling if this element has scrolling
  */
  app.directive('preventParentScrolling', function(){
      
      var link = function(scope, element, attrs){
  
          $( element ).on('DOMMouseScroll mousewheel', function(ev) {
              var $this    = $(this),
              scrollTop    = this.scrollTop,
              scrollHeight = this.scrollHeight,
              height       = $this.height(),
              delta        = ev.originalEvent.wheelDelta,
              up           = delta > 0;
              
              if (ev.type == 'DOMMouseScroll') {
                  delta = ev.originalEvent.detail * -40;
                  up = delta > 0;
              }
  
              var prevent = function() {
                  ev.stopPropagation();
                  ev.preventDefault();
                  ev.returnValue = false;
                  return false;
              }
              
              if (!up && -delta > scrollHeight - height - scrollTop) {
                  // Scrolling down, but this will take us past the bottom.
                  $this.scrollTop(scrollHeight);
                  return prevent();
              } else if (up && delta > scrollTop) {
                  // Scrolling up, but this will take us past the top.
                  $this.scrollTop(0);
                  return prevent();
              }
          });    
      }
  
      return { link: link };
  });
  
  /* ****************************************************************** */
  /* ************ UPLOAD IMAGES DIRECTIVE ***************** */
  /* ****************************************************************** */
  
  app.directive('dropzone', function () {
    return function (scope, element, attrs) {
      var config, dropzone;
   
      config = scope[attrs.dropzone];
   
      // create a Dropzone for the element with the given options
      dropzone = new Dropzone(element[0], config.options);
   
      // bind the given event handlers
      angular.forEach(config.eventHandlers, function (handler, event) {
        dropzone.on(event, handler);
      });
    };
  });
  angular.module('app', ['dropzone']);
  
  
  /*
  * ViewMyProfile stores data from /viewmyprofile and can be injected to controllers
  */
  app.factory('ViewMyProfile', function ($rootScope, Utils){
      
      var data;
      var factory = {};
      
      function mockCoverPhotos(){
         
          if ( data != null ){
              
              data.profileExtra.backgroundIds = [0,1,2,3,4];
              data.covers = [];
              for (i = 0; i < data.profileExtra.backgroundIds.length; i++) { 
                  data.covers.push( $rootScope.covers[i] );
              }
          };
      }
  
      function mockMessagesLimit(){
      
          if ( data != null ){
              data.messageLimit = $rootScope.MESSAGES_REMAINING.FIRST;
          };
      }
      
      // add cover objects in rootscope based on backgroundIds
      function addCoverPhotos(){
          
          if ( data != null ){
              
              var backgroundIds = [];
  
              for (i = 0; i < data.profileExtra.backgroundIds.length; i++) {
                  var num = data.profileExtra.backgroundIds[i];
                  var str = num.toString();
                  backgroundIds.push(str);
              }
  
              var temp = Utils.findAllByLetters( $rootScope.covers, backgroundIds );
             
              data.covers = temp;
          }
      }
  
      function getRealMessagesLimit(){
          
          if ( data != null ){
              data.messageLimit = data.profileExtra.sendRemainingCount;
          };
      }
  
      factory.load = function(item) {
          
          // mockMessagesLimit();
          data = item;
          getRealMessagesLimit();
      };
      factory.get = function() {
  
          // mockCoverPhotos();
          addCoverPhotos();
          return data;
      };
  
      return factory;
  })
  
  /* ****************************************************************** */
  /* ************ MY INFORMATION DIRECTIVE ***************** */
  /* ****************************************************************** */
  app.service('myInformation', function (ajaxRequest, $rootScope) {
      
  
      this.speak = function (userInfo, ViewMyProfile, errorCallBack ) {
          
          var postData = {  };
          var url = '/member/dating/v1.2/json/viewmyprofile';
          
          var success = function(data){
              $rootScope.userData = data;
              if (ViewMyProfile != undefined ){
  
                  ViewMyProfile.load(data);
              }
              userInfo(data);
          };
          
          var error = function(data){ 
              if ( errorCallBack !== undefined ){
                  errorCallBack( data );	
              }
          };
          
          ajaxRequest.speak(url,success,error,postData);
      }
  });
  
  app.service('logSessionError', function($rootScope) {
      this.log = function(area){
          if ( $rootScope.userData != undefined ){
              $.get( "http://gameon.lavalife.com/action/lava_log/lava_log.php", { userId: $rootScope.userData.userId, area: area, jsession: $.cookie('jsessionid') } );
          }
      }
  });
  
  app.service('getAccountInfo', function( ajaxRequest, AccountInfo ) {
      
      this.speak = function ( afterSuccess ) {
          
          var postData = { };
          var url = '/member/billing/accountInfo'
          var success = function(data){
              
              var date    = new Date( data.subscriptionEndDate*1000 );
              var now     = new Date();
              var diffDay = dateDiffInDays(now, date);
              
              data.aboutToExpire = ( diffDay < 5 );
              data.subscriptionEndDateHuman = prettyDate(date) + " " + prettyTime(date);
              
              AccountInfo.load( data );
              
              if ( afterSuccess != undefined && typeof(afterSuccess) === "function" ){
                  afterSuccess();
              }
          };
          var error = function(data){ };
          
          ajaxRequest.speak(url,success,error,postData);
      }
  
      
      // a and b are javascript Date objects
      function dateDiffInDays(a, b) {
          
          var _MS_PER_DAY = 1000 * 60 * 60 * 24;
          // Discard the time and time-zone information.
          var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
          var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
          return Math.floor((utc2 - utc1) / _MS_PER_DAY);
      }
      
      // d is a Date object
      function prettyDate( d ){
  
          var m_names = new Array("January", "February", "March", 
              "April", "May", "June", "July", "August", "September", 
              "October", "November", "December");
  
          var curr_date = d.getDate();
          var sup = "";
          if (curr_date == 1 || curr_date == 21 || curr_date ==31)
          {
             sup = "st";
          }
          else if (curr_date == 2 || curr_date == 22)
          {
             sup = "nd";
          }
          else if (curr_date == 3 || curr_date == 23)
          {
             sup = "rd";
          }
          else
          {
             sup = "th";
          }
  
          var curr_month = d.getMonth();
          var curr_year = d.getFullYear();
          var formattedDate = m_names[curr_month] + " "
              + curr_date + "<SUP>" + sup + "</SUP> "
              + curr_year;
  
          return formattedDate;
      }
  
      function prettyTime( d ){
          
          var hours = d.getHours();
          var ampm = hours < 12 ? "am" : "pm";
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          var min = d.getMinutes();
          if (min < 10) {
              min = "0" + min;
          }
  
          return hours + ":" + min + ampm;
      }
  });
  
  app.factory( 'AccountInfo', function() {
      
      var data;
      var service = {};
  
      service.load = function(item) {
          data = item;
      };
      service.get = function() {
          return data;
      };
  
      return service;
  });
  
  app.service('getPaymentHistory', function( ajaxRequest, PaymentHistory ) {
      
      this.speak = function (scope) {
  
          var url = '/member/billing/history';
          var success = function(data){
              
              if ( typeof data == 'string' && data.trim() == "null" ){
                  PaymentHistory.load( null ); 
              } else {
                  PaymentHistory.load( data );
              }
          };
          var error = function(data){ };
          ajaxRequest.speak(url,success,error,{});
      }
  });
  
  app.factory( 'PaymentHistory', function() {
      
      var data;
      var service = {};
  
      service.load = function(item) {
          data = item;
      };
      service.get = function() {
          return data;
      };
  
      return service;
  });
  
  
  
  /* ****************************************************************** */
  /* ************ INFINITE SCROLL DIRECTIVE ***************** */
  /* ****************************************************************** */
  
  app.directive('scroller', function ($timeout) {
      return {
          restrict: 'A',
          // new
          scope: {
              loadingMethod: "&"
          },
          link: function (scope, elem, attrs) {
              rawElement = elem[0];
              elem.bind('scroll', function () {
                  if((rawElement.scrollTop + rawElement.offsetHeight+5) >= rawElement.scrollHeight){
                      
                      $timeout(function(){
                      
                          scope.$apply(scope.loadingMethod); //new
                      
                      }, 500);
                  }
              });
          }
      };
  });
  
  // we create a simple directive to modify behavior of <ul>
  app.directive("whenScrolled", function($timeout){
      return {
  
          restrict : 'A',
          link     : function(scope, elem, attrs){
  
              // we get a list of elements of size 1 and need the first element
              raw = elem[0];
  
              // we load more elements when scrolled past a limit
              elem.unbind();
              elem.bind("scroll", function(){
                  // console.log( raw.scrollTop, raw.offsetHeight+5, raw.scrollHeight );
                  if( raw.scrollTop+raw.offsetHeight+5 >= raw.scrollHeight ){
                  // bottom reached
                      scope.loading = true;
                      $timeout(function(){
                          // we can give any function which loads more elements into the list
                          scope.$apply(attrs.whenScrolled);
                      }, 500);
                  }
              });
          }
      }
  });
  
  
  /* ****************************************************************** */
  /* ************ MAX LENGTH DIRECTIVE ***************** */
  /* ****************************************************************** */
  
  app.directive('maxLength', function() {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var maxlength = Number(attrs.myMaxlength);
        function fromUser(text) {
            if (text.length > maxlength) {
              var transformedInput = text.substring(0, maxlength);
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
              return transformedInput;
            } 
            return text;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    }; 
  });
  
  
  /*
  * conversation item directives
  */
  
  app.directive('compile', ['$compile', function ($compile) {
      return function(scope, element, attrs) {
          scope.$watch(
              function(scope) {
                  // watch the 'compile' expression for changes
                  return scope.$eval(attrs.compile);
              },
              function(value) {
                  // when the 'compile' expression changes
                  // assign it into the current DOM
                  element.html(value);
  
                  // compile the new DOM and link it to the current
                  // scope.
                  // NOTE: we only compile .childNodes so that
                  // we don't get into infinite loop compiling ourselves
                  $compile(element.contents())(scope);
              }
          );
      };
  }]);
  
  app.directive('messagePrivateUploader', function(){
      
      return {
          link: function( scope, element, attrs ){
              
              attrs.$observe('href', function ( value ) {
                  
                  $element = $(element);
                  $element.attr('href','dashboard.html?show=private#/myPictures/');
              });
          }
      };
  });
  
  app.directive('messagePublicUploader', function(){
      
      return {
          link: function( scope, element, attrs ){
              
              attrs.$observe('href', function ( value ) {
                  
                  $element = $(element);
                  $element.attr('href','dashboard.html?show=public#/myPictures/');
              });
          }
      };
  });
  
  app.directive('messageNickname', function(){
      
      return {
          link: function( scope, element, attrs ){
          
              var nickname = scope.getOpenedMessageNickname(); // defined in dashboardController.js
              var myNickname = scope.getMyNickname(); // defined in dashboardController.js
  
              if ( scope.message.boxType === 1){
                  text = nickname;
              } else {
                  text = myNickname;
              }
  
              $(element).html(text);
          } 
      }
  });
  
  app.directive('messageEditProfile', function(){
      
      return {
          link: function( scope, element, attrs ){
              
              attrs.$observe('href', function ( value ) {
                  
                  $element = $(element);
                  $element.attr('href','dashboard.html#/myProfile/');
              });
          }
      };
  });
  
  
  app.directive("formValidator", ['ajaxRequest', 'getAccountInfo', 'PurchaseRequest', '$state',
      function( ajaxRequest, getAccountInfo, PurchaseRequest, $state ){
          
          function pad(num, size) {
              var s = "000000000" + num;
              return s.substr(s.length-size);
          }
  
      return {
  
          restrict: 'A',
          link: function(scope, element, attrs) {
              
              $.validate({
                  onSuccess : function() {
                      
                      $creditCardSubmit = $("#credit-card-submit");
                      $creditCardResult = $('#credit-card-result');
                      
                      var submitVal = $creditCardSubmit.val();
                      var postData = scope.creditCardForm;
                      var url = '/member/billing/newCreditCard';
                      var action = "Adding";
                      var postAction = "added";
  
                      if ( submitVal === 'Update' ) {
                          url = '/member/billing/updateCreditCard';
                          delete(postData["cardNumber"]);
                          delete(postData["cvv"]);
  
                          var month = pad(postData.selectedMonth.number,2);
                          var year = postData.selectedYear.number.toString().substr(2,4);
                          postData.expiry = month + year;
                          action = "Updating";
                          postAction = "updated";
                      }
  
                      var success = function(data){
                          
                          if ( data.approved ){
                              
                              getAccountInfo.speak(scope);
                              
                              if ( PurchaseRequest.offerDetailId > 0 ){
                                  $state.go("user.membership.subscription");
                              } else {
                                  $creditCardResult.removeClass('hidden notice errorx');
                                  $creditCardResult.addClass('alert-box success');
                                  $creditCardResult.html( "Credit card "+postAction+" successfully." );
                                  //scope.creditCardForm = {};
                                  //scope.showCustomerInformation = false;
                              }
                          } else {
                              
                              $creditCardResult.removeClass('hidden notice success');
                              $creditCardResult.addClass('alert-box errorx');
                              var message = data.message;
                              if ( typeof message != "undefined" ){
                                  $creditCardResult.html( message );
                              } else {
                                  $creditCardResult.html( "Unexpected error has occurred. Please try again later." );
                              }
                          }
                      };
                      var error = function(data){};
                      
                      $creditCardResult.removeClass('hidden errorx');
                      $creditCardResult.removeClass('hidden success');
                      $creditCardResult.addClass('alert-box notice');
                      $creditCardResult.html( action + " credit card.." );
                      $creditCardResult.focus();
                      ajaxRequest.speak(url,success,error,postData);
                  }
              });
          }
      };
  }]);
  
  app.factory( 'PurchaseRequestStatus', function() {
      
      var data;
      var service = {};
  
      service.set = function(item) {
          data = item;
      };
      service.get = function() {
          return data;
      };
  
      return service;
  });
  
  app.service('getUrlParam', function(){
  
      this.speak = function (sParam){
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
  })
  
  
  app.directive("creditCardForm", ['ajaxRequest', 'getAccountInfo', 'PurchaseRequest', 'PurchaseRequestStatus', '$state', '$rootScope',
      function( ajaxRequest, getAccountInfo, PurchaseRequest, PurchaseRequestStatus, $state, $rootScope ){
      
      return {
  
          restrict: 'A',
          link: function(scope, element, attrs) {
             
              $.formUtils.addValidator({
                  name              : 'valid_phone_number',
                  validatorFunction : function (value, $el, config, language, $form){
                      var phone = value;
                      var RE    = /^[\d\.\-]+$/;
                      
                      if( phone.length > 0 && !RE.test(phone))
                      {
                          return false;
                      }
                      return true;
                  },
                  errorMessage : 'You have entered an invalid phone number',
                  errorMessageKey: 'invalidPhoneNumber'
              });
  
              $.formUtils.addValidator({
                  name              : 'valid_phone_number_length',
                  validatorFunction : function (value, $el, config, language, $form){
                      if ( value.match(/\d/g) ){
                          return value.match(/\d/g).length >= 10;
                      } else {
                          return true;
                      }
                  },
                  errorMessage : 'Phone number should contain at least 10 digits',
                  errorMessageKey: 'invalidPhoneNumberLength'
              });
              
  
              $.validate({
  
                  onSuccess : function() {
                      
                      if ( !$.isEmptyObject(scope.selectedOfferDetail) ){
                          PurchaseRequestStatus.set( $rootScope.PURCHASE_REQUEST_STATUSES.PACKAGE_SELECTED );
                      }
                      
                      if ( $.isEmptyObject(scope.creditCardForm.selectedMonth) || $.isEmptyObject(scope.creditCardForm.selectedYear) ){
                          PurchaseRequestStatus.set( $rootScope.PURCHASE_REQUEST_STATUSES.EXPIRY_NONE ); 
                      }
                      $('#purchaseComfirmModal').modal('show');
                  }
              });
          }
      };
  }]);
  
  
  app.service('ssl', function($window, $location) {
  
      this.enable = function ( enabled ) {
  
          if (enabled) {
              if ($location.protocol() != 'https'){
                  $window.location.href = $location.absUrl().replace('http', 'https');
              }
          } else {
              if ($location.protocol() == 'https'){
                  $window.location.href = $location.absUrl().replace('https', 'http');
              }
          }
      }
  });
  
  app.factory('Page', function() {
     var title = 'Dashboard';
     var append = " â€“ Lavalife.com Online Dating Site & Mobile Apps â€“ Where Singles ClickÂ®";
     return {
       title: function() { return (title + append); },
       setTitle: function(newTitle) { title = newTitle }
     };
  });
  
  app.factory('Utils', function ( $rootScope ) {
      
      var root = {};
      
      root.findByLetter = function( collection, letter ){
          
          var found;
          for (i = 0; i < collection.length; i++) {
              
              if ( collection[i].letter === letter ){
                           
                  found = collection[i];
                  break;
              }
          };
          return found;
      };
  
      root.findAllByLetters = function( collection, letters ){
          
          var found = [];
          for (i = 0; i < collection.length; i++) {
              
              if ( letters != undefined && letters.constructor == Array ) {
  
                  for (j = 0; j < letters.length; j++) {
  
                      if ( collection[i].letter === letters[j] ){
                                   
                          found.push( collection[i] );
                      }
                  }
              }
          };
          return found;
      };
      
      root.shuffle = function(array) {
          
          var currentIndex = array.length, temporaryValue, randomIndex ;
  
          // While there remain elements to shuffle...
          while (0 !== currentIndex) {
  
              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;
  
              // And swap it with the current element.
              temporaryValue      = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex]  = temporaryValue;
          }
  
          return array;
      };
         
      root.isEmpty = function (str) {
          return (!str || 0 === str.length);
      };
      
      root.appendCJAffiliate = function (){
          return window.location.search; 
      };
      
      root.determineCurrency = function ( countryId ){
          return $rootScope.CURRENCY[ countryId ]; 
      };
      
      root.firstTimePurchaseEh = function ( purchaseCount ){
          return ( purchaseCount == undefined || parseInt(purchaseCount) < 1 )
      }
      
      root.getParameterByName = function (name) {
          var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
          return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
      }
      
      root.saveJsessionCookie = function ( session ){
          $.cookie('jsessionid', session);
          $.cookie('jsessionid2', session); // backup cookie
      }
      
      root.parseQueryString = function() {
  
          var str = window.location.search;
          var objURL = {};
  
          str.replace(
              new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
              function( $0, $1, $2, $3 ){
                  objURL[ $1 ] = $3;
              }
          );
          return objURL;
      };
  
      root.oneOf = function( value, testValues ){
          
          for ( i = 0; i < testValues.length; i++ ){
              
              if ( value == testValues[i] ){
                  return true;
              }
          }
          return false;
      }
  
      return root;
  });
  
  /*
  * Right Slider
  *
  * Mock the right slider:
  * RightSlider.mock( $scope.myProfile );
  * RightSlider.init( $scope.myProfile.rightSlider );
  */
  app.factory('RightSlider', ['Utils', 'ajaxRequest', function( Utils, ajaxRequest ){
  
      var root = {};
      var currentSlidePosition = 1;
      var currentSlide;
      var allSlides;
      var failSafeUrl =  { id:-1, url: 'right-slider/default.html', skip: false };
      
      root.mock = function( myProfile ){
      
          myProfile.rightSlider = {
              level1: [
                  //{ id:1, url:'right-slider/l-1-1.html', skip: true, type: 1 }
              ],
              level2: [
                  //{ id:1, url:'right-slider/l-2-1.html', skip: true },
                  //{ id:2, url:'right-slider/l-2-2.html', skip: true },
                  //{ id:3, url:'right-slider/l-2-3.html', skip: true },
                  //{ id:4, url:'right-slider/l-2-4.html', skip: true },
                  //{ id:5, url:'right-slider/l-2-5.html', skip: true },
                  //{ id:6, url:'right-slider/l-2-6.html', skip: true },
                  //{ id:7, url:'right-slider/l-2-7.html', skip: true },
                  //{ id:8, url:'right-slider/l-2-8.html', skip: true },
                  //{ id:9, url:'right-slider/l-2-9.html', skip: true },
                  //{ id:10, url:'right-slider/l-2-10.html', skip: true },
                  //{ id:11, url:'right-slider/l-2-11.html', skip: true },
                  //{ id:12, url:'right-slider/l-2-12.html', skip: true },
                  //{ id:13, url:'right-slider/l-2-13.html', skip: true },
                  //{ id:14, url:'right-slider/l-2-14.html', skip: true },
                  //{ id:15, url:'right-slider/l-2-15.html', skip: true },
                  //{ id:16, url:'right-slider/l-2-16.html', skip: true },
                  //{ id:17, url:'right-slider/l-2-17.html', skip: true },
                  //{ id:18, url:'right-slider/l-2-18.html', skip: true },
                  //{ id:19, url:'right-slider/l-2-19.html', skip: true },
                  //{ id:20, url:'right-slider/l-2-20.html', skip: true },
                  //{ id:21, url:'right-slider/l-2-21.html', skip: true },
                  //{ id:22, url:'right-slider/l-2-22.html', skip: true },
                  //{ id:23, url:'right-slider/l-2-23.html', skip: true },
                  //{ id:24, url:'right-slider/l-2-24.html', skip: true },
                  //{ id:25, url:'right-slider/l-2-25.html', skip: true },
                  //{ id:26, url:'right-slider/l-2-26.html', skip: true },
                  //{ id:27, url:'right-slider/l-2-27.html', skip: true },
                  //{ id:28, url:'right-slider/l-2-28.html', skip: true },
                  //{ id:29, url:'right-slider/l-2-29.html', skip: true },
                  //{ id:30, url:'right-slider/l-2-30.html', skip: true },
                  //{ id:31, url:'right-slider/l-2-31.html', skip: true }
              ],
              level3: [
                  { id:1, url:'right-slider/l-3-1.html', skip: false },
                  { id:2, url:'right-slider/l-3-2.html', skip: false },
                  { id:3, url:'right-slider/l-3-3.html', skip: false },
                  { id:4, url:'right-slider/l-3-4.html', skip: false },
                  { id:5, url:'right-slider/l-3-5.html', skip: false },
                  { id:6, url:'right-slider/l-3-6.html', skip: false },
                  { id:7, url:'right-slider/l-3-7.html', skip: false },
                  { id:8, url:'right-slider/l-3-8.html', skip: false },
                  { id:9, url:'right-slider/l-3-9.html', skip: false },
                  { id:10, url:'right-slider/l-3-10.html', skip: false },
                  { id:11, url:'right-slider/l-3-11.html', skip: false },
                  { id:12, url:'right-slider/l-3-12.html', skip: false },
                  { id:13, url:'right-slider/l-3-13.html', skip: false },
                  { id:14, url:'right-slider/l-3-14.html', skip: false },
                  { id:15, url:'right-slider/l-3-15.html', skip: false },
              ]
         }
         // myProfile.rightSlider = [];
  
      };
      
      root.init = function( slides ){
          allSlides = root.flatten( slides );
          currentSlide = allSlides[0];
      }
      
      root.currentSlide = function(){
          
          if ( currentSlide == undefined ){
              return failSafeUrl ;
          } else {
              return currentSlide;
          }
      }
  
      // slider is an array of levels that contains slides
      root.flatten = function( slider ){
          
          var slides = [];
  
          slides = slides.concat( slider.level1 );
          slides = slides.concat( slider.level2 );
          slides = slides.concat( Utils.shuffle( slider.level3 )[0] );
          
          slides.clean(undefined);
          return slides;
      };
      
      root.nextSlide = function (){
         
          // inform the API that user has skipped a slide that is skippable (level 1 & 2 are skippable)
          if ( currentSlide != undefined 
              && ( currentSlide.type == 1 || currentSlide.type == 2 ) ){
              
              // some ajax call to api
              var url        = "/member/account/rightSlider/skip";
              var success    = function(){};
              var error      = function(){};
              var postParams = { id: currentSlide.id };
              ajaxRequest.speak( url, success, error, postParams );
          }
          
          // go to next slide
          currentSlide = allSlides[ currentSlidePosition ];
          
          // increment counter to show next slide
          if ( currentSlide != undefined ){
  
              currentSlidePosition++;
  
          } else {
              
              // this will make current slide set to the first slide if 
              // nextSlide is called on the last slide
              currentSlide = allSlides[ 0 ];
              currentSlidePosition = 1;
          }   
      }
  
      return root;
  }]);
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  app.service('ll', function ( ajaxRequest, $rootScope )
  {
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // search
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      var searchCachedResults = [];
      var searchLastSearchId = null;
      
      //
      // if the requested page has not been cached yet, load it from the server, otherwise return object cached
      // in searchCachedResults array
      //
      this.searchNext = function (page, completed)
      {
          if (!searchCachedResults[page])
          {
              searchLastSearchId = $.cookie("searchId");
              var postData = { searchId: searchLastSearchId, page: page, resultPerPage: 12 };
              ajaxRequest.speak("/member/dating/json/search/subsequent/page",
                  function (data) 
                  {
                      searchCachedResults[page] = data;
                      completed(searchCachedResults[page]);
                  }, 
                  null, 
                  postData);
          }
          else
          {
              completed(searchCachedResults[page]);
          }
      };
      
      this.searchPageChanged = function ()
      {
          searchPageChanged = true;
      };
      
      this.resetCachedResults = function ()
      {
          searchCachedResults = [];
      };
      
      this.searchLastSearchId = function ()
      {
          return searchLastSearchId;
      };
      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // profile
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      
      //
      // Used for caching profile data and avoid calling the endpoint multiple times for the same profile
      //
      var profileData = [];
      
      this.getProfileForUserId = function (userId, completed, useCacheResult )
      {   
          // If useCacheResult is not passed in, then we assume the result will be returned
          // from cache. If useCacheResult is passed in and is FALSE, then we do an API call
          // to retrieve the result.
          useCacheResult = ( typeof useCacheResult !== 'undefined' ? useCacheResult : true );
          
          console.log("userId:", userId, ", profileData[userId]:", profileData[userId]);
  
          if ( profileData[userId] && useCacheResult )
          {
              completed(profileData[userId]);
          }
          else
          {
              ajaxRequest.speak("/member/dating/v1.1/json/search/viewProfileByUserId",
                  function (data) 
                  {
                      profileData[userId] = $.extend(true, {}, data); // deep copy
                      completed(profileData[userId]);
                      $rootScope.profileId = parseInt( userId );
                  }, 
                  null, 
                  { userId: userId });
              
              //
              // set user as viewed
              //
              $.ajax({
                  url: "/member/dating/v1.1/json/search/addViewByUserId?userId=" + userId,
                  success: function (data) {}
              });
          }
      };
      
      this.updateProfileDataForUserId = function (userId, data)
      {
          profileData[userId] = data;
      };
      
      
      var myProfileData = null;
      
      this.getMyProfile = function (forceReload, completed, error)
      {
          if (!forceReload && myProfileData)
          {
              completed(myProfileData);
          }
          else
          {
              ajaxRequest.speak("/member/dating/v1.2/json/viewmyprofile",
                  function (data) 
                  {
                      myProfileData = $.extend(true, {}, data);
                      completed(data);
                  }, 
                  error, 
                  {});
          }
      };
      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // misc
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      
  });
  
  app.factory( 'PrivateTeaserStatus', function( $rootScope ){
      
      var root = {};
  
      root.getStatus = function( free, requestSent, hasPrivatePhotos ){
          
          var status;
          var statuses = $rootScope.PRIVATE_TEASER_STATUSES;
          var youLikeUser = requestSent.likeSent;
          var userLikesYou = requestSent.likeReceived;
  
  //console.log( "free: " + free + " youLikeUser: " + youLikeUser + " userLikesYou: " + userLikesYou + " hasPrivatePhotos: " + hasPrivatePhotos);
          if ( free && youLikeUser && !userLikesYou && hasPrivatePhotos ){
  
              status = statuses.FREE_Y_N_Y;
  
          } else if ( free && youLikeUser && userLikesYou && hasPrivatePhotos ) {
          
              status = statuses.FREE_Y_Y_Y; 
  
          } else if ( free && youLikeUser && userLikesYou && !hasPrivatePhotos ) {
          
              status = statuses.FREE_Y_Y_N; 
  
          } else if ( !free && youLikeUser && !userLikesYou && hasPrivatePhotos ) {
          
              status = statuses.PAID_Y_N_Y;
  
          } else if ( !free && youLikeUser && userLikesYou && hasPrivatePhotos ) {
          
              status = statuses.PAID_Y_Y_Y;
  
          } else if ( !free && youLikeUser && userLikesYou && !hasPrivatePhotos ) {
          
              if ( requestSent != undefined && requestSent.privatePhoto ){
                  status = statuses.PAID_Y_Y_N_SENT;
              } else {
                  status = statuses.PAID_Y_Y_N;
              }
          
          } else if ( free && !youLikeUser && !userLikesYou && hasPrivatePhotos ) {
              
              status = statuses.FREE_N_N_Y;
  
          } else if ( free && !youLikeUser && !userLikesYou && !hasPrivatePhotos ) {
              
              status = statuses.FREE_N_N_N;
  
          } else if ( !free && !youLikeUser && !userLikesYou && hasPrivatePhotos ) {
  
              status = statuses.PAID_N_N_Y;
  
          } else if ( !free && !youLikeUser && !userLikesYou && !hasPrivatePhotos ) {
  
              if ( requestSent != undefined && requestSent.privatePhoto ){
                  status = statuses.PAID_N_N_N_SENT;
              } else {
                  status = statuses.PAID_N_N_N;            
              }    
          
          } else if ( free && !youLikeUser && userLikesYou && hasPrivatePhotos ) {
  
              status = statuses.FREE_N_Y_Y;
          
          } else if ( !free && !youLikeUser && userLikesYou && hasPrivatePhotos ) {
  
              status = statuses.PAID_N_Y_Y;
  
          } else if ( free && youLikeUser && !userLikesYou && !hasPrivatePhotos ) {
  
              status = statuses.FREE_Y_N_N;
          
          } else if ( !free && youLikeUser && !userLikesYou && !hasPrivatePhotos ) {
              
              if ( requestSent != undefined && requestSent.privatePhoto ){
                  status = statuses.PAID_Y_N_N_SENT;
              } else {
                  status = statuses.PAID_Y_N_N;
              }    
  
          } else if ( !free && !youLikeUser && userLikesYou && !hasPrivatePhotos ) {
  
              if ( requestSent != undefined && requestSent.privatePhoto ){
                  status = statuses.FREE_N_Y_N_SENT;
              } else {
                  status = statuses.FREE_N_Y_N;
              }    
  
          } else if ( free && !youLikeUser && userLikesYou && !hasPrivatePhotos ) {
  
              if ( requestSent != undefined && requestSent.privatePhoto ){
                  status = statuses.PAID_N_Y_N_SENT;
              } else {
                  status = statuses.PAID_N_Y_N;
              }    
  
          } else {
          
              status = statuses.VIEWER_SENT_RECEIVED_PRIVATE;
          }
          
          status.action = appendAction( status.action_id );
          status.hasPrivatePhotos  = hasPrivatePhotos;
          status.isMessageAction   = ( status.action_id == 2 );
          status.isLikeOrUnlikeAction = ( status.action_id == 3 || status.action_id == 4 );
          status.isSubscribeAction = ( status.action_id == 1 );
  
          return status;
      };
      
      function appendAction( action_id ){
          
          return $rootScope.PRIVATE_TEASER_ACTIONS[ action_id ];
      }
  
      return root; 
  });