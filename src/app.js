"use strict";

const axios = require("axios");
const _ = require("lodash");

const newsContainer = document.getElementById("news-container");

window.onload = function () {
  let searchIcon = document.getElementById("search-icon");
  let input = document.querySelector(".input");

  searchIcon.addEventListener("click", function () {
    input.style.transform = "scaleX(1)";
    input.style.transition = "all 350ms ease-in-out";
    searchIcon.style.opacity = 0;
    input.focus();
  });

  input.addEventListener("blur", function () {
    input.style.transform = "scaleX(0)";
    setTimeout(() => {
      searchIcon.style.opacity = 1;
    }, 400);
  });
};

let url = `https://hacker-news.firebaseio.com/v0/newstories.json`;
let newsStart = 0;
let newsLimit = 10;

const getNews = async (newsStart, newsLimit) => {
  let response = await axios.get(url);
  let newsID = _.slice(response.data, newsStart, newsStart + newsLimit);
  const promises = _.map(newsID, (id) =>
    axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  );
  const resolveAll = await axios.all(promises).then((newResponses) => {
    const newResp = _.map(newResponses, "data");
    console.log(newResp);
    createNewsBox(newResp);
  });

  // Crea il bottone ed inserito qui cosi che venga creato come last-child:
  let createButton = document.createElement("button");
  createButton.id = "btn";
  createButton.textContent = "Load more";
  newsContainer.appendChild(createButton);

  createButton.addEventListener("click", () => {
    newsStart += newsLimit;
    getNews(newsStart, newsLimit);
    // Rimuove il bottone appena viene cliccato
    createButton.remove();
  });
};

const createNewsBox = function (array) {
  array.forEach((item) => {
    const newstitle = _.get(item, "title", "Untitled");
    const newsurl = _.get(item, "url");
    const newstime = new Date(_.get(item, "time", 0) * 1000).toLocaleString();

    const createNewsBox = document.createElement("div");
    createNewsBox.classList.add("news-box");
    createNewsBox.innerHTML = `
    <h3 class="box-title">${newstitle}</h3>
    <a class="box-anchor" href="${newsurl}" target="_blank" rel="noopener noreferrer">Click here to read</a>
    <p class="box-paragraph">${newstime}</p>
    `;

    newsContainer.appendChild(createNewsBox);
  });
};

getNews(newsStart, newsLimit);
