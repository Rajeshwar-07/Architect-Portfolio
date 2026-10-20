package com.portfolio.architect.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Service for handling image file uploads and storage.
 * Stores files in the configured upload directory on disk.
 */
@Slf4j
@Service
public class FileStorageService {

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    @Value("${app.upload.dir}")
    private String uploadDirPath;

    private Path uploadDir;

    @PostConstruct
    public void init() {
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDir);
            log.info("Upload directory initialized: {}", uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    /**
     * Stores an uploaded file and returns the relative URL path.
     *
     * @param file     MultipartFile from the request.
     * @param subDir   Optional sub-directory (e.g. project ID).
     * @return Relative URL path for serving the file (e.g. /uploads/abc.jpg).
     * @throws IOException If file write fails.
     */
    public String store(MultipartFile file, String subDir) throws IOException {
        validateFile(file);

        String extension = getExtension(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "." + extension;

        Path targetDir = (subDir != null && !subDir.isEmpty())
                ? uploadDir.resolve(subDir)
                : uploadDir;

        Files.createDirectories(targetDir);

        Path targetPath = targetDir.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return as a relative URL accessible via the resource handler
        String relativePath = subDir != null
                ? "/uploads/" + subDir + "/" + uniqueFileName
                : "/uploads/" + uniqueFileName;

        log.info("File stored: {}", relativePath);
        return relativePath;
    }

    /**
     * Deletes a file by its relative URL path.
     *
     * @param relativeUrl The path returned from store().
     */
    public void delete(String relativeUrl) {
        try {
            String filePath = relativeUrl.replace("/uploads/", "");
            Path path = uploadDir.resolve(filePath).normalize();
            Files.deleteIfExists(path);
            log.info("File deleted: {}", path);
        } catch (IOException e) {
            log.error("Could not delete file: {}", relativeUrl, e);
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store an empty file.");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException(
                    "File type not allowed. Accepted: JPEG, PNG, WEBP, GIF. Got: " + file.getContentType());
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File size exceeds 10 MB limit.");
        }
    }

    private String getExtension(String originalName) {
        String cleanName = StringUtils.cleanPath(originalName != null ? originalName : "file");
        int dotIndex = cleanName.lastIndexOf('.');
        return (dotIndex > 0) ? cleanName.substring(dotIndex + 1).toLowerCase() : "jpg";
    }
}
