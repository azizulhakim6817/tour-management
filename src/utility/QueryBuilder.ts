/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField } from "../app/constents/tour.constant.js";

//! class --get--all--tours--------------
export class QueryBuilder<T> {
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
    //* searchTerm--
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

  //* fields-------------------------
  fields(): this {
    const field = this.query.field?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(field);
    return this;
  }

  //* paganetion-------skip--limit------------------
  pagination(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 5;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Execute Query ======================
  build() {
    return this.modelQuery;
  }

  //* toure all count---------------------
  async getMeta() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 5;

    const totalTour = await this.modelQuery.model.countDocuments();

    const totalPage = Math.ceil(totalTour / limit);

    return { page, limit, total: totalTour, totalPage };
  }
}
