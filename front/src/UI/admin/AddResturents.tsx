import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useResturent from "@/store/UseResturent";
import { ResturentTypes } from "@/schema/ResturentSchema";
import { toast } from "sonner";

const AddResturents = () => {
  const {
    loading,
    createResturents,
    resturent,
    updateResturent,
    getResturent,
  } = useResturent();
  const [Error, setError] = useState<Partial<ResturentTypes>>({});

  const [ResturentForm, setResturentForm] = useState<ResturentTypes>({
    resturentName: "",
    city: "",
    country: "",
    deliveryTime: 10,
    deliveryPrice: 100,
    cusines: [],
    image: undefined,
  });

  const ChangeInptHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setResturentForm({
      ...ResturentForm,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // file handler

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResturentForm((prev) => ({ ...prev, image: file }));
  };

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("resturentName", ResturentForm.resturentName);
      formdata.append("city", ResturentForm.city);
      formdata.append("country", ResturentForm.country);
      formdata.append("deliveryTime", String(ResturentForm.deliveryTime));
      formdata.append("deliveryPrice", String(ResturentForm.deliveryPrice));
      formdata.append("cusines", ResturentForm.cusines.join(","));

      if (ResturentForm.image) {
        formdata.append("image", ResturentForm.image);
      }

      if (!resturent) {
        await createResturents(formdata);
      } else {
        await updateResturent(formdata);
      }
      setResturentForm({
        resturentName: "",
        city: "",
        country: "",
        deliveryTime: 10,
        deliveryPrice: 100,
        cusines: [],
        image: undefined,
      });
      window.location.href = "/";
      setError({});
    } catch (error: any) {
      toast.error(error.message || "Error creating restaurant");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getResturent();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (resturent) {
      setResturentForm({
        resturentName: resturent.resturentName || "",
        city: resturent.city || "",
        country: resturent.country || "",
        deliveryTime: resturent.deliveryTime || 10,
        deliveryPrice: resturent.deliveryPrice || 100,
        cusines: resturent.cusines || [],
        image: undefined,
      });
    }
  }, [resturent]); // Only trigger fetch when `getResturent` changes

  useEffect(() => {
    if (resturent) {
      setResturentForm({
        resturentName: resturent.resturentName || "",
        city: resturent.city || "",
        country: resturent.country || "",
        deliveryTime: resturent.deliveryTime || 10,
        deliveryPrice: resturent.deliveryPrice || 100,
        cusines: resturent.cusines || [],
        image: undefined, // Keep image upload empty
      });
    }
  }, [resturent]);

  return (
    <div className="min-h-screen bg-gray-100 dark:from-gray-900 dark:to-black">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-5xl mx-auto bg-white/95  dark:bg-gray-900/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Add Restaurant
            </CardTitle>
          </CardHeader>
          <form onSubmit={HandleSubmit}>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <Label
                  htmlFor="restaurant"
                  className="text-gray-700 dark:text-gray-300">
                  Restaurant
                </Label>
                <Input
                  id="restaurant"
                  name="resturentName"
                  value={ResturentForm.resturentName}
                  onChange={ChangeInptHandler}
                  placeholder="Enter Restaurant Name"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
                {Error && (
                  <span className="text-sm font-medium text-red-500">
                    {Error.resturentName}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-gray-700 dark:text-gray-300">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={ResturentForm.city}
                  onChange={ChangeInptHandler}
                  placeholder="Enter City"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
              {Error && (
                <span className="text-sm font-medium text-red-500">
                  {Error.city}
                </span>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-gray-700 dark:text-gray-300">
                  Country
                </Label>
                <Input
                  name="country"
                  value={ResturentForm.country}
                  onChange={ChangeInptHandler}
                  id="country"
                  placeholder="Enter Country"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
              {Error && (
                <span className="text-sm font-medium text-red-500">
                  {Error.country}
                </span>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="delivery-time"
                  className="text-gray-700 dark:text-gray-300">
                  Estimated Delivery Time (minutes)
                </Label>
                <Input
                  name="deliveryTime"
                  value={ResturentForm.deliveryTime}
                  onChange={ChangeInptHandler}
                  type="number"
                  min="0"
                  placeholder="0 - 60  mins"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
              {Error && (
                <span className="text-sm font-medium text-red-500">
                  {Error.deliveryTime}
                </span>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="delivery-time"
                  className="text-gray-700 dark:text-gray-300">
                  Estimated Delivery Price (100)
                </Label>
                <Input
                  name="deliveryPrice"
                  value={ResturentForm.deliveryPrice}
                  onChange={ChangeInptHandler}
                  type="number"
                  min="0"
                  placeholder="100 - 150 Rupees"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
              {Error && (
                <span className="text-sm font-medium text-red-500">
                  {Error.deliveryPrice}
                </span>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="cuisines"
                  className="text-gray-700 dark:text-gray-300">
                  Cuisines
                </Label>
                <Input
                  name="cusines"
                  value={ResturentForm.cusines}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setResturentForm({
                      ...ResturentForm,
                      cusines: e.target.value.split(","),
                    })
                  }
                  placeholder="e.g. Italian, Chinese, Biryani, etc."
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
              {Error && (
                <span className="text-sm font-medium text-red-500">
                  {Error.cusines}
                </span>
              )}

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Upload Image
                </Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700">
                  <div className="space-y-1 text-center ">
                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                        <span>Upload a file</span>
                        <Input
                          id="file-upload"
                          name="image"
                          type="file"
                          className="sr-only "
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {Error && (
                <span className="text-sm font-medium text-red-500">
                  {Error.image?.name || undefined}
                </span>
              )}

              {resturent ? (
                loading ? (
                  <button className="bg-[#FF2B85] flex items-center justify-center text-white font-bold py-2 px-4 w-full rounded hover:bg-[#ff88ba]">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    <span>Please Wait</span>
                  </button>
                ) : (
                  <button className="bg-[#FF2B85] text-white font-bold py-2 px-4 w-full rounded hover:bg-[#ff88ba]">
                    Update Resturent
                  </button>
                )
              ) : loading ? (
                <button className="bg-[#FF2B85] flex items-center justify-center text-white font-bold py-2 px-4 w-full rounded hover:bg-[#ff88ba]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  <span>Please Wait</span>
                </button>
              ) : (
                <button className="bg-[#FF2B85] text-white font-bold py-2 px-4 w-full rounded hover:bg-[#ff88ba]">
                  Add New Resturent
                </button>
              )}
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddResturents;
