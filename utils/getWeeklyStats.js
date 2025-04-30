export const getWeeklyStats = async (
  Model,
  dateField = "createdAt",
  weeks = 1
) => {
  const now = new Date();
  const startDate = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);

  const pipeline = [
    {
      $match: {
        [dateField]: { $gte: startDate },
      },
    },
    {
      $addFields: {
        week: { $isoWeek: `$${dateField}` },
        year: { $isoWeekYear: `$${dateField}` },
      },
    },
    {
      $group: {
        _id: { week: "$week", year: "$year" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        weeks: {
          $push: {
            week: "$_id.week",
            year: "$_id.year",
            count: "$count",
          },
        },
        total: { $sum: "$count" },
      },
    },
    { $unwind: "$weeks" },
    {
      $project: {
        _id: 0,
        week: "$weeks.week",
        year: "$weeks.year",
        count: "$weeks.count",
        percentage: {
          $round: [
            { $multiply: [{ $divide: ["$weeks.count", "$total"] }, 100] },
            2,
          ],
        },
      },
    },
    { $sort: { year: 1, week: 1 } },
  ];

  return Model.aggregate(pipeline);
};
