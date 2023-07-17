-- CreateTable
CREATE TABLE `county_subdivisions` (
    `geo_id` VARCHAR(20) NOT NULL,
    `state_code` VARCHAR(20) NULL,
    `state_name` VARCHAR(200) NULL,
    `county_code` VARCHAR(20) NULL,
    `name` VARCHAR(200) NULL,
    `ansi_code` VARCHAR(20) NULL,

    PRIMARY KEY (`geo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `counties` (
    `geo_id` VARCHAR(20) NOT NULL,
    `state_code` VARCHAR(20) NULL,
    `state_name` VARCHAR(100) NULL,
    `county_code` VARCHAR(20) NULL,
    `ansi_code` VARCHAR(20) NULL,
    `county_name` VARCHAR(100) NULL,
    `county_long_name` VARCHAR(100) NULL,

    PRIMARY KEY (`geo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `places` (
    `geo_id` VARCHAR(20) NOT NULL,
    `state_code` VARCHAR(20) NULL,
    `state_name` VARCHAR(100) NULL,
    `place_c` VARCHAR(20) NULL,
    `place_ns_ansi_code` VARCHAR(20) NULL,
    `place_fips` VARCHAR(20) NULL,
    `place_name` VARCHAR(100) NULL,
    `place_type` VARCHAR(20) NULL,
    `lsad_code` VARCHAR(20) NULL,
    `counties` VARCHAR(100) NULL,

    PRIMARY KEY (`geo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
