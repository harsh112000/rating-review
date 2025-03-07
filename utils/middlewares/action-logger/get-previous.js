const getPreviousData = async (model, id) => {
  try {
    console.log(`Fetching previous data for model: ${model.name}, ID: ${id}`);
    const previousData = await model.findByPk(id);

    if (!previousData) {
      console.log(`No previous data found for ID: ${id} in model: ${model.name}`);

      return {};
    }

    return previousData.toJSON();
  } catch (err) {
    console.error('Error fetching previous data:', err);
    throw err;
  }
};

module.exports = getPreviousData;
