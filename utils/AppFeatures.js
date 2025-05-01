import { Plan } from "../models/planModel.js";

class AppFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      const searchQuery = this.queryString.search.trim();

      if (searchQuery.includes(":")) {
        const [field, value] = searchQuery
          .split(":")
          .map((item) => item.trim());

        if (field === "plan") {
          // For plan searches, we need to handle populated fields differently
          // But we shouldn't break the query chain
          this.query = this.query.find({}).populate({
            path: "plan",
            match: { name: { $regex: value, $options: "i" } },
          });

          // This ensures we only return users whose plans match after population
          // We need to add a post-processing step in the controller
        } else {
          // For other fields, search normally
          this.query = this.query.find({
            [field]: { $regex: value, $options: "i" },
          });
        }
      } else {
        // For general search without field specification
        const keyword = searchQuery;

        this.query = this.query
          .find({
            $or: [
              { name: { $regex: keyword, $options: "i" } },
              { email: { $regex: keyword, $options: "i" } },
              // We can't directly search plan.name here, so we'll add post-processing
            ],
          })
          .populate("plan");
      }
    }

    return this;
  }
}

export default AppFeatures;
