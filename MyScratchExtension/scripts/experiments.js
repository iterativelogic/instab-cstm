// This code shows video link and image thumbnail at right side . It runs on page load in new tab

const conductExp = () => {
    console.log('Started Experiments');
    const postPattern = /[A-Za-z0-9-_]+\/p\/(?<postId>[A-Za-z0-9-_]+)/;
    const reelPattern = /[A-Za-z0-9-_]+\/(reel|reels)\/(?<postId>[A-Za-z0-9-_]+)/; //\b\/\w+\/(reel|reels)\/(?<postId>[A-Za-z0-9-_]+)\b
    const pattern = window.location.href.includes('reel') || window.location.href.includes('reels') ? reelPattern : postPattern;
    const match = window.location.href.match(pattern);
    
    if (match == null) {
        console.log(window.location.href, 'No match found for post Id regex.');
        return;
    }

    const postId = match.groups['postId'];

    console.log(`Post-Id: ${postId}`);

    const jsonScripts = document.querySelectorAll('script[type="application/json"]');
    const thmContainer = document.createElement('div');

    thmContainer.classList.add("cstm-img");
    document.body.appendChild(thmContainer);

    function traverse(jsonObj) {
        if (jsonObj !== null && typeof jsonObj == "object") {
            const objKeys = Object.keys(jsonObj);
            console.log(jsonObj);
            Object.entries(jsonObj).forEach(([key, value]) => {
                // console.log(value);
                if (key == "code" && value == postId) {
                    const hasRequiredKey = objKeys.includes("carousel_media");
                    console.log(`@ Has arousel media: ${hasRequiredKey}`);
                    console.dir(jsonObj);
                    console.log('# Has arousel media')
                    if (hasRequiredKey == true) {
                        carousel_media = jsonObj.carousel_media

                        if (carousel_media == null) {
                            console.log('Found null carousel_media');
                            carousel_media = [{
                                image_versions2: jsonObj.image_versions2,
                                video_versions: jsonObj.video_versions
                            }]
                        }

                        console.log('carousel_media - 2');
                        console.dir(carousel_media);
                        for (const cmedia of carousel_media) {
                            const maxCandidate = cmedia.image_versions2.candidates
                                .toSorted((a, b) => a.width + a.height < b.width + b.height)
                                .at(0);

                            console.log('maxCandidate - 3');
                            console.dir(maxCandidate);

                            const imgTag = document.createElement('img');
                            imgTag.src = maxCandidate.url;
                            const percentReduction = 13 / 100;
                            imgTag.height = maxCandidate.height * percentReduction;
                            imgTag.width = maxCandidate.width * percentReduction;
                            imgTag.addEventListener('click', () => window.open(maxCandidate.url));

                            thmContainer.appendChild(imgTag);

                            const videoCandidate = cmedia.video_versions;

                            if (videoCandidate != null) {
                                console.log('Creating Video Links - 4');
                                for (const vCad of videoCandidate) {
                                    console.log('Creating iLink - 5');
                                    const anchorElem = document.createElement('a');
                                    anchorElem.href = vCad.url;
                                    anchorElem.innerHTML = `Video ${vCad.width}x${vCad.height}`;
                                    thmContainer.appendChild(anchorElem);
                                }
                            }
                        }
                    }
                    else {
                        const maxCandidate = jsonObj.image_versions2.candidates
                            .toSorted((a, b) => a.width + a.height < b.width + b.height)
                            .at(0);

                        const imgTag = document.createElement('img');
                        imgTag.src = maxCandidate.url;

                        const percentReduction = 10 / 100;
                        imgTag.height = maxCandidate.height * percentReduction;
                        imgTag.width = maxCandidate.width * percentReduction;
                        imgTag.addEventListener('click', () => window.open(maxCandidate.url));

                        thmContainer.appendChild(imgTag);
                    }
                }

                traverse(value);
            });
        }
        else {
            // jsonObj is a number or string
        }
    }

    console.log(`Found ${jsonScripts.length} scripts.`);

    for (const script of jsonScripts) {
        const scrContent = script.innerHTML;
        const hasLink = scrContent.includes(".mp4");
        if (hasLink) {
            const sctObj = JSON.parse(scrContent);
            console.dir(sctObj);
            traverse(sctObj);
        }
    }
}

console.log('Started executing experiments.js');
conductExp();
console.log('Finished executing experiments.js');



