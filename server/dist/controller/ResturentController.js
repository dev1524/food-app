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
exports.GetSingleResturent = exports.searchByCuisines = exports.searchByCityOrRestaurantName = exports.searchByLocation = exports.updateStatus = exports.GetOrders = exports.UpdateResturent = exports.GetResturent = exports.CreateResturent = void 0;
const ResturentSchema_1 = __importDefault(require("../models/ResturentSchema"));
const ImageUpload_1 = __importDefault(require("../helper/ImageUpload"));
const OrderSchema_1 = __importDefault(require("../models/OrderSchema"));
const RestaurentSchema_1 = require("../schema/RestaurentSchema");
const Restaurent_service_1 = require("../service/Restaurent.service");
const CreateResturent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body using Zod
        RestaurentSchema_1.createRestaurantSchema.parse(req.body);
        const { resturentName, city, country, deliveryPrice, deliveryTime, cusines, } = req.body;
        const file = req.file;
        const restaurant = yield (0, Restaurent_service_1.createRestaurantService)(req.id, resturentName, city, country, deliveryPrice, deliveryTime, cusines, file);
        return res.status(200).json({
            message: "Restaurant Created Successfully",
            success: true,
            restaurant,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message, success: false });
    }
});
exports.CreateResturent = CreateResturent;
const GetResturent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resturent = yield ResturentSchema_1.default.findOne({ user: req.id }).populate("menu");
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
    }
    catch (error) {
        console.error("Error fetching restaurant:", error);
        return res.status(500).json({
            message: "Error Occured",
            success: false,
        });
    }
});
exports.GetResturent = GetResturent;
const UpdateResturent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resturentName, city, country, deliveryPrice, deliveryTime, cusines, } = req.body;
        let file = req.file;
        const resturent = yield ResturentSchema_1.default.findOne({ user: req.id });
        if (!resturent) {
            return res.status(400).json({
                message: "No Resturent Found",
                success: false,
            });
        }
        const cuisinesArray = cusines
            .split(",")
            .map((cuisine) => cuisine.trim());
        resturent.resturentName = resturentName;
        resturent.city = city;
        resturent.country = country;
        resturent.deliveryTime = deliveryTime;
        resturent.deliveryPrice = deliveryPrice;
        resturent.cusines = cuisinesArray;
        if (file) {
            const imageUrl = yield (0, ImageUpload_1.default)(file);
            resturent.imageFile = imageUrl;
        }
        yield resturent.save();
        return res.status(200).json({
            message: "Resturent Updated Successfully",
            success: true,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error Occured to update Resturent",
            success: false,
        });
    }
});
exports.UpdateResturent = UpdateResturent;
const GetOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, Restaurent_service_1.GetOrderService)(req.id);
        return res.status(200).json({
            success: true,
            orders,
            message: "Orders Fetched Successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
});
exports.GetOrders = GetOrders;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { orderid } = req.params;
        let { status } = req.body;
        // order ko le aww konsa order ka status update karna ha
        const order = yield OrderSchema_1.default.findById(orderid);
        if (!order) {
            return res.status(400).json({
                message: "No Order Found",
                success: false,
            });
        }
        order.status = status;
        yield order.save();
        return res.status(200).json({
            message: "Status Updated Successfully",
            success: true,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error Occured to update Status",
            success: false,
        });
    }
});
exports.updateStatus = updateStatus;
const searchByLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const restaurants = yield ResturentSchema_1.default.find({
            $or: [{ resturentName: searchRegex }, { country: searchRegex }],
        });
        //  Save to Redis with 1 hour expiration
        // await redisClient.set(cacheKey, JSON.stringify(restaurants), { EX: 3600 });
        return res.status(200).json({
            success: true,
            data: restaurants,
            cached: false,
        });
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.searchByLocation = searchByLocation;
const searchByCityOrRestaurantName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const restaurants = yield ResturentSchema_1.default.find({
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
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
});
exports.searchByCityOrRestaurantName = searchByCityOrRestaurantName;
const searchByCuisines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cuisines } = req.body;
    try {
        let query = {};
        if (cuisines && cuisines.length > 0) {
            query.cusines = { $in: cuisines };
        }
        const restaurants = yield ResturentSchema_1.default.find(query);
        return res.status(200).json({
            success: true,
            data: restaurants,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching restaurants",
        });
    }
});
exports.searchByCuisines = searchByCuisines;
const GetSingleResturent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resturent = yield (0, Restaurent_service_1.GetSingleResturentService)(req.params.resturenId);
        return res.status(200).json({
            success: true,
            message: "Restaurant Fetched Successfully",
            resturent,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
});
exports.GetSingleResturent = GetSingleResturent;
//# sourceMappingURL=ResturentController.js.map