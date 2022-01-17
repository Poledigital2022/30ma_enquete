$data = [];
$currentQues = {};
$currentInd = 0;
$response = [];
$indX = 0;
$('#stickyBox span').html('');
var $slider;

jQuery.post('./questions.json', function(res){
  $data = res.questions;
  $currentQues = res.questions[$indX];
  $currentInd = $indX;
});

$(document).ready(function(){
  $('#__form__').keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
  
    // - Handle Questionnaire
    $('.button-next').on('click', function(ev){
        ev.preventDefault();
        var $parent = $(this).parents('.itm');

        if($parent.find('.ResPonSe:checked').length > 0){
          
          if($(this).hasClass('last-step')){
            jQuery.post('./save-answers.php', {data : $response}, function(res){
              res = JSON.parse(res);

              if(res.state){
                const params = $('#QueryString').val();
                var e = 'Thu Nov 26 2025 15:44:38'; 
                document.cookie = 'responses='+ JSON.stringify($response) +';expires=' + e;
                document.cookie = 'userid='+ res.id +';expires=' + e;
                window.location.replace("end.php?"+params);
              }else{
                alert(res.message)
              }
            });
            return false;
          }

          $parent.find('.requiredRes').slideUp();

          $slider.slick('slickGoTo', $indX);
    
          $('html, body').animate({
              scrollTop: $('.slck-slides-questions').offset().top - $('.header').height() - 30
          }, 500);
        }else{
          $parent.find('.requiredRes').slideDown();
          $('html, body').animate({
              scrollTop: $('#ResPonSes').offset().top - $('.header').height() - 90
          }, 500);
        }
    });
    $('.slck-slides-questions .itm a.edit').on('click', function(ev){
      ev.preventDefault();

        $(this).parents('.itm').find('.ResPonSe').prop('checked', false);
    });
    // - End handle Questionnaire

    // - Popup
    $('#stickyBox').on('click', function(){
      
      if($indX <= 0){ 
        return;
      }
      $('.popup').addClass('on');
      $('html, body').animate({
        scrollTop: $('.popup').offset().top - $('.header').height() - 30
    }, 500);
    });
    $('.popup .close').on('click', function(){
      $('.popup').removeClass('on')
    });

    $('.banner .slides').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              autoplay: true,
              autoplaySpeed: 5000,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              autoplay: true,
              autoplaySpeed: 5000,
            }
          }
        ]
    });
    $('.adv-banner-2 .slides').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 1,
                autoplay: true,
                autoplaySpeed: 5000,
              }
            }
        ]
    });
    $('.adv-banner-4 .slides').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
    });

    $slider = $('.slck-slides-questions > div').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      swipe: false,
      adaptiveHeight: true,
      infinite: false,
      accessibility: false,
      arrows: false
    });
    
    

    //-- Scroll
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        if(scrollTop > 10){
            $('.header').addClass('sticky');
        }else{
            $('.header').removeClass('sticky');
        }


        // - Fixe Box
        var $redSct = $('#EntryText');
        var $stickyBox = $('#stickyBox');
        var halfRedSctfHei = $redSct.outerHeight() / 2;
        var halfdWinHei = $(this).outerHeight() / 2;
        var offSetRedSct = $redSct.offset().top;

        
        if( (scrollTop + halfdWinHei) > (offSetRedSct + halfRedSctfHei) ){
          $redSct.addClass('fixed');
        }else{
          $redSct.removeClass('fixed');
        }
    });

    // - Smooth Scroll  
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();
    
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top - $('.header').height() - 30
        }, 500);
    });
    
    // - Form
    $('.form input[type="radio"]').on('change', function(ev){
      var val = $(this).val();
      calculate(val);
    });
    // - Draggable & Droppable
    if($(window).width() > 991 ){
      $(".slck-slides-questions [draggable!=true], .slck-slides-questions .slick-list").unbind('dragstart');
      $(".slck-slides-questions .draggable" ).draggable({
        distance: 10,
        start: function(event, ui){
          $(this).draggable('instance').offset.click = {
              left: Math.floor(ui.helper.width() / 2),
              top: Math.floor(ui.helper.height() / 2)
          }; 
        },
        stop: function( event, ui ) {
          
          $(ui.helper[0]).css({
            'left': 0,
            'right': 0,
            'top': 0,
            'bottom': 0,
          });
        }
      });
      $(".slck-slides-questions .draggable").on("draggable mouseenter mousedown",function(event){
        event.stopPropagation();
      });
      $(".slck-slides-questions .slick-list").unbind('draggable mouseenter mousedown');

    }
    $( ".droppable" ).droppable({
      drop: function( event, ui ) {

        $(ui.draggable).css({
          'left': 0,
          'right': 0,
          'top': 0,
          'bottom': 0,
        });
        $(ui.draggable).find('.ResPonSe').prop('checked', true);
        $(ui.draggable).find('.ResPonSe').trigger('change');

        // $( this )
        //   .addClass( "ui-state-highlight" )
        //   .find( "p" )
        //     .html( "Dropped!" );
      }
    });

    $('#emailF').on('input', function(){
      if($(this).val() && validateEmail($('#emailF').val())){
        $(this).attr('style', '');
      }
      
    });
    $('#sendMail').on('submit', function(ev){
      ev.preventDefault();
      if($('#emailF').val() && validateEmail($('#emailF').val())){
        $(this).find('.button').attr('disabled', true)
        console.log(document.cookie);
        jQuery.post('./send-mail.php', {email: $('#emailF').val(), id: getCookie('userid')}, function(res){
          console.log(res);
          $('#hidden').show();
          $('#sendMail').find('.button').attr('disabled', false)
          
        });
        $('#emailF').attr('style', '');
      }else{
        $('#emailF').css('border', '1px solid red');
      }
    })

    $('.itm input[type="radio"]').on('change', function(){
      addToBox($(this).parents('.itm'));

      // ------------ Animation
      CSMAnimation($(this));
      // ------------ Animation
    });

    
});
// - Function
function calculate(val){
  val = val.replace(',', '.');

  var res = val - (val * 0.66)

  if(res == 0){
    $('#resForm span').html(0);
  }else{
    $('#resForm span').html(res.toFixed(2));
  }

  $('#dynamicLink').attr('href', 'https://don.30millionsdamis.fr/asso/site/30ma/consultation/fr/don/index.html?amount=' + val)
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }

      calculate(this.value);
      if(this.value){
        this.style.width = this.value.length + 'ch';
      }else{
        this.style.width = '220px';
      }
    });
  });
}
setInputFilter(document.getElementById("freeAmount"), function(value) {
  return /^-?\d*[.,]?\d*$/.test(value); });

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function addToBox($parent){

  var QuestionId = false;
  var ResponseValue = false;

  if($parent.find('.ResPonSe:checked').length > 0){
    var $value = $parent.find('.ResPonSe:checked').val();

    QuestionId = $value.split('-')[0];
    ResponseValue = $value.split('-')[1];
  }
  
  var $arr = {};
  $arr['question'] = QuestionId;
  $arr['response'] = ResponseValue;
 
  var $isExist = $response.find(x => x.question == QuestionId) || false;
  // $isExist = $response.find(x => x.question == QuestionId);
  
  console.log($isExist);
  
  $response[QuestionId] = $arr;
  if(!$isExist && $currentInd == $indX){
    
    $indX++;
    
  }
  $currentInd = $indX;
  console.log($response);
  $('#stickyBox span').html($indX);

  $('.wrapQQ').html('<div class="sldQ"></div>');
  for(var $i = 0; $i < $indX; $i++){
    
    $('.wrapQQ .sldQ').append('<div class="bbitm" data-id="'+$i+'">' +
                    '<div class="">' +
                      '<h2 class="h2">'+ $data[$i].title +'</h2>' +
                      '<div class="p">' + $data[$i].responses[$response[$i].response].response + '</div>'+
                      '<div class="buttons">' +
                        '<a href="" class="edit" data-id="'+ $i +'">' +
                          'Je modifie <br>mon choix' +
                        '</a>' +
                      '</div>' +
                    '</div>'+
                  '</div>'
                );
  }
  
  $('.popup .buttons > a.edit').on('click', function(ev){
    ev.preventDefault();
    $(this).parents('.popup').removeClass('on');
    $slider.slick('slickGoTo', $currentInd = $(this).attr('data-id'))
    
  });

  var $popupSlider = $('.popup .sldQ').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    //adaptiveHeight: true,
    infinite: false,
    arrows: false,
    initialSlide: $indX - 1
  });
  // End Append Question To Popup
  $('#navs').html('<div class="counter">' +
    '<div class="arr prev" '+( $indX == 1 ? 'style="display: none;' : '' )+'><i class="fa fa-chevron-left"></i></div>' +
    '<div class="page"><span class="_pg">'+$indX+'</span><sub>/'+$indX+'</sub></div>' +
    '<div class="arr next" style="display: none;"><i class="fa fa-chevron-right"></i></div>' +
    '</div>'
  );
  $('.popup .bbx .number').html($indX);
  $popupSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
    if(nextSlide == $indX - 1){
      $('#navs').find('.next').hide();
    }else{
      $('#navs').find('.next').show();
    }
    if(nextSlide == 0){
      $('#navs').find('.prev').hide();
    }else{
      $('#navs').find('.prev').show();
    }
    $('#navs').find('._pg').html(nextSlide + 1);
    $('.popup .bbx .number').html(nextSlide + 1);

  });
  $('#navs').find('.next').on('click', function(){
    $popupSlider.slick('slickNext');
  });
  $('#navs').find('.prev').on('click', function(){
    $popupSlider.slick('slickPrev');
  });
}

function CSMAnimation(radio){
  
  if($(window).width() <= 991){

    $clonedElem = radio.parents('li').clone();
    $clonedElem.css({
      'position': 'fixed',
      'width': radio.parents('li').outerWidth(),
      'height': radio.parents('li').outerHeight(),
    });
    $clonedElem.find('[type="radio"]').remove();
    $clonedElem.appendTo('body');

    $clonedElem.addClass('itmlbl');
    var viewportOffset = radio.parents('li')[0].getBoundingClientRect();
    var top = viewportOffset.top;
    var left = viewportOffset.left;

    console.log(top, left);

    $clonedElem.css({
      'top': top+'px',
      'left': left+'px',
      'overflow': 'hidden',
      'color': 'transparent',
      'background-color': '#009fe3',
      'border-radius': '40px 40px 40px 00px',
    }).animate({
      'right': '40px',
      'left': ($(window).outerWidth() - 80)+'px',
      'top': (($(window).outerHeight()/2) - 150) + 'px',
      'opacity': '.5',
      'width': '50px',
      'height': '50px',
      'border-radius': '50px',
      'border': '5px dashed #000',
    }, 650)
    .animate({
      'right': '0',
      'top': '50%',
      'opacity': '0',
    }, 350);
    $clonedElem.animateTransform("translate(50%, -50%) scale(1)", 1000, function(){
      $clonedElem.remove();
    });
  }
}