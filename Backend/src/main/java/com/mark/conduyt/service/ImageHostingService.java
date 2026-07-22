package com.mark.conduyt.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Component
public class ImageHostingService {

    private final Cloudinary cloudinary;

    public ImageHostingService(
            @Value("${IMAGE_HOSTING_CLOUD_NAME}") String cloudName,
            @Value("${IMAGE_HOSTING_API_KEY}") String apiKey,
            @Value("${IMAGE_HOSTING_API_SECRET}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }



    public String uploadImage(MultipartFile file, String folderName) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folderName
            ));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public String uploadPdf(MultipartFile file, String folderName) throws IOException {
        // Upload parameters specifically for PDFs/documents
        try {
            Map params = ObjectUtils.asMap(
                    "folder", folderName,
                    "resource_type", "auto"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

            // Return the secure HTTPS URL to store in your PostgreSQL database
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload pdf", e);
        }
    }


    public String deleteImage(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image", e);
        }
    }


    String extractPublicId(String imageUrl) {
        // Example URL: https://res.cloudinary.com/<cloud-name>/image/upload/v1685000000/folder/file-name.jpg
        try {
            String afterUpload = imageUrl.substring(imageUrl.indexOf("/upload/") + 8);
            String withoutVersion = afterUpload.replaceFirst("v\\d+/", ""); // removes v<timestamp>/
            int extensionIndex = withoutVersion.lastIndexOf('.');
            return extensionIndex > 0 ? withoutVersion.substring(0, extensionIndex) : withoutVersion;
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract public ID from URL", e);
        }
    }

}