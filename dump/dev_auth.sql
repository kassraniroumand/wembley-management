{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww26760\viewh15480\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 create database dev_auth\
go\
\
use dev_auth\
go\
\
grant connect on database :: dev_auth to dbo\
go\
\
create table dbo.AspNetRoles\
(\
    Id               nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint PK_AspNetRoles\
            primary key,\
    Name             nvarchar(256) collate SQL_Latin1_General_CP1_CI_AS,\
    NormalizedName   nvarchar(256) collate SQL_Latin1_General_CP1_CI_AS,\
    ConcurrencyStamp nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create table dbo.AspNetRoleClaims\
(\
    Id         int identity\
        constraint PK_AspNetRoleClaims\
            primary key,\
    RoleId     nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint FK_AspNetRoleClaims_AspNetRoles_RoleId\
            references dbo.AspNetRoles\
            on delete cascade,\
    ClaimType  nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    ClaimValue nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create index IX_AspNetRoleClaims_RoleId\
    on dbo.AspNetRoleClaims (RoleId)\
go\
\
create unique index RoleNameIndex\
    on dbo.AspNetRoles (NormalizedName)\
    where [NormalizedName] IS NOT NULL\
go\
\
create table dbo.AspNetUsers\
(\
    Id                   nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint PK_AspNetUsers\
            primary key,\
    FirstName            nvarchar(50)  not null collate SQL_Latin1_General_CP1_CI_AS,\
    LastName             nvarchar(50)  not null collate SQL_Latin1_General_CP1_CI_AS,\
    UserName             nvarchar(256) collate SQL_Latin1_General_CP1_CI_AS,\
    NormalizedUserName   nvarchar(256) collate SQL_Latin1_General_CP1_CI_AS,\
    Email                nvarchar(256) collate SQL_Latin1_General_CP1_CI_AS,\
    NormalizedEmail      nvarchar(256) collate SQL_Latin1_General_CP1_CI_AS,\
    EmailConfirmed       bit           not null,\
    PasswordHash         nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    SecurityStamp        nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    ConcurrencyStamp     nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    PhoneNumber          nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    PhoneNumberConfirmed bit           not null,\
    TwoFactorEnabled     bit           not null,\
    LockoutEnd           datetimeoffset,\
    LockoutEnabled       bit           not null,\
    AccessFailedCount    int           not null\
)\
go\
\
create table dbo.AspNetUserClaims\
(\
    Id         int identity\
        constraint PK_AspNetUserClaims\
            primary key,\
    UserId     nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint FK_AspNetUserClaims_AspNetUsers_UserId\
            references dbo.AspNetUsers\
            on delete cascade,\
    ClaimType  nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    ClaimValue nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create index IX_AspNetUserClaims_UserId\
    on dbo.AspNetUserClaims (UserId)\
go\
\
create table dbo.AspNetUserLogins\
(\
    LoginProvider       nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS,\
    ProviderKey         nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS,\
    ProviderDisplayName nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    UserId              nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint FK_AspNetUserLogins_AspNetUsers_UserId\
            references dbo.AspNetUsers\
            on delete cascade,\
    constraint PK_AspNetUserLogins\
        primary key (LoginProvider, ProviderKey)\
)\
go\
\
create index IX_AspNetUserLogins_UserId\
    on dbo.AspNetUserLogins (UserId)\
go\
\
create table dbo.AspNetUserRoles\
(\
    UserId nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint FK_AspNetUserRoles_AspNetUsers_UserId\
            references dbo.AspNetUsers\
            on delete cascade,\
    RoleId nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint FK_AspNetUserRoles_AspNetRoles_RoleId\
            references dbo.AspNetRoles\
            on delete cascade,\
    constraint PK_AspNetUserRoles\
        primary key (UserId, RoleId)\
)\
go\
\
create index IX_AspNetUserRoles_RoleId\
    on dbo.AspNetUserRoles (RoleId)\
go\
\
create table dbo.AspNetUserTokens\
(\
    UserId        nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint FK_AspNetUserTokens_AspNetUsers_UserId\
            references dbo.AspNetUsers\
            on delete cascade,\
    LoginProvider nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS,\
    Name          nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS,\
    Value         nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    constraint PK_AspNetUserTokens\
        primary key (UserId, LoginProvider, Name)\
)\
go\
\
create index EmailIndex\
    on dbo.AspNetUsers (NormalizedEmail)\
go\
\
create unique index UserNameIndex\
    on dbo.AspNetUsers (NormalizedUserName)\
    where [NormalizedUserName] IS NOT NULL\
go\
\
create table dbo.RefreshToken\
(\
    ApplicationUserId nvarchar(450) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint FK_RefreshToken_AspNetUsers_ApplicationUserId\
            references dbo.AspNetUsers\
            on delete cascade,\
    Id                int identity,\
    Token             nvarchar(max) not null collate SQL_Latin1_General_CP1_CI_AS,\
    ExpiresOn         datetime2     not null,\
    CreatedOn         datetime2     not null,\
    RevokedOn         datetime2,\
    constraint PK_RefreshToken\
        primary key (ApplicationUserId, Id)\
)\
go\
\
create table dbo.__EFMigrationsHistory\
(\
    MigrationId    nvarchar(150) not null collate SQL_Latin1_General_CP1_CI_AS\
        constraint PK___EFMigrationsHistory\
            primary key,\
    ProductVersion nvarchar(32)  not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create table sys.backup_metadata_store\
(\
    backup_metadata_uuid      uniqueidentifier not null,\
    database_guid             uniqueidentifier not null,\
    physical_database_name    nvarchar(128)    not null collate SQL_Latin1_General_CP1_CI_AS,\
    time_zone                 smallint         not null,\
    first_lsn                 numeric(25)      not null,\
    last_lsn                  numeric(25)      not null,\
    checkpoint_lsn            numeric(25)      not null,\
    database_backup_lsn       numeric(25)      not null,\
    backup_start_date         datetime2        not null,\
    backup_finish_date        datetime2        not null,\
    backup_type               char             not null collate SQL_Latin1_General_CP1_CI_AS,\
    backup_storage_redundancy nvarchar(64) collate SQL_Latin1_General_CP1_CI_AS,\
    database_version          int              not null,\
    backup_size               numeric(20)      not null,\
    compressed_backup_size    numeric(20)      not null,\
    server_name               nvarchar(128)    not null collate SQL_Latin1_General_CP1_CI_AS,\
    is_damaged                bit,\
    last_recovery_fork_guid   uniqueidentifier,\
    differential_base_lsn     numeric(25),\
    differential_base_guid    uniqueidentifier,\
    backup_path               nvarchar(260)    not null collate SQL_Latin1_General_CP1_CI_AS,\
    last_valid_restore_time   datetime2,\
    compression_algorithm     nvarchar(32) collate SQL_Latin1_General_CP1_CI_AS,\
    logical_server_name       nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    logical_database_name     nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    allocated_db_size_bytes   numeric(20),\
    allocated_data_size_bytes numeric(20)\
)\
go\
\
create unique clustered index IX_backup_metadata_start_date_metadata_uuid\
    on sys.backup_metadata_store (backup_start_date, backup_metadata_uuid)\
go\
\
create index IX_backup_metadata_type_finish_date\
    on sys.backup_metadata_store (backup_type, backup_finish_date)\
go\
\
create index IX_backup_metadata_first_lsn\
    on sys.backup_metadata_store (first_lsn)\
go\
\
create index IX_backup_metadata_last_lsn\
    on sys.backup_metadata_store (last_lsn)\
go\
\
create index IX_backup_metadata_database_guid\
    on sys.backup_metadata_store (database_guid)\
go\
\
create table sys.database_firewall_rules_table\
(\
    id                     int identity,\
    name                   sysname     not null collate SQL_Latin1_General_CP1_CI_AS,\
    start_ip_address       varchar(45) not null collate SQL_Latin1_General_CP1_CI_AS,\
    end_ip_address         varchar(45) not null collate SQL_Latin1_General_CP1_CI_AS,\
    start_ip_address_value bigint      not null,\
    end_ip_address_value   bigint      not null,\
    create_date            datetime    not null,\
    modify_date            datetime    not null\
)\
go\
\
create clustered index idx_database_firewall_rules_unique\
    on sys.database_firewall_rules_table (name)\
go\
\
create index idx_database_firewall_rules_ip_address_values\
    on sys.database_firewall_rules_table (start_ip_address_value, end_ip_address_value)\
go\
\
create table sys.db_ledger_blocks\
(\
    block_id               bigint   not null,\
    version                smallint not null,\
    transactions_root_hash varbinary(32),\
    block_size             int      not null,\
    previous_block_hash    varbinary(32)\
)\
go\
\
create unique clustered index ci_block_id\
    on sys.db_ledger_blocks (block_id)\
go\
\
create table sys.db_ledger_digest_locations\
(\
    storage_type         int     not null,\
    path                 nvarchar(4000) collate SQL_Latin1_General_CP1_CI_AS,\
    last_digest_block_id bigint,\
    is_current           tinyint not null\
)\
go\
\
create unique clustered index ci_type_and_path\
    on sys.db_ledger_digest_locations (storage_type, path)\
go\
\
create table sys.db_ledger_transactions\
(\
    transaction_id          bigint    not null,\
    block_id                bigint    not null,\
    transaction_ordinal     int       not null,\
    version                 tinyint   not null,\
    type                    tinyint   not null,\
    commit_ts               datetime2 not null,\
    table_hashes            varbinary(max),\
    commit_LSN              varbinary(10),\
    transaction_description nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    principal_name          sysname   not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index ci_block_id\
    on sys.db_ledger_transactions (block_id, transaction_ordinal)\
go\
\
create unique index nci_transaction_id\
    on sys.db_ledger_transactions (transaction_id)\
go\
\
create table sys.filestream_tombstone_2073058421\
(\
    oplsn_fseqno             int              not null,\
    oplsn_bOffset            int              not null,\
    oplsn_slotid             int              not null,\
    file_id                  int              not null,\
    rowset_guid              uniqueidentifier not null,\
    column_guid              uniqueidentifier,\
    filestream_value_name    nvarchar(260) collate Latin1_General_BIN,\
    transaction_sequence_num bigint           not null,\
    status                   bigint           not null,\
    size                     bigint\
)\
go\
\
create unique clustered index FSTSClusIdx\
    on sys.filestream_tombstone_2073058421 (oplsn_fseqno, oplsn_bOffset, oplsn_slotid)\
go\
\
create index FSTSNCIdx\
    on sys.filestream_tombstone_2073058421 (file_id, rowset_guid, column_guid, oplsn_fseqno, oplsn_bOffset,\
                                            oplsn_slotid)\
go\
\
create table sys.filetable_updates_2105058535\
(\
    table_id      bigint           not null,\
    oplsn_fseqno  int              not null,\
    oplsn_bOffset int              not null,\
    oplsn_slotid  int              not null,\
    item_guid     uniqueidentifier not null\
)\
go\
\
create unique clustered index FFtUpdateIdx\
    on sys.filetable_updates_2105058535 (table_id, oplsn_fseqno, oplsn_bOffset, oplsn_slotid, item_guid)\
go\
\
create table sys.fulltext_thesaurus_metadata_table\
(\
    lcid                 int not null,\
    diacritics_sensitive bit\
)\
go\
\
create unique clustered index idx_lcid\
    on sys.fulltext_thesaurus_metadata_table (lcid)\
go\
\
create table sys.fulltext_thesaurus_phrase_table\
(\
    phraseid           int identity,\
    lcid               int not null,\
    groupid            int not null,\
    isExpansion        int not null,\
    isLHSOfReplacement int not null,\
    terms              varbinary(2048),\
    indexVersion       int\
)\
go\
\
create clustered index idx_groupid\
    on sys.fulltext_thesaurus_phrase_table (lcid, groupid, indexVersion)\
go\
\
create unique index idx_phraseid\
    on sys.fulltext_thesaurus_phrase_table (phraseid)\
go\
\
create table sys.fulltext_thesaurus_state_table\
(\
    lcid         int            not null,\
    parentid     int            not null,\
    term         varbinary(128) not null,\
    stateid      int            not null,\
    phraseid     int,\
    indexVersion int\
)\
go\
\
create unique clustered index idx_term\
    on sys.fulltext_thesaurus_state_table (lcid, parentid, term, indexVersion)\
go\
\
create table sys.ipv6_database_firewall_rules_table\
(\
    id                           int identity,\
    name                         sysname     not null collate SQL_Latin1_General_CP1_CI_AS,\
    start_ipv6_address           varchar(45) not null collate SQL_Latin1_General_CP1_CI_AS,\
    end_ipv6_address             varchar(45) not null collate SQL_Latin1_General_CP1_CI_AS,\
    start_ipv6_address_msb_value numeric(20) not null,\
    start_ipv6_address_lsb_value numeric(20) not null,\
    end_ipv6_address_msb_value   numeric(20) not null,\
    end_ipv6_address_lsb_value   numeric(20) not null,\
    create_date                  datetime    not null,\
    modify_date                  datetime    not null\
)\
go\
\
create clustered index idx_database_firewall_rules_unique\
    on sys.ipv6_database_firewall_rules_table (name)\
go\
\
create index idx_database_firewall_rules_ip_address_values\
    on sys.ipv6_database_firewall_rules_table (start_ipv6_address_msb_value, start_ipv6_address_lsb_value,\
                                               end_ipv6_address_msb_value, end_ipv6_address_lsb_value)\
go\
\
create table sys.ledger_columns_history_internal\
(\
    object_id                    int     not null,\
    column_id                    int     not null,\
    column_name                  sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    operation_type               int     not null,\
    ledger_start_transaction_id  bigint  not null,\
    ledger_end_transaction_id    bigint,\
    ledger_start_sequence_number bigint  not null,\
    ledger_end_sequence_number   bigint\
)\
go\
\
create unique clustered index ci_ledger_columns_history_internal\
    on sys.ledger_columns_history_internal (object_id, column_id)\
go\
\
create table sys.ledger_columns_history_internal_history\
(\
    object_id                    int     not null,\
    column_id                    int     not null,\
    column_name                  sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    operation_type               int     not null,\
    ledger_start_transaction_id  bigint  not null,\
    ledger_end_transaction_id    bigint,\
    ledger_start_sequence_number bigint  not null,\
    ledger_end_sequence_number   bigint\
)\
go\
\
create clustered index ci_ledger_columns_history_internal_history\
    on sys.ledger_columns_history_internal_history (object_id, column_id)\
go\
\
create table sys.ledger_tables_history_internal\
(\
    schema_name                     sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    table_name                      sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    object_id                       int     not null,\
    ledger_view_schema_name         sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    ledger_view_name                sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    operation_type                  int     not null,\
    ledger_start_transaction_id     bigint  not null,\
    ledger_end_transaction_id       bigint,\
    ledger_start_sequence_number    bigint  not null,\
    ledger_end_sequence_number      bigint,\
    status                          int,\
    transaction_id_column_name      sysname collate SQL_Latin1_General_CP1_CI_AS,\
    sequence_number_column_name     sysname collate SQL_Latin1_General_CP1_CI_AS,\
    operation_type_column_name      sysname collate SQL_Latin1_General_CP1_CI_AS,\
    operation_type_desc_column_name sysname collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index ci_ledger_tables_history_internal\
    on sys.ledger_tables_history_internal (object_id)\
go\
\
create table sys.ledger_tables_history_internal_history\
(\
    schema_name                     sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    table_name                      sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    object_id                       int     not null,\
    ledger_view_schema_name         sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    ledger_view_name                sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    operation_type                  int     not null,\
    ledger_start_transaction_id     bigint  not null,\
    ledger_end_transaction_id       bigint,\
    ledger_start_sequence_number    bigint  not null,\
    ledger_end_sequence_number      bigint,\
    status                          int,\
    transaction_id_column_name      sysname collate SQL_Latin1_General_CP1_CI_AS,\
    sequence_number_column_name     sysname collate SQL_Latin1_General_CP1_CI_AS,\
    operation_type_column_name      sysname collate SQL_Latin1_General_CP1_CI_AS,\
    operation_type_desc_column_name sysname collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create clustered index ci_ledger_tables_history_internal_history\
    on sys.ledger_tables_history_internal_history (object_id)\
go\
\
create table sys.pause_resume_history\
(\
    time_snapshot int not null,\
    event_type    int not null\
)\
go\
\
create unique clustered index IX_pause_resume_history\
    on sys.pause_resume_history (time_snapshot)\
go\
\
create table sys.persistent_version_store\
(\
    xdes_ts_push      bigint          not null,\
    xdes_ts_tran      bigint          not null,\
    subid_push        int,\
    subid_tran        int,\
    rowset_id         bigint          not null,\
    sec_version_rid   binary(8)       not null,\
    min_len           smallint,\
    seq_num           bigint,\
    prev_row_in_chain binary(8)       not null,\
    row_version       varbinary(8000) not null\
)\
go\
\
create table sys.persistent_version_store_long_term\
(\
    xdes_ts_push      bigint          not null,\
    xdes_ts_tran      bigint          not null,\
    subid_push        int,\
    subid_tran        int,\
    rowset_id         bigint          not null,\
    sec_version_rid   binary(8)       not null,\
    min_len           smallint,\
    seq_num           bigint,\
    prev_row_in_chain binary(8)       not null,\
    row_version       varbinary(8000) not null\
)\
go\
\
create table sys.plan_persist_context_settings\
(\
    context_settings_id       bigint   not null,\
    set_options               int      not null,\
    language_id               smallint not null,\
    date_format               smallint not null,\
    date_first                tinyint  not null,\
    compatibility_level       smallint not null,\
    status                    smallint not null,\
    required_cursor_options   int      not null,\
    acceptable_cursor_options int      not null,\
    merge_action_type         smallint not null,\
    default_schema_id         int      not null,\
    is_replication_specific   bit      not null,\
    status2                   tinyint  not null\
)\
go\
\
create unique clustered index plan_persist_context_settings_cidx\
    on sys.plan_persist_context_settings (context_settings_id desc)\
go\
\
create table sys.plan_persist_plan\
(\
    plan_id                    bigint         not null,\
    query_id                   bigint         not null,\
    plan_group_id              bigint,\
    engine_version             bigint         not null,\
    query_plan_hash            binary(8)      not null,\
    query_plan                 varbinary(max),\
    is_online_index_plan       bit            not null,\
    is_trivial_plan            bit            not null,\
    is_parallel_plan           bit            not null,\
    is_forced_plan             bit            not null,\
    force_failure_count        bigint         not null,\
    last_force_failure_reason  int            not null,\
    count_compiles             bigint         not null,\
    initial_compile_start_time datetimeoffset not null,\
    last_compile_start_time    datetimeoffset not null,\
    last_execution_time        datetimeoffset,\
    total_compile_duration     bigint         not null,\
    last_compile_duration      bigint         not null,\
    compatibility_level        smallint       not null,\
    plan_flags                 int\
)\
go\
\
create unique clustered index plan_persist_plan_cidx\
    on sys.plan_persist_plan (plan_id)\
go\
\
create index plan_persist_plan_idx1\
    on sys.plan_persist_plan (query_id desc)\
go\
\
create table sys.plan_persist_plan_feedback\
(\
    plan_feedback_id  bigint         not null,\
    plan_id           bigint         not null,\
    feature_id        tinyint        not null,\
    feedback_data     varbinary(max),\
    state             int            not null,\
    create_time       datetimeoffset not null,\
    last_updated_time datetimeoffset,\
    replica_group_id  bigint         not null\
)\
go\
\
create unique clustered index plan_feedback_cidx\
    on sys.plan_persist_plan_feedback (plan_feedback_id)\
go\
\
create index plan_feedback_idx1\
    on sys.plan_persist_plan_feedback (plan_id, feature_id)\
go\
\
create table sys.plan_persist_plan_forcing_locations\
(\
    plan_forcing_location_id bigint   not null,\
    query_id                 bigint   not null,\
    plan_id                  bigint   not null,\
    replica_group_id         bigint   not null,\
    timestamp                datetime not null,\
    plan_forcing_flags       int      not null\
)\
go\
\
create unique clustered index plan_persist_plan_force_cidx\
    on sys.plan_persist_plan_forcing_locations (query_id, plan_id, replica_group_id)\
go\
\
create unique index plan_persist_plan_force_idx1\
    on sys.plan_persist_plan_forcing_locations (plan_forcing_location_id desc)\
go\
\
create table sys.plan_persist_query\
(\
    query_id                        bigint         not null,\
    query_text_id                   bigint         not null,\
    context_settings_id             bigint         not null,\
    object_id                       bigint,\
    batch_sql_handle                varbinary(64),\
    query_hash                      binary(8)      not null,\
    is_internal_query               bit            not null,\
    query_param_type                tinyint        not null,\
    initial_compile_start_time      datetimeoffset not null,\
    last_compile_start_time         datetimeoffset not null,\
    last_execution_time             datetimeoffset,\
    last_compile_batch_sql_handle   varbinary(64),\
    last_compile_batch_offset_start bigint         not null,\
    last_compile_batch_offset_end   bigint         not null,\
    compile_count                   bigint         not null,\
    total_compile_duration          bigint         not null,\
    last_compile_duration           bigint         not null,\
    total_parse_duration            bigint         not null,\
    last_parse_duration             bigint         not null,\
    total_parse_cpu_time            bigint         not null,\
    last_parse_cpu_time             bigint         not null,\
    total_bind_duration             bigint         not null,\
    last_bind_duration              bigint         not null,\
    total_bind_cpu_time             bigint         not null,\
    last_bind_cpu_time              bigint         not null,\
    total_optimize_duration         bigint         not null,\
    last_optimize_duration          bigint         not null,\
    total_optimize_cpu_time         bigint         not null,\
    last_optimize_cpu_time          bigint         not null,\
    total_compile_memory_kb         bigint         not null,\
    last_compile_memory_kb          bigint         not null,\
    max_compile_memory_kb           bigint         not null,\
    status                          tinyint        not null,\
    statement_sql_handle            varbinary(64),\
    query_flags                     int\
)\
go\
\
create unique clustered index plan_persist_query_cidx\
    on sys.plan_persist_query (query_id)\
go\
\
create index plan_persist_query_idx1\
    on sys.plan_persist_query (query_text_id, context_settings_id)\
go\
\
create table sys.plan_persist_query_hints\
(\
    query_hint_id                  bigint        not null,\
    query_id                       bigint        not null,\
    context_settings_id            bigint        not null,\
    object_id                      bigint,\
    statement_sql_handle           varbinary(64) not null,\
    query_param_type               tinyint       not null,\
    batch_sql_handle               varbinary(64),\
    query_hash                     binary(8)     not null,\
    query_hints                    nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    query_hints_flags              int,\
    last_query_hint_failure_reason int           not null,\
    query_hint_failure_count       bigint        not null,\
    comment                        nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    replica_group_id               bigint        not null\
)\
go\
\
create unique clustered index plan_persist_query_hints_cidx\
    on sys.plan_persist_query_hints (query_hint_id)\
go\
\
create index plan_persist_query_hints_idx1\
    on sys.plan_persist_query_hints (query_id)\
go\
\
create table sys.plan_persist_query_template_parameterization\
(\
    query_template_id                    bigint        not null,\
    query_template                       nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    query_template_hash                  varbinary(16) not null,\
    query_param_type                     tinyint       not null,\
    query_template_flags                 int,\
    status                               tinyint       not null,\
    last_parameterization_failure_reason int           not null,\
    parameterization_failure_count       bigint        not null,\
    comment                              nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index plan_persist_query_template_parameterization_cidx\
    on sys.plan_persist_query_template_parameterization (query_template_id)\
go\
\
create unique index plan_persist_query_template_parameterization_idx1\
    on sys.plan_persist_query_template_parameterization (query_template_hash)\
go\
\
create table sys.plan_persist_query_text\
(\
    query_text_id               bigint        not null,\
    query_sql_text              nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    statement_sql_handle        varbinary(64) not null,\
    is_part_of_encrypted_module bit           not null,\
    has_restricted_text         bit           not null,\
    query_template_hash         varbinary(16)\
)\
go\
\
create unique clustered index plan_persist_query_text_cidx\
    on sys.plan_persist_query_text (query_text_id)\
go\
\
create unique index plan_persist_query_text_idx1\
    on sys.plan_persist_query_text (statement_sql_handle)\
go\
\
create table sys.plan_persist_query_variant\
(\
    query_variant_query_id bigint not null,\
    parent_query_id        bigint not null,\
    dispatcher_plan_id     bigint not null\
)\
go\
\
create unique clustered index plan_persist_query_variant_cidx\
    on sys.plan_persist_query_variant (query_variant_query_id)\
go\
\
create index plan_persist_query_variant_idx1\
    on sys.plan_persist_query_variant (parent_query_id, dispatcher_plan_id)\
go\
\
create table sys.plan_persist_replicas\
(\
    replica_group_id bigint   not null,\
    role_type        smallint not null,\
    replica_name     nvarchar(644) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index plan_persist_qds_replicas_cidx\
    on sys.plan_persist_replicas (replica_group_id)\
go\
\
create index plan_persist_qds_replicas_idx1\
    on sys.plan_persist_replicas (role_type)\
go\
\
create table sys.plan_persist_runtime_stats\
(\
    runtime_stats_id                bigint         not null,\
    plan_id                         bigint         not null,\
    runtime_stats_interval_id       bigint         not null,\
    execution_type                  tinyint        not null,\
    first_execution_time            datetimeoffset not null,\
    last_execution_time             datetimeoffset not null,\
    count_executions                bigint         not null,\
    total_duration                  bigint         not null,\
    last_duration                   bigint         not null,\
    min_duration                    bigint         not null,\
    max_duration                    bigint         not null,\
    sumsquare_duration              float          not null,\
    total_cpu_time                  bigint         not null,\
    last_cpu_time                   bigint         not null,\
    min_cpu_time                    bigint         not null,\
    max_cpu_time                    bigint         not null,\
    sumsquare_cpu_time              float          not null,\
    total_logical_io_reads          bigint         not null,\
    last_logical_io_reads           bigint         not null,\
    min_logical_io_reads            bigint         not null,\
    max_logical_io_reads            bigint         not null,\
    sumsquare_logical_io_reads      float          not null,\
    total_logical_io_writes         bigint         not null,\
    last_logical_io_writes          bigint         not null,\
    min_logical_io_writes           bigint         not null,\
    max_logical_io_writes           bigint         not null,\
    sumsquare_logical_io_writes     float          not null,\
    total_physical_io_reads         bigint         not null,\
    last_physical_io_reads          bigint         not null,\
    min_physical_io_reads           bigint         not null,\
    max_physical_io_reads           bigint         not null,\
    sumsquare_physical_io_reads     float          not null,\
    total_clr_time                  bigint         not null,\
    last_clr_time                   bigint         not null,\
    min_clr_time                    bigint         not null,\
    max_clr_time                    bigint         not null,\
    sumsquare_clr_time              float          not null,\
    total_dop                       bigint         not null,\
    last_dop                        bigint         not null,\
    min_dop                         bigint         not null,\
    max_dop                         bigint         not null,\
    sumsquare_dop                   float          not null,\
    total_query_max_used_memory     bigint         not null,\
    last_query_max_used_memory      bigint         not null,\
    min_query_max_used_memory       bigint         not null,\
    max_query_max_used_memory       bigint         not null,\
    sumsquare_query_max_used_memory float          not null,\
    total_rowcount                  bigint         not null,\
    last_rowcount                   bigint         not null,\
    min_rowcount                    bigint         not null,\
    max_rowcount                    bigint         not null,\
    sumsquare_rowcount              float          not null,\
    total_num_physical_io_reads     bigint,\
    last_num_physical_io_reads      bigint,\
    min_num_physical_io_reads       bigint,\
    max_num_physical_io_reads       bigint,\
    sumsquare_num_physical_io_reads float,\
    total_log_bytes_used            bigint,\
    last_log_bytes_used             bigint,\
    min_log_bytes_used              bigint,\
    max_log_bytes_used              bigint,\
    sumsquare_log_bytes_used        float,\
    total_tempdb_space_used         bigint,\
    last_tempdb_space_used          bigint,\
    min_tempdb_space_used           bigint,\
    max_tempdb_space_used           bigint,\
    sumsquare_tempdb_space_used     float,\
    total_page_server_io_reads      bigint,\
    last_page_server_io_reads       bigint,\
    min_page_server_io_reads        bigint,\
    max_page_server_io_reads        bigint,\
    sumsquare_page_server_io_reads  float\
)\
go\
\
create unique clustered index plan_persist_runtime_stats_cidx\
    on sys.plan_persist_runtime_stats (plan_id, runtime_stats_interval_id, execution_type)\
go\
\
create unique index plan_persist_runtime_stats_idx1\
    on sys.plan_persist_runtime_stats (runtime_stats_id)\
go\
\
create table sys.plan_persist_runtime_stats_interval\
(\
    runtime_stats_interval_id bigint         not null,\
    start_time                datetimeoffset not null,\
    end_time                  datetimeoffset not null,\
    comment                   nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index plan_persist_runtime_stats_interval_cidx\
    on sys.plan_persist_runtime_stats_interval (runtime_stats_interval_id)\
go\
\
create index plan_persist_runtime_stats_interval_idx1\
    on sys.plan_persist_runtime_stats_interval (end_time)\
go\
\
create table sys.plan_persist_runtime_stats_v2\
(\
    runtime_stats_id                bigint         not null,\
    plan_id                         bigint         not null,\
    runtime_stats_interval_id       bigint         not null,\
    execution_type                  tinyint        not null,\
    first_execution_time            datetimeoffset not null,\
    last_execution_time             datetimeoffset not null,\
    count_executions                bigint         not null,\
    total_duration                  bigint         not null,\
    last_duration                   bigint         not null,\
    min_duration                    bigint         not null,\
    max_duration                    bigint         not null,\
    sumsquare_duration              float          not null,\
    total_cpu_time                  bigint         not null,\
    last_cpu_time                   bigint         not null,\
    min_cpu_time                    bigint         not null,\
    max_cpu_time                    bigint         not null,\
    sumsquare_cpu_time              float          not null,\
    total_logical_io_reads          bigint         not null,\
    last_logical_io_reads           bigint         not null,\
    min_logical_io_reads            bigint         not null,\
    max_logical_io_reads            bigint         not null,\
    sumsquare_logical_io_reads      float          not null,\
    total_logical_io_writes         bigint         not null,\
    last_logical_io_writes          bigint         not null,\
    min_logical_io_writes           bigint         not null,\
    max_logical_io_writes           bigint         not null,\
    sumsquare_logical_io_writes     float          not null,\
    total_physical_io_reads         bigint         not null,\
    last_physical_io_reads          bigint         not null,\
    min_physical_io_reads           bigint         not null,\
    max_physical_io_reads           bigint         not null,\
    sumsquare_physical_io_reads     float          not null,\
    total_clr_time                  bigint         not null,\
    last_clr_time                   bigint         not null,\
    min_clr_time                    bigint         not null,\
    max_clr_time                    bigint         not null,\
    sumsquare_clr_time              float          not null,\
    total_dop                       bigint         not null,\
    last_dop                        bigint         not null,\
    min_dop                         bigint         not null,\
    max_dop                         bigint         not null,\
    sumsquare_dop                   float          not null,\
    total_query_max_used_memory     bigint         not null,\
    last_query_max_used_memory      bigint         not null,\
    min_query_max_used_memory       bigint         not null,\
    max_query_max_used_memory       bigint         not null,\
    sumsquare_query_max_used_memory float          not null,\
    total_rowcount                  bigint         not null,\
    last_rowcount                   bigint         not null,\
    min_rowcount                    bigint         not null,\
    max_rowcount                    bigint         not null,\
    sumsquare_rowcount              float          not null,\
    total_num_physical_io_reads     bigint,\
    last_num_physical_io_reads      bigint,\
    min_num_physical_io_reads       bigint,\
    max_num_physical_io_reads       bigint,\
    sumsquare_num_physical_io_reads float,\
    total_log_bytes_used            bigint,\
    last_log_bytes_used             bigint,\
    min_log_bytes_used              bigint,\
    max_log_bytes_used              bigint,\
    sumsquare_log_bytes_used        float,\
    total_tempdb_space_used         bigint,\
    last_tempdb_space_used          bigint,\
    min_tempdb_space_used           bigint,\
    max_tempdb_space_used           bigint,\
    sumsquare_tempdb_space_used     float,\
    total_page_server_io_reads      bigint,\
    last_page_server_io_reads       bigint,\
    min_page_server_io_reads        bigint,\
    max_page_server_io_reads        bigint,\
    sumsquare_page_server_io_reads  float,\
    replica_group_id                bigint         not null\
)\
go\
\
create unique clustered index plan_persist_runtime_stats_v2_cidx\
    on sys.plan_persist_runtime_stats_v2 (runtime_stats_interval_id, replica_group_id, plan_id, execution_type)\
go\
\
create index plan_persist_runtime_stats_v2_idx1\
    on sys.plan_persist_runtime_stats_v2 (plan_id, runtime_stats_interval_id, execution_type)\
go\
\
create unique index plan_persist_runtime_stats_v2_idx2\
    on sys.plan_persist_runtime_stats_v2 (runtime_stats_id)\
go\
\
create table sys.plan_persist_wait_stats\
(\
    wait_stats_id                bigint   not null,\
    runtime_stats_interval_id    bigint   not null,\
    plan_id                      bigint   not null,\
    wait_category                smallint not null,\
    execution_type               tinyint  not null,\
    count_executions             bigint   not null,\
    total_query_wait_time_ms     bigint   not null,\
    last_query_wait_time_ms      bigint   not null,\
    min_query_wait_time_ms       bigint   not null,\
    max_query_wait_time_ms       bigint   not null,\
    sumsquare_query_wait_time_ms float    not null\
)\
go\
\
create unique clustered index plan_persist_wait_stats_cidx\
    on sys.plan_persist_wait_stats (runtime_stats_interval_id, plan_id, wait_category, execution_type)\
go\
\
create unique index plan_persist_wait_stats_idx1\
    on sys.plan_persist_wait_stats (wait_stats_id)\
go\
\
create table sys.plan_persist_wait_stats_v2\
(\
    wait_stats_id                bigint   not null,\
    runtime_stats_interval_id    bigint   not null,\
    plan_id                      bigint   not null,\
    wait_category                smallint not null,\
    execution_type               tinyint  not null,\
    count_executions             bigint   not null,\
    total_query_wait_time_ms     bigint   not null,\
    last_query_wait_time_ms      bigint   not null,\
    min_query_wait_time_ms       bigint   not null,\
    max_query_wait_time_ms       bigint   not null,\
    sumsquare_query_wait_time_ms float    not null,\
    replica_group_id             bigint   not null\
)\
go\
\
create unique clustered index plan_persist_wait_stats_v2_cidx\
    on sys.plan_persist_wait_stats_v2 (runtime_stats_interval_id, replica_group_id, plan_id, execution_type,\
                                       wait_category)\
go\
\
create index plan_persist_wait_stats_v2_idx1\
    on sys.plan_persist_wait_stats_v2 (plan_id, runtime_stats_interval_id, execution_type, wait_category)\
go\
\
create unique index plan_persist_wait_stats_v2_idx2\
    on sys.plan_persist_wait_stats_v2 (wait_stats_id)\
go\
\
create table sys.queue_messages_1977058079\
(\
    status                  tinyint          not null,\
    priority                tinyint          not null,\
    queuing_order           bigint identity (0, 1),\
    conversation_group_id   uniqueidentifier not null,\
    conversation_handle     uniqueidentifier not null,\
    message_sequence_number bigint           not null,\
    message_id              uniqueidentifier not null,\
    message_type_id         int              not null,\
    service_id              int              not null,\
    service_contract_id     int              not null,\
    validation              nchar            not null collate Latin1_General_BIN,\
    next_fragment           int              not null,\
    fragment_size           int              not null,\
    fragment_bitmap         bigint           not null,\
    binary_message_body     varbinary(max),\
    message_enqueue_time    datetime\
)\
go\
\
create unique clustered index queue_clustered_index\
    on sys.queue_messages_1977058079 (status, conversation_group_id, priority, conversation_handle, queuing_order)\
go\
\
create unique index queue_secondary_index\
    on sys.queue_messages_1977058079 (status, priority, queuing_order, conversation_group_id, conversation_handle,\
                                      service_id)\
    with (allow_page_locks = OFF)\
go\
\
create table sys.queue_messages_2009058193\
(\
    status                  tinyint          not null,\
    priority                tinyint          not null,\
    queuing_order           bigint identity (0, 1),\
    conversation_group_id   uniqueidentifier not null,\
    conversation_handle     uniqueidentifier not null,\
    message_sequence_number bigint           not null,\
    message_id              uniqueidentifier not null,\
    message_type_id         int              not null,\
    service_id              int              not null,\
    service_contract_id     int              not null,\
    validation              nchar            not null collate Latin1_General_BIN,\
    next_fragment           int              not null,\
    fragment_size           int              not null,\
    fragment_bitmap         bigint           not null,\
    binary_message_body     varbinary(max),\
    message_enqueue_time    datetime\
)\
go\
\
create unique clustered index queue_clustered_index\
    on sys.queue_messages_2009058193 (status, conversation_group_id, priority, conversation_handle, queuing_order)\
go\
\
create unique index queue_secondary_index\
    on sys.queue_messages_2009058193 (status, priority, queuing_order, conversation_group_id, conversation_handle,\
                                      service_id)\
    with (allow_page_locks = OFF)\
go\
\
create table sys.queue_messages_2041058307\
(\
    status                  tinyint          not null,\
    priority                tinyint          not null,\
    queuing_order           bigint identity (0, 1),\
    conversation_group_id   uniqueidentifier not null,\
    conversation_handle     uniqueidentifier not null,\
    message_sequence_number bigint           not null,\
    message_id              uniqueidentifier not null,\
    message_type_id         int              not null,\
    service_id              int              not null,\
    service_contract_id     int              not null,\
    validation              nchar            not null collate Latin1_General_BIN,\
    next_fragment           int              not null,\
    fragment_size           int              not null,\
    fragment_bitmap         bigint           not null,\
    binary_message_body     varbinary(max),\
    message_enqueue_time    datetime\
)\
go\
\
create unique clustered index queue_clustered_index\
    on sys.queue_messages_2041058307 (status, conversation_group_id, priority, conversation_handle, queuing_order)\
go\
\
create unique index queue_secondary_index\
    on sys.queue_messages_2041058307 (status, priority, queuing_order, conversation_group_id, conversation_handle,\
                                      service_id)\
    with (allow_page_locks = OFF)\
go\
\
create table sys.sqlagent_job_history\
(\
    instance_id         int identity,\
    job_id              uniqueidentifier not null,\
    step_id             int              not null,\
    sql_message_id      int              not null,\
    sql_severity        int              not null,\
    message             nvarchar(4000) collate SQL_Latin1_General_CP1_CI_AS,\
    run_status          int              not null,\
    run_date            int              not null,\
    run_time            int              not null,\
    run_duration        int              not null,\
    operator_id_emailed int              not null,\
    operator_id_paged   int              not null,\
    retries_attempted   int              not null\
)\
go\
\
create unique clustered index sqlagent_job_history_clust\
    on sys.sqlagent_job_history (instance_id)\
go\
\
create index sqlagent_job_history_nc1\
    on sys.sqlagent_job_history (job_id)\
go\
\
create table sys.sqlagent_jobs\
(\
    job_id                uniqueidentifier not null,\
    name                  sysname          not null collate SQL_Latin1_General_CP1_CI_AS,\
    enabled               bit              not null,\
    description           nvarchar(512) collate SQL_Latin1_General_CP1_CI_AS,\
    start_step_id         int              not null,\
    notify_level_eventlog bit              not null,\
    delete_level          int              not null,\
    date_created          datetime         not null,\
    date_modified         datetime         not null\
)\
go\
\
create unique clustered index sqlagent_jobs_clust\
    on sys.sqlagent_jobs (job_id)\
go\
\
create index sqlagent_jobs_nc1_name\
    on sys.sqlagent_jobs (name)\
go\
\
create table sys.sqlagent_jobsteps\
(\
    job_id                uniqueidentifier not null,\
    step_id               int              not null,\
    step_name             sysname          not null collate SQL_Latin1_General_CP1_CI_AS,\
    subsystem             nvarchar(40)     not null collate SQL_Latin1_General_CP1_CI_AS,\
    command               nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    flags                 int              not null,\
    additional_parameters nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    cmdexec_success_code  int              not null,\
    on_success_action     tinyint          not null,\
    on_success_step_id    int              not null,\
    on_fail_action        tinyint          not null,\
    on_fail_step_id       int              not null,\
    server                sysname collate SQL_Latin1_General_CP1_CI_AS,\
    database_name         sysname collate SQL_Latin1_General_CP1_CI_AS,\
    database_user_name    sysname collate SQL_Latin1_General_CP1_CI_AS,\
    retry_attempts        int              not null,\
    retry_interval        int              not null,\
    os_run_priority       int              not null,\
    output_file_name      nvarchar(200) collate SQL_Latin1_General_CP1_CI_AS,\
    last_run_outcome      int              not null,\
    last_run_duration     int              not null,\
    last_run_retries      int              not null,\
    last_run_date         int              not null,\
    last_run_time         int              not null,\
    step_uid              uniqueidentifier not null\
)\
go\
\
create unique clustered index sqlagent_jobsteps_clust\
    on sys.sqlagent_jobsteps (job_id, step_id)\
go\
\
create unique index sqlagent_jobsteps_nc1\
    on sys.sqlagent_jobsteps (job_id, step_name)\
go\
\
create unique index sqlagent_jobsteps_nc2\
    on sys.sqlagent_jobsteps (step_uid)\
go\
\
create table sys.sqlagent_jobsteps_logs\
(\
    log_id       int identity,\
    log_text     nvarchar(max)    not null collate SQL_Latin1_General_CP1_CI_AS,\
    date_created datetime         not null,\
    step_uid     uniqueidentifier not null\
)\
go\
\
create index sqlagent_jobsteps_logs_nc1\
    on sys.sqlagent_jobsteps_logs (step_uid, date_created)\
go\
\
create table sys.sysallocunits\
(\
    auid       bigint    not null,\
    type       tinyint   not null,\
    ownerid    bigint    not null,\
    status     int       not null,\
    fgid       smallint  not null,\
    pgfirst    binary(6) not null,\
    pgroot     binary(6) not null,\
    pgfirstiam binary(6) not null,\
    pcused     bigint    not null,\
    pcdata     bigint    not null,\
    pcreserved bigint    not null\
)\
go\
\
create unique clustered index clust\
    on sys.sysallocunits (auid)\
go\
\
create unique index nc\
    on sys.sysallocunits (ownerid, type, auid)\
go\
\
create table sys.sysasymkeys\
(\
    id         int            not null,\
    name       sysname        not null collate SQL_Latin1_General_CP1_CI_AS,\
    thumbprint varbinary(64)  not null,\
    bitlength  int            not null,\
    algorithm  char(2)        not null collate Latin1_General_CI_AS_KS_WS,\
    modified   datetime       not null,\
    pkey       varbinary(4700),\
    encrtype   char(2)        not null collate Latin1_General_CI_AS_KS_WS,\
    pukey      varbinary(max) not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysasymkeys (id)\
go\
\
create unique index nc1\
    on sys.sysasymkeys (name)\
go\
\
create unique index nc3\
    on sys.sysasymkeys (thumbprint)\
go\
\
create table sys.sysaudacts\
(\
    class         tinyint not null,\
    id            int     not null,\
    subid         int     not null,\
    grantee       int     not null,\
    audit_spec_id int     not null,\
    type          char(4) not null collate Latin1_General_CI_AS_KS_WS,\
    state         char    not null collate Latin1_General_CI_AS_KS_WS\
)\
go\
\
create unique clustered index clust\
    on sys.sysaudacts (class, id, subid, grantee, audit_spec_id, type)\
go\
\
create table sys.sysbinobjs\
(\
    class    tinyint  not null,\
    id       int      not null,\
    nsid     int      not null,\
    name     sysname  not null collate Latin1_General_BIN,\
    status   int      not null,\
    type     char(2)  not null collate Latin1_General_BIN,\
    intprop  int      not null,\
    created  datetime not null,\
    modified datetime not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysbinobjs (class, id)\
go\
\
create unique index nc1\
    on sys.sysbinobjs (class, nsid, name)\
go\
\
create table sys.sysbinsubobjs\
(\
    class   tinyint not null,\
    idmajor int     not null,\
    subid   int     not null,\
    name    sysname not null collate Latin1_General_BIN,\
    status  int     not null,\
    intprop int     not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysbinsubobjs (class, idmajor, subid)\
go\
\
create unique index nc1\
    on sys.sysbinsubobjs (name, idmajor, class)\
go\
\
create table sys.sysbrickfiles\
(\
    brickid           int           not null,\
    dbid              int           not null,\
    pruid             int           not null,\
    fileid            int           not null,\
    grpid             int           not null,\
    status            int           not null,\
    filetype          tinyint       not null,\
    filestate         tinyint       not null,\
    size              int           not null,\
    maxsize           int           not null,\
    growth            int           not null,\
    lname             sysname       not null collate SQL_Latin1_General_CP1_CI_AS,\
    pname             nvarchar(260) not null collate SQL_Latin1_General_CP1_CI_AS,\
    createlsn         binary(10),\
    droplsn           binary(10),\
    fileguid          uniqueidentifier,\
    internalstatus    int           not null,\
    readonlylsn       binary(10),\
    readwritelsn      binary(10),\
    readonlybaselsn   binary(10),\
    firstupdatelsn    binary(10),\
    lastupdatelsn     binary(10),\
    backuplsn         binary(10),\
    diffbaselsn       binary(10),\
    diffbaseguid      uniqueidentifier,\
    diffbasetime      datetime      not null,\
    diffbaseseclsn    binary(10),\
    redostartlsn      binary(10),\
    redotargetlsn     binary(10),\
    forkguid          uniqueidentifier,\
    forklsn           binary(10),\
    forkvc            bigint        not null,\
    redostartforkguid uniqueidentifier\
)\
go\
\
create unique clustered index clst\
    on sys.sysbrickfiles (dbid, pruid, fileid)\
go\
\
create table sys.syscerts\
(\
    id             int            not null,\
    name           sysname        not null collate SQL_Latin1_General_CP1_CI_AS,\
    issuer         varbinary(884) not null,\
    snum           varbinary(32)  not null,\
    thumbprint     varbinary(64)  not null,\
    pkey           varbinary(4700),\
    encrtype       char(2)        not null collate Latin1_General_CI_AS_KS_WS,\
    cert           varbinary(max) not null,\
    status         int            not null,\
    lastpkeybackup datetime\
)\
go\
\
create unique clustered index cl\
    on sys.syscerts (id)\
go\
\
create unique index nc1\
    on sys.syscerts (name)\
go\
\
create unique index nc2\
    on sys.syscerts (issuer, snum)\
go\
\
create unique index nc3\
    on sys.syscerts (thumbprint)\
go\
\
create table sys.syschildinsts\
(\
    lsid      varbinary(85) not null,\
    iname     sysname       not null collate SQL_Latin1_General_CP1_CI_AS,\
    ipipename nvarchar(260) not null collate SQL_Latin1_General_CP1_CI_AS,\
    pid       int           not null,\
    status    int           not null,\
    crdate    datetime      not null,\
    modate    datetime      not null,\
    sysdbpath nvarchar(260) not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index cl\
    on sys.syschildinsts (lsid)\
go\
\
create table sys.sysclones\
(\
    id       int    not null,\
    subid    int    not null,\
    partid   int    not null,\
    version  int    not null,\
    segid    int    not null,\
    cloneid  int    not null,\
    rowsetid bigint not null,\
    dbfragid int    not null,\
    status   int    not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysclones (id, subid, partid, version, segid, cloneid)\
go\
\
create table sys.sysclsobjs\
(\
    class    tinyint  not null,\
    id       int      not null,\
    name     sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    status   int      not null,\
    type     char(2)  not null collate Latin1_General_CI_AS_KS_WS,\
    intprop  int      not null,\
    created  datetime not null,\
    modified datetime not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysclsobjs (class, id)\
go\
\
create unique index nc\
    on sys.sysclsobjs (name, class)\
go\
\
create table sys.syscolpars\
(\
    id          int      not null,\
    number      smallint not null,\
    colid       int      not null,\
    name        sysname collate SQL_Latin1_General_CP1_CI_AS,\
    xtype       tinyint  not null,\
    utype       int      not null,\
    length      smallint not null,\
    prec        tinyint  not null,\
    scale       tinyint  not null,\
    collationid int      not null,\
    status      int      not null,\
    maxinrow    smallint not null,\
    xmlns       int      not null,\
    dflt        int      not null,\
    chk         int      not null,\
    idtval      varbinary(64)\
)\
go\
\
create unique clustered index clst\
    on sys.syscolpars (id, number, colid)\
go\
\
create unique index nc\
    on sys.syscolpars (id, name, number)\
go\
\
create table sys.syscommittab\
(\
    commit_ts   bigint   not null,\
    xdes_id     bigint   not null,\
    commit_lbn  bigint   not null,\
    commit_csn  bigint   not null,\
    commit_time datetime not null,\
    dbfragid    int      not null\
)\
go\
\
create unique clustered index ci_commit_ts\
    on sys.syscommittab (commit_ts, xdes_id)\
go\
\
create unique index si_xdes_id\
    on sys.syscommittab (xdes_id) include (dbfragid)\
go\
\
create index si_commit_time_ts\
    on sys.syscommittab (commit_time, commit_ts)\
go\
\
create table sys.syscompfragments\
(\
    cprelid   int       not null,\
    fragid    int       not null,\
    fragobjid int       not null,\
    ts        binary(8) not null,\
    status    int       not null,\
    datasize  bigint    not null,\
    itemcnt   bigint    not null,\
    rowcnt    bigint    not null\
)\
go\
\
create unique clustered index clst\
    on sys.syscompfragments (cprelid, fragid)\
go\
\
create table sys.sysconvgroup\
(\
    id         uniqueidentifier not null,\
    service_id int              not null,\
    status     int              not null,\
    refcount   int              not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysconvgroup (id)\
go\
\
create table sys.syscscolsegments\
(\
    hobt_id                 bigint     not null,\
    column_id               int        not null,\
    segment_id              int        not null,\
    version                 int        not null,\
    encoding_type           int        not null,\
    row_count               int        not null,\
    status                  int        not null,\
    base_id                 bigint     not null,\
    magnitude               float      not null,\
    primary_dictionary_id   int        not null,\
    secondary_dictionary_id int        not null,\
    min_data_id             bigint     not null,\
    max_data_id             bigint     not null,\
    null_value              bigint     not null,\
    on_disk_size            bigint     not null,\
    data_ptr                binary(16) not null,\
    container_id            smallint,\
    bloom_filter_md         bigint,\
    bloom_filter_data_ptr   varbinary(16),\
    collation_id            int,\
    min_deep_data           varbinary(18),\
    max_deep_data           varbinary(18)\
)\
go\
\
create unique clustered index clust\
    on sys.syscscolsegments (hobt_id, column_id, segment_id)\
go\
\
create table sys.syscsdictionaries\
(\
    hobt_id       bigint     not null,\
    column_id     int        not null,\
    dictionary_id int        not null,\
    version       int        not null,\
    type          int        not null,\
    flags         bigint     not null,\
    last_id       int        not null,\
    entry_count   bigint     not null,\
    on_disk_size  bigint     not null,\
    data_ptr      binary(16) not null,\
    container_id  smallint\
)\
go\
\
create unique clustered index clust\
    on sys.syscsdictionaries (hobt_id, column_id, dictionary_id)\
go\
\
create table sys.syscsrowgroups\
(\
    hobt_id           bigint not null,\
    segment_id        int    not null,\
    version           int    not null,\
    ds_hobtid         bigint,\
    row_count         int    not null,\
    status            int    not null,\
    flags             int    not null,\
    compressed_reason int    not null,\
    generation        bigint not null,\
    created_time      datetime,\
    closed_time       datetime,\
    container_id      smallint,\
    blob_id           binary(16),\
    metadata_offset   int,\
    metadata_size     int\
)\
go\
\
create unique clustered index clust\
    on sys.syscsrowgroups (hobt_id, segment_id)\
go\
\
create table sys.sysdbfiles\
(\
    dbfragid int              not null,\
    fileid   int              not null,\
    fileguid uniqueidentifier not null,\
    pname    nvarchar(260) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index clst\
    on sys.sysdbfiles (dbfragid, fileid)\
go\
\
create table sys.sysdbfrag\
(\
    dbid    int     not null,\
    fragid  int     not null,\
    name    sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    brickid int     not null,\
    pruid   int     not null,\
    status  int     not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysdbfrag (dbid, fragid)\
go\
\
create unique index nc1\
    on sys.sysdbfrag (dbid, brickid, pruid)\
go\
\
create table sys.sysdbreg\
(\
    id          int              not null,\
    name        sysname          not null collate SQL_Latin1_General_CP1_CI_AS,\
    sid         varbinary(85),\
    status      int              not null,\
    status2     int              not null,\
    category    int              not null,\
    crdate      datetime         not null,\
    modified    datetime         not null,\
    svcbrkrguid uniqueidentifier not null,\
    scope       int              not null,\
    cmptlevel   tinyint          not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysdbreg (id)\
go\
\
create unique index nc1\
    on sys.sysdbreg (name)\
go\
\
create unique index nc2\
    on sys.sysdbreg (svcbrkrguid, scope)\
go\
\
create table sys.sysdercv\
(\
    diagid       uniqueidentifier not null,\
    initiator    tinyint          not null,\
    handle       uniqueidentifier not null,\
    rcvseq       bigint           not null,\
    rcvfrag      int              not null,\
    status       int              not null,\
    state        char(2)          not null collate Latin1_General_CI_AS_KS_WS,\
    lifetime     datetime         not null,\
    contract     int              not null,\
    svcid        int              not null,\
    convgroup    uniqueidentifier not null,\
    sysseq       bigint           not null,\
    enddlgseq    bigint           not null,\
    firstoorder  bigint           not null,\
    lastoorder   bigint           not null,\
    lastoorderfr int              not null,\
    dlgtimer     datetime         not null,\
    dlgopened    datetime         not null,\
    princid      int              not null,\
    outseskey    varbinary(4096)  not null,\
    outseskeyid  uniqueidentifier not null,\
    farprincid   int              not null,\
    inseskey     varbinary(4096)  not null,\
    inseskeyid   uniqueidentifier not null,\
    farsvc       nvarchar(256)    not null collate Latin1_General_BIN,\
    farbrkrinst  nvarchar(128) collate Latin1_General_BIN,\
    priority     tinyint          not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysdercv (diagid, initiator)\
go\
\
create table sys.sysdesend\
(\
    handle    uniqueidentifier not null,\
    diagid    uniqueidentifier not null,\
    initiator tinyint          not null,\
    sendseq   bigint           not null,\
    sendxact  binary(6)        not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysdesend (handle)\
go\
\
create table sys.sysendpts\
(\
    id             int      not null,\
    name           sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    protocol       tinyint  not null,\
    type           tinyint  not null,\
    bstat          smallint not null,\
    affinity       bigint   not null,\
    pstat          smallint not null,\
    tstat          smallint not null,\
    typeint        int      not null,\
    port1          int      not null,\
    port2          int      not null,\
    site           nvarchar(128) collate Latin1_General_CI_AS_KS_WS,\
    dfltns         nvarchar(384) collate Latin1_General_BIN,\
    wsdlproc       nvarchar(776) collate SQL_Latin1_General_CP1_CI_AS,\
    dfltdb         sysname collate SQL_Latin1_General_CP1_CI_AS,\
    authrealm      nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    dfltdm         nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    maxconn        int      not null,\
    encalg         tinyint  not null,\
    authtype       tinyint  not null,\
    encryptiontype tinyint\
)\
go\
\
create unique clustered index clst\
    on sys.sysendpts (id)\
go\
\
create unique index nc1\
    on sys.sysendpts (name)\
go\
\
create table sys.sysextfileformats\
(\
    file_format_id   int           not null,\
    name             nvarchar(128) not null collate SQL_Latin1_General_CP1_CI_AS,\
    format_type      nvarchar(100) not null collate SQL_Latin1_General_CP1_CI_AS,\
    field_terminator nvarchar(10) collate SQL_Latin1_General_CP1_CI_AS,\
    string_delimiter nvarchar(10) collate SQL_Latin1_General_CP1_CI_AS,\
    date_format      nvarchar(50) collate SQL_Latin1_General_CP1_CI_AS,\
    use_type_default int           not null,\
    serde_method     nvarchar(255) collate SQL_Latin1_General_CP1_CI_AS,\
    row_terminator   nvarchar(10) collate SQL_Latin1_General_CP1_CI_AS,\
    encoding         nvarchar(10) collate SQL_Latin1_General_CP1_CI_AS,\
    data_compression nvarchar(255) collate SQL_Latin1_General_CP1_CI_AS,\
    first_row        int,\
    extractor        nvarchar(255) collate SQL_Latin1_General_CP1_CI_AS,\
    null_values      nvarchar(421) collate SQL_Latin1_General_CP1_CI_AS,\
    parser_version   nvarchar(8) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index clidx1\
    on sys.sysextfileformats (file_format_id)\
go\
\
create unique index ncidx1\
    on sys.sysextfileformats (name)\
go\
\
create table sys.sysextsources\
(\
    data_source_id       int            not null,\
    name                 nvarchar(128)  not null collate SQL_Latin1_General_CP1_CI_AS,\
    type_desc            nvarchar(255)  not null collate SQL_Latin1_General_CP1_CI_AS,\
    type                 tinyint        not null,\
    location             nvarchar(4000) not null collate SQL_Latin1_General_CP1_CI_AS,\
    credential_id        int            not null,\
    job_tracker_location nvarchar(4000) collate SQL_Latin1_General_CP1_CI_AS,\
    storage_key          nvarchar(4000) collate SQL_Latin1_General_CP1_CI_AS,\
    user_name            nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    shard_map_manager_db nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    shard_map_name       nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    connection_options   nvarchar(4000) collate SQL_Latin1_General_CP1_CI_AS,\
    pushdown             nvarchar(256)  not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index clidx1\
    on sys.sysextsources (data_source_id)\
go\
\
create unique index ncidx1\
    on sys.sysextsources (name)\
go\
\
create table sys.sysexttables\
(\
    object_id             int     not null,\
    data_source_id        int     not null,\
    file_format_id        int,\
    location              nvarchar(4000) collate SQL_Latin1_General_CP1_CI_AS,\
    reject_type           nvarchar(20) collate SQL_Latin1_General_CP1_CI_AS,\
    reject_value          float,\
    reject_sample_value   float,\
    sharding_dist_type    tinyint not null,\
    sharding_col_id       int     not null,\
    source_schema_name    nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    source_table_name     nvarchar(128) collate SQL_Latin1_General_CP1_CI_AS,\
    rejected_row_location nvarchar(4000) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index clidx1\
    on sys.sysexttables (object_id)\
go\
\
create table sys.sysfgfrag\
(\
    fgid     int not null,\
    fgfragid int not null,\
    dbfragid int not null,\
    phfgid   int not null,\
    status   int not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysfgfrag (fgid, fgfragid, dbfragid, phfgid)\
go\
\
create table sys.sysfiles1\
(\
    status   int        not null,\
    fileid   smallint   not null,\
    name     nchar(128) not null collate SQL_Latin1_General_CP1_CI_AS,\
    filename nchar(260) not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create table sys.sysfoqueues\
(\
    id      int        not null,\
    lsn     binary(10) not null,\
    epoch   int,\
    csn     bigint,\
    created datetime   not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysfoqueues (id, lsn)\
go\
\
create table sys.sysfos\
(\
    id       int            not null,\
    tgid     int            not null,\
    low      varbinary(512) not null,\
    high     varbinary(512),\
    rowcnt   bigint,\
    size     bigint,\
    csn      bigint,\
    epoch    int,\
    status   char           not null collate SQL_Latin1_General_CP1_CI_AS,\
    history  varbinary(6000),\
    created  datetime       not null,\
    modified datetime       not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysfos (id)\
go\
\
create unique index nc1\
    on sys.sysfos (tgid, low, high)\
go\
\
create table sys.sysftinds\
(\
    id                int       not null,\
    indid             int       not null,\
    status            int       not null,\
    crtype            char      not null collate Latin1_General_CI_AS_KS_WS,\
    crstart           datetime,\
    crend             datetime,\
    crrows            bigint    not null,\
    crerrors          int       not null,\
    crschver          binary(8) not null,\
    crtsnext          binary(8),\
    sensitivity       tinyint   not null,\
    bXVTDocidUseBaseT tinyint   not null,\
    batchsize         int       not null,\
    nextdocid         bigint    not null,\
    fgid              int       not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysftinds (id)\
go\
\
create table sys.sysftproperties\
(\
    property_list_id   int              not null,\
    property_id        int              not null,\
    property_name      nvarchar(256)    not null collate SQL_Latin1_General_CP437_CS_AS,\
    guid_identifier    uniqueidentifier not null,\
    int_identifier     int              not null,\
    string_description nvarchar(512) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index clst\
    on sys.sysftproperties (property_list_id, property_id)\
go\
\
create unique index nonclst\
    on sys.sysftproperties (property_list_id, property_name)\
go\
\
create unique index nonclstgi\
    on sys.sysftproperties (property_list_id, guid_identifier, int_identifier)\
go\
\
create table sys.sysftsemanticsdb\
(\
    database_id   int              not null,\
    register_date datetime         not null,\
    registered_by int              not null,\
    version       nvarchar(128)    not null collate SQL_Latin1_General_CP1_CI_AS,\
    fileguid      uniqueidentifier not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysftsemanticsdb (database_id)\
go\
\
create table sys.sysftstops\
(\
    stoplistid int          not null,\
    stopword   nvarchar(64) not null collate Latin1_General_BIN,\
    lcid       int          not null,\
    status     tinyint      not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysftstops (stoplistid, stopword, lcid)\
go\
\
create table sys.sysguidrefs\
(\
    class  tinyint          not null,\
    id     int              not null,\
    subid  int              not null,\
    guid   uniqueidentifier not null,\
    status int              not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysguidrefs (id, class, subid)\
go\
\
create unique index nc\
    on sys.sysguidrefs (guid, class)\
go\
\
create table sys.sysidxstats\
(\
    id        int     not null,\
    indid     int     not null,\
    name      sysname collate SQL_Latin1_General_CP1_CI_AS,\
    status    int     not null,\
    intprop   int     not null,\
    fillfact  tinyint not null,\
    type      tinyint not null,\
    tinyprop  tinyint not null,\
    dataspace int     not null,\
    lobds     int     not null,\
    rowset    bigint  not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysidxstats (id, indid)\
go\
\
create unique index nc\
    on sys.sysidxstats (name, id)\
go\
\
create table sys.sysiscols\
(\
    idmajor   int     not null,\
    idminor   int     not null,\
    subid     int     not null,\
    status    int     not null,\
    intprop   int     not null,\
    tinyprop1 tinyint not null,\
    tinyprop2 tinyint not null,\
    tinyprop3 tinyint not null,\
    tinyprop4 tinyint not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysiscols (idmajor, idminor, subid)\
go\
\
create unique index nc1\
    on sys.sysiscols (idmajor, intprop, subid, idminor)\
go\
\
create table sys.syslnklgns\
(\
    srvid   int      not null,\
    lgnid   int,\
    name    sysname collate SQL_Latin1_General_CP1_CI_AS,\
    status  int      not null,\
    modate  datetime not null,\
    pwdhash varbinary(320)\
)\
go\
\
create unique clustered index cl\
    on sys.syslnklgns (srvid, lgnid)\
go\
\
create table sys.sysmultiobjrefs\
(\
    class      tinyint not null,\
    depid      int     not null,\
    depsubid   int     not null,\
    indepid    int     not null,\
    indepsubid int     not null,\
    status     int     not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysmultiobjrefs (depid, class, depsubid, indepid, indepsubid)\
go\
\
create unique index nc1\
    on sys.sysmultiobjrefs (indepid, class, indepsubid, depid, depsubid)\
go\
\
create table sys.sysmultiobjvalues\
(\
    valclass   tinyint not null,\
    depid      int     not null,\
    depsubid   int     not null,\
    indepid    int     not null,\
    indepsubid int     not null,\
    valnum     int     not null,\
    value      sql_variant,\
    imageval   varbinary(max)\
)\
go\
\
create unique clustered index clust\
    on sys.sysmultiobjvalues (valclass, depid, depsubid, indepid, indepsubid, valnum)\
go\
\
create unique index nc1\
    on sys.sysmultiobjvalues (valclass, indepid, indepsubid, depid, depsubid, valnum)\
go\
\
create table sys.sysnsobjs\
(\
    class    tinyint  not null,\
    id       int      not null,\
    name     sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    nsid     int      not null,\
    status   int      not null,\
    intprop  int      not null,\
    created  datetime not null,\
    modified datetime not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysnsobjs (class, id)\
go\
\
create unique index nc\
    on sys.sysnsobjs (name, nsid, class)\
go\
\
create table sys.sysobjkeycrypts\
(\
    class      tinyint        not null,\
    id         int            not null,\
    thumbprint varbinary(32)  not null,\
    type       char(4)        not null collate Latin1_General_CI_AS_KS_WS,\
    crypto     varbinary(max) not null,\
    status     int            not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysobjkeycrypts (class, id, thumbprint)\
go\
\
create table sys.sysobjvalues\
(\
    valclass tinyint not null,\
    objid    int     not null,\
    subobjid int     not null,\
    valnum   int     not null,\
    value    sql_variant,\
    imageval varbinary(max)\
)\
go\
\
create unique clustered index clst\
    on sys.sysobjvalues (valclass, objid, subobjid, valnum)\
go\
\
create table sys.sysowners\
(\
    id          int      not null,\
    name        sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    type        char     not null collate Latin1_General_CI_AS_KS_WS,\
    sid         varbinary(85),\
    password    varbinary(256),\
    dfltsch     sysname collate SQL_Latin1_General_CP1_CI_AS,\
    status      int      not null,\
    created     datetime not null,\
    modified    datetime not null,\
    deflanguage sysname collate SQL_Latin1_General_CP1_CI_AS,\
    tenantid    uniqueidentifier,\
    onpremsid   varbinary(85),\
    externaloid uniqueidentifier,\
    pwdset      datetime\
)\
go\
\
create unique clustered index clst\
    on sys.sysowners (id)\
go\
\
create unique index nc1\
    on sys.sysowners (name)\
go\
\
create unique index nc2\
    on sys.sysowners (sid, id)\
go\
\
create table sys.sysphfg\
(\
    dbfragid int     not null,\
    phfgid   int     not null,\
    fgid     int     not null,\
    type     char(2) not null collate Latin1_General_CI_AS_KS_WS,\
    fgguid   uniqueidentifier,\
    lgfgid   int,\
    status   int     not null,\
    name     sysname not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index cl\
    on sys.sysphfg (phfgid)\
go\
\
create table sys.syspriorities\
(\
    priority_id         int     not null,\
    name                sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    service_contract_id int,\
    local_service_id    int,\
    remote_service_name nvarchar(256) collate SQL_Latin1_General_CP1_CI_AS,\
    priority            tinyint not null\
)\
go\
\
create unique clustered index cl\
    on sys.syspriorities (priority_id)\
go\
\
create unique index nc\
    on sys.syspriorities (service_contract_id, local_service_id, remote_service_name) include (priority)\
go\
\
create unique index nc2\
    on sys.syspriorities (name)\
go\
\
create table sys.sysprivs\
(\
    class   tinyint not null,\
    id      int     not null,\
    subid   int     not null,\
    grantee int     not null,\
    grantor int     not null,\
    type    char(4) not null collate Latin1_General_CI_AS_KS_WS,\
    state   char    not null collate Latin1_General_CI_AS_KS_WS\
)\
go\
\
create unique clustered index clust\
    on sys.sysprivs (class, id, subid, grantee, grantor, type)\
go\
\
create table sys.syspru\
(\
    brickid int not null,\
    dbid    int not null,\
    pruid   int not null,\
    fragid  int not null,\
    status  int not null\
)\
go\
\
create unique clustered index cl\
    on sys.syspru (dbid, pruid)\
go\
\
create table sys.sysprufiles\
(\
    dbfragid          int           not null,\
    fileid            int           not null,\
    grpid             int           not null,\
    status            int           not null,\
    filetype          tinyint       not null,\
    filestate         tinyint       not null,\
    size              int           not null,\
    maxsize           int           not null,\
    growth            int           not null,\
    lname             sysname       not null collate SQL_Latin1_General_CP1_CI_AS,\
    pname             nvarchar(260) not null collate SQL_Latin1_General_CP1_CI_AS,\
    createlsn         binary(10),\
    droplsn           binary(10),\
    fileguid          uniqueidentifier,\
    internalstatus    int           not null,\
    readonlylsn       binary(10),\
    readwritelsn      binary(10),\
    readonlybaselsn   binary(10),\
    firstupdatelsn    binary(10),\
    lastupdatelsn     binary(10),\
    backuplsn         binary(10),\
    diffbaselsn       binary(10),\
    diffbaseguid      uniqueidentifier,\
    diffbasetime      datetime      not null,\
    diffbaseseclsn    binary(10),\
    redostartlsn      binary(10),\
    redotargetlsn     binary(10),\
    forkguid          uniqueidentifier,\
    forklsn           binary(10),\
    forkvc            bigint        not null,\
    redostartforkguid uniqueidentifier\
)\
go\
\
create unique clustered index clst\
    on sys.sysprufiles (fileid)\
go\
\
create table sys.sysqnames\
(\
    qid  int            not null,\
    hash int            not null,\
    nid  int            not null,\
    name nvarchar(4000) not null collate Latin1_General_BIN\
)\
go\
\
create unique clustered index clst\
    on sys.sysqnames (qid, hash, nid)\
go\
\
create unique index nc1\
    on sys.sysqnames (nid)\
go\
\
create table sys.sysremsvcbinds\
(\
    id     int     not null,\
    name   sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    scid   int     not null,\
    remsvc nvarchar(256) collate Latin1_General_BIN,\
    status int     not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysremsvcbinds (id)\
go\
\
create unique index nc1\
    on sys.sysremsvcbinds (name)\
go\
\
create unique index nc2\
    on sys.sysremsvcbinds (scid, remsvc)\
go\
\
create table sys.sysrmtlgns\
(\
    srvid  int      not null,\
    name   sysname collate SQL_Latin1_General_CP1_CI_AS,\
    lgnid  int,\
    status int      not null,\
    modate datetime not null\
)\
go\
\
create unique clustered index cl\
    on sys.sysrmtlgns (srvid, name)\
go\
\
create table sys.sysrowsetrefs\
(\
    class     tinyint not null,\
    objid     int     not null,\
    indexid   int     not null,\
    rowsetnum int     not null,\
    rowsetid  bigint  not null,\
    status    int     not null\
)\
go\
\
create unique clustered index clust\
    on sys.sysrowsetrefs (class, objid, indexid, rowsetnum)\
go\
\
create table sys.sysrowsets\
(\
    rowsetid   bigint   not null,\
    ownertype  tinyint  not null,\
    idmajor    int      not null,\
    idminor    int      not null,\
    numpart    int      not null,\
    status     int      not null,\
    fgidfs     smallint not null,\
    rcrows     bigint   not null,\
    cmprlevel  tinyint  not null,\
    fillfact   tinyint  not null,\
    maxnullbit smallint not null,\
    maxleaf    int      not null,\
    maxint     smallint not null,\
    minleaf    smallint not null,\
    minint     smallint not null,\
    rsguid     varbinary(16),\
    lockres    varbinary(8),\
    scope_id   int\
)\
go\
\
create unique clustered index clust\
    on sys.sysrowsets (rowsetid)\
go\
\
create table sys.sysrscols\
(\
    rsid        bigint   not null,\
    rscolid     int      not null,\
    hbcolid     int      not null,\
    rcmodified  bigint   not null,\
    ti          int      not null,\
    cid         int      not null,\
    ordkey      smallint not null,\
    maxinrowlen smallint not null,\
    status      int      not null,\
    offset      int      not null,\
    nullbit     int      not null,\
    bitpos      smallint not null,\
    colguid     varbinary(16),\
    ordlock     int\
)\
go\
\
create unique clustered index clst\
    on sys.sysrscols (rsid, hbcolid)\
go\
\
create table sys.sysrts\
(\
    id       int     not null,\
    name     sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    remsvc   nvarchar(256) collate Latin1_General_BIN,\
    brkrinst nvarchar(128) collate Latin1_General_BIN,\
    addr     nvarchar(256) collate Latin1_General_BIN,\
    miraddr  nvarchar(256) collate Latin1_General_BIN,\
    lifetime datetime\
)\
go\
\
create unique clustered index clst\
    on sys.sysrts (id)\
go\
\
create unique index nc1\
    on sys.sysrts (remsvc, brkrinst, id)\
go\
\
create unique index nc2\
    on sys.sysrts (name)\
go\
\
create table sys.sysscalartypes\
(\
    id          int      not null,\
    schid       int      not null,\
    name        sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    xtype       tinyint  not null,\
    length      smallint not null,\
    prec        tinyint  not null,\
    scale       tinyint  not null,\
    collationid int      not null,\
    status      int      not null,\
    created     datetime not null,\
    modified    datetime not null,\
    dflt        int      not null,\
    chk         int      not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysscalartypes (id)\
go\
\
create unique index nc1\
    on sys.sysscalartypes (schid, name)\
go\
\
create unique index nc2\
    on sys.sysscalartypes (name, schid)\
go\
\
create table sys.sysschobjs\
(\
    id       int      not null,\
    name     sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    nsid     int      not null,\
    nsclass  tinyint  not null,\
    status   int      not null,\
    type     char(2)  not null collate Latin1_General_CI_AS_KS_WS,\
    pid      int      not null,\
    pclass   tinyint  not null,\
    intprop  int      not null,\
    created  datetime not null,\
    modified datetime not null,\
    status2  int      not null\
)\
go\
\
create unique clustered index clst\
    on sys.sysschobjs (id)\
go\
\
create unique index nc1\
    on sys.sysschobjs (nsclass, nsid, name)\
go\
\
create unique index nc2\
    on sys.sysschobjs (name, nsid, nsclass)\
go\
\
create index nc3\
    on sys.sysschobjs (pid, pclass)\
go\
\
create table sys.sysseobjvalues\
(\
    valclass tinyint not null,\
    id       bigint  not null,\
    subid    bigint  not null,\
    valnum   int     not null,\
    value    sql_variant,\
    imageval varbinary(max)\
)\
go\
\
create unique clustered index clst\
    on sys.sysseobjvalues (valclass, id, subid, valnum)\
go\
\
create table sys.syssingleobjrefs\
(\
    class      tinyint not null,\
    depid      int     not null,\
    depsubid   int     not null,\
    indepid    int     not null,\
    indepsubid int     not null,\
    status     int     not null\
)\
go\
\
create unique clustered index clst\
    on sys.syssingleobjrefs (depid, class, depsubid)\
go\
\
create unique index nc1\
    on sys.syssingleobjrefs (indepid, class, indepsubid, depid, depsubid)\
go\
\
create table sys.syssoftobjrefs\
(\
    depclass    tinyint not null,\
    depid       int     not null,\
    indepclass  tinyint not null,\
    indepname   sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    indepschema sysname collate SQL_Latin1_General_CP1_CI_AS,\
    indepdb     sysname collate SQL_Latin1_General_CP1_CI_AS,\
    indepserver sysname collate SQL_Latin1_General_CP1_CI_AS,\
    number      int     not null,\
    status      int     not null\
)\
go\
\
create unique clustered index clst\
    on sys.syssoftobjrefs (depid, depclass, indepname, indepschema, indepclass, number)\
go\
\
create unique index nc1\
    on sys.syssoftobjrefs (indepname, indepschema, indepclass, depid, depclass, number)\
go\
\
create table sys.syssqlguides\
(\
    id              int      not null,\
    name            sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    scopetype       tinyint  not null,\
    scopeid         int      not null,\
    hash            varbinary(20),\
    status          int      not null,\
    created         datetime not null,\
    modified        datetime not null,\
    batchtext       nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS,\
    paramorhinttext nvarchar(max) collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index clst\
    on sys.syssqlguides (id)\
go\
\
create unique index nc1\
    on sys.syssqlguides (name)\
go\
\
create unique index nc2\
    on sys.syssqlguides (scopetype, scopeid, hash, id)\
go\
\
create table sys.systypedsubobjs\
(\
    class       tinyint  not null,\
    idmajor     int      not null,\
    subid       int      not null,\
    name        sysname collate Latin1_General_BIN,\
    xtype       tinyint  not null,\
    utype       int      not null,\
    length      smallint not null,\
    prec        tinyint  not null,\
    scale       tinyint  not null,\
    collationid int      not null,\
    status      int      not null,\
    intprop     int      not null\
)\
go\
\
create unique clustered index clst\
    on sys.systypedsubobjs (class, idmajor, subid)\
go\
\
create unique index nc\
    on sys.systypedsubobjs (name, idmajor, class)\
go\
\
create table sys.sysusermsgs\
(\
    id        int            not null,\
    msglangid smallint       not null,\
    severity  smallint       not null,\
    status    smallint       not null,\
    text      nvarchar(1024) not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create unique clustered index clst\
    on sys.sysusermsgs (id, msglangid)\
go\
\
create table sys.syswebmethods\
(\
    id      int          not null,\
    nmspace nvarchar(384) collate Latin1_General_BIN,\
    alias   nvarchar(64) not null collate Latin1_General_BIN,\
    objname nvarchar(776) collate SQL_Latin1_General_CP1_CI_AS,\
    status  int          not null\
)\
go\
\
create unique clustered index clst\
    on sys.syswebmethods (id, nmspace, alias)\
go\
\
create table sys.sysxlgns\
(\
    id          int      not null,\
    name        sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    sid         varbinary(85),\
    status      int      not null,\
    type        char     not null collate Latin1_General_CI_AS_KS_WS,\
    crdate      datetime not null,\
    modate      datetime not null,\
    dbname      sysname collate SQL_Latin1_General_CP1_CI_AS,\
    lang        sysname collate SQL_Latin1_General_CP1_CI_AS,\
    pwdhash     varbinary(256),\
    tenantid    uniqueidentifier,\
    onpremsid   varbinary(85),\
    externaloid uniqueidentifier\
)\
go\
\
create unique clustered index cl\
    on sys.sysxlgns (id)\
go\
\
create unique index nc1\
    on sys.sysxlgns (name)\
go\
\
create unique index nc2\
    on sys.sysxlgns (sid)\
go\
\
create table sys.sysxmitbody\
(\
    msgref  bigint not null,\
    count   int    not null,\
    msgbody varbinary(max)\
)\
go\
\
create unique clustered index clst\
    on sys.sysxmitbody (msgref)\
go\
\
create table sys.sysxmitqueue\
(\
    dlgid        uniqueidentifier not null,\
    finitiator   bit              not null,\
    tosvc        nvarchar(256) collate Latin1_General_BIN,\
    tobrkrinst   nvarchar(128) collate Latin1_General_BIN,\
    fromsvc      nvarchar(256) collate Latin1_General_BIN,\
    frombrkrinst nvarchar(128) collate Latin1_General_BIN,\
    svccontr     nvarchar(256) collate Latin1_General_BIN,\
    msgseqnum    bigint           not null,\
    msgtype      nvarchar(256) collate Latin1_General_BIN,\
    unackmfn     int              not null,\
    status       int              not null,\
    enqtime      datetime         not null,\
    rsndtime     datetime,\
    dlgerr       int              not null,\
    msgid        uniqueidentifier not null,\
    hdrpartlen   smallint         not null,\
    hdrseclen    smallint         not null,\
    msgenc       tinyint          not null,\
    msgbodylen   int              not null,\
    msgbody      varbinary(max),\
    msgref       bigint\
)\
go\
\
create unique clustered index clst\
    on sys.sysxmitqueue (dlgid, finitiator, msgseqnum)\
go\
\
create table sys.sysxmlcomponent\
(\
    id       int     not null,\
    xsdid    int     not null,\
    uriord   int     not null,\
    qual     tinyint not null,\
    nameid   int     not null,\
    symspace char    not null collate Latin1_General_BIN,\
    nmscope  int     not null,\
    kind     char    not null collate Latin1_General_BIN,\
    deriv    char    not null collate Latin1_General_BIN,\
    status   int     not null,\
    enum     char    not null collate Latin1_General_BIN,\
    defval   nvarchar(4000) collate Latin1_General_BIN\
)\
go\
\
create unique clustered index cl\
    on sys.sysxmlcomponent (id)\
go\
\
create unique index nc1\
    on sys.sysxmlcomponent (xsdid, uriord, qual, nameid, symspace, nmscope)\
go\
\
create table sys.sysxmlfacet\
(\
    compid int      not null,\
    ord    int      not null,\
    kind   char(2)  not null collate Latin1_General_BIN,\
    status smallint not null,\
    dflt   nvarchar(4000) collate Latin1_General_BIN\
)\
go\
\
create unique clustered index cl\
    on sys.sysxmlfacet (compid, ord)\
go\
\
create table sys.sysxmlplacement\
(\
    placingid int not null,\
    ordinal   int not null,\
    placedid  int not null,\
    status    int not null,\
    minoccur  int not null,\
    maxoccur  int not null,\
    defval    nvarchar(4000) collate Latin1_General_BIN\
)\
go\
\
create unique clustered index cl\
    on sys.sysxmlplacement (placingid, ordinal)\
go\
\
create unique index nc1\
    on sys.sysxmlplacement (placedid, placingid, ordinal)\
go\
\
create table sys.sysxprops\
(\
    class tinyint not null,\
    id    int     not null,\
    subid int     not null,\
    name  sysname not null collate SQL_Latin1_General_CP1_CI_AS,\
    value sql_variant\
)\
go\
\
create unique clustered index clust\
    on sys.sysxprops (class, id, subid, name)\
go\
\
create table sys.sysxsrvs\
(\
    id             int      not null,\
    name           sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    product        sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    provider       sysname  not null collate SQL_Latin1_General_CP1_CI_AS,\
    status         int      not null,\
    modate         datetime not null,\
    catalog        sysname collate SQL_Latin1_General_CP1_CI_AS,\
    cid            int,\
    connecttimeout int,\
    querytimeout   int\
)\
go\
\
create unique clustered index cl\
    on sys.sysxsrvs (id)\
go\
\
create unique index nc1\
    on sys.sysxsrvs (name)\
go\
\
create table sys.trace_xe_action_map\
(\
    trace_column_id smallint     not null,\
    package_name    nvarchar(60) not null collate SQL_Latin1_General_CP1_CI_AS,\
    xe_action_name  nvarchar(60) not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create table sys.trace_xe_event_map\
(\
    trace_event_id smallint     not null,\
    package_name   nvarchar(60) not null collate SQL_Latin1_General_CP1_CI_AS,\
    xe_event_name  nvarchar(60) not null collate SQL_Latin1_General_CP1_CI_AS\
)\
go\
\
create table sys.wpr_bucket_table\
(\
    bucket_id   bigint not null,\
    bucket_data varbinary(8000)\
)\
go\
\
create unique clustered index wpr_bucket_clustered_idx\
    on sys.wpr_bucket_table (bucket_id)\
go\
\
create view INFORMATION_SCHEMA.CHECK_CONSTRAINTS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.COLUMNS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.COLUMN_DOMAIN_USAGE as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.COLUMN_PRIVILEGES as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.CONSTRAINT_TABLE_USAGE as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.DOMAINS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.DOMAIN_CONSTRAINTS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.KEY_COLUMN_USAGE as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.PARAMETERS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.ROUTINES as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.ROUTINE_COLUMNS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.SCHEMATA as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.SEQUENCES as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.TABLES as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.TABLE_CONSTRAINTS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.TABLE_PRIVILEGES as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.VIEWS as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.VIEW_COLUMN_USAGE as\
-- missing source code\
go\
\
create view INFORMATION_SCHEMA.VIEW_TABLE_USAGE as\
-- missing source code\
go\
\
create view sys.all_columns as\
-- missing source code\
go\
\
grant select on sys.all_columns to [public]\
go\
\
create view sys.all_objects as\
-- missing source code\
go\
\
grant select on sys.all_objects to [public]\
go\
\
create view sys.all_parameters as\
-- missing source code\
go\
\
grant select on sys.all_parameters to [public]\
go\
\
create view sys.all_sql_modules as\
-- missing source code\
go\
\
grant select on sys.all_sql_modules to [public]\
go\
\
create view sys.all_views as\
-- missing source code\
go\
\
grant select on sys.all_views to [public]\
go\
\
create view sys.allocation_units as\
-- missing source code\
go\
\
grant select on sys.allocation_units to [public]\
go\
\
create view sys.assemblies as\
-- missing source code\
go\
\
grant select on sys.assemblies to [public]\
go\
\
create view sys.assembly_files as\
-- missing source code\
go\
\
grant select on sys.assembly_files to [public]\
go\
\
create view sys.assembly_modules as\
-- missing source code\
go\
\
grant select on sys.assembly_modules to [public]\
go\
\
create view sys.assembly_references as\
-- missing source code\
go\
\
grant select on sys.assembly_references to [public]\
go\
\
create view sys.assembly_types as\
-- missing source code\
go\
\
grant select on sys.assembly_types to [public]\
go\
\
create view sys.asymmetric_keys as\
-- missing source code\
go\
\
grant select on sys.asymmetric_keys to [public]\
go\
\
create view sys.certificates as\
-- missing source code\
go\
\
grant select on sys.certificates to [public]\
go\
\
create view sys.change_tracking_databases as\
-- missing source code\
go\
\
create view sys.change_tracking_tables as\
-- missing source code\
go\
\
grant select on sys.change_tracking_tables to [public]\
go\
\
create view sys.check_constraints as\
-- missing source code\
go\
\
grant select on sys.check_constraints to [public]\
go\
\
create view sys.column_encryption_key_values as\
-- missing source code\
go\
\
grant select on sys.column_encryption_key_values to [public]\
go\
\
create view sys.column_encryption_keys as\
-- missing source code\
go\
\
grant select on sys.column_encryption_keys to [public]\
go\
\
create view sys.column_master_key_definitions as\
-- missing source code\
go\
\
grant select on sys.column_master_key_definitions to [public]\
go\
\
create view sys.column_master_keys as\
-- missing source code\
go\
\
grant select on sys.column_master_keys to [public]\
go\
\
create view sys.column_store_dictionaries as\
-- missing source code\
go\
\
grant select on sys.column_store_dictionaries to [public]\
go\
\
create view sys.column_store_row_groups as\
-- missing source code\
go\
\
grant select on sys.column_store_row_groups to [public]\
go\
\
create view sys.column_store_segments as\
-- missing source code\
go\
\
grant select on sys.column_store_segments to [public]\
go\
\
create view sys.column_type_usages as\
-- missing source code\
go\
\
grant select on sys.column_type_usages to [public]\
go\
\
create view sys.column_xml_schema_collection_usages as\
-- missing source code\
go\
\
grant select on sys.column_xml_schema_collection_usages to [public]\
go\
\
create view sys.columns as\
-- missing source code\
go\
\
grant select on sys.columns to [public]\
go\
\
create view sys.computed_columns as\
-- missing source code\
go\
\
grant select on sys.computed_columns to [public]\
go\
\
create view sys.configurations as\
-- missing source code\
go\
\
create view sys.conversation_endpoints as\
-- missing source code\
go\
\
grant select on sys.conversation_endpoints to [public]\
go\
\
create view sys.conversation_groups as\
-- missing source code\
go\
\
grant select on sys.conversation_groups to [public]\
go\
\
create view sys.conversation_priorities as\
-- missing source code\
go\
\
grant select on sys.conversation_priorities to [public]\
go\
\
create view sys.credentials as\
-- missing source code\
go\
\
create view sys.crypt_properties as\
-- missing source code\
go\
\
grant select on sys.crypt_properties to [public]\
go\
\
create view sys.data_spaces as\
-- missing source code\
go\
\
grant select on sys.data_spaces to [public]\
go\
\
create view sys.database_audit_specification_details as\
-- missing source code\
go\
\
grant select on sys.database_audit_specification_details to [public]\
go\
\
create view sys.database_audit_specifications as\
-- missing source code\
go\
\
grant select on sys.database_audit_specifications to [public]\
go\
\
create view sys.database_automatic_tuning_configurations as\
-- missing source code\
go\
\
grant select on sys.database_automatic_tuning_configurations to [public]\
go\
\
create view sys.database_automatic_tuning_mode as\
-- missing source code\
go\
\
grant select on sys.database_automatic_tuning_mode to [public]\
go\
\
create view sys.database_automatic_tuning_options as\
-- missing source code\
go\
\
grant select on sys.database_automatic_tuning_options to [public]\
go\
\
create view sys.database_connection_stats_ex as\
-- missing source code\
go\
\
create view sys.database_credentials as\
-- missing source code\
go\
\
grant select on sys.database_credentials to [public]\
go\
\
create view sys.database_event_session_actions as\
-- missing source code\
go\
\
grant select on sys.database_event_session_actions to [public]\
go\
\
create view sys.database_event_session_events as\
-- missing source code\
go\
\
grant select on sys.database_event_session_events to [public]\
go\
\
create view sys.database_event_session_fields as\
-- missing source code\
go\
\
grant select on sys.database_event_session_fields to [public]\
go\
\
create view sys.database_event_session_targets as\
-- missing source code\
go\
\
grant select on sys.database_event_session_targets to [public]\
go\
\
create view sys.database_event_sessions as\
-- missing source code\
go\
\
grant select on sys.database_event_sessions to [public]\
go\
\
create view sys.database_files as\
-- missing source code\
go\
\
grant select on sys.database_files to [public]\
go\
\
create view sys.database_firewall_rules as\
-- missing source code\
go\
\
grant select on sys.database_firewall_rules to [public]\
go\
\
create view sys.database_ledger_blocks as\
-- missing source code\
go\
\
grant select on sys.database_ledger_blocks to [public]\
go\
\
create view sys.database_ledger_digest_locations as\
-- missing source code\
go\
\
grant select on sys.database_ledger_digest_locations to [public]\
go\
\
create view sys.database_ledger_transactions as\
-- missing source code\
go\
\
grant select on sys.database_ledger_transactions to [public]\
go\
\
create view sys.database_permissions as\
-- missing source code\
go\
\
grant select on sys.database_permissions to [public]\
go\
\
create view sys.database_principals as\
-- missing source code\
go\
\
grant select on sys.database_principals to [public]\
go\
\
create view sys.database_query_store_internal_state as\
-- missing source code\
go\
\
create view sys.database_query_store_options as\
-- missing source code\
go\
\
create view sys.database_resource_governor_workload_groups as\
-- missing source code\
go\
\
grant select on sys.database_resource_governor_workload_groups to [public]\
go\
\
create view sys.database_role_members as\
-- missing source code\
go\
\
grant select on sys.database_role_members to [public]\
go\
\
create view sys.database_scoped_configurations as\
-- missing source code\
go\
\
grant select on sys.database_scoped_configurations to [public]\
go\
\
create view sys.database_scoped_credentials as\
-- missing source code\
go\
\
grant select on sys.database_scoped_credentials to [public]\
go\
\
create view sys.database_service_objectives as\
-- missing source code\
go\
\
create view sys.databases as\
-- missing source code\
go\
\
create view sys.default_constraints as\
-- missing source code\
go\
\
grant select on sys.default_constraints to [public]\
go\
\
create view sys.destination_data_spaces as\
-- missing source code\
go\
\
grant select on sys.destination_data_spaces to [public]\
go\
\
create view sys.devops_database_access as\
-- missing source code\
go\
\
create view sys.devops_database_principals as\
-- missing source code\
go\
\
grant select on sys.devops_database_principals to [public]\
go\
\
create view sys.devops_principals as\
-- missing source code\
go\
\
grant select on sys.devops_principals to [public]\
go\
\
create view sys.dm_audit_actions as\
-- missing source code\
go\
\
create view sys.dm_audit_class_type_map as\
-- missing source code\
go\
\
create view sys.dm_broker_activated_tasks as\
-- missing source code\
go\
\
create view sys.dm_broker_forwarded_messages as\
-- missing source code\
go\
\
create view sys.dm_broker_queue_monitors as\
-- missing source code\
go\
\
create view sys.dm_cdc_errors as\
-- missing source code\
go\
\
create view sys.dm_cdc_log_scan_sessions as\
-- missing source code\
go\
\
create view sys.dm_change_feed_errors as\
-- missing source code\
go\
\
create view sys.dm_change_feed_log_scan_sessions as\
-- missing source code\
go\
\
create view sys.dm_cloud_database_epoch as\
-- missing source code\
go\
\
create view sys.dm_clr_appdomains as\
-- missing source code\
go\
\
create view sys.dm_clr_loaded_assemblies as\
-- missing source code\
go\
\
create view sys.dm_clr_properties as\
-- missing source code\
go\
\
create view sys.dm_clr_tasks as\
-- missing source code\
go\
\
create view sys.dm_cluster_endpoints as\
-- missing source code\
go\
\
create view sys.dm_column_encryption_enclave as\
-- missing source code\
go\
\
create view sys.dm_column_encryption_enclave_properties as\
-- missing source code\
go\
\
create view sys.dm_column_store_object_pool as\
-- missing source code\
go\
\
create view sys.dm_continuous_copy_status as\
-- missing source code\
go\
\
create view sys.dm_database_backup_lineage as\
-- missing source code\
go\
\
create view sys.dm_database_backups as\
-- missing source code\
go\
\
create view sys.dm_database_encryption_keys as\
-- missing source code\
go\
\
create view sys.dm_database_engine_configurations as\
-- missing source code\
go\
\
create view sys.dm_database_external_governance_sync_state as\
-- missing source code\
go\
\
create view sys.dm_database_external_policy_actions as\
-- missing source code\
go\
\
create view sys.dm_database_external_policy_principal_assigned_actions as\
-- missing source code\
go\
\
create view sys.dm_database_external_policy_principals as\
-- missing source code\
go\
\
create view sys.dm_database_external_policy_role_actions as\
-- missing source code\
go\
\
create view sys.dm_database_external_policy_role_members as\
-- missing source code\
go\
\
create view sys.dm_database_external_policy_roles as\
-- missing source code\
go\
\
create view sys.dm_database_managed_identities as\
-- missing source code\
go\
\
create view sys.dm_database_replica_states as\
-- missing source code\
go\
\
create view sys.dm_db_column_store_row_group_operational_stats as\
-- missing source code\
go\
\
create view sys.dm_db_column_store_row_group_physical_stats as\
-- missing source code\
go\
\
grant select on sys.dm_db_column_store_row_group_physical_stats to [public]\
go\
\
create view sys.dm_db_data_pool_nodes as\
-- missing source code\
go\
\
create view sys.dm_db_data_pools as\
-- missing source code\
go\
\
create view sys.dm_db_file_space_usage as\
-- missing source code\
go\
\
create view sys.dm_db_fts_index_physical_stats as\
-- missing source code\
go\
\
create view sys.dm_db_index_usage_stats as\
-- missing source code\
go\
\
create view sys.dm_db_log_space_usage as\
-- missing source code\
go\
\
create view sys.dm_db_logical_index_corruptions as\
-- missing source code\
go\
\
create view sys.dm_db_missing_index_details as\
-- missing source code\
go\
\
create view sys.dm_db_missing_index_group_stats as\
-- missing source code\
go\
\
create view sys.dm_db_missing_index_group_stats_query as\
-- missing source code\
go\
\
create view sys.dm_db_missing_index_groups as\
-- missing source code\
go\
\
create view sys.dm_db_objects_impacted_on_version_change as\
-- missing source code\
go\
\
create view sys.dm_db_partition_stats as\
-- missing source code\
go\
\
create view sys.dm_db_persisted_sku_features as\
-- missing source code\
go\
\
create view sys.dm_db_resource_governor_configuration as\
-- missing source code\
go\
\
grant select on sys.dm_db_resource_governor_configuration to [public]\
go\
\
create view sys.dm_db_resource_stats as\
-- missing source code\
go\
\
create view sys.dm_db_script_level as\
-- missing source code\
go\
\
create view sys.dm_db_session_space_usage as\
-- missing source code\
go\
\
create view sys.dm_db_storage_pool_nodes as\
-- missing source code\
go\
\
create view sys.dm_db_storage_pools as\
-- missing source code\
go\
\
create view sys.dm_db_task_space_usage as\
-- missing source code\
go\
\
create view sys.dm_db_tuning_recommendations as\
-- missing source code\
go\
\
create view sys.dm_db_uncontained_entities as\
-- missing source code\
go\
\
create view sys.dm_db_wait_stats as\
-- missing source code\
go\
\
create view sys.dm_db_workload_group_resource_stats as\
-- missing source code\
go\
\
grant select on sys.dm_db_workload_group_resource_stats to [public]\
go\
\
create view sys.dm_db_xtp_checkpoint_files as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_checkpoint_internals as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_checkpoint_stats as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_gc_cycle_stats as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_hash_index_stats as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_index_stats as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_memory_consumers as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_nonclustered_index_stats as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_object_stats as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_table_memory_stats as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_transactions as\
-- missing source code\
go\
\
create view sys.dm_db_xtp_undeploy_status as\
-- missing source code\
go\
\
create view sys.dm_dist_requests as\
-- missing source code\
go\
\
create view sys.dm_dw_quality_clustering as\
-- missing source code\
go\
\
create view sys.dm_dw_quality_delta as\
-- missing source code\
go\
\
create view sys.dm_dw_quality_index as\
-- missing source code\
go\
\
create view sys.dm_dw_quality_row_group as\
-- missing source code\
go\
\
create view sys.dm_elastic_pool_resource_stats as\
-- missing source code\
go\
\
create view sys.dm_exec_background_job_queue as\
-- missing source code\
go\
\
create view sys.dm_exec_background_job_queue_stats as\
-- missing source code\
go\
\
create view sys.dm_exec_cached_plans as\
-- missing source code\
go\
\
create view sys.dm_exec_ce_feedback_cache as\
-- missing source code\
go\
\
create view sys.dm_exec_compute_node_errors as\
-- missing source code\
go\
\
create view sys.dm_exec_compute_node_status as\
-- missing source code\
go\
\
create view sys.dm_exec_compute_nodes as\
-- missing source code\
go\
\
create view sys.dm_exec_compute_pools as\
-- missing source code\
go\
\
create view sys.dm_exec_connections as\
-- missing source code\
go\
\
create view sys.dm_exec_distributed_request_steps as\
-- missing source code\
go\
\
create view sys.dm_exec_distributed_requests as\
-- missing source code\
go\
\
create view sys.dm_exec_distributed_sql_requests as\
-- missing source code\
go\
\
create view sys.dm_exec_distributed_tasks as\
-- missing source code\
go\
\
create view sys.dm_exec_dms_services as\
-- missing source code\
go\
\
create view sys.dm_exec_dms_workers as\
-- missing source code\
go\
\
create view sys.dm_exec_external_operations as\
-- missing source code\
go\
\
create view sys.dm_exec_external_work as\
-- missing source code\
go\
\
create view sys.dm_exec_function_stats as\
-- missing source code\
go\
\
create view sys.dm_exec_procedure_stats as\
-- missing source code\
go\
\
create view sys.dm_exec_query_memory_grants as\
-- missing source code\
go\
\
create view sys.dm_exec_query_optimizer_info as\
-- missing source code\
go\
\
create view sys.dm_exec_query_optimizer_memory_gateways as\
-- missing source code\
go\
\
create view sys.dm_exec_query_profiles as\
-- missing source code\
go\
\
create view sys.dm_exec_query_resource_semaphores as\
-- missing source code\
go\
\
create view sys.dm_exec_query_stats as\
-- missing source code\
go\
\
create view sys.dm_exec_query_transformation_stats as\
-- missing source code\
go\
\
create view sys.dm_exec_requests as\
-- missing source code\
go\
\
create view sys.dm_exec_requests_history as\
-- missing source code\
go\
\
create view sys.dm_exec_session_wait_stats as\
-- missing source code\
go\
\
create view sys.dm_exec_sessions as\
-- missing source code\
go\
\
create view sys.dm_exec_trigger_stats as\
-- missing source code\
go\
\
create view sys.dm_exec_valid_use_hints as\
-- missing source code\
go\
\
create view sys.dm_external_data_processed as\
-- missing source code\
go\
\
create view sys.dm_external_governance_sync_state as\
-- missing source code\
go\
\
create view sys.dm_external_governance_synchronizing_objects as\
-- missing source code\
go\
\
create view sys.dm_external_policy_cache as\
-- missing source code\
go\
\
create view sys.dm_external_policy_excluded_role_members as\
-- missing source code\
go\
\
create view sys.dm_external_script_execution_stats as\
-- missing source code\
go\
\
create view sys.dm_external_script_requests as\
-- missing source code\
go\
\
create view sys.dm_external_script_resource_usage_stats as\
-- missing source code\
go\
\
create view sys.dm_fts_active_catalogs as\
-- missing source code\
go\
\
create view sys.dm_fts_fdhosts as\
-- missing source code\
go\
\
create view sys.dm_fts_index_population as\
-- missing source code\
go\
\
create view sys.dm_fts_memory_buffers as\
-- missing source code\
go\
\
create view sys.dm_fts_memory_pools as\
-- missing source code\
go\
\
create view sys.dm_fts_outstanding_batches as\
-- missing source code\
go\
\
create view sys.dm_fts_population_ranges as\
-- missing source code\
go\
\
create view sys.dm_fts_semantic_similarity_population as\
-- missing source code\
go\
\
create view sys.dm_geo_replication_link_status as\
-- missing source code\
go\
\
create view sys.dm_hpc_device_stats as\
-- missing source code\
go\
\
create view sys.dm_hpc_thread_proxy_stats as\
-- missing source code\
go\
\
create view sys.dm_io_network_traffic_stats as\
-- missing source code\
go\
\
create view sys.dm_io_pending_io_requests as\
-- missing source code\
go\
\
create view sys.dm_operation_status as\
-- missing source code\
go\
\
create view sys.dm_os_buffer_descriptors as\
-- missing source code\
go\
\
create view sys.dm_os_dispatcher_pools as\
-- missing source code\
go\
\
create view sys.dm_os_dispatchers as\
-- missing source code\
go\
\
create view sys.dm_os_hosts as\
-- missing source code\
go\
\
create view sys.dm_os_job_object as\
-- missing source code\
go\
\
create view sys.dm_os_latch_stats as\
-- missing source code\
go\
\
create view sys.dm_os_memory_allocations as\
-- missing source code\
go\
\
create view sys.dm_os_memory_allocations_filtered as\
-- missing source code\
go\
\
create view sys.dm_os_memory_broker_clerks as\
-- missing source code\
go\
\
create view sys.dm_os_memory_brokers as\
-- missing source code\
go\
\
create view sys.dm_os_memory_cache_clock_hands as\
-- missing source code\
go\
\
create view sys.dm_os_memory_cache_counters as\
-- missing source code\
go\
\
create view sys.dm_os_memory_cache_entries as\
-- missing source code\
go\
\
create view sys.dm_os_memory_cache_hash_tables as\
-- missing source code\
go\
\
create view sys.dm_os_memory_clerks as\
-- missing source code\
go\
\
create view sys.dm_os_memory_health_history as\
-- missing source code\
go\
\
create view sys.dm_os_memory_node_access_stats as\
-- missing source code\
go\
\
create view sys.dm_os_memory_nodes as\
-- missing source code\
go\
\
create view sys.dm_os_memory_objects as\
-- missing source code\
go\
\
create view sys.dm_os_memory_pools as\
-- missing source code\
go\
\
create view sys.dm_os_nodes as\
-- missing source code\
go\
\
create view sys.dm_os_out_of_memory_events as\
-- missing source code\
go\
\
create view sys.dm_os_parent_block_descriptors as\
-- missing source code\
go\
\
create view sys.dm_os_performance_counters as\
-- missing source code\
go\
\
create view sys.dm_os_ring_buffers as\
-- missing source code\
go\
\
create view sys.dm_os_schedulers as\
-- missing source code\
go\
\
create view sys.dm_os_spinlock_stats as\
-- missing source code\
go\
\
create view sys.dm_os_stacks as\
-- missing source code\
go\
\
create view sys.dm_os_sublatches as\
-- missing source code\
go\
\
create view sys.dm_os_sys_info as\
-- missing source code\
go\
\
create view sys.dm_os_tasks as\
-- missing source code\
go\
\
create view sys.dm_os_threads as\
-- missing source code\
go\
\
create view sys.dm_os_wait_stats as\
-- missing source code\
go\
\
create view sys.dm_os_waiting_tasks as\
-- missing source code\
go\
\
create view sys.dm_os_worker_local_storage as\
-- missing source code\
go\
\
create view sys.dm_os_workers as\
-- missing source code\
go\
\
create view sys.dm_pal_ring_buffers as\
-- missing source code\
go\
\
create view sys.dm_qn_subscriptions as\
-- missing source code\
go\
\
create view sys.dm_request_phases as\
-- missing source code\
go\
\
create view sys.dm_resource_governor_resource_pools as\
-- missing source code\
go\
\
create view sys.dm_resource_governor_resource_pools_history_ex as\
-- missing source code\
go\
\
create view sys.dm_resource_governor_workload_groups as\
-- missing source code\
go\
\
create view sys.dm_resource_governor_workload_groups_history_ex as\
-- missing source code\
go\
\
create view sys.dm_server_external_policy_actions as\
-- missing source code\
go\
\
create view sys.dm_server_external_policy_principal_assigned_actions as\
-- missing source code\
go\
\
create view sys.dm_server_external_policy_principals as\
-- missing source code\
go\
\
create view sys.dm_server_external_policy_role_actions as\
-- missing source code\
go\
\
create view sys.dm_server_external_policy_role_members as\
-- missing source code\
go\
\
create view sys.dm_server_external_policy_roles as\
-- missing source code\
go\
\
create view sys.dm_server_managed_identities as\
-- missing source code\
go\
\
create view sys.dm_tran_aborted_transactions as\
-- missing source code\
go\
\
create view sys.dm_tran_active_snapshot_database_transactions as\
-- missing source code\
go\
\
create view sys.dm_tran_active_transactions as\
-- missing source code\
go\
\
create view sys.dm_tran_commit_table as\
-- missing source code\
go\
\
create view sys.dm_tran_current_snapshot as\
-- missing source code\
go\
\
create view sys.dm_tran_current_transaction as\
-- missing source code\
go\
\
create view sys.dm_tran_database_transactions as\
-- missing source code\
go\
\
create view sys.dm_tran_distributed_transaction_stats as\
-- missing source code\
go\
\
create view sys.dm_tran_global_recovery_transactions as\
-- missing source code\
go\
\
create view sys.dm_tran_global_transactions as\
-- missing source code\
go\
\
create view sys.dm_tran_global_transactions_enlistments as\
-- missing source code\
go\
\
create view sys.dm_tran_global_transactions_log as\
-- missing source code\
go\
\
create view sys.dm_tran_locks as\
-- missing source code\
go\
\
create view sys.dm_tran_orphaned_distributed_transactions as\
-- missing source code\
go\
\
create view sys.dm_tran_persistent_version_store_stats as\
-- missing source code\
go\
\
create view sys.dm_tran_session_transactions as\
-- missing source code\
go\
\
create view sys.dm_tran_top_version_generators as\
-- missing source code\
go\
\
create view sys.dm_tran_transactions_snapshot as\
-- missing source code\
go\
\
create view sys.dm_tran_version_store as\
-- missing source code\
go\
\
create view sys.dm_tran_version_store_space_usage as\
-- missing source code\
go\
\
create view sys.dm_user_db_resource_governance as\
-- missing source code\
go\
\
create view sys.dm_xe_database_session_event_actions as\
-- missing source code\
go\
\
create view sys.dm_xe_database_session_events as\
-- missing source code\
go\
\
create view sys.dm_xe_database_session_object_columns as\
-- missing source code\
go\
\
create view sys.dm_xe_database_session_targets as\
-- missing source code\
go\
\
create view sys.dm_xe_database_sessions as\
-- missing source code\
go\
\
create view sys.dm_xe_map_values as\
-- missing source code\
go\
\
create view sys.dm_xe_object_columns as\
-- missing source code\
go\
\
create view sys.dm_xe_objects as\
-- missing source code\
go\
\
create view sys.dm_xe_packages as\
-- missing source code\
go\
\
create view sys.dm_xtp_gc_queue_stats as\
-- missing source code\
go\
\
create view sys.dm_xtp_gc_stats as\
-- missing source code\
go\
\
create view sys.dm_xtp_system_memory_consumers as\
-- missing source code\
go\
\
create view sys.dm_xtp_threads as\
-- missing source code\
go\
\
create view sys.dm_xtp_transaction_recent_rows as\
-- missing source code\
go\
\
create view sys.dm_xtp_transaction_stats as\
-- missing source code\
go\
\
create view sys.edge_constraint_clauses as\
-- missing source code\
go\
\
grant select on sys.edge_constraint_clauses to [public]\
go\
\
create view sys.edge_constraints as\
-- missing source code\
go\
\
grant select on sys.edge_constraints to [public]\
go\
\
create view sys.elastic_pool_resource_stats_ex as\
-- missing source code\
go\
\
create view sys.event_log_ex as\
-- missing source code\
go\
\
create view sys.event_notification_event_types as\
-- missing source code\
go\
\
create view sys.event_notifications as\
-- missing source code\
go\
\
grant select on sys.event_notifications to [public]\
go\
\
create view sys.events as\
-- missing source code\
go\
\
grant select on sys.events to [public]\
go\
\
create view sys.extended_procedures as\
-- missing source code\
go\
\
grant select on sys.extended_procedures to [public]\
go\
\
create view sys.extended_properties as\
-- missing source code\
go\
\
grant select on sys.extended_properties to [public]\
go\
\
create view sys.external_data_sources as\
-- missing source code\
go\
\
grant select on sys.external_data_sources to [public]\
go\
\
create view sys.external_file_formats as\
-- missing source code\
go\
\
grant select on sys.external_file_formats to [public]\
go\
\
create view sys.external_governance_classification_attributes as\
-- missing source code\
go\
\
grant select on sys.external_governance_classification_attributes to [public]\
go\
\
create view sys.external_governance_classifications as\
-- missing source code\
go\
\
grant select on sys.external_governance_classifications to [public]\
go\
\
create view sys.external_governance_classifications_mapping as\
-- missing source code\
go\
\
grant select on sys.external_governance_classifications_mapping to [public]\
go\
\
create view sys.external_governance_sensitivity_classifications as\
-- missing source code\
go\
\
grant select on sys.external_governance_sensitivity_classifications to [public]\
go\
\
create view sys.external_governance_sensitivity_labels as\
-- missing source code\
go\
\
grant select on sys.external_governance_sensitivity_labels to [public]\
go\
\
create view sys.external_governance_sensitivity_labels_mapping as\
-- missing source code\
go\
\
grant select on sys.external_governance_sensitivity_labels_mapping to [public]\
go\
\
create view sys.external_job_streams as\
-- missing source code\
go\
\
grant select on sys.external_job_streams to [public]\
go\
\
create view sys.external_libraries as\
-- missing source code\
go\
\
grant select on sys.external_libraries to [public]\
go\
\
create view sys.external_library_files as\
-- missing source code\
go\
\
grant select on sys.external_library_files to [public]\
go\
\
create view sys.external_library_setup_errors as\
-- missing source code\
go\
\
grant select on sys.external_library_setup_errors to [public]\
go\
\
create view sys.external_stream_columns as\
-- missing source code\
go\
\
grant select on sys.external_stream_columns to [public]\
go\
\
create view sys.external_streaming_jobs as\
-- missing source code\
go\
\
grant select on sys.external_streaming_jobs to [public]\
go\
\
create view sys.external_streams as\
-- missing source code\
go\
\
grant select on sys.external_streams to [public]\
go\
\
create view sys.external_table_partitioning_columns as\
-- missing source code\
go\
\
grant select on sys.external_table_partitioning_columns to [public]\
go\
\
create view sys.external_table_schema_changed_mdsync as\
-- missing source code\
go\
\
grant select on sys.external_table_schema_changed_mdsync to [public]\
go\
\
create view sys.external_tables as\
-- missing source code\
go\
\
grant select on sys.external_tables to [public]\
go\
\
create view sys.federated_table_columns as\
-- missing source code\
go\
\
grant select on sys.federated_table_columns to [public]\
go\
\
create view sys.federation_distributions as\
-- missing source code\
go\
\
grant select on sys.federation_distributions to [public]\
go\
\
create view sys.federation_member_distributions as\
-- missing source code\
go\
\
grant select on sys.federation_member_distributions to [public]\
go\
\
create view sys.federation_members as\
-- missing source code\
go\
\
grant select on sys.federation_members to [public]\
go\
\
create view sys.federations as\
-- missing source code\
go\
\
grant select on sys.federations to [public]\
go\
\
create view sys.filegroups as\
-- missing source code\
go\
\
grant select on sys.filegroups to [public]\
go\
\
create view sys.filetable_system_defined_objects as\
-- missing source code\
go\
\
grant select on sys.filetable_system_defined_objects to [public]\
go\
\
create view sys.filetables as\
-- missing source code\
go\
\
grant select on sys.filetables to [public]\
go\
\
create view sys.foreign_key_columns as\
-- missing source code\
go\
\
grant select on sys.foreign_key_columns to [public]\
go\
\
create view sys.foreign_keys as\
-- missing source code\
go\
\
grant select on sys.foreign_keys to [public]\
go\
\
create view sys.fulltext_catalogs as\
-- missing source code\
go\
\
grant select on sys.fulltext_catalogs to [public]\
go\
\
create view sys.fulltext_document_types as\
-- missing source code\
go\
\
create view sys.fulltext_index_catalog_usages as\
-- missing source code\
go\
\
grant select on sys.fulltext_index_catalog_usages to [public]\
go\
\
create view sys.fulltext_index_columns as\
-- missing source code\
go\
\
grant select on sys.fulltext_index_columns to [public]\
go\
\
create view sys.fulltext_index_fragments as\
-- missing source code\
go\
\
grant select on sys.fulltext_index_fragments to [public]\
go\
\
create view sys.fulltext_indexes as\
-- missing source code\
go\
\
grant select on sys.fulltext_indexes to [public]\
go\
\
create view sys.fulltext_languages as\
-- missing source code\
go\
\
create view sys.fulltext_semantic_language_statistics_database as\
-- missing source code\
go\
\
create view sys.fulltext_semantic_languages as\
-- missing source code\
go\
\
create view sys.fulltext_stoplists as\
-- missing source code\
go\
\
grant select on sys.fulltext_stoplists to [public]\
go\
\
create view sys.fulltext_stopwords as\
-- missing source code\
go\
\
grant select on sys.fulltext_stopwords to [public]\
go\
\
create view sys.fulltext_system_stopwords as\
-- missing source code\
go\
\
create view sys.function_order_columns as\
-- missing source code\
go\
\
grant select on sys.function_order_columns to [public]\
go\
\
create view sys.hash_indexes as\
-- missing source code\
go\
\
grant select on sys.hash_indexes to [public]\
go\
\
create view sys.identity_columns as\
-- missing source code\
go\
\
grant select on sys.identity_columns to [public]\
go\
\
create view sys.index_columns as\
-- missing source code\
go\
\
grant select on sys.index_columns to [public]\
go\
\
create view sys.index_resumable_operations as\
-- missing source code\
go\
\
grant select on sys.index_resumable_operations to [public]\
go\
\
create view sys.indexes as\
-- missing source code\
go\
\
grant select on sys.indexes to [public]\
go\
\
create view sys.internal_partitions as\
-- missing source code\
go\
\
grant select on sys.internal_partitions to [public]\
go\
\
create view sys.internal_tables as\
-- missing source code\
go\
\
grant select on sys.internal_tables to [public]\
go\
\
create view sys.ipv6_database_firewall_rules as\
-- missing source code\
go\
\
create view sys.ipv6_firewall_rules as\
-- missing source code\
go\
\
create view sys.key_constraints as\
-- missing source code\
go\
\
grant select on sys.key_constraints to [public]\
go\
\
create view sys.key_encryptions as\
-- missing source code\
go\
\
grant select on sys.key_encryptions to [public]\
go\
\
create view sys.ledger_column_history as\
-- missing source code\
go\
\
grant select on sys.ledger_column_history to [public]\
go\
\
create view sys.ledger_table_history as\
-- missing source code\
go\
\
grant select on sys.ledger_table_history to [public]\
go\
\
create view sys.login_token as\
-- missing source code\
go\
\
create view sys.masked_columns as\
-- missing source code\
go\
\
grant select on sys.masked_columns to [public]\
go\
\
create view sys.memory_optimized_tables_internal_attributes as\
-- missing source code\
go\
\
grant select on sys.memory_optimized_tables_internal_attributes to [public]\
go\
\
create view sys.message_type_xml_schema_collection_usages as\
-- missing source code\
go\
\
grant select on sys.message_type_xml_schema_collection_usages to [public]\
go\
\
create view sys.messages as\
-- missing source code\
go\
\
create view sys.module_assembly_usages as\
-- missing source code\
go\
\
grant select on sys.module_assembly_usages to [public]\
go\
\
create view sys.numbered_procedure_parameters as\
-- missing source code\
go\
\
grant select on sys.numbered_procedure_parameters to [public]\
go\
\
create view sys.numbered_procedures as\
-- missing source code\
go\
\
grant select on sys.numbered_procedures to [public]\
go\
\
create view sys.objects as\
-- missing source code\
go\
\
grant select on sys.objects to [public]\
go\
\
create view sys.openkeys as\
-- missing source code\
go\
\
create view sys.parameter_type_usages as\
-- missing source code\
go\
\
grant select on sys.parameter_type_usages to [public]\
go\
\
create view sys.parameter_xml_schema_collection_usages as\
-- missing source code\
go\
\
grant select on sys.parameter_xml_schema_collection_usages to [public]\
go\
\
create view sys.parameters as\
-- missing source code\
go\
\
grant select on sys.parameters to [public]\
go\
\
create view sys.partition_functions as\
-- missing source code\
go\
\
grant select on sys.partition_functions to [public]\
go\
\
create view sys.partition_parameters as\
-- missing source code\
go\
\
grant select on sys.partition_parameters to [public]\
go\
\
create view sys.partition_range_values as\
-- missing source code\
go\
\
grant select on sys.partition_range_values to [public]\
go\
\
create view sys.partition_schemes as\
-- missing source code\
go\
\
grant select on sys.partition_schemes to [public]\
go\
\
create view sys.partitions as\
-- missing source code\
go\
\
grant select on sys.partitions to [public]\
go\
\
create view sys.periods as\
-- missing source code\
go\
\
grant select on sys.periods to [public]\
go\
\
create view sys.plan_guides as\
-- missing source code\
go\
\
grant select on sys.plan_guides to [public]\
go\
\
create view sys.procedures as\
-- missing source code\
go\
\
grant select on sys.procedures to [public]\
go\
\
create view sys.query_context_settings as\
-- missing source code\
go\
\
grant select on sys.query_context_settings to [public]\
go\
\
create view sys.query_store_plan as\
-- missing source code\
go\
\
grant select on sys.query_store_plan to [public]\
go\
\
create view sys.query_store_plan_feedback as\
-- missing source code\
go\
\
grant select on sys.query_store_plan_feedback to [public]\
go\
\
create view sys.query_store_plan_forcing_locations as\
-- missing source code\
go\
\
grant select on sys.query_store_plan_forcing_locations to [public]\
go\
\
create view sys.query_store_query as\
-- missing source code\
go\
\
grant select on sys.query_store_query to [public]\
go\
\
create view sys.query_store_query_hints as\
-- missing source code\
go\
\
grant select on sys.query_store_query_hints to [public]\
go\
\
create view sys.query_store_query_text as\
-- missing source code\
go\
\
grant select on sys.query_store_query_text to [public]\
go\
\
create view sys.query_store_query_variant as\
-- missing source code\
go\
\
grant select on sys.query_store_query_variant to [public]\
go\
\
create view sys.query_store_replicas as\
-- missing source code\
go\
\
grant select on sys.query_store_replicas to [public]\
go\
\
create view sys.query_store_runtime_stats as\
-- missing source code\
go\
\
grant select on sys.query_store_runtime_stats to [public]\
go\
\
create view sys.query_store_runtime_stats_interval as\
-- missing source code\
go\
\
grant select on sys.query_store_runtime_stats_interval to [public]\
go\
\
create view sys.query_store_wait_stats as\
-- missing source code\
go\
\
grant select on sys.query_store_wait_stats to [public]\
go\
\
create view sys.registered_search_properties as\
-- missing source code\
go\
\
grant select on sys.registered_search_properties to [public]\
go\
\
create view sys.registered_search_property_lists as\
-- missing source code\
go\
\
grant select on sys.registered_search_property_lists to [public]\
go\
\
create view sys.remote_data_archive_databases as\
-- missing source code\
go\
\
grant select on sys.remote_data_archive_databases to [public]\
go\
\
create view sys.remote_data_archive_tables as\
-- missing source code\
go\
\
grant select on sys.remote_data_archive_tables to [public]\
go\
\
create view sys.remote_logins as\
-- missing source code\
go\
\
create view sys.remote_service_bindings as\
-- missing source code\
go\
\
grant select on sys.remote_service_bindings to [public]\
go\
\
create view sys.resource_governor_configuration as\
-- missing source code\
go\
\
create view sys.resource_governor_external_resource_pool_affinity as\
-- missing source code\
go\
\
create view sys.resource_governor_external_resource_pools as\
-- missing source code\
go\
\
create view sys.resource_governor_resource_pool_affinity as\
-- missing source code\
go\
\
create view sys.resource_governor_resource_pools as\
-- missing source code\
go\
\
create view sys.resource_governor_workload_groups as\
-- missing source code\
go\
\
create view sys.resource_stats_raw as\
-- missing source code\
go\
\
create view sys.resource_usage as\
-- missing source code\
go\
\
create view sys.routes as\
-- missing source code\
go\
\
grant select on sys.routes to [public]\
go\
\
create view sys.schemas as\
-- missing source code\
go\
\
grant select on sys.schemas to [public]\
go\
\
create view sys.securable_classes as\
-- missing source code\
go\
\
create view sys.security_policies as\
-- missing source code\
go\
\
grant select on sys.security_policies to [public]\
go\
\
create view sys.security_predicates as\
-- missing source code\
go\
\
grant select on sys.security_predicates to [public]\
go\
\
create view sys.selective_xml_index_namespaces as\
-- missing source code\
go\
\
grant select on sys.selective_xml_index_namespaces to [public]\
go\
\
create view sys.selective_xml_index_paths as\
-- missing source code\
go\
\
grant select on sys.selective_xml_index_paths to [public]\
go\
\
create view sys.sensitivity_classifications as\
-- missing source code\
go\
\
grant select on sys.sensitivity_classifications to [public]\
go\
\
create view sys.sequences as\
-- missing source code\
go\
\
grant select on sys.sequences to [public]\
go\
\
create view sys.server_memory_optimized_hybrid_buffer_pool_configuration as\
-- missing source code\
go\
\
create view sys.server_principals as\
-- missing source code\
go\
\
create view sys.server_role_members as\
-- missing source code\
go\
\
create view sys.service_contract_message_usages as\
-- missing source code\
go\
\
grant select on sys.service_contract_message_usages to [public]\
go\
\
create view sys.service_contract_usages as\
-- missing source code\
go\
\
grant select on sys.service_contract_usages to [public]\
go\
\
create view sys.service_contracts as\
-- missing source code\
go\
\
grant select on sys.service_contracts to [public]\
go\
\
create view sys.service_message_types as\
-- missing source code\
go\
\
grant select on sys.service_message_types to [public]\
go\
\
create view sys.service_queue_usages as\
-- missing source code\
go\
\
grant select on sys.service_queue_usages to [public]\
go\
\
create view sys.service_queues as\
-- missing source code\
go\
\
grant select on sys.service_queues to [public]\
go\
\
create view sys.services as\
-- missing source code\
go\
\
grant select on sys.services to [public]\
go\
\
create view sys.spatial_index_tessellations as\
-- missing source code\
go\
\
grant select on sys.spatial_index_tessellations to [public]\
go\
\
create view sys.spatial_indexes as\
-- missing source code\
go\
\
grant select on sys.spatial_indexes to [public]\
go\
\
create view sys.spatial_reference_systems as\
-- missing source code\
go\
\
create view sys.sql_dependencies as\
-- missing source code\
go\
\
grant select on sys.sql_dependencies to [public]\
go\
\
create view sys.sql_expression_dependencies as\
-- missing source code\
go\
\
create view sys.sql_modules as\
-- missing source code\
go\
\
grant select on sys.sql_modules to [public]\
go\
\
create view sys.sql_pools as\
-- missing source code\
go\
\
create view sys.stats as\
-- missing source code\
go\
\
grant select on sys.stats to [public]\
go\
\
create view sys.stats_columns as\
-- missing source code\
go\
\
grant select on sys.stats_columns to [public]\
go\
\
create view sys.symmetric_keys as\
-- missing source code\
go\
\
grant select on sys.symmetric_keys to [public]\
go\
\
create view sys.synonyms as\
-- missing source code\
go\
\
grant select on sys.synonyms to [public]\
go\
\
create view sys.syscacheobjects as\
-- missing source code\
go\
\
create view sys.syscharsets as\
-- missing source code\
go\
\
create view sys.syscolumns as\
-- missing source code\
go\
\
grant select on sys.syscolumns to [public]\
go\
\
create view sys.syscomments as\
-- missing source code\
go\
\
grant select on sys.syscomments to [public]\
go\
\
create view sys.sysconfigures as\
-- missing source code\
go\
\
create view sys.sysconstraints as\
-- missing source code\
go\
\
grant select on sys.sysconstraints to [public]\
go\
\
create view sys.syscscontainers as\
-- missing source code\
go\
\
create view sys.syscurconfigs as\
-- missing source code\
go\
\
create view sys.syscursorcolumns as\
-- missing source code\
go\
\
create view sys.syscursorrefs as\
-- missing source code\
go\
\
create view sys.syscursors as\
-- missing source code\
go\
\
create view sys.syscursortables as\
-- missing source code\
go\
\
create view sys.sysdatabases as\
-- missing source code\
go\
\
create view sys.sysdepends as\
-- missing source code\
go\
\
grant select on sys.sysdepends to [public]\
go\
\
create view sys.sysdevices as\
-- missing source code\
go\
\
create view sys.sysfilegroups as\
-- missing source code\
go\
\
grant select on sys.sysfilegroups to [public]\
go\
\
create view sys.sysfiles as\
-- missing source code\
go\
\
grant select on sys.sysfiles to [public]\
go\
\
create view sys.sysforeignkeys as\
-- missing source code\
go\
\
grant select on sys.sysforeignkeys to [public]\
go\
\
create view sys.sysfulltextcatalogs as\
-- missing source code\
go\
\
grant select on sys.sysfulltextcatalogs to [public]\
go\
\
create view sys.sysindexes as\
-- missing source code\
go\
\
grant select on sys.sysindexes to [public]\
go\
\
create view sys.sysindexkeys as\
-- missing source code\
go\
\
grant select on sys.sysindexkeys to [public]\
go\
\
create view sys.syslanguages as\
-- missing source code\
go\
\
create view sys.syslockinfo as\
-- missing source code\
go\
\
create view sys.sysmembers as\
-- missing source code\
go\
\
grant select on sys.sysmembers to [public]\
go\
\
create view sys.sysmessages as\
-- missing source code\
go\
\
create view sys.sysobjects as\
-- missing source code\
go\
\
grant select on sys.sysobjects to [public]\
go\
\
create view sys.sysoledbusers as\
-- missing source code\
go\
\
create view sys.sysopentapes as\
-- missing source code\
go\
\
create view sys.sysperfinfo as\
-- missing source code\
go\
\
create view sys.syspermissions as\
-- missing source code\
go\
\
grant select on sys.syspermissions to [public]\
go\
\
create view sys.sysprocesses as\
-- missing source code\
go\
\
create view sys.sysprotects as\
-- missing source code\
go\
\
grant select on sys.sysprotects to [public]\
go\
\
create view sys.sysreferences as\
-- missing source code\
go\
\
grant select on sys.sysreferences to [public]\
go\
\
create view sys.sysservers as\
-- missing source code\
go\
\
create view sys.system_columns as\
-- missing source code\
go\
\
grant select on sys.system_columns to [public]\
go\
\
create view sys.system_objects as\
-- missing source code\
go\
\
grant select on sys.system_objects to [public]\
go\
\
create view sys.system_parameters as\
-- missing source code\
go\
\
grant select on sys.system_parameters to [public]\
go\
\
create view sys.system_sql_modules as\
-- missing source code\
go\
\
grant select on sys.system_sql_modules to [public]\
go\
\
create view sys.system_views as\
-- missing source code\
go\
\
grant select on sys.system_views to [public]\
go\
\
create view sys.systypes as\
-- missing source code\
go\
\
grant select on sys.systypes to [public]\
go\
\
create view sys.sysusers as\
-- missing source code\
go\
\
grant select on sys.sysusers to [public]\
go\
\
create view sys.table_types as\
-- missing source code\
go\
\
grant select on sys.table_types to [public]\
go\
\
create view sys.tables as\
-- missing source code\
go\
\
grant select on sys.tables to [public]\
go\
\
create view sys.time_zone_info as\
-- missing source code\
go\
\
grant select on sys.time_zone_info to [public]\
go\
\
create view sys.transmission_queue as\
-- missing source code\
go\
\
grant select on sys.transmission_queue to [public]\
go\
\
create view sys.trigger_event_types as\
-- missing source code\
go\
\
create view sys.trigger_events as\
-- missing source code\
go\
\
grant select on sys.trigger_events to [public]\
go\
\
create view sys.triggers as\
-- missing source code\
go\
\
grant select on sys.triggers to [public]\
go\
\
create view sys.trusted_assemblies as\
-- missing source code\
go\
\
create view sys.type_assembly_usages as\
-- missing source code\
go\
\
grant select on sys.type_assembly_usages to [public]\
go\
\
create view sys.types as\
-- missing source code\
go\
\
grant select on sys.types to [public]\
go\
\
create view sys.user_token as\
-- missing source code\
go\
\
create view sys.views as\
-- missing source code\
go\
\
grant select on sys.views to [public]\
go\
\
create view sys.xml_indexes as\
-- missing source code\
go\
\
grant select on sys.xml_indexes to [public]\
go\
\
create view sys.xml_schema_attributes as\
-- missing source code\
go\
\
grant select on sys.xml_schema_attributes to [public]\
go\
\
create view sys.xml_schema_collections as\
-- missing source code\
go\
\
grant select on sys.xml_schema_collections to [public]\
go\
\
create view sys.xml_schema_component_placements as\
-- missing source code\
go\
\
grant select on sys.xml_schema_component_placements to [public]\
go\
\
create view sys.xml_schema_components as\
-- missing source code\
go\
\
grant select on sys.xml_schema_components to [public]\
go\
\
create view sys.xml_schema_elements as\
-- missing source code\
go\
\
grant select on sys.xml_schema_elements to [public]\
go\
\
create view sys.xml_schema_facets as\
-- missing source code\
go\
\
grant select on sys.xml_schema_facets to [public]\
go\
\
create view sys.xml_schema_model_groups as\
-- missing source code\
go\
\
grant select on sys.xml_schema_model_groups to [public]\
go\
\
create view sys.xml_schema_namespaces as\
-- missing source code\
go\
\
grant select on sys.xml_schema_namespaces to [public]\
go\
\
create view sys.xml_schema_types as\
-- missing source code\
go\
\
grant select on sys.xml_schema_types to [public]\
go\
\
create view sys.xml_schema_wildcard_namespaces as\
-- missing source code\
go\
\
grant select on sys.xml_schema_wildcard_namespaces to [public]\
go\
\
create view sys.xml_schema_wildcards as\
-- missing source code\
go\
\
grant select on sys.xml_schema_wildcards to [public]\
go\
\
create function sys.dm_db_column_store_redirected_lobs(@DatabaseId smallint, @RowsetId bigint) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_database_page_allocations(@DatabaseId smallint, @TableId int, @IndexId int,\
                                                    @PartitionId bigint, @Mode nvarchar(64)) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_exec_cursors(@spid int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_incremental_stats_properties(@object_id int, @stats_id int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_index_operational_stats(@DatabaseId smallint, @TableId int, @IndexId int,\
                                                  @PartitionNumber int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_index_physical_stats(@DatabaseId smallint, @ObjectId int, @IndexId int, @PartitionNumber int,\
                                               @Mode nvarchar(20)) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_log_info(@DatabaseId int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_log_stats(@DatabaseId int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_missing_index_columns(@handle int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_objects_disabled_on_compatibility_level_change(@compatibility_level int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_page_info(@DatabaseId smallint, @FileId int, @PageId int, @Mode nvarchar(64)) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_stats_histogram(@object_id int, @stats_id int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_stats_properties(@object_id int, @stats_id int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_stats_properties_internal(@object_id int, @stats_id int) returns table as\
-- missing source code\
go\
\
create function sys.dm_db_xtp_hash_index_approx_stats(@maxComputeTime int, @maxRowsToScanPerBucket int) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_cached_plan_dependent_objects(@planhandle varbinary(64)) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_cursors(@spid int) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_describe_first_result_set(@tsql nvarchar(max), @params nvarchar(max),\
                                                      @browse_information_mode tinyint) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_describe_first_result_set_for_object(@object_id int, @browse_information_mode tinyint) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_input_buffer(@session_id smallint, @request_id int) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_plan_attributes(@handle varbinary(64)) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_query_plan(@handle varbinary(64)) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_query_plan_stats(@handle varbinary(64)) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_query_statistics_xml(@session_id smallint) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_sql_text(@handle varbinary(64)) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_text_query_plan(@handle varbinary(64), @stmt_start_offset int, @stmt_end_offset int) returns table as\
-- missing source code\
go\
\
create function sys.dm_exec_xml_handles(@spid int) returns table as\
-- missing source code\
go\
\
create function sys.dm_fts_index_keywords(@dbid int, @objid int) returns table as\
-- missing source code\
go\
\
create function sys.dm_fts_index_keywords_by_document(@dbid int, @objid int) returns table as\
-- missing source code\
go\
\
create function sys.dm_fts_index_keywords_by_property(@dbid int, @objid int) returns table as\
-- missing source code\
go\
\
create function sys.dm_fts_index_keywords_position_by_document(@dbid int, @objid int) returns table as\
-- missing source code\
go\
\
create function sys.dm_fts_parser(@querystring nvarchar(4000), @lcid int, @stoplistid int,\
                                  @accentsensitive bit) returns table as\
-- missing source code\
go\
\
create function sys.dm_hs_database_log_rate(@DatabaseId smallint) returns table as\
-- missing source code\
go\
\
create function sys.dm_hs_database_replicas(@DatabaseId int) returns table as\
-- missing source code\
go\
\
create function sys.dm_io_virtual_file_stats(@DatabaseId int, @FileId int) returns table as\
-- missing source code\
go\
\
create function sys.dm_sql_referenced_entities(@name nvarchar(517), @referencing_class nvarchar(60)) returns table as\
-- missing source code\
go\
\
create function sys.dm_sql_referencing_entities(@name nvarchar(517), @referenced_class nvarchar(60)) returns table as\
-- missing source code\
go\
\
create function sys.fn_GetRowsetIdFromRowDump(@rowdump varbinary(max)) returns bigint as\
-- missing source code\
go\
\
create function sys.fn_MSxe_read_event_stream(@source nvarchar(260), @source_opt int) returns table as\
-- missing source code\
go\
\
create function sys.fn_PageResCracker(@page_resource binary(8)) returns table as\
-- missing source code\
go\
\
create function sys.fn_PhysLocCracker(@physical_locator binary(8)) returns table as\
-- missing source code\
go\
\
create function sys.fn_PhysLocFormatter(@physical_locator binary(8)) returns varchar(128) as\
-- missing source code\
go\
\
create function sys.fn_RowDumpCracker(@rowdump varbinary(max)) returns table as\
-- missing source code\
go\
\
create function sys.fn_builtin_permissions(@level nvarchar(60)) returns table as\
-- missing source code\
go\
\
create function sys.fn_cdc_check_parameters(@capture_instance sysname, @from_lsn binary(10), @to_lsn binary(10),\
                                            @row_filter_option nvarchar(30), @net_changes bit) returns bit as\
-- missing source code\
go\
\
create function sys.fn_cdc_get_column_ordinal(@capture_instance sysname, @column_name sysname) returns int as\
-- missing source code\
go\
\
create function sys.fn_cdc_get_max_lsn() returns binary(10) as\
-- missing source code\
go\
\
create function sys.fn_cdc_get_min_lsn(@capture_instance sysname) returns binary(10) as\
-- missing source code\
go\
\
create function sys.fn_cdc_has_column_changed(@capture_instance sysname, @column_name sysname,\
                                              @update_mask varbinary(128)) returns bit as\
-- missing source code\
go\
\
create function sys.fn_cdc_hexstrtobin(@hexstr nvarchar(40)) returns binary(10) as\
-- missing source code\
go\
\
create function sys.fn_cdc_is_ddl_handling_enabled(@object_id int) returns bit as\
-- missing source code\
go\
\
create function sys.fn_cdc_map_lsn_to_time(@lsn binary(10)) returns datetime as\
-- missing source code\
go\
\
create function sys.fn_cdc_map_time_to_lsn(@relational_operator nvarchar(30), @tracking_time datetime) returns binary(10) as\
-- missing source code\
go\
\
create function sys.fn_column_store_row_groups(@obj_id bigint) returns table as\
-- missing source code\
go\
\
create function sys.fn_db_backup_file_snapshots(@database_name sysname) returns table as\
-- missing source code\
go\
\
create function sys.fn_dblog(@start nvarchar(25), @end nvarchar(25)) returns table as\
-- missing source code\
go\
\
create function sys.fn_dblog_xtp(@start nvarchar(25), @end nvarchar(25)) returns table as\
-- missing source code\
go\
\
create function sys.fn_dbslog(@start nvarchar(25), @end nvarchar(25)) returns table as\
-- missing source code\
go\
\
create function sys.fn_external_policy_actions_assigned_to_principal(@principal nvarchar(256), @entity nvarchar(256),\
                                                                     @class nvarchar(256)) returns table as\
-- missing source code\
go\
\
create function sys.fn_get_audit_file(@file_pattern nvarchar(260), @initial_file_name nvarchar(260),\
                                      @audit_record_offset bigint) returns table as\
-- missing source code\
go\
\
create function sys.fn_get_audit_file_v2(@file_pattern nvarchar(260), @initial_file_name nvarchar(260),\
                                         @audit_record_offset bigint, @start_time_filter nvarchar(260),\
                                         @end_time_filter nvarchar(260)) returns table as\
-- missing source code\
go\
\
create function sys.fn_get_sql(@handle varbinary(64)) returns table as\
-- missing source code\
go\
\
create function sys.fn_hadr_distributed_ag_database_replica(@lag_id uniqueidentifier, @database_id uniqueidentifier) returns table as\
-- missing source code\
go\
\
create function sys.fn_hadr_distributed_ag_replica(@lag_id uniqueidentifier, @replica_id uniqueidentifier) returns table as\
-- missing source code\
go\
\
create function sys.fn_hadr_is_same_replica(@lag_id uniqueidentifier, @lag_replica_id uniqueidentifier,\
                                            @ag_replica_id uniqueidentifier) returns bit as\
-- missing source code\
go\
\
create function sys.fn_has_change_feed_permissions(@destination_type int) returns bit as\
-- missing source code\
go\
\
create function sys.fn_helpcollations() returns table as\
-- missing source code\
go\
\
create function sys.fn_is_metrics_xel_caching_enabled(@featureswitch nvarchar(128)) returns bit as\
-- missing source code\
go\
\
create function sys.fn_listextendedproperty(@name sysname, @level0type varchar(128), @level0name sysname,\
                                            @level1type varchar(128), @level1name sysname, @level2type varchar(128),\
                                            @level2name sysname) returns table as\
-- missing source code\
go\
\
create function sys.fn_my_permissions(@entity sysname, @class nvarchar(60)) returns table as\
-- missing source code\
go\
\
create function sys.fn_repladjustcolumnmap(@objid int, @total_col int, @inmap varbinary(4000)) returns varbinary(4000) as\
-- missing source code\
go\
\
create function sys.fn_replreplacesinglequote(@pstrin nvarchar(max)) returns nvarchar(max) as\
-- missing source code\
go\
\
create function sys.fn_replreplacesinglequoteplusprotectstring(@pstrin nvarchar(4000)) returns nvarchar(4000) as\
-- missing source code\
go\
\
create function sys.fn_repluniquename(@guid uniqueidentifier, @prefix1 sysname, @prefix2 sysname, @prefix3 sysname,\
                                      @prefix4 sysname) returns nvarchar(100) as\
-- missing source code\
go\
\
create function sys.fn_replvarbintoint(@varbin varbinary(32)) returns int as\
-- missing source code\
go\
\
create function sys.fn_sqlvarbasetostr(@ssvar sql_variant) returns nvarchar(max) as\
-- missing source code\
go\
\
create function sys.fn_stmt_sql_handle_from_sql_stmt(@query_sql_text nvarchar(max), @query_param_type tinyint) returns table as\
-- missing source code\
go\
\
create function sys.fn_translate_permissions(@level nvarchar(60), @perms varbinary(16)) returns table as\
-- missing source code\
go\
\
create function sys.fn_validate_plan_guide(@plan_guide_id int) returns table as\
-- missing source code\
go\
\
create function sys.fn_varbintohexstr(@pbinin varbinary(max)) returns nvarchar(max) as\
-- missing source code\
go\
\
create function sys.fn_varbintohexsubstring(@fsetprefix bit, @pbinin varbinary(max), @startoffset int,\
                                            @cbytesin int) returns nvarchar(max) as\
-- missing source code\
go\
\
create function sys.fn_virtualfilestats(@DatabaseId int, @FileId int) returns table as\
-- missing source code\
go\
\
create function sys.fn_xe_file_target_read_file(@path nvarchar(260), @mdpath nvarchar(260),\
                                                @initial_file_name nvarchar(260),\
                                                @initial_offset bigint) returns table as\
-- missing source code\
go\
\
create function sys.fn_xe_telemetry_blob_target_read_file(@prefix nvarchar(260), @mdpath nvarchar(260),\
                                                          @initial_file_name nvarchar(260),\
                                                          @initial_offset bigint) returns table as\
-- missing source code\
go\
\
create procedure sys.sp_MSacquiresnapshotdeliverysessionlock() as\
-- missing source code\
go\
\
create procedure sys.sp_MSaddsubscriptionarticles(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                                  @artid int, @article sysname, @dest_table sysname,\
                                                  @dest_owner sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MScdc_capture_job() as\
-- missing source code\
go\
\
create procedure sys.sp_MScdc_cleanup_job() as\
-- missing source code\
go\
\
create procedure sys.sp_MScdc_db_ddl_event(@EventData xml) as\
-- missing source code\
go\
\
create procedure sys.sp_MScdc_ddl_event(@EventData xml) as\
-- missing source code\
go\
\
create procedure sys.sp_MScdc_logddl(@source_object_id int, @ddl_command nvarchar(max), @ddl_lsn binary(10),\
                                     @ddl_time nvarchar(1000), @commit_lsn binary(10), @source_column_id int,\
                                     @fis_alter_column bit, @fis_drop_table bit, @fis_add_drop_column bit,\
                                     @new_change_table_prefix sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSchange_feed_ddl_event(@EventData xml) as\
-- missing source code\
go\
\
create procedure sys.sp_MScheck_subscription(@publication sysname, @pub_type int, @publisher sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSclearresetpartialsnapshotprogressbit(@agent_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_MScreate_sub_tables(@tran_sub_table bit, @property_table bit, @sqlqueue_table bit,\
                                            @subscription_articles_table bit, @p2p_table bit) as\
-- missing source code\
go\
\
create procedure sys.sp_MScreatedisabledmltrigger(@source_object sysname, @source_owner sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSdefer_check(@objname sysname, @objowner sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSdistributoravailable() as\
-- missing source code\
go\
\
create procedure sys.sp_MSdroparticleconstraints(@destination_object sysname, @destination_owner sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSdropfkreferencingarticle(@destination_object_name sysname, @destination_owner_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSensure_single_instance(@application_name sysname, @agent_type int) as\
-- missing source code\
go\
\
create procedure sys.sp_MSget_attach_state(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                           @subscription_type int) as\
-- missing source code\
go\
\
create procedure sys.sp_MSget_last_transaction(@publisher_id int, @publisher_db sysname, @publisher sysname,\
                                               @max_xact_seqno varbinary(16), @for_truncate bit) as\
-- missing source code\
go\
\
create procedure sys.sp_MSgetlastupdatedtime(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                             @subscription_type int, @publication_type int) as\
-- missing source code\
go\
\
create procedure sys.sp_MSgrantconnectreplication(@user_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MShelp_identity_property(@tablename sysname, @ownername sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSinit_subscription_agent(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                                  @subscription_type int) as\
-- missing source code\
go\
\
create procedure sys.sp_MSissnapshotitemapplied(@snapshot_session_token nvarchar(260),\
                                                @snapshot_progress_token nvarchar(500)) as\
-- missing source code\
go\
\
create procedure sys.sp_MSquery_syncstates(@publisher_id smallint, @publisher_db sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSrecordsnapshotdeliveryprogress(@snapshot_session_token nvarchar(260),\
                                                         @snapshot_progress_token nvarchar(500)) as\
-- missing source code\
go\
\
create procedure sys.sp_MSreenable_check(@objname sysname, @objowner sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSregisterdynsnapseqno(@snapshot_session_token nvarchar(260), @dynsnapseqno uniqueidentifier) as\
-- missing source code\
go\
\
create procedure sys.sp_MSregistersubscription(@replication_type int, @publisher sysname, @publisher_db sysname,\
                                               @publisher_security_mode int, @publisher_login sysname,\
                                               @publisher_password nvarchar(524), @publication sysname,\
                                               @subscriber sysname, @subscriber_db sysname,\
                                               @subscriber_security_mode int, @subscriber_login sysname,\
                                               @subscriber_password nvarchar(524), @distributor sysname,\
                                               @distributor_security_mode int, @distributor_login sysname,\
                                               @distributor_password nvarchar(524), @subscription_id uniqueidentifier,\
                                               @independent_agent int, @subscription_type int,\
                                               @use_interactive_resolver int, @failover_mode int, @use_web_sync bit,\
                                               @hostname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSreinit_failed_subscriptions(@failure_level int) as\
-- missing source code\
go\
\
create procedure sys.sp_MSreleasesnapshotdeliverysessionlock() as\
-- missing source code\
go\
\
create procedure sys.sp_MSrepl_init_backup_lsns() as\
-- missing source code\
go\
\
create procedure sys.sp_MSrepl_raiserror(@agent sysname, @agent_name nvarchar(100), @status int, @message nvarchar(255),\
                                         @subscriber sysname, @publication sysname, @article sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSrepl_setNFR(@schema sysname, @object_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSreplcheck_subscribe() as\
-- missing source code\
go\
\
create procedure sys.sp_MSreplcheck_subscribe_withddladmin() as\
-- missing source code\
go\
\
create procedure sys.sp_MSreplraiserror(@errorid int, @param1 sysname, @param2 sysname, @param3 int) as\
-- missing source code\
go\
\
create procedure sys.sp_MSreplupdateschema(@object_name nvarchar(517)) as\
-- missing source code\
go\
\
create procedure sys.sp_MSreset_attach_state(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                             @subscription_type int) as\
-- missing source code\
go\
\
create procedure sys.sp_MSreset_synctran_bit(@owner sysname, @table sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSresetsnapshotdeliveryprogress(@snapshot_session_token nvarchar(260)) as\
-- missing source code\
go\
\
create procedure sys.sp_MSrestoresavedforeignkeys(@program_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSscript_sync_del_trig(@objid int, @publisher sysname, @publisher_db sysname,\
                                               @publication sysname, @trigname sysname, @procname sysname,\
                                               @proc_owner sysname, @cftproc sysname, @agent_id int,\
                                               @identity_col sysname, @ts_col sysname, @filter_clause nvarchar(4000),\
                                               @primary_key_bitmap varbinary(4000), @pubversion int, @falter bit) as\
-- missing source code\
go\
\
create procedure sys.sp_MSscript_sync_ins_trig(@objid int, @publisher sysname, @publisher_db sysname,\
                                               @publication sysname, @trigname sysname, @procname sysname,\
                                               @proc_owner sysname, @cftproc sysname, @agent_id int,\
                                               @identity_col sysname, @ts_col sysname, @filter_clause nvarchar(4000),\
                                               @primary_key_bitmap varbinary(4000), @pubversion int, @falter bit) as\
-- missing source code\
go\
\
create procedure sys.sp_MSscript_sync_upd_trig(@objid int, @publisher sysname, @publisher_db sysname,\
                                               @publication sysname, @trigname sysname, @procname sysname,\
                                               @proc_owner sysname, @cftproc sysname, @agent_id int,\
                                               @identity_col sysname, @ts_col sysname, @filter_clause nvarchar(4000),\
                                               @primary_key_bitmap varbinary(4000), @pubversion int, @falter bit) as\
-- missing source code\
go\
\
create procedure sys.sp_MSscriptforeignkeyrestore(@program_name sysname, @constraint_name sysname,\
                                                  @parent_schema sysname, @parent_name sysname,\
                                                  @referenced_object_schema sysname, @referenced_object_name sysname,\
                                                  @is_not_for_replication bit, @is_not_trusted bit,\
                                                  @delete_referential_action tinyint,\
                                                  @update_referential_action tinyint) as\
-- missing source code\
go\
\
create procedure sys.sp_MSset_sub_guid(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                       @subscription_type int, @subscription_guid binary(16), @queue_id sysname,\
                                       @queue_server sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSset_subscription_properties(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                                      @subscription_type int, @allow_subscription_copy bit,\
                                                      @queue_id sysname, @update_mode int, @attach_version binary(16),\
                                                      @queue_server sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSsub_set_identity(@objid int, @threshold int, @range bigint, @next_seed bigint) as\
-- missing source code\
go\
\
create procedure sys.sp_MStran_ddlrepl(@EventData xml, @procmapid int) as\
-- missing source code\
go\
\
create procedure sys.sp_MStran_is_snapshot_required(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                                    @subscriber sysname, @subscriber_db sysname, @subscription_type int,\
                                                    @run_at_distributor bit, @last_xact_seqno varbinary(16),\
                                                    @subscription_guid varbinary(16), @subid varbinary(16)) as\
-- missing source code\
go\
\
create procedure sys.sp_MStrypurgingoldsnapshotdeliveryprogress() as\
-- missing source code\
go\
\
create procedure sys.sp_MSunregistersubscription(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                                 @subscriber sysname, @subscriber_db sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_MSupdatelastsyncinfo(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                             @subscription_type int, @last_sync_status int,\
                                             @last_sync_summary sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_add_columnstore_column_dictionary(@table_id int, @column_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_add_object_to_event_stream_group(@stream_group_name sysname, @object_name nvarchar(512),\
                                                         @include_old_values bit, @include_all_columns bit,\
                                                         @include_old_lob_values bit) as\
-- missing source code\
go\
\
create procedure sys.sp_add_trusted_assembly() as\
-- missing source code\
go\
\
create procedure sys.sp_addapprole(@rolename sysname, @password sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_addextendedproperty(@name sysname, @value sql_variant, @level0type varchar(128),\
                                            @level0name sysname, @level1type varchar(128), @level1name sysname,\
                                            @level2type varchar(128), @level2name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_addrole(@rolename sysname, @ownername sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_addrolemember(@rolename sysname, @membername sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_addscriptexec(@publication sysname, @scriptfile nvarchar(4000), @skiperror bit,\
                                      @publisher sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_addtype(@typename sysname, @phystype sysname, @nulltype varchar(8), @owner sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_approlepassword(@rolename sysname, @newpwd sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_assemblies_rowset(@assembly_name sysname, @assembly_schema sysname, @assembly_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_assemblies_rowset2(@assembly_schema sysname, @assembly_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_assemblies_rowset_rmt(@server_name sysname, @catalog_name sysname, @assembly_name sysname,\
                                              @assembly_schema sysname, @assembly_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_assembly_dependencies_rowset(@assembly_id int, @assembly_schema sysname, @assembly_referenced int) as\
-- missing source code\
go\
\
create procedure sys.sp_assembly_dependencies_rowset2(@assembly_schema sysname, @assembly_referenced int) as\
-- missing source code\
go\
\
create procedure sys.sp_assembly_dependencies_rowset_rmt(@server sysname, @catalog sysname, @assembly_id int,\
                                                         @assembly_schema sysname, @assembly_referenced int) as\
-- missing source code\
go\
\
create procedure sys.sp_autostats(@tblname nvarchar(776), @flagc varchar(10), @indname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_bcp_dbcmptlevel(@dbname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_begin_parallel_nested_tran() as\
-- missing source code\
go\
\
create procedure sys.sp_bindefault(@defname nvarchar(776), @objname nvarchar(776), @futureonly varchar(15)) as\
-- missing source code\
go\
\
create procedure sys.sp_bindrule(@rulename nvarchar(776), @objname nvarchar(776), @futureonly varchar(15)) as\
-- missing source code\
go\
\
create procedure sys.sp_bindsession() as\
-- missing source code\
go\
\
create procedure sys.sp_build_histogram() as\
-- missing source code\
go\
\
create procedure sys.sp_catalogs(@server_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_catalogs_rowset(@catalog_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_catalogs_rowset2() as\
-- missing source code\
go\
\
create procedure sys.sp_catalogs_rowset_rmt(@server_name sysname, @catalog_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_add_job(@job_type nvarchar(20), @start_job bit, @maxtrans int, @maxscans int,\
                                    @continuous bit, @pollinginterval bigint, @retention bigint, @threshold bigint,\
                                    @check_for_logreader bit) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_change_job(@job_type nvarchar(20), @maxtrans int, @maxscans int, @continuous bit,\
                                       @pollinginterval bigint, @retention bigint, @threshold bigint) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_cleanup_change_table(@capture_instance sysname, @low_water_mark binary(10),\
                                                 @threshold bigint, @fCleanupFailed bit) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_dbsnapshotLSN(@db_snapshot sysname, @lastLSN binary(10), @lastLSNstr varchar(40)) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_disable_db() as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_disable_table(@source_schema sysname, @source_name sysname, @capture_instance sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_drop_job(@job_type nvarchar(20)) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_enable_db(@fCreateCDCUserImplicit bit) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_enable_table(@source_schema sysname, @source_name sysname, @capture_instance sysname,\
                                         @supports_net_changes bit, @role_name sysname, @index_name sysname,\
                                         @captured_column_list nvarchar(max), @filegroup_name sysname,\
                                         @allow_partition_switch bit, @enable_extended_ddl_handling bit) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_generate_wrapper_function(@capture_instance sysname, @closed_high_end_point bit,\
                                                      @column_list nvarchar(max), @update_flag_list nvarchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_get_captured_columns(@capture_instance sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_get_ddl_history(@capture_instance sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_help_change_data_capture(@source_schema sysname, @source_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_help_jobs() as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_restoredb(@srv_orig sysname, @db_orig sysname, @keep_cdc int, @shouldStartCDCjobs int) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_scan(@maxtrans int, @maxscans int, @continuous tinyint, @pollinginterval bigint,\
                                 @is_from_job int) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_set_scheduler_job() as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_vupgrade(@force_metadata_fixup bit) as\
-- missing source code\
go\
\
create procedure sys.sp_cdc_vupgrade_databases(@db_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_certificate_add_issuer() as\
-- missing source code\
go\
\
create procedure sys.sp_certificate_drop_issuer() as\
-- missing source code\
go\
\
create procedure sys.sp_certificate_issuers() as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_configure_parameters(@maxtrans int, @pollinterval int) as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_create_table_group(@table_group_id uniqueidentifier,\
                                                       @table_group_name nvarchar(140), @workspace_id nvarchar(247),\
                                                       @destination_location nvarchar(512),\
                                                       @destination_credential sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_disable_db() as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_disable_table(@table_group_id uniqueidentifier, @table_id uniqueidentifier) as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_drop_table_group(@table_group_id uniqueidentifier) as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_enable_db(@maxtrans int, @pollinterval int, @destination_type int) as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_enable_table(@table_group_id uniqueidentifier, @table_id uniqueidentifier,\
                                                 @source_schema sysname, @source_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_enable_tables_after_reseed() as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_is_slo_allowed() as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_reseed_db_init(@is_init_needed tinyint, @is_called_from tinyint) as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_reseed_db_start_replication() as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_reseed_table(@table_group_id uniqueidentifier, @table_id uniqueidentifier,\
                                                 @reseed_id nvarchar(36)) as\
-- missing source code\
go\
\
create procedure sys.sp_change_feed_vupgrade() as\
-- missing source code\
go\
\
create procedure sys.sp_change_tracking_waitforchanges() as\
-- missing source code\
go\
\
create procedure sys.sp_changereplicationserverpasswords(@login_type tinyint, @login nvarchar(257), @password sysname,\
                                                         @server sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_changesubstatus(@publication sysname, @article sysname, @subscriber sysname, @status sysname,\
                                        @previous_status sysname, @destination_db sysname, @frequency_type int,\
                                        @frequency_interval int, @frequency_relative_interval int,\
                                        @frequency_recurrence_factor int, @frequency_subday int,\
                                        @frequency_subday_interval int, @active_start_time_of_day int,\
                                        @active_end_time_of_day int, @active_start_date int, @active_end_date int,\
                                        @optional_command_line nvarchar(4000), @distribution_jobid binary(16),\
                                        @from_auto_sync bit, @ignore_distributor bit, @offloadagent bit,\
                                        @offloadserver sysname, @dts_package_name sysname,\
                                        @dts_package_password nvarchar(524), @dts_package_location int,\
                                        @skipobjectactivation int, @distribution_job_name sysname, @publisher sysname,\
                                        @ignore_distributor_failure bit) as\
-- missing source code\
go\
\
create procedure sys.sp_check_constbytable_rowset(@table_name sysname, @table_schema sysname, @constraint_name sysname,\
                                                  @constraint_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_check_constbytable_rowset2(@table_schema sysname, @constraint_name sysname,\
                                                   @constraint_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_check_constraints_rowset(@constraint_name sysname, @constraint_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_check_constraints_rowset2(@constraint_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_check_for_sync_trigger(@tabid int, @trigger_op char(10), @fonpublisher bit) as\
-- missing source code\
go\
\
create procedure sys.sp_check_sync_trigger(@trigger_procid int, @trigger_op char(10), @owner sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_clean_db_file_free_space(@dbname sysname, @fileid int, @cleaning_delay int) as\
-- missing source code\
go\
\
create procedure sys.sp_clean_db_free_space(@dbname sysname, @cleaning_delay int) as\
-- missing source code\
go\
\
create procedure sys.sp_cleanup_all_average_column_length_statistics() as\
-- missing source code\
go\
\
create procedure sys.sp_cleanup_all_openrowset_statistics() as\
-- missing source code\
go\
\
create procedure sys.sp_cleanup_data_retention(@schema_name sysname, @table_name sysname, @rowcount int) as\
-- missing source code\
go\
\
create procedure sys.sp_cleanup_temporal_history(@schema_name sysname, @table_name sysname, @rowcount int) as\
-- missing source code\
go\
\
create procedure sys.sp_cloud_connection_set_sds() as\
-- missing source code\
go\
\
create procedure sys.sp_cloud_extensions_get_federated_users() as\
-- missing source code\
go\
\
create procedure sys.sp_cloud_extensions_update_federated_username() as\
-- missing source code\
go\
\
create procedure sys.sp_cloud_get_synapse_sql_pools() as\
-- missing source code\
go\
\
create procedure sys.sp_cloud_impersonate_user() as\
-- missing source code\
go\
\
create procedure sys.sp_cloud_notify_dw_event() as\
-- missing source code\
go\
\
create procedure sys.sp_cloud_upgrade_in_post_sterling_migration() as\
-- missing source code\
go\
\
create procedure sys.sp_cloud_upgrade_partition_from_v1() as\
-- missing source code\
go\
\
create procedure sys.sp_collect_backend_plan() as\
-- missing source code\
go\
\
create procedure sys.sp_column_privileges(@table_name sysname, @table_owner sysname, @table_qualifier sysname,\
                                          @column_name nvarchar(384)) as\
-- missing source code\
go\
\
create procedure sys.sp_column_privileges_ex(@table_server sysname, @table_name sysname, @table_schema sysname,\
                                             @table_catalog sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_column_privileges_rowset(@table_name sysname, @table_schema sysname, @column_name sysname,\
                                                 @grantor sysname, @grantee sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_column_privileges_rowset2(@table_schema sysname, @column_name sysname, @grantor sysname,\
                                                  @grantee sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_column_privileges_rowset_rmt(@table_server sysname, @table_catalog sysname, @table_name sysname,\
                                                     @table_schema sysname, @column_name sysname, @grantor sysname,\
                                                     @grantee sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns(@table_name nvarchar(384), @table_owner nvarchar(384), @table_qualifier sysname,\
                                @column_name nvarchar(384), @ODBCVer int) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_100(@table_name nvarchar(384), @table_owner nvarchar(384), @table_qualifier sysname,\
                                    @column_name nvarchar(384), @NameScope int, @ODBCVer int, @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_100_rowset(@table_name sysname, @table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_100_rowset2(@table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_90(@table_name nvarchar(384), @table_owner nvarchar(384), @table_qualifier sysname,\
                                   @column_name nvarchar(384), @ODBCVer int, @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_90_rowset(@table_name sysname, @table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_90_rowset2(@table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_90_rowset_rmt(@table_server sysname, @table_catalog sysname, @table_name sysname,\
                                              @table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_ex(@table_server sysname, @table_name sysname, @table_schema sysname,\
                                   @table_catalog sysname, @column_name sysname, @ODBCVer int) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_ex_100(@table_server sysname, @table_name sysname, @table_schema sysname,\
                                       @table_catalog sysname, @column_name sysname, @ODBCVer int, @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_ex_90(@table_server sysname, @table_name sysname, @table_schema sysname,\
                                      @table_catalog sysname, @column_name sysname, @ODBCVer int, @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_managed(@Catalog sysname, @Owner sysname, @Table sysname, @Column sysname,\
                                        @SchemaType sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_rowset(@table_name sysname, @table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_rowset2(@table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_columns_rowset_rmt(@table_server sysname, @table_catalog sysname, @table_name sysname,\
                                           @table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_commit_parallel_nested_tran() as\
-- missing source code\
go\
\
create procedure sys.sp_configure_automatic_tuning() as\
-- missing source code\
go\
\
create procedure sys.sp_constr_col_usage_rowset(@table_name sysname, @table_schema sysname, @column_name sysname,\
                                                @constr_catalog sysname, @constr_schema sysname,\
                                                @constr_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_constr_col_usage_rowset2(@table_schema sysname, @column_name sysname, @constr_catalog sysname,\
                                                 @constr_schema sysname, @constr_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_control_plan_guide(@operation nvarchar(60), @name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_copy_data_in_batches() as\
-- missing source code\
go\
\
create procedure sys.sp_create_asymmetric_key_from_external_key() as\
-- missing source code\
go\
\
create procedure sys.sp_create_event_stream_group(@stream_group_name sysname, @destination_type sysname,\
                                                  @destination_location nvarchar(4000), @destination_credential sysname,\
                                                  @max_message_size_bytes int, @partition_key_scheme sysname,\
                                                  @partition_key_column_name sysname, @encoding sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_create_format_type() as\
-- missing source code\
go\
\
create procedure sys.sp_create_format_type_synonym() as\
-- missing source code\
go\
\
create procedure sys.sp_create_openrowset_statistics() as\
-- missing source code\
go\
\
create procedure sys.sp_create_parser_version() as\
-- missing source code\
go\
\
create procedure sys.sp_create_plan_guide(@name sysname, @stmt nvarchar(max), @type nvarchar(60),\
                                          @module_or_batch nvarchar(max), @params nvarchar(max),\
                                          @hints nvarchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_create_plan_guide_from_handle(@name sysname, @plan_handle varbinary(64),\
                                                      @statement_start_offset int) as\
-- missing source code\
go\
\
create procedure sys.sp_create_streaming_job(@name sysname, @statement nvarchar(max), @streams nvarchar(max),\
                                             @publicKey varbinary(512)) as\
-- missing source code\
go\
\
create procedure sys.sp_createorphan() as\
-- missing source code\
go\
\
create procedure sys.sp_createstats(@indexonly char(9), @fullscan char(9), @norecompute char(12),\
                                    @incremental char(12)) as\
-- missing source code\
go\
\
create procedure sys.sp_cslr_delete_entry() as\
-- missing source code\
go\
\
create procedure sys.sp_cslr_upsert_entry() as\
-- missing source code\
go\
\
create procedure sys.sp_cursor() as\
-- missing source code\
go\
\
create procedure sys.sp_cursor_list(@cursor_scope int) returns int as\
-- missing source code\
go\
\
create procedure sys.sp_cursorclose() as\
-- missing source code\
go\
\
create procedure sys.sp_cursorexecute() as\
-- missing source code\
go\
\
create procedure sys.sp_cursorfetch() as\
-- missing source code\
go\
\
create procedure sys.sp_cursoropen() as\
-- missing source code\
go\
\
create procedure sys.sp_cursoroption() as\
-- missing source code\
go\
\
create procedure sys.sp_cursorprepare() as\
-- missing source code\
go\
\
create procedure sys.sp_cursorprepexec() as\
-- missing source code\
go\
\
create procedure sys.sp_cursorunprepare() as\
-- missing source code\
go\
\
create procedure sys.sp_data_pool_database_query_state(@db_name sysname, @database_state sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_data_pool_table_query_state(@pool_name sysname, @db_name sysname, @schema_name sysname,\
                                                    @table_name sysname, @table_state sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_data_source_objects(@data_source sysname, @object_root_name nvarchar(max),\
                                            @max_search_depth int, @search_options nvarchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_data_source_table_columns(@data_source sysname, @table_location nvarchar(max),\
                                                  @column_name nvarchar(max), @search_options nvarchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_databases() as\
-- missing source code\
go\
\
create procedure sys.sp_datatype_info(@data_type int, @ODBCVer tinyint) as\
-- missing source code\
go\
\
create procedure sys.sp_datatype_info_100(@data_type int, @ODBCVer tinyint) as\
-- missing source code\
go\
\
create procedure sys.sp_datatype_info_90(@data_type int, @ODBCVer tinyint) as\
-- missing source code\
go\
\
create procedure sys.sp_db_ebcdic277_2(@dbname sysname, @status varchar(6)) as\
-- missing source code\
go\
\
create procedure sys.sp_db_gb18030_unicode_collations(@dbname sysname, @status varchar(6)) as\
-- missing source code\
go\
\
create procedure sys.sp_db_increased_partitions(@dbname sysname, @increased_partitions varchar(6)) as\
-- missing source code\
go\
\
create procedure sys.sp_db_selective_xml_index(@dbname sysname, @selective_xml_index varchar(6)) as\
-- missing source code\
go\
\
create procedure sys.sp_dbfixedrolepermission(@rolename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_ddopen(@handle int, @procname sysname, @scrollopt int, @ccopt int, @rows int, @p1 nvarchar(774),\
                               @p2 nvarchar(774), @p3 nvarchar(774), @p4 nvarchar(774), @p5 nvarchar(774),\
                               @p6 nvarchar(774), @p7 int, @NameScope int, @ODBCVer int, @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_delete_database_engine_configuration_internal() as\
-- missing source code\
go\
\
create procedure sys.sp_delete_database_firewall_rule() as\
-- missing source code\
go\
\
create procedure sys.sp_delete_firewall_rule() as\
-- missing source code\
go\
\
create procedure sys.sp_delete_ipv6_database_firewall_rule() as\
-- missing source code\
go\
\
create procedure sys.sp_delete_ipv6_firewall_rule() as\
-- missing source code\
go\
\
create procedure sys.sp_depends(@objname nvarchar(776)) as\
-- missing source code\
go\
\
create procedure sys.sp_describe_cursor(@cursor_source nvarchar(30), @cursor_identity nvarchar(128)) returns int as\
-- missing source code\
go\
\
create procedure sys.sp_describe_cursor_columns(@cursor_source nvarchar(30), @cursor_identity nvarchar(128)) returns int as\
-- missing source code\
go\
\
create procedure sys.sp_describe_cursor_tables(@cursor_source nvarchar(30), @cursor_identity nvarchar(128)) returns int as\
-- missing source code\
go\
\
create procedure sys.sp_describe_first_result_set() as\
-- missing source code\
go\
\
create procedure sys.sp_describe_parameter_encryption() as\
-- missing source code\
go\
\
create procedure sys.sp_describe_undeclared_parameters() as\
-- missing source code\
go\
\
create procedure sys.sp_detour_top_memory_allocations(@maxRecords int, @clerkType varchar(256), @clerkName varchar(256)) as\
-- missing source code\
go\
\
create procedure sys.sp_diagnostic_showplan_log_dbid() as\
-- missing source code\
go\
\
create procedure sys.sp_disable_event_stream() as\
-- missing source code\
go\
\
create procedure sys.sp_discover_trident_table(@TableName nvarchar(256)) as\
-- missing source code\
go\
\
create procedure sys.sp_drop_event_stream_group(@stream_group_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_drop_format_type() as\
-- missing source code\
go\
\
create procedure sys.sp_drop_openrowset_statistics() as\
-- missing source code\
go\
\
create procedure sys.sp_drop_parser_version() as\
-- missing source code\
go\
\
create procedure sys.sp_drop_storage_location() as\
-- missing source code\
go\
\
create procedure sys.sp_drop_streaming_job(@name sysname, @force bit) as\
-- missing source code\
go\
\
create procedure sys.sp_drop_trident_data_location() as\
-- missing source code\
go\
\
create procedure sys.sp_drop_trusted_assembly() as\
-- missing source code\
go\
\
create procedure sys.sp_dropapprole(@rolename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_dropextendedproperty(@name sysname, @level0type varchar(128), @level0name sysname,\
                                             @level1type varchar(128), @level1name sysname, @level2type varchar(128),\
                                             @level2name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_droporphans() as\
-- missing source code\
go\
\
create procedure sys.sp_droprole(@rolename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_droprolemember(@rolename sysname, @membername sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_droptype(@typename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_enable_event_stream() as\
-- missing source code\
go\
\
create procedure sys.sp_enable_sql_debug() as\
-- missing source code\
go\
\
create procedure sys.sp_enclave_send_keys() as\
-- missing source code\
go\
\
create procedure sys.sp_estimate_data_compression_savings(@schema_name sysname, @object_name sysname, @index_id int,\
                                                          @partition_number int, @data_compression nvarchar(60),\
                                                          @xml_compression bit) as\
-- missing source code\
go\
\
create procedure sys.sp_estimated_rowsize_reduction_for_vardecimal(@table_name nvarchar(776)) as\
-- missing source code\
go\
\
create procedure sys.sp_execute() as\
-- missing source code\
go\
\
create procedure sys.sp_execute_external_script() as\
-- missing source code\
go\
\
create procedure sys.sp_execute_global_tran() as\
-- missing source code\
go\
\
create procedure sys.sp_execute_remote() as\
-- missing source code\
go\
\
create procedure sys.sp_executesql() as\
-- missing source code\
go\
\
create procedure sys.sp_external_governance_initiate_synchronization() as\
-- missing source code\
go\
\
create procedure sys.sp_external_policy_refresh() as\
-- missing source code\
go\
\
create procedure sys.sp_fido_build_basic_histogram() as\
-- missing source code\
go\
\
create procedure sys.sp_fido_build_histogram() as\
-- missing source code\
go\
\
create procedure sys.sp_fido_execute_graph_request() as\
-- missing source code\
go\
\
create procedure sys.sp_fido_indexstore_update_topology() as\
-- missing source code\
go\
\
create procedure sys.sp_fido_indexstore_upgrade_node() as\
-- missing source code\
go\
\
create procedure sys.sp_fkeys(@pktable_name sysname, @pktable_owner sysname, @pktable_qualifier sysname,\
                              @fktable_name sysname, @fktable_owner sysname, @fktable_qualifier sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_flush_CT_internal_table_on_demand(@TableToClean sysname, @DeletedRowCount bigint,\
                                                          @DeleteBatchSize int, @SysCommitTabRowCount int) as\
-- missing source code\
go\
\
create procedure sys.sp_flush_commit_table(@flush_ts bigint, @cleanup_version bigint) as\
-- missing source code\
go\
\
create procedure sys.sp_flush_commit_table_on_demand(@numrows bigint, @deleted_rows bigint, @date_cleanedup datetime,\
                                                     @cleanup_ts bigint) as\
-- missing source code\
go\
\
create procedure sys.sp_flush_log() as\
-- missing source code\
go\
\
create procedure sys.sp_force_slog_truncation() as\
-- missing source code\
go\
\
create procedure sys.sp_foreign_keys_rowset(@pk_table_name sysname, @pk_table_schema sysname,\
                                            @foreignkey_tab_name sysname, @foreignkey_tab_schema sysname,\
                                            @foreignkey_tab_catalog sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_foreign_keys_rowset2(@foreignkey_tab_name sysname, @foreignkey_tab_schema sysname,\
                                             @pk_table_name sysname, @pk_table_schema sysname,\
                                             @pk_table_catalog sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_foreign_keys_rowset3(@pk_table_schema sysname, @pk_table_catalog sysname,\
                                             @foreignkey_tab_schema sysname, @foreignkey_tab_catalog sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_foreign_keys_rowset_rmt(@server_name sysname, @pk_table_name sysname, @pk_table_schema sysname,\
                                                @pk_table_catalog sysname, @foreignkey_tab_name sysname,\
                                                @foreignkey_tab_schema sysname, @foreignkey_tab_catalog sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_foreignkeys(@table_server sysname, @pktab_name sysname, @pktab_schema sysname,\
                                    @pktab_catalog sysname, @fktab_name sysname, @fktab_schema sysname,\
                                    @fktab_catalog sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_catalog(@ftcat sysname, @action varchar(20), @path nvarchar(101)) as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_column(@tabname nvarchar(517), @colname sysname, @action varchar(20), @language int,\
                                        @type_colname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_database(@action varchar(20)) as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_delete_thesaurus(@lcid int) as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_getdata() as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_keymappings() as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_load_thesaurus(@lcid int, @thesaurus xml) as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_pendingchanges() as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_service(@action nvarchar(100), @value sql_variant) as\
-- missing source code\
go\
\
create procedure sys.sp_fulltext_table(@tabname nvarchar(517), @action varchar(50), @ftcat sysname, @keyname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_generate_database_ledger_digest() as\
-- missing source code\
go\
\
create procedure sys.sp_generate_external_table_statistics_description_and_hash() as\
-- missing source code\
go\
\
create procedure sys.sp_generate_openrowset_statistics_props() as\
-- missing source code\
go\
\
create procedure sys.sp_generate_trident_table_manifest() as\
-- missing source code\
go\
\
create procedure sys.sp_get_endpoint_certificate() as\
-- missing source code\
go\
\
create procedure sys.sp_get_external_table_cardinality() as\
-- missing source code\
go\
\
create procedure sys.sp_get_jobs_database_scoped_credential() as\
-- missing source code\
go\
\
create procedure sys.sp_get_migration_vlf_state() as\
-- missing source code\
go\
\
create procedure sys.sp_get_openrowset_statistics_additional_props() as\
-- missing source code\
go\
\
create procedure sys.sp_get_openrowset_statistics_cardinality() as\
-- missing source code\
go\
\
create procedure sys.sp_get_query_template() as\
-- missing source code\
go\
\
create procedure sys.sp_get_streaming_job(@name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_get_table_card_est_and_avg_col_len() as\
-- missing source code\
go\
\
create procedure sys.sp_get_total_openrowset_statistics_count() as\
-- missing source code\
go\
\
create procedure sys.sp_get_trident_data_location() as\
-- missing source code\
go\
\
create procedure sys.sp_getapplock(@Resource nvarchar(255), @LockMode varchar(32), @LockOwner varchar(32),\
                                   @LockTimeout int, @DbPrincipal sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_getbindtoken() as\
-- missing source code\
go\
\
create procedure sys.sp_getschemalock() as\
-- missing source code\
go\
\
create procedure sys.sp_has_change_feed_permissions(@destination_type int) as\
-- missing source code\
go\
\
create procedure sys.sp_help(@objname nvarchar(776)) as\
-- missing source code\
go\
\
create procedure sys.sp_help_change_feed() as\
-- missing source code\
go\
\
create procedure sys.sp_help_change_feed_settings() as\
-- missing source code\
go\
\
create procedure sys.sp_help_change_feed_table(@table_group_id uniqueidentifier, @table_id uniqueidentifier,\
                                               @source_schema sysname, @source_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_help_change_feed_table_groups() as\
-- missing source code\
go\
\
create procedure sys.sp_help_fabric_mirroring() as\
-- missing source code\
go\
\
create procedure sys.sp_help_fabric_mirroring_table(@table_group_id uniqueidentifier, @table_id uniqueidentifier,\
                                                    @source_schema sysname, @source_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_help_fabric_mirroring_table_groups() as\
-- missing source code\
go\
\
create procedure sys.sp_help_fulltext_catalog_components() as\
-- missing source code\
go\
\
create procedure sys.sp_help_fulltext_catalogs(@fulltext_catalog_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_help_fulltext_catalogs_cursor(@fulltext_catalog_name sysname) returns int as\
-- missing source code\
go\
\
create procedure sys.sp_help_fulltext_columns(@table_name nvarchar(517), @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_help_fulltext_columns_cursor(@table_name nvarchar(517), @column_name sysname) returns int as\
-- missing source code\
go\
\
create procedure sys.sp_help_fulltext_system_components(@component_type sysname, @param sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_help_fulltext_tables(@fulltext_catalog_name sysname, @table_name nvarchar(517)) as\
-- missing source code\
go\
\
create procedure sys.sp_help_fulltext_tables_cursor(@fulltext_catalog_name sysname, @table_name nvarchar(517)) returns int as\
-- missing source code\
go\
\
create procedure sys.sp_help_spatial_geography_histogram(@tabname sysname, @colname sysname, @resolution int, @sample float) as\
-- missing source code\
go\
\
create procedure sys.sp_help_spatial_geography_index(@tabname nvarchar(776), @indexname sysname, @verboseoutput tinyint,\
                                                     @query_sample geography) as\
-- missing source code\
go\
\
create procedure sys.sp_help_spatial_geography_index_xml(@tabname nvarchar(776), @indexname sysname,\
                                                         @verboseoutput tinyint, @query_sample geography,\
                                                         @xml_output xml) as\
-- missing source code\
go\
\
create procedure sys.sp_help_spatial_geometry_histogram(@tabname sysname, @colname sysname, @resolution int,\
                                                        @xmin float, @ymin float, @xmax float, @ymax float,\
                                                        @sample float) as\
-- missing source code\
go\
\
create procedure sys.sp_help_spatial_geometry_index(@tabname nvarchar(776), @indexname sysname, @verboseoutput tinyint,\
                                                    @query_sample geometry) as\
-- missing source code\
go\
\
create procedure sys.sp_help_spatial_geometry_index_xml(@tabname nvarchar(776), @indexname sysname,\
                                                        @verboseoutput tinyint, @query_sample geometry,\
                                                        @xml_output xml) as\
-- missing source code\
go\
\
create procedure sys.sp_helpconstraint(@objname nvarchar(776), @nomsg varchar(5)) as\
-- missing source code\
go\
\
create procedure sys.sp_helpdb(@dbname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpdbfixedrole(@rolename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpdevice(@devname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpextendedproc(@funcname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpfile(@filename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpfilegroup(@filegroupname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpindex(@objname nvarchar(776)) as\
-- missing source code\
go\
\
create procedure sys.sp_helplanguage(@language sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helplinkedsrvlogin(@rmtsrvname sysname, @locallogin sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpremotelogin(@remoteserver sysname, @remotename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpreplicationdboption(@dbname sysname, @type sysname, @reserved bit) as\
-- missing source code\
go\
\
create procedure sys.sp_helprole(@rolename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helprolemember(@rolename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helprotect(@name nvarchar(776), @username sysname, @grantorname sysname,\
                                   @permissionarea varchar(10)) as\
-- missing source code\
go\
\
create procedure sys.sp_helpserver(@server sysname, @optname varchar(35), @show_topology varchar) as\
-- missing source code\
go\
\
create procedure sys.sp_helpsort() as\
-- missing source code\
go\
\
create procedure sys.sp_helpsrvrole(@srvrolename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helpstats(@objname nvarchar(776), @results nvarchar(5)) as\
-- missing source code\
go\
\
create procedure sys.sp_helpsubscription(@publication sysname, @article sysname, @subscriber sysname,\
                                         @destination_db sysname, @found int, @publisher sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helptext(@objname nvarchar(776), @columnname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_helptrigger(@tabname nvarchar(776), @triggertype char(6)) as\
-- missing source code\
go\
\
create procedure sys.sp_helpuser(@name_in_db sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_identitycolumnforreplication(@object_id int, @value bit) as\
-- missing source code\
go\
\
create procedure sys.sp_indexcolumns_managed(@Catalog sysname, @Owner sysname, @Table sysname, @ConstraintName sysname,\
                                             @Column sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes(@table_server sysname, @table_name sysname, @table_schema sysname,\
                                @table_catalog sysname, @index_name sysname, @is_unique bit) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_100_rowset(@table_name sysname, @index_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_100_rowset2(@index_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_90_rowset(@table_name sysname, @index_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_90_rowset2(@index_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_90_rowset_rmt(@table_server sysname, @table_catalog sysname, @table_name sysname,\
                                              @index_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_managed(@Catalog sysname, @Owner sysname, @Table sysname, @Name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_rowset(@table_name sysname, @index_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_rowset2(@index_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexes_rowset_rmt(@table_server sysname, @table_catalog sysname, @table_name sysname,\
                                           @index_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_indexoption(@IndexNamePattern nvarchar(1035), @OptionName varchar(35),\
                                    @OptionValue varchar(12)) as\
-- missing source code\
go\
\
create procedure sys.sp_invalidate_textptr(@TextPtrValue varbinary(16)) as\
-- missing source code\
go\
\
create procedure sys.sp_invoke_external_rest_endpoint(@url nvarchar(4000), @payload nvarchar(max),\
                                                      @headers nvarchar(4000), @method nvarchar(6), @timeout smallint,\
                                                      @credential sysname, @response nvarchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_is_columnstore_column_dictionary_enabled(@table_id int, @column_id int, @is_enabled bit) as\
-- missing source code\
go\
\
create procedure sys.sp_ivindexhasnullcols(@viewname sysname, @fhasnullcols bit) as\
-- missing source code\
go\
\
create procedure sys.sp_kill_oldest_transaction_on_secondary(@database_name sysname, @kill_all bit, @killed_xdests bigint) as\
-- missing source code\
go\
\
create procedure sys.sp_link_publication(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                         @security_mode int, @login sysname, @password sysname, @distributor sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_lock(@spid1 int, @spid2 int) as\
-- missing source code\
go\
\
create procedure sys.sp_maintenance_workflow() as\
-- missing source code\
go\
\
create procedure sys.sp_marksubscriptionvalidation(@publication sysname, @subscriber sysname, @destination_db sysname,\
                                                   @publisher sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_memory_leak_detection(@leakThresholdPercent float, @timeToLookbackMinutes int,\
                                              @intervalSeconds int, @maxRecords int, @clerkType varchar(256),\
                                              @clerkName varchar(256)) as\
-- missing source code\
go\
\
create procedure sys.sp_memory_optimized_cs_migration(@object_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_metadata_sync_connector_add(@unique_name varchar(max), @type varchar(20),\
                                                    @jdbc_connection_url nvarchar(max), @driver_name nvarchar(max),\
                                                    @username nvarchar(max), @password nvarchar(max),\
                                                    @max_retry_count tinyint, @retry_interval_ms int,\
                                                    @sql_command_timeout_sec smallint, @sync_interval_sec smallint,\
                                                    @mappings_json nvarchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_metadata_sync_connector_drop(@unique_name varchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_metadata_sync_connectors_status(@unique_name varchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_move_first_fixed_vlf() as\
-- missing source code\
go\
\
create procedure sys.sp_new_parallel_nested_tran_id() as\
-- missing source code\
go\
\
create procedure sys.sp_objectfilegroup(@objid int) as\
-- missing source code\
go\
\
create procedure sys.sp_oledb_database() as\
-- missing source code\
go\
\
create procedure sys.sp_oledb_defdb() as\
-- missing source code\
go\
\
create procedure sys.sp_oledb_deflang() as\
-- missing source code\
go\
\
create procedure sys.sp_oledb_language() as\
-- missing source code\
go\
\
create procedure sys.sp_oledb_ro_usrname() as\
-- missing source code\
go\
\
create procedure sys.sp_persistent_version_cleanup(@dbname sysname, @scanallpages bit, @clean_option int) as\
-- missing source code\
go\
\
create procedure sys.sp_pkeys(@table_name sysname, @table_owner sysname, @table_qualifier sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_polybase_authorize() as\
-- missing source code\
go\
\
create procedure sys.sp_polybase_join_group() as\
-- missing source code\
go\
\
create procedure sys.sp_polybase_leave_group() as\
-- missing source code\
go\
\
create procedure sys.sp_polybase_show_objects() as\
-- missing source code\
go\
\
create procedure sys.sp_predict_next_activity(@retention_interval_days int, @probability_threshold int,\
                                              @window_size_sec int, @window_slide_sec int, @now bigint,\
                                              @start_of_predicted_activity bigint, @end_of_predicted_activity bigint,\
                                              @confidence bigint, @is_db_old bigint) as\
-- missing source code\
go\
\
create procedure sys.sp_prepare() as\
-- missing source code\
go\
\
create procedure sys.sp_prepexec() as\
-- missing source code\
go\
\
create procedure sys.sp_prepexecrpc() as\
-- missing source code\
go\
\
create procedure sys.sp_primary_keys_rowset(@table_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_primary_keys_rowset2(@table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_primary_keys_rowset_rmt(@table_server sysname, @table_catalog sysname, @table_name sysname,\
                                                @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_primarykeys(@table_server sysname, @table_name sysname, @table_schema sysname,\
                                    @table_catalog sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedure_params_100_managed(@procedure_name sysname, @group_number int,\
                                                     @procedure_schema sysname, @parameter_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedure_params_100_rowset(@procedure_name sysname, @group_number int,\
                                                    @procedure_schema sysname, @parameter_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedure_params_100_rowset2(@procedure_schema sysname, @parameter_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedure_params_90_rowset(@procedure_name sysname, @group_number int,\
                                                   @procedure_schema sysname, @parameter_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedure_params_90_rowset2(@procedure_schema sysname, @parameter_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedure_params_managed(@procedure_name sysname, @group_number int, @procedure_schema sysname,\
                                                 @parameter_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedure_params_rowset(@procedure_name sysname, @group_number int, @procedure_schema sysname,\
                                                @parameter_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedure_params_rowset2(@procedure_schema sysname, @parameter_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedures_rowset(@procedure_name sysname, @group_number int, @procedure_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_procedures_rowset2(@procedure_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_process_detour_memory_allocation_record() as\
-- missing source code\
go\
\
create procedure sys.sp_process_memory_leak_record() as\
-- missing source code\
go\
\
create procedure sys.sp_procoption(@ProcName nvarchar(776), @OptionName varchar(35), @OptionValue varchar(12)) as\
-- missing source code\
go\
\
create procedure sys.sp_provider_types_100_rowset(@data_type smallint, @best_match tinyint) as\
-- missing source code\
go\
\
create procedure sys.sp_provider_types_90_rowset(@data_type smallint, @best_match tinyint) as\
-- missing source code\
go\
\
create procedure sys.sp_provider_types_rowset(@data_type smallint, @best_match tinyint) as\
-- missing source code\
go\
\
create procedure sys.sp_publish_database_to_syms() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_clear_hints() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_clear_message_queues() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_consistency_check() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_flush_db() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_force_plan() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_remove_plan() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_remove_query() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_reset_exec_stats() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_set_hints() as\
-- missing source code\
go\
\
create procedure sys.sp_query_store_unforce_plan() as\
-- missing source code\
go\
\
create procedure sys.sp_recompile(@objname nvarchar(776)) as\
-- missing source code\
go\
\
create procedure sys.sp_refresh_parameter_encryption(@name nvarchar(776), @namespace nvarchar(20)) as\
-- missing source code\
go\
\
create procedure sys.sp_refresh_single_snapshot_view(@view_name nvarchar(261), @rgCode int) as\
-- missing source code\
go\
\
create procedure sys.sp_refresh_snapshot_views(@rgCode int) as\
-- missing source code\
go\
\
create procedure sys.sp_refreshsqlmodule(@name nvarchar(776), @namespace nvarchar(20)) as\
-- missing source code\
go\
\
create procedure sys.sp_refreshview(@viewname nvarchar(776)) as\
-- missing source code\
go\
\
create procedure sys.sp_releaseapplock(@Resource nvarchar(255), @LockOwner varchar(32), @DbPrincipal sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_releaseschemalock() as\
-- missing source code\
go\
\
create procedure sys.sp_remote_data_archive_event() as\
-- missing source code\
go\
\
create procedure sys.sp_remove_columnstore_column_dictionary(@table_id int, @column_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_remove_object_from_event_stream_group(@stream_group_name sysname, @object_name nvarchar(512)) as\
-- missing source code\
go\
\
create procedure sys.sp_removedbreplication(@dbname sysname, @type nvarchar(5)) as\
-- missing source code\
go\
\
create procedure sys.sp_removesrvreplication() as\
-- missing source code\
go\
\
create procedure sys.sp_rename(@objname nvarchar(1035), @newname sysname, @objtype varchar(13)) as\
-- missing source code\
go\
\
create procedure sys.sp_repair_logical_index_corruption() as\
-- missing source code\
go\
\
create procedure sys.sp_repl_generate_subscriber_event() as\
-- missing source code\
go\
\
create procedure sys.sp_repl_generate_sync_status_event() as\
-- missing source code\
go\
\
create procedure sys.sp_repldone() as\
-- missing source code\
go\
\
create procedure sys.sp_replgetparsedddlcmd(@ddlcmd nvarchar(max), @FirstToken sysname, @objectType sysname,\
                                            @dbname sysname, @owner sysname, @objname sysname,\
                                            @targetobject nvarchar(512)) as\
-- missing source code\
go\
\
create procedure sys.sp_replicationdboption(@dbname sysname, @optname sysname, @value sysname, @ignore_distributor bit,\
                                            @from_scripting bit) as\
-- missing source code\
go\
\
create procedure sys.sp_replpostsyncstatus(@pubid int, @artid int, @syncstat int, @xact_seqno binary(10)) as\
-- missing source code\
go\
\
create procedure sys.sp_replrethrow() as\
-- missing source code\
go\
\
create procedure sys.sp_replwritetovarbin() as\
-- missing source code\
go\
\
create procedure sys.sp_reset_connection() as\
-- missing source code\
go\
\
create procedure sys.sp_reset_session_context() as\
-- missing source code\
go\
\
create procedure sys.sp_resetsnapshotdeliveryprogress(@verbose_level int, @drop_table nvarchar(5)) as\
-- missing source code\
go\
\
create procedure sys.sp_resyncexecute() as\
-- missing source code\
go\
\
create procedure sys.sp_resyncexecutesql() as\
-- missing source code\
go\
\
create procedure sys.sp_resyncprepare() as\
-- missing source code\
go\
\
create procedure sys.sp_resyncuniquetable() as\
-- missing source code\
go\
\
create procedure sys.sp_rollback_parallel_nested_tran() as\
-- missing source code\
go\
\
create procedure sys.sp_rsc_evict_all() as\
-- missing source code\
go\
\
create procedure sys.sp_schemata_rowset(@schema_name sysname, @schema_owner sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_sequence_get_range(@sequence_name nvarchar(776), @range_size bigint,\
                                           @range_first_value sql_variant, @range_last_value sql_variant,\
                                           @range_cycle_count int, @sequence_increment sql_variant,\
                                           @sequence_min_value sql_variant, @sequence_max_value sql_variant) as\
-- missing source code\
go\
\
create procedure sys.sp_server_info(@attribute_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_set_blob_ringbuffer_memory() as\
-- missing source code\
go\
\
create procedure sys.sp_set_data_processed_limit() as\
-- missing source code\
go\
\
create procedure sys.sp_set_database_engine_configuration_internal() as\
-- missing source code\
go\
\
create procedure sys.sp_set_database_firewall_rule() as\
-- missing source code\
go\
\
create procedure sys.sp_set_def_format_type_default_target() as\
-- missing source code\
go\
\
create procedure sys.sp_set_def_format_type_extractor() as\
-- missing source code\
go\
\
create procedure sys.sp_set_def_format_type_md_preprocessor() as\
-- missing source code\
go\
\
create procedure sys.sp_set_distributed_feedback_context() as\
-- missing source code\
go\
\
create procedure sys.sp_set_distributed_query_context() as\
-- missing source code\
go\
\
create procedure sys.sp_set_firewall_rule() as\
-- missing source code\
go\
\
create procedure sys.sp_set_format_type_ls_syntax() as\
-- missing source code\
go\
\
create procedure sys.sp_set_ipv6_database_firewall_rule() as\
-- missing source code\
go\
\
create procedure sys.sp_set_ipv6_firewall_rule() as\
-- missing source code\
go\
\
create procedure sys.sp_set_parser_version_default_target() as\
-- missing source code\
go\
\
create procedure sys.sp_set_parser_version_extractor() as\
-- missing source code\
go\
\
create procedure sys.sp_set_parser_version_md_preprocessor() as\
-- missing source code\
go\
\
create procedure sys.sp_set_session_context() as\
-- missing source code\
go\
\
create procedure sys.sp_set_trident_data_location(@storagePath nvarchar(2000)) as\
-- missing source code\
go\
\
create procedure sys.sp_setapprole(@rolename sysname, @password sysname, @encrypt varchar(10), @fCreateCookie bit,\
                                   @cookie varbinary(8000)) as\
-- missing source code\
go\
\
create procedure sys.sp_setsubscriptionxactseqno(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                                 @xact_seqno varbinary(16)) as\
-- missing source code\
go\
\
create procedure sys.sp_settriggerorder(@triggername nvarchar(517), @order varchar(10), @stmttype varchar(50),\
                                        @namespace varchar(10)) as\
-- missing source code\
go\
\
create procedure sys.sp_show_external_table_average_column_length_statistics() as\
-- missing source code\
go\
\
create procedure sys.sp_show_openrowset_statistics() as\
-- missing source code\
go\
\
create procedure sys.sp_showinitialmemo_xml() as\
-- missing source code\
go\
\
create procedure sys.sp_showmemo_xml() as\
-- missing source code\
go\
\
create procedure sys.sp_shutdown_feedback_client_connection() as\
-- missing source code\
go\
\
create procedure sys.sp_sm_detach() as\
-- missing source code\
go\
\
create procedure sys.sp_spaceused(@objname nvarchar(776), @updateusage varchar(5), @mode varchar(11), @oneresultset bit,\
                                  @include_total_xtp_storage bit) as\
-- missing source code\
go\
\
create procedure sys.sp_sparse_columns_100_rowset(@table_name sysname, @table_schema sysname, @column_name sysname,\
                                                  @schema_type int) as\
-- missing source code\
go\
\
create procedure sys.sp_special_columns(@table_name sysname, @table_owner sysname, @table_qualifier sysname,\
                                        @col_type char, @scope char, @nullable char, @ODBCVer int) as\
-- missing source code\
go\
\
create procedure sys.sp_special_columns_100(@table_name sysname, @table_owner sysname, @table_qualifier sysname,\
                                            @col_type char, @scope char, @nullable char, @ODBCVer int) as\
-- missing source code\
go\
\
create procedure sys.sp_special_columns_90(@table_name sysname, @table_owner sysname, @table_qualifier sysname,\
                                           @col_type char, @scope char, @nullable char, @ODBCVer int) as\
-- missing source code\
go\
\
create procedure sys.sp_sproc_columns(@procedure_name nvarchar(390), @procedure_owner nvarchar(384),\
                                      @procedure_qualifier sysname, @column_name nvarchar(384), @ODBCVer int,\
                                      @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_sproc_columns_100(@procedure_name nvarchar(390), @procedure_owner nvarchar(384),\
                                          @procedure_qualifier sysname, @column_name nvarchar(384), @ODBCVer int,\
                                          @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_sproc_columns_90(@procedure_name nvarchar(390), @procedure_owner nvarchar(384),\
                                         @procedure_qualifier sysname, @column_name nvarchar(384), @ODBCVer int,\
                                         @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_sqlexec(@p1 text) as\
-- missing source code\
go\
\
create procedure sys.sp_sqljdbc_xa_install() as\
-- missing source code\
go\
\
create procedure sys.sp_sqljdbc_xa_uninstall() as\
-- missing source code\
go\
\
create procedure sys.sp_srvrolepermission(@srvrolename sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_start_fixed_vlf() as\
-- missing source code\
go\
\
create procedure sys.sp_start_streaming_job(@name sysname, @resources nvarchar(255), @outputStartTime nvarchar(255),\
                                            @testMode nvarchar(50)) as\
-- missing source code\
go\
\
create procedure sys.sp_startpushsubscription_agent(@publication sysname, @subscriber sysname, @subscriber_db sysname,\
                                                    @publisher sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_statistics(@table_name sysname, @table_owner sysname, @table_qualifier sysname,\
                                   @index_name sysname, @is_unique char, @accuracy char) as\
-- missing source code\
go\
\
create procedure sys.sp_statistics_100(@table_name sysname, @table_owner sysname, @table_qualifier sysname,\
                                       @index_name sysname, @is_unique char, @accuracy char) as\
-- missing source code\
go\
\
create procedure sys.sp_statistics_rowset(@table_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_statistics_rowset2(@table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_stop_streaming_job(@name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_stored_procedures(@sp_name nvarchar(390), @sp_owner nvarchar(384), @sp_qualifier sysname,\
                                          @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_subscription_cleanup(@publisher sysname, @publisher_db sysname, @publication sysname,\
                                             @reserved nvarchar(10), @from_backup bit) as\
-- missing source code\
go\
\
create procedure sys.sp_table_constraints_rowset(@table_name sysname, @table_schema sysname, @table_catalog sysname,\
                                                 @constraint_name sysname, @constraint_schema sysname,\
                                                 @constraint_catalog sysname, @constraint_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_table_constraints_rowset2(@table_schema sysname, @table_catalog sysname,\
                                                  @constraint_name sysname, @constraint_schema sysname,\
                                                  @constraint_catalog sysname, @constraint_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_table_privileges(@table_name nvarchar(384), @table_owner nvarchar(384),\
                                         @table_qualifier sysname, @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_table_privileges_ex(@table_server sysname, @table_name sysname, @table_schema sysname,\
                                            @table_catalog sysname, @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_table_privileges_rowset(@table_name sysname, @table_schema sysname, @grantor sysname,\
                                                @grantee sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_privileges_rowset2(@table_schema sysname, @grantor sysname, @grantee sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_privileges_rowset_rmt(@table_server sysname, @table_catalog sysname, @table_name sysname,\
                                                    @table_schema sysname, @grantor sysname, @grantee sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_statistics2_rowset(@table_name sysname, @table_schema sysname, @table_catalog sysname,\
                                                 @stat_name sysname, @stat_schema sysname, @stat_catalog sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_statistics_rowset(@table_name_dummy sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_type_columns_100(@table_name nvarchar(384), @table_owner nvarchar(384),\
                                               @table_qualifier sysname, @column_name nvarchar(384), @ODBCVer int,\
                                               @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_table_type_columns_100_rowset(@table_name sysname, @table_schema sysname, @column_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_type_pkeys(@table_name sysname, @table_owner sysname, @table_qualifier sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_type_primary_keys_rowset(@table_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_types(@table_name nvarchar(384), @table_owner nvarchar(384), @table_qualifier sysname,\
                                    @table_type varchar(100), @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_table_types_rowset(@table_name sysname, @table_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_table_validation(@table sysname, @expected_rowcount bigint, @expected_checksum numeric,\
                                         @rowcount_only smallint, @owner sysname, @full_or_fast tinyint,\
                                         @shutdown_agent bit, @table_name sysname, @column_list nvarchar(max)) as\
-- missing source code\
go\
\
create procedure sys.sp_tablecollations(@object nvarchar(4000)) as\
-- missing source code\
go\
\
create procedure sys.sp_tablecollations_100(@object nvarchar(4000)) as\
-- missing source code\
go\
\
create procedure sys.sp_tablecollations_90(@object nvarchar(4000)) as\
-- missing source code\
go\
\
create procedure sys.sp_tableoption(@TableNamePattern nvarchar(776), @OptionName varchar(35),\
                                    @OptionValue varchar(12)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables(@table_name nvarchar(384), @table_owner nvarchar(384), @table_qualifier sysname,\
                               @table_type varchar(100), @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_ex(@table_server sysname, @table_name sysname, @table_schema sysname,\
                                  @table_catalog sysname, @table_type sysname, @fUsePattern bit) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_info_90_rowset(@table_name sysname, @table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_info_90_rowset2(@table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_info_90_rowset2_64(@table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_info_90_rowset_64(@table_name sysname, @table_schema sysname,\
                                                 @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_info_rowset(@table_name sysname, @table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_info_rowset2(@table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_info_rowset2_64(@table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_info_rowset_64(@table_name sysname, @table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_rowset(@table_name sysname, @table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_rowset2(@table_schema sysname, @table_type nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_tables_rowset_rmt(@table_server sysname, @table_catalog sysname, @table_name sysname,\
                                          @table_schema sysname, @table_type sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_tableswc(@table_name nvarchar(384), @table_owner nvarchar(384), @table_qualifier sysname,\
                                 @table_type varchar(100), @fUsePattern bit, @fTableCreated bit) as\
-- missing source code\
go\
\
create procedure sys.sp_trace_generateevent() as\
-- missing source code\
go\
\
create procedure sys.sp_try_set_session_context() as\
-- missing source code\
go\
\
create procedure sys.sp_unbindefault(@objname nvarchar(776), @futureonly varchar(15)) as\
-- missing source code\
go\
\
create procedure sys.sp_unbindrule(@objname nvarchar(776), @futureonly varchar(15)) as\
-- missing source code\
go\
\
create procedure sys.sp_unprepare() as\
-- missing source code\
go\
\
create procedure sys.sp_unsetapprole(@cookie varbinary(8000)) as\
-- missing source code\
go\
\
create procedure sys.sp_update_iq_object_version() as\
-- missing source code\
go\
\
create procedure sys.sp_update_snapshot_database_time() as\
-- missing source code\
go\
\
create procedure sys.sp_update_streaming_job(@name sysname, @statement nvarchar(max), @resources nvarchar(255)) as\
-- missing source code\
go\
\
create procedure sys.sp_updateextendedproperty(@name sysname, @value sql_variant, @level0type varchar(128),\
                                               @level0name sysname, @level1type varchar(128), @level1name sysname,\
                                               @level2type varchar(128), @level2name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_updatestats(@resample char(8)) as\
-- missing source code\
go\
\
create procedure sys.sp_upgrade_vdw_configuration_parameters() as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter1(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter10(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter2(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter3(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter4(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter5(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter6(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter7(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter8(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_user_counter9(@newvalue int) as\
-- missing source code\
go\
\
create procedure sys.sp_usertypes_rowset(@type_name sysname, @type_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_usertypes_rowset2(@type_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_usertypes_rowset_rmt(@type_server sysname, @type_catalog sysname, @type_name sysname,\
                                             @type_schema sysname, @assembly_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_validate_certificate_ca_chain(@certificateId int, @certificateName nvarchar(128)) as\
-- missing source code\
go\
\
create procedure sys.sp_validlang(@name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_validname(@name sysname, @raise_error bit) as\
-- missing source code\
go\
\
create procedure sys.sp_verify_database_ledger() as\
-- missing source code\
go\
\
create procedure sys.sp_verify_database_ledger_from_digest_storage() as\
-- missing source code\
go\
\
create procedure sys.sp_views_rowset(@view_name sysname, @view_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_views_rowset2(@view_schema sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_vupgrade_replication(@login sysname, @password sysname, @ver_old int, @force_remove tinyint,\
                                             @security_mode bit, @db_id int) as\
-- missing source code\
go\
\
create procedure sys.sp_wait_for_database_copy_sync() as\
-- missing source code\
go\
\
create procedure sys.sp_who(@loginame sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_who2(@loginame sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_xa_commit() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_end() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_forget() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_forget_ex() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_init() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_init_ex() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_prepare() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_prepare_ex() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_recover() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_rollback() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_rollback_ex() as\
-- missing source code\
go\
\
create procedure sys.sp_xa_start() as\
-- missing source code\
go\
\
create procedure sys.sp_xml_preparedocument() as\
-- missing source code\
go\
\
create procedure sys.sp_xml_removedocument() as\
-- missing source code\
go\
\
create procedure sys.sp_xml_schema_rowset(@collection_name sysname, @schema_name sysname, @target_namespace sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_xml_schema_rowset2(@schema_name sysname, @target_namespace sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_bind_db_resource_pool(@database_name sysname, @pool_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_checkpoint_force_garbage_collection(@dbname sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_control_proc_exec_stats(@new_collection_value bit, @old_collection_value bit) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_control_query_exec_stats(@new_collection_value bit, @database_id int, @xtp_object_id int,\
                                                     @old_collection_value bit) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_flush_temporal_history(@schema_name sysname, @object_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_force_gc(@database_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_kill_active_transactions(@database_name sysname) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_merge_checkpoint_files(@database_name sysname, @transaction_lower_bound bigint,\
                                                   @transaction_upper_bound bigint) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_objects_present(@database_name sysname, @xtp_objects_present bit,\
                                            @include_table_types bit) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_set_memory_quota(@database_name sysname, @target_user_memory_quota bigint) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_slo_can_downgrade(@database_name sysname, @xtp_can_downgrade bit, @allow_table_types bit) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_slo_downgrade_finished(@database_name sysname, @result bit, @allow_table_types bit) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_slo_prepare_to_downgrade(@database_name sysname, @xtp_can_downgrade bit,\
                                                     @allow_table_types bit) as\
-- missing source code\
go\
\
create procedure sys.sp_xtp_unbind_db_resource_pool(@database_name sysname) as\
-- missing source code\
go\
\
create procedure sys.xp_replposteor() as\
-- missing source code\
go\
\
}