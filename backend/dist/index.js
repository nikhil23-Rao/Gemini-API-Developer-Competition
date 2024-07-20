"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketPlaceSearch = exports.generateFRQFromImage = exports.generateMCQFromImage = exports.generateFRQFromPrompt = exports.generateMCQFromPrompt = exports.validationBasedOnPrompt = exports.generateFlashcardsBasedOnPrompt = exports.assistUserImg = exports.assistUser = exports.generateFlashcardsBasedOnImage = exports.generateUnit = exports.getQuote = exports.generateFlashcards = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
const removeMd = require("remove-markdown");
const cors = require("cors");
const node_fetch_1 = __importDefault(require("node-fetch"));
// import puppeteerExtra from "puppeteer-extra";
// import stealthPlugin from "puppeteer-extra-plugin-stealth";
// import chromium from "@sparticuz/chromium";
const cheerio = __importStar(require("cheerio"));
// import fs from "graceful-fs";
// import axios from "axios";
function getFirstPage(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield (0, node_fetch_1.default)(`https://www.google.com/search?q=${query.split(" ").join("+")}`);
            const html = yield res.text();
            // get all a tags
            const $ = cheerio.load(html);
            const aTags = $("a");
            const h3s = [];
            const links = [];
            // get all a tags that have /url?q= in them
            aTags.each((i, aTag) => {
                const href = $(aTag).attr("href");
                if (href === null || href === void 0 ? void 0 : href.includes("/url?q=")) {
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
            const json = [];
            h3s.forEach((h3, i) => {
                json.push({ title: h3, link: links[i] });
            });
            return json;
        }
        catch (error) {
            console.log("error at getFirstPage", error.message);
        }
    });
}
// (async () => {
//   // const results = await getAllResults(query);
// })();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(cors());
// Setup gemini api
const configuration = new generative_ai_1.GoogleGenerativeAI(process.env.API_KEY);
const model = configuration.getGenerativeModel({ model: "gemini-1.5-pro" });
const fastModel = configuration.getGenerativeModel({
    model: "gemini-1.5-flash",
});
const search = configuration.getGenerativeModel({
    model: "gemini-1.0-pro",
});
const generateFlashcards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { response } = yield chat.sendMessage(`Generate a set of around 10 to 15 flashcards on the most important key terms, people, and/or concepts for ${prompt}; Provide answer in JSON format like so:[{term:"", definition:""}];`);
        const responseText = response;
        // Stores the conversation
        res.send({ response: responseText });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateFlashcards = generateFlashcards;
const getQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { response } = yield chat.sendMessage(`Give me a random quote to inspire a student; Provide in json object like: {quote:""}; DO NOT USE MARKDOWN;`);
        const responseText = response;
        // Stores the conversation
        res.send({ response: responseText });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getQuote = getQuote;
const generateUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
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
        const result = yield chat.sendMessageStream(`Provide a list of all the Unit content names in the class ${ap} ${ap.includes("AP")
            ? "according to the official Collegeboard's assigned units"
            : ""}; Follow JSON format of just [{name:}]`);
        let data = "";
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text());
                data = data.concat(chunk.text()); // also prints "42"
                console.log("DATA", data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Stores the conversation
        res.send({ response: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateUnit = generateUnit;
const safetySettings = [
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
    },
];
const generateFlashcardsBasedOnImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    try {
        const { image } = req.body;
        // Restore the previous context
        const chat = model.startChat({
            history: [],
            safetySettings,
        });
        const result = yield chat.sendMessageStream([
            `Generate a list of all flashcards based on the content in the image; COPYRIGHTED CONTENT IS OKAY TO USE; IF A DEFINITION IS BLANK, FILL IT IN TO THE BEST OF YOUR KNOWLEDGE; Return in JSON Format: [{term:"", definition:""}]; DON'T USE MARKDOWN`,
            { inlineData: { data: image, mimeType: "image/png" } },
        ]);
        let data = "";
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text());
                data = data.concat(chunk.text()); // also prints "42"
                console.log("DATA", data);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // const responseText = response;
        // Stores the conversation
        res.send({ response: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateFlashcardsBasedOnImage = generateFlashcardsBasedOnImage;
const assistUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_3, _b, _c;
    try {
        const { message, old } = req.body;
        let history = old;
        // Restore the previous context
        const chat = fastModel.startChat({
            history,
            safetySettings,
        });
        const result = yield chat.sendMessageStream([
            `You are a chatbot assisting a student with solving worksheet problems; If the query you are about to recieve is not related to solving questions for an educational class, please do not answer; Here is what you are to answer:${message}; RETURN YOUR ANSWER IN MARKDOWN AND PROVIDE STEP BY STEP EXPLANATIONS. `,
        ]);
        let data = "";
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text());
                data = data.concat(chunk.text()); // also prints "42"
                console.log("DATA", data);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // const responseText = response;
        // Stores the conversation
        res.send({ response: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.assistUser = assistUser;
const assistUserImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_4, _b, _c;
    try {
        const { img, details } = req.body;
        // Restore the previous context
        const chat = fastModel.startChat({
            history: [],
            safetySettings,
        });
        const result = yield chat.sendMessageStream([
            `You are a chatbot assisting a student with solving worksheet problems; Give a step by step explanation for the question in the image. If the image you are about to recieve is not related to solving questions for an educational class, please do not answer; For additonal details: ${details} RETURN YOUR ANSWER IN MARKDOWN AND PROVIDE STEP BY STEP EXPLANATIONS. ENSURE TO RETURN ANY TABLES OR MATH SYMBOLS IN MARKDOWN. `,
            {
                inlineData: { data: img, mimeType: "image/png" },
            },
        ]);
        let data = "";
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text());
                data = data.concat(chunk.text()); // also prints "42"
                console.log("DATA", data);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // const responseText = response;
        // Stores the conversation
        res.send({ response: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.assistUserImg = assistUserImg;
const generateFlashcardsBasedOnPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { response } = yield chat.sendMessage(`Generate a set of around 10 to 15 flashcards on the most important key terms, people, and/or concepts for ${prompt} for the class ${className}; Provide answer in JSON format like so:[{term:"", definition:""}];`);
        const responseText = response;
        // Stores the conversation
        res.send({ response: responseText });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateFlashcardsBasedOnPrompt = generateFlashcardsBasedOnPrompt;
const validationBasedOnPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { response } = yield chat.sendMessage(`Give me a number ranging from 1 to 100 (1 being not a suitable match, 100 being relatable content match) for "${input}" when related to "${className}"; DO NOT USE MARKDOWN; Return answer in JSON as so: {percentMatch:}`);
        const responseText = response;
        // Stores the conversation
        res.send({ response: responseText });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.validationBasedOnPrompt = validationBasedOnPrompt;
const generateMCQFromPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_5, _b, _c;
    try {
        const { length, chosenClass, style, topic } = req.body;
        // Restore the previous context
        const chat = model.startChat({
            history: [],
            safetySettings,
        });
        const result = yield chat.sendMessageStream([
            `Create a ${length} question MCQ set of ${style} questions on ${topic} for ${chosenClass};  IF THERE IS ANY EXTERNAL PASSAGES OR EXCERPTS NEEDED GENERATE THEM (DO NOT MAKE THEM HEADERS); IF ANY TABLES ARE NEEDED GENERATE THEM WITH MARKDOWN; DO NOT BASE THE QUESTION AROUND ANY IMAGES. Return answer in markdown format; SEPERATE ALL ANSWER OPTIONS WITH <br> AND FOR EACH QUESTION INCLUDE header BEFORE THE QUESTION SUCH AS: # Question 1; # Question 2; etc. for however many questions there are; AT THE VERY BOTTOM: provide an answer explanation header (using ##), and under it, fill it in for each choice in this format: Option A is the correct answer because...; IF CHOICE IS WRONG SAY: Option A is the wrong answer because...(Use the real corect/wrong answers)`,
        ]);
        let data = "";
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text());
                data = data.concat(chunk.text()); // also prints "42"
                console.log("DATA", data);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_5) throw e_5.error; }
        }
        // const responseText = response;
        // Stores the conversation
        res.send({ response: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateMCQFromPrompt = generateMCQFromPrompt;
const generateFRQFromPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_6, _b, _c;
    try {
        const { length, chosenClass, style, topic } = req.body;
        // Restore the previous context
        const chat = model.startChat({
            history: [],
            safetySettings,
        });
        const result = yield chat.sendMessageStream([
            `Create a ${length} question FRQ set of questions similar to the "concepts/question related to: ${topic}" for ${chosenClass}; IF THERE IS ANY EXTERNAL PASSAGES OR EXCERPTS NEEDED GENERATE THEM; DO NOT BASE THE QUESTION AROUND ANY IMAGES. Return answer in markdown format; SEPERATE ALL ANSWER OPTIONS WITH <br> FOR EACH QUESTION INCLUDE header BEFORE THE QUESTION SUCH AS: #Question 1; #Question 2; etc. for however many questions there are; AT THE VERY BOTTOM: provide an answer explanation header (using ##), and under it, fill in the correct answer for each frq part`,
        ]);
        let data = "";
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text());
                data = data.concat(chunk.text()); // also prints "42"
                console.log("DATA", data);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_6) throw e_6.error; }
        }
        // const responseText = response;
        // Stores the conversation
        res.send({ response: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateFRQFromPrompt = generateFRQFromPrompt;
const generateMCQFromImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_7, _b, _c;
    try {
        const { image, chosenClass, length, style } = req.body;
        // Restore the previous context
        const chat = model.startChat({
            history: [],
            safetySettings,
        });
        const result = yield chat.sendMessageStream([
            `Create a ${length} question MCQ set of ${style} questions similar to the question in the image for ${chosenClass};  IF THERE IS ANY EXTERNAL PASSAGES OR EXCERPTS NEEDED GENERATE THEM (DO NOT MAKE THEM HEADERS); IF ANY TABLES ARE NEEDED GENERATE THEM WITH MARKDOWN; DO NOT BASE THE QUESTION AROUND ANY IMAGES. Return answer in markdown format; SEPERATE ALL ANSWER OPTIONS WITH <br> AND FOR EACH QUESTION INCLUDE header BEFORE THE QUESTION SUCH AS: # Question 1; # Question 2; etc. for however many questions there are; AT THE VERY BOTTOM: provide an answer explanation header (using ##), and under it, fill it in for each choice in this format: Option A is the correct answer because...; IF CHOICE IS WRONG SAY: Option A is the wrong answer because...(Use the real corect/wrong answers)`,
            { inlineData: { data: image, mimeType: "image/png" } },
        ]);
        let data = "";
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text());
                data = data.concat(chunk.text()); // also prints "42"
                console.log("DATA", data);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_7) throw e_7.error; }
        }
        // const responseText = response;
        // Stores the conversation
        res.send({ response: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateMCQFromImage = generateMCQFromImage;
const generateFRQFromImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_8, _b, _c;
    try {
        const { length, chosenClass, style, image } = req.body;
        // Restore the previous context
        const chat = model.startChat({
            history: [],
            safetySettings,
        });
        const result = yield chat.sendMessageStream([
            `Create a ${length} question FRQ set of questions similar to the "concepts/question tested in the image" for ${chosenClass}; IF THERE IS ANY EXTERNAL PASSAGES OR EXCERPTS NEEDED GENERATE THEM; DO NOT BASE THE QUESTION AROUND ANY IMAGES. Return answer in markdown format; SEPERATE ALL ANSWER OPTIONS WITH <br> FOR EACH QUESTION INCLUDE header BEFORE THE QUESTION SUCH AS: #Question 1; #Question 2; etc. for however many questions there are; AT THE VERY BOTTOM: provide an answer explanation header (using ##), and under it, fill in the correct answer for each frq part`,
            { inlineData: { data: image, mimeType: "image/png" } },
        ]);
        let data = "";
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text());
                data = data.concat(chunk.text()); // also prints "42"
                console.log("DATA", data);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_8) throw e_8.error; }
        }
        // const responseText = response;
        // Stores the conversation
        res.send({
            response: data,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateFRQFromImage = generateFRQFromImage;
const marketPlaceSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { response } = yield chat.sendMessage(`Use AI To sort the following array based on a query, and return the array back to me with the filtered results. The array is as follows: ${JSON.stringify(array)}; The Query to filter by is as follows:${query}; IF THE QUERY DOES NOT TO RELATE TO AN ELEMENT OF THE ARRAY, REMOVE IT FROM THE FILTERED RESULTS. (RETURN THE BEST MATCH AT THE START OF THE ARRAY AND THE WORST MATCH AT THE END OF THE ARRAY). IF THE array HAS A TOPIC RELATED TO THE IDEA OF THE QUERY RETURN THE RESULT.  IF NO RESULTS IN THE ARRAY MATCH THE QUERY: RETURN AN EMPTY ARRAY. JUST RETURN THE ARRAY BACK TO ME; DO NOT GIVE ME CODE;`);
        const responseText = response;
        // Stores the conversation
        res.send({
            response: JSON.stringify(responseText.candidates[0].content.parts[0].text),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.marketPlaceSearch = marketPlaceSearch;
app.post("/flashcards", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.generateFlashcards)(req, res);
}));
app.get("/quote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.getQuote)(req, res);
}));
app.post("/get-AP-unit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.generateUnit)(req, res);
}));
app.post("/flashcardPrompt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.generateFlashcardsBasedOnPrompt)(req, res);
}));
app.post("/flashcardImage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.generateFlashcardsBasedOnImage)(req, res);
}));
app.post("/resourcefinder", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    const firstPage = yield getFirstPage(query);
    res.send(firstPage);
}));
app.post("/validation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.validationBasedOnPrompt)(req, res);
}));
app.post("/mcqprompt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.generateMCQFromPrompt)(req, res);
}));
app.post("/mcqimage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.generateMCQFromImage)(req, res);
}));
app.post("/frqprompt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.generateFRQFromPrompt)(req, res);
}));
app.post("/frqimage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.generateFRQFromImage)(req, res);
}));
app.post("/marketplace", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.marketPlaceSearch)(req, res);
}));
app.post("/assist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.assistUser)(req, res);
}));
app.post("/assistimg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.assistUserImg)(req, res);
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
