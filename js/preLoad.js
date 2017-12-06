(function(){
  // setLoading();
  anmt5();
  setPerc();
})();
function setPerc(){
  setView();
  window.onresize = setView;
  function setView(){
    var view = document.querySelector('#view');
    var main = document.querySelector('#main');
    var height = view.clientHeight;
    var deg = 52.5;
    var R = Math.round( Math.tan(deg*Math.PI/180) * (height/2) );
    view.style.perspective = R + 'px';
    css(main, 'translateZ', R);
  }
}
document.addEventListener('touchstart', function(e){
  e.preventDefault();
});
/*图片预加载*/
function setLoading(){
  var logoText = document.querySelector('.logoText');
  var data = [];
  var num = 0;
  for (var s in imgData) {
    if (imgData.hasOwnProperty(s)) {
      var element = imgData[s];
      data = data.concat(element);
    }
  }
  for (var i = 0; i < data.length; i++) {
    var img = new Image();
    img.src = data[i];
    img.onload = function(){
      num++;
      logoText.innerHTML = '已加载'+Math.floor(num/data.length*100) + '%';
      if (num == data.length) {
        //图片加载完成之后~
        anmt();
      }
    }
  }
}
// 隐藏loading，显示logo1
function anmt() {
  var view = document.querySelector('#view');
  var logo1 = document.querySelector('#logo1');
  var logo2 = document.createElement('div');
  var img = new Image();
  img.src = imgData.logo[0];
  logo2.id = 'logo2';
  logo2.className = 'logoImg';
  logo2.appendChild(img);
  css(img, 'scale', 0);
  MTween({
    el: logo1,
    target: {opacity: 0},
    time: 1000,
    type: "linear",
    callBack: function(){
      view.appendChild(logo2);
      MTween({
        el: img,
        target: {scale: 100},
        time: 800,
        type: "bounceOut",
        callBack: function(){
          setTimeout(anmt2, 2000);
        }
      });
    }
  });
}
// 隐藏logo1，显示logo2
function anmt2() {
  var view = document.querySelector('#view');
  var logo2 = document.querySelector('#logo2');
  var logo3 = document.createElement('div');
  var img = new Image();
  img.src = imgData.logo[1];
  logo3.id = 'logo2';
  logo3.className = 'logoImg';
  logo3.appendChild(img);
  css(img, 'scale', 0);
  MTween({
    el: logo2.querySelector('img'),
    target: {scale: 0},
    time: 500,
    type: "linear",
    callBack: function(){
      view.appendChild(logo3);
      MTween({
        el: img,
        target: {scale: 100},
        time: 800,
        type: "bounceOut",
        callBack: function(){
          setTimeout(function(){
            MTween({
              el: img,
              target: {scale: 0},
              time: 800,
              type: "bounceOut",
              callBack: anmt3
            });
          }, 1000);
        }
      });
    }
  });
}
function anmt3(){
  var view = document.querySelector('#view');
  var logo4 = document.createElement('div');
  var logoIcons = document.createElement('div');
  var logo4Img = new Image();
  logo4Img.src = imgData.logo[2];
  logo4Img.id = 'logo4Img';
  var iconLength = 27;
  logo4.id = 'logo4';
  logoIcons.id = 'logoIcons';
  for (var i = 0; i < iconLength; i++) {
    var span = document.createElement('span');
    var R = Math.round( Math.random() * 200 + 50 );
    var Y = Math.round( Math.random() * -400 + 200 );
    var Ydeg = i * 360 / iconLength + Math.round( (Math.random() - 0.5) * 20 );
    var Xdeg = i * 360 / iconLength + Math.round( (Math.random() - 0.5) * 20 );
    css(span, 'rotateY', Ydeg);
    css(span, 'translateZ', R);
    css(span, 'rotateX', Xdeg);
    css(span, 'translateY', Y);
    span.style.backgroundImage = 'url('+ imgData.logoIco[i % imgData.logoIco.length]+')';
    logoIcons.appendChild(span);
  }
  css(logo4, 'scale', 0);
  logo4.appendChild(logoIcons);
  logo4.appendChild(logo4Img);
  view.appendChild(logo4);
  setTimeout(function(){
    MTween({
      el: logo4,
      target: {scale: 100},
      time: 1000,
      type: 'easeOut',
      callBack: function(){
        MTween({
          el: logo4,
          target: {scale: 0},
          time: 3000,
          type: 'easeIn',
          callBack: function(){
            logo4.remove();
            anmt5();
          }
        });
      }
    });
  }, 500);
}
function anmt5(){//主体入场
  // view.remove();
  var mainWrapper = document.querySelector('#mainWrapper');
  css(mainWrapper, 'scale', 0);
  anmt7();//云朵动画
  anmt6();
  createPano();
  MTween({
    el: mainWrapper,
    target: {scale: 100},
    time: 7000,
    type: 'easeOutStrong'
  });
}
function anmt6(){//生成背景圆柱，圆柱入场
  var panobg = document.querySelector('#panobg');
  var width = 129;
  var deg = 360/imgData.bg.length;
  var unitDeg = Math.PI/180;
  var R = Math.floor( (width/2) / Math.tan( deg/2*unitDeg ) )-2;
  var startDeg = 180;
  for (var i = 0; i < imgData.bg.length; i++) {
    var span = document.createElement('span');
    css(span, "rotateY", startDeg - i*deg);
    css(span, "translateZ", -R);
    span.style.backgroundImage = 'url(' + imgData.bg[i] + ')';
    panobg.appendChild(span);
  }
  MTween({
    el: panobg,
    target: {rotateX: 0, rotateY: -1415},//先旋转X轴
    time: 5000,
    type: "easeOutStrong",
    callBack: function(){drag();setSensors();}
  });
}
function anmt7(){//添加云朵
  var cloud = document.querySelector('#cloud');
  for (var i = 0; i < 9; i++) {
    var span = document.createElement('span');
    span.style.backgroundImage = 'url('+ imgData.cloud[ i%imgData.cloud.length ]+')';
    var R = 300;
    var deg = Math.random()*360;
    var x = Math.sin(deg*Math.PI/180)*R;
    var z = Math.cos(deg*Math.PI/180)*R;
    var y = (Math.random()-0.5)*500;
    css(span, 'translateX', x);
    css(span, 'translateY', y);
    css(span, 'translateZ', z);
    cloud.appendChild(span);
  }
  MTween({//云彩旋转出现
    el: cloud,
    target: {rotateY: 720},
    time: 4000,
    type:'easeOutStrong',
    callIn: function(){
      var deg = -css(cloud, 'rotateY');
      for (var i = 0; i < cloud.children.length; i++) {
        css(cloud.children[i], 'rotateY', deg);
      }
    },
    callBack: function(){
      bgShow();
      MTween({//云彩消失
        el: cloud,
        target: {scale: 1000},
        time: 500,
        type:'easeInStrong',
        callBack: function(){
          cloud.remove();
        }
      });
    }
  });
}
function drag(){
  var panobg = document.querySelector('#panobg');
  var pano = document.querySelector('#pano');
  var mainWrapper = document.querySelector('#mainWrapper');//控制Z值
  var startZ = css(mainWrapper, 'translateZ');//初始Z值；
  var lastDeg = {x: 0, y: 0};
  var lastDis = {x: 0, y: 0};
  var startPoint = {x: 0, y: 0};
  var panobgDeg = {x: 0, y: 0};
  var scale = {x: 129/18, y: 1170/90};
  document.addEventListener('touchstart', function(e){
    startPoint.x = e.changedTouches[0].pageX;
    startPoint.y = e.changedTouches[0].pageY;
    panobgDeg.x = css(panobg, "rotateY");
    panobgDeg.y = css(panobg, "rotateX");
  });
  document.addEventListener('touchmove', function(e){
    var nowPoint = {x: 0, y: 0};
    var nowDeg = {x: 0, y: 0};
    nowPoint.x = e.changedTouches[0].pageX;
    nowPoint.y = e.changedTouches[0].pageY;
    var dis = {x: 0, y: 0};
    dis.x = nowPoint.x - startPoint.x;
    dis.y = nowPoint.y - startPoint.y;//手指移动的距离
    var disDeg = {x: 0, y: 0};//移动的角度数
    disDeg.x = -dis.x / scale.x;
    disDeg.y = dis.y / scale.y;//距离太大，所以要除以比例，让它变小
    nowDeg.x = panobgDeg.x + disDeg.x;//本次移动后应该到达的角度
    nowDeg.y = panobgDeg.y + disDeg.y;
    if (nowDeg.y>20) {
      nowDeg.y=20;
    } else if(nowDeg.y<-20) {
      nowDeg.y=-20;
    }
    lastDis.x = nowDeg.x - lastDeg.x;//本次移动后应该到达的角度-上次到达的角度
    lastDeg.x = nowDeg.x;
    lastDis.y = nowDeg.y - lastDeg.y;//本次移动后应该到达的角度-上次到达的角度
    lastDeg.y = nowDeg.y;
    css(panobg, 'rotateX', nowDeg.y);
    css(panobg, 'rotateY', nowDeg.x);//设置本次移动后应该到达的角度
    css(pano, 'rotateX', nowDeg.y);
    css(pano, 'rotateY', nowDeg.x);//设置本次移动后应该到达的角度
    if (Math.abs(dis.x) > 600) {
      dis.x = 600;
    }
    css(mainWrapper, 'translateZ', startZ - Math.abs(dis.x));
  });
  document.addEventListener('touchend', function(e){
    var currentDeg = {x: css(panobg, 'rotateY'), y: css(panobg, 'rotateX')};//现在的角度
    var changedDeg = {x: lastDis.x*10, y: lastDis.y*10};
    var expectDeg = {x: currentDeg.x + changedDeg.x, y: currentDeg.y + changedDeg.y};
    expectDeg.y = expectDeg.y>20?20:expectDeg.y;
    expectDeg.y = expectDeg.y<-20?-20:expectDeg.y;
    MTween({
      el: pano,
      target: {rotateY: expectDeg.x, rotateX: expectDeg.y},
      time: 500,
      type: 'easeOutStrong',
      // callBack: function(){
      //   lastDis.x = 0;
      //   lastDis.y = 0;
      // }
    });
    MTween({
      el: panobg,
      target: {rotateY: expectDeg.x, rotateX: expectDeg.y},
      time: 300,
      type: 'easeOutStrong',
      callBack: function(){
        lastDis.x = 0;
        lastDis.y = 0;
      }
    });
    MTween({
      el: mainWrapper,
      target: {translateZ: startZ},
      time: 500,
      type: 'easeOutStrong'
    });
  });
}
function bgShow(){
  var pagebg = document.querySelector('#pagebg');
  MTween({
    el: pagebg,
    target: {opacity: 100},
    time: 1000,
    type: 'easeBoth'
  });
}
function createPano(){
  var pano = document.querySelector('#pano');
  var drift1 = document.createElement('div');//浮层1开始
  var deg = 18;
  var R = 395;
  var startDeg = 180;//初始角度是反面对着我们，由于设置了backface才不可见，如果正面出现就会穿帮
  // css(pano, 'rotateX', 0);
  // css(pano, 'rotateY', -180);//设置下整体的初始旋转，方便做最后的进场动画。
  css(pano, 'scale', 0);
  var num = 0;
  drift1.className = 'pano';
  for (var i = 0; i < 2; i++) {//第一个漂浮层的图片数
    var span = document.createElement('span');
    span.style.cssText = "height: 344px;margin-top: -172px;";
    css(span, 'translateY', -163);
    css(span, 'rotateY', startDeg);
    css(span, 'translateZ', -R);
    span.style.backgroundImage = 'url(' + imgData.pano[num++] + ')';
    drift1.appendChild(span);
    startDeg -= deg;
  }
  pano.appendChild(drift1);
  //浮层2开始
  var drift2 = document.createElement('div');
  drift2.className = 'pano';
  for (var i = 0; i < 3; i++) {//第一个漂浮层的图片数
    var span = document.createElement('span');
    span.style.cssText = "height: 326px;margin-top: -172px;";
    css(span, 'translateY', 278);
    css(span, 'rotateY', startDeg);
    css(span, 'translateZ', -R);
    span.style.backgroundImage = 'url(' + imgData.pano[num++] + ')';
    drift2.appendChild(span);
    startDeg -= deg;
  }
  pano.appendChild(drift2);
  //浮层3开始
  var drift3 = document.createElement('div');
  drift3.className = 'pano';
  for (var i = 0; i < 4; i++) {//第一个漂浮层的图片数
    var span = document.createElement('span');
    span.style.cssText = "height: 195px;margin-top: -97.5px;";
    css(span, 'translateY', 192.5);
    css(span, 'rotateY', startDeg);
    css(span, 'translateZ', -R);
    span.style.backgroundImage = 'url(' + imgData.pano[num++] + ')';
    drift3.appendChild(span);
    startDeg -= deg;
  }
  pano.appendChild(drift3);
  //浮层4开始
  var drift4 = document.createElement('div');
  var startDeg = 90;
  drift4.className = 'pano';
  for (var i = 0; i < 5; i++) {//第一个漂浮层的图片数
    var span = document.createElement('span');
    span.style.cssText = "height: 468px;margin-top: -234px;";
    css(span, 'translateY', 129);
    css(span, 'rotateY', startDeg);
    css(span, 'translateZ', -R);
    span.style.backgroundImage = 'url(' + imgData.pano[num++] + ')';
    drift4.appendChild(span);
    startDeg -= deg;
  }
  pano.appendChild(drift4);
  //浮层5开始
  var drift5 = document.createElement('div');
  var startDeg = 18;
  drift5.className = 'pano';
  for (var i = 0; i < 6; i++) {//第一个漂浮层的图片数
    var span = document.createElement('span');
    span.style.cssText = "height: 582px;margin-top: -291px;";
    css(span, 'translateY', 256);
    css(span, 'rotateY', startDeg);
    css(span, 'translateZ', -R);
    span.style.backgroundImage = 'url(' + imgData.pano[num++] + ')';
    drift5.appendChild(span);
    startDeg -= deg;
  }
  pano.appendChild(drift5);
  //浮层6开始
  var drift6 = document.createElement('div');
  var startDeg = 18;
  drift6.className = 'pano';
  for (var i = 0; i < 6; i++) {//第一个漂浮层的图片数
    var span = document.createElement('span');
    span.style.cssText = "height: 444px;margin-top: -222px;";
    css(span, 'translateY', -13);
    css(span, 'rotateY', startDeg);
    css(span, 'translateZ', -R);
    span.style.backgroundImage = 'url(' + imgData.pano[num++] + ')';
    drift6.appendChild(span);
    startDeg -= deg;
  }
  pano.appendChild(drift6);
  setTimeout(function(){
    MTween({
      el: pano,
      target: {rotateX: 0, rotateY: -1415, scale: 100},
      time: 3500,
      type: 'easeOutStrong'
    });
  }, 1500);
}
function setSensors(){
  var pano = document.querySelector('#pano');
  var panobg = document.querySelector('#panobg');
  var isStart = true;
  var start = {};
  var now = {};
  var startEl = {};
  var lastTime = Date.now();
  window.addEventListener('deviceorientation', function(e){
    var nowTime = Date.now();
    if (nowTime - lastTime < 30) {
      return;//13.40
    }
    lastTime = nowTime;
    var x = Math.round( e.beta - 90 );
    var y = Math.round( e.alpha );
    if (isStart) {
      isStart = false;
      start.x = x;
      start.y = y;
      startEl.x = css(pano, 'rotateX');
      startEl.y = css(pano, 'rotateY');
    } else {
      now.x = x;
      now.y = y;
      var dis = {};
      dis.x = now.x - start.x;
      dis.y = now.y - start.y;
      var expectDeg = {};
      expectDeg.x = startEl.x + dis.x;
      expectDeg.y = startEl.y + dis.y;
      MTween({
        el: pano,
        target: {
          rotateX: expectDeg.x,
          rotateY: expectDeg.y
        },
        time: 500,
        type: 'easeOut'
      });
      MTween({
        el: panobg,
        target: {
          rotateX: expectDeg.x,
          rotateY: expectDeg.y
        },
        time: 500,
        type: 'easeOut'
      });
    }
  });
}