"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Load Razorpay Script Helper
const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export function ProUpgradeButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const handleUpgrade = async () => {
        setLoading(true);

        // 1. Load Razorpay SDK
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            toast.error("Failed to load payment gateway. Check your internet connection.");
            setLoading(false);
            return;
        }

        try {
            // 2. Create Order
            const orderRes = await fetch(`${API_URL}/payments/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 4900, currency: "INR" }), // 4900 paise = 49 INR
            });

            if (!orderRes.ok) throw new Error("Failed to create order");
            const order = await orderRes.json();

            // 3. Open Razorpay
            const options = {
                key: order.key_id,
                amount: order.amount,
                currency: order.currency,
                name: "Institute Management Pro",
                description: "Upgrade to Pro Plan",
                order_id: order.id,
                handler: async function (response: any) {
                    toast.loading("Verifying Payment...");

                    try {
                        const verifyRes = await fetch(`${API_URL}/payments/verify-payment`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                user_id: userId
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.status === "success") {
                            toast.dismiss();
                            toast.success("Upgrade Successful! Welcome to Pro.");
                            router.refresh();
                        } else {
                            toast.error("Verification failed: " + verifyData.message);
                        }
                    } catch (err: any) {
                        toast.error("Payment verification failed");
                        console.error(err);
                    }
                },
                prefill: {
                    name: "Institute Admin", // Could come from props
                    email: "admin@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#0F172A"
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button className="w-full" onClick={handleUpgrade} disabled={loading}>
            {loading ? "Processing..." : "Upgrade to Pro"}
        </Button>
    );
}
