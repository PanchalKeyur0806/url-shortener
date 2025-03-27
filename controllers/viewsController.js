const getHomepagePage = (req, res) => {
  res.render("index");
};

const getRegisterPage = (req, res) => {
  res.render("register");
};

export { getHomepagePage, getRegisterPage };
