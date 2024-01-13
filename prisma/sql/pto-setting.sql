-- Organizations 테이블에 데이터 추가
INSERT INTO organizations (
  name, 
  description, 
  organization_type, 
  is_vendor, 
  is_delinquent, 
  city, 
  country, 
  street1, 
  street2, 
  phone_number, 
  postal_code, 
  state_or_region, 
  is_active_contractor, 
  is_active_work_resource, 
  revenue_share, 
  revision_revenue_share, 
  invoice_recipient, 
  invoice_recipient_email, 
  project_property_type_default_value, 
  mounting_type_default_value, 
  address_coordinates, 
  full_address, 
  is_special_revision_pricing, 
  number_of_free_revision_count
) VALUES (
  'Example Organization', -- name
  'A description of the organization', -- description
  'Type1', -- organizationType, 조직 유형에 맞는 값으로 설정
  FALSE, -- isVendor
  FALSE, -- isDelinquent
  'Example City', -- city
  'Example Country', -- country
  '123 Example Street', -- street1
  NULL, -- street2
  '123-456-7890', -- phoneNumber
  '12345', -- postalCode
  'Example State', -- stateOrRegion
  1, -- isActiveContractor
  1, -- isActiveWorkResource
  0, -- revenueShare
  0, -- revisionRevenueShare
  'John Doe', -- invoiceRecipient
  'john.doe@example.com', -- invoiceRecipientEmail
  'Default Value', -- projectPropertyTypeDefaultValue
  'Mounting Type', -- mountingTypeDefaultValue
  'Coordinate Value', -- addressCoordinates
  '123 Example Street, Example City, Example Country', -- fullAddress
  FALSE, -- isSpecialRevisionPricing
  0 -- numberOfFreeRevisionCount
);

-- Organizations 테이블에 대한 샘플 데이터 (가정)
INSERT INTO Organizations (id, ...) VALUES (uuid_generate_v4(), ...);

-- Users 테이블에 데이터 추가
INSERT INTO users (
  date_of_joining, 
  type, 
  deliverables_emails, 
  email, 
  first_name, 
  last_name, 
  full_name, 
  status, 
  organization_id, 
  is_hand_raised_for_task, 
  address, 
  phone_number, 
  is_active_work_resource, 
  is_current_user, 
  is_inactive_organization_user, 
  revenue_share, 
  revision_revenue_share, 
  updated_by, 
  is_vendor
) VALUES (
  '2024-01-01', -- dateOfJoining
  'Employee', -- type
  NULL, -- deliverables_emails
  'user@example.com', -- email
  'John', -- firstName
  'Doe', -- lastName
  'John Doe', -- full_name
  'active', -- status
  (SELECT id FROM Organizations WHERE ...), -- organizationId, 조건에 맞는 조직 ID
  FALSE, -- isHandRaisedForTask
  '123 Example Street', -- address
  '123-456-7890', -- phoneNumber
  TRUE, -- isActiveWorkResource
  FALSE, -- isCurrentUser
  FALSE, -- isInactiveOrganizationUser
  FALSE, -- revenueShare
  FALSE, -- revisionRevenueShare
  'admin', -- updatedBy
  FALSE -- isVendor
);


-- PtoTypes 테이블에 데이터 추가
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d0', 'Vacation', 'V', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d1', 'Half', 'H', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d2', 'Sick', 'S', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d3', 'Maternity', 'M', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d4', 'Casual', 'C', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d5', 'Unpaid', 'U', '2024-01-13T05:41:26.824');
-- PtoAvailableValues 테이블에 데이터 추가
INSERT INTO pto_available_values (id, value, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d6', 1, '2024-01-13T05:41:26.824');
INSERT INTO pto_available_values (id, value, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d7', 0.5, '2024-01-13T05:41:26.824');
INSERT INTO pto_available_values (id, value, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d8', 0, '2024-01-13T05:41:26.824');
-- PtoTypesAvailableValues 테이블에 데이터 추가
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d0', 'ad2d7904-136d-4e2e-966a-679fe4f499d6');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d1', 'ad2d7904-136d-4e2e-966a-679fe4f499d7');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d2', 'ad2d7904-136d-4e2e-966a-679fe4f499d6');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d2', 'ad2d7904-136d-4e2e-966a-679fe4f499d7');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d2', 'ad2d7904-136d-4e2e-966a-679fe4f499d8');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d3', 'ad2d7904-136d-4e2e-966a-679fe4f499d6');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d3', 'ad2d7904-136d-4e2e-966a-679fe4f499d7');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d3', 'ad2d7904-136d-4e2e-966a-679fe4f499d8');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d4', 'ad2d7904-136d-4e2e-966a-679fe4f499d6');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d4', 'ad2d7904-136d-4e2e-966a-679fe4f499d7');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d4', 'ad2d7904-136d-4e2e-966a-679fe4f499d8');
INSERT INTO pto_types_available_values (pto_type_id, pto_available_value_id) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d5', 'ad2d7904-136d-4e2e-966a-679fe4f499d8');

