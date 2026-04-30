import admin from 'firebase-admin';

let firebaseAdmin: admin.app.App;

if (!admin.apps.length) {
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}')
    )
  });
} else {
  firebaseAdmin = admin.app();
}

export default async function handler(req, res) {
  try {
    const db = firebaseAdmin.firestore();
    const snapshot = await db.collection('artifacts').get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ data });
  } catch (error) {
    console.error('Firestore error:', error);
    res.status(500).json({ error: 'Failed to fetch Firestore data' });
  }
}
