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
    const itemsHtml = order.items
        .map(
            (item) => `
                <tr>
                    <td style="padding:14px 10px;border-bottom:1px solid #eee;">
                        <div style="font-weight:600;color:#111827;">
                            ${item.name}
                        </div>
                        ${
                            item.size
                                ? `<div style="font-size:12px;color:#6b7280;">
                                    Size: ${item.size}
                                   </div>`
                                : ""
                        }
                        ${
                            item.color
                                ? `<div style="font-size:12px;color:#6b7280;">
                                    Color: ${item.color}
                                   </div>`
                                : ""
                        }
                    </td>

                    <td style="padding:14px 10px;border-bottom:1px solid #eee;text-align:center;">
                        ${item.quantity}
                    </td>

                    <td style="padding:14px 10px;border-bottom:1px solid #eee;text-align:right;">
                        Rs. ${Number(item.price).toLocaleString()}
                    </td>

                    <td style="padding:14px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">
                        Rs. ${(
                            Number(item.price) * Number(item.quantity)
                        ).toLocaleString()}
                    </td>
                </tr>
            `
        )
        .join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Order Confirmation</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f3f4f6;
        font-family:Arial,Helvetica,sans-serif;
        color:#111827;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 15px;background:#f3f4f6;"
>
<tr>
<td align="center">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        max-width:650px;
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 40px rgba(0,0,0,0.08);
    "
>

<!-- HEADER -->

<tr>
<td
    style="
        padding:35px 30px;
        text-align:center;
        background:linear-gradient(135deg,#2563eb,#7c3aed);
    "
>

<div
    style="
        width:60px;
        height:60px;
        margin:0 auto 15px;
        border-radius:50%;
        background:#ffffff;
        color:#16a34a;
        font-size:34px;
        line-height:60px;
        font-weight:bold;
    "
>
    ✓
</div>

<h1
    style="
        margin:0;
        color:#ffffff;
        font-size:28px;
    "
>
    Order Confirmed!
</h1>

<p
    style="
        margin:10px 0 0;
        color:#e0e7ff;
        font-size:15px;
    "
>
    Thank you for shopping with ShopZone
</p>

</td>
</tr>


<!-- CONTENT -->

<tr>
<td style="padding:35px 30px;">

<p
    style="
        margin:0 0 10px;
        font-size:17px;
        color:#111827;
    "
>
    Hello <strong>${customerName || "Customer"}</strong>,
</p>

<p
    style="
        margin:0 0 25px;
        color:#6b7280;
        line-height:1.6;
        font-size:14px;
    "
>
    Your order has been successfully placed. Below are your complete
    order details.
</p>


<!-- ORDER INFO -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#f9fafb;
        border-radius:14px;
        margin-bottom:25px;
    "
>

<tr>
<td style="padding:18px;">

<table width="100%" cellpadding="0" cellspacing="0">

<tr>
<td
    style="
        color:#6b7280;
        font-size:12px;
        padding-bottom:10px;
    "
>
    ORDER ID
</td>

<td
    style="
        color:#6b7280;
        font-size:12px;
        padding-bottom:10px;
        text-align:right;
    "
>
    TRACKING NUMBER
</td>
</tr>

<tr>

<td
    style="
        font-weight:bold;
        color:#111827;
    "
>
    #${order._id}
</td>

<td
    style="
        font-weight:bold;
        color:#2563eb;
        text-align:right;
    "
>
    ${order.trackingNumber}
</td>

</tr>

</table>

</td>
</tr>

</table>


<!-- PRODUCTS -->

<h2
    style="
        font-size:17px;
        margin:0 0 12px;
        color:#111827;
    "
>
    Order Items
</h2>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        border-collapse:collapse;
        font-size:13px;
    "
>

<tr style="background:#f9fafb;">

<th
    style="
        padding:12px 10px;
        text-align:left;
        color:#6b7280;
        font-size:11px;
    "
>
    PRODUCT
</th>

<th
    style="
        padding:12px 10px;
        color:#6b7280;
        font-size:11px;
    "
>
    QTY
</th>

<th
    style="
        padding:12px 10px;
        text-align:right;
        color:#6b7280;
        font-size:11px;
    "
>
    PRICE
</th>

<th
    style="
        padding:12px 10px;
        text-align:right;
        color:#6b7280;
        font-size:11px;
    "
>
    TOTAL
</th>

</tr>

${itemsHtml}

</table>


<!-- PRICE SUMMARY -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="margin-top:25px;"
>

<tr>
<td
    style="
        padding:7px 0;
        color:#6b7280;
        font-size:14px;
    "
>
    Subtotal
</td>

<td
    style="
        padding:7px 0;
        text-align:right;
        font-size:14px;
    "
>
    Rs. ${Number(order.subtotal).toLocaleString()}
</td>
</tr>

<tr>
<td
    style="
        padding:7px 0;
        color:#6b7280;
        font-size:14px;
    "
>
    Shipping
</td>

<td
    style="
        padding:7px 0;
        text-align:right;
        font-size:14px;
    "
>
    Rs. ${Number(order.shippingFee).toLocaleString()}
</td>
</tr>

<tr>
<td
    style="
        border-top:1px solid #e5e7eb;
        padding:15px 0 7px;
        font-size:17px;
        font-weight:bold;
    "
>
    Total
</td>

<td
    style="
        border-top:1px solid #e5e7eb;
        padding:15px 0 7px;
        text-align:right;
        font-size:19px;
        font-weight:bold;
        color:#2563eb;
    "
>
    Rs. ${Number(order.total).toLocaleString()}
</td>
</tr>

</table>


<!-- SHIPPING ADDRESS -->

<div
    style="
        margin-top:25px;
        padding:18px;
        border:1px solid #e5e7eb;
        border-radius:14px;
    "
>

<h3
    style="
        margin:0 0 10px;
        font-size:15px;
    "
>
    Shipping Address
</h3>

<p
    style="
        margin:0;
        color:#6b7280;
        font-size:14px;
        line-height:1.6;
    "
>
    ${order.shippingAddress?.fullName || customerName}<br>
    ${order.shippingAddress?.phone || ""}<br>
    ${order.shippingAddress?.address || ""}<br>
    ${order.shippingAddress?.city || ""}
    ${
        order.shippingAddress?.postalCode
            ? ` - ${order.shippingAddress.postalCode}`
            : ""
    }
</p>

</div>


<!-- PAYMENT -->

<div
    style="
        margin-top:15px;
        padding:15px 18px;
        background:#f9fafb;
        border-radius:12px;
    "
>

<span
    style="
        color:#6b7280;
        font-size:13px;
    "
>
    Payment Method
</span>

<strong
    style="
        float:right;
        font-size:13px;
        color:#111827;
    "
>
    ${order.paymentMethod || "Cash on Delivery"}
</strong>

</div>


<!-- TRACK BUTTON -->

<div style="text-align:center;margin-top:30px;">

<a
    href="http://localhost:5173/track-order/${order.trackingNumber}"
    style="
        display:inline-block;
        padding:14px 28px;
        background:#2563eb;
        color:#ffffff;
        text-decoration:none;
        border-radius:10px;
        font-weight:bold;
        font-size:14px;
    "
>
    Track My Order →
</a>

</div>

</td>
</tr>


<!-- FOOTER -->

<tr>
<td
    style="
        padding:25px 30px;
        background:#f9fafb;
        text-align:center;
    "
>

<p
    style="
        margin:0 0 5px;
        font-size:13px;
        color:#6b7280;
    "
>
    Thank you for choosing
    <strong style="color:#2563eb;">
        ShopZone
    </strong>
</p>

<p
    style="
        margin:0;
        font-size:11px;
        color:#9ca3af;
    "
>
    This is an automated order confirmation email.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

    await transporter.sendMail({
        from: `"ShopZone" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Order Confirmed #${order.trackingNumber} | ShopZone`,
        html,
    });
};

module.exports = {
    sendOrderConfirmationEmail,
};