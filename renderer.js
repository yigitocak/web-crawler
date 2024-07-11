const { ipcRenderer } = require("electron");

document.getElementById("crawlButton").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value;
  const pages = await ipcRenderer.invoke("start-crawl", url);
  console.log(pages);
});
