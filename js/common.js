/*!
 * CatchFlaw common.js
 * - 공통 팝업(cfPopup) 유틸
 * - 프로토타입용(로그인 가정) 베타/구글 이동 팝업
 */
(function(global, $){
    'use strict';

    // ---- 팝업 템플릿 주입 ----
    function injectPopups(){
        if (document.getElementById('cfGoogleRedirect')) return;
        var tpl = ''
            + '<div class="cf-popup" id="cfGoogleRedirect" role="dialog" aria-modal="true">'
            +   '<div class="cf-dimmed" data-cf-dismiss></div>'
            +   '<div class="cf-box">'
            +     '<div class="cf-title">구글 맵으로 이동할까요?</div>'
            +     '<div class="cf-desc">외부 사이트로 이동합니다.<br>새 탭에서 열립니다.</div>'
            +     '<div class="cf-btns">'
            +       '<button type="button" class="cf-close" data-cf-dismiss>닫기</button>'
            +       '<button type="button" class="cf-go">이동</button>'
            +     '</div>'
            +   '</div>'
            + '</div>'
            + '<div class="cf-popup" id="cfBetaNotice" role="dialog" aria-modal="true">'
            +   '<div class="cf-dimmed" data-cf-dismiss></div>'
            +   '<div class="cf-box">'
            +     '<div class="cf-emoji">🛠️</div>'
            +     '<div class="cf-title">아직 베타 서비스로<br>기능 만들고 있어요!</div>'
            +     '<div class="cf-desc">조금만 기다려 주세요.</div>'
            +     '<div class="cf-btns">'
            +       '<button type="button" class="cf-ok" data-cf-dismiss>확인</button>'
            +     '</div>'
            +   '</div>'
            + '</div>';
        $('body').append(tpl);
    }

    // ---- cfPopup 객체 ----
    var pendingUrl = '';

    function openBeta(){
        injectPopups();
        $('#cfBetaNotice').addClass('is-active');
    }
    function openGoogleRedirect(url, titleText){
        injectPopups();
        pendingUrl = url || '';
        var $p = $('#cfGoogleRedirect');
        if (titleText) $p.find('.cf-title').text(titleText);
        else $p.find('.cf-title').text('구글 맵으로 이동할까요?');
        $p.addClass('is-active');
    }
    function closeAll(){
        $('.cf-popup').removeClass('is-active');
        pendingUrl = '';
    }

    global.cfPopup = {
        beta: openBeta,
        googleRedirect: openGoogleRedirect,
        close: closeAll
    };

    // ---- 호텔명(프로토타입 고정) ----
    // 기획서: 호텔 로즈가든 신주쿠 (후쿠오카 MVP지만 상세 목업은 그대로 사용)
    var HOTEL_NAME = '호텔 로즈가든 신주쿠';

    function googleMapsUrl(){
        return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(HOTEL_NAME);
    }
    function googleHotelsUrl(){
        return 'https://www.google.com/travel/search?q=' + encodeURIComponent(HOTEL_NAME);
    }
    global.cfPopup.googleMapsUrl = googleMapsUrl;
    global.cfPopup.googleHotelsUrl = googleHotelsUrl;

    // ---- DOM ready: 이벤트 위임 바인딩 ----
    $(function(){
        injectPopups();

        // 닫기 / 배경 / ESC
        $(document).on('click', '[data-cf-dismiss]', closeAll);
        $(document).on('keydown', function(e){ if (e.key === 'Escape') closeAll(); });

        // 이동 버튼
        $(document).on('click', '#cfGoogleRedirect .cf-go', function(){
            if (pendingUrl) window.open(pendingUrl, '_blank', 'noopener');
            closeAll();
        });

        // 공통 트리거
        // data-cf-beta: 베타 팝업
        $(document).on('click', '[data-cf-beta]', function(e){
            e.preventDefault();
            openBeta();
        });
        // data-cf-google="maps" | "hotels"
        $(document).on('click', '[data-cf-google]', function(e){
            e.preventDefault();
            var t = $(this).data('cfGoogle');
            if (t === 'hotels') openGoogleRedirect(googleHotelsUrl(), '구글 호텔로 이동할까요?');
            else openGoogleRedirect(googleMapsUrl(), '구글 맵으로 이동할까요?');
        });
    });

})(window, jQuery);
