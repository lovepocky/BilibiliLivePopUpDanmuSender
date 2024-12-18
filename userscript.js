// ==UserScript==
// @name         摸鱼专用弹幕发送小窗口 BLive Chat Message Sender
// @namespace    https://github.com/Huaaudio/BilibiliLivePopUpDanmuSender
// @version      1.2-add-medal
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
                    display: flex;
                    align-items: center;
                    background-color: rgb(245, 243, 242);
                    border-top-left-radius: calc(var(--1px) * 4);
                    border-top-right-radius: calc(var(--1px) * 10);
                    border-bottom-left-radius: calc(var(--1px) * 4);
                    border-bottom-right-radius: calc(var(--1px) * 10);
                    padding: calc(var(--1px) * 8) calc(var(--1px) * 16);
                    margin-bottom: calc(var(--1px) * 10);
                    }

                    #inputField {
                    flex: 1;
                    border: none;
                    background-color: transparent;
                    font-size: calc(var(--1px) * 16);
                    line-height: calc(var(--1px) * 24);
                    padding: calc(var(--1px) * 8) calc(var(--1px) * 8);
                    color: var(--text);
                    height: calc(var(--1px) * 40); /* Set a fixed height for the input field */
                    }

                    #sendButton {
                        background-color: #23ade5;
                        color: #fff;
                        border-radius: 4px
                        position: relative;
                        box-sizing: border-box;
                        line-height: 1;
                        margin: 0;
                        padding: 6px 12px;
                        border: 0;
                        cursor: pointer;
                        outline: 0;
                        overflow: hidden;
                        display: inline-flex;
                        justify-content: center;
                        align-items: center
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
                const medal = item.getElementsByClassName('wealth-medal')[0]
                const reply = item.getElementsByClassName('reply-uname')[0]
                const replyName = reply?.getElementsByTagName('div')?.[0]
                messageElement.innerHTML = ( medal?.outerHTML || '') + `<strong>${sender}:</strong> ${message}` + ( replyName?  '<span style="color: #FB7299;"> @' + replyName.innerHTML + '</span>' :'');

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
