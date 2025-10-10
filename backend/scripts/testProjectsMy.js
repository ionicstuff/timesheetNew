const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

(async () => {
  try {
    const user = await User.findOne({
      where: { isActive: true },
      order: [['id', 'ASC']],
    });
    if (!user) throw new Error('No active user');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const res = await axios.get('http://localhost:3000/api/projects/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data));
  } catch (e) {
    if (e.response) {
      console.error('HTTP', e.response.status, e.response.data);
    } else {
      console.error('Error', e.message);
    }
  } finally {
    process.exit(0);
  }
})();
