// ==UserScript==
// @name         摸鱼专用弹幕发送小窗口 BLive Chat Message Sender
// @namespace    https://github.com/Huaaudio/BilibiliLivePopUpDanmuSender
// @version      1.1
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
                    #inputContainer {
                        margin-bottom: 10px;
                    }
                    #inputField {
                        width: 200px;
                        margin-right: 10px;
                    }
                </style>
            </head>
            <body>
                <div id="inputContainer">
                    <input type="text" id="inputField">
                    <button id="sendButton">Send</button>
                </div>
                <div id="chatMessages"></div>
                <script>
                    const inputField = document.getElementById('inputField');
                    const sendButton = document.getElementById('sendButton');
                    const chatMessages = document.getElementById('chatMessages');

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