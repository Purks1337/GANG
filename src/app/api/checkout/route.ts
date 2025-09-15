import { NextResponse } from "next/server";
import { strapiFetch, type StrapiSingleResponse } from "@/lib/strapi";

// Define the structure for a line item in an order
interface LineItem {
  product_id: string;
  name: string;
  quantity: number;
  price: string;
}

// Define the structure for the customer details
interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

// Define the structure of the data we will post to create an order in Strapi
interface OrderPayload {
  line_items: LineItem[];
  customer_details: CustomerDetails;
  status: "pending" | "completed" | "cancelled";
}

/**
 * API route to create an order in Strapi.
 * This is a simplified version and does not handle payment processing.
 */
export async function POST(request: Request) {
  try {
    const { cart, customerDetails } = (await request.json()) as {
      cart: LineItem[];
      customerDetails: CustomerDetails;
    };

    if (!cart || cart.length === 0 || !customerDetails) {
      return NextResponse.json(
        { ok: false, error: "Cart items and customer details are required" },
        { status: 400 }
      );
    }

    // Prepare the payload for Strapi.
    // NOTE: This assumes you have a "Content-Type" in Strapi called "orders"
    // with fields: "line_items" (JSON), "customer_details" (JSON), and "status" (Text).
    const orderData: OrderPayload = {
      line_items: cart,
      customer_details: customerDetails,
      status: "pending",
    };

    const response = await strapiFetch<StrapiSingleResponse<OrderPayload>>(
      "/api/orders",
      {
        method: "POST",
        body: JSON.stringify({ data: orderData }), // Strapi expects a 'data' wrapper
      }
    );

    // Return the ID of the created order
    return NextResponse.json({ ok: true, orderId: response.data.id });
  } catch (error) {
    console.error("Error creating order in Strapi:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}
