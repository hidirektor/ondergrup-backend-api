SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `Events` (
  `UserID` bigint(20) UNSIGNED NOT NULL,
  `EventDesc` varchar(255) DEFAULT NULL,
  `EventDate` date DEFAULT NULL,
  `EventTime` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `ledStat` (
  `greenLed` int(11) DEFAULT 0,
  `redLed` int(11) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `ledStat` (`greenLed`, `redLed`) VALUES
(1, 0),
(1, 0);

CREATE TABLE `MachineData` (
  `MachineID` int(11) DEFAULT NULL,
  `acilStop1` int(11) NOT NULL,
  `acilStop2` int(11) NOT NULL,
  `acilStop3` int(11) NOT NULL,
  `calismaSekli` int(11) NOT NULL,
  `eCercevesi` int(11) NOT NULL,
  `yavaslamaLimit` int(11) NOT NULL,
  `altLimit` int(11) NOT NULL,
  `basincSalter` int(11) NOT NULL,
  `kapiSivici` int(11) NOT NULL,
  `kapi1Tip` int(11) NOT NULL,
  `kapi1acSure` int(11) NOT NULL,
  `kapi2Tip` int(11) NOT NULL,
  `kapi2acSure` int(11) NOT NULL,
  `kapitablaTip` int(11) NOT NULL,
  `kapiTablaSure` int(11) NOT NULL,
  `yukariYavaslama` int(11) NOT NULL,
  `devirmeYuruyusSecim` int(11) NOT NULL,
  `devirmeYukariIleriLimit` int(11) NOT NULL,
  `devirmeAsagiLimit` int(11) NOT NULL,
  `devirmeSilindirTipi` int(11) NOT NULL,
  `platformSilindirTipi` int(11) NOT NULL,
  `yukarivalfDurusSuresi` int(11) NOT NULL,
  `asagivalfDurusSuresi` int(11) NOT NULL,
  `devirmevalfDurusSuresi` int(11) NOT NULL,
  `devirme2valfDurusSuresi` int(11) NOT NULL,
  `makineCalismaTmr` int(11) NOT NULL,
  `buzzer` int(11) NOT NULL,
  `dilSecimi` int(11) NOT NULL,
  `kaydedilenDeger` int(11) NOT NULL,
  `demoMod` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `Machines` (
  `MachineID` int(11) NOT NULL,
  `setupDate` date DEFAULT NULL,
  `setupByName` varchar(255) DEFAULT NULL,
  `setupByID` int(11) DEFAULT NULL,
  `OwnerID` bigint(20) UNSIGNED DEFAULT NULL,
  `OwnerName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `Users` (
  `UserType` varchar(255) NOT NULL,
  `UserID` bigint(20) UNSIGNED NOT NULL,
  `Password` varchar(32) DEFAULT NULL,
  `NameSurname` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

ALTER TABLE `Events`
  ADD KEY `UserID` (`UserID`);

ALTER TABLE `MachineData`
  ADD KEY `MachineID` (`MachineID`);

ALTER TABLE `Machines`
  ADD PRIMARY KEY (`MachineID`),
  ADD KEY `OwnerID` (`OwnerID`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserID`);

ALTER TABLE `Users`
  MODIFY `UserID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

ALTER TABLE `Events`
  ADD CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

ALTER TABLE `MachineData`
  ADD CONSTRAINT `MachineData_ibfk_1` FOREIGN KEY (`MachineID`) REFERENCES `Machines` (`MachineID`);

ALTER TABLE `Machines`
  ADD CONSTRAINT `Machines_ibfk_1` FOREIGN KEY (`OwnerID`) REFERENCES `Users` (`UserID`);
COMMIT;
