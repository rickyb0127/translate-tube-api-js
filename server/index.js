const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const uploadPath = path.resolve(__dirname, '../media');
const app = express();
app.use(cors());

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server started on port ${port}`));

const { TranscribeClient, StartTranscriptionJobCommand } = require ("@aws-sdk/client-transcribe");
const { TranslateClient, TranslateTextCommand } = require ("@aws-sdk/client-translate");
const { PollyClient, StartSpeechSynthesisTaskCommand } = require ("@aws-sdk/client-polly");

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION
}

const transcribeClient = new TranscribeClient(credentials);
const translateClient = new TranslateClient(credentials);
const pollyClient = new PollyClient(credentials);

const speechToText = async() => {
  try {
    const transcribeParams = {
      TranscriptionJobName: "test4",
      LanguageCode: "ko-KR",
      MediaFormat: "mp4",
      Media: {
        MediaFileUri: "https://translate-tube.s3.us-west-2.amazonaws.com/translate-tube-test.mp4",
      },
      OutputBucketName: "translate-tube"
    };

    const data = await transcribeClient.send(
      new StartTranscriptionJobCommand(transcribeParams)
    );
    console.log("Success - put", data);
    return data;
  } catch(err) {
    console.log("Error", err);
  }
};

const translateText = async() => {
  try {
    const text = "안녕하세요. 최경은 입니다. 저는 오늘 평소보다 조금 더 천천히 말을 할 거예요. 혹시 여러분은 소풍을 가거나 야외에 나갈 때 어떤 음식을 먹어요? 한국에서는 소풍을 가거나 야외에 나갈 때 꼭 이 음식을 먹어요. 짜장 김밥입니다 저는 김밥을 정말 좋아해요. 어렸을 때 제가 초등학교 학생이었을 때 소풍을 가는 날에는 엄마가 꼭 김밥을 싸주셨어요 소풍날은 항상 기대가 되잖아요. 그래서 소풍날 아침에 일찍 일어나면 항상 엄마가 더 일찍 일어나셔서 김밥을 말고 계셨어요. 그래서 김밥을 만들어서 도시락통에 예쁘게 넣어주시면 그걸 싸가지고 소풍을 갔던 기억이 있어요. 그래서 제가 궁금해졌어요 언제부터 한국 사람들은 소풍을 갈 때 김밥을 싸가지고 다녔을까 궁금해서 인터넷을 한번 찾아봤어요. 그런데 정확한 정보는 나오지 않지만 한 천구백오십년대 그때부터 지금 모습에 김밥이 나왔다고 해요. 그 때는 그렇지만 지금처럼 굉장히 다양한 야채가 들어가진 않았고요. 김과 밥그리고 한 가지 나 두가지의 야채만 들어가 있었다고 해요. 그런데 천구백칠십 년대가 되면서 한국의 엄마들이 자식들을 위해 다양한 야채를 먹고 다양한 음식을 먹었으면 좋겠다 라는 생각에 여러 가지 야채들. 그리고 달걀, 심지어는 불고기김치등등 다양한 음식을 넣기시작했다고 합니다. 제가 어렸을 때 저는 조금 까다로운 아이였어요 음식을 잘 안 먹고 지금 치안 먹었어요. 당근안 먹었어요. 그런데 김밥안에 있는 시금치, 당근은 다 먹었거든요. 그래서 저희 엄마도 항상 김밥을 싸주시면서. 김밥은 다양한 야채가 골고루 들어가 있고 고기도 들어가 있으니 정말 건강에 좋은 거니까 꼭꼭 씹어서 많이 먹어라. 라고 말씀하셨었어요. 그리고 저희 엄마는 김밥안에 들어가는 맛살 아세요. 그 맛살을 이용해서 김밥위에 예쁘게 꽃모양이나 하트 모양을 만들어 주셨어요. 정성이 대단하셨죠. 그래서 소풍에 가면 항상 우리 엄마 김밥이 더 맛있다. 아니야, 우리 엄마 김밥이 더 맛있어 이런 식으로 싸우기도 했던 기억이 납니다. 여러분들은 혹시 이렇게 야외 나갈 때, 그리고 소풍을 갔을 때 엄마가 싸주신 추억의 음식이 있나요? 아니면 야외 나갈 때 항상 먹는 음식이 있나요? 댓글로 남겨주세요. 감사합니다.";
    const translateParams = {
      Text: text,
      SourceLanguageCode: "ko",
      TargetLanguageCode: "en"
    };

    const data = await translateClient.send(new TranslateTextCommand(translateParams));

    return data;
  } catch(err) {
    console.log("Error", err);
  }
}

const textToSpeech = async(text) => {
  try {
    const pollyParams = {
      OutputFormat: "mp3",
      OutputS3BucketName: "translate-tube",
      Text: text,
      VoiceId: "Ivy"
    }

    const data = await pollyClient.send(new StartSpeechSynthesisTaskCommand(pollyParams));

    console.log(data);
    return data;
  } catch(err) {
    console.log("Error", err);
  }
}

app.get('/api/videos', async (req, res) => {
  try {
    const data = [{
      id: 1,
      title: "Listening Practice In Slow Korean - Kimbap: Picnic Food (소풍 가면 먹는 음식: 김밥) [한국어 초급 듣기]",
      channel: "Talk To Me In Korean",
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

app.get("/api/test", async (req, res) => {
  try {
    await speechToText();
    res.send({status: 200});
  } catch(err) {
    console.log(err)
    res.send({status: 400});
  }
});

app.get("/api/translate", async (req, res) => {
  try {
    const translateData = await translateText();
    await textToSpeech(translateData.TranslatedText);

    res.send({status: 200});
  } catch(err) {
    console.log(err)
    res.send({status: 400});
  }
});