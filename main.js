

var fileUrl = chrome.runtime.getURL('text.txt');
const RATIO = 0.7;
const JSON_FIELD_MAP = {
    "Invoice Ref No": {id: "bodyContent_f3",value: ""},
    "Audit Entry No": {id: "bodyContent_f103",value: ""},
    "Billing A/c No": {id: "bodyContent_f104",value: ""},
    "Article No": {id: "bodyContent_f4",value: ""},
    "Handle By": {id: "bodyContent_f5",value: ""},
    "Responsible Party": {id: "bodyContent_f6",value: ""},
    "End User Name": {id: "bodyContent_f7",value: ""},
    "Out of Service Date": {id: "bodyContent_f107",value: ""},
    "Price Plans": {id: "bodyContent_f8",value: ""},
    "Installation Date": {id: "bodyContent_f109",value: ""},
    "Phone No": {id: "bodyContent_f9",value: ""},
    "Phone Cost": {id: "bodyContent_f10",value: ""},
    "Monthly Cost": {id: "bodyContent_f11",value: ""},
    "Mins": {id: "bodyContent_f12",value: ""},
    "Texts": {id: "bodyContent_f13",value: ""},
    "Extra Value": {id: "bodyContent_f14",value: ""},
    "Device Name": {id: "bodyContent_f15",value: ""},

    "Residence Type": {id: "bodyContent_f16",value: ""},
    "Customer Type": {id: "bodyContent_f17",value: ""},
    "Customer Name": {id: "bodyContent_f18",value: ""},
    "Company": {id: "bodyContent_f19",value: ""},
    "Customer Email": {id: "bodyContent_f20",value: ""},
    "Customer Address": {id: "bodyContent_f21",value: ""},
    "City": {id: "bodyContent_f22",value: ""},
    "State": {id: "bodyContent_f23",value: ""},
    "ZIP": {id: "bodyContent_f24",value: ""},

    "Call In Time": {id: "bodyContent_f25",value: ""},
    "Call Out Time": {id: "bodyContent_f26",value: ""},
    "Frequency": {id: "bodyContent_f27",value: ""},
    "Request ID": {id: "bodyContent_f28",value: ""},
    "Routing Number": {id: "bodyContent_f124",value: ""},
    "Caller ID": {id: "bodyContent_f125",value: ""},
    "Reason ID": {id: "bodyContent_f30",value: ""},
    "ECCircuit ID": {id: "bodyContent_f31",value: ""},
    "IC Circuit ID": {id: "bodyContent_f32",value: ""},
    "IC SWC NXX": {id: "bodyContent_f131",value: ""},
    "BT Account ID": {id: "bodyContent_f33",value: ""},
    "Service Class": {id: "bodyContent_f34",value: ""},
    "Channel Type": {id: "bodyContent_f35",value: ""},
    "End User Location": {id: "bodyContent_f36",value: ""},
    "NCI": {id: "bodyContent_f37",value: ""},
    "POT Location": {id: "bodyContent_f38",value: ""},
    "Jeopardy Code": {id: "bodyContent_f138",value: ""},
    "Rotary Code": {id: "bodyContent_f139",value: ""},
    "SECNCI": {id: "bodyContent_f39",value: ""},

    "Agent Number": {id: "bodyContent_f40",value: ""},
    "Card Type": {id: "bodyContent_f46",value: ""},
    "TT / R": {id: "bodyContent_f142",value: ""},
    "Card Number": {id: "bodyContent_f47",value: ""},
    "Agent Name": {id: "bodyContent_f41",value: ""},
    "Card Exp Date": {id: "bodyContent_f48",value: ""},
    "Agent Code": {id: "bodyContent_f42",value: ""},
    "Card Rate": {id: "bodyContent_f49",value: ""},
    "Agency Name": {id: "bodyContent_f43",value: ""},
    "Sales Code": {id: "bodyContent_f149",value: ""},
    "Agency Deposit": {id: "bodyContent_f44",value: ""},
    "Card Remark": {id: "bodyContent_f50",value: ""},
    "Agency Balance": {id: "bodyContent_f45",value: ""},
};

const KEYS = Object.keys(JSON_FIELD_MAP);

// var getTextFromImage = function (imageUrl) {
//   console.log('Getting text for imageUrl: ' + imageUrl);

//   fetch(imageUrl)
//   .then(response => response.blob())
//   .then(blob => {
//     const params = new URLSearchParams();
//     params.append('gettext', 'true');
//     params.append('outputformat', 'txt');
//     params.append('newline', 1);
//     params.append('tobw', true);

//     const formData = new FormData();
//     formData.append('file', blob, 'test.jpeg');

//     const apiUrl = `${API_URL}?${params.toString()}`;
//     fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         'Authorization': 'Basic ' + btoa(USER_NAME + ':' + LICENSE_CODE)
//       },
//       body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       fetch(data.OutputFileUrl)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch file');
//         }
//         return response.blob();
//       })
//       .then(blob => {
//         var file = new File([blob], "filename.txt");
//         var reader = new FileReader();
//         reader.onload = function(event) {
//           var contents = event.target.result;
//           console.log(contents);
//           textTOJSON(contents);
//         };
    
//         reader.readAsText(file);
//         // Do something with the file content here
//       })
//       .catch(error => {
//         console.error("Error fetching the file:", error);
//       });
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//   })
//   .catch(error => {
//     console.error('Error reading file:', error);
//   });
  
// };

const getTextFromImage = async (imageUrl) => {
  console.log('Getting text for imageUrl: ' + imageUrl);

  const url = new URL(imageUrl);
  const qParamValue = url.searchParams.get('q');

  chrome.storage.local.get(qParamValue, function(result) {
    if((qParamValue in result) && result[qParamValue]) {
      const invoiceData = result[qParamValue];
      console.log('Key exists in chrome storage.');
      setFieldValues(invoiceData);
      return;
    } else {
      console.log('Key does not exist in chrome storage.');
    }
  });
  isKeyInChromeStorage(qParamValue, function(keyExists) {
    if (keyExists) {
        console.log('Key exists in chrome storage.');
        setFieldValues();
        return;
    } else {
        console.log('Key does not exist in chrome storage.');
    }
  });

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const params = new URLSearchParams();
    params.append('gettext', 'true');
    params.append('outputformat', 'txt');
    params.append('newline', 1);
    params.append('tobw', true);

    const formData = new FormData();
    formData.append('file', blob, 'test.jpeg');

    const apiUrl = `${API_URL}?${params.toString()}`;
    const fetchResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(USER_NAME + ':' + LICENSE_CODE)
      },
      body: formData
    });

    const data = await fetchResponse.json();

    const fileResponse = await fetch(data.OutputFileUrl);
    if (!fileResponse.ok) {
      throw new Error('Failed to fetch file');
    }

    const fileBlob = await fileResponse.blob();
    const file = new File([fileBlob], "filename.txt");

    const reader = new FileReader();
    reader.onload = function(event) {
      const contents = event.target.result;
      textTOJSON(contents, qParamValue);
      setFieldValues(JSON_FIELD_MAP);
    };
  
    reader.readAsText(file);
  } catch (error) {
    console.error('Error:', error);
  }
};


chrome.contextMenus.create({
  id: 'get_text_item',
  title: "Get Text",
  contexts: ["all"]
});

// "activeTab" permission is sufficient for this:
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  
  chrome.scripting.executeScript({
    target: {tabId: tab.id, allFrames: true},
    files: ['manipulateDOM.js'],
  });
  
  var srcUrl = null;
  if (info.hasOwnProperty('srcUrl')) {
    srcUrl = info.srcUrl;
  }
  if (srcUrl) {
    getTextFromImage(srcUrl);
  }
});


function getStringWithoutSpace(str) {
  return str.replace(/\s/g, "")
}

function countMatchingCharacters(str1, str2) {
  let count = -1;
  let strLength = str1.length;

  if (str1.length !== str2.length) {
      return count;
  }

  count = 0;
  for (let i = 0; i < str1.length; i++) {
      if (str1[i] === str2[i]) {
          count++;
      }
  }

  return count / strLength;
}

function findTheBestKey(inputString) {
  let maxRatio = -1;
  let selectedString = null;

  for(let key of KEYS) {
      let ratio = countMatchingCharacters(getStringWithoutSpace(inputString), getStringWithoutSpace(key));

      if (ratio > maxRatio) {
          maxRatio = ratio;
          if(maxRatio >= RATIO) selectedString = key;
      }
  }

  return selectedString;
}

function textTOJSON(text, qParamValue) {
  const lines = text.split('\n');

  for(var i = 1; i < lines.length; i++) {
    let line = lines[i];
    if(!line) continue;
    const values = line.split(/\s{2,}/);

    for(var j = 0; j < values.length; j++) {
        const key = values[j];
        const bestKey = findTheBestKey(key);
        if( !bestKey ) continue;
        
        // console.log("bestKey: ", bestKey);
        const nextJ = j + 1;
        
        let value = "";
        if(nextJ <= values.length - 1) value = values[nextJ];
        value = value.replace(/\r/g, '');

        if(!findTheBestKey(value)) {
            JSON_FIELD_MAP[bestKey]['value'] = value;
        } 
        else {
            JSON_FIELD_MAP[value]['value'] = "";
        }
        // console.log("value: ", value);

    }
    
  }

  const dataToStore = {};
  dataToStore[qParamValue] = JSON_FIELD_MAP;
  chrome.storage.local.set(dataToStore);
}

function isKeyInChromeStorage(key, callback) {
  chrome.storage.local.get(key, function(result) {
      callback(key in result);
  });
}

function setFieldValues(invoiceData) {
  console.log("invoiceData: ", invoiceData);

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    console.log("tabs: ", tabs);
    chrome.tabs.sendMessage(tabs[0].id, {'invoiceData': invoiceData});
  });
}

