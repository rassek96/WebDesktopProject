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
