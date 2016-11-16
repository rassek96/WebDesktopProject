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
