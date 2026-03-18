const mongoose = require('mongoose');
const Subject = require('./models/Subject');

mongoose.connect('mongodb+srv://jeettejani08:jeettejani%4008@caproject.aviugon.mongodb.net/caproject?retryWrites=true&w=majority&appName=caproject')
.then(async () => {
  console.log('Connected to DB. Updating subject names...');
  
  await Subject.findOneAndUpdate({ name: 'Corporate & Other Laws' }, { name: 'Law', description: 'Company Law, LLP Act, General Clauses' });
  await Subject.findOneAndUpdate({ name: 'Cost & Management Accounting' }, { name: 'GST', description: 'Goods and Services Tax' });
  await Subject.findOneAndUpdate({ name: 'Taxation' }, { name: 'Tax' });
  
  console.log('Subject names updated successfully.');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
