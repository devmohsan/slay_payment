const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function (1st Gen) to update payment status.
 */
exports.updatePaymentStatus = functions.https.onCall(async (data, context) => {
  // In v1, data is the first argument
  const userId = data.userId;

  if (!userId) {
    console.error("No userId provided.");
    throw new functions.https.HttpsError(
      "invalid-argument", 
      "The function must be called with a 'userId'."
    );
  }

  try {
    console.log(`Updating payment status for userId: ${userId}`);

    const enrollmentRef = db.collection("challenge_enrollments").doc(userId);
    const doc = await enrollmentRef.get();

    if (!doc.exists) {
      console.warn(`No enrollment document found for: ${userId}`);
      throw new functions.https.HttpsError(
        "not-found", 
        "No enrollment record found for this user."
      );
    }

    await enrollmentRef.update({
      paymentStatus: "paid",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { 
      success: true, 
      message: "Payment status updated to 'paid'." 
    };

  } catch (error) {
    console.error("Error:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "Internal error occurred.");
  }
});
