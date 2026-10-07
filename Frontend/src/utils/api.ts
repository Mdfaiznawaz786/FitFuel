export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE_URL = API_BASE_URL;
const API = {
    CART_ORDER: `${BASE_URL}/cart/order`,
    USERSPEC_CREATEUSERSPEC: `${BASE_URL}/userspec/createUserSpecification`,
    DIET_GETDIETCHARTBYID: `${BASE_URL}/diet/getDietChartById`,
    DIET_CREATEDIETPLAN: `${BASE_URL}/diet/createDietPlan`,
    DIET_UPDATEDIETCHARTBYID: `${BASE_URL}/diet/updateDietChartById`,
    DIET_DIETHISTORY: `${BASE_URL}/diet/dietHistory`,
    PROFILE_GETPROFILE: `${BASE_URL}/profile/get-profile`,
    PROFILE_WEIGHTHISTORY: `${BASE_URL}/profile/weight-history`,
    PROFILE_UPDATEPROFILE: `${BASE_URL}/profile/update-profile`,
    ORDER_ORDERCONFIRMATION: `${BASE_URL}/orders/order-confirmation`,
    ORDER_UPDATEORDERSTATUS: `${BASE_URL}/orders/update-order-status`,
    ORDER_ORDERHISTORY: `${BASE_URL}/orders/order-history`,
    TRANSACTION_HISTORY: `${BASE_URL}/transaction/history`,
    DIET_NUTRITIONBREAKDOWN: `${BASE_URL}/diet/nutritionBreakdown`,
    CART_UPCOMINGDELIVERIES: `${BASE_URL}/cart/upcoming-deliveries`,
    GENERATE_DIETPLAN: `${BASE_URL}/dietGenerator/generateDiet`,
    ASK_TRAINER: `${BASE_URL}/dietGenerator/askTrainer`,
    PRICE_ESTIMATES: `${BASE_URL}/price-estimates`,
    SHOPPING_RECORDS: `${BASE_URL}/shopping-records`,

}
export default API;
