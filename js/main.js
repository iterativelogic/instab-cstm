const createOpenBtn = (source) => {
  const openBtn = document.createElement('a');
  openBtn.className = 'instab-btn instab-open';
  openBtn.innerHTML = 'Open';
  openBtn.target = '_blank';
  openBtn.href = source;

  return openBtn;
};

const getFilename = (url, username) => {
  const addUsername =true ;
  if (!addUsername) return false;

  const urlObject = new URL(url);
  const originalFilename = urlObject.pathname.split('/').pop();
  const dpath = `${username}$_${originalFilename}`;
  console.info(dpath)
  return dpath;
};

const createSaveBtn = (source, username) => {
  const saveBtn = document.createElement('a');
  saveBtn.className = 'instab-btn instab-save';
  saveBtn.innerHTML = 'Save';

  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const fname = getFilename(source, username);
    browser.runtime.sendMessage({ url: source, username });
  });

  return saveBtn;
};

const createNewTabBtn = (mediaContainer) => {
  const timeTags = mediaContainer.closest('article').querySelectorAll('time');
  const time = timeTags.length > 1 ? timeTags[timeTags.length - 1] : timeTags[0];
  const url = time && time.closest('a') && time.closest('a').href;

  const newTabBtn = document.createElement('a');
  newTabBtn.className = 'instab-btn instab-new-tab';
  newTabBtn.innerHTML = 'Open video in a new tab';
  newTabBtn.target = '_blank';
  newTabBtn.href = `${url}?instab=true`;

  return newTabBtn;
};

const getUsername = (media) => {
  try {
    const parentElement = isStory() ? 'section' : 'article';
    const mediaParent = media.closest(parentElement);
    const mediaHeaderLinks = mediaParent.querySelectorAll('header a');
    const profileLink = [...mediaHeaderLinks].find(headerLink => !headerLink.querySelector('img'));
    return profileLink.textContent;
  } catch (e) {
    return null;
  }
};

const addButtons = (media) => {
  for (let i = 0; i < media.length; i++) {
    let source = isBlob(media[i].src) ? null : media[i].src;

    const mediaContainer = media[i].parentNode.parentNode;

    if (source && !mediaContainer.classList.contains('instab-container')) {
      mediaContainer.classList.add('instab-container');

      if (isStory())
        mediaContainer.classList.add('instab-container-stories');

      if (instabId !== 0)
        mediaContainer.classList.add(`instab-container-${instabId}`);

      const username = getUsername(media[i]);

      const openBtn = createOpenBtn(source);
      const saveBtn = createSaveBtn(source, username);

      mediaContainer.appendChild(openBtn);
      mediaContainer.appendChild(saveBtn);

      const newTabBtn = mediaContainer.querySelector('.instab-new-tab');

      if (newTabBtn)
        mediaContainer.removeChild(newTabBtn);
    } else if (!source && isVideo(media[i]) && !mediaContainer.querySelector('.instab-new-tab')) {
      //const newTabBtn = createNewTabBtn(mediaContainer);
      const vmedia = media[i]
      let l = null;
      let blob = fetch(vmedia.src).then(r => 
        {
          const str = r.body;
          const reader = str.getReader();
          reader.read().then(function processText({ done, value }) {
            const utf8Decoder = new TextDecoder("utf-8");
            const vm = utf8Decoder.decode(value)
            console.info(vm);
          });
          debugger;

          
        });



      
      vmedia.setAttribute("controls", "");
      //const saveBtn = createSaveBtn(source, username);
      //mediaContainer.appendChild(saveBtn);
    }
  }
};

const calP = (blob) => {
  console.info("Pranav");
}

const isLargerThan350 = (img) => {
  const { width } = isStory() ? img.getBoundingClientRect() : img;
  return width > 350;
};

const noVideoSiblings = (images) => {
  return images.filter(img => !img.parentNode.querySelector('video'));
};

const getLargeImages = () => {
  const images = document.querySelectorAll('img');
  const largerThan350 = images.length ? [...images].filter(isLargerThan350) : [];
  return noVideoSiblings(largerThan350);
};

const addInstab = () => {
  const images = getLargeImages();
  const videos = document.getElementsByTagName('video');

  if (videos.length) addButtons(videos);
  if (images.length) addButtons(images);
};

const handleClick = () => {
  let tries = 0;

  const interval = setInterval(() => {
    tries++;

    if (isStory()) {
      
    } else {
      instabId = new Date().getTime();

      const instabContainer = document.querySelector(`.instab-container-${instabId}`);
      addInstab();
  
      if (instabContainer || tries > 15) {
        clearInterval(interval);
        instabId = 0;
      }
    }
  }, 300);
}

const browser = chrome || browser;
const isStory = () => /stories/.test(window.location.href);
const isBlob = (media) => /blob/.test(media);
const isVideo = (media) => media.tagName.toLowerCase() === 'video';

let instabId = 0;

const instabObserver = new MutationObserver(addInstab);

document.body.addEventListener('click', () => {
  handleClick();
});

const navbar = document.getElementsByTagName('nav');

for (let i = 0; i < navbar.length; i++) {
  navbar[i].classList.add('instab-navbar');
}