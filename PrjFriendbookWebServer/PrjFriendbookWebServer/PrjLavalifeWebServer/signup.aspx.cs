using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PrjFriendbookWebServer.util;
using System.Data;

namespace PrjFriendbookWebServer.css
{
    public partial class signup : System.Web.UI.Page
    {
        static FriendbookSQLEntities friendbookSQLEntities;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                friendbookSQLEntities = new FriendbookSQLEntities();

                cboMonth.DataSource = Constants.MONTHS;
                cboMonth.AppendDataBoundItems = true;
                cboMonth.DataTextField = "Value";
                cboMonth.DataValueField = "Key";
                cboMonth.DataBind();

                cboDay.DataSource = Constants.DAYS_OF_MONTHS;
                cboDay.AppendDataBoundItems = true;
                cboDay.DataValueField = "Key";
                cboDay.DataTextField = "Value";
                cboDay.DataBind();

                cboYear.DataSource = Constants.YEARS;
                cboYear.AppendDataBoundItems = true;
                cboYear.DataValueField = "Key";
                cboYear.DataTextField = "Value";
                cboYear.DataBind();

                var interested = friendbookSQLEntities.Interesteds.ToList();

                cboIma.DataSource = interested;
                cboIma.AppendDataBoundItems = true;
                cboIma.DataTextField = "InterestedType";
                cboIma.DataValueField = "RefInterested";
                cboIma.DataBind();
            }
        }

        protected void btnLink_Click(object sender, EventArgs e)
        {
            Response.Redirect(util.Constants.PAGE_LOGIN);
        }

        protected void btnJoinNow_Click(object sender, EventArgs e)
        {
            string fname = txtFname.Text;
            string lname = txtLname.Text;
            string interested = cboIma.Text;
            string month = cboMonth.SelectedItem.Value;
            string day = cboDay.Text;
            string year = cboYear.Text;
            string email = txtEmail.Text;
            string password = txtPassword.Text;
            string gender = radGender.SelectedItem.Value;
            string username = txtUsername.Text;

            if (!string.IsNullOrEmpty(fname) &&
              !string.IsNullOrEmpty(lname) &&
              !string.IsNullOrEmpty(username) &&
              !string.IsNullOrEmpty(gender) &&
              !string.IsNullOrEmpty(interested) &&
              !string.IsNullOrEmpty(month) &&
              !string.IsNullOrEmpty(day) &&
              !string.IsNullOrEmpty(year) &&
              !string.IsNullOrEmpty(email) &&
              !string.IsNullOrEmpty(password))
            {
                bool isExist = (from User u in friendbookSQLEntities.Users
                                where u.username == username
                                select true).FirstOrDefault();

                if (isExist)
                {
                    lblError.Text = "Username already exist";
                    return;
                }

                DateTime dob = new DateTime(int.Parse(year), int.Parse(month), int.Parse(day));

                int userid = CreateUser(fname, lname, username, gender, interested, dob, email, password);

                hidUserId.Value = userid.ToString();

                LoadStep2();

                step1.CssClass = step1.CssClass + " hidden";
                step2.CssClass = step2.CssClass.Replace("hidden", "");
            }
        }

        private int CreateUser(string fname, string lname, string username, string gender, string interested, DateTime dob, string email, string password)
        {
            User user = new User();

            user.firstname = fname;
            user.lastname = lname;
            user.username = username;
            user.gender = gender;
            user.RefInterested = int.Parse(interested);
            user.BirthDate = dob;
            user.email = email;
            user.psw = password;
            user.postalcode = "";
            user.RefBodyType = 0;
            user.RefDrinking = 0;
            user.RefLookingFor = 0;
            user.RefEducation = 0;
            user.RefEthinicity = 0;
            user.RefReligion = 0;
            user.RefSmoking = 0;

            if (gender == "Male")
            {
                user.ImageUrl = "images/ll_profile_male_img.png";
            }
            else
            {
                user.ImageUrl = "images/ll_profile_male_img.png";
            }

            friendbookSQLEntities.Users.Add(user);

            friendbookSQLEntities.SaveChanges();

            return user.RefUser;
        }

        private void LoadStep2()
        {
            cboBodyType.DataSource = friendbookSQLEntities.BodyTypes.ToList();
            cboBodyType.AppendDataBoundItems = true;
            cboBodyType.DataTextField = "BodyTypeName";
            cboBodyType.DataValueField = "RefBodyType";
            cboBodyType.DataBind();

            cboEthnicity.DataSource = friendbookSQLEntities.Ethinicities.ToList();
            cboEthnicity.AppendDataBoundItems = true;
            cboEthnicity.DataTextField = "EthinicityName";
            cboEthnicity.DataValueField = "RefEthinicity";
            cboEthnicity.DataBind();

            cboReligion.DataSource = friendbookSQLEntities.Religions.ToList();
            cboReligion.AppendDataBoundItems = true;
            cboReligion.DataTextField = "ReligionName";
            cboReligion.DataValueField = "RefReligion";
            cboReligion.DataBind();

            cboEducation.DataSource = friendbookSQLEntities.Educations.ToList();
            cboEducation.AppendDataBoundItems = true;
            cboEducation.DataTextField = "EducationType";
            cboEducation.DataValueField = "RefEducation";
            cboEducation.DataBind();

            cboLooking.DataSource = friendbookSQLEntities.LookingFors.ToList();
            cboLooking.AppendDataBoundItems = true;
            cboLooking.DataTextField = "LookingType";
            cboLooking.DataValueField = "RefLookingFor";
            cboLooking.DataBind();

            cboSmoking.DataSource = friendbookSQLEntities.SmokingTypes.ToList();
            cboSmoking.AppendDataBoundItems = true;
            cboSmoking.DataTextField = "SmokingType1";
            cboSmoking.DataValueField = "RefSmoking";
            cboSmoking.DataBind();

            cboDrinking.DataSource = friendbookSQLEntities.DrinkingTypes.ToList();
            cboDrinking.AppendDataBoundItems = true;
            cboDrinking.DataTextField = "DrinkingType1";
            cboDrinking.DataValueField = "RefDrinking";
            cboDrinking.DataBind();

            cboHeight.DataSource = Enumerable.Range(3, 8).Select(h => new { height = h }).ToList();
            cboHeight.AppendDataBoundItems = true;
            cboHeight.DataTextField = "height";
            cboHeight.DataValueField = "height";
            cboHeight.DataBind();

            cboInches.DataSource = Enumerable.Range(0, 11).Select(i => new { inche = i }).ToList();
            cboInches.AppendDataBoundItems = true;
            cboInches.DataTextField = "inche";
            cboInches.DataValueField = "inche";
            cboInches.DataBind();


        }

        protected void btnSubmitStep2_Click(object sender, EventArgs e)
        {
            cboBodyType.SelectedIndex = 1;
        }
    }
}