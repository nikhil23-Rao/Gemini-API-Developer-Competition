import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
const cors = require("cors");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Setup gemini api
const configuration = new GoogleGenerativeAI(process.env.API_KEY as string);
const model = configuration.getGenerativeModel({ model: "gemini-1.5-pro" });
const fastModel = configuration.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateFlashcards = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);

    // Restore the previous context

    const chat = fastModel.startChat({
      history: [],
      generationConfig: {
        responseMimeType: "application/json",
        // temperature: 1,
        // topP: 0.95,
      },
    });

    const { response } = await chat.sendMessage(
      `Generate a set of around 10 to 15 flashcards on the most important key terms, people, and/or concepts for ${prompt}; Provide answer in JSON format like so:[{term:"", definition:""}];`
    );
    const responseText = response;

    // Stores the conversation
    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateUnit = async (req: Request, res: Response) => {
  try {
    const { ap } = req.body;
    console.log(ap);

    // Restore the previous context

    const chat = model.startChat({
      history: [],
      generationConfig: {
        responseMimeType: "application/json",
        // temperature: 1,
        // topP: 0.95,
      },
    });

    const { response } = await chat.sendMessage(
      `Provide a list of all the Unit content names in the class ${ap} ${
        ap.includes("AP")
          ? "according to the official Collegeboard's assigned units"
          : ""
      }; Follow JSON format of just [{name:}]`
    );
    const responseText = response;

    // Stores the conversation
    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const generateFlashcardsBasedOnImage = async (
  req: Request,
  res: Response
) => {
  try {
    const { image } = req.body;

    // Restore the previous context

    const chat = model.startChat({
      history: [],
      safetySettings,
    });

    const result = await chat.sendMessageStream([
      `Generate a list of all flashcards based on the content in the image; FILL EVERY DEFINITION; Return in JSON Format: [{term:"", definition:""}]; DON'T USE MARKDOWN`,
      { inlineData: { data: image, mimeType: "image/png" } },
    ]);

    let data = "";
    for await (const chunk of result.stream) {
      console.log(chunk.text());
      data = data.concat(chunk.text()); // also prints "42"
      console.log("DATA", data);
    }

    // const responseText = response;

    // Stores the conversation
    res.send({ response: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateFlashcardsBasedOnPrompt = async (
  req: Request,
  res: Response
) => {
  try {
    const { prompt, className } = req.body;
    console.log(prompt);

    // Restore the previous context

    const chat = fastModel.startChat({
      history: [],
      generationConfig: {
        responseMimeType: "application/json",
        // temperature: 1,
        // topP: 0.95,
      },
    });

    const { response } = await chat.sendMessage(
      `Generate a set of around 10 to 15 flashcards on the most important key terms, people, and/or concepts for ${prompt} for the class ${className}; Provide answer in JSON format like so:[{term:"", definition:""}];`
    );
    const responseText = response;

    // Stores the conversation
    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

app.post("/flashcards", async (req: Request, res: Response) => {
  await generateFlashcards(req, res);
});

app.post("/get-AP-unit", async (req: Request, res: Response) => {
  await generateUnit(req, res);
});

app.post("/flashcardPrompt", async (req: Request, res: Response) => {
  await generateFlashcardsBasedOnPrompt(req, res);
});

app.post("/flashcardImage", async (req: Request, res: Response) => {
  await generateFlashcardsBasedOnImage(req, res);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
