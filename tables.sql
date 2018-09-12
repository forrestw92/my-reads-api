SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_reads`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `volumeID` varchar(40) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL,
  `authors` mediumtext,
  `subtitle` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `publishedDate` date DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `industryIdentifiers` mediumtext,
  `pageCount` int(11) DEFAULT NULL,
  `printType` varchar(40) NOT NULL,
  `categories` mediumtext,
  `maturityRating` varchar(40) DEFAULT NULL,
  `language` varchar(4) DEFAULT NULL,
  `averageRating` int(11) NOT NULL DEFAULT '0',
  `ratingsCount` int(11) NOT NULL DEFAULT '0',
  `thumbnail` varchar(500) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `images` mediumtext
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Table structure for table `book_ratings`
--

CREATE TABLE `book_ratings` (
  `token` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `volumeID` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



-- --------------------------------------------------------

--
-- Table structure for table `my_books`
--

CREATE TABLE `my_books` (
  `token` varchar(255) NOT NULL,
  `volumeID` varchar(30) NOT NULL,
  `shelf` varchar(30) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `token` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`volumeID`);

--
-- Indexes for table `book_ratings`
--
ALTER TABLE `book_ratings`
  ADD PRIMARY KEY (`token`,`volumeID`);

--
-- Indexes for table `my_books`
--
ALTER TABLE `my_books`
  ADD PRIMARY KEY (`token`,`volumeID`),
  ADD UNIQUE KEY `token` (`token`,`volumeID`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`token`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
