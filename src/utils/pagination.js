const { pagination } = require("../config");

const getOffset = (page, pageSize, sort) => {
  // Ensure that page and pageSize are numbers
  const parsedPage = parseInt(page) || pagination.default_page_number; // Fallback to 1 if NaN
  const parsedPageSize = parseInt(pageSize) || pagination.default_page_size; // Fallback to default size

  // Validate page and pageSize against config restrictions
  const validPage = Math.max(parsedPage, pagination.min_page_number);
  const validPageSize = Math.min(
    Math.max(parsedPageSize, pagination.min_page_size),
    pagination.max_page_size
  );

  return {
    page: validPage,
    sort: sort || [[pagination.default_sort_by, pagination.default_sort_order]], // Default sorting
    skip: (validPage - 1) * validPageSize,
    pageSize: validPageSize,
  };
};

const paginateResults = async (model, filter, options, include = []) => {
  // const { page = 1, pageSize = 10, skip = 0 } = options;
  const {
    page = pagination.default_page_number,
    pageSize = pagination.default_page_size,
    skip = pagination.default_skip,
    distinct = false,
  } = options;

  const totalDocs = await model.count({
    distinct,
    where: filter,
    include,
  });
  const totalPages = Math.ceil(totalDocs / pageSize);

  return {
    totalResults: totalDocs,
    pageSize,
    currentPage: page,
    totalPages: totalPages || 1,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    pagingCounter: skip + 1,
  };
};

module.exports = { getOffset, paginateResults };
