using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PrjFriendbookWebServer.util
{
    public class Constants
    {

        public const string PAGE_INDEX = "index.aspx";
        public const string PAGE_LOGIN = "login.aspx";
        public const string PAGE_SIGN_UP = "signup.aspx";
        public const string PAGE_LOGOUT = "LogOut.aspx";
        public const string PAGE_USER_PROFILE = "UserProfile.aspx";
        public const string PAGE_DASHBOARD = "dashboard.aspx";

        public const string TABLE_USERS = "Users";
        public const string TABLE_LOOKING_FOR = "LookingFor";
        public const string TABLE_ETHINICITIES = "Ethinicities";
        public const string TABLE_RELIGIONS = "Religions";
        public const string TABLE_AGES = "Ages";
        public const string TABLE_BODY_TYPES = "BodyTypes";
        public const string TABLE_EDUCATION = "Education";
        public const string TABLE_SMOKING= "Smoking";
        public const string TABLE_DRINKING = "Drinking";
        public const string TABLE_HEIGHT = "Height";
        public const string TABLE_INCHE = "Inche";



        public const string SESSION_USERID = "userid";



        public static List<KeyValuePair<string, string>> YEARS;

        public static List<KeyValuePair<string, string>> DAYS_OF_MONTHS;

        public static List<KeyValuePair<string, string>> MONTHS;

        static Constants()
        {
            YEARS = new List<KeyValuePair<string, string>>();

            int crYear = DateTime.Now.Year;

            for (int i = crYear; i >= 1912; i--)
            {
                YEARS.Add(new KeyValuePair<string, string>(i.ToString(), i.ToString()));
            }

            DAYS_OF_MONTHS = new List<KeyValuePair<string, string>>();

            for (int i = 1; i <= 31; i++)
            {
                DAYS_OF_MONTHS.Add(new KeyValuePair<string, string>(i.ToString(), i.ToString()));
            }

            MONTHS = new List<KeyValuePair<string, string>>();

            string[] monthsArr = new string[] {"January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"};

            for (int i = 0; i < monthsArr.Length; i++)
            {
                MONTHS.Add(new KeyValuePair<string, string>((i + 1).ToString(), monthsArr[i]));
            }

        }

    }
}