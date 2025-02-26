import {Injectable} from '@nestjs/common';
import * as admin from 'firebase-admin';
const serviceAccount = require('../../serviceAccountKeys.json');

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;
  constructor() {
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  getMessaging() {
    return this.firebaseApp.messaging();
  }
}
