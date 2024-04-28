
document.querySelector('.soft').addEventListener('click', async function () {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectSoftScript,
  });
})

document.querySelector('.hard').addEventListener('click', async function () {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectHardScript,
  });
})

document.querySelector('.autoAnswer').addEventListener('click', async function () {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectAutoAnswerScript,
  });
})

function injectSoftScript() {
  var url = chrome.runtime.getURL('./simple.js');
  var script = document.createElement('script')
  script.src = url
  document.body.append(script)
}

function injectHardScript(jsFileName) {
  var url = chrome.runtime.getURL('./plugin.js');
  var script = document.createElement('script')
  script.src = url
  document.body.append(script)
}

function injectAutoAnswerScript(jsFileName) {
  var url = chrome.runtime.getURL('./autoAnswer.js');
  var script = document.createElement('script')
  script.src = url
  document.body.append(script)
}
