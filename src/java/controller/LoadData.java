
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Category;
import entity.Color;
import entity.Product;
import entity.Product_Condition;
import entity.Storage;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;

/**
 *
 * @author nethma
 */
@WebServlet(name = "LoadData", urlPatterns = {"/LoadData"})
public class LoadData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        JsonObject jsonObject = new JsonObject();
        
        Gson gson = new Gson();
        
        Session session = HibernateUtil.getSessionFactory().openSession();
        
        //main code
        
        //Get Category list from DB
        Criteria criteria1 = session.createCriteria(Category.class);
        List<Category> categoryList = criteria1.list();
        jsonObject.add("categoryList", gson.toJsonTree(categoryList));
        
        //Get Product_Condition list from DB
        Criteria criteria2 = session.createCriteria(Product_Condition.class);
        List<Product_Condition> conditionList = criteria2.list();
        jsonObject.add("conditionList", gson.toJsonTree(conditionList));
        
         //Get Color list from DB
        Criteria criteria3 = session.createCriteria(Color.class);
        List<Color> colorList = criteria3.list();
        jsonObject.add("colorList", gson.toJsonTree(colorList));
        
         //Get Storage list from DB
        Criteria criteria4 = session.createCriteria(Storage.class);
        List<Storage> storageList = criteria4.list();
        jsonObject.add("storageList", gson.toJsonTree(storageList));
        
         //Get Product list from DB
        Criteria criteria5 = session.createCriteria(Product.class);  
        
        //Get last Product
        criteria5.addOrder(Order.desc("id"));
        jsonObject.addProperty("allProductCount", criteria5.list().size());
        
        //Set Product Range
        criteria5.setFirstResult(0);
        criteria5.setMaxResults(8);
        
        List<Product> productList = criteria5.list();
        
        //Remove User from Product
        for(Product product : productList){
             product.setUser(null);
        }
        
        jsonObject.add("productList", gson.toJsonTree(productList));
        jsonObject.addProperty("success", true);
        //main code
        
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(jsonObject));
                
    }

    

}
