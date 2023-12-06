const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Filtering = require('../utils/filterQuerystring');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc || doc === 'null') {
      return new AppError('No Document found with that ID', 404);
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = Model.create(req.body);
    res.status(201).json({
      status: 'success',
      doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return new AppError('No document found with that ID', 404);
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc || doc === 'null') {
      return new AppError('No document found with that ID', 404);
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested GET reviews on tour (hack)
    const queryObj = new Filtering(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // get all the fields that are not allowed to be filtered
    const doc = await queryObj.query;
    res.status(200).json({
      status: 'sucess',
      results: doc.length,
      data: doc,
    });
  });
