package com.mark.conduyt.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.net.URL;

@Component
public class PdfTextExtractor {

    public String extractTextFromUrl(String pdfUrl) {
        if (pdfUrl == null || pdfUrl.isBlank()) {
            return "";
        }

        try (InputStream in = new URL(pdfUrl).openStream();
             PDDocument document = PDDocument.load(in)) {

            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // Clean up extra whitespace and newlines
            return text.replaceAll("\\s+", " ").trim();

        } catch (Exception e) {
            System.err.println("PdfTextExtractor: Failed to extract text from PDF URL: " + pdfUrl + " - " + e.getMessage());
            return ""; // Gracefully fall back to an empty string if reading fails
        }
    }
}