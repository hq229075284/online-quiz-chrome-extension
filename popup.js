
document.querySelector('button').addEventListener('click', async function () {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectScript,
  });
})
function injectScript(){
  var url = chrome.runtime.getURL("./simple.js");
  var script=document.createElement('script')
  script.src=url
  document.body.append(script)
}
