const buildPaginationOpts = req => ({
  page: parseInt(req.query.page, 10) || 1,
  paginate: parseInt(req.query.per_page, 10) || 20,
});

// decorate paginated result to build similar structure of (deprecated) getPaginatedItems
const decoratePaginatedResult = (paginatedResult, paginationOpts) => ({
  page: paginationOpts.page,
  per_page: paginationOpts.paginate,
  total_pages: paginatedResult.pages,
  total: paginatedResult.total,
  items: paginatedResult.docs,
});

module.exports = {
  buildPaginationOpts,
  decoratePaginatedResult,
};
