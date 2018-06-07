// 메인 헤더
if( document.getElementById('mainHeader') != undefined ) {
    mainHeader = '';
    mainHeader += '     <div class="main_header_inner">';
    mainHeader += '         <nav>';
    mainHeader += '             <ul class="nav_01">';
    mainHeader += '                 <li class="main_nav"><a href="#none">About Osulloc</a>';
    mainHeader += '                     <ul class="sub_nav">';
    mainHeader += '                         <li><a href="brand_story.html">Brand Story</a></li>';
    mainHeader += '                         <li><a href="#none">Since 1979</a></li>';
    mainHeader += '                     </ul>';
    mainHeader += '                 </li>';
    mainHeader += '                 <li class="main_nav"><a href="#none">Tea Guide</a>';
    mainHeader += '                     <ul class="sub_nav">';
    mainHeader += '                         <li><a href="#none">시즌추천</a></li>';
    mainHeader += '                         <li><a href="#none">매거진</a></li>';
    mainHeader += '                         <li><a href="#none">차정보</a></li>';
    mainHeader += '                     </ul>';
    mainHeader += '                 </li>';
    mainHeader += '             </ul>';
    mainHeader += '             <h1 class="logo"><img src="resource/images/logo.png" alt="오설록" /></h1>';
    mainHeader += '             <ul class="nav_02">';
    mainHeader += '                 <li class="main_nav"><a href="#none">Tea Life</a>';
    mainHeader += '                     <ul class="sub_nav">';
    mainHeader += '                         <li><a href="#none">이벤트</a></li>';
    mainHeader += '                         <li><a href="#none">SNS</a></li>';
    mainHeader += '                         <li><a href="#none">커뮤니티</a></li>';
    mainHeader += '                     </ul>';
    mainHeader += '                 </li>';
    mainHeader += '                 <li class="main_nav"><a href="#none">Jeju Museum</a>';
    mainHeader += '                     <ul class="sub_nav">';
    mainHeader += '                         <li><a href="#none">티뮤지엄 소개</a></li>';
    mainHeader += '                         <li><a href="#none">티스톤예약</a></li>';
    mainHeader += '                         <li><a href="#none">햇차 페스티벌</a></li>';
    mainHeader += '                     </ul>';
    mainHeader += '                 </li>';
    mainHeader += '             </ul>';
    mainHeader += '             <ul class="sns_list_wrap">';
    mainHeader += '                 <li><a href="#none"><img src="resource/images/icon_fb.png" alt="페이스북 바로가기"></a></li>';
    mainHeader += '                 <li><a href="#none"><img src="resource/images/icon_insta.png" alt="인스타그램 바로가기"></a></li>';
    mainHeader += '             </ul>';
    mainHeader += '         </nav>';
    mainHeader += '     </div>';

    document.getElementById('mainHeader').innerHTML = mainHeader;
}

if( document.getElementById('scrollHeader') != undefined ) {
    scrollHeader = '';

    scrollHeader += '   <div class="scroll_header_inner">';
    scrollHeader += '       <h2 class="logo"><img src="resource/images/logo.png" alt="오설록" /></h2>';
    scrollHeader += '       <ul class="scroll_header_nav">';
    scrollHeader += '           <li class="scroll_nav"><a href="#none">About Osulloc</a>';
    scrollHeader += '               <ul class="sub_nav">';
    scrollHeader += '                   <li><a href="brand_story.html">Brand Story</a></li>';
    scrollHeader += '                   <li><a href="#none">Since 1979</a></li>';
    scrollHeader += '               </ul>';
    scrollHeader += '           </li>';
    scrollHeader += '           <li class="scroll_nav"><a href="#none">Tea Guide</a>';
    scrollHeader += '               <ul class="sub_nav">';
    scrollHeader += '                   <li><a href="#none">시즌추천</a></li>';
    scrollHeader += '                   <li><a href="#none">매거진</a></li>';
    scrollHeader += '                   <li><a href="#none">차정보</a></li>';
    scrollHeader += '               </ul>';
    scrollHeader += '           </li>';
    scrollHeader += '           <li class="scroll_nav"><a href="#none">Tea Life</a>';
    scrollHeader += '               <ul class="sub_nav">';
    scrollHeader += '                   <li><a href="#none">이벤트</a></li>';
    scrollHeader += '                   <li><a href="#none">SNS</a></li>'
    scrollHeader += '                   <li><a href="#none">커뮤니티</a></li>';
    scrollHeader += '               </ul>';
    scrollHeader += '           </li>';
    scrollHeader += '           <li class="scroll_nav"><a href="#none">Jeju Museum</a>';
    scrollHeader += '               <ul class="sub_nav">';
    scrollHeader += '                   <li><a href="#none">티뮤지엄 소개</a></li>';
    scrollHeader += '                   <li><a href="#none">티스톤예약</a></li>';
    scrollHeader += '                   <li><a href="#none">햇차 페스티벌</a></li>';
    scrollHeader += '               </ul>';
    scrollHeader += '           </li>';
    scrollHeader += '       </ul>';
    scrollHeader += '       <ul class="sns_list_wrap">';
    scrollHeader += '           <li><a href="#none"><img src="resource/images/icon_fb.png" alt="페이스북 바로가기"></a></li>';
    scrollHeader += '           <li><a href="#none"><img src="resource/images/icon_insta.png" alt="인스타그램 바로가기"></a></li>';
    scrollHeader += '       </ul>';
    scrollHeader += '   </div>';

    document.getElementById('scrollHeader').innerHTML = scrollHeader;
}