$.fn.animateTransform = function(/* [start,] end [, duration] [, callback] */){
    var start = null, end = null, duration = 400, callback = function(){};
    for(var i=0; i<arguments.length; i++){
      if(typeof(arguments[i]) == "string"){
        if(!start) start = arguments[i];
        else end = arguments[i];
      } else if(typeof(arguments[i]) == "number"){
        duration = arguments[i];
      } else if(typeof(arguments[i]) == "function"){
        callback = arguments[i];
      }
    }
    if(start && !end){
      end = start;
      start = null;
    }
    if(!end) return;
    if(start){
      this.css("transform", start);
    }
    if(duration < 16) duration = 16;
    var transitionB4 = this.css("transition");
    this.css("transition", "transform " + duration + "ms");
    this.css("transform", end);
    var $el = this;
    setTimeout(function(){
      $el.css("transition", transitionB4 || "");
      $el.css("transform", end);
      callback();
    }, duration);
  };