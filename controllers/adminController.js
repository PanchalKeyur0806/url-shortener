const rendrAdminDashboard = (req, res) => {
  res.render("admin/adminDashboard", {
    title: "Admin Dashboard - url shortener",
  });
};

export { rendrAdminDashboard };
