const { Sample: SampleService } = require('../services');

const save = async (req, res) => {
  await SampleService.save();

  return res.getRequest();
};

module.exports = { save };
