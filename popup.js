let settings = {
    snowNr: 100,
    color: '#ffffff',
    speed: 1.0,
    snowing: false
}

function sendMessage() {
    chrome.tabs.query({currentWindow:true}, (tabs) =>{
        for(const tab of tabs){
            chrome.tabs.sendMessage(tab.id, {settings});
        }
    })
}

chrome.storage.sync.get(['settings'], (data) =>{
    if(data.settings)
        settings = data.settings;
    
    const snowFlakes = document.getElementById('snowFlakes');
    const snowSpeed = document.getElementById('snowSpeed');
    const snowColor = document.getElementById('snowColor');
    const snowing = document.getElementById('snowingButton');

    snowing.onclick = function(element) {
        settings.snowing = !settings.snowing; 
        chrome.storage.sync.set({settings: settings});
        sendMessage();
    }

    snowFlakes.value = settings.snowNr;
    snowFlakes.addEventListener('change', (event) =>{
        let value = parseInt(event.target.value);
        value = value > 1000 || value < 0 ? 100 : value;
        settings.snowNr = value;
        chrome.storage.sync.set({settings: settings});
        sendMessage();
    });

    snowSpeed.value = settings.speed;
    snowSpeed.addEventListener('change', (event) =>{
        let value = parseFloat(event.target.value);
        value = value > 10 || value < 0 ? 1.0 : value;
        settings.speed = value;
        chrome.storage.sync.set({settings: settings});
        sendMessage();
    });

    snowColor.value = settings.color;
    snowColor.addEventListener('change', (event) =>{
        let value = event.target.value;
        settings.color = value;
        chrome.storage.sync.set({settings: settings});
        sendMessage();
    });

})