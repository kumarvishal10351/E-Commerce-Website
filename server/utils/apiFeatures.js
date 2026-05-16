/**
 * SECTION: Query builder for list endpoints
 * Chains search, filter, sort, field selection, and pagination on Mongoose queries.
 */

// ─── APIFeatures class ───
/**
 * API Features class for search, filter, sort, and pagination.
 * Used with Mongoose queries to build powerful API endpoints.
 */
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // ─── search — keyword match on name, description, brand ───
  search() {
    if (this.queryStr.keyword) {
      const keyword = {
        $or: [
          { name: { $regex: this.queryStr.keyword, $options: 'i' } },
          { description: { $regex: this.queryStr.keyword, $options: 'i' } },
          { brand: { $regex: this.queryStr.keyword, $options: 'i' } },
        ],
      };
      this.query = this.query.find(keyword);
    }
    return this;
  }

  // ─── filter — query string fields ($gte, $lte, category, etc.) ───
  filter() {
    const queryCopy = { ...this.queryStr };

    // Fields to exclude from filtering
    const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields'];
    removeFields.forEach((field) => delete queryCopy[field]);

    // Advanced filtering with operators ($gte, $gt, $lte, $lt)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // ─── sort — custom sort or default newest first ───
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // ─── limitFields — sparse field projection ───
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  // ─── paginate — page/limit with skip ───
  paginate(resultPerPage) {
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || resultPerPage || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}

module.exports = APIFeatures;
