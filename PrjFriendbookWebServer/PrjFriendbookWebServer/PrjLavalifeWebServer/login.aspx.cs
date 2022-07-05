using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PrjFriendbookWebServer.util;

namespace PrjFriendbookWebServer
{
    public partial class login : System.Web.UI.Page
    {
        static FriendbookSQLEntities friendbookSQLEntities;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                friendbookSQLEntities = new FriendbookSQLEntities();
            }
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            string username = txtEmail.Text;
            string password = txtPassword.Text;

            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                int userid = (from User u in friendbookSQLEntities.Users
                             where u.username == username &&
                                    u.psw == password
                             select u.RefUser).FirstOrDefault();

                if (userid > 0)
                {
                    Session[Constants.SESSION_USERID] = userid;

                    Response.Redirect(Constants.PAGE_DASHBOARD);
                }
                else
                {
                    lblError.Text = "username or password is incorrect!";
                }
            }
        }
    }
}