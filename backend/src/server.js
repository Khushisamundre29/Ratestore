const express = require('express');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// node prefers ipv6 by default since v18, which causes connect ETIMEDOUT
// on networks that don't route ipv6 properly, forcing ipv4 fixes it
dns.setDefaultResultOrder('ipv4first');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', storeOwnerRoutes);

app.get('/', (req, res) => {
  res.send('ratestore api is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});