import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc Fetch all Products
// @route GET /api/products
// @access Public

const getProducts = asyncHandler(async (req, res) => {
  //below code fetches complete product data 
  // const products = await Product.find({});
  // res.json(products);

  // creating pagination in backend
  //pageSize variable tell per page howm many products need to be shown,
  //below code tells, per page need to show 4 products oly
  //const pageSize = 8;

    const pageSize = process.env.PAGINATION_LIMIT;
  // req.query.pageNumber -> we getting page from url, if url does not have any other page,
  //then it will be in page 1 oly
  const page = Number(req.query.pageNumber) || 1

  // below code is used to search product based on the keyword in url
  // req.query.keyword -> we getting keyword from url, if keyword matches, all related prdoucts
  // are shown, if not matched, it returns nothing
  //$option: 'i' = changes case sensitive
  const keyword = req.query.keyword ? 
  { name : { $regex : req.query.keyword, $options: 'i'}}
  : ''

  //to find total number of pages, countDocuments() is a method wch comes from mongoose
  // in count, we sending keyword as object becoz, it limits total no of pages
  const count = await Product.countDocuments({...keyword});

  //limit(pageSize) = limits number of products to displayed per page
  //skip = is used to skip 1st page product, if user is in 2nd page, if user is in 3 page, then 
  // it skips 1st and 2nd page like wise it continous 
  // keyword passed as object becoz , when search matches, it return oly tat particular products
  // in UI

  const products = await Product.find({...keyword})
  .limit(pageSize)
  .skip(pageSize * (page-1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) })

});

// @desc Fetch a Product
// @route GET /api/products/:id
// @access Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    //res.status(404).json({message: 'Product not Found'})
    res.status(404);
    throw new Error("Resource not Found");
  }
});

// @desc Create a Product
// @route POST /api/products
// @access Private/Admin

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReview: 0,
    description: "Sample  description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc Update a Product
// @route PUT /api/products/:id
// @access Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc Delete a Product
// @route DELETE /api/products/:id
// @access Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log("productid:", product);
  if (product) {
    await product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

//@desc Create New Product Review
//route POST /api/products/:id/reviews
//access PRIVATE

const createProductReview = asyncHandler(async(req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if(product){

    const alreadyReviewed = product.review.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if(alreadyReviewed){
      res.status(400);
      throw new Error("Product already reviewed")
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.review.push(review);

    product.numReview = product.review.length;

    product.rating = product.review.reduce((acc, review) => acc + review.rating, 0) /
    product.review.length;

    await product.save();
    res.status(201).json({ message : 'Review added' })
  } else{
    res.status(404);
    throw new Error("Product not found")
  }
})

//@desc Get top rated products
//route GET /api/products/top
//access PUBLIC

const getTopProducts = asyncHandler(async(req, res) => {

  const products = await Product.find({}).sort({ rating: -1}).limit(3)

  res.status(200).json(products)
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts
};
