-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 03, 2025 at 02:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `deceased_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `date_of_death` date NOT NULL,
  `date_of_burial` date DEFAULT NULL,
  `tomb_number` varchar(255) NOT NULL,
  `tomb_location` varchar(255) NOT NULL,
  `next_of_kin_name` varchar(255) NOT NULL,
  `next_of_kin_relationship` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `total_amount_due` decimal(10,2) DEFAULT 5000.00,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `balance` decimal(10,2) DEFAULT 5000.00,
  `is_fully_paid` tinyint(1) DEFAULT 0,
  `last_payment_date` date DEFAULT NULL,
  `payment_due_date` date DEFAULT NULL,
  `payment_status` enum('paid','pending','overdue') NOT NULL DEFAULT 'pending',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `deceased_records` (`id`, `fullname`, `birthday`, `date_of_death`, `date_of_burial`, `tomb_number`, `tomb_location`, `next_of_kin_name`, `next_of_kin_relationship`, `contact_number`, `email`, `address`, `total_amount_due`, `amount_paid`, `balance`, `is_fully_paid`, `last_payment_date`, `payment_due_date`, `payment_status`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Rosalie L. Sumugat', '1974-12-03', '2025-06-01', '2023-06-15', '12', 'South east A', 'John Carlo Sumugat', 'Son', '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', 5000.00, 3500.00, 1500.00, 0, '2025-11-30', '2030-06-01', 'pending', 2, 2, '2025-10-20 08:12:23', '2025-12-01 20:34:37', '2025-12-01 20:34:37'),
(2, 'Pedro E. Manzano', '1978-09-09', '2025-05-05', '2023-06-15', '55', 'North east A', 'John Carlo Sumugat', NULL, '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', 5000.00, 0.00, 5000.00, 0, NULL, '2030-05-05', 'pending', 2, 2, '2025-10-20 20:25:45', '2025-12-01 20:34:43', '2025-12-01 20:34:43'),
(3, 'Juan Dela Cruz', '2002-09-09', '2025-09-09', '2023-06-15', '110', 'North east A', 'John Carlo Sumugat', 'Other', '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', 5000.00, 0.00, 5000.00, 0, '2025-10-23', '2026-10-23', 'pending', 2, 2, '2025-10-20 20:40:06', '2025-12-01 20:34:49', '2025-12-01 20:34:49'),
(4, 'Saturtina Canata', '1999-09-13', '2025-10-15', '2023-06-15', '113', 'North East B', 'Alexander Canata', 'Son', '09122478658', NULL, 'Balac- balac Culasi', 5000.00, 0.00, 5000.00, 0, '2025-11-19', '2030-10-15', 'pending', 2, 2, '2025-10-22 20:04:18', '2025-12-01 20:34:55', '2025-12-01 20:34:55'),
(5, 'Steve Juanites Jr.', '1995-01-10', '2025-10-27', '2025-11-09', '11', 'South West B', 'Sheryl Juanites', 'Spouse', '09122478658', NULL, 'Balac-balac, Culasi, Antique', 5000.00, 0.00, 5000.00, 0, '2025-10-28', '2030-11-09', 'pending', 2, 2, '2025-10-27 18:27:39', '2025-12-02 02:51:01', NULL),
(6, 'Aldren Dela  Cruz', '1993-06-13', '2025-10-30', '2025-11-08', '13', 'North East B', 'Sharon Dela Cruz', 'Spouse', '09122478658', NULL, 'Balac-balac, Culasi, Antique', 5000.00, 0.00, 5000.00, 0, '2025-10-28', '2030-11-08', 'pending', 2, 2, '2025-10-27 19:03:54', '2025-12-02 02:54:25', NULL),
(7, 'adan', '2014-02-16', '2025-08-17', '2023-06-15', '25', 'South East B', 'sheryl', 'Sister', '09122478658', NULL, 'Balac-balac Culasi Antique', 5000.00, 0.00, 5000.00, 0, NULL, '2026-10-29', 'pending', 2, 2, '2025-10-28 19:13:16', '2025-10-28 19:20:53', '2025-10-28 19:20:53'),
(8, 'Saturtina Canata', '1987-09-09', '2025-11-06', '2025-11-15', '23', 'South West B', 'Alexander Canata', 'Spouse', '09122478658', 'floresglendamie@gmail.com', 'Caridad, Culasi, Antique', 5000.00, 0.00, 5000.00, 0, NULL, '2030-11-15', 'pending', 2, 2, '2025-11-18 00:22:58', '2025-12-02 02:56:19', NULL),
(9, 'Juan Dela Cruz', '1988-03-13', '2025-11-03', '2025-11-10', '15', 'North West A', 'Eric Dela Cruz', 'Son', '09122478658', NULL, 'Balac- balac, Culasi Antique', 5000.00, 2500.00, 2500.00, 0, '2025-12-03', '2030-11-10', 'pending', 2, 2, '2025-11-18 00:56:48', '2025-12-03 02:15:38', NULL),
(10, 'Juan dela cruz', '1998-11-16', '2020-11-19', '2023-06-15', '10', 'North East A', 'Eric dela druz', 'Other', '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', 5000.00, 0.00, 5000.00, 0, '2025-11-19', '2028-06-15', 'pending', 2, 2, '2025-11-18 16:23:53', '2025-12-01 20:24:52', '2025-12-01 20:24:52'),
(11, 'Rodolfo Badol', '1995-11-13', '2025-11-19', '2023-06-15', '17', 'North West B', 'Alex Badol', 'Brother', '09122478658', NULL, 'Balac-balac, Culasi, Antique', 5000.00, 0.00, 5000.00, 0, '2025-11-19', '2030-11-19', 'pending', 2, 2, '2025-11-18 23:26:22', '2025-12-01 20:24:38', '2025-12-01 20:24:38'),
(12, 'Alishya Bernardo', '1998-11-23', '2025-10-23', '2023-06-15', '18', 'North East B', 'Emerald Bernardo', 'Sister', '09122478658', NULL, 'Culasi, Antique, Philippines', 5000.00, 0.00, 5000.00, 0, '2025-11-19', '2030-10-23', 'pending', 2, 2, '2025-11-18 23:35:20', '2025-12-01 20:24:33', '2025-12-01 20:24:33'),
(13, 'Ana Delima', '2001-01-01', '2025-11-11', '2023-06-15', '2', 'North East B', 'Elsa Delima', 'Sister', '09122478658', NULL, 'Culasi, Antique, Philippines', 5000.00, 0.00, 5000.00, 0, '2025-11-19', '2030-11-11', 'pending', 2, 2, '2025-11-18 23:50:35', '2025-12-01 20:24:28', '2025-12-01 20:24:28'),
(14, 'Allan Catague', '1997-11-13', '2025-11-18', '2023-06-15', '5', 'North West B', 'Richard Catague', 'Brother', '09122478658', NULL, 'Culasi, Antique, Philippines', 5000.00, 0.00, 5000.00, 0, '2025-11-19', '2030-11-18', 'pending', 2, 2, '2025-11-19 01:05:12', '2025-12-01 20:24:24', '2025-12-01 20:24:24'),
(15, 'Aquilina O. Domingo', '1998-07-05', '2020-02-04', '2023-06-15', '20', 'North East A', 'Elma Domingo', 'Daughter', '09691849383', NULL, 'bgfgf', 5000.00, 5000.00, 0.00, 1, '2025-12-02', '2028-06-15', 'paid', 2, 2, '2025-11-26 23:20:44', '2025-12-01 20:24:18', '2025-12-01 20:24:18'),
(16, 'Maria Delima', '1998-11-13', '2025-11-26', '2023-06-15', '35', 'North West A', 'Aliana Delima', 'Sister', '09122478658', NULL, 'Jalandoni Culasi Antique', 5000.00, 0.00, 5000.00, 0, '2025-11-27', '2030-11-26', 'pending', 2, 2, '2025-11-27 00:11:48', '2025-12-01 20:24:12', '2025-12-01 20:24:12'),
(17, 'John Dave Curtez', '1998-11-12', '2025-11-26', '2023-06-15', '6', 'South West B', 'May Ann Curtez', 'Spouse', '09122478658', NULL, 'Balac- balac Culasi Antique', 5000.00, 0.00, 5000.00, 0, '2025-11-27', '2030-11-26', 'pending', 2, 2, '2025-11-27 00:18:31', '2025-12-01 20:24:07', '2025-12-01 20:24:07'),
(18, 'Noe Nicolas', '1999-11-21', '2025-11-26', '2023-06-15', '1', 'South West A', 'Lycah Yap', 'Spouse', '09122478658', NULL, 'Caridad Culasi Antique', 5000.00, 0.00, 5000.00, 0, '2025-11-27', '2035-11-26', 'pending', 2, 2, '2025-11-27 01:14:06', '2025-12-01 20:24:01', '2025-12-01 20:24:01'),
(19, 'Charlot lopez', '1999-09-13', '2025-11-25', '2023-06-15', '28', 'South West A', 'Alex Lopez', 'Brother', '09122478658', NULL, 'San Antonio Culasi Antique', 5000.00, 0.00, 5000.00, 0, '2025-11-27', '2035-11-25', 'pending', 2, 2, '2025-11-27 01:26:02', '2025-12-01 20:23:54', '2025-12-01 20:23:54'),
(23, 'Pedro Cortez', '1990-02-02', '2020-12-10', '2020-12-15', '28', 'North East A', 'Alex Lopez', 'Spouse', '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', 5000.00, 5000.00, 0.00, 1, '2025-12-02', '2025-12-15', 'paid', 1, NULL, '2025-11-30 02:17:58', '2025-12-01 20:23:38', '2025-12-01 20:23:38'),
(24, 'Bernardo Magtulis', '1986-04-12', '2024-08-21', '2024-08-30', '1', 'North East A', 'Janice Magtulis', 'Spouse', '09122478658', NULL, 'Centro Norte, Culasi, Antique', 5000.00, 5000.00, 0.00, 1, '2025-12-02', '2029-08-30', 'paid', 2, NULL, '2025-12-01 19:00:40', '2025-12-01 20:23:33', '2025-12-01 20:23:33'),
(26, 'Susan Alvarez', '1989-02-04', '2025-11-10', '2025-11-23', '13', 'North East A', 'Elma Alvarez', 'Daughter', '09122478658', NULL, 'Centro Norte, Culasi, Antique', 5000.00, 5000.00, 0.00, 1, '2025-12-02', '2030-11-23', 'paid', 2, NULL, '2025-12-02 03:01:54', '2025-12-02 03:02:23', NULL),
(27, 'Rodolfo Cabigon', '1989-04-15', '2025-11-15', '2025-11-24', '24', 'North East B', 'Rachel Cabigon', 'Spouse', '09122478658', NULL, 'Centro Sur, Culasi, Antique', 5000.00, 5000.00, 0.00, 1, '2025-11-15', '2030-11-24', 'paid', 2, NULL, '2025-12-02 03:06:19', '2025-12-02 03:06:50', NULL),
(28, 'Federico Cabangon', '1991-09-28', '2025-11-23', '2025-11-30', '23', 'South East A', 'Jessica Cabangon', 'Daughter', '09122478658', NULL, 'Fe Caridad, Culasi, Antique', 5000.00, 5000.00, 0.00, 1, '2025-12-02', '2030-11-30', 'paid', 2, NULL, '2025-12-02 03:11:51', '2025-12-02 03:12:04', NULL),
(29, 'Charlot lopez', '1998-09-09', '2020-03-04', '2020-03-15', '1', 'North West A', 'Alex Lopez', 'Other', '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', 5000.00, 4999.97, 0.03, 0, '2025-12-03', '2025-03-15', 'pending', 1, NULL, '2025-12-03 02:21:28', '2025-12-03 02:22:14', NULL);


CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_10_18_151938_create_deceased_records_table', 1),
(5, '2025_10_18_152358_create_payment_records_table', 1),
(6, '2025_10_18_152434_create_renewal_records_table', 1),
(7, '2025_10_18_152456_create_notice_distributions_table', 1),
(8, '2025_10_21_153206_add_mobile_number_to_users_table', 2);


CREATE TABLE `notice_distributions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `deceased_record_id` bigint(20) UNSIGNED NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `recipient_number` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `notice_type` enum('payment_reminder','renewal_notice','overdue_notice','general') NOT NULL,
  `status` enum('pending','sent','failed','delivered') NOT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `retry_count` int(11) NOT NULL DEFAULT 0,
  `sent_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `notice_distributions` (`id`, `deceased_record_id`, `recipient_name`, `recipient_number`, `message`, `notice_type`, `status`, `sent_at`, `delivered_at`, `error_message`, `retry_count`, `sent_by`, `created_at`, `updated_at`) VALUES
(13, 1, 'John Carlo Sumugat', '09567460163', 'Dear John Carlo Sumugat, this is a reminder about the upcoming payment for the tomb at our cemetery. Please settle the payment as soon as possible. Thank you.', 'payment_reminder', 'failed', NULL, NULL, 'Client error: `POST https://api.semaphore.co/api/v4/messages` resulted in a `403 Forbidden` response:\nYour account has not yet been approved for sending messages. Please either top-up your account or wait for your account  (truncated...)\n', 0, 1, '2025-11-29 19:48:11', '2025-11-29 19:48:12');


CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('jcsumugatxd@gmail.com', '$2y$12$w8OaB6Q856d8P01r3509S.dgMAkC/58gnb3Fyx191BXqMbdWyHqyq', '2025-11-18 21:54:49');


CREATE TABLE `payment_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `deceased_record_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_type` enum('initial','renewal','penalty') NOT NULL DEFAULT 'initial',
  `payment_for` enum('initial','renewal','balance','penalty') DEFAULT 'initial',
  `coverage_status` enum('initial','renewal') NOT NULL DEFAULT 'initial',
  `coverage_start_date` date DEFAULT NULL,
  `coverage_end_date` date DEFAULT NULL,
  `previous_balance` decimal(10,2) DEFAULT NULL,
  `remaining_balance` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('cash','gcash','bank_transfer','check') NOT NULL DEFAULT 'cash',
  `receipt_number` varchar(255) NOT NULL,
  `official_receipt_number` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `received_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `payment_records` (`id`, `deceased_record_id`, `amount`, `payment_date`, `payment_type`, `payment_for`, `coverage_status`, `coverage_start_date`, `coverage_end_date`, `previous_balance`, `remaining_balance`, `payment_method`, `receipt_number`, `official_receipt_number`, `remarks`, `received_by`, `created_at`, `updated_at`) VALUES
(32, 9, 2500.00, '2025-12-03', 'initial', 'balance', 'initial', NULL, NULL, 5000.00, 2500.00, 'cash', 'RCP-20251203-K64MOX', NULL, NULL, 1, '2025-12-03 02:15:38', '2025-12-03 02:15:38'),
(33, 29, 4999.97, '2025-12-03', 'renewal', 'balance', 'initial', NULL, NULL, 5000.00, 0.03, 'cash', 'RCP-20251203-YAWQNZ', NULL, NULL, 1, '2025-12-03 02:22:14', '2025-12-03 02:22:14');


CREATE TABLE `renewal_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `deceased_record_id` bigint(20) UNSIGNED NOT NULL,
  `renewal_date` date NOT NULL,
  `next_renewal_date` date NOT NULL,
  `renewal_fee` decimal(10,2) NOT NULL,
  `total_amount_due` decimal(10,2) DEFAULT 5000.00,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `balance` decimal(10,2) DEFAULT 5000.00,
  `is_fully_paid` tinyint(1) DEFAULT 0,
  `previous_balance` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('paid','partial','pending','overdue') NOT NULL DEFAULT 'pending',
  `status` enum('active','expired','pending') NOT NULL DEFAULT 'pending',
  `processed_by` bigint(20) UNSIGNED NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('FSEwsQKGCihemlCg3ygDRY3m72XehldcmtybLwLf', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiTnhmUUJnbmVBaVRQNlFQSndla0pJY2Z3REtkM3E5NXZ5QzFKTTRGVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXhwaXJpbmctcmVjb3Jkcy1saXN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1764757531);


CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'John Carlo Sumugat', 'jcsumugatxd@gmail.com', '09567460163', NULL, '$2y$12$jKCDxP0DlNaCM.7xDR1V7./oOmE8BEqr8C1ZFMx28L0ADIh7H86hu', NULL, '2025-10-20 08:09:47', '2025-10-20 08:09:47'),
(2, 'Jonah Saracanlao', 'jonahsaracanlao@gmail.com', '09569833156', NULL, '$2y$12$cBcQNuFFqJCE3Ppr3mL1OuFSKffjx0jRBc0TezjtbVCkBJDn1e8eC', NULL, '2025-10-20 20:34:59', '2025-10-20 20:34:59');


ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `deceased_records`
--
ALTER TABLE `deceased_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `deceased_records_tomb_location_number_unique` (`tomb_location`,`tomb_number`),
  ADD KEY `deceased_records_created_by_foreign` (`created_by`),
  ADD KEY `deceased_records_updated_by_foreign` (`updated_by`),
  ADD KEY `idx_balance` (`balance`),
  ADD KEY `idx_amount_paid` (`amount_paid`),
  ADD KEY `idx_is_fully_paid` (`is_fully_paid`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notice_distributions`
--
ALTER TABLE `notice_distributions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notice_distributions_deceased_record_id_foreign` (`deceased_record_id`),
  ADD KEY `notice_distributions_sent_by_foreign` (`sent_by`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_records`
--
ALTER TABLE `payment_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_records_receipt_number_unique` (`receipt_number`),
  ADD KEY `payment_records_deceased_record_id_foreign` (`deceased_record_id`),
  ADD KEY `payment_records_received_by_foreign` (`received_by`),
  ADD KEY `idx_payment_for` (`payment_for`);

--
-- Indexes for table `renewal_records`
--
ALTER TABLE `renewal_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `renewal_records_deceased_record_id_foreign` (`deceased_record_id`),
  ADD KEY `renewal_records_processed_by_foreign` (`processed_by`),
  ADD KEY `idx_balance` (`balance`),
  ADD KEY `idx_is_fully_paid` (`is_fully_paid`),
  ADD KEY `idx_payment_status` (`payment_status`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deceased_records`
--
ALTER TABLE `deceased_records`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notice_distributions`
--
ALTER TABLE `notice_distributions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `payment_records`
--
ALTER TABLE `payment_records`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `renewal_records`
--
ALTER TABLE `renewal_records`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deceased_records`
--
ALTER TABLE `deceased_records`
  ADD CONSTRAINT `deceased_records_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `deceased_records_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `notice_distributions`
--
ALTER TABLE `notice_distributions`
  ADD CONSTRAINT `notice_distributions_deceased_record_id_foreign` FOREIGN KEY (`deceased_record_id`) REFERENCES `deceased_records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notice_distributions_sent_by_foreign` FOREIGN KEY (`sent_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment_records`
--
ALTER TABLE `payment_records`
  ADD CONSTRAINT `payment_records_deceased_record_id_foreign` FOREIGN KEY (`deceased_record_id`) REFERENCES `deceased_records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_records_received_by_foreign` FOREIGN KEY (`received_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `renewal_records`
--
ALTER TABLE `renewal_records`
  ADD CONSTRAINT `renewal_records_deceased_record_id_foreign` FOREIGN KEY (`deceased_record_id`) REFERENCES `deceased_records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `renewal_records_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
