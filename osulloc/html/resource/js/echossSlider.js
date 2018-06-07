
function echossSlider(element, data) {
    if( document.getElementById('echossSliderCss') == null ) {
        var styleSheet = document.createElement('style');
        styleSheet.innerHTML += '.echoss_slider_container { width: 100%; margin: 0 auto; overflow: hidden; position: relative; z-index: 1; list-style: none; }';
        styleSheet.innerHTML += '.echoss_slider_wrap { width: 100%; height: 100%; font-size: 0; overflow: hidden; position: relative; list-style: none; }';
        styleSheet.innerHTML += '.echoss_slider_list { width: 100%; height: 100%; float: left; position: relative; vertical-align: middle; text-align: center; list-style: none; }';
        styleSheet.innerHTML += '.echoss_slider_bullets { width: 100%; margin: 0 auto; text-align: center; position: absolute; bottom: 20px; left: 0 }';
        styleSheet.innerHTML += '.echoss_slider_bullets > li { display: inline-block; width: 8px; height: 8px; margin: 0 5px; text-indent: -99999px; background-color: rgba(255, 255, 255, 0.3); border-radius: 50%; cursor: pointer; }';
        styleSheet.innerHTML += '.echoss_slider_bullets > li.echoss_bullet_active { background-color: rgba(255, 255, 255, 1); }';
        styleSheet.innerHTML += '.echoss_slider_bullets:after { content: ""; display: block; clear: both; }';
        styleSheet.innerHTML += '.echoss_slider_prevbtn, .echoss_slider_nextbtn {width: 55px; height: 38px; cursor: pointer; background-size: contain; background-repeat: no-repeat; background-position: center center; position: absolute; top: 50%; margin-top: -19px; z-index: 100; }';
        styleSheet.innerHTML += '.echoss_slider_prevbtn { background-image: url(resource/images/icon_arrow_prev.png); left: 10px }';
        styleSheet.innerHTML += '.echoss_slider_nextbtn { background-image: url(resource/images/icon_arrow_next.png); right: 10px; }';
        styleSheet.id = 'echossSliderCss';
        document.head.appendChild(styleSheet);
    }
    var slider = this;
    var width;
    var sliderstartPosition = 0;        // 전체크기에서 잡히는 터치 스타트 포인트 (총 페이지 width안에서 계산됨)
    var touchstartPosition  = 0;        // touch start 좌표
    var slideIndex          = 0;        // echoss_slider_list 의 index
    var moveDist            = 0;        // touch move - touch start 값 ( 페이지가 움직이는 좌표 )
    var slidermovePosition  = 0;        // 슬라이드 전체 사이즈 기준의 터치 이동 시, 터치 좌표
    var touchmovePosition   = 0;        // touch move 좌표
    var isInfinite = false;
    var isDestroy = false;
    var isBullets = false;
    var isArrows = false;
    var isSlideMove = true;
    var isSlideFinish = true;
    var isSpeed = 300;
    var myEchossSlider = {
        EVENT_TYPE: {
            MOUSE: 1,
            TOUCH: 2,
        }
    };
    var isAutoPlay = false;
    var isDelay = 2500;

    if( element == undefined )
        return;

    if( element.substr(0,1) == '.' ) {
        this.element = document.getElementsByClassName(element.substr(1))[0];
    }
    else if( element.substr(0,1) == '#' ) {
        this.element = document.getElementById(element.substr(1));
    }
    else {
        return;
    }

    this.element.classList.add('echoss_slider_container');
    for(var i=0; i<this.element.childNodes.length; i++) {
        var wrapElement = this.element.childNodes.item(i);
        if( wrapElement.nodeType == 1 ) {
            wrapElement.classList.add('echoss_slider_wrap');
        }
    }
    for(var i=0; i<this.element.getElementsByClassName('echoss_slider_wrap')[0].childNodes.length; i++) {
        var listElement = this.element.getElementsByClassName('echoss_slider_wrap')[0].childNodes.item(i);
        if( listElement.nodeType == 1 ) {
            listElement.classList.add('echoss_slider_list');
        }
    }

    this.echossSliderWrap = this.element.getElementsByClassName('echoss_slider_wrap')[0];
    this.echossSliderList = this.element.getElementsByClassName('echoss_slider_list');
    this.echossSliderBullets = this.element.getElementsByClassName('bullet');
    this.arrows = false;
    this.bullets = false;
    this.infinite = false;
    this.destroy = true;
    this.autoplay = false;

    if( data != undefined ) {
        if( data.arrows != undefined ) {
            this.arrows = data.arrows;
            if( data.arrows ) {
                isArrows = data.arrows;
                darwArrows();
            }
        }
        if( data.infinite != undefined ) {
            this.infinite = data.infinite;
            if( data.infinite ) {
                isInfinite = data.infinite;

                var newFirstList = this.echossSliderList[this.echossSliderList.length-1].cloneNode(true);
                var newLastList = this.echossSliderList[0].cloneNode(true);

                this.echossSliderWrap.insertBefore(newFirstList, this.echossSliderWrap.firstChild);
                this.echossSliderWrap.appendChild(newLastList);
            }
        }
        if( data.bullets != undefined ) {
            this.bullets = data.bullets;
            if( data.bullets ) {
                isBullets = data.bullets;
                drawBullets();
                slider.echossSliderBullets[0].classList.add('echoss_bullet_active');
            }
        }
        if( data.speed != undefined ) {
            this.speed = data.speed;
            if( data.speed ) {
                isSpeed = data.speed;
            }
        }
        if( data.delay != undefined ) {
            this.delay = data.delay;
            if( data.delay ) {
              isDelay = data.delay;
            }
        }
        if( data.autoplay != undefined ) {
            this.autoplay = data.autoplay;
            if( data.autoplay ) {
                isAutoPlay = data.autoplay;
                var autoPlayEvent = setInterval(autoPlayFunction, isDelay);
            }
        }
    }

    if(isInfinite)
        this.echossSliderList[1].classList.add('echoss_slider_active');
    else
        this.echossSliderList[0].classList.add('echoss_slider_active');

    function sliderContainerWidth() {
        var totalWidth = 0;
        width = slider.element.clientWidth;

        for(var i=0; i<slider.echossSliderList.length; i++) {
            totalWidth += width;
            slider.echossSliderList[i].style.width = width + 'px';
        }
        slider.echossSliderWrap.style.width = totalWidth + 'px';
    }

    sliderContainerWidth();
    echossSliderUserEvent();

    /****************************************************
     down event function
    ****************************************************/
    function echossSliderDown(type, event) {
        moveDist = 0;
        if( type === myEchossSlider.EVENT_TYPE.TOUCH )
            event = event.changedTouches[0];

        touchstartPosition = event.clientX;
        sliderstartPosition = touchstartPosition + (width * slideIndex);

        slider.echossSliderWrap.style.webkitTransitionDuration = '0ms';
        slider.echossSliderWrap.style.mozTransitionDuration = '0ms';
        slider.echossSliderWrap.style.msTransitionDuration = '0ms';
        slider.echossSliderWrap.style.TransitionDuration = '0ms';

        isSlideFinish = true;
    }

    /****************************************************
     move event function
    ****************************************************/
    function echossSliderMove(type, event) {
        if( type === myEchossSlider.EVENT_TYPE.TOUCH )
            event = event.changedTouches[0];

        touchmovePosition = event.clientX;
        slidermovePosition = touchmovePosition - sliderstartPosition;
        fn_moveDist(slidermovePosition);
    }

    /****************************************************
     up event function
    ****************************************************/

    function echossSliderUp(type, event) {
        if( type === myEchossSlider.EVENT_TYPE.TOUCH )
            event = event.changedTouches[0];

        moveDist = event.clientX - touchstartPosition;
        // 왼쪽으로 (next)
        if( moveDist < -width/3 ) {
            duration();
            echossSliderMoveDist(1, slider.echossSliderList.length-1);
        }
        // 오른쪽으로 (prev)
        else if( moveDist > width/3) {
            duration();
            echossSliderMoveDist(-1, 0);
        }

        else if( moveDist != 0 &&(moveDist > -width/3 || moveDist < width/3) ){
            duration();
            fn_moveDist(-width*slideIndex);
            isSlideFinish = false;
        }
    }

    function echossSliderMoveDist(move, listCheck){
        var slideMoveTemp = Math.floor(Math.abs(moveDist)/width);
        //next
        if( move == 1 ) {

            if(slideMoveTemp > 0 && moveDist < (-width/3) + (-width * slideMoveTemp))
                slideIndex += slideMoveTemp;
            else if(slideMoveTemp > 0)
                slideIndex += slideMoveTemp-1

            if(slideIndex < listCheck)
                slideIndex += move;
            else if(slideIndex > listCheck)
                slideIndex = listCheck;
        }
        //prev
        else if( move == -1 ) {
            if(slideMoveTemp > 0 && moveDist > (width/3) + (width * slideMoveTemp))
                slideIndex -= slideMoveTemp;

            if(slideIndex > listCheck)
                slideIndex += move;
            else if( slideIndex < listCheck )
                slideIndex = listCheck;
        }

        fn_moveDist(-width*slideIndex);
        if( isInfinite && slideIndex == 0 )
            slideIndex = slider.echossSliderList.length-2;

        else if( isInfinite && slideIndex == slider.echossSliderList.length-1 )
            slideIndex = 1;

        for(var i=0; i<slider.echossSliderList.length; i++) {

             slider.echossSliderList[i].classList.remove('echoss_slider_active');

            if( i == slideIndex ) {
                slider.echossSliderList[i].classList.add('echoss_slider_active');
             }
        }

        sliderChangeStart();
        bulletsFunction();
    }
    function echossSliderMouseMoveFunction(event) {
        echossSliderMove(myEchossSlider.EVENT_TYPE.MOUSE, event);
    }
    function echossSliderMouseUpFunction(event) {
        window.removeEventListener('mousemove', echossSliderMouseMoveFunction);
        window.removeEventListener('mouseup', echossSliderMouseUpFunction);
        echossSliderUp(myEchossSlider.EVENT_TYPE.MOUSE, event);
    }

    function echossSliderTouchMoveFunction(event) {
        echossSliderMove(myEchossSlider.EVENT_TYPE.TOUCH, event);
    }
    function echossSliderTouchEndFunction(event) {
        window.removeEventListener('touchmove', echossSliderTouchMoveFunction);
        window.removeEventListener('touchend', echossSliderTouchEndFunction);
        echossSliderUp(myEchossSlider.EVENT_TYPE.TOUCH, event);
    }

    /****************************************************
     PC / Mbile
     ****************************************************/
     function touchEventFunction(){
        event.preventDefault();
        echossSliderDown(myEchossSlider.EVENT_TYPE.TOUCH, event);
        window.addEventListener('touchmove', echossSliderTouchMoveFunction);
        window.addEventListener('touchend', echossSliderTouchEndFunction);
     }

    function mouseEventFunction(){
        echossSliderDown(myEchossSlider.EVENT_TYPE.MOUSE, event);
        window.addEventListener('mousemove', echossSliderMouseMoveFunction);
        window.addEventListener('mouseup', echossSliderMouseUpFunction);
     }

    function echossSliderUserEvent() {
        if( navigator.userAgent.indexOf('Android') < 0 && navigator.userAgent.indexOf('iPhone') < 0 ) {
            // mouse
            slider.echossSliderWrap.addEventListener('mousedown', mouseEventFunction);
        }
        else {
            // touchstart
            slider.echossSliderWrap.addEventListener('touchstart', touchEventFunction);
        }
    }

    function darwArrows() {
        var echoss_slider_prevbtn = document.createElement('span');
        var echoss_slider_nextbtn = document.createElement('span');
        echoss_slider_prevbtn.className = 'echoss_slider_prevbtn';
        echoss_slider_nextbtn.className = 'echoss_slider_nextbtn';
        slider.element.appendChild(echoss_slider_prevbtn);
        slider.element.appendChild(echoss_slider_nextbtn);

        echoss_slider_prevbtn.onclick = function(){
            if( isSlideMove == true ){
                echossSliderMoveDist(-1, 0);
                duration();
            }
            isSlideMove = false;
            isSlideFinish = true;
        }

        echoss_slider_nextbtn.onclick = function(){
            if( isSlideMove == true ){
                echossSliderMoveDist(1, slider.echossSliderList.length-1);
                duration();
            }
            isSlideMove = false;
            isSlideFinish = true;
        }
    }

    /****************************************************
     bullets 생성함수
    ****************************************************/

    function drawBullets() {
        var bulletsLength = slider.echossSliderList.length;
        var echoss_slider_bullets = document.createElement('ul');

        echoss_slider_bullets.className = 'echoss_slider_bullets';
        if(isInfinite){
            bulletsLength = slider.echossSliderList.length-2
        }
        var html = '';
        for(var i=0; i<bulletsLength; i++) {
            if(isInfinite){
                html += '<li class="bullet" data-bullet-index='+Number(i+1)+'></li>';
            }
            else if(!isInfinite){
                html += '<li class="bullet" data-bullet-index='+i+'></li>';
            }
        }
        echoss_slider_bullets.innerHTML = html;
        slider.element.appendChild(echoss_slider_bullets);

        [].forEach.call(echoss_slider_bullets.querySelectorAll('.bullet'),function(bullets){
            bullets.addEventListener('click',clickBullets,false);
        });

        function clickBullets(){
            var bulletIndex = 0;
            bulletIndex = Number(this.getAttribute('data-bullet-index'));
            slideIndex = bulletIndex;
            fn_moveDist(-width*slideIndex);
            duration();
            bulletsFunction();
            sliderChangeStart();
            isSlideFinish = true;
        }
    }

    function bulletsFunction() {
        if( isInfinite ) {
            for(var i=0; i<slider.echossSliderBullets.length; i++){
                if( i != slideIndex-1 ){
                    slider.echossSliderBullets[i].classList.remove('echoss_bullet_active')
                }else if ( i == slideIndex-1){
                    slider.echossSliderBullets[slideIndex-1].classList.add('echoss_bullet_active')
                }
            }
        }
        else if( !isInfinite ) {
            for(var i=0; i<slider.echossSliderBullets.length; i++) {
                slider.echossSliderBullets[i].classList.add('echoss_bullet_active');
                if( i != slideIndex ) {
                    slider.echossSliderBullets[i].classList.remove('echoss_bullet_active');
                }
            }
        }
    }

    // function autoPlaySet() {
    //     setInterval(autoPlayFunction, isDelay);
    // }

    function autoPlayFunction() {
        if( isSlideMove ) {
            if( !isInfinite ) {
                slideIndex++;
                if( slideIndex == slider.echossSliderList.length ) {
                    slideIndex = 0;
                }
                fn_moveDist(-width*slideIndex);   
            }
            else if( isInfinite ) {
                echossSliderMoveDist(1, slider.echossSliderList.length-1);
            }
            duration();
            bulletsFunction();
        }
        isSlideMove = false;
        isSlideFinish = true;
    }

    function fn_moveDist(dist) {
        slider.echossSliderWrap.style.webkitTransform = 'translate3d(' + dist + 'px' + ',0,0)';
        slider.echossSliderWrap.style.mozTransform = 'translate3d(' + dist + 'px' + ',0,0)';
        slider.echossSliderWrap.style.msTransform = 'translate3d(' + dist + 'px' + ',0,0)';
        slider.echossSliderWrap.style.transform = 'translate3d(' + dist + 'px' + ',0,0)';
    }

    function duration() {
        slider.echossSliderWrap.style.webkitTransitionDuration = isSpeed + 'ms';
        slider.echossSliderWrap.style.mozTransitionDuration = isSpeed + 'ms';
        slider.echossSliderWrap.style.msTransitionDuration = isSpeed + 'ms';
        slider.echossSliderWrap.style.TransitionDuration = isSpeed + 'ms';
    }

    var names = [
        "webkitTransitionEnd", 
        "oTransitionEnd", 
        "otransitionend", 
        "transitionend", 
        "transitionEnd" ];

    function transitionEvent(element, callback) {
        for (var i=0; i <names.length; i++) {
            element.addEventListener(names[i], callback, false);
        }
    }

    transitionEvent(this.echossSliderWrap, transitionEndEvent);

    function transitionEndEvent() {
        if( isSlideFinish ){
            setTimeout(function() {
                isSlideMove = true;
                if( isInfinite && slideIndex == 1 )
                    fn_moveDist(-width*slideIndex);
                else if( isInfinite && slideIndex == slider.echossSliderList.length-2 )
                    fn_moveDist(-width*slideIndex);
            }, 100)

            sliderChangeFinish();
        }
        slider.echossSliderWrap.style.webkitTransitionDuration = '0ms';
        slider.echossSliderWrap.style.mozTransitionDuration = '0ms';
        slider.echossSliderWrap.style.msTransitionDuration = '0ms';
        slider.echossSliderWrap.style.TransitionDuration = '0ms';
    }

    window.addEventListener("resize", function(){
        if( !isDestroy ){
        sliderContainerWidth();
        fn_moveDist(-width*slideIndex);
        echossSliderUserEvent();
        }
    });
    window.addEventListener("load", function(){
        if(isInfinite){
            slideIndex=1;
            fn_moveDist(-width*slideIndex);
        }
    }());

    var sliderChangeStart = function() {
        //
    }

    var sliderChangeFinish = function() {
        //
    }

    this.on = function(eventName, eventFunction) {
        if( eventName == "sliderChangeStart" ) {
            sliderChangeStart = eventFunction;
        }
        else if( eventName == "sliderChangeFinish" ) {
            sliderChangeFinish = eventFunction;
        }
    };

    this.destroy = function() {
        isDestroy =true;
        fn_moveDist(0);
        slider.echossSliderWrap.removeAttribute('style');
        slider.echossSliderWrap.removeEventListener('touchstart', touchEventFunction);
        slider.echossSliderWrap.removeEventListener('mousedown', mouseEventFunction);

        if( isInfinite ) {
            slider.echossSliderWrap.removeChild(slider.echossSliderWrap.firstChild);
            slider.echossSliderWrap.removeChild(slider.echossSliderWrap.lastChild);
        }
        if( isArrows ) {
            slider.element.getElementsByClassName('echoss_slider_prevbtn')[0].remove();
            slider.element.getElementsByClassName('echoss_slider_nextbtn')[0].remove();
        }
        if( isBullets ) {
            slider.element.getElementsByClassName('echoss_slider_bullets')[0].remove();
        }
        if( isAutoPlay ) {
            clearInterval(autoPlayEvent);
        }

        for(var i=0; i<this.element.getElementsByClassName('echoss_slider_wrap')[0].childNodes.length; i++) {
            var listElement = this.element.getElementsByClassName('echoss_slider_wrap')[0].childNodes.item(i);
            if( listElement.nodeType == 1 ) {
                listElement.style.removeProperty("width");
                listElement.classList.remove('echoss_slider_list');
                listElement.classList.remove('echoss_slider_active');
            }
        }

        for(var i=0; i<this.element.childNodes.length; i++) {
            var wrapElement = this.element.childNodes.item(i);
            if( wrapElement.nodeType == 1 ) {
                wrapElement.style.removeProperty('width');
                wrapElement.classList.remove('echoss_slider_wrap');
            }
        }
        this.element.classList.remove('echoss_slider_container');

        if( document.getElementsByClassName('echoss_slider_container').length == 0 ) {
            document.getElementById('echossSliderCss').remove();
        }
    }
    /* Element Remove ProtoType */
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for(var i = this.length - 1; i >= 0; i--) {
            if(this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }
}
