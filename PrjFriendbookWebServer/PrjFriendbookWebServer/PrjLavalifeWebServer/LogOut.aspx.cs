using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PrjFriendbookWebServer.util;
using System.Data.OleDb;

namespace PrjFriendbookWebServer
{
    public partial class LogOut : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Session[Constants.SESSION_USERID] = "-1";

            Response.Redirect(Constants.PAGE_INDEX);

        }

 
    }
}