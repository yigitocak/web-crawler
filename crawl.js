import { JSDOM } from "jsdom";
import axios from "axios";

export const crawlPage = async (baseURL, currentURL, pages) => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log("actively crawling:", currentURL);

  try {
    const response = await axios.get(currentURL);
    if (response.status > 399) {
      console.error(
        `error in fetch in status code: ${response.status} on page: ${currentURL}`,
      );

      return pages;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.error(
        `non html response, content-type: ${contentType} on page: ${currentURL}`,
      );

      return pages;
    }

    const htmlBody = response.data;

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (e) {
    console.error(
      `error when fetching data ${e.message} on page: ${currentURL}`,
    );
  }
  return pages;
};

export const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // relative url
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (e) {
        console.error("error with relative url:", e.message);
      }
    } else {
      // absolute url
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (e) {
        console.error("error with absolute url:", e.message);
      }
    }
  }
  return urls;
};

export const normalizeURL = (urlString) => {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
};
