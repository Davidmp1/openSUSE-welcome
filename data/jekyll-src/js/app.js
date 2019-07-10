/*
    openSUSE Welcome - A welcome utility
    Copyright (C) 2019  Carson Black
    Copyright (C) 2019  Stasiek Michalski
    Copyright (C) 2017  Ian Firns

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
var app = angular.module("welcome", ['ngAnimate', 'ngRoute', 'lens.bridge', 'lens.ui'])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/main', {
          templateUrl: 'partials/main.html',
        })
        .when('/contribute', {
          templateUrl: 'partials/contribute.html',
        })
        .when('/socials', {
          templateUrl: 'partials/socials.html',
        })
        .when('/readme', {
          templateUrl: 'partials/readme.html',
        })
        .otherwise({
          redirectTo: '/main'
        });
    }
  ]);

angular.element(document).ready(function () {
  angular.bootstrap(document, ['welcome']);
});

app.controller('WelcomeCtrl', function($scope) {
  $scope.system = {
    arch:       'n/a',
    distribution: {
      codename:   'n/a',
      desktop:    'n/a',
      version:    'n/a',
      live:       true,
    }
  };

  $scope.autostart = false;

  $scope.isDE = function(desktop) {
    return $scope.system.distribution.desktop.toLowerCase() === desktop.toLowerCase();
  }

  $scope.openURI = function(uri) {
    $scope.emit('open-url', uri);
  };

  $scope.command = function(cmd) {
    $scope.emit('command', cmd);
  };

  $scope.updateAutoStart = function() {
    $scope.emit('set-autostart', $scope.autostart);
  };

  $scope.close = function() {
    $scope.emit('close-request');
  };

  /* register for signals */
  $scope.$on('system-config', function(e, system) {
    $scope.system = system;
  });

  $scope.emit('get-system-config');
});

/*
** PAGE HANDLER
*/
$(document).ready( function() {
  /* configure korobar */
  var fixed   = true;
  var page    = $('.page-container');
  var footer  = $('footer');
  var start   = 0;

  /* helper function to frob element heights for the layered effect */
  var resizeHelper = function() {
    // banner correction
    if( $('#banner').length ) {
      start = $('#banner').outerHeight();
    }

    /* frob page-container minimum height to at least the footer top */
    page.css({
      'min-height': ($(window).height()-footer.outerHeight()) + 'px',
      'margin-bottom': footer.outerHeight() + 'px'
    });

    /* frob page-content minimum height to consume immediate window */
    $('.page-content').css('min-height', ( $(window).height() - 96 )  + 'px');
  }

  /* bind to resize events */
  $(window).on('resize', resizeHelper);

  /* turn on tooltips */
  $("[data-toggle='tooltip']").tooltip();

  /* smooth scroll targets */
  $('a[href*=#]:not([href=#]):not([data-toggle])').click(function() {
    if( location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if( target.length ) {
        $('html,body').animate({ scrollTop: target.offset().top - 16 }, 1000);
        return false;
      }
    }
  });

  /* initial call to page resize helper */
  setTimeout(function() { resizeHelper(); }, 0);

  setTimeout(function() {
    var alphaStart = 1;
    var scaleFactor = 4 // by volume with 8 circs at 16px rad
    var initialScale = 0.3;
    var finalScale = initialScale*scaleFactor;
    var offset = 0.1;
    var travel = 16;

    TweenMax.set('svg', { visibility: 'visible' });
    TweenMax.set('.ellipse', { transformOrigin: "50% 50%" });

    var tl = new TimelineMax({
      repeat: 0,
      onComplete: function() { $('#splash').fadeOut('slow'); }
    });

    tl.fromTo('.ellipses', 3.4, { x: -(travel) }, { x: travel, ease: Linear.easeNone })
      .staggerFromTo('.ellipse', 2.5, { x: -350, autoAlpha: alphaStart }, { x: 350, autoAlpha: 1, ease: SlowMo.ease.config(0.25, 1.0, false), transformOrigin: "50% 50%"}, offset, "-=2.4")
      .staggerFromTo('.ellipse', 1.75, { scale: initialScale }, { scale: finalScale, ease: SlowMo.ease.config(0, 1, true), yoyo: true}, offset, "-=3.0")
  }, 0);
});
