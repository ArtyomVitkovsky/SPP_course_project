package com.example.itcompanyautomatization.Controllers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.Enums.DocumentStatusEnum;
import com.example.itcompanyautomatization.DTO.DocumentDTO;
import com.example.itcompanyautomatization.DTO.UserDocumentStatusDTO;
import com.example.itcompanyautomatization.Models.Document;
import com.example.itcompanyautomatization.Models.DocumentReceiveNotification;
import com.example.itcompanyautomatization.Models.DocumentStatus;
import com.example.itcompanyautomatization.Models.UserDocumentStatus;
import com.example.itcompanyautomatization.Repositories.Interface.IDocumentNotificationRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IDocumentRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IDocumentStatusRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IProjectCreationRequestRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IUserDocumentStatusRepository;
import com.example.itcompanyautomatization.Utils.StringUtilities;

@Controller
@RequestMapping(path = "/documents")
public class DocumentController {

    private IDocumentRepository documentRepository;
    private IUserDocumentStatusRepository userDocumentStatusRepository;
    private IDocumentNotificationRepository documentNotificationRepository;
    private IProjectCreationRequestRepository projectCreationRequestRepository;
    private IDocumentStatusRepository documentStatusRepository;
    private SimpMessagingTemplate messagingTemplate;

    public DocumentController(
            IDocumentRepository documentRepository,
            IUserDocumentStatusRepository userDocumentStatusRepository,
            IProjectCreationRequestRepository projectCreationRequestRepository,
            IDocumentStatusRepository documentStatusRepository,
            IDocumentNotificationRepository documentNotificationRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.documentRepository = documentRepository;
        this.userDocumentStatusRepository = userDocumentStatusRepository;
        this.projectCreationRequestRepository = projectCreationRequestRepository;
        this.documentStatusRepository = documentStatusRepository;
        this.documentNotificationRepository = documentNotificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping(path = "/setDocument")
    public @ResponseBody ResponseEntity<?> setDocument(@RequestBody DocumentDTO documentDTO) {
        try {
            Document documentToSave;
            UserDocumentStatus firstUserDocumentStatus = null;
            UserDocumentStatus secondUserDocumentStatus = null;

            if (documentDTO.creationDate == null)
                documentDTO.creationDate = LocalDate.now();

            Optional<Document> existingDocument = getDocumentFromRepository(documentDTO.id);
            if (existingDocument != null) {
                documentToSave = existingDocument.get();
                documentToSave.setName(documentDTO.name);
                documentToSave.setContent(documentDTO.content);
                documentToSave.setCreationDate(documentDTO.creationDate);
                documentToSave.setSender(documentDTO.sender);
                documentToSave.setReceiver(documentDTO.receiver);

                firstUserDocumentStatus = userDocumentStatusRepository
                        .findByUserIdAndDocumentId(documentDTO.sender.getId(), documentDTO.id).get();

                secondUserDocumentStatus = userDocumentStatusRepository
                        .findByUserIdAndDocumentId(documentDTO.receiver.getId(), documentDTO.id).get();

                documentToSave.setStatus(calculateStatus(firstUserDocumentStatus, secondUserDocumentStatus));

            } else {
                documentToSave = new Document(
                        documentDTO.name,
                        documentDTO.content,
                        documentDTO.creationDate,
                        documentDTO.sender,
                        documentDTO.receiver,
                        getDefaultStatus());

                firstUserDocumentStatus = createNewUserDocumentStatus(
                        new UserDocumentStatusDTO(null, documentToSave, documentDTO.sender, true));
                secondUserDocumentStatus = createNewUserDocumentStatus(
                        new UserDocumentStatusDTO(null, documentToSave, documentDTO.receiver, false));

                documentToSave.setStatus(calculateStatus(firstUserDocumentStatus, secondUserDocumentStatus));
            }

            Document document = documentRepository.save(documentToSave);

            TryToNotify(document);

            if (firstUserDocumentStatus != null)
                userDocumentStatusRepository.save(firstUserDocumentStatus);
            if (secondUserDocumentStatus != null)
                userDocumentStatusRepository.save(secondUserDocumentStatus);

            return ResponseEntity.status(200).body(document);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    private DocumentStatus calculateStatus(UserDocumentStatus first, UserDocumentStatus second) {
        DocumentStatus documentStatus = null;

        DocumentStatusEnum status = DocumentStatusEnum.NotSigned;

        if (first.getStatus() && second.getStatus()) {
            status = DocumentStatusEnum.Signed;
        } else if (first.getStatus() || second.getStatus()) {
            status = DocumentStatusEnum.PartiallySigned;
        }

        String statusStr = status.toString();
        Optional<DocumentStatus> documentStatusResult = documentStatusRepository.findByStatus(statusStr);

        if (documentStatusResult == null || !documentStatusResult.isPresent()) {
            DocumentStatus newDocumentStatus = new DocumentStatus();
            newDocumentStatus.setStatus(statusStr);

            documentStatus = documentStatusRepository.save(newDocumentStatus);
        } else {
            documentStatus = documentStatusResult.get();
        }

        return documentStatus;
    }

    private void TryToNotify(Document document) {

        String userId = document.getReceiver().getId();
        String documentId = document.getId();

        DocumentReceiveNotification notification = documentNotificationRepository.findByUserIdAndDocumentId(userId,
                documentId);

        if (notification != null) {
            Optional<UserDocumentStatus> receiverStatus = userDocumentStatusRepository
                    .findByUserIdAndDocumentId(userId, documentId);

            if (receiverStatus != null && receiverStatus.isPresent()) {
                if (receiverStatus.get().getStatus()) {
                    documentNotificationRepository.delete(notification);
                }
            }

            System.out.println("DocumentReceiveNotification already exists");

            return;
        }

        notification = new DocumentReceiveNotification(document.getReceiver(), document);

        documentNotificationRepository.save(notification);

        System.out.println("DocumentReceiveNotification sended with user id : " + userId);

        messagingTemplate.convertAndSend(
                "/topic/notif/" + userId,
                "Project creation requested!");
    }

    private DocumentStatus getDefaultStatus() {
        String defaultStatus = DocumentStatusEnum.NotSigned.toString();
        DocumentStatus status = null;
        Optional<DocumentStatus> statusResult = documentStatusRepository.findByStatus(defaultStatus);
        if (statusResult == null || !statusResult.isPresent()) {
            status = new DocumentStatus();
            status.setStatus(defaultStatus);
            DocumentStatus savedStatus = documentStatusRepository.save(status);
            return savedStatus;
        }

        status = statusResult.get();
        return status;
    }

    @PostMapping(path = "/deleteDocument")
    public @ResponseBody ResponseEntity<?> deleteDocument(@RequestBody DocumentDTO documentDTO) {
        try {
            Optional<Document> existingDocument = getDocumentFromRepository(documentDTO.id);

            if (existingDocument == null || !existingDocument.isPresent()) {
                return ResponseEntity.status(400).body("Document not found");
            }

            Document document = existingDocument.get();

            String receiverId = document.getReceiver().getId();

            documentRepository.delete(
                    projectCreationRequestRepository,
                    userDocumentStatusRepository,
                    documentNotificationRepository,
                    document);

            messagingTemplate.convertAndSend(
                    "/topic/notif/" + receiverId,
                    "Project creation request deleted!");
            return ResponseEntity.status(200).body("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }

    }

    @PostMapping(path = "/setUserDocumentStatus")
    public @ResponseBody ResponseEntity<?> setUserDocumentStatus(
            @RequestBody UserDocumentStatusDTO userDocumentStatusDTO) {
        try {
            UserDocumentStatus userDocumentStatusToSave;

            Optional<UserDocumentStatus> existingUserDocumentStatus = getUserDocumentStatusFromRepository(
                    userDocumentStatusDTO.document.getId(), userDocumentStatusDTO.user.getId());

            if (existingUserDocumentStatus != null && existingUserDocumentStatus.isPresent()) {
                userDocumentStatusToSave = existingUserDocumentStatus.get();
                userDocumentStatusToSave.setStatus(userDocumentStatusDTO.status);
            } else {
                userDocumentStatusToSave = createNewUserDocumentStatus(userDocumentStatusDTO);
            }

            userDocumentStatusRepository.save(userDocumentStatusToSave);
            return ResponseEntity.status(200).body("Saved");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    private UserDocumentStatus createNewUserDocumentStatus(UserDocumentStatusDTO userDocumentStatusDTO) {
        UserDocumentStatus newUserDocumentStatus = new UserDocumentStatus(
                userDocumentStatusDTO.document,
                userDocumentStatusDTO.user,
                userDocumentStatusDTO.status);

        return newUserDocumentStatus;
    }

    @GetMapping(path = "/getNotification")
    public @ResponseBody ResponseEntity<?> getNotification() {
        try {
            messagingTemplate.convertAndSend(
                    "/topic/notif/ba028443-a987-4464-9b9e-fd2483836b8a",
                    "Supply request approved");

            return ResponseEntity.status(200).body("");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getUserDocumentStatuses")
    public @ResponseBody ResponseEntity<?> getUserDocumentStatuses() {
        try {
            List<UserDocumentStatus> statuses = userDocumentStatusRepository.findAll();

            List<UserDocumentStatusDTO> userDocumentStatusDTOs = new ArrayList<>();
            statuses.forEach(status -> {
                userDocumentStatusDTOs.add(
                        new UserDocumentStatusDTO(
                                status.getId(),
                                status.getDocument(),
                                status.getUser(),
                                status.getStatus()));

            });

            return ResponseEntity.status(200).body(userDocumentStatusDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getDocuments")
    public @ResponseBody ResponseEntity<?> getAllDocuments() {
        try {
            List<Document> documents = documentRepository.findAll();

            List<DocumentDTO> documentDTOs = new ArrayList<>();
            documents.forEach(document -> {
                documentDTOs.add(
                        new DocumentDTO(
                                document.getId(),
                                document.getName(),
                                document.getContent(),
                                document.getCreationDate(),
                                document.getSender(),
                                document.getReceiver(),
                                document.getStatus()));

            });

            return ResponseEntity.status(200).body(documentDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getDocumentNotifications")
    public @ResponseBody ResponseEntity<?> getDocumentNotifications() {
        try {
            List<UserDocumentStatus> statuses = userDocumentStatusRepository.findAll();

            List<UserDocumentStatusDTO> userDocumentStatusDTOs = new ArrayList<>();
            statuses.forEach(status -> {
                userDocumentStatusDTOs.add(
                        new UserDocumentStatusDTO(
                                status.getId(),
                                status.getDocument(),
                                status.getUser(),
                                status.getStatus()));

            });

            return ResponseEntity.status(200).body(userDocumentStatusDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getDocumentById")
    public @ResponseBody ResponseEntity<Optional<Document>> getDocument(String documentId) {
        return ResponseEntity.status(200).body(documentRepository.findById(documentId));
    }

    private Optional<Document> getDocumentFromRepository(String id) {
        return StringUtilities.IsNullOrEmpty(id) ? null : documentRepository.findById(id);
    }

    private Optional<UserDocumentStatus> getUserDocumentStatusFromRepository(String documentId, String userId) {
        return StringUtilities.IsNullOrEmpty(documentId) && StringUtilities.IsNullOrEmpty(userId)
                ? null
                : userDocumentStatusRepository.findByUserIdAndDocumentId(userId, documentId);
    }
}
