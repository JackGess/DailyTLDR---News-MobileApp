// entry point with V2 syntax

const {onCall, HttpsError}= require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp();
const db = admin.firestore();

const {getArticles, scrapeArticles} = require("./apiHelpers");
const {generateSummary} = require("./digestHelpers");


const generateDigestForUser = async (userId) => {
  logger.info(`Starting digest generation for user: ${userId}`)

  const profileRef = db.collection("profiles").doc(userId);
  const profileSnap = await profileRef.get();

  if(!profileSnap.exists) {
    throw new Error("User profile not found");
  }

  const profile = profileSnap.data();
  const topic = profile.topic || "Technology";
  const tone = profile.gemini_settings?.tone || "Informative";
  const format = profile.gemini_settings?.format || "A concise summary";

  // fetch news
  const articles = await getArticles(topic);
  if(!articles || articles.length === 0) {
    logger.warn(`No articles found for topic: ${topic}`);
    return {success: false, message: "No articles found for topic"};
  }

  //process articles at the same time
  const processingPromises = articles.map(async (article) => {
    try {
      // Scrape
      const markdown = await scrapeArticles(article.url);
      if(!markdown) {
        return null; // skip this url if scraping fails
      }

      // summarize
      const summary = await generateSummary(markdown, tone, format);
      if(!summary) {
        return null;
      }

      // return the combined result
      return {
        subheading: summary.headline,
        synopsis: summary.synopsis,
        key_takeaway: summary.key_takeaway,
        sentiment: summary.sentiment,
        source_url: article.url,
        original_title: article.title,
      };
    } catch (error) {
      logger.error(`Failed to process article: ${article.url}`, error);
      return null;
    }
  });

}


exports.genrateManualDigest = onCall(
  {
  cors: true,
  timeoutSeconds: 60,
  region: "us-west1"
  },
  async (request) => {
    if(!request.auth) {
     throw new HttpsError("Unauthenticated", "The Function must be called while authenticated.");
    }

    logger.info("Manual Digest Requested by: ", request.auth.uid);

    //todo: needs to  be connected

    return {message: "V2 Backend is alive!", success: true};
    }
  );


exports.dailyDigestJob = onSchedule(
  {
    schedule: "05 * * *",
    timeZone: "America/Edmonton",
    region: "us-west1"
  },
  async (event) => {
    logger.info("Starting Daily Digest Job...");
    //todo: logic to loop through all users
  }
);