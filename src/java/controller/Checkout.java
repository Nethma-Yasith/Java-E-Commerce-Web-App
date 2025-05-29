package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.User_DTO;
import entity.Address;
import entity.Cart;
import entity.City;
import entity.Order_Item;
import entity.Order_Status;
import entity.Product;
import entity.User;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.HibernateUtil;
import model.PayHere;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author nethma
 */
@WebServlet(name = "Checkout", urlPatterns = {"/Checkout"})
public class Checkout extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        JsonObject responsejsonObject = new JsonObject();
        responsejsonObject.addProperty("success", false);

        HttpSession httpSession = request.getSession();
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = session.beginTransaction();

        boolean isCurrentAddress = requestJsonObject.get("isCurrentAddress").getAsBoolean();
        String first_name = requestJsonObject.get("first_name").getAsString();
        String last_name = requestJsonObject.get("last_name").getAsString();
        String city_id = requestJsonObject.get("city_id").getAsString();
        String address1 = requestJsonObject.get("address1").getAsString();
        String address2 = requestJsonObject.get("address2").getAsString();
        String postal_code = requestJsonObject.get("postal_code").getAsString();
        String mobile = requestJsonObject.get("mobile").getAsString();

//        System.out.println(isCurrentAddress);
//        System.out.println(first_name);
//        System.out.println(last_name);
//        System.out.println(city_id);
//        System.out.println(address1);
//        System.out.println(address2);
//        System.out.println(postal_code);
//        System.out.println(mobile);
        if (httpSession.getAttribute("user") != null) {
            //user signed in

            User_DTO user_DTO = (User_DTO) httpSession.getAttribute("user");
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("email", user_DTO.getEmail()));
            User user = (User) criteria1.uniqueResult();

            if (isCurrentAddress) {
                //get current Address
                Criteria criteria2 = session.createCriteria(Address.class);
                criteria2.add(Restrictions.eq("user", user));
                criteria2.addOrder(Order.desc("id"));
                criteria2.setMaxResults(1);

                if (criteria2.list().isEmpty()) {
                    //curent address not found. Please create new address
                    responsejsonObject.addProperty("message", "Current address not found. Please create a new address");
                } else {
                    //Get the current address
                    Address address = (Address) criteria2.list().get(0);

                    //**Complete the checkout process
                    saveOrders(session, transaction, user, address, responsejsonObject);

                }

            } else {
                //Create new address

                if (first_name.isEmpty()) {
                    responsejsonObject.addProperty("message", "Please fill First Name");
                } else if (last_name.isEmpty()) {
                    responsejsonObject.addProperty("message", "Please fill Last Name");

                } else if (!Validations.isInteger(city_id)) {
                    responsejsonObject.addProperty("message", "Invalid City Selected");
                } else {
                    //Check City From DB
                    Criteria criteria3 = session.createCriteria(City.class);
                    criteria3.add(Restrictions.eq("id", Integer.parseInt(city_id)));

                    if (criteria3.list().isEmpty()) {
                        responsejsonObject.addProperty("message", "Invalid City Selected");
                    } else {
                        //City found
                        City city = (City) criteria3.list().get(0);

                        if (address1.isEmpty()) {
                            responsejsonObject.addProperty("message", "Please Fill Address Line 1");
                        } else if (address2.isEmpty()) {
                            responsejsonObject.addProperty("message", "Please Fill Address Line 2");

                        } else if (postal_code.isEmpty()) {
                            responsejsonObject.addProperty("message", "Please Fill Postal Code");

                        } else if (postal_code.length() != 5) {
                            responsejsonObject.addProperty("message", "Please Invalid Postal Code");

                        } else if (!Validations.isInteger(postal_code)) {
                            responsejsonObject.addProperty("message", "Please Invalid Postal Code");

                        } else if (mobile.isEmpty()) {
                            responsejsonObject.addProperty("message", "Please Fill Mobile");

                        } else if (!Validations.isMobileNumberValid(mobile)) {
                            responsejsonObject.addProperty("message", "Please Invalid Mobile Number");

                        } else {
                            //Create New address
                            Address address = new Address();
                            address.setCity(city);
                            address.setFirst_name(first_name);
                            address.setLast_name(last_name);
                            address.setLine1(address1);
                            address.setLine2(address2);
                            address.setMobile(mobile);
                            address.setPostal_code(postal_code);
                            address.setUser(user);

                            session.save(address);
                            //***Complete the checkout process

                            saveOrders(session, transaction, user, address, responsejsonObject);
                        }
                    }

                }
            }

        } else {
            //user not
            responsejsonObject.addProperty("message", "user not signed ");
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responsejsonObject));
    }

    private void saveOrders(Session session, Transaction transaction, User user, Address address, JsonObject responsejsonObject) {

        try {
            //create Order in DB
            entity.Orders order = new entity.Orders();
            order.setAddress(address);
            order.setDate_time(new Date());
            order.setUser(user);
            int order_id = (int) session.save(order);

            //Get Cart Item
            Criteria criteria4 = session.createCriteria(Cart.class);
            criteria4.add(Restrictions.eq("user", user));
            List<Cart> cartList = criteria4.list();

            //get Order Status (5.Payment pending) from DB
            Order_Status order_Status = (Order_Status) session.get(Order_Status.class, 5);

            //Create Order Item in DB
            double amount = 0;
            String items = "";
            for (Cart cartItem : cartList) {

                //Calculate amount 
                amount += cartItem.getQty() * cartItem.getProduct().getPrice();
                if (address.getCity().getId() == 1) {
                    amount += 1000;
                } else {
                    amount += 2500;
                }
                //Calculate amount

                //Get Item Details
                items += cartItem.getProduct().getTitle() + " X" + cartItem.getQty() + " ";
                //Get Item Details

                //Get Product
                Product product = cartItem.getProduct();

                Order_Item order_Item = new Order_Item();
                order_Item.setOrder(order);
                order_Item.setOrder_status(order_Status);
                order_Item.setProduct(product);
                order_Item.setQty(cartItem.getQty());
                session.save(order_Item);

                //Update Product qty in DB
                product.setQty(product.getQty() - cartItem.getQty());
                session.update(product);

                //Delete Cart Item from DB
                session.delete(cartItem);

            }

            transaction.commit();

            //Start: Set Payment
            String merchant_id = "1221218";
            String formatedAmount = new DecimalFormat("0.00").format(amount);
            String currency = "LKR";
            String merchantSecret = "Mjk0OTAyOTk1MTY5NDYzOTYyNDQwODUwODc2ODQzNDk4NTU2NTU3";
            String merchantSecretMd5Hash = PayHere.generateMD5(merchantSecret);

            JsonObject payhere = new JsonObject();
            payhere.addProperty("merchant_id", merchant_id);

            payhere.addProperty("return_url", "");
            payhere.addProperty("cancel_url", "");
            payhere.addProperty("notify_url", "");//*

            payhere.addProperty("first_name", user.getFirst_Name());
            payhere.addProperty("last_name", user.getLast_Name());
            payhere.addProperty("email", user.getEmail());
            payhere.addProperty("phone", "0724820045");
            payhere.addProperty("address", "No.38 Havelock Road");
            payhere.addProperty("city", "Colombo");
            payhere.addProperty("country", "Sri Lanka");
            payhere.addProperty("order_id", String.valueOf(order_id));
            payhere.addProperty("items", items);
            payhere.addProperty("currency", currency);
            payhere.addProperty("amount", formatedAmount);
            payhere.addProperty("sandbox", true);

            //Genarate MD5 Hash
            //merahantID + orderID + amountFormatted + currency + getMd5(merchantSecret)
            String md5Hash = PayHere.generateMD5(merchant_id + order_id + formatedAmount + currency + merchantSecretMd5Hash);
            payhere.addProperty("hash", md5Hash);

            //End: Set Payment
            responsejsonObject.addProperty("success", true);
            responsejsonObject.addProperty("message", "Checkout Completed");

            Gson gson = new Gson();
            responsejsonObject.add("payhereJson", gson.toJsonTree(payhere));

        } catch (Exception e) {
            transaction.rollback();
        }

    }

}
