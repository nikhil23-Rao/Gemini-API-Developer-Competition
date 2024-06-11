import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());

// Setup gemini api
const configuration = new GoogleGenerativeAI(process.env.API_KEY as string);
const model = configuration.getGenerativeModel({ model: "gemini-1.5-pro" });

export const generateFlashcards = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);

    // Restore the previous context

    const chat = model.startChat({
      history: [],
      generationConfig: {
        responseMimeType: "application/json",
        // temperature: 1,
        // topP: 0.95,
      },
      // safetySettings: [
      //   {
      //     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      //   {
      //     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      //   {
      //     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      //   {
      //     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      //   {
      //     category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      // ],
    });

    const { response } = await chat.sendMessage(prompt);
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
      // safetySettings: [
      //   {
      //     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      //   {
      //     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      //   {
      //     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      //   {
      //     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      //   {
      //     category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
      //     threshold: HarmBlockThreshold.BLOCK_NONE,
      //   },
      // ],
    });

    const { response } = await chat.sendMessage(
      `Provide a list of all the Unit names in ${ap} according to Collegeboard's assigned units; Follow JSON format of just [{name:}]`
    );
    const responseText = response;

    // Stores the conversation
    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

app.get("/flashcards", async (req: Request, res: Response) => {
  await generateFlashcards(req, res);
});

app.get("/get-AP-unit", async (req: Request, res: Response) => {
  await generateUnit(req, res);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
