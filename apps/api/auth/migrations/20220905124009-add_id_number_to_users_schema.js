module.exports = {
  async up(db, client) {
    // add id_number to users collection.
    await db.collection("users").updateMany(
      {},
      {
        $set: {
          id_number: "",
        },
      }
    );
  },

  async down(db, client) {
    // remove id_number from users collection.
    await db.collection("users").updateMany(
      {},
      {
        $unset: {
          id_number: "",
        },
      }
    );
  },
};
