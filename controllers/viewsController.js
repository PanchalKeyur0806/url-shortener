const getHomepagePage = (req, res) => {
  res.render("index");
};

// authentication
const getRegisterPage = (req, res) => {
  res.render("authentication/register");
};

// login
const getLoginPage = (req, res) => {
  res.render("authentication/login");
};
export { getHomepagePage, getRegisterPage, getLoginPage };
