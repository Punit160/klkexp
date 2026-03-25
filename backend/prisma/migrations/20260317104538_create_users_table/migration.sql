-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `reporting_head` VARCHAR(191) NOT NULL,
    `doj` DATETIME(3) NOT NULL,
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
    `created_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_user_id_key`(`user_id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
