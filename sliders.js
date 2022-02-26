function setUpSliders() {
    for(let slider of document.querySelectorAll(".optPanel input[type=range]")) {
        slider.addEventListener("input", function() {
            document.querySelector("label[for="+slider.id+"]").textContent = parseFloat(slider.value).toFixed(2);
        });
        document.querySelector("label[for="+slider.id+"]").textContent = parseFloat(slider.value).toFixed(2);
    }
}

setUpSliders();