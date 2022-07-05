using PrjFriendbookWebServer.util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PrjFriendbookWebServer
{
    public partial class index : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            Response.Redirect(Constants.PAGE_LOGIN);
        }

        protected void btnSignUp_Click(object sender, EventArgs e)
        {
            Response.Redirect(Constants.PAGE_SIGN_UP);
        }
    }
}