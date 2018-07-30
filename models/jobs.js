const jobSchema = new Schema({
  title: String,
  company: String,
  type: String,
  description: String,
  salary: Number,
  journeyType: String,
  vacancies: Number,
  location: {type: {type: String}, coordinates: [Number]},
  applicants: ObjectId
});