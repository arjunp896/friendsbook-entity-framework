using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using PrjFriendbookWebServer.util;

namespace PrjFriendbookWebServer
{
    public partial class WebForm2 : System.Web.UI.Page
    {
        static User currentUser;
        static string receiverId;
        static FriendbookSQLEntities friendbookSQLEntities;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session[Constants.SESSION_USERID].ToString() == "-1")
            {
                Response.Redirect(Constants.PAGE_INDEX);
            }

            if (!IsPostBack)
            {
                string currentUsername = Session[Constants.SESSION_USERID].ToString();
                friendbookSQLEntities = new FriendbookSQLEntities();

                currentUser = (from User u in friendbookSQLEntities.Users
                           where (u.RefUser.ToString() == currentUsername)
                           select u).FirstOrDefault();

            }

            if(currentUser != null)
            {
                LoadMessages();
            }

        }

        private void LoadMessages()
        {
            var messages = (from Message m in friendbookSQLEntities.Messages
                            join User u in friendbookSQLEntities.Users on
                            m.RefReceiver equals u.RefUser
                            where m.RefReceiver == currentUser.RefUser
                            select new { Message = m, User = u }).ToList();

            var chatList = from m in messages
                           where (m.Message.RefReceiver != currentUser.RefUser)
                           select new
                           {
                               refuser = m.User.RefUser,
                               username = m.User.username,
                               name = m.User.firstname + " " + m.User.lastname
                           };

            chatList = chatList.GroupBy(g => g.refuser).Select(c => c.FirstOrDefault());

            repeateChatList.DataSource = chatList;

            repeateChatList.DataBind();

        }

        protected void btnChatRow_Click(object sender, EventArgs e)
        {
            LinkButton button = (LinkButton)sender;

            receiverId = (button.FindControl("hidRefUser") as HiddenField).Value;

            LoadDiscussion();
        }

        private void LoadDiscussion()
        {
            var data = (from Message m in friendbookSQLEntities.Messages
                        join User u in friendbookSQLEntities.Users on
                        m.RefReceiver equals u.RefUser
                        orderby m.CreateDate ascending
                        select new
                        {
                            sender = m.RefSender == currentUser.RefUser,
                            refuser = u.RefUser,
                            username = u.username,
                            //name = row["lastname"] + " " + row["lastname"]
                            message = m.Message1,
                            image = u.ImageUrl,
                            createdate = m.CreateDate.Value.ToString("hh:mm tt | MMMM dd")
                        }).ToList();

            repeateMsg.DataSource = data;
            repeateMsg.DataBind();
        }

        protected void btnSend_Click(object sender, EventArgs e)
        {
            string message = txtWriteMsg.Text;

            if (string.IsNullOrEmpty(message))
            {
                return;
            }

            bool result = CreateMessage(message, currentUser.RefUser, receiverId);

            if (result)
            {
                LoadDiscussion();
            }
        }

        private bool CreateMessage(string msg, int currentUser, string receiverId)
        {
            try
            {
                Message message = new Message();

                message.Message1 = msg;
                message.RefReceiver = int.Parse(receiverId);
                message.RefSender = currentUser;

                friendbookSQLEntities.Messages.Add(message);

                int c = friendbookSQLEntities.SaveChanges();

                return c > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}