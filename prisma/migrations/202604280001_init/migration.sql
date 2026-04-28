-- Create enums
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');
CREATE TYPE "JobStatus" AS ENUM ('queued', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE "ImageStatus" AS ENUM ('processing', 'completed', 'failed');
CREATE TYPE "PromptTargetType" AS ENUM ('image_description', 'image2_prompt', 'ltx_prompt', 'wan_prompt');
CREATE TYPE "CreditTransactionType" AS ENUM ('charge', 'consume', 'refund', 'admin_adjust');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "image" TEXT,
  "passwordHash" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'user',
  "credits" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "Account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT
);

CREATE TABLE "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider","providerAccountId");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier","token");

CREATE TABLE "GenerationJob" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "status" "JobStatus" NOT NULL DEFAULT 'queued',
  "prompt" TEXT NOT NULL,
  "negativePrompt" TEXT,
  "aspectRatio" TEXT NOT NULL,
  "quality" TEXT NOT NULL,
  "style" TEXT,
  "count" INTEGER NOT NULL,
  "outputFormat" TEXT NOT NULL DEFAULT 'png',
  "creditCost" INTEGER NOT NULL,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GeneratedImage" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "image2Prompt" TEXT NOT NULL,
  "negativePrompt" TEXT,
  "imageDescription" TEXT,
  "ltxPrompt" TEXT,
  "wanPrompt" TEXT,
  "aspectRatio" TEXT NOT NULL,
  "quality" TEXT NOT NULL,
  "style" TEXT,
  "seed" INTEGER,
  "status" "ImageStatus" NOT NULL DEFAULT 'processing',
  "isFavorite" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PromptVersion" (
  "id" TEXT PRIMARY KEY,
  "generatedImageId" TEXT NOT NULL,
  "type" "PromptTargetType" NOT NULL,
  "content" TEXT NOT NULL,
  "userInstruction" TEXT,
  "versionNumber" INTEGER NOT NULL,
  "isCurrent" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PromptConversation" (
  "id" TEXT PRIMARY KEY,
  "generatedImageId" TEXT NOT NULL,
  "targetType" "PromptTargetType" NOT NULL,
  "userMessage" TEXT NOT NULL,
  "aiResponse" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CreditTransaction" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" "CreditTransactionType" NOT NULL,
  "amount" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "relatedJobId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PromptBlockLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AdminActionLog" (
  "id" TEXT PRIMARY KEY,
  "adminUserId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "detail" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PromptVersion_generatedImageId_type_idx" ON "PromptVersion"("generatedImageId","type");

ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GeneratedImage" ADD CONSTRAINT "GeneratedImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GeneratedImage" ADD CONSTRAINT "GeneratedImage_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GenerationJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_generatedImageId_fkey" FOREIGN KEY ("generatedImageId") REFERENCES "GeneratedImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PromptConversation" ADD CONSTRAINT "PromptConversation_generatedImageId_fkey" FOREIGN KEY ("generatedImageId") REFERENCES "GeneratedImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_relatedJobId_fkey" FOREIGN KEY ("relatedJobId") REFERENCES "GenerationJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PromptBlockLog" ADD CONSTRAINT "PromptBlockLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AdminActionLog" ADD CONSTRAINT "AdminActionLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
