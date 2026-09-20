chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('From message listener')
    console.dir(sender);
    const senderTab = sender.tab;
    const targetTabAttach = { tabId: sender.tab.id };
    chrome.debugger.attach(targetTabAttach, '1.2', () => { 
      chrome.debugger.sendCommand(targetTabAttach, 'Network.enable', {},
        function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          }
        }
      );
    });
    chrome.tabs.reload();

    if (request.greeting === "hello")
      sendResponse({ farewell: "goodbye" });
  }
);

chrome.action.onClicked.addListener(function (tab) {
  console.log(tab);
  if (tab.url.startsWith('http')) {
    chrome.debugger.attach({ tabId: tab.id }, '1.2', function () {
      chrome.debugger.sendCommand({ tabId: tab.id }, 'Network.enable', {},
        function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          }
        }
      );
    });
    chrome.tabs.reload();
  } else {
    console.log('Debugger can only be attached to HTTP/HTTPS pages.');
  }
});

// 

chrome.debugger.onEvent.addListener(function (source, method, params) {
  if (method === 'Network.responseReceived') {
    const interestedUrl = 'https://www.instagram.com/api/graphql';
    if (params.response.url == interestedUrl) {
      const reqId = params.requestId;
      chrome.debugger.sendCommand(
        { tabId: source.tabId },
        'Network.getResponseBody',
        { requestId: reqId },
        function (body) {
          console.log("Response");
          console.dir(body);
          //if(body === undefined || body === null) return;
          try {

            console.dir(JSON.parse(body.body));
            const resp = JSON.parse(body.body);



            const data = resp.data;
            const info = data.xdt_api__v1__media__shortcode__web_info;

            if (!info) {
              console.log("Returning");
              return;
            }

            const items = info.items;
            const item = items[0];
            const videoVersions = item.video_versions;
            const higResVideo = videoVersions[0]
            console.log(higResVideo);
            console.log(higResVideo.url);

            chrome.tabs.create({ url: higResVideo.url });

            //chrome.debugger.detach({ tabId: source.tabId });
          } catch (error) {
            console.log("Caught exception");
            console.dir(error);
          }
        }
      );

    }

    //console.log(params.response.url);
    //console.log('Response received: ', params.response);
    // Perform your desired action with the response data
  }
});

