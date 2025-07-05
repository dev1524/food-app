import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UseCartStore from "@/store/UseCartStore";
import useResturent from "@/store/UseResturent";
import { MenuItem } from "@/types/RestaurentTypes";
import { Clock, Pizza } from "lucide-react";
import { useEffect } from "react";
import { TbCoinRupeeFilled } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ViewMenu = () => {
  const { addToCart } = UseCartStore();
  const params = useParams();
  const { singleResturent, GetRestaurant, loading } = useResturent();

  useEffect(() => {
    const paramsId = params.id!;
    GetRestaurant(paramsId);
  }, [GetRestaurant, params.id]);

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
        <Pizza className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-lg font-semibold">Loading Restaurant...</h2>
      </div>
    );
  }

  const addCart = async (menu: MenuItem) => {
    await addToCart(menu);
    toast.success("Item added to cart");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Hero Image */}
      <div className="relative h-48 md:h-64 mb-6 rounded-lg overflow-hidden">
        <img
          src={singleResturent?.imageFile || "Loading..."}
          alt="Restaurant banner with various Indian dishes"
          className="object-cover w-full h-full rounded-lg shadow-lg"
        />
      </div>

      {/* Restaurant Info */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {singleResturent?.resturentName || "Loading..."}
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {singleResturent?.cusines?.map((cusine: any) => (
            <Badge
              key={cusine}
              variant="outline"
              className="text-sm md:text-base bg-pink-400 rounded">
              {cusine}
            </Badge>
          ))}
        </div>
        {singleResturent ? (
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              Deliver time: {singleResturent.deliveryTime || "Loading..."} mins
            </span>
          </div>
        ) : (
          <p>Loading restaurant details...</p>
        )}
      </div>

      {/* Available Menus Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-6">Available Menus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {singleResturent?.menu.map((item: MenuItem) => (
            <Card
              key={item._id}
              className="bg-white shadow-md text-black rounded dark:bg-gray-800 dark:border-gray-700 border-gray-200  dark:text-gray-100">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {item.name || "Loading..."}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {item.description || "Loading..."}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold flex justify-start items-center gap-1 ">
                    <p>Rs :</p>
                    <TbCoinRupeeFilled />
                    {item.price || "Loading..."}
                  </div>
                  <Button
                    className="bg-pink-600 hover:bg-pink-400 text-white"
                    onClick={() => {
                      addCart(item);
                      navigate("/cart-page");
                    }}>
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ViewMenu;
