import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  try {
    const response = await admin.rest.resources.InventoryLevel.all({
      session: session,
      location_ids: "67335028890",
    });

    if (response) {
      console.log("hit");

      const data = response.data;

      console.log(data, "data");

      return json({
        inventory: data,
      });
    }

    return json({
      inventory: null,
      error: "No response from Shopify API",
    });
  } catch (err) {
    console.error(err);
  }
};

const Inventory = () => {
  const data: any = useLoaderData();
  console.log(data, "data");

  if (data.error) {
    return <div>Error: {data.error}</div>;
  }

  if (!data.inventory) {
    return <div>No inventory data available</div>;
  }

  return (
    <div>
      <h1>Inventory Levels</h1>
      {data.inventory.map((item: any) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};

export default Inventory;
