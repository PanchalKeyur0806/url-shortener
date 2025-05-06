import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  subject: {
    type: String,
    trim: true,
    required: true,
  },
  message: {
    type: String,
    trim: true,
    required: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
