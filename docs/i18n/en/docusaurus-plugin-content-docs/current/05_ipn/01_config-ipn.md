# Setting up IPN URL

When a payment is completed, VNPay will send an IPN (Instant Payment Notification) call to the IPN URL that you have configured. To verify the IPN call, you can use the VNPay library.

## Setting up IPN URL for Sandbox Environment

:::caution Note
To set up the IPN URL for the production environment, you need to contact VNPay for support.
:::

### Quick Access (After Login)

After logging into the VNPay merchant portal, you can directly access the Terminal configuration page (where IPN URL is set) by navigating to:

```text
https://sandbox.vnpayment.vn/merchantv2/Account/TerminalEdit.htm
```

### Step-by-Step Instructions

1. Log in to the VNPay merchant portal [here](https://sandbox.vnpayment.vn/merchantv2/Users/Login.htm)
2. In the top right corner, select `Account Information`:
 <p align="center">
     ![Select account information](/img/en/ipn-step-2.png)
 </p>
3. After selecting account information, VNPay will display a list of websites. You don't need to be concerned about these.
4. From any website in the list, scroll to the right and click on the edit icon:
 <p align="center">
     ![Select the edit icon](/img/en/ipn-step-4.png)
 </p>
5. Configure the IPN URL:
 <p align="center">
     ![Configure IPN](/img/en/ipn-step-5.png)
 </p>

## Setting up IPN URL for Production Environment

:::caution Note
To set up the IPN URL for the production environment, you need to contact VNPay directly for support.
:::
