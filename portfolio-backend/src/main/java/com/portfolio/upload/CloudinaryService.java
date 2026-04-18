package com.portfolio.upload;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "portfolio/images",
                        "resource_type", "image",
                        "format", "webp",
                        "quality", "auto"
                )
        );
        String url = (String) result.get("secure_url");
        log.info("Image uploaded to Cloudinary: {}", url);
        return url;
    }

    public String uploadPdf(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "portfolio/documents",
                        "resource_type", "raw"
                )
        );
        String url = (String) result.get("secure_url");
        log.info("PDF uploaded to Cloudinary: {}", url);
        return url;
    }
}
