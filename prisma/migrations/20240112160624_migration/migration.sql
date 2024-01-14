-- CreateTable
CREATE TABLE `organization_types` (
    `type` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organizations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `organization_type` VARCHAR(191) NOT NULL,
    `is_vendor` BOOLEAN NOT NULL DEFAULT false,
    `is_delinquent` BOOLEAN NOT NULL DEFAULT false,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NULL,
    `street1` VARCHAR(191) NOT NULL,
    `street2` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NOT NULL,
    `state_or_region` VARCHAR(191) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_active_contractor` TINYINT NULL,
    `is_active_work_resource` TINYINT NULL,
    `revenue_share` TINYINT NULL,
    `revision_revenue_share` TINYINT NULL,
    `invoice_recipient` VARCHAR(255) NULL,
    `invoice_recipient_email` VARCHAR(255) NULL,
    `project_property_type_default_value` VARCHAR(255) NULL,
    `mounting_type_default_value` VARCHAR(255) NULL,
    `address_coordinates` VARCHAR(255) NOT NULL,
    `full_address` VARCHAR(255) NOT NULL,
    `is_special_revision_pricing` BOOLEAN NOT NULL,
    `number_of_free_revision_count` TINYINT UNSIGNED NULL,

    UNIQUE INDEX `organizations_name_key`(`name`),
    INDEX `organizations_organization_type_fkey`(`organization_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation_emails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `role_name` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_id`(`user_id`),
    INDEX `user_role_role_fkey`(`role_name`),
    PRIMARY KEY (`user_id`, `role_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `date_of_joining` DATETIME(0) NULL,
    `type` VARCHAR(255) NOT NULL,
    `deliverables_emails` TEXT NULL,
    `email` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT 'sign up not completed',
    `organization_id` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_hand_raised_for_task` BOOLEAN NOT NULL,
    `address` TEXT NULL,
    `phone_number` VARCHAR(20) NULL,
    `is_active_work_resource` BOOLEAN NULL,
    `is_current_user` BOOLEAN NULL,
    `is_inactive_organization_user` BOOLEAN NULL,
    `revenue_share` BOOLEAN NULL,
    `revision_revenue_share` BOOLEAN NULL,
    `updated_by` VARCHAR(255) NOT NULL,
    `is_vendor` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_organization_id_fkey`(`organization_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passwords` (
    `user_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `passwords_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `max_assigned_tasks_limit` TINYINT UNSIGNED NULL,
    `license_type` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `billing_code` VARCHAR(255) NOT NULL,
    `base_price` DECIMAL(13, 4) NULL,
    `gm_price` DECIMAL(13, 4) NULL,
    `revision_price` DECIMAL(13, 4) NULL,
    `revision_gm_price` DECIMAL(13, 4) NULL,
    `fixed_price` DECIMAL(13, 4) NULL,
    `commercial_revision_cost_per_unit` DECIMAL(13, 4) NULL,
    `commercial_revision_minutes_per_unit` INTEGER UNSIGNED NULL DEFAULT 1,

    UNIQUE INDEX `name`(`name`),
    UNIQUE INDEX `billing_code`(`billing_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordered_services` (
    `id` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `is_expedited` BOOLEAN NOT NULL DEFAULT false,
    `service_id` VARCHAR(255) NOT NULL,
    `job_id` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(13, 4) NULL,
    `price_override` DECIMAL(13, 4) NULL,
    `status` VARCHAR(255) NULL,
    `done_at` DATETIME(0) NULL,
    `ordered_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `description` TEXT NULL,
    `size_for_revision` VARCHAR(255) NULL,
    `project_id` VARCHAR(255) NOT NULL,
    `is_revision` BOOLEAN NOT NULL DEFAULT false,
    `is_manual_price` BOOLEAN NOT NULL,
    `project_property_type` VARCHAR(255) NOT NULL,
    `mounting_type` VARCHAR(255) NOT NULL,
    `project_number` VARCHAR(255) NULL,
    `project_property_owner_name` VARCHAR(255) NULL,
    `job_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `state_name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,
    `geo_id` VARCHAR(20) NOT NULL,
    `state_code` VARCHAR(20) NULL,
    `ansi_code` VARCHAR(20) NULL,
    `state_long_name` VARCHAR(191) NULL,
    `lsad_code` VARCHAR(20) NULL,
    `func_stat` VARCHAR(20) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`state_name`, `abbreviation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_position` (
    `user_id` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `position_id` VARCHAR(191) NOT NULL,
    `position_name` VARCHAR(255) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_email` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_id`(`user_id`),
    INDEX `user_position_position_id_fkey`(`position_id`),
    PRIMARY KEY (`user_id`, `position_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `county_subdivisions` (
    `geo_id` VARCHAR(20) NOT NULL,
    `state_code` VARCHAR(20) NULL,
    `state_name` VARCHAR(200) NULL,
    `county_code` VARCHAR(20) NULL,
    `name` VARCHAR(200) NULL,
    `ansi_code` VARCHAR(20) NULL,
    `lsad_code` VARCHAR(20) NULL,
    `func_stat` VARCHAR(20) NULL,
    `long_name` VARCHAR(200) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

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
    `lsad_code` VARCHAR(20) NULL,
    `func_stat` VARCHAR(20) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`geo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `places` (
    `geo_id` VARCHAR(20) NOT NULL,
    `state_code` VARCHAR(20) NULL,
    `state_name` VARCHAR(100) NULL,
    `place_c` VARCHAR(20) NULL,
    `ansi_code` VARCHAR(20) NULL,
    `place_fips` VARCHAR(20) NULL,
    `place_name` VARCHAR(100) NULL,
    `place_type` VARCHAR(20) NULL,
    `lsad_code` VARCHAR(20) NULL,
    `counties` VARCHAR(100) NULL,
    `func_stat` VARCHAR(20) NULL,
    `place_long_name` VARCHAR(200) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`geo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ahj_notes` (
    `geo_id` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `type` VARCHAR(20) NULL,
    `geo_id_state` VARCHAR(20) NOT NULL,
    `geo_id_county` VARCHAR(20) NULL,
    `geo_id_county_subdivision` VARCHAR(20) NULL,
    `geo_id_place` VARCHAR(20) NULL,
    `name` VARCHAR(300) NOT NULL,
    `full_ahj_name` VARCHAR(300) NOT NULL,
    `query_state` VARCHAR(20) NULL,
    `query_county` VARCHAR(200) NULL,
    `website` VARCHAR(242) NULL,
    `specific_form_required` VARCHAR(200) NULL,
    `building_codes` TEXT NULL,
    `general_notes` TEXT NULL,
    `pv_meter_required` VARCHAR(200) NULL,
    `ac_disconnect_required` VARCHAR(200) NULL,
    `center_fed_120_percent` VARCHAR(200) NULL,
    `derated_ampacity` VARCHAR(200) NULL,
    `fire_set_back` TEXT NULL,
    `utility_notes` TEXT NULL,
    `design_notes` TEXT NULL,
    `iebc_accepted` VARCHAR(300) NULL,
    `structural_observation_required` VARCHAR(20) NULL,
    `digital_signature_type` VARCHAR(300) NULL,
    `wind_uplift_calculation_required` VARCHAR(300) NULL,
    `wind_speed` VARCHAR(300) NULL,
    `wind_exposure` VARCHAR(300) NULL,
    `snow_load_ground` VARCHAR(300) NULL,
    `snow_load_flat_roof` VARCHAR(300) NULL,
    `snow_load_sloped_roof` VARCHAR(300) NULL,
    `wet_stamps_required` VARCHAR(300) NULL,
    `of_wet_stamps` VARCHAR(300) NULL,
    `wet_stamp_size` VARCHAR(300) NULL,
    `engineering_notes` TEXT NULL,
    `electrical_notes` TEXT NULL,
    `state_code` VARCHAR(20) NULL,
    `func_stat` VARCHAR(300) NULL,
    `address` VARCHAR(300) NULL,
    `lsad_code` VARCHAR(20) NULL,
    `usps` VARCHAR(20) NULL,
    `ansi_code` VARCHAR(20) NULL,
    `long_name` VARCHAR(300) NULL,
    `county_code` VARCHAR(20) NULL,
    `modified_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_by` VARCHAR(300) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`geo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ahj_note_history` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `geo_id` VARCHAR(20) NOT NULL,
    `geo_id_state` VARCHAR(20) NOT NULL,
    `geo_id_county` VARCHAR(20) NULL,
    `geo_id_county_subdivision` VARCHAR(20) NULL,
    `geo_id_place` VARCHAR(20) NULL,
    `name` VARCHAR(300) NOT NULL,
    `full_ahj_name` VARCHAR(300) NOT NULL,
    `query_state` VARCHAR(20) NULL,
    `query_county` VARCHAR(200) NULL,
    `website` VARCHAR(242) NULL,
    `specific_form_required` VARCHAR(200) NULL,
    `building_codes` TEXT NULL,
    `general_notes` TEXT NULL,
    `pv_meter_required` VARCHAR(200) NULL,
    `ac_disconnect_required` VARCHAR(200) NULL,
    `center_fed_120_percent` VARCHAR(200) NULL,
    `derated_ampacity` VARCHAR(200) NULL,
    `fire_set_back` TEXT NULL,
    `utility_notes` TEXT NULL,
    `design_notes` TEXT NULL,
    `iebc_accepted` VARCHAR(300) NULL,
    `structural_observation_required` VARCHAR(20) NULL,
    `digital_signature_type` VARCHAR(300) NULL,
    `wind_uplift_calculation_required` VARCHAR(300) NULL,
    `wind_speed` VARCHAR(300) NULL,
    `wind_exposure` VARCHAR(300) NULL,
    `snow_load_ground` VARCHAR(300) NULL,
    `snow_load_flat_roof` VARCHAR(300) NULL,
    `snow_load_sloped_roof` VARCHAR(300) NULL,
    `wet_stamps_required` VARCHAR(300) NULL,
    `of_wet_stamps` VARCHAR(300) NULL,
    `wet_stamp_size` VARCHAR(300) NULL,
    `engineering_notes` TEXT NULL,
    `electrical_notes` TEXT NULL,
    `state_code` VARCHAR(20) NULL,
    `func_stat` VARCHAR(300) NULL,
    `address` VARCHAR(300) NULL,
    `lsad_code` VARCHAR(20) NULL,
    `usps` VARCHAR(20) NULL,
    `ansi_code` VARCHAR(20) NULL,
    `type` VARCHAR(20) NULL,
    `long_name` VARCHAR(300) NULL,
    `county_code` VARCHAR(20) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `modified_at` DATETIME(0) NOT NULL,
    `updated_by` VARCHAR(300) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contractors` (
    `id` VARCHAR(255) NOT NULL,
    `prepaid_expenses_total_currency` DECIMAL(12, 2) NULL,
    `credit_memos_total_currency` DECIMAL(12, 2) NULL,
    `credits_returned_to_barun_corp_as_cash_total_currency` DECIMAL(12, 2) NULL,
    `total_vendor_credits_applied_to_vendor_invoices_currency` DECIMAL(12, 2) NULL,
    `remaining_vendor_credit_balance` DECIMAL(12, 2) NULL,
    `revenue_share_checkbox` TINYINT NULL,
    `revision_revenue_share_checkbox` TINYINT NULL,
    `organization_id` VARCHAR(255) NULL,
    `organization_name` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `user_id` VARCHAR(255) NOT NULL,
    `annual_salary` DECIMAL(12, 2) NULL,
    `id` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordered_job_notes` (
    `id` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `commneter_name` VARCHAR(255) NOT NULL,
    `commenter_user_id` VARCHAR(255) NOT NULL,
    `job_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordered_jobs` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `project_number` VARCHAR(255) NULL,
    `invoice_id` VARCHAR(255) NULL,
    `revision_size` VARCHAR(255) NULL,
    `pricing_type` VARCHAR(255) NULL,
    `client_organization_name` VARCHAR(255) NOT NULL,
    `client_organization_id` VARCHAR(255) NOT NULL,
    `project_id` VARCHAR(255) NOT NULL,
    `is_expedited` BOOLEAN NOT NULL DEFAULT false,
    `client_user_id` VARCHAR(255) NOT NULL,
    `client_user_name` VARCHAR(255) NOT NULL,
    `job_status` TEXT NULL,
    `job_name` VARCHAR(255) NOT NULL,
    `job_request_number` INTEGER NOT NULL,
    `received_at` DATETIME(0) NOT NULL,
    `date_due` DATE NULL,
    `mounting_type` VARCHAR(255) NOT NULL,
    `project_type` VARCHAR(255) NOT NULL,
    `number_of_wet_stamp` TINYINT UNSIGNED NULL,
    `date_sent_to_client` DATE NULL,
    `property_address` TEXT NOT NULL,
    `system_size` DECIMAL(10, 2) NULL,
    `other_comments` TEXT NULL,
    `mailing_full_address_for_wet_stamp` VARCHAR(255) NULL,
    `job_notes_f` TEXT NULL,
    `additional_information_from_client` TEXT NULL,
    `agreed_minimum_units` DECIMAL(10, 2) NULL,
    `agreed_related_tiered_unit_description` DECIMAL(10, 2) NULL,
    `agreed_tier_1_operator` VARCHAR(255) NULL,
    `agreed_tier_1_units` DECIMAL(10, 2) NULL,
    `agreed_tier_2_operator` VARCHAR(255) NULL,
    `agreed_tier_2_units` DECIMAL(10, 2) NULL,
    `agreed_tier_3_operator` VARCHAR(255) NULL,
    `agreed_tier_3_units` DECIMAL(10, 2) NULL,
    `approved_for_invoice` BOOLEAN NULL,
    `line_item_issued` DECIMAL(10, 2) NULL,
    `invoice_cancelled_job` TEXT NULL,
    `cancel_job` TEXT NULL,
    `charge_for_any_revision` BOOLEAN NULL,
    `charge_for_any_revision_override` BOOLEAN NULL,
    `charge_for_any_revision_snapshot` BOOLEAN NULL,
    `client_contact_email` VARCHAR(255) NOT NULL,
    `client_contact_email_override` VARCHAR(255) NULL,
    `commercial_job_price` DECIMAL(10, 2) NULL,
    `completed_cancelled_date` DATE NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `deliverables_link` TEXT NULL,
    `deliverables_email` TEXT NULL,
    `electrical_pe_and_wet_stamp_gl_solargraf` BOOLEAN NULL,
    `estimated_days_to_complete` INTEGER NULL,
    `estimated_days_to_complete_override` INTEGER NULL,
    `ever_on_hold` BOOLEAN NULL,
    `export_id` TEXT NULL,
    `formula_sandbox` VARCHAR(255) NULL,
    `formula_sandbox_countdown` TEXT NULL,
    `formula_sandbox_parcel_tracker` TEXT NULL,
    `formula_sandbox_2` TEXT NULL,
    `formula_sandbox_3` TEXT NULL,
    `formula_sandbox_4` TEXT NULL,
    `formula_sandbox_5` TEXT NULL,
    `formula_sandbox_6` TEXT NULL,
    `google_drive_job_deliverables_folder_id` TEXT NULL,
    `google_drive_job_folder_id` TEXT NULL,
    `in_review` BOOLEAN NULL,
    `is_design_job` BOOLEAN NULL,
    `is_locked` BOOLEAN NULL,
    `is_revision` BOOLEAN NULL,
    `updated_by` VARCHAR(255) NOT NULL,
    `maximum_message_date_time` DATETIME(0) NULL,
    `maximum_unix_time` DECIMAL(20, 0) NULL,
    `admin_comments` TEXT NULL,
    `related_line_item` DECIMAL(10, 2) NULL,
    `restricted_access` BOOLEAN NULL,
    `service_order_id` INTEGER NULL,
    `show_client_structural_upgrade_message` BOOLEAN NULL,
    `six_months_prior` DATE NULL,
    `standard_pricing` BOOLEAN NULL,
    `structural_or_electrical_pe_and_wet_stamp_selected_gl` BOOLEAN NULL,
    `mailing_adderss_city` VARCHAR(255) NULL,
    `mailing_adderss_state` VARCHAR(255) NULL,
    `mailing_adderss_coordinates` VARCHAR(255) NULL,
    `mailing_adderss_street1` VARCHAR(255) NULL,
    `mailing_adderss_street2` VARCHAR(255) NULL,
    `mailing_adderss_postal_code` VARCHAR(255) NULL,
    `mailing_adderss_country` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordered_projects` (
    `id` VARCHAR(255) NOT NULL,
    `property_address_coordinates` VARCHAR(255) NOT NULL,
    `project_property_type` VARCHAR(255) NOT NULL,
    `mounting_type` VARCHAR(255) NULL,
    `mailing_address_for_wet_stamps` VARCHAR(255) NULL,
    `system_size` DECIMAL(10, 2) NULL,
    `date_created` DATETIME(0) NOT NULL,
    `has_history_structural_pe_stamp` BOOLEAN NOT NULL DEFAULT false,
    `has_history_electrical_pe_stamp` BOOLEAN NOT NULL DEFAULT false,
    `project_folder` VARCHAR(255) NULL,
    `project_number` VARCHAR(255) NULL,
    `property_full_address` VARCHAR(255) NOT NULL,
    `property_address_street1` VARCHAR(255) NOT NULL,
    `property_address_street2` VARCHAR(255) NULL,
    `property_address_city` VARCHAR(255) NOT NULL,
    `property_address_state` VARCHAR(255) NOT NULL,
    `property_address_postal_code` VARCHAR(10) NOT NULL,
    `property_owner_name` VARCHAR(255) NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `master_log_upload` BOOLEAN NULL,
    `ahj_automation_complete` BOOLEAN NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `export_id` VARCHAR(255) NULL,
    `google_geocoder` VARCHAR(255) NULL,
    `re_trigger_activate_create_project_folder_trigger` BOOLEAN NULL,
    `last_modified_by` VARCHAR(255) NOT NULL,
    `new_battery_storage_design` BOOLEAN NULL,
    `number_of_wet_stamps` INTEGER NULL,
    `number_of_structural_wet_stamps` INTEGER NULL,
    `number_of_electrical_wet_stamps` INTEGER NULL,
    `google_drive_client_account_active_folder_id` VARCHAR(255) NULL,
    `sandbox_checkbox` BOOLEAN NULL,
    `ahj_automation_last_run_date` DATETIME(0) NULL,
    `sandbox_formula` VARCHAR(255) NULL,
    `container_id_1` VARCHAR(255) NULL,
    `new_share_drive_structure` VARCHAR(255) NULL,
    `state_id` VARCHAR(255) NOT NULL,
    `county_id` VARCHAR(255) NULL,
    `county_subdivisions_id` VARCHAR(255) NULL,
    `place_id` VARCHAR(255) NULL,
    `ahj_id` VARCHAR(255) NULL,
    `is_ground_mount` BOOLEAN NULL,
    `mailing_address_for_structural_wet_stamp` VARCHAR(255) NULL,
    `mailing_address_for_electrical_wet_stamp` VARCHAR(255) NULL,
    `client_organization_id` VARCHAR(255) NOT NULL,
    `design_or_pe_stamp_previously_done_on_project_outside` INTEGER NULL,
    `total_of_jobs` INTEGER NOT NULL DEFAULT 1,
    `property_address_country` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricings` (
    `id` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NULL,
    `service_id` VARCHAR(255) NULL,
    `organization_name` VARCHAR(255) NULL,
    `task_name` VARCHAR(255) NULL,
    `flat_price` DECIMAL(10, 2) NULL,
    `new_storage_design_additional_price` DECIMAL(10, 2) NULL,
    `additional_or_replaced_storage_design_additional_price` DECIMAL(10, 2) NULL,
    `flat_major_revision_price` DECIMAL(10, 2) NULL,
    `flat_minor_revision_price` DECIMAL(10, 2) NULL,
    `flat_ground_mount_price` DECIMAL(10, 2) NULL,
    `flat_ground_mount_major_revision_price` DECIMAL(10, 2) NULL,
    `flat_ground_mount_minor_revision_price` DECIMAL(10, 2) NULL,
    `unit_price` DECIMAL(10, 2) NULL,
    `tier_1_operator` VARCHAR(255) NULL,
    `tier_1_units` DECIMAL(10, 0) NULL,
    `tier_1_price` DECIMAL(10, 2) NULL,
    `tier_1_major_revision_price` DECIMAL(10, 2) NULL,
    `tier_1_minor_revision_price` DECIMAL(10, 2) NULL,
    `tier_1_ground_mount_price` DECIMAL(10, 2) NULL,
    `tier_1_ground_mount_major_revision_price` DECIMAL(10, 2) NULL,
    `tier_1_ground_mount_minor_revision_price` DECIMAL(10, 2) NULL,
    `tier_2_operator` VARCHAR(255) NULL,
    `tier_2_units` DECIMAL(10, 0) NULL,
    `tier_2_price` DECIMAL(10, 2) NULL,
    `tier_2_major_revision_price` DECIMAL(10, 2) NULL,
    `tier_2_minor_revision_price` DECIMAL(10, 2) NULL,
    `tier_2_ground_mount_price` DECIMAL(10, 2) NULL,
    `tier_2_ground_mount_major_revision_price` DECIMAL(10, 2) NULL,
    `tier_2_ground_mount_minor_revision_price` DECIMAL(10, 2) NULL,
    `tier_3_operator` VARCHAR(255) NULL,
    `tier_3_units` DECIMAL(10, 0) NULL,
    `tier_3_price` DECIMAL(10, 2) NULL,
    `tier_3_major_revision_price` DECIMAL(10, 2) NULL,
    `tier_3_minor_revision_price` DECIMAL(10, 2) NULL,
    `tier_3_ground_mount_price` DECIMAL(10, 2) NULL,
    `tier_3_ground_mount_major_revision_price` DECIMAL(10, 2) NULL,
    `tier_3_ground_mount_minor_revision_price` DECIMAL(10, 2) NULL,
    `count_duplicates` DECIMAL(10, 0) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `updated_by` VARCHAR(255) NULL,
    `service_billing_code_new` VARCHAR(255) NULL,
    `task_group_revision_price` DECIMAL(10, 2) NULL,
    `tier_1_related_operator` DECIMAL(10, 0) NULL,
    `tier_2_related_operator` DECIMAL(10, 0) NULL,
    `tier_3_related_operator` DECIMAL(10, 0) NULL,
    `related_service` DECIMAL(10, 0) NULL,
    `old_related_tiered_unit_description` DECIMAL(10, 0) NULL,
    `client_account_tiered_pricing` BOOLEAN NULL,
    `client_account` VARCHAR(255) NULL,
    `related_client_account` DECIMAL(10, 0) NULL,
    `internal_account_account_name` VARCHAR(255) NULL,
    `related_internal_account` DECIMAL(10, 0) NULL,
    `old_price_group_group_name` VARCHAR(255) NULL,
    `related_price_group` DECIMAL(10, 0) NULL,
    `property_type` VARCHAR(255) NULL,
    `related_property_type` DECIMAL(10, 0) NULL,
    `record_status` VARCHAR(255) NULL,
    `related_record_status` DECIMAL(10, 0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_accounts` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `is_multiple_containers` TINYINT NULL,
    `is_restricted_access` TINYINT NULL,
    `file_storage_container_url` VARCHAR(255) NULL,
    `file_storage_container_id` VARCHAR(255) NULL,
    `file_storage_client_account_folder_url_formula_url` VARCHAR(255) NULL,
    `file_storage_client_account_folder_id` VARCHAR(255) NULL,
    `google_drive_client_account_commercial_folder_url` VARCHAR(255) NULL,
    `google_drive_client_account_commercial_folder_id` VARCHAR(255) NULL,
    `google_drive_client_account_industrial_folder_url` VARCHAR(255) NULL,
    `google_drive_client_account_industrial_folder_id` VARCHAR(255) NULL,
    `google_drive_client_account_residential_folder_url` VARCHAR(255) NULL,
    `google_drive_client_account_residential_folder_id` VARCHAR(255) NULL,
    `trigger_create_google_drive_client_account_folders` VARCHAR(255) NULL,
    `remaining_credit_balance` INTEGER NULL,
    `design_notes` TEXT NULL,
    `electrical_engineering_notes` TEXT NULL,
    `structural_engineering_notes` TEXT NULL,
    `prepaid_services_total` DECIMAL(10, 2) NULL,
    `credits_returned_to_client_as_cash_total` DECIMAL(10, 2) NULL,
    `credit_memos_total` DECIMAL(10, 2) NULL,
    `total_credits_applied_to_invoices` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `id` VARCHAR(255) NOT NULL,
    `service_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `license_type` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assigned_tasks` (
    `id` VARCHAR(255) NOT NULL,
    `task_id` VARCHAR(255) NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `cost` DECIMAL(13, 4) NULL,
    `is_expedited` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `is_revision` BOOLEAN NOT NULL,
    `is_vendor` BOOLEAN NOT NULL,
    `started_at` DATETIME(0) NULL,
    `done_at` DATETIME(0) NULL,
    `duration` TINYINT NULL,
    `description` TEXT NULL,
    `vendor_invoice_id` VARCHAR(255) NULL,
    `assignee_id` VARCHAR(255) NULL,
    `assignee_name` VARCHAR(255) NULL,
    `assignee_organization_id` VARCHAR(255) NULL,
    `assignee_organization_name` VARCHAR(255) NULL,
    `ordered_service_id` VARCHAR(255) NOT NULL,
    `service_id` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `project_id` VARCHAR(255) NOT NULL,
    `project_number` VARCHAR(255) NULL,
    `project_property_owner_name` VARCHAR(255) NULL,
    `project_property_type` VARCHAR(255) NOT NULL,
    `job_id` VARCHAR(255) NOT NULL,
    `job_name` VARCHAR(255) NOT NULL,
    `mounting_type` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit_transactions` (
    `id` VARCHAR(255) NOT NULL,
    `client_organization_id` VARCHAR(255) NOT NULL,
    `created_by` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(13, 4) NOT NULL,
    `transaction_type` ENUM('Reload', 'Deduction') NOT NULL,
    `related_invoice_id` VARCHAR(255) NULL,
    `transaction_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `client_organization_id`(`client_organization_id`),
    INDEX `related_invoice_id`(`related_invoice_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` VARCHAR(255) NOT NULL,
    `status` ENUM('Unissued', 'Issued', 'Paid') NOT NULL DEFAULT 'Unissued',
    `invoice_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `terms` TINYINT UNSIGNED NOT NULL DEFAULT 30,
    `due_date` DATE NULL,
    `notes_to_client` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `client_organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `service_month` DATE NOT NULL,
    `sub_total` DECIMAL(13, 4) NOT NULL,
    `discount` DECIMAL(13, 4) NOT NULL,
    `total` DECIMAL(13, 4) NOT NULL,

    INDEX `client_organization_id`(`client_organization_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(255) NOT NULL,
    `invoice_id` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(13, 4) NOT NULL,
    `payment_method` ENUM('Credit', 'Direct') NOT NULL,
    `payment_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `notes` TEXT NULL,
    `canceled_at` DATETIME(0) NULL,
    `created_by` VARCHAR(255) NOT NULL,

    INDEX `invoice_id`(`invoice_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_commercial_pricing_tiers` (
    `service_id` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `starting_point` DECIMAL(13, 4) NOT NULL,
    `finishing_point` DECIMAL(13, 4) NULL,
    `price` DECIMAL(13, 4) NOT NULL,
    `gm_price` DECIMAL(13, 4) NOT NULL,

    PRIMARY KEY (`service_id`, `organization_id`, `starting_point`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_fixed_pricings` (
    `service_id` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(13, 4) NOT NULL,

    PRIMARY KEY (`service_id`, `organization_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_residential_pricing_tiers` (
    `service_id` VARCHAR(200) NOT NULL,
    `service_name` VARCHAR(200) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `starting_point` INTEGER UNSIGNED NOT NULL,
    `finishing_point` INTEGER UNSIGNED NULL,
    `price` DECIMAL(13, 4) NOT NULL,
    `gm_price` DECIMAL(13, 4) NOT NULL,

    PRIMARY KEY (`service_id`, `organization_id`, `starting_point`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_residential_revision_pricings` (
    `service_id` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(13, 4) NOT NULL,
    `gm_price` DECIMAL(13, 4) NOT NULL,

    PRIMARY KEY (`service_id`, `organization_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commercial_standard_pricing_tiers` (
    `service_id` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `starting_point` DECIMAL(13, 4) NOT NULL,
    `finishing_point` DECIMAL(13, 4) NULL,
    `price` DECIMAL(13, 4) NOT NULL,
    `gm_price` DECIMAL(13, 4) NOT NULL,

    PRIMARY KEY (`service_id`, `starting_point`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_pricings` (
    `id` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `service_id` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `has_residential_new_service_pricing` BOOLEAN NOT NULL,
    `has_residential_revision_pricing` BOOLEAN NOT NULL,
    `has_commercial_new_service_tier` BOOLEAN NOT NULL,
    `has_fixed_pricing` BOOLEAN NOT NULL,

    UNIQUE INDEX `organization_id`(`organization_id`, `service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_pricings` (
    `id` VARCHAR(255) NOT NULL,
    `task_id` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `resi_new_expense_type` VARCHAR(255) NOT NULL,
    `resi_new_value` DECIMAL(13, 4) NOT NULL,
    `resi_rev_expense_type` VARCHAR(255) NOT NULL,
    `resi_rev_value` DECIMAL(13, 4) NOT NULL,
    `com_new_expense_type` VARCHAR(255) NOT NULL,
    `com_new_value` DECIMAL(13, 4) NOT NULL,
    `com_rev_expense_type` VARCHAR(255) NOT NULL,
    `com_rev_value` DECIMAL(13, 4) NOT NULL,

    UNIQUE INDEX `task_id`(`task_id`, `organization_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendor_invoices` (
    `id` VARCHAR(255) NOT NULL,
    `invoice_number` VARCHAR(255) NOT NULL,
    `organization_id` VARCHAR(255) NOT NULL,
    `organization_name` VARCHAR(255) NOT NULL,
    `invoice_date` DATETIME(0) NOT NULL,
    `terms` TINYINT NOT NULL,
    `due_date` DATETIME(0) NULL,
    `days_past_due` DATETIME(0) NULL,
    `note` TEXT NULL,
    `service_month` DATE NOT NULL,
    `sub_total` DECIMAL(13, 4) NOT NULL,
    `total` DECIMAL(13, 4) NOT NULL,
    `invoice_total_difference` DECIMAL(13, 4) NOT NULL,
    `internal_total_balance_due` DECIMAL(13, 4) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `transaction_type` VARCHAR(255) NULL,
    `count_line_items` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendor_payments` (
    `id` VARCHAR(255) NOT NULL,
    `vendor_invoice_id` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(13, 4) NOT NULL,
    `payment_method` ENUM('Credit', 'Direct') NOT NULL,
    `payment_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `notes` TEXT NULL,
    `canceled_at` DATETIME(0) NULL,
    `created_by` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `position_tasks` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `position_id` VARCHAR(255) NOT NULL,
    `position_name` VARCHAR(255) NOT NULL,
    `task_id` VARCHAR(255) NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `order` TINYINT UNSIGNED NOT NULL,
    `auto_assignment_type` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_available_tasks` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `task_id` VARCHAR(255) NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `auto_assignment_type` VARCHAR(255) NOT NULL,
    `is_hand_raised` BOOLEAN NOT NULL,
    `raised_at` DATETIME(0) NULL,
    `user_position_id` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_license` (
    `user_id` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `issuing_country_name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `expiry_date` DATETIME(3) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_id_2`(`user_id`, `abbreviation`, `type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prerequisite_tasks` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_id` VARCHAR(255) NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `prerequisite_task_id` VARCHAR(255) NOT NULL,
    `prerequisite_task_name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `task_id`(`task_id`, `prerequisite_task_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rejected_task_reasons` (
    `id` VARCHAR(255) NOT NULL,
    `assignee_user_id` VARCHAR(255) NOT NULL,
    `assignee_user_name` VARCHAR(255) NOT NULL,
    `reason` TEXT NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `assigned_task_id` VARCHAR(255) NOT NULL,
    `rejected_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assigning_task_alerts` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `job_id` VARCHAR(255) NOT NULL,
    `assigned_task_id` VARCHAR(255) NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `project_property_type` VARCHAR(255) NOT NULL,
    `mounting_type` VARCHAR(255) NOT NULL,
    `is_revision` BOOLEAN NOT NULL,
    `note` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `is_checked_out` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ptos` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `tenure` INTEGER NOT NULL,
    `total` FLOAT NOT NULL,
    `is_paid` BOOLEAN NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `ptos_user_id_tenure_key`(`user_id`, `tenure`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pto_types` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `abbreviation` VARCHAR(5) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `pto_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pto_available_values` (
    `id` VARCHAR(255) NOT NULL,
    `value` FLOAT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pto_types_available_values` (
    `pto_type_id` VARCHAR(255) NOT NULL,
    `pto_available_value_id` VARCHAR(255) NOT NULL,

    INDEX `pto_types_available_values_pto_type_id_idx`(`pto_type_id`),
    INDEX `pto_types_available_values_pto_available_value_id_idx`(`pto_available_value_id`),
    PRIMARY KEY (`pto_type_id`, `pto_available_value_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pto_details` (
    `id` VARCHAR(255) NOT NULL,
    `pto_id` VARCHAR(255) NOT NULL,
    `pto_type_id` VARCHAR(255) NOT NULL,
    `amount` FLOAT NOT NULL,
    `number` INTEGER NOT NULL,
    `started_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pto_tenure_policies` (
    `id` VARCHAR(255) NOT NULL,
    `tenure` TINYINT NOT NULL,
    `total` FLOAT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `pto_tenure_policies_tenure_key`(`tenure`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PtoAvailableValuesToPtoTypes` (
    `A` VARCHAR(255) NOT NULL,
    `B` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `_PtoAvailableValuesToPtoTypes_AB_unique`(`A`, `B`),
    INDEX `_PtoAvailableValuesToPtoTypes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;