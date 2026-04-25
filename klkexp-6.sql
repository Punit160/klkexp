-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 02, 2026 at 11:56 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `klkexp`
--

-- --------------------------------------------------------

--
-- Table structure for table `ExpensePayment`
--

CREATE TABLE `ExpensePayment` (
  `id` int(11) NOT NULL,
  `company_id` varchar(191) NOT NULL,
  `project_name` varchar(191) NOT NULL,
  `project_state` varchar(191) NOT NULL,
  `project_district` varchar(191) NOT NULL,
  `project_village` varchar(191) NOT NULL,
  `amount` double NOT NULL DEFAULT 0,
  `amount_change_by` int(11) DEFAULT NULL,
  `requested_by` int(11) NOT NULL,
  `requested_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `manager_id` int(11) NOT NULL,
  `approval_status` int(11) NOT NULL DEFAULT 0,
  `manager_remarks` varchar(191) DEFAULT NULL,
  `review_assign` tinyint(1) NOT NULL DEFAULT 0,
  `reviewer_id` int(11) DEFAULT NULL,
  `reviewer_remarks` varchar(191) DEFAULT NULL,
  `reviewer_approval_status` int(11) NOT NULL DEFAULT 0,
  `reviewer_status` tinyint(1) NOT NULL DEFAULT 0,
  `payment_status` int(11) NOT NULL DEFAULT 0,
  `remarks` varchar(191) DEFAULT NULL,
  `document` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `created_by` varchar(191) DEFAULT NULL,
  `intervention` int(11) NOT NULL DEFAULT 0,
  `managertoreviewer` varchar(191) NOT NULL DEFAULT '',
  `approved_amount` double DEFAULT 0,
  `final_approved_amount` double DEFAULT 0,
  `financial_year` varchar(191) NOT NULL DEFAULT '',
  `paid_amount` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ExpensePayment`
--

INSERT INTO `ExpensePayment` (`id`, `company_id`, `project_name`, `project_state`, `project_district`, `project_village`, `amount`, `amount_change_by`, `requested_by`, `requested_date`, `manager_id`, `approval_status`, `manager_remarks`, `review_assign`, `reviewer_id`, `reviewer_remarks`, `reviewer_approval_status`, `reviewer_status`, `payment_status`, `remarks`, `document`, `created_at`, `updated_at`, `created_by`, `intervention`, `managertoreviewer`, `approved_amount`, `final_approved_amount`, `financial_year`, `paid_amount`) VALUES
(16, 'klk1234', '10', 'Ullam cillum est vol', 'Iusto doloremque opt', 'Ut ut qui est conseq', 83000, NULL, 1, '2026-03-31 13:01:20.483', 1, 1, 'Paid', 0, NULL, NULL, 0, 0, 1, NULL, NULL, '2026-03-31 13:01:20.483', '2026-03-31 13:02:35.097', 'amit.sharma@example.com', 2, '', 0, 83000, '2025-2026', 55600),
(17, 'klk1234', '3', 'Upjammu', 'jammu', 'vill', 3000, NULL, 1, '2026-03-31 13:03:22.344', 1, 2, 'Reject', 0, NULL, NULL, 0, 0, 0, NULL, NULL, '2026-03-31 13:03:22.344', '2026-03-31 13:04:25.495', 'amit.sharma@example.com', 5, '', 0, 0, '2025-2026', 0),
(18, 'klk1234', '9', 'karnatka', 'banglore', 'village1', 40000, NULL, 1, '2026-03-31 13:05:14.415', 12, 0, NULL, 0, NULL, NULL, 0, 0, 0, NULL, NULL, '2026-03-31 13:05:14.415', '2026-03-31 13:05:14.415', 'amit.sharma@example.com', 6, '', 0, 0, '2025-2026', 0),
(19, 'klk1234', '3', 'Jammu', 'Reasi', 'vill', 10000, NULL, 1, '2026-03-31 13:06:19.330', 1, 1, 'Approved', 1, 1, NULL, 0, 0, 0, NULL, NULL, '2026-03-31 13:06:19.330', '2026-03-31 13:08:48.682', 'amit.sharma@example.com', 1, 'Assign', 0, 7000, '2025-2026', 0);

-- --------------------------------------------------------

--
-- Table structure for table `ExpensePaymentTransaction`
--

CREATE TABLE `ExpensePaymentTransaction` (
  `id` int(11) NOT NULL,
  `expense_id` int(11) NOT NULL,
  `accountant_id` int(11) DEFAULT NULL,
  `payment_amount` double NOT NULL,
  `payment_mode` varchar(191) NOT NULL,
  `payment_date` datetime(3) NOT NULL,
  `reference_no` varchar(191) DEFAULT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ExpensePaymentTransaction`
--

INSERT INTO `ExpensePaymentTransaction` (`id`, `expense_id`, `accountant_id`, `payment_amount`, `payment_mode`, `payment_date`, `reference_no`, `remarks`, `created_at`) VALUES
(15, 16, 1, 5600, 'Cash', '2026-03-31 00:00:00.000', 'cdsazc', 'Paid', '2026-03-31 13:01:56.579'),
(16, 16, 1, 50000, 'Cash', '2026-03-31 00:00:00.000', 'cdsazc', 'dsaxds', '2026-03-31 13:02:35.070');

-- --------------------------------------------------------

--
-- Table structure for table `Intervention`
--

CREATE TABLE `Intervention` (
  `id` int(11) NOT NULL,
  `company_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `created_by` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Intervention`
--

INSERT INTO `Intervention` (`id`, `company_id`, `name`, `status`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'klk1234', 'Food', 1, '2026-03-25 07:41:18.549', '2026-03-25 07:41:18.549', 'amit.sharma@example.com'),
(2, 'klk1234', 'Sopoline Kinney', 1, '2026-03-25 07:49:36.997', '2026-03-25 07:49:36.997', 'amit.sharma@example.com'),
(3, 'klk1234', 'Summer Maldonado', 1, '2026-03-25 07:49:41.547', '2026-03-25 07:49:41.547', 'amit.sharma@example.com'),
(5, 'klk1234', 'Travel', 1, '2026-03-28 11:53:38.425', '2026-03-28 11:53:38.425', 'amit.sharma@example.com'),
(6, 'klk1234', 'Hotel', 1, '2026-03-31 10:12:19.448', '2026-03-31 10:12:19.448', 'amit.sharma@example.com');

-- --------------------------------------------------------

--
-- Table structure for table `Permission`
--

CREATE TABLE `Permission` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `label` varchar(191) NOT NULL,
  `module` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `company_id` varchar(191) NOT NULL,
  `created_by` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Permission`
--

INSERT INTO `Permission` (`id`, `name`, `label`, `module`, `created_at`, `company_id`, `created_by`) VALUES
(1, 'create_expense', 'Create Expense', 'Expense', '2026-03-31 06:47:01.363', 'klk1234', '1'),
(2, 'view_expense', 'View Expense', 'Expense', '2026-03-31 06:47:43.458', 'klk1234', '1'),
(25, 'edit_expense', 'Edit Expense', 'Expense', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(26, 'delete_expense', 'Delete Expense', 'Expense', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(27, 'approve_expense_manager', 'Manager Approve Expense', 'Expense', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(28, 'approve_expense_reviewer', 'Reviewer Approve Expense', 'Expense', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(29, 'assign_reviewer', 'Assign Reviewer', 'Expense', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(30, 'create_project', 'Create Project', 'Project', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(31, 'view_project', 'View Project', 'Project', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(32, 'edit_project', 'Edit Project', 'Project', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(33, 'delete_project', 'Delete Project', 'Project', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(34, 'create_user', 'Create User', 'User', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(35, 'view_user', 'View User', 'User', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(36, 'edit_user', 'Edit User', 'User', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(37, 'delete_user', 'Delete User', 'User', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(38, 'create_role', 'Create Role', 'Role', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(39, 'view_role', 'View Role', 'Role', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(40, 'edit_role', 'Edit Role', 'Role', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(41, 'delete_role', 'Delete Role', 'Role', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(42, 'assign_permission', 'Assign Permission', 'Role', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(43, 'view_reports', 'View Reports', 'Report', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(44, 'export_reports', 'Export Reports', 'Report', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(45, 'create_intervention', 'Create Intervention', 'Intervention', '2026-03-31 12:29:43.000', 'klk1234', '1'),
(46, 'view_intervention', 'View Intervention', 'Intervention', '2026-03-31 12:29:43.000', 'klk1234', '1'),
(47, 'edit_intervention', 'Edit Intervention', 'Intervention', '2026-03-31 12:29:43.000', 'klk1234', '1'),
(48, 'delete_intervention', 'Delete Intervention', 'Intervention', '2026-03-31 12:29:43.000', 'klk1234', '1'),
(49, 'manager_expense', 'Manager Expense', 'Expense', '2026-03-31 06:47:43.458', 'klk1234', '1'),
(50, 'reviewer_expense', 'Reviewer Expense', 'Expense', '2026-03-31 06:47:43.458', 'klk1234', '1'),
(51, 'account_expense', 'Account Expense', 'Expense', '2026-03-31 06:47:43.458', 'klk1234', '1'),
(52, 'create_permission', 'Create Permission', 'Role', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(53, 'view_permission', 'View Permission', 'Role', '2026-03-31 12:27:58.000', 'klk1234', '1'),
(54, 'view_settings', 'View Setting', 'Settings', '2026-03-31 10:20:41.351', 'klk1234', '1'),
(55, 'manager_dashboard', 'Manager Dashboard', 'Dashboard', '2026-03-31 10:23:41.082', 'klk1234', '1'),
(56, 'admin_dashboard', 'Admin Dashboard', 'Dashboard', '2026-03-31 10:24:10.310', 'klk1234', '1');

-- --------------------------------------------------------

--
-- Table structure for table `Project`
--

CREATE TABLE `Project` (
  `id` int(11) NOT NULL,
  `company_id` varchar(191) NOT NULL,
  `project_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `financial_year` varchar(191) NOT NULL,
  `funder_name` varchar(191) NOT NULL,
  `manager_id` varchar(191) NOT NULL,
  `contact_person` varchar(191) NOT NULL,
  `contact_person_number` varchar(191) NOT NULL,
  `mou` varchar(191) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `created_by` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Project`
--

INSERT INTO `Project` (`id`, `company_id`, `project_id`, `name`, `description`, `start_date`, `end_date`, `financial_year`, `funder_name`, `manager_id`, `contact_person`, `contact_person_number`, `mou`, `status`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'klk1234', 'PROJ1774349825740', 'Kelsey Cotton', 'Officia unde debitis commodi laudantium', '1995-12-05 00:00:00.000', '1982-11-28 00:00:00.000', '1988', 'Anika Combs', '1', 'Officiis doloribus p', '86', 'http://localhost:5001/uploads/1774349825596.jpeg', 0, '2026-03-24 10:57:05.742', '2026-03-24 10:57:05.742', 'amit.sharma@example.com'),
(2, 'klk1234', 'PROJ1774353080655', 'Samuel Reese', 'Sit non tenetur quis dolores corporis sit illo libero incidunt est consectetur omnis officia tempor aute ipsum', '2026-01-03 00:00:00.000', '2006-03-08 00:00:00.000', '2014', 'Elijah Sampson', '1', 'Inventore laborum V', '835', NULL, 1, '2026-03-24 11:51:20.656', '2026-03-24 11:51:20.656', 'amit.sharma@example.com'),
(3, 'klk1234', 'PROJ1774353097721', 'Lana Lowe', 'Odio aliquip dolor corrupti nostrud enim consequatur id sit vero excepturi perferendis adipisicing corporis et sit deleniti est', '2015-09-24 00:00:00.000', '1999-06-10 00:00:00.000', '2002', 'Nadine Rosales', '1', 'Ipsum exercitation q', '564', NULL, 1, '2026-03-24 11:51:37.722', '2026-03-24 11:51:37.722', 'amit.sharma@example.com'),
(4, 'klk1234', 'PROJ1774353569390', 'Rajah Nelson', 'Tempor excepteur et itaque aliquip provident est commodo velit impedit', '2023-12-26 00:00:00.000', '2007-04-13 00:00:00.000', '1983', 'Chanda Lucas', '1', 'Minus consequuntur n', '6911123456', NULL, 0, '2026-03-24 11:59:29.394', '2026-03-24 11:59:29.394', 'amit.sharma@example.com'),
(5, 'klk1234', 'PROJ1774353809899', 'Darrel Meyers', 'Consectetur maiores rerum quam non optio veniam asperiores incidunt architecto', '1972-03-04 00:00:00.000', '1974-04-21 00:00:00.000', '1982', 'Gillian Sharp', '1', 'Voluptas magnam omni', '136', NULL, 0, '2026-03-24 12:03:29.902', '2026-03-24 12:03:29.902', 'amit.sharma@example.com'),
(6, 'klk1234', 'PROJ1774353825239', 'Amos Savage', 'Cupidatat quia asperiores voluptatum sunt qui consequatur voluptatibus corporis facilis inventore consectetur blanditiis ab quasi incididunt', '1998-04-25 00:00:00.000', '2022-12-13 00:00:00.000', '1992', 'Adria Cooper', '1', 'Ipsa consequatur r', '371', 'http://localhost:5001/uploads/1774353825134.jpg', 0, '2026-03-24 12:03:45.240', '2026-03-24 12:03:45.240', 'amit.sharma@example.com'),
(7, 'klk1234', 'PROJ1774353884138', 'Sigourney Vincent', 'Qui consequuntur architecto est consequatur Quis nisi necessitatibus qui et qui eum', '1971-12-23 00:00:00.000', '1977-12-06 00:00:00.000', '1989', 'Stephen Trevino', '1', 'Magnam lorem nisi vo', '973', 'http://localhost:5001/uploads/1774353884030.docx', 0, '2026-03-24 12:04:44.139', '2026-03-24 12:04:44.139', 'amit.sharma@example.com'),
(8, 'klk1234', 'PROJ1774354845858', 'Kibo Pierce', 'Eveniet quod ipsum sint ut sed culpa in ipsa qui ut et', '2022-12-12 00:00:00.000', '2008-12-05 00:00:00.000', '1992', 'Drew Ramsey', '1', 'Error reprehenderit ', '266', NULL, 0, '2026-03-24 12:20:45.861', '2026-03-24 12:20:45.861', 'amit.sharma@example.com'),
(9, 'klk1234', 'PROJ1774698572270', 'Nita Osborne', 'Et aliquid voluptatem sunt ut corporis ex autem est et enim amet labore consectetur dignissimos aut aliquip', '1988-12-31 00:00:00.000', '2026-03-23 00:00:00.000', '2025-2026', 'Jacob Harris', '12', 'Doloremque architect', '9812345678', 'http://localhost:5001/uploads/1774698572142.jpg', 1, '2026-03-28 11:49:32.271', '2026-03-28 11:50:05.741', 'amit.sharma@example.com'),
(10, 'klk1234', 'PROJ1774951921544', 'UPNEDA', 'kjwqasjz', '2026-03-17 00:00:00.000', '2026-03-31 00:00:00.000', '2025-2026', 'Akshat Jain', '1', 'Manish', '6878978971', 'http://localhost:5001/uploads/1774951921532.jpg', 1, '2026-03-31 10:12:01.544', '2026-03-31 10:12:01.544', 'amit.sharma@example.com');

-- --------------------------------------------------------

--
-- Table structure for table `Role`
--

CREATE TABLE `Role` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `company_id` varchar(191) NOT NULL,
  `created_by` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Role`
--

INSERT INTO `Role` (`id`, `name`, `description`, `created_at`, `company_id`, `created_by`) VALUES
(1, 'admin', 'Admin', '2026-03-31 06:08:30.821', 'klk1234', '1'),
(2, 'manager', 'Manager', '2026-03-31 07:53:15.923', 'klk1234', '1');

-- --------------------------------------------------------

--
-- Table structure for table `RolePermission`
--

CREATE TABLE `RolePermission` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `RolePermission`
--

INSERT INTO `RolePermission` (`id`, `role_id`, `permission_id`) VALUES
(56, 1, 1),
(57, 1, 2),
(58, 1, 25),
(59, 1, 26),
(60, 1, 27),
(61, 1, 28),
(62, 1, 29),
(63, 1, 30),
(64, 1, 31),
(65, 1, 32),
(66, 1, 33),
(67, 1, 34),
(68, 1, 35),
(69, 1, 36),
(70, 1, 37),
(71, 1, 38),
(72, 1, 39),
(73, 1, 40),
(74, 1, 41),
(75, 1, 42),
(76, 1, 43),
(77, 1, 44),
(78, 1, 45),
(79, 1, 46),
(80, 1, 47),
(81, 1, 48),
(84, 1, 49),
(85, 1, 50),
(86, 1, 51),
(82, 1, 52),
(83, 1, 53),
(52, 2, 1),
(53, 2, 2),
(50, 2, 25),
(51, 2, 26),
(40, 2, 27),
(41, 2, 29),
(42, 2, 30),
(43, 2, 31),
(44, 2, 32),
(45, 2, 33),
(46, 2, 45),
(47, 2, 46),
(48, 2, 47),
(49, 2, 48);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `company_id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `reporting_head` varchar(191) NOT NULL,
  `doj` datetime(3) NOT NULL,
  `dol` datetime(3) DEFAULT NULL,
  `ctc` double DEFAULT NULL,
  `phone_no` varchar(191) DEFAULT NULL,
  `designation` varchar(191) DEFAULT NULL,
  `dob` datetime(3) DEFAULT NULL,
  `gender` varchar(191) DEFAULT NULL,
  `qualification` varchar(191) DEFAULT NULL,
  `user_img` varchar(191) DEFAULT NULL,
  `pfesi` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `company_id`, `user_id`, `username`, `email`, `password`, `reporting_head`, `doj`, `dol`, `ctc`, `phone_no`, `designation`, `dob`, `gender`, `qualification`, `user_img`, `pfesi`, `status`, `created_by`, `created_at`, `updated_at`, `role_id`) VALUES
(1, 'klk1234', 'EMP001', 'Amit Sharma', 'amit.sharma@example.com', '12345678', 'Amit Sharma', '2022-01-10 00:00:00.000', NULL, 1200000, '9876543210', 'Project Manager', '1988-05-15 00:00:00.000', 'Male', 'MBA', '1774697581696.webp', 1, 1, '', '2026-03-21 13:33:38.000', '2026-03-28 12:05:19.661', 1),
(2, 'klk1234', 'EMP002', 'Rahul Verma', 'rahul12.verma@example.com', '12345678', 'Amit Sharma', '2023-03-20 00:00:00.000', NULL, 600000, '9123456780', 'Software Developer', '1995-08-10 00:00:00.000', 'Male', 'B.Tech', '1774697071258.webp', 1, 1, '', '2026-03-21 13:33:38.000', '2026-03-28 12:06:02.120', 2),
(3, 'klk1234', 'EMP003', 'Priya Singh', 'priya.singh@example.com', '12345678', 'amit.sharma@example.com', '2023-06-15 00:00:00.000', NULL, 650000, '9234567890', 'Frontend Developer', '1997-02-25 00:00:00.000', 'Female', 'BCA', 'priya.jpg', 1, 0, '', '2026-03-21 13:33:38.000', '2026-03-21 13:33:38.000', NULL),
(4, 'klk1234', 'EMP004', 'Neha Gupta', 'neha.gupta@example.com', '12345678', 'amit.sharma@example.com', '2023-09-01 00:00:00.000', NULL, 500000, '9345678901', 'HR Executive', '1996-11-05 00:00:00.000', 'Female', 'MBA', 'neha.jpg', 1, 1, '', '2026-03-21 13:33:38.000', '2026-03-21 13:33:38.000', NULL),
(7, 'klk1234', 'EMP005', 'Punit Sukhija', 'punit@example.com', '123456', 'punit@example.com', '2024-01-15 00:00:00.000', NULL, 500000, '9876543210', 'Software Developer', '1998-06-20 00:00:00.000', 'Male', 'B.Tech', NULL, 0, 1, '', '2026-03-21 08:20:28.341', '2026-03-21 08:20:28.341', NULL),
(8, 'klk1234', 'EMP1774345240493', 'Ray Hogan', 'xucyz@mailinator.com', 'Pa$$w0rd!', 'Qui pariatur Nostru', '2013-05-07 00:00:00.000', '2011-01-23 00:00:00.000', 27, NULL, 'Ab odio ducimus aut', '2014-02-08 00:00:00.000', 'Male', 'Sunt quia est magni', NULL, 0, 0, 'amit.sharma@example.com', '2026-03-24 09:40:40.494', '2026-03-24 09:40:40.494', NULL),
(9, 'klk1234', 'EMP1774345391925', 'Thane Shields', 'woxaja@mailinator.com', 'Pa$$w0rd!', 'At doloremque ex inc', '2024-01-15 00:00:00.000', '2018-01-11 00:00:00.000', 76, NULL, 'Sapiente sit illum', '2001-05-23 00:00:00.000', 'Male', 'Dolor velit nulla se', NULL, 0, 0, 'amit.sharma@example.com', '2026-03-24 09:43:11.927', '2026-03-24 09:43:11.927', NULL),
(10, 'klk1234', 'EMP1774354837124', 'Roary Montgomery', 'nuriwar@mailinator.com', 'Pa$$w0rd!', 'Qui qui aspernatur e', '2004-12-11 00:00:00.000', '1971-06-04 00:00:00.000', 46, NULL, 'Inventore est assume', '2004-01-03 00:00:00.000', 'Female', 'Rem soluta amet tem', NULL, 0, 0, 'amit.sharma@example.com', '2026-03-24 12:20:37.128', '2026-03-24 12:20:37.128', NULL),
(11, 'klk1234', 'EMP1774425043128', 'Heidi Strickland', 'jesyzifyve@mailinator.com', 'Pa$$w0rd!', 'Non assumenda eum ir', '2020-04-14 00:00:00.000', '2003-03-24 00:00:00.000', 360000, NULL, 'Sed nulla adipisicin', '1980-03-27 00:00:00.000', 'Female', 'Veniam reprehenderi', NULL, 0, 1, 'amit.sharma@example.com', '2026-03-25 07:50:43.129', '2026-03-25 07:50:43.129', NULL),
(12, 'klk1234', 'EMP1774425282235', 'Anthony Carlson', 'qokakatiwi@mailinator.com', 'Pa$$w0rd!', 'Qui est ab libero ut', '2023-01-11 00:00:00.000', '2010-04-28 00:00:00.000', 70, '+1 (509) 725-3533', 'Cupiditate in rerum ', '2019-09-13 00:00:00.000', 'Male', 'Architecto sunt dolo', NULL, 0, 0, 'amit.sharma@example.com', '2026-03-25 07:54:42.236', '2026-03-25 07:54:42.236', NULL),
(13, 'klk1234', 'EMP1774425305789', 'Melissa Dodson', 'zuqifosy@mailinator.com', 'Pa$$w0rd!', 'Eligendi exercitatio', '1985-07-04 00:00:00.000', '1998-01-05 00:00:00.000', 74000, '+1 (151) 187-3403', 'Magni dolore illum ', '2008-11-16 00:00:00.000', 'Female', 'Velit delectus volu', '1774696959317.webp', 0, 1, 'amit.sharma@example.com', '2026-03-25 07:55:05.790', '2026-03-28 11:22:39.321', NULL),
(14, 'klk1234', 'EMP1774697272390', 'Tanya Graham', 'vany@mailinator.com', 'Pa$$w0rd!', '', '1991-08-17 00:00:00.000', '2020-04-25 00:00:00.000', 96000, '9999912345', 'Admin', '1976-09-09 00:00:00.000', 'Male', 'Voluptate vero labor', NULL, 0, 1, 'amit.sharma@example.com', '2026-03-28 11:27:52.392', '2026-03-28 11:27:52.392', NULL),
(15, 'klk1234', 'EMP1774697520484', 'Karen Foreman', 'lonadywulo@mailinator.com', '12345678', 'Amit Sharma', '1990-02-01 00:00:00.000', '2020-03-12 00:00:00.000', 14000, '8924127890', 'Reviewer', '1994-07-05 00:00:00.000', 'Male', 'Non dolorem facilis ', '1774697520478.webp', 0, 1, 'amit.sharma@example.com', '2026-03-28 11:32:00.485', '2026-03-28 11:32:00.485', NULL),
(16, 'klk1234', 'EMP1774951842752', 'Mohit', 'mohitklk1234@gmail.com', '12345678', 'Amit Sharma', '2026-03-30 00:00:00.000', '2026-03-31 00:00:00.000', 22219, '9560652531', 'Manager', '2026-03-23 00:00:00.000', 'Male', 'Btech', '1774951842749.jpg', 0, 1, 'amit.sharma@example.com', '2026-03-31 10:10:42.753', '2026-03-31 10:10:55.558', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('19517098-db86-4a00-8b40-2c084e3e0f8f', '6ac7bcced66adcbe93e53fde6a92a4613920abda77352be6bd49188ad2e3dde3', '2026-03-17 10:59:20.460', '20260317105920_create_interventions_table', NULL, NULL, '2026-03-17 10:59:20.448', 1),
('1e4a5e6a-adef-485f-b2dc-89ee803b5c75', 'e2274d003f7a73b376946405b28070d19ab3909ae73d53bc7ebb402addd4cec0', '2026-03-17 10:57:07.199', '20260317105707_create_projects_table', NULL, NULL, '2026-03-17 10:57:07.183', 1),
('31bd1520-c001-445f-94a8-675b993d5e06', '100ee55bf0b4150bf5ada298e3d0ee43e0d59c608ab7f9521b10077e41089f31', '2026-03-17 12:05:24.819', '20260317120524_create_expensepayments_table', NULL, NULL, '2026-03-17 12:05:24.807', 1),
('ef7bac91-e1c6-4cb8-820f-d014405b8d79', 'a66006052144727d18379fe67f3eb5b771726abe5f6b96d8a64613b886a1b4fa', '2026-03-17 10:45:38.863', '20260317104538_create_users_table', NULL, NULL, '2026-03-17 10:45:38.848', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ExpensePayment`
--
ALTER TABLE `ExpensePayment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ExpensePaymentTransaction`
--
ALTER TABLE `ExpensePaymentTransaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ExpensePaymentTransaction_expense_id_idx` (`expense_id`),
  ADD KEY `ExpensePaymentTransaction_accountant_id_idx` (`accountant_id`);

--
-- Indexes for table `Intervention`
--
ALTER TABLE `Intervention`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Permission`
--
ALTER TABLE `Permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Permission_name_key` (`name`);

--
-- Indexes for table `Project`
--
ALTER TABLE `Project`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Project_project_id_key` (`project_id`);

--
-- Indexes for table `Role`
--
ALTER TABLE `Role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Role_name_key` (`name`);

--
-- Indexes for table `RolePermission`
--
ALTER TABLE `RolePermission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `RolePermission_role_id_permission_id_key` (`role_id`,`permission_id`),
  ADD KEY `RolePermission_permission_id_fkey` (`permission_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_user_id_key` (`user_id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_role_id_fkey` (`role_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ExpensePayment`
--
ALTER TABLE `ExpensePayment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `ExpensePaymentTransaction`
--
ALTER TABLE `ExpensePaymentTransaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `Intervention`
--
ALTER TABLE `Intervention`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Permission`
--
ALTER TABLE `Permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `Project`
--
ALTER TABLE `Project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Role`
--
ALTER TABLE `Role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `RolePermission`
--
ALTER TABLE `RolePermission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ExpensePaymentTransaction`
--
ALTER TABLE `ExpensePaymentTransaction`
  ADD CONSTRAINT `ExpensePaymentTransaction_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `ExpensePayment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `RolePermission`
--
ALTER TABLE `RolePermission`
  ADD CONSTRAINT `RolePermission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `RolePermission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
