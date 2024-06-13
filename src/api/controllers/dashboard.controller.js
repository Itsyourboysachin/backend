const CustomerSupportTicket = require("../models/endUserTickets.model");

const ticketStatics = async (req, res) => {
  try {
    const stats = await CustomerSupportTicket.aggregate([
      {
        $facet: {
          totalTickets: [{ $count: "count" }],
          totalClosedTickets: [
            { $match: { status: "Closed" } },
            { $count: "count" },
          ],
          totalOpenTickets: [
            { $match: { status: "Open" } },
            { $count: "count" },
          ],
          totalPendingTickets: [
            { $match: { status: "Pending" } },
            { $count: "count" },
          ],
          averageCloseTime: [
            { $match: { status: "Closed" } },
            {
              $group: {
                _id: null,
                avgCloseTime: {
                  $avg: {
                    $subtract: ["$updatedAt", "$createdAt"],
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalTickets: { $arrayElemAt: ["$totalTickets.count", 0] },
          totalClosedTickets: {
            $arrayElemAt: ["$totalClosedTickets.count", 0],
          },
          totalOpenTickets: { $arrayElemAt: ["$totalOpenTickets.count", 0] },
          totalPendingTickets: {
            $arrayElemAt: ["$totalPendingTickets.count", 0],
          },
          averageCloseTime: {
            $cond: {
              if: { $gt: [{ $size: "$averageCloseTime" }, 0] },
              then: { $arrayElemAt: ["$averageCloseTime.avgCloseTime", 0] },
              else: null,
            },
          },
        },
      },
    ]);

    const statistics = stats[0];

    res.json({
      totalTickets: statistics.totalTickets || 0,
      totalClosedTickets: statistics.totalClosedTickets || 0,
      totalOpenTickets: statistics.totalOpenTickets || 0,
      totalPendingTickets: statistics.totalPendingTickets || 0,
      averageCloseTime: statistics.averageCloseTime
        ? statistics.averageCloseTime / (1000 * 60 * 60)
        : 0, // in hours
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching ticket statistics" });
  }
};

module.exports = ticketStatics;
