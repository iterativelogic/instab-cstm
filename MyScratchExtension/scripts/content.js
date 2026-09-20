const downloadEvClick = async () => {
    const scrs = document.querySelectorAll('script[type="application/json"]');

    const btn = getMyScratchBtn();
    btn.innerHTML = "-";


    function traverse(jsonObj) {
        if (jsonObj !== null && typeof jsonObj == "object") {
            Object.entries(jsonObj).forEach(([key, value]) => {
                // key is either an array index or object key
                if (key.includes("image_versions")) {
                    console.dir(value["candidates"]);
                    const hiresImg = value["candidates"]
                        .sort((a, b) => a.width + a.height > b.width + b.height)
                        .at(0);
                    btn.addEventListener("click", () => {
                        window.open(hiresImg.url, '_');
                    });
                }

                if (key == "video_versions") {
                    const hiresVideo = value
                        .sort((a, b) => a.width + a.height > b.width + b.height)
                        .at(0);
                    window.open(hiresVideo.url, '_');
                    document.body.appendChild(btn);
                }
                traverse(value);
            });
        }
        else {
            // jsonObj is a number or string
        }
    }

    for (const scr of scrs) {
        const scrContent = scr.innerHTML;
        const hasLink = scrContent.includes(".mp4");
        if (hasLink) {
            const sctObj = JSON.parse(scrContent);
            console.dir(sctObj);
            traverse(sctObj);
        }
    }
}

const createDownloadBtn = () => {
    setTimeout(() => {
        console.log('Creating download Button');
        const eDiv = document.createElement("div");
        eDiv.id = "dvEDDnld"
        eDiv.innerHTML = "Video"
        eDiv.classList.add("extn-btn");
        eDiv.addEventListener("click", downloadEvClick);

        const videoDivs = document.querySelectorAll("video + div");

        if (videoDivs.length == 0) {
            console.log('No video <div> elements found');
        }
        else {
            videoDivs.forEach(r => r.remove());
        }        

        const videoElems = document.querySelectorAll("video[playsinline]");

        if (videoElems.length == 0) {
            console.log('No <video> elements found');
            return;
        }

        const videoElem = videoElems[0];
        videoElem.setAttribute("controls", "");

        videoElem.insertAdjacentElement('afterend', eDiv);
    }, 3000);
}

recurseVideo = (nodeN) => {
    if (nodeN.nodeName == 'VIDEO') {
        nodeN.setAttribute("controls", "");
        const videoDivs = document.querySelectorAll("video + div");

        if (videoDivs.length == 0)
            return;

        videoDivs.forEach(r => r.remove());
    }
    else {
        if (nodeN.childNodes.length == 0)
            return;

        for (const c of nodeN.childNodes) {
            recurseVideo(c);
        }
    }
}

removeAriaLabelVideoPlayer = (node) => {
    if (node.nodeName == 'DIV'){
        if (node.hasChildNodes())
        {
            const videoDivs = node.querySelectorAll("div[aria-label='Video player']");
            if (videoDivs.length == 0)
            {
                console.log('video divs');
                console.log(videoDivs);

            }

            videoDivs.forEach(r => r.remove());
        }        
    }
}

videoDialogControlsCb = (records, observer) => {
    try {
        for (const record of records) {
            if (record.type == 'childList') {
                for (const n of record.addedNodes) {
                    if (n.childNodes.length > 0) {
                        for (const vchild of n.childNodes.values()) {
                            recurseVideo(vchild);
                            removeAriaLabelVideoPlayer(vchild);
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        console.error(err);
    }
};

const getMyScratchBtn = () => {
    const eDiv = document.createElement("div");
    eDiv.id = "dvMyScratchBtn"
    eDiv.innerHTML = "+"
    eDiv.classList.add("extn-btn");
    return eDiv;
}

console.dir('Started executing content.js');

createDownloadBtn();

// Observer to add video controls to Dialog.
const mobsv = new MutationObserver(videoDialogControlsCb);
mobsv.observe(document.body, {
    childList: true,
    subtree: true,
});
//

console.dir('Finished executing content.js');










