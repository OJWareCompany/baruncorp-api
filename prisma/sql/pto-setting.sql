-- Organizations 테이블에 데이터 추가
INSERT INTO organizations (
  id,
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
  number_of_free_revision_count,
  updated_at
) VALUES (
  '5d2d7904-136d-4e2e-966a-679fe4f499d0',
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
  0, -- numberOfFreeRevisionCount,
  NOW()
);

-- Users 테이블에 데이터 추가
INSERT INTO users (
  id,
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
  is_vendor,
  updated_at
) VALUES (
  '5d2d7904-136d-4e2e-9562-679fe4f499d0', -- id
  '2024-01-01', -- dateOfJoining
  'Employee', -- type
  NULL, -- deliverables_emails
  'user@example.com', -- email
  'John', -- firstName
  'Doe', -- lastName
  'John Doe', -- full_name
  'active', -- status
  '5d2d7904-136d-4e2e-966a-679fe4f499d0', -- organizationId,
  FALSE, -- isHandRaisedForTask
  '123 Example Street', -- address
  '123-456-7890', -- phoneNumber
  TRUE, -- isActiveWorkResource
  FALSE, -- isCurrentUser
  FALSE, -- isInactiveOrganizationUser
  FALSE, -- revenueShare
  FALSE, -- revisionRevenueShare
  'admin', -- updatedBy
  FALSE, -- isVendor.
  NOW()
);

INSERT INTO users (
  id,
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
  is_vendor,
  updated_at
) VALUES (
  '5d2d7904-136d-4e22-956a-679fe4f499d0', -- id
  '2024-01-01', -- dateOfJoining
  'Employee', -- type
  NULL, -- deliverables_emails
  'user2@example.com', -- email
  'Lebron', -- firstName
  'James', -- lastName
  'Lebron James', -- full_name
  'active', -- status
  '5d2d7904-136d-4e2e-966a-679fe4f499d0', -- organizationId,
  FALSE, -- isHandRaisedForTask
  '123 Example Street', -- address
  '123-456-7890', -- phoneNumber
  TRUE, -- isActiveWorkResource
  FALSE, -- isCurrentUser
  FALSE, -- isInactiveOrganizationUser
  FALSE, -- revenueShare
  FALSE, -- revisionRevenueShare
  'admin', -- updatedBy
  FALSE, -- isVendor.
  NOW()
);

-- pto_tenire_policies 데이터 추가
INSERT INTO pto_tenure_policies (id, tenure, total, created_at, updated_at) VALUES
(UUID(), 1, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 2, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 3, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 4, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 5, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 6, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 7, 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 8, 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 9, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 10, 19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 11, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 12, 21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 13, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 14, 23, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 15, 24, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 16, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 17, 26, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 18, 27, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 19, 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(UUID(), 20, 29, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- pto_types 테이블에 데이터 추가
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d0', 'Vacation', 'V', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d1', 'Half', 'H', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d2', 'Sick', 'S', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d3', 'Maternity', 'M', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d4', 'Casual', 'C', '2024-01-13T05:41:26.824');
INSERT INTO pto_types (id, name, abbreviation, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d5', 'Unpaid', 'U', '2024-01-13T05:41:26.824');
-- pto_available_values 테이블에 데이터 추가
INSERT INTO pto_available_values (id, value, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d6', 1, '2024-01-13T05:41:26.824');
INSERT INTO pto_available_values (id, value, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d7', 0.5, '2024-01-13T05:41:26.824');
INSERT INTO pto_available_values (id, value, updated_at) VALUES ('ad2d7904-136d-4e2e-966a-679fe4f499d8', 0, '2024-01-13T05:41:26.824');
-- pto_types_available_values 테이블에 데이터 추가
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
-- PTO
INSERT INTO ptos (id, user_id, tenure, total, is_paid, created_at, updated_at, started_at, ended_at) VALUES
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 1 , 10, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 2 , 11, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 3 , 12, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 4 , 13, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 5 , 14, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 6 , 15, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 7 , 16, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 8 , 17, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 9 , 18, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e2e-9562-679fe4f499d0', 10, 19, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31');
INSERT INTO ptos (id, user_id, tenure, total, is_paid, created_at, updated_at, started_at, ended_at) VALUES
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 1,  10, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 2,  11, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 3,  12, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 4,  13, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 5,  14, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 6,  15, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 7,  16, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 8,  17, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 9,  18, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31'),
(UUID(), '5d2d7904-136d-4e22-956a-679fe4f499d0', 10, 19, TRUE, NOW(), NOW(), '2024-01-01', '2024-12-31');

-- PTO Detail




create table pto_available_values
(
    id         varchar(255)                         not null
        primary key,
    value      float                                not null,
    created_at datetime default current_timestamp() not null,
    updated_at datetime                             not null
)
    collate = utf8mb4_unicode_ci;

create table pto_tenure_policies
(
    id         varchar(255)                         not null
        primary key,
    tenure     tinyint                              not null,
    total      float                                not null,
    created_at datetime default current_timestamp() not null,
    updated_at datetime                             not null,
    constraint pto_tenure_policies_tenure_key
        unique (tenure)
)
    collate = utf8mb4_unicode_ci;

create table pto_types
(
    id           varchar(255)                         not null
        primary key,
    name         varchar(30)                          not null,
    abbreviation varchar(5)                           not null,
    created_at   datetime default current_timestamp() not null,
    updated_at   datetime                             not null,
    constraint pto_types_name_key
        unique (name)
)
    collate = utf8mb4_unicode_ci;

create table pto_types_available_values
(
    pto_type_id            varchar(255) not null,
    pto_available_value_id varchar(255) not null,
    primary key (pto_type_id, pto_available_value_id)
)
    collate = utf8mb4_unicode_ci;

create index pto_types_available_values_pto_available_value_id_idx
    on pto_types_available_values (pto_available_value_id);

create index pto_types_available_values_pto_type_id_idx
    on pto_types_available_values (pto_type_id);

create table ptos
(
    id         varchar(255)                         not null primary key,
    user_id    varchar(255)                         not null,
    tenure     int                                  not null,
    total      float                                not null,
    is_paid    tinyint(1)                           not null,
    created_at datetime default current_timestamp() not null,
    updated_at datetime                             not null,
    ended_at   datetime                             not null,
    started_at datetime                             not null,
    constraint ptos_user_id_tenure_key
        unique (user_id, tenure),
    constraint ptos_users_id_fk
        foreign key (user_id) references users (id) on delete cascade
)
    collate = utf8mb4_unicode_ci;

create table pto_details
(
    id          varchar(255)                         not null
        primary key,
    pto_id      varchar(255)                         not null,
    pto_type_id varchar(255)                         not null,
    amount      float                                not null,
    started_at  datetime                             not null,
    created_at  datetime default current_timestamp() not null,
    updated_at  datetime                             not null,
    days        int                                  not null,
    user_id     varchar(255)                         not null,
    constraint pto_details_pto_id_fk
        foreign key (pto_id) references ptos (id)
            on delete cascade,
    constraint pto_details_pto_types_id_fk
        foreign key (pto_type_id) references pto_types (id)
            on delete cascade,
    constraint pto_details_user_id_fk
        foreign key (user_id) references users (id)
            on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index pto_details_pto_id_idx
    on pto_details (pto_id);

create index pto_details_pto_type_id_idx
    on pto_details (pto_type_id);

create index pto_details_user_id_idx
    on pto_details (user_id);

