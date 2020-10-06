var canvas = null;
var context = null;
var image = null;
var colorInput = null;
var needToRender = false;
var imageData = null;

function main() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    colorInput = document.getElementById("colorpicker")
    image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = function() {
        needToRender = true;
    };
    image.src = "https://raw.githubusercontent.com/JoshuaWebb/heart-for-macos/master/Heart/Images.xcassets/Heart.imageset/Heart2X.png";

    checkRender();

    $("#colorpicker").spectrum({
        color: "#805b9e",
        flat: true,
        showInput: true,
        showInitial: true,
        preferredFormat: "hex",
        showButtons: false,
        move: function(color) { needToRender = true; },
    });

    var downloadLnk = document.getElementById("download-link");
    function download() {
        var colorHex = $("#colorpicker").spectrum("get").toString().substring(1);
        var size = document.getElementById("size").value || 1000;
        var padding = document.getElementById("padding").value || 0;
        downloadLnk.download = 'heart-' + colorHex + '-' + size + '-' + padding + '.png';
        canvas.width = size;
        canvas.height = size;
        redraw();
        imageData = canvas.toDataURL('image/png');
        this.href = imageData;
    };
    downloadLnk.addEventListener('click', download, false);
}

function redraw() {
    if (image == null) {
        return;
    }

    var padding = document.getElementById("padding").value || 0;
    padding = padding * canvas.width/1000;
    if (padding*2 >= canvas.width ||
        padding*2 >= canvas.height) {
        padding = (Math.min(canvas.width, canvas.height) / 2) - 1;
    }

    context.fillStyle = $("#colorpicker").spectrum("get");
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, padding, padding, canvas.width - padding*2, canvas.height - padding*2);
}

function resize() {
    var width = canvas.parentElement.clientWidth;
    canvas.parentElement.style.height = width;
    var height = width;
    if (canvas.width  != width ||
        canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

function checkRender() {
    if (resize() || needToRender) {
        needToRender = false;
        redraw();
    }
    requestAnimationFrame(checkRender);
}

function settingChanged() {
    needToRender = true;
}
