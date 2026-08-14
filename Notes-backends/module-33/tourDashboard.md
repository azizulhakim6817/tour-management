# Tour Dashboard-------------------------------------

```js
//! get tour stats------------------------------------
const getTourStats = async () => {
  const totalTourPromise = TourModel.countDocuments();

  //* tourtypes aggregate-------------------------------
  const totalTourByTourTypePromise = TourModel.aggregate([
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourTypes",
        foreignField: "_id",
        as: "tourType",
      },
    },
    {
      $unwind: "$tourType",
    },
    {
      $group: {
        _id: "$tourType.name",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        tourType: "$_id",
        total: 1,
      },
    },
  ]);

  //* tour division -----------------------------------
  const totalTourDivisionPromise = TourModel.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    {
      $unwind: "$division",
    },
    {
      $group: {
        _id: "$division.name",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        division: "$_id",
        total: 1,
      },
    },
  ]);

  //* total booked------------------------------------
  const totalHighestBookedPromise = BookingModel.aggregate([
    {
      $group: {
        _id: "$tourId",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        bookingCount: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "tours",
        let: {
          localTourId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$localTourId"],
              },
            },
          },
        ],
        as: "tours",
      },
    },
    {
      $unwind: "$tours",
    },
    {
      $project: {
        bookingCount: 1,
        "tours.title": 1,
        "tours.slug": 1,
        "tours.location": 1,
        "tours.costFrom": 1,
      },
    },
  ]);

  //* tour avg by group aggregate-------------------------------
  const avgTourCostPromise = TourModel.aggregate([
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const [
    totalTour,
    totalTourByTourType,
    totalTourDivision,
    totalHighestBooked,
    avgTourCost,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypePromise,
    totalTourDivisionPromise,
    totalHighestBookedPromise,
    avgTourCostPromise,
  ]);

  return {
    totalTour,
    totalTourByTourType,
    totalTourDivision,
    totalHighestBooked,
    avgTourCost,
  };
};
```
