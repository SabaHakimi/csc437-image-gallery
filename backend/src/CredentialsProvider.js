import bcrypt from "bcrypt";
import { getEnvVar } from "./getEnvVar.js";

export class CredentialsProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const credsCollectionName = getEnvVar("CREDS_COLLECTION_NAME");
        const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");
        this.credsCollection = this.mongoClient.db().collection(credsCollectionName);
        this.usersCollection = this.mongoClient.db().collection(usersCollectionName);
    }

    async registerUser(username, email, password) {
        const existingUser = await this.credsCollection.findOne({ username });
        if (existingUser) {
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await this.credsCollection.insertOne({
            username: username,
            password: hashedPassword
        });

        await this.usersCollection.insertOne({
            username: username,
            email: email
        });

        return true;
    }

    async verifyPassword(username, password) {
        const user = await this.credsCollection.findOne({ username });
        if (!user) {
            return false;
        }

        return bcrypt.compare(password, user.password);
    }
}
