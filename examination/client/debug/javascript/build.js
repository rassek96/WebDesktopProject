(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function About(container) {
    var aboutTemplate = document.querySelector("#aboutTemplate");
    var aboutDiv = document.importNode(aboutTemplate.content.firstElementChild, true);
    container.appendChild(aboutDiv);
}

module.exports = About;

},{}],2:[function(require,module,exports){
var Memory = require("./memory");
var Chat = require("./chat");
var Calc = require("./calc");
var About = require("./about");
require("./dragAndDrop");

var desktop = document.querySelector("#desktop");
var memoryApp = document.querySelector("#memory");
var chatApp = document.querySelector("#chat");
var calcApp = document.querySelector("#calc");
var aboutApp = document.querySelector("#about");
var windowTemplate = document.querySelectorAll("#windowTemplate")[0].content.firstElementChild;
var logoTemplate = document.querySelector("#logoTemplate").content.firstElementChild;

function openApp() {
    var windowDiv = document.importNode(windowTemplate, true);
    desktop.appendChild(windowDiv);
    var allWindows = document.querySelectorAll(".window");
    var latestWindow = allWindows[allWindows.length - 1];
    latestWindow.querySelector(".timer").textContent = "";

    var windowClose = latestWindow.querySelector(".windowClose");
    windowClose.addEventListener("click", function() {
        desktop.removeChild(windowDiv);
    });

    return latestWindow;
}

memoryApp.addEventListener("click", function() {
    var latestWindow = openApp();
    var logoDiv = document.importNode(logoTemplate, true);
    latestWindow.querySelector(".windowTaskbar").appendChild(document.createTextNode("Memory"));
    new Memory(4, 4, "contentDiv", latestWindow);
    latestWindow.querySelector(".logoDiv").appendChild(logoDiv.querySelector(".memoryLogo"));
});

chatApp.addEventListener("click", function() {
    var latestWindow = openApp();
    var logoDiv = document.importNode(logoTemplate, true);
    new Chat(latestWindow.querySelector(".contentDiv"));
    latestWindow.querySelector(".logoDiv").appendChild(logoDiv.querySelector(".chatLogo"));
    latestWindow.querySelector(".windowTaskbar").appendChild(document.createTextNode("Chat"));
});

calcApp.addEventListener("click", function() {
    var latestWindow = openApp();
    var logoDiv = document.importNode(logoTemplate, true);
    new Calc(latestWindow.querySelector(".contentDiv"));
    latestWindow.querySelector(".logoDiv").appendChild(logoDiv.querySelector(".calcLogo"));
    latestWindow.querySelector(".windowTaskbar").appendChild(document.createTextNode("Calculator"));
});

aboutApp.addEventListener("click", function() {
    var latestWindow = openApp();
    var logoDiv = document.importNode(logoTemplate, true);
    new About(latestWindow.querySelector(".contentDiv"));
    latestWindow.querySelector(".logoDiv").appendChild(logoDiv.querySelector(".aboutLogo"));
    latestWindow.querySelector(".windowTaskbar").appendChild(document.createTextNode("About"));
});

},{"./about":1,"./calc":3,"./chat":4,"./dragAndDrop":5,"./memory":6}],3:[function(require,module,exports){
function Calc(container) {
    var calcDiv = document.importNode(document.querySelector("#calcTemplate").content.firstElementChild, true);
    container.appendChild(calcDiv);
    var resultBox = container.querySelector(".result");
    var resultBoxValue = "";
    var number1 = "";

    // Lyssnar efter ett knapptryck
    container.querySelector(".calcButtonsNumbers").addEventListener("click", function(event) {
        var buttonClicked = event.target;
        var buttonValue = buttonClicked.getAttribute("value");
        resultBoxValue = resultBox.getAttribute("value");

        if (buttonValue === "Clear") {
            number1 = "";
            resultBox.setAttribute("value", number1);
        }
        else if (buttonValue === "Ans") {
            number1 += container.querySelector(".calcAns").getAttribute("name");
            resultBox.setAttribute("value", number1);
        }
        else if (buttonValue === "=") {
            container.querySelector(".calcProblem").textContent = number1 + " =";
            number1 = eval(number1);
            container.querySelector(".calcAns").setAttribute("name", number1);
            resultBox.setAttribute("value", number1);
            number1 = "";
        }
        else {
            number1 += buttonValue;
            resultBox.setAttribute("value", number1);
        }
    });
}

module.exports = Calc;

},{}],4:[function(require,module,exports){
function Chat(container) {
    this.socket = null;
    this.container = container.parentNode.querySelector(".windowClose");
    var template = document.querySelector("#chatTemplate");

    this.chatDiv = document.importNode(template.content.firstElementChild, true);

    this.chatDiv.addEventListener("keypress", function(event) {
        //LIsten for enter key
        if (event.keyCode === 13) {
            this.sendMessage(event.target.value);
            event.target.value = "";
            event.preventDefault();
        }
    }.bind(this));

    // Code for showing and changing username
    var changeUserDiv = document.importNode(template.content.lastElementChild, true);
    var usernameArea = this.chatDiv.querySelector(".usernameArea");
    var pUsername = document.createTextNode("Signed in as " + localStorage.getItem("username"));
    var userTempDiv = document.createElement("div");
    userTempDiv.appendChild(pUsername);

    var changeUserShow = function() {
        usernameArea.textContent = "";
        usernameArea.appendChild(changeUserDiv);
        userTempDiv.removeEventListener("click", changeUserShow);
        usernameArea.querySelector(".changeUserNext").addEventListener("click", changeUser);
    };

    var changeUser = function() {
        usernameArea.querySelector(".changeUserNext").removeEventListener("click", changeUser);
        localStorage.setItem("username", usernameArea.querySelector(".changeUserText").value);
        changeUserReset();
    };

    var changeUserReset = function() {
        usernameArea.textContent = "";
        userTempDiv.textContent = "Signed in as " + localStorage.getItem("username");
        usernameArea.appendChild(userTempDiv);
        userTempDiv.addEventListener("click", changeUserShow);
    };

    // Om username finns visas det annars måste ett username skrivas in
    if (localStorage.getItem("username")) {
        container.appendChild(this.chatDiv);
        changeUserReset();
    }
    else {
        var inputTemplate = document.querySelector("#usernameTemplate");
        var inputTemplateContent = document.importNode(inputTemplate.content.firstElementChild, true);
        var inputUsername = inputTemplateContent.querySelector(".userNameInput");
        var submitUsername = inputTemplateContent.querySelector(".userNameSubmit");
        var div = document.createElement("div");
        div.setAttribute("class", "centeredDiv");
        div.textContent = "Please enter a username";
        div.appendChild(document.createElement("br"));
        div.appendChild(inputUsername);
        div.appendChild(submitUsername);
        container.appendChild(div);
        submitUsername.addEventListener("click", function() {
            localStorage.setItem("username", inputUsername.value);
            div.style.display = "none";
            container.appendChild(this.chatDiv);
            changeUserReset();
        }.bind(this));
    }

    this.connect();

    return this;
}

Chat.prototype.connect = function() {
    return new Promise(function(resolve, reject) {
        if (this.socket && this.socket.readyState === 1) {
            resolve(this.socket);
            return;
        }

        this.socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");

        this.socket.addEventListener("open", function() {
            resolve(this.socket);
        }.bind(this));

        this.socket.addEventListener("error", function() {
            reject(new Error("Could not connect"));
        }.bind(this));

        this.socket.addEventListener("message", function(event) {
            var message = JSON.parse(event.data);
            if (message.type === "message") {
                this.printMessage(message);
            }
        }.bind(this));
        this.container.addEventListener("click", function() {
            this.socket.close();
        }.bind(this));
    }.bind(this));
};

Chat.prototype.sendMessage = function(text) {
    var data = {
        type: "message",
        data: text,
        username: localStorage.getItem("username"),
        channel: "",
        key: "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
    };

    this.socket.send(JSON.stringify(data));
};

Chat.prototype.printMessage = function(message) {
    var template = this.chatDiv.querySelectorAll("template")[0];
    var messageDiv = document.importNode(template.content.firstElementChild, true);
    var messagesDiv = this.chatDiv.querySelectorAll(".messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    var timeNow = new Date();
    var hours   = timeNow.getHours();
    var minutes = timeNow.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }

    var username = message.username;
    if (username === "") {
        username = "Anon";
    }

    messageDiv.querySelectorAll(".text")[0].textContent = hours + ":"  + minutes + " - " + username + ": " + message.data;

    messagesDiv[0].appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

module.exports = Chat;

},{}],5:[function(require,module,exports){
var startX = 0;
var startY = 0;
var offsetX = 0;
var offsetY = 0;
var dragElement;
var target;

function dragDrop() {
    var zIndex = 2;
    document.onmousedown = onMouseDown;
    document.onmouseup = onMouseUp;

    function onMouseDown(e) {
        target = e.target;

        // Kolla så att det var vänster musknapp som trycktes och att det är en drag-class
        if ((target.className === "windowTaskbar") && (e.button === 0)) {
            //Ta fram muspositionen
            startX = e.clientX;
            startY = e.clientY;
            dragElement = target.parentNode;

            //Ta fram elementets position.
            if (isNaN(parseFloat(dragElement.style.left))) {
                offsetX = 10;
            }
            else {
                offsetX = parseFloat(dragElement.style.left);
            }

            if (isNaN(parseFloat(dragElement.style.top))) {
                offsetY = 10;
            }
            else {
                offsetY = parseFloat(dragElement.style.top);
            }

            zIndex += 1;
            dragElement.style.zIndex = zIndex;
            document.onmousemove = onMouseMove;
            document.body.focus();
            return false;
        }
        else if ((target.className === "window") && (e.button === 0)) {
            // Fönstret får fokus om man trycker på den
            zIndex += 1;
            target.style.zIndex = zIndex;
        }
    }

    function onMouseMove(e) {
        dragElement.style.left = offsetX + e.clientX - startX;
        dragElement.style.top = offsetY + e.clientY - startY;
    }

    function onMouseUp() {
        if (dragElement) {
            // Flytta tillbaka window när den går utanför skärmen
            if (parseFloat(dragElement.style.top) < 0) {
                dragElement.style.top = 0;
            }

            if (parseFloat(dragElement.style.left) < 0) {
                dragElement.style.left = 0;
            }

            if (parseFloat(dragElement.style.left) + 500 > screen.width) {
                dragElement.style.left = screen.width - 502;
            }

            if (parseFloat(dragElement.style.top) + 550 > screen.height + 380) {
                dragElement.style.top = screen.height - 186;
            }

            //Nollställa när musknappen släpps
            if (dragElement !== null) {
                document.onmousemove = null;
                dragElement = null;
            }
        }
    }
}

module.exports.drag = dragDrop();

},{}],6:[function(require,module,exports){
module.exports = function(rows, cols, container, currentWindow) {
    var a;
    var tiles = [];
    var turn1;
    var turn2;
    var lastTile;
    var pairs = 0;
    var tries = 0;

    container = currentWindow.querySelector(".contentDiv");
    var buttonTemplate = document.querySelector("#timeButtons");
    var buttonDiv = document.importNode(buttonTemplate.content.firstElementChild, true);
    var buttonNoTime = buttonDiv.querySelector(".buttonNoTime");
    var buttonTime = buttonDiv.querySelector(".buttonTime");
    container.appendChild(buttonDiv);

    // Användaren väljer mellan att ha tid eller inte
    buttonNoTime.addEventListener("click", startMemory);
    buttonTime.addEventListener("click", function() {
        startMemory();
        countDown();
    });

    function startMemory() {
        buttonDiv.style.display = "none";
        tiles = getPictureArray(rows, cols);

        container = currentWindow.querySelector(".contentDiv");
        var template = document.querySelectorAll("#memoryContainer template")[0].content.firstElementChild;
        container.querySelector(".timer").textContent = "Good luck!";

        // Bilderna ritas ut och spelet startas
        tiles.forEach(function(tile, index) {

            a = document.importNode(template, true);
            container.appendChild(a);

            a.addEventListener("click", function(event) {

                var img = event.target.nodeName === "IMG" ? event.target : event.target.firstElementChild;
                turnBrick(tile, index, img);
            });

            if ((index + 1) % cols === 0) {
                container.appendChild(document.createElement("br"));
            }
        });
    }

    function turnBrick(tile, index, img) {

        if (turn2) {
            return;
        }

        img.src = "image/memory/" + tile + ".png";

        if (!turn1) {
            // Första brickan trycks
            turn1 = img;
            lastTile = tile;
            return;
        } else {
            // Andra brickan trycks
            turn2 = img;
            if (img === turn1) {
                return;
            }

            tries += 1;

            if (tile === lastTile) {
                // Om ett par hittas
                pairs += 1;
                if (pairs === (cols * rows) / 2) {
                    // Om alla brickor är vända vinner man
                    var div = document.createElement("div");
                    div.appendChild(document.createTextNode("Congratulations! You won, after " + tries + " tries"));
                    div.setAttribute("class", "centeredDiv");
                    currentWindow.querySelector(".contentDiv").textContent = "";
                    currentWindow.querySelector(".contentDiv").appendChild(div);
                }

                // Brickorna tas bort
                window.setTimeout(function() {
                    turn1.parentNode.classList.add("removed");
                    turn2.parentNode.classList.add("removed");

                    turn1 = null;
                    turn2 = null;
                }, 300);

            } else {
                window.setTimeout(function() {
                    turn1.src = "image/memory/0.png";
                    turn2.src = "image/memory/0.png";

                    turn1 = null;
                    turn2 = null;
                }, 500);
            }
        }
    }

    function getPictureArray(rows, cols) {
        // Brickorna görs
        var i;
        var arr = [];

        for (i = 1; i <= (rows * cols) / 2; i += 1) {
            arr.push(i);
            arr.push(i);
        }

        for (i = arr.length - 1; i > 0; i -= 1) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        return arr;
    }

    // Kod för timer
    var timer = currentWindow.querySelector(".timer");
    var id;
    var totalTime = 0;
    var div = document.createElement("div");
    div.appendChild(document.createTextNode("Game Over! Time ran out."))
    div.setAttribute("class", "centeredDiv");
    function countDown() {
        var counter = 61;
        id = setInterval(function() {
            counter -= 1;
            if (counter < 0) {
                clearInterval(id);
                currentWindow.querySelector(".contentDiv").textContent = "";
                currentWindow.querySelector(".contentDiv").appendChild(div);

            } else {
                timer.textContent = counter.toString() + " seconds left.";
                totalTime += 1;
            }
        }, 1000);
    }
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYWJvdXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvY2FsYy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvZHJhZ0FuZERyb3AuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIEFib3V0KGNvbnRhaW5lcikge1xuICAgIHZhciBhYm91dFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhYm91dFRlbXBsYXRlXCIpO1xuICAgIHZhciBhYm91dERpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUoYWJvdXRUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYWJvdXREaXYpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFib3V0O1xuIiwidmFyIE1lbW9yeSA9IHJlcXVpcmUoXCIuL21lbW9yeVwiKTtcbnZhciBDaGF0ID0gcmVxdWlyZShcIi4vY2hhdFwiKTtcbnZhciBDYWxjID0gcmVxdWlyZShcIi4vY2FsY1wiKTtcbnZhciBBYm91dCA9IHJlcXVpcmUoXCIuL2Fib3V0XCIpO1xucmVxdWlyZShcIi4vZHJhZ0FuZERyb3BcIik7XG5cbnZhciBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkZXNrdG9wXCIpO1xudmFyIG1lbW9yeUFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5XCIpO1xudmFyIGNoYXRBcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRcIik7XG52YXIgY2FsY0FwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FsY1wiKTtcbnZhciBhYm91dEFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWJvdXRcIik7XG52YXIgd2luZG93VGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3dpbmRvd1RlbXBsYXRlXCIpWzBdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG52YXIgbG9nb1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsb2dvVGVtcGxhdGVcIikuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuZnVuY3Rpb24gb3BlbkFwcCgpIHtcbiAgICB2YXIgd2luZG93RGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh3aW5kb3dUZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgZGVza3RvcC5hcHBlbmRDaGlsZCh3aW5kb3dEaXYpO1xuICAgIHZhciBhbGxXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIGxhdGVzdFdpbmRvdyA9IGFsbFdpbmRvd3NbYWxsV2luZG93cy5sZW5ndGggLSAxXTtcbiAgICBsYXRlc3RXaW5kb3cucXVlcnlTZWxlY3RvcihcIi50aW1lclwiKS50ZXh0Q29udGVudCA9IFwiXCI7XG5cbiAgICB2YXIgd2luZG93Q2xvc2UgPSBsYXRlc3RXaW5kb3cucXVlcnlTZWxlY3RvcihcIi53aW5kb3dDbG9zZVwiKTtcbiAgICB3aW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlc2t0b3AucmVtb3ZlQ2hpbGQod2luZG93RGl2KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsYXRlc3RXaW5kb3c7XG59XG5cbm1lbW9yeUFwcC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxhdGVzdFdpbmRvdyA9IG9wZW5BcHAoKTtcbiAgICB2YXIgbG9nb0RpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUobG9nb1RlbXBsYXRlLCB0cnVlKTtcbiAgICBsYXRlc3RXaW5kb3cucXVlcnlTZWxlY3RvcihcIi53aW5kb3dUYXNrYmFyXCIpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTWVtb3J5XCIpKTtcbiAgICBuZXcgTWVtb3J5KDQsIDQsIFwiY29udGVudERpdlwiLCBsYXRlc3RXaW5kb3cpO1xuICAgIGxhdGVzdFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLmxvZ29EaXZcIikuYXBwZW5kQ2hpbGQobG9nb0Rpdi5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUxvZ29cIikpO1xufSk7XG5cbmNoYXRBcHAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXRlc3RXaW5kb3cgPSBvcGVuQXBwKCk7XG4gICAgdmFyIGxvZ29EaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKGxvZ29UZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgbmV3IENoYXQobGF0ZXN0V2luZG93LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGVudERpdlwiKSk7XG4gICAgbGF0ZXN0V2luZG93LnF1ZXJ5U2VsZWN0b3IoXCIubG9nb0RpdlwiKS5hcHBlbmRDaGlsZChsb2dvRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdExvZ29cIikpO1xuICAgIGxhdGVzdFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd1Rhc2tiYXJcIikuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJDaGF0XCIpKTtcbn0pO1xuXG5jYWxjQXBwLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGF0ZXN0V2luZG93ID0gb3BlbkFwcCgpO1xuICAgIHZhciBsb2dvRGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShsb2dvVGVtcGxhdGUsIHRydWUpO1xuICAgIG5ldyBDYWxjKGxhdGVzdFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnREaXZcIikpO1xuICAgIGxhdGVzdFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLmxvZ29EaXZcIikuYXBwZW5kQ2hpbGQobG9nb0Rpdi5xdWVyeVNlbGVjdG9yKFwiLmNhbGNMb2dvXCIpKTtcbiAgICBsYXRlc3RXaW5kb3cucXVlcnlTZWxlY3RvcihcIi53aW5kb3dUYXNrYmFyXCIpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiQ2FsY3VsYXRvclwiKSk7XG59KTtcblxuYWJvdXRBcHAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXRlc3RXaW5kb3cgPSBvcGVuQXBwKCk7XG4gICAgdmFyIGxvZ29EaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKGxvZ29UZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgbmV3IEFib3V0KGxhdGVzdFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnREaXZcIikpO1xuICAgIGxhdGVzdFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLmxvZ29EaXZcIikuYXBwZW5kQ2hpbGQobG9nb0Rpdi5xdWVyeVNlbGVjdG9yKFwiLmFib3V0TG9nb1wiKSk7XG4gICAgbGF0ZXN0V2luZG93LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93VGFza2JhclwiKS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIkFib3V0XCIpKTtcbn0pO1xuIiwiZnVuY3Rpb24gQ2FsYyhjb250YWluZXIpIHtcbiAgICB2YXIgY2FsY0RpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYWxjVGVtcGxhdGVcIikuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhbGNEaXYpO1xuICAgIHZhciByZXN1bHRCb3ggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5yZXN1bHRcIik7XG4gICAgdmFyIHJlc3VsdEJveFZhbHVlID0gXCJcIjtcbiAgICB2YXIgbnVtYmVyMSA9IFwiXCI7XG5cbiAgICAvLyBMeXNzbmFyIGVmdGVyIGV0dCBrbmFwcHRyeWNrXG4gICAgY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuY2FsY0J1dHRvbnNOdW1iZXJzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgYnV0dG9uQ2xpY2tlZCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdmFyIGJ1dHRvblZhbHVlID0gYnV0dG9uQ2xpY2tlZC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcbiAgICAgICAgcmVzdWx0Qm94VmFsdWUgPSByZXN1bHRCb3guZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XG5cbiAgICAgICAgaWYgKGJ1dHRvblZhbHVlID09PSBcIkNsZWFyXCIpIHtcbiAgICAgICAgICAgIG51bWJlcjEgPSBcIlwiO1xuICAgICAgICAgICAgcmVzdWx0Qm94LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIG51bWJlcjEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGJ1dHRvblZhbHVlID09PSBcIkFuc1wiKSB7XG4gICAgICAgICAgICBudW1iZXIxICs9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmNhbGNBbnNcIikuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAgICAgICAgIHJlc3VsdEJveC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBudW1iZXIxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChidXR0b25WYWx1ZSA9PT0gXCI9XCIpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmNhbGNQcm9ibGVtXCIpLnRleHRDb250ZW50ID0gbnVtYmVyMSArIFwiID1cIjtcbiAgICAgICAgICAgIG51bWJlcjEgPSBldmFsKG51bWJlcjEpO1xuICAgICAgICAgICAgY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuY2FsY0Fuc1wiKS5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIG51bWJlcjEpO1xuICAgICAgICAgICAgcmVzdWx0Qm94LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIG51bWJlcjEpO1xuICAgICAgICAgICAgbnVtYmVyMSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBudW1iZXIxICs9IGJ1dHRvblZhbHVlO1xuICAgICAgICAgICAgcmVzdWx0Qm94LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIG51bWJlcjEpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FsYztcbiIsImZ1bmN0aW9uIENoYXQoY29udGFpbmVyKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcIi53aW5kb3dDbG9zZVwiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRUZW1wbGF0ZVwiKTtcblxuICAgIHRoaXMuY2hhdERpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmNoYXREaXYuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8vTElzdGVuIGZvciBlbnRlciBrZXlcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBDb2RlIGZvciBzaG93aW5nIGFuZCBjaGFuZ2luZyB1c2VybmFtZVxuICAgIHZhciBjaGFuZ2VVc2VyRGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50Lmxhc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIHZhciB1c2VybmFtZUFyZWEgPSB0aGlzLmNoYXREaXYucXVlcnlTZWxlY3RvcihcIi51c2VybmFtZUFyZWFcIik7XG4gICAgdmFyIHBVc2VybmFtZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiU2lnbmVkIGluIGFzIFwiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSk7XG4gICAgdmFyIHVzZXJUZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB1c2VyVGVtcERpdi5hcHBlbmRDaGlsZChwVXNlcm5hbWUpO1xuXG4gICAgdmFyIGNoYW5nZVVzZXJTaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJuYW1lQXJlYS50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIHVzZXJuYW1lQXJlYS5hcHBlbmRDaGlsZChjaGFuZ2VVc2VyRGl2KTtcbiAgICAgICAgdXNlclRlbXBEaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoYW5nZVVzZXJTaG93KTtcbiAgICAgICAgdXNlcm5hbWVBcmVhLnF1ZXJ5U2VsZWN0b3IoXCIuY2hhbmdlVXNlck5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoYW5nZVVzZXIpO1xuICAgIH07XG5cbiAgICB2YXIgY2hhbmdlVXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB1c2VybmFtZUFyZWEucXVlcnlTZWxlY3RvcihcIi5jaGFuZ2VVc2VyTmV4dFwiKS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hhbmdlVXNlcik7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgdXNlcm5hbWVBcmVhLnF1ZXJ5U2VsZWN0b3IoXCIuY2hhbmdlVXNlclRleHRcIikudmFsdWUpO1xuICAgICAgICBjaGFuZ2VVc2VyUmVzZXQoKTtcbiAgICB9O1xuXG4gICAgdmFyIGNoYW5nZVVzZXJSZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB1c2VybmFtZUFyZWEudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgICB1c2VyVGVtcERpdi50ZXh0Q29udGVudCA9IFwiU2lnbmVkIGluIGFzIFwiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKTtcbiAgICAgICAgdXNlcm5hbWVBcmVhLmFwcGVuZENoaWxkKHVzZXJUZW1wRGl2KTtcbiAgICAgICAgdXNlclRlbXBEaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoYW5nZVVzZXJTaG93KTtcbiAgICB9O1xuXG4gICAgLy8gT20gdXNlcm5hbWUgZmlubnMgdmlzYXMgZGV0IGFubmFycyBtw6VzdGUgZXR0IHVzZXJuYW1lIHNrcml2YXMgaW5cbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSkge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jaGF0RGl2KTtcbiAgICAgICAgY2hhbmdlVXNlclJlc2V0KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgaW5wdXRUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdXNlcm5hbWVUZW1wbGF0ZVwiKTtcbiAgICAgICAgdmFyIGlucHV0VGVtcGxhdGVDb250ZW50ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShpbnB1dFRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgICAgICB2YXIgaW5wdXRVc2VybmFtZSA9IGlucHV0VGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlck5hbWVJbnB1dFwiKTtcbiAgICAgICAgdmFyIHN1Ym1pdFVzZXJuYW1lID0gaW5wdXRUZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVN1Ym1pdFwiKTtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImNlbnRlcmVkRGl2XCIpO1xuICAgICAgICBkaXYudGV4dENvbnRlbnQgPSBcIlBsZWFzZSBlbnRlciBhIHVzZXJuYW1lXCI7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW5wdXRVc2VybmFtZSk7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzdWJtaXRVc2VybmFtZSk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICBzdWJtaXRVc2VybmFtZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJuYW1lXCIsIGlucHV0VXNlcm5hbWUudmFsdWUpO1xuICAgICAgICAgICAgZGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNoYXREaXYpO1xuICAgICAgICAgICAgY2hhbmdlVXNlclJlc2V0KCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0KCk7XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuQ2hhdC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5zb2NrZXQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIik7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMuc29ja2V0KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiQ291bGQgbm90IGNvbm5lY3RcIikpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSBcIm1lc3NhZ2VcIikge1xuICAgICAgICAgICAgICAgIHRoaXMucHJpbnRNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5DaGF0LnByb3RvdHlwZS5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgIGRhdGE6IHRleHQsXG4gICAgICAgIHVzZXJuYW1lOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpLFxuICAgICAgICBjaGFubmVsOiBcIlwiLFxuICAgICAgICBrZXk6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn07XG5cbkNoYXQucHJvdG90eXBlLnByaW50TWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLmNoYXREaXYucXVlcnlTZWxlY3RvckFsbChcInRlbXBsYXRlXCIpWzBdO1xuICAgIHZhciBtZXNzYWdlRGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICB2YXIgbWVzc2FnZXNEaXYgPSB0aGlzLmNoYXREaXYucXVlcnlTZWxlY3RvckFsbChcIi5tZXNzYWdlc1wiKTtcbiAgICBtZXNzYWdlc0Rpdi5zY3JvbGxUb3AgPSBtZXNzYWdlc0Rpdi5zY3JvbGxIZWlnaHQ7XG4gICAgdmFyIHRpbWVOb3cgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBob3VycyAgID0gdGltZU5vdy5nZXRIb3VycygpO1xuICAgIHZhciBtaW51dGVzID0gdGltZU5vdy5nZXRNaW51dGVzKCk7XG4gICAgaWYgKG1pbnV0ZXMgPj0gMCAmJiBtaW51dGVzIDw9IDkpIHtcbiAgICAgICAgbWludXRlcyA9IFwiMFwiICsgbWludXRlcztcbiAgICB9XG5cbiAgICB2YXIgdXNlcm5hbWUgPSBtZXNzYWdlLnVzZXJuYW1lO1xuICAgIGlmICh1c2VybmFtZSA9PT0gXCJcIikge1xuICAgICAgICB1c2VybmFtZSA9IFwiQW5vblwiO1xuICAgIH1cblxuICAgIG1lc3NhZ2VEaXYucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0XCIpWzBdLnRleHRDb250ZW50ID0gaG91cnMgKyBcIjpcIiAgKyBtaW51dGVzICsgXCIgLSBcIiArIHVzZXJuYW1lICsgXCI6IFwiICsgbWVzc2FnZS5kYXRhO1xuXG4gICAgbWVzc2FnZXNEaXZbMF0uYXBwZW5kQ2hpbGQobWVzc2FnZURpdik7XG4gICAgbWVzc2FnZXNEaXYuc2Nyb2xsVG9wID0gbWVzc2FnZXNEaXYuc2Nyb2xsSGVpZ2h0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwidmFyIHN0YXJ0WCA9IDA7XG52YXIgc3RhcnRZID0gMDtcbnZhciBvZmZzZXRYID0gMDtcbnZhciBvZmZzZXRZID0gMDtcbnZhciBkcmFnRWxlbWVudDtcbnZhciB0YXJnZXQ7XG5cbmZ1bmN0aW9uIGRyYWdEcm9wKCkge1xuICAgIHZhciB6SW5kZXggPSAyO1xuICAgIGRvY3VtZW50Lm9ubW91c2Vkb3duID0gb25Nb3VzZURvd247XG4gICAgZG9jdW1lbnQub25tb3VzZXVwID0gb25Nb3VzZVVwO1xuXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xuICAgICAgICB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgICAgICAvLyBLb2xsYSBzw6UgYXR0IGRldCB2YXIgdsOkbnN0ZXIgbXVza25hcHAgc29tIHRyeWNrdGVzIG9jaCBhdHQgZGV0IMOkciBlbiBkcmFnLWNsYXNzXG4gICAgICAgIGlmICgodGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJ3aW5kb3dUYXNrYmFyXCIpICYmIChlLmJ1dHRvbiA9PT0gMCkpIHtcbiAgICAgICAgICAgIC8vVGEgZnJhbSBtdXNwb3NpdGlvbmVuXG4gICAgICAgICAgICBzdGFydFggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICBzdGFydFkgPSBlLmNsaWVudFk7XG4gICAgICAgICAgICBkcmFnRWxlbWVudCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAvL1RhIGZyYW0gZWxlbWVudGV0cyBwb3NpdGlvbi5cbiAgICAgICAgICAgIGlmIChpc05hTihwYXJzZUZsb2F0KGRyYWdFbGVtZW50LnN0eWxlLmxlZnQpKSkge1xuICAgICAgICAgICAgICAgIG9mZnNldFggPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9mZnNldFggPSBwYXJzZUZsb2F0KGRyYWdFbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNOYU4ocGFyc2VGbG9hdChkcmFnRWxlbWVudC5zdHlsZS50b3ApKSkge1xuICAgICAgICAgICAgICAgIG9mZnNldFkgPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9mZnNldFkgPSBwYXJzZUZsb2F0KGRyYWdFbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHpJbmRleCArPSAxO1xuICAgICAgICAgICAgZHJhZ0VsZW1lbnQuc3R5bGUuekluZGV4ID0gekluZGV4O1xuICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBvbk1vdXNlTW92ZTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuZm9jdXMoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgodGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJ3aW5kb3dcIikgJiYgKGUuYnV0dG9uID09PSAwKSkge1xuICAgICAgICAgICAgLy8gRsO2bnN0cmV0IGbDpXIgZm9rdXMgb20gbWFuIHRyeWNrZXIgcMOlIGRlblxuICAgICAgICAgICAgekluZGV4ICs9IDE7XG4gICAgICAgICAgICB0YXJnZXQuc3R5bGUuekluZGV4ID0gekluZGV4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xuICAgICAgICBkcmFnRWxlbWVudC5zdHlsZS5sZWZ0ID0gb2Zmc2V0WCArIGUuY2xpZW50WCAtIHN0YXJ0WDtcbiAgICAgICAgZHJhZ0VsZW1lbnQuc3R5bGUudG9wID0gb2Zmc2V0WSArIGUuY2xpZW50WSAtIHN0YXJ0WTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoKSB7XG4gICAgICAgIGlmIChkcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gRmx5dHRhIHRpbGxiYWthIHdpbmRvdyBuw6RyIGRlbiBnw6VyIHV0YW5mw7ZyIHNrw6RybWVuXG4gICAgICAgICAgICBpZiAocGFyc2VGbG9hdChkcmFnRWxlbWVudC5zdHlsZS50b3ApIDwgMCkge1xuICAgICAgICAgICAgICAgIGRyYWdFbGVtZW50LnN0eWxlLnRvcCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KGRyYWdFbGVtZW50LnN0eWxlLmxlZnQpIDwgMCkge1xuICAgICAgICAgICAgICAgIGRyYWdFbGVtZW50LnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFyc2VGbG9hdChkcmFnRWxlbWVudC5zdHlsZS5sZWZ0KSArIDUwMCA+IHNjcmVlbi53aWR0aCkge1xuICAgICAgICAgICAgICAgIGRyYWdFbGVtZW50LnN0eWxlLmxlZnQgPSBzY3JlZW4ud2lkdGggLSA1MDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KGRyYWdFbGVtZW50LnN0eWxlLnRvcCkgKyA1NTAgPiBzY3JlZW4uaGVpZ2h0ICsgMzgwKSB7XG4gICAgICAgICAgICAgICAgZHJhZ0VsZW1lbnQuc3R5bGUudG9wID0gc2NyZWVuLmhlaWdodCAtIDE4NjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Ob2xsc3TDpGxsYSBuw6RyIG11c2tuYXBwZW4gc2zDpHBwc1xuICAgICAgICAgICAgaWYgKGRyYWdFbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGRyYWdFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuZHJhZyA9IGRyYWdEcm9wKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJvd3MsIGNvbHMsIGNvbnRhaW5lciwgY3VycmVudFdpbmRvdykge1xuICAgIHZhciBhO1xuICAgIHZhciB0aWxlcyA9IFtdO1xuICAgIHZhciB0dXJuMTtcbiAgICB2YXIgdHVybjI7XG4gICAgdmFyIGxhc3RUaWxlO1xuICAgIHZhciBwYWlycyA9IDA7XG4gICAgdmFyIHRyaWVzID0gMDtcblxuICAgIGNvbnRhaW5lciA9IGN1cnJlbnRXaW5kb3cucXVlcnlTZWxlY3RvcihcIi5jb250ZW50RGl2XCIpO1xuICAgIHZhciBidXR0b25UZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGltZUJ1dHRvbnNcIik7XG4gICAgdmFyIGJ1dHRvbkRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUoYnV0dG9uVGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgdmFyIGJ1dHRvbk5vVGltZSA9IGJ1dHRvbkRpdi5xdWVyeVNlbGVjdG9yKFwiLmJ1dHRvbk5vVGltZVwiKTtcbiAgICB2YXIgYnV0dG9uVGltZSA9IGJ1dHRvbkRpdi5xdWVyeVNlbGVjdG9yKFwiLmJ1dHRvblRpbWVcIik7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbkRpdik7XG5cbiAgICAvLyBBbnbDpG5kYXJlbiB2w6RsamVyIG1lbGxhbiBhdHQgaGEgdGlkIGVsbGVyIGludGVcbiAgICBidXR0b25Ob1RpbWUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0TWVtb3J5KTtcbiAgICBidXR0b25UaW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc3RhcnRNZW1vcnkoKTtcbiAgICAgICAgY291bnREb3duKCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzdGFydE1lbW9yeSgpIHtcbiAgICAgICAgYnV0dG9uRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgdGlsZXMgPSBnZXRQaWN0dXJlQXJyYXkocm93cywgY29scyk7XG5cbiAgICAgICAgY29udGFpbmVyID0gY3VycmVudFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnREaXZcIik7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjbWVtb3J5Q29udGFpbmVyIHRlbXBsYXRlXCIpWzBdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnRpbWVyXCIpLnRleHRDb250ZW50ID0gXCJHb29kIGx1Y2shXCI7XG5cbiAgICAgICAgLy8gQmlsZGVybmEgcml0YXMgdXQgb2NoIHNwZWxldCBzdGFydGFzXG4gICAgICAgIHRpbGVzLmZvckVhY2goZnVuY3Rpb24odGlsZSwgaW5kZXgpIHtcblxuICAgICAgICAgICAgYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuXG4gICAgICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGV2ZW50LnRhcmdldCA6IGV2ZW50LnRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgICAgICB0dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKChpbmRleCArIDEpICUgY29scyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZykge1xuXG4gICAgICAgIGlmICh0dXJuMikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1nLnNyYyA9IFwiaW1hZ2UvbWVtb3J5L1wiICsgdGlsZSArIFwiLnBuZ1wiO1xuXG4gICAgICAgIGlmICghdHVybjEpIHtcbiAgICAgICAgICAgIC8vIEbDtnJzdGEgYnJpY2thbiB0cnlja3NcbiAgICAgICAgICAgIHR1cm4xID0gaW1nO1xuICAgICAgICAgICAgbGFzdFRpbGUgPSB0aWxlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQW5kcmEgYnJpY2thbiB0cnlja3NcbiAgICAgICAgICAgIHR1cm4yID0gaW1nO1xuICAgICAgICAgICAgaWYgKGltZyA9PT0gdHVybjEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyaWVzICs9IDE7XG5cbiAgICAgICAgICAgIGlmICh0aWxlID09PSBsYXN0VGlsZSkge1xuICAgICAgICAgICAgICAgIC8vIE9tIGV0dCBwYXIgaGl0dGFzXG4gICAgICAgICAgICAgICAgcGFpcnMgKz0gMTtcbiAgICAgICAgICAgICAgICBpZiAocGFpcnMgPT09IChjb2xzICogcm93cykgLyAyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE9tIGFsbGEgYnJpY2tvciDDpHIgdsOkbmRhIHZpbm5lciBtYW5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIkNvbmdyYXR1bGF0aW9ucyEgWW91IHdvbiwgYWZ0ZXIgXCIgKyB0cmllcyArIFwiIHRyaWVzXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY2VudGVyZWREaXZcIik7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRXaW5kb3cucXVlcnlTZWxlY3RvcihcIi5jb250ZW50RGl2XCIpLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnREaXZcIikuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBCcmlja29ybmEgdGFzIGJvcnRcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdHVybjEucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdHVybjIucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICB0dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9LCAzMDApO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0dXJuMS5zcmMgPSBcImltYWdlL21lbW9yeS8wLnBuZ1wiO1xuICAgICAgICAgICAgICAgICAgICB0dXJuMi5zcmMgPSBcImltYWdlL21lbW9yeS8wLnBuZ1wiO1xuXG4gICAgICAgICAgICAgICAgICAgIHR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQaWN0dXJlQXJyYXkocm93cywgY29scykge1xuICAgICAgICAvLyBCcmlja29ybmEgZ8O2cnNcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBhcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IChyb3dzICogY29scykgLyAyOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+IDA7IGkgLT0gMSkge1xuICAgICAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIHZhciB0ZW1wID0gYXJyW2ldO1xuICAgICAgICAgICAgYXJyW2ldID0gYXJyW2pdO1xuICAgICAgICAgICAgYXJyW2pdID0gdGVtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuXG4gICAgLy8gS29kIGbDtnIgdGltZXJcbiAgICB2YXIgdGltZXIgPSBjdXJyZW50V2luZG93LnF1ZXJ5U2VsZWN0b3IoXCIudGltZXJcIik7XG4gICAgdmFyIGlkO1xuICAgIHZhciB0b3RhbFRpbWUgPSAwO1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIkdhbWUgT3ZlciEgVGltZSByYW4gb3V0LlwiKSlcbiAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJjZW50ZXJlZERpdlwiKTtcbiAgICBmdW5jdGlvbiBjb3VudERvd24oKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gNjE7XG4gICAgICAgIGlkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb3VudGVyIC09IDE7XG4gICAgICAgICAgICBpZiAoY291bnRlciA8IDApIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGlkKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50V2luZG93LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGVudERpdlwiKS50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgY3VycmVudFdpbmRvdy5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnREaXZcIikuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aW1lci50ZXh0Q29udGVudCA9IGNvdW50ZXIudG9TdHJpbmcoKSArIFwiIHNlY29uZHMgbGVmdC5cIjtcbiAgICAgICAgICAgICAgICB0b3RhbFRpbWUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxufTtcbiJdfQ==
