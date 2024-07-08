// ==UserScript==
// @name         摸鱼专用只看弹幕小窗口 BLive Chat Message Sender
// @namespace    https://github.com/Huaaudio/BilibiliLivePopUpDanmuSender
// @version      1.21
// @description  Creates a pop-up window for viewing and sending Bilibili Live chat messages
// @match        https://live.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let popupWindow = null;

    // Function to create the pop-up window
    function createPopupWindow() {
        popupWindow = window.open('', 'Chat Message Pop-up', 'width=300,height=400');
        popupWindow.document.write(`
            <html>
            <head>
                <title>Chat Message Pop-up</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 10px;
                    }
                </style>
            </head>
            <body>
                <div id="chatMessages"></div>
                <script>
                    const chatMessages = document.getElementById('chatMessages');
                </script>
            </body>
            </html>
        `);
    }

    // Function to read chat messages and update the pop-up window
    function updatePopup() {
        const chatItems = document.querySelectorAll('.chat-item.danmaku-item');

        if (popupWindow && !popupWindow.closed) {
            const popupDocument = popupWindow.document;
            const chatMessagesElement = popupDocument.getElementById('chatMessages');

            // Get the existing chat messages in the pop-up window
            const existingMessages = Array.from(chatMessagesElement.children);

            // Create an array to store the new messages
            const newMessages = [];

            chatItems.forEach(item => {
                const sender = item.getAttribute('data-uname');
                const message = item.getAttribute('data-danmaku');

                const messageElement = popupDocument.createElement('div');
                messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;

                // Check if the message already exists in the pop-up window
                const messageExists = existingMessages.some(existingMessage => {
                    return existingMessage.innerHTML === messageElement.innerHTML;
                });

                // If the message doesn't exist, add it to the newMessages array
                if (!messageExists) {
                    newMessages.push(messageElement);
                }
            });

            // Insert the new messages at the top of the chat messages container
            newMessages.forEach(newMessage => {
                chatMessagesElement.insertBefore(newMessage, chatMessagesElement.firstChild);
            });
        }
    }

    // Create a MutationObserver to watch for changes in the chat messages
    const observer = new MutationObserver(updatePopup);
    observer.observe(document.body, { childList: true, subtree: true });

    // Function to handle messages from the pop-up window
    function handleMessage(event) {
        let message = event.data;

        // Ensure the message is a string
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
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
    setInterval(removeDivElement, 5000);
    // Listen for messages from the pop-up window
    window.addEventListener('message', handleMessage, false);
})();
