const renderDashboard = (req, res) => {
  res.render("userDashboard/dashboard", {
    title: "user dashboard - url shortener",
  });
};

export { renderDashboard };
