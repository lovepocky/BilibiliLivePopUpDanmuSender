// ==UserScript==
// @name         只看弹幕不发弹幕的小窗口 BLive Chat Message Viewer
// @namespace    https://github.com/Huaaudio/BilibiliLivePopUpDanmuSender
// @version      1.31
// @description  Creates a pop-up window for viewing and sending Bilibili Live chat messages. 这个版本是可选的，因为公司的网不会自动更新弹幕，就把 Laplace Chat 接了进来
// @match        https://live.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let popupWindow = null;

    // Function to create the pop-up window
    function createPopupWindow() {
        const currentURL = window.location.href;
        const tokenId = null; //如果想的话就在这里设置你的拉普拉斯同步密钥 Place your Laplace Chat sync token here
        const roomId = currentURL.match(/live.bilibili.com\/(?:[^\/]+\/)?(\d+)/)?.[1];
        const chatRenderURL = `https://chat.vrp.moe/obs/${roomId}?altDanmakuLayout=false&autoHideEvent=0&baseFontSize=20&colorScheme=light&connectionMode=direct&customAvatarApi=&limitEventAmount=20&limitStickyAmount=10&loginSyncServer=&loginSyncToken=${tokenId}&showAutoDanmaku=false&showAvatar=true&showAvatarFrame=true&showCurrentRank=true&showDanmaku=true&showEnterEvent=false&showEnterEventCurrentGuardOnly=false&showFollowEvent=false&showGift=true&showGiftFree=false&showGiftHighlightAbove=29.99&showGiftPriceAbove=1&showGiftStickyAbove=29.99&showLottery=true&showMedal=false&showMedalLightenedOnly=true&showModBadge=true&showPhoneNotVerified=false&showRedEnvelop=true&showStickyBar=true&showSuperChat=true&showSystemMessage=true&showToast=true&showUserLevelAbove=0&showUserLvl=false&showUsername=true&showWealthMedal=false&useCst=false`;
        popupWindow = window.open('', 'Chat Message Pop-up', 'width=400,height=400');
        popupWindow.document.write(`
            <html>
            <head>
                <title>Chat Message Pop-up</title>
            </head>
            <body>
                <div id="chatContainer">
                <iframe id="chatFrame" src="${chatRenderURL}" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
            </body>
            </html>
        `);
    }

    // Open the pop-up window on a specific key press (e.g., Ctrl + M)
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key.toLowerCase() === 'b') {
            if (popupWindow === null || popupWindow.closed) {
                createPopupWindow();
                removeDivElement();
            } else {
                popupWindow.focus();
                removeDivElement();
            }
        }
    });

    // Function to remove the masking div
    function removeDivElement() {
        const divToRemove = document.querySelector('.web-player-module-area-mask');
        if (divToRemove) {
            divToRemove.remove();
            console.log('Div removed successfully');
        } else {
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', removeDivElement);
    //setInterval(removeDivElement, 5000);
})();
