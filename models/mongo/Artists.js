var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  TimeStamp = Schema.Timestamp;

// Models
var ArtistSchema = new Schema({
  name: String,
  url: {
    index: true,
    type: String
  },
  pictureUrl: {
    index: true,
    type: String
  },
  _id: Number
});

var Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
