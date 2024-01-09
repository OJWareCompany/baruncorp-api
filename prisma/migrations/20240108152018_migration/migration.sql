-- CreateTable
CREATE TABLE `pto_types_available_values` (
    `pto_type_id` VARCHAR(255) NOT NULL,
    `pto_available_value_id` VARCHAR(255) NOT NULL,

    INDEX `pto_types_available_values_pto_type_id_idx`(`pto_type_id`),
    INDEX `pto_types_available_values_pto_available_value_id_idx`(`pto_available_value_id`),
    PRIMARY KEY (`pto_type_id`, `pto_available_value_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
