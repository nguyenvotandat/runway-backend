-- CreateTable
CREATE TABLE `discount_campaign` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `code` VARCHAR(191) NULL,
    `discountType` ENUM('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING') NOT NULL DEFAULT 'PERCENTAGE',
    `discountValue` DECIMAL(10, 2) NOT NULL,
    `maxDiscount` DECIMAL(10, 2) NULL,
    `minOrderValue` DECIMAL(10, 2) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `maxUses` INTEGER NULL,
    `maxUsesPerUser` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED', 'DISABLED') NOT NULL DEFAULT 'DRAFT',
    `priority` INTEGER NOT NULL DEFAULT 0,
    `isAutoApply` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,

    UNIQUE INDEX `discount_campaign_code_key`(`code`),
    INDEX `discount_campaign_code_status_idx`(`code`, `status`),
    INDEX `discount_campaign_startDate_endDate_status_idx`(`startDate`, `endDate`, `status`),
    INDEX `discount_campaign_status_isAutoApply_priority_idx`(`status`, `isAutoApply`, `priority`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discount_rule` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `ruleType` ENUM('INCLUDE', 'EXCLUDE') NOT NULL,
    `targetType` ENUM('ALL_PRODUCTS', 'SPECIFIC_PRODUCT', 'PRODUCT_VARIANT', 'CATEGORY', 'BRAND', 'TAG', 'PRICE_RANGE') NOT NULL,
    `targetId` VARCHAR(191) NULL,
    `minQuantity` INTEGER NULL,
    `conditions` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `discount_rule_campaignId_ruleType_idx`(`campaignId`, `ruleType`),
    INDEX `discount_rule_targetType_targetId_idx`(`targetType`, `targetId`),
    INDEX `discount_rule_campaignId_targetType_idx`(`campaignId`, `targetType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_user_usage` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `totalSaved` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `lastUsed` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `campaign_user_usage_userId_idx`(`userId`),
    INDEX `campaign_user_usage_campaignId_userId_idx`(`campaignId`, `userId`),
    UNIQUE INDEX `campaign_user_usage_campaignId_userId_key`(`campaignId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `discount_rule` ADD CONSTRAINT `discount_rule_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `discount_campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_user_usage` ADD CONSTRAINT `campaign_user_usage_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `discount_campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_user_usage` ADD CONSTRAINT `campaign_user_usage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
