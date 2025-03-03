const app = require('../server')
const User = require('../Entity/User')
const bcrypt = require('bcrypt')

exports.userCreation = async (req, res) => {
    try {
      const { username, email, password , confirmPassword } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      if( password !== confirmPassword)
      {
        return res.status(400).json({ message: 'passwords do not match' });
      }
      
      const checkUserExists = await User.findOne({ username });
      if (checkUserExists) {
        return res.status(400).json({ message: 'Username already used' });
      }
  
      const checkEmailExists = await User.findOne({ email });
      if (checkEmailExists) {
        return res.status(400).json({ message: 'Email already used' });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      //res.status(201).json({ message: 'User created successfully' });
      const serializedData = encodeURIComponent(JSON.stringify(user._id));
      res.redirect(`/chat?data=${serializedData}`);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

