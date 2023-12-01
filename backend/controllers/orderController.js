import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

////////////////////// User Order Router ////////////////////////////
// @desc Create new Order
// @route POST /api/orders
// @access Private
const adddOrderItems = asyncHandler(async( req, res) => {
   const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice 
   } = req.body;

   //if there is no item in orderItems array
   if( orderItems && orderItems.length == 0){
        res.status(400)
        throw new Error('No order items')
   } else{
        const order = new Order({
        orderItems: orderItems.map((x) => ({
                        ...x, product: x._id, _id:undefined})),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice     
        })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
   }
}) 

// @desc Get logged in users Order
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async(req, res) => {
    //Order is a db
    const orders = await Order.find({user: req.user._id})
    res.status(200).json(orders)
})

// @desc Get order by id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async(req, res) => {
    //params_id whch is present in url, from tat id we r searching, populate is used
    //to get name and email from user model, since we dont have in order model
   const order = await Order.findById(req.params.id).populate('user', 'name email')

   if(order){
    res.status(200).json(order)
   } else{
    res.status(404)
    throw new Error('Order not found')
   }
})

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async(req, res) =>{
    const order = await Order.findById(req.params.id);

    if(order){
        order.isPaid = true,
        order.paidAt = Date.now();
        order.paymentResult = {
            // response comes from paypal
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder)
    } else{
        res.status(404)
        throw new Error('Order not found')
    }
})

////////////////////// User Order Router ////////////////////////////

// @desc Update order to delivered
// @route PUT /api/orders/:id/delivered
// @access Private/Admin
const updateOrderToDeliver = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)

    if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save()
    } else{
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc Get all order
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async(req, res) => {

    // {} ,we are find all orders of different users, hence we empty object'{}'
    //populate is used to get name and id from user model, since we dont have in order model
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders)
})

export {
    adddOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDeliver,
    getOrders
}