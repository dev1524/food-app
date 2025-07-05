import mongoose from "mongoose";
import OrderModel from "../models/OrderSchema";
import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
  const { user, resturent, cartItems, totalPrice } = req.body;

  try {
    const newOrder = await OrderModel.create({
      user,
      resturent,
      cartItems,
      totalPrice,
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};
// Get single Order

export const getOrders = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;

  try {
    const orders = await OrderModel.find({ user: userId }).populate({
      path: "resturent",
      select: "resturentName city country",
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user" });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Admin
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const orders = await OrderModel.find()
      .populate("resturent user", "fullname email phone address city country") // Populate only required fields
      .exec();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// update the status
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { status } = req.body; // New status (e.g., 'completed', 'shipped', etc.)

  if (!id || !status) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }
  try {
    const order = await OrderModel.findById(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update status
    order.status = status;
    await order.save();

    return res
      .status(200)
      .json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// User
