/*
가격 자동 입력 테스트
*/

-- Standard Commercial Pricing
INSERT INTO `commercial_standard_pricing_tiers` (`service_id`, `service_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 0.01,100,20,30
FROM service;

INSERT INTO `commercial_standard_pricing_tiers` (`service_id`, `service_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 100.01,200,22,32
FROM service;

INSERT INTO `commercial_standard_pricing_tiers` (`service_id`, `service_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 200.01,300,24,34
FROM service;

INSERT INTO `commercial_standard_pricing_tiers` (`service_id`, `service_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 300.01,400,26,36
FROM service;

INSERT INTO `commercial_standard_pricing_tiers` (`service_id`, `service_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 400.01,500,28,38
FROM service;

INSERT INTO `commercial_standard_pricing_tiers` (`service_id`, `service_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 500.01,null,30,40
FROM service;


-- Custom Residential

INSERT INTO `custom_residential_pricing_tiers` (`service_id`, `service_name`, `organization_id`, `organization_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
VALUES
	('a061c441-be8c-4bcc-9bcc-2460a01d5a16', 'Electrical Load Calculation', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('a061c441-be8c-4bcc-9bcc-2460a01d5a16', 'Electrical Load Calculation', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('a061c441-be8c-4bcc-9bcc-2460a01d5a16', 'Electrical Load Calculation', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('d7e19772-e937-40fd-b94f-77f056169d34', 'Electrical Load Justification Letter', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('d7e19772-e937-40fd-b94f-77f056169d34', 'Electrical Load Justification Letter', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('d7e19772-e937-40fd-b94f-77f056169d34', 'Electrical Load Justification Letter', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('5c29f1ae-d50b-4400-a6fb-b1a2c87126e9', 'Electrical PE Stamp', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('5c29f1ae-d50b-4400-a6fb-b1a2c87126e9', 'Electrical PE Stamp', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('5c29f1ae-d50b-4400-a6fb-b1a2c87126e9', 'Electrical PE Stamp', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('8d44cfe8-6c39-454f-8544-ede966943e6a', 'Electrical Post Installed Letter', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('8d44cfe8-6c39-454f-8544-ede966943e6a', 'Electrical Post Installed Letter', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('8d44cfe8-6c39-454f-8544-ede966943e6a', 'Electrical Post Installed Letter', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('4728f174-933a-4974-8e9a-6917720bffce', 'ESS Electrical PE Stamp', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('4728f174-933a-4974-8e9a-6917720bffce', 'ESS Electrical PE Stamp', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('4728f174-933a-4974-8e9a-6917720bffce', 'ESS Electrical PE Stamp', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('ab9cc5cf-62e4-4f27-8ffd-97488068f9fa', 'ESS Structural PE Stamp', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('ab9cc5cf-62e4-4f27-8ffd-97488068f9fa', 'ESS Structural PE Stamp', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('ab9cc5cf-62e4-4f27-8ffd-97488068f9fa', 'ESS Structural PE Stamp', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('435c5ab0-7605-40cd-811f-9343872f641a', 'FL Statute Letter', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('435c5ab0-7605-40cd-811f-9343872f641a', 'FL Statute Letter', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('435c5ab0-7605-40cd-811f-9343872f641a', 'FL Statute Letter', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('e5d81943-3fef-416d-a85b-addb8be296c0', 'PV Design', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('e5d81943-3fef-416d-a85b-addb8be296c0', 'PV Design', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('e5d81943-3fef-416d-a85b-addb8be296c0', 'PV Design', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('0ce4b659-601e-43c0-8420-a8ee6b95a385', 'Special Inspection Form', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('0ce4b659-601e-43c0-8420-a8ee6b95a385', 'Special Inspection Form', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('0ce4b659-601e-43c0-8420-a8ee6b95a385', 'Special Inspection Form', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('0904b078-6c8a-4044-9323-4757d6ca8afa', 'Structural Feasibility', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('0904b078-6c8a-4044-9323-4757d6ca8afa', 'Structural Feasibility', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('0904b078-6c8a-4044-9323-4757d6ca8afa', 'Structural Feasibility', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000),
	('99ff64ee-fe47-4235-a026-db197628d077', 'Structural PE Stamp', 'asda', 'BarunCorp', 1, NULL, 9.0000, 11.0000),
	('81b11cd8-bbcb-47c7-a45f-af339a422555', 'Structural Post Installed Letter ', 'asda', 'BarunCorp', 1, 2, 9.0000, 11.0000),
	('81b11cd8-bbcb-47c7-a45f-af339a422555', 'Structural Post Installed Letter ', 'asda', 'BarunCorp', 3, 4, 7.0000, 9.0000),
	('81b11cd8-bbcb-47c7-a45f-af339a422555', 'Structural Post Installed Letter ', 'asda', 'BarunCorp', 5, NULL, 6.0000, 8.0000);


-- Custom Fixed
INSERT INTO `custom_fixed_pricings` (`service_id`, `service_name`, `organization_id`, `organization_name`, `price`)
VALUES
	('0ce5a100-8b38-45fd-92a7-69e9aa7bd549', 'Structural Wet Stamp', 'asda', 'Barun Corp', 4.0000),
	('e95483bd-16ea-4a4d-8d68-81d2fa10a384', 'Electrical Wet Stamp', 'asda', 'Barun Corp', 4.0000);

-- Revision
INSERT INTO `custom_residential_revision_pricings` (`service_id`, `service_name`, `organization_id`, `organization_name`, `price`, `gm_price`)
SELECT	service.id, service.name, 'asda', 'BarunCorp', 777,888
FROM service
WHERE id != '2a2a256b-57a5-46f5-8cfb-1855cc29238a' OR id != '0ce5a100-8b38-45fd-92a7-69e9aa7bd549' OR id != 'e95483bd-16ea-4a4d-8d68-81d2fa10a384';


-- Custom Commercial
INSERT INTO `custom_commercial_pricing_tiers` (`service_id`, `service_name`, `organization_id`, `organization_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 'asda', 'BarunCorp', 0.01,100,200,300
FROM service
WHERE  id NOT IN('2a2a256b-57a5-46f5-8cfb-1855cc29238a','0ce5a100-8b38-45fd-92a7-69e9aa7bd549', 'e95483bd-16ea-4a4d-8d68-81d2fa10a384');

INSERT INTO `custom_commercial_pricing_tiers` (`service_id`, `service_name`, `organization_id`, `organization_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 'asda', 'BarunCorp', 100.01,200,300,400
FROM service
WHERE  id NOT IN('2a2a256b-57a5-46f5-8cfb-1855cc29238a','0ce5a100-8b38-45fd-92a7-69e9aa7bd549', 'e95483bd-16ea-4a4d-8d68-81d2fa10a384');

INSERT INTO `custom_commercial_pricing_tiers` (`service_id`, `service_name`, `organization_id`, `organization_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 'asda', 'BarunCorp', 200.01,300,400,500
FROM service
WHERE  id NOT IN('2a2a256b-57a5-46f5-8cfb-1855cc29238a','0ce5a100-8b38-45fd-92a7-69e9aa7bd549', 'e95483bd-16ea-4a4d-8d68-81d2fa10a384');

INSERT INTO `custom_commercial_pricing_tiers` (`service_id`, `service_name`, `organization_id`, `organization_name`, `starting_point`, `finishing_point`, `price`, `gm_price`)
SELECT	service.id, service.name, 'asda', 'BarunCorp', 300.01,null,600,700
FROM service
WHERE  id NOT IN('2a2a256b-57a5-46f5-8cfb-1855cc29238a','0ce5a100-8b38-45fd-92a7-69e9aa7bd549', 'e95483bd-16ea-4a4d-8d68-81d2fa10a384');

-- custom pricings
INSERT INTO `custom_pricings` (`id`, `organization_id`, `organization_name`, `service_id`, `service_name`, `has_residential_new_service_tier`, `has_residential_revision_pricing`, `has_commercial_new_service_tier`, `has_fixed_pricing`)
VALUES
	('2b360929-c7ff-4358-b579-a1c2f380708a', 'asda', 'BarunCorp', 'e5d81943-3fef-416d-a85b-addb8be296c0', 'PV Design', 1, 1, 1, 0),
	('69666e23-c56c-4246-8849-61e3ebc36459', 'asda', 'BarunCorp', '0ce5a100-8b38-45fd-92a7-69e9aa7bd549', 'Structural Wet Stamp', 0, 0, 0, 1),
	('bb360929-c7ff-4358-b579-a1c2f380708a', 'asda', 'BarunCorp', '435c5ab0-7605-40cd-811f-9343872f641a', 'FL Statute Letter', 1, 1, 1, 0),
	('bfe74f56-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', 'a061c441-be8c-4bcc-9bcc-2460a01d5a16', 'Electrical Load Calculation', 1, 1, 1, 0),
	('bfe7527a-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', 'd7e19772-e937-40fd-b94f-77f056169d34', 'Electrical Load Justification Letter', 1, 1, 1, 0),
	('bfe752ec-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9', 'Electrical PE Stamp', 1, 1, 1, 0),
	('bfe75333-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '8d44cfe8-6c39-454f-8544-ede966943e6a', 'Electrical Post Installed Letter', 1, 1, 1, 0),
	('bfe7537d-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', 'e95483bd-16ea-4a4d-8d68-81d2fa10a384', 'Electrical Wet Stamp', 1, 1, 1, 0),
	('bfe753bd-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '4728f174-933a-4974-8e9a-6917720bffce', 'ESS Electrical PE Stamp', 1, 1, 1, 0),
	('bfe753f3-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', 'ab9cc5cf-62e4-4f27-8ffd-97488068f9fa', 'ESS Structural PE Stamp', 1, 1, 1, 0),
	('bfe75428-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '435c5ab0-7605-40cd-811f-9343872f641a', 'FL Statute Letter', 1, 1, 1, 0),
	('bfe754b0-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', 'e5d81943-3fef-416d-a85b-addb8be296c0', 'PV Design', 1, 1, 1, 0),
	('bfe754e3-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '8a593d31-81ed-41b7-bec5-8d55f348cc05', 'Shading Report', 1, 1, 1, 0),
	('bfe75516-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '0ce4b659-601e-43c0-8420-a8ee6b95a385', 'Special Inspection Form', 1, 1, 1, 0),
	('bfe7554b-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '9e773832-ad39-401d-b1c2-16d74f9268ea', 'Structural Calculation (Letter)', 1, 1, 1, 0),
	('bfe7559b-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '0904b078-6c8a-4044-9323-4757d6ca8afa', 'Structural Feasibility', 1, 1, 1, 0),
	('bfe755dc-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '99ff64ee-fe47-4235-a026-db197628d077', 'Structural PE Stamp', 1, 1, 1, 0),
	('bfe75611-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '81b11cd8-bbcb-47c7-a45f-af339a422555', 'Structural Post Installed Letter ', 1, 1, 1, 0),
	('bfe75643-91c9-11ee-8b18-0242ac120002', 'asda', 'BarunCorp', '0ce5a100-8b38-45fd-92a7-69e9aa7bd549', 'Structural Wet Stamp', 0, 0, 0, 1);


/**

RM 

*/

-- Project
INSERT INTO `ordered_projects` (`id`, `has_history_structural_pe_stamp`, `has_history_electrical_pe_stamp`, `property_address_coordinates`, `mounting_type`, `mailing_address_for_wet_stamps`, `system_size`, `date_created`, `project_folder`, `project_number`, `property_full_address`, `property_address_street1`, `property_address_street2`, `property_address_city`, `property_address_state`, `property_address_postal_code`, `property_owner_name`, `master_log_upload`, `ahj_automation_complete`, `updated_at`, `export_id`, `google_geocoder`, `re_trigger_activate_create_project_folder_trigger`, `last_modified_by`, `new_battery_storage_design`, `number_of_wet_stamps`, `number_of_structural_wet_stamps`, `number_of_electrical_wet_stamps`, `google_drive_client_account_active_folder_id`, `sandbox_checkbox`, `ahj_automation_last_run_date`, `sandbox_formula`, `container_id_1`, `new_share_drive_structure`, `state_id`, `county_id`, `county_subdivisions_id`, `place_id`, `ahj_id`, `project_property_type`, `is_ground_mount`, `mailing_address_for_structural_wet_stamp`, `mailing_address_for_electrical_wet_stamp`, `client_organization_id`, `design_or_pe_stamp_previously_done_on_project_outside`, `total_of_jobs`, `property_address_country`)
VALUES
	('d6935a65-2ec5-4df0-a8b5-a4e39f124d05', 0, 0, '-97.87,34', 'Roof Mount', '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309', 00000050.10, '2023-12-03 11:33:47', NULL, '000151', 'RM Residential', '3480 Northwest 33rd Court', 'A101', 'Lauderdale Lakes', 'Florida', '33309', 'Chris Kim', NULL, NULL, '2023-12-03 11:33:47', NULL, NULL, NULL, '96d39061-a4d7-4de9-a147-f627467e11d5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '40', '40067', '40067', NULL, '40067', 'Residential', NULL, NULL, NULL, 'asda', 00000000000, 2, 'United State'),
	('e106236a-9d46-4eca-9a32-8359184b8265', 0, 0, '-97.87,34', NULL, NULL, NULL, '2023-12-03 11:31:16', NULL, '000153', 'RM Commercial 50', '3480 Northwest 33rd Court', 'A101', 'Lauderdale Lakes', 'Florida', '33309', 'Chris Kim', NULL, NULL, '2023-12-03 11:31:16', NULL, NULL, NULL, '96d39061-a4d7-4de9-a147-f627467e11d5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '40', '40067', '4006793042', NULL, '4006793042', 'Commercial', NULL, NULL, NULL, 'asda', 00000000000, 0, 'United State'),
	('fbb8d2ba-2579-437b-9173-4543a1b4b4dd', 0, 0, '-97.87,34', 'Ground Mount', '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309', 00000050.10, '2023-12-03 11:32:13', NULL, '000152', 'GM Residential', '3480 Northwest 33rd Court', 'A101', 'Lauderdale Lakes', 'Florida', '33309', 'Chris Kim', NULL, NULL, '2023-12-03 11:32:13', NULL, NULL, NULL, '96d39061-a4d7-4de9-a147-f627467e11d5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '40', '40067', '40067', NULL, '40067', 'Residential', NULL, NULL, NULL, 'asda', 00000000000, 2, 'United State'),
	('69b4f2e1-c40f-44ab-92de-5282322758d6', 0, 0, '-97.87,34', NULL, NULL, NULL, '2023-12-03 11:31:39', NULL, '000154', 'GM Commercial 50', '3480 Northwest 33rd Court', 'A101', 'Lauderdale Lakes', 'Florida', '33309', 'Chris Kim', NULL, NULL, '2023-12-03 11:31:39', NULL, NULL, NULL, '96d39061-a4d7-4de9-a147-f627467e11d5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '40', '40067', '4006793042', NULL, '4006793042', 'Commercial', NULL, NULL, NULL, 'asda', 00000000000, 0, 'United State');
