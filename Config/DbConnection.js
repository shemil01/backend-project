const mongoos = require("mongoose");

const connectDb = async function () {
  try {
    await mongoos.connect(process.env.mongoDB_atlas)
    .then(() => {
      console.log("Data base connected");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDb;
