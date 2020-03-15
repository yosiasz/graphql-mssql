use master
go

--you can name database to whatever you would like
--also put both mdf and ldf to the location you desire
--used graphql just for no apparent reason. It could have been named DarthVader
use master
go

if not exists(select 1 from sys.databases where name = 'graphql')
	begin
		CREATE DATABASE graphql
			 CONTAINMENT = NONE
			 ON  PRIMARY 
			( NAME = N'graphql', FILENAME = N'C:\DATA\graphql.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
			 LOG ON 
			( NAME = N'graphql_log', FILENAME = N'C:\LOGS\graphql_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
			 WITH CATALOG_COLLATION = DATABASE_DEFAULT
			
	end
	go

use graphql
go



if SUSER_ID('sqlteam') IS NULL
begin
	CREATE LOGIN [sqlteam] WITH PASSWORD=N'sqlteam', 
			DEFAULT_DATABASE=[master], 
			DEFAULT_LANGUAGE=[us_english], 
			CHECK_EXPIRATION=OFF, 
			CHECK_POLICY=OFF

	end
go

  IF USER_ID('sqlteam') IS NULL
	begin
		CREATE USER [sqlteam] FOR LOGIN [sqlteam] WITH DEFAULT_SCHEMA=[dbo]
	end

	exec sp_addrolemember db_datareader, [sqlteam] 
	go
	exec sp_addrolemember db_datawriter, [sqlteam] 
	go

if OBJECT_ID('projects') is null
	create table dbo.projects(projectid int not null identity(1,1),
	                          projectname nvarchar(150) not null
							  )
	go

if OBJECT_ID('products') is null
	create table dbo.products(productid int not null identity(1,1),
	                          productname nvarchar(150) not null
							  )
	go

;with src
as
(

select 'Learn Graph QL' as projectname union
select 'Implement database' union
select 'Build skills' union
select 'Learn Angular'
)
insert into projects
select projectname 
	from src
	where not exists(select 1 from projects tgt 
	where tgt.projectname = src.projectname)
	go

;with src
as
(

select 'Angular' as productname union
select 'GraphQL' union
select 'MS SQL Server' union
select 'Express.js'
)
insert into products
select productname 
	from src
	where not exists(select 1 from products tgt 
	where tgt.productname = src.productname)
	go

  if exists(select 1 from sys.procedures where name = 'projects_sp')
	begin
		drop proc dbo.projects_sp
	end
	go

	create proc dbo.projects_sp
	(
		@projectId int = null
	)
	as
	begin
		SELECT [projectid]
				,[projectname]
			FROM [dbo].[projects]
	end
	go

	grant execute on dbo.projects_sp to [sqlteam]
	go

  if exists(select 1 from sys.procedures where name = 'products_sp')
	begin
		drop proc dbo.products_sp
	end
	go

	create proc dbo.products_sp
	(
		@productId int = null
	)
	as
	begin
		SELECT [productid]
				,productname
			FROM [dbo].products
			where @productId is null or productid = @productId
	end
	go

	grant execute on dbo.products_sp to [sqlteam]
	go