const app = require('../server')
const User = require('../Entity/User')
const bcrypt = require('bcrypt');


exports.loginlogic = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const user = await User.findOne({ username });

       if(user)
        {
           const check = await bcrypt.compare(password , user.password);
           if(check)
            {
              const serializedData = encodeURIComponent(JSON.stringify(user._id));
              res.redirect(`/chat?data=${serializedData}`);
            }
        }  
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

