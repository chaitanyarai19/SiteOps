const Site = require('../models/Site');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    // Concurrently fetch counts from all relevant collections
    const [siteCount, ticketCount, userCount] = await Promise.all([
      Site.countDocuments(),
      Ticket.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      sites: siteCount,
      tickets: ticketCount,
      users: userCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

