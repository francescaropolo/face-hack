const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const jobSchema = new Schema({
  owner: { type: ObjectId, ref: 'User' },
  title: String,
  company: String,
  type: String,
  description: String,
  salary: Number,
  journeyType: String,
  vacancies: Number,
  // location: {type: {type: String}, coordinates: [Number]},
  // applicants: ObjectId
}, {
  timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;