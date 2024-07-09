import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
const removeMd = require("remove-markdown");
const cors = require("cors");

import fetch from "node-fetch";
// import puppeteerExtra from "puppeteer-extra";
// import stealthPlugin from "puppeteer-extra-plugin-stealth";
// import chromium from "@sparticuz/chromium";
import * as cheerio from "cheerio";
// import fs from "graceful-fs";
// import axios from "axios";

async function getFirstPage(query: string) {
  try {
    const res = await fetch(
      `https://www.google.com/search?q=${query.split(" ").join("+")}`
    );
    const html = await res.text();
    // get all a tags
    const $ = cheerio.load(html);
    const aTags = $("a");
    const h3s: any[] = [];
    const links: any[] = [];
    // get all a tags that have /url?q= in them
    aTags.each((i, aTag) => {
      const href = $(aTag).attr("href");
      if (href?.includes("/url?q=")) {
        const actualUrl = href.split("/url?q=")[1].split("&sa=U&")[0];
        links.push(actualUrl);
      }
    });
    // get all h3 tags
    const h3Tags = $("h3");
    h3Tags.each((i, h3Tag) => {
      const text = $(h3Tag).text().trim();
      h3s.push(text);
    });
    const json: any = [];
    h3s.forEach((h3, i) => {
      json.push({ title: h3, link: links[i] });
    });

    return json;
  } catch (error: any) {
    console.log("error at getFirstPage", error.message);
  }
}

// (async () => {
//   // const results = await getAllResults(query);
// })();

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
const search = configuration.getGenerativeModel({
  model: "gemini-1.0-pro",
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

export const getQuote = async (req: Request, res: Response) => {
  try {
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
      `Give me a random quote to inspire a student; Provide in json object like: {quote:""}; DO NOT USE MARKDOWN;`
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

    const result = await chat.sendMessageStream(
      `Provide a list of all the Unit content names in the class ${ap} ${
        ap.includes("AP")
          ? "according to the official Collegeboard's assigned units"
          : ""
      }; Follow JSON format of just [{name:}]`
    );
    let data = "";
    for await (const chunk of result.stream) {
      console.log(chunk.text());
      data = data.concat(chunk.text()); // also prints "42"
      console.log("DATA", data);
    }

    // Stores the conversation
    res.send({ response: data });
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
      `Generate a list of all flashcards based on the content in the image; COPYRIGHTED CONTENT IS OKAY TO USE; IF A DEFINITION IS BLANK, FILL IT IN TO THE BEST OF YOUR KNOWLEDGE; Return in JSON Format: [{term:"", definition:""}]; DON'T USE MARKDOWN`,
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

    const chat = model.startChat({
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

export const validationBasedOnPrompt = async (req: Request, res: Response) => {
  try {
    const { className, input } = req.body;

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
      `Give me a number ranging from 1 to 100 (1 being not a suitable match, 100 being relatable content match) for "${input}" when related to "${className}"; DO NOT USE MARKDOWN; Return answer in JSON as so: {percentMatch:}`
    );
    const responseText = response;

    // Stores the conversation
    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateMCQFromPrompt = async (req: Request, res: Response) => {
  try {
    const { length, chosenClass, style, topic } = req.body;

    // Restore the previous context

    const chat = model.startChat({
      history: [],
      safetySettings,
    });

    const result = await chat.sendMessageStream([
      `Create a ${length} question MCQ set of ${style} questions on ${topic} for ${chosenClass};  IF THERE IS ANY EXTERNAL PASSAGES OR EXCERPTS NEEDED GENERATE THEM (DO NOT MAKE THEM HEADERS); IF ANY TABLES ARE NEEDED GENERATE THEM WITH MARKDOWN; DO NOT BASE THE QUESTION AROUND ANY IMAGES. Return answer in markdown format; SEPERATE ALL ANSWER OPTIONS WITH <br> AND FOR EACH QUESTION INCLUDE header BEFORE THE QUESTION SUCH AS: # Question 1; # Question 2; etc. for however many questions there are; AT THE VERY BOTTOM: provide an answer explanation header (using ##), and under it, fill it in for each choice in this format: Option A is the correct answer because...; IF CHOICE IS WRONG SAY: Option A is the wrong answer because...(Use the real corect/wrong answers)`,
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

export const generateFRQFromPrompt = async (req: Request, res: Response) => {
  try {
    const { length, chosenClass, style, topic } = req.body;

    // Restore the previous context

    const chat = model.startChat({
      history: [],
      safetySettings,
    });

    const result = await chat.sendMessageStream([
      `Create a ${length} question FRQ set of questions similar to the "concepts/question related to: ${topic}" for ${chosenClass}; IF THERE IS ANY EXTERNAL PASSAGES OR EXCERPTS NEEDED GENERATE THEM; DO NOT BASE THE QUESTION AROUND ANY IMAGES. Return answer in markdown format; SEPERATE ALL ANSWER OPTIONS WITH <br> FOR EACH QUESTION INCLUDE header BEFORE THE QUESTION SUCH AS: #Question 1; #Question 2; etc. for however many questions there are; AT THE VERY BOTTOM: provide an answer explanation header (using ##), and under it, fill in the correct answer for each frq part`,
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

export const generateMCQFromImage = async (req: Request, res: Response) => {
  try {
    const { image, chosenClass, length, style } = req.body;

    // Restore the previous context

    const chat = model.startChat({
      history: [],
      safetySettings,
    });

    const result = await chat.sendMessageStream([
      `Create a ${length} question MCQ set of ${style} questions similar to the question in the image for ${chosenClass};  IF THERE IS ANY EXTERNAL PASSAGES OR EXCERPTS NEEDED GENERATE THEM (DO NOT MAKE THEM HEADERS); IF ANY TABLES ARE NEEDED GENERATE THEM WITH MARKDOWN; DO NOT BASE THE QUESTION AROUND ANY IMAGES. Return answer in markdown format; SEPERATE ALL ANSWER OPTIONS WITH <br> AND FOR EACH QUESTION INCLUDE header BEFORE THE QUESTION SUCH AS: # Question 1; # Question 2; etc. for however many questions there are; AT THE VERY BOTTOM: provide an answer explanation header (using ##), and under it, fill it in for each choice in this format: Option A is the correct answer because...; IF CHOICE IS WRONG SAY: Option A is the wrong answer because...(Use the real corect/wrong answers)`,
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

export const generateFRQFromImage = async (req: Request, res: Response) => {
  try {
    const { length, chosenClass, style, image } = req.body;

    // Restore the previous context

    const chat = model.startChat({
      history: [],
      safetySettings,
    });

    const result = await chat.sendMessageStream([
      `Create a ${length} question FRQ set of questions similar to the "concepts/question tested in the image" for ${chosenClass}; IF THERE IS ANY EXTERNAL PASSAGES OR EXCERPTS NEEDED GENERATE THEM; DO NOT BASE THE QUESTION AROUND ANY IMAGES. Return answer in markdown format; SEPERATE ALL ANSWER OPTIONS WITH <br> FOR EACH QUESTION INCLUDE header BEFORE THE QUESTION SUCH AS: #Question 1; #Question 2; etc. for however many questions there are; AT THE VERY BOTTOM: provide an answer explanation header (using ##), and under it, fill in the correct answer for each frq part`,
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
    res.send({
      response: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const marketPlaceSearch = async (req: Request, res: Response) => {
  try {
    const { query, array } = req.body;
    console.log(array);

    // Restore the previous context

    const chat = search.startChat({
      history: [],
      generationConfig: {
        // responseMimeType: "application/json",
        // temperature: 1,
        // topP: 0.95,
      },
    });

    const { response } = await chat.sendMessage(
      `Use AI To sort the following array based on a query, and return the array back to me with the filtered results. The array is as follows: ${JSON.stringify(
        array
      )}; The Query to filter by is as follows:${query}; IF THE QUERY DOES NOT TO RELATE TO AN ELEMENT OF THE ARRAY, REMOVE IT FROM THE FILTERED RESULTS. (RETURN THE BEST MATCH AT THE START OF THE ARRAY AND THE WORST MATCH AT THE END OF THE ARRAY). IF THE array HAS A TOPIC RELATED TO THE IDEA OF THE QUERY RETURN THE RESULT.  JUST RETURN THE ARRAY BACK TO ME; DO NOT GIVE ME CODE;`
    );
    const responseText = response;

    // Stores the conversation
    res.send({
      response: JSON.stringify(
        (responseText as any).candidates[0].content.parts[0].text as any
      ),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

app.post("/flashcards", async (req: Request, res: Response) => {
  await generateFlashcards(req, res);
});

app.get("/quote", async (req: Request, res: Response) => {
  await getQuote(req, res);
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

app.post("/resourcefinder", async (req: Request, res: Response) => {
  const { query } = req.body;
  const firstPage = await getFirstPage(query);

  res.send(firstPage);
});

app.post("/validation", async (req: Request, res: Response) => {
  await validationBasedOnPrompt(req, res);
});

app.post("/mcqprompt", async (req: Request, res: Response) => {
  await generateMCQFromPrompt(req, res);
});

app.post("/mcqimage", async (req: Request, res: Response) => {
  await generateMCQFromImage(req, res);
});

app.post("/frqprompt", async (req: Request, res: Response) => {
  await generateFRQFromPrompt(req, res);
});

app.post("/frqimage", async (req: Request, res: Response) => {
  await generateFRQFromImage(req, res);
});

app.post("/marketplace", async (req: Request, res: Response) => {
  await marketPlaceSearch(req, res);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
