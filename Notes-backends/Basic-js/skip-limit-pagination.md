# Pagination------------------------------------

0. Postmen request----------------------
   http://localhost:5000/api/v1/tour?page=1&limit=5

1. skip---------------
   --> [remove][remove][remove][remove][skip][1][2][3][4][5]
   --> Tour.find().skip(2);

2. Limit(5)
   --> [1][2][3][4][5][limit][remove][remove][remove][remove][remove][remove]
   --> Tour.find().limit(2);

3. 1 page --> Skip(0)--[1][2][3][4][5]
   2 page --> Skip(5)--[skip][skip][skip][skip]---Limit(5)-[1][2][3][4][5]
   2 page --> Skip(5)--[skip][skip][skip][skip]--skip(10)--[skip][skip][skip][skip]---Limit(5)-[1][2][3][4][5]

4. Calculatioin--------------------

delete fields----------------------

```js
//! app/constent/tour.constent-------- delete fields---------------------------
export const excludeField = [
  "searchTerm",
  "sort",
  "selectfields",
  "page",
  "limit",
];
```

code--------------------------

```js
//* skip--limit-------------------------------
const query = req.query;

const page = Number(query.page) || 1;
const limit = Number(query.limit) || 5;
const skip = (page - 1) * limit;

const tours = await TourModel.find().skip(skip).limit(limit);
```

5. tour.service.ts---------full code-----------------------

```js
//! get tour type service-------------------------------------------------------
// const getTour = async (query: Record<string, string>) => {
const filter = query;
const searchTerm = query.searchTerm || "";
const sort = query.sort || "-createdAt";

//* skip--limit-------------------------------
const page = Number(query.page) || 5;
const limit = Number(query.limit) || 5;
const skip = (page - 1) * limit;

//* field-1 filtering--------------------------
const selectfields = query.selectfields || "";
//* field-2 filtering-(multi-field)-------------------------
//const selectfields = query.selectfields?.split(" ").join(" ") || "";

//console.log(filter); // {searchTerm: 'Heritage',sort: 'Rajshahi',location: 'Rajshahi'}

//* filter----query---------------
for (const field of excludeField) {
  delete filter[field];
}
// delete filter["searchTerm"];
// delete filter["sort"];

//console.log(filter); // {location: 'Rajshahi'}

//* searchTerm---------------------
const searachQuery = {
  $or: tourSearchAbleField.map((field) => ({
    [field]: { $regex: searchTerm, $options: "i" },
  })),
};

//* tour count----------------------------
const totalTours = await TourModel.find().countDocuments();

//* meta_data_details_page------------------
// const totalPage = 20/5 == ciel(2.1) => 3
const totalPage = Math.ceil(totalTours / limit);

const meta = {
  page: page,
  totals: totalTours,
  limit: limit,
  totalPage: totalPage,
};

//* tour find query by search-------------
const tours = await TourModel.find(searachQuery)
  .find(filter)
  .sort(sort)
  .select(selectfields)
  .skip(skip)
  .limit(limit);

//* Alternative method -- find()==========
/*  const filterQuery = TourModel.find(filter);
  const tours = filterQuery.find(searachQuery);
  const allTours = await tours
    .find()
    .sort(sort)
    .select(selectfields)
    .skip(skip)
    .limit(limit); */

return {
  tour_pages_details: meta,
  meta: {
    totalTours,
  },
  data: tours,
};
```
