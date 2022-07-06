const mongoose = require('mongoose');

const connectionUrl = process.env.MONGO_URI
const conn = async () => {
  try {
    const connection = await mongoose.connect(connectionUrl,{
              useNewUrlParser: true,
              ssl: true,
              authSource: "admin",
    });

    console.log('connected to Mongo');
    return connection;
  } catch (error) {
    return console.log(error);
  }
};

conn();

module.exports = conn;
