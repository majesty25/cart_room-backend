import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';
import path from 'path';

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://auction-c5969.appspot.com', // 🔁 Update this
});

const bucket = getStorage().bucket();

export { bucket };
