-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `legalName` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Company_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branch` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `village` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Branch_companyId_idx`(`companyId`),
    INDEX `Branch_city_idx`(`city`),
    UNIQUE INDEX `Branch_companyId_code_key`(`companyId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED', 'DELETED') NOT NULL DEFAULT 'PENDING',
    `emailVerifiedAt` DATETIME(3) NULL,
    `phoneVerifiedAt` DATETIME(3) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    INDEX `User_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `birthPlace` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    `address` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `village` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `employerName` VARCHAR(191) NULL,
    `monthlyIncome` DECIMAL(18, 2) NULL,
    `profilePhotoUrl` VARCHAR(191) NULL,
    `isComplete` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserProfile_userId_key`(`userId`),
    UNIQUE INDEX `UserProfile_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRoleAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` ENUM('CUSTOMER', 'STAFF', 'APPRAISER', 'CASHIER', 'WAREHOUSE', 'AUCTION_ADMIN', 'ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN') NOT NULL,
    `branchId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserRoleAssignment_role_idx`(`role`),
    INDEX `UserRoleAssignment_branchId_idx`(`branchId`),
    UNIQUE INDEX `UserRoleAssignment_userId_role_branchId_key`(`userId`, `role`, `branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserSession_tokenHash_key`(`tokenHash`),
    INDEX `UserSession_userId_idx`(`userId`),
    INDEX `UserSession_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IdentityDocument` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('KTP', 'SELFIE_WITH_KTP', 'FAMILY_CARD', 'NPWP', 'BANK_ACCOUNT', 'OTHER') NOT NULL,
    `documentNumber` VARCHAR(191) NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileHash` VARCHAR(191) NULL,
    `verificationStatus` ENUM('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `verifiedById` VARCHAR(191) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `IdentityDocument_userId_idx`(`userId`),
    INDEX `IdentityDocument_type_idx`(`type`),
    INDEX `IdentityDocument_verificationStatus_idx`(`verificationStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmergencyContact` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `relationship` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EmergencyContact_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankAccount` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `accountName` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BankAccount_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PawnApplication` (
    `id` VARCHAR(191) NOT NULL,
    `applicationNumber` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEED_REVISION', 'APPROVED', 'REJECTED', 'WAITING_FOR_DELIVERY', 'EXPIRED', 'CANCELLED', 'ITEM_RECEIVED', 'AGREEMENT_SIGNED', 'DISBURSED', 'ACTIVE', 'PARTIALLY_PAID', 'PAID_OFF', 'DEFAULTED', 'SETTLEMENT', 'AUCTION', 'COMPLETED') NOT NULL DEFAULT 'DRAFT',
    `requestedDurationDays` INTEGER NOT NULL,
    `submittedAt` DATETIME(3) NULL,
    `approvedAt` DATETIME(3) NULL,
    `rejectedAt` DATETIME(3) NULL,
    `arrivalDeadline` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PawnApplication_applicationNumber_key`(`applicationNumber`),
    INDEX `PawnApplication_customerId_idx`(`customerId`),
    INDEX `PawnApplication_branchId_idx`(`branchId`),
    INDEX `PawnApplication_status_idx`(`status`),
    INDEX `PawnApplication_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PawnItem` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `itemCode` VARCHAR(191) NOT NULL,
    `category` ENUM('ELECTRONICS', 'VEHICLE', 'JEWELRY', 'GOLD', 'MOBILE_PHONE', 'LAPTOP', 'COMPUTER', 'CAMERA', 'WATCH', 'MUSICAL_INSTRUMENT', 'HOUSEHOLD', 'OTHER') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `serialNumber` VARCHAR(191) NULL,
    `imei` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `condition` ENUM('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED') NULL,
    `conditionDescription` VARCHAR(191) NULL,
    `estimatedMarketValue` DECIMAL(18, 2) NULL,
    `approvedValue` DECIMAL(18, 2) NULL,
    `qardhAmount` DECIMAL(18, 2) NULL,
    `status` ENUM('NOT_RECEIVED', 'STORED', 'RELEASED', 'MOVED', 'LOST', 'DAMAGED') NOT NULL DEFAULT 'NOT_RECEIVED',
    `receivedAt` DATETIME(3) NULL,
    `releasedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PawnItem_applicationId_key`(`applicationId`),
    UNIQUE INDEX `PawnItem_itemCode_key`(`itemCode`),
    INDEX `PawnItem_category_idx`(`category`),
    INDEX `PawnItem_serialNumber_idx`(`serialNumber`),
    INDEX `PawnItem_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PawnItemPhoto` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `type` ENUM('FRONT', 'BACK', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM', 'SERIAL_NUMBER', 'IMEI', 'DAMAGE', 'ACCESSORY', 'PACKAGING', 'OTHER') NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileHash` VARCHAR(191) NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PawnItemPhoto_itemId_idx`(`itemId`),
    INDEX `PawnItemPhoto_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Valuation` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `appraiserId` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    `marketValue` DECIMAL(18, 2) NOT NULL,
    `collateralValue` DECIMAL(18, 2) NOT NULL,
    `maximumQardh` DECIMAL(18, 2) NOT NULL,
    `approvedQardh` DECIMAL(18, 2) NULL,
    `conditionNotes` VARCHAR(191) NULL,
    `valuationNotes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `submittedAt` DATETIME(3) NULL,
    `approvedAt` DATETIME(3) NULL,

    INDEX `Valuation_applicationId_idx`(`applicationId`),
    INDEX `Valuation_itemId_idx`(`itemId`),
    INDEX `Valuation_appraiserId_idx`(`appraiserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationApproval` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `decision` ENUM('APPROVED', 'REJECTED', 'REVISION') NOT NULL,
    `approvedQardh` DECIMAL(18, 2) NULL,
    `estimatedUjrah` DECIMAL(18, 2) NULL,
    `administrativeFee` DECIMAL(18, 2) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationApproval_applicationId_idx`(`applicationId`),
    INDEX `ApplicationApproval_adminId_idx`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeRule` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('UJRAH', 'ADMINISTRATIVE', 'OTHER') NOT NULL,
    `calculationType` ENUM('FIXED', 'PER_DAY', 'PER_PERIOD', 'PER_ITEM') NOT NULL,
    `itemCategory` ENUM('ELECTRONICS', 'VEHICLE', 'JEWELRY', 'GOLD', 'MOBILE_PHONE', 'LAPTOP', 'COMPUTER', 'CAMERA', 'WATCH', 'MUSICAL_INSTRUMENT', 'HOUSEHOLD', 'OTHER') NULL,
    `durationDaysMin` INTEGER NULL,
    `durationDaysMax` INTEGER NULL,
    `fixedAmount` DECIMAL(18, 2) NULL,
    `amountPerDay` DECIMAL(18, 2) NULL,
    `amountPerPeriod` DECIMAL(18, 2) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `effectiveFrom` DATETIME(3) NOT NULL,
    `effectiveUntil` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FeeRule_type_idx`(`type`),
    INDEX `FeeRule_itemCategory_idx`(`itemCategory`),
    INDEX `FeeRule_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeSnapshot` (
    `id` VARCHAR(191) NOT NULL,
    `feeRuleId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('UJRAH', 'ADMINISTRATIVE', 'OTHER') NOT NULL,
    `calculationType` ENUM('FIXED', 'PER_DAY', 'PER_PERIOD', 'PER_ITEM') NOT NULL,
    `baseAmount` DECIMAL(18, 2) NULL,
    `calculatedAmount` DECIMAL(18, 2) NOT NULL,
    `calculationNotes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FeeSnapshot_feeRuleId_idx`(`feeRuleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgreementFee` (
    `id` VARCHAR(191) NOT NULL,
    `agreementId` VARCHAR(191) NOT NULL,
    `feeRuleId` VARCHAR(191) NULL,
    `feeSnapshotId` VARCHAR(191) NULL,
    `type` ENUM('UJRAH', 'ADMINISTRATIVE', 'OTHER') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AgreementFee_agreementId_idx`(`agreementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgreementTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AgreementTemplate_companyId_code_key`(`companyId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgreementTemplateVersion` (
    `id` VARCHAR(191) NOT NULL,
    `templateId` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AgreementTemplateVersion_templateId_version_key`(`templateId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agreement` (
    `id` VARCHAR(191) NOT NULL,
    `agreementNumber` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `templateVersionId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'GENERATED', 'PRINTED', 'SIGNED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'DRAFT',
    `contractVersion` VARCHAR(191) NOT NULL,
    `qardhAmount` DECIMAL(18, 2) NOT NULL,
    `ujrahAmount` DECIMAL(18, 2) NOT NULL,
    `administrativeFee` DECIMAL(18, 2) NOT NULL,
    `totalRepaymentAmount` DECIMAL(18, 2) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `maturityDate` DATETIME(3) NOT NULL,
    `generatedAt` DATETIME(3) NULL,
    `printedAt` DATETIME(3) NULL,
    `signedAt` DATETIME(3) NULL,
    `renderedContentHash` VARCHAR(191) NULL,
    `documentUrl` VARCHAR(191) NULL,
    `documentHash` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Agreement_agreementNumber_key`(`agreementNumber`),
    UNIQUE INDEX `Agreement_applicationId_key`(`applicationId`),
    INDEX `Agreement_branchId_idx`(`branchId`),
    INDEX `Agreement_status_idx`(`status`),
    INDEX `Agreement_maturityDate_idx`(`maturityDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgreementSignature` (
    `id` VARCHAR(191) NOT NULL,
    `agreementId` VARCHAR(191) NOT NULL,
    `partyType` ENUM('CUSTOMER', 'COMPANY') NOT NULL,
    `signerName` VARCHAR(191) NOT NULL,
    `signerUserId` VARCHAR(191) NULL,
    `signatureType` ENUM('HANDWRITTEN', 'ELECTRONIC', 'DIGITAL') NOT NULL,
    `signatureImageUrl` VARCHAR(191) NULL,
    `signedAt` DATETIME(3) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AgreementSignature_agreementId_idx`(`agreementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemInspection` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `type` ENUM('INCOMING', 'OUTGOING', 'PERIODIC', 'AUCTION') NOT NULL,
    `performedById` VARCHAR(191) NOT NULL,
    `condition` ENUM('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED') NULL,
    `description` VARCHAR(191) NULL,
    `estimatedValue` DECIMAL(18, 2) NULL,
    `inspectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ItemInspection_itemId_idx`(`itemId`),
    INDEX `ItemInspection_applicationId_idx`(`applicationId`),
    INDEX `ItemInspection_branchId_idx`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemInspectionPhoto` (
    `id` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `photoType` ENUM('FRONT', 'BACK', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM', 'SERIAL_NUMBER', 'IMEI', 'DAMAGE', 'ACCESSORY', 'PACKAGING', 'OTHER') NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileHash` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ItemInspectionPhoto_inspectionId_idx`(`inspectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemHandover` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `operatorId` VARCHAR(191) NOT NULL,
    `customerConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `operatorConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `inspectionId` VARCHAR(191) NULL,

    UNIQUE INDEX `ItemHandover_itemId_key`(`itemId`),
    UNIQUE INDEX `ItemHandover_applicationId_key`(`applicationId`),
    INDEX `ItemHandover_operatorId_idx`(`operatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemRelease` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `operatorId` VARCHAR(191) NOT NULL,
    `customerConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `operatorConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `releasedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `inspectionId` VARCHAR(191) NULL,

    UNIQUE INDEX `ItemRelease_itemId_key`(`itemId`),
    INDEX `ItemRelease_operatorId_idx`(`operatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disbursement` (
    `id` VARCHAR(191) NOT NULL,
    `disbursementNumber` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `cashierId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `method` ENUM('CASH', 'BANK_TRANSFER') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'PAID', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Disbursement_disbursementNumber_key`(`disbursementNumber`),
    UNIQUE INDEX `Disbursement_applicationId_key`(`applicationId`),
    INDEX `Disbursement_branchId_idx`(`branchId`),
    INDEX `Disbursement_cashierId_idx`(`cashierId`),
    INDEX `Disbursement_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `paymentNumber` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `type` ENUM('PRINCIPAL', 'UJRAH', 'ADMINISTRATIVE_FEE', 'AUCTION_SETTLEMENT', 'OTHER') NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `method` ENUM('CASH', 'BANK_TRANSFER', 'QRIS', 'OTHER') NOT NULL,
    `status` ENUM('PENDING', 'VERIFIED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `referenceNumber` VARCHAR(191) NULL,
    `proofUrl` VARCHAR(191) NULL,
    `verifiedById` VARCHAR(191) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_paymentNumber_key`(`paymentNumber`),
    INDEX `Payment_applicationId_idx`(`applicationId`),
    INDEX `Payment_customerId_idx`(`customerId`),
    INDEX `Payment_branchId_idx`(`branchId`),
    INDEX `Payment_status_idx`(`status`),
    INDEX `Payment_paidAt_idx`(`paidAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PawnSettlement` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `principalDue` DECIMAL(18, 2) NOT NULL,
    `ujrahDue` DECIMAL(18, 2) NOT NULL,
    `administrativeDue` DECIMAL(18, 2) NOT NULL,
    `totalDue` DECIMAL(18, 2) NOT NULL,
    `principalPaid` DECIMAL(18, 2) NOT NULL DEFAULT 0,
    `ujrahPaid` DECIMAL(18, 2) NOT NULL DEFAULT 0,
    `administrativePaid` DECIMAL(18, 2) NOT NULL DEFAULT 0,
    `totalPaid` DECIMAL(18, 2) NOT NULL DEFAULT 0,
    `remainingAmount` DECIMAL(18, 2) NOT NULL,
    `settledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PawnSettlement_applicationId_key`(`applicationId`),
    INDEX `PawnSettlement_remainingAmount_idx`(`remainingAmount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CashTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `transactionNumber` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `type` ENUM('OPENING_BALANCE', 'DISBURSEMENT', 'REPAYMENT', 'REFUND', 'AUCTION_RECEIPT', 'EXPENSE', 'ADJUSTMENT', 'CLOSING_BALANCE', 'OTHER') NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `disbursementId` VARCHAR(191) NULL,
    `paymentId` VARCHAR(191) NULL,
    `cashierId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    UNIQUE INDEX `CashTransaction_transactionNumber_key`(`transactionNumber`),
    UNIQUE INDEX `CashTransaction_disbursementId_key`(`disbursementId`),
    UNIQUE INDEX `CashTransaction_paymentId_key`(`paymentId`),
    INDEX `CashTransaction_branchId_idx`(`branchId`),
    INDEX `CashTransaction_type_idx`(`type`),
    INDEX `CashTransaction_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StorageLocation` (
    `id` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `room` VARCHAR(191) NULL,
    `rack` VARCHAR(191) NULL,
    `shelf` VARCHAR(191) NULL,
    `box` VARCHAR(191) NULL,
    `slot` VARCHAR(191) NULL,
    `capacity` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StorageLocation_branchId_idx`(`branchId`),
    UNIQUE INDEX `StorageLocation_branchId_code_key`(`branchId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StorageAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `releasedAt` DATETIME(3) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StorageAssignment_itemId_key`(`itemId`),
    INDEX `StorageAssignment_locationId_idx`(`locationId`),
    INDEX `StorageAssignment_isCurrent_idx`(`isCurrent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StorageMovement` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `type` ENUM('IN', 'MOVE', 'OUT', 'INVENTORY_CHECK') NOT NULL,
    `performedById` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StorageMovement_itemId_idx`(`itemId`),
    INDEX `StorageMovement_locationId_idx`(`locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Deadline` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `type` ENUM('ARRIVAL', 'PAYMENT', 'MATURITY', 'AUCTION', 'OTHER') NOT NULL,
    `dueAt` DATETIME(3) NOT NULL,
    `completedAt` DATETIME(3) NULL,
    `isExpired` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Deadline_applicationId_idx`(`applicationId`),
    INDEX `Deadline_dueAt_idx`(`dueAt`),
    INDEX `Deadline_isExpired_idx`(`isExpired`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationStatusHistory` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `fromStatus` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEED_REVISION', 'APPROVED', 'REJECTED', 'WAITING_FOR_DELIVERY', 'EXPIRED', 'CANCELLED', 'ITEM_RECEIVED', 'AGREEMENT_SIGNED', 'DISBURSED', 'ACTIVE', 'PARTIALLY_PAID', 'PAID_OFF', 'DEFAULTED', 'SETTLEMENT', 'AUCTION', 'COMPLETED') NULL,
    `toStatus` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEED_REVISION', 'APPROVED', 'REJECTED', 'WAITING_FOR_DELIVERY', 'EXPIRED', 'CANCELLED', 'ITEM_RECEIVED', 'AGREEMENT_SIGNED', 'DISBURSED', 'ACTIVE', 'PARTIALLY_PAID', 'PAID_OFF', 'DEFAULTED', 'SETTLEMENT', 'AUCTION', 'COMPLETED') NOT NULL,
    `changedById` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationStatusHistory_applicationId_idx`(`applicationId`),
    INDEX `ApplicationStatusHistory_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Auction` (
    `id` VARCHAR(191) NOT NULL,
    `auctionNumber` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'SCHEDULED', 'OPEN', 'CLOSED', 'CANCELLED', 'SETTLEMENT', 'COMPLETED') NOT NULL DEFAULT 'DRAFT',
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `closedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Auction_auctionNumber_key`(`auctionNumber`),
    INDEX `Auction_branchId_idx`(`branchId`),
    INDEX `Auction_status_idx`(`status`),
    INDEX `Auction_startAt_idx`(`startAt`),
    INDEX `Auction_endAt_idx`(`endAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuctionItem` (
    `id` VARCHAR(191) NOT NULL,
    `auctionId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `startingPrice` DECIMAL(18, 2) NOT NULL,
    `reservePrice` DECIMAL(18, 2) NULL,
    `finalPrice` DECIMAL(18, 2) NULL,
    `winningBidId` VARCHAR(191) NULL,
    `soldAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AuctionItem_itemId_key`(`itemId`),
    UNIQUE INDEX `AuctionItem_winningBidId_key`(`winningBidId`),
    INDEX `AuctionItem_auctionId_idx`(`auctionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuctionBid` (
    `id` VARCHAR(191) NOT NULL,
    `auctionItemId` VARCHAR(191) NOT NULL,
    `bidderId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `status` ENUM('ACTIVE', 'WINNING', 'OUTBID', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuctionBid_auctionItemId_idx`(`auctionItemId`),
    INDEX `AuctionBid_bidderId_idx`(`bidderId`),
    INDEX `AuctionBid_amount_idx`(`amount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuctionSettlement` (
    `id` VARCHAR(191) NOT NULL,
    `auctionId` VARCHAR(191) NOT NULL,
    `auctionItemId` VARCHAR(191) NOT NULL,
    `winnerUserId` VARCHAR(191) NOT NULL,
    `winningAmount` DECIMAL(18, 2) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NULL,
    `deliveryStatus` ENUM('PENDING', 'READY', 'RELEASED') NOT NULL DEFAULT 'PENDING',
    `deliveredAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AuctionSettlement_auctionItemId_key`(`auctionItemId`),
    INDEX `AuctionSettlement_auctionId_idx`(`auctionId`),
    INDEX `AuctionSettlement_winnerUserId_idx`(`winnerUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuctionPayment` (
    `id` VARCHAR(191) NOT NULL,
    `settlementId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `method` ENUM('CASH', 'BANK_TRANSFER', 'QRIS', 'OTHER') NOT NULL,
    `referenceNumber` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuctionPayment_settlementId_idx`(`settlementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('SYSTEM', 'APPLICATION', 'APPROVAL', 'REJECTION', 'DISBURSEMENT', 'PAYMENT', 'DUE_DATE', 'AUCTION', 'SECURITY', 'DOCUMENT') NOT NULL,
    `channel` ENUM('IN_APP', 'EMAIL', 'SMS', 'WHATSAPP') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'SENT', 'FAILED', 'READ') NOT NULL DEFAULT 'PENDING',
    `relatedEntityType` VARCHAR(191) NULL,
    `relatedEntityId` VARCHAR(191) NULL,
    `sentAt` DATETIME(3) NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_status_idx`(`status`),
    INDEX `Notification_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChartOfAccount` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `parentId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ChartOfAccount_parentId_idx`(`parentId`),
    UNIQUE INDEX `ChartOfAccount_companyId_code_key`(`companyId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccountingPeriod` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `closedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AccountingPeriod_startDate_endDate_idx`(`startDate`, `endDate`),
    UNIQUE INDEX `AccountingPeriod_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccountingEntry` (
    `id` VARCHAR(191) NOT NULL,
    `periodId` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NULL,
    `entryType` ENUM('DEBIT', 'CREDIT') NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `referenceType` ENUM('DISBURSEMENT', 'PAYMENT', 'AUCTION_SETTLEMENT', 'CASH_TRANSACTION', 'ADJUSTMENT', 'OTHER') NULL,
    `referenceId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `paymentId` VARCHAR(191) NULL,
    `cashTransactionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AccountingEntry_periodId_idx`(`periodId`),
    INDEX `AccountingEntry_accountId_idx`(`accountId`),
    INDEX `AccountingEntry_branchId_idx`(`branchId`),
    INDEX `AccountingEntry_referenceType_referenceId_idx`(`referenceType`, `referenceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FileAsset` (
    `id` VARCHAR(191) NOT NULL,
    `ownerType` ENUM('USER', 'ITEM', 'APPLICATION', 'AGREEMENT', 'INSPECTION', 'AUCTION', 'PAYMENT', 'OTHER') NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `storageKey` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `sizeBytes` BIGINT NOT NULL,
    `sha256` VARCHAR(191) NULL,
    `isPrivate` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FileAsset_ownerType_ownerId_idx`(`ownerType`, `ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VERIFY', 'REJECT', 'APPROVE', 'PRINT', 'SIGN', 'DISBURSE', 'PAYMENT', 'STORAGE_IN', 'STORAGE_MOVE', 'STORAGE_OUT', 'AUCTION_CREATE', 'AUCTION_OPEN', 'AUCTION_CLOSE', 'BID', 'REFUND', 'OTHER') NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `beforeData` JSON NULL,
    `afterData` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_actorId_idx`(`actorId`),
    INDEX `AuditLog_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `AuditLog_action_idx`(`action`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoleAssignment` ADD CONSTRAINT `UserRoleAssignment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoleAssignment` ADD CONSTRAINT `UserRoleAssignment_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSession` ADD CONSTRAINT `UserSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IdentityDocument` ADD CONSTRAINT `IdentityDocument_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmergencyContact` ADD CONSTRAINT `EmergencyContact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PawnApplication` ADD CONSTRAINT `PawnApplication_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PawnApplication` ADD CONSTRAINT `PawnApplication_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PawnItem` ADD CONSTRAINT `PawnItem_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PawnItemPhoto` ADD CONSTRAINT `PawnItemPhoto_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PawnItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Valuation` ADD CONSTRAINT `Valuation_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Valuation` ADD CONSTRAINT `Valuation_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PawnItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Valuation` ADD CONSTRAINT `Valuation_appraiserId_fkey` FOREIGN KEY (`appraiserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationApproval` ADD CONSTRAINT `ApplicationApproval_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationApproval` ADD CONSTRAINT `ApplicationApproval_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeeSnapshot` ADD CONSTRAINT `FeeSnapshot_feeRuleId_fkey` FOREIGN KEY (`feeRuleId`) REFERENCES `FeeRule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgreementFee` ADD CONSTRAINT `AgreementFee_agreementId_fkey` FOREIGN KEY (`agreementId`) REFERENCES `Agreement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgreementFee` ADD CONSTRAINT `AgreementFee_feeRuleId_fkey` FOREIGN KEY (`feeRuleId`) REFERENCES `FeeRule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgreementFee` ADD CONSTRAINT `AgreementFee_feeSnapshotId_fkey` FOREIGN KEY (`feeSnapshotId`) REFERENCES `FeeSnapshot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgreementTemplate` ADD CONSTRAINT `AgreementTemplate_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgreementTemplateVersion` ADD CONSTRAINT `AgreementTemplateVersion_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `AgreementTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agreement` ADD CONSTRAINT `Agreement_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agreement` ADD CONSTRAINT `Agreement_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agreement` ADD CONSTRAINT `Agreement_templateVersionId_fkey` FOREIGN KEY (`templateVersionId`) REFERENCES `AgreementTemplateVersion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgreementSignature` ADD CONSTRAINT `AgreementSignature_agreementId_fkey` FOREIGN KEY (`agreementId`) REFERENCES `Agreement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemInspection` ADD CONSTRAINT `ItemInspection_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PawnItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemInspection` ADD CONSTRAINT `ItemInspection_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemInspection` ADD CONSTRAINT `ItemInspection_performedById_fkey` FOREIGN KEY (`performedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemInspectionPhoto` ADD CONSTRAINT `ItemInspectionPhoto_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `ItemInspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemHandover` ADD CONSTRAINT `ItemHandover_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PawnItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemHandover` ADD CONSTRAINT `ItemHandover_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemHandover` ADD CONSTRAINT `ItemHandover_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemRelease` ADD CONSTRAINT `ItemRelease_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PawnItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemRelease` ADD CONSTRAINT `ItemRelease_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Disbursement` ADD CONSTRAINT `Disbursement_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Disbursement` ADD CONSTRAINT `Disbursement_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Disbursement` ADD CONSTRAINT `Disbursement_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PawnSettlement` ADD CONSTRAINT `PawnSettlement_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashTransaction` ADD CONSTRAINT `CashTransaction_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashTransaction` ADD CONSTRAINT `CashTransaction_disbursementId_fkey` FOREIGN KEY (`disbursementId`) REFERENCES `Disbursement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashTransaction` ADD CONSTRAINT `CashTransaction_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashTransaction` ADD CONSTRAINT `CashTransaction_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageLocation` ADD CONSTRAINT `StorageLocation_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageAssignment` ADD CONSTRAINT `StorageAssignment_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PawnItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageAssignment` ADD CONSTRAINT `StorageAssignment_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `StorageLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageMovement` ADD CONSTRAINT `StorageMovement_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PawnItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageMovement` ADD CONSTRAINT `StorageMovement_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `StorageLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageMovement` ADD CONSTRAINT `StorageMovement_performedById_fkey` FOREIGN KEY (`performedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deadline` ADD CONSTRAINT `Deadline_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationStatusHistory` ADD CONSTRAINT `ApplicationStatusHistory_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `PawnApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuctionItem` ADD CONSTRAINT `AuctionItem_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuctionItem` ADD CONSTRAINT `AuctionItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `PawnItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuctionBid` ADD CONSTRAINT `AuctionBid_auctionItemId_fkey` FOREIGN KEY (`auctionItemId`) REFERENCES `AuctionItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuctionBid` ADD CONSTRAINT `AuctionBid_bidderId_fkey` FOREIGN KEY (`bidderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuctionSettlement` ADD CONSTRAINT `AuctionSettlement_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuctionSettlement` ADD CONSTRAINT `AuctionSettlement_auctionItemId_fkey` FOREIGN KEY (`auctionItemId`) REFERENCES `AuctionItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuctionSettlement` ADD CONSTRAINT `AuctionSettlement_winnerUserId_fkey` FOREIGN KEY (`winnerUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuctionPayment` ADD CONSTRAINT `AuctionPayment_settlementId_fkey` FOREIGN KEY (`settlementId`) REFERENCES `AuctionSettlement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChartOfAccount` ADD CONSTRAINT `ChartOfAccount_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChartOfAccount` ADD CONSTRAINT `ChartOfAccount_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ChartOfAccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountingPeriod` ADD CONSTRAINT `AccountingPeriod_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountingEntry` ADD CONSTRAINT `AccountingEntry_periodId_fkey` FOREIGN KEY (`periodId`) REFERENCES `AccountingPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountingEntry` ADD CONSTRAINT `AccountingEntry_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `ChartOfAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountingEntry` ADD CONSTRAINT `AccountingEntry_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountingEntry` ADD CONSTRAINT `AccountingEntry_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountingEntry` ADD CONSTRAINT `AccountingEntry_cashTransactionId_fkey` FOREIGN KEY (`cashTransactionId`) REFERENCES `CashTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
