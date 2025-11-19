-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2025 at 01:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prand_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deceased_records`
--

CREATE TABLE `deceased_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `date_of_death` date NOT NULL,
  `tomb_number` varchar(255) NOT NULL,
  `tomb_location` varchar(255) NOT NULL,
  `next_of_kin_name` varchar(255) NOT NULL,
  `next_of_kin_relationship` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `payment_due_date` date DEFAULT NULL,
  `payment_status` enum('paid','pending','overdue') NOT NULL DEFAULT 'pending',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deceased_records`
--

INSERT INTO `deceased_records` (`id`, `fullname`, `birthday`, `date_of_death`, `tomb_number`, `tomb_location`, `next_of_kin_name`, `next_of_kin_relationship`, `contact_number`, `email`, `address`, `payment_due_date`, `payment_status`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Rosalie L. Sumugat', '1974-12-03', '2025-06-01', '12', 'South east A', 'John Carlo Sumugat', 'Son', '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', '2030-06-01', 'paid', 1, 1, '2025-10-20 08:12:23', '2025-10-20 08:43:34', NULL),
(2, 'Pedro E. Manzano', '1978-09-09', '2025-05-05', '55', 'North east A', 'John Carlo Sumugat', NULL, '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', '2030-05-05', 'paid', 1, 1, '2025-10-20 20:25:45', '2025-10-21 08:29:27', NULL),
(3, 'Juan Dela Cruz', '2002-09-09', '2025-09-09', '110', 'North east A', 'John Carlo Sumugat', 'Other', '09567460163', 'jcsumugatxd@gmail.com', 'Culasi Antique, Philippines', '2026-10-23', 'paid', 2, NULL, '2025-10-20 20:40:06', '2025-10-22 20:06:59', NULL),
(4, 'Saturtina Canata', '1999-09-13', '2025-10-15', '113', 'North East B', 'Alexander Canata', 'Son', '09122478658', NULL, 'Balac- balac Culasi', '2030-10-15', 'pending', 3, 3, '2025-10-22 20:04:18', '2025-10-22 20:13:55', NULL),
(5, 'Steve Jobs', '2015-01-10', '2025-10-27', '11', 'South West B', 'Sheryl Jobs', 'Sister', '09122478658', NULL, NULL, '2026-10-28', 'paid', 5, NULL, '2025-10-27 18:27:39', '2025-10-27 18:34:24', NULL),
(6, 'Aldren Dela  Cruz', '2018-06-13', '2025-10-27', '13', 'North East B', 'Sharon Dela Cruz', 'Spouse', '09122478658', NULL, NULL, '2026-10-28', 'paid', 5, NULL, '2025-10-27 19:03:54', '2025-10-27 19:05:33', NULL),
(7, 'adan', '2014-02-16', '2025-08-17', '25', 'South East B', 'sheryl', 'Sister', '09122478658', NULL, 'Balac-balac Culasi Antique', '2026-10-29', 'paid', 5, 5, '2025-10-28 19:13:16', '2025-10-28 19:20:53', '2025-10-28 19:20:53'),
(8, 'Saturtina Canata', '1987-09-09', '2024-08-06', '23', 'South West B', 'Alexander Canata', 'Brother', '09122478658', 'floresglendamie@gmail.com', ',njvj,h', '2030-08-06', 'paid', 5, NULL, '2025-11-18 00:22:58', '2025-11-18 00:22:58', NULL),
(9, 'juan dela cruz', '1988-03-13', '2025-11-18', '15', 'North West A', 'eric dela druz', 'Son', '09122478658', NULL, 'balac balac culasi antique', '2030-11-18', 'pending', 5, NULL, '2025-11-18 00:56:48', '2025-11-18 00:56:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_10_18_151938_create_deceased_records_table', 1),
(5, '2025_10_18_152358_create_payment_records_table', 1),
(6, '2025_10_18_152434_create_renewal_records_table', 1),
(7, '2025_10_18_152456_create_notice_distributions_table', 1),
(8, '2025_10_21_153206_add_mobile_number_to_users_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `notice_distributions`
--

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

--
-- Dumping data for table `notice_distributions`
--

INSERT INTO `notice_distributions` (`id`, `deceased_record_id`, `recipient_name`, `recipient_number`, `message`, `notice_type`, `status`, `sent_at`, `delivered_at`, `error_message`, `retry_count`, `sent_by`, `created_at`, `updated_at`) VALUES
(1, 2, 'John Carlo Sumugat', '09567460163', 'Dear John Carlo Sumugat, your tomb renewal is due. Please contact us or visit the office to process your renewal. Thank you.', 'renewal_notice', 'sent', '2025-10-20 20:36:45', NULL, NULL, 0, 2, '2025-10-20 20:36:45', '2025-10-20 20:36:45'),
(2, 3, 'John Carlo Sumugat', '09122478658', 'Dear John Carlo Sumugat, your tomb renewal is due. Please contact us or visit the office to process your renewal. Thank you.', 'renewal_notice', 'sent', '2025-10-22 19:56:11', NULL, NULL, 0, 3, '2025-10-22 19:56:11', '2025-10-22 19:56:11'),
(3, 5, 'Sheryl Jobs', '09122478658', 'Dear Sheryl Jobs, your payment is now overdue. Please settle your account immediately to avoid penalties. Thank you.', 'overdue_notice', 'sent', '2025-10-27 18:45:18', NULL, NULL, 0, 5, '2025-10-27 18:45:18', '2025-10-27 18:45:18'),
(4, 6, 'Sharon Dela Cruz', '09122478658', 'Dear Sharon............', 'general', 'sent', '2025-10-27 19:08:38', NULL, NULL, 0, 5, '2025-10-27 19:08:38', '2025-10-27 19:08:38'),
(5, 2, 'John Carlo Sumugat', '09567460163', 'Dear Jc.....', 'general', 'sent', '2025-10-28 01:08:57', NULL, NULL, 0, 5, '2025-10-28 01:08:57', '2025-10-28 01:08:57'),
(6, 7, 'sheryl', '09122478658', 'Dear Shyrl', 'general', 'sent', '2025-10-28 19:19:28', NULL, NULL, 0, 5, '2025-10-28 19:19:28', '2025-10-28 19:19:28'),
(7, 8, 'Alexander Canata', '09122478658', 'Dear , your tomb renewal is due. Please contact us or visit the office to process your renewal. Thank you.', 'renewal_notice', 'sent', '2025-11-18 00:24:47', NULL, NULL, 0, 5, '2025-11-18 00:24:47', '2025-11-18 00:24:47'),
(8, 9, 'eric dela druz', '09122478658', 'dear....', 'general', 'sent', '2025-11-18 01:02:44', NULL, NULL, 0, 5, '2025-11-18 01:02:44', '2025-11-18 01:02:44');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_records`
--

CREATE TABLE `payment_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `deceased_record_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_type` enum('initial','renewal','penalty') NOT NULL DEFAULT 'initial',
  `payment_method` enum('cash','gcash','bank_transfer','check') NOT NULL DEFAULT 'cash',
  `receipt_number` varchar(255) NOT NULL,
  `official_receipt_number` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `received_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_records`
--

INSERT INTO `payment_records` (`id`, `deceased_record_id`, `amount`, `payment_date`, `payment_type`, `payment_method`, `receipt_number`, `official_receipt_number`, `remarks`, `received_by`, `created_at`, `updated_at`) VALUES
(1, 3, 1500.00, '2025-10-21', 'initial', 'cash', 'RCP-20251021-SQWR9R', NULL, NULL, 2, '2025-10-20 20:45:32', '2025-10-20 20:45:32'),
(2, 3, 5000.00, '2025-10-23', 'renewal', 'cash', 'RCP-20251023-XFECMW', NULL, NULL, 3, '2025-10-22 20:06:59', '2025-10-22 20:06:59'),
(3, 5, 5000.00, '2025-10-28', 'initial', 'cash', 'RCP-20251028-OOBEX7', NULL, NULL, 5, '2025-10-27 18:34:24', '2025-10-27 18:34:24'),
(4, 6, 5000.00, '2025-10-28', 'initial', 'cash', 'RCP-20251028-XIMVSU', NULL, NULL, 5, '2025-10-27 19:05:33', '2025-10-27 19:05:33'),
(5, 7, 1000.00, '2025-10-29', 'initial', 'cash', 'RCP-20251029-MPUEUF', NULL, NULL, 5, '2025-10-28 19:16:32', '2025-10-28 19:16:32'),
(6, 7, 1000.00, '2025-10-29', 'initial', 'cash', 'RCP-20251029-CXQ5GE', '4413551', NULL, 5, '2025-10-28 19:17:44', '2025-10-28 19:17:44');

-- --------------------------------------------------------

--
-- Table structure for table `renewal_records`
--

CREATE TABLE `renewal_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `deceased_record_id` bigint(20) UNSIGNED NOT NULL,
  `renewal_date` date NOT NULL,
  `next_renewal_date` date NOT NULL,
  `renewal_fee` decimal(10,2) NOT NULL,
  `status` enum('active','expired','pending') NOT NULL DEFAULT 'pending',
  `processed_by` bigint(20) UNSIGNED NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `renewal_records`
--

INSERT INTO `renewal_records` (`id`, `deceased_record_id`, `renewal_date`, `next_renewal_date`, `renewal_fee`, `status`, `processed_by`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 5, '2025-10-28', '2030-10-28', 5000.00, 'active', 5, NULL, '2025-10-27 18:36:31', '2025-10-27 18:36:31'),
(2, 6, '2025-10-28', '2030-10-28', 5000.00, 'active', 5, NULL, '2025-10-27 19:06:51', '2025-10-27 19:06:51');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4yEaP8ZztPPKstAlTrJH5H2ssBBepNHfbQLWY93q', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiaEIyV1lyRTZyUkpsUEpTdE9qUVZvMDVob1hxanlkZWNhUmJlU290VCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=', 1763510270),
('iyOBnxe219H4ZSySDPfKgW9uCKrEgWqgjh0SEa2n', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVGh5RnRaR0puT0l4aHNKRkhLVmdscjg5N25sU1NpN0JpWU9JUHlzMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1763465806),
('K5VrHNiuo2RB5gNikojJaNcfX1V41ZqXtAb4PDpr', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoibUtaTUlaU2ZqRUYycXQ5b1pxbmdCYVdaWmNIRmc5dVVWd3ZyWW5aeCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJuZXciO2E6MDp7fXM6Mzoib2xkIjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9wYXltZW50cyI7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1763477248),
('QVCy98AelYPoutvyTU7cM3wkdI2uIxaTdxEbKYS4', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiVWI1N3JpaWdrc1pjNmVpeXpFWE9PV3d3VDJhWE5pTHRLQmhlek0yZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=', 1763466514);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'John Carlo Sumugat', 'jcsumugatxd@gmail.com', '09567460163', NULL, '$2y$12$jKCDxP0DlNaCM.7xDR1V7./oOmE8BEqr8C1ZFMx28L0ADIh7H86hu', NULL, '2025-10-20 08:09:47', '2025-10-20 08:09:47'),
(2, 'Jonah Saracanlao', 'jonahsaracanlao@gmail.com', '09569833156', NULL, '$2y$12$cBcQNuFFqJCE3Ppr3mL1OuFSKffjx0jRBc0TezjtbVCkBJDn1e8eC', NULL, '2025-10-20 20:34:59', '2025-10-20 20:34:59'),
(3, 'May Ann Antonio', 'mayannantonio478@gmail.com', '09705984260', NULL, '$2y$12$iJGIsIcEe9OU2aIkypl2ju/WlYICBwKqZU2k2saEu/L2fd7U/bHaW', NULL, '2025-10-22 19:54:03', '2025-10-22 19:54:03'),
(4, 'Aliana Cabigon', 'cabigonma.aliana17@gmail.com', '09671679772', NULL, '$2y$12$vceCUn4REuIX26FmbaY2je47neny.weO9jACVk.2/.IdsImG1euei', NULL, '2025-10-23 17:35:55', '2025-10-23 17:35:55'),
(5, 'Glenda Mie Flores', 'floresglendamie@gmail.com', '09485266455', NULL, '$2y$12$3OTrxlSBHtFZLVdwenSUPOE4M4Fp3YV9JyNhh2gaBzJrQw5JS..Fe', NULL, '2025-10-23 18:36:03', '2025-10-23 18:36:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
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
  ADD UNIQUE KEY `deceased_records_tomb_number_unique` (`tomb_number`),
  ADD KEY `deceased_records_created_by_foreign` (`created_by`),
  ADD KEY `deceased_records_updated_by_foreign` (`updated_by`);

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
  ADD KEY `payment_records_received_by_foreign` (`received_by`);

--
-- Indexes for table `renewal_records`
--
ALTER TABLE `renewal_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `renewal_records_deceased_record_id_foreign` (`deceased_record_id`),
  ADD KEY `renewal_records_processed_by_foreign` (`processed_by`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payment_records`
--
ALTER TABLE `payment_records`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `renewal_records`
--
ALTER TABLE `renewal_records`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
