var fix={};
fix.winResize=function(callback){
  var loop;
  $(window).resize(function(){
    clearTimeout(loop);
    loop=setTimeout(function(){
      callback();
    },900);
  });
}
fix.domChange=function(ele,callback){
  var footerloop;
  $(ele).bind("DOMSubtreeModified",function(){
    clearTimeout(footerloop);
    footerloop=setTimeout(function(){
      callback();
    },900)
  });
}
fix.footer=function(ele){
  var run = function(){

    var fbottom = $('footer').position().top + $('footer').height();
    var fheight = $('footer').height();

    if(fbottom < $(window).height()){
       $('footer').css('position', 'absolute');
       $('footer').css('top', $(window).height() - fheight);
       $('footer').css('width', '100%');
    }
    if(!ele){
      console.Error("Footer method needs the container element");
    }
    if($(ele).height()+$(ele).position().top > $(window).height()){
      $('footer').css('position', 'unset');
       $('footer').css('width', '100%');
    }
  }
  run();
  fix.winResize(run);
  fix.domChange(ele,run);
}


fix.footer('main');