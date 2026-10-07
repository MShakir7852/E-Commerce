const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOrderConfirmationEmail = async ({
    customerEmail,
    customerName,
    order,
}) => {
    const itemsHTML = order.items
        .map(
            (item) => `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">
                        ${item.name || "Product"}
                    </td>

                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                        ${item.quantity}
                    </td>

                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                        Rs. ${Number(item.price).toLocaleString()}
                    </td>

                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                        Rs. ${(
                            Number(item.price) * Number(item.quantity)
                        ).toLocaleString()}
                    </td>
                </tr>
            `
        )
        .join("");

    const trackUrl = `${process.env.FRONTEND_URL}/track-order/${order.trackingNumber}`;

    const mailOptions = {
        from: `"ShopZone" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Order Confirmed - ${order.trackingNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Order Confirmation</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background: #f4f7fb;
                font-family: Arial, Helvetica, sans-serif;
                color: #1f2937;
            ">

                <div style="
                    max-width: 700px;
                    margin: 40px auto;
                    background: #ffffff;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                ">

                    <!-- Header -->
                    <div style="
                        background: linear-gradient(135deg, #111827, #374151);
                        padding: 35px;
                        text-align: center;
                        color: white;
                    ">
                        <h1 style="
                            margin: 0;
                            font-size: 30px;
                        ">
                            ShopZone
                        </h1>

                        <p style="
                            margin: 8px 0 0;
                            color: #d1d5db;
                        ">
                            Your trusted online store
                        </p>
                    </div>

                    <!-- Success -->
                    <div style="
                        padding: 40px 30px 20px;
                        text-align: center;
                    ">

                        <div style="
                            width: 70px;
                            height: 70px;
                            margin: auto;
                            border-radius: 50%;
                            background: #dcfce7;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 38px;
                        ">
                            ✓
                        </div>

                        <h2 style="
                            margin: 20px 0 8px;
                            font-size: 26px;
                            color: #111827;
                        ">
                            Order Placed Successfully!
                        </h2>

                        <p style="
                            color: #6b7280;
                            font-size: 15px;
                        ">
                            Hi ${customerName || "Customer"}, thank you for shopping with us.
                        </p>
                    </div>

                    <!-- Order Info -->
                    <div style="padding: 20px 30px;">

                        <div style="
                            background: #f9fafb;
                            border-radius: 14px;
                            padding: 20px;
                        ">

                            <p style="margin: 0 0 10px;">
                                <strong>Order ID:</strong>
                                ${order._id}
                            </p>

                            <p style="margin: 0 0 10px;">
                                <strong>Tracking Number:</strong>
                                ${order.trackingNumber}
                            </p>

                            <p style="margin: 0;">
                                <strong>Payment Method:</strong>
                                ${order.paymentMethod}
                            </p>

                        </div>

                    </div>

                    <!-- Products -->
                    <div style="padding: 10px 30px 30px;">

                        <h3 style="
                            margin-bottom: 15px;
                            color: #111827;
                        ">
                            Order Details
                        </h3>

                        <table style="
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 14px;
                        ">

                            <thead>
                                <tr style="background: #f9fafb;">
                                    <th style="padding: 12px; text-align: left;">
                                        Product
                                    </th>

                                    <th style="padding: 12px; text-align: center;">
                                        Qty
                                    </th>

                                    <th style="padding: 12px; text-align: right;">
                                        Price
                                    </th>

                                    <th style="padding: 12px; text-align: right;">
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                ${itemsHTML}
                            </tbody>

                        </table>

                    </div>

                    <!-- Summary -->
                    <div style="padding: 0 30px 30px;">

                        <div style="
                            background: #f9fafb;
                            border-radius: 14px;
                            padding: 20px;
                        ">

                            <div style="
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 10px;
                            ">
                                <span>Subtotal</span>
                                <strong>
                                    Rs. ${Number(order.subtotal).toLocaleString()}
                                </strong>
                            </div>

                            <div style="
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 10px;
                            ">
                                <span>Shipping</span>
                                <strong>
                                    Rs. ${Number(order.shippingFee).toLocaleString()}
                                </strong>
                            </div>

                            <hr style="
                                border: none;
                                border-top: 1px solid #ddd;
                                margin: 15px 0;
                            " />

                            <div style="
                                display: flex;
                                justify-content: space-between;
                                font-size: 18px;
                            ">
                                <strong>Total</strong>

                                <strong>
                                    Rs. ${Number(order.total).toLocaleString()}
                                </strong>
                            </div>

                        </div>

                    </div>

                    <!-- Shipping Address -->
                    <div style="padding: 0 30px 30px;">

                        <h3>Shipping Address</h3>

                        <div style="
                            background: #f9fafb;
                            padding: 18px;
                            border-radius: 12px;
                            line-height: 1.6;
                        ">
                            ${order.shippingAddress?.fullName || customerName}<br />
                            ${order.shippingAddress?.phone || ""}<br />
                            ${order.shippingAddress?.address || ""}<br />
                            ${order.shippingAddress?.city || ""}<br />
                            ${order.shippingAddress?.postalCode || ""}
                        </div>

                    </div>

                    <!-- Track Button -->
                    <div style="
                        text-align: center;
                        padding: 10px 30px 40px;
                    ">

                        <a
                            href="${trackUrl}"
                            style="
                                display: inline-block;
                                padding: 14px 28px;
                                background: #111827;
                                color: white;
                                text-decoration: none;
                                border-radius: 10px;
                                font-weight: bold;
                            "
                        >
                            Track Your Order
                        </a>

                    </div>

                    <!-- Footer -->
                    <div style="
                        background: #f9fafb;
                        padding: 25px;
                        text-align: center;
                        color: #6b7280;
                        font-size: 13px;
                    ">
                        <p style="margin: 0 0 6px;">
                            Thank you for choosing ShopZone.
                        </p>

                        <p style="margin: 0;">
                            © ${new Date().getFullYear()} ShopZone. All rights reserved.
                        </p>
                    </div>

                </div>

            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Order confirmation email sent to:", customerEmail);
};

module.exports = {
    sendOrderConfirmationEmail,
};