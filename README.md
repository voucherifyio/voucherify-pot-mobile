# Voucherify App
[Voucherify App](https://voucherify-pot-mobile-35601287c1ae.herokuapp.com/) is an application that allows you to manage loyalty campaigns using the Voucherify platform. The app integrates with the Voucherify dashboard, allowing users to manage their loyalty points, vouchers and rewards in one place.

## Introducion
Voucherify App offers several main views that allow users to use different functionalities:
- **Home:** The main view where users can track their loyalty points balance, select rewards based on the number of promotional points, view vouchers they have, and join the Voucherify plan to earn additional rewards.
- **Deals:** A section where users can view and manage their vouchers that have been awarded automatically.
- **Rewards:** In this view, users can view and manage the rewards they have earned on the home page through collected promotional points.
- **Card:** A section that allows users to scan their vouchers and rewards using a barcode.

The Voucherify app is intended to demonstrate basic functionality in conjunction with the [Voucherify POS](https://voucherify-pot-pos-9defbe226ae2.herokuapp.com/) (Point of sales) app, such as purchasing products, receiving discounts and rewards, and generating promotions.

> [!IMPORTANT]
> ### **Voucherify configuration description**
### Campaigns
The configuration consists of two main loyalty campaigns, the purpose of which is to accrue points depending on the products purchased in the second application - POS Voucherify.

1. **Main Campaign:** For every 150 points earned in this campaign, the user receives 1 promotional point.
2. **Promotional campaign:** Promotional points can be redeemed for prizes in the Voucherify app. 1 point equals one prize. The "Choose reward" button informs the user about the availability of a reward that he can generate by receiving a voucher available in the Rewards tab. The reward can then be redeemed by scanning the barcode in the POS Voucherify app.

### Voucherify plan
Voucherify Plan is an optional plan available to application users that allows you to automatically burn loyalty points for rewards using the "Auto redeem" functionality.

#### Auto redeem
The mechanism is implemented by interacting with the API of the Voucherify platform. The application communicates with Voucherify endpoints to download data about the user's points and the history of his activity.

"Auto redeem" allows users to automatically redeem loyalty points for rewards. Once a user reaches a minimum of 300 points in the main loyalty campaign, their points will automatically be burned down to zero and the reward will be awarded. This process is handled asynchronously and automatically, without the need for user interaction. The main assumption of this functionality is that the user does not have any promotional points on his account.

#### Logic of action

1. **Checking the status of points:** Every 3 seconds, the application queries the [Get customer](https://docs.voucherify.io/reference/get-customer) endpoint to check the number of user points in the main loyalty campaign.
2. **Checking the user's activity history:** After confirming a sufficient number of points in the main campaign (300), we query the [List customer activity](https://docs.voucherify.io/reference/list-customer-activity) endpoint, searching the user's activity history to determine whether the points from the promotional campaign have already been used or are still being processed and will be charged.

#### Technical requirements
- **Frequent API polling:** The application must regularly poll Voucherify platform endpoints to check the status of points and user activity history.
- **Support for asynchronous tasks:** "Auto redeem" is an asynchronous process in which Voucherify queues tasks in connection with the accrual of points. In this case, we must check the user's activity history to properly verify the points awarded.

## External tools
### Segment
[Segment](https://www.voucherify.io/integrations/segment) is a tool that we integrate with our application to effectively manage user data and the purchasing process. Thanks to the Segment, we can send data from the Voucherify and POS applications to one central place, where they are processed and further transferred to the Voucherify platform. One of many events is user verification.

#### User verification
When a user logs in or registers, identification data is sent to Segment, which then creates a user in the Voucherify platform. Then we query the [Get customer](https://docs.voucherify.io/reference/get-customer) endpoint to check whether the user already exists in the system and log in or register the user.

### Braze
[Braze](https://www.voucherify.io/integrations/braze) is a tool we use to communicate with users through the Voucherify app. It allows you to send personalized messages informing users about rewards won and other important events.

#### Communication with users
When a user achieves a specific event, such as winning an award, the Voucherify app sends the appropriate information to Braze. Then, configured campaigns or canvases in Braze manage this information, sending personalized messages to users through the app.

## Project configuration
1. Segment https://segment.com/docs/connections/find-writekey/
2. Braze
   - Api key https://www.braze.com/docs/user_guide/administrative/app_settings/api_settings_tab/
   - Sdk endpoint https://www.braze.com/docs/user_guide/administrative/access_braze/sdk_endpoints\
3. Voucherify https://docs.voucherify.io/docs/authentication

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=x1x2x3

Segment
SEGMENTIO_SOURCE_ID=
SEGMENTIO_SOURCE_WRITE_KEY=

Braze
NEXT_PUBLIC_BRAZE_API_KEY=
NEXT_PUBLIC_BRAZE_SDK_ENDPOINT=


Voucherify
VOUCHERIFY_API_URL=
VOUCHERIFY_APPLICATION_ID=
VOUCHERIFY_SECRET_KEY=
```

## Installation
1. `git clone https://github.com/voucherifyio/voucherify-pot-mobile.git`
2. `npm install`
3. `npm run dev`
