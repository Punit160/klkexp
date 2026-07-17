-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `reporting_head` VARCHAR(191) NOT NULL,
    `doj` DATETIME(3) NULL,
    `dol` DATETIME(3) NULL,
    `ctc` DOUBLE NULL,
    `phone_no` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `dob` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `qualification` VARCHAR(191) NULL,
    `user_img` VARCHAR(191) NULL,
    `pfesi` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NULL,

    UNIQUE INDEX `User_user_id_key`(`user_id`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_role_id_fkey`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `financial_year` VARCHAR(191) NOT NULL,
    `funder_name` VARCHAR(191) NOT NULL,
    `manager_id` VARCHAR(191) NOT NULL,
    `contact_person` VARCHAR(191) NOT NULL,
    `contact_person_number` VARCHAR(191) NOT NULL,
    `mou` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NULL,

    UNIQUE INDEX `Project_project_id_key`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Intervention` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpensePayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_name` VARCHAR(191) NOT NULL,
    `project_state` VARCHAR(191) NOT NULL,
    `project_district` VARCHAR(191) NOT NULL,
    `project_village` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `amount_change_by` INTEGER NULL,
    `requested_by` INTEGER NOT NULL,
    `requested_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `manager_id` INTEGER NOT NULL,
    `approval_status` INTEGER NOT NULL DEFAULT 0,
    `manager_remarks` VARCHAR(191) NULL,
    `review_assign` BOOLEAN NOT NULL DEFAULT false,
    `reviewer_id` INTEGER NULL,
    `reviewer_remarks` VARCHAR(191) NULL,
    `reviewer_approval_status` INTEGER NOT NULL DEFAULT 0,
    `reviewer_status` BOOLEAN NOT NULL DEFAULT false,
    `payment_status` INTEGER NOT NULL DEFAULT 0,
    `remarks` VARCHAR(191) NULL,
    `document` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `approved_amount` DOUBLE NULL DEFAULT 0,
    `company_id` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NULL,
    `final_approved_amount` DOUBLE NULL DEFAULT 0,
    `financial_year` VARCHAR(191) NOT NULL DEFAULT '',
    `intervention` INTEGER NOT NULL DEFAULT 0,
    `manager_approved_at` DATETIME(3) NULL,
    `managertoreviewer` VARCHAR(191) NOT NULL DEFAULT '',
    `paid_amount` DOUBLE NOT NULL DEFAULT 0,
    `reviewer_approved_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpensePaymentTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expense_id` INTEGER NOT NULL,
    `accountant_id` INTEGER NULL,
    `payment_amount` DOUBLE NOT NULL,
    `payment_mode` VARCHAR(191) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `reference_no` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ExpensePaymentTransaction_expense_id_idx`(`expense_id`),
    INDEX `ExpensePaymentTransaction_accountant_id_idx`(`accountant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,

    INDEX `RolePermission_permission_id_fkey`(`permission_id`),
    UNIQUE INDEX `RolePermission_role_id_permission_id_key`(`role_id`, `permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpensePaymentTransaction` ADD CONSTRAINT `ExpensePaymentTransaction_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `ExpensePayment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

