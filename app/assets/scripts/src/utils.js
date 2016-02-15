var $ = require('jquery');
var GoogleMapsLoader = require('google-maps');
var noUiSlider = require('nouislider');
require('jquery-chosen');
require('isotope-layout');
require('jquery-mask-plugin');
require('mediaelement');
require('bxslider');
var pikaday = require('pikaday/plugins/pikaday.jquery');
var moment = require('moment');

module.exports = {
  input: function() {
    $input = $('.form-text, .form-textarea');

    $input.on('blur keyup', function() {
      if( this.value ){
        $(this).closest('.form-item').addClass('form-item-has-value');
      } else {
        $(this).closest('.form-item').removeClass('form-item-has-value');
      }
    });

    $input.each(function() {
      if( this.value ){
        $(this).closest('.form-item').addClass('form-item-has-value');
      } else {
        $(this).closest('.form-item').removeClass('form-item-has-value');
      }
    });

    $('.checkbox-depends-field').on('change', function(){
      var $wrapper = $($(this).data('depends-field-wrapper'));
      var state = !this.checked;
      $wrapper.find('.form-text, .form-textarea, .form-checkbox, .form-radio').prop('disabled', state);
      $wrapper.find('.form-select').prop('disabled', state).trigger('chosen:updated');
      $wrapper.find('.slider').attr('disabled', state);
    });

    $('.form-radio[name=star-rating]').on('change', function(e){
      $('.rating-text').val($(this).val());
    });

    $('.rating-text').on('keyup', function(e){
      var value = parseFloat(this.value) * 10;
      var intValue = parseInt(this.value) * 10;
      var $input = $('#star-rating-' + intValue);
      if ( value == intValue ) {
        $input.prop('checked', true);
      } else {
        $input.prev().prev().prop('checked', true);
      }
    });
  },
  select: function() {
    var $select = $('.form-select');

    $select.chosen({
      placeholder_text_single: ' ',
      width: '100%'
    });

    $select.on('change', function(e, params) {
      if( this.value ) {
        $(this).closest('.form-item').addClass('form-item-has-value');
      } else {
        $(this).closest('.form-item').removeClass('form-item-has-value');
      }
    });

    $select.each(function() {
      if( this.value ){
        $(this).closest('.form-item').addClass('form-item-has-value');
      } else {
        $(this).closest('.form-item').removeClass('form-item-has-value');
      }
    });
  },
  menu: function() {
    if ($('body').hasClass('home')){
      $(window).on('scroll', function(e) {
        if (Modernizr.mq('(min-width : 768px)')) {
          if ($(this).scrollTop() > 75) {
            $('.header').addClass('header-fixed');
          } else {
            $('.header').removeClass('header-fixed');
          }
        }
      });
    }

    $('.menu-mobile-btn').on('click', function(e){
      e.preventDefault();
      $('html').addClass('block-scroll');
      $(this).closest('.header').addClass('menu-open');
    });

    $('.menu-mobile-close-btn').on('click', function(e){
      e.preventDefault();
      $('html').removeClass('block-scroll');
      $(this).closest('.header').removeClass('menu-open');
    });
  },
  headerModal: function(){
    $('.header-modal-btn').on('click', function(e){
      e.preventDefault();
      var $headerModal = $('.header-modal');
      $headerModal.toggleClass('header-modal-open');
      if ($headerModal.hasClass('header-modal-open')) {
        $('.header-login').show();
        $('.header-password, .header-password-confirm').hide();
      }
    });

    $(document).on('click.login', function(event) {
      if (!$(event.target).closest('.header-modal-open').length && !$(event.target).hasClass('header-modal-btn')) {
        $('.header-modal-open').removeClass('header-modal-open');
      }
    });

    $('.header-login .forgot').on('click', function(e) {
      e.preventDefault();
      $('.header-login').hide();
      $('.header-password').show();
    });

    $('.header-password-confirm .btn').on('click', function(e) {
      e.preventDefault();
      $('.header-modal').removeClass('header-modal-open');
      $('.header-password-confirm').hide();
      $('.header-login').show();
    });

  },
  boxLogin: function(){
    $('.open-box-login').on('click', function(e){
      e.preventDefault();
      $(this.hash).slideDown();
    });

    $('.section-login .forgot').on('click', function(e) {
      e.preventDefault();
      var $parent = $(this).closest('.box-login');
      $parent.find('.section-login').hide();
      $parent.find('.section-password').show();
    });

    $('.section-password-confirm .btn').on('click', function(e) {
      e.preventDefault();
      $(this).closest('.login-register').slideUp();
      $('.section-password-confirm').hide();
      $('.section-login').show();
    });
  },
  userLogged: function(){
    $('.user-logged-link').on('click', function(e){
      e.preventDefault();
      $(this).closest('.menu-actions-logged').toggleClass('user-logged-menu-open');
    });
  },
  viewPassword: function(){
    $('.view-password .form-checkbox').on('change', function(e){
      var $input = $(this).closest('.form-item').find('.form-text');
      if (this.checked){
        $input.prop('type', 'text');
      }else {
        $input.prop('type', 'password');
      }
    });
  },
  createMap: function(){
    if ($('.map').length){
      GoogleMapsLoader.load(function(google) {
        var map = new google.maps.Map(document.querySelector('.map'), {
          zoom: 10,
          disableDefaultUI: true,
          zoomControl: true,
          scaleControl: true
        });

        checkGeolocation();

        function checkGeolocation(){
          // Try HTML5 geolocation.
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              map.setCenter(pos);
            }, function() {
              // Return location by IP
              $.getJSON("http://ip-api.com/json", function (data) {
                var pos = {
                  lat: parseFloat(data.lat),
                  lng: parseFloat(data.lon)
                };
                map.setCenter(pos);
              });
            });
          } else {
            /* geolocation IS NOT available */
            map.setCenter(-22.965379, -43.17415299999999);
          }
        }

        $.getJSON(location.protocol + '//' + location.host + '/wp-content/themes/sebrae/assets/data/sebraesc-markers.json', function(data) {
          $.each( data.markers, function(i, value) {
            var myLatlng = new google.maps.LatLng(value.lat, value.lon);
            var contentString = '<div id="content">'+
                      '<div id="siteNotice">'+
                        '<h1 id="firstHeading" class="firstHeading">'+ value.name +'</h1>'+
                        '<div id="bodyContent">'+
                          '<p><small>'+ value.address +'</small></p>'+
                          '<p><small><a href="tel:'+ value.phone +'">'+ value.phone +'</a></small></p>'+
                      '</div>'+
                    '</div>';
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });

            var marker = new google.maps.Marker({
              position: myLatlng,
              map: map,
              title: value.name
            });

            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });

          });
        });
      });
    }
  },
  masonry: function(){
    var $grid = $('.masonry');

    $grid.isotope({
      itemSelector: '.card',
      masonry: {
        columnWidth: '.grid-sizer'
      },
      getSortData: {
        'view': '[data-view] parseInt',
        'date': function(elem){
          var dateStr = $(elem).data('date'),
              dateArray = dateStr.split('/'),
              year = dateArray[2],
              month = dateArray[1],
              day = dateArray[0];
          return new Date(year, month, day);
        },
        'lower-price': '[data-price] parseFloat',
        'higher-price': '[data-price] parseFloat'
      },
      sortAscending: {
        'view': true,
        'date': true,
        'lower-price': true,
        'higher-price': false
      }
    });

    $('.filter-select').on('change', function(){
      $grid.isotope({ sortBy: $(this).val() });
    });

    $('body').on('click', '.btn-load-more', function(e){
      e.preventDefault();
      var $btn = $(this);
      // The number of the next page to load (/page/x/).
      var pageNum = $btn.data('page') + 1;

      // The maximum number of pages the current query can return.
      var max = $btn.data('max');

      // The link of the next page of posts.
      var nextLink = $btn.data('nextlink');

      if (pageNum <= max) {
        // Show that we're working.
        $btn.text('Carregando...');
        $.ajax({
          url: nextLink
        }).done(function(data) {
          var $elems = $(data).find('.masonry .card');
          $grid.isotope('insert', $elems);
          $elems.find('img').on('load', function(){
            $grid.isotope('layout');
          });
          pageNum++;
          nextLink = nextLink.replace(/\/page\/[0-9]?/, '/page/'+ pageNum);
          if (pageNum <= max) {
            $btn.text('Carregar mais!');
          } else {
            $btn.remove();
          }
        });
      } else {
        $btn.remove();
      }
    });

  },
  backTop: function(){
    $('.back-top').on('click', function(e){
      var $elem = $(this);
      e.preventDefault();
      $elem.addClass('animate');
      $('<audio>').prop('src', 'assets/sounds/rocket-launch.mp3').prop('autoplay', 'autoplay');
      $('html,body').delay(700).animate({
        scrollTop: 0
      }, 700, 'swing', function(){
        $elem.removeClass('animate');
      });
    });
  },
  slider: function(){
    var $slider = $('.slider');
    if ($slider.length){
      var priceStart = $('.price-range').data('start');
      var priceEnd = $('.price-range').data('end');
      var slider = $slider[0];
      noUiSlider.create(slider, {
        start: [priceStart,priceEnd],
        connect: true,
        step: 50,
        range: {
          min: priceStart,
          max: priceEnd
        },
        format: {
          to: function ( value ) {
            return 'R$ ' + value;
          },
          from: function ( value ) {
            return value.replace('R$ ', '');
          }
        }
      });

      slider.noUiSlider.on('update', function(values, handle){
        if (handle) {
          $('.price-end').val(values[handle]);
        } else {
          $('.price-start').val(values[handle]);
        }
      });
    }

  },
  filter: function(){
    var $form = $('.filter-form');
    var $inputs = $form.find('.form-checkbox, .form-text');

    $inputs.on('change.filter', checkInputs);

    $form.find('.filter-header .btn').on('click', function(){
      this.form.reset();
      $('.checkbox-depends-field').trigger('change');
      checkInputs();
    });

    function checkInputs(){
      var orig = $form.serialize();
      var withoutEmpties = orig.replace(/[^&]+=\.?(?:&|$)/g, '');
      if (withoutEmpties === ''){
        $form.removeClass('form-not-empty');
      } else{
        $form.addClass('form-not-empty');
      }
    }

    checkInputs();
  },
  interest: function(){
    $('.interest .open-form').on('click', function(e){
      e.preventDefault();
      $(this).closest('.interest').find('.interest-form-wrapper').slideToggle();
    });
  },
  recommend: function(){
    $('.recommend-link').on('click', function(e){
      e.preventDefault();
      $(this).closest('.card').toggleClass('recommend-open').find('.recommend').slideToggle();
    });
  },
  mask: function(){
    // TELEFONE 9 DIGITOS
    var SPMaskBehavior = function (val) {
      return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    };

    var spOptions = {
      onKeyPress: function(val, e, field, options) {
        field.mask(SPMaskBehavior.apply({}, arguments), options);
      }
    };

    $('.celphones').mask(SPMaskBehavior, spOptions);

    var ratingOptions = {
      'translation': { A: {pattern: /[0-5]/}, B: {pattern: /[0-9]/} },
      onKeyPress: function(val, e, field, options) {
        if ( val == 5 ){
          $(field).val('5.0');
        }
        if ( val == '5.'){
          $(field).val('');
        }
      }
    };

    $('.rating-mask').mask('A.B', ratingOptions);

  },
  accordion: function(){
    var $accordionItem = $('.accordion-item');
    $('.accordion-title').on('click', function(e){
      e.preventDefault();
      var item = $(this).closest('.accordion-item').toggleClass('accordion-item-open').find('.accordion-content').slideToggle().end();
      $accordionItem.not(item).removeClass('accordion-item-open').find('.accordion-content').slideUp();
    });
  },
  avatar: function(){
    $('.radio-avatar').on('change', function(){
      var value = $(this).val();
      $('.avatar-image use').fadeOut(function(){
        $(this).attr('xlink:href', '/wp-content/themes/sebrae/assets/images/ico/symbol-defs.svg#' + value).fadeIn();
      });
    });
  },
  gamification: function(){
    var $popup = $('.gamification-popup');

    $popup.addClass('open').delay(1000).queue(function(){
      module.exports.animateNumber('.gamification-popup-points-number');
      $popup.dequeue();
    }).delay(9000).queue(function(){
      $popup.removeClass('open').dequeue();
    });

    $('.gamification-popup-close').on('click', function(e){
      e.preventDefault();
      $popup.removeClass('open').dequeue();
    });
  },
  animateNumber: function(elem){
    $({countNum: $(elem).text()}).animate({countNum: $(elem).data('number')}, {
      duration: 1000,
      easing:'linear',
      step: function() {
        $(elem).text('+' + Math.floor(this.countNum));
      },
      complete: function() {
        $(elem).text('+' + this.countNum);
      }
    });
  },
  video: function(){
    $('.video').mediaelementplayer({
      features: ['playpause','progress','current','duration','volume'],
      alwaysShowControls: true,
      autoRewind: false,
      success: function (mediaElement, domObject) {
        $(mediaElement).on('ended', function(e){
          $(mediaElement).closest('.mejs-video').find('.mejs-overlay-play').addClass('mejs-overlay-replay');
        }).on('play', function(e){
          $(mediaElement).closest('.mejs-video').find('.mejs-overlay-play').removeClass('mejs-overlay-replay');
        });
      }
    });
  },
  ticketInfo: function(){
    var $ticketInfoWrapper = $('.ticket-info-wrapper');
    $('.ticket-info').on('click', function(e){
      e.preventDefault();
      var elem = $(this).closest('.ticket-info-wrapper').toggleClass('ticket-info-open');
      $ticketInfoWrapper.not(elem).removeClass('ticket-info-open');
    });

    $(document).on('click.ticket', function(event) {
      if (!$(event.target).closest('.ticket-info-wrapper').length && !$(event.target).hasClass('ticket-info') && !$(event.target).closest('.ticket-info').length) {
        $('.ticket-info-open').removeClass('ticket-info-open');
      }
    });
  },
  filterLink: function(){
    $('.header-filter-link').on('click', function(e){
      e.preventDefault();
      $('html').addClass('block-scroll');
      $('.filter-menu').addClass('open');
    });

    $('.filter-menu-close-btn').on('click', function(e){
      e.preventDefault();
      $('html').removeClass('block-scroll');
      $('.filter-menu').removeClass('open');
    });
  },
  cardFull: function(){
    $('.card-full').on('click', function(e){
      $(this).toggleClass('card-full-open');
    });
  },
  testimonial: function(){
    $('.testimonial-list').bxSlider({
      controls: false,
      randomStart: true,
      auto: true,
      autoHover: true,
      pause: 5000
    });
  },
  datepicker: function(){
    var i18n = {
      previousMonth : '<svg width="20" height="20" class="icon"><use xlink:href="http://localhost:3000/assets/images/ico/symbol-defs.svg#icon-angle-left"/></svg>',
      nextMonth     : '<svg width="20" height="20" class="icon"><use xlink:href="http://localhost:3000/assets/images/ico/symbol-defs.svg#icon-angle-right"/></svg>',
      months        : ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
      weekdays      : ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
      weekdaysShort : ['D','S','T','Q','Q','S','S']
    };

    var picker1 = $('.datepicker-start').pikaday({
      format: 'DD/MM/YY',
      minDate: new Date(),
      i18n: i18n,
      onSelect: function(date){
        picker2.pikaday('setMinDate', date);
      }
    });

    var picker2 = $('.datepicker-end').pikaday({
      format: 'DD/MM/YY',
      minDate: new Date(),
      i18n: i18n,
      onSelect: function(date){
        picker1.pikaday('setMaxDate', date);
      }
    });
  }
};
