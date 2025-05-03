import { Plan } from "../models/planModel.js";

class AppFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const filter = {};
    let planSearch = null;

    // Handle status
    if (this.queryString.status) {
      const status = this.queryString.status.toLowerCase();
      if (status === "active") {
        filter.isActive = true;
      } else if (status === "notactive") {
        filter.isActive = false;
      }
    }

    // search for role
    if (this.queryString.role) {
      const role = this.queryString.role.toLowerCase().trim();
      if (role === "user") {
        filter.role = "user";
      } else if (role === "admin") {
        filter.role = "admin";
      }
    }

    // Handle search
    if (this.queryString.search) {
      const searchQuery = this.queryString.search.trim();

      if (searchQuery.includes(":")) {
        const [field, value] = searchQuery
          .split(":")
          .map((item) => item.trim());

        if (field === "plan") {
          // Store plan filter separately to use with populate
          planSearch = value;
        } else {
          filter[field] = { $regex: value, $options: "i" };
        }
      } else {
        const keyword = searchQuery;
        filter.$or = [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ];
      }
    }

    // Apply basic filters
    this.query = this.query.find(filter);

    // Apply plan search if needed
    if (planSearch) {
      this.query = this.query.populate({
        path: "plan",
        match: { name: { $regex: planSearch, $options: "i" } },
      });
    } else {
      this.query = this.query.populate("plan");
    }

    return this;
  }

  // paginate
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default AppFeatures;
