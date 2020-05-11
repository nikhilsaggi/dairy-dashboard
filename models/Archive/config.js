// @ts-check

const config = {
    endpoint: "https://cowdataacount1.documents.azure.com:443/",
    key: "woyDCiuVMS6zF5IkJE6cALTCfFW77qWeFLpR3XOterJPxzCUnJIyueh9WfGaTLyYA7fHJbBv95r6pV7hs8L2Ig==",
    databaseId: "Tasks",
    containerId: "Items",
    partitionKey: { kind: "Hash", paths: ["/category"] }
  };
  
  module.exports = config;