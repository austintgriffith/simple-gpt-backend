const { Configuration, OpenAIApi } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey,
});

const openai = new OpenAIApi(configuration);


var express = require("express");
var fs = require("fs");
const https = require("https");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

const port = Number(process.env.PORT) || 44444;


let state = [
    {"role": "system", "content": "You are a helpful bot thank you"}, 
]

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    console.log("/");
    res.status(200).send(JSON.stringify(state));
});

app.post("/", function (request, response) {
    console.log("POOOOST!!!!", request.body); // your JSON
    response.send(request.body); // echo the result back
    console.log("message:", request.body.message);

    state.push({"role": "user", "content": request.body.message})

    getMessage(state).then((result) => {

        console.log("result", result);
        state.push(result)

    }).catch((err) => {
        console.log("error", err);
    });

    console.log("processing...");
});


const getMessage = async (state) => {
    let comp = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: state,
      temperature:1,
    });
    return comp.data.choices[0].message;
  }







if (fs.existsSync("server.key") && fs.existsSync("server.cert")) {
    https
        .createServer(
            {
                key: fs.readFileSync("server.key"),
                cert: fs.readFileSync("server.cert"),
            },
            app
        )
        .listen(port, () => {
            console.log("HTTPS Listening: 49899");
        });
} else {
    var server = app.listen(port, "0.0.0.0", function () {
        console.log("HTTP Listening on port:", server.address().port);
    });
}
