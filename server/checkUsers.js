const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://jeettejani08:jeettejani%4008@caproject.aviugon.mongodb.net/?appName=caproject')
.then(async () => {
  const users = await User.find({});
  console.log('All Users in DB:');
  users.forEach(u => console.log(`Email: ${u.email}, Name: ${u.name}`));
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
