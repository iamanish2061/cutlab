package com.esewa;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.apache.tomcat.util.codec.binary.Base64;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/responseHandle")
public class EsewaResponseServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private Gson gson;

    @Override
    public void init(ServletConfig config) throws ServletException {
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processEsewaResponse(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processEsewaResponse(request, response);
    }

    private void processEsewaResponse(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (int) session.getAttribute("user_id");

        String encodedData = request.getParameter("data");
        if (encodedData == null || encodedData.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing 'data' parameter.");
            return;
        }

        try {
            // Decode Base64 data
            String decodedData = new String(Base64.decodeBase64(encodedData), StandardCharsets.UTF_8);

            // Parse JSON
            EsewaAttributes paymentResponse = gson.fromJson(decodedData, EsewaAttributes.class);

            // Clean up amount format
            String amt = paymentResponse.getTotal_amount().replace(",", "");
            paymentResponse.setTotal_amount(amt);

            // Verify signature
            boolean isValid = EsewaSignatureUtil.verifySignature(paymentResponse);

            // Set attributes for JSP
            request.setAttribute("userId", userId);
            request.setAttribute("paymentDetails", paymentResponse);

            if (isValid && "COMPLETE".equalsIgnoreCase(paymentResponse.getStatus())) {
            	System.out.println("done");
                request.getRequestDispatcher("/payment-success").forward(request, response);
            } else {
                // Verify via GET call to eSewa server
            	System.out.println("err1");
                boolean verificationSuccess = sendGetRequestForVerification(paymentResponse);
                if (verificationSuccess) {
                    request.getRequestDispatcher("/payment-success").forward(request, response);
                } else {
                	System.out.println("err2");
                    request.getRequestDispatcher("/payment-failure").forward(request, response);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("error", "Error processing payment: " + e.getMessage());
            request.getRequestDispatcher("/payment-failure").forward(request, response);
        }
    }

    public static boolean sendGetRequestForVerification(EsewaAttributes response) {
        try {
            String total_amount = response.getTotal_amount();
            String transaction_uuid = response.getTransaction_uuid();

            String urlString = String.format(
                    EsewaAttributes.VERIFICATION_URL + "?product_code=%s&total_amount=%s&transaction_uuid=%s",
                    EsewaAttributes.MERCHANT_ID, total_amount, transaction_uuid);

            URL url = new URL(urlString);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            int responseCode = con.getResponseCode();
            System.out.println("Response Code: " + responseCode);

            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuilder res = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                res.append(inputLine);
            }
            in.close();

            JsonObject jsonObject = JsonParser.parseString(res.toString()).getAsJsonObject();
            String status = jsonObject.get("status").getAsString();

            System.out.println("Status from eSewa: " + status);

            return "COMPLETE".equalsIgnoreCase(status);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


}
