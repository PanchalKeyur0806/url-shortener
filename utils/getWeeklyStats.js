export const getStats = async (
  Model,
  dateField = "createdAt",
  period = 1,
  mode = "weekly" // can be "weekly" or "daily"
) => {
  const now = new Date();
  const periodInMs =
    mode === "weekly"
      ? period * 7 * 24 * 60 * 60 * 1000
      : period * 24 * 60 * 60 * 1000;
  const startDate = new Date(now.getTime() - periodInMs);

  const pipeline = [
    {
      $match: {
        [dateField]: { $gte: startDate },
      },
    },
    {
      $addFields:
        mode === "weekly"
          ? {
              week: { $isoWeek: `$${dateField}` },
              year: { $isoWeekYear: `$${dateField}` },
            }
          : {
              day: {
                $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` },
              },
            },
    },
    {
      $group:
        mode === "weekly"
          ? {
              _id: { week: "$week", year: "$year" },
              count: { $sum: 1 },
            }
          : {
              _id: "$day",
              count: { $sum: 1 },
            },
    },
    {
      $group: {
        _id: null,
        data: {
          $push:
            mode === "weekly"
              ? {
                  week: "$_id.week",
                  year: "$_id.year",
                  count: "$count",
                }
              : {
                  day: "$_id",
                  count: "$count",
                },
        },
        total: { $sum: "$count" },
      },
    },
    { $unwind: "$data" },
    {
      $project: {
        _id: 0,
        count: "$data.count",
        percentage: {
          $round: [
            { $multiply: [{ $divide: ["$data.count", "$total"] }, 100] },
            2,
          ],
        },
        ...(mode === "weekly"
          ? {
              week: "$data.week",
              year: "$data.year",
            }
          : {
              day: "$data.day",
            }),
      },
    },
    {
      $sort: mode === "weekly" ? { year: 1, week: 1 } : { day: 1 },
    },
  ];

  return Model.aggregate(pipeline);
};
