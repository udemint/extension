chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3],
    addRules: [
      // Rule 1: Modify ALL responses from ANY domain when requested by workers.dev or udemint.org
      {
        id: 1,
        priority: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
            { header: "Access-Control-Allow-Methods", operation: "set", value: "GET, POST, PUT, DELETE, OPTIONS, HEAD, PROPFIND" },
            { header: "Access-Control-Allow-Headers", operation: "set", value: "*" },
            { header: "Access-Control-Expose-Headers", operation: "set", value: "*" },
            { header: "Access-Control-Max-Age", operation: "set", value: "86400" },
            { header: "Vary", operation: "set", value: "Origin" }
          ]
        },
        condition: {
          initiatorDomains: ["workers.dev", "udemint.org"],
          resourceTypes: ["xmlhttprequest", "media", "script", "font", "image", "stylesheet", "other"]
        }
      },
      // Rule 2: Remove Origin header from requests to avoid CORS preflight issues
      {
        id: 2,
        priority: 2,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            { header: "Origin", operation: "remove" }
          ]
        },
        condition: {
          initiatorDomains: ["workers.dev", "udemint.org"],
          resourceTypes: ["xmlhttprequest", "media"]
        }
      },
      // Rule 3: Force CORS headers for workers.dev and udemint.org responses
      {
        id: 3,
        priority: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "Access-Control-Allow-Origin", operation: "set", value: "*" }
          ]
        },
        condition: {
          urlFilter: "||workers.dev^ ||udemint.org^",
          resourceTypes: ["xmlhttprequest", "media"]
        }
      }
    ]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error updating rules:", chrome.runtime.lastError);
    } else {
      console.log("CORS bypass rules successfully applied for workers.dev and udemint.org");
    }
  });
});
