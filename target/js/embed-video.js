var h2s = document.getElementsByTagName("h2");

if (h2s.length == 0) {
    console.log("no video");
}
for (var i = 0; i < h2s.length; i++) {


    var h2 = h2s[i];
    if (h2.textContent.includes("youtube")) {
        h2.innerHTML = '<iframe width="640" height="360" src="' + h2.textContent + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        continue
    }

    if (h2.textContent.includes("vimeo")) {
        h2.innerHTML = '<iframe src="' + h2.textContent + '" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
        continue
    }


    // console.log();

    // if (!h1.id) {
    //     h1.id = "h1" + i + (new Date().getTime());
    // }
}

// console.log(document.getElementsByTagName('h2'));