# tour --> sort()-------------------

1. sort(1) --> Ascending(asc)
2. sort(-1) ---> Descending(dsce)
3. 1. sort("createdAt"); ---> Ascending, 2. sort("-createdAt");---> Descending
4. logical condition--------------

   ```js
   const sortOrder = query.sort === "desc" ? -1 : 1;
   const tours = await TourModel.find().sort({ costFrom: sortOrder });
   ```

```

```

# 5. postman---sort=-location --> (desc)-------------------

http://localhost:5000/api/v1/tour?sort=-location --> (desc)

# 6. searchTerm=Heritage&sort=Rajshahi&location=Rajshahi----------

http://localhost:5000/api/v1/tour?searchTerm=Heritage&sort=Rajshahi&location=Rajshahi

# 7. ---> tour.constent.ts-------------------------------

export const tourSearchAbleField = ["title", "description", "location"];

# 8. query from delete==> delete filter["searchTerm"];-----delete filter["sort"];-------------

```js
const getTour = async (query: Record<string, string>) => {
  const filter = query;
  const searchTerm = query.searchTerm || "";
  const sort = query.sort || "-createdAt";

  //console.log(filter); // {searchTerm: 'Heritage',sort: 'Rajshahi',location: 'Rajshahi'}

  //* filter--> query---------------
  for (const field of excludeField) {
    delete filter[field];
  }
  // delete filter["searchTerm"];
  // delete filter["sort"];

  //console.log(filter); // {location: 'Rajshahi'}

```

# 8. tour.service.ts----------------

```js
//! get tour type service-------------------------------------------------------
const getTour = async (query: Record<string, string>) => {
  const filter = query;

  // Before--> console.log(filter); // {searchTerm: 'Heritage',sort: 'Rajshahi',location: //'Rajshahi'}

  const searchTerm = query.searchTerm || "";
  const sort = query.sort || "-createdAt";

  //* filter--> query---------------
  delete filter["searchTerm"];
  delete filter["sort"];


  // After--> console.log(filter); // {location: 'Rajshahi'}

  //* searchTerm---------------------
  const searachQuery = {
    $or: tourSearchAbleField.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  //* tour count----------------------------
  const total = await TourModel.find().countDocuments();

  //* tour find query by search-------------
  const tour = await TourModel.find(searachQuery).find(filter).sort(sort);

  return {
    meta: {
      total,
    },
    data: tour,
  };
};

```
