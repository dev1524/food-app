import ResturentModel from "../models/ResturentSchema";
import { Request, Response } from "express";
import CloudinaryImage from "../helper/ImageUpload";
import OrderModel from "../models/OrderSchema";
import { createRestaurantSchema } from "../schema/RestaurentSchema";
import {
  createRestaurantService,
  GetOrderService,
  GetSingleResturentService,
} from "../service/Restaurent.service";

export const CreateResturent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Validate request body using Zod
    createRestaurantSchema.parse(req.body);

    const {
      resturentName,
      city,
      country,
      deliveryPrice,
      deliveryTime,
      cusines,
    } = req.body;
    const file = req.file;

    const restaurant = await createRestaurantService(
      req.id,
      resturentName,
      city,
      country,
      deliveryPrice,
      deliveryTime,
      cusines,
      file
    );

    return res.status(200).json({
      message: "Restaurant Created Successfully",
      success: true,
      restaurant,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

export const GetResturent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const resturent = await ResturentModel.findOne({ user: req.id }).populate(
      "menu"
    );

    if (!resturent) {
      return res.status(400).json({
        message: "No Resturent Found",
        success: false,
        resturent: null,
      });
    }

    return res.status(200).json({
      resturent,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return res.status(500).json({
      message: "Error Occured",
      success: false,
    });
  }
};

export const UpdateResturent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      resturentName,
      city,
      country,
      deliveryPrice,
      deliveryTime,
      cusines,
    } = req.body;

    let file = req.file;

    const resturent = await ResturentModel.findOne({ user: req.id });
    if (!resturent) {
      return res.status(400).json({
        message: "No Resturent Found",
        success: false,
      });
    }
    const cuisinesArray = cusines
      .split(",")
      .map((cuisine: any) => cuisine.trim());

    resturent.resturentName = resturentName;
    resturent.city = city;
    resturent.country = country;
    resturent.deliveryTime = deliveryTime;
    resturent.deliveryPrice = deliveryPrice;
    resturent.cusines = cuisinesArray;

    if (file) {
      const imageUrl = await CloudinaryImage(file as Express.Multer.File);
      resturent.imageFile = imageUrl;
    }

    await resturent.save();

    return res.status(200).json({
      message: "Resturent Updated Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured to update Resturent",
      success: false,
    });
  }
};

export const GetOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await GetOrderService(req.id);
    return res.status(200).json({
      success: true,
      orders,
      message: "Orders Fetched Successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { orderid } = req.params;
    let { status } = req.body;
    // order ko le aww konsa order ka status update karna ha
    const order = await OrderModel.findById(orderid);

    if (!order) {
      return res.status(400).json({
        message: "No Order Found",
        success: false,
      });
    }
    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Status Updated Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured to update Status",
      success: false,
    });
  }
};

export const searchByLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { mainSearch } = req.query;

  try {
    if (typeof mainSearch !== "string") {
      return res.status(400).json({ message: "mainSearch is required" });
    }

    // const cacheKey = `search:${mainSearch.toLowerCase()}`;

    // //  Try getting cached result
    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   return res.status(200).json({
    //     success: true,
    //     data: JSON.parse(cachedData),
    //     cached: true,
    //   });
    // }

    //  If not cached, fetch from MongoDB
    const searchRegex = new RegExp(mainSearch, "i");
    const restaurants = await ResturentModel.find({
      $or: [{ resturentName: searchRegex }, { country: searchRegex }],
    });

    //  Save to Redis with 1 hour expiration
    // await redisClient.set(cacheKey, JSON.stringify(restaurants), { EX: 3600 });

    return res.status(200).json({
      success: true,
      data: restaurants,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const searchByCityOrRestaurantName = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { searchQuery } = req.query; // This will be the single input for both city and restaurantName

  try {
    if (typeof searchQuery !== "string") {
      return res.status(400).json({ message: "searchQuery is required" });
    }

    // const cacheKey = `cityOrRestaurantName_search:${searchQuery.toLowerCase()}`;

    // const cachedData = await redisClient.get(cacheKey);

    // if (cachedData) {
    //   return res.status(200).json({
    //     success: true,
    //     data: JSON.parse(cachedData),
    //     cached: true,
    //   });
    // }

    const searchRegex = new RegExp(searchQuery, "i"); // Case-insensitive search

    // Search for either restaurantName or city
    const restaurants = await ResturentModel.find({
      $or: [
        { resturentName: searchRegex },
        { city: searchRegex },
        { cusines: searchRegex },
      ],
    });

    // /  Save to Redis with 1 hour expiration
    // await redisClient.set(cacheKey, JSON.stringify(restaurants), { EX: 3600 });

    return res.status(200).json({
      success: true,
      data: restaurants,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Error fetching restaurants", error });
  }
};

export const searchByCuisines = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { cuisines } = req.body;
  try {
    let query: any = {};
    if (cuisines && cuisines.length > 0) {
      query.cusines = { $in: cuisines };
    }

    const restaurants = await ResturentModel.find(query);
    return res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching restaurants",
    });
  }
};

export const GetSingleResturent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const resturent = await GetSingleResturentService(req.params.resturenId);
    return res.status(200).json({
      success: true,
      message: "Restaurant Fetched Successfully",
      resturent,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
