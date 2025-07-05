"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getOrders = exports.createOrder = void 0;
const OrderSchema_1 = __importDefault(require("../models/OrderSchema"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, resturent, cartItems, totalPrice } = req.body;
    try {
        const newOrder = yield OrderSchema_1.default.create({
            user,
            resturent,
            cartItems,
            totalPrice,
        });
        res.status(201).json({ success: true, order: newOrder });
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
});
exports.createOrder = createOrder;
// Get single Order
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const orders = yield OrderSchema_1.default.find({ user: userId }).populate({
            path: "resturent",
            select: "resturentName city country",
        });
        if (!orders || orders.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "No orders found for this user" });
        }
        res.status(200).json({ success: true, orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
});
exports.getOrders = getOrders;
// Admin
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield OrderSchema_1.default.find()
            .populate("resturent user", "fullname email phone address city country") // Populate only required fields
            .exec();
        return res.status(200).json({ success: true, orders });
    }
    catch (error) {
        console.error("Error fetching all orders:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.getAllOrders = getAllOrders;
// update the status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body; // New status (e.g., 'completed', 'shipped', etc.)
    if (!id || !status) {
        return res.status(400).json({ success: false, message: "Invalid input" });
    }
    try {
        const order = yield OrderSchema_1.default.findById(id);
        if (!order) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }
        // Update status
        order.status = status;
        yield order.save();
        return res
            .status(200)
            .json({ success: true, message: "Order status updated" });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// User
//# sourceMappingURL=OrderController.js.map