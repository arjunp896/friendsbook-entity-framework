using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PrjFriendbookWebServer.util;
using System.Data;

namespace PrjFriendbookWebServer
{
    public partial class UserProfile : System.Web.UI.Page
    {
        string username = string.Empty;

        static FriendbookSQLEntities friendbookSQLEntities;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString.Count == 0)
            {
                Response.Redirect(Constants.PAGE_DASHBOARD);
            }

            friendbookSQLEntities = new FriendbookSQLEntities();

            username = Request.QueryString["username"].ToString();

            var user = friendbookSQLEntities.Users.Where(u => u.username == username).FirstOrDefault();

            if (user != null)
            {
                Initialize(user);
            }
        }

        private void Initialize(User user)
        {
            try
            {
                litName.Text = user.firstname + " " + user.lastname;
                litUsername.Text = user.username;
                litGender.Text = user.gender;
                litEmail.Text = user.email;
                litBirthdate.Text = user.BirthDate.Value.ToString("dddd, dd MMMM yyyy");

                litPostalCode.Text = user.postalcode;
                litHeight.Text = user.height;

                litBodyType.Text = friendbookSQLEntities
                    .BodyTypes
                    .Where(bt => bt.RefBodyType == user.RefBodyType)
                    .FirstOrDefault()
                    .BodyTypeName;
                
                litDrinking.Text = friendbookSQLEntities
                    .DrinkingTypes
                    .Where(dt => dt.RefDrinking == user.RefDrinking)
                    .FirstOrDefault().DrinkingType1;

                litEducation.Text = friendbookSQLEntities
                    .Educations
                    .Where(ed => ed.RefEducation == user.RefEducation)
                    .FirstOrDefault().EducationType;

                litEthinicity.Text = friendbookSQLEntities
                    .Ethinicities
                    .Where(et => et.RefEthinicity == user.RefEthinicity)
                    .FirstOrDefault().EthinicityName;

                litLooking.Text = friendbookSQLEntities
                    .LookingFors
                    .Where(l => l.RefLookingFor == user.RefLookingFor)
                    .FirstOrDefault().LookingType;

                litReligion.Text = friendbookSQLEntities
                    .Religions
                    .Where(r => r.RefReligion == user.RefReligion)
                    .FirstOrDefault().ReligionName;

                litSmoking.Text = friendbookSQLEntities
                    .SmokingTypes
                    .Where(s => s.RefSmoking == user.RefSmoking)
                    .FirstOrDefault().SmokingType1;

                litInterested.Text = friendbookSQLEntities
                    .Interesteds
                    .Where(i => i.RefInterested == user.RefInterested)
                    .FirstOrDefault().InterestedType;
            }
            catch (Exception ex)
            {

            }
        }
    }
}