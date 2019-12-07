'use strict';

const express = require('express');
const scrapApi = require('./config/action/crawler/scrapApi');
const cors = require('cors');
const app = express();
const PORT = 7080;

app.use(cors());
app.use(express.json());

app.post('/api/scrap/kumgyeong/singer', async (req, res) => {

  const result = await scrapApi.getKumyeongSingerList(req.body);
  // 금영 노래방 가수 검색

  res.send(result);
});

app.post('/api/scrap/kumgyeong/list', async (req, res) => {

  const result = await scrapApi.getKumyeongSingList(req.body);
  //금영 노래방 노래 리스트

  res.send(result);
});

app.post('/api/scrap/tj/list', async (req, res) => {
  const result = await scrapApi.getTjSingList(req.body);
  //티제이 노래방 노래 리스트

  res.send(result);
})

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});