package com.cesuoyunwei.backend.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.Base64;

@Service
public class BlobStorageService {
    private final BlobContainerClient containerClient;

    public BlobStorageService(@Value("${azure.storage.connection-string:}") String conn,
                              @Value("${azure.storage.container:images}") String container) {
        if (conn == null || conn.trim().isEmpty()) {
            this.containerClient = null;
            return;
        }
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
            .connectionString(conn)
            .buildClient();
        this.containerClient = blobServiceClient.getBlobContainerClient(container);
        if (!this.containerClient.exists()) this.containerClient.create();
    }

    public String uploadBase64(String name, String dataUrl) {
        if (this.containerClient == null) return "";
        // dataUrl: data:<mime>;base64,xxxx
        String base64 = dataUrl.contains(",") ? dataUrl.substring(dataUrl.indexOf(',') + 1) : dataUrl;
        byte[] bytes = Base64.getDecoder().decode(base64);
        BlobClient client = containerClient.getBlobClient(name);
        client.upload(new ByteArrayInputStream(bytes), bytes.length, true);
        return client.getBlobUrl();
    }
}
