# Query Builder-------------------------

1. এই কোডটি একটি Generic Query Builder Class। এটি Mongoose query-কে chain করে
   search, filter, sort, pagination ইত্যাদি সহজে করার জন্য ব্যবহার করা হয়।

2. class QueryBuilder<T>
   এখানে <T> হলো Generic Type।
   এর মানে এই QueryBuilder যেকোনো Model-এর সাথে কাজ করতে পারবে
   অর্থাৎ একই class বিভিন্ন Model-এর জন্য ব্যবহার করা যাবে।

3. public modelQuery: Query<T[], T>;
   এটি Mongoose-এর Query object। ----> TourModel.find()

4. এই ধরনের QueryBuilder pattern বড় Express + Mongoose project-এ খুবই জনপ্রিয়,
   কারণ একই search/filter/sort/pagination logic বিভিন্ন Model (Tour, User, Division, Booking ইত্যাদি)-এর জন্য পুনরায় ব্যবহার করা যায়।

# 5. src/QueryBuilder.ts-----------------------------------------

```js
//! class --get--all--tours--------------
class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //* filter---query----------------------
  filter(): this {
    const filter = { ...this.query };
    for (const field of excludeField) {
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }
  //* serachTerm-------------------------
  search(searchAbleField: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    //* searchTerm---------------------
    const searachQuery = {
      $or: searchAbleField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searachQuery);
    return this;
  }

  //* sort-------------------------
  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  //* sort-------------------------
  selectFields(): this {
    const selectfield = this.query.selectfield?.split(" ").join(" ") || "";
    this.modelQuery = this.modelQuery.select(selectfield);
    return this;
  }

  //* paganetion-------skip--limit------------------
  paganetion(): this {
    const page = Number(this.query.page) || 5;
    const limit = Number(this.query.limit) || 5;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  //* toure all count---------------------
  async getMeta() {
    const totalTour = await this.modelQuery.model.countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 5;

    const totalPage = Math.ceil(totalTour / limit);

    return { page, limit, total: totalTour, totalPage };
  }

  //* this.modelQuery-----------------------
  build() {
    return this.modelQuery;
  }
}
```

# 6. tour.service.ts-------------------------------

```js
const getTour = async (query: Record<string, string>) => {
  //* search---filter---
  const queryBuilder = new QueryBuilder(TourModel.find(), query);
  const tours = await queryBuilder
    .search(tourSearchAbleField)
    .filter()
    .sort()
    .selectFields()
    .paganetion();

  //* data = tours.build()-in result-----------
  //* meta = queryBuilder.getMeta()-in result----
  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    meta,
    data,
  };
};

```
