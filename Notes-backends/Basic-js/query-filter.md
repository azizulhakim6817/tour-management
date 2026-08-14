## req.query-------------------------

# 1. postman--> request---------->

1. title=Rajshahi Heritage Tour ---> title full to added---------
   ==> req.query---any field check--
   ==> http://localhost:5000/api/v1/tour?title=Rajshahi Heritage Tour

2. http://localhost:5000/api/vz1/tour?searchTerm=Heritage&location=Rajshahi

# 2. tour---> controller------------------------

```js
//! get tour----------------------------------
//* location=Dhaka(Dhaka)
//* serachTerm=Banany --> (Dhaka)
const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const tour = await TourServices.getTour(query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Tour Successfully",
      data: tour,
    });
  },
);
```

# 3. tour---> service---------------------------

```js
//! get tour type service-------------------------------------------------------
const getTour = async (query: Record<string, string>) => {
  const filter = query;
  const searchTerm = query.searchTerm || "";

  //* filter--> query---------------
  delete filter["searchTerm"];

  //* searchTerm---------------------

  const searachQuery = {
    $or: tourSearchAbleField.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  // tour count----------------------------
  const total = await TourModel.find().countDocuments();

  // tour find query by search-------------
  const tour = await TourModel.find(searachQuery).find(filter);

  return {
    meta: {
      total,
    },
    data: tour,
  };
};
```
