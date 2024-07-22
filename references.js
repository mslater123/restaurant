const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const personSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const author = new Person({
      _id: new mongoose.Types.ObjectId(),
      name: 'Ian Fleming',
      age: 50
    });

    await author.save();

    const story1 = new Story({
      title: 'Casino Royale',
      author: author._id // assign the _id from the person
    });

    await story1.save();

    const story = await Story.findOne({ title: 'Casino Royale' }).populate('author').exec();
    console.log('The author is %s', story.author.name);
  } catch (error) {
    console.error(error);
  }

  await mongoose.disconnect();
}

run();
