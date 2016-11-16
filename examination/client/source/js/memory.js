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
