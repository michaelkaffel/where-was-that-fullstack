import 'dotenv/config';
import mongoose from 'mongoose';

console.log('Working directory:', process.cwd());

const migrate = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const collection = mongoose.connection.collection('places');

    const indexes = await collection.indexes();
    const oldIndex = indexes.find(
        (idx) => idx.key.title === 1 && Object.keys(idx.key).length === 1 && idx.unique
    );

    if (oldIndex) {
        console.log(`Dropping old index: ${oldIndex.name}`);
        await collection.dropIndex(oldIndex.name);
    } else {
        console.log('No unique title found — nothing to drop.');
    }

    console.log('Current indexes:');
    console.log(await collection.indexes());

    await mongoose.disconnect();
}

migrate();