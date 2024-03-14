// ==UserScript==
// @name         Chat Message Pop-up
// @namespace    https://github.com/Huaaudio/BilibiliLivePopUpDanmuSender
// @version      1.0
// @description  Creates a pop-up window for sending chat messages
// @match        https://live.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let popupWindow = null;

    // Function to create the pop-up window
    function createPopupWindow() {
        popupWindow = window.open('', 'Chat Message Pop-up', 'width=300,height=200');
        popupWindow.document.write(`
            <html>
            <head>
                <title>Chat Message Pop-up</title>
            </head>
            <body>
                <input type="text" id="inputField" style="width: 200px; margin-right: 10px;">
                <button id="sendButton">Send</button>
                <script>
                    const inputField = document.getElementById('inputField');
                    const sendButton = document.getElementById('sendButton');

                    function sendMessage() {
                        const message = inputField.value;
                        if (message.trim() !== '') {
                            window.opener.postMessage(message, '*');
                            inputField.value = '';
                        }
                    }

                    sendButton.onclick = sendMessage;

                    inputField.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter') {
                            sendMessage();
                        }
                    });
                </script>
            </body>
            </html>
        `);
    }

    // Function to handle messages from the pop-up window
    function handleMessage(event) {
        const message = event.data;
        const chatInput = document.querySelector('textarea.chat-input.border-box');
        chatInput.value = message;
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Simulate pressing the Enter key
        const enterKeyEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true
        });
        chatInput.dispatchEvent(enterKeyEvent);
    }

    // Open the pop-up window on a specific key press (e.g., Ctrl + M)
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'b') {
            if (popupWindow === null || popupWindow.closed) {
                createPopupWindow();
            } else {
                popupWindow.focus();
            }
        }
    });

    // Listen for messages from the pop-up window
    window.addEventListener('message', handleMessage, false);
})();