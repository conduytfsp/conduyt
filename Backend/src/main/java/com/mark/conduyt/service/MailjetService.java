package com.mark.conduyt.service;




import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.ClientOptions;
import com.mailjet.client.resource.Emailv31;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MailjetService {

    @Value("${MAILJET_API_KEY}")
    String apiKey;
    @Value("${MAILJET_API_SECRET_KEY}")
    String secretKey;

    public void sendEmail(String fromEmail,String fromName,String toEmail,String toName,String subject,String textContent,String htmlContent) throws MailjetException {
        MailjetRequest request;
        MailjetResponse response;

        ClientOptions options = ClientOptions.builder()
                .apiKey(apiKey)
                .apiSecretKey(secretKey)
                .build();

        MailjetClient client = new MailjetClient(options);

        request = new MailjetRequest(Emailv31.resource)
                .property(Emailv31.MESSAGES, new JSONArray()
                        .put(new JSONObject()
                                .put(Emailv31.Message.FROM, new JSONObject()
                                        .put("Email", fromEmail)
                                        .put("Name", fromName))
                                .put(Emailv31.Message.TO, new JSONArray()
                                        .put(new JSONObject()
                                                .put("Email", toEmail)
                                                .put("Name", toName)))
                                .put(Emailv31.Message.SUBJECT, subject)
                                .put(Emailv31.Message.TEXTPART, textContent)
                                .put(Emailv31.Message.HTMLPART, htmlContent)));
        response = client.post(request);
        System.out.println(response.getStatus());
        System.out.println(response.getData());
    }
}
