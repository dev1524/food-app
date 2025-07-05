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
const Cloudinary_1 = __importDefault(require("../utils/Cloudinary"));
const CloudinaryImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let base64 = Buffer.from(file.buffer).toString("base64");
        let dataUri = `data:${file.mimetype};base64,${base64}`;
        const updateResponse = yield Cloudinary_1.default.uploader.upload(dataUri, {
            folder: "food-panda",
        });
        return updateResponse.secure_url;
    }
    catch (error) {
        throw new Error("Image upload failed");
    }
});
exports.default = CloudinaryImage;
//# sourceMappingURL=ImageUpload.js.map