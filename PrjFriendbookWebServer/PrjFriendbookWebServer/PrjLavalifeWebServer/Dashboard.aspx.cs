using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PrjFriendbookWebServer.util;

namespace PrjFriendbookWebServer
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        string userid;

        static FriendbookSQLEntities friendbookSQLEntities;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session[Constants.SESSION_USERID].ToString() == "-1")
            {
                Response.Redirect(Constants.PAGE_INDEX);
            }

            userid = Session[Constants.SESSION_USERID].ToString();

            if (!IsPostBack)
            {
                friendbookSQLEntities = new FriendbookSQLEntities();

                var user = (from User u in friendbookSQLEntities.Users
                            where u.RefUser.ToString() == userid
                            select u).FirstOrDefault();

                if (user != null)
                {
                    Initialize();
                }
            }
        }

        private void Initialize()
        {
            var users = (from User u in friendbookSQLEntities.Users
                         where u.RefUser.ToString() != userid
                         select u).ToList();

            repeatUserSearchResult.DataSource = users;
            repeatUserSearchResult.DataBind();

            var lookings = (from LookingFor l in friendbookSQLEntities.LookingFors
                            select l).ToList();
            cboLooking.DataSource = lookings;
            cboLooking.AppendDataBoundItems = true;
            cboLooking.DataTextField = "LookingType";
            cboLooking.DataValueField = "RefLookingFor";
            cboLooking.DataBind();

            var maxAge = DateTime.Today.Year - friendbookSQLEntities.Users.Min<User>(u => u.BirthDate.Value.Year);
            var minAge = DateTime.Today.Year - friendbookSQLEntities.Users.Max<User>(u => u.BirthDate.Value.Year);

            var ageRange = Enumerable.Range(minAge, maxAge).Select(a => new { Year = a }).ToList();

            cboAgeFrom.DataSource = ageRange;
            cboAgeFrom.AppendDataBoundItems = true;
            cboAgeFrom.DataTextField = "Year";
            cboAgeFrom.DataValueField = "Year";
            cboAgeFrom.DataBind();


            cboAgeTo.DataSource = ageRange;
            cboAgeTo.AppendDataBoundItems = true;
            cboAgeTo.DataTextField = "Year";
            cboAgeTo.DataValueField = "Year";
            cboAgeTo.DataBind();

            var ethinicities = (from Ethinicity e in friendbookSQLEntities.Ethinicities
                                select e).ToList();

            cboEthinicity.DataSource = ethinicities;
            cboEthinicity.AppendDataBoundItems = true;
            cboEthinicity.DataTextField = "EthinicityName";
            cboEthinicity.DataValueField = "RefEthinicity";
            cboEthinicity.DataBind();

            var religions = (from Religion r in friendbookSQLEntities.Religions
                             select r).ToList();

            cboReligion.DataSource = religions;
            cboReligion.AppendDataBoundItems = true;
            cboReligion.DataTextField = "ReligionName";
            cboReligion.DataValueField = "RefReligion";
            cboReligion.DataBind();

        }

        protected void search_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                string religion = cboReligion.SelectedValue;
                string ethinicity = cboEthinicity.SelectedValue;
                string looking = cboLooking.SelectedValue;
                string gender = radGender.SelectedValue;

                var users = (from User user in friendbookSQLEntities.Users
                             where user.RefUser.ToString() != userid
                             select user).ToList();

                if (!String.IsNullOrEmpty(religion))
                {
                    users = (from User user in users
                             where (user.RefReligion == int.Parse(religion))
                             select user).ToList();
                }

                if (!String.IsNullOrEmpty(ethinicity))
                {
                    users = (from User user in users
                             where (user.RefEducation == int.Parse(ethinicity))
                             select user).ToList();
                }

                if (!string.IsNullOrEmpty(cboAgeFrom.SelectedValue))
                {
                    int fromAge = int.Parse(cboAgeFrom.SelectedValue);

                    users = (from User user in users
                             where (user.BirthDate.Value.Year >= fromAge)
                             select user).ToList();
                }

                if (!String.IsNullOrEmpty(cboAgeTo.SelectedValue))
                {
                    int toAge = int.Parse(cboAgeTo.SelectedValue);

                    users = (from User user in users
                             where (user.BirthDate.Value.Year <= toAge)
                             select user).ToList();
                }

                if (!String.IsNullOrEmpty(looking))
                {
                    users = (from User user in users
                             where (user.RefLookingFor == int.Parse(looking))
                             select user).ToList();
                }

                if (!String.IsNullOrEmpty(gender))
                {
                    users = (from User user in users
                             where (user.gender == gender)
                             select user).ToList();
                }

                repeatUserSearchResult.DataSource = users;
                repeatUserSearchResult.DataBind();
            }
            catch (Exception ex)
            {

            }


        }

        protected void radGender_SelectedIndexChanged(object sender, EventArgs e)
        {
            //litUsername.Text = radGender.SelectedValue;
        }
    }
}
