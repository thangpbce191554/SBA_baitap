/**
 * Phan Bảo Thắng
 * SE1910
 */

USE [master]
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'A2PhanBaoThang_SE1910')
BEGIN
    CREATE DATABASE [A2PhanBaoThang_SE1910]
END
GO

USE [A2PhanBaoThang_SE1910]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Xóa bảng theo thứ tự khóa ngoại nếu tồn tại
IF OBJECT_ID('dbo.NewsTag', 'U') IS NOT NULL DROP TABLE dbo.NewsTag;
IF OBJECT_ID('dbo.NewsArticle', 'U') IS NOT NULL DROP TABLE dbo.NewsArticle;
IF OBJECT_ID('dbo.Tag', 'U') IS NOT NULL DROP TABLE dbo.Tag;
IF OBJECT_ID('dbo.Category', 'U') IS NOT NULL DROP TABLE dbo.Category;
IF OBJECT_ID('dbo.SystemAccount', 'U') IS NOT NULL DROP TABLE dbo.SystemAccount;
GO

-- 1. Bảng Category
CREATE TABLE [dbo].[Category](
	[CategoryID] [smallint] IDENTITY(1,1) NOT NULL,
	[CategoryName] [nvarchar](100) NOT NULL,
	[CategoryDesciption] [nvarchar](250) NOT NULL,
	[ParentCategoryID] [smallint] NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[CategoryID] ASC
)
) ON [PRIMARY]
GO

-- 2. Bảng NewsArticle (ID là nvarchar(20))
CREATE TABLE [dbo].[NewsArticle](
	[NewsArticleID] [nvarchar](20) NOT NULL,
	[NewsTitle] [nvarchar](400) NULL,
	[Headline] [nvarchar](150) NOT NULL,
	[CreatedDate] [datetime] NULL,
	[NewsContent] [nvarchar](4000) NULL,
	[NewsSource] [nvarchar](400) NULL,
	[CategoryID] [smallint] NULL,
	[NewsStatus] [bit] NULL,
	[CreatedByID] [smallint] NULL,
	[UpdatedByID] [smallint] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_NewsArticle] PRIMARY KEY CLUSTERED 
(
	[NewsArticleID] ASC
)
) ON [PRIMARY]
GO

-- 3. Bảng NewsTag
CREATE TABLE [dbo].[NewsTag](
	[NewsArticleID] [nvarchar](20) NOT NULL,
	[TagID] [int] NOT NULL,
 CONSTRAINT [PK_NewsTag] PRIMARY KEY CLUSTERED 
(
	[NewsArticleID] ASC,
	[TagID] ASC
)
) ON [PRIMARY]
GO

-- 4. Bảng SystemAccount
CREATE TABLE [dbo].[SystemAccount](
	[AccountID] [smallint] NOT NULL,
	[AccountName] [nvarchar](100) NULL,
	[AccountEmail] [nvarchar](70) NULL,
	[AccountRole] [int] NULL,
	[AccountPassword] [nvarchar](255) NULL,
 CONSTRAINT [PK_SystemAccount] PRIMARY KEY CLUSTERED 
(
	[AccountID] ASC
)
) ON [PRIMARY]
GO

-- 5. Bảng Tag
CREATE TABLE [dbo].[Tag](
	[TagID] [int] NOT NULL,
	[TagName] [nvarchar](50) NULL,
	[Note] [nvarchar](400) NULL,
 CONSTRAINT [PK_HashTag] PRIMARY KEY CLUSTERED 
(
	[TagID] ASC
)
) ON [PRIMARY]
GO

-- ==========================================================
-- DỮ LIỆU MẪU CHUẨN TỪ GIẢNG VIÊN
-- ==========================================================

SET IDENTITY_INSERT [dbo].[Category] ON 
GO
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (1, N'Academic news', N'This category can include articles about research findings, faculty appointments and promotions, and other academic-related announcements.', 1, 1)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (2, N'Student Affairs', N'This category can include articles about student activities, events, and initiatives, such as student clubs, organizations and sports.', 2, 1)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (3, N'Campus Safety', N'This category can include articles about incidents and safety measures implemented on campus to ensure the safety of students and faculty.', 3, 1)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (4, N'Alumni News', N'This category can include articles about the achievements and accomplishments of former students and alumni, such as graduations, job promotions and career successes.', 4, 1)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (5, N'Capstone Project News', N'This category is typically a comprehensive and detailed report created as part of an academic or professional capstone project. ', 5, 0)
GO
SET IDENTITY_INSERT [dbo].[Category] OFF
GO

INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'1', N'University FU Celebrates Success of Alumni in Various Fields', N'University FU Celebrates Success of Alumni in Various Fields', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'University FU recently commemorated the achievements of its esteemed alumni who have excelled in a multitude of fields, showcasing the impact of the institution''s education on their professional journeys.', N'N/A', 4, 1, 1, 1, CAST(N'2024-05-05T00:00:00.000' AS DateTime))
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'2', N'Alumni Association Launches Mentorship Program for Recent Graduates', N'Alumni Association Launches Mentorship Program for Recent Graduates', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'The Alumni Association of University FU recently unveiled a new mentorship program aimed at providing support and guidance to recent graduates as they navigate the transition from academia to the professional world.', N'Internet', 4, 1, 1, 1, CAST(N'2024-05-05T00:00:00.000' AS DateTime))
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'3', N'Academic Department Announces Groundbreaking Initiatives and Program Enhancements', N'Academic Department Announces Groundbreaking Initiatives and Program Enhancements', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'The Software Engineering Department at FU has unveiled a series of transformative initiatives and program enhancements aimed at enriching the academic experience and fostering innovation in Software Development.', N'N/A', 1, 1, 2, 2, CAST(N'2024-05-05T00:00:00.000' AS DateTime))
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'4', N'Renowned Scholar Appointed as Head of AI Department at FU', N'Renowned Scholar Appointed as Head of AI Department at FU', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'FU proudly announces the appointment of David Nitzevet, a distinguished scholar in Machine Learning, to the prestigious position of Head of AI Department, underscoring the institution''s commitment to academic excellence and leadership.', N'N/A', 1, 1, 2, 2, CAST(N'2024-05-05T00:00:00.000' AS DateTime))
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'5', N'New Research Findings Shed Light on STEM', N'New Research Findings Shed Light on STEM', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'Groundbreaking research conducted by the Research Department of FU has unveiled significant findings in the field of STEM, offering fresh insights that could revolutionize current understanding and practices.', N'N/A', 1, 1, 2, 2, CAST(N'2024-05-05T00:00:00.000' AS DateTime))
GO

INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'1', 5)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'1', 7)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'1', 9)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'2', 5)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'2', 7)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'2', 8)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'2', 9)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'3', 1)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'3', 8)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'3', 9)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'4', 1)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'4', 4)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'4', 8)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'4', 9)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'5', 2)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'5', 3)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'5', 4)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'5', 6)
GO

-- Tài khoản: 1..4 là Staff, 5 là Admin, 6 là Phan Bảo Thắng (Staff)
-- Mật khẩu mặc định: @1
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (1, N'Emma William', N'EmmaWilliam@FUNewsManagement.org', 2, N'@1')
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (2, N'Olivia James', N'OliviaJames@FUNewsManagement.org', 2, N'@1')
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (3, N'Isabella David', N'IsabellaDavid@FUNewsManagement.org', 2, N'@1')
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (4, N'Michael Charlotte', N'MichaelCharlotte@FUNewsManagement.org', 2, N'@1')
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (5, N'Steve Paris (Admin)', N'SteveParis@FUNewsManagement.org', 1, N'@1')
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (6, N'Phan Bảo Thắng (Staff)', N'thangpb@funews.com', 2, N'@1')
GO

INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (1, N'Education', N'Education Note')
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (2, N'Technology', N'Technology Note')
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (3, N'Research', N'Research Note')
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (4, N'Innovation', N'Innovation Note')
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (5, N'Campus Life', N'Campus Life Note')
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (6, N'Faculty', N'Faculty Achievements')
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (7, N'Alumni ', N'Alumni News')
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (8, N'Events', N'University Events')
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (9, N'Resources', N'Campus Resources')
GO

-- Ràng buộc khóa ngoại
ALTER TABLE [dbo].[Category] WITH CHECK ADD CONSTRAINT [FK_Category_Category] FOREIGN KEY([ParentCategoryID])
REFERENCES [dbo].[Category] ([CategoryID])
GO
ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_Category]
GO

-- Khóa ngoại từ NewsArticle tới Category và SystemAccount
-- Không để CASCADE để đảm bảo tuân thủ yêu cầu đề bài: chặn xóa nếu có ràng buộc bài viết
ALTER TABLE [dbo].[NewsArticle] WITH CHECK ADD CONSTRAINT [FK_NewsArticle_Category] FOREIGN KEY([CategoryID])
REFERENCES [dbo].[Category] ([CategoryID])
GO
ALTER TABLE [dbo].[NewsArticle] CHECK CONSTRAINT [FK_NewsArticle_Category]
GO

ALTER TABLE [dbo].[NewsArticle] WITH CHECK ADD CONSTRAINT [FK_NewsArticle_CreatedBy] FOREIGN KEY([CreatedByID])
REFERENCES [dbo].[SystemAccount] ([AccountID])
GO
ALTER TABLE [dbo].[NewsArticle] CHECK CONSTRAINT [FK_NewsArticle_CreatedBy]
GO

ALTER TABLE [dbo].[NewsArticle] WITH CHECK ADD CONSTRAINT [FK_NewsArticle_UpdatedBy] FOREIGN KEY([UpdatedByID])
REFERENCES [dbo].[SystemAccount] ([AccountID])
GO
ALTER TABLE [dbo].[NewsArticle] CHECK CONSTRAINT [FK_NewsArticle_UpdatedBy]
GO

ALTER TABLE [dbo].[NewsTag] WITH CHECK ADD CONSTRAINT [FK_NewsTag_NewsArticle] FOREIGN KEY([NewsArticleID])
REFERENCES [dbo].[NewsArticle] ([NewsArticleID]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[NewsTag] CHECK CONSTRAINT [FK_NewsTag_NewsArticle]
GO

ALTER TABLE [dbo].[NewsTag] WITH CHECK ADD CONSTRAINT [FK_NewsTag_Tag] FOREIGN KEY([TagID])
REFERENCES [dbo].[Tag] ([TagID]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[NewsTag] CHECK CONSTRAINT [FK_NewsTag_Tag]
GO

PRINT N'=== DATABASE A2PhanBaoThang_SE1910 ĐÃ ĐƯỢC THIẾT LẬP THÀNH CÔNG ===';
GO
