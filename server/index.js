const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const uploadPath = path.resolve(__dirname, '../media');
const app = express();
app.use(cors());

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server started on port ${port}`));

app.get('/api/videos', async (req, res) => {
  try {
    const data = [{
      id: 1,
      title: "Gimbap is a must for ramen 🔥 Jin Jjambbong Ramen and School Food Gimbap Eating Show",
      channel: "tzuyang쯔양",
      viewCount: "1393524",
      likeCount: "29152",
      favoriteCount: "0",
      commentCount: "742"
    }]

    res.send({status: 200, data});
  } catch(err) {
    console.log(err)
    res.send({status: 400});
  }
});

app.get("/api/thumbnail", (req, res) => {
  res.sendFile(`${uploadPath}/thumbnail.jpeg`);
});

app.get("/api/video", (req, res) => {
  res.sendFile(`${uploadPath}/translate-tube-test.mp4`);
  // const range = req.headers.range;
  // if(!range) {
  //   res.status(400).send("Requires Range header");
  // }
  // const videoPath = "../media/translate-tube-test.mp4";
  // const videoSize = fs.statSync(videoPath).size;
  // const CHUNK_SIZE = 10 ** 6;
  // const start = Number(range.replace(/\D/g, ""));
  // const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  // const contentLength = end - start + 1;
  // const headers = {
  //   "Content-Range": `bytes ${start}-${end}/${videoSize}`,
  //   "Accept-Ranges": "bytes",
  //   "Content-Length": contentLength,
  //   "Content-Type": "video/mp4",
  // };
  // res.writeHead(206, headers);
  // const videoStream = fs.createReadStream(videoPath, { start, end });
  // videoStream.pipe(res);
});