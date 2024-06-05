const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['number_min', 'number_max', 'boolean']
  },
  minValue: {
    type: Number,
    required: function () {
      return this.type === 'number_min';
    }
  },
  maxValue: {
    type: Number,
    required: function () {
      return this.type === 'number_max';
    }
  },
  booleanValue: {
    type: Boolean,
    required: function () {
      return this.type === 'boolean';
    }
  },
  jobId: {
    type: mongoose.Types.ObjectId,
    ref: 'Job'
  }
}, {versionKey: false});


const Questionnaire = mongoose.model('Questionnaire', QuestionSchema);

module.exports = Questionnaire;
