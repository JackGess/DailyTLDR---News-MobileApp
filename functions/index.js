// entry point with V2 syntax

const {onCall, HttpsError}= require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

const apiHelpers = require("./apiHelpers");
const digestHelpers = require("./digestHelpers");


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
