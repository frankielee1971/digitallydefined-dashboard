import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFirestore } from '../_utils/firebaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { collection, id } = req.query;

    if (!collection || !id || typeof collection !== 'string' || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing collection or id' });
    }

    const db = getFirestore();
    const docRef = db.collection(collection).doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.status(200).json({ id: snap.id, data: snap.data() });
  } catch (error: any) {
    console.error('Firestore get error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
