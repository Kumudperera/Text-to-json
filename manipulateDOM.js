var overlayId = 'overlayId';
var overlayStyleName = 'overlay';
var alerted = false;

function displayOverlay(text) {
  removeOverlay();

  var overlayNode = document.createElement('div');
  overlayNode.id = overlayId;
  overlayNode.className = overlayStyleName;

  var newContent = document.createTextNode(text);
  overlayNode.appendChild(newContent);

  document.getElementsByTagName('body')[0].appendChild(overlayNode);
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.hasOwnProperty('invoiceData')) {
      const invoiceData = request.invoiceData;
      console.log(invoiceData);

      for (let key in invoiceData) {
        if (invoiceData.hasOwnProperty(key)) {
            let data = invoiceData[key];
            let borderColor = "green";
            if(!data.id) continue;

            const inputField = document.getElementById(data.id);
            if(!inputField) continue;
            inputField.value = data.value;

            if(!data.value) borderColor = "red";
            inputField.style.borderColor = borderColor;
        }
      }
    }
});

