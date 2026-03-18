const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://jeettejani08:jeettejani%4008@caproject.aviugon.mongodb.net/caproject?retryWrites=true&w=majority&appName=caproject')
.then(async () => {
  console.log('Connected to correct DB.');
  
  const b1 = await User.findOneAndUpdate({ email: 'user1@example.com' }, { name: 'Prathana' }, {new: true});
  const b2 = await User.findOneAndUpdate({ email: 'user2@example.com' }, { name: 'Nitiksha' }, {new: true});
  
  console.log('Result 1:', b1 ? b1.name : 'Not Found');
  console.log('Result 2:', b2 ? b2.name : 'Not Found');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
