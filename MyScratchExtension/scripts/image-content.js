const createOpenBtn = (source) => {
    const openBtn = document.createElement('a');
    openBtn.className = 'instab-btn';
    openBtn.innerHTML = 'Open';
    openBtn.target = '_blank';
    openBtn.href = source;
  
    return openBtn;
  };

const addButtons = (media) => {
    for (let i = 0; i < media.length; i++) {
      let source = media[i].src;  
      const mediaContainer = media[i].parentNode.parentNode;
      const nodes = Array.from(mediaContainer.childNodes.values())
        .filter(elem => elem.nodeName == "A");

      for (const anode of nodes) {
        mediaContainer.removeChild(anode);
      }
      
      if (source) {               
        const openBtn = createOpenBtn(source);  
        mediaContainer.appendChild(openBtn);
      } 
    }
  };

const isLargerThan350 = (img) => {
    const { width } = img;
    return width > 350;
  };
  
  const getLargeImages = () => {
    const images = document.querySelectorAll('img');
    const largerThan350 = images.length ? [...images].filter(isLargerThan350) : [];
    return largerThan350;
  };

const addImageButtons = () => {
    const images = getLargeImages();
    if (images.length) 
        addButtons(images);
  };

const handleClick = () => {
    let tries = 0;
  
    const interval = setInterval(() => {
      tries++;
      addImageButtons();
  
      if (tries > 3) {
        clearInterval(interval);
      }
    }, 300);
  }

document.body.addEventListener('click', () => {
    handleClick();
});