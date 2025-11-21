package com.gigsly.gigsly_backend_api.config;

import com.gigsly.gigsly_backend_api.model.Category;
import com.gigsly.gigsly_backend_api.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final CategoryRepository categoryRepository;

    public DataInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        initializeCategories();
    }

    private void initializeCategories() {
        if (categoryRepository.count() > 0) {
            logger.info("Categories already exist, skipping initialization");
            return;
        }

        List<Category> defaultCategories = new ArrayList<>();
        defaultCategories.add(createCategory("Web Development", "Build responsive websites and web applications"));
        defaultCategories.add(createCategory("Mobile App Development", "Create iOS and Android mobile applications"));
        defaultCategories.add(createCategory("Graphic Design", "Logo design, branding, and visual identity"));
        defaultCategories.add(createCategory("Content Writing", "Blog posts, articles, and copywriting services"));
        defaultCategories.add(createCategory("Digital Marketing", "SEO, social media marketing, and online advertising"));
        defaultCategories.add(createCategory("Video Editing", "Professional video production and editing"));
        defaultCategories.add(createCategory("Photography", "Event photography, product shots, and portraits"));
        defaultCategories.add(createCategory("Data Entry", "Data processing, transcription, and administrative tasks"));
        defaultCategories.add(createCategory("Translation", "Language translation and localization services"));
        defaultCategories.add(createCategory("Virtual Assistant", "Administrative support and business services"));
        defaultCategories.add(createCategory("Accounting", "Bookkeeping, tax preparation, and financial services"));
        defaultCategories.add(createCategory("Consulting", "Business consulting and advisory services"));
        defaultCategories.add(createCategory("Software Development", "Custom software solutions and programming"));
        defaultCategories.add(createCategory("UI/UX Design", "User interface and user experience design"));
        defaultCategories.add(createCategory("E-commerce", "Online store setup and management"));
        defaultCategories.add(createCategory("SEO Services", "Search engine optimization and online visibility"));
        defaultCategories.add(createCategory("Social Media Management", "Content creation and social media strategy"));
        defaultCategories.add(createCategory("Customer Support", "Customer service and support solutions"));
        defaultCategories.add(createCategory("Project Management", "Project planning and coordination services"));
        defaultCategories.add(createCategory("Other", "Other services and categories"));

        categoryRepository.saveAll(defaultCategories);
        logger.info("Initialized {} default categories", defaultCategories.size());
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setIsActive(true);
        return category;
    }
}

