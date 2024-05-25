// package com.Seeders;

// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.event.ContextRefreshedEvent;
// import org.springframework.context.event.ContextStartedEvent;
// import org.springframework.context.event.EventListener;
// import org.springframework.stereotype.Component;

// import com.Enums.DocumentStatusEnum;
// import com.example.itcompanyautomatization.Models.DocumentStatus;
// import com.example.itcompanyautomatization.Repositories.Interface.IDocumentStatusRepository;

// @Component
// public class DatabaseSeeder {

// 	@Autowired
// 	IDocumentStatusRepository documentRepository;

// 	@Override
//     public void run(String... args) throws Exception {
//         // Check if the database is empty and seed data if necessary
//         if (documentRepository.count() == 0) {
//             loadDocumentStatusData();
//         }
//     }

// 	private void loadDocumentStatusData() {
// 		for (DocumentStatusEnum status : DocumentStatusEnum.values()) {
// 			Optional<DocumentStatus> existedStatusResult = documentRepository.findByStatus(status.toString());
			
// 			if(existedStatusResult != null && existedStatusResult.isPresent()) continue;

// 			DocumentStatus newStatus = new DocumentStatus();
// 			newStatus.setStatus(status.toString());

// 			documentRepository.save(newStatus);
// 		}

// 	}
// }