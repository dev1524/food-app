import cloudinary from "../utils/Cloudinary";

const CloudinaryImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    let base64 = Buffer.from(file.buffer).toString("base64");
    let dataUri = `data:${file.mimetype};base64,${base64}`;

    const updateResponse = await cloudinary.uploader.upload(dataUri, {
      folder: "food-panda",
    });
    return updateResponse.secure_url;
  } catch (error: any) {
    throw new Error("Image upload failed");
  }
};

export default CloudinaryImage;
