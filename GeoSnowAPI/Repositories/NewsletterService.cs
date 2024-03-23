﻿using GeoSnowAPI.Data;
using GeoSnowAPI.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;


namespace GeoSnowAPI.Repositories
{
    public class NewsletterService : INewsletterService
    {
        private readonly DbcontextClass _dbContextClass;

        public NewsletterService(DbcontextClass dbContextClass)
        {
            _dbContextClass = dbContextClass;
        }
        public async Task<bool> CheckEmailSubscription(string email)
        {
            var emailParam = new SqlParameter("@Email", email);
            var isSubscribedParam = new SqlParameter
            {
                ParameterName = "@IsSubscribed",
                SqlDbType = SqlDbType.Bit,
                Direction = ParameterDirection.Output
            };

            await _dbContextClass.Database.ExecuteSqlRawAsync("EXEC CheckEmailSubscription @Email, @IsSubscribed OUTPUT", emailParam, isSubscribedParam);

            return (bool)isSubscribedParam.Value;
        }
    }
}